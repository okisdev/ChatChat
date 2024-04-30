'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { VersionLabel } from '@/components/layout/version-label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import packageInfo from '@/package.json';

export const VersionBadge = () => {
    const t = useTranslations();

    const [isLatestVersion, setIsLatestVersion] = useState(true);

    const getVersion = async () => {
        const res = await fetch('/api/app/latest');
        const data = await res.json();

        if (data.short.version != packageInfo.version) {
            setIsLatestVersion(false);
        }
    };

    useEffect(() => {
        getVersion();
    }, [isLatestVersion]);

    return (
        <Dialog>
            <DialogTrigger>
                <VersionLabel />
            </DialogTrigger>
            <DialogContent className='flex w-full flex-col items-center justify-center space-y-6 dark:border-neutral-500 dark:bg-neutral-700'>
                <div className='flex flex-col items-center space-y-1'>
                    <Avatar>
                        <AvatarImage src='/icon.svg' width={50} height={50} />
                    </Avatar>
                    <p className='text-xl font-medium'>Chat Chat</p>
                    <VersionLabel />
                    {!isLatestVersion && (
                        <Link href='https://github.com/okisdev/ChatChat/releases/latest' target='_blank'>
                            <Badge variant='destructive'>{t('new_version_available')}</Badge>
                        </Link>
                    )}
                </div>
                <div className='flex w-full flex-col space-y-1 text-xs'>
                    <div className='flex justify-between'>
                        <Link
                            href='https://docs.okis.dev/chat/intro'
                            target='_blank'
                            className='inline-flex items-center space-x-1 rounded px-1 py-0.5 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-neutral-600'
                        >
                            <span>{t('docs')}</span>
                        </Link>
                        <Link
                            href='https://github.com/okisdev/ChatChat'
                            target='_blank'
                            className='inline-flex items-center space-x-1 self-end rounded px-1 py-0.5 underline transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-neutral-700'
                        >
                            <p>{t('open_source_message', { license: 'AGPL-3.0' })}</p>
                        </Link>
                    </div>
                    <div className='flex justify-between'>
                        <div className='space-x-3 text-xs'>
                            <Link
                                href='https://www.harrly.com/privacy-policy'
                                target='_blank'
                                className='inline-flex items-center space-x-1 rounded px-1 py-0.5 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-neutral-600'
                            >
                                <span>{t('privacy_policy')}</span>
                            </Link>
                            <Link
                                href='https://www.harrly.com/cookies'
                                target='_blank'
                                className='inline-flex items-center space-x-1 rounded px-1 py-0.5 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-neutral-600'
                            >
                                <span>{t('cookies')}</span>
                            </Link>
                        </div>
                        <Link
                            href='https://www.harrly.com/'
                            target='_blank'
                            className='inline-flex items-center space-x-1 rounded px-1 py-0.5 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-neutral-600'
                        >
                            {t('made_by_author', { author: 'Harry Yep' })}
                        </Link>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
