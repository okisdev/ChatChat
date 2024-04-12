import MistralClient from '@mistralai/mistralai';
import { MistralStream, StreamingTextResponse } from 'ai';

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

    const mistral = new MistralClient(config.provider?.apiKey ?? process.env.MISTRAL_API_KEY ?? '');

    const response = mistral.chatStream({
        model: config.model.model_id,
        maxTokens: 1000,
        messages,
    });

    const output = MistralStream(response);

    return new StreamingTextResponse(output);
}
