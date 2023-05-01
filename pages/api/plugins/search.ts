import { NextApiRequest, NextApiResponse } from 'next';

import { getSearchFromGoogleProgrammableSearchEngine } from '@/utils/plugins/search';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchAPIKey, searchEngineID, query } = req.query as {
        searchAPIKey: string;
        searchEngineID: string;
        query: string;
    };

    const search = await getSearchFromGoogleProgrammableSearchEngine(searchAPIKey, searchEngineID, query);

    return res.status(200).json({ search });
}
