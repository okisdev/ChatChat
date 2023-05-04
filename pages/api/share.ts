import { NextApiRequest, NextApiResponse } from 'next';

import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const body = req.body;

        const parseStory: HistoryProps = JSON.parse(body.story);

        if (!database) {
            return res.status(500).json({ error: 'Database not found' });
        }

        const existingShare = await database.share.findUnique({
            where: {
                id: parseStory.id,
            },
        });

        if (existingShare) {
            const updateShare = await database.share.update({
                where: {
                    id: parseStory.id,
                },
                data: {
                    id: parseStory.id,
                    type: parseStory.type,
                    title: parseStory.title,
                    content: parseStory.messages,
                    createdAt: new Date(parseStory.timestamp),
                    share: true,
                },
                select: {
                    id: true,
                },
            });

            return res.status(200).json({ success: 'Success', type: 'update', id: updateShare });
        }

        const createShare = await database.share.create({
            data: {
                id: parseStory.id,
                type: parseStory.type,
                title: parseStory.title,
                content: parseStory.messages,
                createdAt: new Date(parseStory.timestamp),
                share: true,
            },
            select: {
                id: true,
            },
        });

        return res.status(200).json({ success: 'Success', type: 'create', id: createShare });
    } else {
        return res.status(400).json({ error: 'Invalid request' });
    }
}
