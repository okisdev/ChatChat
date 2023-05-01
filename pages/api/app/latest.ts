import { NextApiRequest, NextApiResponse } from 'next';

import { getGitHubLatestVersion } from '@/utils/github/checkVersion';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { owner, repo } = req.query as { owner: string; repo: string };

    if (typeof owner !== 'string' || typeof repo !== 'string') {
        return res.status(300).json(await getGitHubLatestVersion({ owner: 'vercel', repo: 'next.js' }));
    }

    return res.status(200).json(await getGitHubLatestVersion({ owner, repo }));
}
