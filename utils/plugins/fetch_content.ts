import axios from 'axios';

import * as cheerio from 'cheerio';

export const fetchContent = async (url: string) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const mainContent = $('main').text().trim();

        return mainContent;
    } catch (error) {
        console.error(`Error fetching content from ${url}:`, error);
        return null;
    }
};
