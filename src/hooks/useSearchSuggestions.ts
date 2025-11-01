import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/components/ProductCard';

interface UseSearchSuggestionsProps {
  searchQuery: string;
  enabled?: boolean;
  maxResults?: number;
}

interface UseSearchSuggestionsReturn {
  suggestions: Product[];
  loading: boolean;
  error: string | null;
  popularProducts: Product[];
}

export const useSearchSuggestions = ({
  searchQuery,
  enabled = true,
  maxResults = 7
}: UseSearchSuggestionsProps): UseSearchSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch popular products on mount (for showing on focus)
  useEffect(() => {
    const fetchPopularProducts = () => {
      try {
        const productsRef = collection(db, 'products');
        // Set up real-time listener for popular products
        const q = query(
          productsRef, 
          where('inStock', '==', true),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const products = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Product[];
            
            setPopularProducts(products);
          },
          (err) => {
            console.error('Error fetching popular products:', err);
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error('Error setting up popular products listener:', err);
        return () => {};
      }
    };

    const unsubscribe = fetchPopularProducts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
      // Clean up previous listener
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If search query is empty, clear suggestions
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setError(null);
      // Clean up listener if it exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    // Set new debounce timer (300ms delay)
    debounceTimerRef.current = setTimeout(() => {
      setLoading(true);
      setError(null);

      try {
        const productsRef = collection(db, 'products');
        const searchLower = searchQuery.toLowerCase().trim();
        
        // Set up real-time listener for search results
        // Note: For production, consider using Algolia or similar for better search
        const q = query(
          productsRef,
          where('inStock', '==', true),
          orderBy('title'),
          limit(50) // Get more results to filter client-side
        );
        
        // Clean up previous listener if it exists
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

        // Set up new real-time listener
        unsubscribeRef.current = onSnapshot(
          q,
          (snapshot) => {
            const allProducts = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Product[];
            
            // Filter products where title contains search query (case-insensitive)
            const filtered = allProducts.filter(product => 
              product.title.toLowerCase().includes(searchLower)
            ).slice(0, maxResults);
            
            setSuggestions(filtered);
            
            if (filtered.length === 0) {
              setError('No products found');
            } else {
              setError(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Search error:', err);
            setError(err.message || 'Failed to search products');
            setSuggestions([]);
            setLoading(false);
          }
        );
      } catch (err: any) {
        console.error('Search setup error:', err);
        setError(err.message || 'Failed to search products');
        setSuggestions([]);
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Don't unsubscribe here - let it continue listening
      // It will be cleaned up when component unmounts or query changes
    };
  }, [searchQuery, enabled, maxResults]);

  // Cleanup all listeners on component unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  return {
    suggestions,
    loading,
    error,
    popularProducts
  };
};
