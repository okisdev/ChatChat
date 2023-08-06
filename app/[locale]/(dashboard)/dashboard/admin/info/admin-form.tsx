'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const AdminForm = () => {
    const t = useTranslations('dashboard');

    const [isLoading, setIsLoading] = useState(false);

    const [enableRegistration, setEnableRegistration] = useState<boolean>(false);
    const [enableCloudSync, setEnableCloudSync] = useState<boolean>(false);

    const onSubmit = () => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className='space-y-10 overflow-auto md:my-36 md:w-10/12 md:space-y-16 xl:w-6/12'>
            <div className='space-y-10 rounded-xl md:p-3'>
                <div className='flex w-full flex-col items-start space-y-1'>
                    <p className='text-sm'>Site Name</p>
                    <Input className='dark:border-neutral-500 dark:bg-neutral-700' />
                </div>
                <div className='flex flex-col space-y-3'>
                    <div className='flex w-full flex-row items-center space-x-3'>
                        <Switch checked={enableRegistration} onCheckedChange={(checked) => setEnableRegistration(checked)} />
                        <p className='text-sm'>Allow Registration</p>
                    </div>
                    <div className='flex w-full flex-row items-center space-x-3'>
                        <Switch checked={enableCloudSync} onCheckedChange={(checked) => setEnableCloudSync(checked)} />
                        <p className='text-sm'>Allow Cloud Sync</p>
                    </div>
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

export default AdminForm;
