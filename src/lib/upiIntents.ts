/**
 * UPI Payment Intent Utilities
 * Generates app-specific UPI deep links for PhonePe, Google Pay, and Paytm
 */

export interface UPIPaymentParams {
  payeeVPA: string;      // UPI ID (e.g., 9121055512@ybl)
  payeeName: string;     // Payee name
  amount: number;        // Payment amount
  orderId: string;       // Order ID for transaction note
  currency?: string;     // Currency code (default: INR)
}

/**
 * Creates a generic UPI intent URL
 * Works with any UPI app installed on the device
 */
export const createGenericUPIIntent = (params: UPIPaymentParams): string => {
  const { payeeVPA, payeeName, amount, orderId, currency = 'INR' } = params;
  
  // Create transaction note
  const transactionNote = `Payment for Order #${orderId} - Venkat Express`;
  const encodedNote = encodeURIComponent(transactionNote);
  
  // Generic UPI intent URL
  return `upi://pay?pa=${payeeVPA}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=${currency}&tn=${encodedNote}`;
};

/**
 * Creates PhonePe-specific UPI intent URL
 * Uses PhonePe's deep link scheme for better user experience
 */
export const createPhonePeIntent = (params: UPIPaymentParams): string => {
  const { payeeVPA, payeeName, amount, orderId, currency = 'INR' } = params;
  
  const transactionNote = `Payment for Order #${orderId} - Venkat Express`;
  const encodedNote = encodeURIComponent(transactionNote);
  
  // PhonePe deep link format
  // Fallback to generic UPI if PhonePe app not installed
  return `phonepe://pay?pa=${payeeVPA}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=${currency}&tn=${encodedNote}`;
};

/**
 * Creates Google Pay (GPay) specific UPI intent URL
 * Uses Google Pay's deep link scheme
 */
export const createGooglePayIntent = (params: UPIPaymentParams): string => {
  const { payeeVPA, payeeName, amount, orderId, currency = 'INR' } = params;
  
  const transactionNote = `Payment for Order #${orderId} - Venkat Express`;
  const encodedNote = encodeURIComponent(transactionNote);
  
  // Google Pay deep link format
  // Uses tez:// or gpay:// scheme
  return `tez://upi/pay?pa=${payeeVPA}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=${currency}&tn=${encodedNote}`;
};

/**
 * Creates Paytm-specific UPI intent URL
 * Uses Paytm's deep link scheme
 */
export const createPaytmIntent = (params: UPIPaymentParams): string => {
  const { payeeVPA, payeeName, amount, orderId, currency = 'INR' } = params;
  
  const transactionNote = `Payment for Order #${orderId} - Venkat Express`;
  const encodedNote = encodeURIComponent(transactionNote);
  
  // Paytm deep link format
  return `paytmmp://pay?pa=${payeeVPA}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=${currency}&tn=${encodedNote}`;
};

/**
 * Creates intent URLs for all supported UPI apps
 * Returns an object with app-specific URLs
 */
export const createAllUPIIntents = (params: UPIPaymentParams) => {
  return {
    generic: createGenericUPIIntent(params),
    phonepe: createPhonePeIntent(params),
    googlepay: createGooglePayIntent(params),
    paytm: createPaytmIntent(params),
  };
};

/**
 * Checks if device is mobile
 * Used to determine if UPI payment buttons should be shown
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Opens UPI app with fallback handling
 * Tries app-specific URL first, falls back to generic UPI if it fails
 */
export const openUPIApp = (appSpecificUrl: string, genericUrl: string) => {
  // Try to open app-specific URL
  window.location.href = appSpecificUrl;
  
  // Fallback to generic UPI after a short delay if app not installed
  setTimeout(() => {
    // Check if we're still on the same page (app didn't open)
    if (document.hasFocus()) {
      window.location.href = genericUrl;
    }
  }, 500);
};
