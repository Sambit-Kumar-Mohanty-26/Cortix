import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider"; // Import this

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cortix - Proof of Intelligence",
  description: "AI-Powered Oral Examinations on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWalletProvider>
            {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}