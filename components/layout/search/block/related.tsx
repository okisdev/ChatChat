'use client';

import React from 'react';
import { LuPlus } from 'react-icons/lu';
import { PiPlugsConnectedDuotone } from 'react-icons/pi';
import { useActions, useStreamableValue, useUIState } from 'ai/rsc';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { AI } from '@/app/[locale]/(home)/action';
import { BlockTitle } from '@/components/layout/search/block/block-title';
import { BlockError } from '@/components/layout/search/block/error';
import { Question } from '@/components/layout/search/block/question';
import store from '@/hooks/store';
import { TIllustrator } from '@/types/search';

export const Related = ({ relatedQueries }: { relatedQueries: TIllustrator }) => {
    const t = useTranslations();

    const { search } = useActions<typeof AI>();

    const [isProSearch] = useAtom(store.isProSearchAtom);
    const [currentUseModel] = useAtom(store.currentUseModelAtom);
    const [currentProviderSettings] = useAtom(store.currentProviderSettingsAtom);
    const [currentSearchEngineSettings] = useAtom(store.currentSearchEngineSettingsAtom);

    const [messages, setMessages] = useUIState<typeof AI>();

    const [data, error, pending] = useStreamableValue<TIllustrator>(relatedQueries);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget as HTMLFormElement);

        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLTextAreaElement;

        let query = '';

        if (submitter) {
            formData.append(submitter.name, submitter.value);
            query = submitter.value;
        }

        const userMessage = {
            id: Date.now(),
            isGenerating: false,
            component: <Question content={query} />,
        };

        const searchResponse = await search(currentUseModel, currentProviderSettings, currentSearchEngineSettings, formData, isProSearch);

        setMessages((currentMessages) => [...currentMessages, userMessage, searchResponse]);
    };

    if (error) {
        return <BlockError content={error} type='error' />;
    }

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('related')} icon={PiPlugsConnectedDuotone} />
            <form onSubmit={handleSubmit} className='flex flex-wrap space-y-2'>
                {data?.items
                    ?.filter((item) => item?.query !== '')
                    .map((item, index) => (
                        <button
                            key={index}
                            type='submit'
                            value={item?.query}
                            className='flex w-full items-center space-x-2 rounded-md bg-neutral-100 px-2 py-1 text-left text-sm font-medium text-neutral-600 shadow-sm transition-colors duration-500 ease-in-out hover:bg-neutral-200 hover:text-neutral-700 hover:shadow-md hover:ring-2 hover:ring-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:hover:text-neutral-100 dark:hover:ring-neutral-500 dark:focus-visible:ring-neutral-500'
                        >
                            <LuPlus className='size-auto min-w-5' />
                            <p className='text-sm font-medium'>{item?.query}</p>
                        </button>
                    ))}
            </form>
        </div>
    );
};
