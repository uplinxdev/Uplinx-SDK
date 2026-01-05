# Railway Root Directory Fix - Step by Step

## The Problem

Railway is looking at the repository root and seeing:
```
./
├── api/
├── web/
```

But your code is actually in:
```
./
├── apps/
│   ├── api/    ← Your API code is here
│   └── web/    ← Your web code is here
```

## The Solution: Set Root Directory

### For API Service:

1. **Go to Railway Dashboard**
   - Open your Railway project
   - Click on your **API service** (or create it if you haven't)

2. **Open Settings**
   - Click the **"Settings"** tab (gear icon)

3. **Find Source Section**
   - Scroll down to **"Source"** section
   - Look for **"Root Directory"** field

4. **Set Root Directory**
   - In the **"Root Directory"** field, type exactly:
     ```
     apps/api
     ```
   - **Important**: No leading slash, no trailing slash
   - Just: `apps/api`

5. **Save**
   - Click **"Save"** or **"Update"** button
   - Railway will automatically trigger a new deployment

### For Web Service:

Follow the same steps, but set Root Directory to:
```
apps/web
```

## Visual Guide

```
Railway Dashboard → Your Service → Settings Tab
                                              ↓
                                    Source Section
                                              ↓
                                    Root Directory: [apps/api]
                                              ↓
                                          Save
```

## Verification

After setting the root directory and Railway redeploys, check the build logs. You should see:

✅ **Success indicators:**
- "Detected Node.js"
- "Running npm install"
- "Building application"
- Build completes successfully

❌ **If you still see errors:**
- Double-check the root directory is exactly `apps/api` (not `/apps/api` or `apps/api/`)
- Make sure there's a `package.json` file in `apps/api/`
- Check that the repository is connected correctly

## Alternative: Set in Service Creation

If you're creating a new service:

1. Click **"New"** → **"GitHub Repo"**
2. Select your repository
3. **Before clicking "Deploy"**, look for **"Configure"** or **"Settings"**
4. Set **"Root Directory"** to `apps/api`
5. Then deploy

## Still Not Working?

If Railway still can't detect after setting root directory:

1. **Check Build Command Manually:**
   - Go to Settings → Build & Deploy
   - Set Build Command: `npm install && npx prisma generate && npm run build && npx prisma migrate deploy`
   - Set Start Command: `npm start`

2. **Verify Repository Structure:**
   - Make sure `apps/api/package.json` exists
   - Make sure `apps/api/nixpacks.toml` exists (we created this)

3. **Check Railway Logs:**
   - Look at the build logs to see what Railway is detecting
   - The logs will show what files Railway sees

