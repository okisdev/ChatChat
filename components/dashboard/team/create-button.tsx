'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import { MdOutlineAdd } from 'react-icons/md';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CreateButton = () => {
    const router = useRouter();

    const t = useTranslations('dashboard');

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [accessCode, setAccessCode] = useState<string>('');

    const [serviceProvider, setServiceProvider] = useState<string>('OpenAI');

    // OpenAI
    const [openAIKey, setOpenAIKey] = useState<string>('');
    const [openAIEndpoint, setOpenAIEndpoint] = useState<string>('');

    // Azure
    const [azureKey, setAzureKey] = useState<string>('');
    const [azureEndpoint, setAzureEndpoint] = useState<string>('');
    const [azureDeploymentName, setAzureDeploymentName] = useState<string>('');

    // Claude
    const [claudeKey, setClaudeKey] = useState<string>('');

    const handleCreate = async () => {
        if (isLoading) {
            return;
        }

        if (name.length === 0) {
            toast.error(t('Team name is required'));
            return;
        }

        if (accessCode.length === 0) {
            toast.error(t('Team access token is required'));
            return;
        }

        if (serviceProvider == 'OpenAI') {
            if (openAIKey.length === 0) {
                toast.error(t('OpenAI Key is required'));
                return;
            }

            if (openAIEndpoint.length === 0) {
                toast.error(t('OpenAI Endpoint is required'));
                return;
            }
        }

        if (serviceProvider == 'Azure') {
            if (azureKey.length === 0) {
                toast.error(t('Azure Key is required'));
                return;
            }

            if (azureEndpoint.length === 0) {
                toast.error(t('Azure Endpoint is required'));
                return;
            }

            if (azureDeploymentName.length === 0) {
                toast.error(t('Azure Deployment Name is required'));
                return;
            }
        }

        if (serviceProvider == 'Claude') {
            if (claudeKey.length === 0) {
                toast.error(t('Claude Key is required'));
                return;
            }
        }

        setIsLoading(true);

        const response = await fetch('/api/team/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                accessCode: accessCode,
                openAIKey: openAIKey,
                openAIEndpoint: openAIEndpoint,
                azureKey: azureKey,
                azureEndpoint: azureEndpoint,
                azureDeploymentName: azureDeploymentName,
                claudeKey: claudeKey,
            }),
        });

        if (!response.ok) {
            setIsLoading(false);
            toast.error(t('Failed to create team'));
            return;
        }

        const data = await response.json();

        if (!data.success) {
            setIsLoading(false);
            toast.error(t('Failed to create team'));
            return;
        }

        setIsLoading(false);
        toast.success(t('Team created: ') + accessCode);

        setIsDialogOpen(false);

        setAccessCode('');
        setName('');
        setOpenAIKey('');
        setOpenAIEndpoint('');
        setAzureKey('');
        setAzureEndpoint('');
        setAzureDeploymentName('');
        setClaudeKey('');

        router.refresh();
    };

    let serviceProviderSelection;

    switch (serviceProvider) {
        case 'OpenAI':
            serviceProviderSelection = (
                <>
                    <div className='space-y-1'>
                        <Label>OpenAI Key</Label>
                        <Input placeholder='sk-' value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label>OpenAI Endpoint</Label>
                        <Input placeholder='https://api.openai.com' value={openAIEndpoint} onChange={(e) => setOpenAIEndpoint(e.target.value)} />
                    </div>
                </>
            );
            break;
        case 'Azure':
            serviceProviderSelection = (
                <>
                    <div className='space-y-1'>
                        <Label>Azure API Key</Label>
                        <Input placeholder='example' value={azureKey} onChange={(e) => setAzureKey(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label>Azure API Endpoint</Label>
                        <Input placeholder='https://xxxxx.opneai.azure.com' value={azureEndpoint} onChange={(e) => setAzureEndpoint(e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label>Azure Deployment Name</Label>
                        <Input placeholder='Example' value={azureDeploymentName} onChange={(e) => setAzureDeploymentName(e.target.value)} />
                    </div>
                </>
            );
            break;
        case 'Claude':
            serviceProviderSelection = (
                <>
                    <div className='space-y-1'>
                        <Label>Claude API Key</Label>
                        <Input placeholder='Example' value={claudeKey} onChange={(e) => setClaudeKey(e.target.value)} />
                    </div>
                </>
            );
            break;
    }

    return (
        <div className='flex justify-end'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline' className='flex items-center space-x-1 dark:border-stone-400'>
                        <MdOutlineAdd className='block text-lg' />
                        <span>{t('Create Team')}</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('Create Team')}</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-3'>
                        <div className='space-y-1'>
                            <Label>{t('Name')}</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>{t('Access Code')}</Label>
                            <Input value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>{t('Service Provider')}</Label>
                            <Select value={serviceProvider} onValueChange={setServiceProvider}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='OpenAI'>OpenAI</SelectItem>
                                    <SelectItem value='Azure'>Azure AI</SelectItem>
                                    <SelectItem value='Claude'>Anthropic Claude</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {serviceProviderSelection}
                    </div>
                    <DialogFooter>
                        <Button type='submit' onClick={handleCreate}>
                            {t('Create')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CreateButton;
