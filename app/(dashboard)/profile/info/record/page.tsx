import { redirect } from 'next/navigation';

import { User } from '@prisma/client';

import { database } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth/session';

import RecordCard from '@/components/dashboard/record/card';
import RecordButton from '@/components/dashboard/record/button';

const getRecordsByUser = async (id: User['id']) => {
    return await database.record.findMany({
        where: {
            authorId: id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

const ProfileRecordPage = async () => {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const records = await getRecordsByUser(user.id);

    return (
        <div className='space-y-3'>
            <RecordButton records={records} />
            <div className='space-y-3'>
                {records.length > 0 ? (
                    records.map((record, index) => {
                        return <RecordCard key={index} record={record} />;
                    })
                ) : (
                    <p className='flex items-center justify-center text-gray-500'>No conversation records found</p>
                )}
            </div>
        </div>
    );
};

export default ProfileRecordPage;
