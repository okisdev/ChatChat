import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import BarLoader from 'react-spinners/BarLoader';

import { BiCoin, BiMoney } from 'react-icons/bi';

import calculateModelPrice from '@/utils/provider/openai/calculateModelPrice';

const ContentHead = ({
    chatTitle,
    chatTitleResponse,
    waitingSystemResponse,
    conversations,
}: {
    chatTitle: string;
    chatTitleResponse: string;
    waitingSystemResponse: boolean;
    conversations: AppMessageProps[];
}) => {
    const t = useTranslations('landing.main');

    const [tokens, setTokens] = useState<number>(0);

    useEffect(() => {
        if (conversations.length > 0) {
            const getTokens = async () => {
                const response = await fetch('/api/message/tokens', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: conversations,
                    }),
                });

                if (!response.ok) {
                    toast.error('Something went wrong');
                    return;
                }

                const data = await response.json();

                setTokens(data.tokenCount);
            };

            getTokens();
        }
    }, [conversations]);

    return (
        <div className='flex w-full items-center justify-center'>
            <div className='space-y-1'>
                <p className='text-center'>{chatTitle ?? chatTitleResponse}</p>
                <div className='flex items-center justify-center space-x-2 text-center text-sm'>
                    <BiCoin />
                    <span>{tokens}</span>
                </div>
                <div className='flex items-center justify-center space-x-2 text-center text-sm'>
                    <BiMoney />
                    <span>{calculateModelPrice('gpt-3.5-turbo', tokens).toFixed(5)}</span>
                </div>
                <div className='flex flex-col items-center'>
                    <BarLoader loading={waitingSystemResponse} width={150} />
                </div>
            </div>
        </div>
    );
};

export default ContentHead;
