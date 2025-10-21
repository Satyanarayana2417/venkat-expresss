# Cart Dynamic Address Display - Implementation

## Date
October 18, 2025

## Change Summary
Updated the desktop cart delivery address section to display the user's **saved address in real-time** from Firestore, with appropriate fallback states for different scenarios.

---

## What Changed

### Before
- ❌ Static address: "East Godavari - 533005"
- ❌ No integration with user's saved addresses
- ❌ "Change" button had no functionality

### After
- ✅ **Fetches user's saved address from Firestore**
- ✅ Shows complete address details (name, address, pincode, phone)
- ✅ Loading state while fetching address
- ✅ Handles multiple scenarios (logged in/out, address saved/not saved)
- ✅ Functional "Change"/"Add" button that navigates to address management
- ✅ Real-time updates when user changes address

---

## Technical Implementation

### New Imports
```typescript
import { useState, useEffect } from 'react';
import { getAddressByType, Address } from '@/lib/addressService';
```

### State Management
```typescript
const [userAddress, setUserAddress] = useState<Address | null>(null);
const [loadingAddress, setLoadingAddress] = useState(false);
```

### Address Fetching Logic
```typescript
useEffect(() => {
  const fetchUserAddress = async () => {
    if (!user) {
      setUserAddress(null);
      return;
    }

    try {
      setLoadingAddress(true);
      // Try to get home address first, fall back to work address
      const homeAddr = await getAddressByType(user.uid, 'home');
      if (homeAddr) {
        setUserAddress(homeAddr);
      } else {
        const workAddr = await getAddressByType(user.uid, 'work');
        setUserAddress(workAddr);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setUserAddress(null);
    } finally {
      setLoadingAddress(false);
    }
  };

  fetchUserAddress();
}, [user]);
```

**How It Works:**
1. Runs whenever `user` changes (login/logout)
2. If no user, clears address
3. If user exists, fetches home address first
4. Falls back to work address if no home address
5. Handles errors gracefully

---

## Display States

### 1. Loading State
**Shown**: While fetching address from Firestore
```
┌──────────────────────────────────┐
│ ⟳ Loading address...             │
└──────────────────────────────────┘
```

### 2. Address Found (Logged In)
**Shown**: User is logged in and has saved address
```
┌─────────────────────────────────────────┐
│ Deliver to: John Doe              [Change]│
│ 123 Main Street, Near Park              │
│ Hyderabad, Telangana - 500034           │
│ Phone: +91 98765 43210                  │
└─────────────────────────────────────────┘
```

**Displays:**
- Full name from address
- Complete address (flat/building, area, landmark)
- City, state, pincode
- Mobile number
- "Change" button → navigates to `/account/addresses`

### 3. No Address Saved (Logged In)
**Shown**: User is logged in but hasn't added address
```
┌─────────────────────────────────────────┐
│ Deliver to: No address saved       [Add]│
│ Please add a delivery address           │
└─────────────────────────────────────────┘
```

**Displays:**
- Message prompting to add address
- "Add" button → navigates to `/account/addresses`

### 4. Not Logged In
**Shown**: Guest user (not authenticated)
```
┌─────────────────────────────────────────┐
│ Deliver to: Please login           [Add]│
│ Login to see your saved address         │
└─────────────────────────────────────────┘
```

**Displays:**
- Message prompting to login
- "Add" button → shows login modal

---

## Address Data Structure

```typescript
interface Address {
  id?: string;
  fullName: string;
  mobileNumber: string;
  alternateMobile?: string;
  flatBuilding: string;
  areaStreet: string;
  landmark?: string;
  pincode: string;
  city: string;
  state: string;
  type: 'home' | 'work';
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

## Button Functionality

### "Change" Button (Address Exists)
```typescript
onClick={() => {
  if (!user) {
    setShowLoginModal(true);
  } else {
    navigate('/account/addresses');
  }
}}
```

**Behavior:**
- If not logged in → Shows login modal
- If logged in → Navigates to address management page

### "Add" Button (No Address)
- Same functionality as "Change" button
- Different label to indicate action needed

---

## Integration with Address Service

### Firestore Structure
```
/users/{userId}/addresses/{addressId}
├── fullName: "John Doe"
├── mobileNumber: "+91 98765 43210"
├── flatBuilding: "123 Main Street"
├── areaStreet: "Park Road"
├── landmark: "Near Central Park"
├── pincode: "500034"
├── city: "Hyderabad"
├── state: "Telangana"
├── type: "home"
└── createdAt: timestamp
```

### Address Priority
1. **Home address** (checked first)
2. **Work address** (fallback if no home address)
3. **null** (if neither exists)

---

## User Flow Examples

### Scenario 1: New User
1. User adds items to cart
2. Goes to cart page
3. Sees: "Please login" message
4. Clicks "Add" button → Login modal appears
5. Logs in
6. Sees: "No address saved" message
7. Clicks "Add" button → Navigates to address management
8. Adds address
9. Returns to cart → Sees saved address

### Scenario 2: Returning User with Address
1. User logs in
2. Goes to cart page
3. Immediately sees saved address
4. Can click "Change" to modify address

### Scenario 3: User Changes Address
1. User on cart page
2. Clicks "Change" button
3. Navigates to `/account/addresses`
4. Edits or adds new address
5. Returns to cart → Updated address displayed automatically

---

## Error Handling

### Network Errors
```typescript
catch (error) {
  console.error('Error fetching address:', error);
  setUserAddress(null);
}
```
- Logs error to console
- Sets address to null (shows "No address saved")
- Doesn't crash the page
- User can still try to add address

### Missing Permissions
- If user doesn't have Firestore access
- Falls back gracefully to "No address saved"
- User can attempt to add address

---

## Performance Considerations

### Optimization
- ✅ Fetches only once on mount and user change
- ✅ Doesn't re-fetch on every render
- ✅ Uses `useEffect` with `[user]` dependency
- ✅ Minimal Firestore reads (max 2 per load)

### Loading State
- Shows spinner while fetching
- Prevents UI jump
- User knows something is loading

---

## Styling Details

### Address Display
```typescript
<h3 className="font-medium text-gray-700 mb-1">
  Deliver to: <span className="font-semibold text-gray-900">{fullName}</span>
</h3>
<p className="text-sm text-gray-600">
  {address details}
</p>
```

**Style Guide:**
- Label: `font-medium text-gray-700`
- Name: `font-semibold text-gray-900` (bold)
- Address lines: `text-sm text-gray-600`
- Spacing: `mb-1` between lines

### Loading Spinner
```typescript
<div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
```

**Colors:**
- Spinner: Blue (`border-blue-600`)
- Background: Transparent top for spin effect

### Button Styling
```typescript
className="text-blue-600 border-blue-600 hover:bg-blue-50"
```

**States:**
- Default: Blue text and border
- Hover: Light blue background

---

## Testing Scenarios

### Test Case 1: Guest User
1. Open cart without logging in
2. **Expected**: "Please login" message
3. Click "Add" button
4. **Expected**: Login modal appears

### Test Case 2: Logged In, No Address
1. Login with new account
2. Go to cart
3. **Expected**: "No address saved" message
4. Click "Add" button
5. **Expected**: Navigate to `/account/addresses`

### Test Case 3: Logged In, Home Address Exists
1. Login with account that has home address
2. Go to cart
3. **Expected**: Full home address displayed
4. Click "Change"
5. **Expected**: Navigate to address management

### Test Case 4: Logged In, Only Work Address
1. Login with account that has only work address
2. Go to cart
3. **Expected**: Work address displayed
4. **Expected**: All address details shown

### Test Case 5: Address Update
1. On cart page with address
2. Navigate to `/account/addresses`
3. Edit address
4. Return to cart
5. **Expected**: Updated address shown (re-fetch on navigation back)

### Test Case 6: Logout
1. On cart page with address displayed
2. Logout
3. **Expected**: Address clears, shows "Please login"

---

## Future Enhancements

### Multiple Addresses
```typescript
// Could extend to show address selector
const [selectedAddress, setSelectedAddress] = useState<string>('home');
```

### Address Validation
- Verify address before checkout
- Check pincode serviceability
- Estimate delivery date based on address

### Address Autocomplete
- Integrate Google Places API
- Auto-fill city/state from pincode
- Validate address format

---

## Dependencies

### Required Files
- `src/lib/addressService.ts` - Address CRUD operations
- `src/pages/AddressManagement.tsx` - Address management page
- Firebase Firestore - Address storage

### Context Integration
- `useAuth()` - User authentication state
- `useCart()` - Cart items and state
- `useWishlist()` - Wishlist operations

---

## Code Location

**File**: `src/pages/Cart.tsx`
**Section**: Desktop View → Left Column → Delivery Address Card
**Lines**: ~1-50 (imports and state), ~280-330 (address card JSX)

---

## Summary

✅ **Dynamic Address**: Fetches from Firestore in real-time
✅ **Multiple States**: Handles logged in/out, address saved/not saved
✅ **Loading State**: Shows spinner while fetching
✅ **Error Handling**: Graceful fallbacks
✅ **Functional Buttons**: Navigate to address management or show login
✅ **Complete Details**: Shows name, full address, pincode, phone
✅ **Auto-Update**: Re-fetches when user logs in/out

The delivery address section now provides a complete, dynamic experience that integrates seamlessly with the user's saved addresses!

---

**Status**: ✅ Complete
**Date**: October 18, 2025
**Impact**: Desktop cart only
**Breaking Changes**: None (backward compatible)
