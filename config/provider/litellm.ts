import { Model } from '@/types/model';

export type LiteLLMModelId = string;
export type LiteLLMModelName = string;

export const model: Model[] = [
    {
        id: 'openai/gpt-4o-mini',
        name: 'GPT-4o Mini (via LiteLLM)',
        maxInputTokens: null,
        maxOutputTokens: 16384,
        maxTokens: 128000,
        price: 0.6,
    },
    {
        id: 'anthropic/claude-3-5-sonnet-20240620',
        name: 'Claude 3.5 Sonnet (via LiteLLM)',
        maxInputTokens: null,
        maxOutputTokens: 8192,
        maxTokens: 200000,
        price: 18.0,
    },
    {
        id: 'openai/gpt-4o',
        name: 'GPT-4o (via LiteLLM)',
        maxInputTokens: null,
        maxOutputTokens: 16384,
        maxTokens: 128000,
        price: 15.0,
    },
];
