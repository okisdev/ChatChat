import { GeneralModel } from '@/types/model';
import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const {
        messages,
        model,
    }: {
        messages: any[];
        model: GeneralModel;
    } = await req.json();

    const response = Hf.textGenerationStream({
        model: model.model_id,
        inputs: experimental_buildOpenAssistantPrompt(messages),
        parameters: {
            max_new_tokens: 200,
            typical_p: 0.2,
            repetition_penalty: 1,
            truncate: 1000,
            return_full_text: false,
        },
    });

    const stream = HuggingFaceStream(response);

    return new StreamingTextResponse(stream);
}
