import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תודה! הצ׳קליסט בדרך אלייך | גיל המעבר',
  description: 'תודה שנרשמת! צ׳קליסט הגיבורות ישלח אלייך בקרוב.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HeroineChecklistThankYou() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Assistant', sans-serif",
        background: 'linear-gradient(145deg, rgba(255, 182, 217, 0.15) 0%, rgba(228, 204, 255, 0.15) 60%, #fff 100%)',
        padding: '2rem 1.5rem',
        direction: 'rtl',
        unicodeBidi: 'isolate',
        textAlign: 'right',
      }}
    >
      {/* Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,0,128,0.08)',
          maxWidth: '560px',
          width: '100%',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FF0080 0%, #9D4EDD 100%)',
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎉</div>
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              direction: 'rtl',
              unicodeBidi: 'isolate',
            }}
          >
            !!הצ&#8217;קליסט בדרך אלייך
          </h1>
        </div>

        {/* Content */}
        <div
          style={{
            padding: 'clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 4vw, 2.25rem)',
            direction: 'rtl',
            unicodeBidi: 'isolate',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              fontWeight: 600,
              color: '#1A1A1A',
              lineHeight: 1.7,
              marginBottom: '1rem',
              direction: 'rtl',
              unicodeBidi: 'isolate',
              textAlign: 'right',
            }}
          >
            כמה דקות מהיום ויהיה לך מייל עם הצ&#8217;קליסט המלא.
          </p>
          <p
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              fontWeight: 500,
              color: 'rgba(26,26,26,0.75)',
              lineHeight: 1.75,
              marginBottom: '1.5rem',
              direction: 'rtl',
              unicodeBidi: 'isolate',
              textAlign: 'right',
            }}
          >
            תראי במייל שלך – ואם לא מצאת, בדקי גם בספאם (ותעבירי לתיבה הראשית כדי לא לפספס אף הודעה (:
          </p>

          {/* Divider */}
          <div
            style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, #FF0080, #9D4EDD)',
              borderRadius: '2px',
              margin: '0 auto 1.5rem',
            }}
          />

          <p
            style={{
              fontSize: 'clamp(0.875rem, 1.8vw, 1rem)',
              fontWeight: 400,
              color: 'rgba(26,26,26,0.6)',
              lineHeight: 1.65,
              direction: 'rtl',
              unicodeBidi: 'isolate',
              textAlign: 'right',
            }}
          >
            עם אהבה,
            <br />
            <strong style={{ color: '#FF0080' }}>גיל</strong> 🌺
          </p>
        </div>
      </div>
    </div>
  );
}
