import { MistralStream, StreamingTextResponse } from 'ai';
import MistralClient from '@mistralai/mistralai';
import { GeneralModel } from '@/types/model';

const mistral = new MistralClient(process.env.MISTRAL_API_KEY ?? '');

export async function POST(req: Request) {
    const {
        messages,
        model,
    }: {
        messages: any[];
        model: GeneralModel;
    } = await req.json();

    const response = mistral.chatStream({
        model: model.model_id,
        maxTokens: 1000,
        messages,
    });

    const stream = MistralStream(response);

    return new StreamingTextResponse(stream);
}
