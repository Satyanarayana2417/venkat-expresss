# Admin Panel Setup Instructions

## 🚨 IMPORTANT: Setting Up Your First Admin User

The admin panel is now ready, but you need to set up at least one admin user to access it.

### Step 1: Create a User Account

1. Go to your website at `/auth` (the authentication page)
2. Sign up with a new account using email and password
3. Remember these credentials - you'll need them to sign in to the admin panel

### Step 2: Set Admin Role in Firestore

After creating the account, you need to manually set the `role` field to `"admin"` in Firestore:

**Option A: Using Firebase Console (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **venkatexpress2**
3. Click on **Firestore Database** in the left sidebar
4. Navigate to the `users` collection
5. Find the document with your user ID (it will be a long string like `abc123xyz...`)
6. Click on the document to open it
7. Look for the `role` field:
   - If it exists and says `"customer"`, click to edit it
   - If it doesn't exist, click "Add field"
8. Set/update the field:
   - **Field name:** `role`
   - **Field type:** `string`
   - **Field value:** `admin` (exactly as written, case-sensitive)
9. Click **Update** or **Add**

**Option B: Using Firebase Admin SDK (For Developers)**

If you have backend access, you can run this code:

```javascript
const admin = require('firebase-admin');
const db = admin.firestore();

// Replace USER_ID with the actual user ID
await db.collection('users').doc('USER_ID').update({
  role: 'admin'
});
```

### Step 3: Test Admin Access

1. Go to `/admin` on your website
2. You should see the admin login page
3. Sign in with the email and password you created in Step 1
4. If the role is set correctly, you'll see: "Admin access granted" ✅
5. The admin panel dashboard should load

---

## 🔧 Troubleshooting

### "Access denied" Even with Correct Credentials

**Problem:** You can sign in with the correct email/password, but still get "Access denied"

**Solution:**
1. Check the browser console (F12 → Console tab)
2. Look for a message like: `User role: customer - Admin access required`
3. This means the `role` field in Firestore is not set to `"admin"`
4. Go back to Step 2 and verify the role is exactly `"admin"` (lowercase, no spaces)

### How to Check Your Role in Firestore

1. Open browser console (F12)
2. Sign in to the admin page
3. Look for the console message showing your role
4. If it shows `customer` or `null`, you need to update it to `admin` in Firestore

### Role Field Requirements

- **Must be exactly:** `admin` (lowercase)
- **Field type:** string
- **Location:** `users/{userId}/role`
- **Case-sensitive:** `Admin`, `ADMIN`, or ` admin ` (with spaces) will NOT work

### Multiple Admin Users

To create additional admin users:
1. Have them create an account via `/auth`
2. Update their role in Firestore to `"admin"`
3. They can now access the admin panel

---

## 📝 Admin Credentials Best Practices

1. **Use strong passwords** for admin accounts
2. **Don't share admin credentials** publicly
3. **Create separate admin accounts** for each admin user (don't share one account)
4. **Keep a backup list** of admin user IDs in case you need to revoke access
5. **Test admin access** in an incognito/private browser window to ensure it works

---

## 🔐 Security Reminder

Before deploying to production, make sure you've added Firestore Security Rules as documented in `ADMIN_PANEL_GUIDE.md` to prevent unauthorized users from changing their own roles.

---

## ✅ Quick Checklist

- [ ] Created a user account via `/auth`
- [ ] Set `role: "admin"` in Firestore `users` collection
- [ ] Tested sign-in at `/admin` route
- [ ] Verified "Admin access granted" message appears
- [ ] Can see admin dashboard with product stats
- [ ] Can add/edit/delete products successfully

---

## 🆘 Still Having Issues?

If you've followed all steps and still can't access the admin panel:

1. **Check browser console** for error messages
2. **Verify Firebase connection** - can you sign in to regular `/auth` page?
3. **Double-check spelling** - role must be exactly `"admin"`
4. **Try logging out completely** and signing back in
5. **Clear browser cache** and cookies
6. **Check Firestore rules** - make sure reads are allowed on users collection

If problems persist, check the Firebase Console for any error logs under **Firestore** → **Usage** tab.
