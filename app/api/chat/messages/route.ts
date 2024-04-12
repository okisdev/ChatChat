import Anthropic from '@anthropic-ai/sdk';
// import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HfInference } from '@huggingface/inference';
import MistralClient from '@mistralai/mistralai';
import { AnthropicStream, GoogleGenerativeAIStream, HuggingFaceStream, Message, MistralStream, OpenAIStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
import { CohereClient } from 'cohere-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

import { Provider } from '@/config/provider';
import { ApiConfig } from '@/types/app';
import { toCohereRole } from '@/utils/provider/cohere';
import { toGoogleMessage } from '@/utils/provider/google';

// const amazon = new BedrockRuntimeClient({
//     region: process.env.AWS_REGION ?? 'us-east-1',
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY ?? '',
//         secretAccessKey: process.env.AWS_SECRET_KEY ?? '',
//     },
// });

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? '',
});

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY ?? '',
});

const fireworks = new OpenAI({
    apiKey: process.env.FIREWORKS_API_KEY ?? '',
    baseURL: 'https://api.fireworks.ai/inference/v1',
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? '');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY ?? '',
});

const huggingface = new HfInference(process.env.HUGGINGFACE_API_KEY);

const mistral = new MistralClient(process.env.MISTRAL_API_KEY ?? '');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
});

const perplexity = new OpenAI({
    apiKey: process.env.PERPLEXITY_API_KEY ?? '',
    baseURL: process.env.PERPLEXITY_ENDPOINT ?? 'https://api.perplexity.ai/',
});

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

    switch (config.model.provider) {
        // case Provider.Amazon: {
        //     const response = await amazon.send(
        //         new InvokeModelWithResponseStreamCommand({
        //             modelId: model.model_id,
        //             contentType: 'application/json',
        //             accept: 'application/json',
        //             body: JSON.stringify({
        //                 prompt: experimental_buildAnthropicPrompt(messages),
        //                 max_tokens_to_sample: 300,
        //             }),
        //         })
        //     );
        //     const output = AWSBedrockAnthropicStream(response);
        //     return new StreamingTextResponse(output);
        // }
        case Provider.Anthropic: {
            const response = await anthropic.messages.create({
                messages,
                model: config.model.model_id,
                stream: true,
                max_tokens: 4096,
            });
            const output = AnthropicStream(response);
            return new StreamingTextResponse(output);
        }
        case Provider.Cohere: {
            const cohereChatHistory = messages.map((message: Message) => ({
                message: message.content,
                role: toCohereRole(message.role),
            }));
            const lastMessage = cohereChatHistory.pop()!;
            const response = await cohere.chatStream({
                message: lastMessage.message,
                chatHistory: cohereChatHistory,
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
            return new StreamingTextResponse(output);
        }
        case Provider.Fireworks: {
            const response = await fireworks.chat.completions.create({
                model: config.model.model_id,
                stream: true,
                max_tokens: 1000,
                messages,
            });
            const output = OpenAIStream(response);
            return new StreamingTextResponse(output);
        }
        case Provider.Google: {
            const geminiStream = await genAI.getGenerativeModel({ model: config.model.model_id }).generateContentStream(toGoogleMessage(messages));
            const output = GoogleGenerativeAIStream(geminiStream);
            return new StreamingTextResponse(output);
        }
        case Provider.Groq: {
            const response = await groq.chat.completions.create({
                model: config.model.model_id,
                stream: true,
                messages,
            });
            const output = OpenAIStream(response);
            return new StreamingTextResponse(output);
        }
        case Provider.HuggingFace: {
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
        case Provider.Mistral: {
            const response = mistral.chatStream({
                model: config.model.model_id,
                maxTokens: 1000,
                messages,
            });
            const output = MistralStream(response);
            return new StreamingTextResponse(output);
        }
        case Provider.OpenAI: {
            const response = await openai.chat.completions.create({
                model: config.model.model_id,
                stream: true,
                messages,
            });
            const output = OpenAIStream(response);
            return new StreamingTextResponse(output);
        }
        case Provider.Perplexity: {
            const response = await perplexity.chat.completions.create({
                model: config.model.model_id,
                stream: true,
                max_tokens: 4096,
                messages,
            });
            const output = OpenAIStream(response);
            return new StreamingTextResponse(output);
        }
        default:
            return new Response('Invalid Provider', { status: 400 });
    }
}
