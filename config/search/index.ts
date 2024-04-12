export enum SearchEngine {
    Google = 'Google',
    Tavily = 'Tavily',
}

export const SearchEngines: {
    id: string;
    name: SearchEngine;
}[] = [
    {
        id: 'google',
        name: SearchEngine.Google,
    },
    {
        id: 'tavily',
        name: SearchEngine.Tavily,
    },
];
