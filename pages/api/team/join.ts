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

    const checkTeamExists = await database.team.findUnique({
        where: {
            accessCode: body.accessCode,
        },
        select: {
            id: true,
            accessCode: true,
        },
    });

    if (!checkTeamExists) {
        return res.status(400).json({ error: 'Team does not exist' });
    }

    if (req.method == 'POST') {
        const checkMembership = await database.teamMember.findFirst({
            where: {
                teamId: checkTeamExists.id,
                userId: session.user.id,
            },
        });

        if (checkMembership) {
            return res.status(400).json({ error: 'User already a member of the team' });
        }

        const joinTeam = await database.teamMember.create({
            data: {
                teamId: checkTeamExists.id,
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        });

        return res.status(200).json({ success: 'Success', id: joinTeam });
    }

    return res.status(400).json({ error: 'Invalid request' });
}
