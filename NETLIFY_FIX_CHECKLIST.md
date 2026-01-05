# Netlify Deployment Fix Checklist

## Issues Found and Fixed

### ✅ Issue 1: Incorrect Publish Directory
**Problem**: `publish = ".next"` was set in `netlify.toml`
**Fix**: Removed - The Next.js plugin handles this automatically
**Status**: ✅ Fixed in `apps/web/netlify.toml`

### ✅ Issue 2: Missing Base Directory Configuration
**Problem**: Netlify needs to know this is a monorepo
**Fix**: Added `base = "apps/web"` to `netlify.toml`
**Status**: ✅ Fixed

## Netlify Dashboard Configuration

Go to your Netlify site → **Site settings** → **Build & deploy** → **Build settings**

### Required Settings:

1. **Base directory**: `apps/web`
   - This tells Netlify to build from the `apps/web` folder

2. **Build command**: `npm install && npm run build`
   - Or leave empty if using `netlify.toml` (which we are)

3. **Publish directory**: Leave EMPTY
   - The Next.js plugin handles this automatically
   - ❌ DO NOT set to `.next` or `out`

4. **Install command**: `npm install`
   - Or leave as default

### Required Plugin:

1. Go to **Plugins** in Netlify dashboard
2. Install **"Essential Next.js Plugin"** (`@netlify/plugin-nextjs`)
   - This is CRITICAL - without it, Next.js routing won't work
   - If already installed, make sure it's enabled

## Environment Variables

Go to **Site settings** → **Environment variables**

### Required Variable:

```
NEXT_PUBLIC_API_URL=https://your-api-url.com
```

**Important**:
- ✅ Must start with `https://` (or `http://` for local)
- ✅ No trailing slash
- ✅ Must be accessible from the internet
- ✅ Example: `https://api-production-xxxx.up.railway.app`

## Verification Steps

After deploying, check:

1. **Build Logs**:
   - Go to **Deploys** → Click latest deploy → **Deploy log**
   - Look for:
     - ✅ "Next.js plugin detected"
     - ✅ "Build completed successfully"
     - ❌ Any errors about missing files or routes

2. **Site URL**:
   - Visit your Netlify site URL
   - Should see the homepage (not 404)

3. **Console Check**:
   - Open browser DevTools → Console
   - Check for errors about API calls
   - If you see `NEXT_PUBLIC_API_URL` errors, the env var isn't set correctly

4. **Network Tab**:
   - Open DevTools → Network
   - Try navigating to `/console`
   - Check if API requests are going to the correct URL

## Common Errors and Solutions

### Error: "Page not found" (404)
**Cause**: Next.js plugin not installed or publish directory set incorrectly
**Fix**:
1. Install `@netlify/plugin-nextjs` plugin
2. Remove publish directory from build settings
3. Redeploy

### Error: "API request failed"
**Cause**: `NEXT_PUBLIC_API_URL` not set or incorrect
**Fix**:
1. Set `NEXT_PUBLIC_API_URL` in environment variables
2. Make sure it's the full URL (with https://)
3. Redeploy (env vars require redeploy)

### Error: "Build failed"
**Cause**: Dependencies or build issues
**Fix**:
1. Check build logs for specific error
2. Ensure Node.js version is compatible (check `package.json` engines)
3. Try clearing Netlify build cache

### Error: "Cannot find module"
**Cause**: Monorepo dependencies not installed correctly
**Fix**:
1. Ensure base directory is set to `apps/web`
2. Check that `package.json` in `apps/web` has all dependencies
3. Try adding `npm install` explicitly in build command

## Files Updated

1. ✅ `apps/web/netlify.toml` - Fixed publish directory and added base
2. ✅ `netlify.toml` (root) - Added as backup configuration

## Next Steps

1. ✅ Verify `netlify.toml` changes are committed
2. ⏳ Push to GitHub (if not already done)
3. ⏳ Check Netlify dashboard settings match above
4. ⏳ Set `NEXT_PUBLIC_API_URL` environment variable
5. ⏳ Trigger a new deploy (or wait for auto-deploy)
6. ⏳ Test the site

## Still Not Working?

If after all these fixes it still doesn't work:

1. **Check Build Logs**: Look for specific error messages
2. **Test Locally**: Run `npm run build` in `apps/web` to catch build errors
3. **Check API**: Ensure your API is running and accessible
4. **Consider Railway**: Railway handles Next.js monorepos better out of the box

