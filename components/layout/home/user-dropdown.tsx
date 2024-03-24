import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default function UserDropdown() {
    const router = useRouter();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex w-8/12 items-center justify-start space-x-3 rounded-md px-1 py-0.5 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60'>
                <UserAvatar avatarUrl='' avatarFallback='AN' />
                <p>Anonymous</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mx-3 w-56'>
                <DropdownMenuItem onClick={() => router.push('/auth/login')} className='cursor-pointer'>
                    Auth
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
