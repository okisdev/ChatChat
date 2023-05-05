'use client';

import { useState } from 'react';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const ProfileSettingsForm = ({ user }: { user: User }) => {
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
            toast.error('Something went wrong.');
            return;
        }

        setIsLoading(false);
        toast.success('Profile updated.');
    };

    const handleAllowRecordCloudSyncChange = async () => {
        setAllowRecordCloudSync(!allowRecordCloudSync);
    };

    return (
        <div className='flex h-full w-full flex-col justify-between space-y-16 overflow-auto md:my-36 md:w-6/12'>
            <div className='space-y-3 overflow-auto p-1'>
                <div>
                    <div className='space-y-2'>
                        <Label>OpenAI API Key</Label>
                        <Input value={openAIKey as string} onChange={(e) => setOpenAIKey(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                </div>
                <Separator />
                <div className='flex h-16 items-center justify-between'>
                    <Label>Language</Label>
                    <Select defaultValue='zh-CN'>
                        <SelectTrigger className='w-[180px] dark:border-stone-400 dark:bg-stone-500'>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ProfileLanguageSelectItems.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex h-16 items-center justify-between'>
                    <Label>Auto upload your records to the cloud</Label>
                    <Switch checked={allowRecordCloudSync} onCheckedChange={handleAllowRecordCloudSyncChange} />
                </div>
            </div>
            <div>
                <div className='flex items-end justify-end'>
                    <Button variant='outline' onClick={() => onSave()} className='dark:bg-stone-500'>
                        {isLoading ? <AiOutlineLoading3Quarters className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettingsForm;

const ProfileLanguageSelectItems = [
    {
        label: 'English',
        value: 'en',
    },
    {
        label: '简体中文',
        value: 'zh-CN',
    },
    {
        label: '繁體中文',
        value: 'zh-HK',
    },
];
