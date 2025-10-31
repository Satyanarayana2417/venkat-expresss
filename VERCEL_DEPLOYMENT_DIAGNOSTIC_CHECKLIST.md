# 🚀 Vercel Deployment Diagnostic Checklist - Venkat Express

## 📋 Executive Summary

**Project Type:** Vite + React SPA (NOT Next.js - no SSR)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Framework:** React 18.3.1 + Vite 5.4.19

---

## ✅ FIXED ISSUES (Already Resolved)

### 1. ✅ Browser API Access in main.tsx
**Issue:** Top-level access to `window`, `document`, `sessionStorage` could crash if executed in non-browser environment  
**Fix Applied:** Wrapped all browser API calls in `typeof window !== 'undefined'` check
**File:** `src/main.tsx`
**Status:** ✅ FIXED

### 2. ✅ i18n localStorage Access
**Issue:** localStorage access during module initialization  
**Fix Applied:** Already had `typeof window !== 'undefined'` guards  
**File:** `src/i18n/config.ts`
**Status:** ✅ SAFE

### 3. ✅ Firebase Configuration
**Issue:** None - Firebase config is hardcoded (no environment variables needed)  
**File:** `src/lib/firebase.ts`
**Status:** ✅ SAFE

### 4. ✅ Context Providers
**Issue:** localStorage/sessionStorage access in contexts  
**Fix Applied:** All access is inside functions called from useEffect (client-side only)  
**Files:** `src/contexts/CartContext.tsx`, `src/contexts/WishlistContext.tsx`
**Status:** ✅ SAFE

---

## 🔍 CRITICAL DIAGNOSTICS - Step-by-Step

### Step 1: Browser Console (Runtime Errors)

**Action Required:**
1. Open deployed site in browser
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Look for RED errors

**Common Errors to Look For:**

```javascript
// ❌ BAD: Reference Error (means browser API accessed on server)
ReferenceError: window is not defined
ReferenceError: document is not defined
ReferenceError: localStorage is not defined

// ❌ BAD: Module initialization error
Cannot read property 'getItem' of undefined

// ❌ BAD: Firebase error
FirebaseError: Firebase App not initialized

// ✅ GOOD: No errors, or only warnings
```

**If you see errors:**
- Copy the EXACT error message
- Note the file name and line number
- Check if it mentions `window`, `document`, `localStorage`, `sessionStorage`, or `navigator`

---

### Step 2: Vercel Runtime Logs (Build & Function Errors)

**Action Required:**
1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click **"View Function Logs"** or **"Runtime Logs"**

**What to Look For:**

```bash
# ✅ GOOD: Successful build
✓ Build completed successfully
✓ Compiled successfully

# ❌ BAD: Build failure
Error: Build failed
Module not found: Can't resolve 'xyz'
SyntaxError: Unexpected token

# ❌ BAD: Environment variable missing (unlikely for this project)
Error: VITE_GOOGLE_MAPS_API_KEY is undefined
```

**Note:** For this Vite+React SPA, there are NO serverless functions, so runtime logs should be minimal or empty.

---

### Step 3: Vercel Build Logs (Compilation Issues)

**Action Required:**
1. Vercel Dashboard → Deployment → **"Building"** tab
2. Scroll through the build output

**Expected Success Output:**
```bash
[11:23:45.123] Running "npm run build"
[11:23:46.456] > vite build
[11:23:55.789] ✓ Build completed successfully
[11:23:55.790] dist/index.html
[11:23:55.791] dist/assets/*
```

**If Build Fails - Common Issues:**

```bash
# Issue 1: Missing dependencies
npm ERR! Cannot find module 'xyz'
→ Solution: Ensure all dependencies are in package.json

# Issue 2: TypeScript errors
src/Component.tsx:123:45 - error TS2345
→ Solution: Fix TypeScript type errors

# Issue 3: Out of memory
JavaScript heap out of memory
→ Solution: Contact Vercel support or optimize build
```

---

## 🌐 Environment Variables Check

### Required Environment Variables: **NONE** ❌

**Important:** This project does NOT require any environment variables for basic functionality.

### Optional Environment Variables:

| Variable | Purpose | Required? | Default Behavior |
|----------|---------|-----------|------------------|
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps reverse geocoding | ❌ Optional | Falls back to free services (BigDataCloud, OpenCage) |

**How to Add (if needed):**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add Key: `VITE_GOOGLE_MAPS_API_KEY`
3. Add Value: Your Google Maps API key
4. Select Environment: Production, Preview, Development (all three)
5. Click **"Save"**
6. **Redeploy** the project

**Note:** The app works fine WITHOUT the Google Maps API key. It will use free geocoding services instead.

---

## 🎯 Specific Suspects & Solutions

### Suspect 1: Service Worker Registration Failure

**Symptoms:**
- Browser console shows: `Service Worker registration failed`
- PWA doesn't install

**Investigation:**
1. Check browser console for service worker errors
2. Verify `/service-worker.js` is accessible at: `https://your-domain.vercel.app/service-worker.js`

**Solution:**
- Service worker errors are non-blocking (wrapped in try-catch)
- If it fails, app still works, just won't cache offline

**Vercel Configuration Check:**
- Ensure `vercel.json` has proper rewrites (already configured ✅)

---

### Suspect 2: Blank White Screen (No Error Message)

**Symptoms:**
- Site loads but shows blank white screen
- No errors in console
- Network tab shows 200 OK for all resources

**Investigation:**
```javascript
// Open browser console and run:
console.log(document.getElementById('root'));
// Should NOT be null

// Check if React rendered:
console.log(window.React);
```

**Possible Causes:**
1. Root element not found → Check if `index.html` is served correctly
2. React app failed to mount → Check for silent errors in ErrorBoundary
3. CSS issue making content invisible → Check computed styles

**Solution:**
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check Network tab for failed CSS/JS loads
- Verify all assets are loading from correct paths

---

### Suspect 3: SPA Routing Not Working (404 on Refresh)

**Symptoms:**
- Homepage works
- Navigation within app works
- Refreshing on `/products` shows 404 or Vercel error page

**Investigation:**
- Try accessing: `https://your-domain.vercel.app/products`
- If it shows 404, routing configuration is wrong

**Solution:**
✅ Already configured in `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/((?!.*\\.).*)",
      "destination": "/index.html"
    }
  ]
}
```

**If still broken:**
1. Verify `vercel.json` exists in project root
2. Redeploy after ensuring `vercel.json` is committed to git
3. Check Vercel Dashboard → Settings → Build & Development Settings → Framework Preset should be **"Vite"**

---

### Suspect 4: Assets Not Loading (Images, Fonts, etc.)

**Symptoms:**
- Broken image icons
- Missing fonts
- Console shows 404 for assets

**Investigation:**
```javascript
// In browser console, check:
console.log(window.location.origin);
// Should match your Vercel domain

// Check Network tab → Filter by "Img" or "Font"
// Look for 404 errors
```

**Common Issues:**
```javascript
// ❌ BAD: Absolute paths without base
<img src="/images/logo.png" />  // Might fail if base URL is wrong

// ✅ GOOD: Use import or public folder
import logo from '@/assets/logo.png'
<img src={logo} />

// OR use public folder:
<img src="/logo.png" />  // File must be in /public/logo.png
```

**Solution:**
- Ensure all assets are either:
  - In `/public` folder (served as-is)
  - Imported in components (bundled by Vite)
- Check `vite.config.ts` → `base: "/"` (already correct ✅)

---

## 🔧 Vercel Project Settings Verification

### Build & Development Settings

**Navigate to:** Vercel Dashboard → Your Project → Settings → Build & Development Settings

**Verify these settings:**

| Setting | Expected Value | Why |
|---------|---------------|-----|
| Framework Preset | **Vite** | Auto-configures build commands |
| Build Command | `npm run build` or auto | Vite build command |
| Output Directory | `dist` | Vite's default output |
| Install Command | `npm install` or auto | Install dependencies |
| Node.js Version | 18.x or 20.x | LTS version |

**If any are wrong:**
1. Click **"Edit"** next to the setting
2. Change to correct value
3. Click **"Save"**
4. **Redeploy**

---

## 🧪 Local vs Production Comparison

### Test Locally First

**Run production build locally:**
```powershell
# Build the app
npm run build

# Preview the production build
npm run preview
```

**Expected output:**
```
➜  Local:   http://localhost:4173/
➜  Network: use --host to expose
```

**Test in browser:**
1. Open `http://localhost:4173/`
2. Check if app works
3. Check browser console for errors

**If it works locally but NOT on Vercel:**
- Issue is likely Vercel configuration, not code
- Check Vercel build logs
- Verify `vercel.json` is deployed

**If it ALSO fails locally:**
- Issue is in the code
- Check browser console for specific error
- Fix the error before redeploying

---

## 📊 Deployment Checklist

### Before Pushing to Vercel:

- [ ] **Code Compiles:** `npm run build` completes without errors
- [ ] **Local Preview Works:** `npm run preview` shows working app
- [ ] **No Console Errors:** Browser console is clean (only warnings OK)
- [ ] **TypeScript Passes:** No TS errors (if using strict mode)
- [ ] **Git Status Clean:** All changes committed
- [ ] **vercel.json Present:** File exists in root with SPA rewrites
- [ ] **package.json Valid:** All dependencies listed
- [ ] **Firebase Config Present:** `src/lib/firebase.ts` has correct credentials

### After Deploying to Vercel:

- [ ] **Build Succeeded:** Green checkmark in Vercel dashboard
- [ ] **Site Accessible:** Can open the Vercel URL
- [ ] **Homepage Loads:** No blank screen
- [ ] **Routing Works:** Can navigate to `/products`, `/about`, etc.
- [ ] **Refresh Works:** Refreshing `/products` doesn't show 404
- [ ] **Assets Load:** Images, fonts, icons display correctly
- [ ] **Auth Works:** Can sign up/login
- [ ] **Firebase Works:** Can add to cart, wishlist
- [ ] **Console Clean:** No red errors in browser console

---

## 🆘 Emergency Debugging Commands

### If Site is Completely Broken:

**1. Check if HTML is being served:**
```powershell
# From your terminal:
curl https://your-app.vercel.app/ | Select-String -Pattern "root"
# Should show: <div id="root"></div>
```

**2. Check if JavaScript is loading:**
```powershell
curl https://your-app.vercel.app/ | Select-String -Pattern "script"
# Should show: <script type="module" src="/src/main.tsx"></script>
```

**3. Force a clean rebuild:**
- Vercel Dashboard → Deployments → Latest Deployment → "..." menu → **Redeploy**
- Check "Use existing Build Cache" → **Uncheck it**
- Click **Redeploy**

**4. Rollback to previous working version:**
- Vercel Dashboard → Deployments → Find a working deployment
- Click "..." menu → **Promote to Production**

---

## 🐛 Known Non-Breaking Warnings (Safe to Ignore)

These warnings appear in console but don't break the app:

```javascript
// ✅ Safe to ignore:
Service Worker registration failed: NotAllowedError
// → PWA feature, not critical

// ✅ Safe to ignore:
A cookie associated with a cross-site resource was set without the `SameSite` attribute
// → Firebase auth, doesn't affect functionality

// ✅ Safe to ignore:
DevTools failed to load source map
// → Development tool, doesn't affect production
```

---

## 📞 Getting Help

### Information to Provide When Asking for Help:

1. **Vercel Deployment URL:** `https://your-app.vercel.app`
2. **Browser Console Errors:** Copy full error message + stack trace
3. **Vercel Build Logs:** Copy from Vercel dashboard (last 50 lines)
4. **Steps to Reproduce:** What you clicked before error appeared
5. **Browser & Version:** Chrome 120, Firefox 121, etc.
6. **Screenshots:** Especially of errors or blank screens

---

## 🎯 Summary of Changes Made

### Files Modified:

#### `src/main.tsx`
**Before:**
```typescript
// ❌ Unsafe: Direct browser API access
if (window.matchMedia('(display-mode: standalone)').matches) {
  const isPWALaunch = sessionStorage.getItem('pwa_launched') !== 'true';
  // ...
}
const rootElement = document.getElementById("root");
```

**After:**
```typescript
// ✅ Safe: Wrapped in browser check
if (typeof window !== 'undefined') {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    const isPWALaunch = sessionStorage.getItem('pwa_launched') !== 'true';
    // ...
  }
}
const rootElement = typeof document !== 'undefined' ? document.getElementById("root") : null;
```

**Impact:** Prevents crashes if code is executed in non-browser environment (Vite preview SSR, Vercel build process, etc.)

---

## ✅ Final Verification Steps

### 1. Test Production Build Locally:
```powershell
npm run build
npm run preview
```
- Open http://localhost:4173
- Test navigation
- Check console for errors

### 2. Deploy to Vercel:
```powershell
git add .
git commit -m "fix: add browser API safety checks for Vercel deployment"
git push origin main
```

### 3. Monitor Deployment:
- Watch Vercel dashboard for build completion
- Check build logs for errors
- Test live site immediately after deployment

### 4. Smoke Test Production:
- [ ] Homepage loads
- [ ] Products page loads
- [ ] Can add item to cart
- [ ] Can sign in
- [ ] No console errors

---

## 🎊 Expected Outcome

After applying the fixes in this document:
- ✅ Vercel build should complete successfully
- ✅ Site should load without errors
- ✅ All browser APIs are safely accessed
- ✅ No "window is not defined" errors
- ✅ SPA routing works on all pages
- ✅ PWA features work (service worker registers)
- ✅ Firebase auth and Firestore work correctly

---

## 📝 Additional Notes

### Why This Isn't an SSR Issue:
- This is a **Vite + React SPA** (Single Page Application)
- There is NO server-side rendering
- Everything runs in the browser
- The only server involvement is:
  - Serving the static `index.html`
  - Serving bundled JavaScript files

### Why Browser Checks Were Needed:
- Vite build process uses Node.js (not a browser)
- During build, Vite executes module-level code
- Module-level code should not assume browser environment
- All browser APIs should be accessed inside:
  - React component lifecycle (useEffect)
  - Event handlers
  - Code wrapped in `typeof window !== 'undefined'`

---

## 🔗 Related Documentation

- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)
- [Vercel Vite Deployment Guide](https://vercel.com/docs/frameworks/vite)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel SPA Configuration](https://vercel.com/docs/concepts/projects/project-configuration#rewrites)

---

**Last Updated:** 2025-10-31  
**Version:** 1.0  
**Status:** ✅ Ready for Deployment
