import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  title: string;
  qty: number;
  priceINR: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
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
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from Firestore when user signs in
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [user]);

  // Save cart to Firestore whenever it changes
  useEffect(() => {
    if (user && items.length >= 0) {
      saveCart();
    }
  }, [items, user]);

  const loadCart = async () => {
    if (!user) return;

    try {
      const cartDoc = await getDoc(doc(db, 'carts', user.uid));
      if (cartDoc.exists()) {
        setItems(cartDoc.data().items || []);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const saveCart = async () => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'carts', user.uid), {
        uid: user.uid,
        items,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to save cart:', error);
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
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
