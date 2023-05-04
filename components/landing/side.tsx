'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { signOut } from 'next-auth/react';

import { User } from '@prisma/client';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import { RxAvatar } from 'react-icons/rx';
import { IoLanguage } from 'react-icons/io5';
import { HiChatBubbleLeft } from 'react-icons/hi2';
import { FiMoreHorizontal } from 'react-icons/fi';
import { TbContrast, TbMoonFilled, TbSunFilled } from 'react-icons/tb';
import { GrGithub, GrValidate, GrNodes, GrMail } from 'react-icons/gr';

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

import SideHistory from '@/components/landing/side-history';
import SideAppSettings from '@/components/landing/side-app-settings';
import SideUserSettings from '@/components/landing/side-user-settings';

const LandingSide = ({ className, user }: { className?: string; user: User | null }) => {
    const router = useRouter();

    const [theme, setTheme] = useAtom(store.themeAtom);
    const [language, setLanguage] = useAtom(store.languageAtom);

    const isHiddenSide = useAtom(store.isHiddenSideAtom)[0];

    if (isHiddenSide) return null;

    return (
        <aside className={'bottom-1 left-0 top-1 z-10 h-full flex-col justify-between rounded-lg backdrop-blur md:fixed md:w-80 ' + className}>
            <div className='space-y-2 p-1'>
                <div className='flex items-center justify-between border-b px-1'>
                    <div className='p-1'>
                        <p className='gradient-flow bg-gradient-to-r bg-clip-text text-lg font-semibold leading-none text-transparent md:text-xl'>{siteConfig.title}</p>
                        <p className='text-xs font-medium'>{siteConfig.description}</p>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <button
                        className='inline-flex items-center space-x-1 rounded p-1 px-2 text-sm font-medium transition duration-200 ease-in-out hover:bg-gray-200'
                        onClick={() => (location.href = '')}
                    >
                        <HiChatBubbleLeft />
                        <span>New Conversation</span>
                    </button>
                </div>
                <SideHistory />
            </div>
            <div className='p-1'>
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className='m-1 flex flex-grow flex-row items-center justify-start space-x-2 rounded-lg bg-white/90 py-1 shadow backdrop-blur transition-transform duration-500 dark:bg-gray-800'>
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
                            <DropdownMenuItem onClick={() => router.push('/profile/info')}>Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/profile/team')}>Team</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    signOut({
                                        callbackUrl: '/',
                                    })
                                }
                            >
                                Sign Out
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
                                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200' aria-label='More Config'>
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
                                <DropdownMenuItem>
                                    <Link href='https://github.com/okisdev/ChatChat' className='flex w-full items-center space-x-2' target='_blank'>
                                        <GrGithub className='block' />
                                        <span>Project GitHub</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className='cursor-pointer space-x-1'>
                                        <TbContrast />
                                        <span>Theme</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                                {themeList.map((theme, index) => (
                                                    <DropdownMenuRadioItem key={index} value={theme.value} className='cursor-pointer space-x-1'>
                                                        {theme.icon}
                                                        <span>{theme.name}</span>
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
                                        <span>Language</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                                                {languageList.map((language, index) => (
                                                    <DropdownMenuRadioItem key={index} value={language.value} className='cursor-pointer space-x-1'>
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
        name: '简体中文',
    },
    {
        value: 'zh-TW',
        name: '繁体中文',
    },
    {
        value: 'en',
        name: 'English',
    },
];
