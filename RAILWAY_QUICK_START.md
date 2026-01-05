# Railway Quick Start - Web App Deployment

## Your Backend is Already on Railway ✅

Since your API is already deployed, here's the fastest way to get the web app running:

## Step-by-Step (5 minutes)

### 1. Add New Service
- Open your Railway project (the one with your API)
- Click **"New"** → **"GitHub Repo"**
- Select your repository

### 2. Set Root Directory
- In service settings, set **Root Directory** to: `apps/web`
- Railway will auto-detect Next.js ✅

### 3. Get Your API URL
- Go to your **API service** → **Settings** → **Networking**
- Copy the **Public Domain** (e.g., `https://api-production-xxxx.up.railway.app`)

### 4. Set Environment Variable
- Go to your **Web service** → **Variables** tab
- Add: `NEXT_PUBLIC_API_URL` = `[paste your API URL from step 3]`

### 5. Deploy
- Railway will auto-deploy
- Wait for build to complete
- Get your web app URL from **Settings** → **Networking**

## That's It! 🎉

Your web app should now be live and connected to your API.

## Need Help?

- Check build logs if deployment fails
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Make sure API service is running

