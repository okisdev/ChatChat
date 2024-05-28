import { CoreMessage } from 'ai';
import { createAI, createStreamableUI, createStreamableValue, getMutableAIState, StreamableValue } from 'ai/rsc';

import { AskFollowUpQuestion } from '@/components/layout/search/block/ask-follow-up-question';
import { BlockError } from '@/components/layout/search/block/error';
import { Searching } from '@/components/layout/search/block/searching';
import { Provider } from '@/config/provider';
import { challenger } from '@/lib/search/challenger';
import { clarifier } from '@/lib/search/clarifier';
import { illustrator } from '@/lib/search/illustrator';
import { searcher } from '@/lib/search/searcher';
import { SimpleModel } from '@/types/model';
import { SearchEngineSetting, TChallengerAction } from '@/types/search';
import { ProviderSetting } from '@/types/settings';

const AllowSearchProvider = ['OpenAI'] as Provider[];

const chat = async (model: SimpleModel, messages: CoreMessage[]) => {
    'use server';
};

const search = async (
    model: SimpleModel,
    currentProviderSettings: ProviderSetting | null,
    currentSearchEngineSettings: SearchEngineSetting | null,
    formData?: FormData,
    isProSearch: boolean = false,
    skip?: boolean
) => {
    'use server';

    if (!AllowSearchProvider.includes(model?.provider)) {
        return {
            id: Date.now(),
            isGenerating: false,
            component: <BlockError content='Provider is not supported.' type='not_supported' />,
        };
    }

    const hasOpenAI = process.env['NEXT_PUBLIC_ACCESS_OPENAI'] == 'true';
    const hasTavily = process.env['NEXT_PUBLIC_ACCESS_TAVILY_SEARCH'] == 'true';

    if (!hasOpenAI && !currentProviderSettings?.OpenAI) {
        return {
            id: Date.now(),
            isGenerating: false,
            component: <BlockError content='Search engine is not configured.' type='provider_not_configured' />,
        };
    }

    if (!hasTavily && !currentSearchEngineSettings?.Tavily) {
        return {
            id: Date.now(),
            isGenerating: false,
            component: <BlockError content='Search engine is not configured.' type='search_engine_not_configured' />,
        };
    }

    const aiState = getMutableAIState<typeof AI>();
    const uiStream = createStreamableUI();
    const isGenerating = createStreamableValue(true);

    const messages: CoreMessage[] = aiState.get() as any;

    const question = formData?.get('input') as string;

    const userInput = skip ? `{"action": "skip"}` : question;
    const content = skip ? userInput : formData ? JSON.stringify(Object.fromEntries(formData)) : null;

    if (content) {
        const message = { role: 'user', content };
        messages.push(message as CoreMessage);
        aiState.update([...(aiState.get() as any), message]);
    }

    (async () => {
        uiStream.update(<Searching />);

        let action = {
            object: {
                next: 'proceed',
            },
        } as TChallengerAction;

        if (isProSearch) {
            if (!skip) {
                const challenge = await challenger(messages, model, currentProviderSettings);

                action = challenge;
            }

            if (action.object.next === 'challenge') {
                const clarify = await clarifier(uiStream, messages, model, currentProviderSettings);

                uiStream.done();
                isGenerating.done();

                aiState.done([
                    ...aiState.get(),
                    {
                        role: 'assistant',
                        content: `clarify: ${clarify?.question}`,
                    },
                ]);
                return;
            }
        }

        let answer = '';

        const streamText = createStreamableValue<string>();

        while (answer.length === 0) {
            const { fullResponse } = await searcher(uiStream, streamText, messages, isProSearch, model, currentSearchEngineSettings, currentProviderSettings);
            answer = fullResponse;
        }

        streamText.done();

        await illustrator(uiStream, messages, model, currentProviderSettings);

        uiStream.append(<AskFollowUpQuestion />);

        isGenerating.done(false);

        uiStream.done();

        aiState.done([...aiState.get(), { role: 'assistant', content: answer }]);
    })();

    return {
        id: Date.now(),
        isGenerating: isGenerating.value,
        component: uiStream.value,
    };
};

const initialAIState: {
    role: 'user' | 'assistant' | 'system' | 'function' | 'tool';
    content: string;
}[] = [];

const initialUIState: {
    id: number;
    isGenerating: StreamableValue<boolean>;
    component: React.ReactNode;
}[] = [];

export const AI = createAI({
    actions: {
        chat,
        search,
    },
    initialUIState,
    initialAIState,
});
