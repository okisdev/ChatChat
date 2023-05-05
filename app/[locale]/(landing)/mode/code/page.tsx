'use client';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import LandingHeader from '@/components/landing/main/header';
import CodeMain from '@/components/landing/main/code-main';

export default function CodeModePage() {
    const isHiddenSide = useAtomValue(store.isHiddenSideAtom);

    return (
        <div className={`h-screen ${!isHiddenSide && 'md:ml-80'}`}>
            <LandingHeader />
            <CodeMain />
        </div>
    );
}
