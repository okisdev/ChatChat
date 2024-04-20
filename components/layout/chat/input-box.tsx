'use client';

import { FaStop } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa6';
import Tippy from '@tippyjs/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Textarea } from '@/components/ui/textarea';
import store from '@/hooks/store';

export const InputBox = ({
    input,
    inputRef,
    loading,
    handleInput,
    handleSubmit,
    handleStop,
}: Readonly<{
    input: string;
    inputRef: React.RefObject<HTMLTextAreaElement>;
    loading: boolean;
    handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleStop: (e: React.FormEvent<HTMLFormElement>) => void;
}>) => {
    const router = useRouter();

    const t = useTranslations();

    const [preferences] = useAtom(store.preferencesAtom);
    const [conversationSettings] = useAtom(store.conversationSettingsAtom);

    const [currentUseModel] = useAtom(store.currentUseModelAtom);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (preferences.enterSend) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
            }
        } else if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    return (
        <form className='container relative bottom-5 mx-auto w-full space-y-2 pb-3 md:w-11/12 xl:w-10/12' onSubmit={loading ? handleStop : handleSubmit} onKeyDown={handleKeyDown}>
            <div className='mx-3 flex justify-start space-x-3'>
                <button
                    onClick={() => router.push('?open=settings')}
                    className='cursor-pointer rounded-md bg-neutral-300/60 px-1.5 py-0.5 text-sm backdrop-blur transition duration-300 ease-in-out hover:bg-neutral-400/60 dark:bg-neutral-600/60 dark:text-neutral-200/70 dark:hover:bg-neutral-700/60'
                >
                    {preferences.enterSend ? 'enter' : '⇧ + enter'}
                </button>
                <button
                    onClick={() => router.push('?open=settings')}
                    className='cursor-pointer rounded-md bg-neutral-300/60 px-1.5 py-0.5 text-sm backdrop-blur transition duration-300 ease-in-out hover:bg-neutral-400/60 dark:bg-neutral-600/60 dark:text-neutral-200/70 dark:hover:bg-neutral-700/60'
                >
                    {conversationSettings.systemPrompt ? t('custom_system_prompt') : t('default_system_prompt')}
                </button>
            </div>
            <Textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                placeholder={t('input_box_placeholder')}
                className='resize-none rounded-xl border border-neutral-400/40 outline-none transition duration-200 ease-in-out hover:border-neutral-500/50 focus-visible:border-neutral-800/80 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-neutral-600/60 dark:bg-neutral-600/70 dark:text-neutral-200/70 dark:placeholder:text-neutral-400/60 dark:hover:border-neutral-600/60 dark:focus-visible:border-neutral-800/80 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0'
            />
            <div className='absolute bottom-5 right-10 flex space-x-3'>
                {loading ? (
                    <Tippy content={t('stop_message')}>
                        <button className='flex cursor-pointer items-center justify-center rounded-xl border p-2 transition duration-300 ease-in-out hover:bg-neutral-300/30'>
                            <FaStop />
                        </button>
                    </Tippy>
                ) : (
                    <Tippy content={input.length > 0 ? t('send_message') : t('enter_something_to_send')}>
                        <button
                            className={`flex items-center justify-center rounded-xl border p-2 transition duration-300 ease-in-out hover:bg-neutral-300/30 ${input.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        >
                            <FaArrowUp />
                        </button>
                    </Tippy>
                )}
            </div>
        </form>
    );
};
