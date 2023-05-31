'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom, useAtomValue } from 'jotai';

import Tippy from '@tippyjs/react';

import { MdInfoOutline } from 'react-icons/md';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const HeaderSettings = () => {
    const t = useTranslations('landing');

    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

    // Text To Speech
    const synth = typeof window !== 'undefined' && window.speechSynthesis;
    const voices = synth && synth.getVoices();

    const [ttsVoice, setTTSVoice] = useState<string>('');
    const [ttsSpeed, setTTSSpeed] = useState<number>(1.0);
    const [ttsPitch, setTTSPitch] = useState<number>(1.0);
    const [ttsSample, setTTSSample] = useState<string>('Hello. I am your virtual AI assistant.');

    const [ttsConfig, setTTSConfig] = useAtom(store.textToSpeechConfigAtom);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const serviceProvider = useAtomValue(store.serviceProviderAtom);

    const [isSendKeyEnter, setIsSendKeyEnter] = useAtom(store.isSendKeyEnterAtom);

    // Search
    const [searchEngine, setSearchEngine] = useState<string>(searchEnginesList[0].name);
    const [searchEngineID, setSearchEngineID] = useState<string>('');
    const [searchAPIKey, setSearchAPIKey] = useState<string>('');

    const [searchConfig, setSearchConfig] = useAtom(store.searchConfigAtom);

    useEffect(() => {
        if (synth) {
            const loadVoices = async () => {
                const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
                    const voiceList = synth.getVoices();
                    if (voiceList.length) {
                        resolve(voiceList);
                    } else {
                        synth.addEventListener('voiceschanged', () => {
                            resolve(synth.getVoices());
                        });
                    }
                });

                setTTSVoice(voices[0]?.name);
            };

            loadVoices();
        }
    }, [synth]);

    useEffect(() => {
        if (ttsConfig) {
            setTTSVoice(ttsConfig.voice);
            setTTSSpeed(ttsConfig.speed);
            setTTSPitch(ttsConfig.pitch);
        }
    }, [ttsConfig]);

    useEffect(() => {
        if (searchConfig) {
            setSearchEngine(searchConfig.searchEngine);
            setSearchEngineID(searchConfig.searchEngineID);
            setSearchAPIKey(searchConfig.searchAPIKey);
        }
    }, [searchConfig]);

    const onCancel = () => {
        setIsSheetOpen(false);
    };

    const onSave = () => {
        setTTSConfig({
            voice: ttsVoice,
            speed: ttsSpeed,
            pitch: ttsPitch,
        });

        setSearchConfig({
            searchEngine: searchEngine,
            searchEngineID: searchEngineID,
            searchAPIKey: searchAPIKey,
        });

        setIsSheetOpen(false);

        toast.success(t('Settings saved'));
    };

    const handleSwitchSendMessageKey = () => {
        setIsSendKeyEnter(!isSendKeyEnter);

        toast.success(`${t('Send message key changed to')} ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`);
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-600'>
                    <TbAdjustmentsHorizontal className='text-xl' />
                    <span className='hidden text-sm md:block'>{t('Conversation Settings')}</span>
                </button>
            </SheetTrigger>
            <SheetContent size='default' className='w-full md:w-1/3'>
                <SheetHeader>
                    <SheetTitle>{t('Advanced Conversation Settings')}</SheetTitle>
                    <SheetDescription>
                        {t('You are using')} <span className='font-medium'>{serviceProvider}</span>
                    </SheetDescription>
                </SheetHeader>
                <div className='my-6 space-y-6'>
                    <div className='space-y-3'>
                        <div className='flex items-center space-x-1'>
                            <Switch checked={isSendKeyEnter} onCheckedChange={handleSwitchSendMessageKey} />
                            <Label className='px-1 font-normal'>{t('Send Message using Enter Key')}</Label>
                            <Tippy content={`Current: ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`}>
                                <button>
                                    <MdInfoOutline className='text-lg' />
                                </button>
                            </Tippy>
                        </div>
                    </div>
                    <Separator />
                    <Tabs defaultValue='tts' className='h-full w-full space-y-5'>
                        <TabsList>
                            <TabsTrigger value='tts'>{t('Text To Speech')}</TabsTrigger>
                            <TabsTrigger value='search'>{t('Web Search')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value='tts' className='px-2'>
                            {voices && voices.length > 0 ? (
                                <div className='space-y-6'>
                                    <div className='flex flex-row items-center justify-between space-x-1'>
                                        <Label>{t('Voice')}</Label>
                                        <Select value={ttsVoice} onValueChange={(value: string) => setTTSVoice(value)}>
                                            <SelectTrigger className='w-[300px]'>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className='h-[300px] overflow-auto'>
                                                {voices.map((voice) => {
                                                    return (
                                                        <SelectItem key={voice.name} value={voice.name}>
                                                            {voice.name} ({voice.lang})
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='flex flex-col space-y-5'>
                                        <Label>
                                            {t('Speaking Speed')}: {ttsSpeed}
                                        </Label>
                                        <Slider min={0.1} max={10} step={0.1} value={[ttsSpeed]} onValueChange={([value]) => setTTSSpeed(value)} />
                                    </div>
                                    <Separator />
                                    <div className='flex flex-col space-y-2'>
                                        <Label>{t('Sample')}</Label>
                                        <Input value={ttsSample} onChange={(e) => setTTSSample(e.target.value)} />
                                        <div>
                                            <Button
                                                onClick={() => {
                                                    setIsSpeaking(true);
                                                    const utterance = new SpeechSynthesisUtterance(ttsSample);
                                                    utterance.voice = voices.find((voice) => voice.name === ttsVoice) || null;
                                                    utterance.rate = ttsSpeed;
                                                    utterance.pitch = ttsPitch;
                                                    synth && synth.speak(utterance);
                                                    utterance.onend = () => setIsSpeaking(false);
                                                }}
                                                disabled={isSpeaking}
                                                className='inline-flex items-center justify-center space-x-2'
                                            >
                                                <span>{t('Speak')}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p>{t('Text to Speech is not supported in your browser')}</p>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value='search'>
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
                        </TabsContent>
                    </Tabs>
                </div>
                <SheetFooter>
                    <Button type='submit' variant='destructive' onClick={onCancel}>
                        {t('Cancel')}
                    </Button>
                    <Button type='submit' variant='outline' onClick={onSave}>
                        {t('Save')}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default HeaderSettings;

const searchEnginesList = [
    {
        name: 'Programmable Search Engine (By Google)',
        value: 'pse',
    },
];
