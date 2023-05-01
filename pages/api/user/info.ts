import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions);

        const user = session?.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userInfo = await database.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                openAIKey: true,
                allowRecordCloudSync: true,
            },
        });

        return res.status(200).json({ user: userInfo });
    }
}
