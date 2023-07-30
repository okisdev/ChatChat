'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import packageInfo from '@/package.json';

export default function SideInfo() {
    const t = useTranslations('landing');

    const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);

    const currentYear = new Date().getFullYear();

    const [isLatestVersion, setIsLatestVersion] = useState(false);

    useEffect(() => {
        const getVersion = async () => {
            const res = await fetch('/api/app/latest');
            const data = await res.json();

            if (data.tag_name == packageInfo.version) {
                setIsLatestVersion(true);
            }
        };

        getVersion();
    }, [isLatestVersion]);

    return (
        <div>
            <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
                <DialogTrigger asChild>
                    <button className='text-xs inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700' aria-label='Version'>
                        v{packageInfo.version}
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <div className='flex flex-col space-y-10 w-full items-center justify-center'>
                        <div className='flex items-center flex-col'>
                            <Image src='/icons/android-chrome-512x512.png' alt='logo' width={50} height={50} />
                            <p className='font-medium text-xl'>Chat Chat</p>
                            <p className='text-sm text-neutral-600 dark:text-neutral-200'>v{packageInfo.version}</p>
                            {!isLatestVersion && (
                                <Link href='https://github.com/okisdev/ChatChat/releases/latest' target='_blank'>
                                    <Badge variant='destructive'>{t('New Version Available')}</Badge>
                                </Link>
                            )}
                        </div>
                        <div className='text-center space-y-2'>
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
