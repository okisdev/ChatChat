'use client';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import LandingHeader from '@/components/home/main/header';
import ChatMain from '@/components/home/main/chat-main';

export default function HomePage() {
    // const isHiddenSide = useAtomValue(store.isHiddenSideAtom);

    return (
        <div className={`h-screen overflow-hidden}`}>
            <LandingHeader />
            <ChatMain />
        </div>
    );
}
