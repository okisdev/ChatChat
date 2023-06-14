'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Settings, User } from 'lucide-react';

import { FiCode, FiFile, FiMessageCircle } from 'react-icons/fi';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { useTranslations } from 'next-intl';

export const ClientCommand = () => {
    const router = useRouter();

    const t = useTranslations('component');

    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && e.metaKey) {
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder={t('Type a command to search')} />
            <CommandList>
                <CommandEmpty>{t('No command found')}</CommandEmpty>
                <CommandGroup heading={t('Conversation')}>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/mode/chat');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <FiMessageCircle className='mr-2 h-4 w-4' />
                            <span>{t('New Chat')}</span>
                        </button>
                    </CommandItem>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/mode/code');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <FiCode className='mr-2 h-4 w-4' />
                            <span>{t('New Code')}</span>
                        </button>
                    </CommandItem>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/mode/file');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <FiFile className='mr-2 h-4 w-4' />
                            <span>{t('New File')}</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading={t('Profile')}>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/dashboard/profile/info');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>{t('Info')}</span>
                        </button>
                    </CommandItem>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/dashboard/profile/info/record');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>{t('Share')}</span>
                        </button>
                    </CommandItem>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/dashboard/profile/info/settings');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <Settings className='mr-2 h-4 w-4' />
                            <span>{t('Settings')}</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading={t('Team')}>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/dashboard/team');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>{t('Overview')}</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
