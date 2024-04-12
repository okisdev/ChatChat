import { getTavilySearchResultImage } from '@/utils/search/engines/tavily';

export const getImage = ({ result }: { result: any }): string[] => {
    let images = [];

    images = getTavilySearchResultImage(result);

    return images;
};
