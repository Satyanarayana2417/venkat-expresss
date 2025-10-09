# Admin Dashboard - Quick Reference Guide

## 🚀 Quick Start

### Access the Admin Panel:
1. Navigate to: `http://localhost:8080/admin`
2. Login with admin credentials
3. You'll land on the Dashboard overview

### Old Admin Panel (Backup):
- URL: `http://localhost:8080/admin-legacy`
- Contains all original functionality

---

## 📂 Component Hierarchy

```
AdminAuth.tsx (Authentication Wrapper)
    └── AdminRouter.tsx (Route Handler)
            ├── AdminDashboard.tsx
            │       ├── AdminLayout
            │       ├── DashboardStats
            │       ├── SalesChart
            │       └── RecentOrders
            │
            ├── AdminProducts.tsx
            │       └── AdminLayout
            │
            ├── AdminOrders.tsx
            │       └── AdminLayout
            │
            └── [Other Admin Pages]
                    └── AdminLayout
```

---

## 🎯 Key Components Reference

### 1. AdminLayout
**Location:** `src/components/admin/AdminLayout.tsx`

**Props:**
```typescript
interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}
```

**Usage:**
```tsx
<AdminLayout title="Dashboard">
  {/* Your page content */}
</AdminLayout>
```

**Features:**
- Sidebar navigation
- Header with user menu
- Logout functionality
- Responsive design

---

### 2. DashboardStats
**Location:** `src/components/admin/DashboardStats.tsx`

**Props:**
```typescript
interface DashboardStatsProps {
  products: any[];
  orders?: any[];
  users?: any[];
}
```

**Usage:**
```tsx
<DashboardStats 
  products={products} 
  orders={orders}
  users={users}
/>
```

**Displays:**
- Total Revenue
- Total Orders
- Products Count
- New Customers
- Low Stock Items

---

### 3. SalesChart
**Location:** `src/components/admin/SalesChart.tsx`

**Props:**
```typescript
interface SalesChartProps {
  type?: 'line' | 'bar';
}
```

**Usage:**
```tsx
<SalesChart type="line" />
```

**Features:**
- Line or Bar chart
- Last 30 days data
- Responsive
- Interactive tooltips

---

### 4. RecentOrders
**Location:** `src/components/admin/RecentOrders.tsx`

**Props:**
```typescript
interface RecentOrdersProps {
  orders?: Order[];
}
```

**Usage:**
```tsx
<RecentOrders orders={ordersList} />
```

**Displays:**
- 5 most recent orders
- Status badges
- Order totals
- Link to full orders page

---

## 🛣️ Routing Structure

### Routes:
```typescript
/admin                  → AdminDashboard
/admin/products         → AdminProducts
/admin/orders           → AdminOrders
/admin/requests         → AdminRequests
/admin/users            → AdminUsers
/admin/settings         → AdminSettings
/admin-legacy           → Old Admin Panel
```

### Adding New Admin Routes:

1. Create new page in `src/pages/admin/`
2. Import in `AdminRouter.tsx`
3. Add route:

```tsx
// In AdminRouter.tsx
import { NewPage } from './admin/NewPage';

<Routes>
  {/* existing routes */}
  <Route path="new-page" element={<NewPage />} />
</Routes>
```

4. Add to sidebar in `AdminLayout.tsx`:

```tsx
const navigation = [
  // existing items
  { name: 'New Page', href: '/admin/new-page', icon: IconName },
];
```

---

## 🎨 Styling Guidelines

### Colors:
```css
Primary:     bg-yellow-400 to bg-yellow-600
Success:     text-green-600
Warning:     text-orange-600
Error:       text-red-600
Info:        text-blue-600
```

### Spacing:
```css
Page Container:  p-4 lg:p-6
Card Padding:    p-6
Gap Spacing:     gap-4, gap-6
Section Space:   space-y-6
```

### Typography:
```css
Page Title:      text-xl font-semibold
Card Title:      text-sm font-medium
Body Text:       text-sm
Caption:         text-xs text-gray-500
```

---

## 🔧 Common Tasks

### Add a New Stat Card:

```tsx
// In DashboardStats.tsx, add to stats array:
{
  title: 'Your Metric',
  value: calculatedValue,
  description: 'Description text',
  icon: IconComponent,
  iconColor: 'text-blue-600',
  trend: { value: 5.2, isPositive: true }
}
```

### Add a New Table:

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.field1}</TableCell>
        <TableCell>{item.field2}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Add Status Badge:

```tsx
import { Badge } from '@/components/ui/badge';

<Badge 
  variant="outline" 
  className="bg-green-100 text-green-800 border-green-200"
>
  Active
</Badge>
```

### Add Confirmation Dialog:

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const [dialogOpen, setDialogOpen] = useState(false);

<AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>
        Confirm
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 🔍 Debugging Tips

### Check Console Logs:
```typescript
// AdminAuth.tsx logs authentication flow
console.log('User role:', role, '- Admin access required');
console.log('Admin access granted - Role:', role);
```

### React DevTools:
- Check component props
- Inspect AdminLayout state
- Monitor re-renders

### Network Tab:
- Firebase queries
- Authentication requests
- Data fetching

---

## 📦 Dependencies Used

### UI Components:
- `@radix-ui/*` - UI primitives (already installed)
- `lucide-react` - Icons (already installed)
- `recharts` - Charts (already installed)

### Utilities:
- `clsx` - Class merging
- `tailwind-merge` - Tailwind utilities
- `framer-motion` - Animations (already installed)

### No New Dependencies Required! ✅

---

## ⚠️ Important Hooks

### useProducts:
```tsx
const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
```

### useAuth:
```tsx
const { user, signIn, signOut } = useAuth();
```

### useUserRole:
```tsx
const { isAdmin, role, loading } = useUserRole();
```

---

## 🐛 Common Issues & Solutions

### Issue: Sidebar not showing
**Solution:** Check if route starts with `/admin`

### Issue: Authentication loop
**Solution:** Clear browser cache and re-login

### Issue: Charts not rendering
**Solution:** Ensure recharts is installed: `npm install recharts`

### Issue: Icons not showing
**Solution:** Import from `lucide-react`: `import { Icon } from 'lucide-react'`

### Issue: Admin not accessible
**Solution:** 
1. Check Firebase user role
2. Verify `isAdmin` is true
3. Check console for errors

---

## 🔒 Security Checklist

- [x] Admin-only routes protected
- [x] Role verification on mount
- [x] Logout clears session
- [x] Non-admin users rejected
- [x] Confirmation for destructive actions

---

## 📊 Performance Tips

1. **Use pagination** - Don't load all products at once
2. **Implement search debouncing** - Wait before searching
3. **Lazy load images** - Use loading="lazy"
4. **Memoize expensive calculations** - Use useMemo
5. **Optimize re-renders** - Use React.memo for components

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] Test all admin routes
- [ ] Verify authentication works
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Verify old admin panel still works
- [ ] Check console for errors
- [ ] Test logout functionality
- [ ] Verify all links work

---

## 📞 Support

### Documentation:
- Main Summary: `ADMIN_REDESIGN_SUMMARY.md`
- Visual Guide: `ADMIN_VISUAL_GUIDE.md`
- Quick Ref: `ADMIN_QUICK_REFERENCE.md` (this file)

### Code Structure:
```
components/admin/    → Layout & shared components
pages/admin/         → Individual admin pages
pages/AdminAuth.tsx  → Authentication wrapper
pages/AdminRouter.tsx → Route definitions
```

---

## 🎓 Learning Resources

### Radix UI:
- Docs: https://www.radix-ui.com/
- Used for: Dialogs, Dropdowns, Tooltips

### Recharts:
- Docs: https://recharts.org/
- Used for: Sales charts

### Lucide Icons:
- Browser: https://lucide.dev/
- Used for: All icons

### Tailwind CSS:
- Docs: https://tailwindcss.com/
- Used for: All styling

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** October 5, 2025  
**Status:** ✅ Production Ready
