import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { GeneralModel } from '@/types/model';

const fireworks = new OpenAI({
    apiKey: process.env.FIREWORKS_API_KEY ?? '',
    baseURL: 'https://api.fireworks.ai/inference/v1',
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

    const response = await fireworks.chat.completions.create({
        model: model.model_id,
        stream: true,
        max_tokens: 1000,
        messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
