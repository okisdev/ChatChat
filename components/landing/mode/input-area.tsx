import { MutableRefObject, useEffect, useRef, useState } from 'react';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import { TbSend } from 'react-icons/tb';
import { IoStopCircle } from 'react-icons/io5';

import TextareaAutosize from 'react-textarea-autosize';

import { Badge } from '@/components/ui/badge';

import { customConfig } from '@/config/custom.config';
import Link from 'next/link';

const InputArea = ({
    sendMessage,
    waitingSystemResponse,
    stopSystemResponseRef,
}: {
    sendMessage: (message: AppMessageProps, indexNumber?: number | null, plugin?: any) => void;
    waitingSystemResponse: boolean;
    stopSystemResponseRef: MutableRefObject<boolean>;
}) => {
    const [userInput, setUserInput] = useState<string>('');

    // commands
    const [showCommands, setShowCommands] = useState<boolean>(false);
    const [filteredCommands, setFilteredCommands] = useState(CommandsList);
    const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);

    const isSendKeyEnter = useAtomValue(store.isSendKeyEnterAtom);

    const enableSystemPrompt = useAtomValue(store.enableSystemPrompt);

    const enablePlugins = useAtomValue(store.enablePluginsAtom);

    const isNoContextConversation = useAtomValue(store.noContextConversationAtom);

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
    };

    const handleSend = () => {
        if (userInput.length === 0) {
            toast.error('Please enter something');
            return;
        }

        let currentPlugin = null;
        let clearedUserInput;

        if (userInput.startsWith('/search ')) {
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
    };

    const handleStopSystemResponse = () => {
        stopSystemResponseRef.current = true;
        setTimeout(() => {
            stopSystemResponseRef.current = false;
        }, 1000);
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
        <div className='mx-auto space-y-2 md:w-6/12'>
            <div className='mx-auto flex w-full items-center justify-between px-1'>
                <div className='flex flex-row items-center space-x-1 overflow-x-auto whitespace-nowrap'>
                    <div className='text-xs'>
                        {isSendKeyEnter ? (
                            <Badge variant='secondary' className='font-normal'>
                                enter
                            </Badge>
                        ) : (
                            <Badge variant='secondary' className='font-normal'>
                                shift + enter
                            </Badge>
                        )}
                    </div>
                    {enableSystemPrompt && (
                        <div className='space-x-1 text-xs font-medium'>
                            <Badge variant='secondary' className='font-normal'>
                                system prompt
                            </Badge>
                        </div>
                    )}
                    {enablePlugins && (
                        <div className='space-x-1 text-xs font-medium'>
                            <Badge variant='secondary' className='font-normal'>
                                plugins
                            </Badge>
                        </div>
                    )}
                    {isNoContextConversation && (
                        <div className='space-x-1 text-xs font-medium'>
                            <Badge variant='secondary' className='font-normal'>
                                no context
                            </Badge>
                        </div>
                    )}
                </div>
                <div>
                    {waitingSystemResponse && (
                        <button className='inline-flex items-center space-x-1 rounded border px-1 text-sm transition duration-200 ease-in-out hover:bg-gray-200' onClick={handleStopSystemResponse}>
                            <IoStopCircle />
                            <span>Stop Generating</span>
                        </button>
                    )}
                </div>
            </div>
            <div className='relative flex'>
                {enablePlugins && showCommands && (
                    <div className='absolute bottom-full left-0 z-10 mb-2 w-full rounded-md border border-gray-200 bg-white shadow-lg'>
                        <ul className='py-1 text-sm'>
                            {filteredCommands.map((command, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleCommandClick(`/${command.name}`)}
                                    className={`cursor-pointer px-3 py-1 hover:bg-gray-100 ${selectedCommandIndex === index ? 'bg-gray-100' : ''}`}
                                >
                                    <p className='font-bold'>/{command.name}</p>
                                    <p className='text-gray-500'>{command.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <TextareaAutosize
                    className='flex h-10 max-h-56 min-h-[40px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900'
                    placeholder={`${isSendKeyEnter ? 'Enter to send.' : 'Shift + Enter to send.'} Change in right top settings. ${enablePlugins ? 'Type / to see available commands.' : ''}`}
                    value={userInput}
                    onChange={handleTextAreaChange}
                    onKeyDown={handleOnKeyDown}
                />
                <div className='absolute bottom-2 right-2 flex items-center justify-center'>
                    <button
                        onClick={handleSend}
                        className='rounded-md bg-transparent p-1 font-bold text-stone-800 transition duration-300 ease-in-out hover:text-stone-400 dark:text-stone-400 dark:hover:text-stone-800'
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
