import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    // if (!session) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    // console.log(session);

    const accessCode = req.query.accessCode as string;

    if (!accessCode && accessCode == '') {
        return res.status(400).json({
            error: 'No access code provided',
        });
    }

    const team = await database.team.findUnique({
        where: {
            accessCode: accessCode,
        },
        select: {
            defaultServiceProvider: true,
            openAIKey: true,
            openAIEndpoint: true,
            azureAPIKey: true,
            azureAPIEndpoint: true,
            azureDeploymentName: true,
            claudeAPIKey: true,
        },
    });

    if (!team) {
        return res.status(400).json({ error: 'No record' });
    }

    return res.json({
        openAIKey: team.openAIKey,
        openAIEndpoint: team.openAIEndpoint,
        azureAPIKey: team.azureAPIKey,
        azureAPIEndpoint: team.azureAPIEndpoint,
        azureDeploymentName: team.azureDeploymentName,
        claudeAPIKey: team.claudeAPIKey,
        defaultServiceProvider: team.defaultServiceProvider,
    });
}
