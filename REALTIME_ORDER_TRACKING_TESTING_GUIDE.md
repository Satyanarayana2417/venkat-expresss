# 🧪 Real-Time Order Tracking - Testing Guide

## 📋 Test Plan Overview

This guide covers comprehensive testing for the real-time order tracking feature on the "My Orders" page.

---

## ✅ Pre-Testing Checklist

### Environment Setup
- [ ] Development server running (`npm run dev` or `bun dev`)
- [ ] Firebase project connected
- [ ] Firestore database accessible
- [ ] At least 1 admin account exists
- [ ] At least 1 customer account exists
- [ ] At least 1 test order exists in Firestore

### Test Data Preparation

Create test order in Firestore:
```javascript
{
  id: "TEST-ORDER-001",
  userId: "customer-uid-here",
  orderNumber: "ORD-TEST-001",
  customer: "Test Customer",
  email: "test@example.com",
  status: "processing",
  items: [
    {
      name: "Test Product",
      image: "https://via.placeholder.com/150",
      price: 2500,
      color: "Blue"
    }
  ],
  totalAmount: 2500,
  trackingHistory: [
    {
      status: "processing",
      location: "Mumbai Warehouse",
      timestamp: serverTimestamp(),
      description: "Order is being prepared"
    },
    {
      status: "pending",
      location: "Order Received",
      timestamp: serverTimestamp(),
      description: "Your order has been confirmed"
    }
  ],
  createdAt: serverTimestamp()
}
```

---

## 🎯 Test Cases

### 1. Visual Timeline Display

#### Test 1.1: Timeline Renders Correctly
**Objective:** Verify timeline displays with correct stages

**Steps:**
1. Log in as customer
2. Navigate to `/account/orders`
3. Locate test order

**Expected Result:**
- ✅ Timeline shows 5 stages
- ✅ Correct icons for each stage
- ✅ Current stage highlighted (blue, pulsing)
- ✅ Completed stages show green checkmarks
- ✅ Pending stages show gray circles
- ✅ Stage labels are visible

**Test Data:**
- Status: `processing`
- Expected: Order Placed (✓), Processing (●), Shipped ( ), Out for Delivery ( ), Delivered ( )

---

#### Test 1.2: Timeline Updates for Different Statuses
**Objective:** Verify timeline correctly shows all status types

**Test Matrix:**

| Status | Order Placed | Processing | Shipped | Out for Delivery | Delivered |
|--------|--------------|------------|---------|------------------|-----------|
| `pending` | ● BLUE | ○ GRAY | ○ GRAY | ○ GRAY | ○ GRAY |
| `processing` | ✓ GREEN | ● BLUE | ○ GRAY | ○ GRAY | ○ GRAY |
| `shipped` | ✓ GREEN | ✓ GREEN | ● BLUE | ○ GRAY | ○ GRAY |
| `out-for-delivery` | ✓ GREEN | ✓ GREEN | ✓ GREEN | ● BLUE | ○ GRAY |
| `delivered` | ✓ GREEN | ✓ GREEN | ✓ GREEN | ✓ GREEN | ✓ GREEN |

**Steps for each status:**
1. Update order status in Firestore
2. Observe timeline
3. Verify colors and icons match table

---

#### Test 1.3: Cancelled/Returned Orders
**Objective:** Verify special handling for cancelled/returned orders

**Steps:**
1. Update order status to `cancelled`
2. Refresh page
3. Check timeline display

**Expected Result:**
- ✅ No progress timeline shown
- ✅ Shows clock icon with "Order Cancelled" message
- ✅ Red color scheme

**Repeat for:** `returned` status

---

### 2. Real-Time Updates

#### Test 2.1: Live Connection Indicator
**Objective:** Verify live indicator shows when connected

**Steps:**
1. Open `/account/orders`
2. Wait for page to load
3. Observe order cards

**Expected Result:**
- ✅ Green "Live" badge appears on each order card
- ✅ Badge shows green pulsing dot
- ✅ Badge text says "Live"

---

#### Test 2.2: Instant Status Update (Critical Test!)
**Objective:** Verify real-time updates work without page refresh

**Setup:**
- Browser A: Customer account on `/account/orders`
- Browser B: Admin account on `/admin/orders`

**Steps:**
1. In Browser A, note current order status
2. In Browser B, click on the same order
3. Update status to next stage (e.g., `processing` → `shipped`)
4. Add tracking event with location and description
5. Click "Add Tracking Event" button
6. Observe Browser A (DO NOT REFRESH)

**Expected Result (Browser A):**
- ✅ Timeline updates within 1-2 seconds
- ✅ New stage becomes current (blue, pulsing)
- ✅ Previous stages show green checkmarks
- ✅ Toast notification appears: "Order status updated!"
- ✅ "Updated!" badge appears briefly (3 seconds)
- ✅ Latest tracking event updates

**Timing:**
- Update should appear in < 2 seconds
- Toast should stay for 5 seconds
- "Updated!" badge should disappear after 3 seconds

---

#### Test 2.3: Multiple Rapid Updates
**Objective:** Test system handles rapid consecutive updates

**Steps:**
1. Open order in admin panel (Browser B)
2. Rapidly update status 3 times:
   - `processing` → `shipped`
   - Wait 1 second
   - `shipped` → `out-for-delivery`
   - Wait 1 second
   - `out-for-delivery` → `delivered`
3. Observe customer page (Browser A)

**Expected Result:**
- ✅ Each update reflects on customer page
- ✅ Multiple toast notifications appear
- ✅ Timeline animates smoothly
- ✅ No UI glitches or freezing
- ✅ Final status is `delivered`

---

### 3. Tracking History Details

#### Test 3.1: Latest Event Display
**Objective:** Verify latest tracking event always visible

**Steps:**
1. Open order with tracking history
2. Scroll to tracking section

**Expected Result:**
- ✅ Latest event shown at top
- ✅ Shows status, location, timestamp, description
- ✅ Icons display correctly (MapPin, Clock, CheckCircle)
- ✅ Timestamp formatted properly (e.g., "Oct 18, 2025 • 02:30 PM")
- ✅ Background color: light blue (bg-blue-50/30)

---

#### Test 3.2: Expandable History
**Objective:** Verify expand/collapse functionality

**Steps:**
1. Locate "View Full Tracking History" button
2. Click to expand
3. Verify all events display
4. Click "Hide Full Tracking History"
5. Verify section collapses

**Expected Result:**
- ✅ Button shows event count (e.g., "3 events")
- ✅ Chevron icon rotates on expand/collapse
- ✅ All events display in reverse chronological order
- ✅ Latest event marked with "Latest" badge
- ✅ Timeline connectors between events
- ✅ Smooth animation on expand/collapse

---

#### Test 3.3: Empty Tracking History
**Objective:** Handle orders without tracking history

**Steps:**
1. Create order without `trackingHistory` field
2. Open order on customer page

**Expected Result:**
- ✅ Timeline still displays (based on status)
- ✅ No tracking details section shown
- ✅ No errors in console

---

### 4. Responsive Design

#### Test 4.1: Mobile View (< 768px)
**Device:** iPhone 12 Pro / Emulator

**Steps:**
1. Open `/account/orders` on mobile
2. Inspect order cards

**Expected Result:**
- ✅ Timeline compact (sm size)
- ✅ Icons smaller (h-6 w-6)
- ✅ Labels readable (text-[10px])
- ✅ Stacked layout
- ✅ Touch-friendly buttons
- ✅ No horizontal scrolling

---

#### Test 4.2: Desktop View (> 1024px)
**Device:** Desktop browser

**Steps:**
1. Open `/account/orders` on desktop
2. Hover over order cards

**Expected Result:**
- ✅ Timeline medium size (md)
- ✅ Icons clear (h-8 w-8)
- ✅ Labels readable (text-xs)
- ✅ Horizontal layout
- ✅ Hover effects work (shadow-md)
- ✅ Ample spacing

---

### 5. Performance Testing

#### Test 5.1: Multiple Orders Load
**Objective:** Test page with many orders

**Setup:** Create 10-20 test orders

**Steps:**
1. Open `/account/orders`
2. Observe page load time
3. Check Network tab in browser DevTools

**Expected Result:**
- ✅ Page loads within 3 seconds
- ✅ All timelines render
- ✅ All "Live" badges appear
- ✅ No console errors
- ✅ Smooth scrolling

**Performance Metrics:**
- Initial query: 1 read (getDocs)
- Listeners: 10-20 reads (one per order)
- Total: ~21 reads for 10 orders

---

#### Test 5.2: Listener Cleanup
**Objective:** Verify listeners disconnect on unmount

**Steps:**
1. Open `/account/orders`
2. Note active listeners in Firebase console
3. Navigate to `/products`
4. Check Firebase console again

**Expected Result:**
- ✅ Listeners active on orders page
- ✅ Listeners disconnect on navigation
- ✅ No ongoing read operations
- ✅ Memory usage stable

**To Check:**
```javascript
// In browser console
console.log('Active listeners:', window.__activeListeners);
```

---

#### Test 5.3: Network Interruption
**Objective:** Handle network disconnections gracefully

**Steps:**
1. Open `/account/orders`
2. Open DevTools → Network tab
3. Switch to "Offline" mode
4. Wait 5 seconds
5. Switch back to "Online"

**Expected Result:**
- ✅ "Live" badge disappears when offline
- ✅ UI remains functional
- ✅ No error toasts spam
- ✅ "Live" badge reappears when online
- ✅ Data syncs automatically

---

### 6. Error Handling

#### Test 6.1: Order Not Found
**Objective:** Handle deleted orders gracefully

**Steps:**
1. Open order page
2. Delete order from Firestore (admin)
3. Observe customer page

**Expected Result:**
- ✅ Error message shown or order removed from list
- ✅ No infinite loading
- ✅ No console errors crashing page

---

#### Test 6.2: Permission Denied
**Objective:** Handle unauthorized access

**Steps:**
1. Update security rules to deny read
2. Refresh orders page

**Expected Result:**
- ✅ Error message displayed
- ✅ Fallback UI shown
- ✅ No infinite retries

---

### 7. User Experience

#### Test 7.1: Toast Notifications
**Objective:** Verify toast behavior

**Steps:**
1. Trigger status update (Browser B)
2. Observe toast in Browser A

**Expected Result:**
- ✅ Toast appears bottom-right
- ✅ Title: "Order status updated!"
- ✅ Description: "Your order is now [status]"
- ✅ Auto-dismisses after 5 seconds
- ✅ Can be manually closed
- ✅ Multiple toasts stack vertically

---

#### Test 7.2: Update Badge Animation
**Objective:** Verify update indicator

**Steps:**
1. Trigger status update
2. Watch for "Updated!" badge

**Expected Result:**
- ✅ Badge appears top-right of order card
- ✅ Bounces animation (3 times)
- ✅ Disappears after 3 seconds
- ✅ Doesn't block other UI elements

---

### 8. Edge Cases

#### Test 8.1: Very Long Product Names
**Data:** Product name with 100+ characters

**Expected Result:**
- ✅ Name truncates properly
- ✅ No layout breaking
- ✅ Ellipsis (...) shown

---

#### Test 8.2: Missing Product Images
**Data:** Order with `image: null` or `image: ""`

**Expected Result:**
- ✅ Order displays without image
- ✅ Layout adjusts properly
- ✅ No broken image icons

---

#### Test 8.3: Timestamp Parsing Errors
**Data:** Invalid timestamp format

**Expected Result:**
- ✅ Shows "N/A" or fallback text
- ✅ No console errors
- ✅ Rest of order displays normally

---

## 🔍 Browser Compatibility

### Test Across Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 120+ | ✅ Primary |
| Firefox | 120+ | ✅ Test |
| Safari | 17+ | ✅ Test |
| Edge | 120+ | ✅ Test |
| Mobile Safari | iOS 16+ | ✅ Test |
| Chrome Mobile | Android 12+ | ✅ Test |

### Browser-Specific Tests

#### Safari
- Test real-time listeners work
- Check animations smooth
- Verify date formatting

#### Firefox
- Test WebSocket connections
- Check console for warnings

#### Mobile Browsers
- Test touch interactions
- Verify viewport scaling
- Check gesture support

---

## 📊 Performance Benchmarks

### Acceptable Ranges

| Metric | Target | Maximum |
|--------|--------|---------|
| Initial page load | < 2s | 3s |
| Real-time update latency | < 1s | 2s |
| Timeline render time | < 100ms | 200ms |
| Memory usage (10 orders) | < 50MB | 100MB |
| Firestore reads (initial) | ~11 | 25 |

---

## 🐛 Known Issues Checklist

### Issues to Watch For

- [ ] Multiple toast notifications for single update
- [ ] Timeline not updating after status change
- [ ] "Live" badge not appearing
- [ ] Memory leaks from unclosed listeners
- [ ] Layout breaks on small screens
- [ ] Slow performance with 50+ orders
- [ ] Race conditions on rapid updates

---

## ✅ Test Completion Checklist

### Must Pass (Critical)

- [ ] Test 2.2: Instant Status Update works
- [ ] Test 5.2: Listener Cleanup works
- [ ] Test 1.1: Timeline Renders Correctly
- [ ] Test 3.2: Expandable History works
- [ ] Test 4.1: Mobile Responsive
- [ ] Test 4.2: Desktop Responsive

### Should Pass (Important)

- [ ] Test 2.3: Multiple Rapid Updates
- [ ] Test 5.1: Multiple Orders Load
- [ ] Test 7.1: Toast Notifications
- [ ] Test 6.1: Error Handling

### Nice to Have (Optional)

- [ ] Test 5.3: Network Interruption
- [ ] Test 8.x: All Edge Cases
- [ ] Browser Compatibility Tests

---

## 📝 Test Report Template

```markdown
# Test Report: Real-Time Order Tracking
**Date:** [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Prod]

## Test Summary
- Total Tests: 25
- Passed: __
- Failed: __
- Blocked: __

## Critical Issues Found
1. [Issue description]
   - **Severity:** High/Medium/Low
   - **Steps to reproduce:** ...
   - **Expected:** ...
   - **Actual:** ...

## Pass/Fail Details
| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Timeline Renders | ✅ PASS | - |
| 2.2 | Real-Time Update | ❌ FAIL | Latency > 5s |
| ... | ... | ... | ... |

## Performance Metrics
- Page load time: __s
- Real-time latency: __s
- Memory usage: __MB

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Sign-off
- [ ] All critical tests passed
- [ ] Known issues documented
- [ ] Performance acceptable
- [ ] Ready for deployment
```

---

## 🚀 Automated Testing (Future)

### Unit Tests

```typescript
// useOrderRealtime.test.ts
describe('useOrderRealtime', () => {
  it('should connect to Firestore on mount', () => {
    // Test implementation
  });
  
  it('should disconnect on unmount', () => {
    // Test implementation
  });
  
  it('should update state when order changes', () => {
    // Test implementation
  });
});
```

### Integration Tests

```typescript
// AccountOrders.test.tsx
describe('AccountOrders Real-Time', () => {
  it('should render orders with timeline', () => {
    // Test implementation
  });
  
  it('should update timeline when order status changes', async () => {
    // Test implementation
  });
  
  it('should show toast notification on update', async () => {
    // Test implementation
  });
});
```

---

## 📞 Troubleshooting During Testing

### Issue: Real-time updates not working

**Check:**
1. Firebase console shows listener connections
2. Browser console has no errors
3. Order has correct `userId` field
4. Security rules allow read access
5. Network tab shows WebSocket connection

### Issue: Performance lag

**Check:**
1. Number of active listeners
2. Browser memory usage
3. Network conditions
4. Number of orders on page

### Issue: UI not updating

**Check:**
1. React DevTools shows state changes
2. Component re-renders correctly
3. No JavaScript errors blocking render
4. CSS not hiding elements

---

**Testing Complete!** 🎉

Use this guide to ensure the real-time order tracking feature works flawlessly across all scenarios.

**Last Updated:** October 18, 2025
