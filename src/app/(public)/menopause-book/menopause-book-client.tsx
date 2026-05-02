'use client';

import './menopause-book.css';

export default function MenopauseBookPage() {
  return (
    <div className="menopause-book-landing">
      {/* Introduction Section */}
      <section className="container" style={{ paddingTop: '80px' }}>
        {/* כותרת קטנה */}
        <p style={{ fontSize: '1.2rem', color: '#4a5568', textAlign: 'center', marginBottom: '20px', fontWeight: '600' }}>
          חשבתי שגיל המעבר זה התחלת הסוף, לא האמנתי מה מחכה בצד השני שלו.
        </p>
        
        {/* כותרת בינונית */}
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '40px' }}>
          הספר החדש שיגלה לך את הסוד ב 155 עמודים בלבד:
        </h2>
        
        {/* כותרת גדולה */}
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
            אם את מרגישה שהגוף שלך יוצא משליטה - חם לך, כואב, יבש,
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginTop: '20px' }}>
            אם את עצבנית, עייפה, מדוכאת, ובעיקר... מרגישה לבד,
          </p>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginTop: '20px' }}>
            אם גם את מרגישה שגיל המעבר הפתיע אותך בלי אזהרה מוקדמת,
            שהגוף משתנה, הניצוץ נעלם, המצב רוח עושה סיבובים,
            והתחלת לשאול את עצמך:
          </p>
          
          {/* כותרת בינונית */}
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
          {/* כותרת גדולה */}
          <h2 className="section-title">לא, את לא משתגעת.</h2>
          <p className="section-subtitle">את פשוט עוברת תקופה שכמעט אף אחת לא מדברת עליה בקול רם.</p>

          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              אם את מפחדת שהספירה לאחור התחילה,
              שזמנך הולך ואוזל, שאת כבר לא נהיית צעירה יותר,
              אבל עמוק בפנים עדיין בוערת בך האישה שרוצה להגשים את החיים שתמיד חלמת עליהם,
              אישה שמקרינה ביטחון, שלווה ונראית נטולת גיל,
              הגעת למקום הנכון.
            </p>
          </div>

          <div className="pink-cta-box" style={{ marginTop: '30px' }}>
            <div className="pink-cta-text">
              <div>אני רוצה את הספר <span className="arrow-icon">→→</span></div>
            </div>
          </div>

          {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
          <img src="https://i.imghippo.com/files/JWK4859gIA.jpg" alt="המסע שלי" className="premium-image" />
        </div>
      </section>

      {/* About Inbal Section */}
      <section className="container">
        <h2 className="section-title">היי, אני ענבל דפנה</h2>
        <p className="section-subtitle">אישה באמצע החיים, בדיוק כמוך.</p>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            לפני שנתיים מצאתי את עצמי במקום שאת אולי נמצאת בו עכשיו:
            בלבול, עייפות, ושינויים בגוף ובנפש. לילות בלי שינה, מחשבות של "מה קורה לי? איפה האישה שהייתי?" וזהות שמרגישה כאילו ערבבו לי את הקלפים.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בלילות הארוכים האלה נולד הספר:
            "לא גברת, גיבורה! סיפור מסע אל גיל הַמֵעֵבֶר",
            נולדה הדמות ההומוריסטית עליזה שנקין,
            ונולד בי גם הרצון להיות דולה של נשים בגיל המעבר.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בהכשרתי אני מאמנת אישית ובעלת תואר שני במנהל עסקים (בהצטיינות, בגיל 47  - כן, נכנסתי לכיתה עם סטודנטים בני עשרים ושיחקתי אותה 😉).
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            במקביל אני עובדת כשכירה בתחום טכנולוגי, מתמרנת בין ישיבות, מיילים ומשימות - כמו כולנו.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            כתיבת הספר לימדה אותי שאין בי "משהו מקולקל". יש מעבר.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            כדי לא ללכת לאיבוד, בניתי לעצמי מפת דרכים:
            חוכמת המעבר הנשית - שיטה שמחברת בין הכרה, חמלה, חיבור והתחדשות.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            את מה שעבד לי אני חולקת איתך.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            אני לא מבטיחה ניסים. אני מבטיחה דרך שמחזירה לך את עצמך - צעד אחרי צעד.
          </p>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>לחצי עכשיו על הכפתור וקבלי גישה מיידית לספר ולבונוסים - ממני אלייך, באהבה.</div>
            <div>ענבל ❤️</div>
          </div>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '20px' }}>
          <div className="pink-cta-text">
            <div>ענבל, שלחי לי את הספר <span className="arrow-icon">→→</span></div>
          </div>
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
            היום אני יכולה להגיד לך בוודאות:
          </p>
          
          {/* כותרת גדולה */}
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', margin: '30px 0' }}>
            גיל המעבר הוא לא הסוף<br />
            הוא השער להתחלה חדשה.
          </h2>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginTop: '30px' }}>
            ותוך סוף השבוע הקרוב - תביני סוף סוף מה עובר עלייך, ותרגישי הקלה אמיתית.
            כי את לא צריכה לעבור את זה לבד, ולא צריך חודשים של טיפול כדי להתחיל להרגיש טוב.
            לפעמים מספיק להבין מה באמת קורה, כדי להתחיל לנשום אחרת.
          </p>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>כן, אני רוצה להתחיל לנשום</div>
            <div>בגיל הַמֵעֵבֶר. <span className="arrow-icon">→→</span></div>
          </div>
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
                הן סובלות - גופנית ורגשית.
                קשה להן להירדם, וכשהן סוף סוף נרדמות - הן מתעוררות מזיעות.
                העור יבש, הגוף כואב, מצב הרוח משתנה בלי סיבה.
                הן עולות במשקל, בעיקר בבטן, ומתרחקות מהמראה כי לא נעים להן לראות את מי שהן הפכו להיות.
                עם כל יום שעובר הן קצת יותר עייפות, יותר מתוסכלות, פחות מאושרות.
                לא רק הן סובלות - גם הסביבה שלהן מרגישה את זה.
                הן קוראות לזה "גיל החורבן".
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">✨</div>
              <h3>והסוג השני</h3>
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
              האמת? ההבדל בין שתי הקבוצות האלה לא נמדד בגנטיקה, אלא בהחלטה אחת קטנה:
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a202c', marginTop: '20px' }}>
              להתחיל להשקיע בעצמך עוד היום.
            </p>
            <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
              קבלי הצצה לעוד 20 שנה…
            </p>
          </div>

          {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
          <img src="https://i.imghippo.com/files/vQgE3511aA.jpg" alt="קבלי הצצה לעוד 20 שנה" className="premium-image" />

          <h3 style={{ textAlign: 'center', fontSize: '2rem', color: '#E91E8C', margin: '50px 0 30px' }}>
            באיזה צד את רוצה להיות?
          </h3>

          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              אם את לא רוצה להמשיך לסבול ולהרגיש שהמצב רק מתדרדר,
              זה הרגע שלך להצטרף לצד השני - הצד של הנשים שבוחרות בעצמן.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              הצעד הראשון פשוט:
              לקחת לידייך את הספר הזה ולהגיד לעצמך:
              אני ראויה להרגיש טוב, אני ראויה להיראות טוב, ואני לא מתכוונת לוותר על החיים שלי.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              אני הייתי בדיוק במקום הזה,
              ועכשיו אני כאן כדי להראות לך דרך אחרת.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              עד סוף הדף הקצר הזה,
              אני הולכת לגלות לך את הצעדים הפשוטים שעשו לי את המהפך:
              איך לעבור מהישרדות לפריחה,
              להפסיק לסבול, ולהתחיל לקום כל בוקר עם תשוקה והתרגשות,
              גם אם השיער קצת האפיר או מצאתי עוד קמט בצוואר.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              בלי דיאטות, בלי משטרי ברזל ובלי להעמיד פנים.
              בדף הזה תראי איך הדברים באמת עובדים.
            </p>
          </div>

          <div className="pink-cta-box" style={{ marginTop: '30px' }}>
            <div className="pink-cta-text">
              <div>כן, אני רוצה להפסיק לסבול, ולהתחיל להתרגש <span className="arrow-icon">→→</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="container">
        <h2 className="section-title">לא נולדתי עם כל התשובות</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            הכול התחיל ביום רגיל לגמרי, ברגע אחד קטן הכל בפנים התפרק.
            עמדתי מול המראה, הסתכלתי על עצמי… ופתאום זה היכה בי:
            אני כבר לא אותה אישה. לא בגוף, לא בראש, ובעיקר - לא בלב.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            החיים רצו, הילדים גדלו, הקריירה צלחה,
            אבל אני? הלכתי והתרחקתי מעצמי.
            לאט. בשקט. בלי ששמתי לב.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            הייתי עייפה - לא רק פיזית, אלא עייפה מהחיים.
            מההעמדות פנים, מהצורך להמשיך "להיות בסדר".
            הגוף השתנה.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            גלי חום באמצע ישיבה בעבודה,
            בטן שתפחה פתאום,
            מצב רוח שקופץ בלי אזהרה.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            מול המראה חיכתה לי אישה מוכרת, אבל כבויה.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
            ושאלתי את עצמי:
          </p>
          
          {/* כותרת גדולה */}
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', color: '#E91E8C', margin: '30px 0' }}>
            ככה זה יהיה מעכשיו עד הסוף?
          </h2>
        </div>

        {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
        <img src="https://i.imghippo.com/files/VdIP7833mJY.jpg" alt="הרגע המכונן" className="premium-image" />
      </section>

      {/* Wake-up Call Section */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">ואז, יום אחד, זה קרה</h2>
          
          <div className="content-box">
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              לא דרמה מהסרטים, סתם שיחה רגילה עם חברה טובה.
              היא הביטה בי, נשפה אוויר ואמרה:
            </p>
            <div className="testimonial" style={{ marginTop: '20px' }}>
              <p>
                "תגידי, את אמיתית?
                את שלמדת אימון מנטלי ו־NLP, שעברת אינספור סדנאות של התפתחות אישית,
                ושהלכת בגיל 47 עם ילדים בני עשרים, ללמוד תואר שני במנהל עסקים,
                איך את, מכולן, נפלת ככה לגיל המעבר?
                את?!"
              </p>
            </div>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginTop: '20px', marginBottom: '20px' }}>
              המשפט הזה היה כמו אגרוף בבטן.
              בהתחלה נעלבתי. אחר כך בכיתי. ואז שתקתי.
              ובתוך השקט הזה, נפל לי אסימון ענק.
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', margin: '20px 0' }}>
              אני, שתמיד עזרתי לאחרים להתמודד עם משברים,
              לא ידעתי להתמודד עם זה שלי.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              נזכרתי בכל הכלים שלי,
              הם לא נעלמו, רק נשכחו.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              והבנתי שגיל המעבר הוא לא חולשה. הוא קריאה להתעורר.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              באותו רגע החלטתי.
              אני הולכת להבין את זה לעומק. באמת.
              אני לא רוצה רק "לעבור את זה",
              אני רוצה לפרוח! דווקא בגיל הזה!
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              החלטתי להפוך את גיל המעבר להזדמנות.
              במקום לפחד ממנו - ללמוד אותו.
              במקום להילחם בו - להתחבר אליו.
              ובמקום להיעלם - להחזיר לעצמי את הניצוץ.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              יצאתי למסע.
              לא ניו-אייג', לא סיסמאות.
              מסע אמיתי.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              חקרתי, קראתי, דיברתי עם נשים, הקשבתי למומחים,
              בלילות כשגלי חום העירו אותי, כתבתי לעצמי תובנות,
              ולאט לאט, מתוך כל הכאב, התסכול והשאלות,
              נולדה בי שיטה.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              פשוטה, עמוקה, נשית,
              שיטה שעבדה.
              שיטה שהחזירה לי את השקט, האנרגיה והביטחון.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              אני קוראת לה "חוכמת המעבר הנשית".
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              והיום, אחרי מאות שעות של כתיבה, מחקר ושיחות עם נשים,
              אני יכולה לומר לך בלב שלם,
              הספר הזה הוא לא עוד ספר. הוא שליחות.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9', marginBottom: '20px' }}>
              מאז שכתבתי את הספר, מאות נשים סיפרו לי שהן ישנות טוב יותר, רגועות יותר, וחזרו להרגיש יפות - מבפנים החוצה.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.9' }}>
              כי כשאת לומדת להקשיב לגוף שלך,
              משהו עמוק בתוכך נרגע,
              והחיים מתחילים לזרום אחרת.
            </p>
          </div>

          <div className="pink-cta-box" style={{ marginTop: '30px' }}>
            <div className="pink-cta-text">
              <div>כן, אני רוצה לישון טוב ולהרגיש טוב <span className="arrow-icon">→→</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Groups Section */}
      <section className="container">
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בכל יום אני רואה נשים בקבוצות פייסבוק
            שכותבות על עייפות, ייאוש, חרדות, שינה טרופה, עלייה במשקל, על כאבים בכל הגוף...
            ואני רוצה לצעוק להן:
          </p>
          
          {/* כותרת גדולה */}
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', color: '#E91E8C', margin: '30px 0' }}>
            "זה לא הסוף שלך!<br />
            את לא שבורה,<br />
            את רק מתחילה מחדש."
          </h2>
          
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginTop: '30px', marginBottom: '20px' }}>
            תוך 48 שעות את יכולה לעבור מהישרדות לשקט פנימי.
            זה לא קסם, זו הבנה - וברגע שהיא מגיעה, הכול משתנה.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            כל מה שגיליתי והבנתי בדרך שלי, נמצא עכשיו בין הדפים של הספר הזה.
            כדי שאת לא תצטרכי לעבור את זה לבד, כמו שאני עברתי.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            וזו בדיוק הסיבה שכתבתי את הספר הזה.
            לא כדי להסביר מה זה גיל המעבר,
            אלא כדי להראות לך איך לעבור אותו,
            אבל, לעבור בהצלחה.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
            לצאת מהצד השני עם יותר כוח, ועם חיוך של "אני עוד פה, ואני יותר אני מאי פעם."
          </p>
        </div>

        {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
        <img src="https://i.imghippo.com/files/wMGH1022am.jpg" alt="שלחי לי את הספר" className="premium-image" />

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>שלחי לי את הספר</div>
            <div>לא גברת, גיבורה!</div>
            <div>סיפור מסע אל גיל הַמֵעֵבֶר. <span className="arrow-icon">→→</span></div>
          </div>
        </div>
      </section>

      {/* The Method Section */}
      <section className="container">
        {/* כותרת גדולה */}
        <h2 className="section-title">כך נולדה שיטת חוכמת המעבר הנשית</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            במשך שנתיים חיפשתי פתרונות שיחזירו לי את האיזון,
            אבל רק כשהפסקתי לחפש "תיקון", והתחלתי להקשיב,
            נולדה בי התובנה ששינתה הכול.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            הבנתי שגיל המעבר הוא לא שיבוש הורמונלי שצריך לשרוד,
            אלא תהליך אבולוציוני של הנפש והגוף.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            תקופה שבה אישה מתבקשת לעצור, להקשיב לעצמה מחדש,
            ולהיזכר בכוח הפנימי שקבור עמוק מתחת לשכבות של שנות נתינה, עמידה בציפיות, והשתקה עצמית.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
            כך נולדה חוכמת המעבר הנשית - שיטה פשוטה, עדינה וחכמה,
            שמאחדת בין גוף, נפש ורוח,
            ומחזירה לאישה את השליטה, החמלה והאהבה לעצמה.
          </p>
        </div>

        <div className="testimonial" style={{ marginTop: '40px' }}>
          <p>
            "גיל המעבר הפחיד אותי. הרגשתי שזה הסוף של כל מה שאני מכירה. אבל הספר הזה הפך את הפחד לסקרנות. כל פרק הרגיש כמו הזמנה להסתכל על עצמי בעיניים טובות."
          </p>
          <div className="testimonial-author">דליה, 57, יועצת חינוכית</div>
        </div>

        {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
        <img src="https://i.imghippo.com/files/ZgTd3833IX.jpg" alt="הוכחה חברתית - דליה" className="premium-image" />

        {/* כותרת גדולה */}
        <h2 className="section-title" style={{ marginTop: '50px' }}>למה השיטה הזו עובדת</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בניגוד לגישות שמנסות "לתקן" את מה שההורמונים "הרסו",
            השיטה הזו מבוססת על הבנה אחת מהפכנית:
          </p>
          <p style={{ fontSize: '1.3rem', fontWeight: '700', textAlign: 'center', color: '#E91E8C', margin: '30px 0' }}>
            את לא צריכה להילחם במה שמשתנה.<br />
            את צריכה ללמוד לעבוד יחד איתו.
          </p>
          
          <ul className="icon-list">
            <li>✨ היא עובדת עם הגוף שלך, לא נגדו.</li>
            <li>✨ היא מדברת בשפה של הלב, לא של הורמונים.</li>
            <li>✨ והיא נותנת מפת דרכים רגשית ומעשית,
            שתחזיר לך בהדרגה את התחושה של יציבות, שמחה וביטחון.</li>
          </ul>
        </div>

        {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
        <img src="https://i.imghippo.com/files/yzRf6253qms.jpg" alt="ארבעת היסודות" className="premium-image" />

        <div className="testimonial" style={{ marginTop: '40px' }}>
          <p>
            "הספר הזה תפס אותי בדיוק ברגע שבו הרגשתי שאני הולכת לאיבוד. כל מילה הרגישה כאילו נכתבה עליי, בלי ליפות כלום. צחקתי, בכיתי, ונשמתי לרווחה. פתאום הבנתי שאני לא צריכה 'לחזור להיות מי שהייתי', אלא להתחיל לאהוב את מי שאני עכשיו."
          </p>
          <div className="testimonial-author">ורד, 52, מנהלת משאבי אנוש</div>
        </div>

        {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
        <img src="https://i.imghippo.com/files/Qir9600kY.jpg" alt="הוכחה חברתית - ורד" className="premium-image" />

        {/* כותרת גדולה */}
        <h2 className="section-title" style={{ marginTop: '50px' }}>ארבעת היסודות של חוכמת המעבר הנשית</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            השיטה בנויה מארבעה שלבים פשוטים, שכל אחת יכולה ליישם בקצב שלה, ומבוססים על ארבעת חלקי הספר, שהם ארבע תחנות במסע ההתעוררות שלך:
          </p>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">1️⃣</div>
            <h3>הכרה</h3>
            <p>להבין מה באמת עובר עלייך, בגוף ובנפש</p>
            <p style={{ fontSize: '0.95rem', marginTop: '10px', color: '#4a5568' }}>
              בשלב זה, את מפסיקה לנחש ולפחד, ומבינה סופסוף מה הגוף שלך מנסה להגיד לך.
              ברגע שאת מבינה - הפחד יורד, והשקט חוזר.
            </p>
          </div>
          <div className="step">
            <div className="step-number">2️⃣</div>
            <h3>חמלה</h3>
            <p>להפסיק להילחם בעצמך, ולהתחיל לבחור בך</p>
            <p style={{ fontSize: '0.95rem', marginTop: '10px', color: '#4a5568' }}>
              במקום לשפוט את עצמך על עייפות, שינויים במראה או מצב רוח,
              תלמדי לנשום, לסלוח, ולתת לגוף זמן.
              זו לא חולשה - זו חכמה.
            </p>
          </div>
          <div className="step">
            <div className="step-number">3️⃣</div>
            <h3>חיבור</h3>
            <p>להתחבר לגוף שלך, לקול שלך, ולנשים אחרות</p>
            <p style={{ fontSize: '0.95rem', marginTop: '10px', color: '#4a5568' }}>
              תלמדי להקשיב לגוף שלך דרך תנועה, נשימה, שגרה חדשה וקהילה תומכת.
              כשאת מתחברת לעצמך, הכול מסתדר: הזוגיות, העבודה, האנרגיה.
            </p>
          </div>
          <div className="step">
            <div className="step-number">4️⃣</div>
            <h3>התחדשות</h3>
            <p>לבנות את הפרק הבא בחייך עם ביטחון ומשמעות</p>
            <p style={{ fontSize: '0.95rem', marginTop: '10px', color: '#4a5568' }}>
              ברגע שאת נרגעת ומתחברת, מתפנה מקום לדברים חדשים:
              חלומות, השראה, שמחה, תשוקה - לחיים עצמם.
              זו כבר לא את של פעם - זו את, בגרסה הטובה ביותר שלך.
            </p>
          </div>
        </div>

        <div className="content-box" style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', textAlign: 'center', fontStyle: 'italic' }}>
            זו לא תיאוריה.<br />
            זו דרך חיים.<br />
            דרך שנולדה מתוך הכאב, הבלבול, והלילות הארוכים של אישה אחת (אני), שגילתה איך להפוך את גיל המעבר להזמנה לחיים חדשים.
          </p>
        </div>

        <div className="testimonial" style={{ marginTop: '40px' }}>
          <p>
            "קראתי את הספר בלילה אחד. היה בי כל כך הרבה שקט אחר כך, כאילו מישהי סופסוף אמרה את מה שאני מרגישה כבר שנים וסופסוף הבנתי שזה לא רק אצלי."
          </p>
          <div className="testimonial-author">רונית, 55, עצמאית בתחום העיצוב</div>
        </div>

        {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
        <img src="https://i.imghippo.com/files/yiR2848.jpg" alt="הוכחה חברתית - רונית" className="premium-image" />

        {/* כותרת גדולה */}
        <h2 className="section-title" style={{ marginTop: '50px' }}>מה יוצא לך מהשיטה הזו?</h2>
        
        <div className="content-box" style={{ background: 'var(--light-pink)', borderColor: '#E91E8C' }}>
          <ul className="icon-list">
            <li>✅ תחזרי להרגיש חיה ונוכחת. לא שקופה ועייפה, לא "בין לבין".</li>
            <li>✅ תדעי איך להתמודד עם השינויים בלי להרגיש אבודה.</li>
            <li>✅ תרגישי שלווה בגוף ויציבות בנפש.</li>
            <li>✅ תחיי עם תחושת כיוון חדשה - ותפסיקי להתנצל על מי שאת.</li>
            <li>✅ ותזכרי: זה לא עוד "פרויקט שיפור עצמי" - זו דרך פשוטה לחזור הביתה לעצמך.</li>
          </ul>
        </div>

        <div className="testimonial" style={{ marginTop: '40px' }}>
          <p>
            "מה שהכי ריגש אותי זה שהספר לא מנסה 'לתקן' אותך. הוא פשוט מזכיר לך שאת בסדר עם השינויים, עם הגלי חום, עם הצחוק באמצע הדמעות.
            מאז שסיימתי אותו, אני מרגישה פחות לבד."
          </p>
          <div className="testimonial-author">מיכל, 46, מנהלת צוות טכנולוגי</div>
        </div>

        {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
        <img src="https://i.imghippo.com/files/XAd4737dHU.jpg" alt="הוכחה חברתית - מיכל" className="premium-image" />
      </section>

      {/* What Makes it Different */}
      <section className="bg-accent">
        <div className="container">
          {/* כותרת גדולה */}
          <h2 className="section-title">מה הופך את הספר הזה לשונה מכל מה שכבר ניסית?</h2>
          
          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              רוב הספרים על גיל המעבר מדברים על תסמינים, הורמונים ופתרונות רפואיים.
              הם נכתבים בשפה קרה, מלאה נתונים, אבל בלי לגעת באמת בלב שלך.
              הספר הזה מדבר אחרת.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💊</div>
              <h3>הוא לא מתיימר לתקן אותך</h3>
              <p>אלא עוזר לך להבין את עצמך</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🗣️</div>
              <h3>הוא לא עוד ספר קריאה</h3>
              <p>הוא שיחה אינטימית, כמו עם חברה טובה</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">💫</div>
              <h3>הוא לא מבטיח ניסים</h3>
              <p>אבל משנה חיים</p>
            </div>
          </div>

          <div className="pink-cta-box" style={{ marginTop: '40px' }}>
            <div className="pink-cta-text">
              <div>שלחי לי את הספר</div>
              <div>לא גברת, גיבורה!</div>
              <div>סיפור מסע אל גיל הַמֵעֵבֶר. <span className="arrow-icon">→→</span></div>
            </div>
          </div>

          <div className="testimonial" style={{ marginTop: '40px' }}>
            <p>
              "לא חשבתי שספר יכול לגרום לי לבכות ולצחוק באותו עמוד. ענבל כותבת כמו חברה חכמה מהשכונה. מדויקת, נוגעת, לא שופטת. אחרי שקראתי, דיברתי עם הילדים שלי אחרת, עם עצמי אחרת, ואפילו עם המראה בבוקר אחרת."
            </p>
            <div className="testimonial-author">דפנה, 51, מזכירה רפואית</div>
          </div>

          {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
          <img src="https://i.imghippo.com/files/foec6644Jyk.jpg" alt="הוכחה חברתית - דפנה" className="premium-image" />

          {/* כותרת גדולה */}
          <h2 className="section-title" style={{ marginTop: '50px' }}>אז מה בדיוק מחכה לך בין הדפים?</h2>
          
          <div className="content-box">
            <ul className="icon-list">
              <li>📘 תובנות וכלים פשוטים שיעזרו לך להבין מה עובר עלייך ולמה זה קורה.</li>
              <li>🌿 פרקים קצרים שקל לקרוא גם כשאת עייפה.</li>
              <li>👩‍🦳 שפה אנושית, בגובה העיניים, בלי הרצאות ובלי שיפוט.</li>
              <li>✨ סיפורים אמיתיים שתרגישי כאילו נכתבו עלייך.</li>
              <li>🗺️ מפת דרכים ברורה שתלווה אותך בכל שלב - מהעומס אל השקט, מהבלבול אל הבהירות.</li>
              <li>🎭 ועליזה שנקין - הדמות ההומוריסטית, שהיא החברה הטובה של כולנו, שתגרום לך לצחוק ולנשום רגע בתוך כל זה.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="container">
        {/* כותרת גדולה */}
        <h2 className="section-title">💥 מחיר השקה לזמן מוגבל: 52 ₪ בלבד</h2>
        
        <div className="testimonial" style={{ marginTop: '40px' }}>
          <p>
            "הדבר הראשון שהרגשתי כשסיימתי לקרוא את הספר היה: אני לא לבד! מיד כשסיימתי חשבתי כבר לאיזה מהחברות שלי הייתי רוצה לתת את הספר במתנה. רציתי לשתף בחוויה. אם אני כבר לא לבד אז שנדבר באותה שפה, בפתיחות על הכל."
          </p>
          <div className="testimonial-author">אסנת, 55, יועצת בתחום החינוך החברתי</div>
        </div>

        {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
        <img src="https://i.imghippo.com/files/uvDs5911b.jpg" alt="הוכחה חברתית - אסנת" className="premium-image" />

        {/* כותרת גדולה */}
        <h2 className="section-title" style={{ marginTop: '50px' }}>📖 למה "גיל הַמֵעֵבֶר"?</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            כי בעיניי, זו לא רק תקופה גופנית.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            זה גיל שבו את נעה מעֵבֶר למה שהכרת:
            מעֵבֶר לדימויים ישנים, מעֵבֶר לשתיקות, מעֵבֶר לתפקידים ששכחת שאת בכלל ממלאת.
            מעֵבֶר למוסכמות, למה ש"את אמורה".
            למי שחשבו שאת ולמי שאת באמת.
            מעֵבֶר לציפיות.
            מעֵבֶר לפשרות.
          </p>
        </div>

        {/* כותרת גדולה */}
        <h2 className="section-title" style={{ marginTop: '50px' }}>מגיע לך מעל ומֵעֵבֶר!</h2>
        
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            מעֵבֶר לכל מה שסיפרו לך, ולכל מה ששכחת לבקש לעצמך..
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            זה גיל של אמת חדשה - חכמה, אותנטית, חיה.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
            ואני כאן כדי ללוות אותך.
          </p>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>כן, אני רוצה את הספר ב־52₪</div>
            <div>לא גברת, גיבורה!</div>
            <div>סיפור מסע אל גיל הַמֵעֵבֶר. <span className="arrow-icon">→→</span></div>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section id="offer" className="bg-accent" style={{ padding: '100px 20px' }}>
        <div className="container">
          {/* כותרת גדולה */}
          <h2 className="section-title">🎁 אז, מה מחכה לך עכשיו בהשקה המיוחדת?</h2>
          
          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              לרגל יום הולדתי ה־52 🎉
              אני מזמינה אותך להצטרף לחגיגה - במחיר סמלי של 52 ₪ בלבד
              (במקום 97 ₪)
              ולקבל ערכת מתנות מלאה בשווי כולל של 596 ₪:
            </p>
            <ul className="icon-list">
              <li>📘 הספר הדיגיטלי המלא – שווי 97 ₪</li>
              <li>💻 גישה מיידית למפת הדרכים למנופאוזית המתחילה – שווי 397 ₪</li>
              <li>👭 קדימות להרשמה למועדון הנשים החדש (נפתח בקרוב) – שווי 52 ₪ לחודש</li>
              <li>🎓 10% הנחה לקורס הדיגיטלי העתידי – שווי ההנחה 50 ₪</li>
              <li>📝 יומן המנופאוזית המתחילה – מתנה בלי מחיר, אבל עם ערך עצום</li>
            </ul>
            <p style={{ fontSize: '1.3rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', marginTop: '30px' }}>
              ✨ כל זה במחיר השקה חד-פעמי של 52 ₪ בלבד ✨
            </p>
          </div>

          <div className="content-box" style={{ marginTop: '30px', background: 'var(--light-pink)' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              ⏳ חשוב לדעת:
              ההטבה זמינה לזמן מוגבל בלבד.
              ברגע שמהדורת ההשקה תסתיים - המחיר והבונוסים ייעלמו.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              זו לא עוד קנייה - זו מתנה לעצמך.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
              כי את לא צריכה לחכות שמישהו "יראה אותך",
              הספר הזה כבר רואה אותך.
            </p>
          </div>

          <div className="testimonial" style={{ marginTop: '40px' }}>
            <p>
              "הספר עורר בי סקרנות, נגע בחששות, ורגשות שלא בהכרח נתתי להם מקום ביומיום שלי. הוא הדגיש את חוסר הידיעה שיש לנו בנושא, את אי הוודאות, את העובדה שאין הכנה מוקדמת לשלב הזה. הדרך שזה נעשה, בהומור גרמה לי להתחבר ופתאום לצחוק על מצבים שהיו רחוקים מהומור."
            </p>
            <div className="testimonial-author">שרית, 53, עצמאית בתחום הפיננסים</div>
          </div>

          {/* תמונה של הוכחה חברתית מסגרת יוקרתית, משדרת אותנטיות */}
          <img src="https://i.imghippo.com/files/IX1442yUg.jpg" alt="הוכחה חברתית - שרית" className="premium-image" />

          <div className="pink-cta-box" style={{ marginTop: '30px' }}>
            <div className="pink-cta-text">
              <div>שלחי לי את הספר</div>
              <div>לא גברת, גיבורה!</div>
              <div>סיפור מסע אל גיל הַמֵעֵבֶר. <span className="arrow-icon">→→</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container">
        <div className="content-box">
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            אני יודעת… את אולי קוראת את זה וחושבת:
            "נשמע יפה, אבל האם זה באמת יעבוד גם בשבילי?"
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            אולי ניסית כבר כל מיני שיטות, ספרים, הרצאות,
            ואת אומרת לעצמך בשקט - "אצלי זה שונה… אולי כבר מאוחר מדי… אולי אני פשוט לא אצליח."
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            בדיוק בגלל זה אני רוצה שתכירי כמה נשים אמיתיות,
            שהיו בדיוק במקום שבו את נמצאת עכשיו -
            עייפות, מבולבלות, סקפטיות,
            ושגילו שמה שנראה כמו סוף, היה רק התחלה.
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9' }}>
            וכך הן כותבות לי:
          </p>
        </div>

        <div className="testimonial" style={{ marginTop: '40px' }}>
          <p>"חשבתי שאחרי גיל 50 זה מדרון חלק עד הסוף... גיליתי שזו קפיצת מדרגה לחיים שתמיד רציתי."</p>
        </div>

        {/* כותרת גדולה */}
        <h2 className="section-title" style={{ marginTop: '50px' }}>💬 מאז שהספר יצא, נשים כותבות לי:</h2>
        
        <div className="content-box">
          <div className="testimonial" style={{ marginTop: '20px', background: 'transparent', border: 'none', padding: '0' }}>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '20px' }}>
              "חשבתי שאני לבד, עד שקראתי אותך."
            </p>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '20px' }}>
              "סוף סוף ספר שמדבר אליי, לא עליי."
            </p>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '20px' }}>
              "לא הפסקתי לבכות ולצחוק בו זמנית. זה הרגיש כמו שיחה עם חברה."
            </p>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>
              "לא ידעתי כמה הייתי צריכה את זה, עד שקראתי."
            </p>
          </div>
        </div>

        {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
        <img src="https://i.imghippo.com/files/rRsV6667Kuo.jpg" alt="המלצות" className="premium-image" />

        <div className="content-box" style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.3rem', lineHeight: '1.9', marginBottom: '30px' }}>
            🌸 אז אם את מוכנה להתחיל את הפרק החדש שלך,
            להפסיק לשרוד ולהתחיל לפרוח,
            זה הרגע שלך.
          </p>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>כן, אני לוקחת רגע לעצמי</div>
            <div>ורוכשת את הספר <span className="arrow-icon">→→</span></div>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="bg-accent">
        <div className="container">
          {/* כותרת גדולה */}
          <h2 className="section-title">💖 למה את חייבת את הספר הזה (עכשיו)</h2>
          
          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              כי אף אחד לא הכין אותך לגיל המעבר,
              אבל אני כבר שם,
              ואני יכולה לקצר לך דרך שעברתי בשנתיים,
              לערב אחד של קריאה שיפקח לך את העיניים.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              כי בעוד רוב הספרים מלמדים מה משתבש בגוף שלך,
              הספר הזה ילמד אותך מה מתעורר בנשמה שלך.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              כי את לא צריכה עוד הרצאה על הורמונים,
              את צריכה מישהי שתבין אותך, תצחיק אותך, ותזכיר לך שאת לא לבד.
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              כי בזמן שכולם מדברים על "משבר",
              את תגידי לעצמך:
            </p>
            
            {/* כותרת גדולה */}
            <h2 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', color: '#E91E8C', margin: '30px 0' }}>
              "זה לא משבר — זו הֲתחלה."
            </h2>
          </div>

          <div className="pink-cta-box" style={{ marginTop: '30px' }}>
            <div className="pink-cta-text">
              <div>ענבל, אני חייבת את הספר הזה (עכשיו) <span className="arrow-icon">→→</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Not Miss Section */}
      <section className="container">
        {/* כותרת גדולה */}
        <h2 className="section-title">למה אסור לך לפספס את ההצעה הזו</h2>
        
        <div className="content-box">
          <ul className="icon-list">
            <li>⏳ כי זו מהדורת ההשקה הראשונה - במחיר סמלי של 52 ₪ בלבד (במקום 97 ₪).</li>
            <li>🎁 כי רק עכשיו את מקבלת בונוסים בשווי 596 ₪ - כולל מפת הדרכים, יומן המנופאוזית, והנחות לקורס עתידי.</li>
            <li>💌 כי זו לא רק הזדמנות לקנות ספר, זו הזדמנות לשנות את איך שאת מרגישה היום.</li>
            <li>💗 כי עוד חודש, כשמישהי תשאל אותך "מה שלומך?",
            תוכלי לענות בפעם הראשונה מזה שנים:
            "אני בטוב. באמת!"</li>
          </ul>
        </div>

        <div className="content-box" style={{ marginTop: '30px', textAlign: 'center', background: 'var(--light-pink)' }}>
          <p style={{ fontSize: '1.3rem', lineHeight: '1.9', marginBottom: '30px' }}>
            🌸 אל תפספסי את ההתחלה החדשה שלך
            כל מה שצריך זה רגע אחד של החלטה.
          </p>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>ענבל, החלטתי.</div>
            <div>אני רוצה את הספר הזה (עכשיו) <span className="arrow-icon">→→</span></div>
          </div>
        </div>

        <div className="content-box" style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            כל מה שנשאר לך לעשות זה 3 צעדים פשוטים 👇
          </p>
          <div className="steps" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="step">
              <div className="step-number">1️⃣</div>
              <h3>לחצי על הכפתור</h3>
              <p>הכפתור הוורוד כאן למטה</p>
            </div>
            <div className="step">
              <div className="step-number">2️⃣</div>
              <h3>מלאי את הפרטים שלך</h3>
              <p>שם, מייל, טלפון, (לב קטן אם בא לך ❤️)</p>
            </div>
            <div className="step">
              <div className="step-number">3️⃣</div>
              <h3>אשרי את התשלום</h3>
              <p>(52 ₪ בלבד) ותוך רגע תקבלי למייל שלך</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
              📘 גישה מיידית לספר
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
              💻 + כל הבונוסים ששמורים למהדורת ההשקה
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', marginTop: '20px' }}>
              ✨ לחצי עכשיו והתחילי את המסע שלך מהישרדות להתחדשות!
            </p>
            <p style={{ fontSize: '1.1rem', marginTop: '10px' }}>
              כי בעוד כמה דקות זה כבר יכול להיות אצלך במייל 💌
            </p>
          </div>
        </div>

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>ענבל, שלחי לי את הספר עכשיו! <span className="arrow-icon">→→</span></div>
          </div>
        </div>

        <div className="content-box" style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', textAlign: 'center', fontStyle: 'italic' }}>
            הספר כתוב בגובה העיניים, בשפה קלילה,
            עם המון הומור, חמלה ודיוק.
            כל פרק הוא צעד קטן בדרך הביתה לעצמך.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-accent">
        <div className="container">
          <h2 className="section-title">🎁 מה את מקבלת ברכישה אחת פשוטה ב־52 ₪ בלבד?</h2>

          <div className="content-box">
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              כדי שהמסע שלך לא יסתיים בדף האחרון,
              אני מזמינה אותך ליהנות ממערכת של בונוסים שנוצרו במיוחד כדי להעמיק, לתמוך ולהמשיך את המסע שלך גם אחרי הקריאה.
            </p>
          </div>

          <div className="bonus-box">
            <h4>💌 הספר הדיגיטלי המלא</h4>
            <ul>
              <li>✔ כתוב בגובה העיניים, עם סיפור אישי, תובנות וכלים פשוטים</li>
              <li>✔ קל לקריאה – גם כשאת עייפה או עמוסה</li>
            </ul>
          </div>

          <div className="bonus-box">
            <h4>💻 בונוס 1:</h4>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
              ✔ גישה מיידית ל"מפת הדרכים למנופאוזית המתחילה"
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
              ✔ כלים, מדריכים, תרגילים וטיפים – ברורים, פשוטים, שימושיים
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
              אף אחת לא הכינה אותך למה שהגוף והנפש עוברים באמצע החיים.
              ולא משנה אם את בתחילת הדרך או עמוק בתוכה.
              המפה הזו תהיה היד שלך על ההגה.
            </p>
            <ul>
              <li>🔹 מבוססת על סולם הצרכים של מסלו</li>
              <li>🔹 כוללת 5 שלבים בסולם - מגוף מתפרק ועד נשמה שמתבהרת</li>
              <li>🔹 בכל שלב תמצאי מדריכים, קבצים להורדה, תרגולים וכלים פרקטיים</li>
              <li>🔹 בשפה פשוטה, בגובה העיניים, עם הומור וחמלה</li>
            </ul>
            <p style={{ fontSize: '1.1rem', marginTop: '15px', fontStyle: 'italic' }}>
              💬 "זו לא רק מפת דרכים. זו יד מושטת מאישה שכבר הייתה שם, ועברה לצד השני."
            </p>
          </div>

          <div className="bonus-box">
            <h4>👭 בונוס 2:</h4>
            <ul>
              <li>✔ הטבה עתידית לחברות במועדון הנשי הסגור</li>
              <li>✔ כשייפתח - את תהיי בראש הרשימה, במחיר בכורה מיוחד</li>
              <li>✔ מקום חם ואינטימי לשתף, ולצמוח יחד.</li>
            </ul>
          </div>

          <div className="bonus-box">
            <h4>🎓 בונוס 3:</h4>
            <ul>
              <li>✔ 10% הנחה אוטומטית לקורס הדיגיטלי העתידי</li>
              <li>✔ מבוסס על הספר, פרקטי, עמוק ומלווה</li>
              <li>✔ הקורס ירחיב את התכנים, ויאפשר לך להפוך את הידע לפרקטיקה יומיומית.</li>
            </ul>
          </div>

          <div className="content-box" style={{ marginTop: '40px', background: 'var(--light-pink)' }}>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              ⏳ כל זה - במחיר השקה של 52 ₪ בלבד
              (לרגל יום הולדתי ה־52 🎉 – במקום 97 ₪)
              כולל גישה מיידית לכל התוכן + אחריות מלאה
            </p>
            <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
              תוך ימים ספורים תרגישי שהחיים חוזרים לזרום, ושהלב שלך נרגע.
              כי השינוי לא מתחיל מבחוץ. הוא מתחיל בתוכך.
            </p>
            <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', marginTop: '20px' }}>
              💗 זו לא עוד קנייה<br />
              זו מתנה לעצמך
            </p>
            <p style={{ fontSize: '1.1rem', textAlign: 'center', marginTop: '10px' }}>
              השפעה שיכולה ללוות אותך שנים<br />
              בפחות ממחיר של קפה ועוגה.
            </p>
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
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '20px' }}>
            💳 התשלום שלך עובר דרך מערכת מאובטחת.
            את מקבלת גישה מיידית, ותחושת ביטחון מהשנייה הראשונה.
          </p>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', marginTop: '30px' }}>
            💗 זו ההתחייבות שלי כאישה, כחברה, וכאחת שכבר הייתה שם.
          </p>
        </div>

        {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
        <img src="https://i.imghippo.com/files/jeLB4454nas.jpg" alt="בטוחה ומוגנת" className="premium-image" />

        <div className="content-box" style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px', textAlign: 'center' }}>
            אז עכשיו, חמודה… 😏
          </p>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.9', marginBottom: '20px' }}>
            אין פה מבחן בגרות. רק שלושה צעדים פשוטים:
          </p>
          <ol style={{ fontSize: '1.15rem', lineHeight: '1.9', marginRight: '30px' }}>
            <li style={{ marginBottom: '15px' }}>את לוחצת על הכפתור הוורוד כאן למטה
              (כן, זה שקורץ לך "לחצי עליי")</li>
            <li style={{ marginBottom: '15px' }}>ממלאה את הפרטים
              שם, מייל, טלפון, (לב קטן אם בא לך ❤️)</li>
            <li style={{ marginBottom: '15px' }}>מאשרת תשלום של 52 ש"ח
              ופוף! הספר והבונוסים אצלך במייל תוך דקה.</li>
          </ol>
          <ul className="icon-list" style={{ marginTop: '30px' }}>
            <li>📘 הספר הדיגיטלי המלא</li>
            <li>💻 מפת הדרכים למנופאוזית המתחילה</li>
            <li>🎁 ועוד מתנות שוות שבאות ישר מהלב (והמוח של אישה בגיל המעֵבֶר).</li>
          </ul>
          <p style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E91E8C', textAlign: 'center', marginTop: '30px' }}>
            ✨ לחצי עכשיו - ותני לעצמך מתנה קטנה עם השפעה ענקית.
          </p>
          <p style={{ fontSize: '1.15rem', textAlign: 'center', marginTop: '15px' }}>
            כי בינינו? הגיע הזמן שתהיי בראש סדר העדיפויות שלך.
          </p>
        </div>

        {/* תמונה עם מסגרת יוקרתית, משדרת פרימיום */}
        <img src="https://i.imghippo.com/files/tcj5932jw.jpg" alt="לחצי עלי" className="premium-image" />

        <div className="pink-cta-box" style={{ marginTop: '30px' }}>
          <div className="pink-cta-text">
            <div>לחצי עלי 😉 <span className="arrow-icon">→→</span></div>
          </div>
        </div>
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
