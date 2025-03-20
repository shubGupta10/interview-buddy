import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import {Toaster} from 'react-hot-toast'
import Footer from "@/components/Footer";
import { Suspense } from "react";
import LoadingFeedback from "@/components/LoaderFallback";


export const metadata: Metadata = {
  title: "InterviewBuddy - AI-Powered Interview Preparation",
  description:
    "Prepare for your next technical, behavioral, and system design interview with AI-generated questions and expert insights.",
  keywords:
    "AI interview preparation, technical interview, coding questions, system design, behavioral interview, mock interview",
  authors: [{ name: "InterviewBuddy", url: "https://interviewbuddy.com" }],
  creator: "InterviewBuddy",
  applicationName: "InterviewBuddy",
  metadataBase: new URL("https://interviewbuddy.com"),
  openGraph: {
    title: "InterviewBuddy - AI-Powered Interview Preparation",
    description:
      "Master technical, behavioral, and system design interviews with AI-generated questions tailored to your needs.",
    url: "https://interviewbuddy.com",
    siteName: "InterviewBuddy",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "InterviewBuddy - AI Interview Preparation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: "index, follow",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <SessionProviderWrapper>
        <body
        >
          <BackgroundWrapper>
            <Navbar/>
            <Toaster 
              position="bottom-right"
              reverseOrder={false}
            />
            <Suspense  fallback={<LoadingFeedback/>}>
            {children}
            </Suspense>
            <Footer/>
          </BackgroundWrapper>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}