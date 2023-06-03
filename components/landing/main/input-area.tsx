import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { useTranslations, useLocale } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { IoStopCircle } from 'react-icons/io5';
import { TbSend, TbShare2 } from 'react-icons/tb';
import { MdOutlineKeyboardVoice, MdPause } from 'react-icons/md';

import TextareaAutosize from 'react-textarea-autosize';

import { Badge } from '@/components/ui/badge';

import { customConfig } from '@/config/custom.config';

const InputArea = ({
    conversations,
    conversationID,
    conversationType,
    sendMessage,
    waitingSystemResponse,
    stopSystemResponseRef,
}: {
    conversations: AppMessageProps[];
    conversationID: string;
    conversationType: string;
    sendMessage: (message: AppMessageProps, indexNumber?: number | null, plugin?: any) => void;
    waitingSystemResponse: boolean;
    stopSystemResponseRef: MutableRefObject<boolean>;
}) => {
    const t = useTranslations('landing');

    const locale = useLocale();

    const [userInput, setUserInput] = useState<string>('');

    // commands
    const [showCommands, setShowCommands] = useState<boolean>(false);
    const [filteredCommands, setFilteredCommands] = useState(CommandsList);
    const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);

    const isSendKeyEnter = useAtomValue(store.isSendKeyEnterAtom);

    const enableSystemPrompt = useAtomValue(store.enableSystemPrompt);

    const enablePlugins = useAtomValue(store.enablePluginsAtom);

    const contextModeAtom = useAtomValue(store.contextModeAtom);

    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState<boolean>(false);

    const searchConfig = useAtomValue(store.searchConfigAtom);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, []);

    const handleVoiceInput = () => {
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            toast.error(t('Your browser does not support voice input'));
            return;
        }

        if (listening) {
            SpeechRecognition.stopListening();
            setIsListening(false);
        } else {
            SpeechRecognition.startListening({ language: locale, continuous: true });
            setIsListening(true);
        }
    };

    useEffect(() => {
        if (transcript) {
            setUserInput(transcript);
        }
    }, [transcript]);

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // e.target.style.height = 'inherit';
        // e.target.style.height = e.target.scrollHeight + 'px';
        setUserInput(e.target.value);

        if (e.target.value.startsWith('/')) {
            const matchingCommands = CommandsList.filter((command) => command.name.startsWith(e.target.value.slice(1)));
            setFilteredCommands(matchingCommands);
            setShowCommands(matchingCommands.length > 0);
        } else {
            setShowCommands(false);
        }

        resetTranscript();
    };

    const handleSend = () => {
        if (userInput.length === 0) {
            toast.error(t('Please enter something'));
            return;
        }

        let currentPlugin = null;
        let clearedUserInput;

        if (userInput.startsWith('/search ')) {
            if (!searchConfig.searchAPIKey) {
                toast.error(t('Please set up the search config first'));
                return;
            }
            currentPlugin = 'search';
            clearedUserInput = userInput.split('/search ')[1].trim();
        } else if (userInput.startsWith('/fetch ')) {
            currentPlugin = 'fetch';
            clearedUserInput = userInput.split('/fetch ')[1].trim();
        } else {
            clearedUserInput = userInput;
        }

        const currentMessage: AppMessageProps = { role: 'user', content: clearedUserInput };

        sendMessage(currentMessage, null, currentPlugin);

        setUserInput('');
        resetTranscript();
    };

    const handleStopSystemResponse = () => {
        stopSystemResponseRef.current = true;
        setTimeout(() => {
            stopSystemResponseRef.current = false;
        }, 1000);
    };

    const handleShareConversation = async () => {
        const story = localStorage.getItem(`histories-${conversationType}-${conversationID}`) as string;

        if (!story) {
            toast.error(t('Error: Conversation not found'));
            return;
        }

        const response = await fetch(`/api/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                story,
            }),
        });

        if (!response.ok) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        if (data.type == 'update') {
            navigator.clipboard.writeText(window.location.host + `/s/${conversationID}`);
            toast.success(`${t('Updated the previous share:')} ${conversationID}`);
            return;
        }

        navigator.clipboard.writeText(window.location.host + `/s/${conversationID}`);
        toast.success(`${t('Copied share link:')} ${conversationID}`);
    };

    const handleOnKeyDown = (e: any) => {
        const isShiftKey = e.shiftKey;
        const isEnterKey = e.key === 'Enter';
        const isEscapeKey = e.key === 'Escape';
        const isUpArrow = e.key === 'ArrowUp';
        const isDownArrow = e.key === 'ArrowDown';

        const isSendOnEnter = isSendKeyEnter && isEnterKey && !isShiftKey;
        const isSendOnShiftEnter = !isSendKeyEnter && isEnterKey && isShiftKey;

        if (showCommands && isEnterKey) {
            e.preventDefault();
            handleCommandClick(`/${filteredCommands[selectedCommandIndex].name}`);
        } else if (isSendOnEnter || isSendOnShiftEnter) {
            e.preventDefault();
            handleSend();
        } else if (isEscapeKey) {
            setShowCommands(false);
        } else if (isUpArrow && showCommands) {
            e.preventDefault();
            setSelectedCommandIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        } else if (isDownArrow && showCommands) {
            e.preventDefault();
            setSelectedCommandIndex((prevIndex) => (prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex));
        }
    };

    const handleCommandClick = (command: string) => {
        setUserInput(command + ' ');
        setShowCommands(false);
        setSelectedCommandIndex(0);
    };

    return (
        <div className='space-y-2'>
            <div className='mx-auto flex w-full items-center justify-between px-1'>
                <div className='flex flex-row items-center space-x-1 overflow-x-auto whitespace-nowrap'>
                    <Badge variant='secondary' className='text-xs font-normal'>
                        {isSendKeyEnter ? 'enter' : 'shift + enter'}
                    </Badge>
                    {conversationType === 'chat' && (
                        <>
                            {enableSystemPrompt && (
                                <Badge variant='secondary' className='text-xs font-normal'>
                                    {t('system prompt')}
                                </Badge>
                            )}
                            {enablePlugins && (
                                <Badge variant='secondary' className='text-xs font-normal'>
                                    {t('plugins')}
                                </Badge>
                            )}
                            {contextModeAtom.enable && (
                                <Badge variant='secondary' className='text-xs font-normal'>
                                    {contextModeAtom.contextCount == 0 ? t('no context') : contextModeAtom.contextCount + ' ' + t('contexts')}
                                </Badge>
                            )}
                        </>
                    )}
                </div>
                {waitingSystemResponse ? (
                    <button
                        className='inline-flex items-center space-x-1 rounded border px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:border-stone-500 dark:hover:bg-stone-700'
                        onClick={handleStopSystemResponse}
                    >
                        <IoStopCircle />
                        <span>{t('Stop Generating')}</span>
                    </button>
                ) : (
                    conversations.length > 0 && (
                        <button
                            className='flex items-center space-x-1 rounded border px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200 dark:border-stone-500 dark:hover:bg-stone-700'
                            onClick={handleShareConversation}
                        >
                            <TbShare2 className='dark:text-white' />
                            <p className='inline-flex space-x-1'>
                                <span>{t('Share')}</span>
                                <span className='hidden xl:block'>{t('this conversation')}</span>
                            </p>
                        </button>
                    )
                )}
            </div>
            <div className='relative flex'>
                {enablePlugins && showCommands && (
                    <div className='absolute bottom-full left-0 z-10 mb-2 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800'>
                        <ul className='py-1 text-sm'>
                            {filteredCommands.map((command, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleCommandClick(`/${command.name}`)}
                                    className={`cursor-pointer rounded-lg px-3 py-1 transition duration-200 ease-in-out hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                                        selectedCommandIndex === index ? 'bg-gray-100 dark:bg-neutral-600' : ''
                                    }`}
                                >
                                    <p className='font-medium'>/{command.name}</p>
                                    <p className='text-gray-500 dark:text-stone-400'>{command.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <TextareaAutosize
                    className='flex h-10 max-h-56 min-h-[40px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 pr-16 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900'
                    placeholder={`${t('change send key in settings')} ${enablePlugins ? t('Type / to see available commands') : ''}`}
                    value={userInput}
                    onChange={handleTextAreaChange}
                    onKeyDown={handleOnKeyDown}
                    ref={textAreaRef}
                />
                <div className='absolute bottom-2 right-2 flex items-center justify-center'>
                    <button
                        onClick={handleVoiceInput}
                        className='rounded-md bg-transparent p-1 font-bold text-stone-800 transition duration-300 ease-in-out hover:text-stone-400 dark:text-stone-400 dark:hover:text-stone-500'
                        aria-label='Voice Input Button'
                    >
                        {!isListening ? <MdOutlineKeyboardVoice className='text-lg' /> : <MdPause className='text-lg' />}
                    </button>
                    <button
                        onClick={handleSend}
                        className='rounded-md bg-transparent p-1 font-bold text-stone-800 transition duration-300 ease-in-out hover:text-stone-400 dark:text-stone-400 dark:hover:text-stone-500'
                        aria-label='Send Message Button'
                    >
                        <TbSend className='text-lg' />
                    </button>
                </div>
            </div>
            <div className='text-center'>{customConfig.InputArea.banner}</div>
        </div>
    );
};

export default InputArea;

const CommandsList = [
    { name: 'search', description: 'Allow you to search in internet.' },
    { name: 'fetch', description: 'Fetch Content from website' },
];
