'use client';

import { useEffect } from 'react';

import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { User } from '@prisma/client';

import { FiClipboard } from 'react-icons/fi';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    const t = useTranslations('landing');

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
                <AlertTitle>{t('Goodwill Reminders')}</AlertTitle>
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
