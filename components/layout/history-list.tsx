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

    return (
        <div className='flex flex-col'>
            {conversations?.filter((conversation: Conversation) => conversation.conversation.length > 0).length === 0 ? (
                <div>
                    <p className='text-center text-sm text-neutral-500 dark:text-neutral-400'>{t('no_conversations')}</p>
                </div>
            ) : (
                <div className='space-y-1'>
                    <div>{/* show the date of conversations */}</div>
                    {conversations
                        ?.filter((conversation: Conversation) => conversation.conversation.length > 0)
                        .toSorted((a, b) => {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        })
                        .map((conversation: Conversation) => (
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
                                    <PiChatTeardropBold size={16} />
                                    <p className='truncate text-sm'>{conversation.conversation[0].content}</p>
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
            )}
        </div>
    );
};
