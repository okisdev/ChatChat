'use client';

import { useEffect, useState } from 'react';
import { IoCog } from 'react-icons/io5';
import { TbRosetteFilled } from 'react-icons/tb';
import { useAtom } from 'jotai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { GeneralSettings } from '@/components/layout/settings/general';
import { ProviderSettings } from '@/components/layout/settings/provider';
import { SearchSettings } from '@/components/layout/settings/search';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/custom/dialog';
import { Provider } from '@/config/provider';
import { SearchEngine } from '@/config/search';
import store from '@/hooks/store';
import { SearchEngineSetting } from '@/types/search';
import { AdvancedSettings, Preference, ProviderSetting } from '@/types/settings';

export const SettingsDialog = () => {
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

            Custom: custom!,
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
        <Dialog
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
            <DialogTrigger className='rounded-md px-2 py-1 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-700/60'>
                <IoCog size={20} />
            </DialogTrigger>
            <DialogContent className='flex max-h-[80vh] w-[600px] flex-row dark:border-neutral-500 dark:bg-neutral-700'>
                <div className='flex w-4/12 flex-col space-y-2 border-r border-neutral-200 pr-3 dark:border-neutral-500/30'>
                    <button
                        className={`flex items-center justify-start space-x-1 rounded-md px-3 py-1 transition duration-300 ease-in-out hover:bg-neutral-100 focus:outline-none dark:text-neutral-200 dark:hover:bg-neutral-600/70 ${activeTab === 'general' && 'bg-neutral-200/70 dark:bg-neutral-500/70'}`}
                        onClick={() => {
                            router.push('?open=settings&tab=general');
                            setActiveTab('general');
                        }}
                    >
                        <TbRosetteFilled />
                        <p>{t('general')}</p>
                    </button>
                    <button
                        className={`flex items-center justify-start space-x-1 rounded-md px-3 py-1 transition duration-300 ease-in-out hover:bg-neutral-100 focus:outline-none dark:text-neutral-200 dark:hover:bg-neutral-600/70 ${activeTab === 'provider' && 'bg-neutral-200/70 dark:bg-neutral-500/70'}`}
                        onClick={() => {
                            router.push('?open=settings&tab=provider');
                            setActiveTab('provider');
                        }}
                    >
                        <TbRosetteFilled />
                        <p>{t('provider')}</p>
                    </button>
                    <button
                        className={`flex items-center justify-start space-x-1 rounded-md px-3 py-1 transition duration-300 ease-in-out hover:bg-neutral-100 focus:outline-none dark:text-neutral-200 dark:hover:bg-neutral-600/70 ${activeTab === 'search' && 'bg-neutral-200/70 dark:bg-neutral-500/70'}`}
                        onClick={() => {
                            router.push('?open=settings&tab=search');
                            setActiveTab('search');
                        }}
                    >
                        <TbRosetteFilled />
                        <p>{t('search')}</p>
                    </button>
                </div>
                <div className='flex w-full flex-col justify-between'>
                    {
                        {
                            general: (
                                <GeneralSettings
                                    generalPreferences={generalPreferences}
                                    setGeneralPreferences={setGeneralPreferences}
                                    advancedSettings={advancedSettings}
                                    setAdvancedSettings={setAdvancedSettings}
                                />
                            ),
                            provider: (
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
                            ),
                            search: <SearchSettings currentSearchEngine={currentSearchEngine} setCurrentSearchEngine={setCurrentSearchEngine} tavily={tavily} setTavily={setTavily} />,
                        }[activeTab]
                    }
                    <div className='self-end'>
                        <button onClick={onSave} className='flex cursor-pointer items-center justify-center rounded-md border px-2 py-1 transition duration-300 ease-in-out hover:bg-neutral-300/30'>
                            {t('save')}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
