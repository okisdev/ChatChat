'use client';

import { User } from '@prisma/client';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import SideHistory from '@/components/home/side/history';

import SideFooter from '@/components/home/side/footer';
import SideHeader from '@/components/home/side/header';
import NewConversationButton from '@/components/home/side/new-conversation-button';

const LandingSide = ({ className, user }: { className?: string; user: User | null }) => {
    const isHiddenSide = useAtom(store.isHiddenSideAtom)[0];

    if (isHiddenSide) return null;

    return (
        <aside className={'bottom-1 left-0 top-1 z-10 h-full flex-col justify-between rounded-lg backdrop-blur md:fixed md:w-80 ' + className}>
            <div className='space-y-2 md:p-1'>
                <SideHeader />
                <NewConversationButton />
                <SideHistory />
            </div>
            <SideFooter user={user} />
        </aside>
    );
};

export default LandingSide;
