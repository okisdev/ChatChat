'use client';

import { Suspense } from 'react';
import { useAtom } from 'jotai';

import { Brand } from '@/components/layout/brand';
import { HistoryList } from '@/components/layout/history-list';
import { LanguageDropdown } from '@/components/layout/language-dropdown';
import { SettingsDialog } from '@/components/layout/settings-dialog';
import { SettingsDrawer } from '@/components/layout/settings-drawer';
import { ThemeDropdown } from '@/components/layout/theme-dropdown';
import store from '@/hooks/store';
import { useMediaQuery } from '@/hooks/window';

export default function AppSidebar() {
    const [conversations, setConversations] = useAtom(store.conversationsAtom);

    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div className='hidden h-screen w-64 flex-col justify-between gap-2 px-3 py-5 md:flex'>
            <Brand />
            <div className='w-full self-center border-b dark:border-neutral-600/80' />
            <div className='my-1 grow overflow-auto scroll-smooth'>
                <HistoryList conversations={conversations} setConversations={setConversations} />
            </div>
            <div className='flex flex-row items-center justify-between'>
                <Suspense>{isDesktop ? <SettingsDialog /> : <SettingsDrawer />}</Suspense>
                <div className='flex flex-row items-center justify-center'>
                    <Suspense>
                        <ThemeDropdown />
                    </Suspense>
                    <LanguageDropdown />
                </div>
            </div>
        </div>
    );
}
