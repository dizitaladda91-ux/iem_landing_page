import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jashn Realty Presents RUNWAY - Kids Fashion Week 2026 | IEM & AdOnMo",
  description:
    "Official Registration & Voting Portal for Jashn Realty Presents Runway - Kids Fashion Week 2026. Presented by Jashn Realty, Institute of Event Management & AdOnMo in Lucknow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white text-charcoal min-h-screen antialiased selection:bg-pink-soft selection:text-pink-dark">
        {children}
      </body>
    </html>
  );
}
