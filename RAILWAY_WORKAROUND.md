# Railway Workaround: Use Build Commands with cd

If setting Root Directory doesn't work, use this workaround:

## For API Service:

### In Railway Dashboard:

1. Go to your **API service** → **Settings**
2. Scroll to **"Build & Deploy"** section
3. Set **"Build Command"**:
   ```
   cd apps/api && npm install && npx prisma generate && npm run build && npx prisma migrate deploy
   ```
4. Set **"Start Command"**:
   ```
   cd apps/api && npm start
   ```
5. Leave **"Root Directory"** empty or set to `.` (root)
6. Click **"Save"**

This will:
- Change to `apps/api` directory
- Run all build commands there
- Start the server from that directory

## For Web Service:

1. Go to your **Web service** → **Settings**
2. Scroll to **"Build & Deploy"** section
3. Set **"Build Command"**:
   ```
   cd apps/web && npm install && npm run build
   ```
4. Set **"Start Command"**:
   ```
   cd apps/web && npm start
   ```
5. Click **"Save"**

## Why This Works:

Even if Railway analyzes the root directory, the build commands explicitly change to the correct subdirectory before running npm commands. This bypasses the detection issue.

## Preferred Method:

Still try to set Root Directory first:
- **API**: `apps/api`
- **Web**: `apps/web`

But if that doesn't work, this workaround will definitely work.

