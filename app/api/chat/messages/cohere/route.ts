import { GeneralModel } from '@/types/model';
import { toCohereRole } from '@/utils/provider/cohere';
import { CohereStream, Message, StreamingTextResponse } from 'ai';
import { CohereClient, Cohere } from 'cohere-ai';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY ?? '',
});

export async function POST(req: Request) {
    const {
        messages,
        model,
    }: {
        messages: any[];
        model: GeneralModel;
    } = await req.json();

    const chatHistory = messages.map((message: Message) => ({
        message: message.content,
        role: toCohereRole(message.role),
    }));

    const lastMessage = chatHistory.pop()!;

    const response = await cohere.chatStream({
        message: lastMessage.message,
        chatHistory,
        model: model.model_id,
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const event of response) {
                if (event.eventType === 'text-generation') {
                    controller.enqueue(event.text);
                }
            }
            controller.close();
        },
    });

    return new Response(stream);
}
