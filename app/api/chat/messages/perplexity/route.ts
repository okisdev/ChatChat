import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

import { ApiConfig } from '@/types/app';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const {
        messages,
        config,
        stream,
    }: {
        messages: any[];
        config: ApiConfig;
        stream: boolean;
    } = await req.json();

    const perplexity = new OpenAI({
        apiKey: config.provider?.apiKey ?? process.env.PERPLEXITY_API_KEY ?? '',
        baseURL: config.provider?.endpoint ?? process.env.PERPLEXITY_ENDPOINT ?? 'https://api.perplexity.ai/',
    });

    const response = await perplexity.chat.completions.create({
        model: config.model.model_id,
        stream: true,
        max_tokens: 4096,
        messages,
    });

    const output = OpenAIStream(response);

    return new StreamingTextResponse(output);
}
