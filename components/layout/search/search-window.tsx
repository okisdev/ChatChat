import { useCallback, useEffect, useRef, useState } from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import type { AI } from '@/app/[locale]/(home)/action';
import { Question } from '@/components/layout/search/block/question';
import { TryAsk } from '@/components/layout/search/block/try-ask';
import { InputBox } from '@/components/layout/search/input-box';
import store from '@/hooks/store';

export const SearchWindow = () => {
    const t = useTranslations();

    const { search } = useActions<typeof AI>();

    const [isProSearch] = useAtom(store.isProSearchAtom);
    const [currentUseModel] = useAtom(store.currentUseModelAtom);
    const [currentProviderSettings] = useAtom(store.currentProviderSettingsAtom);
    const [currentSearchEngineSettings] = useAtom(store.currentSearchEngineSettingsAtom);

    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const [messages, setMessages] = useUIState<typeof AI>();

    const [isSend, setIsSend] = useState<boolean>(false);

    useEffect(() => {
        if (isSend) {
            inputRef.current?.focus();
            setIsSend(false);
        }
    }, [isSend]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSend) {
            handleClear();
            setIsSend(false);
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: Date.now(),
                isGenerating: false,
                component: <Question content={input} />,
            },
        ]);

        const formData = new FormData(e.currentTarget);

        const searchResponse = await search(currentUseModel, currentProviderSettings, currentSearchEngineSettings, formData, isProSearch);

        setMessages((currentMessages) => [...currentMessages, searchResponse]);

        setInput('');
    };

    const handleClear = () => {
        setIsSend(true);
        setMessages([]);
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const setInputStable = useCallback((value: string) => {
        setInput(value);
    }, []);

    if (messages.length > 0) {
        return (
            <div className='flex-1'>
                {messages.map((message: { id: number; component: React.ReactNode }) => (
                    <div key={message.id} className='my-10 space-y-10'>
                        {message.component}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className='inset-x-0 bottom-8 top-10 mx-auto flex h-screen flex-col items-center justify-center space-y-10'>
            <p className='text-2xl font-medium'>{t('search_slogan')}</p>
            <InputBox input={input} inputRef={inputRef} setInput={setInput} handleSubmit={handleSubmit} />
            <TryAsk setInput={setInputStable} />
        </div>
    );
};
