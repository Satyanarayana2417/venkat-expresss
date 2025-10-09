import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Load wishlist from Firestore when user signs in
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      // Load from localStorage for guest users
      const guestWishlist = localStorage.getItem('guestWishlist');
      if (guestWishlist) {
        setItems(JSON.parse(guestWishlist));
      } else {
        setItems([]);
      }
    }
  }, [user]);

  // Save wishlist whenever it changes
  useEffect(() => {
    if (user) {
      saveWishlist();
    } else {
      // Save to localStorage for guest users
      localStorage.setItem('guestWishlist', JSON.stringify(items));
    }
  }, [items, user]);

  const loadWishlist = async () => {
    if (!user) return;

    try {
      const wishlistDoc = await getDoc(doc(db, 'wishlists', user.uid));
      if (wishlistDoc.exists()) {
        setItems(wishlistDoc.data().items || []);
      } else {
        // Migrate guest wishlist to user account
        const guestWishlist = localStorage.getItem('guestWishlist');
        if (guestWishlist) {
          const guestItems = JSON.parse(guestWishlist);
          setItems(guestItems);
          localStorage.removeItem('guestWishlist');
        }
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const saveWishlist = async () => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'wishlists', user.uid), {
        uid: user.uid,
        items,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to save wishlist:', error);
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

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
