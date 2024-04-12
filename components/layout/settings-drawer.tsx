'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { GeneralSettings } from '@/components/layout/settings/general';
import { ProviderSettings } from '@/components/layout/settings/provider';
import { SearchSettings } from '@/components/layout/settings/search';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/custom/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Provider } from '@/config/provider';
import { SearchEngine } from '@/config/search';
import store from '@/hooks/store';
import { SearchEngineSetting } from '@/types/search';
import { AdvancedSettings, Preference, ProviderSetting } from '@/types/settings';

export const SettingsDrawer = () => {
    const router = useRouter();

    const t = useTranslations();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<string>('general');

    const searchParams = useSearchParams();

    const open = searchParams.get('open');
    const tab = searchParams.get('tab');
    const provider = searchParams.get('provider');
    const search = searchParams.get('search');

    const [generalPreferences, setGeneralPreferences] = useAtom<Preference>(store.preferencesAtom);
    const [advancedSettings, setAdvancedSettings] = useAtom<AdvancedSettings>(store.advancedSettingsAtom);

    // Provider settings
    const [currentProvider, setCurrentProvider] = useState<Provider>((provider as Provider) ?? Provider.OpenAI);
    const [currentProviderSettings, setCurrentProviderSettings] = useAtom<ProviderSetting | null>(store.currentProviderSettingsAtom);

    const [amazon, setAmazon] = useState<ProviderSetting['Amazon'] | null>(currentProviderSettings?.Amazon || null);
    const [anthropic, setAnthropic] = useState<ProviderSetting['Anthropic'] | null>(currentProviderSettings?.Anthropic || null);
    const [azure, setAzure] = useState<ProviderSetting['Azure'] | null>(currentProviderSettings?.Azure || null);
    const [cohere, setCohere] = useState<ProviderSetting['Cohere'] | null>(currentProviderSettings?.Cohere || null);
    const [fireworks, setFireworks] = useState<ProviderSetting['Fireworks'] | null>(currentProviderSettings?.Fireworks || null);
    const [google, setGoogle] = useState<ProviderSetting['Google'] | null>(currentProviderSettings?.Google || null);
    const [groq, setGroq] = useState<ProviderSetting['Groq'] | null>(currentProviderSettings?.Groq || null);
    const [huggingFace, setHuggingFace] = useState<ProviderSetting['HuggingFace'] | null>(currentProviderSettings?.HuggingFace || null);
    const [mistral, setMistral] = useState<ProviderSetting['Mistral'] | null>(currentProviderSettings?.Mistral || null);
    const [openAI, setOpenAI] = useState<ProviderSetting['OpenAI'] | null>(currentProviderSettings?.OpenAI || null);
    const [perplexity, setPerplexity] = useState<ProviderSetting['Perplexity'] | null>(currentProviderSettings?.Perplexity || null);

    const [custom, setCustom] = useState<ProviderSetting['Custom'] | null>(currentProviderSettings?.Custom || null);

    // --------------------------------------------------

    // Search Provider settings
    const [currentSearchEngine, setCurrentSearchEngine] = useState<SearchEngine>((search as SearchEngine) ?? SearchEngine.Tavily);
    const [currentSearchEngineSettings, setCurrentSearchEngineSettings] = useAtom<SearchEngineSetting | null>(store.currentSearchEngineSettingsAtom);

    const [tavily, setTavily] = useState<SearchEngineSetting['Tavily'] | null>(currentSearchEngineSettings?.Tavily || null);

    // --------------------------------------------------

    useEffect(() => {
        if (open === 'settings') {
            setIsOpen(true);

            if (tab === 'general') {
                setActiveTab('general');
            }
            if (tab === 'provider') {
                setActiveTab('provider');

                if (provider) {
                    setCurrentProvider(provider as Provider);
                }
            }
            if (tab == 'search') {
                setActiveTab('search');

                if (search) {
                    setCurrentSearchEngine(search as SearchEngine);
                }
            }
        }
    }, [open]);

    const onSave = () => {
        setCurrentProviderSettings({
            Anthropic: anthropic!,
            Cohere: cohere!,
            Fireworks: fireworks!,
            Google: google!,
            Groq: groq!,
            HuggingFace: huggingFace!,
            Mistral: mistral!,
            OpenAI: openAI!,
            Perplexity: perplexity!,
        });

        setCurrentSearchEngineSettings({
            Tavily: tavily!,
        });

        setIsOpen(false);

        router.back();

        toast.success(t('settings_saved'), {
            position: 'top-right',
            duration: 1500,
        });
    };

    return (
        <Drawer
            open={isOpen}
            onOpenChange={(open) => {
                if (open) {
                    router.push('?open=settings');
                } else {
                    router.push('?');
                }
                setIsOpen(open);
            }}
        >
            <DrawerContent className='min-h-96'>
                <DrawerHeader>
                    <DrawerTitle className='flex w-full items-center justify-center'>
                        <Tabs
                            className='w-full'
                            value={activeTab}
                            onValueChange={(value) => {
                                setActiveTab(value);
                                if (value === 'general') {
                                    router.push('?open=settings&tab=general');
                                }
                                if (value === 'provider') {
                                    router.push('?open=settings&tab=provider');
                                }
                                if (value === 'search') {
                                    router.push('?open=settings&tab=search');
                                }
                            }}
                        >
                            <TabsList className='dark:bg-neutral-700'>
                                <TabsTrigger value='general'>{t('general')}</TabsTrigger>
                                <TabsTrigger value='provider'>{t('provider')}</TabsTrigger>
                                <TabsTrigger value='search'>{t('search')}</TabsTrigger>
                            </TabsList>
                            <TabsContent value='general'>
                                <GeneralSettings
                                    generalPreferences={generalPreferences}
                                    setGeneralPreferences={setGeneralPreferences}
                                    advancedSettings={advancedSettings}
                                    setAdvancedSettings={setAdvancedSettings}
                                />
                            </TabsContent>
                            <TabsContent value='provider'>
                                <ProviderSettings
                                    currentProvider={currentProvider}
                                    setCurrentProvider={setCurrentProvider}
                                    amazon={amazon}
                                    setAmazon={setAmazon}
                                    openAI={openAI}
                                    setOpenAI={setOpenAI}
                                    google={google}
                                    setGoogle={setGoogle}
                                    anthropic={anthropic}
                                    setAnthropic={setAnthropic}
                                    azure={azure}
                                    setAzure={setAzure}
                                    cohere={cohere}
                                    setCohere={setCohere}
                                    fireworks={fireworks}
                                    setFireworks={setFireworks}
                                    groq={groq}
                                    setGroq={setGroq}
                                    huggingFace={huggingFace}
                                    setHuggingFace={setHuggingFace}
                                    mistral={mistral}
                                    setMistral={setMistral}
                                    perplexity={perplexity}
                                    setPerplexity={setPerplexity}
                                    custom={custom}
                                    setCustom={setCustom}
                                />
                            </TabsContent>
                            <TabsContent value='search'>
                                <SearchSettings currentSearchEngine={currentSearchEngine} setCurrentSearchEngine={setCurrentSearchEngine} tavily={tavily} setTavily={setTavily} />
                            </TabsContent>
                        </Tabs>
                    </DrawerTitle>
                </DrawerHeader>
                <div className='m-5 self-end'>
                    <Button variant='outline' onClick={onSave}>
                        {t('save')}
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
