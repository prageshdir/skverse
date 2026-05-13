import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

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
    "An immersive platform to learn, preserve, and celebrate the indigenous languages and cultures of Sikkim — Bhutia, Lepcha, Limbu, Tamang, and more.",
  keywords: ["Sikkim", "indigenous languages", "Bhutia", "Lepcha", "Limbu", "Tamang", "cultural preservation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
