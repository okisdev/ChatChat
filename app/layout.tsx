import type { Metadata, Viewport } from 'next';
import { Onest } from 'next/font/google';

import RootProvider from '@/app/provider';

import '@/styles/globals.css';
import 'tippy.js/dist/tippy.css';

const onest = Onest({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Chat Chat',
    description: 'Chat Chat - Unlock next-level conversations with AI',

    manifest: '/manifest.json',

    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Chat Chat',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
    params: { locale },
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    return (
        <html lang={locale} className={onest.className} suppressHydrationWarning>
            <RootProvider>{children}</RootProvider>
        </html>
    );
}
