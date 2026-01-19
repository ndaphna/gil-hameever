'use client';

import Link from 'next/link';
import './articles.css';

// Article data structure
interface Article {
  id: string;
  title: string;
  url: string;
  teaser: string;
  imageUrl: string;
}

// Articles list - add new articles here
const articles: Article[] = [
  {
    id: 'walking-medicine-menopause',
    title: 'למה הליכה היא ה"תרופה" שהגוף שלך צורח שהוא צריך (וזה לא קשור לקלוריות)',
    url: '/walking-medicine-menopause',
    teaser: 'אני יודעת שהדבר האחרון שמתחשק לך לעשות כרגע זה לנעול נעלי ספורט ולצאת החוצה. את עייפה, הגוף מרגיש כבד, ואולי גם הברכיים קצת מאותתות. אבל אני רוצה לספר לך משהו שאולי לא ידעת על הגוף שלנו בגיל הזה. הסיפור הוא איזון. והליכה היא הכלי הכי חזק שיש לנו...',
    imageUrl: 'https://i.imghippo.com/files/lk9177Jk.jpg'
  },
  {
    id: 'dr-sims-supplements-menopause',
    title: 'התוספים שד"ר סימס ממליצה (רמז: קריאטין זה לא רק לבריוני חדר כושר)',
    url: '/dr-sims-supplements-menopause',
    teaser: 'אחרי שסיכמנו שאת הולכת להרים דברים כבדים ולהפסיק לפחד מחלבון, הגיע הזמן לדבר על ה"עזרים הטקטיים". ד"ר סטייסי סימס עושה לנו סדר: בגיל 50+, תוספים הם לא פינוק - הם פשוט הדרך שלנו לתת לגוף את חומרי הגלם שהוא כבר לא מייצר בעצמו. בואי נגלה מה באמת עובד...',
    imageUrl: 'https://i.imghippo.com/files/tsx6749psc.png'
  },
  {
    id: 'belly-fat-hormones-menopause',
    title: 'הכרס הזאת היא לא ממך, היא מההורמונים (והמשקולות הוורודות שלך)',
    url: '/belly-fat-hormones-menopause',
    teaser: 'תשמעי, תניחי רגע את הקפה. אנחנו צריכות לדבר על הכרס הקטנה הזאת שהחליטה לעבור לגור אצלך בערך ביום הולדת 50. את עושה הליכות, את אוכלת פחות, את אפילו מרימה את המשקולות של ה-3 קילו – וכלום. המשקל תקוע, העייפות חוגגת, והג\'ינס? בואי נגיד שהוא ואת בנתק זמני. אבל יש פתרון...',
    imageUrl: 'https://i.imghippo.com/files/cSdm8044lE.png'
  },
  {
    id: 'sharp-memory-menopause',
    title: 'המוח שלך לא נעלם, הוא פשוט ב"שיפוצים": הסוד לזיכרון חד (גם) בגיל המעבר 🧠✨',
    url: '/sharp-memory-menopause',
    teaser: 'נכנסת לחדר ושכחת למה? המילה עומדת לך על קצה הלשון ופשוט מסרבת לצאת? התחושה הזו שמישהו הניח "ערפל" בתוך הראש שלך היא לא דמיון – היא ביולוגיה. החדשות הטובות? זה לא חייב להיות ככה. את לא "מזדקנת", את פשוט צריכה לעדכן גרסה...',
    imageUrl: 'https://i.imghippo.com/files/REs2664FMI.jpeg'
  },
  {
    id: 'muscle-mass-menopause',
    title: 'שרירים נעלמים? לא אצלנו! מדריך לשימור מסת השריר בגיל המעבר',
    url: '/muscle-mass-menopause',
    teaser: 'האם אתן מרגישות שהשרירים שלכן החליטו לקחת חופשה ארוכה? ברוכות הבאות למועדון "איפה נעלמו השרירים שלי?" בגיל המעבר. אני כאן כדי לספר לכן למה זה קורה ואיך אפשר להחזיר את השרירים הביתה…',
    imageUrl: 'https://i.imghippo.com/files/Cmr5152HsY.png'
  },
  {
    id: 'intermittent-fasting-menopause',
    title: 'צום לסירוגין',
    url: '/intermittent-fasting-menopause',
    teaser: 'מבאס, נכון, בגיל המעבר יש סיכוי גדול שנעלה במשקל. האשמה היא בחוסר איזון הורמונלי והירידה באסטרוגן… בלה בלה..ידוע. אז מה אנחנו עושות? החדשות הטובות הן שצום לסירוגין יכול לעזור לנו...',
    imageUrl: 'https://i.imghippo.com/files/BMz6150CfM.jpeg'
  },
  {
    id: 'cortisol-stress-menopause',
    title: 'מרגישה כמו סיר לחץ? גלי איך להוריד את האש מתחת הורמון הקורטיזול שלך',
    url: '/cortisol-stress-menopause',
    teaser: 'לפעמים הגוף שלנו מחליט להפוך לסיר לחץ אנושי. האחראי הראשי: הורמון הקורטיזול שמתחיל להשתולל חופשי בגיל המעבר! בואי נדבר על איך להרגיע את הורמון הסטרס הזה...',
    imageUrl: 'https://i.imghippo.com/files/vL1482nNM.webp'
  },
  {
    id: 'good-sleep-menopause',
    title: 'לילה טוב (באמת!): מדריך השורדת לשינה טובה בגיל המעבר',
    url: '/good-sleep-menopause',
    teaser: 'אז מה, גם אתן מתהפכות במיטה בלילה כמו שניצל על מחבת? אל דאגה, אתן לא לבד! בתור אחת שכבר מזמן הפסיקה לספור כבשים ועברה לספור את הפעמים שהיא מסתובבת במיטה...',
    imageUrl: 'https://i.imghippo.com/files/OsO8314YpQ.jpg'
  },
  {
    id: 'walking-benefits-menopause',
    title: 'היתרונות של הליכה לנשים בגיל המעבר ואיך לשרוף יותר קלוריות בהליכה',
    url: '/walking-benefits-menopause',
    teaser: 'כולנו יודעות שחשוב לשלב הליכה בשגרת היומיום שלנו, ושהיא מביאה שורה של יתרונות בריאותיים פיזיים ונפשיים. זו אחת מפעילויות הכושר היותר פופולאריות, והיא גם שורפת לא מעט קלוריות...',
    imageUrl: 'https://i.imghippo.com/files/CVDE4088N.jpg'
  },
  {
    id: 'preparing-for-menopause',
    title: 'מה קורה לנו בגוף לקראת גיל המעבר וכיצד להיערך?',
    url: '/preparing-for-menopause',
    teaser: 'בממוצע סביב גיל 48–49 אנחנו נכנסות לתקופה בחיינו שבה רובנו כבר לא פוריות ללדת ילדים. לחלק מאיתנו זה יקרה בגיל 40 ולחלק אחרי 50, והטווח הוא בנורמה...',
    imageUrl: 'https://i.imghippo.com/files/EoFG9547htc.png'
  },
  {
    id: 'mindset-changes-weight-loss',
    title: 'שלושת שינויי המיינדסט הגדולים שעשיתי כדי לרדת במשקל בשנות ה-50 לחיי',
    url: '/mindset-changes-weight-loss-50s',
    teaser: 'רוב הנשים מתעסקות עיסוק יתר במשקל שלהן רוב חייהן. גם הרזות שביננו חוות בגיל המעבר קושי שלא חוו לפני. פתאום צצה לה כרס קטנה שמסרבת לרדת...',
    imageUrl: 'https://i.imghippo.com/files/ncc8397uA.jpg'
  },
  {
    id: 'proven-tools-belly-fat',
    title: 'כלים מוכחים להורדת השומן הבטני לנשים בגיל המעבר - זה עובד!',
    url: '/proven-tools-belly-fat-menopause',
    teaser: 'אחת התופעות הנפוצות והמתסכלות ביותר לנשים בגיל המעבר, היא צבירת השומן הבטני העקשן. פתאום הבטן נפוחה ובולטת. אבל מעבר למראה החיצוני, הסכנה האמיתית היא בשומן הפנימי שסביב האיברים שלנו...',
    imageUrl: 'https://i.imghippo.com/files/wZn1376Zms.png'
  },
  {
    id: 'brain-fog-menopause',
    title: '"ערפל מוחי" בגיל המעבר - מה זה ואיך להתמודד?',
    url: '/brain-fog-menopause',
    teaser: 'אחד התסמינים הפחות מוכרים (אבל בהחלט נפוצים) של גיל המעבר הוא \'ערפול מוחי\'. קרה לך פעם שבאמצע שיחה נתקעת ולא הצלחת למצוא את המילה שאת מחפשת? אם ענית בחיוב, ברוכה הבאה למועדון המעורפלות...',
    imageUrl: 'https://i.imghippo.com/files/yPX6366sE.jpg'
  },
  {
    id: 'hot-flashes-menopause',
    title: 'גלי חום: איך להישאר קרירה כשהגוף מחליט להיות תנור?',
    url: '/hot-flashes-menopause',
    teaser: 'גם אתן מרגישות לפעמים כאילו מישהו הדליק לכן מדורה פרטית בתוך הגוף? ברוכות הבאות למועדון "הלוהטות בגיל המעבר"! אני כאן כדי לספר לכן על הסיבות לגלי החום הללו ואיך אפשר להתמודד איתם בלי להפוך לכבאית אנושית...',
    imageUrl: 'https://i.imghippo.com/files/xFEf4520Pw.jpg'
  }
];

export default function ArticlesPage() {
  return (
    <div className="articles-page">
      <div className="articles-container">
        <header className="articles-header">
          <h1 className="articles-title">מאמרים</h1>
          <p className="articles-subtitle">
            מאמרים, טיפים ותובנות על גיל המעבר, בריאות, תזונה ואורח חיים בריא
          </p>
        </header>

        <section className="articles-grid">
          {articles.map((article) => (
            <article key={article.id} className="article-card">
              <Link href={article.url} className="article-card-link">
                <div className="article-card-image-wrapper">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="article-card-image"
                  />
                </div>
                <div className="article-card-content">
                  <h2 className="article-card-title">{article.title}</h2>
                  <p className="article-card-teaser">{article.teaser}</p>
                  <span className="article-card-read-more">קראי עוד →</span>
                </div>
              </Link>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

