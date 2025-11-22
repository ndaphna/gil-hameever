# Waitlist API Route - Brevo Integration

## Overview

This API route (`/api/waitlist`) handles waitlist signups by:
1. Validating the user's name and email
2. Saving the contact to the `early_adopters` table in Supabase
3. Adding the contact to Brevo (Sendinblue) and sending a welcome email

## Environment Variables

Add these to your `.env.local` file:

### Required

```bash
# Brevo API Key (required for Brevo integration)
BREVO_API_KEY=your_brevo_api_key_here

# From email and name for welcome emails
BREVO_FROM_EMAIL=gil.hameever@gmail.com
BREVO_FROM_NAME=מנופאוזית וטוב לה
```

### Optional

```bash
# Brevo list ID for the waitlist (numeric)
# If set, contacts will be automatically added to this list
BREVO_LIST_ID_WAITLIST=123
```

## Getting Your Brevo Credentials

1. **Log in to Brevo**: https://app.brevo.com
2. **Get API Key**:
   - Go to Settings → SMTP & API → API Keys
   - Create a new API key (v3)
   - Copy the key and add it to `BREVO_API_KEY`

3. **Get List ID** (optional):
   - Go to Contacts → Lists
   - Click on your "Waitlist" list
   - The URL will show the list ID: `https://app.brevo.com/contact/list/id:123`
   - Copy the number and add it to `BREVO_LIST_ID_WAITLIST`

4. **Verify Sender Email**:
   - Go to Settings → Senders & IP
   - Add and verify your sender email (`gil.hameever@gmail.com`)
   - Without verification, emails won't send!

## API Request

### Endpoint
```
POST /api/waitlist
```

### Request Body
```json
{
  "name": "User Name",
  "email": "user@example.com"
}
```

### Success Response (200)
```json
{
  "success": true,
  "message": "ההרשמה בוצעה בהצלחה!",
  "data": {
    "id": "uuid-here",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

### Error Responses

**Missing fields (400)**
```json
{
  "success": false,
  "error": "שם ואימייל הם שדות חובה"
}
```

**Invalid email (400)**
```json
{
  "success": false,
  "error": "כתובת אימייל לא תקינה"
}
```

**Duplicate email (409)**
```json
{
  "success": false,
  "error": "כתובת המייל כבר רשומה ברשימת ההמתנה"
}
```

**Server error (500)**
```json
{
  "success": false,
  "error": "שגיאה בשליחת הטופס. נסי שוב מאוחר יותר."
}
```

## Debugging

The API route includes extensive server-side logging. When a signup occurs, you'll see:

```
============================================================
📥 API: /api/waitlist called
============================================================
📥 Request data: { name: '...', email: '***@example.com' }
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
📤 Brevo contact payload: { ... }
📥 Brevo contact response status: 201
✅ Brevo contact created/updated successfully
   Contact ID: 12345
📧 Step 2/2: Sending welcome email via Brevo...
📤 Sending email from: מנופאוזית וטוב לה <gil.hameever@gmail.com>
   To: user@example.com
📥 Brevo email response status: 201
✅ Welcome email sent successfully
   Message ID: abc123
✅ Contact added to Brevo successfully
✅ Waitlist signup complete!
============================================================
```

## Testing

### Using cURL

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### Using the Browser Console

```javascript
fetch('/api/waitlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test User', email: 'test@example.com' })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Common Issues

### Issue: "BREVO_API_KEY not configured"
**Solution**: Add `BREVO_API_KEY` to your `.env.local` file and restart the dev server.

### Issue: Emails not sending
**Causes**:
1. Sender email not verified in Brevo
2. Invalid API key
3. Brevo account issues (quota, suspension, etc.)

**Debug**: Check the server console logs for detailed Brevo API error messages.

### Issue: "duplicate_parameter" error from Brevo
**Note**: This is actually fine! It means the contact already exists in Brevo. The API will update the existing contact instead.

### Issue: Contact not added to list
**Causes**:
1. `BREVO_LIST_ID_WAITLIST` not set or incorrect
2. List doesn't exist in Brevo
3. List ID is not a valid number

**Solution**: 
1. Go to Brevo → Contacts → Lists
2. Find your list ID from the URL
3. Add it to `.env.local` as a number (no quotes)

## Brevo API Documentation

- Contacts API: https://developers.brevo.com/reference/createcontact
- Email API: https://developers.brevo.com/reference/sendtransacemail

