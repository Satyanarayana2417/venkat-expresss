# Firestore Security Rules Update - Order Deletion & Audit Trail

## Overview
This document contains the required Firestore security rules updates to enable secure order deletion with audit logging functionality.

---

## Required Rules Updates

### 1. Update Orders Collection Rule

**Location:** `firestore.rules` → `orders/{orderId}` block

**Change Required:** Modify the delete rule to allow only admins to delete orders.

**Before:**
```javascript
match /orders/{orderId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow write: if request.auth != null;
  allow delete: if false; // ❌ No one can delete
}
```

**After:**
```javascript
match /orders/{orderId} {
  allow read: if request.auth != null && request.auth.uid == resource.data.userId;
  allow write: if request.auth != null;
  allow delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'; // ✅ Only admins can delete
}
```

---

### 2. Add Deletion Audit Collection Rule

**Location:** `firestore.rules` → Add new rule block

**Purpose:** Secure the deletion audit trail so only admins can log deletions and no one can modify the logs.

**Add This Rule:**
```javascript
// == DELETION AUDIT TRAIL ==
match /deletionAudit/{auditId} {
  // Only allow an admin to create a log entry (when they delete an order)
  allow create: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
  
  // Deny all other access to this log (read, update, delete)
  // This ensures the audit trail is tamper-proof
  allow read, update, delete: if false;
}
```

---

## Complete Example Rules File

Here's how your complete `firestore.rules` file should look with these changes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders collection - UPDATED
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null;
      allow delete: if isAdmin(); // ✅ CHANGED: Only admins can delete
    }
    
    // Deletion Audit collection - NEW
    match /deletionAudit/{auditId} {
      // Only admins can create audit logs
      allow create: if isAdmin();
      
      // No one can read, update, or delete audit logs
      // This makes the audit trail tamper-proof
      allow read, update, delete: if false;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Add other collections as needed...
  }
}
```

---

## Audit Log Data Structure

When an order is deleted, the following data is automatically logged to `deletionAudit` collection:

```typescript
{
  orderId: string,                    // ID of the deleted order
  orderNumber: string,                // Order number
  customerName: string,               // Customer name
  customerEmail: string,              // Customer email
  orderTotal: number,                 // Order total amount
  orderStatus: string,                // Order status at time of deletion
  orderDate: string,                  // Original order date
  deletedByUid: string,              // UID of admin who deleted
  deletedByEmail: string,            // Email of admin who deleted
  deletionTimestamp: Timestamp,      // When deletion occurred
  deletionReason: string,            // Admin's justification (min 15 chars)
  orderDataSnapshot: object          // Complete order data backup
}
```

---

## Deployment Steps

1. **Open Firebase Console:**
   - Go to https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Rules:**
   - Click "Firestore Database" in left menu
   - Click "Rules" tab at the top

3. **Update the Rules:**
   - Copy the updated rules from above
   - Paste into the rules editor
   - Click "Publish"

4. **Verify Deployment:**
   - Rules should show "Published" status
   - Check the timestamp to confirm update

---

## Testing the Rules

### Test 1: Admin Can Delete Orders
```javascript
// As admin user
await deleteDoc(doc(db, 'orders', 'ORDER_ID'));
// ✅ Should succeed
```

### Test 2: Non-Admin Cannot Delete Orders
```javascript
// As regular user
await deleteDoc(doc(db, 'orders', 'ORDER_ID'));
// ❌ Should fail with "permission-denied"
```

### Test 3: Admin Can Create Audit Logs
```javascript
// As admin user
await addDoc(collection(db, 'deletionAudit'), { ... });
// ✅ Should succeed
```

### Test 4: No One Can Read Audit Logs
```javascript
// As any user (including admin)
await getDocs(collection(db, 'deletionAudit'));
// ❌ Should fail with "permission-denied"
```

---

## Security Notes

⚠️ **IMPORTANT:**
- The audit trail is **write-only** - even admins cannot read or modify logs
- This ensures complete tamper-proof logging
- If you need to access audit logs, use Firebase Console directly or create a separate admin-only cloud function

✅ **Benefits:**
- Complete audit trail of all deletions
- Justification required for every deletion
- Immutable log (cannot be altered or deleted)
- Admin accountability

---

## Troubleshooting

**Issue:** "Permission denied" when deleting order
- **Check:** User has `role: 'admin'` in `/users/{uid}` document
- **Check:** Firestore rules are published
- **Check:** Using correct authentication

**Issue:** "Permission denied" when creating audit log
- **Check:** Same as above
- **Check:** Collection name is exactly `deletionAudit`

**Issue:** Cannot read audit logs
- **Expected behavior** - audit logs are write-only
- Access via Firebase Console → Firestore → deletionAudit collection

---

## Related Files

- Frontend Implementation: `src/pages/admin/AdminOrders.tsx`
- Delete Modal: `src/components/admin/DeleteOrderModal.tsx`
- Security Rules: `firestore.rules`

---

**Status:** ✅ Ready for Deployment
**Version:** 1.0
**Date:** October 27, 2025
