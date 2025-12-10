import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClerkProvider } from "@/providers/ConvexClerkProvider";
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
  title: "StaticKit - AI Ad Variation Generator",
  description: "Turn one winning ad into five. Generate AI-powered ad variations for A/B testing in minutes.",
  keywords: ["ad generator", "AI advertising", "ad variations", "A/B testing", "meta ads", "google ads"],
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
        <ConvexClerkProvider>
          {children}
        </ConvexClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}
