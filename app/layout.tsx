import type { Metadata } from "next";
import { Space_Grotesk, Comic_Neue, Nunito, Courier_Prime, Playfair_Display } from "next/font/google";
import "./globals.css";

const ui = Space_Grotesk({ subsets: ["latin"], variable: "--font-ui", weight: ["400", "500", "700"] });
const alpha = Comic_Neue({ subsets: ["latin"], variable: "--font-alpha", weight: ["400", "700"] });
const millennial = Nunito({ subsets: ["latin"], variable: "--font-millennial", weight: ["400", "700"] });
const genx = Courier_Prime({ subsets: ["latin"], variable: "--font-genx", weight: ["400", "700"] });
const boomer = Playfair_Display({ subsets: ["latin"], variable: "--font-boomer", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "GenSpeak — translate anything into any generation's slang",
  description: "Type plain English, pick a generation, get it back in their slang. Gen Alpha to Boomer.",
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
