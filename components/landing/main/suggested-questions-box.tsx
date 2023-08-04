import { useEffect, useState } from 'react';

import store from '@/hooks/store';
import { useAtomValue } from 'jotai';

interface PredictQuestionProps {
    text: string;
}

const SuggestedQuestionsBox = ({ conversations }: { conversations: AppMessageProps[] }) => {
    const predictPrompt: string =
        `You are a question prediction model. You are given a conversation between a user and an assistant. Your task is to predict the next question the user will ask. Please only predict the most likely 3 questions. The conversation is as follows: ` +
        '\n';

    const predictQuestions = useState<PredictQuestionProps[]>([]);

    const enableStreamMessages = useAtomValue(store.enableStreamMessagesAtom);

    // Service Provider
    const serviceProvider = useAtomValue(store.serviceProviderAtom);

    // OpenAI Config
    const openAIConfig = useAtomValue(store.openAIConfigAtom);

    useEffect(() => {
        const getPredict = async () => {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stream: enableStreamMessages,
                    serviceProvider: serviceProvider,
                    config: {
                        apiKey: openAIConfig.apiKey,
                        apiEndpoint: openAIConfig.apiEndpoint,
                        apiModel: openAIConfig.apiModel,
                        apiTemperature: openAIConfig.apiTemperature,
                    },
                    messages: {
                        role: 'user',
                        content: predictPrompt + conversations,
                    },
                }),
            });

            const data = await response.json();

            console.log(data);
        };

        getPredict();
    }, [conversations, enableStreamMessages, predictPrompt, serviceProvider]);

    return (
        <div className='flex flex-col items-center justify-center p-3 space-y-1'>
            <p className='text-sm'>Suggested Questions</p>
            <div className='flex items-center flex-wrap space-x-3 justify-center xl:w-11/12 md:w-6/12'>
                {predictQuestions.map((question, index) => (
                    <button key={index} className='flex items-center justify-center rounded ring-2 px-1 my-1 hover:bg-blue-100 transition ease-in-out duration-200'>
                        <p className='text-sm'>Questions Questions Questions</p>
                    </button>
                    // <button className='flex items-center justify-center rounded ring-2 px-1 my-1 hover:bg-blue-100 transition ease-in-out duration-200'>
                    //     <p className='text-sm'>Questions Questions Questions</p>
                    // </button>
                    // <button className='flex items-center justify-center rounded ring-2 px-1 my-1 hover:bg-blue-100 transition ease-in-out duration-200'>
                    //     <p className='text-sm'>Questions Questions Questions</p>
                    // </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestedQuestionsBox;
