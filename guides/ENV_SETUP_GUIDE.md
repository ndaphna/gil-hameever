# 🔐 Environment Variables Setup Guide

## Required Variables for Lead Magnet Flow

Add these variables to your `.env.local` file:

```env
# ========================================
# BREVO API CONFIGURATION
# ========================================
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BREVO_FROM_EMAIL=gil.hameever@gmail.com
BREVO_FROM_NAME=מנופאוזית וטוב לה

# ========================================
# SITE URL (for email links)
# ========================================
# Your production URL (no trailing slash)
NEXT_PUBLIC_BASE_URL=https://gil-hameever.vercel.app

# For local development:
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## How to Get These Values

### 1. BREVO_API_KEY

1. Login to [Brevo Dashboard](https://app.brevo.com/)
2. Navigate to: **Settings** → **SMTP & API** → **API Keys**
3. Click **"Create a new API key"**
4. Give it a name (e.g., "Lead Magnet API")
5. Select permissions:
   - ✅ **Contacts** (required)
   - ✅ **Email campaigns** (required)
6. Copy the generated key
7. Paste it in `.env.local`

**Example:**
```env
BREVO_API_KEY=xkeysib-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

### 2. BREVO_FROM_EMAIL

- This is the email address that will appear as the sender
- **Must be verified in Brevo**

**How to verify:**
1. Go to [Brevo Senders](https://app.brevo.com/senders/domain/list)
2. Add your email address
3. Complete the verification process

**Example:**
```env
BREVO_FROM_EMAIL=gil.hameever@gmail.com
```

### 3. BREVO_FROM_NAME

- The name that recipients will see as the sender
- Can be in Hebrew
- This is what appears in the email client

**Example:**
```env
BREVO_FROM_NAME=מנופאוזית וטוב לה
```

## Creating Your .env.local File

1. Create a new file in the root of your project:
```bash
touch .env.local
```

2. Add the variables:
```bash
echo "BREVO_API_KEY=your_actual_key_here" >> .env.local
echo "BREVO_FROM_EMAIL=your_email@example.com" >> .env.local
echo "BREVO_FROM_NAME=Your Sender Name" >> .env.local
```

3. Restart your development server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Security Notes

⚠️ **NEVER commit `.env.local` to git!**

The file should already be in `.gitignore`, but double-check:

```bash
# Check if .env.local is ignored
git check-ignore .env.local
# Should return: .env.local
```

If it's not ignored, add it to `.gitignore`:
```
.env.local
.env*.local
```

## Testing Your Configuration

After setting up the environment variables, test the configuration:

1. Start the dev server:
```bash
npm run dev
```

2. Navigate to:
```
http://localhost:3000/lead-gift-8
```

3. Fill out the form and submit

4. Check the server logs in your terminal for:
```
✅ Brevo contact created/updated successfully
✅ Brevo email sent successfully
```

If you see errors, check the troubleshooting section in `LEAD_MAGNET_GUIDE.md`.

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables in your hosting platform's dashboard
2. Make sure NOT to include them in your repository
3. Restart/redeploy your application after adding them

### Vercel Example:
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable:
   - Name: `BREVO_API_KEY`
   - Value: `your_key_here`
   - Environment: Production, Preview, Development
4. Save and redeploy

---

Need help? Check the [Brevo API Documentation](https://developers.brevo.com/docs)

