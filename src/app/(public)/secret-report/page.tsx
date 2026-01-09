'use client';

import './secret-report.css';

export default function SecretReportPage() {
  return (
    <div className="secret-report-container">
      {/* Cover/Header Section */}
      <section className="book-cover">
        <div className="cover-content">
          <div className="secret-badge">דוח סודי</div>
          <h1 className="book-title">דו״ח המצב הסודי של נשים באמצע החיים</h1>
          <p className="book-subtitle">המדריך שיפחית לך פחד, יכניס סדר לבלגן ההורמונלי - ויחזיר לך שליטה ותקווה כבר השבוע.</p>
          <p className="book-author">מאת ענבל דפנה</p>
          <p className="book-author-sub">מלווה נשים אל גיל המעֵבֶר</p>
          <p className="book-author-sub">(ועליזה שנקין, שתמיד אומרת את מה שכולנו מפחדות לחשוב בקול)</p>
        </div>
      </section>

      {/* Cover Image */}
      <section className="book-content">
        <div className="content-wrapper">
          <div className="cover-image-container">
            <img src="https://i.imghippo.com/files/tVTM4079VU.jpg" alt="תמונת שער" className="cover-image" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="book-content">
        <div className="content-wrapper">
          
          {/* מכתב אישי */}
          <section className="book-section">
            <h2 className="section-title">📘 מכתב אישי</h2>
            <div className="content-block">
              <p className="book-paragraph">
                יקרה,
              </p>
              <p className="book-paragraph">
                אם פתחת את הדו״ח הזה, סימן שמשהו אצלך מבקש להבין, להירגע, לקבל תשובות.
              </p>
              <p className="book-paragraph">
                ואני רוצה שתדעי דבר אחד כבר עכשיו: את לא לבד, ולא השתגעת.
              </p>
              <p className="book-paragraph">
                גיל המעבר הוא לא רק הורמונים. הוא רעידת אדמה קטנה בכל תחומי החיים.
              </p>
              <p className="book-paragraph">
                ואף אחת לא הכינה אותנו לזה. אף אחד לא נתן לנו מפה.
              </p>
              <p className="book-paragraph">
                אני זוכרת את הלילה שבו התעוררתי שטופת זיעה, מבוהלת, בלי להבין מה קורה לי.
              </p>
              <p className="book-paragraph">
                אני זוכרת את התקופה שבה הגוף השתנה לי מול העיניים, ואת הפחד ששאל בשקט:
              </p>
              <p className="book-paragraph">
                "אז מה עכשיו? זה הסוף של התקופה הטובה שלי?"
              </p>
              <p className="book-paragraph">
                הייתי מבולבלת, מוצפת, והתביישתי לשאול שאלות.
              </p>
              <p className="book-paragraph">
                לא הבנתי מה קשור להורמונים ומה קשור לנפש.
              </p>
              <p className="book-paragraph">
                ומה מופיע סתם כי – החיים...
              </p>
              <p className="book-paragraph">
                אז עשיתי מה שאני יודעת לעשות:
              </p>
              <p className="book-paragraph">
                אספתי ידע. חיברתי סיפורים. שאלתי נשים. דיברתי עם מומחיות.
              </p>
              <p className="book-paragraph">
                ובעיקר - עברתי את זה על בשרי.
              </p>
              <p className="book-paragraph">
                והיום, אחרי שנים של בלבול שהפך לבהירות,
              </p>
              <p className="book-paragraph">
                כתבתי את הדו״ח הזה כדי לתת לך מה שאני הכי רציתי שיהיה לי בתחילת המסע:
              </p>
              <div className="highlight-list">
                <p className="book-paragraph">סדר היכן שיש בלאגן</p>
                <p className="book-paragraph">מילים איפה שיש פחד</p>
                <p className="book-paragraph">ידע במקום בושה</p>
                <p className="book-paragraph">תקווה במקום תחושת אובדן</p>
                <p className="book-paragraph">וכלים קטנים שגורמים לימים להיות קלים יותר</p>
              </div>
              <p className="book-paragraph">
                אני מבטיחה לך שעמוד אחרי עמוד, תרגישי שאת חוזרת לעצמך.
              </p>
              <p className="book-paragraph">
                לא לאישה שהיית.
              </p>
              <p className="book-paragraph">
                למי שאת הופכת להיות עכשיו.
              </p>
              <p className="book-paragraph">
                ענבל 💛
              </p>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה אומרת:</p>
                  <p className="aliza-quote-text">"מאמי… אם הייתי מקבלת דו״ח כזה בגיל 47, הייתי חוסכת שני ויכוחים, שלושה לילות ללא שינה וחצי חבילת פרוזאק."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/JdN3538oKg.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* את לא משתגעת. את מתעוררת. */}
          <section className="book-section">
            <h2 className="section-title">📘 את לא משתגעת. את מתעוררת.</h2>
            <div className="content-block">
              <p className="book-paragraph">
                רוב הנשים בגיל שלנו מספרות אותו דבר:
              </p>
              <ul className="book-list">
                <li>"אני מרגישה שמשהו בי השתבש."</li>
                <li>"הגוף לא מתנהג כמו פעם."</li>
                <li>"אני מוצפת בלי סיבה."</li>
                <li>"אני מתעוררת בלילה בלי להבין למה."</li>
                <li>"אני לא מזהה את עצמי."</li>
                <li>"איבדתי שליטה."</li>
              </ul>
              <p className="book-paragraph">
                והאמת?
              </p>
              <p className="book-paragraph">
                זה לא שאת משתגעת,
              </p>
              <p className="book-paragraph">
                זה הגוף שלך שעובר שינוי עמוק, טבעי, קדום… שאף אחת לא הכינה אותך אליו.
              </p>
              <p className="book-paragraph">
                אף רופא לא הסביר אותו עד הסוף.
              </p>
              <p className="book-paragraph">
                אף חברה לא דיברה עליו.
              </p>
              <p className="book-paragraph">
                והרבה נשים עוברות אותו בשקט, מתוך תחושה שאולי משהו בהן "לא בסדר".
              </p>
              <p className="book-paragraph">
                הגיע הזמן לשים לדבר הזה סוף.
              </p>
              <p className="book-paragraph">
                כי האמת המדעית (והמרגיעה) היא זו:
              </p>
              <div className="check-list">
                <p className="book-paragraph">✔️ את נכנסת לתהליך הורמונלי מתמשך</p>
                <p className="book-paragraph-indent">לא ביום אחד. לא "בום".</p>
                <p className="book-paragraph-indent">זה קורה לאט, בגלים, לפעמים במשך שנים.</p>
                <p className="book-paragraph">✔️ המוח, הגוף והרגש מגיבים בעוצמות</p>
                <p className="book-paragraph-indent">זה לא "אופי", לא "חולשה", לא "רגישות יתר".</p>
                <p className="book-paragraph-indent">זו ביו־כימיה. זו פיזיולוגיה. זו אבולוציה.</p>
                <p className="book-paragraph">✔️ וזה קורה בדיוק בתקופה בחיים שבה המון עומסים מצטברים</p>
                <p className="book-paragraph-indent">ילדים מתבגרים, עבודה תובענית, זוגיות שעוברת שינויים, הזדקנות של הורים,</p>
                <p className="book-paragraph-indent">ועייפות של עשורים של תפקוד בלתי פוסק.</p>
              </div>
              <p className="book-paragraph">
                והשילוב בין השניים - הוא מה שיוצר את "הבלגן".
              </p>
              <p className="book-paragraph">
                בדיוק בגלל זה הכנתי לך את הדו״ח הזה:
              </p>
              <p className="book-paragraph">
                כדי להפוך את הבלבול ליידע, את הפחד לשליטה, ואת חוסר הוודאות לשקט.
              </p>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה מתערבת:</p>
                  <p className="aliza-quote-text">"בקיצור? זה לא את. זה האסטרוגן שלך שיוצא לחופשת יום כיף בלי להודיע מראש."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/ET7505VTI.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* מה באמת קורה בגוף */}
          <section className="book-section">
            <h2 className="section-title">📘 מה באמת קורה בגוף (בשפה ברורה ומרגיעה)</h2>
            <div className="content-block">
              <p className="book-paragraph">
                בואי נעשה סוף לבלגן המושגים.
              </p>
              <p className="book-paragraph">
                במשך שנים לימדו אותנו ש"יום אחד" נכנסים לגיל המעבר וזהו.
              </p>
              <p className="book-paragraph">
                אבל האמת? זה תהליך שנמשך 4–12 שנים, וכל שלב בו מרגיש אחרת.
              </p>
              <p className="book-paragraph">
                וזה מה שקורה בפנים, מאחורי הקלעים:
              </p>
              
              <h3 className="subsection-title">🌿 1. אסטרוגן - המנצח של התזמורת</h3>
              <p className="book-paragraph">
                זה ההורמון שדואג ל־
              </p>
              <ul className="book-list">
                <li>שינה טובה</li>
                <li>מצב רוח יציב</li>
                <li>עור גמיש</li>
                <li>אנרגיה</li>
                <li>זיכרון</li>
                <li>חשק מיני</li>
                <li>ורוגע כללי</li>
              </ul>
              <p className="book-paragraph">
                כשהוא מתחיל "לרדת במדרגות",  זה לא קורה בצורה חלקה.
              </p>
              <p className="book-paragraph">
                הוא יורד, עולה, מתנדנד, עושה סלט.
              </p>
              <p className="book-paragraph">
                ולכן את מרגישה שהכל מתנדנד איתו.
              </p>

              <h3 className="subsection-title">🌿 2. פרוגסטרון - ההורמון המרגיע</h3>
              <p className="book-paragraph">
                הוא אחראי לשלווה, לשינה העמוקה וליכולת "לא לקחת הכל ללב".
              </p>
              <p className="book-paragraph">
                אבל הוא…
              </p>
              <p className="book-paragraph">
                מתחיל לרדת ראשון.
              </p>
              <p className="book-paragraph">
                לפעמים כבר מאמצע שנות ה־30.
              </p>
              <p className="book-paragraph">
                כשהפרוגסטרון נמוך:
              </p>
              <ul className="book-list">
                <li>השינה נפגעת</li>
                <li>יש יותר עצבות</li>
                <li>יותר רגישות</li>
                <li>פחות סבלנות</li>
                <li>ויותר "מה נהיה ממני?!"</li>
              </ul>

              <h3 className="subsection-title">🌿 3. קורטיזול - הורמון הסטרס</h3>
              <p className="book-paragraph">
                הוא עולה בגלל עומסים, שינויים ושינה לא רציפה.
              </p>
              <p className="book-paragraph">
                והוא זה שהופך הכל קצת יותר דרמטי ממה שהוא באמת.
              </p>
              <p className="book-paragraph">
                שימי לב:
              </p>
              <p className="book-paragraph">
                רוב הנשים חושבות "אני בהתקף חרדה"
              </p>
              <p className="book-paragraph">
                אבל למעשה זה קומבינציה של אסטרוגן ↓ + קורטיזול ↑.
              </p>

              <p className="book-paragraph">
                בקיצור?
              </p>
              <p className="book-paragraph">
                הגוף שלך עובד שעות נוספות.
              </p>
              <p className="book-paragraph">
                הוא לא נגדך - הוא מנסה לאזן מחדש.
              </p>
              <p className="book-paragraph">
                והדו״ח הזה יעזור לך להבין בדיוק איך לחזור לשקט.
              </p>

              {/* Hormones Infographic */}
              <div className="hormones-infographic-container">
                <div className="hormones-infographic">
                  <h2 className="hormones-infographic-title">איך שלושת ההורמונים משפיעים עלייך</h2>
                  
                  <div className="hormones-infographic-content">
                    <div className="hormones-effects-column">
                      <div className="hormone-effect-item">
                        <div className="hormone-effect-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#d97e6e" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                            <line x1="9" y1="9" x2="9.01" y2="9"/>
                            <line x1="15" y1="9" x2="15.01" y2="9"/>
                          </svg>
                        </div>
                        <span>מצב רוח</span>
                      </div>
                      
                      <div className="hormone-effect-item">
                        <div className="hormone-effect-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#d97e6e" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            <path d="M16 12l-1-1-1 1" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>שינה</span>
                      </div>
                      
                      <div className="hormone-effect-item">
                        <div className="hormone-effect-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#d97e6e" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="10" r="3"/>
                            <path d="M12 13v4"/>
                            <path d="M10 15l2 2 2-2"/>
                          </svg>
                        </div>
                        <span>גוף</span>
                      </div>
                      
                      <div className="hormone-effect-item">
                        <div className="hormone-effect-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="#d97e6e" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </div>
                        <span>חשק</span>
                      </div>
                    </div>
                    
                    <div className="hormones-arrow">
                      <svg viewBox="0 0 200 150" fill="none">
                        <path d="M20 75 L140 75 L140 40 L180 75 L140 110 L140 75" 
                              fill="#ffb5a0" 
                              stroke="#ffa18f" 
                              strokeWidth="2"/>
                      </svg>
                    </div>
                    
                    <div className="hormones-column">
                      <div className="hormone-circle">אסטרוגן</div>
                      <div className="hormone-circle">פרוגסטרון</div>
                      <div className="hormone-circle">קורטיזול</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה לוחשת:</p>
                  <p className="aliza-quote-text">"אם בן הזוג שלך היה עושה כזה בלגן הורמונלי, היו מעלים אותו לחדשות."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/BFNr9869MVQ.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* למה זה מרגיש כאילו איבדתי שליטה */}
          <section className="book-section">
            <h2 className="section-title">📘 למה זה מרגיש כאילו איבדתי שליטה?</h2>
            <div className="content-block">
              <p className="book-paragraph">
                אחת התחושות הכי קשות בגיל הזה היא:
              </p>
              <p className="book-paragraph">
                "אני לא אני."
              </p>
              <p className="book-paragraph">
                וזה לא כי משהו "נשבר" אצלך.
              </p>
              <p className="book-paragraph">
                זה בגלל מערכת שאף אחת לא מדברת עליה - המוח ההישרדותי.
              </p>
              <p className="book-paragraph">
                כשיש שינויים הורמונליים, המוח ההישרדותי (המוח העתיק שלנו) …
              </p>
              <p className="book-paragraph">
                מתעורר.
              </p>
              <p className="book-paragraph">
                נכנס לכוננות.
              </p>
              <p className="book-paragraph">
                מתנהג כאילו יש סכנה.
              </p>
              <p className="book-paragraph">
                גם כשאין.
              </p>
              <p className="book-paragraph">
                לכן את מרגישה לפעמים:
              </p>
              <div className="check-list">
                <p className="book-paragraph">✔️ מוצפת בלי סיבה</p>
                <p className="book-paragraph">✔️ מתקשה להחליט דברים קטנים</p>
                <p className="book-paragraph">✔️ רגישה פי 3</p>
                <p className="book-paragraph">✔️ עם מחשבות קפוצות</p>
                <p className="book-paragraph">✔️ עם מתחים בגוף</p>
                <p className="book-paragraph">✔️ עם "אובר-מודעות" לכל דבר</p>
              </div>
              <p className="book-paragraph">
                וזה טבעי.
              </p>
              <p className="book-paragraph">
                המוח פשוט עובד שעות נוספות כדי להבין מה קורה.
              </p>

              <h3 className="subsection-title">🌿 "שרשרת ההשפעה" - זה כל הסיפור בכמה מילים:</h3>
              <div className="chain-effect">
                <p className="book-paragraph">הורמונים משתנים →</p>
                <p className="book-paragraph">המוח מתקשה לווסת →</p>
                <p className="book-paragraph">מצב הרוח משתנה →</p>
                <p className="book-paragraph">השינה נפגעת →</p>
                <p className="book-paragraph">הגוף מתעייף →</p>
                <p className="book-paragraph">הרגש עולה →</p>
                <p className="book-paragraph">הקושי גדל →</p>
                <p className="book-paragraph">החששות מתחזקים →</p>
                <p className="book-paragraph">השינוי מרגיש כמו סכנה.</p>
              </div>
              <p className="book-paragraph">
                אבל זו לא סכנה.
              </p>
              <p className="book-paragraph">
                זו הסתגלות.
              </p>
              <p className="book-paragraph">
                וזה מה שהדו"ח הזה עושה:
              </p>
              <p className="book-paragraph">
                מחזיר לך פרספקטיבה, מידע ושליטה - במקום שהמוח ינהל את האירוע לבד ויעשה דרמה.
              </p>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה מוסיפה:</p>
                  <p className="aliza-quote-text">"המוח שלי היה על מצב 'חירום לאומי' כל בוקר עד שגיליתי שזה פשוט גיל המעבר. הורדתי כוננות."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/BtS3092Xqc.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* פחד מהעתיד */}
          <section className="book-section">
            <h2 className="section-title">📘 פחד מהעתיד: 6 מחשבות שרצות לכל אישה בגיל הזה</h2>
            <div className="content-block">
              <p className="book-paragraph">
                אם יש משהו שמאחד נשים בגיל 45–55 - זה לא התסמינים.
              </p>
              <p className="book-paragraph">
                זה הפחדים השקטים.
              </p>
              <p className="book-paragraph">
                אלה שלא תמיד אומרים בקול.
              </p>
              <p className="book-paragraph">
                הנה ששת הפחדים הנפוצים ביותר, ואני מבטיחה לך:
              </p>
              <p className="book-paragraph">
                אם חלק מהם שלך - את בנורמה מוחלטת.
              </p>

              <div className="fear-list">
                <div className="fear-item">
                  <h3 className="subsection-title">1. "מה קורה לי?"</h3>
                  <p className="book-paragraph">התחושה שמשהו פנימי משתבש.</p>
                  <p className="book-paragraph">בפועל: זו ביולוגיה + עומס חיים.</p>
                </div>

                <div className="fear-item">
                  <h3 className="subsection-title">2. "מה אם זה רק ילך ויחמיר?"</h3>
                  <p className="book-paragraph">הפחד הכי עמוק: אובדן שליטה.</p>
                  <p className="book-paragraph">האמת:</p>
                  <p className="book-paragraph">רוב התסמינים מתאזנים עם הזמן, במיוחד כשיש ידע וכלים.</p>
                </div>

                <div className="fear-item">
                  <h3 className="subsection-title">3. "מה אם אהיה לבד?"</h3>
                  <p className="book-paragraph">לאו דווקא בזוגיות - לעיתים בדידות רגשית.</p>
                  <p className="book-paragraph">הורמונים משפיעים מאוד על תחושת חיבור ושייכות.</p>
                </div>

                <div className="fear-item">
                  <h3 className="subsection-title">4. "מה אם אני כבר לא אישה מושכת?"</h3>
                  <p className="book-paragraph">תמונת הגוף משתנה, וגם הדימוי העצמי.</p>
                  <p className="book-paragraph">אבל:</p>
                  <p className="book-paragraph">המיניות והנשיות לא נגמרות, הן משנות צורה.</p>
                </div>

                <div className="fear-item">
                  <h3 className="subsection-title">5. "מה אם אני לא אצליח להחזיק את הבית/עבודה/כולם?"</h3>
                  <p className="book-paragraph">עייפות הורמונלית מתערבבת עם "חולשה אישית".</p>
                  <p className="book-paragraph">וזה כל כך לא נכון, זו פשוט תקופת עומס.</p>
                </div>

                <div className="fear-item">
                  <h3 className="subsection-title">6. "מה עם העתיד שלי?"</h3>
                  <p className="book-paragraph">בריאות, כסף, קריירה, זוגיות, משמעות.</p>
                  <p className="book-paragraph">זו תקופה שבה כל השאלות מתעוררות יחד.</p>
                </div>
              </div>

              <p className="book-paragraph">
                ועכשיו החלק החשוב: 
              </p>
              <p className="book-paragraph">
                הפחדים האלה לא אומרים עלייך שאת חלשה.
              </p>
              <p className="book-paragraph">
                הם אומרים שאת אישה.
              </p>
              <p className="book-paragraph">
                אישה באמצע החיים, בתקופה של שינוי פיזי-רגשי עמוק מאוד
              </p>
              <p className="book-paragraph">
                שבעולם שלנו כמעט לא מדברים עליו.
              </p>
              <p className="book-paragraph">
                ואת כאן.
              </p>
              <p className="book-paragraph">
                קוראת.
              </p>
              <p className="book-paragraph">
                לומדת.
              </p>
              <p className="book-paragraph">
                מתמקדת בעצמך.
              </p>
              <p className="book-paragraph">
                זה כבר צעד של אומץ.
              </p>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה מסכמת:</p>
                  <p className="aliza-quote-text">"פחד מהעתיד? ברור. אני לפעמים מפחדת מהעשר דקות הבאות. אבל ידע זה חצי ואליום."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/uhR7497dE.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* האמת המרגיעה */}
          <section className="book-section">
            <h2 className="section-title">📘 האמת המרגיעה: מה מתייצב, מה בשליטה, ומה הפיך</h2>
            <div className="content-block">
              <p className="book-paragraph">
                הפחד הכי עמוק של נשים בגיל הזה הוא:
              </p>
              <p className="book-paragraph">
                "מה אם זה לא ייגמר?"
              </p>
              <p className="book-paragraph">
                אז הנה שלוש האמיתות המרגיעות - מבוססות מחקרים, רופאות מובילות, ומאות עדויות של נשים:
              </p>

              <div className="truth-box">
                <h3 className="subsection-title">✔️ 1. רוב התסמינים מתייצבים</h3>
                <p className="book-paragraph">
                  השינויים ההורמונליים הם גליים, לא ליניאריים.
                </p>
                <p className="book-paragraph">
                  בהתחלה - בלאגן.
                </p>
                <p className="book-paragraph">
                  אחר כך - הגוף מוצא איזון חדש.
                </p>
                <p className="book-paragraph">
                  80% מהנשים מדווחות על שיפור משמעותי תוך שנתיים-שלוש
                </p>
                <p className="book-paragraph-indent">
                  (גם בלי טיפול, רק עם ידע, תוספים, הרגלים והתאמת חיים).
                </p>
              </div>

              <div className="truth-box">
                <h3 className="subsection-title">✔️ 2. המון דברים בשליטה שלך</h3>
                <p className="book-paragraph">
                  לא הכל "הורמונים".
                </p>
                <p className="book-paragraph">
                  חלק עצום מהחוויה תלוי:
                </p>
                <ul className="book-list">
                  <li>בשינה</li>
                  <li>בתזוזה</li>
                  <li>בנשימה</li>
                  <li>בניהול סטרס</li>
                  <li>בתזונה</li>
                  <li>בטיפול ביובש</li>
                  <li>בבדיקות פשוטות</li>
                  <li>ובשחרור של "לתפקד מושלם"</li>
                </ul>
                <p className="book-paragraph">
                  את לא קורבן של הורמונים.
                </p>
                <p className="book-paragraph">
                  את שותפה בתהליך.
                </p>
              </div>

              <div className="truth-box">
                <h3 className="subsection-title">✔️ 3. הרבה מהשינויים - הפיכים</h3>
                <ul className="book-list">
                  <li>ערפל מוחי → ניתן לשיפור משמעותי</li>
                  <li>יובש נרתיקי → פתיר לחלוטין</li>
                  <li>עלייה במשקל → מנוהל שוב ברגע שמבינים את השיטה</li>
                  <li>עצבים/חרדה → קשורים לגלים שפוחתים</li>
                  <li>שינה → מושפעת מהרגלים שניתנים לתיקון</li>
                </ul>
                <p className="book-paragraph">
                  נשים רבות חוזרות לעצמן - ולפעמים אפילו לגרסה יותר טובה שלהן.
                </p>
              </div>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"הפיך? כן מאמי. לא צריך לקנות דירה בקיסריה בשביל להירגע."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/GgI9330noE.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* מפת הזהב */}
          <section className="book-section">
            <h2 className="section-title">📘 מפת הזהב: 6 תחנות שחייבים להבין כדי להחזיר שליטה</h2>
            <div className="content-block">
              <p className="book-paragraph">
                הנה "מפת הדרכים" שלך.
              </p>
              <p className="book-paragraph">
                זו מפה שכל אישה בגיל המעבר צריכה, ומעטות בכלל יודעות שהיא קיימת.
              </p>
              <p className="book-paragraph">
                השינוי שאת חווה נוגע ב־6 צירים עיקריים:
              </p>
              <ul className="book-list">
                <li>שינה – הבסיס לכל יציבות פיזית ורגשית</li>
                <li>רגשות – שינויים נוירולוגיים + עומס חיים</li>
                <li>הגוף – משקל, עור, שיער, יובש, עייפות</li>
                <li>זוגיות – תקשורת, אינטימיות, מרחק</li>
                <li>זהות – "מי אני עכשיו?"</li>
                <li>ביטחון – בריאותי, נפשי, כלכלי</li>
              </ul>
              <p className="book-paragraph">
                בכל תחנה - נתמקד בהבנה + פעולה קטנה.
              </p>
              <p className="book-paragraph">
                זו המפה שתחזיר לך שליטה.
              </p>
            </div>
          </section>

          {/* תחנת השינה */}
          <section className="book-section">
            <h2 className="section-title">📘 תחנת השינה: הבסיס לשקט</h2>
            <div className="content-block">
              <p className="book-paragraph">
                שינה היא "הקורבן הראשון" של גיל המעבר.
              </p>
              <p className="book-paragraph">
                וזה לא גלי החום בלבד - זו שרשרת שלמה.
              </p>
              <p className="book-paragraph">
                מה מפריע לשינה?
              </p>
              <ul className="book-list">
                <li>אסטרוגן נמוך פוגע בוויסות החום</li>
                <li>פרוגסטרון נמוך פוגע בשלווה</li>
                <li>קורטיזול גבוה מעיר מוקדם</li>
                <li>סוכר מאוחר גורם להתעורר בלילה</li>
                <li>חרדה הורמונלית מחמירה הכל</li>
              </ul>
              <p className="book-paragraph">
                מה כן עובד?
              </p>
              
              <div className="tip-box">
                <p className="book-paragraph">🌙 טיפ ערב 1 - "ירידה הדרגתית לאדמה" (20 דקות שמשדרגות את הלילה)</p>
                <p className="book-paragraph-indent">רוב הנשים בגיל המעבר לא מצליחות להירדם לא בגלל שהן "לחוצות", אלא בגלל שהגוף לא קיבל איתות ברור לבלום.</p>
                <p className="book-paragraph-indent">השיטה הזו יוצרת מסלול נחיתה שמרגיע את המוח ההישרדותי ונותן לגוף אישור לישון.</p>
                <p className="book-paragraph-indent">איך עושים את זה בפועל (שלב־אחר־שלב, פשוט):</p>
                <p className="book-paragraph-indent">✔️ 1. מכבות מסכים 40 דקות לפני השינה</p>
                <p className="book-paragraph-indent">זה לא "עוד טיפ רגיל" - זו פיזיולוגיה.</p>
                <p className="book-paragraph-indent">אור מסכים מעכב מלטונין בדיוק בשעה שבה נשים בגיל המעבר זקוקות לו הכי הרבה.</p>
                <p className="book-paragraph-indent">אפשר:</p>
                <p className="book-paragraph-indent">להעביר את הטלפון ל"מצב חושך"</p>
                <p className="book-paragraph-indent">להניח אותו בחדר אחר</p>
                <p className="book-paragraph-indent">לקרוא במקום</p>
                <p className="book-paragraph-indent">או פשוט לשים פודקאסט שקט</p>
                <p className="book-paragraph-indent">✔️ 2. שתיית "משקה נחיתה"</p>
                <p className="book-paragraph-indent">משהו חמים, לא מתוק, לא מעורר, למשל חליטת קמומיל/ ורבנה/ מליסה (מעולות להרגעה).</p>
                <p className="book-paragraph-indent">החום מרגיע את מערכת העצבים ומאותת לקיבה, ללב ולמוח שהיום נגמר.</p>
                <p className="book-paragraph-indent">✔️ 3. רגולציית חום - סוד של נשים בגיל המעבר</p>
                <p className="book-paragraph-indent">גוף חם מדי = קושי להירדם.</p>
                <p className="book-paragraph-indent">גוף קר מדי = הגוף נכנס לדריכות.</p>
                <p className="book-paragraph-indent">אז מה הפתרון?</p>
                <p className="book-paragraph-indent">מקלחת פושרת–חמימה של 2–3 דקות בלבד</p>
                <p className="book-paragraph-indent">לא חמה!</p>
                <p className="book-paragraph-indent">חום עדין מרחיב כלי דם → הגוף מקרר את עצמו → הירדמות קלה יותר.</p>
                <p className="book-paragraph-indent">כרית קירור/קרח רך על החלק האחורי של הצוואר ל־30 שניות.</p>
                <p className="book-paragraph-indent">זה מכבה עומס עצבי.</p>
                <p className="book-paragraph-indent">✔️ 4. אמירה מרגיעה שמסיימת את היום</p>
                <p className="book-paragraph-indent">כן - משפט.</p>
                <p className="book-paragraph-indent">מוכח מחקרית שמוריד עומס קוגניטיבי.</p>
                <p className="book-paragraph-indent">אמרי לעצמך משפט אחד כמו:</p>
                <p className="book-paragraph-indent">"היום הזה הסתיים. אני משחררת אותו."</p>
                <p className="book-paragraph-indent">או:</p>
                <p className="book-paragraph-indent">"הגוף שלי יודע לישון. אני רק עוזרת לו."</p>
                <p className="book-paragraph-indent">✔️ 5. טקס של דקה: "הנחת המחשבות"</p>
                <p className="book-paragraph-indent">כתבי על דף קטן:</p>
                <p className="book-paragraph-indent">דבר אחד שמפריע לך</p>
                <p className="book-paragraph-indent">דבר אחד שתטפלי בו מחר</p>
                <p className="book-paragraph-indent">דבר אחד שעשית היום טוב</p>
                <p className="book-paragraph-indent">זה מפנה את הראש מעומס.</p>
              </div>
              
              <div className="tip-box">
                <p className="book-paragraph">🌙 טיפ ערב 2 - הורדת קורטיזול לפני השינה (התרגיל שעובד תוך 90 שניות)</p>
                <p className="book-paragraph-indent">הבעיה של נשים בגיל המעבר היא לא "רק" הורמונים,</p>
                <p className="book-paragraph-indent">זו העובדה שקורטיזול (הורמון סטרס) גבוה מדי בערב.</p>
                <p className="book-paragraph-indent">התרגיל הזה מפחית אותו בצורה מדידה.</p>
                <p className="book-paragraph-indent">✔️ 1. נשימת 4–6–8 (הפעלת מערכת הרגיעה הטבעית של הגוף)</p>
                <p className="book-paragraph-indent">זו נשימה שמשדרת למוח: "אין סכנה".</p>
                <p className="book-paragraph-indent">וזה מה שגורם לקורטיזול לרדת.</p>
                <p className="book-paragraph-indent">עושים כך:</p>
                <p className="book-paragraph-indent">1️⃣ שאיפה ל־4 שניות</p>
                <p className="book-paragraph-indent">2️⃣ החזקת אוויר ל־6 שניות</p>
                <p className="book-paragraph-indent">3️⃣ נשיפה ל־8 שניות (8 שניות זה המפתח!)</p>
                <p className="book-paragraph-indent">עושים 4–6 חזרות.</p>
                <p className="book-paragraph-indent">לרוב הנשים זה יוצר:</p>
                <p className="book-paragraph-indent">הורדת דופק</p>
                <p className="book-paragraph-indent">הורדת מתח שרירי</p>
                <p className="book-paragraph-indent">שקט פנימי</p>
                <p className="book-paragraph-indent">הכנה טבעית לשינה</p>
                <p className="book-paragraph-indent">✔️ 2. "שחרור כתפיים איטי" - הרגיעה הפיזית הכי אפקטיבית</p>
                <p className="book-paragraph-indent">הכתפיים הן מקום שאליו הגוף שולח סטרס.</p>
                <p className="book-paragraph-indent">שחרור עדין שלהן מוריד עומס מהמוח.</p>
                <p className="book-paragraph-indent">איך עושים:</p>
                <p className="book-paragraph-indent">שאיפה</p>
                <p className="book-paragraph-indent">הרמת כתפיים</p>
                <p className="book-paragraph-indent">נשיפה</p>
                <p className="book-paragraph-indent">ירידה איטית של הכתפיים (5 פעמים)</p>
                <p className="book-paragraph-indent">✔️ 3. "שחרור לסת" - הרבה נשים לא יודעות כמה זה חשוב</p>
                <p className="book-paragraph-indent">כשאנחנו במתח - הלסת קפוצה → היא משדרת למוח: "יש סכנה".</p>
                <p className="book-paragraph-indent">כשהלסת משתחררת → המוח מקבל: "אפשר להירגע".</p>
                <p className="book-paragraph-indent">איך:</p>
                <p className="book-paragraph-indent">לפתוח פה קלות</p>
                <p className="book-paragraph-indent">לתת ללסת "ליפול"</p>
                <p className="book-paragraph-indent">להזיז מצד לצד בעדינות 20 שניות בלבד.</p>
                <p className="book-paragraph-indent">✔️ 4. לסיום - טמפרטורה יציבה בחדר</p>
                <p className="book-paragraph-indent">נשים בגיל המעבר זקוקות לחדר קריר:</p>
                <p className="book-paragraph-indent">18–21 מעלות</p>
                <p className="book-paragraph-indent">(זה מונע התעוררויות פתאומיות.)</p>
              </div>
              
              <div className="tip-box">
                <p className="book-paragraph">✔️ טיפ הבוקר - חשיפה לאור</p>
                <p className="book-paragraph-indent">10 דקות אור בוקר = שיפור של 20% ביכולת להירדם.</p>
              </div>
              
              <div className="tip-box">
                <p className="book-paragraph">✔️ בדיקות שכדאי לעשות</p>
                <p className="book-paragraph-indent">ברזל, B12, ויטמין D, תפקוד בלוטת התריס, סוכר.</p>
              </div>
              
              <div className="tip-box">
                <p className="book-paragraph">🌙 מה כן / מה לא לפני שינה</p>
                <p className="book-paragraph-indent">כדי לעזור לגוף להירגע, לווסת חום, ולהוריד עומס מהמערכת ההורמונלית</p>
                <div className="sleep-tips-grid">
                  <div className="sleep-tips-column">
                    <p className="book-paragraph" style={{ fontWeight: '600', marginBottom: '12px' }}>מה כן לעשות לפני שינה</p>
                    <p className="book-paragraph-indent">🍵 משקה חם ועדין – קמומיל, מליסה</p>
                    <p className="book-paragraph-indent">🛁 מקלחת פושרת קצרה – לא חמה מדי</p>
                    <p className="book-paragraph-indent">💛 נשימת 4–6–8 – מפעילה את מערכת הרגיעה</p>
                    <p className="book-paragraph-indent">🌬️ אוורור החדר ל־2–3 דקות</p>
                    <p className="book-paragraph-indent">📓 כתיבת דקה לפריקת מחשבות</p>
                    <p className="book-paragraph-indent">🌙 אור עמום / תאורה חמה</p>
                    <p className="book-paragraph-indent">🤍 טקס קצר שמסמן סוף יום</p>
                    <p className="book-paragraph-indent">❄️ טמפרטורת חדר 18–21°</p>
                    <p className="book-paragraph-indent">🧴 טיפול יובש עדין (אם רלוונטי)</p>
                    <p className="book-paragraph-indent">💆 שחרור כתפיים או עיסוי צוואר</p>
                  </div>
                  <div className="sleep-tips-column">
                    <p className="book-paragraph" style={{ fontWeight: '600', marginBottom: '12px' }}>מה לא לעשות לפני שינה</p>
                    <p className="book-paragraph-indent">📱 מסכים: טלפון, טאבלט, טלוויזיה - מעכבים מלטונין</p>
                    <p className="book-paragraph-indent">🚿 מקלחת חמה מדי שמעלה חום גוף ומפריעה להירדמות</p>
                    <p className="book-paragraph-indent">⚡ שיחות מלחיצות / פתרון קונפליקטים לקראת השינה</p>
                    <p className="book-paragraph-indent">🍔 אוכל כבד או ארוחות מאוחרות</p>
                    <p className="book-paragraph-indent">🍫 סוכר לפני השינה - גורם ליקיצות ליליות</p>
                    <p className="book-paragraph-indent">💡 אור לבן חזק שמבלבל את המוח</p>
                    <p className="book-paragraph-indent">⏰ גלילה באינסטגרם/מיילים - מעורר עומס</p>
                    <p className="book-paragraph-indent">🔥 חדר חם מדי – מחמיר גלי חום והתעוררויות</p>
                    <p className="book-paragraph-indent">🍷 אלכוהול – נראה שמרגיע, בפועל הורס שינה</p>
                    <p className="book-paragraph-indent">☕ קפאין אחרי 16:00 (גם שוקולד)</p>
                  </div>
                </div>
              </div>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"שינה זה כמו שלום בית - אם לא משקיעים בזה, מישהו יקום באמצע הלילה עצבני."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/PwpH4480fvA.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* תחנת הרגשות */}
          <section className="book-section">
            <h2 className="section-title">📘 תחנת הרגשות: מה קורה למוח שלך בפנים</h2>
            <div className="content-block">
              <p className="book-paragraph">
                אם את בוכה כי אין חלב במקרר, מתעצבנת על הנשימות של מישהו לידך,
              </p>
              <p className="book-paragraph">
                או מרגישה כאילו "משהו בך התרכך ואז התפוצץ" - תקראי:
              </p>
              <p className="book-paragraph">
                זו נורמה הורמונלית.
              </p>
              <p className="book-paragraph">
                אסטרוגן משפיע על:
              </p>
              <ul className="book-list">
                <li>סרוטונין</li>
                <li>דופמין</li>
                <li>ויסות רגשי</li>
                <li>סבלנות</li>
                <li>עיבוד עומס</li>
              </ul>
              <p className="book-paragraph">
                כשהוא יורד → הכל מורגש יותר.
              </p>

              <div className="tip-box">
                <p className="book-paragraph">✔️ דרך מהירה לחזור לקרקע (תוך 20–40 שניות)</p>
                <h3 className="subsection-title">תרגיל "יד על הלב"</h3>
                <p className="book-paragraph">שימי יד אחת על הלב</p>
                <p className="book-paragraph">נשמי 3 נשימות איטיות</p>
                <p className="book-paragraph">אמרי בלב:</p>
                <p className="book-paragraph">"אני עוברת שינוי. אני בטוחה. זה יעבור."</p>
                <p className="book-paragraph-indent">זה מפחית פעילות באיזור הלחץ של המוח (אמיגדלה).</p>
              </div>

              <div className="tip-box">
                <p className="book-paragraph">✔️ "לא כל רגש חייב טיפול"</p>
                <p className="book-paragraph">לפעמים זה פיזי ולא נפשי.</p>
                <p className="book-paragraph">וזה נותן רשות:</p>
                <p className="book-paragraph">לא חייבות להבין הכל, לא חייבות לפתור הכל.</p>
              </div>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"פעם בכמה ימים את פשוט גירסה דרמטית של עצמך. זה עובר. החזיקי מעמד."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/sHYb8665MA.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* תחנת הגוף */}
          <section className="book-section">
            <h2 className="section-title">📘 תחנת הגוף: משקל, בטן, עור, שיער ויובש</h2>
            <div className="content-block">
              <p className="book-paragraph">
                בואי נדבר תכלס.
              </p>
              <p className="book-paragraph">
                גיל המעבר הוא שלב שבו הגוף "מחליף תוכנה".
              </p>
              <div className="tip-box">
                <p className="book-paragraph">✔️ בטן</p>
                <p className="book-paragraph-indent">זה לא שומן קבוע - זה שומן הורמונלי.</p>
                <p className="book-paragraph-indent">הוא מגיב ללחץ, לסוכר ולשינה.</p>
              </div>
              <div className="tip-box">
                <p className="book-paragraph">✔️ עור יבש</p>
                <p className="book-paragraph-indent">אסטרוגן יורד → קולגן יורד → יובש עולה.</p>
                <p className="book-paragraph-indent">זה הפיך עם טיפול.</p>
              </div>
              <div className="tip-box">
                <p className="book-paragraph">✔️ יובש נרתיקי</p>
                <p className="book-paragraph-indent">נפוץ מאוד.</p>
                <p className="book-paragraph-indent">פתיר לחלוטין עם טיפול מקומי.</p>
              </div>
              <div className="tip-box">
                <p className="book-paragraph">✔️ שיער</p>
                <p className="book-paragraph-indent">נשירה / דלדול - זמני, קשור להורמונים ולתזונה.</p>
              </div>
              <div className="tip-box">
                <p className="book-paragraph">✔️ עייפות כרונית</p>
                <p className="book-paragraph-indent">אחד הסימפטומים הכי נפוצים.</p>
              </div>

              <p className="book-paragraph">
                ✔️ מה כן בשליטתך (תכלס)
              </p>
              <ul className="book-list">
                <li>תזוזה קצרה מדי יום</li>
                <li>הפחתת קורטיזול</li>
                <li>טיפולים מקומיים ליובש</li>
                <li>איזון סוכר</li>
                <li>תוספים נכונים</li>
                <li>בדיקות דם</li>
                <li>שינה, שינה ושינה</li>
              </ul>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"הבטן שלי יצאה מהארון בגיל 48. גם היא רצתה חופש."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/BiP4307eg.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* תחנת הזהות */}
          <section className="book-section">
            <h2 className="section-title">📘 תחנת הזהות: מי אני עכשיו?</h2>
            <div className="content-block">
              <p className="book-paragraph">
                הרבה נשים אומרות לי:
              </p>
              <ul className="book-list">
                <li>"אני מרגישה שקופה."</li>
                <li>"אני לא בטוחה מה התפקיד שלי עכשיו."</li>
                <li>"משהו בזהות שלי משתנה."</li>
              </ul>
              <p className="book-paragraph">
                כל השאלות האלה לגיטימיות.
              </p>
              <p className="book-paragraph">
                את מתאזנת מחדש בין:
              </p>
              <ul className="book-list">
                <li>מי שהיית</li>
                <li>מי שהחיים דרשו ממך להיות</li>
                <li>ומי שאת רוצה להיות עכשיו</li>
              </ul>

              <div className="tip-box">
                <p className="book-paragraph">✔️ תרגיל קצר (3 דקות): "מי אני עכשיו?"</p>
                <p className="book-paragraph">כתבי:</p>
                <ul className="book-list">
                  <li>מה כבר לא מתאים לי</li>
                  <li>מה כן מתאים לי</li>
                  <li>מה אני רוצה שיהיה יותר בחיי</li>
                  <li>מה אני רוצה שיהיה פחות</li>
                </ul>
                <p className="book-paragraph">זה מפתח בהירות בלי לחץ.</p>
              </div>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"זהות? מאמי, אני ממציאה את עצמי כל שלושה חודשים. תזרמי."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/AV5169Juw.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* תחנת הזוגיות */}
          <section className="book-section">
            <h2 className="section-title">📘 תחנת הזוגיות: מה השתנה ולמה</h2>
            <div className="content-block">
              <p className="book-paragraph">
                נשים רבות חושבות שהזוגיות "במשבר".
              </p>
              <p className="book-paragraph">
                היא לא.
              </p>
              <p className="book-paragraph">
                היא בהתאמה מחדש.
              </p>
              <p className="book-paragraph">
                שינויים בגוף + תנודות רגשיות + עייפות + עומס =
              </p>
              <p className="book-paragraph">
                הזוגיות עוברת טלטלה.
              </p>

              <div className="tip-box">
                <p className="book-paragraph">✔️ איך מדברים על זה בלי לפגוע</p>
                <p className="book-paragraph">משפט אחד משנה הכל:</p>
                <p className="book-paragraph">"זה לא אתה. זה שינוי פיזיולוגי שאני עוברת. אני רוצה שתהיה איתי בזה."</p>
                <p className="book-paragraph-indent">גברים לא תמיד מבינים - כי אף אחד לא לימד אותם.</p>
              </div>

              <div className="tip-box">
                <p className="book-paragraph">✔️ אינטימיות</p>
                <p className="book-paragraph">חשק עולה ויורד עם ההורמונים.</p>
                <p className="book-paragraph">יובש - בעיה פתירה.</p>
                <p className="book-paragraph">חיבורים חדשים נבנים עם תקשורת, סבלנות וידע.</p>
              </div>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"אם הוא לא מבין, תסבירי. ואם הוא מבין, תחבקי. זה כל הסיפור."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/KDOy7606tM.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* תחנת הביטחון */}
          <section className="book-section">
            <h2 className="section-title">📘 תחנת הביטחון: מה יהיה בעתיד?</h2>
            <div className="content-block">
              <p className="book-paragraph">
                הפחד הכי חזק של נשים בגיל 45–55 הוא:
              </p>
              <p className="book-paragraph">
                פחד מהעתיד.
              </p>
              <ul className="book-list">
                <li>בריאות</li>
                <li>כסף</li>
                <li>קריירה</li>
                <li>זוגיות</li>
                <li>משמעות</li>
                <li>יציבות</li>
              </ul>
              <p className="book-paragraph">
                הכל עולה בבת אחת.
              </p>

              <div className="tip-box">
                <p className="book-paragraph">✔️ האמת: הגוף כן מתאזן</p>
                <p className="book-paragraph-indent">הוא לא "נשבר".</p>
                <p className="book-paragraph-indent">הוא משתנה.</p>
                <p className="book-paragraph-indent">עם ליווי נכון - נשים חוזרות לפרוח.</p>
              </div>

              <div className="tip-box">
                <p className="book-paragraph">✔️ האמת: הקריירה לא נגמרת - היא משתנה</p>
                <p className="book-paragraph-indent">זה גיל מצוין לצמיחה, שינוי או התחדשות מקצועית.</p>
              </div>

              <div className="tip-box">
                <p className="book-paragraph">✔️ האמת: הביטחון חוזר עם ידע</p>
                <p className="book-paragraph-indent">כשאת מבינה מה קורה - הפחד יורד.</p>
              </div>

              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"העתיד? מאמי… את עוד תפתיעי את עצמך."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/CqNa9228CRk.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* 7 מיקרו-פעולות */}
          <section className="book-section">
            <h2 className="section-title">📘 7 מיקרו־פעולות לשקט מיידי</h2>
            <div className="content-block">
              <p className="book-paragraph">
                רוצה להרגיש טוב היום?
              </p>
              <p className="book-paragraph">
                הנה פעולות שעובדות תוך דקות:
              </p>

              <div className="micro-actions">
                <div className="action-item">
                  <p className="book-paragraph">✔️ 1. נשימה 4–6–8</p>
                  <p className="book-paragraph-indent">שאיפה 4 שניות</p>
                  <p className="book-paragraph-indent">החזקה 6</p>
                  <p className="book-paragraph-indent">נשיפה 8</p>
                  <p className="book-paragraph-indent">(מוריד קורטיזול)</p>
                </div>

                <div className="action-item">
                  <p className="book-paragraph">✔️ 2. "מים על הדופק"</p>
                  <p className="book-paragraph-indent">מים קרים על פרקי כף היד</p>
                  <p className="book-paragraph-indent">→ מפחית עומס רגשי</p>
                </div>

                <div className="action-item">
                  <p className="book-paragraph">✔️ 3. "החלפה מהירה"</p>
                  <p className="book-paragraph-indent">קומי, לכי לחדר אחר, שתייה - שינוי מיידי של אזור.</p>
                </div>

                <div className="action-item">
                  <p className="book-paragraph">✔️ 4. "10 צעדונים"</p>
                  <p className="book-paragraph-indent">לא הליכה… צעדונים.</p>
                  <p className="book-paragraph-indent">מעיר את הגוף.</p>
                </div>

                <div className="action-item">
                  <p className="book-paragraph">✔️ 5. "משפט עוגן"</p>
                  <p className="book-paragraph-indent">"אני עוברת שינוי. אני בטוחה. זה זמני."</p>
                </div>

                <div className="action-item">
                  <p className="book-paragraph">✔️ 6. חיבוק עצמי של 20 שניות</p>
                  <p className="book-paragraph-indent">מוריד אדרנלין.</p>
                </div>

                <div className="action-item">
                  <p className="book-paragraph">✔️ 7. כתיבה של דקה</p>
                  <p className="book-paragraph-indent">רשמי על דף: "מה אני מרגישה עכשיו?"</p>
                  <p className="book-paragraph-indent">מנקה עומס.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Checklist בדיקות */}
          <section className="book-section">
            <h2 className="section-title">📘 Checklist: בדיקות שכל אישה חייבת</h2>
            <div className="content-block">
              <p className="book-paragraph">
                נשים רבות לא עושות את הבדיקות החשובות באמת.
              </p>
              <p className="book-paragraph">
                הנה הרשימה המלאה:
              </p>
              <ul className="book-list checklist">
                <li>תפקודי בלוטת התריס</li>
                <li>ויטמין D</li>
                <li>ברזל / פריטין</li>
                <li>B12</li>
                <li>סוכר / A1C</li>
                <li>בדיקות שומנים</li>
                <li>צפיפות עצם</li>
                <li>הורמונים: FSH, LH, Estradiol</li>
                <li>תפקודי כבד</li>
                <li>תפקודי כליות</li>
              </ul>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"תעשי בדיקות. זה לא ביג דיל. וגם יש מזגן במרפאה."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/Csi2115c.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* AI למנופאוזית המתקדמת */}
          <section className="book-section">
            <h2 className="section-title">📘 AI למנופאוזית המתקדמת</h2>
            <div className="content-block">
              <p className="book-paragraph">
                הנה המקום שבו את הופכת את הדו"ח לכלי עבודה.
              </p>

              <div className="ai-prompt-box">
                <p className="book-paragraph">✔️ פרומפט 1 - ניסוח לרופאה</p>
                <p className="book-paragraph">אני אישה בגיל המעבר וחווה תסמינים. עזור לי לנסח פנייה ברורה לרופא/ה</p>
                <p className="book-paragraph">כדי לקבל אבחון נכון:</p>
                <ul className="book-list">
                  <li>— רשימת תסמינים</li>
                  <li>— מה חשוב לבדוק</li>
                  <li>— אילו שאלות עליי לשאול</li>
                </ul>
              </div>

              <div className="ai-prompt-box">
                <p className="book-paragraph">✔️ פרומפט 2 - דף מעקב יומי</p>
                <p className="book-paragraph">צור לי טבלה למעקב יומי אחרי שינה, מצב רוח, תזוזה ותסמינים למשך 14 יום.</p>
              </div>

              <div className="ai-prompt-box">
                <p className="book-paragraph">✔️ פרומפט 3 - תפריט ליום עמוס</p>
                <p className="book-paragraph">תן לי תפריט יומי שמתאים לאישה בגיל המעבר ביום של עייפות:</p>
                <p className="book-paragraph">קל, מהיר, מאוזן, עם אנרגיה יציבה.</p>
              </div>

              <div className="ai-prompt-box">
                <p className="book-paragraph">✔️ פרומפט 4 - משפטים לשיחה זוגית רגישה</p>
                <p className="book-paragraph">עזור לי לנסח שיחה עדינה עם בן הזוג על מה שאני עוברת בגיל המעבר,</p>
                <p className="book-paragraph">בלי האשמות ועם המון רוך.</p>
              </div>
            </div>
          </section>

          {/* Checklist זה גיל המעבר או משהו אחר */}
          <section className="book-section">
            <h2 className="section-title">📘 צ׳ק ליסט: זה גיל המעבר או משהו אחר?</h2>
            <div className="content-block">
              <h3 className="subsection-title">סימנים אופייניים:</h3>
              <ul className="book-list">
                <li>גלי חום</li>
                <li>ערפל מוחי</li>
                <li>עייפות</li>
                <li>רגישות</li>
                <li>יובש</li>
                <li>שינה לא רציפה</li>
                <li>ירידה בחשק</li>
                <li>שינוי במחזור</li>
                <li>עלייה בבטן</li>
                <li>דופק פתאומי</li>
                <li>מצב רוח תנודתי</li>
                <li>קושי בריכוז</li>
              </ul>

              <h3 className="subsection-title">סימנים שכדאי לבדוק רפואית:</h3>
              <ul className="book-list warning-list">
                <li>ירידה קיצונית במשקל</li>
                <li>דימומים כבדים</li>
                <li>כאבים חזקים</li>
                <li>דיכאון עמוק</li>
                <li>דופק לא סדיר</li>
                <li>קשיי נשימה</li>
              </ul>
            </div>
          </section>

          {/* סיכום מעצים */}
          <section className="book-section">
            <h2 className="section-title">📘 סיכום מעצים: את בתחילת הפריחה שלך</h2>
            <div className="content-block">
              <p className="book-paragraph">
                אני רוצה שתזכרי דבר אחד:
              </p>
              <p className="book-paragraph">
                גיל המעבר הוא לא סוף - הוא מעבר.
              </p>
              <p className="book-paragraph">
                והוא לא רק מעבר - הוא מֵעֵבֶר.
              </p>
              <p className="book-paragraph">
                מעבר למי שהיית
              </p>
              <p className="book-paragraph">
                אל מי שאת יכולה להיות עכשיו.
              </p>
              <p className="book-paragraph">
                את אישה חכמה, חושבת, מרגישה, עמוקה.
              </p>
              <p className="book-paragraph">
                והדו״ח הזה הוא רק ההתחלה.
              </p>
              <p className="book-paragraph">
                הפריחה שלך כבר התחילה.
              </p>
              <div className="aliza-with-illustration">
                <div className="aliza-quote">
                  <p className="aliza-text">עליזה:</p>
                  <p className="aliza-quote-text">"מאמי… תתכונני. את עומדת להיות פצצת אנרגיה של גיל 50+."</p>
                </div>
                <div className="illustration-container-small">
                  <img src="https://i.imghippo.com/files/QFO3463Fo.jpg" alt="איור" className="illustration-image-small" />
                </div>
              </div>
            </div>
          </section>

          {/* לסיכום */}
          <section className="book-section summary-section">
            <h2 className="section-title">📘 לסיכום</h2>
            <div className="summary-elegant-box">
              <div className="summary-content">
                <p className="book-paragraph summary-opening">
                  אם הדו״ח הזה נתן לך רגע של בהירות, נשימה עמוקה ושקט פנימי,
                </p>
                <p className="book-paragraph">
                  דעי שזה רק חלק קטן מהדרך שמחכה לך.
                </p>
                <p className="book-paragraph">
                  הספר שלי לוקח את הכול כמה צעדים קדימה: מסע כנה, מצחיק ומרגש אל תוך מה שנשים בגיל המעֵבֶר באמת חוות.
                </p>
                <p className="book-paragraph">
                  מסע שיעזור לך להבין את עצמך, לקבל את עצמך, ולהיזכר בכוח שלך.
                </p>
                <div className="newsletter-invitation">
                  <p className="book-paragraph">
                    ואם את רוצה להיות הראשונה לקבל ממני תובנות, כלים, מחשבות, מחקרים ועדכונים חשובים,
                  </p>
                  <p className="book-paragraph newsletter-highlight">
                    אני מזמינה אותך להצטרף לרשימת התפוצה "גלי השראה" שלי.
                  </p>
                  <p className="book-paragraph">
                    זה המקום שבו אני משתפת דברים שלא מגיעים לאינסטגרם:
                  </p>
                  <p className="book-paragraph">
                    תובנות עמוקות, תמיכה, וטיפים שיכולים להפוך ימים מאתגרים לימים טובים יותר.
                  </p>
                </div>
                <div className="summary-signature">
                  <p className="book-paragraph signature-line">
                    אני כאן איתך,
                  </p>
                  <p className="book-paragraph signature-line">
                    בדרך, בשינוי, ובהתגלות החדשה שלך.
                  </p>
                  <p className="book-paragraph signature-name">
                    ענבל 💛
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>
    </div>
  );
}

