import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const hindi = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "इंग्लिश सखी — English Sakhi",
  description:
    "हिंदी माध्यम माताओं के लिए ऑडियो-फ़र्स्ट अंग्रेज़ी माइक्रो-लर्निंग",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="hi"
      className={`${display.variable} ${sans.variable} ${hindi.variable} h-full antialiased`}
    >
      <body className="sakhi-backdrop min-h-full font-sans text-sakhi-ink">
        {children}
      </body>
    </html>
  );
}
