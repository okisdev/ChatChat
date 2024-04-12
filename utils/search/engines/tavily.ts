import { TavilySearchEngine } from '@/types/search';

export const withTavilySearch = async (query: string, maxResults: number = 10, searchDepth: 'basic' | 'advanced' = 'basic', config?: TavilySearchEngine) => {
    const apiKey = config?.apiKey ?? process.env.TAVILY_SEARCH_API_KEY;

    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: apiKey,
            query,
            max_results: maxResults < 5 ? 5 : maxResults,
            search_depth: searchDepth,
            include_images: true,
            include_answers: true,
        }),
    });

    if (!response.ok) {
        throw new Error(`Error(${response.status}): ${response.statusText}`);
    }

    return await response.json();
};

export const getTavilySearchResultImage = (result: any) => {
    return result.images;
};
