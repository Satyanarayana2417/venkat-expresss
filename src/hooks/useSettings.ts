import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export interface StoreSettings {
  // Store Details
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  
  // Tax & Pricing
  taxRate: number;
  currency: string;
  
  // Shipping
  shippingCost: number;
  freeShippingThreshold: number;
  
  // Site Status
  maintenanceMode: boolean;
  maintenanceMessage: string;
  
  // Notifications
  orderNotificationsEnabled: boolean;
  lowStockThreshold: number;
  
  // Other
  lastUpdated?: string;
}

const defaultSettings: StoreSettings = {
  storeName: 'Venkat Express',
  storeDescription: 'Your trusted courier and shopping partner',
  contactEmail: 'contact@venkatexpress.com',
  contactPhone: '+91 1234567890',
  storeAddress: '123 Main Street, City, State, PIN',
  taxRate: 18,
  currency: 'INR',
  shippingCost: 50,
  freeShippingThreshold: 500,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently undergoing maintenance. Please check back soon.',
  orderNotificationsEnabled: true,
  lowStockThreshold: 10,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize settings document if it doesn't exist
  const initializeSettings = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      const settingsSnap = await getDoc(settingsRef);
      
      if (!settingsSnap.exists()) {
        await setDoc(settingsRef, {
          ...defaultSettings,
          lastUpdated: new Date().toISOString()
        });
        console.log('Settings document initialized with default values');
      }
    } catch (err) {
      console.error('Error initializing settings:', err);
    }
  };

  // Real-time listener for settings with proper auth check
  useEffect(() => {
    setLoading(true);
    setError(null);
    setAuthError(false);

    // Wait for authentication to complete before fetching data
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated - proceed with real-time listener
        const settingsRef = doc(db, 'settings', 'global');

        // Initialize settings if needed
        initializeSettings();

        // Set up real-time listener with onSnapshot
        const unsubscribeSnapshot = onSnapshot(
          settingsRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data() as StoreSettings;
              setSettings(data);
            } else {
              // If document doesn't exist, use default settings
              setSettings(defaultSettings);
            }
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error fetching settings:', err);
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
        console.warn('User not authenticated - cannot fetch settings');
      }
    });

    // Cleanup auth listener on unmount
    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Update a single setting field instantly
  const updateSetting = async <K extends keyof StoreSettings>(
    field: K,
    value: StoreSettings[K]
  ) => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      await updateDoc(settingsRef, {
        [field]: value,
        lastUpdated: new Date().toISOString()
      });
      // No need to manually update state - onSnapshot will handle it automatically
    } catch (err: any) {
      console.error('Error updating setting:', err);
      throw new Error(err.message);
    }
  };

  // Update multiple settings at once
  const updateSettings = async (updates: Partial<StoreSettings>) => {
    try {
      const settingsRef = doc(db, 'settings', 'global');
      await updateDoc(settingsRef, {
        ...updates,
        lastUpdated: new Date().toISOString()
      });
      // No need to manually update state - onSnapshot will handle it automatically
    } catch (err: any) {
      console.error('Error updating settings:', err);
      throw new Error(err.message);
    }
  };

  return {
    settings,
    loading,
    authError,
    error,
    updateSetting,
    updateSettings
  };
};
