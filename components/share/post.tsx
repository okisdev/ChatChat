'use client';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { Share } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { TbCopy } from 'react-icons/tb';
import { BiLink, BiChat } from 'react-icons/bi';

import { Separator } from '@/components/ui/separator';

import { renderMarkdownMessage, renderUserMessage } from '@/utils/app/renderMessage';

import { siteConfig } from '@/config/site.config';

interface ShareProps {
    share: Pick<Share, 'id' | 'type' | 'title' | 'content' | 'share' | 'createdAt'>;
}

const SharePost = ({ share }: ShareProps) => {
    const router = useRouter();

    const t = useTranslations('share');

    const contentString = JSON.stringify(share.content, null, 2);

    const content = JSON.parse(contentString);

    const onCopyMessage = (index: number) => {
        navigator.clipboard.writeText(content[index].content);
        toast.success(t('Copied to clipboard'));
    };

    const onCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success(t('Copied to clipboard'));
    };

    const handleContinueConversation = () => {
        router.push(`/?share=${share.id}&type=${share.type}`);
    };

    return (
        <div className='m-1 flex w-full flex-grow flex-col space-y-3 rounded-lg bg-white/90 p-3 py-2 shadow backdrop-blur transition-transform duration-500 dark:bg-[#202327] md:m-3 md:space-y-10 md:p-6 md:px-4'>
            <div className='my-3 flex items-center justify-between'>
                <div className='space-y-3'>
                    <p className='gradient-flow bg-gradient-to-r bg-clip-text text-2xl font-semibold leading-none text-transparent'>
                        {siteConfig.title} {t('Share')}
                    </p>
                </div>
                <div className='flex flex-row space-x-3'>
                    {share.type == 'chat' && (
                        <button
                            className='inline-flex items-center space-x-1 rounded p-1 px-1 ring-2 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                            onClick={handleContinueConversation}
                        >
                            <BiChat className='text-xl' />
                            <span className='hidden text-sm md:block'>{t('Continue this Conversation')}</span>
                        </button>
                    )}
                    <button
                        className='inline-flex items-center space-x-1 rounded p-1 px-1 ring-2 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                        onClick={() => onCopyLink()}
                    >
                        <BiLink className='text-xl' />
                        <span className='hidden text-sm md:block'>{t('Copy share link')}</span>
                    </button>
                </div>
            </div>
            <div className='flex flex-1 flex-col justify-between'>
                <div className='space-y-2'>
                    <div className='space-y-2'>
                        <p className='text-center font-medium'>{share.title}</p>
                        <Separator className='dark:bg-stone-400' />
                    </div>
                    <div>
                        {content?.map((message: OpenAIMessage, index: number) => {
                            const isUser = message.role === 'user';

                            return (
                                <div className={`flex flex-col space-y-3 p-1 ${isUser ? 'items-end justify-end' : 'items-start justify-start'}`} key={index}>
                                    <div className='flex select-none items-center space-x-2 px-1'>
                                        {isUser ? (
                                            <>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={() => onCopyMessage(index)}
                                                >
                                                    <TbCopy />
                                                    <span>{t('Copy')}</span>
                                                </button>
                                                <p className='text-base font-semibold'>{t('You')}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className='text-base font-semibold'>AI</p>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={() => onCopyMessage(index)}
                                                >
                                                    <TbCopy />
                                                    <span>{t('Copy')}</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div
                                        className={`w-10/12 max-w-7xl space-y-3 rounded-xl p-3 text-sm ${
                                            isUser ? 'bg-sky-500 text-white dark:bg-sky-600' : 'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'
                                        }`}
                                    >
                                        {!isUser ? renderMarkdownMessage(message.content) : renderUserMessage(message.content)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePost;
