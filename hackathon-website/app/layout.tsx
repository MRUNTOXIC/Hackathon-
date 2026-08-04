import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "Commit Code | 24-Hour Hackathon",
  description: "Join the most ambitious 24-hour space-tech hackathon. Build the future of orbital operations.",
  icons: {
    icon: '/vercel.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${orbitron.variable} font-orbitron antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
