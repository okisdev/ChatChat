export type Resources = TavilyResult[] | YouResult[];
export type Resource = TavilyResult | YouResult;

export interface TavilyResult {
    title: string;
    url: string;
    content: string;
}

export interface YouResult {
    title: string;
    url: string;
    description: string;
}
