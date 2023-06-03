import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import { TbCopy, TbAB2, TbSpeakerphone, TbEdit } from 'react-icons/tb';

import { renderUserMessage, renderMarkdownMessage } from '@/utils/app/renderMessage';

const MainContent = ({
    systemResponse,
    waitingSystemResponse,
    conversations,
    reGenerate,
    onEdit,
    isSystemPromptEmpty,
}: {
    systemResponse: string;
    waitingSystemResponse: boolean;
    conversations: AppMessageProps[];
    reGenerate: (index: number) => void;
    onEdit: (index: number) => void;
    isSystemPromptEmpty: boolean;
}) => {
    const t = useTranslations('landing');

    const ttsConfig = useAtomValue(store.textToSpeechConfigAtom);

    const endOfMessageRef = useRef<HTMLDivElement>(null);

    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    useEffect(() => {
        if (endOfMessageRef.current) {
            endOfMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations, systemResponse]);

    const onCopy = (index: number) => {
        navigator.clipboard.writeText(conversations[index].content);
        toast.success(t('Copied to clipboard'));
    };

    const onSpeech = (index: number) => {
        if (typeof window !== 'undefined') {
            const synth = window.speechSynthesis;
            const voices = synth.getVoices();

            const utterance = new SpeechSynthesisUtterance(conversations[index].content);

            utterance.voice = voices.find((voice) => voice.name === ttsConfig.voice) || voices[0];
            utterance.rate = ttsConfig.speed;
            utterance.pitch = ttsConfig.pitch;
            utterance.onend = () => {
                setIsSpeaking(false);
            };

            synth.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const onStopSpeech = () => {
        if (typeof window !== 'undefined') {
            const synth = window.speechSynthesis;
            synth.cancel();
        }
        setIsSpeaking(false);
    };

    return (
        <div className='mx-auto space-y-3 overflow-auto'>
            {conversations
                .filter((m) => m.role != 'system')
                .map((message, index) => {
                    const isUser = message.role === 'user';
                    const isLast = index === conversations.filter((m) => m.role != 'system').length - 1;

                    let streamResponse = null;

                    if (isLast && !isUser && waitingSystemResponse) {
                        streamResponse = renderMarkdownMessage(systemResponse);
                    }

                    return (
                        <div className={`flex flex-col space-y-3 p-1 ${isUser ? 'items-end justify-end' : 'items-start justify-start'}`} key={index}>
                            <div className='flex select-none items-center space-x-2 px-1'>
                                {isUser ? (
                                    <>
                                        {!waitingSystemResponse && (
                                            <>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={() => onEdit(index)}
                                                >
                                                    <TbEdit />
                                                    <span>{t('Edit')}</span>
                                                </button>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={() => onCopy(isSystemPromptEmpty ? index : index + 1)}
                                                >
                                                    <TbCopy />
                                                    <span>{t('Copy')}</span>
                                                </button>
                                            </>
                                        )}
                                        <p className='text-base font-semibold'>{t('You')}</p>
                                    </>
                                ) : (
                                    <>
                                        <p className='text-base font-semibold'>AI</p>
                                        {!waitingSystemResponse && (
                                            <>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={() => onCopy(isSystemPromptEmpty ? index : index + 1)}
                                                >
                                                    <TbCopy />
                                                    <span>{t('Copy')}</span>
                                                </button>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={() => reGenerate(index)}
                                                >
                                                    <TbAB2 />
                                                    <span>{t('Regenerate')}</span>
                                                </button>
                                                <button
                                                    className='inline-flex items-center space-x-0.5 rounded px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                                                    onClick={isSpeaking ? onStopSpeech : () => onSpeech(index)}
                                                >
                                                    <TbSpeakerphone />
                                                    <span>{isSpeaking ? t('Stop') : t('Speech')}</span>
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div
                                className={`w-10/12 max-w-7xl space-y-3 rounded-xl p-3 text-sm ${
                                    isUser ? 'bg-sky-500 text-white dark:bg-sky-600' : 'bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white'
                                }`}
                            >
                                {!isUser ? renderMarkdownMessage(message.content) : renderUserMessage(message.content)}
                                {streamResponse}
                            </div>
                        </div>
                    );
                })}
            <div ref={endOfMessageRef} />
        </div>
    );
};

export default MainContent;
