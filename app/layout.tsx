import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import dynamic from "next/dynamic";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor").then((m) => ({ default: m.CustomCursor })), { ssr: false });

const siteUrl = 'https://syedabdullahzaidi.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Syed Abdullah Zaidi — Agentic AI & Fullstack Developer",
  description: "Agentic AI Developer & Fullstack Engineer. Building autonomous AI systems and scalable web applications — multi-agent workflows, RAG pipelines, and production-ready fullstack apps.",
  keywords: ["Agentic AI", "Fullstack Developer", "AI Engineer", "Next.js", "React", "TypeScript", "FastAPI", "RAG", "Portfolio"],
  authors: [{ name: "Syed Abdullah Zaidi", url: siteUrl }],
  creator: "Syed Abdullah Zaidi",
  openGraph: {
    title: "Syed Abdullah Zaidi — Agentic AI & Fullstack Developer",
    description: "Building autonomous AI systems and scalable web applications.",
    url: siteUrl,
    siteName: "Syed Abdullah Zaidi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Abdullah Zaidi — Agentic AI & Fullstack Developer",
    description: "Building autonomous AI systems and scalable web applications.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

const criticalCSS = `
body { background: #000; color: #fff; margin: 0; }
#init-splash {
  position: fixed; inset: 0; z-index: 999999;
  display: flex; align-items: center; justify-content: center;
  background: #000;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
#init-splash.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
#init-splash h1 {
  font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900;
  color: #fff; margin: 0; letter-spacing: -0.03em;
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('DOMContentLoaded', function() {
                  var splash = document.getElementById('init-splash');
                  if (splash) splash.classList.add('hidden');
                });
                setTimeout(function() {
                  var splash = document.getElementById('init-splash');
                  if (splash) splash.classList.add('hidden');
                }, 500);
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://vercel.live" />
      </head>
      <body className="antialiased">
        <div id="init-splash">
          <h1>SYED ABDULLAH ZAIDI</h1>
        </div>
        <div className="grain-overlay" />
        <div className="vignette" />
        <div className="atmos-glow" />
        <ScrollProgress />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
