'use client';

import { useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { useTheme } from 'next-themes';

import { IoLanguage } from 'react-icons/io5';
import { FiMoreHorizontal } from 'react-icons/fi';
import { TbContrast, TbMoonFilled, TbSunFilled } from 'react-icons/tb';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu';

const MoreDropdown = () => {
    const router = useRouter();

    const params = useParams();

    const i18Language = params?.locale as string;

    const [language, setLanguage] = useState(i18Language);

    const { theme, setTheme } = useTheme();

    const t = useTranslations('');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700' aria-label='More Config'>
                    <FiMoreHorizontal />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='transition duration-200 ease-in-out' side='top'>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className='cursor-pointer space-x-1'>
                        <TbContrast />
                        <span>{t('theme')}</span>
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
                        <span>{t('language')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                                {languageList
                                    .sort((a, b) => (a.value > b.value ? 1 : -1))
                                    .map((language, index) => (
                                        <DropdownMenuRadioItem key={index} value={language.value} className='cursor-pointer space-x-1' onClick={() => router.push('/' + language.value)}>
                                            <span>{language.name}</span>
                                        </DropdownMenuRadioItem>
                                    ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MoreDropdown;

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
        value: 'ko',
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
