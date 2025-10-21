# 🔐 Firestore Security Rules - Orders Collection

## 📋 Recommended Security Rules

Add these rules to your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... your existing rules ...
    
    // ==========================================
    // ORDERS COLLECTION - Payment System
    // ==========================================
    match /orders/{orderId} {
      
      // Allow users to CREATE their own orders
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.keys().hasAll([
          'orderId', 'customer', 'email', 'userId',
          'items', 'total', 'upiTransactionId',
          'orderStatus', 'paymentStatus', 'paymentMethod'
        ]);
      
      // Allow users to READ their own orders
      allow read: if request.auth != null 
        && (resource.data.userId == request.auth.uid 
            || isAdmin());
      
      // Allow ADMINS to UPDATE order status
      allow update: if request.auth != null 
        && isAdmin()
        && request.resource.data.userId == resource.data.userId; // Prevent userId change
      
      // Allow ADMINS to DELETE orders (for data cleanup)
      allow delete: if request.auth != null 
        && isAdmin();
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
  }
}
```

---

## 🔍 Rule Breakdown

### 1. Create Order
```javascript
allow create: if request.auth != null 
  && request.resource.data.userId == request.auth.uid
  && request.resource.data.keys().hasAll([...]);
```

**What it does**:
- ✅ User must be authenticated
- ✅ Order's `userId` must match authenticated user's UID
- ✅ All required fields must be present

**Why**:
- Prevents guests from creating orders
- Prevents users from creating orders for other users
- Ensures data integrity

### 2. Read Order
```javascript
allow read: if request.auth != null 
  && (resource.data.userId == request.auth.uid 
      || isAdmin());
```

**What it does**:
- ✅ User can read their own orders
- ✅ Admins can read all orders
- ❌ Users cannot read other users' orders

**Why**:
- Protects customer privacy
- Allows admin order management

### 3. Update Order
```javascript
allow update: if request.auth != null 
  && isAdmin()
  && request.resource.data.userId == resource.data.userId;
```

**What it does**:
- ✅ Only admins can update orders
- ✅ Cannot change the `userId` field
- ❌ Regular users cannot update orders

**Why**:
- Only admins should verify/update order status
- Prevents order tampering
- Maintains data integrity

### 4. Delete Order
```javascript
allow delete: if request.auth != null 
  && isAdmin();
```

**What it does**:
- ✅ Only admins can delete orders
- ❌ Regular users cannot delete orders

**Why**:
- Prevents accidental data loss
- Maintains order history

---

## 🧪 Testing the Rules

### Test 1: User Can Create Order
```javascript
// As authenticated user
const orderData = {
  orderId: 'ORD-123',
  customer: 'John Doe',
  email: 'john@example.com',
  userId: currentUser.uid, // Must match authenticated user
  items: [...],
  total: 2500,
  upiTransactionId: 'TXN123',
  orderStatus: 'Payment Verification Pending',
  paymentStatus: 'Pending Verification',
  paymentMethod: 'UPI',
  date: '2025-10-16',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
};

await addDoc(collection(db, 'orders'), orderData);
// ✅ Should succeed
```

### Test 2: User Can Read Own Order
```javascript
// As authenticated user
const orderRef = doc(db, 'orders', 'order_id');
const orderSnap = await getDoc(orderRef);
// ✅ Should succeed if userId matches
// ❌ Should fail if userId doesn't match
```

### Test 3: User Cannot Update Order
```javascript
// As authenticated user (non-admin)
const orderRef = doc(db, 'orders', 'order_id');
await updateDoc(orderRef, { orderStatus: 'Confirmed' });
// ❌ Should fail with permission-denied
```

### Test 4: Admin Can Update Order
```javascript
// As admin user
const orderRef = doc(db, 'orders', 'order_id');
await updateDoc(orderRef, { 
  orderStatus: 'Confirmed',
  paymentStatus: 'Verified'
});
// ✅ Should succeed
```

---

## 🚨 Required Fields Validation

The security rules enforce these required fields:

```typescript
{
  orderId: string,           // ✅ Required
  customer: string,          // ✅ Required
  email: string,             // ✅ Required
  userId: string,            // ✅ Required
  items: array,              // ✅ Required
  total: number,             // ✅ Required
  upiTransactionId: string,  // ✅ Required
  orderStatus: string,       // ✅ Required
  paymentStatus: string,     // ✅ Required
  paymentMethod: string      // ✅ Required
}
```

**Optional Fields** (not enforced by rules):
```typescript
{
  phone: string,
  orderNumber: string,
  subtotal: number,
  tax: number,
  shippingCost: number,
  shippingAddress: object,
  billingAddress: object,
  date: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 📦 Complete Example Rules File

If you don't have existing rules, here's a complete starting point:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
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
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.keys().hasAll([
          'orderId', 'customer', 'email', 'userId',
          'items', 'total', 'upiTransactionId',
          'orderStatus', 'paymentStatus', 'paymentMethod'
        ]);
      
      allow read: if request.auth != null 
        && (resource.data.userId == request.auth.uid || isAdmin());
      
      allow update: if request.auth != null 
        && isAdmin()
        && request.resource.data.userId == resource.data.userId;
      
      allow delete: if request.auth != null && isAdmin();
    }
    
    // Cart Collection (subcollection under users)
    match /users/{userId}/cart/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Helper function
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
  }
}
```

---

## 🔧 How to Apply Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **venkatexpresss2**
3. Click **Firestore Database** in left sidebar

### Step 2: Navigate to Rules
1. Click **Rules** tab at the top
2. You'll see the current rules editor

### Step 3: Update Rules
1. Copy the rules from above
2. Paste/merge with your existing rules
3. Click **Publish** button

### Step 4: Verify Rules
1. Look for "Rules successfully updated" message
2. Test with your application

---

## ⚠️ Important Security Notes

### 1. Admin Role Check
The `isAdmin()` function assumes you have a `users` collection with a `role` field:

```javascript
// In Firestore: /users/{userId}
{
  uid: "user_uid",
  email: "admin@venkatexpress.com",
  role: "admin"  // ⬅️ This field is checked
}
```

Make sure admin users have `role: "admin"` in their user document.

### 2. Required Fields
The rules enforce required fields on **create** only. Updates don't require all fields, allowing admins to update just the status fields.

### 3. UserId Immutability
The update rule prevents changing the `userId` field:
```javascript
request.resource.data.userId == resource.data.userId
```
This ensures orders can't be transferred to another user.

### 4. Transaction ID Security
The `upiTransactionId` is required but not validated format-wise in security rules. Validation should happen in your application code.

---

## 📊 Rule Testing Scenarios

| Scenario | User Type | Action | Expected Result |
|----------|-----------|--------|-----------------|
| Create order with own userId | Authenticated User | Create | ✅ Success |
| Create order with different userId | Authenticated User | Create | ❌ Permission Denied |
| Create order without auth | Guest | Create | ❌ Permission Denied |
| Read own order | Order Owner | Read | ✅ Success |
| Read other user's order | Different User | Read | ❌ Permission Denied |
| Read any order | Admin | Read | ✅ Success |
| Update order status | Regular User | Update | ❌ Permission Denied |
| Update order status | Admin | Update | ✅ Success |
| Delete order | Regular User | Delete | ❌ Permission Denied |
| Delete order | Admin | Delete | ✅ Success |

---

## 🔍 Debugging Rules

If you encounter permission errors:

1. **Check User Authentication**
   ```javascript
   console.log('User:', auth.currentUser?.uid);
   ```

2. **Check Order UserId**
   ```javascript
   const order = await getDoc(orderRef);
   console.log('Order userId:', order.data()?.userId);
   ```

3. **Check Admin Role**
   ```javascript
   const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
   console.log('User role:', userDoc.data()?.role);
   ```

4. **Check Required Fields**
   ```javascript
   const requiredFields = [
     'orderId', 'customer', 'email', 'userId',
     'items', 'total', 'upiTransactionId',
     'orderStatus', 'paymentStatus', 'paymentMethod'
   ];
   const hasAllFields = requiredFields.every(field => field in orderData);
   console.log('Has all fields:', hasAllFields);
   ```

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Rules are published in Firebase Console
- [ ] Test order creation as regular user
- [ ] Test order reading as regular user (own orders)
- [ ] Test order reading as different user (should fail)
- [ ] Test order update as regular user (should fail)
- [ ] Test order update as admin (should succeed)
- [ ] Verify admin users have `role: "admin"` in Firestore
- [ ] Test on staging environment first
- [ ] Monitor Firestore logs for permission errors

---

**Last Updated**: October 16, 2025  
**Version**: 1.0  
**Project**: Venkat Express Payment Integration
