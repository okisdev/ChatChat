'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the home page (root path after locale)
  const isHomePage = pathname === '/';
  const canForward = pathname !== '/';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='flex h-[calc(100svh-1rem)] flex-col'>
        <header className='flex h-12 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              className='mr-2 data-[orientation=vertical]:h-4'
              orientation='vertical'
            />
            {!isHomePage && (
              <>
                <Button
                  className='size-7'
                  onClick={() => router.back()}
                  size='sm'
                  variant='ghost'
                >
                  <ArrowLeft className='size-4' />
                  <span className='sr-only'>Go back</span>
                </Button>
                {canForward && (
                  <Button
                    className='size-7'
                    onClick={() => router.forward()}
                    size='sm'
                    variant='ghost'
                  >
                    <ArrowRight className='size-4' />
                    <span className='sr-only'>Go forward</span>
                  </Button>
                )}
              </>
            )}
          </div>
        </header>
        <main className='min-h-0 flex-1 overflow-hidden'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
