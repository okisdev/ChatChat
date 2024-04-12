import { Model } from '@/types/model';

export type FireworksModelId =
    | 'accounts/fireworks/models/llama-v2-7b'
    | 'accounts/fireworks/models/llama-v2-7b-chat'
    | 'accounts/fireworks/models/llama-v2-13b'
    | 'accounts/fireworks/models/llama-v2-13b-chat'
    | 'accounts/fireworks/models/llama-v2-34b-code-w8a16'
    | 'accounts/fireworks/models/llama-v2-70b-chat'
    | 'accounts/fireworks/models/mistral-7b'
    | 'accounts/fireworks/models/mistral-7b-instruct-4k'
    | 'accounts/fireworks/models/zephyr-7b-beta'
    | 'accounts/fireworks/models/mixtral-8x7b'
    | 'accounts/fireworks/models/mixtral-8x7b-instruct';
export type FireworksModelName =
    | 'LLAMA V2 7B'
    | 'LLAMA V2 7B Chat'
    | 'LLAMA V2 13B'
    | 'LLAMA V2 13B Chat'
    | 'LLAMA V2 34B Code W8A16'
    | 'LLAMA V2 70B Chat'
    | 'Mistral 7B'
    | 'Mistral 7B Instruct 4K'
    | 'Zephyr 7B Beta'
    | 'Mixtral 8x7B'
    | 'Mixtral 8x7B Instruct';

export const model: Model[] = [
    {
        id: 'accounts/fireworks/models/llama-v2-7b',
        name: 'LLAMA V2 7B',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/llama-v2-7b-chat',
        name: 'LLAMA V2 7B Chat',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/llama-v2-13b',
        name: 'LLAMA V2 13B',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/llama-v2-13b-chat',
        name: 'LLAMA V2 13B Chat',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/llama-v2-34b-code-w8a16',
        name: 'LLAMA V2 34B Code W8A16',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/llama-v2-70b-chat',
        name: 'LLAMA V2 70B Chat',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/mistral-7b',
        name: 'Mistral 7B',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/mistral-7b-instruct-4k',
        name: 'Mistral 7B Instruct 4K',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/zephyr-7b-beta',
        name: 'Zephyr 7B Beta',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/mixtral-8x7b',
        name: 'Mixtral 8x7B',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'accounts/fireworks/models/mixtral-8x7b-instruct',
        name: 'Mixtral 8x7B Instruct',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
    },
];
