# Venkat Express - Header Component Visual Guide

## 🎨 Desktop Layout (≥1024px)

### Tier 1 - Main Header Bar
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃  ╭───╮   ┌─────────────────────────┐   ┌────────────────────────┐          ┃
┃  │ 📦 │   │  Shipping From:         │   │  Search for Indian... 🔍│          ┃
┃  │VE │   │  Hyderabad, Telangana🔽 │   └────────────────────────┘          ┃
┃  ╰───╯   └─────────────────────────┘                                        ┃
┃                                                                              ┃
┃                                            📦          ❤️         👤         ┃
┃                                       Track Order   Wishlist   Sign In      ┃
┃                                                                              ┃
┃                                                            🛒                ┃
┃                                                          ₹0.00               ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Tier 2 - Navigation Bar
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                              ┃
┃    ┌──────────────┐  ┌────────────────┐  ┌─────────────┐  ┌──────────────┐ ┃
┃    │ Shop Products│  │ Courier Services│  │ Track Order │  │  Food Items  │ ┃
┃    └──────────────┘  └────────────────┘  └─────────────┘  └──────────────┘ ┃
┃                                                                              ┃
┃    ┌─────────────────┐  ┌──────────┐  ┌──────────────────┐                 ┃
┃    │ Decorative Items│  │ About Us │  │ Prohibited Items │                 ┃
┃    └─────────────────┘  └──────────┘  └──────────────────┘                 ┃
┃                                                                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 📱 Tablet Layout (768px - 1023px)

### Main Header
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                   ┃
┃  ╭───╮    ┌──────────────────┐    📦 ❤️ 👤 🛒   ┃
┃  │ 📦 │    │ Search products...🔍│                ┃
┃  │VE │    └──────────────────┘                   ┃
┃  ╰───╯                                            ┃
┃                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Navigation Bar
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                   ┃
┃   ┌──────┐ ┌─────────┐ ┌────────┐ ┌─────────┐   ┃
┃   │ Shop │ │ Courier │ │ Track  │ │ About   │   ┃
┃   └──────┘ └─────────┘ └────────┘ └─────────┘   ┃
┃                                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 📱 Mobile Layout (<768px)

### Compact Header
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                              ┃
┃  ╭───╮                       ┃
┃  │ 📦 │  Venkat        🛒 ☰  ┃
┃  │VE │  Express              ┃
┃  ╰───╯                       ┃
┃                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### Mobile Drawer (slides from right)
```
                 ┏━━━━━━━━━━━━━━━━━━━━━━━━┓
                 ┃       Menu         ✕   ┃
                 ┃                         ┃
                 ┃  ┌──────────────────┐   ┃
                 ┃  │ Search...        │   ┃
                 ┃  └──────────────────┘   ┃
                 ┃                         ┃
                 ┃  ╭─────────────────╮   ┃
                 ┃  │  👤 Welcome!    │   ┃
                 ┃  │  user@email.com │   ┃
                 ┃  │  • Dashboard    │   ┃
                 ┃  │  • Order History│   ┃
                 ┃  ╰─────────────────╯   ┃
                 ┃                         ┃
                 ┃  Shop Products          ┃
                 ┃  Courier Services       ┃
                 ┃  Track Order            ┃
                 ┃  Food Items             ┃
                 ┃  Decorative Items       ┃
                 ┃  About Us               ┃
                 ┃  Prohibited Items       ┃
                 ┃  ❤️ Wishlist            ┃
                 ┃                         ┃
                 ┃  ┌──────────────────┐   ┃
                 ┃  │   Sign Out       │   ┃
                 ┃  └──────────────────┘   ┃
                 ┃                         ┃
                 ┗━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎯 Component Hierarchy

```
Header
│
├── Desktop Header (lg:block)
│   │
│   ├── Tier 1 Container
│   │   ├── Left Section
│   │   │   ├── Logo (circular with gradient)
│   │   │   └── LocationSelector (pill button)
│   │   │
│   │   ├── Center Section
│   │   │   └── Search Bar
│   │   │       ├── Input Field
│   │   │       └── Search Button (circular)
│   │   │
│   │   └── Right Section (User Actions)
│   │       ├── Track Order Link
│   │       │   ├── Package Icon
│   │       │   └── "Track Order" Label
│   │       │
│   │       ├── Wishlist Link
│   │       │   ├── Heart Icon
│   │       │   └── "Wishlist" Label
│   │       │
│   │       ├── User Account
│   │       │   ├── User Icon
│   │       │   ├── "Sign In" or "Account" Label
│   │       │   └── Dropdown Menu (on hover)
│   │       │       ├── Dashboard
│   │       │       ├── Order History
│   │       │       ├── Admin Panel (conditional)
│   │       │       └── Sign Out
│   │       │
│   │       └── Cart Button
│   │           ├── Shopping Cart Icon
│   │           ├── Item Count Badge
│   │           └── Price Display
│   │
│   └── Tier 2 Container
│       └── Navigation Pills
│           ├── Shop Products
│           ├── Courier Services
│           ├── Track Order
│           ├── Food Items
│           ├── Decorative Items
│           ├── About Us
│           └── Prohibited Items
│
├── Tablet Header (md:block lg:hidden)
│   ├── Logo + Search + Icons
│   └── Simplified Navigation Pills
│
└── Mobile Header (md:hidden)
    ├── Compact Bar
    │   ├── Logo
    │   └── Actions (Cart + Menu)
    │
    └── Mobile Drawer (AnimatePresence)
        ├── Backdrop Overlay
        └── Drawer Panel
            ├── Header (Menu title + Close)
            ├── Search Input
            ├── User Profile Section
            ├── Navigation Links
            └── Sign Out Button
```

---

## 🎨 Color Scheme

```css
/* Primary Colors */
Background:     #FFFFFF (White)
Primary Navy:   HSL(210, 80%, 15%)
Accent Gold:    HSL(45, 85%, 52%)

/* Secondary Colors */
Gray 50:        #F9FAFB
Gray 100:       #F3F4F6
Gray 200:       #E5E7EB
Gray 300:       #D1D5DB
Gray 600:       #4B5563
Gray 900:       #111827

/* Functional Colors */
Success:        #10B981
Error:          #EF4444
Warning:        #F59E0B
Info:           #3B82F6
```

---

## 📐 Spacing & Sizing

### Header Heights
```
Desktop Tier 1:    64px (h-16)
Desktop Tier 2:    48px (py-3)
Tablet Header:     56px (h-14)
Mobile Header:     56px (h-14)
```

### Logo Sizes
```
Desktop:    48px × 48px (w-12 h-12)
Tablet:     40px × 40px (w-10 h-10)
Mobile:     40px × 40px (w-10 h-10)
```

### Icon Sizes
```
Desktop User Actions:  24px (h-6 w-6)
Tablet Icons:          20px (h-5 w-5)
Mobile Icons:          20px (h-5 w-5)
Search Button Icon:    20px (h-5 w-5)
```

### Spacing
```
Desktop Gap:        24px (gap-6)
Tablet Gap:         12px (gap-3)
Mobile Gap:         8px (gap-2)

Container Padding:  16px-24px (px-4 lg:px-6)
Pill Padding:       20px horizontal (px-5)
                    8px vertical (py-2)
```

---

## 🔄 State Transitions

### Search Bar
```
Default:  border-gray-300
Focus:    border-primary + ring-primary/20
Hover:    (smooth transition)
```

### Navigation Pills
```
Default:  bg-white, border-gray-200
Hover:    border-primary + shadow-md
Active:   (same as hover)
```

### Mobile Drawer
```
Opening:  X-axis: 100% → 0%
Closing:  X-axis: 0% → 100%
Duration: 300ms
Easing:   spring(damping: 25)
```

### Cart Badge
```
Show:     totalItems > 0
Hide:     totalItems === 0
Position: absolute -top-2 -right-2
```

---

## 🎭 Interactive Elements

### Hoverable Elements
1. ✅ Logo (color change)
2. ✅ Location Pill (background change)
3. ✅ Search Button (background darken)
4. ✅ Track Order (scale + color)
5. ✅ Wishlist (scale + color)
6. ✅ User Account (shows dropdown)
7. ✅ Cart (scale)
8. ✅ Navigation Pills (border + shadow)
9. ✅ Mobile Menu Items (background)

### Clickable Elements
1. ✅ Logo → Home
2. ✅ Location Pill → Location Dialog
3. ✅ Search Button → Submit Search
4. ✅ Track Order → Dashboard
5. ✅ Wishlist → Wishlist Page
6. ✅ User Account → Dropdown Menu
7. ✅ Cart → Mini Cart Drawer
8. ✅ Hamburger Menu → Mobile Drawer
9. ✅ All Navigation Pills → Respective Pages

---

## 📱 Touch Targets (Mobile)

All interactive elements meet minimum touch target size:

```
Minimum Size:   44px × 44px
Logo:           40px + 8px padding = 48px ✅
Cart Button:    44px × 44px ✅
Menu Button:    44px × 44px ✅
Drawer Links:   Full width × 48px ✅
```

---

## ♿ Accessibility Features

### Semantic HTML
```html
<header>      → Main header landmark
<nav>         → Navigation landmark
<form>        → Search form
<button>      → Interactive buttons
<a>           → Navigation links
```

### Keyboard Navigation
- Tab:        Move between interactive elements
- Enter:      Activate buttons/links
- Escape:     Close mobile drawer
- Space:      Activate buttons

### Screen Reader Support
- All images have alt text (via aria-label ready)
- Buttons have descriptive labels
- Links have meaningful text
- Form inputs have labels

---

## 🚀 Performance Considerations

### Rendering Strategy
```typescript
// Desktop - renders only when lg breakpoint
{/* hidden lg:block */}

// Tablet - renders only in md range
{/* hidden md:block lg:hidden */}

// Mobile - renders only on mobile
{/* md:hidden */}
```

### Animation Performance
```typescript
// Hardware-accelerated transforms
transform: translateX()  // ✅ Efficient
opacity: 0 → 1          // ✅ Efficient

// Avoided properties
left/right: 100% → 0%   // ❌ Causes reflow
width: 0 → 300px        // ❌ Causes reflow
```

### Lazy Loading
```typescript
// Drawer only mounts when needed
<AnimatePresence>
  {showMobileMenu && <Drawer />}
</AnimatePresence>
```

---

## 🔍 Implementation Details

### Search Functionality
```typescript
const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: Integrate with search API
  console.log('Searching for:', searchQuery);
  // Navigate to /products?q={searchQuery}
};
```

### Cart Integration
```typescript
// Real-time updates from CartContext
const { totalItems, subtotal } = useCart();

// Display
<span>₹{subtotal.toFixed(2)}</span>
<Badge>{totalItems}</Badge>
```

### User Authentication
```typescript
// Conditional rendering
{user ? (
  <AccountDropdown user={user} />
) : (
  <SignInLink />
)}
```

---

## 📝 Code Snippets

### Location Pill Component
```tsx
<button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
  <div className="flex flex-col items-start">
    <span className="text-xs text-gray-600">Shipping From:</span>
    <span className="text-sm font-semibold">
      Hyderabad, Telangana • India
    </span>
  </div>
  <ChevronDown className="h-4 w-4" />
</button>
```

### Search Bar
```tsx
<form onSubmit={handleSearch}>
  <div className="relative flex items-center">
    <input
      type="text"
      placeholder="Search for Indian food, spices, decorative items..."
      className="w-full h-12 pl-5 pr-14 rounded-full border-2"
    />
    <button className="absolute right-1 w-10 h-10 rounded-full bg-primary">
      <Search className="h-5 w-5 text-white" />
    </button>
  </div>
</form>
```

### Navigation Pill
```tsx
<Link
  to="/products"
  className="px-5 py-2 rounded-full bg-white border border-gray-200 
             hover:border-primary hover:shadow-md transition-all"
>
  Shop Products
</Link>
```

---

## 📚 Resources

### Icon Library (Lucide React)
- Search: `<Search />`
- Heart: `<Heart />`
- Package: `<Package />`
- User: `<User />`
- ShoppingCart: `<ShoppingCart />`
- Menu: `<Menu />`
- Shield: `<Shield />`
- ChevronDown: `<ChevronDown />`

### Animation Library (Framer Motion)
```tsx
import { motion, AnimatePresence } from 'framer-motion';

<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 25 }}
/>
```

---

**End of Visual Guide**  
For more details, see `HEADER_DOCUMENTATION.md`
