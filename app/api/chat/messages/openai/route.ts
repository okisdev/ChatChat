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

    const openai = new OpenAI({
        apiKey: config.provider?.apiKey ?? process.env.OPENAI_API_KEY ?? '',
        baseURL: config.provider?.endpoint ?? process.env.OPENAI_API_ENDPOINT ?? 'https://api.openai.com/v1',
    });

    const response = await openai.chat.completions.create({
        model: config.model.model_id,
        stream: true,
        messages,
    });

    const output = OpenAIStream(response);

    return new StreamingTextResponse(output);
}
