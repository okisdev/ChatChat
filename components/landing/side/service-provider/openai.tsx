'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { User } from '@prisma/client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { openAIModelConfig } from '@/config/provider/openai.config';

const OpenAIServiceProvider = ({
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
    azureAPIDeploymentName,
    setAzureAPIDeploymentName,
    isAzure,
    setIsAzure,
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
    azureAPIDeploymentName: string;
    setAzureAPIDeploymentName: (azureAPIDeploymentName: string) => void;
    isAzure: boolean;
    setIsAzure: (isAzure: boolean) => void;
}) => {
    const t = useTranslations('');

    const [openaiProvider, setOpenaiProvider] = useState<OpenAIProvider>('OpenAI');

    useEffect(() => {
        if (openaiProvider === 'Azure') {
            setIsAzure(true);
        } else {
            setIsAzure(false);
        }
    }, [openaiProvider, setIsAzure]);

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
            <div className='space-y-1'>
                <Label className='font-normal'>OpenAI Provider</Label>
                <Select value={openaiProvider} onValueChange={(value) => setOpenaiProvider(value as OpenAIProvider)}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key='azure' value='Azure' className='text-sm'>
                            Azure
                        </SelectItem>
                        <SelectItem key='openai' value='OpenAI' className='text-sm'>
                            OpenAI
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {user && (
                <div className='flex items-center justify-between'>
                    <Label>{t('Use Cloud Settings')}</Label>
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
            {isAzure && (
                <>
                    <div className='space-y-1'>
                        <Label className='font-normal'>API Deployment Name</Label>
                        <Input placeholder='EXAMPLE' value={azureAPIDeploymentName} onChange={(e) => setAzureAPIDeploymentName(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label className='font-normal'>API Version</Label>
                        <Input placeholder='2023-03-15-preview' disabled />
                    </div>
                </>
            )}
            <div className='space-y-3'>
                <Label className='font-normal'>Temperature: {apiTemperature}</Label>
                <div className='flex flex-col space-y-1'>
                    <Slider max={2} step={0.1} value={[apiTemperature]} onValueChange={([e]) => setApiTemperature(e)} />
                    <div className='flex justify-between text-xs text-gray-500'>
                        <p>{t('Stable')}</p>
                        <p>{t('Standard')}</p>
                        <p>{t('Creative')}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OpenAIServiceProvider;
