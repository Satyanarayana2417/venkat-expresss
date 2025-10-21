# Cart Price Details - Dynamic Discount Update

## Date
October 18, 2025

## Change Summary
Updated the desktop cart price details section to show discount and savings information **only when applicable** (calculated in real-time from cart items).

---

## What Changed

### Before
- ❌ Discount always showed static "− ₹2,705" even if no discount available
- ❌ "Coupons for you: − ₹74" always displayed (static value)
- ❌ Savings banner always showed "You will save ₹2,772" (static)

### After
- ✅ **Discount line only appears if items have `originalPrice > priceINR`**
- ✅ Discount amount calculated in real-time from all cart items
- ✅ "Coupons for you" line **removed** (was static, no real coupon system)
- ✅ **Savings banner only appears if there's actual discount**
- ✅ Savings amount matches the actual discount calculated

---

## Technical Implementation

### Discount Calculation Logic
```tsx
{(() => {
  const totalDiscount = items.reduce((total, item) => {
    if (item.originalPrice && item.originalPrice > item.priceINR) {
      return total + ((item.originalPrice - item.priceINR) * item.qty);
    }
    return total;
  }, 0);
  
  return totalDiscount > 0 ? (
    <div className="flex justify-between text-base">
      <span className="text-gray-700">Discount</span>
      <span className="text-green-600">
        − ₹{Math.round(totalDiscount).toLocaleString('en-IN')}
      </span>
    </div>
  ) : null;
})()}
```

### How It Works
1. **Loop through all cart items**
2. **Check if item has originalPrice** and it's greater than current price
3. **Calculate discount**: `(originalPrice - priceINR) × quantity`
4. **Sum all discounts** from all items
5. **Only render discount line if total > 0**

### Savings Banner Logic
```tsx
{(() => {
  const totalDiscount = items.reduce((total, item) => {
    if (item.originalPrice && item.originalPrice > item.priceINR) {
      return total + ((item.originalPrice - item.priceINR) * item.qty);
    }
    return total;
  }, 0);
  
  return totalDiscount > 0 ? (
    <div className="bg-green-50 px-3 py-2 rounded">
      <p className="text-green-700 font-medium text-sm">
        You will save ₹{Math.round(totalDiscount).toLocaleString('en-IN')} on this order
      </p>
    </div>
  ) : null;
})()}
```

---

## Price Details Display Logic

### Scenario 1: Items WITH Discount
**Example**: Watch with originalPrice: ₹2999, currentPrice: ₹220

```
PRICE DETAILS

Price (1 item)         ₹220
Discount              − ₹2,779  ← SHOWN (calculated)
Platform Fee           ₹7
Delivery Charges       ₹40 Free
───────────────────────────────
Total Amount           ₹227

✅ You will save ₹2,779 on this order  ← SHOWN
```

### Scenario 2: Items WITHOUT Discount
**Example**: Regular item with no originalPrice

```
PRICE DETAILS

Price (1 item)         ₹500
                              ← Discount line HIDDEN
Platform Fee           ₹7
Delivery Charges       ₹40 Free
───────────────────────────────
Total Amount           ₹507

                              ← Savings banner HIDDEN
```

### Scenario 3: Mixed Cart (Some with, some without discount)

**Example**: 
- Item 1: originalPrice ₹1000, current ₹800 (₹200 discount)
- Item 2: No originalPrice, current ₹500 (₹0 discount)

```
PRICE DETAILS

Price (2 items)        ₹1,300
Discount              − ₹200   ← SHOWN (only item 1's discount)
Platform Fee           ₹7
Delivery Charges       ₹40 Free
───────────────────────────────
Total Amount           ₹1,307

✅ You will save ₹200 on this order  ← SHOWN
```

---

## CartItem Interface Reference

For discount calculation to work, cart items need:

```typescript
interface CartItem {
  productId: string;
  title: string;
  qty: number;
  priceINR: number;
  originalPrice?: number;  // ← REQUIRED for discount display
  image: string;
  slug?: string;
}
```

**Key Points:**
- `originalPrice` is **optional**
- If `originalPrice` exists and > `priceINR`, discount is calculated
- If `originalPrice` is missing or ≤ `priceINR`, no discount shown
- Each item's discount = `(originalPrice - priceINR) × qty`

---

## What Was Removed

### 1. Static Coupon Line
```tsx
// REMOVED - Was always showing static ₹74
<div className="flex justify-between text-base">
  <span className="text-gray-700">Coupons for you</span>
  <span className="text-green-600">− ₹74</span>
</div>
```

**Reason:** No real coupon system implemented. Can be added back when coupon functionality is built.

### 2. Fallback Static Discount
```tsx
// OLD CODE - Had fallback to static value
? `− ₹${totalDiscount.toLocaleString('en-IN')}`
: '− ₹2,705'  // ← This fallback removed
```

**Now:** If no discount, the entire line is hidden (cleaner, more accurate).

---

## Benefits

### 1. Accuracy
✅ Shows real discount based on actual product prices
✅ No misleading static values
✅ Updates automatically when items added/removed
✅ Updates when quantity changes

### 2. Clarity
✅ Users see actual savings
✅ Empty states handled properly (no discount = no line)
✅ Consistent with product card discount badges
✅ Professional, transparent pricing

### 3. Flexibility
✅ Works with products that have discounts
✅ Works with products without discounts
✅ Works with mixed carts
✅ Easy to add coupon functionality later

---

## Testing Scenarios

### Test Case 1: Product WITH originalPrice
1. Add product with `originalPrice: 1000, priceINR: 800`
2. **Expected**: Discount line shows "− ₹200"
3. **Expected**: Savings banner shows "You will save ₹200"

### Test Case 2: Product WITHOUT originalPrice
1. Add product with only `priceINR: 500`
2. **Expected**: No discount line
3. **Expected**: No savings banner

### Test Case 3: Multiple Products
1. Add 2 products: One with discount, one without
2. **Expected**: Discount shows sum of all discounts
3. **Expected**: Only products with originalPrice contribute

### Test Case 4: Quantity Change
1. Add product with discount, qty = 1
2. Change quantity to 3
3. **Expected**: Discount multiplies by 3
4. **Expected**: Savings banner updates

### Test Case 5: Remove Item
1. Add product with discount
2. Remove product
3. **Expected**: Discount line disappears
4. **Expected**: Savings banner disappears

---

## Formula Reference

```javascript
// For each item in cart:
itemDiscount = (item.originalPrice - item.priceINR) × item.qty

// Total discount:
totalDiscount = sum of all itemDiscounts

// Display rules:
if (totalDiscount > 0) {
  show "Discount: − ₹{totalDiscount}"
  show "You will save ₹{totalDiscount} on this order"
} else {
  hide both
}
```

---

## Future Enhancements

### Coupon System Integration (Future)
When implementing coupons, you can add:

```tsx
{/* Show coupons only if applied */}
{appliedCoupons.length > 0 && (
  <div className="flex justify-between text-base">
    <span className="text-gray-700">Coupon Discount ({appliedCoupons[0].code})</span>
    <span className="text-green-600">
      − ₹{calculateCouponDiscount().toLocaleString('en-IN')}
    </span>
  </div>
)}
```

### Tax Calculation (Future)
```tsx
<div className="flex justify-between text-base">
  <span className="text-gray-700">Tax (18% GST)</span>
  <span className="text-gray-900">
    ₹{Math.round(subtotal * 0.18).toLocaleString('en-IN')}
  </span>
</div>
```

---

## Code Location

**File**: `src/pages/Cart.tsx`
**Section**: Desktop View → Right Column → Price Details Card
**Lines**: ~390-460 (approximate)

---

## Summary

✅ **Discount**: Now calculated in real-time from cart items
✅ **Conditional Display**: Only shows when applicable
✅ **Savings Banner**: Matches actual discount amount
✅ **Removed Static Values**: No more fake/placeholder prices
✅ **Professional**: Accurate, transparent pricing

The price details now reflect the **actual state of the cart** rather than showing static placeholder values. This provides users with accurate information and builds trust.

---

**Status**: ✅ Complete
**Date**: October 18, 2025
**Impact**: Desktop cart only (mobile unchanged)
**Breaking Changes**: None (backward compatible)
