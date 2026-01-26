import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Corrected import
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import NextTopLoader from 'nextjs-toploader';
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CFSpeed",
  description: "Codeforces Speed Training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#818cf8" // Indigo-400
          initialPosition={0.08}
          crawlSpeed={100}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={150}
          shadow="0 0 10px #818cf8,0 0 5px #818cf8"
        />
        <Providers>
          <Navbar />
          <PageTransition>
            <main className="pt-16">
              {children}
            </main>
          </PageTransition>
        </Providers>
      </body>
    </html>
  );
}
