'use client';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { signOut } from 'next-auth/react';

import { User } from '@prisma/client';

import { RxAvatar } from 'react-icons/rx';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const UserDropdown = ({ user }: { user: User }) => {
    const router = useRouter();

    const t = useTranslations('');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className='m-1 flex flex-grow flex-row items-center justify-start space-x-2 rounded-lg bg-white/90 py-1 shadow backdrop-blur transition-transform duration-500 dark:bg-[#202327]'>
                    <Avatar className='inline-flex items-center justify-center'>{user?.image ? <AvatarImage src={user.image} /> : <RxAvatar className='text-2xl' />}</Avatar>
                    <p>{user.name}</p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex w-72 flex-col'>
                <div className='px-1'>
                    <p className='font-medium'>{user?.name}</p>
                    <p className='text-xs text-slate-700'>{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile/info')}>{t('Profile')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/team/info')}>{t('Team')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        signOut({
                            callbackUrl: '/',
                        })
                    }
                >
                    {t('Sign Out')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
