import axios from 'axios';

import * as cheerio from 'cheerio';

export const fetchContent = async (url: string) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const mainContent = $('main').text().trim();

        if (!mainContent) {
            throw new Error('No content found');
        }

        return mainContent;
    } catch (error) {
        console.error(`Error fetching content from ${url}:`, error);
        return null;
    }
};
