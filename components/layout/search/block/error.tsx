'use client';

import { BiError } from 'react-icons/bi';
import { useTranslations } from 'next-intl';

import { renderMarkdownMessage } from '@/components/layout/message';
import { BlockTitle } from '@/components/layout/search/block/block-title';

type ErrorType = 'not_supported' | 'provider_not_configured' | 'search_engine_not_configured' | 'error';

export const BlockError = ({
    content,
    type = 'error',
}: Readonly<{
    content: any;
    type: ErrorType;
}>) => {
    const t = useTranslations();

    const RenderErrorMessage = () => {
        switch (type) {
            case 'not_supported':
                return <div>{t('provider_not_supported') ?? content}</div>;
            case 'search_engine_not_configured':
                return <div>{t('search_engine_not_configured') ?? content}</div>;
            case 'provider_not_configured':
                return <div>{t('provider_not_configured') ?? content}</div>;
            case 'error':
            default:
                return <div>{renderMarkdownMessage(content ?? '')}</div>;
        }
    };

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('error')} icon={BiError} />
            <div>{RenderErrorMessage()}</div>
        </div>
    );
};
