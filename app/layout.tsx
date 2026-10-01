import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sola Studio | Objects for everyday rituals",
  description: "Thoughtful home objects, made to stay. Discover lighting, tabletop, and textiles from Sola Studio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={poppins.variable} data-scroll-behavior="smooth"><body>{children}</body></html>;
}