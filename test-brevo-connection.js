/**
 * 🧪 Brevo Connection Test Script
 * ================================
 * סקריפט פשוט לבדיקת החיבור ל-Brevo
 * 
 * איך להריץ:
 * -----------
 * node test-brevo-connection.js
 * 
 * מה זה בודק:
 * -----------
 * ✓ קיום API Key
 * ✓ תקינות API Key
 * ✓ חיבור ל-Brevo
 * ✓ כמה Contacts יש לך
 */

require('dotenv').config({ path: '.env.local' });
const brevo = require('@getbrevo/brevo');

async function testBrevoConnection() {
  console.log('\n🔍 בודק חיבור ל-Brevo...\n');
  console.log('═'.repeat(50));

  // Step 1: בדיקת קיום API Key
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.log('❌ BREVO_API_KEY לא מוגדר!');
    console.log('\n📝 הוראות:');
    console.log('1. צרי קובץ .env.local');
    console.log('2. הוסיפי: BREVO_API_KEY=xkeysib-...');
    console.log('3. הריצי את הסקריפט שוב\n');
    return;
  }

  console.log('✅ BREVO_API_KEY נמצא');
  console.log(`   Key מתחיל ב: ${apiKey.substring(0, 15)}...`);

  // Step 2: בדיקת פורמט
  if (!apiKey.startsWith('xkeysib-')) {
    console.log('⚠️  אזהרה: ה-API Key לא מתחיל ב-xkeysib-');
    console.log('   האם העתקת את כל המפתח?\n');
  }

  // Step 3: ניסיון חיבור
  console.log('\n🔌 מנסה להתחבר ל-Brevo...');
  
  try {
    const apiInstance = new brevo.ContactsApi();
    apiInstance.setApiKey(brevo.ContactsApiApiKeys.apiKey, apiKey);

    // מנסה לקבל את כמות ה-Contacts
    const result = await apiInstance.getContacts({ limit: 1 });
    
    console.log('✅ החיבור ל-Brevo הצליח!');
    console.log(`\n📊 סטטיסטיקות:`);
    console.log(`   יש לך ${result.count || 0} Contacts ב-Brevo`);
    
    // בדיקת List ID אם קיים
    const listId = process.env.BREVO_LIST_ID;
    if (listId) {
      console.log(`\n📋 List ID מוגדר: ${listId}`);
      
      try {
        const listsApi = new brevo.ContactsApi();
        listsApi.setApiKey(brevo.ContactsApiApiKeys.apiKey, apiKey);
        const listInfo = await listsApi.getList(parseInt(listId));
        console.log(`   שם הרשימה: "${listInfo.name}"`);
        console.log(`   Contacts ברשימה: ${listInfo.totalSubscribers || 0}`);
      } catch (err) {
        console.log(`   ⚠️  לא הצלחתי למצוא רשימה עם ID: ${listId}`);
      }
    } else {
      console.log('\n📋 List ID לא מוגדר (זה בסדר!)');
      console.log('   Contacts יתווספו לרשימת ה-Contacts הכללית');
    }

    console.log('\n' + '═'.repeat(50));
    console.log('✨ הכל מוכן! הטופס יכול לשלוח ל-Brevo');
    console.log('═'.repeat(50) + '\n');

  } catch (error) {
    console.log('\n❌ שגיאה בחיבור ל-Brevo:');
    
    if (error.response?.statusCode === 401) {
      console.log('   ה-API Key לא תקין!');
      console.log('\n📝 בדקי:');
      console.log('   1. שהעתקת את כל המפתח (כולל xkeysib-)');
      console.log('   2. שהמפתח פעיל ב-Brevo');
      console.log('   3. שאין רווחים בתחילת או בסוף המפתח\n');
    } else {
      console.log(`   ${error.message}`);
      if (error.response?.body) {
        console.log('\nפרטים נוספים:');
        console.log(JSON.stringify(error.response.body, null, 2));
      }
    }
    console.log('');
  }
}

// הרצה
testBrevoConnection().catch(err => {
  console.error('\n💥 שגיאה בלתי צפויה:', err.message);
  console.log('');
});



