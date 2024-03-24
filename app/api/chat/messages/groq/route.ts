import Groq from 'groq-sdk';
import { Message, OpenAIStream, StreamingTextResponse } from 'ai';
import { GeneralModel } from '@/types/model';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY ?? '',
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

    console.log('model', model);

    const response = await groq.chat.completions.create({
        model: model.model_id,
        stream: true,
        messages,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
}
