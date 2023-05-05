'use client';

import Image from 'next/image';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { IoArrowBackOutline } from 'react-icons/io5';
import { siteConfig } from '@/config/site.config';

const AuthHeader = () => {
    const router = useRouter();

    return (
        <div className='flex h-36 w-full flex-row items-center justify-between'>
            <Button variant='secondary' className='inline-flex items-center space-x-2 dark:bg-stone-600' onClick={() => router.push('/')}>
                <IoArrowBackOutline />
                <span>Home</span>
            </Button>
            <div className='flex flex-row items-center md:hidden'>
                <Image src='/hero.png' alt={siteConfig.title} width={60} height={60} priority />
                <p className='text-center text-xl font-medium'>{siteConfig.title}</p>
            </div>
        </div>
    );
};

export default AuthHeader;
