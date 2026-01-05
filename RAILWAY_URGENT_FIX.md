# URGENT: Railway Root Directory Fix

## Current Problem
Railway is analyzing the root directory and seeing:
```
./
├── api/
├── web/
```

But your code is in `apps/api` and `apps/web`.

## Solution: Set Root Directory in Railway Dashboard

### Step-by-Step Instructions:

1. **Go to Railway Dashboard**
   - Open https://railway.app
   - Log into your account
   - Open your project

2. **Find Your API Service**
   - If you haven't created it yet:
     - Click **"New"** → **"GitHub Repo"**
     - Select your repository
     - **STOP** - Don't deploy yet!

3. **Set Root Directory BEFORE Deploying**
   - Look for **"Configure"** or **"Settings"** button
   - Click it
   - Find **"Root Directory"** field
   - Type: `apps/api`
   - Click **"Save"** or **"Deploy"**

4. **If Service Already Exists:**
   - Click on your **API service** name
   - Click **"Settings"** tab (gear icon on the right)
   - Scroll to **"Source"** section
   - Find **"Root Directory"** field
   - Clear it if it has anything
   - Type: `apps/api` (exactly, no slashes)
   - Click **"Save"** or **"Update"**
   - Railway will automatically redeploy

### Visual Check:

After setting, when you look at the service settings, you should see:
```
Root Directory: apps/api
```

NOT:
- `/apps/api` ❌
- `apps/api/` ❌
- `./apps/api` ❌
- (empty) ❌

### Verify It Worked:

After Railway redeploys, check the build logs. You should see:
- ✅ "Detected Node.js"
- ✅ "Found package.json"
- ✅ "Running npm install"

If you still see "Railpack could not determine how to build", the root directory wasn't set correctly.

## Alternative: Manual Build Commands

If Root Directory still doesn't work, set build commands manually:

1. Go to **Settings** → **"Build & Deploy"** section
2. Set **"Build Command"**:
   ```
   cd apps/api && npm install && npx prisma generate && npm run build && npx prisma migrate deploy
   ```
3. Set **"Start Command"**:
   ```
   cd apps/api && npm start
   ```

But Root Directory is the preferred method.

## Still Not Working?

1. **Check Repository Connection:**
   - Make sure Railway is connected to the correct GitHub repository
   - Verify it's the `Uplinx-app` repository (not `Uplinx-SDK`)

2. **Check Branch:**
   - Make sure Railway is deploying from the `main` branch
   - Settings → Source → Branch should be `main`

3. **Try Redeploy:**
   - After setting root directory, manually trigger a redeploy
   - Go to **Deployments** tab
   - Click **"Redeploy"** or **"Deploy"**

4. **Check Service Type:**
   - Make sure you created a **"GitHub Repo"** service
   - Not a "Template" or "Empty" service

