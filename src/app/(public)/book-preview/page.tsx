'use client';

import './book-preview.css';

export default function BookPreviewPage() {
  return (
    <div className="book-preview-container">
      {/* Hero Section */}
      <section className="book-preview-hero">
        <div className="hero-content-wrapper">
          <p className="hero-badge">קראי על הספר</p>
          <h1 className="hero-title">
            <span className="title-text">
              <span className="title-line">הספר שכל אישה בגיל המעבר</span>
              <span className="title-line">אומרת עליו אחרי שלושה עמודים:</span>
            </span>
          </h1>
          
          <div className="hero-quote">
            <p className="hero-quote-text">
              "אוף. איפה זה היה כל השנים??"
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="preview-content-section">
        <div className="preview-container">
          <div className="content-card">
            <p className="intro-subtitle">
              הספר שיגלה לך שאת לא משתגעת - את מתעוררת.
            </p>
            
            <p className="intro-text">
              הספר שלי, <span className="highlight-text">"לא גברת, גיבורה!"</span>, נולד מתוך לילות ללא שינה, גלי חום, לב שמתכווץ, בטן שמתנפחת בלי הזמנה - ובעיקר תחושת בלבול שאף אחד לא הכין אותי אליה.
            </p>
            
            <p className="intro-text">
              ואם הגעת לכאן, אני רוצה שתדעי דבר אחד:
            </p>
            
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <p className="highlight-text-large">
                זה לא את. זה הגיל.
              </p>
              
              <p className="highlight-text-large">
                וזה לא גיל של סוף - זה גיל של מעבר ל<span className="highlight-text">מֵעֵבֶר</span>.
              </p>
            </div>
            
            <p className="intro-text" style={{ fontStyle: 'italic', marginTop: '20px', color: '#666' }}>
              (ולא, זו לא טעות כתיב.)
            </p>
            
            <p className="intro-text" style={{ marginTop: '30px' }}>
              הספר הזה הוא לא עוד ספר מידע יבש. הוא מסע.
            </p>
            
            <p className="intro-text">
              מסע אמיתי, חשוף, מצחיק, מרגש וחד כמו גל חום בלילה.
            </p>
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="preview-content-section bg-light">
        <div className="preview-container">
          <h2 className="section-title">מה מחכה לך בין הדפים?</h2>
          
          <div className="preview-grid">
            <div className="preview-card">
              <div className="preview-icon">❤️</div>
              <h3 className="preview-title">הקלה אמיתית</h3>
              <p className="preview-description">
                פתאום תביני למה את קמה עצבנית, למה הגוף משתנה, למה הראש לא מתפקד, ולמה לפעמים את רוצה פשוט לברוח לאי בודד ולא לענות לאף אחד.
              </p>
              <p className="preview-note">
                (את לא לבד - 96% מהנשים בגיל המעבר מדווחות על תסמינים. רוב הרופאים? אפילו לא מדברים איתן על זה.)
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">💪</div>
              <h3 className="preview-title">תפיסה חדשה של החיים שלך</h3>
              <p className="preview-description">
                כל מה שלא הסבירו לנו על הגוף, על המוח, על השינה, על החשק, על הדימוי העצמי - כתוב כאן בגובה העיניים, בלי שיפוט ועם הרבה חמלה.
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">🌱</div>
              <h3 className="preview-title">השראה שמחזירה אוויר לריאות</h3>
              <p className="preview-description">
                מקטעים אישיים מהמסע שלי - מצחיקים, כנים, כואבים, מעוררי תקווה - שיגרמו לך להרגיש שמישהי סוף סוף מדברת את.
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">🧭</div>
              <h3 className="preview-title">מפת דרכים אמיתית</h3>
              <p className="preview-description">
                מפת "המנופאוזית המתחילה" שתלווה אותך שלב אחרי שלב, כדי שתדעי בדיוק מה קורה לך ומה אפשר לעשות.
              </p>
            </div>
            
            <div className="preview-card">
              <div className="preview-icon">😂</div>
              <h3 className="preview-title">הומור של 'עליזה שנקין'</h3>
              <p className="preview-description">
                עליזה אומרת את מה שאת חושבת אבל לא מעיזה לומר בקול. תעשי הפסקה, תצחקי, ותביני שכולנו עוברות את זה.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section className="preview-content-section">
        <div className="preview-container">
          <h2 className="section-title">למי הספר הזה מיועד?</h2>
          
          <div className="content-card">
            <p className="intro-text">
              לכל אישה שנמצאת איפשהו בין 42 ל־60, ושואלת את עצמה בשקט:
            </p>
            <p className="highlight-text-large" style={{ margin: '30px auto' }}>
              "מה קורה לי, ולמה אני לא מזהה את עצמי?"
            </p>
            <p className="intro-text" style={{ marginTop: '30px' }}>
              נשים שאומרות:
            </p>
            
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">💭</span>
                <div>
                  <strong>"אני עייפה ברמות שלא הכרתי."</strong>
                </div>
              </div>
              
              <div className="check-item">
                <span className="check-icon">💭</span>
                <div>
                  <strong>"האינטימיות כבר לא אותו דבר."</strong>
                </div>
              </div>
              
              <div className="check-item">
                <span className="check-icon">💭</span>
                <div>
                  <strong>"הגוף שלי לא מתנהג כמו פעם."</strong>
                </div>
              </div>
              
              <div className="check-item">
                <span className="check-icon">💭</span>
                <div>
                  <strong>"אני מרגישה לבד בזה."</strong>
                </div>
              </div>
              
              <div className="check-item">
                <span className="check-icon">💭</span>
                <div>
                  <strong>"אני רוצה להבין. להרגיש שליטה. להתעורר מחדש."</strong>
                </div>
              </div>
            </div>
            
            <p className="intro-text" style={{ marginTop: '30px', textAlign: 'center', fontWeight: '700' }}>
              הספר הזה נכתב בדיוק עבורך.
            </p>
          </div>
        </div>
      </section>

      {/* Why Women Say Section */}
      <section className="preview-content-section bg-light">
        <div className="preview-container">
          <h2 className="section-title">למה נשים אומרות שזה הספר הכי חשוב שקראו בגיל הזה?</h2>
          
          <div className="content-card">
            <p className="intro-text">
              כי הוא עושה שלושה דברים שאף אחד לא עשה להן:
            </p>
            
            <div className="checklist">
              <div className="check-item">
                <span className="check-icon">✔</span>
                <div>
                  <strong>נותן מילים למה שהן מרגישות</strong>
                </div>
              </div>
              
              <div className="check-item">
                <span className="check-icon">✔</span>
                <div>
                  <strong>נותן ידע שלא מספרים לרוב הנשים</strong>
                </div>
              </div>
              
              <div className="check-item">
                <span className="check-icon">✔</span>
                <div>
                  <strong>נותן תקווה ואומץ להתחלה חדשה</strong>
                </div>
              </div>
            </div>
            
            <p className="intro-text" style={{ marginTop: '30px', textAlign: 'center', fontStyle: 'italic' }}>
              זה לא ספר - זה חיבוק.
            </p>
            <p className="intro-text" style={{ textAlign: 'center', fontStyle: 'italic' }}>
              זו מראה.
            </p>
            <p className="intro-text" style={{ textAlign: 'center', fontStyle: 'italic' }}>
              וזו התחלה חדשה.
            </p>
          </div>
        </div>
      </section>

      {/* Why You Must Read Section */}
      <section className="preview-content-section">
        <div className="preview-container">
          <h2 className="section-title">למה את "חייבת לקרוא אותו"?</h2>
          
          <div className="content-card">
            <p className="intro-text">
              כי מגיע לך סוף סוף להבין מה קורה לך,
            </p>
            <p className="intro-text">
              להפסיק להרגיש לבד,
            </p>
            <p className="intro-text">
              ולגלות שהפרק הבא של החיים שלך יכול להיות הפרק הכי טוב שהיה לך.
            </p>
            <p className="highlight-text-large" style={{ margin: '30px auto' }}>
              הספר הזה יחזיר אותך לעצמך.
            </p>
          </div>
        </div>
      </section>

      {/* Final Message Section */}
      <section className="preview-content-section bg-light">
        <div className="preview-container">
          <div className="book-message-box">
            <p className="book-message-line">אם את מרגישה שמשהו משתנה בך - את לא מתפרקת.</p>
            <p className="book-message-highlight">את מתעצבת מחדש.</p>
            <p className="book-message-line">והספר הזה ילמד אותך איך לצמוח מזה.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="preview-cta-section">
        <div className="preview-cta-container">
          <div className="preview-cta-content">
            <h2 className="preview-cta-title">מוכנה להתחיל את המסע?</h2>
            <p className="preview-cta-description">
              הרשמי לרשימת המתנה וקבלי עדכון כשהספר יהיה זמין
            </p>
            <div className="preview-cta-buttons">
              <a href="/waitlist" className="preview-cta-button primary-cta">
                <span>הרשמי לרשימת המתנה</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

