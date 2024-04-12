'use client';

import { LuCheckCheck } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

import { BlockTitle } from '@/components/layout/search/block/block-title';

export const Additions = ({
    content,
    input,
}: Readonly<{
    content: {
        [key: string]: boolean;
    };
    input: string;
}>) => {
    const t = useTranslations();

    let options: string[] = Object.entries(content).reduce((acc: string[], [option, checked]) => {
        if (checked) acc.push(option);
        return acc;
    }, []);

    const additions = options.join(', ');

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('your_additions')} icon={LuCheckCheck} />
            {<div>{t('focus_on') + ': ' + input + t('and') + ' ' + additions}</div>}
        </div>
    );
};
