import type { Metadata } from "next";
import { Assistant, Geist_Mono, Satisfy, Dancing_Script, Caveat, Kalam } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import CookieBanner from "../components/CookieBanner";
import AccessibilityBubble from "../components/AccessibilityBubble";

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

// Handwritten fonts collection for Hebrew
const satisfy = Satisfy({
  variable: "--font-handwritten",
  subsets: ["latin", "hebrew"],
  weight: ["400"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-handwritten-luxury",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwritten-elegant",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-handwritten-casual",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "מנופאוזית וטוב לה",
  description: "אתר ואפליקציה בעברית לנשים בישראל",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
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
        <div className="app-wrapper">
          <Navigation />
          <main id="main-content">
            {children}
          </main>
          <CookieBanner />
          <AccessibilityBubble />
        </div>
      </body>
    </html>
  );
}
