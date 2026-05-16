import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SikkimVerse — Learn the Languages of the Himalayas",
  description:
    "Preserve, learn, and celebrate the 10 indigenous languages of Sikkim. Join thousands of learners keeping Lepcha, Bhutia, Limbu, and other Himalayan languages alive for future generations.",
  keywords: [
    "Sikkim",
    "indigenous languages",
    "Lepcha",
    "Bhutia",
    "Limbu",
    "language learning",
    "Himalayan culture",
    "language preservation",
  ],
  openGraph: {
    title: "SikkimVerse — Learn the Languages of the Himalayas",
    description:
      "Preserve, learn, and celebrate the 10 indigenous languages of Sikkim.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
