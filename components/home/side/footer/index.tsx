'use client';

import { User } from '@prisma/client';

// import SideAppSettings from '@/components/home/side/footer/app-settings';
import UserLogin from '@/components/home/side/footer/user-login';
import AppInfo from '@/components/home/side/footer/app-info';
import UserDropdown from '@/components/home/side/footer/user-dropdown';
import MoreDropdown from '@/components/home/side/footer/more-dropdown';

const SideFooter = ({ user }: { user: User | null }) => {
    return (
        <div className='p-1'>
            {user && <UserDropdown user={user} />}
            <div className='flex flex-row items-center justify-between p-3'>
                <div className='flex space-x-2'>
                    {/* <SideAppSettings user={user} /> */}
                    {!user && <UserLogin />}
                </div>
                <div className='flex items-center space-x-2'>
                    <AppInfo />
                    <MoreDropdown />
                </div>
            </div>
        </div>
    );
};

export default SideFooter;
