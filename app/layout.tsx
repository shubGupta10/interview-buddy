import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import {Toaster} from 'react-hot-toast'
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InterviewBuddy",
  description: "Your AI-powered interview prep companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProviderWrapper>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <BackgroundWrapper>
            <Navbar/>
            <Toaster 
              position="bottom-right"
              reverseOrder={false}
            />
            {children}
            <Footer/>
          </BackgroundWrapper>
        </body>
      </SessionProviderWrapper>
    </html>
  );
}