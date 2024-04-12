import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

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

    const anthropic = new Anthropic({
        apiKey: config.provider?.apiKey ?? process.env.ANTHROPIC_API_KEY ?? '',
    });

    const response = await anthropic.messages.create({
        messages,
        model: config.model.model_id,
        stream: true,
        max_tokens: 4096,
    });

    const output = AnthropicStream(response);

    return new StreamingTextResponse(output);
}
