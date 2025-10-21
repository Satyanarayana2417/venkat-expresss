# ✅ Google Maps Geolocation - Deployment Checklist

Use this checklist to deploy your geolocation feature step by step.

---

## 📋 Pre-Deployment Setup

### Google Cloud Console Setup
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project or select existing project
  - Project name: _______________________
  - Project ID: _______________________
- [ ] Navigate to "APIs & Services" > "Library"
- [ ] Search for "Geocoding API"
- [ ] Click "Enable" button
- [ ] Wait for confirmation (may take 30 seconds)
- [ ] Navigate to "APIs & Services" > "Credentials"
- [ ] Click "Create Credentials" > "API Key"
- [ ] Copy API key: _______________________
- [ ] Click on API key to edit restrictions
- [ ] Under "API restrictions", select "Restrict key"
- [ ] Choose "Geocoding API" from dropdown
- [ ] Click "Save"

### Firebase CLI Setup
- [ ] Open PowerShell/Terminal
- [ ] Check if Firebase CLI is installed: `firebase --version`
  - If not installed, run: `npm install -g firebase-tools`
- [ ] Login to Firebase: `firebase login`
- [ ] List projects: `firebase projects:list`
- [ ] Verify correct project is selected
  - If not, run: `firebase use <project-id>`
- [ ] Note your project ID: _______________________

---

## 🔧 Installation & Configuration

### Install Dependencies
```powershell
# Navigate to functions directory
cd functions

# Install all packages
npm install

# Wait for completion (may take 1-2 minutes)
```

**Verification Steps:**
- [ ] No errors in npm install output
- [ ] `node_modules` folder created in `functions/`
- [ ] Check package versions:
  - [ ] firebase-admin: ^12.0.0
  - [ ] firebase-functions: ^4.5.0
  - [ ] axios: ^1.6.0

### Configure Google Maps API Key
```powershell
# Replace YOUR_API_KEY_HERE with your actual key
firebase functions:config:set google.maps_api_key="YOUR_API_KEY_HERE"
```

**Verification Steps:**
- [ ] Command completed without errors
- [ ] Verify configuration was saved:
  ```powershell
  firebase functions:config:get
  ```
- [ ] Expected output:
  ```json
  {
    "google": {
      "maps_api_key": "YOUR_API_KEY_HERE"
    }
  }
  ```

---

## 🚀 Deployment

### Deploy Cloud Functions
```powershell
# From project root or functions directory
firebase deploy --only functions
```

**Expected Output:**
```
✔  functions: Finished running predeploy script.
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
✔  functions: required API cloudfunctions.googleapis.com is enabled
✔  functions: required API cloudbuild.googleapis.com is enabled
i  functions: preparing functions directory for uploading...
i  functions: packaged functions (X files) for uploading
✔  functions: functions folder uploaded successfully
i  functions: creating Node.js 18 function reverseGeocode(us-central1)...
i  functions: creating Node.js 18 function reverseGeocodeHTTP(us-central1)...
✔  functions[reverseGeocode(us-central1)]: Successful create operation.
✔  functions[reverseGeocodeHTTP(us-central1)]: Successful create operation.

✔  Deploy complete!

Functions:
  reverseGeocode(us-central1)
    https://us-central1-YOUR-PROJECT.cloudfunctions.net/reverseGeocode
  reverseGeocodeHTTP(us-central1)
    https://us-central1-YOUR-PROJECT.cloudfunctions.net/reverseGeocodeHTTP
```

**Verification Steps:**
- [ ] No errors in deployment output
- [ ] Both functions deployed successfully
- [ ] Function URLs displayed
- [ ] Copy function URLs for reference:
  - reverseGeocode: _______________________
  - reverseGeocodeHTTP: _______________________

### Verify Deployment
```powershell
# List all deployed functions
firebase functions:list
```

**Verification Steps:**
- [ ] Both functions appear in list
- [ ] Status shows as "ACTIVE"
- [ ] No errors or warnings

### Check Firebase Console
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select your project
- [ ] Navigate to "Functions" in left sidebar
- [ ] Verify both functions are listed:
  - [ ] reverseGeocode
  - [ ] reverseGeocodeHTTP
- [ ] Check "Usage" tab (may take a few minutes to populate)

---

## 🧪 Testing

### Browser Testing - Desktop

#### Test 1: Happy Path (Chrome)
- [ ] Open Chrome browser
- [ ] Navigate to your app: http://localhost:5173 (or production URL)
- [ ] Log in to your account
- [ ] Navigate to Cart page: `/cart`
- [ ] Click "Change" button next to delivery address
- [ ] Address Selection Modal opens
- [ ] Click "Use my current location" button
- [ ] Browser permission dialog appears
- [ ] Click "Allow"
- [ ] Toast appears: "Getting your location..."
- [ ] Wait 3-5 seconds
- [ ] Toast appears: "Location acquired! Lat: X, Lng: Y"
- [ ] Toast appears: "Calling geocoding service..."
- [ ] Toast appears: "Address detected successfully!"
- [ ] Redirected to: `/account/addresses?action=add&prefill=true`
- [ ] Address form displays with pre-filled fields:
  - [ ] Pincode: filled
  - [ ] Locality: filled
  - [ ] Address: filled
  - [ ] City: filled
  - [ ] State: filled
- [ ] Fill in Name field
- [ ] Fill in Mobile Number field
- [ ] Select address type (Home/Work)
- [ ] Click "SAVE" button
- [ ] Toast appears: "Home address saved successfully!"
- [ ] Address appears in saved addresses list
- [ ] Go back to Cart page
- [ ] Verify address can be selected

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

#### Test 2: Permission Denied
- [ ] Open Chrome (or Firefox)
- [ ] Navigate to Cart > Address Modal
- [ ] Click "Use my current location"
- [ ] Click "Block" on permission dialog
- [ ] Toast appears: "Location permission denied..."
- [ ] No further errors
- [ ] Modal still open and functional

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

#### Test 3: Repeat with Different Browsers
- [ ] Firefox
  - [ ] Happy path works
  - [ ] Permission denied handled
- [ ] Edge (or Safari if on Mac)
  - [ ] Happy path works
  - [ ] Permission denied handled

### Browser Testing - Mobile

#### Test 4: Mobile Browser (Chrome/Safari)
- [ ] Open browser on mobile device
- [ ] Navigate to app
- [ ] Follow same happy path as Test 1
- [ ] Verify GPS location is more accurate on mobile
- [ ] Verify UI is responsive
- [ ] Verify buttons are tap-friendly

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

### DevTools Testing

#### Test 5: Console Logs
- [ ] Open Chrome DevTools (F12)
- [ ] Go to Console tab
- [ ] Clear console
- [ ] Click "Use my current location"
- [ ] Grant permission
- [ ] Verify console logs appear in order:
  1. "Getting your location..."
  2. "Location acquired! Lat: X, Lng: Y"
  3. "Calling geocoding function..."
  4. "Geocoding result: {...}"
  5. "Navigating to address management..."
- [ ] No red errors in console

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

#### Test 6: Network Tab
- [ ] Open DevTools > Network tab
- [ ] Clear network log
- [ ] Click "Use my current location"
- [ ] Verify network requests:
  - [ ] Firebase Auth request (if applicable)
  - [ ] Cloud Function call to `reverseGeocode`
  - [ ] Response status: 200 OK
  - [ ] Response contains address data
- [ ] Check response time (should be < 3 seconds)

**Result**: ✅ Pass / ❌ Fail
**Response Time**: _______ ms
**Notes**: _______________________

#### Test 7: SessionStorage
- [ ] Open DevTools > Application tab
- [ ] Navigate to Storage > Session Storage
- [ ] Click "Use my current location"
- [ ] After address detected, verify sessionStorage contains:
  - Key: `detectedAddress`
  - Value: JSON with address fields
- [ ] Navigate to address page
- [ ] Verify sessionStorage is cleared (key removed)

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

### Error Scenarios

#### Test 8: Location Services Off
- [ ] Disable location services on device/browser
- [ ] Click "Use my current location"
- [ ] Verify toast: "Unable to determine your location..."
- [ ] No JavaScript errors

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

#### Test 9: Network Offline
- [ ] Enable offline mode in DevTools (Network tab)
- [ ] Click "Use my current location"
- [ ] Verify appropriate error message
- [ ] Disable offline mode
- [ ] Verify feature works again

**Result**: ✅ Pass / ❌ Fail
**Notes**: _______________________

### Function Logs

#### Test 10: Check Cloud Function Logs
```powershell
# View recent logs
firebase functions:log --only reverseGeocode --limit 10
```

**Verification Steps:**
- [ ] Logs show successful invocations
- [ ] No error logs
- [ ] Response times are reasonable (< 3s)
- [ ] Coordinates logged correctly
- [ ] Addresses returned successfully

**Result**: ✅ Pass / ❌ Fail
**Average Response Time**: _______ ms
**Notes**: _______________________

---

## 📊 Post-Deployment Monitoring

### Google Cloud Console
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Navigate to "APIs & Services" > "Dashboard"
- [ ] Click on "Geocoding API"
- [ ] Check "Metrics" tab:
  - [ ] Requests today: _______
  - [ ] Errors: _______
  - [ ] Latency: _______ ms
- [ ] Set up billing alerts (optional but recommended):
  - [ ] Go to "Billing" > "Budgets & alerts"
  - [ ] Create budget alert at $50, $100, $200

### Firebase Console
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Navigate to "Functions"
- [ ] Check dashboard metrics:
  - [ ] Invocations today: _______
  - [ ] Error rate: _______%
  - [ ] Active instances: _______
  - [ ] Average execution time: _______ ms
- [ ] Navigate to "Performance" (optional)
  - [ ] Check page load times
  - [ ] Check network request times

### Firestore Data
- [ ] Go to Firebase Console > "Firestore Database"
- [ ] Navigate to: `users` > (select a user) > `addresses`
- [ ] Verify addresses have:
  - [ ] All required fields populated
  - [ ] Coordinates field with lat/lng
  - [ ] Formatted address field
  - [ ] Correct city, state, pincode

---

## 🔒 Security Audit

### API Key Security
- [ ] Verify API key is NOT in frontend code:
  ```powershell
  # Search codebase for API key
  cd src
  grep -r "YOUR_API_KEY" .
  # Should return NO results
  ```
- [ ] Verify API key is in Firebase config only:
  ```powershell
  firebase functions:config:get
  # Should show: google.maps_api_key
  ```
- [ ] Check Google Cloud Console:
  - [ ] API key is restricted to Geocoding API only
  - [ ] No IP restrictions needed (server-to-server)

### Authentication
- [ ] Verify unauthenticated users cannot call function:
  - [ ] Log out of app
  - [ ] Try to use geolocation feature
  - [ ] Should show login prompt or error

### Input Validation
- [ ] Test with invalid coordinates:
  ```javascript
  // In browser console (for testing only):
  const functions = getFunctions();
  const fn = httpsCallable(functions, 'reverseGeocode');
  fn({ latitude: 999, longitude: 999 });
  // Should return error: invalid-argument
  ```

---

## 💰 Cost Monitoring

### Initial Setup
- [ ] Note starting quota:
  - Google Maps: $200/month free
  - Firebase Functions: 2M invocations/month free
- [ ] Estimate monthly usage:
  - Expected users: _______
  - % using geolocation: _______%
  - Estimated requests: _______
- [ ] Calculate estimated cost: $_______

### Weekly Check (First Month)
- [ ] Week 1: Check API usage
  - Requests: _______
  - Cost: $_______
- [ ] Week 2: Check API usage
  - Requests: _______
  - Cost: $_______
- [ ] Week 3: Check API usage
  - Requests: _______
  - Cost: $_______
- [ ] Week 4: Check API usage
  - Requests: _______
  - Cost: $_______

### Alerts Configured
- [ ] Billing alert at 50% of free tier ($100)
- [ ] Billing alert at 80% of free tier ($160)
- [ ] Billing alert at 100% of free tier ($200)
- [ ] Email notifications enabled

---

## 📝 Documentation Review

### Code Documentation
- [ ] All functions have JSDoc comments
- [ ] Complex logic has inline comments
- [ ] README updated with geolocation feature

### User Documentation (Optional)
- [ ] Help text added to UI
- [ ] FAQ entry created
- [ ] User guide updated

### Team Documentation
- [ ] Team notified of new feature
- [ ] Documentation shared:
  - [ ] GEOLOCATION_DEPLOYMENT_GUIDE.md
  - [ ] GEOLOCATION_GOOGLE_MAPS_QUICK_REF.md
  - [ ] GEOLOCATION_IMPLEMENTATION_SUMMARY.md
  - [ ] GEOLOCATION_VISUAL_ARCHITECTURE.md

---

## 🎉 Launch Checklist

### Final Pre-Launch
- [ ] All tests passing ✅
- [ ] No console errors ✅
- [ ] Mobile responsive ✅
- [ ] All browsers tested ✅
- [ ] Error handling verified ✅
- [ ] Security audit complete ✅
- [ ] Monitoring configured ✅
- [ ] Documentation complete ✅

### Launch
- [ ] Feature enabled in production
- [ ] Announcement sent (if applicable)
- [ ] Support team notified
- [ ] Monitoring dashboard open

### Post-Launch (First 24 Hours)
- [ ] Monitor function logs every 2 hours
- [ ] Check error rate in Firebase Console
- [ ] Review user feedback
- [ ] Check API usage in Google Cloud
- [ ] Verify no unexpected costs

### Post-Launch (First Week)
- [ ] Daily monitoring for 7 days
- [ ] Collect user feedback
- [ ] Address any issues immediately
- [ ] Optimize if needed (e.g., caching)

---

## 🐛 Issue Tracking

### Known Issues
| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| _____ | _____ | _____ | _____ |
| _____ | _____ | _____ | _____ |

### Support Tickets
| Ticket # | Description | Status | Resolution |
|----------|-------------|--------|------------|
| _____ | _____ | _____ | _____ |
| _____ | _____ | _____ | _____ |

---

## ✅ Final Sign-Off

**Deployed By**: _______________________
**Date**: _______________________
**Time**: _______________________
**Environment**: ⬜ Development ⬜ Staging ⬜ Production

**Sign-Off:**
- [ ] Developer: _____________ Date: _______
- [ ] QA: _____________ Date: _______
- [ ] Product Owner: _____________ Date: _______

**Rollback Plan (if issues occur):**
```powershell
# Delete functions
firebase functions:delete reverseGeocode
firebase functions:delete reverseGeocodeHTTP

# Revert frontend code
git revert <commit-hash>
```

---

## 📞 Support Contacts

**Google Cloud Support**: [console.cloud.google.com/support](https://console.cloud.google.com/support)
**Firebase Support**: [firebase.google.com/support](https://firebase.google.com/support)
**Internal Team Contact**: _______________________

---

**Checklist Version**: 1.0
**Last Updated**: January 2025
**Status**: Ready for use

---

## 🎯 Quick Reference

**3-Command Deployment:**
```powershell
cd functions; npm install
firebase functions:config:set google.maps_api_key="YOUR_KEY"
firebase deploy --only functions
```

**View Logs:**
```powershell
firebase functions:log --follow
```

**Test URL:**
```
http://localhost:5173/cart
```

**Documentation:**
- Full guide: `GEOLOCATION_DEPLOYMENT_GUIDE.md`
- Quick ref: `GEOLOCATION_GOOGLE_MAPS_QUICK_REF.md`
- Summary: `GEOLOCATION_IMPLEMENTATION_SUMMARY.md`
- Architecture: `GEOLOCATION_VISUAL_ARCHITECTURE.md`

---

**Good luck with your deployment! 🚀**
