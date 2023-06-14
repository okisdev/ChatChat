'use client';

import { usePathname } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { signOut } from 'next-auth/react';

import { RxAvatar } from 'react-icons/rx';
import { AiOutlineCaretRight } from 'react-icons/ai';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { DashboardSideItems } from '@/components/dashboard/side';
import { Separator } from '@/components/ui/separator';

const DashboardNav = ({ user }: { user: any }) => {
    const pathname = usePathname();

    const t = useTranslations('dashboard');

    const i18n = /^\/[a-z]{2}-[A-Z]{2}\//.test(pathname ?? '');

    const breadcrumbs = pathname
        ?.split('/')
        .filter((path) => path !== '')
        .splice(i18n ? 2 : 1);

    const description = DashboardSideItems.find((item) => item.base === breadcrumbs?.[0])?.children.find((child) => child.href === breadcrumbs?.[1])?.description;

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex'>
                    {breadcrumbs?.map((breadcrumb, index) => (
                        <div key={index} className='inline-flex items-center text-2xl font-medium uppercase text-gray-500 dark:text-stone-200'>
                            <span className='tracking-wide'>{t(breadcrumb)}</span>
                            {index !== breadcrumbs.length - 1 && (
                                <span className='mx-2 inline-block'>
                                    <AiOutlineCaretRight />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className='inline-flex items-center justify-center space-x-1 rounded-lg p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'>
                            {user.image ? <AvatarImage src={user?.image} /> : <RxAvatar className='text-2xl' />}
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <div className='px-1'>
                            <p className='font-medium'>{user?.name}</p>
                            <p className='text-xs text-slate-800 dark:text-stone-300'>{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <button
                                onClick={() =>
                                    signOut({
                                        callbackUrl: '/',
                                    })
                                }
                            >
                                {t('Sign out')}
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <p className='text-sm text-gray-400'>{t(description)}</p>
            </div>
            <Separator className='my-3' />
        </div>
    );
};

export default DashboardNav;
