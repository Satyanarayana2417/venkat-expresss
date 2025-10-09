import { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expirationDate: string;
  isActive: boolean;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  createdAt: string;
}

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  // Real-time listener for coupons with proper auth check
  useEffect(() => {
    setLoading(true);
    setError(null);
    setAuthError(false);

    // Wait for authentication to complete before fetching data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated - proceed with real-time listener
        const couponsRef = collection(db, 'coupons');
        
        // Query with sorting by creation date (newest first)
        const q = query(couponsRef, orderBy('createdAt', 'desc'));

        // Set up real-time listener with onSnapshot
        const unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const fetchedCoupons: Coupon[] = [];
            
            snapshot.forEach((doc) => {
              fetchedCoupons.push({
                id: doc.id,
                ...doc.data()
              } as Coupon);
            });
            
            setCoupons(fetchedCoupons);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error fetching coupons:', err);
            setError(err.message);
            setLoading(false);
          }
        );

        // Cleanup snapshot listener when auth changes or component unmounts
        return () => {
          unsubscribeSnapshot();
        };
      } else {
        // No user authenticated
        setAuthError(true);
        setLoading(false);
        console.warn('User not authenticated - cannot fetch coupons');
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const addCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => {
    try {
      const couponsRef = collection(db, 'coupons');
      await addDoc(couponsRef, {
        ...couponData,
        usedCount: 0,
        createdAt: serverTimestamp(),
      });
      // No need to manually refetch - onSnapshot will handle it automatically
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    try {
      const couponRef = doc(db, 'coupons', id);
      await updateDoc(couponRef, couponData);
      // No need to manually refetch - onSnapshot will handle it automatically
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const couponRef = doc(db, 'coupons', id);
      await deleteDoc(couponRef);
      // No need to manually refetch - onSnapshot will handle it automatically
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const validateCoupon = (code: string, orderTotal: number): { valid: boolean; discount: number; message: string } => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: 'This coupon is no longer active' };
    }

    const now = new Date();
    const expDate = new Date(coupon.expirationDate);
    if (now > expDate) {
      return { valid: false, discount: 0, message: 'This coupon has expired' };
    }

    if (coupon.minPurchaseAmount && orderTotal < coupon.minPurchaseAmount) {
      return { 
        valid: false, 
        discount: 0, 
        message: `Minimum purchase of ₹${coupon.minPurchaseAmount} required` 
      };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'This coupon has reached its usage limit' };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (orderTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return { 
      valid: true, 
      discount: Math.min(discount, orderTotal), 
      message: 'Coupon applied successfully' 
    };
  };

  return {
    coupons,
    loading,
    error,
    authError,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
  };
};
