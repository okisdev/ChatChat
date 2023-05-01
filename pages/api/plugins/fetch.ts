import { NextApiRequest, NextApiResponse } from 'next';

import { fetchContent } from '@/utils/plugins/fetch_content';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url } = req.query as {
        url: string;
    };

    if (!url) {
        return res.status(400).json({ error: 'Missing URL' });
    }

    const content = await fetchContent(url);

    return res.status(200).json({ content });
}
