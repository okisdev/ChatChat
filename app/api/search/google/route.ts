import { createOpenAI } from '@ai-sdk/openai';
import { experimental_streamText, ExperimentalMessage, StreamingTextResponse, ToolCallPart, ToolResultPart } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';

import { searcherPrompt } from '@/lib/prompt';
import { searcherSchema } from '@/lib/search/searcher';
import { ApiConfig } from '@/types/app';
import { withGoogleSearch } from '@/utils/search/engines/google';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const {
        messages,
        config,
        stream,
    }: {
        messages: ExperimentalMessage[];
        config: ApiConfig;
        stream: boolean;
    } = await req.json();

    let fullResponse = '';

    const streamText = createStreamableValue<string>();

    const uiStream = createStreamableUI();

    const openai = createOpenAI({
        apiKey: config.provider?.apiKey ?? process.env.OPENAI_API_KEY ?? '',
        baseUrl: config.provider?.endpoint ?? process.env.OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1',
    });

    const result = await experimental_streamText({
        model: openai.chat('gpt-4'),
        system: searcherPrompt,
        messages,
        tools: {
            search: {
                description: 'Search the web for information.',
                parameters: searcherSchema,
                execute: async ({ query }: { query: string }) => {
                    const searchResult = await withGoogleSearch(query);

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
                fullResponse += `\nError occurred while executing the tool`;
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

    return new StreamingTextResponse(result.toAIStream());
}
