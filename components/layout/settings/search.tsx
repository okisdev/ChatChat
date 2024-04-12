import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { TavilySearchEngine } from '@/components/layout/settings/searcher/tavily';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/custom/select';
import { SearchEngine, SearchEngines } from '@/config/search';
import { SearchEngineSetting } from '@/types/search';

export const SearchSettings = ({
    currentSearchEngine,
    setCurrentSearchEngine,
    tavily,
    setTavily,
}: {
    currentSearchEngine: SearchEngine;
    setCurrentSearchEngine: (value: SearchEngine) => void;
    tavily: SearchEngineSetting['Tavily'] | null;
    setTavily: (value: SearchEngineSetting['Tavily'] | null) => void;
}) => {
    const t = useTranslations();

    const router = useRouter();

    const RenderProviderSettings = () => {
        switch (currentSearchEngine) {
            case SearchEngine.Tavily:
                return <TavilySearchEngine tavily={tavily} setTavily={setTavily} />;
            case SearchEngine.Google:
            default:
                return null;
        }
    };

    return (
        <div className='space-y-2 rounded-xl bg-neutral-100/70 pt-3 dark:bg-neutral-600'>
            <div className='space-y-2 px-4'>
                <p className='text-sm'>{t('provider')}</p>
                <Select
                    onValueChange={(value) => {
                        router.push('?open=settings&tab=search&search=' + value);
                        setCurrentSearchEngine(SearchEngines.find((searcher) => searcher.name === value)!.name);
                    }}
                >
                    <SelectTrigger className='w-full'>
                        <SelectValue
                            placeholder={
                                <div className='flex flex-row space-x-2'>
                                    <Image src={`/img/${currentSearchEngine}.png`} alt={currentSearchEngine} width={20} height={20} />
                                    <p className='text-sm'>{currentSearchEngine}</p>
                                </div>
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {SearchEngines.toSorted((a, b) => a.name.localeCompare(b.name)).map((searcher) => (
                            <SelectItem key={searcher.id} value={searcher.name}>
                                <div className='flex flex-row space-x-2'>
                                    <Image src={`/img/${searcher.name}.png`} alt={searcher.name} width={20} height={20} />
                                    <p className='text-sm'>{searcher.name}</p>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-3 rounded-xl bg-neutral-200/30 p-4 dark:bg-neutral-700/50'>
                <RenderProviderSettings />
            </div>
        </div>
    );
};
