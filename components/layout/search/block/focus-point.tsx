import { LuFocus } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

import { BlockTitle } from '@/components/layout/search/block/block-title';

export const FocusPoint = ({ query }: { query: string }) => {
    const t = useTranslations();

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('searching')} icon={LuFocus} />
            <div>{query}</div>
        </div>
    );
};
