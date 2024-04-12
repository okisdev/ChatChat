import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

import { ApiConfig } from '@/types/app';
import { toGoogleMessage } from '@/utils/provider/google';

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

    const genAI = new GoogleGenerativeAI(config.provider?.apiKey ?? process.env.GOOGLE_API_KEY ?? '');

    const response = await genAI.getGenerativeModel({ model: config.model.model_id }).generateContentStream(toGoogleMessage(messages));

    const output = GoogleGenerativeAIStream(response);

    return new StreamingTextResponse(output);
}
