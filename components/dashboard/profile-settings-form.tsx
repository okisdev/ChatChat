'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const ProfileSettingsForm = ({ user }: { user: User }) => {
    const t = useTranslations('dashboard');

    const [openAIKey, setOpenAIKey] = useState<string | null>(user.openAIKey);
    const [allowRecordCloudSync, setAllowRecordCloudSync] = useState<boolean>(user.allowRecordCloudSync);

    const [isLoading, setIsLoading] = useState(false);

    const onSave = async () => {
        setIsLoading(true);

        const response = await fetch(`/api/user/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                openAIKey: openAIKey,
                allowRecordCloudSync: allowRecordCloudSync,
            }),
        });

        if (!response?.ok) {
            setIsLoading(false);
            toast.error(t('Error: Something went wrong'));
            return;
        }

        setIsLoading(false);
        toast.success(t('Profile updated'));
    };

    const handleAllowRecordCloudSyncChange = async () => {
        setAllowRecordCloudSync(!allowRecordCloudSync);
    };

    return (
        <div className='flex h-full w-full flex-col justify-between space-y-16 overflow-auto md:my-36 md:w-8/12 xl:w-6/12'>
            <div className='space-y-3 overflow-auto p-1'>
                <div>
                    <div className='space-y-2'>
                        <Label>OpenAI API Key</Label>
                        <Input value={openAIKey as string} onChange={(e) => setOpenAIKey(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                </div>
                <Separator />

                <div className='flex h-16 items-center justify-between'>
                    <Label>{t('Auto upload your records to the cloud')}</Label>
                    <Switch checked={allowRecordCloudSync} onCheckedChange={handleAllowRecordCloudSyncChange} />
                </div>
            </div>
            <div>
                <div className='flex items-end justify-end'>
                    <Button variant='outline' onClick={() => onSave()} className='dark:bg-stone-500' disabled={isLoading}>
                        <span>{t('Save')}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsForm;
