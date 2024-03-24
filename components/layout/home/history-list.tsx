import { Conversation } from '@/types/conversation';
import { useRouter } from 'next/navigation';

export const HistoryList = ({ conversations, setConversations }: { conversations: Conversation[] | null; setConversations: (conversations: Conversation[]) => void }) => {
    const router = useRouter();

    const deleteConversation = (id: string) => {
        const conversations = localStorage.getItem('conversations');

        if (conversations) {
            const parsedConversations = JSON.parse(conversations);

            const updatedConversations = parsedConversations.filter((conversation: Conversation) => conversation.id !== id);

            setConversations(updatedConversations);
        }
    };

    return (
        <div className='flex flex-col gap-3'>
            {conversations
                ?.toSorted((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .map((conversation: Conversation) => (
                    <button
                        key={conversation.id}
                        className='flex w-full flex-col items-center space-x-3 space-y-1 rounded-md bg-white px-3 py-2 shadow transition duration-300 ease-in-out hover:bg-white/80 hover:shadow-md'
                        onClick={() => {
                            router.push(`?chat=${conversation.id}`);
                        }}
                    >
                        <div className='w-full'>
                            <p className='truncate text-ellipsis text-sm font-semibold'>{conversation.id}</p>
                        </div>
                        <div className='flex w-full flex-row items-center justify-start space-x-3'>
                            <p className='text-xs'>{conversation.conversation.length}</p>
                            <p className='text-xs'>
                                {new Date(conversation.createdAt).toLocaleString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: false,
                                })}
                            </p>
                            <button
                                className='text-xs hover:underline'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteConversation(conversation.id);
                                }}
                            >
                                delete
                            </button>
                        </div>
                    </button>
                ))}
        </div>
    );
};
