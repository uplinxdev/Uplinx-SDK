# Railway Build Detection Fix

## Problem
Railway shows error: "Railpack could not determine how to build the app"

## Solution

### Option 1: Set Root Directory in Railway Dashboard (Recommended)

1. Go to your **API service** in Railway
2. Click **"Settings"** tab
3. Scroll to **"Source"** section
4. Set **"Root Directory"** to: `apps/api`
5. Click **"Save"**
6. Railway will automatically redeploy

### Option 2: Use nixpacks.toml (Already Created)

I've created `nixpacks.toml` files that explicitly tell Railway how to build:
- `apps/api/nixpacks.toml` - For API service
- `apps/web/nixpacks.toml` - For Web service

These files are already in the repository and Railway will use them automatically.

### Option 3: Set Build Commands in Railway Dashboard

If the above doesn't work, set explicitly in Railway:

1. Go to your **API service** → **"Settings"**
2. Scroll to **"Build & Deploy"** section
3. Set **"Build Command"**:
   ```
   npm install && npx prisma generate && npm run build && npx prisma migrate deploy
   ```
4. Set **"Start Command"**:
   ```
   npm start
   ```
5. Make sure **"Root Directory"** is set to: `apps/api`

## For Web Service

1. Go to **Web service** → **"Settings"**
2. Set **"Root Directory"** to: `apps/web`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`

## Verification

After setting root directory:
- ✅ Railway should detect `package.json` in `apps/api`
- ✅ Should detect Node.js project
- ✅ Should run build commands automatically
- ✅ Should start the service

## Common Issues

### Still Can't Detect
- Verify root directory is exactly `apps/api` (not `apps/api/` with trailing slash)
- Check that `package.json` exists in `apps/api/`
- Ensure the repository is connected correctly

### Build Fails After Detection
- Check build logs for specific errors
- Verify all dependencies are in `package.json`
- Check that Prisma schema is in `apps/api/prisma/`

