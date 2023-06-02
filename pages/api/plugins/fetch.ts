import { NextApiRequest, NextApiResponse } from 'next';

import { fetchContent } from '@/utils/plugins/fetch_content';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query as {
        url: string;
    };

    if (!url) {
        return res.status(400).json({ status: 400, error: 'Missing URL' });
    }

    const content = await fetchContent(url);

    if (!content) {
        return res.status(404).json({ status: 404, error: 'No content found' });
    }

    return res.status(200).json({ status: 200, content });
}
