import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { LanguageProvider } from "@/components/investara/language-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "leaflet/dist/leaflet.css";
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
  title: "Investara | AI Investment Copilot for Nusantara",
  description:
    "Multilingual investment intelligence for Indonesian regional opportunities.",
};

const themeScript = `
  (function () {
    try {
      var theme = window.localStorage.getItem("investara-theme") || "dark";
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch (error) {
      document.documentElement.classList.add("dark");
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <Script
          id="investara-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <TooltipProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
