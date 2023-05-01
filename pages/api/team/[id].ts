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

        const checkIfUserIsInTeam = await database.teamMember.findUnique({
            where: {
                teamId_userId: {
                    teamId: req.query.id as string,
                    userId: user.id,
                },
            },
        });

        if (!checkIfUserIsInTeam) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const body = req.body;

        await database.team.update({
            where: {
                id: req.query.id as string,
            },
            data: {
                name: body.name,
                accessCode: body.accessCode,
                openAIKey: body.openAIKey,
                openAIEndpoint: body.openAIEndpoint,
            },
        });

        return res.status(200).json({ success: 'Success' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
