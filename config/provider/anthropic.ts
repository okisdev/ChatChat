import { Model } from '@/types/model';

export type AnthropicModelId = 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' | 'claude-2.1' | 'claude-2.0' | 'claude-instant-1.2';
export type AnthropicModelName = 'Claude 3 Sonnet' | 'Claude 3 Haiku' | 'Claude 3 Opus' | 'Claude 2.1' | 'Claude 2.0' | 'Claude Instant 1.2';

export const model: Model[] = [
    {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
        vision: true,
    },
    {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 1.5,
        vision: true,
    },
    {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 90.0,
        vision: true,
    },
    {
        id: 'claude-2.1',
        name: 'Claude 2.1',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
        vision: false,
    },
    {
        id: 'claude-2.0',
        name: 'Claude 2.0',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
        vision: false,
    },
    {
        id: 'claude-instant-1.2',
        name: 'Claude Instant 1.2',
        maxInputTokens: null,
        maxOutputTokens: 4096,
        maxTokens: 200000,
        price: 18.0,
        vision: false,
    },
];
