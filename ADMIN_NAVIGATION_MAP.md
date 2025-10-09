# 🗺️ Admin Dashboard Navigation Map

```
┌─────────────────────────────────────────────────────────────────┐
│                     VENKAT EXPRESS ADMIN                         │
│                         Admin Panel                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────┐
│   SIDEBAR        │           MAIN CONTENT AREA                  │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 📊 Dashboard     │  • Stats Cards (Revenue, Orders, Products)  │
│   /admin         │  • Sales Line Chart                          │
│                  │  • ⚠️ LOW STOCK ALERTS (NEW!)               │
│                  │  • Recent Orders Table                       │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 📈 Analytics     │  • Date Range Selector (7/30/60/90 days)   │
│   /admin/        │  • Custom Date Picker                        │
│   analytics      │  • Revenue & Orders Chart (Dual-Axis)       │
│   [NEW!]         │  • Top-Selling Products List                 │
│                  │  • Sales by Category Pie Chart               │
│                  │  • Export to CSV Button                      │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 📦 Products      │  • Search Bar                                │
│   /admin/        │  • ✓ BULK ACTIONS BAR (NEW!)               │
│   products       │    - Select All Checkbox                     │
│                  │    - Delete Selected                         │
│                  │    - Change Category                         │
│                  │  • Product Table with Images                 │
│                  │  • Edit/Delete Actions                       │
│                  │  • Pagination                                │
│                  │                                              │
│                  │  /products/add  → Add New Product Form       │
│                  │  /products/edit/:id → Edit Product Form      │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 🛒 Orders        │  • Search & Filter Bar                       │
│   /admin/orders  │  • Orders Table                              │
│                  │  • Status Badges                             │
│                  │  • Order Details                             │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 📝 Requests      │  • Customer Service Requests                 │
│   /admin/        │  • Request Management                        │
│   requests       │                                              │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 👥 Users         │  • Search by Email/Name                      │
│   /admin/users   │  • Filter by Role (All/Customer/Admin)      │
│   [ENHANCED!]    │  • User List Table                           │
│                  │    - Avatar & Name                           │
│                  │    - ⚡ Role Dropdown (Switch Roles)        │
│                  │    - Join Date                               │
│                  │    - View Details Button                     │
│                  │                                              │
│                  │  /users/:userId → USER DETAIL PAGE           │
│                  │    ├─ Profile Card                           │
│                  │    ├─ Order History Table                    │
│                  │    └─ Wishlist Grid                          │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ 🎫 Discounts     │  • Stats Cards (Active/Inactive/Expired)    │
│   /admin/        │  • Create Coupon Button                      │
│   discounts      │  • Coupons Table                             │
│   [NEW!]         │    - Code (Copy to Clipboard)               │
│                  │    - Discount Type & Value                   │
│                  │    - Expiration Date                         │
│                  │    - Usage Count/Limit                       │
│                  │    - ⚡ Active/Inactive Toggle              │
│                  │    - Edit/Delete Actions                     │
│                  │                                              │
│                  │  CREATE/EDIT DIALOG:                         │
│                  │    ├─ Coupon Code                            │
│                  │    ├─ Discount Type (% or Fixed)            │
│                  │    ├─ Discount Value                         │
│                  │    ├─ Expiration Date Picker                 │
│                  │    ├─ Min Purchase (optional)                │
│                  │    ├─ Max Discount (optional)                │
│                  │    ├─ Usage Limit (optional)                 │
│                  │    └─ Active Toggle                          │
├──────────────────┼──────────────────────────────────────────────┤
│                  │                                              │
│ ⚙️ Settings      │  • Admin Settings                            │
│   /admin/        │  • Configuration Options                     │
│   settings       │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

## 🎨 Color Legend

- 🟡 **Yellow**: Primary actions & buttons
- 🟢 **Green**: Active status, success states
- 🔴 **Red**: Delete actions, alerts, expired
- 🟠 **Orange**: Warnings, low stock alerts
- 🔵 **Blue**: Secondary information
- ⚫ **Gray**: Inactive, disabled states

## 🔑 Key Features by Page

### Dashboard
✅ Real-time stats  
✅ Sales visualization  
✅ Low stock monitoring  
✅ Recent orders overview

### Analytics [NEW]
✅ Advanced date filtering  
✅ Multi-metric tracking  
✅ Data visualization  
✅ Export capabilities

### Products
✅ Bulk operations  
✅ Stock management  
✅ Category organization  
✅ Full CRUD operations

### Users [ENHANCED]
✅ Role management  
✅ User profiles  
✅ Order tracking  
✅ Wishlist monitoring

### Discounts [NEW]
✅ Coupon creation  
✅ Flexible discount types  
✅ Usage tracking  
✅ Status management

## 🚀 Quick Actions

| Action | Location | Steps |
|--------|----------|-------|
| Create Coupon | Discounts | Click "Create Coupon" → Fill form → Save |
| Change User Role | Users | Find user → Select role from dropdown |
| Bulk Delete Products | Products | Select products → Choose "Delete" → Apply |
| View Analytics | Analytics | Select date range → View charts |
| Check Low Stock | Dashboard | Scroll to "Low Stock Items" widget |
| Export Report | Analytics | Select dates → Click "Export CSV" |

## 📱 Responsive Design

All pages work seamlessly on:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

---

**Navigation Tip**: Use the sidebar to quickly jump between sections. The active page is highlighted in yellow!
