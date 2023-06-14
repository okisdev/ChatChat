import { database } from '@/lib/database';
import { getCurrentUser } from '@/lib/auth/session';

import { Team } from '@prisma/client';

import TeamCard from '@/components/dashboard/team/card';
import JoinButton from '@/components/dashboard/team/join-button';
import CreateButton from '@/components/dashboard/team/create-button';

const getTeamsByAuthorId = async (authorId: string) => {
    return await database.team.findMany({
        where: {
            authorId: authorId,
        },
    });
};

const getTeamsByMemberId = async (memberId: string) => {
    return await database.team.findMany({
        where: {
            members: {
                some: {
                    userId: memberId,
                },
            },
        },
    });
};

const ProfileTeamInfoPage = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return null;
    }

    const teamsByAuthor = await getTeamsByAuthorId(currentUser.id);

    const teamsByMember = await getTeamsByMemberId(currentUser.id);

    const allTeams = Array.from(new Set([...teamsByAuthor, ...teamsByMember].map((team) => team.id))).map((id) => {
        const team = teamsByAuthor.find((team) => team.id === id) || teamsByMember.find((team) => team.id === id);
        const isAuthor = (team && team.authorId === currentUser.id) || false;
        return { ...team, isAuthor };
    }) as (Team & { isAuthor: boolean })[];

    return (
        <div className='space-y-3'>
            <div className='flex items-center justify-end space-x-3'>
                <JoinButton />
                <CreateButton />
            </div>
            <div className='space-y-3'>
                {allTeams.length > 0 ? allTeams.map((team, index) => <TeamCard key={index} team={team} />) : <p className='flex items-center justify-center text-gray-500'>No teams found</p>}
            </div>
        </div>
    );
};

export default ProfileTeamInfoPage;
