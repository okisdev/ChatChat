import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { GeneralModel } from '@/types/model';

const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY || '',
    baseURL: process.env.PERPLEXITY_ENDPOINT ?? 'https://api.perplexity.ai/',
});

export const runtime = 'edge';

export async function POST(req: Request) {
    const {
        messages,
        model,
    }: {
        messages: any[];
        model: GeneralModel;
    } = await req.json();

    const response = await perplexity.chat.completions.create({
        model: model.model_id,
        stream: true,
        max_tokens: 4096,
        messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
