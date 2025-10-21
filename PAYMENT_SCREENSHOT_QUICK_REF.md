# Payment Screenshot Upload - Quick Reference

## 🎯 Quick Access

**Customer Flow:** `/payment` → Upload Screenshot → Confirm Order  
**Admin View:** `/admin/orders` → Select Order → Payment Confirmation Details

---

## 🚀 Quick Start (Customer)

### Upload Payment Screenshot
1. Complete UPI payment
2. Go to payment confirmation page
3. Enter UPI Transaction ID
4. **Click upload area** (optional)
5. Select screenshot (max 5MB, image only)
6. Preview appears automatically
7. Click "Confirm Order"

**Skip Upload:** Just leave it empty - completely optional!

---

## 👨‍💼 Quick Start (Admin)

### View Payment Screenshot
1. Go to **Admin Orders**
2. Click on any order
3. See **"Payment Confirmation Details"** section (green card)
4. View:
   - UPI Transaction ID
   - Payment Screenshot (if uploaded)
5. **Click screenshot** to open full size

---

## 📸 Screenshot Requirements

| Requirement | Details |
|-------------|---------|
| **Format** | Any image (JPG, PNG, WEBP, etc.) |
| **Max Size** | 5MB |
| **Required?** | ❌ No - Optional |
| **Where stored** | Cloudinary CDN |

---

## 🔧 Technical Stack

```
Customer Upload → Cloudinary → Firestore → Admin Dashboard
```

| Component | Technology |
|-----------|------------|
| Upload UI | React + TypeScript |
| File Upload | Cloudinary API |
| Storage | Firestore (`paymentScreenshotUrl`) |
| Preview | FileReader API |
| Admin View | Dialog with image viewer |

---

## 📁 Firestore Structure

```javascript
orders (collection)
  └── {orderId} (document)
       ├── upiTransactionId: "123456789"
       ├── paymentScreenshotUrl: "https://res.cloudinary.com/..." // NEW
       ├── paymentMethod: "UPI"
       ├── paymentStatus: "Pending Verification"
       └── ... other fields
```

---

## 🎨 UI Components

### Customer View (Payment Page)

```
┌───────────────────────────────────────┐
│  UPI Transaction ID *                 │
│  [Enter transaction ID]               │
└───────────────────────────────────────┘

┌───────────────────────────────────────┐
│  Upload Payment Screenshot (Optional) │
│                                       │
│     📤                                │
│     Click to upload screenshot        │
│     PNG, JPG, WEBP up to 5MB         │
└───────────────────────────────────────┘

or if uploaded:

┌───────────────────────────────────────┐
│  [Preview Image]              [✕]     │
│  screenshot.jpg                       │
└───────────────────────────────────────┘
```

### Admin View (Order Details)

```
┌─────────────────────────────────────────┐
│ 💳 Payment Confirmation Details         │
├─────────────────────────────────────────┤
│  UPI Transaction ID: 123456789          │
│  Payment Method: UPI                    │
│                                         │
│  Payment Screenshot:                    │
│  ┌─────────────────────────────┐      │
│  │                             │      │
│  │    [Screenshot Image]       │      │
│  │                             │      │
│  │  Click image to view full   │      │
│  └─────────────────────────────┘      │
│                                         │
│  Status: Pending Verification           │
└─────────────────────────────────────────┘
```

---

## ⚡ Key Features

- ✅ **Optional** - Won't block checkout
- ✅ **Auto-upload** - Uploads when order confirmed
- ✅ **Preview** - See before submitting
- ✅ **Validation** - Type & size checks
- ✅ **Secure** - Cloudinary HTTPS URLs
- ✅ **Clickable** - Admin can view full size
- ✅ **Error-proof** - Order proceeds even if upload fails

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Upload fails | Check file size (<5MB) and type (image) |
| Preview not showing | Try different image format |
| Not visible in admin | Refresh page, check `paymentScreenshotUrl` field |
| Slow upload | Check internet connection, compress image |

---

## 💻 Code Snippets

### Upload Screenshot (Customer)
```typescript
const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('Image size should be less than 5MB');
    return;
  }

  // Set file and create preview
  setPaymentScreenshot(file);
  const reader = new FileReader();
  reader.onloadend = () => setScreenshotPreview(reader.result);
  reader.readAsDataURL(file);
};
```

### Include in Order (Backend)
```typescript
// Upload to Cloudinary if screenshot exists
let screenshotUrl = '';
if (paymentScreenshot) {
  screenshotUrl = await uploadToCloudinary(paymentScreenshot, 'image');
}

// Include in order data
const orderData = {
  // ... other fields
  upiTransactionId: transactionId.trim(),
  paymentScreenshotUrl: screenshotUrl || '',
};
```

### Display in Admin
```tsx
{order.paymentScreenshotUrl && (
  <div>
    <img
      src={order.paymentScreenshotUrl}
      alt="Payment Screenshot"
      onClick={() => window.open(order.paymentScreenshotUrl, '_blank')}
      className="cursor-pointer"
    />
  </div>
)}
```

---

## 📊 At a Glance

| Feature | Status | Notes |
|---------|--------|-------|
| Customer Upload | ✅ Working | Optional field |
| File Validation | ✅ Working | Type + size checks |
| Cloudinary Upload | ✅ Working | Automatic |
| Firestore Storage | ✅ Working | In `orders` collection |
| Admin Display | ✅ Working | Clickable image |
| Error Handling | ✅ Working | Graceful fallbacks |

---

## 🔗 Related Files

- **Payment Page:** `src/pages/Payment.tsx`
- **Order Utils:** `src/lib/orderUtils.ts`
- **Admin Detail:** `src/pages/admin/AdminOrderDetail.tsx`
- **Cloudinary:** `src/lib/cloudinary.ts`

---

## 📞 Support

**Issue:** Screenshot not uploading?  
**Check:** File size (<5MB), type (image/*), network connection

**Issue:** Not showing in admin?  
**Check:** Firestore field `paymentScreenshotUrl`, refresh browser

**Issue:** Preview not working?  
**Check:** Browser supports FileReader API (all modern browsers)

---

**Last Updated:** October 18, 2025  
**Status:** Production Ready ✅
