import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { GeneralModel } from '@/types/model';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
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

    const response = await openai.chat.completions.create({
        model: model.model_id,
        stream: true,
        messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
