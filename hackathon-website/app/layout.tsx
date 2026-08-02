import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export const metadata: Metadata = {
  title: "ASTRA | The Next Frontier Hackathon",
  description: "Join the most ambitious 12-hour space-tech hackathon. Build the future of orbital operations.",
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
