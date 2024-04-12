'use client';

import { memo } from 'react';
import { PiStarFourBold } from 'react-icons/pi';
import { useLocale, useTranslations } from 'next-intl';

import { BlockTitle } from '@/components/layout/search/block/block-title';
import { questions } from '@/config/search/question';

export const TryAsk = memo(function TryAsk({
    setInput,
}: Readonly<{
    setInput: (value: string) => void;
}>) {
    const t = useTranslations();

    const locale = useLocale();

    const localeQuestions = questions[locale] ?? questions.en;
    const randomQuestions = localeQuestions.sort(() => Math.random() - 0.5).slice(0, 5);

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('try_asking')} icon={PiStarFourBold} />
            <div className='flex flex-wrap gap-3'>
                {randomQuestions.map((question) => (
                    <button
                        key={question.value}
                        onClick={() => setInput(question.value)}
                        className='rounded-md bg-neutral-200/70 px-3 text-sm transition duration-300 ease-in-out hover:bg-neutral-300/70 dark:bg-neutral-600/70 dark:text-neutral-200/70 dark:hover:bg-neutral-500/70'
                    >
                        {question.question}
                    </button>
                ))}
            </div>
        </div>
    );
});
