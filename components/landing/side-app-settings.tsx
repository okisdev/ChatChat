'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import { FiSettings, FiClipboard } from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { claudeModelConfig } from '@/config/provider/claude.config';
import { openAIModelConfig } from '@/config/provider/openai.config';
import { cohereModelConfig } from '@/config/provider/cohere.config';
import { huggingFaceModelConfig } from '@/config/provider/huggingface.config';

const SideAppSettings = ({ user }: { user: User | null }) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

    switch (serviceProvider) {
        default:
        case 'OpenAI':
            ProviderConfig = (
                <OpenAICard
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
            ProviderConfig = <HuggingFaceCard accessToken={accessToken} huggingFaceModel={huggingFaceModel} setAccessToken={setAccessToken} setHuggingFaceModel={setHuggingFaceModel} />;
            break;
        case 'Claude':
            ProviderConfig = (
                <ClaudeCard
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
                <AzureCard
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
            ProviderConfig = <CustomCard />;
            break;
        case 'Team':
            ProviderConfig = <TeamCard accessCode={accessCode} setAccessCode={setAccessCode} />;
            break;
        case 'Cohere':
            ProviderConfig = <CohereCard cohereAPIKey={cohereAPIKey} setCohereAPIKey={setCohereAPIKey} cohereModel={cohereModel} setCohereModel={setCohereModel} />;
            break;
        case 'Extension':
            ProviderConfig = <ExtensionCard />;
    }

    const onReset = () => {
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

        toast.success('Settings reset');

        setIsDialogOpen(false);
    };

    const onSave = () => {
        if (serviceProvider == 'OpenAI') {
            if (!useCloudSettings) {
                if (!apiKey) {
                    toast.error('Please fill in all the fields');
                    return;
                }

                if (apiEndpoint != '') {
                    if (!(apiEndpoint.startsWith('https://') || apiEndpoint.startsWith('http://'))) {
                        toast.error('Invalid API Endpoint');
                        return;
                    }
                }
            }
        }

        if (!user && serviceProvider == 'Team') {
            toast.error('Please login to join a team');
            return;
        }

        switch (serviceProvider) {
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

        toast.success('Settings saved');

        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}>
            <DialogTrigger asChild>
                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200' aria-label='app-settings'>
                    <FiSettings />
                </button>
            </DialogTrigger>
            <DialogContent className='flex flex-col justify-between space-y-3 overflow-y-auto md:h-[800px] md:w-[500px]'>
                <DialogHeader>
                    <DialogTitle>App Settings</DialogTitle>
                </DialogHeader>
                <div className='flex h-full flex-col justify-start space-y-3'>
                    <div className='space-y-3'>
                        <div className='space-y-2'>
                            <Label className='font-medium'>AI Service Provider</Label>
                            <Select value={serviceProvider} onValueChange={(value: string) => setServiceProvider(value as ServiceProviderProps)}>
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
                                                                Planned
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant='outline' className='font-normal text-amber-500'>
                                                                Beta
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
                <DialogFooter>
                    <Button type='submit' variant='destructive' onClick={onReset}>
                        Reset
                    </Button>
                    <Button type='submit' variant='outline' onClick={onSave}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SideAppSettings;

const OpenAICard = ({
    apiKey,
    apiEndpoint,
    apiModel,
    apiTemperature,
    setApiKey,
    setApiEndpoint,
    setApiModel,
    setApiTemperature,
    user,
    useCloudSettings,
    setUseCloudSettings,
}: {
    apiKey: string;
    apiEndpoint: string;
    apiModel: OpenAIModel;
    apiTemperature: number;
    setApiKey: (apiKey: string) => void;
    setApiEndpoint: (apiEndpoint: string) => void;
    setApiModel: (apiModel: OpenAIModel) => void;
    setApiTemperature: (apiTemperature: number) => void;
    user: User | null;
    useCloudSettings: boolean;
    setUseCloudSettings: (useCloudSettings: boolean) => void;
}) => {
    if (user && useCloudSettings) {
        setApiKey(user?.openAIKey || '');
        setApiEndpoint('https://api.openai.com');
    }

    useEffect(() => {
        if (!user) {
            setUseCloudSettings(false);
        }
    }, [setUseCloudSettings, user]);

    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>Good to know</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://platform.openai.com/account/api-keys' target='_blank' className='underline'>
                        OpenAI API Key
                    </Link>{' '}
                    to use this service, or use a similar API interface such as{' '}
                    <Link href='https://api2d.com/' target='_blank' className='underline'>
                        API2D
                    </Link>
                    .
                </AlertDescription>
            </Alert>
            {user && (
                <div className='flex items-center justify-between'>
                    <Label>Use Cloud Settings</Label>
                    <Switch checked={useCloudSettings} onCheckedChange={() => setUseCloudSettings(!useCloudSettings)} />
                </div>
            )}
            <div className='h-full space-y-3'>
                <div className='space-y-1'>
                    <Label className='font-normal'>GPT Model</Label>
                    <Select value={apiModel} onValueChange={(value) => setApiModel(value as OpenAIModel)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {openAIModelConfig.map((model, index) => {
                                return (
                                    <SelectItem key={index} value={model.model} className='text-sm'>
                                        {model.model}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Key</Label>
                <Input placeholder='sk-' disabled={useCloudSettings} value={useCloudSettings ? user?.openAIKey || 'not API saved in cloud' : apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Endpoint</Label>
                <Input placeholder='https://api.openai.com' disabled={useCloudSettings} value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} />
            </div>
            <div className='space-y-3'>
                <Label className='font-normal'>Temperature: {apiTemperature}</Label>
                <div className='flex flex-col space-y-1'>
                    <Slider max={2} step={0.1} value={[apiTemperature]} onValueChange={([e]) => setApiTemperature(e)} />
                    <div className='flex justify-between text-xs text-gray-500'>
                        <p>Stable</p>
                        <p>Standard</p>
                        <p>Creative</p>
                    </div>
                </div>
            </div>
        </>
    );
};

const HuggingFaceCard = ({
    accessToken,
    huggingFaceModel,
    setAccessToken,
    setHuggingFaceModel,
}: {
    accessToken: string;
    huggingFaceModel: string;
    setAccessToken: (accessToken: string) => void;
    setHuggingFaceModel: (huggingFaceModel: string) => void;
}) => {
    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>Good to know</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://huggingface.co/settings/tokens' target='_blank' className='underline'>
                        Hugging Face Access Token
                    </Link>{' '}
                    to use this service.
                </AlertDescription>
            </Alert>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>Model</Label>
                <Select value={huggingFaceModel} onValueChange={(value) => setHuggingFaceModel(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {huggingFaceModelConfig.map((model, index) => {
                            return (
                                <SelectItem key={index} value={model.model} className='text-sm'>
                                    {model.model}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>Access Token</Label>
                <Input placeholder='hf_xxxxxx' value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
            </div>
        </>
    );
};

const ClaudeCard = ({
    claudeAPIKey,
    claudeAPIModel,
    claudeAPITemperature,
    setClaudeAPIKey,
    setClaudeAPIModel,
    setClaudeAPITemperature,
}: {
    claudeAPIKey: string;
    claudeAPIModel: string;
    claudeAPITemperature: number;
    setClaudeAPIKey: (claudeAPIKey: string) => void;
    setClaudeAPIModel: (claudeAPIModel: OpenAIModel) => void;
    setClaudeAPITemperature: (claudeAPITemperature: number) => void;
}) => {
    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>Good to know</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://console.anthropic.com/account/keys' target='_blank' className='underline'>
                        Claude API Key
                    </Link>{' '}
                    to use this service. Sign up for waitlist{' '}
                    <Link href='https://www.anthropic.com/product' target='_blank' className='underline'>
                        here
                    </Link>
                    .
                </AlertDescription>
            </Alert>
            <div className='h-full space-y-3'>
                <div className='space-y-1'>
                    <Label className='font-normal'>API Model</Label>
                    <Select value={claudeAPIModel} onValueChange={(value) => setClaudeAPIModel(value as OpenAIModel)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {claudeModelConfig.map((model, index) => {
                                return (
                                    <SelectItem key={index} value={model.model} className='text-sm'>
                                        {model.model}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Key</Label>
                <Input placeholder='EXAMPLE' value={claudeAPIKey} onChange={(e) => setClaudeAPIKey(e.target.value)} />
            </div>
            <div className='space-y-3'>
                <Label className='font-normal'>Temperature: {claudeAPITemperature}</Label>
                <div className='flex flex-col space-y-1'>
                    <Slider max={1} step={0.1} value={[claudeAPITemperature]} onValueChange={([e]) => setClaudeAPITemperature(e)} />
                    <div className='flex justify-between text-xs text-gray-500'>
                        <p>Stable</p>
                        <p>Standard</p>
                        <p>Creative</p>
                    </div>
                </div>
            </div>
        </>
    );
};

const AzureCard = ({
    azureAPIKey,
    azureAPIModel,
    azureAPIEndpoint,
    azureAPITemperature,
    azureAPIDeploymentName,
    setAzureAPIKey,
    setAzureAPIModel,
    setAzureAPIEndpoint,
    setAzureAPITemperature,
    setAzureAPIDeploymentName,
}: {
    azureAPIKey: string;
    azureAPIModel: string;
    azureAPIEndpoint: string;
    azureAPITemperature: number;
    azureAPIDeploymentName: string;
    setAzureAPIKey: (azureAPIKey: string) => void;
    setAzureAPIModel: (azureAPIModel: string) => void;
    setAzureAPIEndpoint: (azureAPIEndpoint: string) => void;
    setAzureAPITemperature: (azureAPITemperature: number) => void;
    setAzureAPIDeploymentName: (azureAPIDeploymentName: string) => void;
}) => {
    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>Good to know</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://dashboard.cohere.ai/api-keys' target='_blank' className='underline'>
                        Azure API Key
                    </Link>{' '}
                    to use this service. Sign up for access{' '}
                    <Link href='https://aka.ms/oaiapply' target='_blank' className='underline'>
                        here
                    </Link>
                    .
                </AlertDescription>
            </Alert>
            <div className='h-full space-y-3'>
                <div className='space-y-1'>
                    <Label className='font-normal'>GPT Model</Label>
                    <Select value={azureAPIModel} onValueChange={(value) => setAzureAPIModel(value as OpenAIModel)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {openAIModelConfig.map((model, index) => {
                                return (
                                    <SelectItem key={index} value={model.model} className='text-sm'>
                                        {model.model}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Key</Label>
                <Input placeholder='EXAMPLE' value={azureAPIKey} onChange={(e) => setAzureAPIKey(e.target.value)} />
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Endpoint</Label>
                <Input placeholder='https://xxxxxx.openai.azure.com' value={azureAPIEndpoint} onChange={(e) => setAzureAPIEndpoint(e.target.value)} />
            </div>
            <div className='space-y-1'>
                <Label className='font-normal'>API Deployment Name</Label>
                <Input placeholder='EXAMPLE' value={azureAPIDeploymentName} onChange={(e) => setAzureAPIDeploymentName(e.target.value)} />
            </div>
            <div className='space-y-3'>
                <Label className='font-normal'>Temperature: {azureAPITemperature}</Label>
                <div className='flex flex-col space-y-1'>
                    <Slider max={2} step={0.1} value={[azureAPITemperature]} onValueChange={([e]) => setAzureAPITemperature(e)} />
                    <div className='flex justify-between text-xs text-gray-500'>
                        <p>Stable</p>
                        <p>Standard</p>
                        <p>Creative</p>
                    </div>
                </div>
            </div>
        </>
    );
};

const CustomCard = () => {
    return (
        <>
            <div className='space-y-1'>
                <Label>API Key</Label>
                <Input placeholder='fk...' />
            </div>
            <div className='space-y-1'>
                <Label>API Endpoint</Label>
                <Input placeholder='https://api.example.com' />
            </div>
        </>
    );
};

const TeamCard = ({ accessCode, setAccessCode }: { accessCode: string; setAccessCode: (accessCode: string) => void }) => {
    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>Good to know</AlertTitle>
                <AlertDescription>This is a feature for teams. You can create a team in dashboard. However, this feature is only available for fully setup deployment.</AlertDescription>
            </Alert>
            <div className='space-y-1'>
                <Label>Team Access Code</Label>
                <Input placeholder='Your team code. For example: 625390220.' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
            </div>
        </>
    );
};

const CohereCard = ({
    cohereAPIKey,
    cohereModel,
    setCohereAPIKey,
    setCohereModel,
}: {
    cohereAPIKey: string;
    cohereModel: string;
    setCohereAPIKey: (cohereAPIKey: string) => void;
    setCohereModel: (cohereModel: string) => void;
}) => {
    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>Good to know</AlertTitle>
                <AlertDescription>
                    You need to provide the{' '}
                    <Link href='https://dashboard.cohere.ai/api-keys' target='_blank' className='underline'>
                        Cohere API Key
                    </Link>{' '}
                    to use this service.
                </AlertDescription>
            </Alert>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>Model</Label>
                <Select value={cohereModel} onValueChange={(value) => setCohereModel(value)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {cohereModelConfig.map((model, index) => {
                            return (
                                <SelectItem key={index} value={model.model} className='text-sm'>
                                    {model.model}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
            <div className='space-y-1'>
                <Label className='px-1 font-medium'>API Key</Label>
                <Input placeholder='tlYBXue......' value={cohereAPIKey} onChange={(e) => setCohereAPIKey(e.target.value)} />
            </div>
        </>
    );
};

const ExtensionCard = ({}: {}) => {
    return (
        <>
            <div className='space-y-1'>
                <Label>Entry Point</Label>
                <Input placeholder='http://localhost:9999' />
            </div>
        </>
    );
};

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
        status: 1,
    },
    {
        name: 'Custom',
        value: 'Custom',
        status: 0,
    },
    {
        name: 'Extension',
        value: 'Extension',
        status: 0,
    },
];
