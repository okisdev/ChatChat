'use client';

import { AiOutlineSolution } from 'react-icons/ai';
import { StreamableValue, useStreamableValue } from 'ai/rsc';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';

import { renderMarkdownMessage } from '@/components/layout/message';
import { BlockTitle } from '@/components/layout/search/block/block-title';
import store from '@/hooks/store';

export const Answer = ({
    content,
}: Readonly<{
    content: string | StreamableValue<string>;
}>) => {
    const t = useTranslations();

    const [data, error, pending] = useStreamableValue(content);

    const [sameCitationId, setSameCitationId] = useAtom<string>(store.sameCitationAtom);

    if (error) return <div>{t('error')}</div>;

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('answer')} icon={AiOutlineSolution} />
            <article>{renderMarkdownMessage(data ?? '', sameCitationId, (value) => setSameCitationId(value))}</article>
        </div>
    );
};
