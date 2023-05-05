'use client';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import LandingHeader from '@/components/landing/main/header';
import FileMain from '@/components/landing/main/file-main';

export default function FileModePage() {
    const isHiddenSide = useAtomValue(store.isHiddenSideAtom);

    return (
        <div className={`h-screen ${!isHiddenSide && 'md:ml-80'}`}>
            <LandingHeader />
            <FileMain />
        </div>
    );
}
