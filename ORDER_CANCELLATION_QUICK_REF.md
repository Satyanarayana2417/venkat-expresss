# Order Cancellation - Quick Reference Guide

## 🚀 Quick Start

### For Customers:
1. Go to "My Orders" page
2. Find an order with status "Pending" or "Processing"
3. Click the red "Cancel Order" button
4. Confirm in the warning modal
5. Select a reason for cancellation
6. Click "Continue"
7. See "Your cancellation request is in pending" message
8. Wait for admin to review

### For Admins:
1. Go to Admin Dashboard → Orders
2. Filter by "Cancellation Pending" status
3. Click "Manage Tracking" on the order
4. Review the cancellation reason
5. Click "Approve Cancellation" OR "Reject & Resume Order"
6. Customer sees updated status instantly

---

## 📂 New Files Created

```
src/components/CancelOrderModal.tsx          - Confirmation modal
src/pages/CancelOrder.tsx                    - Cancellation request page
src/pages/CancelOrderPending.tsx             - Success confirmation page
FIRESTORE_RULES_ORDER_CANCELLATION.md        - Security rules guide
ORDER_CANCELLATION_IMPLEMENTATION_COMPLETE.md - Full implementation docs
```

---

## 🔧 Modified Files

```
src/components/RealtimeOrderCard.tsx         - Added cancel button
src/pages/AccountOrders.tsx                  - Updated Order type
src/pages/admin/AdminOrders.tsx              - Added cancellation-pending status
src/pages/admin/AdminOrderDetail.tsx         - Added approval/rejection UI
src/components/OrderTrackingTimeline.tsx     - Added cancellation-pending status
src/App.tsx                                  - Added new routes
```

---

## 🛣️ New Routes

```javascript
/order/cancel/:orderId        → CancelOrder page
/order/cancel/pending         → CancelOrderPending page
```

---

## 📝 Cancellation Reasons (Exact)

1. I'm worried about the ratings/reviews
2. I want to change the payment option
3. Price of the product has now decreased
4. My reasons are not listed here
5. I was hoping for a shorter delivery time
6. I want to change the contact details
7. I want to change the delivery address
8. I want to change the delivery date

---

## 🎯 Order Status Flow

```
Customer Side:
pending/processing → [Cancel Request] → cancellation-pending → [Admin Action] → cancelled OR back to previous status

Admin Side:
cancellation-pending → [Approve] → cancelled
cancellation-pending → [Reject] → processing (or previous status)
```

---

## 🔐 Firestore Rules (Critical)

**MUST Deploy These Rules to Firebase Console:**

```javascript
function onlyUpdatingCancellationFields() {
  let allowedFields = ['status', 'cancellationReason', 
                       'cancellationRequestedAt', 'previousStatus'];
  let updatedKeys = request.resource.data.diff(resource.data).affectedKeys();
  
  return updatedKeys.hasOnly(allowedFields) &&
         request.resource.data.status == 'cancellation-pending';
}

match /orders/{orderId} {
  allow update: if request.auth != null && (
    isAdmin() ||
    (request.auth.uid == resource.data.userId && 
     request.resource.data.userId == resource.data.userId &&
     onlyUpdatingCancellationFields())
  );
}
```

**Deploy**: Firebase Console → Firestore → Rules → Publish

---

## 📊 New Order Fields

```javascript
{
  status: 'cancellation-pending',          // Updated status
  cancellationReason: string,              // Customer's reason
  cancellationRequestedAt: Timestamp,      // Request timestamp
  previousStatus: string,                  // Original status (for rejection)
  cancellationApprovedAt?: Timestamp,      // When approved
  cancellationApprovedBy?: string,         // Who approved
  cancellationRejectedAt?: Timestamp,      // When rejected
  cancellationRejectedBy?: string,         // Who rejected
}
```

---

## ✅ Testing Checklist

### Customer Flow:
- [ ] Cancel button shows for pending/processing orders
- [ ] Cancel button hidden for delivered/shipped/cancelled
- [ ] Modal shows warning message
- [ ] Cancellation page loads with order details
- [ ] All 8 reasons are selectable
- [ ] Submission updates status to cancellation-pending
- [ ] Confirmation page displays
- [ ] Real-time status update in My Orders

### Admin Flow:
- [ ] Filter shows cancellation-pending orders
- [ ] Order detail shows cancellation request card
- [ ] Reason is displayed correctly
- [ ] Approve changes status to cancelled
- [ ] Reject restores previous status
- [ ] Customer view updates in real-time

---

## 🚨 Important Notes

1. **Cancel button only shows for**: `pending` and `processing` orders
2. **Real-time updates**: Both customer and admin use `onSnapshot` listeners
3. **Security**: Customers can ONLY update cancellation fields
4. **Admin control**: Only admins can approve/reject cancellations
5. **Previous status**: Stored automatically for rejection workflow

---

## 📞 Troubleshooting

### "Permission Denied" Error
→ Check Firestore rules are deployed  
→ Verify user is authenticated  
→ Confirm user owns the order

### Cancel Button Not Showing
→ Check order status (must be pending/processing)  
→ Verify RealtimeOrderCard is being used  
→ Check `canBeCancelled` logic

### Status Not Updating
→ Check onSnapshot listeners are active  
→ Verify Firestore connection  
→ Check console for errors

---

## 🎨 UI Components

### Cancel Button (Customer View)
```
┌────────────────────────────────┐
│  [X] Cancel Order              │
└────────────────────────────────┘
```
- Red border, red text
- Full-width on mobile
- Hover: light red background

### Confirmation Modal
```
┌──────────────────────────────────┐
│  ⚠️ Cancel Order                │
│                                   │
│  Warning: If you cancel now...   │
│                                   │
│  [Go Back]  [Cancel Order]       │
└──────────────────────────────────┘
```

### Admin Cancellation Card
```
┌──────────────────────────────────┐
│  ⚠️ Cancellation Request Pending │
│                                   │
│  Reason: [Customer's reason]     │
│                                   │
│  [✓ Approve]  [✗ Reject & Resume]│
└──────────────────────────────────┘
```

---

## 🔗 Related Documentation

- **Full Implementation**: `ORDER_CANCELLATION_IMPLEMENTATION_COMPLETE.md`
- **Security Rules**: `FIRESTORE_RULES_ORDER_CANCELLATION.md`
- **Customer Orders**: `ACCOUNT_ORDERS_PAGE_FIX.md`
- **Admin Orders**: `REALTIME_ORDERS_IMPLEMENTATION.md`

---

## ✨ Features at a Glance

| Feature | Implemented | Real-Time |
|---------|-------------|-----------|
| Cancel Button | ✅ | N/A |
| Confirmation Modal | ✅ | N/A |
| Reason Selection | ✅ | N/A |
| Firestore Update | ✅ | ✅ |
| Admin Visibility | ✅ | ✅ |
| Approve/Reject | ✅ | ✅ |
| Customer Update | ✅ | ✅ |

---

## 🎯 Status: ✅ COMPLETE

**Code**: 100% Complete  
**Documentation**: 100% Complete  
**Testing**: Ready  
**Deployment**: Pending Firestore Rules  

**Last Updated**: October 27, 2025
