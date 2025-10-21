# Firestore Security Rules - User Addresses

## Overview
This document details the security rules required for the user addresses feature in the Firestore database.

## Collection Structure
```
users/{userId}/addresses/{addressId}
```

## Security Rules

Add the following rules to your Firestore security rules configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules...
    
    // User Addresses Subcollection Rules
    match /users/{userId}/addresses/{addressId} {
      // Allow users to read their own addresses
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to create their own addresses
      allow create: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.keys().hasAll(['fullName', 'mobileNumber', 'flatBuilding', 'areaStreet', 'pincode', 'city', 'state', 'type'])
                    && request.resource.data.type in ['Home', 'Work'];
      
      // Allow users to update their own addresses
      allow update: if request.auth != null 
                    && request.auth.uid == userId
                    && request.resource.data.keys().hasAll(['fullName', 'mobileNumber', 'flatBuilding', 'areaStreet', 'pincode', 'city', 'state', 'type'])
                    && request.resource.data.type in ['Home', 'Work'];
      
      // Allow users to delete their own addresses
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Rule Explanation

### Read Permission
```javascript
allow read: if request.auth != null && request.auth.uid == userId;
```
- Users can only read their own addresses
- Authentication is required
- User ID must match the document path userId

### Create Permission
```javascript
allow create: if request.auth != null 
              && request.auth.uid == userId
              && request.resource.data.keys().hasAll([...required fields])
              && request.resource.data.type in ['Home', 'Work'];
```
- Users can only create addresses under their own user document
- Authentication is required
- All required fields must be present
- Address type must be either 'Home' or 'Work'

### Update Permission
```javascript
allow update: if request.auth != null 
              && request.auth.uid == userId
              && request.resource.data.keys().hasAll([...required fields])
              && request.resource.data.type in ['Home', 'Work'];
```
- Users can only update their own addresses
- Authentication is required
- All required fields must remain present
- Address type must remain either 'Home' or 'Work'

### Delete Permission
```javascript
allow delete: if request.auth != null && request.auth.uid == userId;
```
- Users can only delete their own addresses
- Authentication is required
- User ID must match the document path userId

## Data Schema Validation

The security rules enforce the following data schema:

### Required Fields
- `fullName` (string)
- `mobileNumber` (string)
- `flatBuilding` (string)
- `areaStreet` (string)
- `pincode` (string)
- `city` (string)
- `state` (string)
- `type` (string - must be 'Home' or 'Work')

### Optional Fields
- `alternateMobile` (string)
- `landmark` (string)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Implementation Steps

### 1. Navigate to Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `venkatexpresss2`
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab

### 2. Add the Rules
1. Copy the security rules from above
2. Paste them into your existing rules file
3. Make sure they are placed inside the `match /databases/{database}/documents` block
4. Keep all your existing rules intact

### 3. Publish the Rules
1. Click the "Publish" button
2. Wait for confirmation that rules are deployed

### 4. Test the Rules
Use the Firestore Rules Simulator in the Firebase Console:

**Test Read Access:**
```
Location: /users/{your-user-id}/addresses/address123
Auth: Authenticated as {your-user-id}
Expected: Allow
```

**Test Write Access:**
```
Location: /users/{your-user-id}/addresses/address123
Auth: Authenticated as {your-user-id}
Data: {
  "fullName": "John Doe",
  "mobileNumber": "1234567890",
  "flatBuilding": "123 Main St",
  "areaStreet": "Downtown",
  "pincode": "123456",
  "city": "Mumbai",
  "state": "Maharashtra",
  "type": "Home"
}
Expected: Allow
```

**Test Unauthorized Access:**
```
Location: /users/another-user-id/addresses/address123
Auth: Authenticated as {your-user-id}
Expected: Deny
```

## Complete Rules Example

Here's how your complete Firestore rules file might look:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // User Addresses Subcollection
      match /addresses/{addressId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        
        allow create: if request.auth != null 
                      && request.auth.uid == userId
                      && request.resource.data.keys().hasAll(['fullName', 'mobileNumber', 'flatBuilding', 'areaStreet', 'pincode', 'city', 'state', 'type'])
                      && request.resource.data.type in ['Home', 'Work'];
        
        allow update: if request.auth != null 
                      && request.auth.uid == userId
                      && request.resource.data.keys().hasAll(['fullName', 'mobileNumber', 'flatBuilding', 'areaStreet', 'pincode', 'city', 'state', 'type'])
                      && request.resource.data.type in ['Home', 'Work'];
        
        allow delete: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Other collections...
  }
}
```

## Security Considerations

### ✅ Protected Against
- Unauthorized users reading other users' addresses
- Unauthorized users creating/updating/deleting other users' addresses
- Unauthenticated access to addresses
- Invalid address types (only Home and Work allowed)
- Missing required fields

### ⚠️ Important Notes
- These rules assume you have Firebase Authentication enabled
- Users must be authenticated to perform any operation
- Each user can only access their own addresses
- The rules validate required fields and address type
- Consider adding rate limiting for production

## Troubleshooting

### Permission Denied Errors
If you encounter "permission denied" errors:

1. **Check Authentication**: Ensure the user is logged in
2. **Verify User ID**: Confirm the userId in the path matches the authenticated user
3. **Check Data Format**: Ensure all required fields are present
4. **Validate Type**: Confirm address type is 'Home' or 'Work'
5. **Review Console**: Check Firebase Console logs for detailed error messages

### Testing in Development
For development/testing, you might temporarily use more permissive rules:

```javascript
// DEVELOPMENT ONLY - NOT FOR PRODUCTION
match /users/{userId}/addresses/{addressId} {
  allow read, write: if request.auth != null;
}
```

**⚠️ WARNING**: Replace with production rules before deploying!

## Next Steps

1. ✅ Deploy the security rules to Firebase Console
2. ✅ Test the rules using the Firebase Rules Simulator
3. ✅ Test the address management feature in your app
4. ✅ Monitor Firestore usage and security reports
5. ✅ Consider adding additional validation (e.g., phone number format, pincode length)

## Related Documentation
- [ADMIN_SETTINGS_DOCUMENTATION.md](./ADMIN_SETTINGS_DOCUMENTATION.md)
- [FIRESTORE_SECURITY_RULES_ORDERS.md](./FIRESTORE_SECURITY_RULES_ORDERS.md)
- [FIRESTORE_SECURITY_RULES_ABOUT_IMAGES.md](./FIRESTORE_SECURITY_RULES_ABOUT_IMAGES.md)
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
