import { GoogleSearchResult, GoogleSearchResultItem } from '@/types/search';

export const withGoogleSearch = async (query: string, searchAPIKey?: string, searchEngineID?: string, lang: string = 'en') => {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY ?? searchAPIKey ?? '';

    const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID ?? searchEngineID ?? '';

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${engineId}&q=${query}&lr=lang_${lang}`;

    const response = await fetch(searchUrl, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Error(${response.status}): ${response.statusText}`);
    }

    return await response.json();
};

export const getGoogleSearchResultImage = (result: GoogleSearchResult) => {
    return result.items.map((item: GoogleSearchResultItem) => item.pagemap.cse_image?.[0].src);
};
