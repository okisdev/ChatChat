import UserAvatar from '@/components/user-avatar';
import { Message } from 'ai';
import { LuLoader2 } from 'react-icons/lu';

interface ConversationProps {
    messages: Message[];
    isLoading: boolean;
}

export function ConversationWindow(props: Readonly<ConversationProps>) {
    const { messages, isLoading } = props;

    return (
        <div className='container mx-auto flex w-10/12 flex-col items-start justify-start gap-3 overflow-auto'>
            {messages.map((m) => (
                <div key={m.id}>
                    {m.role == 'user' ? (
                        <div className='flex items-center space-x-1'>
                            <UserAvatar avatarUrl='' avatarFallback='AN' />
                            <div className='rounded-lg bg-zinc-100/80 p-2 backdrop-blur-sm'>
                                <p>{m.content}</p>
                            </div>
                        </div>
                    ) : (
                        <div className='rounded-lg bg-zinc-100/80 p-2 backdrop-blur-sm'>
                            <p>{m.content}</p>
                        </div>
                    )}
                </div>
            ))}
            {isLoading && <LuLoader2 className='animate-spin self-start text-stone-600/90' size={24} />}
        </div>
    );
}
