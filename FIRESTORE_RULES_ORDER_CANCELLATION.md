# Firestore Security Rules - Order Cancellation Feature

## Overview
This document outlines the required Firestore security rule updates to support the customer-initiated order cancellation workflow.

## Required Rules Updates

### Orders Collection Rules

Add or update the orders collection rules to allow customers to update their own orders with specific field restrictions:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders Collection - UPDATED for cancellation feature
    match /orders/{orderId} {
      // Allow users to CREATE their own orders
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      
      // Allow users to READ their own orders OR admins to read all orders
      allow read: if request.auth != null 
        && (resource.data.userId == request.auth.uid || isAdmin());
      
      // Allow users to UPDATE only specific fields for cancellation requests
      allow update: if request.auth != null && (
        // Admins can update any field
        isAdmin() ||
        // Users can only update their own orders with restricted fields
        (request.auth.uid == resource.data.userId && 
         request.resource.data.userId == resource.data.userId && // Can't change userId
         onlyUpdatingCancellationFields())
      );
      
      // Allow ADMINS to DELETE orders
      allow delete: if request.auth != null && isAdmin();
    }
    
    // Helper function to check if only cancellation-related fields are being updated
    function onlyUpdatingCancellationFields() {
      let allowedFields = ['status', 'cancellationReason', 'cancellationRequestedAt', 'previousStatus'];
      let updatedKeys = request.resource.data.diff(resource.data).affectedKeys();
      
      // Check that all updated keys are in the allowed list
      // AND the status is being changed to 'cancellation-pending'
      return updatedKeys.hasOnly(allowedFields) &&
             request.resource.data.status == 'cancellation-pending';
    }
    
    // Other collections...
  }
}
```

## Detailed Explanation

### 1. Customer Update Permissions

**What it allows:**
- ✅ Customers can update their own orders
- ✅ Only specific fields can be modified: `status`, `cancellationReason`, `cancellationRequestedAt`, `previousStatus`
- ✅ Status must be changed to `'cancellation-pending'` when customer updates
- ✅ Customer cannot change the `userId` field

**What it prevents:**
- ❌ Customers cannot update other users' orders
- ❌ Customers cannot modify other fields (total, items, payment details, etc.)
- ❌ Customers cannot arbitrarily change status to any value (only to `cancellation-pending`)

### 2. Admin Permissions

**What it allows:**
- ✅ Admins can read all orders
- ✅ Admins can update any field in any order
- ✅ Admins can delete orders
- ✅ Admins can approve/reject cancellation requests

### 3. Security Checks

The `onlyUpdatingCancellationFields()` helper function ensures:
1. Only allowed fields are being modified
2. The status is being set to `'cancellation-pending'`
3. No other fields are being tampered with

## Testing the Rules

### Test 1: Customer Can Request Cancellation
```javascript
// As authenticated user (customer)
const orderRef = doc(db, 'orders', orderId);
await updateDoc(orderRef, {
  status: 'cancellation-pending',
  cancellationReason: 'I want to change the delivery address',
  cancellationRequestedAt: new Date(),
  previousStatus: 'processing'
});
// ✅ Should succeed if user owns the order
```

### Test 2: Customer Cannot Update Other Fields
```javascript
// As authenticated user (customer)
const orderRef = doc(db, 'orders', orderId);
await updateDoc(orderRef, {
  status: 'cancellation-pending',
  total: 0 // Trying to change total
});
// ❌ Should fail - can only update allowed fields
```

### Test 3: Customer Cannot Update Others' Orders
```javascript
// As authenticated user trying to cancel someone else's order
const orderRef = doc(db, 'orders', otherUsersOrderId);
await updateDoc(orderRef, {
  status: 'cancellation-pending'
});
// ❌ Should fail - userId doesn't match
```

### Test 4: Admin Can Approve Cancellation
```javascript
// As admin user
const orderRef = doc(db, 'orders', orderId);
await updateDoc(orderRef, {
  status: 'cancelled',
  cancellationApprovedAt: Timestamp.now(),
  cancellationApprovedBy: 'admin'
});
// ✅ Should succeed
```

### Test 5: Admin Can Reject Cancellation
```javascript
// As admin user
const orderRef = doc(db, 'orders', orderId);
await updateDoc(orderRef, {
  status: 'processing', // Restore previous status
  cancellationRejectedAt: Timestamp.now(),
  cancellationRejectedBy: 'admin',
  cancellationReason: null
});
// ✅ Should succeed
```

## Deployment Steps

### Step 1: Backup Current Rules
1. Go to Firebase Console → Firestore → Rules
2. Copy your current rules to a backup file
3. Keep a version history

### Step 2: Update Rules
1. Open the Rules editor
2. Merge the new orders collection rules with your existing rules
3. Ensure the helper function `isAdmin()` is defined
4. Ensure the `onlyUpdatingCancellationFields()` helper is added

### Step 3: Publish Rules
1. Click "Publish" button
2. Wait for confirmation message
3. Rules take effect immediately

### Step 4: Verify Deployment
1. Test from your application
2. Check Firestore Rules simulator (if needed)
3. Monitor Firestore logs for permission errors

## Important Notes

### Admin Role Requirement
The `isAdmin()` function checks for a `role` field in the users collection:
```javascript
// In Firestore: /users/{userId}
{
  uid: "user_uid",
  email: "admin@venkatexpress.com",
  role: "admin"  // ⬅️ This field is checked
}
```

Ensure admin users have `role: "admin"` set in their user documents.

### Field Validation
The rules do NOT validate the content of fields (like whether cancellationReason is a valid string). This validation should be done in your application code before submitting.

### Real-time Updates
These rules work perfectly with Firebase's `onSnapshot()` real-time listeners. When a customer requests cancellation, admins will see the update instantly due to the real-time nature of Firestore.

## Troubleshooting

### Permission Denied Errors

If you get permission denied when testing:

1. **Check User Authentication**
   ```javascript
   console.log('User:', auth.currentUser?.uid);
   ```

2. **Check Order Ownership**
   ```javascript
   const order = await getDoc(orderRef);
   console.log('Order userId:', order.data()?.userId);
   console.log('Current user:', auth.currentUser?.uid);
   ```

3. **Check Admin Role**
   ```javascript
   const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
   console.log('User role:', userDoc.data()?.role);
   ```

4. **Check Field Updates**
   ```javascript
   console.log('Updating fields:', {
     status: 'cancellation-pending',
     cancellationReason: reason,
     // etc.
   });
   ```

## Complete Example Rules File

Here's a minimal complete rules file for reference:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if only cancellation fields are being updated
    function onlyUpdatingCancellationFields() {
      let allowedFields = ['status', 'cancellationReason', 'cancellationRequestedAt', 'previousStatus'];
      let updatedKeys = request.resource.data.diff(resource.data).affectedKeys();
      
      return updatedKeys.hasOnly(allowedFields) &&
             request.resource.data.status == 'cancellation-pending';
    }
    
    // Users Collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products Collection
    match /products/{productId} {
      allow read: if true; // Public read
      allow write: if request.auth != null && isAdmin();
    }
    
    // Orders Collection
    match /orders/{orderId} {
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      
      allow read: if request.auth != null 
        && (resource.data.userId == request.auth.uid || isAdmin());
      
      allow update: if request.auth != null && (
        isAdmin() ||
        (request.auth.uid == resource.data.userId && 
         request.resource.data.userId == resource.data.userId &&
         onlyUpdatingCancellationFields())
      );
      
      allow delete: if request.auth != null && isAdmin();
    }
  }
}
```

---

## Summary

✅ **Security**: Only order owners can request cancellations, only admins can approve/reject  
✅ **Field Restrictions**: Customers can only update specific cancellation-related fields  
✅ **Data Integrity**: UserId cannot be changed, preventing order hijacking  
✅ **Real-time**: Rules work seamlessly with onSnapshot() listeners  
✅ **Admin Control**: Full admin access to manage all orders  

**Status**: Ready for deployment  
**Date**: October 27, 2025  
**Feature**: Order Cancellation Workflow
