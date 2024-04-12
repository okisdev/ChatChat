import { Model } from '@/types/model';

export type AmazonModelId =
    | 'amazon.titan-text-express-v1'
    | 'amazon.titan-text-lite-v1'
    | 'amazon.titan-embed-text-v1'
    | 'amazon.titan-embed-image-v1'
    | 'amazon.titan-image-generator-v1'
    | 'anthropic.claude-v2'
    | 'anthropic.claude-v2:1'
    | 'anthropic.claude-3-sonnet-20240229-v1:0'
    | 'anthropic.claude-3-haiku-20240307-v1:0'
    | 'anthropic.claude-instant-v1'
    | 'ai21.j2-mid-v1'
    | 'ai21.j2-ultra-v1'
    | 'cohere.command-text-v14'
    | 'cohere.command-light-text-v14'
    | 'cohere.embed-english-v3'
    | 'cohere.embed-multilingual-v3'
    | 'meta.llama2-13b-chat-v1'
    | 'meta.llama2-70b-chat-v1'
    | 'mistral.mistral-7b-instruct-v0:2'
    | 'mistral.mixtral-8x7b-instruct-v0:1'
    | 'stability.stable-diffusion-xl-v0'
    | 'stability.stable-diffusion-xl-v1';
export type AmazonModelName =
    | 'Titan Text G1 - Express'
    | 'Titan Text G1 - Lite'
    | 'Titan Embeddings G1 - Text'
    | 'Titan Multimodal Embeddings G1'
    | 'Titan Image Generator G1'
    | 'Claude 2'
    | 'Claude 2.1'
    | 'Claude 3 Sonnet'
    | 'Claude 3 Haiku'
    | 'Claude Instant'
    | 'Jurassic-2 Mid'
    | 'Jurassic-2 Ultra'
    | 'Command'
    | 'Command Light'
    | 'Embed English'
    | 'Embed Multilingual'
    | 'Llama 2 Chat 13B'
    | 'Llama 2 Chat 70B'
    | 'Mistral 7B Instruct'
    | 'Mixtral 8x7B Instruct'
    | 'Stable Diffusion XL v0'
    | 'Stable Diffusion XL v1';

export const model: Model[] = [
    {
        id: 'amazon.titan-text-express-v1',
        name: 'Titan Text G1 - Express',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'amazon.titan-text-lite-v1',
        name: 'Titan Text G1 - Lite',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'amazon.titan-embed-text-v1',
        name: 'Titan Embeddings G1 - Text',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'amazon.titan-embed-image-v1',
        name: 'Titan Multimodal Embeddings G1',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'amazon.titan-image-generator-v1',
        name: 'Titan Image Generator G1',
        maxInputTokens: null,
        maxOutputTokens: null,
        maxTokens: null,
        price: null,
    },
    {
        id: 'anthropic.claude-v2',
        name: 'Claude 2',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'anthropic.claude-v2:1',
        name: 'Claude 2.1',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'anthropic.claude-3-sonnet-20240229-v1:0',
        name: 'Claude 3 Sonnet',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'anthropic.claude-3-haiku-20240307-v1:0',
        name: 'Claude 3 Haiku',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 1.5,
    },
    {
        id: 'anthropic.claude-instant-v1',
        name: 'Claude Instant',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'ai21.j2-mid-v1',
        name: 'Jurassic-2 Mid',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'ai21.j2-ultra-v1',
        name: 'Jurassic-2 Ultra',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'cohere.command-text-v14',
        name: 'Command',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'cohere.command-light-text-v14',
        name: 'Command Light',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'cohere.embed-english-v3',
        name: 'Embed English',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'cohere.embed-multilingual-v3',
        name: 'Embed Multilingual',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'meta.llama2-13b-chat-v1',
        name: 'Llama 2 Chat 13B',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'meta.llama2-70b-chat-v1',
        name: 'Llama 2 Chat 70B',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'mistral.mistral-7b-instruct-v0:2',
        name: 'Mistral 7B Instruct',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'mistral.mixtral-8x7b-instruct-v0:1',
        name: 'Mixtral 8x7B Instruct',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'stability.stable-diffusion-xl-v0',
        name: 'Stable Diffusion XL v0',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'stability.stable-diffusion-xl-v1',
        name: 'Stable Diffusion XL v1',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
];
