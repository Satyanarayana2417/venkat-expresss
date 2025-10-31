# ✅ Pre-Deployment Verification Checklist

## Before Pushing to Vercel

### 1️⃣ Local Build Test
```powershell
# Navigate to project directory
cd "c:\Users\Latitude\OneDrive\Attachments\Desktop\venkat express 2\venkat-express-2"

# Clean install (optional but recommended)
# rm -rf node_modules package-lock.json
# npm install

# Run production build
npm run build
```

**Expected Output:**
```
✓ 3928 modules transformed.
✓ built in ~50s
```

**If build fails:**
- [ ] Check error message
- [ ] Fix TypeScript errors
- [ ] Ensure all imports are correct
- [ ] Run `npm install` to ensure dependencies

**Status:** ✅ PASSED (Verified 2025-10-31)

---

### 2️⃣ Preview Production Build Locally
```powershell
npm run preview
```

**Expected Output:**
```
➜  Local:   http://localhost:4173/
```

**Manual Tests:**
- [ ] Open http://localhost:4173 in browser
- [ ] Homepage displays correctly
- [ ] Navigate to Products page
- [ ] Navigate to About page
- [ ] Check browser console (F12) - should have no RED errors
- [ ] Test cart functionality (add item)
- [ ] Test authentication (sign up/login)

**Status:** ⏳ TO DO

---

### 3️⃣ Git Status Check
```powershell
git status
```

**Verify:**
- [ ] `src/main.tsx` shows as modified
- [ ] No unexpected file changes
- [ ] `.env` is NOT in the list (should be in .gitignore)

**Commit Changes:**
```powershell
git add src/main.tsx
git add VERCEL_DEPLOYMENT_DIAGNOSTIC_CHECKLIST.md
git add VERCEL_FIX_SUMMARY.md
git add VERCEL_DEPLOYMENT_CHECKLIST.md
git commit -m "fix: add browser API safety checks for Vercel deployment

- Wrapped window, document, sessionStorage access in typeof window checks
- Prevents ReferenceError during Vercel build process
- Ensures safe initialization in non-browser environments
- Added comprehensive deployment diagnostic documentation"
```

**Status:** ⏳ TO DO

---

### 4️⃣ Vercel Project Settings

**Before first deployment, verify:**

1. **Go to:** https://vercel.com/dashboard
2. **Check:** Your project exists or create new project
3. **Settings → Build & Development:**
   - [ ] Framework Preset: **Vite**
   - [ ] Build Command: `npm run build` (or auto)
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install` (or auto)
   - [ ] Node.js Version: 18.x or 20.x

4. **Settings → Environment Variables:**
   - [ ] No variables required (unless you want Google Maps)
   - [ ] Optional: `VITE_GOOGLE_MAPS_API_KEY` (if you have one)

**Status:** ⏳ TO DO

---

### 5️⃣ Push to Repository
```powershell
# Push to main branch (triggers Vercel auto-deploy)
git push origin main

# OR if you have a different branch:
# git push origin your-branch-name
```

**Expected:**
- [ ] Push succeeds without errors
- [ ] Vercel webhook triggers deployment (check Vercel dashboard)

**Status:** ⏳ TO DO

---

## During Deployment

### 6️⃣ Monitor Vercel Dashboard

**Watch for:**
1. **Building** status (⏳ yellow)
   - Check build logs for errors
   - Should complete in 1-3 minutes

2. **Ready** status (✅ green)
   - Deployment successful
   - Click "Visit" to open site

3. **Error** status (❌ red)
   - Click deployment to see logs
   - Check error message
   - Refer to diagnostic checklist

**Status:** ⏳ TO DO

---

## After Deployment

### 7️⃣ Smoke Test - Critical Features

**Open deployed URL:** `https://your-app.vercel.app`

#### Basic Functionality
- [ ] Homepage loads (no blank screen)
- [ ] No errors in browser console (F12 → Console)
- [ ] Images load correctly
- [ ] Fonts display correctly

#### Navigation
- [ ] Can navigate to `/products`
- [ ] Can navigate to `/about`
- [ ] Can navigate to `/services`
- [ ] Refreshing `/products` doesn't show 404
- [ ] Back button works

#### Authentication
- [ ] Can open login page
- [ ] Can sign up (create test account)
- [ ] Can log in
- [ ] Profile page loads
- [ ] Can log out

#### E-commerce Features
- [ ] Can view product details
- [ ] Can add item to cart
- [ ] Cart icon updates count
- [ ] Can view cart
- [ ] Can add to wishlist
- [ ] Wishlist icon works

#### Firebase Integration
- [ ] No Firebase errors in console
- [ ] Data persists after refresh
- [ ] Guest cart works
- [ ] User cart syncs after login

**Status:** ⏳ TO DO

---

### 8️⃣ Performance Check

**Open browser DevTools:**
1. Network tab
   - [ ] Check total page size
   - [ ] Verify assets load from CDN
   - [ ] Check for failed requests (404s)

2. Console tab
   - [ ] No RED errors
   - [ ] Warnings are acceptable
   - [ ] Service worker registered (or failed gracefully)

3. Lighthouse (Optional)
   - [ ] Run Lighthouse audit
   - [ ] Performance score > 60
   - [ ] Accessibility score > 80
   - [ ] Best Practices > 80

**Status:** ⏳ TO DO

---

### 9️⃣ Cross-Browser Testing

**Test on multiple browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**What to check:**
- [ ] Site loads on all browsers
- [ ] No console errors
- [ ] Layout looks correct
- [ ] Features work

**Status:** ⏳ TO DO

---

### 🔟 Mobile Responsiveness

**Test on mobile devices or browser DevTools:**
1. Open site on mobile or use Chrome DevTools → Toggle device toolbar
2. Test different screen sizes:
   - [ ] Mobile (375px - 414px)
   - [ ] Tablet (768px - 1024px)
   - [ ] Desktop (1280px+)

**What to check:**
- [ ] Layout adapts to screen size
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] Bottom navbar appears on mobile
- [ ] Header hides on mobile (where configured)

**Status:** ⏳ TO DO

---

## 🚨 If Something Goes Wrong

### Rollback Strategy

**Option 1: Rollback to Previous Deployment**
1. Vercel Dashboard → Deployments
2. Find a working deployment
3. Click "..." → **Promote to Production**

**Option 2: Force Redeploy**
1. Vercel Dashboard → Latest Deployment
2. Click "..." → **Redeploy**
3. Uncheck "Use existing Build Cache"
4. Click **Redeploy**

**Option 3: Local Fix + Redeploy**
1. Fix the issue in code
2. Commit changes
3. Push to repository
4. Wait for auto-deploy

---

## 📊 Deployment Metrics

### Build Time
- **Expected:** 1-3 minutes
- **Actual:** ___________

### Build Size
- **Expected:** ~2.4 MB total
  - `index.html`: ~2.68 kB
  - CSS: ~111 kB
  - JS (vendor): ~163 kB
  - JS (firebase): ~492 kB
  - JS (main): ~1,657 kB
- **Actual:** ___________

### Performance
- **Lighthouse Performance:** ___________ (target: >60)
- **Lighthouse Accessibility:** ___________ (target: >80)
- **First Contentful Paint:** ___________ (target: <2s)
- **Time to Interactive:** ___________ (target: <5s)

---

## ✅ Final Checklist

**Before marking deployment complete:**
- [ ] Build succeeded on Vercel
- [ ] Site is accessible at production URL
- [ ] Homepage loads without errors
- [ ] Navigation works (routing)
- [ ] Authentication works (login/signup)
- [ ] Cart functionality works
- [ ] Wishlist functionality works
- [ ] Firebase integration works
- [ ] No console errors (except acceptable warnings)
- [ ] Mobile responsive layout works
- [ ] Cross-browser tested (at least Chrome + one other)
- [ ] Service worker registered or failed gracefully
- [ ] PWA install prompt works (optional)

---

## 📝 Deployment Log

| Date | Time | Version | Status | Notes |
|------|------|---------|--------|-------|
| 2025-10-31 | _____ | 1.0 | ⏳ Pending | Initial deployment with browser API fix |
| | | | | |
| | | | | |

---

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Production URL:** ___________________________
- **Repository:** https://github.com/Satyanarayana2417/venkat-expresss22
- **Diagnostic Guide:** `VERCEL_DEPLOYMENT_DIAGNOSTIC_CHECKLIST.md`
- **Fix Summary:** `VERCEL_FIX_SUMMARY.md`

---

## 📞 Support Resources

**If deployment fails:**
1. Check `VERCEL_DEPLOYMENT_DIAGNOSTIC_CHECKLIST.md`
2. Review Vercel build logs
3. Check browser console errors
4. Review Firebase console for errors
5. Test local build with `npm run build && npm run preview`

**Common Issues:**
- Blank screen → Check console for errors
- 404 on refresh → Verify `vercel.json` is deployed
- Firebase errors → Check Firebase config
- Build fails → Check TypeScript errors

---

**Checklist Version:** 1.0  
**Last Updated:** 2025-10-31  
**Status:** Ready for use
