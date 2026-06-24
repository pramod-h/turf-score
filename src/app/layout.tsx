import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow_Condensed } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SplashScreen } from "@/components/splash-screen";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turf Score",
  description: "Fast cricket scoring for turf matches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SplashScreen />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
