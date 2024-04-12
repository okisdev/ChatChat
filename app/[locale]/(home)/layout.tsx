import HomeProvider from '@/app/[locale]/(home)/provider';
import AppSidebar from '@/app/[locale]/(home)/sidebar';

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <HomeProvider>
            <AppSidebar />

            {children}
        </HomeProvider>
    );
}
