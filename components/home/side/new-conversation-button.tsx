'use client';

import { useTranslations } from 'next-intl';

import { HiChatBubbleLeft } from 'react-icons/hi2';

const NewConversationButton = () => {
    const t = useTranslations('');

    return (
        <div className='flex items-center justify-center'>
            <button
                className='inline-flex items-center space-x-1 rounded p-1 px-2 text-sm font-medium transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                onClick={() => (location.href = '/')}
            >
                <HiChatBubbleLeft />
                <span>{t('New Conversation')}</span>
            </button>
        </div>
    );
};

export default NewConversationButton;
