# 🚀 Google Maps Address Geolocation - Quick Reference

## 3-Step Deployment

```powershell
# 1. Install dependencies
cd functions; npm install

# 2. Configure API key
firebase functions:config:set google.maps_api_key="YOUR_GOOGLE_MAPS_API_KEY"

# 3. Deploy
firebase deploy --only functions
```

---

## Quick Test Flow

1. Navigate to `/cart`
2. Click "Change" address button
3. Click "Use my current location"
4. Grant browser permission
5. Wait for "Address detected successfully!" toast
6. Verify redirect to `/account/addresses?action=add&prefill=true`
7. Check form is pre-filled with detected address
8. Complete name and phone
9. Click "SAVE"

---

## File Changes Summary

### New Files Created:
```
functions/
├── src/
│   ├── geocoding.ts          # ✨ Cloud Function (300+ lines)
│   └── index.ts               # ✨ Exports
├── package.json               # ✨ Dependencies
├── tsconfig.json              # ✨ TypeScript config
└── .gitignore                 # ✨ Git ignore
```

### Modified Files:
```
src/
├── components/
│   ├── AddressSelectionModal.tsx   # ✏️ Enhanced with Firebase callable
│   └── AddAddressModal.tsx         # ✏️ Added prefillData prop
└── pages/
    └── AddressManagement.tsx       # ✏️ Pre-fill logic added
```

---

## Key Features Implemented

✅ **Secure Backend**
- API key stored server-side
- Firebase Cloud Function for geocoding
- Authentication required

✅ **High Accuracy Geolocation**
- `enableHighAccuracy: true`
- 15-second timeout
- GPS-level precision

✅ **Smart Pre-fill**
- SessionStorage mechanism
- URL query parameters
- Auto-clear after read

✅ **Comprehensive Error Handling**
- Permission denied
- Position unavailable
- Timeout
- Network errors
- API errors

✅ **User Experience**
- Multiple toast notifications
- Loading states
- Clear error messages
- Smooth navigation

---

## Data Flow Diagram

```
[Cart Page]
    ↓ User clicks "Change"
[Address Selection Modal]
    ↓ User clicks "Use my current location"
[Browser Geolocation API]
    ↓ Returns { lat, lng }
[Firebase Callable Function: reverseGeocode]
    ↓ Calls Google Maps API server-side
[Google Maps Geocoding API]
    ↓ Returns address components
[Parse & Structure Address]
    ↓ Store in sessionStorage
[Navigate to /account/addresses?action=add&prefill=true]
    ↓ Read sessionStorage
[Pre-fill Address Form]
    ↓ User completes & saves
[Firestore: /users/{userId}/addresses]
```

---

## Cloud Function Details

### Function Name: `reverseGeocode`
- **Type**: Callable (secure, authenticated)
- **Region**: us-central1 (default)
- **Runtime**: Node.js 18
- **Timeout**: 60 seconds
- **Memory**: 256MB

### Input:
```typescript
{
  latitude: number,   // -90 to 90
  longitude: number   // -180 to 180
}
```

### Output:
```typescript
{
  flatBuilding: string,
  areaStreet: string,
  city: string,
  state: string,
  pincode: string,
  landmark: string,
  formattedAddress: string,
  coordinates: { lat: number, lng: number }
}
```

---

## Error Codes Reference

### Geolocation Errors (Frontend)
| Code | Name | Meaning | User Message |
|------|------|---------|--------------|
| 1 | PERMISSION_DENIED | User blocked location | "Please enable location access" |
| 2 | POSITION_UNAVAILABLE | GPS/Location off | "Unable to determine location" |
| 3 | TIMEOUT | >15 seconds | "Request timed out" |

### Cloud Function Errors (Backend)
| Code | Meaning | User Message |
|------|---------|--------------|
| unauthenticated | Not logged in | "Please log in first" |
| invalid-argument | Bad lat/lng | "Invalid location data" |
| not-found | No address found | "Unable to detect address" |
| deadline-exceeded | API timeout | "Request took too long" |

---

## Common Commands

```powershell
# View current config
firebase functions:config:get

# Update API key
firebase functions:config:set google.maps_api_key="NEW_KEY"

# Deploy functions
firebase deploy --only functions

# View logs
firebase functions:log

# Follow logs real-time
firebase functions:log --follow

# List deployed functions
firebase functions:list

# Test with emulator
firebase emulators:start --only functions
```

---

## API Usage & Costs

### Google Maps Geocoding API
- **Free Tier**: $200 credit/month (≈40,000 requests)
- **Beyond Free**: $5 per 1,000 requests
- **Monthly Limit**: Set in Google Cloud Console

### Firebase Cloud Functions
- **Free Tier**: 2 million invocations/month
- **Beyond Free**: $0.40 per million invocations
- **Compute**: Included in free tier for typical usage

### Example Costs:
| Monthly Users | Requests | Google Maps | Firebase | Total |
|---------------|----------|-------------|----------|-------|
| 100 | 50 | $0 | $0 | $0 |
| 1,000 | 500 | $0 | $0 | $0 |
| 10,000 | 5,000 | $0 | $0 | $0 |
| 100,000 | 50,000 | $50 | $0 | $50 |
| 1,000,000 | 500,000 | $2,300 | $0.40 | $2,300 |

---

## Security Features

✅ **Implemented:**
- [x] API key server-side only
- [x] User authentication required
- [x] Input validation (lat/lng)
- [x] Secure HTTPS only
- [x] Error messages sanitized
- [x] No sensitive data in logs

🚀 **Recommended:**
- [ ] Restrict API key to Geocoding API only
- [ ] Set up billing alerts
- [ ] Monitor daily quota usage
- [ ] Implement per-user rate limiting (optional)

---

## Troubleshooting

### "Function not found"
```powershell
firebase deploy --only functions
firebase functions:list
```

### "User must be authenticated"
- Ensure user is logged in
- Check Firebase Auth initialization
- Verify auth state is loaded

### "Unable to detect address"
- Check API key is set correctly
- Verify Geocoding API is enabled
- Check Google Cloud Console for errors
- Review function logs: `firebase functions:log`

### "Address not pre-filling"
1. Open DevTools Console
2. Check: `sessionStorage.getItem('detectedAddress')`
3. Verify URL: `/account/addresses?action=add&prefill=true`
4. Check network tab for function call
5. Review console errors

### "Permission denied"
- User must manually enable location in browser
- Show instructions: Settings > Privacy > Location
- Test in different browser

---

## Browser Compatibility

| Browser | Geolocation API | Status |
|---------|----------------|--------|
| Chrome 5+ | ✅ Full support | Recommended |
| Firefox 3.5+ | ✅ Full support | Recommended |
| Safari 5+ | ✅ Full support | Recommended |
| Edge 12+ | ✅ Full support | Recommended |
| Opera 10.6+ | ✅ Full support | Recommended |
| IE 9+ | ⚠️ Basic support | Limited |

**Note**: HTTPS required for geolocation in modern browsers

---

## Testing Checklist

### Pre-deployment:
- [ ] Firebase CLI installed
- [ ] Google Maps API key obtained
- [ ] Geocoding API enabled
- [ ] API key configured in Firebase
- [ ] Functions deployed successfully
- [ ] Deployment logs reviewed

### Post-deployment:
- [ ] Function appears in Firebase Console
- [ ] Function logs are clean
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari/Edge
- [ ] Test on mobile devices
- [ ] Test permission grant
- [ ] Test permission deny
- [ ] Test timeout scenario
- [ ] Test network error
- [ ] Test form pre-fill
- [ ] Test address save

---

## Quick Links

- 📖 [Full Deployment Guide](./GEOLOCATION_DEPLOYMENT_GUIDE.md)
- 🔗 [Firebase Console](https://console.firebase.google.com/)
- 🗺️ [Google Cloud Console](https://console.cloud.google.com/)
- 📚 [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- 🌐 [Google Maps API Docs](https://developers.google.com/maps/documentation/geocoding)

---

## Support & Resources

### Documentation Files:
- `GEOLOCATION_DEPLOYMENT_GUIDE.md` - Complete deployment steps
- `ADDRESS_SELECTION_MODAL_IMPLEMENTATION.md` - Full implementation details
- `ADDRESS_SELECTION_MODAL_QUICK_REF.md` - Original modal documentation
- `GEOLOCATION_GOOGLE_MAPS_QUICK_REF.md` - This file

### Code Locations:
- **Backend**: `functions/src/geocoding.ts`
- **Frontend Modal**: `src/components/AddressSelectionModal.tsx`
- **Address Form**: `src/components/AddAddressModal.tsx`
- **Pre-fill Logic**: `src/pages/AddressManagement.tsx`

---

**Implementation Status**: ✅ Complete (Pending Deployment)
**Version**: 1.0
**Last Updated**: January 2025
**Ready for Production**: Yes
