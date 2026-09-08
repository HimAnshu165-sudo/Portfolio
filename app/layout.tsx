import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PROFILE } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Himanshu Sharma — Full-Stack Developer & Creative Web Creator",
  description:
    "Personal portfolio of Himanshu Sharma. Full-stack developer, web creator, and web designer engineering high-impact web experiences across Next.js, WebGL, Three.js, motion, and production deployment.",
  keywords: [
    "Himanshu Sharma",
    "Full-Stack Developer",
    "Creative Developer",
    "Web Creator",
    "Web Designer",
    "Next.js",
    "Three.js",
    "React Three Fiber",
    "WebGL",
    "GSAP",
    "Framer Motion",
  ],
  authors: [{ name: PROFILE.name }],
  creator: PROFILE.name,
  openGraph: {
    title: "Himanshu Sharma — Full-Stack Developer & Creative Web Creator",
    description:
      "10+ shipped web projects. Design, full-stack engineering, WebGL, motion choreography, and production deployment.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Himanshu Sharma — Full-Stack Developer & Web Creator",
    description: "Design it. Build it. Move it. Ship it. 10+ projects shipped.",
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-background text-foreground antialiased selection:bg-accent selection:text-background min-h-screen">
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
