# 🗺️ Google Maps Geolocation - Visual Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │              Cart Page (/cart)                        │    │
│  │                                                       │    │
│  │  [Deliver to John Doe, 123 Main St...]              │    │
│  │         [Change] ← User clicks here                  │    │
│  └───────────────────────────────────────────────────────┘    │
│                        ↓                                        │
│  ┌───────────────────────────────────────────────────────┐    │
│  │      Address Selection Modal (Component)             │    │
│  │                                                       │    │
│  │  ○ Home Address (123 Main St)                        │    │
│  │  ○ Work Address (456 Office Rd)                      │    │
│  │                                                       │    │
│  │  📍 [Use my current location] ← User clicks          │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER GEOLOCATION API                      │
│                                                                 │
│  navigator.geolocation.getCurrentPosition({                     │
│    enableHighAccuracy: true,  ← GPS-level precision            │
│    timeout: 15000,            ← 15 second max wait             │
│    maximumAge: 0              ← No caching, fresh data         │
│  })                                                             │
│                                                                 │
│  Returns: { lat: 12.9716, lng: 77.5946 }                       │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                   FIREBASE CALLABLE FUNCTION                    │
│                    (Client-Side Call)                           │
│                                                                 │
│  const reverseGeocode = httpsCallable(functions, 'reverseGeocode');│
│  const result = await reverseGeocode({                          │
│    latitude: 12.9716,                                           │
│    longitude: 77.5946                                           │
│  });                                                            │
│                                                                 │
│  ✅ Automatic authentication (Firebase Auth token)             │
│  ✅ HTTPS encrypted                                            │
│  ✅ Type-safe (TypeScript)                                     │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│               FIREBASE CLOUD FUNCTION (Backend)                 │
│                  functions/src/geocoding.ts                     │
│                                                                 │
│  export const reverseGeocode = functions.https.onCall(...)     │
│                                                                 │
│  1. ✅ Check Authentication                                     │
│     if (!context.auth) throw HttpsError('unauthenticated')     │
│                                                                 │
│  2. ✅ Validate Input                                           │
│     if (lat < -90 || lat > 90) throw HttpsError(...)           │
│                                                                 │
│  3. 🔐 Get API Key (Server-Side - Secure!)                     │
│     const apiKey = functions.config().google.maps_api_key      │
│                                                                 │
│  4. 🌐 Call Google Maps API                                     │
│     axios.get('https://maps.googleapis.com/maps/api/geocode...') │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                   GOOGLE MAPS GEOCODING API                     │
│                                                                 │
│  GET /maps/api/geocode/json?                                    │
│      latlng=12.9716,77.5946&                                    │
│      key=YOUR_API_KEY                                           │
│                                                                 │
│  Returns JSON with address components:                          │
│  {                                                              │
│    "results": [{                                                │
│      "address_components": [                                    │
│        { "types": ["street_number"], "long_name": "123" },     │
│        { "types": ["route"], "long_name": "MG Road" },         │
│        { "types": ["locality"], "long_name": "Bangalore" },    │
│        { "types": ["administrative_area_level_1"],             │
│          "long_name": "Karnataka" },                            │
│        { "types": ["postal_code"], "long_name": "560001" }     │
│      ],                                                         │
│      "formatted_address": "123, MG Road, Bangalore..."          │
│    }],                                                          │
│    "status": "OK"                                               │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│           CLOUD FUNCTION - ADDRESS PARSING                      │
│                                                                 │
│  Parse address components:                                      │
│  • street_number + route → flatBuilding: "123, MG Road"        │
│  • sublocality / route → areaStreet: "Koramangala"             │
│  • locality → city: "Bangalore"                                 │
│  • administrative_area_level_1 → state: "Karnataka"            │
│  • postal_code → pincode: "560001"                              │
│  • point_of_interest → landmark: "Near Forum Mall"             │
│                                                                 │
│  Return structured address:                                     │
│  {                                                              │
│    flatBuilding: "123, MG Road",                                │
│    areaStreet: "Koramangala",                                   │
│    city: "Bangalore",                                           │
│    state: "Karnataka",                                          │
│    pincode: "560001",                                           │
│    landmark: "",                                                │
│    formattedAddress: "123, MG Road, Koramangala...",            │
│    coordinates: { lat: 12.9716, lng: 77.5946 }                 │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND - SESSION STORAGE                         │
│                                                                 │
│  sessionStorage.setItem('detectedAddress', JSON.stringify({    │
│    flatBuilding: "123, MG Road",                                │
│    areaStreet: "Koramangala",                                   │
│    city: "Bangalore",                                           │
│    state: "Karnataka",                                          │
│    pincode: "560001",                                           │
│    landmark: "",                                                │
│    formattedAddress: "123, MG Road, Koramangala...",            │
│    coordinates: { lat: 12.9716, lng: 77.5946 }                 │
│  }));                                                           │
│                                                                 │
│  ✅ Temporary storage (cleared after use)                      │
│  ✅ Tab-specific (not shared across tabs)                      │
│  ✅ Survives page navigation                                   │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NAVIGATION WITH PARAMS                       │
│                                                                 │
│  navigate('/account/addresses?action=add&prefill=true')        │
│                                                                 │
│  • action=add → Trigger add address form                       │
│  • prefill=true → Read from sessionStorage                     │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│              ADDRESS MANAGEMENT PAGE                            │
│                  /account/addresses                             │
│                                                                 │
│  useEffect(() => {                                              │
│    const action = searchParams.get('action');                  │
│    const shouldPrefill = searchParams.get('prefill') === 'true';│
│                                                                 │
│    if (action === 'add' && shouldPrefill) {                    │
│      const storedData = sessionStorage.getItem('detectedAddress');│
│      if (storedData) {                                          │
│        setPrefillData(JSON.parse(storedData));                 │
│        setShowAddressForm(true);                                │
│        sessionStorage.removeItem('detectedAddress'); ← Clean up│
│      }                                                          │
│    }                                                            │
│  }, [searchParams]);                                            │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│               ADD ADDRESS FORM (Pre-filled!)                    │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │  Name*: [________________] (empty - user fills)    │        │
│  │  Mobile*: [__________] (empty - user fills)        │        │
│  │  Pincode*: [560001] ← PRE-FILLED ✓                │        │
│  │  Locality*: [123, MG Road] ← PRE-FILLED ✓         │        │
│  │  Address*: [Koramangala] ← PRE-FILLED ✓           │        │
│  │  City*: [Bangalore] ← PRE-FILLED ✓                │        │
│  │  State*: [Karnataka] ← PRE-FILLED ✓               │        │
│  │  Landmark: [] (empty - optional)                    │        │
│  │  Alternate Phone: [] (empty - optional)            │        │
│  │  Type: ● Home ○ Work                               │        │
│  │                                                     │        │
│  │  [CANCEL]  [SAVE] ← User clicks after filling name│        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SAVE TO FIRESTORE                            │
│                                                                 │
│  await saveAddress(userId, {                                    │
│    fullName: "John Doe",                                        │
│    mobileNumber: "9876543210",                                  │
│    flatBuilding: "123, MG Road",                                │
│    areaStreet: "Koramangala",                                   │
│    city: "Bangalore",                                           │
│    state: "Karnataka",                                          │
│    pincode: "560001",                                           │
│    landmark: "",                                                │
│    type: "home",                                                │
│    coordinates: { lat: 12.9716, lng: 77.5946 }                 │
│  });                                                            │
│                                                                 │
│  Stored in: /users/{userId}/addresses/{addressId}              │
└─────────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────────┐
│                         SUCCESS!                                │
│                                                                 │
│  ✅ Toast: "Home address saved successfully!"                  │
│  ✅ Address appears in saved addresses list                    │
│  ✅ Available for selection in cart                            │
│  ✅ User can edit or delete later                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
User clicks "Use my current location"
    ↓
[Try Block Starts]
    ↓
Get Browser Location
    ↓
    ├─ PERMISSION_DENIED (Code 1)
    │    → Toast: "Location permission denied..."
    │    → Log error, return early
    │
    ├─ POSITION_UNAVAILABLE (Code 2)
    │    → Toast: "Unable to determine your location..."
    │    → Log error, return early
    │
    ├─ TIMEOUT (Code 3)
    │    → Toast: "Location request timed out..."
    │    → Log error, return early
    │
    └─ SUCCESS
         → Continue to Firebase call
             ↓
       Call Firebase Function
             ↓
             ├─ unauthenticated
             │    → Toast: "Please log in first"
             │    → Log error, return early
             │
             ├─ invalid-argument
             │    → Toast: "Invalid location data"
             │    → Log error, return early
             │
             ├─ not-found
             │    → Toast: "Unable to detect address..."
             │    → Log error, return early
             │
             ├─ deadline-exceeded
             │    → Toast: "Request took too long..."
             │    → Log error, return early
             │
             ├─ Network Error
             │    → Toast: "Network error..."
             │    → Log error, return early
             │
             └─ SUCCESS
                  → Store in sessionStorage
                  → Navigate to address page
                  → Show success toast

[Catch Block]
    → Toast: "An unexpected error occurred"
    → Log error with details
```

---

## Data Security Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                         │
│  • No API key stored ✓                                      │
│  • Only coordinates sent                                    │
│  • Uses Firebase Auth token                                 │
│  • HTTPS encrypted                                          │
└─────────────────────────────────────────────────────────────┘
                         ↓
              [Secure Connection]
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              FIREBASE CLOUD FUNCTION                        │
│  • Authentication check ✓                                   │
│  • Input validation ✓                                       │
│  • API key from config ✓                                    │
│  • No client access ✓                                       │
└─────────────────────────────────────────────────────────────┘
                         ↓
              [Secure Connection]
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              GOOGLE MAPS API                                │
│  • Server-to-server call ✓                                  │
│  • API key restrictions ✓                                   │
│  • Quota monitoring ✓                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
Component State Flow:
===================

AddressSelectionModal
    ├─ isLoadingLocation: boolean (default: false)
    ├─ detectedAddress: Address | null (default: null)
    └─ On "Use location" click:
        ├─ Set isLoadingLocation = true
        ├─ Call geolocation API
        ├─ Call Firebase function
        ├─ Set detectedAddress = result
        ├─ Save to sessionStorage
        ├─ Navigate away
        └─ Component unmounts (state cleared)

AddressManagement
    ├─ prefillData: Partial<Address> | null (default: null)
    ├─ showAddressForm: boolean (default: false)
    └─ On mount with ?action=add&prefill=true:
        ├─ Read sessionStorage
        ├─ Set prefillData = parsed data
        ├─ Set showAddressForm = true
        └─ Clear sessionStorage

AddAddressModal
    ├─ formData: Address (default: empty or prefilled)
    └─ On mount with prefillData:
        └─ Set formData fields from prefillData
```

---

## File Dependencies Map

```
src/components/AddressSelectionModal.tsx
    ├─ Imports:
    │   ├─ firebase/functions (getFunctions, httpsCallable)
    │   ├─ react-router-dom (useNavigate)
    │   ├─ @/lib/addressService (saveAddress)
    │   └─ lucide-react (Navigation icon)
    ├─ Calls:
    │   └─ reverseGeocode (Cloud Function)
    └─ Navigates to:
        └─ /account/addresses?action=add&prefill=true

src/pages/AddressManagement.tsx
    ├─ Imports:
    │   ├─ react-router-dom (useSearchParams)
    │   └─ AddAddressModal component
    ├─ Reads:
    │   └─ sessionStorage.detectedAddress
    └─ Renders:
        └─ AddAddressModal with prefillData

src/components/AddAddressModal.tsx
    ├─ Receives:
    │   └─ prefillData prop
    └─ Pre-fills:
        └─ Form fields (flatBuilding, areaStreet, city, state, pincode)

functions/src/geocoding.ts
    ├─ Imports:
    │   ├─ firebase-functions
    │   ├─ firebase-admin
    │   └─ axios
    ├─ Calls:
    │   └─ Google Maps Geocoding API
    └─ Exports:
        ├─ reverseGeocode (callable)
        └─ reverseGeocodeHTTP (https)
```

---

## Deployment Architecture

```
Local Development
    ↓
Git Repository
    ↓
Firebase Hosting (Frontend)
    ├─ React App (Vite build)
    ├─ Static assets
    └─ Environment variables (if using)
    
Firebase Cloud Functions (Backend)
    ├─ reverseGeocode (Node.js 18)
    ├─ reverseGeocodeHTTP (alternative)
    └─ Functions config:
        └─ google.maps_api_key

Google Cloud Platform
    ├─ Geocoding API
    ├─ API Key restrictions
    ├─ Quota monitoring
    └─ Billing

Firestore Database
    └─ /users/{userId}/addresses/{addressId}
        └─ Address documents with coordinates
```

---

## Request/Response Timeline

```
Time (ms)    Event
─────────────────────────────────────────────────────────────
0            User clicks "Use my current location"
10           Toast: "Getting your location..."
20           Browser shows permission dialog
[User grants permission]
50           Browser begins GPS acquisition
2000-5000    GPS acquires location (varies)
5000         Toast: "Location acquired! Lat: X, Lng: Y"
5010         Toast: "Calling geocoding service..."
5020         Firebase callable function called
5030         Cloud Function receives request
5040         Cloud Function validates auth & input
5050         Cloud Function calls Google Maps API
5200         Google Maps API responds (150ms)
5210         Cloud Function parses response
5220         Cloud Function returns to client
5230         Client receives address data
5240         sessionStorage.setItem()
5250         Toast: "Address detected successfully!"
5260         navigate() to address page
5300         AddressManagement mounts
5310         useEffect reads sessionStorage
5320         AddAddressModal renders with pre-fill
5330         User sees form with address filled
─────────────────────────────────────────────────────────────
Total: ~5.3 seconds (typical)
```

---

## Cost Breakdown (Example)

```
Scenario: 10,000 monthly users, 30% use geolocation

Calculations:
─────────────────────────────────────────────────────────────
Users: 10,000
Geolocation usage: 30% = 3,000 requests/month

Google Maps Geocoding API:
  • Requests: 3,000
  • Free tier: 40,000 requests (worth $200)
  • Cost: $0 (within free tier)

Firebase Cloud Functions:
  • Invocations: 3,000
  • Free tier: 2,000,000 invocations
  • Cost: $0 (within free tier)

Compute Time (assuming 200ms per invocation):
  • Total: 3,000 × 0.2s = 600 seconds = 10 minutes
  • GB-seconds: 600s × 0.256GB = 153.6 GB-s
  • Free tier: 400,000 GB-s
  • Cost: $0 (within free tier)

Firebase Hosting:
  • Static files served
  • Bandwidth: ~10GB/month
  • Free tier: 10GB/month
  • Cost: $0 (within free tier)

Firestore Reads/Writes:
  • Address saves: 3,000 writes
  • Address fetches: 30,000 reads (10 per user avg)
  • Free tier: 50K reads, 20K writes daily
  • Cost: $0 (within free tier)

─────────────────────────────────────────────────────────────
TOTAL MONTHLY COST: $0
─────────────────────────────────────────────────────────────

All services within free tier! ✨
```

---

**Visual Guide Version**: 1.0
**Last Updated**: January 2025
**Status**: ✅ Complete
