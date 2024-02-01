type OpenAIProvider = 'Azure' | 'OpenAI';

type OpenAIModel =
    | 'gpt-4'
    | 'gpt-4-0613'
    | 'gpt-4-0125-preview'
    | 'gpt-4-1106-preview'
    | 'gpt-4-vision-preview'
    | 'gpt-4-32k'
    | 'gpt-4-32k-0613'
    | 'gpt-3.5-turbo'
    | 'gpt-3.5-turbo-16k'
    | 'gpt-3.5-turbo-1106'
    | 'gpt-3.5-turbo-instruct';
type OpenAIMessageRole = 'user' | 'system' | 'assistant';

interface OpenAIMessage {
    role: OpenAIMessageRole;
    content: string;
}

interface OpenAIMessages {
    messages: OpenAIMessage[];
}

interface OpenAIChatPayload {
    model: OpenAIModel;
    messages: OpenAIMessage[];
    temperature?: number;
    top_p?: number;
    n?: integer;
    stream?: boolean;
    stop?: string | string[];
    max_tokens?: integer;
    presence_penalty?: number;
    frequency_penalty?: number;
    // logit_bias?: map;
    user?: string;
}

interface OpenAIImagePayload {
    prompt: string;
    n?: integer;
    size?: '256x256' | '512x512' | '1024x102';
    response_format?: 'url' | 'b64_json';
    user?: string;
}

interface OpenAIGPTModel {
    model: OpenAIModel;
    maxTokens: integer;
    price: integer;
}

type AzureOpenAiApiVersion =
    | '2020-10-01-preview'
    | '2022-12-01 Swagger'
    | '2023-03-15-preview'
    | '2023-05-15'
    | '2023-06-01-preview'
    | '2023-07-01-preview'
    | '2023-08-01-preview'
    | '2023-09-01-preview';
