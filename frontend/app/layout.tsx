import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetricMind — Agentic Semantic BI Engine",
  description: "Ask plain English business questions and get real metrics, interactive ECharts visual insights, and transparent SQL audit trails.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
