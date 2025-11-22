# 📧 Brevo Integration Setup Guide

## Quick Start

To enable Brevo integration for the waitlist, add these variables to your `.env.local` file:

```bash
# Required
BREVO_API_KEY=your_brevo_api_key_here
BREVO_FROM_EMAIL=gil.hameever@gmail.com
BREVO_FROM_NAME=מנופאוזית וטוב לה

# Optional (but recommended)
BREVO_LIST_ID_WAITLIST=123
```

## Step-by-Step Setup

### 1. Get Your Brevo API Key

1. Log in to Brevo: https://app.brevo.com
2. Go to **Settings** → **SMTP & API** → **API Keys**
3. Click **"Create a new API key"**
4. Give it a name (e.g., "Waitlist API")
5. Select **v3** (not v2)
6. Copy the API key
7. Add to `.env.local`:
   ```bash
   BREVO_API_KEY=xkeysib-your_key_here
   ```

### 2. Verify Your Sender Email

⚠️ **Important**: Brevo will NOT send emails from unverified addresses!

1. Go to **Settings** → **Senders & IP**
2. Click **"Add a new sender"**
3. Enter `gil.hameever@gmail.com`
4. Brevo will send a verification email to that address
5. Click the verification link in the email
6. Once verified, add to `.env.local`:
   ```bash
   BREVO_FROM_EMAIL=gil.hameever@gmail.com
   BREVO_FROM_NAME=מנופאוזית וטוב לה
   ```

### 3. Get Your List ID (Optional but Recommended)

Adding contacts to a specific list makes it easier to manage and segment your audience.

1. Go to **Contacts** → **Lists**
2. Create a new list called "Waitlist" (if you don't have one)
3. Click on the list
4. Look at the URL in your browser:
   ```
   https://app.brevo.com/contact/list/id:123
                                        ^^^
                                     This is your List ID
   ```
5. Add to `.env.local`:
   ```bash
   BREVO_LIST_ID_WAITLIST=123
   ```

### 4. Restart Your Dev Server

After adding the environment variables:

```bash
npm run dev
```

Or if using another command, stop and restart it.

## Testing

### Test 1: Submit the Form

1. Go to http://localhost:3000/waitlist
2. Fill in the form with a test email
3. Submit
4. Check the **server console** (where you ran `npm run dev`) for detailed logs

### Test 2: Check Brevo Dashboard

1. Go to Brevo → **Contacts** → **All Contacts**
2. Your test contact should appear
3. Go to **Email** → **Statistics**
4. Your welcome email should appear in the sent emails

### Test 3: Check Your Email

Check the inbox of the email you used to test. You should receive the welcome email.

## Troubleshooting

### Issue: No logs appearing

**Problem**: You don't see any Brevo logs in the console.

**Solution**: Make sure you're looking at the **server console** (terminal where you ran `npm run dev`), not the browser console.

### Issue: "BREVO_API_KEY not configured"

**Problem**: API key is missing or not loaded.

**Solutions**:
1. Check that `.env.local` exists in the root directory (next to `package.json`)
2. Verify the variable name is exactly `BREVO_API_KEY` (no typos)
3. Restart the dev server after adding the variable

### Issue: Emails not sending

**Problem**: Contacts are added to Brevo but emails aren't sent.

**Possible causes**:
1. **Sender email not verified** → Go to Settings → Senders & IP and verify
2. **Invalid API key** → Generate a new one
3. **Brevo account issue** → Check for quota limits, suspension, or payment issues
4. **Wrong "from" email** → Must match a verified sender

**Debug**: Check the server console for error messages from Brevo API.

### Issue: "duplicate_parameter" error

**Problem**: Brevo returns an error saying the contact already exists.

**Solution**: This is actually **not a problem**! The API handles this gracefully. The contact already exists in Brevo, which is fine.

### Issue: Contact not added to list

**Problem**: Contact appears in Brevo but not in your list.

**Solutions**:
1. Check that `BREVO_LIST_ID_WAITLIST` is set
2. Verify the list ID is correct (numeric only, no spaces or quotes)
3. Make sure the list exists in Brevo

## Detailed Logs

When everything is configured correctly, you'll see logs like this:

```
============================================================
📥 API: /api/waitlist called
============================================================
📥 Request data: { name: 'Test User', email: '***@example.com' }
✅ Input validation passed
🔍 Checking if email already exists in database...
✅ Email is new
💾 Inserting into database...
✅ Database insert successful: { id: '...' }
📧 Adding contact to Brevo...
🔑 Checking Brevo configuration...
   BREVO_API_KEY: ✅ Set
   BREVO_FROM_EMAIL: gil.hameever@gmail.com
   BREVO_FROM_NAME: מנופאוזית וטוב לה
   BREVO_LIST_ID_WAITLIST: 123
📧 Step 1/2: Creating/updating contact in Brevo...
📤 Brevo contact payload: { email: '...', attributes: { FIRSTNAME: '...' }, listIds: [123] }
📥 Brevo contact response status: 201
✅ Brevo contact created/updated successfully
   Contact ID: 12345
📧 Step 2/2: Sending welcome email via Brevo...
📤 Sending email from: מנופאוזית וטוב לה <gil.hameever@gmail.com>
   To: test@example.com
📥 Brevo email response status: 201
✅ Welcome email sent successfully
   Message ID: abc123
✅ Contact added to Brevo successfully
✅ Waitlist signup complete!
============================================================
```

## API Documentation

For more details, see:
- **Waitlist API README**: `src/app/api/waitlist/README.md`
- **Brevo API Docs**: https://developers.brevo.com/

## Need Help?

If you're still having issues:
1. Check the server console logs carefully
2. Verify all environment variables are set correctly
3. Test with a simple cURL command (see API README)
4. Check your Brevo account for any issues or alerts

