// app/layout.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tether",
  description: "Connect without limits. No numbers. Just usernames.",
  metadataBase: new URL("https://tether.local"),
  openGraph: {
    title: "Tether",
    description: "Connect without limits. No numbers. Just usernames.",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tether",
    description: "Connect without limits. No numbers. Just usernames.",
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="page-shell">
        <div className="fixed inset-0 -z-10 grid-border opacity-30" />
        <div className="fixed inset-0 -z-10 noise-overlay" />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
