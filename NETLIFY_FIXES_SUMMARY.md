# Netlify Deployment Fixes - Summary

## ✅ Issues Fixed

### 1. **Incorrect Publish Directory** ✅ FIXED
- **Problem**: `publish = ".next"` was set in `netlify.toml`
- **Why it broke**: The Next.js plugin handles the publish directory automatically. Setting it manually causes routing issues.
- **Fix**: Removed the `publish` line from `netlify.toml`
- **File**: `apps/web/netlify.toml`

### 2. **Missing Base Directory** ✅ FIXED
- **Problem**: Netlify didn't know this was a monorepo
- **Why it broke**: Netlify was trying to build from the root instead of `apps/web`
- **Fix**: Added `base = "apps/web"` to `netlify.toml`
- **File**: `apps/web/netlify.toml` and `netlify.toml` (root)

### 3. **Build Error: useSearchParams() Suspense** ✅ FIXED
- **Problem**: `useSearchParams()` must be wrapped in Suspense for static generation
- **Why it broke**: Next.js requires Suspense boundaries for dynamic hooks during build
- **Fix**: Wrapped the component using `useSearchParams()` in a Suspense boundary
- **File**: `apps/web/src/app/console/page.tsx`

## Files Changed

1. ✅ `apps/web/netlify.toml` - Fixed publish directory and added base
2. ✅ `netlify.toml` (root) - Added as backup configuration
3. ✅ `apps/web/src/app/console/page.tsx` - Added Suspense boundary

## Build Status

✅ **Build now succeeds locally!**
- All pages generate correctly
- No build errors
- Ready for deployment

## Next Steps for Netlify

### 1. Verify Netlify Dashboard Settings

Go to **Site settings** → **Build & deploy** → **Build settings**:

- ✅ **Base directory**: `apps/web`
- ✅ **Build command**: Leave empty (uses `netlify.toml`)
- ✅ **Publish directory**: Leave EMPTY (plugin handles this)
- ✅ **Install command**: `npm install` (or leave default)

### 2. Install Next.js Plugin

Go to **Plugins** in Netlify dashboard:
- ✅ Install **"Essential Next.js Plugin"** (`@netlify/plugin-nextjs`)
- ✅ Make sure it's enabled

### 3. Set Environment Variable

Go to **Site settings** → **Environment variables**:
- ✅ Add: `NEXT_PUBLIC_API_URL=https://your-api-url.com`
- ⚠️ Must be the full URL with `https://`
- ⚠️ No trailing slash

### 4. Deploy

1. Commit and push these changes to GitHub
2. Netlify will auto-deploy (or trigger manually)
3. Check build logs for success
4. Visit your site URL

## Testing Checklist

After deployment:

- [ ] Site loads (not 404)
- [ ] Homepage displays correctly
- [ ] Can navigate to `/console`
- [ ] Can navigate to `/marketplace`
- [ ] Can navigate to `/docs`
- [ ] API calls work (check browser console)
- [ ] Wallet connection works
- [ ] No console errors

## If Still Not Working

1. **Check Build Logs**: Look for specific errors
2. **Verify Plugin**: Ensure Next.js plugin is installed
3. **Check Env Vars**: Verify `NEXT_PUBLIC_API_URL` is set correctly
4. **Test API**: Make sure your API is accessible
5. **Clear Cache**: Try clearing Netlify build cache

## Alternative: Railway

If Netlify continues to have issues, Railway is a better option for Next.js monorepos:
- ✅ Auto-detects Next.js
- ✅ Better monorepo support
- ✅ No special plugins needed
- ✅ See `RAILWAY_DEPLOYMENT.md` for instructions

