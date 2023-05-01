type ServiceProviderProps = 'Azure' | 'Claude' | 'Custom' | 'Hugging Face' | 'OpenAI' | 'Team' | 'Cohere' | 'Extension';

type PluginProps = 'search' | 'fetch';

type AppMessageProps = OpenAIMessage;

interface AppSettings {
    serviceProvider: string;
    apiKey: string;
    apiEndpoint: string;
}

interface HistoryProps {
    id: string;
    type: 'chat';
    title: string;
    messages: MessageProps[];
    timestamp: number;
}

interface Record {
    id: string;
    type: string;
    title: string;
    content: string[];
    share: boolean;
    createdAt: number;
    updatedAt: number;
    authorId: string;
}

interface OpenAIConfigProps {
    apiKey: string;
    apiEndpoint: string;
    apiModel: string;
    apiTemperature: number;
}

interface AppPluginProps {
    name: string;
    key: any;
}
