'use client';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { BiArrowBack } from 'react-icons/bi';
import { CgMenuBoxed } from 'react-icons/cg';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { customConfig } from '@/config/custom.config';

const DashboardSide = () => {
    const router = useRouter();

    const t = useTranslations('dashboard');

    return (
        <>
            <div className='fixed bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-stone-500 text-white md:hidden'>
                <Sheet>
                    <SheetTrigger asChild>
                        <button>
                            <CgMenuBoxed />
                        </button>
                    </SheetTrigger>
                    <SheetContent position='right' size='xl'>
                        <div className='items-left flex flex-col space-y-10'>
                            {DashboardSideItems.map((item, index) => (
                                <div key={index} className='flex flex-col space-y-2'>
                                    <p className='text-gray-500/70'>{t(item.name)}</p>
                                    {item.children && (
                                        <div className='flex w-auto flex-col items-start space-y-1'>
                                            {item.children.map((child, index) => (
                                                <Button variant='ghost' key={index} className='text-gray-500' onClick={() => router.push('/dashboard/' + item.base + '/' + child.href)}>
                                                    {t(child.name)}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div className='hidden p-10 md:block md:w-2/12'>
                <div className='flex h-full flex-col justify-between'>
                    <div>
                        <Button variant='outline' className='inline-flex items-center space-x-2 dark:bg-stone-600' onClick={() => router.push('/')}>
                            <BiArrowBack />
                            <p>{t('Back')}</p>
                        </Button>
                    </div>
                    <div className='items-left flex flex-col space-y-10'>
                        {DashboardSideItems.map((item, index) => (
                            <div key={index} className='flex flex-col space-y-2'>
                                <p className='text-gray-500/70'>{t(item.name)}</p>
                                {item.children && (
                                    <div className='flex w-auto flex-col items-start space-y-1'>
                                        {item.children.map((child, index) => (
                                            <Button variant='ghost' key={index} className='text-gray-500' onClick={() => router.push('/dashboard/' + item.base + '/' + child.href)}>
                                                {t(child.name)}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className='text-sm'>{customConfig.Dashboard.side}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardSide;

export const DashboardSideItems = [
    {
        name: 'Profile',
        base: 'profile',
        children: [
            {
                name: 'Overview',
                href: 'info',
                description: `Manage personal info for profile`,
            },
            {
                name: 'Record',
                href: 'record',
                description: `Your account Conversation Record`,
            },
            {
                name: 'Settings',
                href: 'settings',
                description: `Advanced configuration for your account`,
            },
        ],
    },
    {
        name: 'Team',
        base: 'team',
        children: [
            {
                name: 'Overview',
                href: 'info',
                description: 'Team Overview',
            },
        ],
    },
];
