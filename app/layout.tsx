import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://chand-vans-kicau.vercel.app"),
  title: {
    default: "Chan Vans Kicau — Marketplace Burung Kicau Premium",
    template: "%s | Chan Vans Kicau",
  },
  description: "Marketplace burung kicau terpercaya. Murai Batu, Lovebird, Cucak Ijo, Kacer, dan banyak lagi. Setiap burung dilengkapi ring resmi dan jaminan keaslian.",
  keywords: ["burung kicau", "murai batu", "lovebird", "cucak ijo", "kacer", "kenari", "burung ring", "jual burung", "marketplace burung", "penangkaran burung"],
  authors: [{ name: "Chan Vans Kicau" }],
  creator: "Chan Vans Kicau",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://chand-vans-kicau.vercel.app",
    siteName: "Chan Vans Kicau",
    title: "Chan Vans Kicau — Marketplace Burung Kicau Premium",
    description: "Temukan burung kicau berkualitas dengan ring resmi. Murai Batu, Lovebird, Cucak Ijo, dan banyak lagi.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chan Vans Kicau — Marketplace Burung Kicau Premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chan Vans Kicau — Marketplace Burung Kicau Premium",
    description: "Temukan burung kicau berkualitas dengan ring resmi.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
