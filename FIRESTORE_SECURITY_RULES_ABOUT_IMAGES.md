# Firestore Security Rules - About Images CMS

## 🔒 Required Security Rule

To enable the About Images CMS feature, you need to add or verify the following security rule in your Firestore database.

---

## 📝 Complete Security Rule

Add this to your `firestore.rules` file or Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... other rules ...
    
    // Page Content Collection (for About Images CMS)
    match /pageContent/{document=**} {
      // Allow everyone to read page content
      allow read: if true;
      
      // Only admins can write/update page content
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ... other rules ...
  }
}
```

---

## 🎯 Rule Explanation

### Read Access: Public
```javascript
allow read: if true;
```
**Why?** The About Us page needs to display images to all website visitors, including non-logged-in users.

### Write Access: Admin Only
```javascript
allow write: if request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```

**Breakdown:**
1. `request.auth != null` → User must be authenticated
2. `get(/databases/.../users/$(request.auth.uid))` → Fetch user document
3. `.data.role == 'admin'` → Check if user has admin role

**Why?** Only authorized administrators should be able to change website content.

---

## 🚀 How to Apply

### Method 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **venkatexpresss2**
3. Navigate to **Firestore Database** → **Rules**
4. Add the `pageContent` rule to your existing rules
5. Click **Publish**

### Method 2: Firebase CLI

```bash
firebase deploy --only firestore:rules
```

---

## ✅ Testing the Rule

### Test Public Read Access
```javascript
// Anyone can read (including non-authenticated users)
const docRef = doc(db, 'pageContent', 'aboutUs');
const docSnap = await getDoc(docRef);
// ✅ Should succeed
```

### Test Admin Write Access
```javascript
// Only works if logged in as admin
const docRef = doc(db, 'pageContent', 'aboutUs');
await updateDoc(docRef, {
  storyImageUrl1: 'https://new-image-url.com'
});
// ✅ Succeeds if admin
// ❌ Fails if not admin or not authenticated
```

---

## 🔍 User Role Structure

For the security rule to work, users in your `users` collection must have a `role` field:

```javascript
// Example user document structure
{
  email: "admin@venkatexpress.com",
  role: "admin",  // ← Required field
  createdAt: timestamp,
  // ... other fields
}
```

---

## 🐛 Common Issues

### Issue 1: "Missing or insufficient permissions"
**Cause:** User doesn't have admin role  
**Solution:** Check user document in Firestore → Ensure `role: "admin"`

### Issue 2: Rule not taking effect
**Cause:** Rules not published  
**Solution:** Click "Publish" button in Firebase Console

### Issue 3: Writes succeed for non-admins
**Cause:** Rule not properly configured  
**Solution:** Verify exact syntax matches the rule above

---

## 📊 Rule Testing in Console

Firebase Console has a built-in rules simulator:

1. Go to **Firestore Database** → **Rules**
2. Click **Rules Playground**
3. Test scenarios:

#### Test Public Read
```
Location: /pageContent/aboutUs
Request Type: get
Auth: Unauthenticated
Expected: Allow ✅
```

#### Test Admin Write
```
Location: /pageContent/aboutUs
Request Type: update
Auth: Custom Token (with admin role)
Expected: Allow ✅
```

#### Test Non-Admin Write
```
Location: /pageContent/aboutUs
Request Type: update
Auth: Authenticated (non-admin)
Expected: Deny ❌
```

---

## 🔐 Best Practices

### ✅ DO
- Keep read access public for page content
- Restrict write access to admins only
- Test rules in Firebase Console before deploying
- Document your security rules

### ❌ DON'T
- Don't give write access to all authenticated users
- Don't remove authentication checks
- Don't deploy untested rules
- Don't store sensitive data in page content

---

## 📝 Complete Rules Example

Here's a more complete example including other common collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users Collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Products Collection
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Page Content Collection (About Images CMS)
    match /pageContent/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders Collection
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.userId || 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## ✅ Verification Checklist

After deploying the rules:

- [ ] Public users can view About page images
- [ ] Non-admin users cannot update images
- [ ] Admin users can upload new images
- [ ] Console shows no permission errors
- [ ] Rules are published in Firebase Console

---

## 📞 Support

If you encounter issues with security rules:

1. Check Firebase Console → Firestore → Rules
2. Review browser console for specific error messages
3. Use Firebase Rules Playground to test
4. Verify user has `role: "admin"` in Firestore

---

**Last Updated**: October 15, 2025  
**Status**: ✅ Required for About Images CMS
