'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Record } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { IoCopy } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const RecordCard = ({ record }: { record: Record }) => {
    const router = useRouter();

    const t = useTranslations('dashboard');

    const [enableShare, setEnableShare] = useState<boolean>(false);

    const onSwitchShare = async (value: boolean) => {
        setEnableShare(value);

        if (!value) return;

        const response = await fetch(`/api/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                story: JSON.stringify({ id: record.id, type: 'chat', title: record.title, messages: record.content, timestamp: record.createdAt, share: true }),
            }),
        });

        if (!response.ok) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        if (data.type == 'update') {
            navigator.clipboard.writeText(window.location.host + `/s/${record.id}`);
            toast.success(`${t('Updated the previous share:')} ${record.id}`);
            return;
        }

        navigator.clipboard.writeText(window.location.host + `/s/${record.id}`);
        toast.success(`${t('Copied share link:')} ${record.id}`);
    };

    const onCopy = () => {
        const url = `${window.location.origin}/s/${record.id}`;

        navigator.clipboard.writeText(url);
        toast.success(`${t('Copied share link:')} ${record.id}`);
    };

    const onDelete = async () => {
        const response = await fetch(`/api/record/${record.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        toast.success(`${t('Deleted record:')} ${record.id}`);

        router.refresh();
    };

    return (
        <div className='flex justify-between rounded-xl border p-3 dark:border-stone-400'>
            <div className='w-8/12 space-y-2'>
                <p>{record.title}</p>
                <p className='text-xs'>{formatDate(record.createdAt)}</p>
            </div>
            <div className='flex flex-row items-center space-x-3'>
                <div className='space-y-2'>
                    <div className='flex items-center space-x-2 text-sm'>
                        <p>{t('Share')}</p>
                        <Switch onCheckedChange={onSwitchShare} />
                        {enableShare && (
                            <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700' onClick={onCopy}>
                                <IoCopy />
                            </button>
                        )}
                    </div>
                    <div>
                        <p className='text-xs'>{formatDate(record.updatedAt)}</p>
                    </div>
                </div>
                <div>
                    <Button variant='destructive' onClick={onDelete}>
                        <MdDelete className='text-xl' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RecordCard;

const formatDate = (date: number | Date | undefined) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};
