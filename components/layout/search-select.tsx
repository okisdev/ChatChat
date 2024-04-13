import { IoChevronDown } from 'react-icons/io5';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/custom/dropdown-menu';
import { SearchEngine } from '@/config/search';
import store from '@/hooks/store';
import { SearchEngineSetting } from '@/types/search';

export const SearchSelect = () => {
    const t = useTranslations();

    const [currentSearchEngine, setCurrentSearchEngine] = useAtom<SearchEngine>(store.currentSearchEngineAtom);
    const [currentSearchEngineSettings] = useAtom<SearchEngineSetting | null>(store.currentSearchEngineSettingsAtom);

    const hasKeyStored = process.env['NEXT_PUBLIC_ACCESS_TAVILY_SEARCH'] == 'true';

    const isTavilyConfigured = (currentSearchEngineSettings && currentSearchEngineSettings.Tavily !== null) || hasKeyStored;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-500/40'>
                <Image src={`/img/${currentSearchEngine}.png`} alt={currentSearchEngine} width={16} height={16} />
                <p className='text-sm'>{currentSearchEngine}</p>
                <IoChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup
                    value={currentSearchEngine === SearchEngine.Tavily ? SearchEngine.Tavily : undefined}
                    onValueChange={(value) => {
                        setCurrentSearchEngine(value === 'Tavily' ? SearchEngine.Tavily : SearchEngine.Google);
                    }}
                >
                    {!isTavilyConfigured ? (
                        <>
                            <DropdownMenuLabel className='flex items-center space-x-1'>
                                <p className='text-xs text-red-600/90'>{t('search_engine_not_configured')}</p>
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                                <Link href={`?open=settings&tab=search&search=Tavily`} className='cursor-pointer'>
                                    {t('go_to_settings')}
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    ) : (
                        hasKeyStored && (
                            <>
                                <DropdownMenuLabel className='flex items-center space-x-1'>
                                    <p className='text-xs text-sky-600/90'>{t('search_engine_configured_globally')}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )
                    )}
                    <DropdownMenuRadioItem key='tavily' value={SearchEngine.Tavily} className='cursor-pointer'>
                        <div className='flex cursor-pointer items-center space-x-2'>
                            <Image src={`/img/Tavily.png`} alt='Tavily' width={16} height={16} />
                            <p>Tavily</p>
                        </div>
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
