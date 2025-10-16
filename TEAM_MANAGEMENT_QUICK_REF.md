# Team Management - Quick Reference

## 🚀 Quick Start

### Access Admin Interface
```
URL: /admin/content/team
Navigation: Admin Dashboard → Team
```

### Add New Member
1. Click "Add Team Member"
2. Fill: Name, Role, LinkedIn (optional)
3. Upload profile image (max 5MB)
4. Click "Add Team Member"
5. ✅ Done! Appears on About page instantly

### Edit Member
1. Click "Edit" on member card
2. Update fields/image as needed
3. Click "Update Team Member"
4. ✅ Updated in real-time

### Delete Member
1. Click "Delete" on member card
2. Confirm deletion
3. ✅ Removed immediately

---

## 📁 Key Files

| File | Purpose | Location |
|------|---------|----------|
| `AdminTeam.tsx` | Admin CRUD interface | `src/pages/admin/` |
| `About.tsx` | Public team display | `src/pages/` |
| `AdminRouter.tsx` | Route configuration | `src/pages/` |
| `AdminLayout.tsx` | Navigation menu | `src/components/admin/` |

---

## 🗄️ Database Structure

**Collection:** `teamMembers`

```typescript
{
  id: string;              // Auto-generated
  name: string;            // "John Doe"
  role: string;            // "Founder & CEO"
  image: string;           // Cloudinary URL
  linkedin: string;        // LinkedIn URL or '#'
  order: number;           // Display order (0, 1, 2...)
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

---

## 🔒 Security Rules

```javascript
match /teamMembers/{memberId} {
  allow read: if true;                                    // Public access
  allow create, update, delete: if isAdmin();             // Admin only
}
```

**How to Apply:**
1. Firebase Console → Firestore → Rules
2. Add/update `teamMembers` rule
3. Click "Publish"

---

## 📸 Image Upload

**Requirements:**
- **Format**: JPG, PNG, WebP
- **Size**: Max 5MB
- **Dimensions**: Recommended 400x400px (1:1)

**Provider:** Cloudinary
- **Cloud Name**: `doxwyrp8n`
- **Upload Preset**: `venkat express 2`

---

## 🎯 Common Tasks

### Add Multiple Members
```
1. Click "Add Team Member"
2. Fill form + upload image
3. Click "Add Team Member"
4. Repeat (no need to refresh)
```

### Update Member Order
```
Currently: Manual (edit order field)
Future: Drag-and-drop reordering
```

### Change Profile Picture
```
1. Click "Edit" on member
2. Click "Choose File"
3. Upload new image
4. Click "Update"
```

### Hide LinkedIn Link
```
Leave LinkedIn field empty or use '#'
→ Link won't appear on About page
```

---

## 🧪 Testing

### Quick Test Flow
1. **Admin Panel** → `/admin/content/team`
2. **Add Member** → Fill form, upload image, submit
3. **View About** → `/about` → Verify member appears
4. **Edit Member** → Update name, submit
5. **Refresh About** → Verify changes (real-time)
6. **Delete Member** → Confirm deletion
7. **Check About** → Verify removal (instant)

### Validation Tests
- Empty name → ❌ Error
- No image → ❌ Error
- Invalid LinkedIn URL → ❌ Error
- Valid data → ✅ Success

---

## 🐛 Quick Fixes

### Members not showing?
```bash
→ Check Firestore security rules (allow read: true)
→ Verify teamMembers collection exists
→ Check browser console for errors
```

### Can't add/edit?
```bash
→ Ensure logged in as admin
→ Check user role in Firestore (role: 'admin')
→ Verify security rules published
```

### Image upload fails?
```bash
→ Check file size (<5MB)
→ Verify image format (JPG/PNG)
→ Check Cloudinary credentials
```

### No real-time updates?
```bash
→ Hard refresh page (Ctrl+Shift+R)
→ Check onSnapshot listener in About.tsx
→ Verify Firebase connection
```

---

## 💡 Pro Tips

1. **Image Quality**: Use 400x400px for best results
2. **LinkedIn**: Always start with `https://`
3. **Order**: Lower numbers appear first
4. **Testing**: Use incognito tab for public view
5. **Mobile**: Test uploads on mobile devices

---

## 📊 At a Glance

| Feature | Status | Notes |
|---------|--------|-------|
| Add Member | ✅ Working | Form + image upload |
| Edit Member | ✅ Working | Update all fields |
| Delete Member | ✅ Working | With confirmation |
| Real-time Sync | ✅ Working | onSnapshot listener |
| Responsive | ✅ Working | 1-4 column grid |
| Validation | ✅ Working | Form + file checks |
| Security | ✅ Working | Admin-only writes |
| Image Upload | ✅ Working | Cloudinary CDN |

---

## 🔗 Related Pages

- [Full Documentation](./TEAM_MANAGEMENT_DOCUMENTATION.md)
- [Security Rules](./TEAM_MANAGEMENT_FIRESTORE_RULES.md)
- [Visual Guide](./TEAM_MANAGEMENT_VISUAL_GUIDE.md)

---

## 📞 Quick Support

**Common Questions:**

**Q: How many team members can I add?**
A: Unlimited, but recommend <50 for performance

**Q: Can I reorder members?**
A: Edit the `order` field (0, 1, 2...) or future drag-and-drop

**Q: What happens if I delete someone?**
A: Removed immediately from About page, can't undo

**Q: Do changes require page refresh?**
A: No! Real-time sync means instant updates

**Q: Can regular users edit team?**
A: No, admin role required (security rules)

---

*Quick Reference v1.0 | Team Management System*
