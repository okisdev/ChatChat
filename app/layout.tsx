import type { Metadata } from 'next';
import { geistSans } from '@/styles/font';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Chat Chat',
  description: 'Chat Chat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <script
            crossOrigin='anonymous'
            src='//unpkg.com/react-scan/dist/auto.global.js'
          />
        )}
      </head>
      <body className={cn(geistSans.className, 'antialiased')}>{children}</body>
    </html>
  );
}
