import { Provider } from '@/config/provider';

export enum Theme {
    Light = 'light',
    Dark = 'dark',
    System = 'system',
}

export type SendKeyType = 'ctrl+enter' | 'enter' | 'shift+enter';
export type RenderMode = 'markdown' | 'plain';

export interface Preference {
    theme?: Theme;
    // sendKey?: SendKeyType;
    enterSend?: boolean;
    // autoRead?: boolean;
    // renderMode?: RenderMode;
    useMarkdown?: boolean;
    // autoScroll?: boolean;
}

export interface AdvancedSettings {
    unifiedEndpoint?: boolean;
    streamMessages?: boolean;
}

export interface ConversationSettings {
    numOfContext: number;
    systemPrompt?: string | null;
}

export interface OpenAISettings {
    apiKey?: string;
    endpoint?: string;
}

export interface GoogleSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface AmazonSettings {
    apiKey?: string;
    endpoint?: string;
    secretKey?: string;
    region?: string;
}

export interface AnthropicSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface AzureSettings {
    apiKey?: string;
    endpoint?: string;
    deploymentName?: string;
}

export interface CohereSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface FireworksSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface GroqSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface HuggingFaceSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface MistralSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface PerplexitySettings {
    apiKey?: string;
    endpoint?: string;
}

export type CustomSettings = SingleCustomSettings[];

export interface SingleCustomSettings {
    basedProvider?: Provider;
    apiKey?: string;
    endpoint?: string;
    model?: string;
}

export interface ProviderSetting {
    [Provider.Amazon]?: AmazonSettings;
    [Provider.OpenAI]?: OpenAISettings;
    [Provider.Google]?: GoogleSettings;
    [Provider.Anthropic]?: AnthropicSettings;
    [Provider.Azure]?: AzureSettings;
    [Provider.Cohere]?: CohereSettings;
    [Provider.Fireworks]?: FireworksSettings;
    [Provider.Groq]?: GroqSettings;
    [Provider.HuggingFace]?: HuggingFaceSettings;
    [Provider.Mistral]?: MistralSettings;
    [Provider.Perplexity]?: PerplexitySettings;
    [Provider.Custom]?: CustomSettings;
}

export type SpecifiedProviderSetting =
    | AmazonSettings
    | OpenAISettings
    | GoogleSettings
    | AnthropicSettings
    | AzureSettings
    | CohereSettings
    | FireworksSettings
    | GroqSettings
    | HuggingFaceSettings
    | MistralSettings
    | PerplexitySettings
    | SingleCustomSettings;
