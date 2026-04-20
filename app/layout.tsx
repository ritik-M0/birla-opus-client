import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Birla Opus Field Measurement App',
  description: 'Birla Opus Field Measurement App for fast, photo-based wall and ceiling measurement. Capture site images, review paintable and non-paintable areas, and manage measurement history in a simple field-ready workflow.',
  generator: 'v0.app',
  openGraph: {
    title: 'Birla Opus Field Measurement App',
    description: 'Birla Opus Field Measurement App for fast, photo-based wall and ceiling measurement. Capture site images, review paintable and non-paintable areas, and manage measurement history in a simple field-ready workflow.',
    type: 'website',
    url: 'https://birla-opus-measurement.vercel.app',
    images: [
      {
        url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/birla%20image-OF85rZkrUst9QCpKc4ltFIDNXHne5K.jpg',
        width: 1200,
        height: 630,
        alt: 'Birla Opus Field Measurement App',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birla Opus Field Measurement App',
    description: 'Birla Opus Field Measurement App for fast, photo-based wall and ceiling measurement. Capture site images, review paintable and non-paintable areas, and manage measurement history in a simple field-ready workflow.',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/birla%20image-OF85rZkrUst9QCpKc4ltFIDNXHne5K.jpg',
    ],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
