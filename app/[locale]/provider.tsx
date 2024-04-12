import { NextIntlClientProvider, useMessages } from 'next-intl';

export default function LocaleProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const messages = useMessages();

    return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
