import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface WishlistItem {
  productId: string;
  title: string;
  priceINR: number;
  image: string;
  slug: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  clearUIState: () => void; // New function for logout
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, registerLogoutCallback } = useAuth();
  const WISHLIST_STORAGE_KEY = 'venkat-express-wishlist-guest';
  
  // Initialize wishlist state (empty by default)
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Register clearUIState callback for logout
  useEffect(() => {
    registerLogoutCallback(() => {
      clearUIState();
    });
  }, []);

  // Load wishlist based on user authentication state
  useEffect(() => {
    const initializeWishlist = async () => {
      if (user) {
        // LOGGED IN USER: Load from Firestore subcollection
        await loadWishlistFromFirestore();
      } else {
        // GUEST USER: Load from localStorage
        loadWishlistFromLocalStorage();
      }
      setIsInitialized(true);
    };

    initializeWishlist();
  }, [user]);

  // Save wishlist whenever it changes (conditional on user state)
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initialization

    if (user) {
      // LOGGED IN: Save to Firestore subcollection
      saveWishlistToFirestore();
    } else {
      // GUEST: Save to localStorage
      saveWishlistToLocalStorage();
    }
  }, [items, user, isInitialized]);

  // Load wishlist from GUEST localStorage
  const loadWishlistFromLocalStorage = () => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        const parsedWishlist = JSON.parse(savedWishlist);
        setItems(parsedWishlist);
        console.log('✅ Guest wishlist loaded from localStorage:', parsedWishlist.length, 'items');
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load guest wishlist from localStorage:', error);
      setItems([]);
    }
  };

  // Save wishlist to GUEST localStorage
  const saveWishlistToLocalStorage = () => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save guest wishlist to localStorage:', error);
    }
  };

  // Load wishlist from LOGGED IN USER Firestore subcollection
  const loadWishlistFromFirestore = async () => {
    if (!user) return;

    try {
      // Load from /users/{userId}/wishlist subcollection
      const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
      const wishlistSnapshot = await getDocs(wishlistCollectionRef);
      
      if (!wishlistSnapshot.empty) {
        // Load wishlist items from subcollection
        const firestoreItems: WishlistItem[] = wishlistSnapshot.docs.map(doc => doc.data() as WishlistItem);
        setItems(firestoreItems);
        console.log('✅ User wishlist loaded from Firestore:', firestoreItems.length, 'items');
      } else {
        // No wishlist in Firestore, check if guest had items to migrate
        const guestWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (guestWishlist) {
          const guestItems: WishlistItem[] = JSON.parse(guestWishlist);
          if (guestItems.length > 0) {
            // MIGRATE guest wishlist to Firestore
            console.log('🔄 Migrating guest wishlist to user account:', guestItems.length, 'items');
            setItems(guestItems);
            await migrateGuestWishlistToFirestore(guestItems);
            // Clear guest wishlist after successful migration
            localStorage.removeItem(WISHLIST_STORAGE_KEY);
            console.log('✅ Guest wishlist migrated and cleared from localStorage');
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist from Firestore:', error);
      setItems([]);
    }
  };

  // Save wishlist to LOGGED IN USER Firestore subcollection
  const saveWishlistToFirestore = async () => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
      
      // First, get all existing wishlist items to delete them
      const existingWishlistSnapshot = await getDocs(wishlistCollectionRef);
      existingWishlistSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Then, add all current wishlist items
      items.forEach(item => {
        const itemDocRef = doc(wishlistCollectionRef, item.productId);
        batch.set(itemDocRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log('✅ Wishlist saved to Firestore subcollection:', items.length, 'items');
    } catch (error) {
      console.error('Failed to save wishlist to Firestore:', error);
    }
  };

  // Migrate guest wishlist items to Firestore subcollection
  const migrateGuestWishlistToFirestore = async (guestItems: WishlistItem[]) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      const wishlistCollectionRef = collection(db, 'users', user.uid, 'wishlist');
      
      guestItems.forEach(item => {
        const itemDocRef = doc(wishlistCollectionRef, item.productId);
        batch.set(itemDocRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log('✅ Guest wishlist migrated to Firestore subcollection');
    } catch (error) {
      console.error('Failed to migrate guest wishlist to Firestore:', error);
      throw error;
    }
  };

  const addToWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    const existingItem = items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      toast.info('Already in wishlist');
      return;
    }

    const newItem: WishlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };

    setItems(prev => [...prev, newItem]);
    toast.success('Added to wishlist');
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.productId === productId);
  };

  const toggleWishlist = (item: Omit<WishlistItem, 'addedAt'>) => {
    if (isInWishlist(item.productId)) {
      removeFromWishlist(item.productId);
    } else {
      addToWishlist(item);
    }
  };

  // Clear UI state only (for logout) - does NOT delete Firestore data
  const clearUIState = () => {
    setItems([]);
    setIsInitialized(false);
    console.log('🔒 Wishlist UI state cleared (logout)');
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearUIState,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
