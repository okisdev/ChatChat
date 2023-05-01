export const getSearchFromGoogleProgrammableSearchEngine = async (searchAPIKey: string, searchEngineID: string, query: string) => {
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${searchAPIKey}&cx=${searchEngineID}&q=${query}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    const result = data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
    }));

    return result;
};
