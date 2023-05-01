import { getCurrentUser } from '@/lib/auth/session';

import ProfileInfoForm from '@/components/dashboard/profile-info-form';

const ProfilePage = async () => {
    const user = await getCurrentUser();

    if (!user) {
        return null;
    }

    return (
        <div className='flex items-center justify-center'>
            <ProfileInfoForm user={user} />
        </div>
    );
};

export default ProfilePage;
