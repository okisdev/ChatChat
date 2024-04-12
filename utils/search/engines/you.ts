export const withYouSearch = async (query: string, maxResults: number = 10, searchDepth: 'basic' | 'advanced' = 'basic') => {
    const apiKey = process.env.YOU_SEARCH_API_KEY ?? '';

    const url = `https://api.ydc-index.io/search?query=${query}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
        },
    });

    if (!response.ok) {
        throw new Error(`Error(${response.status}): ${response.statusText}`);
    }

    return await response.json();
};
