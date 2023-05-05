import { getCurrentUser, getCurrentUserProfile } from '@/lib/auth/session';

import ProfileSettingsForm from '@/components/dashboard/profile-settings-form';

const ProfileSettingsPage = async () => {
    const userProfile = await getCurrentUserProfile();

    if (!userProfile) {
        return null;
    }

    return (
        <div className='flex items-center justify-center'>
            <ProfileSettingsForm user={userProfile} />
        </div>
    );
};

export default ProfileSettingsPage;
