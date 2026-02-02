import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import NextTopLoader from 'nextjs-toploader';
import PageTransition from "@/components/PageTransition";
import MainWrapper from "@/components/MainWrapper";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import ToastProvider from "@/components/ToastProvider";

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
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";

// Timeout wrapper to prevent infinite hangs
async function getSessionWithTimeout(timeoutMs: number = 2000) {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Session fetch timeout')), timeoutMs);
    });

    const session = await Promise.race([
      getServerSession(authOptions),
      timeoutPromise
    ]) as Session | null;
    return session;
  } catch (error) {
    console.error('Session fetch failed or timed out:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSessionWithTimeout();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#f43f5e"
          initialPosition={0.08}
          crawlSpeed={100}
          height={2}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={150}
          shadow="0 0 10px #f43f5e,0 0 5px #f43f5e"
        />
        <Providers session={session}>
          <Navbar />
          <ErrorBoundary>
            <PageTransition>
              <MainWrapper>
                {children}
              </MainWrapper>
            </PageTransition>
          </ErrorBoundary>
          <MobileNav />
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
