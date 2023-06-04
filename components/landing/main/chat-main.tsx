'use client';

import { useEffect, useState, useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { useTranslations, useLocale } from 'next-intl';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtom, useAtomValue } from 'jotai';

import { setLocalStorage } from '@/hooks/setLocalStorage';

import ContentHead from '@/components/landing/main/chat-head';
import InputArea from '@/components/landing/main/input-area';
import MainContent from '@/components/landing/main/chat-content';

import ModeSettings from '@/components/landing/main/main-settings';

import generateHash from '@/utils/app/generateHash';

import { getSearchFromGoogleProgrammableSearchEngine } from '@/utils/plugins/search';

import { User } from '@prisma/client';

interface UserSettingsProps {
    user: User;
}

const ChatMain = () => {
    const searchParams = useSearchParams();

    const history = searchParams?.get('history');
    const share = searchParams?.get('share');

    const t = useTranslations('landing');
    const locale = useLocale();

    // Conversation Config
    const contextModeAtom = useAtomValue(store.contextModeAtom);
    const { enable: enableContextMode, contextCount } = contextModeAtom;
    const enableStreamMessages = useAtomValue(store.enableStreamMessagesAtom);
    const enablePlugin = useAtomValue(store.enablePluginsAtom);

    const [systemPromptContent, setSystemPromptContent] = useAtom(store.systemPromptContentAtom);
    const isSystemPromptEmpty = !systemPromptContent.trim() && /^\s*$/.test(systemPromptContent);

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

    const enableSync = userSettings?.user?.allowRecordCloudSync;

    useEffect(() => {
        if (share) {
            setConversationID(share);

            const getConversation = async () => {
                const response = await fetch('/api/share?id=' + share, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (!data) {
                    return;
                }

                setChatTitle(data.share.title);
                setConversations(data.share.content);
            };

            getConversation();
        }
    }, [share]);

    useEffect(() => {
        if (history) {
            setConversationID(history);

            const chatValue = localStorage.getItem('histories-chat-' + history);

            if (!chatValue) {
                return;
            }

            const chatHistory = JSON.parse(chatValue);

            setChatTitle(chatHistory.title);
            setConversations(chatHistory.messages);
        }
    }, [history]);

    const handleMessageSend = async (message: AppMessageProps, indexNumber?: number | null, plugin?: PluginProps | null) => {
        setWaitingSystemResponse(true);

        isSystemPromptEmpty || conversations.find((c) => c.role === 'system')
            ? setConversations((prev) => [...prev, message])
            : setConversations((prev) => [{ role: 'system', content: systemPromptContent }, ...prev, message]);

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
                        toast.error(t('Please set up your Google Programmable Search Engine API Key and Search Engine ID in the settings page'));
                        return;
                    }

                    const searchContent = await getSearchFromGoogleProgrammableSearchEngine(searchPluginConfig.searchAPIKey, searchPluginConfig.searchEngineID, message.content);

                    pluginResponse = searchContent;

                    pluginPrompt =
                        'I search ' +
                        message.content +
                        ' for you. Please me let me know what is the search result in details. The following is the search result: \n\n\n' +
                        JSON.stringify(pluginResponse);
                    break;
                case 'fetch':
                    const fetchContent = await fetch('/api/plugins/fetch?url=' + message.content).then((res) => res.json());

                    if (fetchContent.status != 200) {
                        toast.error(t('Unable to fetch content from the URL provided'));
                        return;
                    }

                    pluginResponse = fetchContent.content;
                    pluginPrompt =
                        'Act as a summarizer. Please summarize ' +
                        message.content +
                        ' in the ' +
                        locale +
                        '. Your summary should capture the most important points and ideas of the original text. Please ensure that your summary is clear, concise, and easy to understand. The following is the content: \n\n\n' +
                        pluginResponse;
                    break;
                default:
                    break;
            }
        }

        let messagesPayload: AppMessageProps[] = [];

        if (plugin && enablePlugin && pluginResponse && pluginPrompt) {
            if (!enableContextMode) {
                isSystemPromptEmpty || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [...conversations, { role: 'user', content: pluginPrompt }])
                    : (messagesPayload = [{ role: 'system', content: systemPromptContent }, ...conversations, { role: 'user', content: pluginPrompt }]);
            } else if (contextCount == 0) {
                isSystemPromptEmpty || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [{ role: 'user', content: pluginPrompt }])
                    : (messagesPayload = [
                          { role: 'system', content: systemPromptContent },
                          { role: 'user', content: pluginPrompt },
                      ]);
            } else {
                isSystemPromptEmpty || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [...conversations.slice(-contextCount), { role: 'user', content: pluginPrompt }])
                    : (messagesPayload = [...conversations.slice(-contextCount), { role: 'system', content: systemPromptContent }, { role: 'user', content: pluginPrompt }]);
            }
        } else {
            if (!enableContextMode) {
                isSystemPromptEmpty || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [...conversations, message])
                    : (messagesPayload = [{ role: 'system', content: systemPromptContent }, ...conversations, message]);
            } else if (contextCount == 0) {
                isSystemPromptEmpty || conversations.find((c) => c.role === 'system') ? (messagesPayload = [message]) : (messagesPayload = [{ role: 'system', content: systemPromptContent }, message]);
            } else {
                isSystemPromptEmpty || conversations.find((c) => c.role === 'system')
                    ? (messagesPayload = [...conversations.slice(-contextCount), message])
                    : (messagesPayload = [...conversations.slice(-contextCount), { role: 'system', content: systemPromptContent }, message]);
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
            toast.error(t('Error: Something went wrong'));
            return;
        }

        const data = response.body;

        if (!data) {
            setWaitingSystemResponse(false);
            setHasError(true);
            toast.error(t('Error: Something went wrong'));
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

        if (!enableContextMode || contextCount > 0) {
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

            const updateEvent = new CustomEvent('localStorageUpdated');
            window.dispatchEvent(updateEvent);

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
        }
    };

    return (
        <main className='m-2 flex h-[calc(100%-65px)] flex-grow flex-col rounded-lg bg-white/90 px-4 py-2 shadow backdrop-blur transition-transform duration-500 dark:bg-[#202327] md:h-[calc(100%-80px)] md:p-3'>
            <div className='flex h-full w-full flex-col justify-between space-y-3'>
                {conversations.length > 0 && <ContentHead chatTitle={chatTitle} chatTitleResponse={chatTitleResponse} waitingSystemResponse={waitingSystemResponse} conversations={conversations} />}
                <div className='mx-auto h-[calc(100%-200px)] w-full overflow-auto xl:w-8/12'>
                    {conversations.length > 0 ? (
                        <MainContent
                            systemResponse={systemResponse}
                            waitingSystemResponse={waitingSystemResponse}
                            conversations={conversations}
                            reGenerate={(index: number) => (isSystemPromptEmpty ? handleMessageSend(conversations[index - 1], index, null) : handleMessageSend(conversations[index], index + 1, null))}
                            onEdit={(index: number) => {
                                const promptIndex = isSystemPromptEmpty ? index : index + 1;

                                const newContent = prompt(t('Edit message:'), conversations[promptIndex].content);

                                if (newContent !== null) {
                                    const newMessage: AppMessageProps = {
                                        role: 'user',
                                        content: newContent,
                                    };

                                    setConversations(conversations.slice(0, promptIndex));

                                    handleMessageSend(newMessage);
                                }
                            }}
                            isSystemPromptEmpty={isSystemPromptEmpty}
                        />
                    ) : (
                        <ModeSettings systemPromptContent={systemPromptContent} setSystemPromptContent={setSystemPromptContent} />
                    )}
                </div>
                <div className='mx-auto w-full md:w-8/12 xl:w-6/12'>
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
