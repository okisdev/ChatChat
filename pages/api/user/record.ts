import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions);

        const user = session?.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const checkIfEnableSync = await database.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                allowRecordCloudSync: true,
            },
        });

        if (!checkIfEnableSync) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const checkIfExist = await database.record.findUnique({
            where: {
                id: req.body.id,
            },
            select: {
                id: true,
            },
        });

        const body = req.body;

        if (checkIfExist) {
            const updateRecord = await database.record.update({
                where: {
                    id: body.id,
                },
                data: {
                    title: body.title,
                    content: body.messages,
                    share: false,
                    updatedAt: new Date(body.timestamp),
                },
                select: {
                    id: true,
                },
            });

            return res.status(200).json({ success: 'update', id: updateRecord });
        }

        const createRecord = await database.record.create({
            data: {
                id: body.id,
                type: body.type,
                title: body.title,
                content: body.messages,
                share: false,
                createdAt: new Date(body.timestamp),
                updatedAt: new Date(body.timestamp),
                authorId: user.id,
            },
            select: {
                id: true,
            },
        });

        return res.status(200).json({ success: 'create', id: createRecord });
    }
}
