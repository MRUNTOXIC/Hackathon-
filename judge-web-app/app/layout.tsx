import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Judge Portal | Hackathon',
  description: 'Hackathon Judging Progressive Web App',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/logo.svg',
    apple: '/icons/logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Judge Portal',
  },
};

export const viewport: Viewport = {
  themeColor: '#050816',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050816] text-white min-h-screen overflow-x-hidden`}>
        <div className="fixed inset-0 bg-gradient-to-br from-[#050816] via-[#0a0f2e] to-[#050816] -z-10" />
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -z-10" />
        <main className="max-w-md mx-auto min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
