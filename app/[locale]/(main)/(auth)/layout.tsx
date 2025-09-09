'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth.client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (!isPending && session) {
      router.push('/');
    }
  }, [session, isPending, router]);

  // Show loading while checking authentication status
  if (isPending) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          <p className='mt-2 text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth pages if user is already authenticated
  if (session) {
    return null;
  }

  return <div className='min-h-screen'>{children}</div>;
}
