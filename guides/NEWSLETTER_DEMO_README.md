# Newsletter Demo API Endpoint

## Overview

This endpoint sends a personalized newsletter to a specific user for testing purposes.

## Endpoint

```
POST /api/notifications/send-newsletter-demo
```

## Request Body

```json
{
  "email": "user@example.com",
  "force": true
}
```

### Parameters

- **email** (required): The email address of the user to send the newsletter to
- **force** (optional): If `true`, sends even if user is not subscribed (default: `false`)

## Response

### Success (200)

```json
{
  "success": true,
  "sent": true,
  "userId": "user-uuid",
  "email": "user@example.com",
  "userName": "User Name",
  "insight": {
    "type": "encouragement",
    "title": "Newsletter title"
  },
  "message": "Newsletter sent successfully!"
}
```

### Error (404) - User Not Found

```json
{
  "error": "User not found",
  "message": "User with email user@example.com not found. Please ensure the user has signed up first."
}
```

### Error (500) - Send Failed

```json
{
  "success": false,
  "sent": false,
  "reason": "Email sending failed",
  "message": "Failed to send email. Please check email service configuration."
}
```

## Environment Variables

Required in `.env.local`:

```bash
# Brevo API Configuration
BREVO_API_KEY=xkeysib-your_api_key_here
BREVO_FROM_EMAIL=newsletter@gilhameever.com
BREVO_FROM_NAME=עליזה - מנופאוזית וטוב לה
```

## How It Works

1. **Find User**: Looks up user by email in the database
2. **Generate Insight**: Creates a personalized insight based on user's data
3. **Create Email**: Generates HTML and text versions of the email
4. **Send via Brevo**: Sends the email using Brevo API
5. **Save History**: Records the notification in the database

## Newsletter Content

The newsletter content is personalized based on the user's data:

- **Users with data**: Receives insights based on their journal entries
- **New users**: Receives an encouraging message to start tracking
- **No data**: Receives a general welcome message

## Testing

### Using cURL

```bash
curl -X POST http://localhost:3000/api/notifications/send-newsletter-demo \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","force":true}'
```

### Using the Test Page

Navigate to: **http://localhost:3000/test-newsletter**

The test page provides a UI to:
- Send to a custom email address
- View all registered users
- Send to specific users with one click
- See send results in real-time

## Debugging

The endpoint includes extensive server-side logging. Check the server console (terminal where `npm run dev` is running) to see:

```
============================================================
📧 Sending newsletter email via Brevo
============================================================
🔑 Checking Brevo configuration...
   BREVO_API_KEY: ✅ Set
   BREVO_FROM_EMAIL: newsletter@gilhameever.com
   BREVO_FROM_NAME: עליזה - מנופאוזית וטוב לה
📤 Sending email:
   From: עליזה - מנופאוזית וטוב לה <newsletter@gilhameever.com>
   To: user@example.com
   Subject: ✨ עדכון חדש עבורך מעליזה
   ...
✅ Newsletter demo sent via Brevo successfully!
   Message ID: abc123
============================================================
```

## Common Issues

### Issue: "BREVO_API_KEY: ❌ Missing"

**Solution**: Add `BREVO_API_KEY` to `.env.local` and restart the server.

### Issue: "401 Unauthorized" from Brevo

**Solution**: 
1. Verify your API key is correct
2. Check that it's a v3 key (not v2)
3. Generate a new key if needed

### Issue: "400 Bad Request - sender not authorized"

**Solution**: 
1. Go to Brevo → Settings → Senders & IP
2. Verify that your sender email is authorized
3. Check for verification email and click the link

### Issue: Email not received

**Checks**:
1. Check spam folder
2. Verify in Brevo Dashboard that email was sent
3. Confirm sender email is verified in Brevo
4. Check Brevo account quota/limits

## Related Files

- **Email Templates**: `src/lib/email-templates.ts`
- **Notification Service**: `src/lib/smart-notification-service.ts`
- **Test Page**: `src/app/test-newsletter/page.tsx`

## See Also

- [Newsletter Test Guide](../../../../../NEWSLETTER_TEST_GUIDE.md)
- [Brevo Setup Guide](../../../../../BREVO_SETUP_GUIDE.md)
- [Brevo API Docs](https://developers.brevo.com)

