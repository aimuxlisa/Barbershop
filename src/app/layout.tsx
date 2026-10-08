import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "KMS Control Center — Visual Site Builder",
  description: "Next-generation visual site builder & CMS with cyberpunk HUD aesthetics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen bg-black text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
