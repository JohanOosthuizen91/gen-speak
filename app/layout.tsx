import type { Metadata } from "next";
import { Space_Grotesk, Comic_Neue, Nunito, Courier_Prime, Playfair_Display } from "next/font/google";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, siteUrl } from "@/lib/site";
import "./globals.css";

const ui = Space_Grotesk({ subsets: ["latin"], variable: "--font-ui", weight: ["400", "500", "700"] });
const alpha = Comic_Neue({ subsets: ["latin"], variable: "--font-alpha", weight: ["400", "700"] });
const millennial = Nunito({ subsets: ["latin"], variable: "--font-millennial", weight: ["400", "700"] });
const genx = Courier_Prime({ subsets: ["latin"], variable: "--font-genx", weight: ["400", "700"] });
const boomer = Playfair_Display({ subsets: ["latin"], variable: "--font-boomer", weight: ["400", "700"] });

const title = `${SITE_NAME} — ${SITE_TAGLINE}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "generational translator",
    "slang translator",
    "gen z translator",
    "gen alpha translator",
    "millennial slang",
    "gen x slang",
    "boomer translator",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ui.variable} ${alpha.variable} ${millennial.variable} ${genx.variable} ${boomer.variable}`}>
        {children}
      </body>
    </html>
  );
}
