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

    const { id } = req.query as { id: string };

    if (req.method === 'DELETE') {
        await database.record.delete({
            where: {
                id: id,
            },
        });

        return res.status(200).json({ success: 'Success' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
