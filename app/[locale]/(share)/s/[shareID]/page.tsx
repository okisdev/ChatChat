import { notFound } from 'next/navigation';

import { database } from '@/lib/database';

import { Share } from '@prisma/client';

import SharePost from '@/components/share/post';

const getShareByShareID = async (shareID: Share['id']) => {
    return await database.share.findFirst({
        where: {
            id: shareID,
        },
    });
};

export default async function SharePage({ params }: { params: { shareID: string } }) {
    const share = await getShareByShareID(params.shareID);

    if (!share) {
        notFound();
    }

    return (
        <div className='mx-1 flex h-full flex-col items-center md:container md:mx-auto'>
            <SharePost
                share={{
                    id: share.id,
                    type: share.type,
                    title: share.title,
                    content: share.content,
                    share: share.share,
                    createdAt: share.createdAt,
                }}
            />
        </div>
    );
}
