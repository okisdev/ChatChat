'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import { MdOutlineAdd } from 'react-icons/md';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const CreateButton = () => {
    const router = useRouter();

    const t = useTranslations('dashboard');

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [accessCode, setAccessCode] = useState<string>('');
    const [openAIKey, setOpenAIKey] = useState<string>('');
    const [openAIEndpoint, setOpenAIEndpoint] = useState<string>('');

    const handleCreate = async () => {
        if (isLoading) {
            return;
        }

        if (name.length === 0) {
            toast.error('Team name is required');
            return;
        }

        if (accessCode.length === 0) {
            toast.error('Team access token is required');
            return;
        }

        if (openAIKey.length === 0) {
            toast.error('OpenAI key is required');
            return;
        }

        if (openAIEndpoint.length === 0) {
            toast.error('OpenAI endpoint is required');
            return;
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
            }),
        });

        if (!response.ok) {
            setIsLoading(false);
            toast.error('Failed.');
            return;
        }

        const data = await response.json();

        if (!data.success) {
            setIsLoading(false);
            toast.error(data.error);
            return;
        }

        setIsLoading(false);
        toast.success('Team created: ' + accessCode);

        setIsDialogOpen(false);

        setAccessCode('');
        setName('');
        setOpenAIKey('');
        setOpenAIEndpoint('');

        router.refresh();
    };

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
                            <Input placeholder='' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>{t('Access Code')}</Label>
                            <Input placeholder='' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>OpenAI Key</Label>
                            <Input placeholder='sk-' value={openAIKey} onChange={(e) => setOpenAIKey(e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>OpenAI Endpoint</Label>
                            <Input placeholder='https://api.openai.com' value={openAIEndpoint} onChange={(e) => setOpenAIEndpoint(e.target.value)} />
                        </div>
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
