import LandingSide from '@/components/landing/side/side';

import { getCurrentUserProfile } from '@/lib/auth/session';

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
    const userProfile = await getCurrentUserProfile();

    return (
        <div>
            <LandingSide user={userProfile} className='hidden md:flex' />
            <div>{children}</div>
        </div>
    );
}
