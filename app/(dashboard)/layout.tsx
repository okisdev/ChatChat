import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/session';

import DashboardNav from '@/components/dashboard/nav';
import DashboardSide from '@/components/dashboard/side';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className='flex h-screen'>
            <DashboardSide />
            <div className='bottom-10 right-10 top-10 m-3 flex-1 rounded-xl bg-white/90 p-10 shadow-lg backdrop-blur-lg backdrop-filter dark:bg-[#202327] md:m-10'>
                <DashboardNav user={user} />
                <div className='content-area h-[calc(100vh-220px)] overflow-y-scroll'>{children}</div>
            </div>
        </div>
    );
}
