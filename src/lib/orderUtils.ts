import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { CartItem } from '@/contexts/CartContext';

/**
 * Generates a unique order ID in the format: ORD-YYYYMMDD-XXXXX
 * Example: ORD-20251016-45678
 */
export const generateOrderId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomNum = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
  
  return `ORD-${year}${month}${day}-${randomNum}`;
};

/**
 * Creates a UPI payment string with dynamic amount and order details
 * @param orderId - The generated order ID
 * @param amount - The cart total amount
 * @returns UPI payment URL string
 */
export const createUPIString = (orderId: string, amount: number): string => {
  const payeeVPA = '9121055512@ybl';
  const payeeName = 'satyanarayana';
  const currency = 'INR';
  
  // Create transaction note with order details
  const transactionNote = `Payment for Order #${orderId} from Venkat Express`;
  
  // URL encode the transaction note to handle spaces and special characters
  const encodedNote = encodeURIComponent(transactionNote);
  
  // Construct the UPI payment string
  const upiString = `upi://pay?pa=${payeeVPA}&pn=${payeeName}&am=${amount.toFixed(2)}&cu=${currency}&tn=${encodedNote}`;
  
  return upiString;
};

/**
 * Saves order to Firestore with payment verification pending status
 * @param orderData - Complete order information
 * @returns Promise with the created order ID
 */
export interface OrderData {
  orderId: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone?: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax?: number;
  shippingCost?: number;
  upiTransactionId: string;
  paymentScreenshotUrl?: string; // Payment screenshot URL from Cloudinary
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  billingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  date: string;
  createdAt: any;
  updatedAt: any;
}

export const saveOrder = async (orderData: Partial<OrderData>): Promise<string> => {
  try {
    const ordersRef = collection(db, 'orders');
    
    const orderDoc = {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(ordersRef, orderDoc);
    
    console.log('✅ Order saved to Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving order to Firestore:', error);
    throw error;
  }
};

/**
 * Formats currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};
