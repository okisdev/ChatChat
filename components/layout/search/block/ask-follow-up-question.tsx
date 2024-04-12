'use client';

import { useRef, useState } from 'react';
import { LiaReadme } from 'react-icons/lia';
import { useActions, useUIState } from 'ai/rsc';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import type { AI } from '@/app/[locale]/(home)/action';
import { BlockTitle } from '@/components/layout/search/block/block-title';
import { Question } from '@/components/layout/search/block/question';
import { InputBox } from '@/components/layout/search/input-box';
import store from '@/hooks/store';

export const AskFollowUpQuestion = () => {
    const t = useTranslations();

    const { search } = useActions<typeof AI>();

    const [isProSearch] = useAtom(store.isProSearchAtom);
    const [currentUseModel] = useAtom(store.currentUseModelAtom);
    const [currentProviderSettings] = useAtom(store.currentProviderSettingsAtom);
    const [currentSearchEngineSettings] = useAtom(store.currentSearchEngineSettingsAtom);

    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [messages, setMessages] = useUIState<typeof AI>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const userMessage = {
            id: Date.now(),
            isGenerating: false,
            component: <Question content={input} />,
        };

        const searchResponse = await search(currentUseModel, currentProviderSettings, currentSearchEngineSettings, formData, isProSearch);

        setMessages((currentMessages) => [...currentMessages, userMessage, searchResponse]);

        setInput('');
    };

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('ask_follow_up_question')} icon={LiaReadme} />
            <InputBox input={input} inputRef={inputRef} setInput={setInput} handleSubmit={handleSubmit} />
        </div>
    );
};
