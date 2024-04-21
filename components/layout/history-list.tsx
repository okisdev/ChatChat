import { useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { PiChatTeardropBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';
import { Conversation } from '@/types/conversation';

export const HistoryList = ({ conversations, setConversations }: { conversations: Conversation[] | null; setConversations: (conversations: Conversation[]) => void }) => {
    const router = useRouter();

    const t = useTranslations();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const deleteConversation = (id: string) => {
        const conversations = localStorage.getItem('conversations');

        if (conversations) {
            const parsedConversations = JSON.parse(conversations);

            const updatedConversations = parsedConversations.filter((conversation: Conversation) => conversation.id !== id);

            setConversations(updatedConversations);
        }
    };

    const getDateHeader = (dateString: string) => {
        const today = new Date();
        const date = new Date(dateString);

        const dayDiff = (today.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24);
        if (dayDiff < 1) return t('today');
        if (dayDiff < 2) return t('yesterday');
        return t('previous_7_days');
    };

    const groupedConversations = conversations?.reduce((acc: Record<string, Conversation[]>, conversation: Conversation) => {
        const header = getDateHeader(conversation.createdAt);
        if (!acc[header]) {
            acc[header] = [];
        }
        acc[header].push(conversation);
        return acc;
    }, {});

    return (
        <div className='flex flex-col gap-3'>
            {conversations?.filter((conversation: Conversation) => conversation.conversation.length > 0).length === 0 ? (
                <div>
                    <p className='text-center text-sm text-neutral-500 dark:text-neutral-400'>{t('no_conversations')}</p>
                </div>
            ) : (
                Object.keys(groupedConversations || {})
                    .sort((a, b) => {
                        if (a === t('today')) return -1;
                        if (b === t('today')) return 1;
                        if (a === t('yesterday')) return -1;
                        if (b === t('yesterday')) return 1;
                        return 0;
                    })
                    .map((dateHeader) => (
                        <div key={dateHeader} className='space-y-1'>
                            <h2 className='text-sm text-neutral-500 dark:text-neutral-400'>{dateHeader}</h2>
                            {groupedConversations?.[dateHeader].map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className='group flex w-full flex-row items-center justify-between rounded-md border border-neutral-200/90 bg-white/90 px-2 py-1.5 shadow-sm shadow-inherit transition duration-300 ease-in-out hover:bg-white/80 hover:shadow-md dark:border-neutral-600/80 dark:bg-neutral-600/70 dark:hover:border-neutral-600/70 dark:hover:bg-neutral-600/80 hover:dark:bg-neutral-600/80 dark:hover:shadow-md'
                                >
                                    <button
                                        onClick={() => {
                                            router.push(`?chat=${conversation.id}`);
                                        }}
                                        className='flex w-10/12 items-center justify-start space-x-2 transition duration-300 ease-in-out hover:underline'
                                    >
                                        <PiChatTeardropBold size={16} className='w-1/12' />
                                        <p className='w-9/12 truncate text-start text-sm'>{conversation.conversation[0]?.content}</p>
                                    </button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className='cursor-pointer outline-none'>
                                            <HiDotsHorizontal className={`${isDropdownOpen ? 'block' : 'hidden group-hover:block'}`} />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteConversation(conversation.id);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className='text-red-500 dark:text-red-400'
                                            >
                                                {t('delete')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </div>
                    ))
            )}
        </div>
    );
};
