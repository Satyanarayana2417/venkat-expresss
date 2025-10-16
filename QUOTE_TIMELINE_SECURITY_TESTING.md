# 🧪 Quote Timeline Security Fix - Testing Guide

## 🎯 Testing Objectives

Verify that the quote timeline is:
1. ✅ User-specific (tied to authenticated user)
2. ✅ Secure (no cross-user data leakage)
3. ✅ Persistent (survives page refreshes)
4. ✅ Cross-device compatible (works on multiple devices)
5. ✅ Properly cleared on logout

---

## 🛠️ Test Setup

### **Prerequisites:**
- Development server running: `npm run dev`
- Firebase Firestore accessible
- At least 2 test user accounts:
  - **User A:** `alice@test.com` / `password123`
  - **User B:** `bob@test.com` / `password123`
- Browser DevTools open (F12)
- Two browsers or incognito windows for multi-user testing

### **Console Monitoring:**
Open browser console and watch for these log messages:
```javascript
✅ Loaded active quote from user profile: {quoteId}
🔒 User logged out - timeline cleared
✅ Quote created and linked to user profile: {quoteId}
✅ Active quote cleared from user profile
```

---

## 📋 Test Cases

### **Test 1: Basic Quote Submission (Single User)**

**Purpose:** Verify quote submission stores activeQuoteId in Firestore user profile

**Steps:**
1. Open browser and navigate to `http://localhost:8080/services`
2. **Expected:** Login form or quote form appears
3. If not logged in, click "Login to Get Quote" and login as User A
4. Fill out the quote form:
   - Service Type: "You Give, We Ship"
   - Item Name: "Laptop Computer"
   - Weight: "5"
   - Package Type: "Box"
   - Destination Country: "United States"
   - Fill all address fields
5. Click "Submit Quote"
6. **Expected:** 
   - Success toast appears: "Quote Request Sent Successfully!"
   - Timeline component appears below form
   - Timeline shows: Status "Pending", Item "Laptop Computer"
7. Open browser console
8. **Expected:** Console shows:
   ```
   ✅ Quote created and linked to user profile: {quoteId}
   ✅ Loaded active quote from user profile: {quoteId}
   ```
9. Open Firebase Console → Firestore → `users` collection → User A's document
10. **Expected:** Document has fields:
    ```json
    {
      "activeQuoteId": "hKCv91Y8zNBS",
      "lastQuoteSubmittedAt": "2025-10-14T10:30:00Z"
    }
    ```

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 2: Page Refresh Persistence**

**Purpose:** Verify timeline persists after page refresh

**Prerequisites:** User A has active timeline from Test 1

**Steps:**
1. With timeline visible, press **F5** to refresh page
2. **Expected:** Page reloads
3. Wait for page to fully load
4. **Expected:** Timeline reappears automatically with same quote
5. Check console
6. **Expected:** Console shows:
   ```
   ✅ Loaded active quote from user profile: {quoteId}
   ```
7. Verify timeline data matches original quote:
   - Same Request ID
   - Same Item Name
   - Same Status

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 3: Navigation Persistence**

**Purpose:** Verify timeline persists after navigating away and returning

**Prerequisites:** User A has active timeline

**Steps:**
1. With timeline visible, click "Home" in navigation
2. **Expected:** Navigates to home page, timeline disappears
3. Click "Services" in navigation to return
4. **Expected:** Timeline reappears with same quote

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 4: Close Timeline**

**Purpose:** Verify closing timeline removes activeQuoteId from Firestore

**Prerequisites:** User A has active timeline

**Steps:**
1. With timeline visible, click the **[X]** close button
2. **Expected:** Timeline disappears immediately
3. Check console
4. **Expected:** Console shows:
   ```
   ✅ Active quote cleared from user profile
   ```
5. Press **F5** to refresh page
6. **Expected:** Timeline does NOT reappear
7. Open Firebase Console → User A's document
8. **Expected:** `activeQuoteId: null`

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 5: 🚨 CRITICAL - User Logout (Security Test)**

**Purpose:** Verify timeline clears on logout

**Prerequisites:** User A has active timeline

**Steps:**
1. With timeline visible, click user avatar/menu → "Logout"
2. **Expected:** User logs out, redirected to login/home
3. Check console
4. **Expected:** Console shows:
   ```
   🔒 User logged out - timeline cleared
   ```
5. Navigate back to `/services`
6. **Expected:** NO timeline visible (even though activeQuoteId still in Firestore)
7. Timeline should only show after login

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 6: 🚨 CRITICAL - Multi-User Security (Cross-User Leakage Test)**

**Purpose:** Verify User B cannot see User A's timeline

**Prerequisites:** 
- User A has submitted a quote and logged out
- User A's Firestore document has `activeQuoteId: "quote123"`

**Steps:**
1. **Ensure User A is logged out**
2. Navigate to `/services`
3. **Expected:** No timeline visible
4. Login as **User B** (different account: bob@test.com)
5. **Expected:** Login successful
6. Navigate to `/services` (if not already there)
7. **🚨 CRITICAL CHECK:** NO timeline should be visible
8. Check console - should show User B has no active quote
9. Open Firebase Console → User B's document
10. **Expected:** `activeQuoteId: null` or field doesn't exist
11. **Verify:** User B cannot see User A's quote details
12. User B submits a NEW quote
13. **Expected:** User B sees ONLY their own timeline (not User A's)
14. Open Firebase Console → Check both documents:
    ```
    /users/userA_uid → activeQuoteId: "quote123"
    /users/userB_uid → activeQuoteId: "quote789"
    ```
15. Logout User B
16. Login back as User A
17. **Expected:** User A sees ONLY their original timeline ("quote123")

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 7: Rapid Login/Logout (Race Condition Test)**

**Purpose:** Verify no race conditions during rapid auth changes

**Steps:**
1. Login as User A → Logout → Login → Logout → Login (repeat 5 times quickly)
2. **Expected:** No errors in console
3. Timeline appears/disappears correctly each time
4. No stale data from previous session

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 8: Cross-Device Sync**

**Purpose:** Verify timeline syncs across devices for same user

**Prerequisites:** Two devices or browsers (Device A and Device B)

**Steps:**
1. **Device A:** Login as User A
2. **Device A:** Submit quote → Timeline appears
3. **Device B:** Login as User A (same account)
4. **Device B:** Navigate to `/services`
5. **Expected:** Timeline appears on Device B with same quote
6. **Device B:** Close timeline (click [X])
7. **Device A:** Refresh page
8. **Expected:** Timeline is gone on Device A too

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 9: SessionStorage Verification (No Residual Data)**

**Purpose:** Verify sessionStorage is NOT used anymore

**Steps:**
1. Login as User A
2. Submit quote → Timeline appears
3. Open browser DevTools → Application tab → Session Storage
4. **Expected:** NO key named `currentQuoteId`
5. Verify sessionStorage is empty or doesn't have quote-related keys

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 10: Firestore Security Rules (Server-Side Validation)**

**Purpose:** Verify Firestore security rules prevent unauthorized access

**Steps:**
1. Login as User A
2. Submit quote → Get quote ID from console (e.g., "quote123")
3. Logout User A
4. Login as User B
5. Open browser console and try to manually fetch User A's quote:
   ```javascript
   import { doc, getDoc } from 'firebase/firestore';
   import { db } from '@/lib/firebase';
   
   const userADocRef = doc(db, 'users', 'userA_uid');
   const snap = await getDoc(userADocRef);
   console.log(snap.data());
   ```
6. **Expected:** Firestore error: "Missing or insufficient permissions"
7. User B should NOT be able to read User A's document

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 11: Timeline Persistence After Admin Status Update**

**Purpose:** Verify timeline updates in real-time when admin changes status

**Steps:**
1. **User Browser:** Login as User A, submit quote, timeline appears (Status: "Pending")
2. **Admin Browser:** Login as admin, go to `/admin/quotes`
3. **Admin Browser:** Find User A's quote, change status to "Reviewing"
4. **User Browser:** Watch timeline
5. **Expected:** Timeline status updates to "Reviewing" in real-time (no refresh needed)

**Result:** ✅ PASS / ❌ FAIL

---

### **Test 12: No Breaking Changes to Other Pages**

**Purpose:** Verify other pages still work correctly

**Steps:**
1. Navigate to `/admin/quotes`
2. **Expected:** Quote list loads correctly
3. Click "View Details" on any quote
4. **Expected:** Quote details dialog opens with all fields
5. Navigate to `/dashboard`
6. **Expected:** Dashboard loads with user info
7. Navigate to `/products`
8. **Expected:** Products page loads correctly
9. Test cart, wishlist, order tracking
10. **Expected:** All features work normally

**Result:** ✅ PASS / ❌ FAIL

---

## 🐛 Common Issues & Solutions

### **Issue 1: Timeline doesn't appear after login**
**Possible Causes:**
- User has no `activeQuoteId` in Firestore
- Network delay fetching user document

**Debug Steps:**
1. Check browser console for errors
2. Open Firebase Console → `users` collection → Check user's document
3. Verify `activeQuoteId` field exists and has valid quote ID
4. Check Network tab for failed Firestore requests

**Solution:**
- Submit a new quote to create `activeQuoteId`
- Check Firebase connection

---

### **Issue 2: Timeline appears for wrong user**
**Possible Causes:**
- 🚨 CRITICAL BUG - Security vulnerability

**Debug Steps:**
1. Check browser console logs - which user's quote ID is loaded?
2. Open Firebase Console → Verify each user has separate `activeQuoteId`
3. Add console logs to onAuthStateChanged to verify correct user

**Solution:**
- Review `onAuthStateChanged` implementation
- Ensure `currentUser.uid` matches the document being fetched

---

### **Issue 3: Timeline persists after logout**
**Possible Causes:**
- `onAuthStateChanged` not firing
- React state not updating

**Debug Steps:**
1. Check console for "🔒 User logged out" message
2. Verify logout function is calling Firebase `signOut()`
3. Check if `user` is null in AuthContext

**Solution:**
- Ensure `onAuthStateChanged` listener is active
- Verify `setSubmittedQuoteId(null)` is called on logout

---

### **Issue 4: Timeline doesn't persist on refresh**
**Possible Causes:**
- Firestore read failed
- `activeQuoteId` is null in user document

**Debug Steps:**
1. Check browser console for errors
2. Open Firebase Console → Verify `activeQuoteId` exists
3. Check Network tab for Firestore requests

**Solution:**
- Verify quote submission updates user document correctly
- Check Firestore security rules allow read access

---

## 📊 Test Results Summary

```
┌─────────────────────────────────────────────────────────┐
│  Test Case                                   Result     │
├─────────────────────────────────────────────────────────┤
│  1. Basic Quote Submission                   [ ]        │
│  2. Page Refresh Persistence                 [ ]        │
│  3. Navigation Persistence                   [ ]        │
│  4. Close Timeline                           [ ]        │
│  5. User Logout (Security)                   [ ]        │
│  6. Multi-User Security (CRITICAL)           [ ]        │
│  7. Rapid Login/Logout                       [ ]        │
│  8. Cross-Device Sync                        [ ]        │
│  9. SessionStorage Verification              [ ]        │
│  10. Firestore Security Rules                [ ]        │
│  11. Real-time Admin Updates                 [ ]        │
│  12. No Breaking Changes                     [ ]        │
├─────────────────────────────────────────────────────────┤
│  Total Tests:                                12         │
│  Passed:                                     __         │
│  Failed:                                     __         │
│  Success Rate:                               ___%       │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Acceptance Criteria

Before marking this feature as production-ready, verify:

- [ ] All 12 tests pass
- [ ] No TypeScript compilation errors
- [ ] No console errors during normal usage
- [ ] Multi-user security test (Test 6) passes with 100% success
- [ ] Timeline never shows wrong user's data
- [ ] SessionStorage is not used for quote timeline
- [ ] Firestore user documents correctly store `activeQuoteId`
- [ ] Admin panel still functions correctly
- [ ] Dashboard and other pages unaffected
- [ ] Real-time updates work correctly
- [ ] Cross-device sync verified
- [ ] Performance is acceptable (no noticeable delays)

---

## 🚀 Production Readiness Checklist

- [ ] All tests completed and documented
- [ ] Security verified (no cross-user data leakage)
- [ ] Performance tested (Firestore reads are cached)
- [ ] Error handling tested
- [ ] Edge cases covered
- [ ] Documentation complete
- [ ] Code reviewed
- [ ] TypeScript compilation successful
- [ ] Git commit created
- [ ] Deployed to staging environment
- [ ] Tested in staging
- [ ] Ready for production deployment

---

## 📝 Test Log Template

Use this template to record test results:

```
Test Date: _______________
Tester: _______________
Environment: Development / Staging / Production
Browser: Chrome / Firefox / Safari / Edge

Test 1: Basic Quote Submission
Status: PASS / FAIL
Notes: _______________

Test 2: Page Refresh Persistence
Status: PASS / FAIL
Notes: _______________

Test 3: Navigation Persistence
Status: PASS / FAIL
Notes: _______________

Test 4: Close Timeline
Status: PASS / FAIL
Notes: _______________

Test 5: User Logout
Status: PASS / FAIL
Notes: _______________

Test 6: Multi-User Security ⚠️ CRITICAL
Status: PASS / FAIL
Notes: _______________

Test 7: Rapid Login/Logout
Status: PASS / FAIL
Notes: _______________

Test 8: Cross-Device Sync
Status: PASS / FAIL
Notes: _______________

Test 9: SessionStorage Verification
Status: PASS / FAIL
Notes: _______________

Test 10: Firestore Security Rules
Status: PASS / FAIL
Notes: _______________

Test 11: Real-time Admin Updates
Status: PASS / FAIL
Notes: _______________

Test 12: No Breaking Changes
Status: PASS / FAIL
Notes: _______________

Overall Result: PASS / FAIL
Comments: _______________
```

---

**Testing Guide Complete! 🧪**

Follow this guide to thoroughly validate the security fix before deploying to production.
