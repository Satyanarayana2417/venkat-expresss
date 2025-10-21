import { useEffect, useState } from 'react';
import { createAllUPIIntents, UPIPaymentParams } from '@/lib/upiIntents';

interface UPIPaymentButtonsProps {
  orderId: string;
  amount: number;
  payeeVPA?: string;
  payeeName?: string;
}

/**
 * UPI Payment Buttons Component (Mobile Only)
 * Displays PhonePe, Google Pay, and Paytm payment buttons
 * Opens respective UPI apps with pre-filled payment details
 */
export const UPIPaymentButtons = ({
  orderId,
  amount,
  payeeVPA = '9121055512@ybl',
  payeeName = 'satyanarayana',
}: UPIPaymentButtonsProps) => {
  const [upiIntents, setUpiIntents] = useState<{
    phonepe: string;
    googlepay: string;
    paytm: string;
  } | null>(null);

  useEffect(() => {
    // Generate UPI intent URLs when component mounts
    if (orderId && amount > 0) {
      const params: UPIPaymentParams = {
        payeeVPA,
        payeeName,
        amount,
        orderId,
        currency: 'INR',
      };

      const intents = createAllUPIIntents(params);
      setUpiIntents({
        phonepe: intents.phonepe,
        googlepay: intents.googlepay,
        paytm: intents.paytm,
      });

      console.log('🔗 UPI Intents Generated:', intents);
    }
  }, [orderId, amount, payeeVPA, payeeName]);

  // Don't render if intents not ready
  if (!upiIntents) {
    return null;
  }

  return (
    <div className="md:hidden"> {/* Mobile only */}
      {/* Section Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gray-300"></div>
        <span className="text-sm font-medium text-gray-600">Or Pay Directly Via</span>
        <div className="h-px flex-1 bg-gray-300"></div>
      </div>

      {/* UPI App Buttons */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* PhonePe Button */}
        <a
          href={upiIntents.phonepe}
          className="flex flex-col items-center gap-2 group"
          onClick={(e) => {
            // Prevent default and use our custom handler
            e.preventDefault();
            window.location.href = upiIntents.phonepe;
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 overflow-hidden">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPUVWp0JP93R7YLROLXiZFOu6VaHZdo_xb8A&s" 
              alt="PhonePe"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-gray-700">PhonePe</span>
        </a>

        {/* Google Pay Button */}
        <a
          href={upiIntents.googlepay}
          className="flex flex-col items-center gap-2 group"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = upiIntents.googlepay;
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg border-2 border-gray-200 flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 overflow-hidden">
            <img 
              src="https://images.hindustantimes.com/tech/img/2020/11/05/1600x900/image_-_2020-11-05T095740.083_1604550459365_1604550465218_1604550598928.jpg" 
              alt="Google Pay"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-gray-700">Google Pay</span>
        </a>

        {/* Paytm Button */}
        <a
          href={upiIntents.paytm}
          className="flex flex-col items-center gap-2 group"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = upiIntents.paytm;
          }}
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 group-active:scale-95 overflow-hidden">
            <img 
              src="https://images.icon-icons.com/730/PNG/512/paytm_icon-icons.com_62778.png" 
              alt="Paytm"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-medium text-gray-700">Paytm</span>
        </a>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-center text-gray-500 mb-4">
        Tap any button to open the app and complete payment
      </p>

      {/* Important Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <p className="text-xs text-amber-800 font-medium">
          💡 After payment, return here to enter your Transaction ID for order confirmation
        </p>
      </div>
    </div>
  );
};
