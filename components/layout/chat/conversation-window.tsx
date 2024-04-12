import { LuClipboardCopy, LuLoader2 } from 'react-icons/lu';
import { Message } from 'ai';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { renderMarkdownMessage } from '@/components/layout/message';
import { UserAvatar } from '@/components/layout/user-avatar';

export const ConversationWindow = ({
    messages,
    isLoading,
}: Readonly<{
    messages: Message[];
    isLoading: boolean;
}>) => {
    const t = useTranslations();

    const onCopy = (context: string) => {
        navigator.clipboard.writeText(context);

        toast.success(t('copied'), {
            position: 'top-right',
        });
    };

    return (
        <div className='container mx-auto flex w-10/12 flex-col items-start justify-start gap-3'>
            {messages.map((m) => (
                <div key={m.id}>
                    {m.role == 'user' ? (
                        <div className='flex items-center space-x-1'>
                            <UserAvatar avatarUrl='' avatarFallback='You' />
                            <div className='rounded-lg bg-zinc-100/80 p-2 backdrop-blur-sm dark:bg-neutral-600/70'>
                                <p>{m.content}</p>
                            </div>
                        </div>
                    ) : (
                        <div className='relative'>
                            <div className='rounded-lg bg-zinc-100/80 p-2 backdrop-blur-sm dark:bg-neutral-600/70'>{renderMarkdownMessage(m.content)}</div>
                            {!isLoading && (
                                <div className='absolute -bottom-5 right-2 z-50 space-x-1 rounded-md bg-neutral-300/60 px-1 dark:bg-neutral-500/70'>
                                    <button
                                        onClick={() => onCopy(m.content)}
                                        className='inline-flex items-center space-x-1 rounded-md px-0.5 transition duration-300 ease-in-out hover:bg-neutral-400/30'
                                    >
                                        <LuClipboardCopy size={10} />
                                        <span className='text-xs'>{t('copy')}</span>
                                    </button>
                                    {/* <button className='inline-flex items-center space-x-1 rounded-md px-0.5 transition duration-300 ease-in-out hover:bg-neutral-400/30'>
                                        <RiLoopLeftLine size={10} />
                                        <span className='text-xs'>{t('resend')}</span>
                                    </button> */}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {isLoading && <LuLoader2 className='animate-spin self-start text-neutral-600/90' size={24} />}
        </div>
    );
};
