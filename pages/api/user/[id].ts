import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PATCH') {
        const session = await getServerSession(req, res, authOptions);

        const user = session?.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const body = req.body;

        await database.user.update({
            where: {
                id: user.id,
            },
            data: {
                name: body.name,
                email: body.email,
                image: body.image,
                openAIKey: body.openAIKey,
                allowRecordCloudSync: body.allowRecordCloudSync,
            },
        });

        return res.status(200).json({ success: 'Success' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
