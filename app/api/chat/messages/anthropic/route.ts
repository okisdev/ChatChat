import { GeneralModel } from '@/types/model';
import Anthropic from '@anthropic-ai/sdk';
import { AnthropicStream, StreamingTextResponse } from 'ai';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
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

    const response = await anthropic.messages.create({
        messages,
        model: model.model_id,
        stream: true,
        max_tokens: 4096,
    });

    const stream = AnthropicStream(response);

    return new StreamingTextResponse(stream);
}
