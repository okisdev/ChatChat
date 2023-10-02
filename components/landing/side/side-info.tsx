'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import packageInfo from '@/package.json';

export default function SideInfo() {
    const t = useTranslations('');

    const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);

    const currentYear = new Date().getFullYear();

    const [isLatestVersion, setIsLatestVersion] = useState(true);

    useEffect(() => {
        const getVersion = async () => {
            const res = await fetch('/api/app/latest');
            const data = await res.json();

            if (data.tag_name != packageInfo.version) {
                setIsLatestVersion(false);
            }
        };

        getVersion();
    }, [isLatestVersion]);

    return (
        <div>
            <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                <DialogTrigger asChild>
                    <button className='inline-flex items-center space-x-1 rounded p-1 px-1 text-xs transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700' aria-label='Version'>
                        v{packageInfo.version}
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <div className='flex w-full flex-col items-center justify-center space-y-10'>
                        <div className='flex flex-col items-center'>
                            <Image src='/icons/android-chrome-512x512.png' alt='logo' width={50} height={50} />
                            <p className='text-xl font-medium'>Chat Chat</p>
                            <p className='text-sm text-neutral-600 dark:text-neutral-200'>v{packageInfo.version}</p>
                            {!isLatestVersion && (
                                <Link href='https://github.com/okisdev/ChatChat/releases/latest' target='_blank'>
                                    <Badge variant='destructive'>{t('New Version Available')}</Badge>
                                </Link>
                            )}
                        </div>
                        <div className='space-y-2 text-center'>
                            <p className='text-sm'>
                                Copyright © {currentYear}{' '}
                                <Link href='https://github.com/okisdev/ChatChat' target='_blank' className='underline'>
                                    Chat Chat
                                </Link>
                                . AGPL-3.0 License.
                            </p>
                            <div className='space-x-3 text-xs'>
                                <Link
                                    href='https://www.harrly.com/privacy-policy'
                                    target='_blank'
                                    className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                >
                                    <span>Privacy Policy</span>
                                </Link>
                                <Link
                                    href='https://www.harrly.com/cookies'
                                    target='_blank'
                                    className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                >
                                    <span>Cookies</span>
                                </Link>
                                <Link
                                    href='https://github.com/okisdev/ChatChat'
                                    target='_blank'
                                    className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                >
                                    <span>GitHub</span>
                                </Link>
                                <Link
                                    href='https://www.harrly.com/'
                                    target='_blank'
                                    className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                >
                                    <span>Harry Yep</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
