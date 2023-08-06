import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    const user = session?.user;

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'POST') {
        const isAdmin = await database.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                role: true,
            },
        });

        if (isAdmin?.role !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const updateInfo = await database.site.update({
            where: {
                id: '1',
            },
            data: {
                azureDeploymentName: req.body.azureDeploymentName,
                azureEndpoint: req.body.azureEndpoint,
                azureAPIKey: req.body.azureAPIKey,
                claudeAPIKey: req.body.claudeAPIKey,
                cohereAPIKey: req.body.cohereAPIKey,
                huggingFaceAccessToken: req.body.huggingFaceAccessToken,
                openAIEndpoint: req.body.openAIEndpoint,
                openAIKey: req.body.openAIKey,
            },
        });

        return res.status(200).json({ name: 'John Doe', updateInfo });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
