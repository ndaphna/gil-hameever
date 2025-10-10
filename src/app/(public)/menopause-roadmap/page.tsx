export default function MenopauseRoadmapPage() {
  return (
    <main className="content-wrapper py-8 md:py-12 lg:py-16">
      <article className="space-y-8 md:space-y-10 lg:space-y-12">
        {/* Hero Section */}
        <header className="space-y-8 md:space-y-10">
          <h1 className="leading-tight">מפת הדרכים למנופאוזית <span className="highlight-marker">המתחילה</span></h1>
          
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-pink leading-snug">"למה אני לא <span className="underline-red">מזהה</span> את עצמי יותר?"</h2>
            <h2 className="text-pink leading-snug">"איך הגוף שלי משתגע – בלי שליטה?"</h2>
            <h2 className="text-pink leading-snug">"האם זהו? זה <span className="text-bold-elegant">הסוף</span> של מי שהייתי?"</h2>
          </div>
        </header>

        {/* Opening Section */}
        <section className="space-y-5">
          <h3 className="leading-relaxed">אם השאלות האלו רצות לך בראש, <span className="highlight-marker">את לא לבד.</span></h3>
          <p>
            ברוכה הבאה לשלב בחיים שאף אחד לא הכין אותך אליו באמת: גיל המעבר.
          </p>
          <p>
            אבל בניגוד למה שאמרו לך, זה לא חייב להיות סבל. ובטח שלא הסוף של הנשיות, החיוניות או השלווה שלך. זה יכול להיות דווקא <span className="underline-red">תחילתו של פרק חדש</span>, עוצמתי ומדויק יותר מתמיד.
          </p>
        </section>

        {/* Quote Box */}
        <aside className="quote-box">
          <p className="mb-4 last:mb-0">
            בכניסה לגיל המעבר, <span className="text-bold-elegant">אף אחת לא מקבלת מפה</span>. אין שלט שמכוון ל"שביל גלי החום", אין פנייה שמובילה ל"רחוב אין-לי-חשק", ואין וייז שמתריע: "בעוד 200 מטר - התפרצות רגשית!"
          </p>
          <p>
            אז החלטתי להכין אחת, שתיקח אותך <span className="highlight-gold">יד ביד</span> דרך התחנות שכולנו עוברות, אבל לא תמיד מדברות עליהן.
          </p>
        </aside>

        {/* Maslow Section */}
        <section className="space-y-5">
          <h3 className="leading-relaxed">גיל המעבר הוא לא רק שלב ביולוגי.</h3>
          <p>הוא <span className="highlight-marker">מסע שלם</span>, פנימי וחיצוני.</p>
          <p>
            בהשראת סולם הצרכים של מסלו, המודל שמתאר את השלבים שכל אדם עובר בדרך להגשמה עצמית, יצרתי מפת דרכים לנשים בגיל המעבר.
          </p>
        </section>

        {/* Visual Progress Roadmap */}
        <section className="my-12 md:my-16">
          <h3 className="text-center mb-8">המסע שלך בחמישה שלבים</h3>
          
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{width: '40%'}}></div>
          </div>
          <div className="progress-percentage">40% הושלמו</div>

          {/* Progress Steps */}
          <div className="progress-roadmap mt-12">
            {/* Step 1 - Completed */}
            <div className="progress-step completed">
              <div className="step-circle completed">1</div>
              <div className="progress-line"></div>
              <div className="step-content">
                <h4 className="step-title">הכרה וקבלה</h4>
                <p className="step-description">
                  להבין מה קורה בגוף, לקבל את השינויים ולהכיר בתחושות החדשות.
                </p>
              </div>
            </div>

            {/* Step 2 - Completed */}
            <div className="progress-step completed">
              <div className="step-circle completed">2</div>
              <div className="progress-line"></div>
              <div className="step-content">
                <h4 className="step-title">כלים וטיפול</h4>
                <p className="step-description">
                  לימוד כלים מעשיים וטבעיים להתמודדות עם תסמינים יומיומיים.
                </p>
              </div>
            </div>

            {/* Step 3 - Active */}
            <div className="progress-step active">
              <div className="step-circle active">3</div>
              <div className="progress-line"></div>
              <div className="step-content">
                <h4 className="step-title">שייכות ותמיכה</h4>
                <p className="step-description">
                  חיבור לקהילה תומכת של נשים שעוברות את אותו המסע.
                </p>
              </div>
            </div>

            {/* Step 4 - Pending */}
            <div className="progress-step pending">
              <div className="step-circle pending">4</div>
              <div className="progress-line"></div>
              <div className="step-content">
                <h4 className="step-title">גילוי מחדש</h4>
                <p className="step-description">
                  לגלות מי את עכשיו, מה חשוב לך ולאן את רוצה להגיע.
                </p>
              </div>
            </div>

            {/* Step 5 - Pending */}
            <div className="progress-step pending">
              <div className="step-circle pending">5</div>
              <div className="step-content">
                <h4 className="step-title">פריחה והגשמה</h4>
                <p className="step-description">
                  לחיות את הגרסה החדשה שלך במלוא העוצמה והשלמות.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Description */}
        <section className="space-y-5">
          <p>
            בכל שלב בסולם מופיע צורך אחר: מהגוף שצועק לשינה ולשוקולד, דרך הצורך בביטחון ובשייכות, ועד לתחושת ערך ומשמעות.
          </p>
          <p>
            לכל צורך כזה, תמצאי כאן: כלים, טיפים, מידע רפואי, תרגולים, המלצות, ועוד.
          </p>
          <p>
            את לא חייבת לעבור הכל. רק לדעת שהמפה קיימת. שיש דרך. <span className="text-bold-elegant">שאת לא לבד.</span>
          </p>
          <p>
            המפה מראה לך <span className="underline-red">איפה את עומדת</span>, ולאן את עוד יכולה לעלות.
          </p>
          <p>
            זו התחלה של טיפוס חדש במעלה הסולם האישי שלך.
          </p>
        </section>

        {/* Benefits List */}
        <section className="space-y-5">
          <p className="font-medium">ככל שתתקדמי תגלי:</p>
          <ul className="styled-list space-y-5">
            <li className="flex items-start gap-3">
              <span className="highlight-gold flex-shrink-0 text-xl leading-none mt-1">•</span>
              <span className="flex-1">מה באמת קורה בגוף שלך – בצורה <span className="highlight-marker">ברורה</span>, בלי מונחים מסובכים.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="highlight-gold flex-shrink-0 text-xl leading-none mt-1">•</span>
              <span className="flex-1">איך להתמודד עם תסמינים כמו גלי חום, שינויים במצב הרוח, עייפות וירידה בחשק – בלי לאבד את עצמך.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="highlight-gold flex-shrink-0 text-xl leading-none mt-1">•</span>
              <span className="flex-1">כלים פשוטים וטבעיים שיעזרו לך להחזיר <span className="text-bold-elegant">שליטה, שלווה וביטחון</span> לגוף ולנפש.</span>
            </li>
          </ul>
          <p className="font-medium">
            והכי חשוב – תקבלי אישור להרגיש. להישבר. ואז – <span className="underline-red">לקום חזקה מתמיד</span>, ולהמשיך להגשים את הגרסה החדשה שלך.
          </p>
        </section>

        {/* Closing Section */}
        <section className="space-y-4 md:space-y-5">
          <h2 className="leading-tight">זו לא רק מפת דרכים.</h2>
          <h3 className="leading-relaxed">זו <span className="highlight-gold">יד מושטת</span> – מאישה שכבר הייתה שם, ועברה לצד השני - לגיל הַמֵעֵבֶר.</h3>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <button className="btn btn-primary w-full md:w-auto">
            התחילי את המסע שלך עכשיו
          </button>
        </div>

        {/* Pyramid Navigation */}
        <section className="mt-16 md:mt-20">
          <h2 className="text-center mb-8">סולם הצרכים שלך בגיל המעבר</h2>
          
          <div className="pyramid-container">
            {/* Level 5 - Top */}
            <a href="/members" className="pyramid-level pyramid-level-5">
              <div className="pyramid-content">
                <span className="pyramid-arrow">↗</span>
                <div className="pyramid-text">
                  <div className="pyramid-title">תבונה ותניה</div>
                  <div className="pyramid-status">✨ זמין עכשיו</div>
                </div>
                <span className="pyramid-icon">💎</span>
              </div>
            </a>

            {/* Level 4 */}
            <a href="/about" className="pyramid-level pyramid-level-4">
              <div className="pyramid-content">
                <span className="pyramid-arrow">↗</span>
                <div className="pyramid-text">
                  <div className="pyramid-title">ערך עצמי, משמעות, התעוררות</div>
                  <div className="pyramid-status">🎯 התחילי כאן</div>
                </div>
                <span className="pyramid-icon">⭐</span>
              </div>
            </a>

            {/* Level 3 */}
            <a href="/pricing" className="pyramid-level pyramid-level-3">
              <div className="pyramid-content">
                <span className="pyramid-arrow">↗</span>
                <div className="pyramid-text">
                  <div className="pyramid-title">שייכות, אהבה וחיבור רגשי</div>
                  <div className="pyramid-status">💝 פתוח להצטרפות</div>
                </div>
                <span className="pyramid-icon">❤️</span>
              </div>
            </a>

            {/* Level 2 */}
            <a href="/login" className="pyramid-level pyramid-level-2">
              <div className="pyramid-content">
                <span className="pyramid-arrow">↗</span>
                <div className="pyramid-text">
                  <div className="pyramid-title">ודאות, שקט, ביטחון</div>
                  <div className="pyramid-status">🔐 הירשמי עכשיו</div>
                </div>
                <span className="pyramid-icon">🛡️</span>
              </div>
            </a>

            {/* Level 1 - Base */}
            <a href="/menopause-roadmap" className="pyramid-level pyramid-level-1">
              <div className="pyramid-content">
                <span className="pyramid-arrow">↗</span>
                <div className="pyramid-text">
                  <div className="pyramid-title">הגוף לוחש – אז בואי נקשיב</div>
                  <div className="pyramid-status">📍 את כאן</div>
                </div>
                <span className="pyramid-icon">🌸</span>
              </div>
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}
