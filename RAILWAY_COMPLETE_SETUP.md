# Complete Railway Deployment Guide

## Overview

This guide will help you deploy both the **API** and **Web App** to Railway. You already have the **database** set up.

## Deployment Order

1. ✅ **Database** (Already done!)
2. ⏳ **API Service** (Deploy this first)
3. ⏳ **Web App** (Deploy after API)

---

## Part 1: Deploy API Service

### Step 1: Add API Service

1. Go to your Railway project
2. Click **"New"** → **"GitHub Repo"**
3. Select your `Uplinx-app` repository
4. Set **Root Directory** to: `apps/api`

### Step 2: Connect to Database

1. Go to **API service** → **Variables** tab
2. Click **"New Variable"** → **"Reference from..."**
3. Select your **PostgreSQL database**
4. Select **`DATABASE_URL`**
5. Railway will automatically link them ✅

### Step 3: Set Environment Variables

Add these in **API service** → **Variables**:

#### Required:
```
JWT_SECRET=<generate-strong-random-string-32-chars-min>
OPENROUTER_API_KEY=<your-openrouter-key>
OPENROUTER_SITE_URL=<will-update-after-web-deploy>
OPENROUTER_APP_NAME=Uplinx
NODE_ENV=production
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

**Note**: Update `CORS_ORIGINS` and `OPENROUTER_SITE_URL` after web app is deployed.

#### Optional:
```
ADMIN_WALLET_ADDRESSES=<comma-separated-addresses>
ADMIN_SECRET=<min-16-chars>
FREE_TIER_MAX_PRICE_PER_1M=2.0
WELCOME_BONUS_TOKENS=1000
```

### Step 4: Run Database Migrations

After first deployment:

**Option A - Railway CLI:**
```bash
railway run npx prisma migrate deploy
```

**Option B - Railway Dashboard:**
1. Go to **API service** → **Deployments**
2. Click latest deployment → **"View Logs"**
3. Use Railway's shell feature to run: `npx prisma migrate deploy`

### Step 5: Get API URL

1. Go to **API service** → **Settings** → **Networking**
2. Click **"Generate Domain"** if needed
3. Copy the **Public Domain** (e.g., `https://api-production-xxxx.up.railway.app`)

### Step 6: Test API

Visit: `https://your-api-url.railway.app/health`

Should return: `{ "status": "ok", ... }`

---

## Part 2: Deploy Web App

### Step 1: Add Web Service

1. In the **same Railway project**
2. Click **"New"** → **"GitHub Repo"**
3. Select your `Uplinx-app` repository again
4. Set **Root Directory** to: `apps/web`

### Step 2: Set Environment Variable

1. Go to **Web service** → **Variables** tab
2. Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
   ```
   (Use the API URL from Part 1, Step 5)

### Step 3: Get Web App URL

1. Go to **Web service** → **Settings** → **Networking**
2. Copy the **Public Domain**

### Step 4: Update API CORS

1. Go back to **API service** → **Variables**
2. Update `CORS_ORIGINS` to include your web app URL:
   ```
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://your-web-app.railway.app
   ```
3. Update `OPENROUTER_SITE_URL`:
   ```
   OPENROUTER_SITE_URL=https://your-web-app.railway.app
   ```
4. Redeploy API service (Railway will auto-redeploy)

---

## Part 3: Final Verification

### Test API
- ✅ Visit: `https://your-api-url.railway.app/health`
- ✅ Should return: `{ "status": "ok" }`

### Test Web App
- ✅ Visit: `https://your-web-app.railway.app`
- ✅ Should load homepage
- ✅ Check browser console for errors
- ✅ Try connecting wallet

### Test Connection
- ✅ Connect wallet on web app
- ✅ Should authenticate successfully
- ✅ Should be able to load engines
- ✅ Should be able to start a chat

---

## Environment Variables Summary

### API Service:
```
DATABASE_URL=<auto-from-database>
JWT_SECRET=<required>
OPENROUTER_API_KEY=<required>
OPENROUTER_SITE_URL=<web-app-url>
OPENROUTER_APP_NAME=Uplinx
NODE_ENV=production
CORS_ORIGINS=<comma-separated-urls>
PORT=<auto-set-by-railway>
```

### Web Service:
```
NEXT_PUBLIC_API_URL=<api-url>
PORT=<auto-set-by-railway>
```

---

## Troubleshooting

### API Build Fails
- Check root directory is `apps/api`
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is linked from database service
- Check database is running
- Run migrations: `npx prisma migrate deploy`

### Web App Can't Connect to API
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check API is running and accessible
- Verify CORS includes web app URL
- Check browser console for CORS errors

### CORS Errors
- Update `CORS_ORIGINS` in API service
- Include both localhost (for dev) and production URLs
- Redeploy API after updating

---

## Quick Reference

**API Service:**
- Root: `apps/api`
- Build: Auto-detected (runs `npm install && npm run build`)
- Start: `npm start`

**Web Service:**
- Root: `apps/web`
- Build: Auto-detected (runs `npm install && npm run build`)
- Start: `npm start`

**Database:**
- Already set up ✅
- Link via `DATABASE_URL` variable reference

---

## Next Steps After Deployment

1. ✅ Set up custom domains (optional)
2. ✅ Configure monitoring/alerts
3. ✅ Set up backups for database
4. ✅ Test all features end-to-end

