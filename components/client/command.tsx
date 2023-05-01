'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Settings, User } from 'lucide-react';

import { FiCode, FiFile, FiMessageCircle } from 'react-icons/fi';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';

export const ClientCommand = () => {
    const router = useRouter();

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
            <CommandInput placeholder='Type a command or search...' />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Conversation'>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/mode/chat');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <FiMessageCircle className='mr-2 h-4 w-4' />
                            <span>New Chat</span>
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
                            <span>New Code</span>
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
                            <span>New File</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading='Profile'>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/profile/info');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>Info</span>
                        </button>
                    </CommandItem>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/profile/info/record');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>Share</span>
                        </button>
                    </CommandItem>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/profile/info/settings');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <Settings className='mr-2 h-4 w-4' />
                            <span>Settings</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading='Team'>
                    <CommandItem>
                        <button
                            onClick={() => {
                                router.push('/profile/team');
                                setOpen(false);
                            }}
                            className='flex items-center'
                        >
                            <User className='mr-2 h-4 w-4' />
                            <span>Overview</span>
                        </button>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
