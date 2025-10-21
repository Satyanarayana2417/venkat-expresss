# 🧪 Testing Guide - UPI Payment Buttons

## Pre-Testing Checklist

### Requirements:
- ✅ Mobile device (Android/iOS)
- ✅ UPI app installed (PhonePe, Google Pay, or Paytm)
- ✅ Active internet connection
- ✅ Test cart with items
- ✅ Development server running

---

## 🎯 Test Scenarios

### Scenario 1: Mobile View - Button Visibility

**Objective**: Verify UPI buttons appear only on mobile

#### Steps:
1. Open payment page on mobile device
2. Scroll down past QR code
3. Look for "Or Pay Directly Via" section

#### Expected Result:
- ✅ Three circular buttons visible (PhonePe, Google Pay, Paytm)
- ✅ Buttons have proper colors and logos
- ✅ Text labels below each button
- ✅ Helper text: "Tap any button to open app"
- ✅ Important note about Transaction ID

#### Screenshot:
```
[QR Code]
─── Or Pay Directly Via ───
   [●]     [●]     [●]
 PhonePe  GPay   Paytm
```

---

### Scenario 2: Desktop View - Buttons Hidden

**Objective**: Verify buttons are NOT visible on desktop

#### Steps:
1. Open payment page on desktop browser
2. Look for UPI buttons section
3. Check entire payment page

#### Expected Result:
- ❌ UPI buttons NOT visible
- ✅ QR code visible
- ✅ Transaction ID input visible
- ✅ 3-column layout visible (if desktop)

---

### Scenario 3: PhonePe Button Click

**Objective**: Test PhonePe deep link opens app correctly

#### Pre-requisites:
- PhonePe app installed on mobile

#### Steps:
1. Open payment page on mobile
2. Tap PhonePe button (purple circle)
3. Observe app opening

#### Expected Result:
- ✅ PhonePe app opens
- ✅ Payment screen displayed
- ✅ Payee name: "satyanarayana"
- ✅ UPI ID: "9121055512@ybl"
- ✅ Amount: ₹[cart_total] (locked) 🔒
- ✅ Transaction note: "Payment for Order #ORD-..."

#### If PhonePe Not Installed:
- Link may fail silently
- Or shows "App not found" error
- This is expected behavior

---

### Scenario 4: Google Pay Button Click

**Objective**: Test Google Pay deep link works

#### Pre-requisites:
- Google Pay app installed on mobile

#### Steps:
1. Open payment page on mobile
2. Tap Google Pay button (white circle with G)
3. Observe app opening

#### Expected Result:
- ✅ Google Pay app opens
- ✅ Payment screen displayed
- ✅ Payee details pre-filled
- ✅ Amount locked
- ✅ Transaction note included

---

### Scenario 5: Paytm Button Click

**Objective**: Test Paytm deep link functionality

#### Pre-requisites:
- Paytm app installed on mobile

#### Steps:
1. Open payment page on mobile
2. Tap Paytm button (blue circle)
3. Observe app opening

#### Expected Result:
- ✅ Paytm app opens
- ✅ Payment details pre-filled
- ✅ Amount is locked
- ✅ Order ID in notes

---

### Scenario 6: Complete Payment Flow

**Objective**: Test full payment journey from button to confirmation

#### Steps:
1. Add items to cart (total: ₹500)
2. Go to payment page
3. Tap PhonePe button
4. PhonePe opens with ₹507 (500 + 7 platform fee)
5. Enter UPI PIN and complete payment
6. Note the Transaction ID (e.g., PTM2025102112345678)
7. Return to website
8. Enter Transaction ID in input field
9. Click "Confirm Order"

#### Expected Result:
- ✅ Payment successful in PhonePe
- ✅ Transaction ID received
- ✅ Can enter Transaction ID on website
- ✅ Order confirmation successful
- ✅ Order stored in Firestore
- ✅ Cart cleared

---

### Scenario 7: Amount Verification

**Objective**: Verify amount is correctly calculated and locked

#### Test Cases:

**Test 1**: Cart Total ₹500
- Platform Fee: ₹7
- Expected Amount: ₹507
- Verify in app: ₹507 (locked)

**Test 2**: Cart Total ₹1,234
- Platform Fee: ₹7
- Expected Amount: ₹1,241
- Verify in app: ₹1,241 (locked)

**Test 3**: Cart Total ₹10,000
- Platform Fee: ₹7
- Expected Amount: ₹10,007
- Verify in app: ₹10,007 (locked)

#### Steps:
1. Create cart with specific total
2. Go to payment page
3. Tap UPI button
4. Check amount in app
5. Verify it matches (subtotal + 7)
6. Verify amount is locked (cannot be edited)

---

### Scenario 8: Order ID in Transaction Note

**Objective**: Verify order ID appears in transaction note

#### Steps:
1. Open payment page
2. Note the displayed Order ID (e.g., ORD-20251021-12345)
3. Tap any UPI button
4. Check transaction note in app

#### Expected Result:
- ✅ Transaction note contains: "Payment for Order #ORD-20251021-12345 - Venkat Express"
- ✅ Order ID matches the one on website
- ✅ Text is properly formatted

---

### Scenario 9: Button Animation

**Objective**: Test hover and tap animations

#### Steps (if testing on device with hover support):
1. Hover over PhonePe button
2. Observe scale increase
3. Move cursor away
4. Observe scale return to normal

#### Steps (tap animation):
1. Tap and hold PhonePe button
2. Observe scale decrease
3. Release
4. Observe button launch app

#### Expected Result:
- ✅ Hover: Button scales to 110%
- ✅ Tap: Button scales to 95%
- ✅ Smooth transition
- ✅ Shadow changes with scale

---

### Scenario 10: Fallback to QR Code

**Objective**: Verify QR code still works as fallback

#### Steps:
1. Open payment page on mobile
2. Ignore UPI buttons
3. Scan QR code with any UPI app
4. Complete payment
5. Return and enter Transaction ID
6. Confirm order

#### Expected Result:
- ✅ QR code scannable
- ✅ Contains same payment details
- ✅ Amount locked in QR
- ✅ Can complete order via QR
- ✅ UPI buttons don't interfere with QR flow

---

### Scenario 11: Multiple Button Taps

**Objective**: Test rapid button tapping behavior

#### Steps:
1. Tap PhonePe button
2. Quickly tap Google Pay button
3. Quickly tap Paytm button

#### Expected Result:
- ✅ First tap opens app
- ✅ Subsequent taps ignored or handled gracefully
- ✅ No errors or crashes
- ✅ System handles gracefully

---

### Scenario 12: Browser Back Button

**Objective**: Test back button after app opens

#### Steps:
1. Tap UPI button
2. App starts opening
3. Immediately press browser back button

#### Expected Result:
- ✅ Either app opens or action cancelled
- ✅ No error on website
- ✅ Can try again
- ✅ Page state maintained

---

### Scenario 13: Network Error

**Objective**: Test behavior with poor network

#### Steps:
1. Enable airplane mode or disable network
2. Try tapping UPI button
3. Re-enable network
4. Try again

#### Expected Result:
- ❌ With no network: Link may not work
- ✅ With network: Link works normally
- ✅ No crashes or errors
- ✅ Graceful handling

---

### Scenario 14: Screenshot Upload Alternative

**Objective**: Verify screenshot upload still works

#### Steps:
1. Complete payment via UPI button
2. Take screenshot of payment confirmation in app
3. Return to website
4. Upload screenshot instead of entering Transaction ID
5. Confirm order

#### Expected Result:
- ✅ Can upload screenshot
- ✅ Screenshot preview shown
- ✅ Can confirm order with screenshot
- ✅ Order placed successfully

---

### Scenario 15: Responsive Breakpoints

**Objective**: Test button visibility at different screen sizes

#### Test Matrix:

| Screen Width | Buttons Visible? | Layout |
|--------------|------------------|--------|
| 375px (iPhone SE) | ✅ Yes | Mobile |
| 390px (iPhone 12) | ✅ Yes | Mobile |
| 768px (iPad) | ❌ No | Tablet |
| 1024px (Desktop) | ❌ No | Desktop |
| 1280px (Desktop) | ❌ No | Desktop |

#### Steps:
1. Use Chrome DevTools
2. Toggle device emulation
3. Test each screen size
4. Verify button visibility

---

## 🐛 Known Issues to Watch For

### Issue 1: App Not Opening
**Symptom**: Button tapped but nothing happens  
**Cause**: App not installed  
**Solution**: Use QR code fallback  

### Issue 2: Wrong Amount
**Symptom**: Amount in app doesn't match  
**Cause**: Calculation error  
**Solution**: Check console logs, verify subtotal + 7  

### Issue 3: Buttons Visible on Desktop
**Symptom**: Buttons show on large screens  
**Cause**: CSS class issue  
**Solution**: Check `md:hidden` class applied  

### Issue 4: Deep Link Not Working
**Symptom**: Generic error when tapping  
**Cause**: Browser/OS limitation  
**Solution**: Use QR code, may work on different browser  

---

## 📝 Testing Report Template

### Test Session Information:
```
Date: _______________
Tester: _______________
Device: _______________
OS Version: _______________
Browser: _______________
UPI Apps Installed: _______________
```

### Test Results:

| Scenario | Pass | Fail | Notes |
|----------|------|------|-------|
| 1. Button Visibility (Mobile) | ☐ | ☐ | |
| 2. Buttons Hidden (Desktop) | ☐ | ☐ | |
| 3. PhonePe Button | ☐ | ☐ | |
| 4. Google Pay Button | ☐ | ☐ | |
| 5. Paytm Button | ☐ | ☐ | |
| 6. Complete Payment Flow | ☐ | ☐ | |
| 7. Amount Verification | ☐ | ☐ | |
| 8. Order ID in Note | ☐ | ☐ | |
| 9. Button Animation | ☐ | ☐ | |
| 10. QR Code Fallback | ☐ | ☐ | |
| 11. Multiple Taps | ☐ | ☐ | |
| 12. Browser Back | ☐ | ☐ | |
| 13. Network Error | ☐ | ☐ | |
| 14. Screenshot Upload | ☐ | ☐ | |
| 15. Responsive Breakpoints | ☐ | ☐ | |

### Overall Result:
- Total Passed: _____ / 15
- Total Failed: _____ / 15
- Critical Issues: _______________
- Minor Issues: _______________
- Recommendation: ☐ Deploy  ☐ Fix Issues  ☐ Re-test

---

## 🎯 Success Criteria

### Must Have (Critical):
- ✅ Buttons visible on mobile only
- ✅ Buttons open correct UPI app
- ✅ Amount is pre-filled and locked
- ✅ Order ID in transaction note
- ✅ Can complete payment and order

### Should Have (Important):
- ✅ All three apps work (PhonePe, GPay, Paytm)
- ✅ Animations smooth
- ✅ QR code still works
- ✅ Screenshot upload works

### Nice to Have (Optional):
- ✅ Graceful handling of missing apps
- ✅ Clean error messages
- ✅ Fast app launch

---

## 🚀 Ready for Production Checklist

Before deploying to production:

- [ ] All 15 test scenarios passed
- [ ] Tested on Android and iOS
- [ ] Tested with PhonePe, Google Pay, Paytm
- [ ] Amount calculation verified
- [ ] Order ID transmission verified
- [ ] Desktop hides buttons correctly
- [ ] QR code fallback works
- [ ] Transaction ID entry works
- [ ] Screenshot upload works
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Payment verification works
- [ ] Order creation works
- [ ] Firestore updates work
- [ ] Email notifications work (if applicable)

---

**Happy Testing!** 🧪🎉

If you find any issues, document them and report to the development team for fixes.
