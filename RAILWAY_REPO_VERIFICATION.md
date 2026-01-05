# Railway Repository Verification & Fix

## The Problem

Error: "Could not find root directory: apps/api"

This means Railway is looking for `apps/api` but can't find it. This usually means:

1. **Wrong Repository**: Railway is connected to `Uplinx-SDK` instead of `Uplinx-app`
2. **Wrong Branch**: Railway is looking at a branch that doesn't have the `apps/` directory
3. **Structure Mismatch**: The repository structure on GitHub is different

## Solution: Verify Repository Connection

### Step 1: Check Which Repository Railway is Using

1. Go to Railway Dashboard
2. Click on your **API service**
3. Go to **Settings** tab
4. Look at **"Source"** section
5. Check the **"Repository"** field

**It should show**: `uplinxdev/Uplinx-app`

**If it shows**: `uplinxdev/Uplinx-SDK` ❌ → That's the problem!

### Step 2: Fix Repository Connection

If Railway is connected to the wrong repository:

1. Go to **Settings** → **"Source"**
2. Click **"Disconnect"** or **"Change Repository"**
3. Click **"Connect GitHub Repo"**
4. Select **`Uplinx-app`** (NOT `Uplinx-SDK`)
5. Make sure **Branch** is set to `main`
6. Click **"Save"**

### Step 3: Verify Branch

1. In **Settings** → **"Source"**
2. Check **"Branch"** is set to `main`
3. If it's set to a different branch, change it to `main`

### Step 4: Set Root Directory

After connecting to the correct repository:

1. In **Settings** → **"Source"**
2. Set **"Root Directory"** to: `apps/api`
3. Click **"Save"**

Railway will automatically redeploy.

## Quick Checklist

- [ ] Repository: `uplinxdev/Uplinx-app` (NOT Uplinx-SDK)
- [ ] Branch: `main`
- [ ] Root Directory: `apps/api`
- [ ] Clicked Save

## Alternative: Use Build Commands

If you can't change the repository, use build commands that work from root:

1. Go to **Settings** → **"Build & Deploy"**
2. Set **"Build Command"**:
   ```
   cd apps/api && npm install && npx prisma generate && npm run build && npx prisma migrate deploy
   ```
3. Set **"Start Command"**:
   ```
   cd apps/api && npm start
   ```
4. Leave **"Root Directory"** empty or set to `.`
5. Click **"Save"**

## Verify Repository Structure

To verify what Railway sees, check the build logs. Railway will show what files it detects. You should see:
- `apps/api/package.json`
- `apps/api/src/`
- `apps/api/prisma/`

If you don't see `apps/` in the logs, Railway is connected to the wrong repository.

