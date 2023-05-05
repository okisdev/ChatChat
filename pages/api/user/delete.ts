import { NextApiRequest, NextApiResponse } from 'next';

import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { database } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const session = await getServerSession(req, res, authOptions);

        const user = session?.user;

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const checkIfUserExist = await database.user.findUnique({
            where: {
                id: user.id,
            },
            select: {
                id: true,
            },
        });

        if (!checkIfUserExist) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete all related data
        await database.record.deleteMany({
            where: {
                authorId: user.id,
            },
        });

        await database.share.deleteMany({
            where: {
                userId: user.id,
            },
        });

        await database.teamMember.deleteMany({
            where: {
                userId: user.id,
            },
        });

        await database.user.delete({
            where: {
                id: user.id,
            },
        });

        return res.status(200).json({ success: true });
    } else {
        res.setHeader('Allow', 'DELETE');
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
