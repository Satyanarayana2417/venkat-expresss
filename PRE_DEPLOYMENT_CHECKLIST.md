# ✅ Pre-Deployment Checklist

## 🔥 CRITICAL - Must Do Before Going Live

### 1. Deploy Firestore Security Rules (REQUIRED)

**File**: `firestore.rules`

Add these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile access
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cart subcollection - CRITICAL SECURITY RULE
    match /users/{userId}/cart/{cartItemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Wishlist subcollection - CRITICAL SECURITY RULE
    match /users/{userId}/wishlist/{productId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ... other existing rules
  }
}
```

**Deploy Command**:
```bash
firebase deploy --only firestore:rules
```

**Verification**:
- [ ] Rules deployed successfully
- [ ] No syntax errors in console
- [ ] Test with authenticated user (should work)
- [ ] Test with unauthenticated user (should fail)

---

## 🧪 Testing Checklist

### Test 1: Data Isolation
- [ ] Login as User A
- [ ] Add 3 items to cart
- [ ] Add 2 items to wishlist
- [ ] Logout
- [ ] Login as User B
- [ ] **Verify**: Cart and wishlist are empty ✅
- [ ] Logout
- [ ] Login as User A again
- [ ] **Verify**: 3 cart items + 2 wishlist items appear ✅

### Test 2: Guest Migration
- [ ] Open browser (not logged in)
- [ ] Add 2 items to cart as guest
- [ ] Add 1 item to wishlist as guest
- [ ] Click Login or protected action
- [ ] Login/Signup with account
- [ ] **Verify**: All guest items appear in account ✅
- [ ] Open DevTools → Application → Local Storage
- [ ] **Verify**: `venkat-express-cart-guest` key removed ✅
- [ ] **Verify**: `venkat-express-wishlist-guest` key removed ✅

### Test 3: Logout Behavior
- [ ] Login with account that has items
- [ ] Note cart count in header (e.g., "5")
- [ ] Click "Sign Out"
- [ ] **Verify**: Cart count shows "0" ✅
- [ ] **Verify**: Wishlist redirects to login ✅
- [ ] Login again
- [ ] **Verify**: Cart count restored (e.g., "5") ✅
- [ ] **Verify**: All items reappear ✅

### Test 4: Protected Routes
- [ ] Logout (be a guest)
- [ ] Try to access `/wishlist`
- [ ] **Verify**: Redirected to `/login` ✅
- [ ] Try to access `/dashboard`
- [ ] **Verify**: Redirected to `/login` ✅
- [ ] Try to access `/history`
- [ ] **Verify**: Redirected to `/login` ✅
- [ ] Login
- [ ] **Verify**: Can access all protected pages ✅

### Test 5: Protected Actions
- [ ] Logout (be a guest)
- [ ] Add items to cart (should work for guests)
- [ ] Click "Proceed to Checkout"
- [ ] **Verify**: Login modal appears ✅
- [ ] Click "Cancel" - modal closes
- [ ] Click "Proceed to Checkout" again
- [ ] Click "Login Now"
- [ ] **Verify**: Redirected to login page ✅
- [ ] Login
- [ ] **Verify**: Redirected back to cart ✅
- [ ] Try "Save for Later" as guest
- [ ] **Verify**: Login modal appears ✅

### Test 6: Return Path
- [ ] Logout
- [ ] Try to access `/wishlist`
- [ ] Login on the login page
- [ ] **Verify**: Automatically redirected back to `/wishlist` ✅

---

## 🔍 Console Verification

Open browser DevTools → Console and look for these messages:

### On Login (Guest with Items)
```
✅ Guest cart loaded from localStorage: 2 items
🔄 Migrating guest cart to user account: 2 items
✅ Guest cart migrated to Firestore subcollection
✅ Guest cart migrated and cleared from localStorage
✅ User cart loaded from Firestore: 2 items
```

### On Login (Returning User)
```
✅ User cart loaded from Firestore: 5 items
✅ User wishlist loaded from Firestore: 3 items
```

### On Logout
```
🔒 Cart UI state cleared (logout)
🔒 Wishlist UI state cleared (logout)
```

### On Error (if any)
```
❌ Failed to load cart from Firestore: [error message]
❌ Failed to migrate guest cart: [error message]
```

---

## 🔧 Firebase Console Verification

### 1. Check Firestore Collections

**Navigate to**: Firebase Console → Firestore Database

**Verify Structure**:
```
users/
  ├── {userId1}/
  │   ├── cart/
  │   │   └── {productId}/ ✅
  │   └── wishlist/
  │       └── {productId}/ ✅
  │
  └── {userId2}/
      ├── cart/
      └── wishlist/
```

**Check**:
- [ ] Each user has their own document
- [ ] Cart subcollection exists under user documents
- [ ] Wishlist subcollection exists under user documents
- [ ] Product documents have correct fields

### 2. Check Authentication

**Navigate to**: Firebase Console → Authentication

**Verify**:
- [ ] Test users are created
- [ ] User emails are correct
- [ ] No duplicate accounts

---

## 🐛 Known Issues & Fixes

### Issue 1: "Permission Denied" Error
**Symptom**: Console shows "Missing or insufficient permissions"

**Fix**:
```bash
firebase deploy --only firestore:rules
```

**Verify**: Rules should include cart and wishlist subcollections

---

### Issue 2: Guest Cart Not Migrating
**Symptom**: Guest items disappear after login

**Fix**:
1. Check console for migration logs
2. Verify localStorage key is `venkat-express-cart-guest` (not old key)
3. Check for JavaScript errors in console

**Debug**:
```javascript
// In browser console
localStorage.getItem('venkat-express-cart-guest')
```

---

### Issue 3: Cart Shows Old Data After Logout
**Symptom**: Previous user's cart visible after logout

**Fix**:
1. Verify logout callbacks are registered
2. Check AuthContext has `registerLogoutCallback` method
3. Verify CartContext and WishlistContext call `clearUIState()`

**Debug**:
```javascript
// Check if callbacks are registered
// Look for "Cart UI state cleared" in console on logout
```

---

### Issue 4: Protected Routes Not Working
**Symptom**: Guest can access `/wishlist` without login

**Fix**:
1. Verify `ProtectedRoute` component is imported in `App.tsx`
2. Check route is wrapped: `<Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />`
3. Verify no TypeScript errors

---

## 📱 Browser Compatibility Testing

Test on these browsers (minimum):
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## 🚀 Deployment Steps

### 1. Local Testing
```bash
# Run locally
npm run dev

# Test all scenarios above
# Fix any issues
```

### 2. Build for Production
```bash
# Build the app
npm run build

# Test the build
npm run preview
```

### 3. Deploy Firestore Rules (CRITICAL)
```bash
# Deploy security rules FIRST
firebase deploy --only firestore:rules

# Wait for confirmation
# Verify in Firebase Console → Firestore → Rules tab
```

### 4. Deploy Application
```bash
# Deploy the app
firebase deploy --only hosting

# Or full deploy
firebase deploy
```

### 5. Post-Deployment Verification
- [ ] Visit production URL
- [ ] Test login/logout
- [ ] Test cart functionality
- [ ] Test protected routes
- [ ] Check console for errors
- [ ] Test with real user account

---

## 📊 Performance Monitoring

### After Deployment, Monitor:

1. **Firestore Usage**
   - Check read/write counts
   - Verify no unexpected spikes
   - Monitor daily quota

2. **Authentication**
   - Check login success rate
   - Monitor auth errors

3. **User Behavior**
   - Track cart abandonment
   - Monitor checkout flow
   - Check wishlist usage

---

## 🔐 Security Audit

### Before Going Live:

- [ ] Firestore rules deployed
- [ ] Cart subcollection protected
- [ ] Wishlist subcollection protected
- [ ] Protected routes enforced
- [ ] Protected actions guarded
- [ ] No localStorage pollution
- [ ] Data isolated per user
- [ ] Guest data migrates correctly
- [ ] Logout clears UI state
- [ ] No console errors

---

## ✅ Final Pre-Launch Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] No unused imports
- [ ] Code follows patterns

### Functionality
- [ ] All features working
- [ ] All tests passing
- [ ] No known bugs

### Security
- [ ] Firestore rules deployed
- [ ] Authentication enforced
- [ ] Data isolated

### Documentation
- [ ] Implementation docs created
- [ ] Quick reference available
- [ ] Visual guide created

### Deployment
- [ ] Local testing complete
- [ ] Staging testing complete
- [ ] Production ready

---

## 🎉 Launch Readiness

When all checkboxes are ✅:

```
┌────────────────────────────────────┐
│                                    │
│   🚀 READY FOR PRODUCTION          │
│                                    │
│   All systems: ✅ GO               │
│   Security: ✅ ENFORCED            │
│   Testing: ✅ PASSED               │
│   Documentation: ✅ COMPLETE       │
│                                    │
│   👍 Clear to launch!              │
│                                    │
└────────────────────────────────────┘
```

---

## 📞 Emergency Rollback Plan

If critical issues appear after deployment:

### Option 1: Quick Fix
```bash
# Revert Firestore rules
firebase deploy --only firestore:rules

# Use previous rules version from Firebase Console
```

### Option 2: Full Rollback
```bash
# Revert to previous deployment
firebase hosting:rollback

# Or redeploy previous version
git checkout <previous-commit>
npm run build
firebase deploy
```

---

## 📚 Documentation Links

- **Full Documentation**: `SECURITY_FIX_DOCUMENTATION.md`
- **Quick Reference**: `SECURITY_FIX_QUICK_REF.md`
- **Visual Guide**: `SECURITY_FIX_VISUAL_GUIDE.md`
- **Implementation Summary**: `IMPLEMENTATION_COMPLETE.md`

---

**Remember**: Security rules MUST be deployed before launching! 🔒

**Status**: Ready when all ✅ are checked
