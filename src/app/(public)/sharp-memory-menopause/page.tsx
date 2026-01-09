'use client';

import Link from 'next/link';
import '../preparing-for-menopause/article.css';

export default function SharpMemoryMenopausePage() {
  return (
    <div className="article-page">
      <div className="article-container">
        {/* Breadcrumbs */}
        <nav className="article-breadcrumbs" aria-label="ניווט דרך">
          <Link href="/" className="breadcrumb-link">דף הבית</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href="/articles" className="breadcrumb-link">מאמרים</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">הסוד לזיכרון חד בגיל המעבר</span>
        </nav>

        {/* Title Section */}
        <header className="article-header">
          <h1 className="article-title">
            המוח שלך לא נעלם, הוא פשוט ב"שיפוצים": הסוד לזיכרון חד (גם) בגיל המעבר 🧠✨
          </h1>
        </header>

        {/* Main Content Section - Image and Text Side by Side */}
        <section className="article-content-wrapper">
          <div className="article-image-container">
            <img 
              src="https://i.imghippo.com/files/REs2664FMI.jpeg" 
              alt="זיכרון חד בגיל המעבר"
              className="article-image"
            />
          </div>
          
          <div className="article-text-content">
            <div className="article-intro">
              <p>נכנסת לחדר ושכחת למה? המילה עומדת לך על קצה הלשון ופשוט מסרבת לצאת? התחושה הזו שמישהו הניח "ערפל" בתוך הראש שלך היא לא דמיון – היא ביולוגיה.</p>
              
              <p>החדשות הטובות? זה לא חייב להיות ככה. את לא "מזדקנת", את פשוט צריכה לעדכן גרסה.</p>
            </div>
          </div>
        </section>

        {/* Full Width Content Section - Continues Below Image */}
        <section className="article-full-content">
          <p>הנה 3 אסטרטגיות "אטומיות" שיחזירו לך את הפוקוס:</p>
          
          <h2>1. הניסוי המדהים של "שינת הריח" 💤</h2>
          
          <p>מסתבר שהדרך לזיכרון עוברת דרך האף. מחקר פורץ דרך מצא שחשיפה לריחות משתנים בזמן השינה שיפרה את הביצועים הקוגניטיביים ב-226%!</p>
          
          <p><strong>מה עושים?</strong> שימי דיפיוזר ליד המיטה. בכל לילה ריח אחר (לבנדר, לימון, רוזמרין). המוח שלך יתאמן בזמן שאת חולמת.</p>
          
          <h2>2. תדלקי את ה"מנוע" המנטלי (תוספים) 💊</h2>
          
          <p>האסטרוגן יורד, ואיתו האנרגיה של המוח. כדי לגשר על הפער, המדע מסמן 3 גיבורי על:</p>
          
          <p><strong>קריאטין:</strong> לא רק לספורטאים! הוא נותן דלק מיידי לתאי המוח ומפחית את הערפל המוחי.</p>
          
          <p><strong>אומגה 3 (DHA):</strong> חומרי הבניין של הזיכרון.</p>
          
          <p><strong>מגנזיום ל-תראונט:</strong> הסוג היחיד שבאמת חודר למוח ומשפר את הקשרים בין העצבים.</p>
          
          <h2>3. אימון 'דו משימתי' (Dual-Tasking) 🏃‍♀️🔢</h2>
          
          <p>תשבצים זה נחמד, אבל המוח שלך אוהב אתגרים משולבים.</p>
          
          <p><strong>התרגיל:</strong> בפעם הבאה שאת יוצאת להליכה, נסי למנות לאחור מ-100 בקפיצות של 7 (100, 93, 86...).</p>
          
          <p><strong>למה?</strong> השילוב בין תנועה פיזית למאמץ קוגניטיבי בונה "נתיבים עוקפים" במוח ומחזק את הגמישות המחשבתית.</p>
          
          <h2>בשורה התחתונה:</h2>
          
          <p>גיל המעבר הוא הזדמנות לעשות "Reset" להרגלים שלך. המוח שלך עדיין שם, הוא רק מחכה שתתני לו את הכלים הנכונים לעבוד איתם.</p>
        </section>
      </div>
    </div>
  );
}

