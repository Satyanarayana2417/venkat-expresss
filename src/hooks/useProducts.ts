import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/components/ProductCard';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      
      // Set up real-time listener with onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[];
          
          setProducts(fetchedProducts);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Error listening to products:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (err: any) {
      setError(err.message);
      console.error('Error setting up products listener:', err);
      setLoading(false);
      return () => {}; // Return empty cleanup function if setup fails
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Call fetchProducts and get the unsubscribe function
    fetchProducts().then((unsub) => {
      unsubscribe = unsub;
    });

    // Cleanup: unsubscribe from the listener when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const addProduct = async (productData: Partial<Omit<Product, 'id'>>) => {
    try {
      const productsRef = collection(db, 'products');
      await addDoc(productsRef, {
        serviceType: 'purchaseable', // default value
        weightKg: 0,
        dimensionsCm: { length: 0, width: 0, height: 0 },
        ...productData,
        createdAt: new Date().toISOString(),
      });
      // No need to manually fetch - the real-time listener will update products state automatically
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: new Date().toISOString(),
      });
      // No need to manually fetch - the real-time listener will update products state automatically
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      // No need to manually fetch - the real-time listener will update products state automatically
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
