import type { Metadata } from "next";
import { Assistant, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "גיל המיוערת",
  description: "אתר ואפליקציה בעברית לנשים בישראל",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${assistant.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-neutral-200 dark:border-neutral-800">
          <nav className="max-w-5xl mx-auto flex items-center gap-4 p-4 text-sm">
            <a href="/" className="hover:underline">דף הבית</a>
            <a href="/about" className="hover:underline">אודות</a>
            <a href="/menopause-roadmap" className="hover:underline">מפת דרכים</a>
            <a href="/pricing" className="hover:underline">מחירים</a>
            <a href="/members" className="hover:underline">איזור חברות</a>
            <div className="ml-auto flex items-center gap-2">
              <form action="/api/login" method="post">
                <button className="btn btn-primary">התחברות</button>
              </form>
              <form action="/api/logout" method="post">
                <button className="btn btn-secondary">התנתקות</button>
              </form>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
