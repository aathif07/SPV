import type { Metadata } from "next";
import { Anton, Geist, Instrument_Serif, Inter, Noto_Sans_Tamil } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "./site.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geist has no Tamil glyphs; blog posts need a real Tamil face.
const notoTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["tamil"],
  weight: ["500", "700", "800"],
  display: "swap",
});

// Homepage display, body and quote faces.
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const title = "S. P. Velumani | Leadership. Experience. Service.";
  const description = "Official leadership portfolio of S. P. Velumani — public service, experience and a vision for Tamil Nadu.";
  return {
    title, description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, images: [{ url: image, width: 1200, height: 630, alt: "S. P. Velumani — Leadership. Experience. Service." }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${notoTamil.variable} ${anton.variable} ${inter.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
