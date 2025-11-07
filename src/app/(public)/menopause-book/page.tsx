'use client';

import './menopause-book.css';

export default function MenopauseBookPage() {
  return (
    <div className="menopause-book-landing">
      {/* Introduction Section */}
      <section className="container" style={{ paddingTop: '80px' }}>
        {/* כותרת קטנה ראשונה */}
        <p style={{ fontSize: '1.2rem', color: '#4a5568', textAlign: 'center', marginBottom: '20px', fontWeight: '600' }}>
          חשבתי שגיל המעבר זה התחלת הסוף, לא האמנתי מה מחכה בצד השני שלו
        </p>
        
        {/* כותרת בינונית */}
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '40px' }}>
          הספר החדש שיגלה לך את הסוד ב־155 עמודים בלבד:
        </h2>
        
        {/* כותרת ראשית - פונט ענק */}
        <h1 className="main-headline">
          "איך עברתי מגוף כואב ונפש עייפה בגיל המעבר, לאנרגיה, התלהבות ופריחה, גם באמצע החיים, וכבר לא מתבאסת כשקוראים לי 'גברת'."
        </h1>

        {/* קופסה ורודה עם CTA */}
        <div className="pink-cta-box">
          <div className="pink-cta-text">
            <div>כן, אני רוצה לגלות את הסוד</div>
            <div>לפריחה בגיל הַמֵעֵבֶר. <span className="arrow-icon">→→</span></div>
          </div>
        </div>

        <div className="content-box">
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            אם את מרגישה שהגוף שלך יוצא משליטה - חם לך, כואב, יבש,<br />
            אם את עצבנית, עייפה, מדוכאת, ובעיקר... <strong>מרגישה לבד</strong>,
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginTop: '20px' }}>
            אם גם את מרגישה שגיל המעבר הפתיע אותך בלי אזהרה מוקדמת,<br />
            שהגוף משתנה, הניצוץ נעלם, המצב רוח עושה סיבובים,<br />
            והתחלת לשאול את עצמך:
          </p>
          <h3 style={{ textAlign: 'center', color: '#E91E8C', fontSize: '2rem', margin: '30px 0' }}>
            "זהו? מכאן זה רק הולך ומתדרדר עד הסוף?"
          </h3>
          <p style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: '700' }}>
            כדאי לך להמשיך לקרוא.
          </p>
        </div>

        <img src="https://i.imghippo.com/files/rJXP5133RQ.jpg" alt="אישה בגיל המעבר" className="premium-image" />
      </section>

      {/* Reassurance Section */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">לא, את לא משתגעת</h2>
          <p className="section-subtitle">את פשוט עוברת תקופה שכמעט אף אחת לא מדברת עליה בקול רם.</p>

          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              אם את מפחדת שהספירה לאחור התחילה, שזמנך הולך ואוזל, שאת כבר לא נהיית צעירה יותר,
              אבל עמוק בפנים עדיין בוערת בך האישה שרוצה להגשים את החיים שתמיד חלמת עליהם,
              אישה שמקרינה ביטחון, שלווה ונראית נטולת גיל...
            </p>
            <p style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: '700', color: '#E91E8C', marginTop: '30px' }}>
              הגעת למקום הנכון.
            </p>
          </div>

          <img src="https://i.imghippo.com/files/JWK4859gIA.jpg" alt="המסע שלי" className="premium-image" />
        </div>
      </section>

      {/* Story Section */}
      <section className="container">
        <h2 className="section-title">אני הייתי שם בדיוק</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בלילות בלי שינה, עם מחשבות שרצות בראש, ואיזו אישה אחת במראה שלא זיהיתי.
            פחדתי שגיל המעבר יהפוך אותי לזקנה ממורמרת, ולעולם כבר לא אהיה האישה השמחה, הנחשקת, והאנרגטית שרציתי להיות.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            אחרי שנתיים מתסכלות שבהן חוויתי כמעט כל תסמין של גיל המעבר,
            חקרתי, ניסיתי, ובלעתי כל פיסת ידע שיכולתי למצוא.
          </p>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', margin: '30px 0' }}>
            היום אני יכולה להגיד לך בוודאות:<br />
            גיל המעבר הוא לא הסוף – הוא השער להתחלה חדשה.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9' }}>
            ותוך סוף השבוע הקרוב - תביני סוף סוף מה עובר עלייך, ותרגישי הקלה אמיתית.
            כי את לא צריכה לעבור את זה לבד, ולא צריך חודשים של טיפול כדי להתחיל להרגיש טוב.
            לפעמים מספיק להבין מה באמת קורה, כדי להתחיל לנשום אחרת.
          </p>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">קבלי הצצה לעתיד שלך – איפה את רוצה להיות?</h2>
          <p className="section-subtitle">נשים שמתקרבות לגיל המעבר מתחלקות לשני סוגים.</p>

          <div className="benefits-grid">
            <div className="benefit-card" style={{ borderColor: '#cbd5e0' }}>
              <div className="benefit-icon">😰</div>
              <h3 style={{ color: '#718096' }}>הסוג הראשון</h3>
              <p>
                אלה שמרגישות שהכול מתפרק ונכנסות למוד של "זהו, מכאן הכול מדרון חלק למטה."
                הן סובלות - גופנית ורגשית. קשה להן להירדם, העור יבש, הגוף כואב.
                הן עולות במשקל ומתרחקות מהמראה. עם כל יום - קצת יותר עייפות, מתוסכלות, פחות מאושרות.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>הסוג השני</h3>
              <p>
                עובר את אותם שינויים, אבל משהו בפנים קם ואומר: "לא! זה לא חייב להיראות ככה."
                אלה נשים שמחליטות להשקיע בעצמן דווקא עכשיו.
                הן לומדות, נושמות, זזות, צוחקות, ומגלות מחדש את מי שהן.
                הן עוברות מהישרדות לפריחה.
              </p>
            </div>
          </div>

          <div className="content-box" style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#E91E8C' }}>
              האמת? ההבדל בין שתי הקבוצות האלה לא נמדד בגנטיקה,<br />
              אלא בהחלטה אחת קטנה:
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', marginTop: '20px' }}>
              להתחיל להשקיע בעצמך עוד היום.
            </p>
          </div>

          <img src="https://i.imghippo.com/files/vQgE3511aA.jpg" alt="קבלי הצצה לעוד 20 שנה" className="premium-image" />

          <h3 style={{ textAlign: 'center', fontSize: '2rem', color: '#E91E8C', margin: '50px 0 30px' }}>
            באיזה צד את רוצה להיות?
          </h3>

          <div style={{ textAlign: 'center' }}>
            <a href="#offer" className="cta-button">
              💖 בוחרת בעצמי - רוצה את הספר!
            </a>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="container">
        <h2 className="section-title">לא נולדתי עם כל התשובות</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            הכול התחיל ביום רגיל לגמרי, ברגע אחד קטן הכל בפנים התפרק.
            עמדתי מול המראה, הסתכלתי על עצמי… ופתאום זה היכה בי:<br />
            <strong>אני כבר לא אותה אישה. לא בגוף, לא בראש, ובעיקר - לא בלב.</strong>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            החיים רצו, הילדים גדלו, הקריירה צלחה, אבל אני? הלכתי והתרחקתי מעצמי.
            לאט. בשקט. בלי ששמתי לב.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            הייתי עייפה - לא רק פיזית, אלא עייפה מהחיים.
            מההעמדות פנים, מהצורך להמשיך "להיות בסדר".
            הגוף השתנה. גלי חום באמצע ישיבה בעבודה, בטן שתפחה פתאום, מצב רוח שקופץ בלי אזהרה.
          </p>
          <p style={{ fontSize: '1.4rem', fontWeight: '700', textAlign: 'center', color: '#E91E8C', margin: '30px 0' }}>
            ושאלתי את עצמי: ככה זה יהיה מעכשיו עד הסוף?
          </p>
        </div>

        <img src="https://i.imghippo.com/files/VdIP7833mJY.jpg" alt="הרגע המכונן" className="premium-image" />
      </section>

      {/* Wake-up Call Section */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">ואז, יום אחד, זה קרה</h2>
          
          <div className="testimonial">
            <p>
              "תגידי, את אמיתית? את שלמדת אימון מנטלי ו־NLP, שעברת אינספור סדנאות של התפתחות אישית,
              ושהלכת בגיל 47 עם ילדים בני עשרים, ללמוד תואר שני במנהל עסקים,
              איך את, מכולן, נפלת ככה לגיל המעבר? את?!"
            </p>
            <div className="testimonial-author">– חברה טובה שהעירה אותי</div>
          </div>

          <div className="content-box">
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              המשפט הזה היה כמו אגרוף בבטן. בהתחלה נעלבתי. אחר כך בכיתי. ואז שתקתי.
              ובתוך השקט הזה, נפל לי אסימון ענק.
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', margin: '20px 0' }}>
              אני, שתמיד עזרתי לאחרים להתמודד עם משברים, לא ידעתי להתמודד עם זה שלי.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9' }}>
              נזכרתי בכל הכלים שלי - הם לא נעלמו, רק נשכחו.
              והבנתי שגיל המעבר הוא לא חולשה. הוא קריאה להתעורר.
            </p>
          </div>
        </div>
      </section>

      {/* The Method Section */}
      <section className="container">
        <h2 className="section-title">כך נולדה שיטת "חוכמת המעבר הנשית"</h2>
        <p className="section-subtitle">פשוטה, עמוקה, נשית – שיטה שעבדה ושהחזירה לי את השקט, האנרגיה והביטחון.</p>

        <img src="https://i.imghippo.com/files/wMGH1022am.jpg" alt="חוכמת המעבר הנשית" className="premium-image" />

        <div className="content-box">
          <h3 style={{ color: '#E91E8C', fontSize: '1.8rem', marginBottom: '25px', textAlign: 'center' }}>
            למה השיטה הזו עובדת
          </h3>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בניגוד לגישות שמנסות "לתקן" את מה שההורמונים "הרסו",
            השיטה הזו מבוססת על הבנה אחת מהפכנית:
          </p>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', textAlign: 'center', color: '#E91E8C', margin: '30px 0' }}>
            את לא צריכה להילחם במה שמשתנה.<br />
            את צריכה ללמוד לעבוד יחד איתו.
          </p>
          
          <ul className="icon-list">
            <li>היא עובדת עם הגוף שלך, לא נגדו</li>
            <li>היא מדברת בשפה של הלב, לא של הורמונים</li>
            <li>והיא נותנת מפת דרכים רגשית ומעשית, שתחזיר לך בהדרגה את התחושה של יציבות, שמחה וביטחון</li>
          </ul>
        </div>

        <img src="https://i.imghippo.com/files/yzRf6253qms.jpg" alt="ארבעת היסודות" className="premium-image" />

        <h3 className="four-foundations-title">
          ארבעת היסודות של חוכמת המעבר הנשית
        </h3>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>הכרה</h3>
            <p>להבין מה באמת עובר עלייך, בגוף ובנפש. ברגע שאת מבינה - הפחד יורד, והשקט חוזר.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>חמלה</h3>
            <p>להפסיק להילחם בעצמך, ולהתחיל לבחור בך. במקום לשפוט - תלמדי לנשום, לסלוח, ולתת לגוף זמן.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>חיבור</h3>
            <p>להתחבר לגוף שלך, לקול שלך, ולנשים אחרות. כשאת מתחברת לעצמך, הכול מסתדר: <span style={{ whiteSpace: 'nowrap' }}>הזוגיות, העבודה, האנרגיה.</span></p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>התחדשות</h3>
            <p>לבנות את הפרק הבא בחייך עם ביטחון ומשמעות. זו כבר לא את של פעם - זו את, <span style={{ whiteSpace: 'nowrap' }}>בגרסה הטובה ביותר שלך.</span></p>
          </div>
        </div>

        <div className="content-box" style={{ background: 'var(--light-pink)', borderColor: '#E91E8C' }}>
          <h3 style={{ color: '#E91E8C', fontSize: '1.8rem', marginBottom: '25px', textAlign: 'center' }}>
            מה יוצא לך מהשיטה הזו?
          </h3>
          <ul className="icon-list">
            <li>תחזרי להרגיש חיה ונוכחת. לא שקופה ועייפה, לא "בין לבין"</li>
            <li>תדעי איך להתמודד עם השינויים בלי להרגיש אבודה</li>
            <li>תרגישי שלווה בגוף ויציבות בנפש</li>
            <li>תחיי עם תחושת כיוון חדשה - ותפסיקי להתנצל על מי שאת</li>
            <li>ותזכרי: זה לא עוד "פרויקט שיפור עצמי" - זו דרך פשוטה לחזור הביתה לעצמך</li>
          </ul>
        </div>
      </section>

      {/* What Makes it Different */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">מה הופך את הספר הזה לשונה?</h2>
          <p className="section-subtitle">
            רוב הספרים על גיל המעבר מדברים על תסמינים, הורמונים ופתרונות רפואיים.<br />
            הספר הזה מדבר אחרת.
          </p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💊</div>
              <h3>לא מתיימר לתקן אותך</h3>
              <p>אלא עוזר לך להבין את עצמך</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🗣️</div>
              <h3>לא עוד ספר קריאה</h3>
              <p>זו שיחה אינטימית, כמו עם חברה טובה</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💫</div>
              <h3>לא מבטיח ניסים</h3>
              <p>אבל משנה חיים</p>
            </div>
          </div>

          <div className="content-box">
            <h3 style={{ color: '#E91E8C', fontSize: '1.8rem', marginBottom: '25px', textAlign: 'center' }}>
              אז מה בדיוק מחכה לך בין הדפים?
            </h3>
            <ul className="icon-list">
              <li>תובנות וכלים פשוטים שיעזרו לך להבין מה עובר עלייך ולמה זה קורה</li>
              <li>פרקים קצרים שקל לקרוא גם כשאת עייפה</li>
              <li>שפה אנושית, בגובה העיניים, בלי הרצאות ובלי שיפוט</li>
              <li>סיפורים אמיתיים שתרגישי כאילו נכתבו עלייך</li>
              <li>מפת דרכים ברורה שתלווה אותך בכל שלב - מהעומס אל השקט, מהבלבול אל הבהירות</li>
              <li>ועליזה שנקין - הדמות ההומוריסטית, שהיא החברה הטובה של כולנו, שתגרום לך לצחוק ולנשום רגע בתוך כל זה</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section id="offer" className="container" style={{ padding: '100px 20px' }}>
        <div className="price-box">
          <h2 className="launch-offer-title">🎉 הצעת השקה מיוחדת! 🎉</h2>
          <p className="birthday-note">לרגל יום הולדתי ה־52</p>
          <div className="old-price">97 ₪</div>
          <div className="new-price">52 ₪</div>
          <p className="price-note">במקום 97 ₪ - חיסכון של 45 ₪!</p>
          
          <div className="package-details">
            <h3 className="package-title">🎁 מה את מקבלת?</h3>
            <p className="package-item">📘 הספר הדיגיטלי המלא – <strong>שווי 97 ₪</strong></p>
            <p className="package-item">💻 גישה מיידית למפת הדרכים למנופאוזית המתחילה – <strong>שווי 397 ₪</strong></p>
            <p className="package-item">👭 קדימות להרשמה למועדון הנשים החדש – <strong>שווי 52 ₪ לחודש</strong></p>
            <p className="package-item">🎓 10% הנחה לקורס הדיגיטלי העתידי – <strong>שווי ההנחה 50 ₪</strong></p>
            <p className="package-item">📝 יומן המנופאוזית המתחילה – <strong>מתנה בלי מחיר, אבל עם ערך עצום</strong></p>
            <hr className="package-divider" />
            <p className="package-total">
              שווי כולל: 596 ₪<br />
              המחיר שלך היום: <span className="final-price">52 ₪ בלבד!</span>
            </p>
          </div>

          <a href="#" className="cta-button price-box-button">
            🚀 כן! אני רוצה את החבילה המלאה ב־52 ₪
          </a>
          
          <p className="limited-time">⏳ ההטבה זמינה לזמן מוגבל בלבד</p>
          <p className="guarantee-text">🛡️ אחריות מלאה להחזר כספי תוך 7 ימים</p>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">מה נשים אומרות על הספר</h2>
          <p className="section-subtitle">אלה הן נשים אמיתיות, שהיו בדיוק במקום שבו את נמצאת עכשיו</p>

          <div className="testimonial">
            <p>"חשבתי שאחרי גיל 50 זה מדרון חלק עד הסוף... גיליתי שזו קפיצת מדרגה לחיים שתמיד רציתי."</p>
            <div className="testimonial-author">– רחל, 53</div>
          </div>

          <div className="testimonial">
            <p>"חשבתי שאני לבד, עד שקראתי אותך. סוף סוף ספר שמדבר אליי, לא עליי."</p>
            <div className="testimonial-author">– מיכל, 48</div>
          </div>

          <div className="testimonial">
            <p>"לא הפסקתי לבכות ולצחוק בו זמנית. זה הרגיש כמו שיחה עם חברה."</p>
            <div className="testimonial-author">– דנה, 51</div>
          </div>

          <div className="testimonial">
            <p>"לא ידעתי כמה הייתי צריכה את זה, עד שקראתי."</p>
            <div className="testimonial-author">– יעל, 49</div>
          </div>

          <img src="https://i.imghippo.com/files/exPl4806Bo.jpg" alt="המלצות" className="premium-image" />
        </div>
      </section>

      {/* Urgency Section */}
      <section className="container">
        <h2 className="section-title">למה את חייבת את הספר הזה (עכשיו)</h2>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">⏳</div>
            <h3>זו מהדורת ההשקה הראשונה</h3>
            <p>במחיר סמלי של 52 ₪ בלבד (במקום 97 ₪)</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🎁</div>
            <h3>הבונוסים בשווי 596 ₪</h3>
            <p>מפת הדרכים, יומן המנופאוזית, והנחות לקורס עתידי</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💌</div>
            <h3>הזדמנות לשנות</h3>
            <p>את איך שאת מרגישה היום - עוד חודש תוכלי לענות "אני בטוב. באמת!"</p>
          </div>
        </div>

        <div className="content-box" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3 style={{ color: '#E91E8C', fontSize: '2rem', marginBottom: '30px' }}>
            כל מה שנשאר לך לעשות זה 3 צעדים פשוטים 👇
          </h3>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>לחצי על הכפתור</h3>
              <p>הכפתור הוורוד כאן למטה</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>מלאי פרטים</h3>
              <p>שם, מייל, טלפון</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>אשרי תשלום</h3>
              <p>52 ₪ בלבד - והספר אצלך במייל!</p>
            </div>
          </div>
          <a href="#" className="cta-button" style={{ marginTop: '40px', fontSize: '1.3rem' }}>
            ✨ כן, אני מוכנה להתחיל את המסע שלי!
          </a>
        </div>

        <img src="https://i.imghippo.com/files/tcj5932jw.jpg" alt="התחילי עכשיו" className="premium-image" />
      </section>

      {/* What You Get */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">🎁 מה את מקבלת ברכישה אחת פשוטה?</h2>

          <div className="bonus-box">
            <h4>💌 הספר הדיגיטלי המלא</h4>
            <ul>
              <li>כתוב בגובה העיניים, עם סיפור אישי, תובנות וכלים פשוטים</li>
              <li>קל לקריאה – גם כשאת עייפה או עמוסה</li>
            </ul>
          </div>

          <div className="bonus-box">
            <h4>💻 בונוס 1: מפת הדרכים למנופאוזית המתחילה</h4>
            <ul>
              <li>כלים, מדריכים, תרגילים וטיפים – ברורים, פשוטים, שימושיים</li>
              <li>מבוססת על סולם הצרכים של מסלו</li>
              <li>5 שלבים בסולם - מגוף מתפרק ועד נשמה שמתבהרת</li>
              <li>בכל שלב: מדריכים, קבצים להורדה, תרגולים וכלים פרקטיים</li>
            </ul>
          </div>

          <div className="bonus-box">
            <h4>👭 בונוס 2: הטבה עתידית למועדון הנשי</h4>
            <ul>
              <li>כשייפתח - את תהיי בראש הרשימה, במחיר בכורה מיוחד</li>
              <li>מקום חם ואינטימי לשתף ולצמוח יחד</li>
            </ul>
          </div>

          <div className="bonus-box">
            <h4>🎓 בונוס 3: 10% הנחה לקורס דיגיטלי עתידי</h4>
            <ul>
              <li>מבוסס על הספר, פרקטי, עמוק ומלווה</li>
              <li>יאפשר לך להפוך את הידע לפרקטיקה יומיומית</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#E91E8C', marginBottom: '30px' }}>
              כל זה במחיר השקה של 52 ₪ בלבד!
            </p>
            <a href="#" className="cta-button">
              💗 כן, אני רוצה את כל החבילה!
            </a>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee */}
      <section className="container">
        <h2 className="section-title">🛡️ אחריות מלאה + רכישה בטוחה</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.2rem', lineHeight: '1.9', marginBottom: '25px' }}>
            אני יודעת שזו לא עוד קנייה. זו בחירה בעצמך!
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.9', marginBottom: '25px' }}>
            אבל, אם תקראי ותרגישי שהספר לא מדבר אלייך, לא מחבק או לא מדויק,
            <strong style={{ color: '#E91E8C' }}>תקבלי החזר מלא, תוך 7 ימים. בלי שאלות, בלי אותיות קטנות.</strong>
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
            💳 התשלום שלך עובר דרך מערכת מאובטחת.<br />
            את מקבלת גישה מיידית, ותחושת ביטחון מהשנייה הראשונה.
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', marginTop: '30px' }}>
            💗 זו ההתחייבות שלי כאישה, כחברה, וכאחת שכבר הייתה שם.
          </p>
        </div>

        <img src="https://i.imghippo.com/files/jeLB4454nas.jpg" alt="בטוחה ומוגנת" className="premium-image" />
      </section>

      {/* Trust Signals */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">📚 למה את יכולה לסמוך על הספר הזה?</h2>
          
          <ul className="icon-list">
            <li><strong>מבוסס על חיים אמיתיים</strong> - לא עוד מדריך יבש, אלא תובנות שנולדו מתוך יומן אישי של אישה בדיוק כמוך</li>
            <li><strong>מגובה בעשרות פידבקים</strong> - נשים שקראו, שיתפו, כתבו, חיבקו, ואמרו: "סוף סוף מישהי מדברת את מה שאני מרגישה"</li>
            <li><strong>משולב בהומור, כלים וטיפים</strong> - לא רק מילים יפות, אלא עזרה יישומית שתוכלי להתחיל ליישם כבר עכשיו</li>
            <li><strong>נתמך בידע רפואי ונפשי עדכני</strong> - התוכן נבדק ונשען על מידע אמין, בלי מונחים מסובכים</li>
            <li><strong>מלווה בתוכן דיגיטלי מתחדש</strong> - הקריאה לא מסתיימת בספר. את נכנסת למסע מתמשך של תמיכה</li>
            <li><strong>מחיר נגיש, בונוסים משמעותיים, גישה מיידית</strong> - את לא צריכה לחכות. בלחיצה אחת - כל זה אצלך</li>
          </ul>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container">
        <h2 className="section-title">❓ שאלות נפוצות</h2>
        <p className="section-subtitle">אם את עדיין מתלבטת, הנה כמה תשובות לשאלות נפוצות</p>

        <div className="faq-item">
          <div className="faq-question">🟣 יש לי מעט מאוד זמן פנוי. איך אצליח לקרוא?</div>
          <div className="faq-answer">
            הספר בנוי בדיוק בשבילך. הוא מחולק לפרקים קצרים, כל אחד באורך של כמה דקות.
            אפשר לקרוא לפי מצב הרוח, לפתוח כל פעם במקום אחר, ואפילו "לנשום אותו" פרק אחד בכל ערב.
            הספר מתחשב בעייפות שלך 🙂
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">🟣 אני באמצע פרויקט/עומס - האם זה הזמן הנכון?</div>
          <div className="faq-answer">
            דווקא עכשיו! הספר לא יכביד עלייך, אלא יחבק אותך בדיוק איפה שאת, ויחכה לך לרגע המתאים.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">🟣 זה נשמע אישי מדי… למה שזה ידבר אליי?</div>
          <div className="faq-answer">
            הספר אמנם נכתב מתוך החוויה שלי, אבל הוא מכוון אלייך.
            התגובות שאני מקבלת כל הזמן הן: "איך כתבת בדיוק את מה שאני מרגישה?".
            כי התחושות האלה משותפות לכולנו, גם אם הסיפורים שונים.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">🟣 אני שונאת דיגיטל. האם זה רק ספר דיגיטלי?</div>
          <div className="faq-answer">
            כרגע כן - הספר זמין בפורמט דיגיטלי בלבד, אבל הוא מאוד נוח לקריאה מכל מכשיר - טלפון, טאבלט או מחשב.
            בעתיד תצא גרסה מודפסת!
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">🟣 אם אני לא מרוצה - האם יש החזר כספי?</div>
          <div className="faq-answer">
            בהחלט! אם תוך 7 ימים מהקנייה תרגישי שהספר לא דיבר אלייך - את מקבלת החזר מלא.
            בלי אותיות קטנות, בלי להסביר. כי זו המחויבות שלי - שאת תרגישי בטוחה.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">🟣 למי הספר הזה מתאים?</div>
          <div className="faq-answer">
            הספר נכתב במיוחד לנשים שנמצאות בשלב כלשהו של גיל המעבר - לפני, תוך כדי, או אחריו.
            אם את מרגישה בלבול, עייפות, ריחוק מעצמך, או שאת פשוט רוצה להבין מה עובר עלייך בצורה רכה ואנושית - הספר הזה ייגע בך.
            הוא מתאים במיוחד לנשים בגילאי 45–60.
          </div>
        </div>

        <div className="faq-item">
          <div className="faq-question">🟣 יש לך שאלה נוספת?</div>
          <div className="faq-answer">
            כתבי לי ואשמח לענות 💌<br />
            <a href="mailto:gil.hameever@gmail.com" style={{ color: '#E91E8C', fontWeight: '700' }}>gil.hameever@gmail.com</a> - אני כאן בשבילך.
          </div>
        </div>
      </section>

      {/* After Purchase */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">🧭 מה את מקבלת מיד אחרי הרכישה?</h2>
          
          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              💳 ברגע שסיימת את התשלום המאובטח, תקבלי למייל שלך:
            </p>
            <ul className="icon-list" style={{ marginTop: '25px' }}>
              <li>קובץ הספר לקריאה מיידית</li>
              <li>גישה מלאה לאתר עם מפת הדרכים למנופאוזית המתחילה</li>
              <li>כל הבונוסים שלך</li>
            </ul>
            <p style={{ fontSize: '1.1rem', marginTop: '30px', lineHeight: '1.8' }}>
              💻 אין צורך להוריד אפליקציות<br />
              📱 אפשר לקרוא מהנייד, הטאבלט או המחשב<br />
              ☕ כל מה שאת צריכה: כוס תה או קפה, רגע לעצמך, ולב פתוח
            </p>
            <p style={{ fontSize: '1.1rem', marginTop: '25px' }}>
              ❓ צריכה עזרה? אפשר לכתוב לי מייל: 
              <a href="mailto:gil.hameever@gmail.com" style={{ color: '#E91E8C', fontWeight: '700' }}> gil.hameever@gmail.com</a> - אני כאן בשבילך.
            </p>
          </div>
        </div>
      </section>

      {/* Personal Message */}
      <section className="container">
        <h2 className="section-title">💬 בנימה אישית…</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            אולי את לא מכירה אותי עדיין, אבל אני מניחה שאם הגעת עד לכאן,
            גם לך מאתגר בגיל המעבר.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            הגוף משתנה, הראש לא תמיד משתף פעולה, והלב… מתגעגע למישהי שהיית פעם.
            זו שהייתה מלאה באנרגיה, ביטחון וחיוך.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            וגם אני הייתי שם. בלילות בלי שינה, בבקרים בלי חשק,
            בתחושה הזו שאף אחד לא באמת מבין מה עובר עליי.
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', margin: '30px 0' }}>
            ואז, מתוך כל הבלגן הזה, כתבתי את הספר הזה - בשבילי, ובשבילך.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
            לא תיאוריה. לא הרצאה. לא עוד "מדריך הורמונים".
            אלא דרך אמיתית, עם לב אמיתי, של אישה אמיתית שעוברת את זה באמת. בדיוק כמוך.
          </p>
        </div>

        <img src="https://i.imghippo.com/files/nFd7953alM.jpg" alt="לא גברת גיבורה" className="premium-image" />

        <div className="content-box" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h3 style={{ color: '#E91E8C', fontSize: '2rem', marginBottom: '20px' }}>
            בספר הזה אני מגלה לך
          </h3>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8' }}>
            איך עברתי מהישרדות להתחדשות,<br />
            איך חזרתי להרגיש חיה, נאהבת ונחשקת,<br />
            ואיך כל זה קרה בלי טיפול קסם, ובלי לאבד את עצמי בדרך.
          </p>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1a202c', marginTop: '30px' }}>
            ועכשיו, אני רוצה לתת לך את כל זה.
          </p>
        </div>
      </section>

      {/* What You'll Feel */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">📈 מה תרגישי אחרי הקריאה?</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💡</div>
              <h3>תביני סופסוף</h3>
              <p>מה עובר עלייך - בלי אשמה, ובלי פחד</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤗</div>
              <h3>תרגישי פחות לבד</h3>
              <p>ויותר בטוחה בעצמך</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🗺️</div>
              <h3>תדעי איך להתמודד</h3>
              <p>עם השינויים בגוף ובנפש</p>
            </div>
          </div>

          <div className="content-box" style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#E91E8C' }}>
              ובעיקר - תזכרי שוב מי את, מתחת לכל הרעש
            </p>
            <p style={{ fontSize: '1.1rem', marginTop: '20px', color: '#4a5568' }}>
              כל זה - בקריאה קלילה, אישית, ונוגעת.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container" style={{ padding: '100px 20px' }}>
        <div className="content-box" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(233, 30, 140, 0.05) 0%, rgba(181, 101, 216, 0.05) 100%)', padding: '60px 40px' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#E91E8C', marginBottom: '25px' }}>
            💝 הגיע הרגע שלך
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '30px' }}>
            אם הגעת עד לכאן, כנראה שהלב שלך כבר מרגיש שזה הזמן שלך.<br />
            זה לא סתם עוד ספר. <strong style={{ color: '#E91E8C' }}>זו דלת פתוחה - אל עצמך.</strong>
          </p>
          
          <h3 style={{ fontSize: '2rem', margin: '40px 0 20px', color: '#1a202c' }}>
            "לא גברת, גיבורה!"<br />
            <span style={{ fontSize: '1.5rem', color: '#4a5568' }}>סיפור מסע אל גיל הַמֵעֵבֶר</span>
          </h3>
          
          <p style={{ fontSize: '1.2rem', margin: '30px 0', lineHeight: '1.7' }}>
            ספר מרגש, חכם ומחבק, שמחזיר לך את הקול הפנימי והחיוך.<br />
            💬 יחד עם מפת הדרכים, והבונוסים, זו לא רק קריאה. זה מסע לחיים חדשים.
          </p>

          <div style={{ background: 'white', padding: '40px', borderRadius: '20px', margin: '40px 0', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E91E8C', marginBottom: '15px' }}>
              ⏳ לזמן מוגבל בלבד
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a202c', margin: '20px 0' }}>
              52 ₪ בלבד
            </p>
            <p style={{ fontSize: '1.2rem', color: '#4a5568' }}>
              (במקום 97 ₪)
            </p>
            <p style={{ fontSize: '1.1rem', marginTop: '15px', color: '#4a5568' }}>
              כולל את כל הבונוסים בשווי מאות שקלים!
            </p>
          </div>

          <a href="#" className="cta-button" style={{ fontSize: '1.4rem', padding: '22px 55px', marginTop: '20px' }}>
            ❤️ כן, אני בוחרת בעצמי - רוצה את הספר!
          </a>

          <p style={{ fontSize: '1.1rem', marginTop: '30px', color: '#4a5568' }}>
            אל תחכי לרגע מושלם. הרגע המושלם הוא עכשיו.
          </p>
        </div>

        <img src="https://i.imghippo.com/files/nVGE7003zGA.jpg" alt="התחילי עכשיו" className="premium-image" style={{ marginTop: '50px' }} />
      </section>

      {/* Not For Everyone */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">❌ הספר הזה לא מתאים לכולן - וזה בסדר</h2>
          
          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '15px' }}>
              הוא לא מדריך רפואי.<br />
              הוא לא ספר עצות מהמדף.<br />
              והוא לא כתוב בשפה פורמלית של "מומחים".
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', margin: '25px 0' }}>
              אם את מחפשת תיאורים קליניים, הורמונים וגרפים - זה פשוט לא הספר עבורך.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              אם את לא פתוחה להרגיש, לצחוק, לבכות ולפגוש את עצמך מחדש, הספר הזה אולי לא ידבר אלייך.
            </p>
          </div>

          <div className="content-box" style={{ background: 'var(--light-pink)', borderColor: '#E91E8C', marginTop: '30px' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', marginBottom: '20px' }}>
              ✅ אבל אם את מרגישה שהשינוי כבר קורה - בגוף, בלב או בזהות…
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              אם את עייפה מלהיות "חזקה" ורוצה סופסוף להרגיש שמבינים אותך…<br />
              <strong>תני לספר הזה ללוות אותך במסע.</strong>
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p style={{ fontSize: '1.4rem', fontWeight: '700', color: '#E91E8C', marginBottom: '30px' }}>
              💗 הספר הזה נכתב בשבילך
            </p>
            <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
              כי את לא משתגעת. את רק מתעוררת.<br />
              וזה הרגע שלך לחזור לעצמך - באהבה.
            </p>
            <a href="#" className="cta-button">
              💗 אם הלב שלך לוחש "זה הזמן שלי" - תקשיבי לו
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>💌 יצירת קשר</p>
          <p><a href="mailto:gil.hameever@gmail.com">gil.hameever@gmail.com</a></p>
          <p style={{ marginTop: '30px', fontSize: '0.9rem' }}>© 2025 גיל הַמֵעֵבֶר - כל הזכויות שמורות</p>
          <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
            "לא גברת, גיבורה!" - סיפור מסע אל גיל המעבר
          </p>
        </div>
      </footer>
    </div>
  );
}
