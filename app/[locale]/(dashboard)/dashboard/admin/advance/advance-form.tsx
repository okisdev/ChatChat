'use client';

import { useState } from 'react';

import { toast } from 'react-hot-toast';

import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdvanceForm = () => {
    const t = useTranslations('dashboard');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [serviceProvider, setServiceProvider] = useState<ServiceProviderProps>('OpenAI');

    const [tokenScope, setTokenScope] = useState<UserScope | 'none'>('none');

    // Azure
    const [azureKey, setAzureKey] = useState<string>('');
    const [azureEndpoint, setAzureEndpoint] = useState<string>('');
    const [azureDeploymentName, setAzureDeploymentName] = useState<string>('');

    // Claude
    const [claudeKey, setClaudeKey] = useState<string>('');

    // Cohere
    const [cohereKey, setCohereKey] = useState<string>('');

    // Hugging Face
    const [huggingFaceKey, setHuggingFaceKey] = useState<string>('');

    // OpenAI
    const [openAIKey, setOpenAIKey] = useState<string>('');
    const [openAIEndpoint, setOpenAIEndpoint] = useState<string>('');

    const onSubmit = async () => {
        setIsLoading(true);

        const response = await fetch('/api/dashboard/admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                serviceProvider,
                azureKey,
                azureEndpoint,
                azureDeploymentName,
                claudeKey,
                cohereKey,
                huggingFaceKey,
                openAIKey,
                openAIEndpoint,
            }),
        });

        const data = await response.json();

        setIsLoading(false);

        if (data.success) {
            toast.success(data.message);
            return;
        } else {
            toast.error(data.message);
            return;
        }
    };

    let serviceProviderForm = null;

    switch (serviceProvider) {
        case 'Azure':
            serviceProviderForm = (
                <div className='flex flex-col space-y-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Azure API Key</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='Azure Key'
                            value={azureKey}
                            onChange={(e) => {
                                setAzureKey(e.target.value);
                            }}
                        />
                    </div>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Azure Endpoint</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='Azure Endpoint'
                            value={azureEndpoint}
                            onChange={(e) => {
                                setAzureEndpoint(e.target.value);
                            }}
                        />
                    </div>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Azure Deployment Name</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='Azure Deployment Name'
                            value={azureDeploymentName}
                            onChange={(e) => {
                                setAzureDeploymentName(e.target.value);
                            }}
                        />
                    </div>
                </div>
            );
            break;
        case 'Claude':
            serviceProviderForm = (
                <div className='flex flex-col space-y-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Claude API Key</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='Claude API Key'
                            value={claudeKey}
                            onChange={(e) => {
                                setClaudeKey(e.target.value);
                            }}
                        />
                    </div>
                </div>
            );
            break;
        case 'Cohere':
            serviceProviderForm = (
                <div className='flex flex-col space-y-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Cohere API Key</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='Cohere API Key'
                            value={cohereKey}
                            onChange={(e) => {
                                setCohereKey(e.target.value);
                            }}
                        />
                    </div>
                </div>
            );
            break;
        case 'Hugging Face':
            serviceProviderForm = (
                <div className='flex flex-col space-y-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>Hugging Face Access Token</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='Hugging Face Access Token'
                            value={huggingFaceKey}
                            onChange={(e) => {
                                setHuggingFaceKey(e.target.value);
                            }}
                        />
                    </div>
                </div>
            );
            break;
        default:
        case 'OpenAI':
            serviceProviderForm = (
                <div className='flex flex-col space-y-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>OpenAI API</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='OpenAI Key'
                            value={openAIKey}
                            onChange={(e) => {
                                setOpenAIKey(e.target.value);
                            }}
                        />
                    </div>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>OpenAI Endpoint</p>
                        <Input
                            className='dark:bg-neutral-700 dark:border-neutral-500'
                            placeholder='OpenAI Endpoint'
                            value={openAIEndpoint}
                            onChange={(e) => {
                                setOpenAIEndpoint(e.target.value);
                            }}
                        />
                    </div>
                </div>
            );
            break;
    }

    return (
        <div className='space-y-10 overflow-auto md:my-36 md:w-10/12 md:space-y-16 xl:w-6/12'>
            <div className='space-y-6 md:p-3'>
                <div className='flex justify-between items-center'>
                    <Label className='text-sm w-6/12'>Token User Scope</Label>
                    <Select
                        value={tokenScope}
                        onValueChange={(value: string) => {
                            setTokenScope(value as UserScope | 'none');
                        }}
                    >
                        <SelectTrigger className='dark:bg-neutral-700 dark:border-neutral-500'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {userScopeList.map((scope, index) => (
                                <SelectGroup key={index}>
                                    <SelectItem value={scope.value} className='text-sm'>
                                        {scope.name}
                                    </SelectItem>
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Separator className='bg-neutral-500' />
                <div className='space-y-6'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <Label className='text-sm'>Service Provider</Label>
                        <Select value={serviceProvider} onValueChange={(value: string) => setServiceProvider(value as ServiceProviderProps)}>
                            <SelectTrigger className='dark:bg-neutral-700 dark:border-neutral-500'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {serviceProviderList.map((service, index) => (
                                    <SelectGroup key={index}>
                                        <SelectItem value={service.value} className='text-sm'>
                                            {service.name}
                                        </SelectItem>
                                    </SelectGroup>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {serviceProviderForm}
                </div>
                <div className='flex justify-end'>
                    <Button variant='default' onClick={() => onSubmit()} disabled={isLoading}>
                        {t('Save')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdvanceForm;

const userScopeList = [
    {
        name: 'None',
        value: 'none',
    },
    {
        name: 'User',
        value: 'user',
    },
    {
        name: 'Admin',
        value: 'admin',
    },
];

const serviceProviderList = [
    {
        name: 'Azure',
        value: 'Azure',
    },
    {
        name: 'Claude',
        value: 'Claude',
    },
    {
        name: 'Cohere',
        value: 'Cohere',
    },
    {
        name: 'Hugging Face',
        value: 'Hugging Face',
    },
    {
        name: 'OpenAI',
        value: 'OpenAI',
    },
];
