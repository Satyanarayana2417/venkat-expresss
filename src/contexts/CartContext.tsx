import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  title: string;
  qty: number;
  priceINR: number;
  originalPrice?: number; // Added for discount display
  image: string;
  slug?: string; // Added for wishlist functionality
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  clearUIState: () => void; // New function for logout
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, registerLogoutCallback } = useAuth();
  const CART_STORAGE_KEY = 'venkat-express-cart-guest';
  
  // Initialize cart state (empty by default)
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Register clearUIState callback for logout
  useEffect(() => {
    registerLogoutCallback(() => {
      clearUIState();
    });
  }, []);

  // Load cart based on user authentication state
  useEffect(() => {
    const initializeCart = async () => {
      if (user) {
        // LOGGED IN USER: Load from Firestore subcollection
        await loadCartFromFirestore();
      } else {
        // GUEST USER: Load from localStorage
        loadCartFromLocalStorage();
      }
      setIsInitialized(true);
    };

    initializeCart();
  }, [user]);

  // Save cart whenever it changes (conditional on user state)
  useEffect(() => {
    if (!isInitialized) return; // Don't save during initialization

    if (user) {
      // LOGGED IN: Save to Firestore subcollection
      saveCartToFirestore();
    } else {
      // GUEST: Save to localStorage
      saveCartToLocalStorage();
    }
  }, [items, user, isInitialized]);

  // Load cart from GUEST localStorage
  const loadCartFromLocalStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        console.log('✅ Guest cart loaded from localStorage:', parsedCart.length, 'items');
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load guest cart from localStorage:', error);
      setItems([]);
    }
  };

  // Save cart to GUEST localStorage
  const saveCartToLocalStorage = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save guest cart to localStorage:', error);
    }
  };

  // Load cart from LOGGED IN USER Firestore subcollection
  const loadCartFromFirestore = async () => {
    if (!user) return;

    try {
      // Load from /users/{userId}/cart subcollection
      const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
      const cartSnapshot = await getDocs(cartCollectionRef);
      
      if (!cartSnapshot.empty) {
        // Load cart items from subcollection
        const firestoreItems: CartItem[] = cartSnapshot.docs.map(doc => doc.data() as CartItem);
        setItems(firestoreItems);
        console.log('✅ User cart loaded from Firestore:', firestoreItems.length, 'items');
      } else {
        // No cart in Firestore, check if guest had items to migrate
        const guestCart = localStorage.getItem(CART_STORAGE_KEY);
        if (guestCart) {
          const guestItems: CartItem[] = JSON.parse(guestCart);
          if (guestItems.length > 0) {
            // MIGRATE guest cart to Firestore
            console.log('🔄 Migrating guest cart to user account:', guestItems.length, 'items');
            setItems(guestItems);
            await migrateGuestCartToFirestore(guestItems);
            // Clear guest cart after successful migration
            localStorage.removeItem(CART_STORAGE_KEY);
            console.log('✅ Guest cart migrated and cleared from localStorage');
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Failed to load cart from Firestore:', error);
      setItems([]);
    }
  };

  // Save cart to LOGGED IN USER Firestore subcollection
  const saveCartToFirestore = async () => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
      
      // First, get all existing cart items to delete them
      const existingCartSnapshot = await getDocs(cartCollectionRef);
      existingCartSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Then, add all current cart items
      items.forEach(item => {
        const itemDocRef = doc(cartCollectionRef, item.productId);
        batch.set(itemDocRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log('✅ Cart saved to Firestore subcollection:', items.length, 'items');
    } catch (error) {
      console.error('Failed to save cart to Firestore:', error);
    }
  };

  // Migrate guest cart items to Firestore subcollection
  const migrateGuestCartToFirestore = async (guestItems: CartItem[]) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
      
      guestItems.forEach(item => {
        const itemDocRef = doc(cartCollectionRef, item.productId);
        batch.set(itemDocRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log('✅ Guest cart migrated to Firestore subcollection');
    } catch (error) {
      console.error('Failed to migrate guest cart to Firestore:', error);
      throw error;
    }
  };

  const addToCart = (newItem: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === newItem.productId);
      
      if (existing) {
        toast.success('Updated quantity in cart');
        return prev.map((item) =>
          item.productId === newItem.productId
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      
      toast.success('Added to cart');
      return [...prev, { ...newItem, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  // Clear UI state only (for logout) - does NOT delete Firestore data
  const clearUIState = () => {
    setItems([]);
    setIsInitialized(false);
    console.log('🔒 Cart UI state cleared (logout)');
  };

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.priceINR * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearUIState,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
