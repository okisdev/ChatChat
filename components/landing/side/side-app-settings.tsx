'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import Tippy from '@tippyjs/react';

import { MdInfoOutline } from 'react-icons/md';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetFooter, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import TeamServiceProvider from './service-provider/team';
import AzureServiceProvider from './service-provider/azure';
import OpenAIServiceProvider from './service-provider/openai';
import ClaudeServiceProvider from './service-provider/claude';
import CustomServiceProvider from './service-provider/custom';
import CohereServiceProvider from './service-provider/cohere';
import ExtensionServiceProvider from './service-provider/extension';
import HuggingFaceServiceProvider from './service-provider/huggingface';

const SideAppSettings = ({ user }: { user: User | null }) => {
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

    const handleSwitchSendMessageKey = () => {
        setIsSendKeyEnter(!isSendKeyEnter);

        toast.success(`${t('Send message key changed to')} ${isSendKeyEnter ? 'Enter' : 'Shift + Enter'}`);
    };

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const [currentServiceProvider, setCurrentServiceProvider] = useState<ServiceProviderProps>('OpenAI');
    const [serviceProvider, setServiceProvider] = useAtom(store.serviceProviderAtom);

    // OpenAI, Custom
    const [apiKey, setApiKey] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('');
    const [apiModel, setApiModel] = useState<string>('');
    const [apiTemperature, setApiTemperature] = useState<number>(0.3);

    // OpenAI
    const [openAIConfig, setOpenAIConfig] = useAtom(store.openAIConfigAtom);
    const [useCloudSettings, setUseCloudSettings] = useAtom<boolean>(store.useCloudSettingsAtom);

    // Azure
    const [azureConfig, setAzureConfig] = useAtom(store.azureConfigAtom);
    const [azureAPIKey, setAzureAPIKey] = useState<string>('');
    const [azureAPIModel, setAzureAPIModel] = useState<string>('');
    const [azureAPIEndpoint, setAzureAPIEndpoint] = useState<string>('');
    const [azureAPITemperature, setAzureAPITemperature] = useState<number>(0.3);
    const [azureAPIDeploymentName, setAzureAPIDeploymentName] = useState<string>('');

    // Hugging Face
    const [accessToken, setAccessToken] = useState<string>('');
    const [huggingFaceModel, setHuggingFaceModel] = useState<string>('');
    const [huggingFaceConfig, setHuggingFaceConfig] = useAtom(store.huggingFaceConfigAtom);

    // Team
    const [accessCode, setAccessCode] = useState<string>('');
    const [teamConfig, setTeamConfig] = useAtom(store.teamConfigAtom);

    // Cohere
    const [cohereAPIKey, setCohereAPIKey] = useState<string>('');
    const [cohereModel, setCohereModel] = useState<string>('');
    const [cohereConfig, setCohereConfig] = useAtom(store.cohereConfigAtom);

    // Claude
    const [claudeConfig, setClaudeConfig] = useAtom(store.claudeConfigAtom);
    const [claudeAPIKey, setClaudeAPIKey] = useState<string>('');
    const [claudeAPIModel, setClaudeAPIModel] = useState<string>('');
    const [claudeAPITemperature, setClaudeAPITemperature] = useState<number>(0.3);

    useEffect(() => {
        if (isDialogOpen && serviceProvider) {
            setCurrentServiceProvider(serviceProvider);
        }
    }, [isDialogOpen, serviceProvider]);

    useEffect(() => {
        if (openAIConfig) {
            setApiKey(openAIConfig.apiKey);
            setApiEndpoint(openAIConfig.apiEndpoint);
            setApiModel(openAIConfig.apiModel);
            setApiTemperature(openAIConfig.apiTemperature);
        }

        if (azureConfig) {
            setAzureAPIKey(azureConfig.apiKey);
            setAzureAPIModel(azureConfig.apiModel);
            setAzureAPIEndpoint(azureConfig.apiEndpoint);
            setAzureAPITemperature(azureConfig.apiTemperature);
            setAzureAPIDeploymentName(azureConfig.apiDeploymentName);
        }

        if (teamConfig) {
            setAccessCode(teamConfig.accessCode);
        }

        if (huggingFaceConfig) {
            setAccessToken(huggingFaceConfig.accessToken);
            setHuggingFaceModel(huggingFaceConfig.huggingFaceModel);
        }

        if (cohereConfig) {
            setCohereAPIKey(cohereConfig.apiKey);
            setCohereModel(cohereConfig.model);
        }

        if (claudeConfig) {
            setClaudeAPIKey(claudeConfig.apiKey);
            setClaudeAPIModel(claudeConfig.apiModel);
            setClaudeAPITemperature(claudeConfig.apiTemperature);
        }
    }, [azureConfig, claudeConfig, cohereConfig, huggingFaceConfig, openAIConfig, teamConfig]);

    let ProviderConfig = null;

    switch (currentServiceProvider) {
        case 'OpenAI':
            ProviderConfig = (
                <OpenAIServiceProvider
                    apiKey={apiKey}
                    apiEndpoint={apiEndpoint}
                    apiModel={apiModel as OpenAIModel}
                    apiTemperature={apiTemperature}
                    setApiKey={setApiKey}
                    setApiEndpoint={setApiEndpoint}
                    setApiModel={setApiModel}
                    setApiTemperature={setApiTemperature}
                    user={user}
                    useCloudSettings={useCloudSettings}
                    setUseCloudSettings={setUseCloudSettings}
                />
            );
            break;
        case 'Hugging Face':
            ProviderConfig = <HuggingFaceServiceProvider accessToken={accessToken} huggingFaceModel={huggingFaceModel} setAccessToken={setAccessToken} setHuggingFaceModel={setHuggingFaceModel} />;
            break;
        case 'Claude':
            ProviderConfig = (
                <ClaudeServiceProvider
                    claudeAPIKey={claudeAPIKey}
                    claudeAPIModel={claudeAPIModel}
                    claudeAPITemperature={claudeAPITemperature}
                    setClaudeAPIKey={setClaudeAPIKey}
                    setClaudeAPIModel={setClaudeAPIModel}
                    setClaudeAPITemperature={setClaudeAPITemperature}
                />
            );
            break;
        case 'Azure':
            ProviderConfig = (
                <AzureServiceProvider
                    azureAPIKey={azureAPIKey}
                    azureAPIModel={azureAPIModel}
                    azureAPIEndpoint={azureAPIEndpoint}
                    azureAPITemperature={azureAPITemperature}
                    azureAPIDeploymentName={azureAPIDeploymentName}
                    setAzureAPIKey={setAzureAPIKey}
                    setAzureAPIModel={setAzureAPIModel}
                    setAzureAPIEndpoint={setAzureAPIEndpoint}
                    setAzureAPITemperature={setAzureAPITemperature}
                    setAzureAPIDeploymentName={setAzureAPIDeploymentName}
                />
            );
            break;
        case 'Custom':
            ProviderConfig = <CustomServiceProvider />;
            break;
        case 'Team':
            ProviderConfig = <TeamServiceProvider accessCode={accessCode} setAccessCode={setAccessCode} />;
            break;
        case 'Cohere':
            ProviderConfig = <CohereServiceProvider cohereAPIKey={cohereAPIKey} setCohereAPIKey={setCohereAPIKey} cohereModel={cohereModel} setCohereModel={setCohereModel} />;
            break;
        case 'Extension':
            ProviderConfig = <ExtensionServiceProvider />;
            break;
        default:
            ProviderConfig = null;
            break;
    }

    const onReset = () => {
        setCurrentServiceProvider('OpenAI');
        setServiceProvider('OpenAI');

        setOpenAIConfig({
            apiKey: '',
            apiEndpoint: '',
            apiModel: 'gpt-3.5-turbo',
            apiTemperature: 0.3,
        });

        setAzureConfig({
            apiKey: '',
            apiEndpoint: '',
            apiModel: 'gpt-3.5-turbo',
            apiTemperature: 0.3,
            apiDeploymentName: '',
        });

        setTeamConfig({
            accessCode: '',
        });

        setHuggingFaceConfig({
            accessToken: '',
            huggingFaceModel: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
        });

        setCohereConfig({
            apiKey: '',
            model: 'command-nightly',
        });

        setClaudeConfig({
            apiKey: '',
            apiModel: 'claude-v1',
            apiTemperature: 1.0,
        });

        setAccessCode('');

        setApiKey('');
        setApiEndpoint('');

        toast.success(t('Settings reset'));

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

        setIsSheetOpen(false);

        if (currentServiceProvider == 'OpenAI' && !useCloudSettings) {
            if (!apiKey) {
                toast.error(t('Please fill in all required fields'));
                return;
            }

            if (apiEndpoint != '' && !(apiEndpoint.startsWith('https://') || apiEndpoint.startsWith('http://'))) {
                toast.error(t('Invalid API Endpoint'));
                return;
            }
        }

        if (currentServiceProvider == 'Azure' && (!azureAPIKey || !azureAPIEndpoint || !azureAPIDeploymentName)) {
            toast.error(t('Please fill in all required fields'));
            return;
        }

        if (!user && currentServiceProvider == 'Team') {
            toast.error(t('Please login to join a team'));
            return;
        }

        switch (currentServiceProvider) {
            case 'OpenAI':
                setOpenAIConfig({
                    apiKey,
                    apiEndpoint,
                    apiModel,
                    apiTemperature,
                });
                break;
            case 'Azure':
                setAzureConfig({
                    apiKey: azureAPIKey,
                    apiEndpoint: azureAPIEndpoint,
                    apiModel: azureAPIModel,
                    apiTemperature: azureAPITemperature,
                    apiDeploymentName: azureAPIDeploymentName,
                });
                break;
            case 'Team':
                setTeamConfig({
                    accessCode,
                });
                break;
            case 'Hugging Face':
                setHuggingFaceConfig({
                    accessToken,
                    huggingFaceModel,
                });
                break;
            case 'Cohere':
                setCohereConfig({
                    model: cohereModel,
                    apiKey: cohereAPIKey,
                });
                break;
            case 'Claude':
                setClaudeConfig({
                    apiKey: claudeAPIKey,
                    apiModel: claudeAPIModel,
                    apiTemperature: claudeAPITemperature,
                });
                break;
            default:
                break;
        }

        setServiceProvider(currentServiceProvider);

        toast.success(t('Settings saved'));

        setIsDialogOpen(false);
    };

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700' aria-label='app-settings'>
                    <TbAdjustmentsHorizontal />
                </button>
            </SheetTrigger>
            <SheetContent size='default' className='w-full overflow-auto md:w-5/12 xl:w-1/3'>
                <SheetHeader>
                    <SheetTitle>{t('App Settings')}</SheetTitle>
                    <SheetDescription>
                        {t('You are using')} <span className='font-medium'>{serviceProvider}</span>
                    </SheetDescription>
                </SheetHeader>
                <div className='my-4 space-y-4'>
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
                    <Tabs defaultValue='provider' className='h-full w-full space-y-5'>
                        <TabsList>
                            <TabsTrigger value='provider'>{t('Service Provider')}</TabsTrigger>
                            <TabsTrigger value='tts'>{t('Text To Speech')}</TabsTrigger>
                            <TabsTrigger value='search'>{t('Web Search')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value='provider' className='px-2'>
                            <div className='flex h-full flex-col justify-start space-y-3'>
                                <div className='space-y-3'>
                                    <div className='space-y-2'>
                                        <Label className='font-medium'>{t('AI Service Provider')}</Label>
                                        <Select value={currentServiceProvider} onValueChange={(value: string) => setCurrentServiceProvider(value as ServiceProviderProps)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {serviceProviderList
                                                    // .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((service, index) => (
                                                        <SelectGroup key={index}>
                                                            <SelectItem value={service.value} className='text-sm' disabled={service.status == 0}>
                                                                {service.name}{' '}
                                                                {service.status !== 1 &&
                                                                    (service.status == 0 ? (
                                                                        <Badge variant='outline' className='font-normal text-red-500'>
                                                                            {t('Planned')}
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant='outline' className='font-normal text-amber-500'>
                                                                            {t('Beta')}
                                                                        </Badge>
                                                                    ))}
                                                            </SelectItem>
                                                        </SelectGroup>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className='space-y-3 overflow-y-auto rounded border p-3'>{ProviderConfig}</div>
                                </div>
                            </div>
                        </TabsContent>
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

export default SideAppSettings;

const searchEnginesList = [
    {
        name: 'Programmable Search Engine (By Google)',
        value: 'pse',
    },
];

interface serviceProviderProps {
    name: string;
    value: ServiceProviderProps;
    status: number;
}

const serviceProviderList: serviceProviderProps[] = [
    {
        name: 'Azure',
        value: 'Azure',
        status: 1,
    },
    {
        name: 'Claude',
        value: 'Claude',
        status: 2,
    },
    {
        name: 'Cohere',
        value: 'Cohere',
        status: 1,
    },
    {
        name: 'Hugging Face',
        value: 'Hugging Face',
        status: 1,
    },
    {
        name: 'OpenAI',
        value: 'OpenAI',
        status: 1,
    },
    {
        name: 'Team',
        value: 'Team',
        status: 2,
    },
    {
        name: 'Custom',
        value: 'Custom',
        status: 0,
    },
];
