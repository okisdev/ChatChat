'use client';

import { FaQuestion } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';

import { RenderSimpleMessage } from '@/components/layout/message';
import { BlockTitle } from '@/components/layout/search/block/block-title';

export const Question = ({ content }: Readonly<{ content: string }>) => {
    const t = useTranslations();

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('your_question')} icon={FaQuestion} />
            <RenderSimpleMessage content={content} />
        </div>
    );
};
