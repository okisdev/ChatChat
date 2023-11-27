import '@/styles/globals.css';
import '@/styles/markdown.css';
import 'tippy.js/dist/tippy.css';

import { NextIntlClientProvider } from 'next-intl';

import { HotToaster } from '@/components/client/toaster';
import { ClientCommand } from '@/components/client/command';

import { notFound } from 'next/navigation';

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
    let locales;

    try {
        locales = (await import(`../../locales/${locale}.json`)).default;
    } catch (error) {
        notFound();
    }

    return (
        <NextIntlClientProvider locale={locale} messages={locales}>
            <HotToaster />
            <ClientCommand />

            {children}
        </NextIntlClientProvider>
    );
}
