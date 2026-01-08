import './emergency-map-guide.css';

export default function EmergencyMapGuideLanding() {
  return (
    <div className="page-container" dir="rtl">
      {/* Top Banner - Fixed Height */}
      <div className="top-banner">
        <p className="banner-text">
          מרגישה שהגוף שלך השתנה ואין לך מושג מאיפה להתחיל?
        </p>
      </div>

      {/* Hero Section - Flex-1 (Takes Remaining Space) */}
      <div className="hero-section">
        {/* Desktop: Two Columns | Mobile: Stacked */}
        <div className="hero-content">
          
          {/* Headline - Always First on Mobile */}
          <div className="headline-section">
            <h1 className="main-headline">
              מפת החירום למנופאוזית המתחילה
            </h1>
            
            <p className="sub-headline">
              (בלי ניחושים, בלי פחד. רק צעדים פרקטיים שעובדים)
            </p>
          </div>

          {/* Image - Second on Mobile, Left on Desktop */}
          <div className="image-container">
            <img 
              src="https://i.imghippo.com/files/EVh5995WfE.png" 
              alt="מפת החירום למנופאוזית המתחילה"
              className="guide-image"
            />
          </div>

          {/* Benefits & CTA - Third on Mobile, Right on Desktop */}
          <div className="benefits-cta-section">
            <ul className="benefits-list">
              <li className="benefit-item">
                <span className="bullet-icon">•</span>
                <span className="benefit-text">
                  סדר בבלבול: להבין סוף סוף מה קורה להורמונים שלך.
                </span>
              </li>
              <li className="benefit-item">
                <span className="bullet-icon">•</span>
                <span className="benefit-text">
                  מקלח מיידי: כלים פרקטיים להתמודדות עם התסמינים הראשונים.
                </span>
              </li>
              <li className="benefit-item">
                <span className="bullet-icon">•</span>
                <span className="benefit-text">
                  ביטחון ושלווה: להפסיק להרגיש "אבודה" מול השינויים בגוף.
                </span>
              </li>
            </ul>

            <div className="cta-section">
              <p className="cta-text">
                תפסיקי לסבול מחוסר הודאות ותתחילי להרגיש טוב יותר כבר היום.
              </p>
              
              <button className="cta-button">
                שלחי לי את מפת החירום!
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="bg-decoration bg-decoration-1"></div>
      <div className="bg-decoration bg-decoration-2"></div>
      <div className="bg-decoration bg-decoration-3"></div>
    </div>
  );
}

