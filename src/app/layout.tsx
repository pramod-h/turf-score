import type { Metadata } from "next";
import { Nunito, Geist_Mono, Barlow_Condensed } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SplashScreen } from "@/components/splash-screen";
import { Analytics } from "@vercel/analytics/next";
import { AppHeader } from "@/components/app-header";
import { DesktopNotice } from "@/components/desktop-notice";
import { ThemeProvider } from "@/components/theme-provider";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";


const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://turf-score.vercel.app"
  ),
  title: "Turf Score",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Turf Score",
  },
  description:
    "Real-time cricket scoring for turf matches. Track live scores, ball-by-ball updates, batting & bowling stats, and match results — built for weekend warriors.",
  icons: {
    icon: [
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon.ico" },
    ],
    apple: { url: "/images/apple-touch-icon.png" },
    other: [
      { rel: "android-chrome-192", url: "/images/android-chrome-192x192.png" },
    ],
  },
  openGraph: {
    title: "Turf Score",
    description:
      "Real-time cricket scoring for turf matches. Track live scores, ball-by-ball updates, batting & bowling stats, and match results.",
    images: [{ url: "/images/android-chrome-512x512.png", width: 512, height: 512 }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Turf Score",
    description: "Real-time cricket scoring for turf matches.",
    images: ["/images/android-chrome-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${geistMono.variable} ${barlowCondensed.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Anti-flash: apply stored theme before paint */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <DesktopNotice />
          <AppHeader />
          <SplashScreen />
          <div className="pt-14 flex flex-col flex-1">
            {children}
          </div>
          <SpeedInsights />
          <Analytics />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
