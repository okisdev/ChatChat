type OpenAIModel = 'gpt-4' | 'gpt-4-32k' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k';
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
