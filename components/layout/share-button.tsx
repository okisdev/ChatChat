import { LuShare } from 'react-icons/lu';
import Tippy from '@tippyjs/react';
import { saveAs } from 'file-saver';
import { useAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/custom/dropdown-menu';
import store from '@/hooks/store';
import { Conversation } from '@/types/conversation';

export const ShareButton = () => {
    const t = useTranslations();

    const chat = useSearchParams().get('chat');

    const [conversations] = useAtom(store.conversationsAtom);

    const formatAsMarkdown = (conversation: Conversation) => {
        return conversation.conversation.map((message) => `**${message.role}:** ${message.content}`).join('\n\n');
    };

    const convertTextToImage = (text: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = 800;
        canvas.height = 600;

        if (context) {
            context.fillStyle = '#000';
            context.font = '16px Arial';

            const lines = text.split('\\n');
            let y = 20;
            lines.forEach((line) => {
                context.fillText(line, 10, y);
                y += 30;
            });
        }

        return canvas.toDataURL('image/png');
    };

    const onShareAsMarkdown = () => {
        const conversation = conversations?.find((conversation) => conversation.id === chat);

        if (!conversation) {
            toast.error(t('conversation_not_found'), {
                position: 'top-right',
            });
            return;
        }

        const markdownContent = formatAsMarkdown(conversation);
        const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, `conversation-${chat}.md`);
    };

    const onShareAsImage = () => {
        const conversation = conversations?.find((conversation) => conversation.id === chat);

        if (!conversation) {
            toast.error(t('conversation_not_found'), {
                position: 'top-right',
            });
            return;
        }

        const markdownContent = formatAsMarkdown(conversation);
        const imageData = convertTextToImage(markdownContent);

        const link = document.createElement('a');
        link.download = `conversation-${chat}.png`;
        link.href = imageData;
        link.click();
    };

    return (
        <DropdownMenu>
            <Tippy content={t('share_conversation')}>
                <DropdownMenuTrigger className='cursor-pointer rounded-md p-2 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60 dark:hover:bg-neutral-500/40'>
                    <LuShare />
                </DropdownMenuTrigger>
            </Tippy>
            <DropdownMenuContent>
                <DropdownMenuItem className='cursor-pointer' onClick={onShareAsMarkdown}>
                    Markdown
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' onClick={onShareAsImage}>
                    {t('image')}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
