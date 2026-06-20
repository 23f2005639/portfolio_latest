import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-ibm-plex",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "AI enthusiast exploring Agentic AI, building in public. Student developer interested in Next.js, Python, and LangChain.",
  authors: [{ name: "Shreyas Namdeo" }],
  openGraph: {
    title: "Portfolio",
    description: "AI enthusiast exploring Agentic AI, building in public.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white font-sans text-foreground">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
