'use client';

import { IoMdAdd } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import { RiChat1Line } from 'react-icons/ri';
import Tippy from '@tippyjs/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';

export const AddButton = () => {
    const router = useRouter();

    const t = useTranslations();

    const pathname = usePathname();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Tippy content={t('new_conversation')}>
                    <button className='flex cursor-pointer items-center space-x-2 rounded-md p-2 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-500/40'>
                        <IoMdAdd />
                        <span className='text-xs'>{pathname === '/' ? t('chat') : t('search')}</span>
                    </button>
                </Tippy>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={() => {
                        if (pathname === '/') {
                            router.refresh();
                        } else {
                            router.push('/');
                        }
                    }}
                    className='flex cursor-pointer items-center justify-between'
                >
                    <span>{t('chat')}</span>
                    <RiChat1Line size={16} />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        if (pathname === '/search') {
                            router.refresh();
                        } else {
                            router.push('/search');
                        }
                    }}
                    className='flex cursor-pointer items-center justify-between'
                >
                    <span>{t('search')}</span>
                    <IoSearch size={16} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
