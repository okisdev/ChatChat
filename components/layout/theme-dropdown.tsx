'use client';

import { useEffect, useState } from 'react';
import { IoInvertMode } from 'react-icons/io5';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';
import { ThemeList } from '@/config/theme';

export const ThemeDropdown = () => {
    const t = useTranslations();

    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center space-x-1 rounded-md px-2 py-0.5 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-700/60'>
                <IoInvertMode size={20} />
                <div className='block dark:hidden'>🌞</div>
                <div className='hidden dark:block'>🌚</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => {
                        setTheme(value);
                    }}
                >
                    {ThemeList.map((theme) => {
                        return (
                            <DropdownMenuRadioItem key={theme.id} value={theme.id}>
                                {theme.icon + ' ' + t(`${theme.name.toString().toLowerCase()}`)}
                            </DropdownMenuRadioItem>
                        );
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
