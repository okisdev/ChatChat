'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/custom/dialog';

import { useEffect, useState } from 'react';
import { IoCog } from 'react-icons/io5';
import { RiNumber0, RiNumber1, RiNumber2 } from 'react-icons/ri';
import { TbRosetteFilled } from 'react-icons/tb';

import { useSearchParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { GeneralPreferences, GeneralProviderSettings } from '@/types/settings';
import store from '@/hooks/store';

import { GeneralSettings } from '@/components/layout/settings/general';
import { AdvancedSettings } from '@/components/layout/settings/advanced';
import { ProviderSettings } from '@/components/layout/settings/provider';
import { Provider } from '@/config/provider';

export default function SettingsDialog() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [activeTab, setActiveTab] = useState<string>('general');

    const searchParams = useSearchParams();

    const open = searchParams.get('open');
    const tab = searchParams.get('tab');
    const provider = searchParams.get('provider');

    const [generalPreferences, setGeneralPreferences] = useAtom<GeneralPreferences>(store.generalPreferencesAtom);
    const [generalProviderSettings, setGeneralProviderSettings] = useAtom<GeneralProviderSettings | null>(store.generalProviderSettingsAtom);

    const [currentProvider, setCurrentProvider] = useState<Provider>((provider as Provider) ?? Provider.OpenAI);

    const [anthropic, setAnthropic] = useState<GeneralProviderSettings['Anthropic'] | null>(generalProviderSettings?.Anthropic || null);
    const [azure, setAzure] = useState<GeneralProviderSettings['Azure'] | null>(generalProviderSettings?.Azure || null);
    const [cohere, setCohere] = useState<GeneralProviderSettings['Cohere'] | null>(generalProviderSettings?.Cohere || null);
    const [fireworks, setFireworks] = useState<GeneralProviderSettings['Fireworks'] | null>(generalProviderSettings?.Fireworks || null);
    const [google, setGoogle] = useState<GeneralProviderSettings['Google'] | null>(generalProviderSettings?.Google || null);
    const [groq, setGroq] = useState<GeneralProviderSettings['Groq'] | null>(generalProviderSettings?.Groq || null);
    const [huggingFace, setHuggingFace] = useState<GeneralProviderSettings['HuggingFace'] | null>(generalProviderSettings?.HuggingFace || null);
    const [mistral, setMistral] = useState<GeneralProviderSettings['Mistral'] | null>(generalProviderSettings?.Mistral || null);
    const [openAI, setOpenAI] = useState<GeneralProviderSettings['OpenAI'] | null>(generalProviderSettings?.OpenAI || null);
    const [perplexity, setPerplexity] = useState<GeneralProviderSettings['Perplexity'] | null>(generalProviderSettings?.Perplexity || null);

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
            if (tab === 'advanced') {
                setActiveTab('advanced');
            }
        }
    }, [open]);

    const onSave = () => {
        setGeneralProviderSettings({
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

        setIsOpen(false);

        router.back();
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
            <DialogTrigger className='rounded-md p-3 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60'>
                <IoCog size={20} />
            </DialogTrigger>
            <DialogContent className='flex flex-row'>
                <div className='flex w-4/12 flex-col space-y-2 border-r pr-3'>
                    <button
                        className={`flex items-center justify-start space-x-1 rounded-md px-3 py-1 transition duration-300 ease-in-out hover:bg-neutral-100 focus:outline-none ${activeTab === 'general' && 'bg-neutral-200/70'}`}
                        onClick={() => {
                            router.push('?open=settings&tab=general');
                            setActiveTab('general');
                        }}
                    >
                        <TbRosetteFilled />
                        <p>General</p>
                    </button>
                    <button
                        className={`flex items-center justify-start space-x-1 rounded-md px-3 py-1 transition duration-300 ease-in-out hover:bg-neutral-100 focus:outline-none ${activeTab === 'provider' && 'bg-neutral-200/70'}`}
                        onClick={() => {
                            router.push('?open=settings&tab=provider');
                            setActiveTab('provider');
                        }}
                    >
                        <TbRosetteFilled />
                        <p>Provider</p>
                    </button>
                    <button
                        className={`flex items-center justify-start space-x-1 rounded-md px-3 py-1 transition duration-300 ease-in-out hover:bg-neutral-100 focus:outline-none ${activeTab === 'advanced' && 'bg-neutral-200/70'}`}
                        onClick={() => {
                            router.push('?open=settings&tab=advanced');
                            setActiveTab('advanced');
                        }}
                    >
                        <TbRosetteFilled />
                        <p>Advanced</p>
                    </button>
                </div>
                <div className='flex w-full flex-col justify-between'>
                    {
                        {
                            general: <GeneralSettings generalPreferences={generalPreferences} setGeneralPreferences={setGeneralPreferences} />,
                            provider: (
                                <ProviderSettings
                                    currentProvider={currentProvider}
                                    setCurrentProvider={setCurrentProvider}
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
                                />
                            ),
                            advanced: <AdvancedSettings />,
                        }[activeTab]
                    }
                    <div className='self-end'>
                        <Button variant='outline' onClick={onSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
