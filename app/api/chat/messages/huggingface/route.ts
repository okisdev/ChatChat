import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

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

    const huggingface = new HfInference(config.provider?.apiKey ?? process.env.HUGGINGFACE_API_KEY ?? '');

    const response = huggingface.textGenerationStream({
        model: config.model.model_id,
        inputs: experimental_buildOpenAssistantPrompt(messages),
        parameters: {
            max_new_tokens: 200,
            typical_p: 0.2,
            repetition_penalty: 1,
            truncate: 1000,
            return_full_text: false,
        },
    });

    const output = HuggingFaceStream(response);

    return new StreamingTextResponse(output);
}
