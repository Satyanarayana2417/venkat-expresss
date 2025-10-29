# 🔧 Order Cancellation Not Working - Troubleshooting Guide

## Quick Diagnostic Steps

### Step 1: Check What's Happening

**Open Browser Console** (Press F12) and try to cancel an order. Look for:

1. **Permission Error?**
   ```
   FirebaseError: Missing or insufficient permissions
   ```
   ➡️ **Solution**: Update Firestore rules (see below)

2. **Network Error?**
   ```
   Error submitting cancellation request: [some error]
   ```
   ➡️ Check network tab, verify Firebase connection

3. **No Error but Nothing Happens?**
   ➡️ Check if cancel button is visible (only shows for pending/processing orders)

---

## ✅ Fix #1: Update Firestore Rules (MOST COMMON ISSUE)

The rules need to allow customers to update orders for cancellation.

### Copy These Updated Rules:

\`\`\`javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOrderOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // ... (keep all your other rules: users, products, etc.)
    
    // ORDERS - UPDATED FOR CANCELLATION
    match /orders/{orderId} {
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      
      allow get: if request.auth != null && 
                   (resource.data.userId == request.auth.uid || isAdmin());
      
      allow list: if request.auth != null && 
                    (request.auth.uid == resource.data.userId || isAdmin());
      
      // IMPORTANT: This allows customers to cancel
      allow update: if request.auth != null && (
        isAdmin() || 
        (
          isOrderOwner(resource.data.userId) && 
          request.resource.data.status == 'cancellation-pending' &&
          resource.data.userId == request.resource.data.userId
        )
      );
      
      allow delete: if isAdmin();
    }
  }
}
\`\`\`

### Deploy Steps:
1. Go to **Firebase Console** → **Firestore Database** → **Rules**
2. Find the `match /orders/{orderId}` section
3. Replace the `allow update` line with the new one above
4. Click **"Publish"**
5. Wait 1-2 minutes for rules to update

---

## ✅ Fix #2: Verify Cancel Button Shows

The cancel button only appears if:
- Order status is `'pending'` OR `'processing'`
- Order is NOT `'shipped'`, `'delivered'`, `'cancelled'`, or `'returned'`

**Check**: 
- What's your order status in Firebase console?
- Is it `'pending'` or `'processing'`?

---

## ✅ Fix #3: Test Step-by-Step

1. **Click "Cancel Order" button**
   - Does it show the modal? ✅
   - Does modal have "Go Back" and "Cancel Order" buttons? ✅

2. **Click "Cancel Order" in modal**
   - Does it navigate to `/order/cancel/{orderId}` page? ✅
   - Can you see the 8 cancellation reasons? ✅

3. **Select a reason and click "Submit"**
   - Do you see "Cancellation request submitted" toast? ✅
   - Does it navigate to `/order/cancel/pending` page? ✅

4. **Check Firebase**
   - Open Firebase Console → Firestore → orders → your order
   - Does it have:
     - `status: 'cancellation-pending'` ✅
     - `cancellationReason: '[your reason]'` ✅
     - `cancellationRequestedAt: [timestamp]` ✅
     - `previousStatus: 'pending' (or whatever it was)` ✅

---

## 🔍 Common Issues & Solutions

### Issue 1: "Cancel Order" Button Not Showing
**Cause**: Order status is not `'pending'` or `'processing'`

**Solution**: 
- Check order status in Firebase
- Manually change it to `'pending'` or `'processing'` for testing
- Button will appear

### Issue 2: "Permission Denied" Error
**Cause**: Firestore rules not updated

**Solution**: 
- Deploy the updated rules (see Fix #1 above)
- Make sure `allow update` includes the cancellation logic
- Wait 1-2 minutes after publishing

### Issue 3: Page Redirects to Login
**Cause**: User not authenticated or order doesn't belong to user

**Solution**:
- Make sure you're logged in
- Check that `order.userId` matches your user ID
- Look in browser console for auth errors

### Issue 4: Nothing Happens When Clicking Submit
**Cause**: JavaScript error or form validation issue

**Solution**:
- Open browser console (F12)
- Look for red errors
- Make sure you selected a cancellation reason
- Check network tab for failed requests

---

## 🧪 Manual Test in Firebase Console

1. Go to **Firebase Console** → **Firestore** → **orders**
2. Click on any order with `status: 'pending'`
3. Click "Add field" and add:
   - Field: `status`, Value: `'cancellation-pending'`
   - Field: `cancellationReason`, Value: `'Test cancellation'`
   - Field: `cancellationRequestedAt`, Value: [timestamp]
   - Field: `previousStatus`, Value: `'pending'`
4. Check if frontend shows "Cancellation Pending" badge

If this works, your rules are correct but something is wrong with the form submission.

---

## 📊 Debugging Checklist

- [ ] Firestore rules deployed (check "Rules" tab in Firebase)
- [ ] User is logged in (check AuthContext)
- [ ] Order exists in Firestore
- [ ] Order belongs to current user (`order.userId == user.uid`)
- [ ] Order status is `'pending'` or `'processing'`
- [ ] Cancel button is visible on order card
- [ ] Modal appears when clicking cancel button
- [ ] Cancellation page loads at `/order/cancel/{orderId}`
- [ ] Can select a cancellation reason
- [ ] No errors in browser console (F12)
- [ ] Network request to Firestore succeeds (check Network tab)

---

## 🆘 Still Not Working?

**Send me this info:**

1. **Order Status** (from Firebase Console):
   \`\`\`
   {
     "orderId": "...",
     "status": "...",
     "userId": "..."
   }
   \`\`\`

2. **Browser Console Error** (Press F12, copy the red error):
   \`\`\`
   [Paste error here]
   \`\`\`

3. **What happens when you click "Cancel Order"?**
   - Modal doesn't show?
   - Modal shows but nothing happens?
   - Page loads but submit fails?
   - Permission error?

I'll help you debug further!
