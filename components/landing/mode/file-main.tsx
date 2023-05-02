'use client';

import { useRef, useState } from 'react';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom, useAtomValue } from 'jotai';

import { GrCircleInformation } from 'react-icons/gr';
import { AiOutlineCloudUpload } from 'react-icons/ai';

import InputArea from '@/components/landing/mode/input-area';
import MainContent from '@/components/landing/mode/chat-content';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import generateHash from '@/utils/app/generateHash';
import { renderMarkdownMessage, renderUserMessage } from '@/utils/app/renderMessage';

import { setLocalStorage } from '@/hooks/setLocalStorage';

const FileMain = () => {
    const [conversations, setConversations] = useState<OpenAIMessage[]>([]);
    const [conversationID, setConversationID] = useState<string>(generateHash(16));

    const clearedConversation = conversations.slice(3);

    const [systemResponse, setSystemResponse] = useState<string>('');
    const [waitingSystemResponse, setWaitingSystemResponse] = useState<boolean>(false);
    const stopSystemResponseRef = useRef<boolean>(false);

    const [fileName, setFileName] = useState<string>('');
    const [fileAbstract, setFileAbstract] = useState<string>('');

    const [hasError, setHasError] = useState(false);

    const [fileContent, setFileContent] = useState<string>('');

    // Service Provider
    const serviceProvider = useAtomValue(store.serviceProviderAtom);

    // OpenAI
    const openAIConfig = useAtomValue(store.openAIConfigAtom);

    // Azure
    const azureConfig = useAtomValue(store.azureConfigAtom);

    // Team
    const teamConfig = useAtomValue(store.teamConfigAtom);

    // Hugging Face
    const huggingFaceConfig = useAtomValue(store.huggingFaceConfigAtom);

    // Cohere
    const cohereConfig = useAtomValue(store.cohereConfigAtom);

    // Claude
    const claudeConfig = useAtomValue(store.claudeConfigAtom);

    const enableStreamMessages = useAtomValue(store.enableStreamMessagesAtom);

    const handleFileUpload = async (event: any) => {
        let file = null;

        if (event.type == 'drop') {
            file = event.dataTransfer.files?.[0];
        } else {
            file = event.target.files?.[0];
        }

        const fileSize = file?.size;
        // const fileType = file?.type;
        const fileName = file?.name;

        if (!file) {
            return;
        }

        if (fileSize > 524288) {
            toast.error('File size must be less than 512KB');
            return;
        }

        const allowedFileExtensions = ['txt', 'doc', 'docx', 'pdf', 'md'];
        const fileExtension = file.name.split('.').pop();

        if (!allowedFileExtensions.includes(fileExtension)) {
            toast.error('File extension is not allowed');
            return;
        }

        setFileName(file?.name);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/message/file', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error('Error when uploading file: ' + data.error);
                return;
            }

            setFileContent(data.text);

            const messagesPayload: AppMessageProps[] = [
                {
                    role: 'system',
                    content: `You need to analyze the following file (${file?.name}) content.\n\n`,
                },
                {
                    role: 'user',
                    content: data.text.replace(/\n/g, '\n'),
                },
            ];

            setConversations(messagesPayload);

            let configPayload;

            switch (serviceProvider) {
                case 'OpenAI':
                    configPayload = {
                        apiKey: openAIConfig.apiKey,
                        apiEndpoint: openAIConfig.apiEndpoint,
                        apiModel: openAIConfig.apiModel,
                        apiTemperature: openAIConfig.apiTemperature,
                    };
                    break;
                case 'Azure':
                    configPayload = {
                        apiKey: azureConfig.apiKey,
                        apiEndpoint: azureConfig.apiEndpoint,
                        apiModel: azureConfig.apiModel,
                        apiTemperature: azureConfig.apiTemperature,
                        apiDeploymentName: azureConfig.apiDeploymentName,
                    };
                case 'Team':
                    configPayload = {
                        accessCode: teamConfig.accessCode,
                    };
                    break;
                case 'Hugging Face':
                    configPayload = {
                        model: huggingFaceConfig.huggingFaceModel,
                        accessToken: huggingFaceConfig.accessToken,
                    };
                    break;
                case 'Cohere':
                    configPayload = {
                        model: cohereConfig.model,
                        apiKey: cohereConfig.apiKey,
                    };
                    break;
                case 'Claude':
                    configPayload = {
                        model: claudeConfig.apiModel,
                        apiKey: claudeConfig.apiKey,
                        apiTemperature: claudeConfig.apiTemperature,
                    };
                default:
                    break;
            }

            const AIResponse = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stream: enableStreamMessages,
                    serviceProvider: serviceProvider,
                    config: configPayload,
                    messages: messagesPayload,
                }),
            });

            if (!AIResponse.ok) {
                setHasError(true);
                toast.error('Something went wrong');
                return;
            }

            const AIData = AIResponse.body;

            if (!AIData) {
                setHasError(true);
                toast.error('Something went wrong');
                return;
            }

            setFileAbstract('');

            const reader = AIData.getReader();
            const decoder = new TextDecoder();

            let done = false;
            let currentResponseMessage = '';

            while (!done) {
                if (stopSystemResponseRef.current) {
                    done = true;
                    break;
                }

                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const chunkValue = decoder.decode(value);

                setFileAbstract((prev) => prev + chunkValue);
                currentResponseMessage += chunkValue;
            }

            setConversations([...messagesPayload, { role: 'assistant', content: currentResponseMessage }]);

            setLocalStorage(`histories-file-${conversationID}`, {
                id: conversationID,
                type: 'file',
                title: fileName,
                messages: [...messagesPayload, { role: 'assistant', content: currentResponseMessage }],
                timestamp: new Date().getTime(),
            });

            const updateEvent = new CustomEvent('localStorageUpdated');
            window.dispatchEvent(updateEvent);
        } catch (error) {
            console.error(error);
            return;
        }
    };

    const handleMessageSend = async (message: AppMessageProps, indexNumber?: number) => {
        setWaitingSystemResponse(true);

        setConversations((prev) => [...prev, message]);

        let configPayload;

        switch (serviceProvider) {
            case 'OpenAI':
                configPayload = {
                    apiKey: openAIConfig.apiKey,
                    apiEndpoint: openAIConfig.apiEndpoint,
                    apiModel: openAIConfig.apiModel,
                    apiTemperature: openAIConfig.apiTemperature,
                };
                break;
            case 'Azure':
                configPayload = {
                    apiKey: azureConfig.apiKey,
                    apiEndpoint: azureConfig.apiEndpoint,
                    apiModel: azureConfig.apiModel,
                    apiTemperature: azureConfig.apiTemperature,
                    apiDeploymentName: azureConfig.apiDeploymentName,
                };
            case 'Team':
                configPayload = {
                    accessCode: teamConfig.accessCode,
                };
                break;
            case 'Hugging Face':
                configPayload = {
                    model: huggingFaceConfig.huggingFaceModel,
                    accessToken: huggingFaceConfig.accessToken,
                };
                break;
            case 'Cohere':
                configPayload = {
                    model: cohereConfig.model,
                    apiKey: cohereConfig.apiKey,
                };
                break;
            case 'Claude':
                configPayload = {
                    model: claudeConfig.apiModel,
                    apiKey: claudeConfig.apiKey,
                    apiTemperature: claudeConfig.apiTemperature,
                };
            default:
                break;
        }

        let messagesPayload: AppMessageProps[] = [];

        messagesPayload = [...conversations, message];

        if (indexNumber && indexNumber >= 0) {
            setConversations((prev) => prev.slice(0, indexNumber));
            messagesPayload = messagesPayload.slice(0, indexNumber);
        }

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                stream: enableStreamMessages,
                serviceProvider: serviceProvider,
                config: configPayload,
                messages: messagesPayload,
            }),
        });

        if (!response.ok) {
            setWaitingSystemResponse(false);
            setHasError(true);
            toast.error('Something went wrong');
            return;
        }

        const data = response.body;

        if (!data) {
            setWaitingSystemResponse(false);
            setHasError(true);
            toast.error('Something went wrong');
            return;
        }

        setSystemResponse('');
        setConversations((prev) => [...prev, { role: 'assistant', content: '' }]);

        const reader = data.getReader();
        const decoder = new TextDecoder();

        let done = false;
        let currentResponseMessage = '';

        while (!done) {
            if (stopSystemResponseRef.current) {
                done = true;
                break;
            }

            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            const chunkValue = decoder.decode(value);

            setSystemResponse((prev) => prev + chunkValue);
            currentResponseMessage += chunkValue;
        }

        setConversations((prev) => [
            ...prev.slice(0, -1),
            {
                role: 'assistant',
                content: currentResponseMessage,
            },
        ]);

        setWaitingSystemResponse(false);

        setLocalStorage(`histories-chat-${conversationID}`, {
            id: conversationID,
            type: 'file',
            title: fileName,
            messages: [
                ...conversations,
                message,
                {
                    role: 'assistant',
                    content: currentResponseMessage,
                },
            ],
            timestamp: new Date().getTime(),
        });

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
    };

    return (
        <main className='m-2 flex h-[calc(100%-65px)] flex-grow flex-col space-y-3 rounded-lg bg-white/90 px-4 py-2 shadow backdrop-blur transition-transform duration-500 dark:bg-gray-800 md:h-[calc(100%-80px)] md:p-3'>
            <div className='flex h-[calc(100%-80px)] justify-center space-x-3 overflow-auto'>
                {fileAbstract == '' && (
                    <div className='flex w-96 items-center justify-center'>
                        <label
                            onChange={handleFileUpload}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.dataTransfer.dropEffect = 'copy';
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFileUpload(e);
                            }}
                            htmlFor='dropzone-file'
                            className='dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition duration-200 ease-in-out hover:bg-gray-100 dark:border-gray-600 dark:bg-[#333] dark:hover:border-gray-500 dark:hover:bg-gray-600'
                        >
                            <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                                <AiOutlineCloudUpload className='text-4xl' />
                                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                                    <span className='font-semibold'>Click to upload</span> or drag and drop a file
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Any file but images</p>
                            </div>
                            <input id='dropzone-file' type='file' className='hidden' draggable />
                        </label>
                    </div>
                )}
                {fileAbstract != '' && (
                    <div className='flex flex-col space-y-3 md:flex-row md:space-x-3'>
                        <div className='overflow-auto text-sm md:w-4/12'>
                            <div className='flex items-center justify-center space-x-2 font-medium'>
                                <p>{fileName}</p>
                                <Popover>
                                    <PopoverTrigger>
                                        <GrCircleInformation />
                                    </PopoverTrigger>
                                    <PopoverContent className='max-h-96 overflow-auto text-sm'>{renderUserMessage(fileContent)}</PopoverContent>
                                </Popover>
                            </div>
                            <div>{renderMarkdownMessage(fileAbstract)}</div>
                        </div>
                        <div className='overflow-auto md:w-8/12'>
                            <MainContent
                                systemResponse={systemResponse}
                                waitingSystemResponse={waitingSystemResponse}
                                conversations={clearedConversation}
                                reGenerate={(index: number) => {
                                    handleMessageSend(conversations[index + 3], index + 3);
                                }}
                                onEdit={(index: number) => {
                                    const newContent = prompt('Edit message:', clearedConversation[index].content);

                                    if (newContent !== null) {
                                        const newMessage: AppMessageProps = {
                                            role: 'user',
                                            content: newContent,
                                        };

                                        setConversations(conversations.slice(0, index + 3));

                                        handleMessageSend(newMessage);
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            {fileAbstract != '' && (
                <InputArea
                    sendMessage={(message) => {
                        handleMessageSend(message);
                    }}
                    waitingSystemResponse={waitingSystemResponse}
                    stopSystemResponseRef={stopSystemResponseRef}
                />
            )}
        </main>
    );
};

export default FileMain;
