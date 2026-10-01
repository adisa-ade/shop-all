import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sola Studio | Objects for everyday rituals",
  description: "Thoughtful home objects, made to stay. Discover lighting, tabletop, and textiles from Sola Studio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}