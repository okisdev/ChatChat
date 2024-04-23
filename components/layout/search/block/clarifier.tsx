'use client';

import React, { useEffect, useState } from 'react';
import { BsFillQuestionDiamondFill } from 'react-icons/bs';
import { GoSkip } from 'react-icons/go';
import { useActions, useStreamableValue, useUIState } from 'ai/rsc';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import type { AI } from '@/app/[locale]/(home)/action';
import { Additions } from '@/components/layout/search/block/additions';
import { BlockTitle } from '@/components/layout/search/block/block-title';
import { BlockError } from '@/components/layout/search/block/error';
import { Checkbox } from '@/components/ui/custom/checkbox';
import { Input } from '@/components/ui/custom/input';
import store from '@/hooks/store';
import { TClarifier } from '@/types/search';

export const Clarifier = ({ clarify }: { clarify?: TClarifier }) => {
    const t = useTranslations();

    const { search } = useActions<typeof AI>();

    const [isProSearch] = useAtom(store.isProSearchAtom);
    const [currentUseModel] = useAtom(store.currentUseModelAtom);
    const [currentProviderSettings] = useAtom(store.currentProviderSettingsAtom);
    const [currentSearchEngineSettings] = useAtom(store.currentSearchEngineSettingsAtom);

    const [input, setInput] = useState<string>('');

    const [skipped, setSkipped] = useState<boolean>(false);

    const [allowSubmit, setAllowSubmit] = useState<boolean>(false);

    const [isClarified, setIsClarified] = useState(false);

    const [messages, setMessages] = useUIState<typeof AI>();

    const [data, error, pending] = useStreamableValue<TClarifier>(clarify);

    const [selected, setSelected] = useState<{
        [key: string]: boolean;
    }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        canBeProceed();
    };

    const handleOptionChange = (selectedOption: string) => {
        const updatedCheckedOptions = {
            ...selected,
            [selectedOption]: !selected[selectedOption],
        };
        setSelected(updatedCheckedOptions);
        canBeProceed(updatedCheckedOptions);
    };

    const canBeProceed = (currentOptions = selected) => {
        setAllowSubmit(Object.values(currentOptions).some((checked) => checked) || !!input);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, skip?: boolean) => {
        e.preventDefault();

        setIsClarified(true);
        setSkipped(skip || false);

        const formData = skip ? undefined : new FormData(e.target as HTMLFormElement);

        const searchResponse = await search(currentUseModel, currentProviderSettings, currentSearchEngineSettings, formData, isProSearch, skip);

        setMessages((currentMessages) => [...currentMessages, searchResponse]);
    };

    const handleNoIdea = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true);
    };

    useEffect(() => {
        canBeProceed();
    }, [input]);

    if (error) {
        return <BlockError content={error} type='error' />;
    }

    if (skipped) {
        return null;
    }

    if (isClarified) {
        return <Additions content={selected} input={input} />;
    }

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('clarifier')} icon={BsFillQuestionDiamondFill} />
            <div className='mx-auto w-full rounded-md border border-neutral-300/40 bg-neutral-200/60 p-4 shadow-md dark:border-neutral-800/60 dark:bg-neutral-800/60 dark:text-neutral-200/80 dark:shadow-lg'>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <p className='text-xl'>{data?.question}</p>
                    </div>
                    {data?.options && data?.options?.length > 0 && (
                        <div className='flex flex-wrap justify-start'>
                            {data?.options?.map((option, index) => (
                                <div key={index} className='mb-2 flex items-center space-x-1.5'>
                                    <Checkbox id={option?.value} name={option?.value} onCheckedChange={() => handleOptionChange(option?.content as string)} />
                                    <label className='whitespace-nowrap pr-4 text-sm' htmlFor={option?.value}>
                                        {option?.content}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                    {data?.allowsInput && (
                        <div className='mb-4 flex flex-col space-y-2 text-sm'>
                            <label htmlFor='query'>{data?.clarifyLabel}</label>
                            <Input type='text' name='additional_query' className='w-full' id='query' placeholder={data?.clarifyPlaceholder} value={input} onChange={handleInputChange} />
                        </div>
                    )}
                    <div className='flex justify-end'>
                        <button
                            type='submit'
                            disabled={!allowSubmit || pending}
                            className='flex items-center justify-center rounded-md border border-neutral-600/40 px-2 py-1 text-sm transition duration-300 ease-in-out hover:bg-neutral-300/30 data-[state=disabled]:cursor-not-allowed data-[state=enabled]:cursor-pointer data-[state=disabled]:text-neutral-100 dark:border-neutral-900/40 dark:hover:bg-neutral-500/90 dark:hover:text-neutral-300/80'
                        >
                            {t('confirm')}
                        </button>
                    </div>
                    <div className='my-4 border-b border-neutral-300/40' />
                    <div className='flex flex-row items-center justify-between'>
                        <div className='flex flex-row items-center space-x-1'>
                            <GoSkip size='20' />
                            <p>{t('specific_information_not_sure')}</p>
                        </div>
                        <button
                            type='button'
                            onClick={handleNoIdea}
                            disabled={pending}
                            className='flex items-center justify-center rounded-md border border-neutral-600/40 px-2 py-1 text-sm transition duration-300 ease-in-out hover:bg-neutral-300/30 data-[state=disabled]:cursor-not-allowed data-[state=enabled]:cursor-pointer dark:border-neutral-900/40 dark:hover:bg-neutral-500/90 dark:hover:text-neutral-300/80'
                        >
                            {t('no_idea')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
