'use client';

import { useEffect } from 'react';
import './menopause-book.css';

export default function MenopauseBookPage() {
  useEffect(() => {
    // Google Fonts
    if (!document.getElementById('mb-fonts')) {
      const link = document.createElement('link');
      link.id = 'mb-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Secular+One&family=Heebo:wght@300;400;700;900&display=swap';
      document.head.appendChild(link);
    }

    // Scroll fade-in
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in, .drop-in').forEach(el => obs.observe(el));

    // FAQ accordion
    const faqHandlers: Array<{ el: Element; fn: () => void }> = [];
    document.querySelectorAll('.faq-item').forEach(item => {
      const header = item.querySelector('.faq-header');
      if (!header) return;
      const fn = () => {
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!open) item.classList.add('open');
      };
      header.addEventListener('click', fn);
      faqHandlers.push({ el: header, fn });
    });

    // Number counter
    function counter(el: HTMLElement) {
      const t = parseInt(el.dataset.target ?? '0', 10); if (!t) return;
      const dur = 1200, s = performance.now();
      const run = (now: number) => {
        const p = Math.min((now - s) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.floor(e * t)); if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }
    const cobs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { counter(e.target as HTMLElement); cobs.unobserve(e.target); } });
    }, { threshold: .5 });
    document.querySelectorAll('[data-target]').forEach(el => cobs.observe(el));

    // Sticky mobile CTA
    const sc = document.getElementById('stickyCta');
    const heroH = (document.querySelector('.hero') as HTMLElement | null)?.offsetHeight ?? 600;
    const ctaSec = document.querySelector('.cta-section');
    function checkSticky() {
      if (window.innerWidth > 900) { if (sc) sc.style.display = 'none'; return; }
      const pastHero = window.scrollY > heroH;
      const ctaInView = ctaSec && ctaSec.getBoundingClientRect().top < window.innerHeight;
      if (sc) sc.style.display = (pastHero && !ctaInView) ? 'block' : 'none';
    }
    window.addEventListener('scroll', checkSticky, { passive: true });
    window.addEventListener('resize', checkSticky);
    checkSticky();

    return () => {
      obs.disconnect();
      cobs.disconnect();
      faqHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      window.removeEventListener('scroll', checkSticky);
      window.removeEventListener('resize', checkSticky);
      if (sc) sc.style.display = 'none';
    };
  }, []);

  const BUY_URL = 'https://nivbook.co.il/product/%D7%9C%D7%90-%D7%92%D7%91%D7%A8%D7%AA-%D7%92%D7%99%D7%91%D7%95%D7%A8%D7%94/?lp';
  const CANCEL_URL = 'https://nivbook.co.il/%d7%91%d7%99%d7%98%d7%95%d7%9c-%d7%94%d7%96%d7%9e%d7%a0%d7%94/';

  return (
    <div className="menopause-book-page">
      {/* HERO */}
      <div className="hero">
        <div className="hero-deco"></div>
        <div className="hero-spark spark-1"></div><div className="hero-spark spark-2"></div>
        <div className="hero-spark spark-3"></div><div className="hero-spark spark-4"></div>
        <div className="hero-inner">
          <span className="hero-eyebrow">ספר לנשים בגיל המעבר</span>
          <h1 className="hero-headline">
            <span className="h-small">לא &#x201C;גברת&#x201D;,</span>
            <span className="h-big">גי-<br />בו-<br />רה!</span>
          </h1>
          <div className="hero-img-wrap">
            <img src="/menopause-book/hero-woman-book.png" alt="ענבל דפנה עם הספר" />
          </div>
          <div className="hero-middle">
            <div className="hero-sub">
              <div className="hero-sub-upper">סיפור מסע אל גיל המעבר</div>
              <div className="hero-sub-main">איך לעבור מהישרדות לפריחה<br />ולהיזכר באישה שאת באמת</div>
            </div>
            <a href={BUY_URL} className="btn-cta"><span>אני רוצה את הספר</span><span className="btn-arrow">&#8592;</span></a>
            <p className="hero-price">89 &#8362; &#8226; ספר מודפס &#8226; משלוח מספרי ניב</p>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,82 L0,82 Z" fill="#FBF6F0" />
          </svg>
        </div>
      </div>

      {/* EARLY PROOF */}
      <div className="proof-early">
        <div className="proof-early-inner">
          <div className="proof-featured fade-in">
            <span className="proof-quote">&#x201C;</span>
            <p className="proof-text">הספר הזה עשה לי משהו שאף פסיכולוג לא הצליח לעשות בשנה. פשוט הרגשתי שמישהי סוף סוף מדברת אליי ולא עליי.</p>
            <div className="proof-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p className="proof-attrib">מיכל, 52 - קריית אונו</p>
          </div>
          <div className="proof-mini-grid">
            <div className="proof-mini fade-in d1"><div className="proof-mini-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div className="proof-mini-text">&#x201C;לראשונה מזה זמן מה הרגשתי שמישהי רואה אותי. לא את הסימפטומים שלי. אותי.&#x201D;</div><div className="proof-mini-name">רחל, 49 - תל אביב</div></div>
            <div className="proof-mini fade-in d2"><div className="proof-mini-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div className="proof-mini-text">&#x201C;קראתי בשבת בצהריים וסיימתי שעה לפני חצות. לא יכולתי לעצור.&#x201D;</div><div className="proof-mini-name">דנה, 53 - חיפה</div></div>
            <div className="proof-mini fade-in d3"><div className="proof-mini-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><div className="proof-mini-text">&#x201C;כל חיי האמנתי שגיל המעבר זה סוף משהו. הספר הפך לי את זה לגמרי.&#x201D;</div><div className="proof-mini-name">יעל, 47 - ירושלים</div></div>
          </div>
        </div>
      </div>

      {/* PAIN */}
      <div className="pain-section">
        <div className="narrow">
          <p className="pain-lead fade-in">מכירה את התחושה שהגוף שלך שינה חוקים<br />בלי להודיע לך?</p>
          <div className="pain-grid">
            <div className="pain-card drop-in d1"><div className="pain-icon"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M11 18V7a3 3 0 016 0v11" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="14" cy="21.5" r="4" fill="var(--fuchsia)" fillOpacity=".18" stroke="var(--fuchsia)" strokeWidth="2" /><line x1="14" y1="18" x2="14" y2="12" stroke="var(--fuchsia)" strokeWidth="2.5" strokeLinecap="round" /></svg></div><div className="pain-title">הגוף מדבר. רק לא בשפה שלמדת.</div><p className="pain-desc">גלי חום בשעה שתיים בלילה. עלייה לא הגיונית במשקל. ערפל שגונב לך את החדות שתמיד היתה לך.</p></div>
            <div className="pain-card drop-in d2"><div className="pain-icon"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke="var(--fuchsia)" strokeWidth="2" /><polyline points="14,8 14,14 18,17" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div><div className="pain-title">&#x201C;האם עבר זמני?&#x201D; השאלה שלא עוזבת.</div><p className="pain-desc">לא הגוף הוא הבעיה האמיתית. הבעיה היא הרגע שפתאום שואלת: &#x201C;מי אני עכשיו?&#x201D;</p></div>
            <div className="pain-card drop-in d3"><div className="pain-icon"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="10" cy="10" r="4" stroke="var(--fuchsia)" strokeWidth="2" /><path d="M2 23v-1a8 8 0 0116 0v1" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" /><circle cx="20" cy="10" r="4" stroke="var(--fuchsia)" strokeWidth="2" /><path d="M26 23v-1a8 8 0 00-4-7" stroke="var(--fuchsia)" strokeWidth="2" strokeLinecap="round" /></svg></div><div className="pain-title">את לא היחידה שמרגישה ככה.</div><p className="pain-desc">כולן מסביב נראות שלמות. אבל לא מדברות על זה. רק את יודעת מה קורה בפנים.</p></div>
          </div>
          <p className="pain-extra fade-in">אם את עצבנית, עייפה, מדוכאת, ומרגישה שגיל המעבר הפתיע אותך בלי אזהרה מוקדמת, שהניצוץ נעלם, המצב רוח עושה סיבובים, והתחלת לשאול את עצמך:<em className="pain-extra-q">&#x201C;זהו? מכאן זה רק הולך ומתדרדר עד הסוף?&#x201D;</em></p>
          <div className="pain-bridge fade-in"><p className="bridge-text">הספר מציע לך <em className="bridge-em">מסגור מחדש</em> של גיל המעבר<br />כ<em className="bridge-em">שער להתחלה חדשה</em></p></div>
        </div>
      </div>

      {/* BOOK REVEAL — dark surprise */}
      <div className="book-section">
        <div className="book-section-inner container">
          <span className="eyebrow eyebrow--dark fade-in">הספר</span>
          <div className="book-title-large fade-in">לא &#x201C;גברת&#x201D;, גיבורה!</div>
          <div className="book-mockup-wrap fade-in"><img src="/menopause-book/book-mockup.png" alt={'כריכת הספר "לא גברת, גיבורה!"'} className="book-mockup-img" /></div>
          <div className="stats">
            <div className="fade-in d1"><span className="stat-num" data-target="204">204</span><div className="stat-lbl">עמודים</div></div>
            <div className="fade-in d2"><span className="stat-num" data-target="4">4</span><div className="stat-lbl">חלקים</div></div>
            <div className="fade-in d3"><span className="stat-num" data-target="24">24</span><div className="stat-lbl">פרקים</div></div>
          </div>
        </div>
      </div>

      {/* INSIDE */}
      <div className="inside-section">
        <div className="inside-inner">
          <span className="eyebrow fade-in">מה בפנים</span>
          <div className="inside-lead fade-in">4 חלקים. מסע שלם.</div>
          <p className="inside-sub fade-in">מהרגע שהגוף מתחיל לדבר, ועד להחלטה לחיות אחרת.</p>
          <div className="parts">
            <div className="part-row fade-in d1"><div className="part-num" style={{ color: '#F5DDE8' }}>01</div><div><div className="part-name">&#x201C;מה עובר עליי?&#x201D; - ההתעוררות</div><div className="part-chapters"><span className="ch">כשהגוף לוחש</span><span className="ch">&#x201C;למי שייכת הבטן הזו?&#x201D;</span><span className="ch">איפה שמתי את המוח?</span><span className="ch">מי אני עכשיו?</span></div></div></div>
            <div className="part-row fade-in d2"><div className="part-num" style={{ color: '#E8C97A' }}>02</div><div><div className="part-name">להבין, לאהוב, להפסיק להתנצל</div><div className="part-chapters"><span className="ch">הסוד שהגוף שומר</span><span className="ch">קריירה, שחיקה וקול פנימי</span><span className="ch">מה תעשי עם ה&#x201C;לבד&#x201D;?</span></div></div></div>
            <div className="part-row fade-in d3"><div className="part-num" style={{ color: '#c8b8be' }}>03</div><div><div className="part-name">לנשום עמוק ולהסתכל אחרת</div><div className="part-chapters"><span className="ch">למצוא שקט מבפנים</span><span className="ch">הגוף החדש שלי</span><span className="ch">גילויים חדשים של אמונה</span></div></div></div>
            <div className="part-row fade-in d4"><div className="part-num" style={{ color: '#D4167A' }}>04</div><div><div className="part-name">גיל המעבר - החיים שאני בוחרת</div><div className="part-chapters"><span className="ch">חזקה, שלמה ובלי בולשיט</span><span className="ch">מחזירה את עצמי לבמה</span><span className="ch">גיבורה, לא גברת</span><span className="ch">מה תשאירי אחרי שתלכי?</span></div></div></div>
          </div>
        </div>
      </div>

      {/* WHAT YOU'LL LEARN */}
      <div className="learn-section">
        <div className="learn-inner">
          <div className="learn-title-col fade-in">
            <div className="learn-big-num">8</div>
            <div className="learn-title-main">8 דברים שהספר<br /><span className="learn-title-hl">ילמד אותך</span></div>
          </div>
          <div className="learn-grid">
            <div className="learn-item fade-in d1"><div className="learn-num">1</div><div className="learn-text"><strong>להבין מה הגוף מנסה לספר לך</strong><span>גלי חום, ערפל, עייפות - לא בגידה. שפה חדשה שצריך ללמוד לקרוא.</span></div></div>
            <div className="learn-item fade-in d2"><div className="learn-num">5</div><div className="learn-text"><strong>להפסיק להתנצל על עצמך</strong><span>על הגוף, על הגיל, על הצרכים שלך. בלי סייגים.</span></div></div>
            <div className="learn-item fade-in d2"><div className="learn-num">2</div><div className="learn-text"><strong>לזהות את הניצוץ שלא נכבה</strong><span>רק שינה צורה. הוא עדיין שם - ומחכה לך.</span></div></div>
            <div className="learn-item fade-in d3"><div className="learn-num">6</div><div className="learn-text"><strong>לשחרר את ה&quot;גברת&quot; ולפגוש את הגיבורה</strong><span>שהמתינה בפנים כל הזמן.</span></div></div>
            <div className="learn-item fade-in d2"><div className="learn-num">3</div><div className="learn-text"><strong>לעבור מ&quot;מה אבדתי&quot; ל&quot;מה נפתח לי&quot;</strong><span>המסגור מחדש שמשנה את כל התמונה.</span></div></div>
            <div className="learn-item fade-in d3"><div className="learn-num">7</div><div className="learn-text"><strong>לנהל את מצב הרוח - לא לתת לו לנהל אותך</strong><span>כלים פרקטיים מתוך ניסיון אמיתי.</span></div></div>
            <div className="learn-item fade-in d3"><div className="learn-num">4</div><div className="learn-text"><strong>לענות על &quot;מי אני עכשיו?&quot; בלי פחד</strong><span>בסקרנות, בפתיחות - ובהתרגשות.</span></div></div>
            <div className="learn-item fade-in d4"><div className="learn-num">8</div><div className="learn-text"><strong>לכתוב את הפרק הבא בתנאים שלך</strong><span>כגיבורה של חייך.</span></div></div>
          </div>
        </div>
      </div>

      {/* ELIZA */}
      <div className="aliza-section">
        <div className="aliza-inner">
          <div className="aliza-text fade-in">
            <span className="eyebrow">הכירי את</span>
            <div className="aliza-name-large">עליזה שנקין</div>
            <div className="aliza-role">החברה הטובה שתמיד רצית. בכל פרק.</div>
            <div className="aliza-quote-block">
              <div className="aliza-quote-text">&#x201C;הגוף הזה לא מושלם.<br />אבל הוא שלי!&#x201D;</div>
            </div>
            <p className="aliza-desc">עליזה מלווה אותך לאורך כל הספר בפינה משלה. היא אומרת בקול רם את כל מה שאת רק חושבת בלב.<br /><br />לא באה ללטף. באה להזכיר לך מי את. ובסוף תמיד מכינה קפה.<br /><br /><strong>&#x201C;מותק, את כבר לא צריכה להוכיח את עצמך לאף אחד!&#x201D;</strong></p>
          </div>
          <div className="aliza-img-wrap fade-in d2">
            <div className="eliza-float">
              <div className="angled-photo">
                <img src="/menopause-book/aliza-photo.jpg" alt="עליזה שנקין" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div className="about-section">
        <div className="about-inner">
          <span className="eyebrow eyebrow--dark fade-in">על המחברת</span>
          <div className="about-img-frame fade-in">
            <img src="/menopause-book/about-author.jpg" alt="ענבל דפנה" />
          </div>
          <div className="about-name fade-in">ענבל דפנה</div>
          <div className="about-body fade-in">
            <p>אני לא רופאה. לא פסיכולוגית. לא גורו.</p>
            <p>אני <strong style={{ color: '#F7C5DF' }}>האישה שהייתה שם</strong>. שחוותה את הגלי חום, את הערפל, את הרגע שמישהו קרא לה &#x201C;גברת&#x201D; ומשהו בה נסדק.</p>
            <p>שנתיים חיפשתי תשובות. קראתי, ניסיתי, נכשלתי, ניסיתי שוב. ועכשיו, ב-204 עמודים, אני מקצרת לך את הדרך.</p>
            <p>לא תרגישי שאת בטיפול. תרגישי שחברה, שכבר עברה את זה, יושבת לידך ואומרת לך את האמת.</p>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="reviews-section">
        <div className="reviews-header fade-in">
          <span className="eyebrow">עוד נשים שקראו</span>
          <div className="reviews-lead">הן קראו. ואז כתבו לי.</div>
        </div>
        <div className="stats-bar fade-in">
          <div className="stats-bar-item"><div className="stats-bar-num">&#9733; 4.9</div><div className="stats-bar-lbl">דירוג ממוצע</div></div>
          <div className="stats-bar-item"><div className="stats-bar-num" data-target="204">204</div><div className="stats-bar-lbl">עמודים</div></div>
          <div className="stats-bar-item"><div className="stats-bar-num">89</div><div className="stats-bar-lbl">&#8362; מחיר ישיר</div></div>
        </div>
        <div className="reviews-grid">
          <div className="review-card fade-in d1"><div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p className="review-text">&#x201C;לראשונה מזה זמן מה הרגשתי שמישהי רואה אותי. לא את הסימפטומים שלי. אותי.&#x201D;</p><div className="review-name">רחל, 49 - תל אביב</div></div>
          <div className="review-card fade-in d2"><div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p className="review-text">&#x201C;קראתי בשבת בצהריים וסיימתי שעה לפני חצות. לא יכולתי לעצור.&#x201D;</p><div className="review-name">דנה, 53 - חיפה</div></div>
          <div className="review-card fade-in d3"><div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p className="review-text">&#x201C;כל חיי האמנתי שגיל המעבר זה סוף משהו. הספר הפך לי את זה לגמרי.&#x201D;</p><div className="review-name">יעל, 47 - ירושלים</div></div>
          <div className="review-card fade-in d4"><div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p className="review-text">&#x201C;את הפרק על הזהות העברתי לבת שלי. היא לא בגיל המעבר, אבל הבינה אותי סוף סוף.&#x201D;</p><div className="review-name">שרית, 57 - רעננה</div></div>
          <div className="review-card fade-in d5"><div className="review-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div><p className="review-text">&#x201C;ענבל לא מבטיחה קסמים. היא נותנת כלים אמיתיים עם הומור וחום. נדיר.&#x201D;</p><div className="review-name">לימור, 51 - באר שבע</div></div>
        </div>
      </div>

      {/* GUARANTEE */}
      <div className="guarantee-section">
        <div className="guarantee-inner fade-in">
          <div className="guarantee-stamp">&#128737;&#65039;</div>
          <div className="guarantee-title">הוראות ביטול ברורות</div>
          <p className="guarantee-body">הספר נשלח דרך ספרי ניב. אם מסיבה כלשהי הספר לא מתאים לך - אפשר לבטל את ההזמנה ישירות מהם. <a href={CANCEL_URL}>הוראות ביטול כאן.</a></p>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <div className="faq-inner">
          <span className="eyebrow fade-in" style={{ display: 'block', textAlign: 'center', marginBottom: '8px' }}>שאלות נפוצות</span>
          <div className="faq-lead fade-in">לפני שאת קונה</div>
          <div className="faq-item fade-in">
            <button className="faq-header"><span className="faq-q">כמה זמן לוקח לקרוא?</span><span className="faq-icon">+</span></button>
            <div className="faq-body"><p className="faq-a">רוב הנשים מסיימות ב-2 עד 4 שבתות. הספר כתוב בפרקים קצרים, אפשר לקרוא גם 20 דקות בלילה.</p></div>
          </div>
          <div className="faq-item fade-in d1">
            <button className="faq-header"><span className="faq-q">אני רק בתחילת גיל המעבר. זה מתאים לי?</span><span className="faq-icon">+</span></button>
            <div className="faq-body"><p className="faq-a">בדיוק בשבילך. ככל שמגיעה קודם, ככה קל יותר לנווט. הספר עונה על &#x201C;מה קורה לי&#x201D; לפני שהכל מתחיל להיות מכריע.</p></div>
          </div>
          <div className="faq-item fade-in d2">
            <button className="faq-header"><span className="faq-q">זה ספר רפואי?</span><span className="faq-icon">+</span></button>
            <div className="faq-body"><p className="faq-a">לא. ענבל אינה רופאה. הספר הוא סיפור מסע אישי עם תובנות, כלים מעשיים והרבה הומור. לא מחליף ייעוץ רפואי.</p></div>
          </div>
          <div className="faq-item fade-in d3">
            <button className="faq-header"><span className="faq-q">מה אם לא יתאים לי?</span><span className="faq-icon">+</span></button>
            <div className="faq-body"><p className="faq-a">הספר נשלח דרך ספרי ניב. לביטול הזמנה, <a href={CANCEL_URL}>לחצי כאן</a>.</p></div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="cta-section" id="cta">
        <span className="eyebrow eyebrow--dark fade-in">מוכנה?</span>
        <div className="cta-headline fade-in">רכשי לעצמך<br />את הספר שתמיד חיכית לו.</div>
        <p className="cta-sub fade-in">204 עמודים שמדברים ישר אלייך.<br />ללא ז&#x27;רגון. ללא שיפוטיות. עם הרבה אמת ואפילו קצת צחוק.</p>
        <div className="price-display fade-in">89 &#8362;</div>
        <p className="price-note fade-in">ספר מודפס &#8226; משלוח מספרי ניב</p>
        <a href={BUY_URL} className="btn-final fade-in">אני רוצה את הספר &#8592;</a>
        <div className="cta-fine fade-in"><a href={CANCEL_URL}>מדיניות ביטול</a></div>
      </div>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-cta" id="stickyCta">
        <a href={BUY_URL}>אני רוצה את הספר &#8592; 89 &#8362;</a>
        <div className="sticky-cta-sub">ספר מודפס • משלוח מספרי ניב</div>
      </div>
    </div>
  );
}
