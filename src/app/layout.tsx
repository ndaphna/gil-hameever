import type { Metadata } from "next";
import { Assistant, Secular_One, Frank_Ruhl_Libre } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import ConditionalNavigation from "./components/ConditionalNavigation";
import CookieBanner from "../components/CookieBanner";
import AccessibilityBubble from "../components/AccessibilityBubble";
import ExitIntentHandler from "../components/ExitIntentHandler";
import { AuthProvider } from "@/contexts/AuthContext";

// Brand typography (see DESIGN.md):
// - Assistant: workhorse for body, H1/H2, CTA, captions (95% of text)
// - Secular One: oversized display headlines (one per page, max)
// - Frank Ruhl Libre: literary moments — quotes, signatures, FAQ stems
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const secularOne = Secular_One({
  variable: "--font-secular",
  subsets: ["latin", "hebrew"],
  weight: ["400"],
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gilhameever.com'
const defaultTitle = 'מנופאוזית וטוב לה'
const defaultDescription = 'המקום של נשים בגיל המעבר, מידע, כלים ותמיכה לחיות טוב יותר בגיל 50 ומעלה'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | מנופאוזית וטוב לה`,
  },
  description: defaultDescription,
  icons: {
    icon: [{ url: '/favicon-main.ico', type: 'image/x-icon' }],
    apple: '/favicon-main.png',
  },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: siteUrl,
    siteName: 'מנופאוזית וטוב לה',
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/logo-main.png',
        width: 800,
        height: 800,
        alt: 'מנופאוזית וטוב לה',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/logo-main.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${assistant.variable} ${secularOne.variable} ${frankRuhl.variable}`}
        suppressHydrationWarning
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H46638TQ66"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H46638TQ66');
          `}
        </Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1520302186296384');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1520302186296384&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <div className="app-wrapper">
          <AuthProvider>
            <ConditionalNavigation />
            <main id="main-content">
              {children}
            </main>
            <CookieBanner />
            <AccessibilityBubble />
            <ExitIntentHandler />
          </AuthProvider>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
