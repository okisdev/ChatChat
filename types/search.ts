import { DeepPartial } from 'ai';

import { SearchEngine } from '@/config/search';
import { challengerSchema } from '@/lib/search/challenger';
import { clarifierSchema } from '@/lib/search/clarifier';
import { illustratorSchema } from '@/lib/search/illustrator';
import { searcherSchema } from '@/lib/search/searcher';

export type TChallenger = DeepPartial<typeof challengerSchema>;
export type TClarifier = DeepPartial<typeof clarifierSchema>;
export type TIllustrator = DeepPartial<typeof illustratorSchema>;
export type TSearcher = DeepPartial<typeof searcherSchema>;

export type TChallengerAction = {
    object: TChallenger;
};

export interface TavilySearchEngine {
    apiKey?: string;
}

export interface SearchEngineSetting {
    [SearchEngine.Tavily]?: TavilySearchEngine;
}

export interface GoogleSearchResult {
    kind: string;
    url: {
        type: string;
        template: string;
    };
    queries: {
        previousPage: [
            {
                title: string;
                totalResults: string;
                searchTerms: string;
                count: number;
                startIndex: number;
                startPage: number;
                language: string;
                inputEncoding: string;
                outputEncoding: string;
                safe: string;
                cx: string;
                sort: string;
                filter: string;
                gl: string;
                cr: string;
                googleHost: string;
                disableCnTwTranslation: string;
                hq: string;
                hl: string;
                siteSearch: string;
                siteSearchFilter: string;
                exactTerms: string;
                excludeTerms: string;
                linkSite: string;
                orTerms: string;
                relatedSite: string;
                dateRestrict: string;
                lowRange: string;
                highRange: string;
                fileType: string;
                rights: string;
                searchType: string;
                imgSize: string;
                imgType: string;
                imgColorType: string;
                imgDominantColor: string;
            },
        ];
        request: [
            {
                title: string;
                totalResults: string;
                searchTerms: string;
                count: number;
                startIndex: number;
                startPage: number;
                language: string;
                inputEncoding: string;
                outputEncoding: string;
                safe: string;
                cx: string;
                sort: string;
                filter: string;
                gl: string;
                cr: string;
                googleHost: string;
                disableCnTwTranslation: string;
                hq: string;
                hl: string;
                siteSearch: string;
                siteSearchFilter: string;
                exactTerms: string;
                excludeTerms: string;
                linkSite: string;
                orTerms: string;
                relatedSite: string;
                dateRestrict: string;
                lowRange: string;
                highRange: string;
                fileType: string;
                rights: string;
                searchType: string;
                imgSize: string;
                imgType: string;
                imgColorType: string;
                imgDominantColor: string;
            },
        ];
        nextPage: [
            {
                title: string;
                totalResults: string;
                searchTerms: string;
                count: number;
                startIndex: number;
                startPage: number;
                language: string;
                inputEncoding: string;
                outputEncoding: string;
                safe: string;
                cx: string;
                sort: string;
                filter: string;
                gl: string;
                cr: string;
                googleHost: string;
                disableCnTwTranslation: string;
                hq: string;
                hl: string;
                siteSearch: string;
                siteSearchFilter: string;
                exactTerms: string;
                excludeTerms: string;
                linkSite: string;
                orTerms: string;
                relatedSite: string;
                dateRestrict: string;
                lowRange: string;
                highRange: string;
                fileType: string;
                rights: string;
                searchType: string;
                imgSize: string;
                imgType: string;
                imgColorType: string;
                imgDominantColor: string;
            },
        ];
    };
    promotions: GoogleSearchPromotionItem[];
    context: any;
    searchInformation: {
        searchTime: number;
        formattedSearchTime: string;
        totalResults: string;
        formattedTotalResults: string;
    };
    spelling: {
        correctedQuery: string;
        htmlCorrectedQuery: string;
    };
    items: GoogleSearchResultItem[];
}

export interface GoogleSearchPromotionItem {
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    bodyLines: [
        {
            title: string;
            htmlTitle: string;
            url: string;
            link: string;
        },
    ];
    image: {
        source: string;
        width: number;
        height: number;
    };
}

export interface GoogleSearchResultItem {
    kind: string;
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    snippet: string;
    htmlSnippet: string;
    cacheId: string;
    formattedUrl: string;
    htmlFormattedUrl: string;
    pagemap: any;
    mime: string;
    fileFormat: string;
    image: {
        contextLink: string;
        height: number;
        width: number;
        byteSize: number;
        thumbnailLink: string;
        thumbnailHeight: number;
        thumbnailWidth: number;
    };
    labels: [
        {
            name: string;
            displayName: string;
            label_with_op: string;
        },
    ];
}
