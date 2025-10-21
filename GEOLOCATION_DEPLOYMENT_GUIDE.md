# 🚀 Google Maps Geolocation - Deployment Guide

## Overview
This guide covers deploying the secure Google Maps geocoding backend and testing the geolocation feature end-to-end.

---

## 📋 Prerequisites

### 1. Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Geocoding API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click "Enable"
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
5. Restrict the API key (recommended):
   - Click on the API key to edit
   - Under "API restrictions", select "Restrict key"
   - Choose "Geocoding API" from the dropdown
   - Save changes

### 2. Firebase CLI
```powershell
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Verify you're in the correct project
firebase projects:list
```

---

## 🔧 Step 1: Install Dependencies

```powershell
# Navigate to functions directory
cd functions

# Install all dependencies
npm install

# Expected packages:
# - firebase-admin: ^12.0.0
# - firebase-functions: ^4.5.0
# - axios: ^1.6.0
```

---

## 🔐 Step 2: Configure Google Maps API Key

```powershell
# Set the API key in Firebase Functions config
firebase functions:config:set google.maps_api_key="YOUR_GOOGLE_MAPS_API_KEY"

# Verify the configuration
firebase functions:config:get

# Expected output:
# {
#   "google": {
#     "maps_api_key": "YOUR_GOOGLE_MAPS_API_KEY"
#   }
# }
```

### Alternative: Use .env file (for local development)

Create `functions/.env`:
```
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Then update `functions/src/geocoding.ts` to read from environment:
```typescript
const apiKey = process.env.GOOGLE_MAPS_API_KEY || functions.config().google?.maps_api_key;
```

---

## 🚀 Step 3: Deploy Functions

```powershell
# Deploy only the functions (faster)
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:reverseGeocode

# Or deploy everything
firebase deploy
```

### Expected Output:
```
✔  Deploy complete!

Functions:
  reverseGeocode(us-central1): https://us-central1-YOUR-PROJECT.cloudfunctions.net/reverseGeocode
  reverseGeocodeHTTP(us-central1): https://us-central1-YOUR-PROJECT.cloudfunctions.net/reverseGeocodeHTTP
```

---

## 🧪 Step 4: Test the Deployment

### Test 1: Verify Function is Deployed
```powershell
firebase functions:list
```

Expected:
- `reverseGeocode` (callable)
- `reverseGeocodeHTTP` (https)

### Test 2: Test with Firebase Emulator (Local Testing)
```powershell
# Start the emulator
cd functions
npm run serve

# Or from root directory
firebase emulators:start --only functions
```

Update frontend to use emulator:
```typescript
// In AddressSelectionModal.tsx temporarily add:
import { connectFunctionsEmulator } from 'firebase/functions';

const functions = getFunctions();
connectFunctionsEmulator(functions, 'localhost', 5001); // Add this line
```

### Test 3: Test HTTP Endpoint
```powershell
# Replace with your actual Cloud Function URL
$url = "https://us-central1-YOUR-PROJECT.cloudfunctions.net/reverseGeocodeHTTP"
$body = @{
    latitude = 12.9716
    longitude = 77.5946
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method POST -Body $body -ContentType "application/json" -Headers @{
    "Authorization" = "Bearer YOUR_FIREBASE_ID_TOKEN"
}
```

Expected Response:
```json
{
  "flatBuilding": "123",
  "areaStreet": "MG Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "landmark": "",
  "formattedAddress": "123, MG Road, Bangalore, Karnataka 560001, India",
  "coordinates": {
    "lat": 12.9716,
    "lng": 77.5946
  }
}
```

---

## 🖥️ Step 5: Frontend Integration

The frontend is already integrated! No code changes needed. The following files are ready:

### Files Already Updated:
1. ✅ **AddressSelectionModal.tsx**: Calls `reverseGeocode` callable function
2. ✅ **AddressManagement.tsx**: Reads sessionStorage and pre-fills form
3. ✅ **AddAddressModal.tsx**: Accepts and displays pre-filled data

### Verify Integration:
1. Open browser DevTools > Console
2. Navigate to Cart page
3. Click "Change" on delivery address
4. Click "Use my current location"
5. Check console logs:
   - "Getting your location..."
   - "Location acquired! Lat: X, Lng: Y"
   - "Calling geocoding function..."
   - "Address detected successfully!"

---

## ✅ Step 6: End-to-End Testing

### Test Scenario 1: Happy Path
1. **Navigate to Cart**: Go to `/cart`
2. **Open Address Modal**: Click "Change" button
3. **Click Geolocation**: Click "Use my current location" button
4. **Grant Permission**: Allow browser to access location
5. **Wait for Loading**: See "Getting your location..." toast
6. **Verify Address Detected**: See "Address detected successfully!" toast
7. **Redirect to Form**: Verify navigation to `/account/addresses?action=add&prefill=true`
8. **Check Pre-fill**: Verify form fields are filled with detected address
9. **Complete Form**: Fill in name and mobile number
10. **Save Address**: Click "SAVE" button
11. **Verify Saved**: See success toast and address appears in list

### Test Scenario 2: Permission Denied
1. Open address modal
2. Click "Use my current location"
3. Click "Block" on browser permission prompt
4. **Expected**: Toast error "Location permission denied. Please enable location access."

### Test Scenario 3: Timeout
1. Open address modal
2. Click "Use my current location"
3. Turn off device location or use weak GPS signal
4. Wait 15 seconds
5. **Expected**: Toast error "Location request timed out. Please try again."

### Test Scenario 4: Network Error
1. Disable internet connection
2. Click "Use my current location"
3. **Expected**: Toast error "Network error. Please check your connection."

### Test Scenario 5: API Error
1. Temporarily remove API key: `firebase functions:config:unset google.maps_api_key`
2. Redeploy: `firebase deploy --only functions`
3. Click "Use my current location"
4. **Expected**: Toast error "Geocoding service unavailable."

---

## 🐛 Troubleshooting

### Issue: Function Not Found
**Error**: `Function 'reverseGeocode' not found`

**Solution**:
```powershell
# Re-deploy functions
firebase deploy --only functions

# Verify deployment
firebase functions:list
```

### Issue: Unauthenticated Error
**Error**: `{"code": "unauthenticated", "message": "User must be authenticated"}`

**Solution**:
- Ensure user is logged in before clicking geolocation button
- Check Firebase Auth is initialized correctly
- Verify `onAuthStateChanged` is working

### Issue: CORS Error
**Error**: `Access to fetch at 'https://...' has been blocked by CORS policy`

**Solution**:
- This shouldn't happen with callable functions
- If using HTTP endpoint, add CORS configuration:
```typescript
import * as cors from 'cors';
const corsHandler = cors({ origin: true });

export const reverseGeocodeHTTP = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    // ... existing code
  });
});
```

### Issue: API Key Invalid
**Error**: `{"code": "not-found", "message": "Unable to detect address"}`

**Solution**:
```powershell
# Check config
firebase functions:config:get

# Reset API key
firebase functions:config:set google.maps_api_key="NEW_API_KEY"
firebase deploy --only functions
```

### Issue: High Accuracy Not Working
**Symptoms**: Address is inaccurate or very generalized

**Solution**:
- Ensure device has GPS enabled (not just Wi-Fi location)
- Test outdoors for better GPS signal
- Check browser console for geolocation errors
- Verify `enableHighAccuracy: true` is set (already done)

### Issue: Pre-fill Not Working
**Symptoms**: Form is empty after navigation

**Solution**:
1. Check browser console for sessionStorage:
```javascript
console.log(sessionStorage.getItem('detectedAddress'));
```
2. Verify URL has query params: `/account/addresses?action=add&prefill=true`
3. Check `AddressManagement.tsx` useEffect is triggering
4. Verify `prefillData` prop is passed to `AddAddressModal`

---

## 📊 Monitoring & Logging

### View Function Logs
```powershell
# View all logs
firebase functions:log

# Filter by function name
firebase functions:log --only reverseGeocode

# Follow logs in real-time
firebase functions:log --follow
```

### Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to "Functions" section
4. Click on function name to see:
   - Invocation count
   - Error rate
   - Execution time
   - Logs

### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "Cloud Functions"
4. Click on function name
5. View detailed metrics:
   - Invocations per second
   - Memory usage
   - Active instances
   - Error reporting

---

## 💰 Cost Estimation

### Google Maps Geocoding API
- **Free Tier**: $200 credit per month (≈ 40,000 requests)
- **After Free Tier**: $5 per 1,000 requests

### Firebase Cloud Functions
- **Free Tier** (Spark Plan):
  - 2M invocations/month
  - 400,000 GB-sec compute time
  - 200,000 CPU-sec compute time
- **Paid Tier** (Blaze Plan):
  - First 2M invocations free, then $0.40 per million
  - Compute time: $0.0000025 per GB-sec

### Example Cost Calculation
**Assumptions**: 1,000 users/month, 50% use geolocation once

- **Requests**: 500 geocoding calls/month
- **Google Maps Cost**: $0 (within free tier)
- **Firebase Functions Cost**: $0 (within free tier)
- **Total Monthly Cost**: $0

**High Traffic Scenario**: 100,000 requests/month
- **Google Maps Cost**: (100,000 - 40,000) × $5/1000 = $300/month
- **Firebase Functions Cost**: ~$0.40 (within free invocations)
- **Total Monthly Cost**: ~$300/month

---

## 🔒 Security Best Practices

### ✅ Already Implemented:
1. **Server-side API Key**: API key never exposed to client
2. **Authentication Required**: Only logged-in users can call function
3. **Input Validation**: Latitude/longitude validated server-side
4. **Error Handling**: Comprehensive error messages without exposing internals
5. **Rate Limiting**: Firebase Functions has built-in rate limiting

### 🚀 Additional Recommendations:
1. **API Key Restrictions** (already covered in Prerequisites)
2. **Quota Monitoring**:
   - Set up billing alerts in Google Cloud Console
   - Monitor daily API usage
3. **Request Logging**:
   - Already implemented in function logs
4. **User-based Rate Limiting** (optional):
```typescript
import { RateLimiter } from 'limiter';
const limiter = new RateLimiter({ tokensPerInterval: 10, interval: "hour" });

export const reverseGeocode = functions.https.onCall(async (data, context) => {
  const userId = context.auth?.uid;
  if (!await limiter.removeTokens(1)) {
    throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
  }
  // ... rest of code
});
```

---

## 📝 Deployment Checklist

- [ ] Google Cloud project created
- [ ] Geocoding API enabled
- [ ] API key created and restricted
- [ ] Firebase CLI installed and logged in
- [ ] Dependencies installed (`npm install` in functions/)
- [ ] API key configured (`firebase functions:config:set`)
- [ ] Functions deployed (`firebase deploy --only functions`)
- [ ] Function URLs verified (check Firebase Console)
- [ ] Local testing with emulator (optional)
- [ ] HTTP endpoint tested (optional)
- [ ] End-to-end browser testing completed
- [ ] Error scenarios tested
- [ ] Billing alerts set up (recommended)
- [ ] Monitoring dashboard reviewed

---

## 🎉 Success!

Your Google Maps geolocation feature is now live! Users can:
1. Click "Use my current location" on the cart page
2. Grant browser permission for location access
3. See their accurate address detected with Google Maps
4. Have the address form pre-filled automatically
5. Complete name/phone and save to their account

**Next Steps**:
- Monitor function logs for any errors
- Check Google Maps API usage in Cloud Console
- Gather user feedback on accuracy
- Consider adding address validation/verification

---

## 📚 Additional Resources

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Google Maps Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Firebase Functions Pricing](https://firebase.google.com/pricing)
- [Google Maps Pricing](https://mapsplatform.google.com/pricing/)
- [Browser Geolocation API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: ✅ Ready for Production
