import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';

const raleway = Raleway({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export const metadata: Metadata = {
  title: {
    default: 'Ryde5 - Premium Ride Booking Service',
    template: '%s | Ryde5',
  },
  description: 'Book premium rides with Ryde5. Safe, reliable, and comfortable transportation at your fingertips.',
  keywords: ['ride booking', 'taxi', 'transportation', 'ride sharing', 'Ryde5'],
  authors: [{ name: 'Ryde5 Team' }],
  creator: 'Ryde5',
  publisher: 'Ryde5',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ryde5.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ryde5.com',
    title: 'Ryde5 - Premium Ride Booking Service',
    description: 'Book premium rides with Ryde5. Safe, reliable, and comfortable transportation at your fingertips.',
    siteName: 'Ryde5',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ryde5 - Premium Ride Booking Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ryde5 - Premium Ride Booking Service',
    description: 'Book premium rides with Ryde5. Safe, reliable, and comfortable transportation at your fingertips.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={raleway.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFA500" />
      </head>
      <body className={`${raleway.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}