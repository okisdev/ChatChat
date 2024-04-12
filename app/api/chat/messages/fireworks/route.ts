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

    const fireworks = new OpenAI({
        apiKey: config.provider.apiKey ?? process.env.FIREWORKS_API_KEY ?? '',
        baseURL: 'https://api.fireworks.ai/inference/v1',
    });

    const response = await fireworks.chat.completions.create({
        model: config.model.model_id,
        stream: true,
        max_tokens: 1000,
        messages,
    });

    const output = OpenAIStream(response);

    return new StreamingTextResponse(output);
}
