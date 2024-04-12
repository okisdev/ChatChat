'use client';

import { IoLanguage } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';
import { LanguageList } from '@/config/i18n';

export const LanguageDropdown = () => {
    const locale = useLocale();

    const router = useRouter();

    const pathname = usePathname();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center space-x-1 rounded-md px-2 py-1 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-700/60'>
                <IoLanguage size={20} />
                <span>{LanguageList.find((l) => l.id === locale)?.flag}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={(value) => {
                        router.push('/' + value + pathname);
                    }}
                >
                    {LanguageList.map((lang) => {
                        return (
                            <DropdownMenuRadioItem key={lang.id} value={lang.id} className='cursor-pointer'>
                                {lang.flag + ' ' + lang.name}
                            </DropdownMenuRadioItem>
                        );
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
