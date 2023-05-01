'use client';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import LandingHeader from '@/components/landing/header';
import ChatMain from '@/components/landing/mode/chat-main';

export default function ChatModePage() {
    const isHiddenSide = useAtomValue(store.isHiddenSideAtom);

    return (
        <div className={`h-screen ${!isHiddenSide && 'md:ml-80'}`}>
            <LandingHeader />
            <ChatMain />
        </div>
    );
}
