'use client';

import { AiOutlineSolution } from 'react-icons/ai';
import { useTranslations } from 'next-intl';

import { BlockTitle } from '@/components/layout/search/block/block-title';

export const Searching = () => {
    const t = useTranslations();

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('searching')} icon={AiOutlineSolution} />
            <div>{t('searching_slogan')}</div>
        </div>
    );
};
