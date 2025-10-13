# Quote Request System - Quick Reference

## 🚀 Quick Start

### For Users (Public)
1. Go to `/services` page
2. Scroll to "Get Shipping Quote" form
3. Fill out all required fields (marked with *)
4. Click "Get Quote"
5. Wait for success message
6. Check email for quote response from admin

### For Admins
1. Login to admin panel
2. Click "Quote Requests" in sidebar
3. View real-time list of all quote requests
4. Click "View Details" to see full information
5. Update status as needed
6. Click "Send Email" to respond to customer

## 📋 Quick Actions

### Submit Quote Request
```
Route: /services
Action: Fill form → Click "Get Quote" → See success message
Result: New quote saved to Firestore
```

### View Quote Requests
```
Route: /admin/quotes
Action: Login as admin → View table
Result: Real-time list of all quotes
```

### Update Quote Status
```
Route: /admin/quotes
Action: Click "View Details" → Select new status → Auto-saves
Result: Status updated in Firestore
```

### Send Quote Email
```
Route: /admin/quotes
Action: Click "View Details" → Click "Send Email"
Result: Opens email client with customer email
```

## 🔍 Quick Search

### Search by:
- Customer name
- Email address
- Phone number
- Destination country

### Filter by Status:
- All Statuses
- Pending (Yellow)
- Reviewing (Blue)
- Quoted (Purple)
- Accepted (Green)
- Rejected (Red)

## 📊 Data Fields

### Required Fields (Customer Form):
- ✓ Service Type
- ✓ Weight (kg)
- ✓ Package Type
- ✓ Destination Country
- ✓ First Name
- ✓ Last Name
- ✓ Email
- ✓ Phone
- ✓ Delivery Address

### Auto-Generated Fields:
- Status (default: "Pending")
- Created At (timestamp)
- Document ID

## 🎯 Status Guide

| Status | Color | Meaning |
|--------|-------|---------|
| Pending | 🟡 Yellow | Just submitted, waiting for review |
| Reviewing | 🔵 Blue | Admin is reviewing the request |
| Quoted | 🟣 Purple | Quote sent to customer |
| Accepted | 🟢 Green | Customer accepted the quote |
| Rejected | 🔴 Red | Quote declined or not feasible |

## 🔔 Notifications

### Services Page:
- ✅ Success: "Quote Request Sent Successfully!" (6s)
- ❌ Error: "Failed to submit request" (persistent)

### Admin Panel:
- 🆕 New Quote: "1 new quote request received!" (5s)
- ✅ Status Updated: "Status updated successfully" (auto-dismiss)

## 🔐 Firebase Security Rules (Required!)

```javascript
match /quote_requests/{quoteId} {
  allow create: if true;  // Anyone can submit
  allow read, update: if request.auth != null;  // Admins only
}
```

**⚠️ IMPORTANT:** Add these rules to Firebase Console!

## 📱 Navigation

| Location | Route | Access |
|----------|-------|--------|
| Quote Form | `/services` | Public |
| Admin Quotes | `/admin/quotes` | Admin Only |

## 🛠️ Troubleshooting

### Quote not appearing in admin?
- Check Firebase security rules
- Verify form submission succeeded
- Check browser console for errors
- Refresh admin page

### Status not updating?
- Ensure admin is authenticated
- Check network connection
- Verify Firebase permissions
- Check console for errors

### Email button not working?
- Verify default email client is set
- Check customer email is valid
- Try right-click → Copy email address

## 📞 Quick Links

- Services Page: http://localhost:8080/services
- Admin Quotes: http://localhost:8080/admin/quotes
- Firebase Console: https://console.firebase.google.com/

## 🎓 Tips

1. **Real-time Updates**: No need to refresh - quotes appear instantly
2. **Search Smart**: Use partial matches for faster results
3. **Status Workflow**: Follow the natural progression (Pending → Reviewing → Quoted → Accepted)
4. **Email Template**: Prepare a standard quote email template for faster responses
5. **Filter First**: Use status filter to focus on pending quotes

## ⚡ Keyboard Shortcuts

- Search box: Click or type `/` (if implemented)
- Close dialog: `Esc` key
- Navigate table: Arrow keys (if row focus implemented)

---

**Need Help?** Check QUOTE_SYSTEM_DOCUMENTATION.md for detailed information.
