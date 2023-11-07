'use client';

import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TabSearch = ({
    searchEngine,
    searchEngineID,
    searchAPIKey,
    setSearchEngine,
    setSearchEngineID,
    setSearchAPIKey,
}: {
    searchEngine: string;
    searchEngineID: string;
    searchAPIKey: string;
    setSearchEngine: (searchEngine: string) => void;
    setSearchEngineID: (searchEngineID: string) => void;
    setSearchAPIKey: (searchAPIKey: string) => void;
}) => {
    const t = useTranslations('');

    return (
        <div className='space-y-3'>
            <div>
                <Label>{t('Search Engine')}</Label>
                <Select value={searchEngine} onValueChange={(value: string) => setSearchEngine(value)}>
                    <SelectTrigger className='w-full'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {searchEnginesList.map((engine) => {
                            return (
                                <SelectItem key={engine.value} value={engine.value}>
                                    {engine.name}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Search Engine ID</Label>
                <Input placeholder='55b885......' value={searchEngineID} onChange={(e) => setSearchEngineID(e.target.value)} />
            </div>
            <div>
                <Label>Search API Key</Label>
                <Input placeholder='AIzaSyB......' value={searchAPIKey} onChange={(e) => setSearchAPIKey(e.target.value)} />
            </div>
        </div>
    );
};

export default TabSearch;

const searchEnginesList = [
    {
        name: 'Programmable Search Engine (By Google)',
        value: 'pse',
    },
];
