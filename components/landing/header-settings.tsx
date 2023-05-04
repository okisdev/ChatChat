'use client';

import { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom, useAtomValue } from 'jotai';

import Tippy from '@tippyjs/react';

import { MdInfoOutline } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiImport, BiExport, BiBrush } from 'react-icons/bi';
import { TbSettingsFilled, TbCircleArrowRightFilled } from 'react-icons/tb';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

const HeaderSettings = () => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

    const [histories, setHistories] = useState<HistoryProps[]>([]);

    // Search
    const [searchEngine, setSearchEngine] = useState<string>(searchEnginesList[0].name);
    const [searchEngineID, setSearchEngineID] = useState<string>('');
    const [searchAPIKey, setSearchAPIKey] = useState<string>('');

    const [searchConfig, setSearchConfig] = useAtom(store.searchConfigAtom);

    useEffect(() => {
        const conversationKeys = Object.keys(localStorage).filter((key) => key.startsWith('histories-'));

        const conversationValues = conversationKeys.map((key) => {
            const chatValue = localStorage.getItem(key);
            return JSON.parse(chatValue || '{}');
        });

        setHistories(conversationValues);
    }, []);

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
        setIsDialogOpen(false);
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

        setIsDialogOpen(false);
    };

    const handleSwitchSendMessageKey = () => {
        setIsSendKeyEnter(!isSendKeyEnter);

        toast.success(`Send message key changed to ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`);
    };

    const handleExportHistory = () => {
        const data = histories.map((item) => {
            return item;
        });

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const download = document.createElement('a');

        download.href = url;
        download.download = `chatchat-history-${new Date().getTime()}.json`;
        download.click();
    };

    const handleImportHistory = () => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = 'application/json';
        input.click();

        input.onchange = () => {
            const file = input.files?.[0];

            if (file) {
                const reader = new FileReader();

                reader.readAsText(file, 'UTF-8');

                reader.onload = (e) => {
                    const result = e.target?.result;

                    if (result) {
                        const data = JSON.parse(result as string);

                        if (data) {
                            data.forEach((item: HistoryProps) => {
                                localStorage.setItem(`histories-${item.type}-${item.id}`, JSON.stringify(item));
                            });

                            toast.success('Imported history successfully!');
                        }
                    }
                };
            }

            const updateEvent = new CustomEvent('localStorageUpdated');
            window.dispatchEvent(updateEvent);
        };
    };

    const handleClearHistory = () => {
        const chatKeys = Object.keys(localStorage).filter((key) => key.startsWith('histories-'));

        chatKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        setHistories([]);

        toast.success('Cleared history successfully!');

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200'>
                    <TbSettingsFilled />
                    <span className='hidden text-sm md:block'>Conversation Settings</span>
                </button>
            </DialogTrigger>
            <DialogContent className='flex flex-col justify-between md:h-[500px] md:w-[500px]'>
                <DialogHeader>
                    <DialogTitle>Advanced Conversation Settings</DialogTitle>
                    <DialogDescription>
                        You are using <span className='font-medium'>{serviceProvider}</span>.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue='tts' className='h-full w-full space-y-5'>
                    <TabsList>
                        <TabsTrigger value='tts'>Text To Speech</TabsTrigger>
                        <TabsTrigger value='search'>Web Search</TabsTrigger>
                        <TabsTrigger value='advanced'>Advanced</TabsTrigger>
                    </TabsList>
                    <TabsContent value='tts' className='px-2'>
                        {voices && voices.length > 0 ? (
                            <div className='space-y-6'>
                                <div className='flex flex-row items-center justify-between space-x-1'>
                                    <Label>Voice</Label>
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
                                    <Label>Speaking Speed: {ttsSpeed}</Label>
                                    <Slider min={0.1} max={10} step={0.1} value={[ttsSpeed]} onValueChange={([value]) => setTTSSpeed(value)} />
                                </div>
                                <Separator />
                                <div className='flex flex-col space-y-2'>
                                    <Label>Sample</Label>
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
                                            {isSpeaking && <AiOutlineLoading3Quarters className='animate-spin block' />}
                                            <span>Speak</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p>Text to Speech is not supported in your browser.</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value='search'>
                        <div className='space-y-3'>
                            <div>
                                <Label>Search Engine</Label>
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
                    <TabsContent value='advanced'>
                        <div className='space-y-3'>
                            <div className='flex items-center space-x-1'>
                                <Switch checked={isSendKeyEnter} onCheckedChange={handleSwitchSendMessageKey} />
                                <Label className='px-1 font-normal'>Send Message using Enter Key</Label>
                                <Tippy content={`Current: ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`}>
                                    <button>
                                        <MdInfoOutline className='text-lg' />
                                    </button>
                                </Tippy>
                            </div>
                            <Separator />
                            <div className='flex flex-col space-y-3'>
                                <Label>History</Label>
                                <div className='flex space-x-3'>
                                    <Button variant='secondary' className='flex items-center space-x-0.5' onClick={handleExportHistory}>
                                        <BiExport />
                                        <span>Export</span>
                                    </Button>
                                    <Button variant='secondary' className='flex items-center space-x-0.5' onClick={handleImportHistory}>
                                        <BiImport />
                                        <span>Import</span>
                                    </Button>
                                    <Button variant='destructive' className='flex items-center space-x-0.5' onClick={handleClearHistory}>
                                        <BiBrush />
                                        <span>Clear</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    <Button type='submit' variant='destructive' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type='submit' variant='outline' onClick={onSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HeaderSettings;

const searchEnginesList = [
    {
        name: 'Programmable Search Engine (By Google)',
        value: 'pse',
    },
];
