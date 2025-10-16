# Firestore Security Rules - Team Management

## Overview
Security rules for the `teamMembers` collection to allow public read access for the About Us page while restricting write/delete operations to admin users only.

---

## Required Rules

Add these rules to your `firestore.rules` file in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Team Members Collection
    match /teamMembers/{memberId} {
      // Allow public read access - needed for About Us page
      allow read: if true;
      
      // Allow write/update/delete only for admin users
      allow create, update, delete: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ... other rules
  }
}
```

---

## Rule Explanation

### Read Access (Public)
```javascript
allow read: if true;
```
- **Purpose**: Allows anyone to read team member data
- **Why**: The About Us page needs to display team members to all visitors
- **Security**: Safe because team member info is public-facing content

### Write Access (Admin Only)
```javascript
allow create, update, delete: if request.auth != null 
  && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
```
- **Purpose**: Only authenticated admin users can modify team members
- **Checks**:
  1. `request.auth != null` - User must be logged in
  2. `role == 'admin'` - User must have admin role in users collection
- **Operations**: Covers create, update, and delete operations

---

## Testing the Rules

### Test 1: Public Read Access
```javascript
// Unauthenticated user should be able to read
const teamRef = collection(db, 'teamMembers');
const snapshot = await getDocs(teamRef);
// ✅ Should succeed
```

### Test 2: Admin Write Access
```javascript
// Admin user should be able to create/update/delete
await addDoc(collection(db, 'teamMembers'), {
  name: 'John Doe',
  role: 'Developer',
  image: 'https://...',
  linkedin: 'https://...'
});
// ✅ Should succeed for admin users
```

### Test 3: Non-Admin Write Blocked
```javascript
// Regular user should NOT be able to write
await addDoc(collection(db, 'teamMembers'), {...});
// ❌ Should fail with permission-denied
```

---

## How to Apply

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab

3. **Add/Update Rules**
   - Copy the `teamMembers` rule from above
   - Paste it in the appropriate location
   - Click "Publish"

4. **Verify Deployment**
   - Check that rules are published successfully
   - Test both read and write operations

---

## Collection Structure

```
teamMembers (collection)
  └── {auto-generated-id} (document)
       ├── name: string
       ├── role: string
       ├── image: string (Cloudinary URL)
       ├── linkedin: string
       ├── order: number (for sorting)
       ├── createdAt: string (ISO timestamp)
       └── updatedAt: string (ISO timestamp)
```

---

## Important Notes

1. **Admin Role Requirement**: Ensure your admin users have `role: 'admin'` in the `users` collection
2. **Real-time Updates**: These rules work with both `getDocs()` and `onSnapshot()` listeners
3. **Performance**: The admin role check requires an extra read, but it's necessary for security
4. **Testing**: Always test rules in Firebase Console before deploying to production

---

## Related Files
- **Admin Interface**: `src/pages/admin/AdminTeam.tsx`
- **Public Display**: `src/pages/About.tsx` (lines 180-210, 604-660)
- **Routing**: `src/pages/AdminRouter.tsx`
- **Navigation**: `src/components/admin/AdminLayout.tsx`

---

## Troubleshooting

### Error: Missing or insufficient permissions
**Cause**: User doesn't have admin role or rules not published

**Solution**:
1. Check user's role in Firestore users collection
2. Verify rules are published in Firebase Console
3. Sign out and sign back in to refresh auth token

### Error: Cannot read property 'role' of undefined
**Cause**: User document doesn't exist in users collection

**Solution**:
1. Ensure user document is created on signup
2. Add default role field to new users
3. Check document path matches rule: `users/{userId}`

---

## Security Best Practices

✅ **Do:**
- Keep read access public for team members (public content)
- Require authentication for write operations
- Verify admin role before allowing modifications
- Log all admin actions for audit trail

❌ **Don't:**
- Allow unauthenticated writes
- Store sensitive data in public-readable collections
- Skip role verification for admin operations
- Use client-side role checks alone

---

*Last Updated: 2024*
*Related Feature: Team Management CRUD System*
