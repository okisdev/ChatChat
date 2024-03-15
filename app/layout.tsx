import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import '@/styles/globals.css';

const source_sans_3 = Source_Sans_3({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Chat Chat',
    description: 'Chat Chat',
};

export default function RootLayout({
    children,
    params: { locale },
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    return (
        <html lang={locale} className={source_sans_3.className}>
            <body>{children}</body>
        </html>
    );
}
