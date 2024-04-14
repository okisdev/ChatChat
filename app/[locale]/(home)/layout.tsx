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
            <main className='m-2 flex h-screen flex-1 flex-col rounded-lg bg-white/70 p-1 shadow dark:bg-neutral-600/30 dark:text-neutral-200/70 md:m-3'>{children}</main>
        </HomeProvider>
    );
}
