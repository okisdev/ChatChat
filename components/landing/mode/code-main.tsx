'use client';

import { useState } from 'react';

import { toast } from 'react-hot-toast';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import generateHash from '@/utils/app/generateHash';

import { setLocalStorage } from '@/hooks/setLocalStorage';

const CodeMain = () => {
    const [userMessageInput, setUserMessageInput] = useState<string>('');

    const [codeMode, setCodeMode] = useState<string>('Explain');

    const [languageMode, setLanguageMode] = useState<string>('JavaScript');

    const [customRule, setCustomRule] = useState<string>('');

    const [conversationID, setConversationID] = useState<string>(generateHash(16));

    const [systemResponse, setSystemResponse] = useState<string>('');
    const [responseLoading, setResponseLoading] = useState<boolean>(false);

    const [hasError, setHasError] = useState<boolean>(false);

    const enableStreamMessages = useAtomValue(store.enableStreamMessagesAtom);

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

    const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserMessageInput(e.target.value);
    };

    const onProcess = async () => {
        if (!userMessageInput) {
            toast.error('Please enter a message');
            return;
        }

        let prompt;

        switch (codeMode) {
            default:
            case 'Explain':
                prompt = 'You are a programmer and you are explaining code to a non-programmer. Explain the following code:';
                break;
            case 'Convert':
                prompt = `You are a programmer and you are converting code from one language to another. Convert the following code to ${languageMode}:`;
                break;
            case 'Custom':
                prompt = customRule;
                break;
        }

        setResponseLoading(true);

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

        const messagesPayload: AppMessageProps[] = [
            { role: 'system', content: prompt },
            { role: 'user', content: userMessageInput },
        ];

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
            setResponseLoading(false);
            setHasError(true);
            toast.error('Something went wrong');
            return;
        }

        const data = response.body;

        if (!data) {
            setResponseLoading(false);
            setHasError(true);
            toast.error('Something went wrong');
            return;
        }

        setSystemResponse('');

        const reader = data.getReader();
        const decoder = new TextDecoder();

        let done = false;

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            const chunkValue = decoder.decode(value);

            setSystemResponse((prev) => prev + chunkValue);
        }

        setResponseLoading(false);

        setLocalStorage(`histories-code-${conversationID}`, {
            id: conversationID,
            type: 'code',
            title: codeMode,
            messages: [
                ...messagesPayload,
                {
                    role: 'assistant',
                    content: systemResponse,
                },
            ],
            timestamp: new Date().getTime(),
        });

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
    };
    return (
        <main className='m-2 flex h-[calc(100%-65px)] flex-grow flex-col rounded-lg bg-white/90 px-4 py-2 shadow backdrop-blur transition-transform duration-500 dark:bg-gray-800 md:h-[calc(100%-80px)] md:p-3'>
            <div className='flex h-full flex-col items-center justify-between md:flex-row md:space-x-3'>
                <Textarea className='h-[300px] w-full md:max-h-[800px] md:min-h-full md:w-5/12' onChange={onMessageChange} />
                <div className='flex max-h-[100px] w-full flex-col space-y-3 md:w-2/12'>
                    <Select value={codeMode} onValueChange={setCodeMode}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CodeModeConfig.map((mode, index) => {
                                return (
                                    <SelectItem key={index} value={mode.name}>
                                        <div className='flex items-center space-x-2'>
                                            <span>{mode.name}</span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    <div className='space-y-3'>
                        <p className='px-2 text-sm'>{CodeModeConfig.find((mode) => mode.name === codeMode)?.hint}</p>
                        {codeMode == 'Custom' && (
                            <div>
                                <Textarea value={customRule} onChange={(e) => setCustomRule(e.target.value)} />
                            </div>
                        )}
                        {codeMode == 'Convert' && (
                            <div>
                                <Select value={languageMode} defaultValue={languageMode} onValueChange={setLanguageMode}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className='max-h-36 md:max-h-96'>
                                        {CodeLanguageList.map((language, index) => {
                                            return (
                                                <SelectItem key={index} value={language.name}>
                                                    <div className='flex items-center space-x-2'>
                                                        <span>{language.name}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <Button variant='secondary' onClick={onProcess}>
                        Process
                    </Button>
                </div>
                <div className='h-[300px] max-h-[800px] min-h-[100px] w-full rounded-md border p-3 md:min-h-full md:w-5/12'>{systemResponse}</div>
            </div>
        </main>
    );
};

export default CodeMain;

const CodeModeConfig = [
    { name: 'Explain', value: 'explain', hint: 'This mode will explain what the code means.' },
    { name: 'Convert', value: 'convert', hint: 'This mode will convert the code to a different language.' },
    { name: 'Custom', value: 'custom', hint: 'This mode will allow you to create your own custom rule.' },
];

const CodeLanguageList = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'Python', value: 'python' },
    { name: 'Java', value: 'java' },
    { name: 'C++', value: 'cpp' },
    { name: 'C#', value: 'csharp' },
    { name: 'PHP', value: 'php' },
    { name: 'Ruby', value: 'ruby' },
    { name: 'Go', value: 'go' },
    { name: 'Rust', value: 'rust' },
    { name: 'Swift', value: 'swift' },
    { name: 'Kotlin', value: 'kotlin' },
    { name: 'Dart', value: 'dart' },
    { name: 'C', value: 'c' },
    { name: 'Objective-C', value: 'objectivec' },
    { name: 'Scala', value: 'scala' },
    { name: 'Perl', value: 'perl' },
    { name: 'Haskell', value: 'haskell' },
    { name: 'Lua', value: 'lua' },
    { name: 'R', value: 'r' },
    { name: 'SQL', value: 'sql' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'JSON', value: 'json' },
    { name: 'XML', value: 'xml' },
];
