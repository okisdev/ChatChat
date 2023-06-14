import Image from 'next/image';

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth/session';

import { siteConfig } from '@/config/site.config';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();

    if (user) {
        redirect('/dashboard/profile');
    }

    return (
        <div className='flex min-h-screen'>
            <div className='w-full md:w-8/12'>{children}</div>
            <div className='border-text hidden w-4/12 border-l md:block'>
                <div className='-ml-20 flex h-full items-center'>
                    <div className='flex items-center bg-slate-50 p-6 dark:bg-[#323233]'>
                        <Image src='/hero.png' alt={siteConfig.title} width={60} height={60} priority />
                        <p className='text-center text-xl font-medium'>{siteConfig.title}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
