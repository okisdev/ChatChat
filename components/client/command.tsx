'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Settings, User } from 'lucide-react';

import { FiCode, FiFile, FiMessageCircle } from 'react-icons/fi';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import { useTranslations } from 'next-intl';

export const ClientCommand = () => {
    const router = useRouter();

    const t = useTranslations('');

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
            <CommandInput placeholder={t('type_command_to_search')} />
            <CommandList>
                <CommandEmpty>{t('no_command_found')}</CommandEmpty>
                <CommandGroup heading={t('conversation')}>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/mode/chat');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <FiMessageCircle className='mr-2 h-4 w-4' />
                            <span>{t('new_chat')}</span>
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
                            <span>{t('new_code')}</span>
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
                            <span>{t('new_file')}</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading={t('profile')}>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/dashboard/profile/info');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>{t('info')}</span>
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
                            <span>{t('share')}</span>
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
                            <span>{t('settings')}</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading={t('team')}>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/dashboard/team');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>{t('overview')}</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
