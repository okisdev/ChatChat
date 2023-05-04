'use client';

import { useEffect, useState, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom, useAtomValue } from 'jotai';

import { setLocalStorage } from '@/hooks/setLocalStorage';

import ContentHead from '@/components/landing/mode/chat-head';
import InputArea from '@/components/landing/mode/input-area';
import MainContent from '@/components/landing/mode/chat-content';

import ModeSettings from '@/components/landing/mode/settings';

import generateHash from '@/utils/app/generateHash';

import { getSearchFromGoogleProgrammableSearchEngine } from '@/utils/plugins/search';
import { fetchContent } from '@/utils/plugins/fetch_content';

import { User } from '.prisma/client';

interface UserSettingsProps {
    user: User;
}

const ChatMain = () => {
    const searchParams = useSearchParams();

    const share = searchParams?.get('share');

    // Conversation Config
    const isNoContextConversation = useAtomValue(store.noContextConversationAtom);
    const enableStreamMessages = useAtomValue(store.enableStreamMessagesAtom);
    const enablePlugin = useAtomValue(store.enablePluginsAtom);

    const [systemPromptContent, setSystemPromptContent] = useAtom(store.systemPromptContentAtom);

    const [systemResponse, setSystemResponse] = useState<string>('');
    const [waitingSystemResponse, setWaitingSystemResponse] = useState<boolean>(false);
    const stopSystemResponseRef = useRef<boolean>(false);

    const [hasError, setHasError] = useState<boolean>(false);

    const [conversations, setConversations] = useState<AppMessageProps[]>([]);
    const [conversationID, setConversationID] = useState<string>(generateHash(16));

    const [chatTitle, setChatTitle] = useState<string>('Chat');
    const [chatTitleResponse, setChatTitleResponse] = useState<string>('');

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

    // User Settings
    const [userSettings, setUserSettings] = useState<UserSettingsProps | null>(null);

    // Plugins

    // Search
    const searchPluginConfig = useAtomValue(store.searchConfigAtom);

    useEffect(() => {
        if (!userSettings) {
            const getUserInfo = async () => {
                const response = await fetch('/api/user/info', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (!data) {
                    return;
                }

                setUserSettings(data);
            };

            getUserInfo();
        }
    }, [userSettings]);

    const enableSync = userSettings?.user.allowRecordCloudSync;

    useEffect(() => {
        if (share) {
            setConversationID(share);

            const chatValue = localStorage.getItem('histories-chat-' + share);

            if (!chatValue) {
                return;
            }

            const chatHistory = JSON.parse(chatValue);

            setChatTitle(chatHistory.title);
            setConversations(chatHistory.messages);
        }
    }, [share]);

    const handleMessageSend = async (message: AppMessageProps, indexNumber?: number | null, plugin?: PluginProps | null) => {
        setWaitingSystemResponse(true);

        if (!isNoContextConversation) {
            systemPromptContent == '' || conversations.find((c) => c.role === 'system')
                ? setConversations((prev) => [...prev, message])
                : setConversations((prev) => [{ role: 'system', content: systemPromptContent }, ...prev, message]);
        } else {
            systemPromptContent == '' || conversations.find((c) => c.role === 'system') ? setConversations([message]) : setConversations([{ role: 'system', content: systemPromptContent }, message]);
        }

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
                break;
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
                break;
            default:
                break;
        }

        let pluginResponse = null;
        let pluginPrompt = null;

        if (plugin && enablePlugin) {
            switch (plugin) {
                case 'search':
                    if (searchPluginConfig.searchAPIKey == '' || searchPluginConfig.searchEngineID == '') {
                        toast.error('Please set up your Google Programmable Search Engine API Key and Search Engine ID in the settings page.');
                        return;
                    }
                    pluginResponse = await getSearchFromGoogleProgrammableSearchEngine(searchPluginConfig.searchAPIKey, searchPluginConfig.searchEngineID, message.content);
                    pluginPrompt =
                        'I search ' +
                        message.content +
                        ' for you. Please me let me know what is the search result in details. The following is the search result: \n\n\n' +
                        JSON.stringify(pluginResponse);
                    break;
                case 'fetch':
                    const fetchContent = await fetch('/api/plugins/fetch?url=' + message.content).then((res) => res.json());
                    pluginResponse = fetchContent.content;
                    pluginPrompt =
                        'I fetch content from ' +
                        message.content +
                        ' for you. Please let me know what is the main content of this link in details. The following is the content: \n\n\n' +
                        pluginResponse;
                    break;
                default:
                    break;
            }
        }

        let messagesPayload: AppMessageProps[] = [];

        if (plugin && enablePlugin && pluginResponse && pluginPrompt) {
            if (!isNoContextConversation) {
                systemPromptContent == '' || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [...conversations, { role: 'system', content: pluginPrompt }, message])
                    : (messagesPayload = [{ role: 'system', content: systemPromptContent }, ...conversations, { role: 'system', content: pluginPrompt }, message]);
            } else {
                systemPromptContent == '' || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [{ role: 'system', content: pluginPrompt }, message])
                    : (messagesPayload = [{ role: 'system', content: systemPromptContent }, { role: 'system', content: pluginPrompt }, message]);
            }
        } else {
            if (!isNoContextConversation) {
                systemPromptContent == '' || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [...conversations, message])
                    : (messagesPayload = [{ role: 'system', content: systemPromptContent }, ...conversations, message]);
            } else {
                systemPromptContent == '' || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [message])
                    : (messagesPayload = [{ role: 'system', content: systemPromptContent }, message]);
            }
        }

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

        if (!isNoContextConversation) {
            if (chatTitle == 'Chat') {
                let currentChatTitle = '';
                const chatTitlePayload: AppMessageProps[] = [{ role: 'system', content: `Please suggest a title for "${message.content}".` }];

                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        stream: enableStreamMessages,
                        serviceProvider: serviceProvider,
                        config: configPayload,
                        messages: chatTitlePayload,
                    }),
                });

                if (!response.ok) {
                    return;
                }

                const data = response.body;

                if (!data) {
                    return;
                }

                setChatTitleResponse('');

                const reader = data.getReader();
                const decoder = new TextDecoder();

                let done = false;

                while (!done) {
                    const { value, done: readerDone } = await reader.read();
                    done = readerDone;
                    const chunkValue = decoder.decode(value);

                    setChatTitleResponse((prev) => prev + chunkValue);
                    currentChatTitle += chunkValue;
                }

                setChatTitle(currentChatTitle);

                setLocalStorage(`histories-chat-${conversationID}`, {
                    id: conversationID,
                    type: 'chat',
                    title: currentChatTitle,
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
            } else {
                setLocalStorage(`histories-chat-${conversationID}`, {
                    id: conversationID,
                    type: 'chat',
                    title: chatTitle,
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
            }

            if (enableSync) {
                const response = await fetch('/api/user/record', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: conversationID,
                        type: 'chat',
                        title: chatTitle,
                        messages: [
                            ...conversations,
                            message,
                            {
                                role: 'assistant',
                                content: currentResponseMessage,
                            },
                        ],
                        timestamp: new Date().getTime(),
                    }),
                });

                if (!response.ok) {
                    return;
                }
            }

            const updateEvent = new CustomEvent('localStorageUpdated');
            window.dispatchEvent(updateEvent);
        }
    };

    return (
        <main className='m-2 flex h-[calc(100%-65px)] flex-grow flex-col rounded-lg bg-white/90 px-4 py-2 shadow backdrop-blur transition-transform duration-500 dark:bg-gray-800 md:h-[calc(100%-80px)] md:p-3'>
            <div className='flex h-full w-full flex-col justify-between space-y-3'>
                {conversations.length > 0 && <ContentHead chatTitle={chatTitle} chatTitleResponse={chatTitleResponse} waitingSystemResponse={waitingSystemResponse} conversations={conversations} />}
                <div className='mx-auto h-[calc(100%-200px)] w-full overflow-auto md:w-8/12'>
                    {conversations.length > 0 ? (
                        <MainContent
                            systemResponse={systemResponse}
                            waitingSystemResponse={waitingSystemResponse}
                            conversations={conversations}
                            reGenerate={(index: number) => {
                                handleMessageSend(conversations[index - 1], index, null);
                            }}
                            onEdit={(index: number) => {
                                const newContent = prompt('Edit message:', conversations[index].content);

                                if (newContent !== null) {
                                    const newMessage: AppMessageProps = {
                                        role: 'user',
                                        content: newContent,
                                    };

                                    setConversations(conversations.slice(0, index));

                                    handleMessageSend(newMessage);
                                }
                            }}
                        />
                    ) : (
                        <ModeSettings systemPromptContent={systemPromptContent} setSystemPromptContent={setSystemPromptContent} />
                    )}
                </div>
                <div>
                    <InputArea
                        conversations={conversations}
                        conversationID={conversationID}
                        conversationType='chat'
                        sendMessage={(message, indexNumber, plugin) => {
                            handleMessageSend(message, null, plugin);
                        }}
                        waitingSystemResponse={waitingSystemResponse}
                        stopSystemResponseRef={stopSystemResponseRef}
                    />
                </div>
            </div>
        </main>
    );
};

export default ChatMain;
