import { Home } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='space-y-6 text-center'>
        <div className='space-y-2'>
          <h1 className='font-bold text-8xl text-muted-foreground/40'>404</h1>
          <h2 className='font-medium text-xl'>Page not found</h2>
          <p className='text-muted-foreground text-sm'>
            The page you're looking for doesn't exist.
          </p>
        </div>

        <div className='flex justify-center gap-3'>
          <Button asChild>
            <Link href='/'>
              <Home className='mr-2 h-4 w-4' />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
