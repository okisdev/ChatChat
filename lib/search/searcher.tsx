import { createOpenAI } from '@ai-sdk/openai';
import { experimental_streamText, ExperimentalMessage, ToolCallPart, ToolResultPart } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

import { Answer } from '@/components/layout/search/block/answer';
import { FocusPoint } from '@/components/layout/search/block/focus-point';
import { Images } from '@/components/layout/search/block/images';
import { Sources } from '@/components/layout/search/block/sources';
import { searcherPrompt } from '@/lib/prompt';
import { SimpleModel } from '@/types/model';
import { SearchEngineSetting } from '@/types/search';
import { ProviderSetting } from '@/types/settings';
import { withTavilySearch } from '@/utils/search/engines/tavily';

export const searcherSchema = z.object({
    query: z.string().describe('The search query'),
    max_results: z.number().max(20).default(10).describe('The maximum number of results to return'),
    search_depth: z.enum(['basic', 'advanced']).default('basic').describe('The type of search to perform'),
});

export const searcher = async (
    uiStream: ReturnType<typeof createStreamableUI>,
    streamText: ReturnType<typeof createStreamableValue<string>>,
    messages: ExperimentalMessage[],
    isProSearch: boolean,
    model: SimpleModel,
    currentSearchEngineSettings: SearchEngineSetting | null,
    currentProviderSettings: ProviderSetting | null
) => {
    'use server';

    let fullResponse = '';

    const openai = createOpenAI({
        apiKey: currentProviderSettings?.OpenAI?.apiKey ?? process.env.OPENAI_API_KEY ?? '',
        // baseURL: currentProviderSettings?.OpenAI?.endpoint ?? process.env.OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1',
    });

    const result = await experimental_streamText({
        model: openai.chat(model.model_id ?? 'gpt-4-turbo'),
        maxTokens: 2500,
        system: searcherPrompt,
        messages,
        tools: {
            search: {
                description: 'Search the web for information',
                parameters: searcherSchema,
                execute: async ({ query, max_results, search_depth }: { query: string; max_results: number; search_depth: 'basic' | 'advanced' }) => {
                    uiStream.update(<FocusPoint query={query} />);

                    const searchResult = await withTavilySearch(query, isProSearch ? 15 : max_results, isProSearch ? 'advanced' : search_depth, currentSearchEngineSettings?.Tavily);

                    uiStream.update(<Images images={searchResult.images} query={searchResult.query} />);

                    uiStream.append(<Sources results={searchResult.results} />);

                    uiStream.append(<Answer content={streamText.value} />);

                    return searchResult;
                },
            },
        },
    });

    const toolCalls: ToolCallPart[] = [];
    const toolResponses: ToolResultPart[] = [];

    for await (const delta of result.fullStream) {
        switch (delta.type) {
            case 'text-delta':
                if (delta.textDelta) {
                    if (fullResponse.length === 0 && delta.textDelta.length > 0) {
                        uiStream.update(<Answer content={streamText.value} />);
                    }

                    fullResponse += delta.textDelta;
                    streamText.update(fullResponse);
                }
                break;
            case 'tool-call':
                toolCalls.push(delta);
                break;
            case 'tool-result':
                toolResponses.push(delta);
                break;
            case 'error':
                fullResponse += `Error: ${delta.error}`;
                break;
        }
    }

    messages.push({
        role: 'assistant',
        content: [{ type: 'text', text: fullResponse }, ...toolCalls],
    });

    if (toolResponses.length > 0) {
        messages.push({ role: 'tool', content: toolResponses });
    }

    return { result, fullResponse };
};
