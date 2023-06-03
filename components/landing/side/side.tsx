'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { signOut } from 'next-auth/react';

import { User } from '@prisma/client';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import { useTheme } from 'next-themes';

import { GrGithub } from 'react-icons/gr';
import { RxAvatar } from 'react-icons/rx';
import { IoLanguage } from 'react-icons/io5';
import { HiChatBubbleLeft } from 'react-icons/hi2';
import { FiMoreHorizontal } from 'react-icons/fi';
import { TbContrast, TbMoonFilled, TbSunFilled } from 'react-icons/tb';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';

import { siteConfig, sidebarMoreMenu } from '@/config/site.config';

import SideHistory from '@/components/landing/side/side-history';
import SideAppSettings from '@/components/landing/side/side-app-settings';
import SideUserSettings from '@/components/landing/side/side-user-settings';

const LandingSide = ({ className, user }: { className?: string; user: User | null }) => {
    const router = useRouter();

    const params = useParams();

    const i18Language = params?.locale as string;

    const [language, setLanguage] = useState(i18Language);

    const { theme, setTheme } = useTheme();

    const t = useTranslations('landing');

    const isHiddenSide = useAtom(store.isHiddenSideAtom)[0];

    if (isHiddenSide) return null;

    return (
        <aside className={'bottom-1 left-0 top-1 z-10 h-full flex-col justify-between rounded-lg backdrop-blur md:fixed md:w-80 ' + className}>
            <div className='space-y-2 md:p-1'>
                <div className='flex items-center justify-between border-b px-1'>
                    <div className='p-1'>
                        <p className='gradient-flow bg-gradient-to-r bg-clip-text text-lg font-semibold leading-none text-transparent md:text-xl'>{siteConfig.title}</p>
                        <p className='text-xs font-medium'>{t(siteConfig.description)}</p>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <button
                        className='inline-flex items-center space-x-1 rounded p-1 px-2 text-sm font-medium transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                        onClick={() => (location.href = '/')}
                    >
                        <HiChatBubbleLeft />
                        <span>{t('New Conversation')}</span>
                    </button>
                </div>
                <SideHistory />
            </div>
            <div className='p-1'>
                {user && (
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
                            <DropdownMenuItem onClick={() => router.push('/profile/info')}>{t('Profile')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/profile/team')}>{t('Team')}</DropdownMenuItem>
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
                )}
                <div className='flex flex-row items-center justify-between p-3'>
                    <div className='flex space-x-3'>
                        <SideAppSettings user={user} />
                        {!user && <SideUserSettings />}
                    </div>
                    <div className='flex'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                    aria-label='More Config'
                                >
                                    <FiMoreHorizontal />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='transition duration-200 ease-in-out' side='top'>
                                {sidebarMoreMenu.map((item, index) => {
                                    return (
                                        <DropdownMenuItem key={index}>
                                            <Link href={item.url} className='flex w-full items-center space-x-2' target='_blank'>
                                                <item.icon className='block' />
                                                <span>{item.title}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    );
                                })}
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className='cursor-pointer space-x-1'>
                                        <TbContrast />
                                        <span>{t('Theme')}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                                {themeList.map((theme, index) => (
                                                    <DropdownMenuRadioItem key={index} value={theme.value} className='cursor-pointer space-x-1'>
                                                        {theme.icon}
                                                        <span>{t(theme.name)}</span>
                                                    </DropdownMenuRadioItem>
                                                ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className='cursor-pointer space-x-1'>
                                        <IoLanguage />
                                        <span>{t('Language')}</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                                                {languageList
                                                    .sort((a, b) => (a.value > b.value ? 1 : -1))
                                                    .map((language, index) => (
                                                        <DropdownMenuRadioItem key={index} value={language.value} className='cursor-pointer space-x-1' onClick={() => router.push(language.value)}>
                                                            <span>{language.name}</span>
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default LandingSide;

const themeList = [
    {
        name: 'Light',
        value: 'light',
        icon: <TbSunFilled />,
    },
    {
        name: 'Dark',
        value: 'dark',
        icon: <TbMoonFilled />,
    },
    {
        name: 'System',
        value: 'system',
        icon: <TbContrast />,
    },
];

const languageList = [
    {
        value: 'zh-CN',
        name: '🇨🇳 简体中文',
    },
    {
        value: 'zh-HK',
        name: '🇭🇰 繁体中文',
    },
    {
        value: 'en',
        name: '🇺🇸 English',
    },
    {
        value: 'ja',
        name: '🇯🇵 日本語',
    },
    {
        value: 'kr',
        name: '🇰🇷 한국어',
    },
    {
        value: 'ru',
        name: '🇷🇺 Русский',
    },
    {
        value: 'de',
        name: '🇩🇪 Deutsch',
    },
    {
        value: 'fr',
        name: '🇫🇷 Français',
    },
    {
        value: 'es',
        name: '🇪🇸 Español',
    },
];
