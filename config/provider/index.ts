import { AnthropicModelId, AnthropicModelName } from '@/config/provider/anthropic';
import { AzureOpenAIModelId, AzureOpenAIModelName } from '@/config/provider/azure';
import { CohereModelId, CohereModelName } from '@/config/provider/cohere';
import { FireworksModelId, FireworksModelName } from '@/config/provider/fireworks';
import { GroqModelId, GroqModelName } from '@/config/provider/groq';
import { HuggingFaceModelId, HuggingFaceModelName } from '@/config/provider/huggingface';
import { MistralModelId, MistralModelName } from '@/config/provider/mistral';
import { GoogleModelId, GoogleModelName } from '@/config/provider/google';
import { OpenAIModelId, OpenAIModelName } from '@/config/provider/openai';
import { PerplexityModelId, PerplexityModelName } from '@/config/provider/perplexity';

export type AllModelId =
    | AnthropicModelId
    | AzureOpenAIModelId
    | CohereModelId
    | FireworksModelId
    | GroqModelId
    | HuggingFaceModelId
    | MistralModelId
    | GoogleModelId
    | OpenAIModelId
    | PerplexityModelId;

export type AllModelName =
    | AnthropicModelName
    | AzureOpenAIModelName
    | CohereModelName
    | FireworksModelName
    | GroqModelName
    | HuggingFaceModelName
    | MistralModelName
    | GoogleModelName
    | OpenAIModelName
    | PerplexityModelName;

export enum Provider {
    OpenAI = 'OpenAI',
    Google = 'Google',
    Anthropic = 'Anthropic',
    Azure = 'Azure',
    Cohere = 'Cohere',
    Fireworks = 'Fireworks',
    Groq = 'Groq',
    HuggingFace = 'HuggingFace',
    Mistral = 'Mistral',
    Perplexity = 'Perplexity',
}

export const Providers: {
    id: string;
    name: Provider;
}[] = [
    {
        id: 'openai',
        name: Provider.OpenAI,
    },
    {
        id: 'google',
        name: Provider.Google,
    },
    {
        id: 'anthropic',
        name: Provider.Anthropic,
    },
    {
        id: 'azure',
        name: Provider.Azure,
    },
    {
        id: 'cohere',
        name: Provider.Cohere,
    },
    {
        id: 'fireworks',
        name: Provider.Fireworks,
    },
    {
        id: 'groq',
        name: Provider.Groq,
    },
    {
        id: 'huggingface',
        name: Provider.HuggingFace,
    },
    {
        id: 'mistral',
        name: Provider.Mistral,
    },
    {
        id: 'perplexity',
        name: Provider.Perplexity,
    },
];
