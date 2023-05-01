import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    const body = req.body;

    if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const checkExists = await database.team.findUnique({
        where: {
            id: body.id,
        },
    });

    if (!checkExists) {
        return res.status(400).json({ error: "Team doesn't exists." });
    }

    if (req.method == 'POST') {
        await database.teamMember.deleteMany({
            where: {
                teamId: body.id,
            },
        });

        await database.team.delete({
            where: {
                id: body.id,
            },
        });

        return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Invalid request' });
}
