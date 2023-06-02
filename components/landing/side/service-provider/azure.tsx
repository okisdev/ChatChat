import Link from 'next/link';

import { useTranslations } from 'next-intl';

import { FiClipboard } from 'react-icons/fi';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import { azureModelConfig } from '@/config/provider/azure.config';

const AzureServiceProvider = ({
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
    const t = useTranslations('landing');

    return (
        <>
            <Alert>
                <FiClipboard />
                <AlertTitle>{t('Goodwill Reminders')}</AlertTitle>
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
                            {azureModelConfig.map((model, index) => {
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
            <div className='space-y-1'>
                <Label className='font-normal'>API Version</Label>
                <Input placeholder='2023-03-15-preview' disabled />
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

export default AzureServiceProvider;
