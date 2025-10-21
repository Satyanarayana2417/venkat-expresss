# Address Management - Quick Reference

## 🚀 Quick Start

### Access the Feature
1. Log in to your account
2. Go to Dashboard/Profile
3. Click "Saved Addresses"

### Add Address
1. Click "+ Add New Address" or "+ Add Home/Work Address"
2. Fill the form
3. Click "Save Address"

### Edit Address
1. Click "Edit" on address card
2. Modify fields
3. Click "Save Address"

### Delete Address
1. Click "Delete" on address card
2. Confirm deletion

## 📁 Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib/addressService.ts` | Firestore CRUD operations | 163 |
| `src/components/AddAddressModal.tsx` | Modal form component | 325 |
| `src/pages/AddressManagement.tsx` | Main address page | 306 |
| `FIRESTORE_SECURITY_RULES_ADDRESSES.md` | Security rules documentation | 250+ |
| `ADDRESS_MANAGEMENT_COMPLETE_GUIDE.md` | Complete implementation guide | 700+ |

## 📝 Files Modified

| File | Change | Line |
|------|--------|------|
| `src/App.tsx` | Added import | 31 |
| `src/App.tsx` | Added route | 77 |
| `src/App.tsx` | Updated layout logic | 41 |
| `src/pages/Dashboard.tsx` | Button → Link | 209 |

## 🔑 Key Components

### addressService Functions
```typescript
getUserAddresses(userId)           // Get all addresses
getAddressByType(userId, type)     // Get Home or Work
getAddressById(userId, addressId)  // Get specific address
saveAddress(userId, address)       // Create/update address
updateAddress(userId, id, address) // Update existing
deleteAddress(userId, addressId)   // Delete address
```

### AddAddressModal Props
```typescript
{
  isOpen: boolean
  onClose: () => void
  onSave: (address) => void
  addressType?: 'Home' | 'Work'
  existingAddress?: Address
}
```

## ✅ Form Fields

| Field | Required | Validation |
|-------|----------|------------|
| Full Name | ✅ | Not empty |
| Mobile Number | ✅ | 10 digits |
| Alternate Mobile | ❌ | 10 digits (if provided) |
| Flat/Building | ✅ | Not empty |
| Area/Street | ✅ | Not empty |
| Landmark | ❌ | Any |
| Pincode | ✅ | 6 digits |
| City | ✅ | Not empty |
| State | ✅ | Not empty |
| Type | ✅ | Home or Work |

## 🗂️ Firestore Structure

```
users/{userId}/addresses/{addressId}
├── fullName: string
├── mobileNumber: string
├── alternateMobile?: string
├── flatBuilding: string
├── areaStreet: string
├── landmark?: string
├── pincode: string
├── city: string
├── state: string
├── type: "Home" | "Work"
├── createdAt: timestamp
└── updatedAt: timestamp
```

## 🔒 Security Rules

```javascript
match /users/{userId}/addresses/{addressId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow create, update: if request.auth != null 
                      && request.auth.uid == userId
                      && request.resource.data.type in ['Home', 'Work'];
  allow delete: if request.auth != null && request.auth.uid == userId;
}
```

## 🧪 Quick Test

1. **Add Home**: Dashboard → Saved Addresses → Add Home → Fill → Save ✅
2. **Add Work**: Add Work → Fill → Save ✅
3. **Edit**: Click Edit → Change → Save ✅
4. **Delete**: Click Delete → Confirm ✅
5. **Validation**: Try empty field → Error shown ✅

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Permission denied | Deploy Firestore security rules |
| Modal won't close | Check console for errors |
| Address not showing | Check Firestore console for data |
| Validation not working | Check field names match |

## 📱 Route

```typescript
Path: /account/addresses
Protected: Yes (requires authentication)
Layout: Profile page style (no header/footer on mobile)
```

## 🎨 UI Layout

```
Desktop:
┌─────────────────────────────────┐
│ Header                          │
├─────────────────────────────────┤
│ ← Saved Addresses    [+ Add]    │
│                                 │
│ Home          │    Work         │
│ ┌──────────┐  │  ┌──────────┐  │
│ │ Address  │  │  │ + Add    │  │
│ │ [E] [D]  │  │  │          │  │
│ └──────────┘  │  └──────────┘  │
└─────────────────────────────────┘

Mobile:
┌─────────────────┐
│ ← [+ Add]       │ ← Sticky
├─────────────────┤
│ Home Address    │
│ ┌─────────────┐ │
│ │ Address     │ │
│ │ [E] [D]     │ │
│ └─────────────┘ │
│                 │
│ Work Address    │
│ ┌─────────────┐ │
│ │ + Add Work  │ │
│ └─────────────┘ │
└─────────────────┘
```

## 💡 Tips

- Only **one** Home and one Work address allowed
- All fields with * are **required**
- Mobile must be **10 digits**
- Pincode must be **6 digits**
- Press **Escape** to close modal
- **Toast** notifications show success/error

## 📚 Documentation

- **Complete Guide**: `ADDRESS_MANAGEMENT_COMPLETE_GUIDE.md`
- **Security Rules**: `FIRESTORE_SECURITY_RULES_ADDRESSES.md`
- **Testing Guide**: See Complete Guide → Testing section

## ⚡ Status

✅ **Implementation**: Complete  
✅ **Files Created**: 5  
✅ **Files Modified**: 2  
✅ **Security Rules**: Documented  
✅ **Testing**: Ready  

---

**Next**: Deploy Firestore security rules and test the feature!
