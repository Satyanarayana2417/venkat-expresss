# 💳 UPI Payment - Quick Reference

## 🚀 Quick Start

### For Users
1. Add items to cart
2. Click "Proceed to Checkout"
3. Scan QR code with UPI app
4. Complete payment
5. Enter Transaction ID
6. Click "Confirm Order"

### For Developers
```bash
# Files to check:
src/pages/Payment.tsx        # Main payment page
src/lib/orderUtils.ts         # Utility functions
src/pages/Cart.tsx            # Updated checkout button
src/App.tsx                   # Added payment route
```

---

## 🔑 Key Information

### UPI Payment Details
- **UPI ID**: `9121055512@ybl`
- **Payee Name**: `satyanarayana`
- **Currency**: INR (Indian Rupees)

### Order ID Format
```
ORD-YYYYMMDD-XXXXX
Example: ORD-20251016-45678
```

### Payment Status
- Initial: `Payment Verification Pending`
- After Admin Verification: `Confirmed` or `Cancelled`

---

## 📱 User Journey

```
Cart → Login Check → Payment Page → Scan QR → 
Complete Payment → Enter Transaction ID → 
Confirm Order → Success → Order History
```

---

## 🗄️ Firestore Order Document

```typescript
{
  orderId: "ORD-20251016-45678",
  customer: "John Doe",
  email: "john@example.com",
  userId: "user_uid",
  items: [...],
  total: 2500.00,
  upiTransactionId: "123456789ABC",
  orderStatus: "Payment Verification Pending",
  paymentStatus: "Pending Verification",
  paymentMethod: "UPI",
  date: "2025-10-16",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🔧 Quick Functions

### Generate Order ID
```typescript
import { generateOrderId } from '@/lib/orderUtils';
const orderId = generateOrderId();
// Returns: "ORD-20251016-45678"
```

### Create UPI String
```typescript
import { createUPIString } from '@/lib/orderUtils';
const upiString = createUPIString(orderId, amount);
// Returns: "upi://pay?pa=9121055512@ybl&pn=..."
```

### Save Order
```typescript
import { saveOrder } from '@/lib/orderUtils';
await saveOrder(orderData);
// Saves to Firestore 'orders' collection
```

---

## ⚡ Quick Tests

### Test 1: Basic Flow
```bash
# 1. Login to website
# 2. Add any product to cart
# 3. Go to cart
# 4. Click "Proceed to Checkout"
# Expected: Navigate to /payment
```

### Test 2: QR Code
```bash
# 1. On payment page, scan QR code
# 2. Open in UPI app
# Expected: 
# - Amount is locked
# - Payee is "satyanarayana"
# - UPI ID is "9121055512@ybl"
```

### Test 3: Order Confirmation
```bash
# 1. Enter any transaction ID (e.g., "TEST123")
# 2. Click "Confirm Order"
# Expected:
# - Success screen appears
# - Cart is cleared
# - Order saved to Firestore
# - Redirect to order history
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| QR code not showing | Check console for UPI string generation |
| Can't navigate to payment | Ensure user is logged in |
| Order not saving | Check Firestore security rules |
| Cart not clearing | Verify clearCart() is called |
| Amount is editable in UPI | Check UPI string format |

---

## 📋 Quick Checklist

### Before Deployment
- [ ] Test QR code scanning
- [ ] Test order save to Firestore
- [ ] Test cart clearing
- [ ] Test on mobile device
- [ ] Update Firestore security rules
- [ ] Document admin verification process

### After Deployment
- [ ] Monitor Firestore for new orders
- [ ] Verify first transaction
- [ ] Check for console errors
- [ ] Test on different devices
- [ ] Update admin dashboard

---

## 🎯 Important Notes

⚠️ **Amount Locking**: The payment amount is embedded in the QR code and cannot be changed by the user.

⚠️ **Manual Verification**: Admin must manually verify UPI Transaction IDs until automatic verification is implemented.

⚠️ **Testing**: Use dummy transaction IDs for testing. Real payments should be verified in UPI app/bank statement.

⚠️ **Security**: Payment page is a protected route - requires authentication.

---

## 📞 Quick Links

- **Full Documentation**: `PAYMENT_INTEGRATION_COMPLETE.md`
- **Payment Page**: `src/pages/Payment.tsx`
- **Utils**: `src/lib/orderUtils.ts`
- **Firestore Console**: [Firebase Console](https://console.firebase.google.com)

---

**Quick Access Routes**:
- Cart: `/cart`
- Payment: `/payment`
- Order History: `/history`
- Admin Orders: `/admin/orders`
