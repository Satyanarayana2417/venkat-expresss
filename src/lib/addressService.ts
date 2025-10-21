import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Address {
  id?: string;
  fullName: string;
  mobileNumber: string;
  alternateMobile?: string;
  flatBuilding: string;
  areaStreet: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  type: 'home' | 'work';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Get all addresses for a user
 */
export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const querySnapshot = await getDocs(addressesRef);
    
    const addresses: Address[] = [];
    querySnapshot.forEach((doc) => {
      addresses.push({
        id: doc.id,
        ...doc.data()
      } as Address);
    });
    
    return addresses;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

/**
 * Get a specific address by type (home or work)
 */
export const getAddressByType = async (userId: string, type: 'home' | 'work'): Promise<Address | null> => {
  try {
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const q = query(addressesRef, where('type', '==', type));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Address;
  } catch (error) {
    console.error('Error fetching address by type:', error);
    throw error;
  }
};

/**
 * Get a single address by ID
 */
export const getAddressById = async (userId: string, addressId: string): Promise<Address | null> => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    const addressDoc = await getDoc(addressRef);
    
    if (!addressDoc.exists()) {
      return null;
    }
    
    return {
      id: addressDoc.id,
      ...addressDoc.data()
    } as Address;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};

/**
 * Save a new address or update existing address of the same type
 */
export const saveAddress = async (userId: string, address: Address): Promise<string> => {
  try {
    // Check if address of this type already exists
    const existingAddress = await getAddressByType(userId, address.type);
    
    const addressData = {
      ...address,
      updatedAt: new Date()
    };
    
    if (existingAddress && existingAddress.id) {
      // Update existing address
      const addressRef = doc(db, 'users', userId, 'addresses', existingAddress.id);
      await updateDoc(addressRef, addressData);
      return existingAddress.id;
    } else {
      // Create new address
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const newAddressRef = doc(addressesRef);
      await setDoc(newAddressRef, {
        ...addressData,
        createdAt: new Date()
      });
      return newAddressRef.id;
    }
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (userId: string, addressId: string, address: Partial<Address>): Promise<void> => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await updateDoc(addressRef, {
      ...address,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (userId: string, addressId: string): Promise<void> => {
  try {
    const addressRef = doc(db, 'users', userId, 'addresses', addressId);
    await deleteDoc(addressRef);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};
