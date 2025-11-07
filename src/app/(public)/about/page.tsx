'use client';

import { useState, useEffect } from 'react';
import './about.css';

export default function AboutPage() {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const carouselImages = [
    'https://i.imghippo.com/files/Uzep2184AJc.png',
    'https://i.imghippo.com/files/BcDD4641NU.png',
    'https://i.imghippo.com/files/Msk9146qx.png'
  ];

  const testimonials = [
    { name: 'סיגל, 52', text: 'הפוסטים שלך זה כמו לדבר עם חברה שמבינה אותי באמת.' },
    { name: 'דנה, 48', text: 'אני צוחקת, בוכה – ואז פתאום נופל לי אסימון.' },
    { name: 'מיכל, 50', text: 'בפעם הראשונה בחיים אני מרגישה שלא איבדתי את זה – אני פשוט משתנה.' },
    { name: 'רותי, 54', text: 'תודה על כל מילה. את נותנת לי תקווה.' },
    { name: 'יעל, 49', text: 'סוף סוף מישהי שמדברת את השפה שלי.' }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="about-page">
      {/* Main Title */}
      <section className="about-hero">
        <h1 className="main-title">גיל המֵעֵבֶר - לא תקופה, אלא מהפכה</h1>
      </section>

      {/* First Image with Text Wrapping */}
      <section className="content-section">
        <div className="image-text-wrapper">
          <div className="swing-image-container">
            <img 
              src="https://i.imghippo.com/files/EoFG9547htc.png" 
              alt="אישה על נדנדה"
              className="swing-image"
            />
          </div>
          <div className="text-content">
            <p className="text-paragraph">כן, זו אני.</p>
            <p className="text-paragraph">מנופאוזית וטוב לה</p>
            <p className="text-paragraph">האישה שהפסיקה להילחם בגוף שלה</p>
            <p className="text-paragraph">והתחילה לדבר איתו.</p>
          </div>
        </div>
      </section>

      {/* Greeting Section */}
      <section className="content-section">
        <h2 className="greeting-title">👋 נעים להכיר, אני ענבל דפנה.</h2>
      </section>

      {/* Second Image with Text Wrapping */}
      <section className="content-section">
        <div className="image-text-wrapper">
          <div className="image-container">
            <img 
              src="https://i.imghippo.com/files/JWK4859gIA.jpg" 
              alt="ענבל דפנה"
              className="content-image"
            />
          </div>
          <div className="text-content">
            <p className="text-paragraph">במשך שנים הייתי כמו רוב הנשים שאני פוגשת היום:</p>
            <p className="text-paragraph">חזקה, מתפקדת, מצליחה… אבל בפנים?</p>
            <p className="text-paragraph">עייפה. מוצפת. עם גוף שפתאום מתנהג כמו מיקרוגל תקול ומוח שעושה ריסטארט כל שלוש דקות.</p>
            <p className="text-paragraph">ניסיתי הכל: דיאטות, תוספים, טיפולים, שיחות…</p>
            <p className="text-paragraph">עד שיום אחד הבנתי</p>
            <p className="text-paragraph">אני לא צריכה עוד פתרון.</p>
            <p className="text-paragraph">אני צריכה מהפכה.</p>
            <p className="text-paragraph">וככה נולד "גיל המֵעֵבֶר" - המקום שבו נשים בגיל המעבר</p>
            <p className="text-paragraph">לא מתנצלות, לא נעלמות, ולא מתפשרות.</p>
            <p className="text-paragraph">הן מתעוררות.</p>
          </div>
        </div>
        <div className="below-image-text">
          <p>מאחורי המותג גיל המֵעֵבֶר עומדת</p>
          <p>אישה אחת שמבינה בדיוק איך את מרגישה.</p>
        </div>
      </section>

      {/* Movement Section */}
      <section className="content-section movement-section">
        <p className="movement-text">💥 זה לא עוד אתר. זו תנועה.</p>
        <p className="text-paragraph">פה לא מדברים על "איך לעבור את גיל המעבר בשלום".</p>
        <p className="text-paragraph">פה מדברות על איך לחיות טוב יותר בזכותו.</p>
        <p className="text-paragraph">כי האמת?</p>
        <p className="text-paragraph">זה לא גיל המעבר.</p>
        <p className="text-paragraph">זה גיל המֵעֵבֶר</p>
        <p className="text-paragraph">הגיל שבו את עוברת מלהיות "גברת" ללהיות גיבורה</p>
      </section>

      {/* Carousel Section */}
      <section className="content-section carousel-section">
        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div 
              className="carousel-track"
              style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}
            >
              {carouselImages.map((img, index) => (
                <div key={index} className="carousel-slide">
                  <img src={img} alt={`תמונה ${index + 1}`} className="carousel-image" />
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-dots">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentCarouselIndex ? 'active' : ''}`}
                onClick={() => setCurrentCarouselIndex(index)}
                aria-label={`עבור לתמונה ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Find Section */}
      <section className="content-section features-section">
        <h2 className="section-title">💫 מה תמצאי כאן?</h2>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">📖</span>
            <p className="feature-text">תוכן בגובה הלב – פוסטים, רילסים וסיפורים אמיתיים על הגוף, הנפש והבלגן שביניהם.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎬</span>
            <p className="feature-text">קטעי וידאו קורעים מצחוק עם עליזה שנקין – הקול הפנימי שלך, רק עם יותר סטייל וחוצפה.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧘‍♀️</span>
            <p className="feature-text">כלים ותובנות שמחזירים לך אנרגיה, שלווה וחיבור לגוף שלך (בלי דרמות ובלי הורמונים מיותרים).</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💞</span>
            <p className="feature-text">קהילה של נשים אמיתיות, שמדברות על הכול – כולל מה שאף אחת לא אמרה בקול רם.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔥</span>
            <p className="feature-text">השראה להתחיל לכתוב את הפרק הבא של חייך, בדרך שלך.</p>
          </div>
        </div>
      </section>

      {/* Women Say Section */}
      <section className="content-section testimonials-intro">
        <h2 className="section-title">💬 נשים אומרות לי כל הזמן:</h2>
        <div className="testimonials-quotes">
          <p className="quote-text">"הפוסטים שלך זה כמו לדבר עם חברה שמבינה אותי באמת."</p>
          <p className="quote-text">"אני צוחקת, בוכה – ואז פתאום נופל לי אסימון."</p>
          <p className="quote-text">"בפעם הראשונה בחיים אני מרגישה שלא איבדתי את זה – אני פשוט משתנה."</p>
        </div>
        <p className="testimonials-conclusion">וזה בדיוק מה שאני רוצה בשבילך.</p>
        <p className="testimonials-conclusion">שלא תרגישי לבד לרגע.</p>
        <p className="testimonials-conclusion">שלא תשרדי</p>
        <p className="testimonials-conclusion">אלא תפרחי.</p>
      </section>

      {/* Testimonials Gallery - Chat Bubbles */}
      <section className="content-section chat-gallery-section">
        <p className="gallery-intro">כל ציטוט אמיתי. כל אישה - סיפור.</p>
        <div className="chat-gallery">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="chat-bubble">
              <div className="chat-header">
                <span className="chat-name">{testimonial.name}</span>
              </div>
              <div className="chat-message">
                <p>"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="content-section cta-section">
        <h2 className="section-title">🚀 בואי נתחיל מכאן</h2>
        <div className="cta-content">
          <div className="cta-image-container">
            <img 
              src="https://i.imghippo.com/files/rWMa7345Hmw.jpg" 
              alt="שלט דרך - המסע שלך אל גיל המֵעֵבֶר מתחיל כאן"
              className="road-sign-image"
            />
          </div>
          <div className="cta-buttons">
            <button className="cta-button">💌 הצטרפי לגלי השראה</button>
            <button className="cta-button">🎥 עקבי אחרי באינסטגרם</button>
            <button className="cta-button">📘 קראי על הספר</button>
          </div>
        </div>
        <p className="cta-text">המסע שלך אל גיל המֵעֵבֶר מתחיל כאן.</p>
      </section>

      {/* Summary Section with Image */}
      <section className="content-section summary-section">
        <div className="image-text-wrapper">
          <div className="image-container">
            <img 
              src="https://i.imghippo.com/files/Kw8820rw.jpg" 
              alt="סיכום"
              className="content-image"
            />
          </div>
          <div className="text-content">
            <h2 className="summary-title">⚡️ לסיכום:</h2>
            <p className="text-paragraph">גיל המעבר הוא לא הסוף של שום דבר.</p>
            <p className="text-paragraph">הוא התחלה של החיים שאת סוף סוף בוחרת בעצמך.</p>
          </div>
        </div>
      </section>

      {/* Final Greeting */}
      <section className="content-section final-section">
        <p className="final-greeting">ברוכה הבאה הביתה 💗</p>
        <p className="final-name">ענבל דפנה</p>
        <p className="final-tagline">מנופאוזית וטוב לה</p>
        <p className="final-note">אם את כאן - סימן שהמעבר שלך כבר התחיל.</p>
      </section>
    </div>
  );
}
