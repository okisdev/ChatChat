import { useEffect, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { TbCopy, TbAB2, TbSpeakerphone, TbEdit } from 'react-icons/tb';

import { renderUserMessage, renderMarkdownMessage } from '@/utils/app/renderMessage';
import GlobalButton from '@/components/global/button';

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
    const t = useTranslations('');

    const autoSpeech = useAtomValue(store.autoSpeechAtom);

    const ttsConfig = useAtomValue(store.textToSpeechConfigAtom);

    const autoScroll = useAtomValue(store.isAutoScrollAtom);

    const endOfMessageRef = useRef<HTMLDivElement>(null);

    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

    const enableUserMarkdownRender = useAtomValue(store.enableUserMarkdownRenderAtom);

    const serviceProvider = useAtomValue(store.serviceProviderAtom);

    const [isHovered, setIsHovered] = useState<boolean[]>(new Array(conversations.length).fill(false));

    useEffect(() => {
        if (autoScroll && endOfMessageRef.current) {
            endOfMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [autoScroll, conversations, systemResponse]);

    useEffect(() => {
        if (autoSpeech && !isSpeaking && !waitingSystemResponse) {
            onSpeech(conversations.length - 1);
        }
    }, [autoSpeech, conversations]);

    const onCopy = (index: number) => {
        navigator.clipboard.writeText(conversations[index].content);
        toast.success(t('Copied to clipboard'));
    };

    const onSpeech = (index: number) => {
        if (typeof window !== 'undefined') {
            const synth = window.speechSynthesis;
            const voices = synth.getVoices();

            const utterance = new SpeechSynthesisUtterance(conversations[index].content);

            utterance.voice = voices.find((voice) => voice.name === ttsConfig.voice) ?? voices[0];
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
                        <div
                            className='flex flex-col space-y-3 p-1'
                            key={index}
                            onMouseOver={() => {
                                const newIsHovered = [...isHovered];
                                newIsHovered[index] = true;
                                setIsHovered(newIsHovered);
                            }}
                            onMouseOut={() => {
                                const newIsHovered = [...isHovered];
                                newIsHovered[index] = false;
                                setIsHovered(newIsHovered);
                            }}
                            onFocus={() => {
                                const newIsHovered = [...isHovered];
                                newIsHovered[index] = true;
                                setIsHovered(newIsHovered);
                            }}
                            onBlur={() => {
                                const newIsHovered = [...isHovered];
                                newIsHovered[index] = false;
                                setIsHovered(newIsHovered);
                            }}
                        >
                            <div className='flex select-none items-center space-x-2'>
                                <div className='flex items-center justify-center space-x-2'>
                                    <Avatar className='h-6 w-6'>
                                        {!isUser && <AvatarImage src={`/img/${serviceProvider}.png`} alt={serviceProvider} />}
                                        <AvatarFallback>{isUser ? 'Y' : serviceProvider}</AvatarFallback>
                                    </Avatar>
                                    <p className='text-base font-semibold'>{isUser ? t('You') : serviceProvider}</p>
                                </div>
                                {!waitingSystemResponse && isHovered[index] && (
                                    <div className='text-neutral-600 dark:text-neutral-400'>
                                        <GlobalButton className='text-xs' icon={<TbCopy />} text={t('Copy')} onClick={() => onCopy(isSystemPromptEmpty ? index : index + 1)} />
                                        <GlobalButton
                                            className='text-xs'
                                            icon={isUser ? <TbEdit /> : <TbAB2 />}
                                            text={isUser ? t('Edit') : t('Regenerate')}
                                            onClick={isUser ? () => onEdit(index) : () => reGenerate(index)}
                                        />
                                        {!isUser && (
                                            <GlobalButton
                                                className='text-xs'
                                                icon={<TbSpeakerphone />}
                                                text={isSpeaking ? t('Stop') : t('Speech')}
                                                onClick={isSpeaking ? onStopSpeech : () => onSpeech(index)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className='max-w-7xl space-y-3 rounded-xl py-3 text-sm text-black dark:text-stone-200'>
                                {isUser && !enableUserMarkdownRender ? renderUserMessage(message.content) : renderMarkdownMessage(message.content)}
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
