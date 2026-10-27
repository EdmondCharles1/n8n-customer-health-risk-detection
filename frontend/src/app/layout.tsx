import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Customer Health Risk Analyzer",
    default: "Customer Health Risk Analyzer",
  },
  description: "AI-powered customer health risk analysis built with n8n and Gemini.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col overflow-x-clip bg-slate-50 text-slate-900">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>

        <SiteHeader />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
