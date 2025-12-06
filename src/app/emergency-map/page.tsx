/**
 * ========================================
 * EMERGENCY MAP - GIFT PAGE
 * מפת החירום - דף המתנה
 * ========================================
 * 
 * This page is linked from the welcome email
 * sent to users who sign up via lead-gift-8
 */

'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import '@/styles/waitlist.css';

export default function EmergencyMapPage() {
  // Form state for inspiration waves subscription
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [consent, setConsent] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!consent) {
      setError('יש לאשר את תנאי ההרשמה');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/inspiration-waves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'שגיאה בשליחת הטופס');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err.message || 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="waitlist-landing">
      {/* Hero Section */}
      <section className="waitlist-hero">
        <div className="hero-content">
          <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.5rem)' }}>
            🌸 מפת החירום:
            <br />
            מה לעזאזל קורה לי?
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container">
        {/* Subtitle */}
        <p style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(1.125rem, 2.5vw, 1.3rem)',
          fontWeight: '600',
          marginBottom: 'clamp(16px, 3vw, 24px)',
          lineHeight: '1.6'
        }}>
          המדריך שיעשה לך סוף־סוף סדר בראש, בגוף ובנשמה - ב־10 דקות בלבד שיחזירו לך שליטה
        </p>

        <p style={{ 
          textAlign: 'center', 
          fontSize: 'clamp(0.9375rem, 2.2vw, 1.0625rem)',
          color: 'var(--gray)',
          marginBottom: 'clamp(40px, 7vw, 60px)'
        }}>
          מאת ענבל דפנה | גיל המעֵבֶר
        </p>

        {/* Opening Message */}
        <div className="content-box" style={{
          background: 'linear-gradient(135deg, rgba(255, 242, 250, 0.5) 0%, rgba(255, 235, 248, 0.3) 100%)'
        }}>
          <p style={{ fontSize: 'clamp(1.25rem, 2.8vw, 1.5rem)', fontWeight: '700' }}>
            👋 קודם כל - את לא משתגעת.
          </p>
          
          <p>
            את פשוט נכנסת לשלב שהגוף, המוח והנפש עוברים "רילוקיישן הורמונלי", אבל אף אחד לא טרח להסביר לך את זה.
          </p>

          <p style={{ fontWeight: '600' }}>
            הבלבול שלך?
          </p>

          <p>הוא רגיל.</p>
          <p>הוא שכיח.</p>
          <p>והוא פתיר.</p>

          <p style={{ 
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', 
            fontWeight: '700',
            marginTop: '24px' 
          }}>
            זו המפה שתיתן לך שליטה בחזרה כבר היום.
          </p>

          <p>בלי דרמה.</p>
          <p>בלי מילים גבוהות.</p>
          <p>בלי "תתמודדי".</p>

          <p style={{ marginTop: '20px' }}>
            רק אמת, עזרה, חמלה, ועליזה אחת בצד, שתשחרר חיוך כשצריך.
          </p>
        </div>

        {/* Self Check Section */}
        <div className="content-box">
          <h3>🩺 בדקי את עצמך</h3>
          
          <p style={{ fontWeight: '600' }}>
            הנה 10 הסימנים הכי נפוצים שאף אחד לא מספר עליהם, אבל כמעט כל אישה חווה.
          </p>

          <p style={{ marginTop: '20px', marginBottom: '24px' }}>
            האם חווית בחודש האחרון אחד או יותר מהבאים?
          </p>

          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ לילות טרופי שינה / הזעות</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ עייפות שלא עוברת גם אחרי מנוחה</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ עלייה במשקל למרות אותו אורח חיים</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ רגישות רגשית חריגה (בכי/כעס בלי סיבה ברורה)</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ ירידה בחשק המיני או כאב ביחסים</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ יובש בנרתיק / בעור</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ ערפל מוחי / ירידה בזיכרון</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ קפיצות דופק</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ כאבי מפרקים</li>
            <li style={{ marginBottom: '16px', paddingRight: '0' }}>❑ תחושת "אני לא אני"</li>
          </ul>

          <div style={{ 
            background: 'rgba(255, 0, 128, 0.05)', 
            padding: 'clamp(20px, 4vw, 28px)',
            borderRadius: '16px',
            borderRight: '4px solid var(--magenta)'
          }}>
            <p style={{ marginBottom: '12px' }}>
              <strong>אם סימנת 2–3 סימנים →</strong> זו כניסה לפרימנופאוזה.
            </p>
            <p>
              <strong>אם סימנת 4 ומעלה →</strong> זוהי פרימנופאוזה פעילה/מנופאוזה.
            </p>
          </div>

          <p style={{ 
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            fontWeight: '700',
            marginTop: '28px',
            textAlign: 'center'
          }}>
            תנשמי. זה לא הסוף - <span className="highlight">זו התחלה חדשה</span>.
          </p>
        </div>

        {/* Emergency Map - 5 Situations */}
        <div className="content-box" style={{
          background: 'linear-gradient(135deg, rgba(255, 242, 250, 0.5) 0%, rgba(255, 235, 248, 0.3) 100%)'
        }}>
          <h2 style={{ textAlign: 'center' }}>
            🗺️ מפת חירום - 5 מצבים שכל אישה חייבת להבין
          </h2>
        </div>

        {/* Situation 1 - Sleep */}
        <div className="content-box">
          <h3>1) 🌙 לילה בלי שינה + גלי חום</h3>
          
          <p style={{ fontWeight: '600', color: 'var(--magenta)' }}>
            למה זה קורה?
          </p>
          <p>
            האסטרוגן מנהל את מרכז החום והעוררות במוח. כשהוא יורד - הוויסות משתבש.
          </p>
          <p style={{ fontStyle: 'italic' }}>
            זה לא "עצבים". זו ביולוגיה.
          </p>

          <p style={{ fontWeight: '600', color: 'var(--magenta)', marginTop: '24px' }}>
            מה עושים עכשיו:
          </p>
          <ul>
            <li>הורידי את הטמפרטורה בחדר ל־18–20°</li>
            <li>המנעי מאלכוהול/קפה אחרי 16:00</li>
            <li>מקלחת פושרת לפני שינה</li>
            <li>מגבת קטנה רטובה ליד המיטה</li>
            <li>3 דקות נשימת 4–7–8</li>
            <li>ואם זה מחמיר - שווה לבדוק טיפול הורמונלי / תחליפי שינה עדינים</li>
          </ul>

          <div style={{ 
            background: '#FFF9E6',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: '12px',
            marginTop: '20px',
            borderRight: '3px solid #FFD700'
          }}>
            <p style={{ fontStyle: 'italic', margin: 0 }}>
              <strong>עליזה אומרת:</strong><br />
              "אם הזעת בלילה עד כדי החלפת מצעים ב-03:00 - מגיע לך מדליית הלוהטת 🔥🏅."
            </p>
          </div>
        </div>

        {/* Situation 2 - Brain Fog */}
        <div className="content-box">
          <h3>2) 😵‍💫 ערפל מוחי / שכחה / חוסר ריכוז</h3>
          
          <p style={{ fontWeight: '600', color: 'var(--magenta)' }}>
            למה זה קורה?
          </p>
          <p>
            האסטרוגן משפיע על התקשרות נוירונים, זיכרון וריכוז. שינוי הורמונלי → הפרעה זמנית.
          </p>
          <p style={{ fontStyle: 'italic' }}>
            לא דמנציה. לא ירידה קוגניטיבית. ערפל הורמונלי.
          </p>

          <p style={{ fontWeight: '600', color: 'var(--magenta)', marginTop: '24px' }}>
            מה עושים עכשיו:
          </p>
          <ul>
            <li>משימות קצרות בלבד</li>
            <li>בלי ריבוי משימות</li>
            <li>רשימות - על דף, לא בראש</li>
            <li>10 דקות הליכה לפני מטלות חשיבה</li>
            <li>הימנעי ממסכים לפני שינה</li>
          </ul>

          <div style={{ 
            background: '#FFF9E6',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: '12px',
            marginTop: '20px',
            borderRight: '3px solid #FFD700'
          }}>
            <p style={{ fontStyle: 'italic', margin: 0 }}>
              <strong>עליזה אומרת:</strong><br />
              "זה לא ש'אני טיפשה'. זה 'המערכת בהתקנה מחדש'. צריך לתת לה כמה דקות Recovery."
            </p>
          </div>
        </div>

        {/* Situation 3 - Emotional Storms */}
        <div className="content-box">
          <h3>3) 😡😢 סערות רגשיות (כעס/בכי/רגישות)</h3>
          
          <p style={{ fontWeight: '600', color: 'var(--magenta)' }}>
            למה זה קורה?
          </p>
          <p>
            הירידה בהורמונים משפיעה ישירות על סרוטונין ודופמין. זו תגובה כימית - לא אישיותית.
          </p>

          <p style={{ fontWeight: '600', color: 'var(--magenta)', marginTop: '24px' }}>
            מה עושים עכשיו:
          </p>
          <ul>
            <li>כשעולים גלים רגשיים - אל תנסי להיות גיבורה.</li>
            <li>מילה אחת: הפסקה. הרשי לעצמך להתנתק ל־10 דקות.</li>
            <li>שתיית מים (התייבשות מחמירה תנודות רגשיות).</li>
            <li>קחי נשימה עמוקה + כתבי משפט אחד ביומן: "מה אני מרגישה עכשיו?"</li>
            <li>ספרי למישהי אחת מה עובר עלייך. לא לבד.</li>
          </ul>

          <p style={{ 
            background: 'rgba(255, 0, 128, 0.05)',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: '12px',
            marginTop: '20px',
            fontWeight: '600'
          }}>
            המטרה שלי היא אחת: שלא תעברי את זה לבד ולא תשארי במקום של בלבול וחוסר ודאות כמו שאני הייתי.
          </p>

          <div style={{ 
            background: '#FFF9E6',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: '12px',
            marginTop: '20px',
            borderRight: '3px solid #FFD700'
          }}>
            <p style={{ fontStyle: 'italic', margin: 0 }}>
              <strong>עליזה אומרת:</strong><br />
              "אם התעצבנת על בן הזוג כי הוא נושם חזק - את לא משוגעת. את פשוט חיה."
            </p>
          </div>
        </div>

        {/* Situation 4 - Body Changes */}
        <div className="content-box">
          <h3>4) ⚡ הגוף משתנה: בטן, משקל, נפיחות</h3>
          
          <p style={{ fontWeight: '600', color: 'var(--magenta)' }}>
            למה זה קורה?
          </p>
          <p>
            האסטרוגן יורד → חילוף החומרים יורד → שומן מצטבר בבטן → עמידות לאינסולין.
          </p>
          <p style={{ fontStyle: 'italic' }}>
            זה לא עצלנות. זה פיזיולוגיה.
          </p>

          <p style={{ fontWeight: '600', color: 'var(--magenta)', marginTop: '24px' }}>
            מה עושים עכשיו:
          </p>
          <ul>
            <li>איכלי חלבון בכל ארוחה</li>
            <li>10–20 דקות הליכה יומית</li>
            <li>הימנעי מאכילה מאוחרת</li>
            <li>בדיקת B12, ברזל, ויטמין D</li>
            <li>שקלי ייעוץ תזונתי מותאם למנופאוזה</li>
          </ul>

          <div style={{ 
            background: '#FFF9E6',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: '12px',
            marginTop: '20px',
            borderRight: '3px solid #FFD700'
          }}>
            <p style={{ fontStyle: 'italic', margin: 0 }}>
              <strong>עליזה אומרת:</strong><br />
              "הבטן לא יצאה משליטה. היא פשוט התחילה משרה חדשה - מחלקת הורמונים."
            </p>
          </div>
        </div>

        {/* Situation 5 - Sexual Health */}
        <div className="content-box">
          <h3>5) 💔 חשק מיני נמוך / כאב ביחסים</h3>
          
          <p style={{ fontWeight: '600', color: 'var(--magenta)' }}>
            למה זה קורה?
          </p>
          <p>
            יובש נרתיקי → כאב → הימנעות → ירידה בחשק.
            <br />
            גם רגשי, גם הורמונלי, גם ביולוגי.
          </p>

          <p style={{ fontWeight: '600', color: 'var(--magenta)', marginTop: '24px' }}>
            מה עושים עכשיו:
          </p>
          <ul>
            <li>חומר סיכה איכותי = חובה</li>
            <li>דיבור פתוח עם בן/בת הזוג</li>
            <li>בדיקה אצל גניקולוגית המתמחה במנופאוזה</li>
            <li>טיפול הורמונלי מקומי עובד מצוין</li>
            <li>חיבור לגוף: עיסוי, נשימה, מגע לא מיני</li>
          </ul>

          <div style={{ 
            background: '#FFF9E6',
            padding: 'clamp(16px, 3vw, 20px)',
            borderRadius: '12px',
            marginTop: '20px',
            borderRight: '3px solid #FFD700'
          }}>
            <p style={{ fontStyle: 'italic', margin: 0 }}>
              <strong>עליזה אומרת:</strong><br />
              "חשק? קודם תני לגוף שלי לא להישרף מבפנים. פרה-פרה."
            </p>
          </div>
        </div>

        {/* Why It Happens */}
        <div className="content-box" style={{
          background: 'linear-gradient(135deg, rgba(255, 242, 250, 0.5) 0%, rgba(255, 235, 248, 0.3) 100%)'
        }}>
          <h3>🧭 הסבר קצר: למה זה קורה בכלל?</h3>
          
          <p style={{ fontWeight: '600' }}>
            אין פה "משבר גיל".
          </p>

          <p>
            יש פה שינוי הורמונלי רב־מערכתי שמשפיע על:
          </p>

          <ul style={{ columns: '2', columnGap: '20px' }}>
            <li>✔ מערכת העצבים</li>
            <li>✔ ויסות חום</li>
            <li>✔ מצב רוח</li>
            <li>✔ חילוף חומרים</li>
            <li>✔ שינה</li>
            <li>✔ עור</li>
            <li>✔ ליבידו</li>
            <li>✔ זיכרון</li>
            <li>✔ כאב</li>
          </ul>

          <p style={{ 
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            fontWeight: '700',
            marginTop: '28px',
            textAlign: 'center'
          }}>
            ברגע שמבינים את זה,
          </p>
          <p style={{ textAlign: 'center' }}>הפחד יורד.</p>
          <p style={{ textAlign: 'center' }}>האשם נעלם.</p>
          <p style={{ 
            textAlign: 'center',
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            fontWeight: '700'
          }}>
            והבחירה חוזרת לידיים שלך.
          </p>
        </div>

        {/* Action Step */}
        <div className="content-box">
          <h3>💗 צעד אחד שאת יכולה לעשות כבר היום</h3>
          
          <p>
            בחרי תחום אחד מהחמישה - ורק אותו.
          </p>

          <p style={{ fontWeight: '600' }}>
            אל תנסי לטפל בהכל בבת אחת.
          </p>

          <p style={{ fontStyle: 'italic' }}>
            זה מתכון להתשה.
          </p>

          <p style={{ 
            fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
            fontWeight: '700',
            marginTop: '24px',
            textAlign: 'center',
            color: 'var(--magenta)'
          }}>
            "איפה הכי כואב לי כרגע?"
          </p>

          <p style={{ textAlign: 'center', fontWeight: '600' }}>
            התחילי שם.
          </p>
        </div>

        {/* Personal Message */}
        <div className="content-box" style={{
          background: 'linear-gradient(135deg, rgba(255, 242, 250, 0.5) 0%, rgba(255, 235, 248, 0.3) 100%)'
        }}>
          <h3>🤝 את לא לבד. ואני כאן איתך.</h3>
          
          <p>
            אני, ענבל, עברתי בדיוק את מה שאת עוברת.
          </p>

          <p>
            הבלבול, הפחד, ההלם, חוסר השינה, הרגש, הבטן… הכל.
          </p>

          <p style={{ fontWeight: '600' }}>
            ולכן בניתי את המפה הזו - כדי לחסוך ממך שנים של תסכול.
          </p>

          <p style={{ marginTop: '24px' }}>יש דרך.</p>
          <p>יש סדר.</p>
          <p>יש תקווה.</p>
          <p style={{ fontWeight: '700', fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)' }}>
            ויש חיים טובים יותר, כבר עכשיו.
          </p>
        </div>

        {/* Book Teaser */}
        <div className="content-box">
          <h3>🌸 רוצה לקבל את המפה הגדולה והמעשית?</h3>
          
          <p>
            "מפת הדרכים למנופאוזית המתחילה" היא הגרסה המלאה - כולל כלים, תרגילים וצעדים ליישום.
          </p>

          <p style={{ fontWeight: '600' }}>
            המפה היא חלק מהספר שלי שעומד לצאת בקרוב ואני כל כך מתרגשת. אשתף אותך כשזה יקרה.
          </p>

          <p>
            יש דברים מרגשים בדרך, ואני מבטיחה שתרגישי שאת חלק מהם.
          </p>

          <p style={{ textAlign: 'center', fontWeight: '600', marginTop: '24px' }}>
            Stay tuned 🥰
          </p>

          <p style={{ textAlign: 'center', fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)', fontWeight: '700' }}>
            ענבל
          </p>
        </div>

        {/* Final Quote */}
        <div className="thank-you-card">
          <div style={{ 
            background: '#FFF9E6',
            padding: 'clamp(24px, 5vw, 32px)',
            borderRadius: '16px',
            border: '3px solid #FFD700'
          }}>
            <p style={{ fontStyle: 'italic', fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)' }}>
              <strong>עליזה אומרת לסיום:</strong>
            </p>
            <p style={{ 
              fontSize: 'clamp(1.25rem, 2.8vw, 1.5rem)', 
              fontWeight: '700',
              marginTop: '16px',
              lineHeight: '1.5'
            }}>
              "מאמי, את לא 'בגיל הבלות'.
              <br />
              את בגיל הבלוּם (Bloom) <span className="highlight">גיל הפריחה</span>. 🌺
            </p>
            <p style={{ fontStyle: 'italic', marginTop: '16px' }}>
              אני רק פה להזכיר לך."
            </p>
          </div>

          <p style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            marginTop: 'clamp(32px, 6vw, 48px)',
            marginBottom: 0
          }}>
            ❤️
          </p>
        </div>

        {/* Inspiration Waves Subscription Form */}
        <div className="waitlist-form-section" style={{ marginTop: 'clamp(60px, 10vw, 80px)' }}>
          <div className="waitlist-form-container">
            <div className="waitlist-form-wrapper">
              {!isSubmitted ? (
                <>
                  <h2 className="waitlist-form-title">
                    הזמנה אישית לרשימת תפוצה של גלי ההשראה:
                  </h2>
                  <p className="waitlist-form-subtitle">
                    הכניסי את הפרטים כאן למטה והצטרפי לגלי ההשראה
                  </p>

                  {error && (
                    <div className="waitlist-form-error">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="waitlist-form-form">
                    <div className="waitlist-form-group">
                      <input
                        type="text"
                        id="emergency-map-firstName"
                        name="firstName"
                        placeholder="שם"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                        disabled={isSubmitting}
                        autoComplete="given-name"
                      />
                    </div>

                    <div className="waitlist-form-group">
                      <input
                        type="text"
                        id="emergency-map-lastName"
                        name="lastName"
                        placeholder="שם משפחה"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                        disabled={isSubmitting}
                        autoComplete="family-name"
                      />
                    </div>

                    <div className="waitlist-form-group">
                      <input
                        type="email"
                        id="emergency-map-email"
                        name="email"
                        placeholder="אימייל"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isSubmitting}
                        autoComplete="email"
                      />
                    </div>

                    <div className="waitlist-form-consent">
                      <label className="waitlist-consent-label">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          required
                          disabled={isSubmitting}
                        />
                        <span className="waitlist-consent-text">
                          אני מאשרת להצטרף לגלי ההשראה ולקבל עדכונים, כלים מעשיים ומסרים מעצימים.
                        </span>
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      className="waitlist-form-submit-button"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'מצטרפת...' : 'אני רוצה להצטרף לגלי ההשראה'}
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ 
                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)', 
                    fontWeight: '700', 
                    color: 'white',
                    marginBottom: '16px'
                  }}>
                    🎉 תודה שהצטרפת!
                  </p>
                  <p style={{ 
                    fontSize: '1rem', 
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.6'
                  }}>
                    נשלח לך אימייל אישור. נתראה בגלי ההשראה! 💜
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: 'clamp(40px, 7vw, 60px)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="cta-button" style={{ minWidth: '280px' }}>
              🌸 חזרה לאתר
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

