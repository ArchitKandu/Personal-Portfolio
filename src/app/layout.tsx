import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google";

import { INTRO_SCRIPT } from "@/lib/intro";
import { SITE } from "@/lib/content";
import { GROUND_COLOR } from "@/lib/theme";
import "./globals.css";

/** Only the weights the design actually uses are shipped. */
const poppins = Poppins({
  weight: ["200", "300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const description =
  "Full Stack Engineer on the early engineering team at an AI-first legal tech startup. Next.js, TypeScript, Google Cloud and Firebase, owned end to end.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.name}`,
  },
  description,
  keywords: [
    "Archit Kandu",
    "Full Stack Engineer",
    "Next.js",
    "TypeScript",
    "Google Cloud",
    "Firebase",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: GROUND_COLOR,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jetBrainsMono.variable} antialiased`}
    >
      <body className="bg-ground font-sans text-ink">
        {/*
          Decides the opening sequence before the first paint, so the veil is
          never a flash and never waits on hydration.
        */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        {/*
          Scroll reveals hide their content from JavaScript. Without scripts the
          page stays fully readable instead of blank.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
