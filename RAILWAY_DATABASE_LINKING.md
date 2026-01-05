# Linking Database from Different Railway Account

Since you're using a different Railway account, you need to manually link the database.

## Step 1: Get Database URL from Database Account

1. Log into the Railway account that has the database
2. Go to your **PostgreSQL database service**
3. Click on the **"Variables"** tab
4. Look for **`DATABASE_URL`** or **`POSTGRES_URL`**
5. Copy the **full connection string**

It will look something like:
```
postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

**OR** you can find it in:
- **Database service** → **"Connect"** tab
- **Database service** → **"Settings"** → **"Networking"** → Connection string

## Step 2: Add to API Service

1. Log into your **current Railway account** (where you're deploying API)
2. Go to your **API service**
3. Click **"Variables"** tab
4. Click **"New Variable"**
5. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste the connection string from Step 1
6. Click **"Add"**

## Step 3: Verify Connection

After deploying your API, check the logs to ensure:
- ✅ Prisma can connect to the database
- ✅ Migrations run successfully
- ✅ No connection errors

## Alternative: Create New Database

If you prefer to have everything in one account:

1. In your current Railway account
2. Click **"New"** → **"Database"** → **"PostgreSQL"**
3. Railway will automatically create `DATABASE_URL`
4. Run migrations to set up schema
5. (Optional) Migrate data from old database if needed

## Security Note

⚠️ **Important**: The `DATABASE_URL` contains sensitive credentials. Make sure:
- ✅ Never commit it to git
- ✅ Only share with trusted team members
- ✅ Use Railway's environment variables (not hardcoded)

## Troubleshooting

### Connection Refused
- Verify the database is running in the other account
- Check the connection string is correct
- Ensure database allows connections from external IPs (Railway databases do by default)

### Authentication Failed
- Verify the password in the connection string is correct
- Check if the database user has proper permissions

### Database Not Found
- Verify the database name in the connection string
- Check if you need to create the database first

