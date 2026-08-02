import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import ServiceWorkerCleanup from '@/components/ServiceWorkerCleanup';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HackDash | Hackathon',
  description: 'Hackathon Management Dashboard',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HackDash',
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
      <body className={`${inter.className} bg-[#050816] text-white min-h-screen`}>
        <ServiceWorkerCleanup />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
