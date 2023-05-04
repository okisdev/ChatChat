'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className='mx-auto flex h-screen flex-col items-center justify-center'>
            <div className='flex flex-col space-y-4 text-center'>
                <p className='text-lg font-bold'>404 Not Found</p>
                <p className='text-sm'>The source you requested is unavailable.</p>
                <Button variant='outline' onClick={() => router.push('/')}>
                    Back Home
                </Button>
            </div>
        </div>
    );
}
