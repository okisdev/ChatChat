interface PluginProps {
    name: string;
    description: string;
    longDescription: string;
}

interface SearchEngineProps {
    name: string;
    value: string;
}

export const pluginConfig: PluginProps[] = [
    { name: 'search', description: 'Search in internet.', longDescription: 'This plugin will allow you to search in internet.' },
    { name: 'fetch', description: 'Fetch website content.', longDescription: 'This plugin will allow you to fetch content from website.' },
];

export const searchEnginesList: SearchEngineProps[] = [
    {
        name: 'Programmable Search Engine (By Google)',
        value: 'pse',
    },
];
