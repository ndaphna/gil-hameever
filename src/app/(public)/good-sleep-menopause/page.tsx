'use client';

import Link from 'next/link';
import '../preparing-for-menopause/article.css';

export default function GoodSleepMenopausePage() {
  return (
    <div className="article-page">
      <div className="article-container">
        {/* Breadcrumbs */}
        <nav className="article-breadcrumbs" aria-label="ניווט דרך">
          <Link href="/" className="breadcrumb-link">דף הבית</Link>
          <span className="breadcrumb-separator">›</span>
          <Link href="/articles" className="breadcrumb-link">מאמרים</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">לילה טוב (באמת!): מדריך השורדת לשינה טובה בגיל המעבר</span>
        </nav>

        {/* Title Section */}
        <header className="article-header">
          <h1 className="article-title">
            לילה טוב (באמת!): מדריך השורדת לשינה טובה בגיל המעבר
          </h1>
        </header>

        {/* Main Content Section - Image and Text Side by Side */}
        <section className="article-content-wrapper">
          <div className="article-image-container">
            <img 
              src="https://i.imghippo.com/files/OsO8314YpQ.jpg" 
              alt="שינה טובה בגיל המעבר"
              className="article-image"
            />
          </div>
          
          <div className="article-text-content">
            <div className="article-intro">
              <p>אז מה, גם אתן מתהפכות במיטה בלילה כמו שניצל על מחבת? אל דאגה, אתן לא לבד! בתור אחת שכבר מזמן הפסיקה לספור כבשים ועברה לספור את הפעמים שהיא מסתובבת במיטה, החלטתי לצלול לעומק נושא השינה בגיל המעבר. אז בואו נדבר על למה אנחנו לא ישנות טוב ומה אפשר לעשות בנידון.</p>
            </div>
          </div>
        </section>

        {/* Full Width Content Section - Continues Below Image */}
        <section className="article-full-content">
          <h2>למה לעזאזל אנחנו לא ישנות?</h2>
          
          <h3>הורמונים משוגעים:</h3>
          
          <p>כן, כן, האסטרוגן והפרוגסטרון שלנו משחקים איתנו מחבואים, וזה משפיע על מחזור השינה-ערות שלנו.</p>
          
          <h3>גלי חום מהגיהנום:</h3>
          
          <p>אין כמו להתעורר באמצע הלילה מרגישה כאילו מישהו הדליק תנור בחדר השינה.</p>
          
          <h3>מצב רוח הפכפך:</h3>
          
          <p>דאגות, חרדות, ושינויים במצב הרוח יכולים להפוך את הלילה למסיבת פיג'מות לא רצויה במוח שלנו.</p>
          
          <h2>אז מה עושות?</h2>
          
          <h3>סדר יום קבוע:</h3>
          
          <p>כן, אני יודעת שזה נשמע משעמם, אבל ללכת לישון ולקום באותה שעה כל יום (כולל בסופ"ש!) עוזר לגוף להתרגל.</p>
          
          <h3>הורידי את הטמפרטורה:</h3>
          
          <p>הפכי את חדר השינה שלך למקרר קטן. טמפרטורה נמוכה יותר בחדר יכולה לעזור להפחית גלי חום ולשפר את איכות השינה.</p>
          
          <h3>תרגילי נשימה והרפיה:</h3>
          
          <p>אם את מוצאת את עצמך בוהה בתקרה במקום לישון, נסי תרגילי נשימה עמוקה או מדיטציה. זה יכול להרגיע את המוח הסוער שלך.</p>
          
          <h3>היי פעילה:</h3>
          
          <p>פעילות גופנית סדירה (לא ממש לפני השינה) יכולה לשפר את איכות השינה. אפילו הליכה של 30 דקות ביום יכולה לעשות פלאים.</p>
          
          <h3>הימנעי מ"אויבי השינה":</h3>
          
          <p>קפאין, אלכוהול, וארוחות כבדות לפני השינה הם לא החברים שלנו. נסי להימנע מהם לפחות 4-6 שעות לפני השינה.</p>
          
          <h3>צרי סביבת שינה נעימה:</h3>
          
          <p>חדר חשוך, שקט, ונוח יכול לעשות הבדל עצום. השקיעי במזרן נוח, כריות טובות, וווילונות מחשיכים.</p>
          
          <h3>שקלי טיפול הורמונלי:</h3>
          
          <p>דברי עם הרופא שלך על האפשרות של טיפול הורמונלי. זה יכול לעזור בהפחתת גלי חום ושיפור איכות השינה.</p>
          
          <h2>טיפים נוספים מהשטח:</h2>
          
          <p>נסי לקרוא ספר לפני השינה. זה עובד טוב יותר מכל כדור שינה!</p>
          
          <p>אם את לא מצליחה להירדם אחרי 20 דקות, קומי ועשי משהו רגוע עד שתרגישי עייפות.</p>
          
          <p>כתבי את הדאגות שלך על פתק לפני השינה. זה יכול לעזור "לנקות את הראש".</p>
          
          <p>זכרי שזה תהליך ולא כל הפתרונות יעבדו לכולן. היי סבלנית עם עצמך ונסי דברים שונים עד שתמצאי את מה שעובד בשבילך.</p>
          
          <p className="article-signature">לילה טוב ושינה נעימה!</p>
        </section>
      </div>
    </div>
  );
}

