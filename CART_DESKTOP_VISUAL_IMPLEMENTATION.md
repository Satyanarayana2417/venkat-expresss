# Desktop Cart - Implementation Visual Guide

## 🎯 Exact Implementation Reference

This guide shows the exact structure and styling implemented in the desktop cart page.

---

## 📐 Complete Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DESKTOP CART PAGE (≥768px)                          │
│                     bg-gray-50, min-h-screen                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TABS SECTION - bg-white, border-b                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ Container: mx-auto px-4                                                 ││
│ │ ┌─────────────────────┐  ┌──────────┐                                  ││
│ │ │ Flipkart (1)        │  │ Grocery  │                                  ││
│ │ │ py-4 px-2           │  │ py-4 px-2│                                  ││
│ │ │ border-b-2          │  │ text-gray││                                  ││
│ │ │ border-blue-600     │  │ -500     │                                  ││
│ │ │ text-blue-600       │  │          │                                  ││
│ │ │ font-medium         │  │          │                                  ││
│ │ └─────────────────────┘  └──────────┘                                  ││
│ └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ MAIN CONTENT - Container: mx-auto px-4 py-6                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐│
│ │ Grid: grid-cols-1 lg:grid-cols-3 gap-4                                  ││
│ │                                                                          ││
│ │ ┌─────────────────────────────────────┐  ┌──────────────────────────┐  ││
│ │ │ LEFT COLUMN (lg:col-span-2)         │  │ RIGHT COLUMN             │  ││
│ │ │ space-y-4                           │  │ (lg:col-span-1)          │  ││
│ │ │                                     │  │                          │  ││
│ │ │ ┌─────────────────────────────────┐ │  │ ┌──────────────────────┐ │  ││
│ │ │ │ DELIVERY ADDRESS CARD           │ │  │ │ PRICE DETAILS CARD   │ │  ││
│ │ │ │ Card p-5                        │ │  │ │ Card p-5 sticky top-4│ │  ││
│ │ │ │                                 │ │  │ │                      │ │  ││
│ │ │ │ Deliver to: East Godavari       │ │  │ │ PRICE DETAILS        │ │  ││
│ │ │ │ - 533005                        │ │  │ │ text-gray-500        │ │  ││
│ │ │ │                      [Change]   │ │  │ │ text-sm uppercase    │ │  ││
│ │ │ │                      (Button    │ │  │ │ border-b pb-4 mb-4   │ │  ││
│ │ │ │                      outline    │ │  │ │                      │ │  ││
│ │ │ │                      blue)      │ │  │ │ space-y-4 mb-4       │ │  ││
│ │ │ └─────────────────────────────────┘ │  │ │ pb-4 border-b        │ │  ││
│ │ │                                     │  │ │                      │ │  ││
│ │ │ ┌─────────────────────────────────┐ │  │ │ Price (1 item)       │ │  ││
│ │ │ │ CART ITEMS CARD                 │ │  │ │ ₹2,999               │ │  ││
│ │ │ │ Card p-0 overflow-hidden        │ │  │ │                      │ │  ││
│ │ │ │                                 │ │  │ │ Discount             │ │  ││
│ │ │ │ ┌─────────────────────────────┐ │ │  │ │ − ₹2,705 (green)     │ │  ││
│ │ │ │ │ PRODUCT ITEM 1              │ │ │  │ │                      │ │  ││
│ │ │ │ │ motion.div p-5              │ │ │  │ │ Coupons for you      │ │  ││
│ │ │ │ │                             │ │ │  │ │ − ₹74 (green)        │ │  ││
│ │ │ │ │ flex gap-4                  │ │ │  │ │                      │ │  ││
│ │ │ │ │                             │ │ │  │ │ Platform Fee         │ │  ││
│ │ │ │ │ ┌─────────┐ ┌─────────────┐ │ │  │ │ ₹7                   │ │  ││
│ │ │ │ │ │  IMAGE  │ │   DETAILS   │ │ │  │ │                      │ │  ││
│ │ │ │ │ │  112px  │ │   Section   │ │ │  │ │ Delivery Charges     │ │  ││
│ │ │ │ │ │  x      │ │             │ │ │  │ │ ₹40 Free (green)     │ │  ││
│ │ │ │ │ │  112px  │ │ • Title     │ │ │  │ │                      │ │  ││
│ │ │ │ │ │         │ │ • Seller    │ │ │  │ │ ───────────────────  │ │  ││
│ │ │ │ │ │ border  │ │   + Badge   │ │ │  │ │                      │ │  ││
│ │ │ │ │ │ rounded │ │ • Prices    │ │ │  │ │ Total Amount         │ │  ││
│ │ │ │ │ └─────────┘ │ • Discount  │ │ │  │ │ ₹227 (font-semibold) │ │  ││
│ │ │ │ │             │ • Or Pay    │ │ │  │ │                      │ │  ││
│ │ │ │ │             │ • Delivery  │ │ │  │ │ ───────────────────  │ │  ││
│ │ │ │ │             │ • Actions   │ │ │  │ │                      │ │  ││
│ │ │ │ │             └─────────────┘ │ │  │ │ ┌──────────────────┐ │ │  ││
│ │ │ │ │                             │ │ │  │ │ You will save    │ │ │  ││
│ │ │ │ │ [-] 1 [+]  SAVE | REMOVE   │ │ │  │ │ ₹2,772 on order  │ │ │  ││
│ │ │ │ └─────────────────────────────┘ │ │  │ │ bg-green-50      │ │ │  ││
│ │ │ │                                 │ │  │ │ text-green-700   │ │ │  ││
│ │ │ │ ─────────────────────────────── │ │  │ │ font-medium      │ │ │  ││
│ │ │ │ (divider: border-t mx-5)        │ │  │ └──────────────────┘ │ │  ││
│ │ │ │                                 │ │  │ │                      │ │  ││
│ │ │ │ ┌─────────────────────────────┐ │ │  │ │ 🛡️ Safe and Secure │ │  ││
│ │ │ │ │ PRODUCT ITEM 2              │ │ │  │ │ Payments...         │ │  ││
│ │ │ │ │ (same structure)            │ │ │  │ │ (text-xs)           │ │  ││
│ │ │ │ └─────────────────────────────┘ │ │  │ └──────────────────────┘ │  ││
│ │ │ │                                 │ │  │                          │  ││
│ │ │ │ ─────────────────────────────── │ │  └──────────────────────────┘  ││
│ │ │ │ (border-t p-5 bg-white)         │ │                                ││
│ │ │ │                                 │ │                                ││
│ │ │ │        ┌──────────────────────┐ │ │                                ││
│ │ │ │        │   PLACE ORDER        │ │ │                                ││
│ │ │ │        │   bg-orange-500      │ │ │                                ││
│ │ │ │        │   hover:orange-600   │ │ │                                ││
│ │ │ │        │   text-white         │ │ │                                ││
│ │ │ │        │   px-16 py-5         │ │ │                                ││
│ │ │ │        │   text-base          │ │ │                                ││
│ │ │ │        │   font-medium        │ │ │                                ││
│ │ │ │        └──────────────────────┘ │ │                                ││
│ │ │ └─────────────────────────────────┘ │                                ││
│ │ └─────────────────────────────────────┘                                ││
│ └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Detailed Component Styling

### 1. Tabs Section
```tsx
<div className="bg-white border-b">
  <div className="container mx-auto px-4">
    <div className="flex items-center gap-8">
      {/* Active Tab */}
      <button className="py-4 px-2 border-b-2 border-blue-600 text-blue-600 font-medium">
        Flipkart ({items.length})
      </button>
      
      {/* Inactive Tab */}
      <button className="py-4 px-2 text-gray-500 font-medium">
        Grocery
      </button>
    </div>
  </div>
</div>
```

**Colors:**
- Active: `border-blue-600` (#2563eb), `text-blue-600`
- Inactive: `text-gray-500` (#6b7280)
- Background: `bg-white`
- Divider: `border-b` (gray-200)

---

### 2. Delivery Address Card
```tsx
<Card className="p-5">
  <div className="flex items-start justify-between">
    <div>
      <h3 className="font-medium text-gray-700 mb-2">
        Deliver to: <span className="font-semibold text-gray-900">East Godavari - 533005</span>
      </h3>
    </div>
    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
      Change
    </Button>
  </div>
</Card>
```

**Structure:**
- Padding: `p-5` (1.25rem)
- Layout: Flex with `justify-between`
- Label: `font-medium text-gray-700`
- Location: `font-semibold text-gray-900`
- Button: Outline style, blue accent

---

### 3. Product Card Details

#### Image Section
```tsx
<div className="flex-shrink-0">
  <img
    src={item.image}
    alt={item.title}
    className="w-28 h-28 object-cover rounded border"
  />
</div>
```
- Size: `w-28 h-28` (112px × 112px)
- Fit: `object-cover`
- Style: `rounded border`

#### Title
```tsx
<h3 className="text-base font-medium text-gray-900 mb-1 line-clamp-2">
  {item.title}
</h3>
```
- Font: Base size, medium weight
- Color: Gray-900 (near black)
- Lines: Max 2 lines with ellipsis

#### Seller Info
```tsx
<p className="text-sm text-gray-600 mb-2">
  Seller:<span className="font-medium">ArmadoFashion</span> 
  <span className="inline-flex items-center ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded">
    <svg className="w-3 h-3 mr-0.5">...</svg>
    Assured
  </span>
</p>
```
- Label: Small text, gray-600
- Name: Font-medium
- Badge: Blue background, white text, star icon

#### Price Display
```tsx
<div className="flex items-center gap-3 mb-2">
  {/* Original Price */}
  <span className="text-gray-400 line-through text-sm">
    ₹{item.originalPrice.toLocaleString('en-IN')}
  </span>
  
  {/* Current Price */}
  <span className="text-2xl font-medium text-gray-900">
    ₹{item.priceINR.toLocaleString('en-IN')}
  </span>
  
  {/* Discount % */}
  <span className="text-green-600 font-medium text-sm">
    {discount}% Off
  </span>
</div>
```

**Size Hierarchy:**
- Original: Small, strikethrough, gray-400
- Current: 2xl (1.5rem), medium, gray-900 ← **Largest**
- Discount: Small, medium, green-600

#### Or Pay (EMI)
```tsx
<p className="text-sm text-gray-600 mb-3">
  Or Pay ₹{Math.round(item.priceINR / 3)} + 
  <span className="text-yellow-600">⚡</span> {item.qty > 1 ? item.qty * 5 : 15}
</p>
```

#### Delivery Info
```tsx
<p className="text-sm text-gray-700 mb-4">
  Delivery in 6 - 7 days
</p>
```

#### Action Buttons
```tsx
<div className="flex items-center gap-4">
  {/* Quantity Control */}
  <div className="flex items-center border rounded">
    <button className="px-3 py-1 hover:bg-gray-50 border-r">
      <Minus className="h-4 w-4" />
    </button>
    <span className="px-4 py-1 font-medium">{item.qty}</span>
    <button className="px-3 py-1 hover:bg-gray-50 border-l">
      <Plus className="h-4 w-4" />
    </button>
  </div>

  {/* Save Button */}
  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
    SAVE FOR LATER
  </Button>

  {/* Remove Button */}
  <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900">
    REMOVE
  </Button>
</div>
```

**Quantity Control:**
- Border: `border rounded`
- Buttons: `px-3 py-1`, hover effect
- Display: `px-4 py-1 font-medium`
- Icons: `h-4 w-4`

---

### 4. Price Details Sidebar

#### Header
```tsx
<h2 className="text-gray-500 text-sm font-medium uppercase mb-4 pb-4 border-b">
  PRICE DETAILS
</h2>
```

#### Price Items
```tsx
<div className="space-y-4 mb-4 pb-4 border-b">
  {/* Price */}
  <div className="flex justify-between text-base">
    <span className="text-gray-700">Price ({items.length} item)</span>
    <span className="text-gray-900">₹{subtotal}</span>
  </div>
  
  {/* Discount */}
  <div className="flex justify-between text-base">
    <span className="text-gray-700">Discount</span>
    <span className="text-green-600">− ₹2,705</span>
  </div>
  
  {/* Coupons */}
  <div className="flex justify-between text-base">
    <span className="text-gray-700">Coupons for you</span>
    <span className="text-green-600">− ₹74</span>
  </div>
  
  {/* Platform Fee */}
  <div className="flex justify-between text-base">
    <span className="text-gray-700">Platform Fee</span>
    <span className="text-gray-900">₹7</span>
  </div>
  
  {/* Delivery */}
  <div className="flex justify-between text-base">
    <span className="text-gray-700">Delivery Charges</span>
    <span className="text-green-600 flex items-center gap-1">
      <span className="line-through text-gray-400">₹40</span> Free
    </span>
  </div>
</div>
```

**Color Coding:**
- Labels: `text-gray-700`
- Regular values: `text-gray-900`
- Discounts/Free: `text-green-600`
- Strikethrough: `text-gray-400`

#### Total Section
```tsx
<div className="flex justify-between text-lg font-semibold mb-4 pb-4 border-b">
  <span className="text-gray-900">Total Amount</span>
  <span className="text-gray-900">₹{Math.round(subtotal + 7)}</span>
</div>
```

**Styling:**
- Size: `text-lg` (larger than items)
- Weight: `font-semibold` (bolder)
- Spacing: `mb-4 pb-4 border-b`

#### Savings Banner
```tsx
<div className="bg-green-50 px-3 py-2 rounded">
  <p className="text-green-700 font-medium text-sm">
    You will save ₹2,772 on this order
  </p>
</div>
```

**Colors:**
- Background: `bg-green-50` (#f0fdf4)
- Text: `text-green-700` (#15803d)
- Weight: `font-medium`

#### Security Badge
```tsx
<div className="mt-6 flex items-start gap-3 text-gray-600">
  <svg className="w-6 h-6 flex-shrink-0 mt-0.5">
    {/* Shield with checkmark icon */}
  </svg>
  <p className="text-xs">
    <span className="font-medium">Safe and Secure Payments.</span>
    Easy returns.
    <span className="font-medium">100% Authentic products.</span>
  </p>
</div>
```

**Structure:**
- Icon: 24px × 24px shield
- Text: Extra small (xs)
- Important parts: `font-medium`

---

### 5. Place Order Button
```tsx
<Button 
  className="bg-orange-500 hover:bg-orange-600 text-white px-16 py-5 text-base font-medium"
  onClick={handleCheckout}
>
  PLACE ORDER
</Button>
```

**Styling:**
- Background: `bg-orange-500` (#f97316)
- Hover: `hover:bg-orange-600` (#ea580c)
- Text: `text-white`, uppercase
- Padding: `px-16` (4rem), `py-5` (1.25rem)
- Size: `text-base` (1rem)
- Weight: `font-medium`

---

## 📏 Spacing Scale

```
Gap between elements:
├─ gap-1    → 0.25rem (4px)
├─ gap-2    → 0.5rem  (8px)
├─ gap-3    → 0.75rem (12px)
├─ gap-4    → 1rem    (16px) ← Most common
└─ gap-8    → 2rem    (32px) ← Tabs

Padding scale:
├─ p-2      → 0.5rem  (8px)
├─ p-3      → 0.75rem (12px)
├─ p-4      → 1rem    (16px)
└─ p-5      → 1.25rem (20px) ← Cards

Margins:
├─ mb-1     → 0.25rem (4px)
├─ mb-2     → 0.5rem  (8px)
├─ mb-3     → 0.75rem (12px)
├─ mb-4     → 1rem    (16px) ← Sections
└─ mb-6     → 1.5rem  (24px)
```

---

## 🎨 Complete Color Palette

```css
/* Primary Actions */
--blue-600: #2563eb    /* Tabs, buttons, badges */
--blue-50:  #eff6ff    /* Hover backgrounds */

/* Success/Savings */
--green-600: #16a34a   /* Discounts, free items */
--green-700: #15803d   /* Savings banner text */
--green-50:  #f0fdf4   /* Savings banner bg */

/* Primary CTA */
--orange-500: #f97316  /* Place order button */
--orange-600: #ea580c  /* Hover state */

/* Grays */
--gray-900: #111827    /* Primary text */
--gray-700: #374151    /* Secondary text */
--gray-600: #4b5563    /* Tertiary text */
--gray-500: #6b7280    /* Inactive elements */
--gray-400: #9ca3af    /* Strikethrough */
--gray-50:  #f9fafb    /* Page background */

/* Supporting */
--yellow-600: #ca8a04  /* EMI lightning icon */
--white:      #ffffff  /* Cards, backgrounds */
```

---

## 📐 Typography Scale

```css
/* Headers */
text-2xl      → 1.5rem  (24px)  [Current price]
text-lg       → 1.125rem (18px) [Total amount]
text-base     → 1rem    (16px)  [Product title, buttons]
text-sm       → 0.875rem (14px) [Most labels]
text-xs       → 0.75rem  (12px) [Security text]

/* Weights */
font-medium   → 500     [Most text]
font-semibold → 600     [Total, important items]
```

---

## 🔧 Grid Breakpoints

```css
/* Mobile First */
Default (all):     grid-cols-1

/* Large screens (1024px+) */
lg:grid-cols-3     [Main grid]
lg:col-span-2      [Cart items - 66.66%]
lg:col-span-1      [Price details - 33.33%]
```

---

## ✨ Animations

```tsx
/* Product entrance */
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}

/* Duration: default (~300ms) */
/* Easing: smooth */
```

---

## 🎯 Key Measurements

```
Component Sizes:
├─ Product Image:      112px × 112px
├─ Tab Height:         ~52px (py-4)
├─ Button Height:      Variable (depends on padding)
├─ Card Padding:       20px (p-5)
├─ Container Padding:  16px (px-4)
└─ Sticky Top Offset:  16px (top-4)

Widths:
├─ Container:          Container (responsive)
├─ Cart Items:         66.66% (lg:col-span-2)
└─ Price Details:      33.33% (lg:col-span-1)
```

---

## 🔍 Z-Index Layers

```
Layer Order:
├─ Base Content:       z-0   (default)
├─ Sticky Sidebar:     z-0   (no z-index needed)
└─ Modals:            z-50  (LoginRequiredModal)
```

---

## 📱 Responsive Display

```tsx
/* Desktop View */
<div className="hidden md:block">
  {/* New Flipkart design */}
</div>

/* Mobile View */
<div className="md:hidden">
  {/* Original mobile design */}
</div>
```

**Breakpoint:** 768px (md)
- Below: Mobile view
- Above: Desktop view

---

## 🎨 Border Styles

```css
/* Tab Border */
border-b-2 border-blue-600   [2px solid blue]

/* Section Dividers */
border-b                      [1px solid gray-200]

/* Card Borders */
border                        [1px solid gray-200]

/* Item Dividers */
border-t mx-5                 [1px top, inset 20px]
```

---

## ✅ Accessibility Features

```tsx
/* Semantic HTML */
<button>   [For all clickable actions]
<h1-h3>    [For headings]
<img alt>  [Alt text on all images]

/* Focus States */
hover:bg-gray-50              [Visual feedback]
hover:text-gray-900           [Color change]

/* Text Contrast */
WCAG AA compliant colors
```

---

## 🚀 Performance Optimizations

```tsx
/* Sticky Positioning (CSS only) */
position: sticky              [No JavaScript scroll listeners]

/* Efficient Animations */
opacity, transform            [GPU accelerated]

/* React Keys */
key={item.productId}          [Efficient re-renders]

/* Image Loading */
<img loading="lazy">          [Native lazy loading]
```

---

This guide provides exact measurements, colors, and styling used in the implementation. Use it as a reference for maintaining consistency or making future adjustments.

**Last Updated:** October 18, 2025
