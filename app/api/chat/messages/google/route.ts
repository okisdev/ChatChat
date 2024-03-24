import { GeneralModel } from '@/types/model';
import { toGoogleMessage } from '@/utils/provider/google';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API_KEY ?? '');

export const runtime = 'edge';

export async function POST(req: Request) {
    const {
        messages,
        model,
    }: {
        messages: any[];
        model: GeneralModel;
    } = await req.json();

    const geminiStream = await genAI.getGenerativeModel({ model: model.model_id }).generateContentStream(toGoogleMessage(messages));

    const stream = GoogleGenerativeAIStream(geminiStream);

    return new StreamingTextResponse(stream);
}
