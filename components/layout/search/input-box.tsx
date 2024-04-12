'use client';

import { FaArrowUp } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Switch } from '@/components/ui/custom/switch';
import { Textarea } from '@/components/ui/custom/textarea';
import store from '@/hooks/store';

export const InputBox = ({
    input,
    inputRef,
    setInput,
    handleSubmit,
}: Readonly<{
    input: string;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    setInput: (value: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}>) => {
    const router = useRouter();

    const t = useTranslations();

    const [preferences] = useAtom(store.preferencesAtom);
    const [conversationSettings] = useAtom(store.conversationSettingsAtom);

    const [currentUseModel] = useAtom(store.currentUseModelAtom);

    const [isProSearch, setIsProSearch] = useAtom(store.isProSearchAtom);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (preferences.enterSend) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as React.FormEvent<HTMLFormElement>);
            }
        } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as React.FormEvent<HTMLFormElement>);
        }
    };

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className='relative flex w-full items-center'>
            <Textarea
                ref={inputRef}
                name='input'
                placeholder={t('ask_anything_here')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='h-28 resize-none rounded-xl border border-neutral-400/40 outline-none transition duration-200 ease-in-out hover:border-neutral-500/50 focus-visible:border-neutral-800/80 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-neutral-600/60 dark:bg-neutral-600/70 dark:text-neutral-200/70 dark:placeholder:text-neutral-400/60 dark:hover:border-neutral-600/60 dark:focus-visible:border-neutral-800/80 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0'
            />
            <div className='absolute bottom-2 right-2 flex flex-row space-x-6'>
                <Tippy content={t('enhanced_search_ability')}>
                    <div className='flex items-center justify-center space-x-2'>
                        <p>{t('pro')}</p>
                        <Switch
                            checked={isProSearch}
                            onCheckedChange={() => {
                                setIsProSearch(!isProSearch);
                            }}
                        />
                    </div>
                </Tippy>
                <Tippy content={input.length > 0 ? t('send_question') : t('enter_something_to_send')}>
                    <button
                        type='submit'
                        className={`flex items-center justify-center rounded-xl border p-2 transition duration-300 ease-in-out hover:bg-neutral-300/30 ${input.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                        <FaArrowUp />
                    </button>
                </Tippy>
            </div>
        </form>
    );
};
