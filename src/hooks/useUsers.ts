import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, getDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserData {
  id: string;
  email: string;
  displayName?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  photoURL?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UserOrder {
  id: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

export interface WishlistItem {
  productId: string;
  title: string;
  priceINR: number;
  image: string;
  slug: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      setUsers(fetchedUsers);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: 'customer' | 'admin') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      await fetchUsers();
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const getUserDetails = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      // Fetch user's wishlist
      const wishlistRef = doc(db, 'wishlists', userId);
      const wishlistDoc = await getDoc(wishlistRef);
      const wishlist = wishlistDoc.exists() ? wishlistDoc.data().items || [] : [];

      // Note: Orders would need to be implemented in your orders collection
      // This is a placeholder structure
      const orders: UserOrder[] = [];

      return {
        user: { id: userDoc.id, ...userDoc.data() } as UserData,
        orders,
        wishlist: wishlist as WishlistItem[]
      };
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    users,
    loading,
    error,
    updateUserRole,
    getUserDetails,
    refetch: fetchUsers
  };
};
