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
            accessCode: body.accessCode,
        },
        select: {
            accessCode: true,
        },
    });

    if (checkExists) {
        return res.status(400).json({ error: 'Team already exists' });
    }

    if (req.method == 'POST') {
        const createTeam = await database.team.create({
            data: {
                name: body.name,
                accessCode: body.accessCode,
                openAIKey: body.openAIKey,
                openAIEndpoint: body.openAIEndpoint,
                azureAPIKey: body.azureAPIKey,
                azureAPIEndpoint: body.azureEndpoint,
                azureDeploymentName: body.azureDeploymentName,
                claudeAPIKey: body.claudeAPIKey,
                authorId: session.user.id,
            },
            select: {
                id: true,
                accessCode: true,
            },
        });

        const joinTeam = await database.teamMember.create({
            data: {
                teamId: createTeam.id,
                userId: session.user.id,
            },
            select: {
                id: true,
            },
        });

        return res.status(200).json({ success: 'Success', create_id: createTeam, join_id: joinTeam });
    }

    return res.status(400).json({ error: 'Invalid request' });
}
