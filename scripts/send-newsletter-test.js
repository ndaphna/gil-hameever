/**
 * Script לשליחת בדיקת ניוזלטר למשתמשות
 */

const https = require('https');
const http = require('http');

// קבל את ה-URL מה-env או השתמש ב-default
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                'http://localhost:3000';

const url = `${baseUrl}/api/notifications/send-newsletter-test-now`;
const cronSecret = process.env.CRON_SECRET;

console.log('📧 Sending newsletter test...');
console.log('URL:', url);

const urlObj = new URL(url);
const options = {
  hostname: urlObj.hostname,
  port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
  path: urlObj.pathname + urlObj.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(cronSecret ? { 'Authorization': `Bearer ${cronSecret}` } : {})
  }
};

const client = urlObj.protocol === 'https:' ? https : http;

const req = client.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n✅ Newsletter test result:');
      console.log(JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log(`\n📊 Summary:`);
        console.log(`   Processed: ${result.processed || 0}`);
        console.log(`   Sent: ${result.sent || 0}`);
        console.log(`   Skipped: ${result.skipped || 0}`);
        if (result.errors && result.errors.length > 0) {
          console.log(`   Errors: ${result.errors.length}`);
        }
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  if (error.code === 'ECONNREFUSED') {
    console.error('\n⚠️  Server is not running. Please start the server first:');
    console.error('   npm run dev');
  }
});

req.end();

