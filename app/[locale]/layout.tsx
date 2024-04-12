import LocaleProvider from '@/app/[locale]/provider';

import '@/styles/globals.css';

export default function LocaleLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LocaleProvider>
            <body className='relative z-0 flex size-full min-h-screen overflow-hidden bg-slate-50 dark:bg-[#222] dark:text-[#eee]'>{children}</body>
        </LocaleProvider>
    );
}
