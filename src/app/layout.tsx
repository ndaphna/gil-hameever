import type { Metadata } from "next";
import { Assistant, Geist_Mono, Satisfy, Dancing_Script, Caveat, Kalam } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import ConditionalNavigation from "./components/ConditionalNavigation";
import CookieBanner from "../components/CookieBanner";
import AccessibilityBubble from "../components/AccessibilityBubble";
import ExitIntentHandler from "../components/ExitIntentHandler";
import { AuthProvider } from "@/contexts/AuthContext";

const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Handwritten fonts collection
const satisfy = Satisfy({
  variable: "--font-handwritten",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-handwritten-luxury",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten-elegant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-handwritten-casual",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
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
    icon: '/favicon.ico',
    apple: '/favicon.png',
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
        url: '/logo.png',
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
    images: ['/logo.png'],
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
        className={`${assistant.variable} ${geistMono.variable} ${satisfy.variable} ${dancingScript.variable} ${caveat.variable} ${kalam.variable} antialiased`}
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
