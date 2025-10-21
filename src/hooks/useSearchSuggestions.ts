import { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
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

  // Fetch popular products on mount (for showing on focus)
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        // Get products with 'featured' tag or recent products
        const q = query(
          productsRef, 
          where('inStock', '==', true),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        setPopularProducts(products);
      } catch (err) {
        console.error('Error fetching popular products:', err);
      }
    };

    fetchPopularProducts();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!enabled) {
      setSuggestions([]);
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
      return;
    }

    // Set new debounce timer (300ms delay)
    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const productsRef = collection(db, 'products');
        const searchLower = searchQuery.toLowerCase().trim();
        
        // Fetch all products and filter client-side for better search
        // Note: For production, consider using Algolia or similar for better search
        const q = query(
          productsRef,
          where('inStock', '==', true),
          orderBy('title'),
          limit(50) // Get more results to filter client-side
        );
        
        const snapshot = await getDocs(q);
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
        }
      } catch (err: any) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to search products');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, enabled, maxResults]);

  return {
    suggestions,
    loading,
    error,
    popularProducts
  };
};
