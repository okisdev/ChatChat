'use client';

import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { AppSidebar } from '@/components/app/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

// Regex to match locale paths (e.g., /en, /es, /fr)
const LOCALE_PATH_REGEX = /^\/[a-z]{2}(\/)?$/;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the home page (root path after locale)
  const isHomePage = pathname === '/' || pathname.match(LOCALE_PATH_REGEX);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-12 shrink-0 items-center gap-2'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              className='mr-2 data-[orientation=vertical]:h-4'
              orientation='vertical'
            />
            {!isHomePage && (
              <Button
                className='size-7'
                onClick={() => router.back()}
                size='sm'
                variant='ghost'
              >
                <ArrowLeft className='size-4' />
                <span className='sr-only'>Go back</span>
              </Button>
            )}
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
