import { Message } from 'ai';
import { CohereClient } from 'cohere-ai';

import { ApiConfig } from '@/types/app';
import { toCohereRole } from '@/utils/provider/cohere';

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

    const chatHistory = messages.map((message: Message) => ({
        message: message.content,
        role: toCohereRole(message.role),
    }));

    const lastMessage = chatHistory.pop()!;

    const cohere = new CohereClient({
        token: config.provider?.apiKey ?? process.env.COHERE_API_KEY ?? '',
    });

    const response = await cohere.chatStream({
        message: lastMessage.message,
        chatHistory,
        model: config.model.model_id,
    });

    const output = new ReadableStream({
        async start(controller) {
            for await (const event of response) {
                if (event.eventType === 'text-generation') {
                    controller.enqueue(event.text);
                }
            }
            controller.close();
        },
    });

    return new Response(output);
}
