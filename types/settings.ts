import { Provider } from '@/config/provider';

export enum Theme {
    Light = 'light',
    Dark = 'dark',
    System = 'system',
}

export type SendKeyType = 'ctrl+enter' | 'enter' | 'shift+enter';
export type RenderMode = 'markdown' | 'plain';

export interface GeneralPreferences {
    theme?: Theme;
    // sendKey?: SendKeyType;
    enterSend?: boolean;
    autoRead?: boolean;
    // renderMode?: RenderMode;
    useMarkdown?: boolean;
    autoScroll?: boolean;
}

export enum SearchEngine {
    Google = 'Google',
}

export interface OpenAIGeneralSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface GoogleGeneralSettings {
    apiKey?: string;
}

export interface AnthropicGeneralSettings {
    apiKey?: string;
}

export interface AzureGeneralSettings {
    apiKey?: string;
    endpoint?: string;
    deploymentName?: string;
}

export interface CohereGeneralSettings {
    apiKey?: string;
}

export interface FireworksGeneralSettings {
    apiKey?: string;
}

export interface GroqGeneralSettings {
    apiKey?: string;
}

export interface HuggingFaceGeneralSettings {
    apiKey?: string;
}

export interface MistralGeneralSettings {
    apiKey?: string;
}

export interface PerplexityGeneralSettings {
    apiKey?: string;
    endpoint?: string;
}

export interface GeneralProviderSettings {
    [Provider.OpenAI]?: OpenAIGeneralSettings;
    [Provider.Google]?: GoogleGeneralSettings;
    [Provider.Anthropic]?: AnthropicGeneralSettings;
    [Provider.Azure]?: AzureGeneralSettings;
    [Provider.Cohere]?: CohereGeneralSettings;
    [Provider.Fireworks]?: FireworksGeneralSettings;
    [Provider.Groq]?: GroqGeneralSettings;
    [Provider.HuggingFace]?: HuggingFaceGeneralSettings;
    [Provider.Mistral]?: MistralGeneralSettings;
    [Provider.Perplexity]?: PerplexityGeneralSettings;
}
