'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import { FiSettings } from 'react-icons/fi';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

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
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}>
            <DialogTrigger asChild>
                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-600' aria-label='app-settings'>
                    <FiSettings />
                </button>
            </DialogTrigger>
            <DialogContent className='flex flex-col justify-between space-y-3 overflow-y-auto md:h-[800px] md:w-[500px]'>
                <DialogHeader>
                    <DialogTitle>{t('App Settings')}</DialogTitle>
                </DialogHeader>
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
                <DialogFooter>
                    <Button type='submit' variant='destructive' onClick={onReset}>
                        {t('Reset')}
                    </Button>
                    <Button type='submit' variant='outline' onClick={onSave}>
                        {t('Save')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SideAppSettings;

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
    {
        name: 'Extension',
        value: 'Extension',
        status: 0,
    },
];
