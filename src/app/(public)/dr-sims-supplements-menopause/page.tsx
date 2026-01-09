'use client';

import Link from 'next/link';
import '../preparing-for-menopause/article.css';

export default function DrSimsSupplementsMenopausePage() {
  return (
    <div className="article-page">
      <div className="article-container">
        {/* Breadcrumbs */}
        <nav className="article-breadcrumbs" aria-label="ניווט דרך">
          <Link href="/" className="breadcrumb-link">דף הבית</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href="/articles" className="breadcrumb-link">מאמרים</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">התוספים שד"ר סימס ממליצה</span>
        </nav>

        {/* Title Section */}
        <header className="article-header">
          <h1 className="article-title">
            התוספים שד"ר סימס ממליצה
            <br />
            <span style={{ fontSize: '0.85em', fontWeight: 'normal' }}>(רמז: קריאטין זה לא רק לבריוני חדר כושר)</span>
          </h1>
        </header>

        {/* Main Content Section - Image and Text Side by Side */}
        <section className="article-content-wrapper">
          <div className="article-image-container">
            <img 
              src="https://i.imghippo.com/files/tsx6749psc.png" 
              alt="תוספים שד״ר סימס ממליצה לנשים בגיל המעבר"
              className="article-image"
            />
          </div>
          
          <div className="article-text-content">
            <div className="article-intro">
              <p>אחרי שסיכמנו שאת הולכת להרים דברים כבדים ולהפסיק לפחד מחלבון, הגיע הזמן לדבר על ה"עזרים הטקטיים".</p>
              
              <p>תשמעי, אם פעם "תוספים" נשמע לנו כמו משהו ששייך לבחורים מיוזעים בחדר כושר עם גופיות חסרות בד, ד"ר סטייסי סימס עושה לנו סדר. בגיל 50+, תוספים הם לא פינוק - הם פשוט הדרך שלנו לתת לגוף את חומרי הגלם שהוא כבר לא מייצר בעצמו.</p>
              
              <p>עליזה שנקין כבר פתחה את הארנק ושאלה: "תגידי, כל הכדורים האלה... זה עוזר גם נגד זה ששכחתי איפה החניתי את האוטו, או שזה רק כדי שאני אראה טוב בטייץ?".</p>
              
              <p>אז עליזה, התשובה היא גם וגם. בואי נצלול.</p>
            </div>
          </div>
        </section>

        {/* Full Width Content Section - Continues Below Image */}
        <section className="article-full-content">
          <h2>1. קריאטין: לא רק למפתחי גוף (באמת!)</h2>
          
          <p>זה התוסף הכי חשוב שאת כנראה לא לוקחת. ד"ר סימס טוענת שזה תוסף קריטי לנשים בגיל המעבר. הוא עוזר לשריר, אבל בעיקר - הוא עוזר למוח. הוא נלחם ב"ערפל המוחי" המעצבן הזה שגורם לך לעמוד במטבח ולשאול את עצמך "למה באתי לפה?".</p>
          
          <p>עליזה: "קריאטין? זה לא מה שהופך אותך למקרר עם שרירים? אני רוצה לעבור בדלת של הבית, לא להוריד אותה מהצירים".</p>
          
          <p>ממש לא. במינון הנכון (3-5 גרם), הוא לא מנפח. הוא פשוט נותן תמיכה קוגניטיבית ובריאות לעצם.</p>
          
          <h2>2. מגנזיום גליצינאט: כדור השינה של הטבע</h2>
          
          <p>אם את מתעוררת בשלוש בבוקר ומתחילה לחשוב על חשבון החשמל מ-1998, את צריכה מגנזיום. אבל לא סתם מגנזיום - גליצינאט. הוא נספג מעולה, מרפה שרירים ועוזר לשינה עמוקה בלי תופעות לוואי במערכת העיכול.</p>
          
          <h2>3. אשווגנדה: הבלם של הקורטיזול</h2>
          
          <p>הקורטיזול (הורמון הסטרס) הוא האויב מספר 1 של הבטן שלנו בגיל המעבר. האשווגנדה היא צמח "אדפטוגני" שעוזר לגוף להירגע. היא אומרת למערכת שלך: "הכל בסדר, אין נמר בחדר, אפשר להוריד דופק".</p>
          
          <h2>4. ויטמין D3 + K2: השומרים של העצם</h2>
          
          <p>בגיל המעבר, העצמות שלנו הופכות לנושא רגיש. D3 עוזר לספוג סידן, ו-K2 הוא ה"שוטר" שמכוון את הסידן לעצמות ולא לעורקים שלך. הם חייבים לעבוד ביחד.</p>
          
          <h2>רשימת הקניות המהירה שלך (The Cheat Sheet)</h2>
          
          <div style={{ overflowX: 'auto', margin: '2rem 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>תוסף</th>
                  <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>למה את צריכה אותו?</th>
                  <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #ddd' }}>מתי לוקחים?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '1rem', border: '1px solid #ddd', fontWeight: 'bold' }}>קריאטין מונוהידראט</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>חדות מנטלית וכוח שריר</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>כל בוקר (3-5 גרם)</td>
                </tr>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '1rem', border: '1px solid #ddd', fontWeight: 'bold' }}>מגנזיום גליצינאט</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>שינה והרפיית שרירים</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>חצי שעה לפני השינה</td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', border: '1px solid #ddd', fontWeight: 'bold' }}>אומגה 3</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>דלקתיות ובריאות המוח</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>עם ארוחה שומנית</td>
                </tr>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <td style={{ padding: '1rem', border: '1px solid #ddd', fontWeight: 'bold' }}>אשווגנדה</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>הורדת סטרס וחרדה</td>
                  <td style={{ padding: '1rem', border: '1px solid #ddd' }}>בערב</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h2>וטיפ אחרון של "חברות": מיץ דובדבנים חמוצים</h2>
          
          <p>ד"ר סימס ממליצה עליו בחום (או יותר נכון בקור). הוא מכיל מלטונין טבעי ועוזר לקירור טמפרטורת הגוף בלילה.</p>
          
          <p>עליזה: "דובדבנים חמוצים? נשמע כמו התיאור של הפרצוף שלי כשאני רואה את המחיר של הויטמינים האלה בסופר-פארם. אבל אם זה עוזר לי לישון בלי להזיע כמו מרתוניסטית - אני בפנים".</p>
          
          <h2>אז מה עכשיו?</h2>
          
          <p>אל תרוצי לקנות הכל בבת אחת. תתחילי עם אחד (אני ממליצה על המגנזיום או הקריאטין), תראי איך הגוף מגיב, ותתקדמי משם. הגוף שלך עובר ריסטארט - תני לו את התמיכה שמגיעה לו.</p>
          
          <p className="article-signature">
            מבוסס על מחקריה של ד"ר סטייסי סימס (Dr. Stacy Sims) מתוך "Next Level".
          </p>
        </section>
      </div>
    </div>
  );
}
