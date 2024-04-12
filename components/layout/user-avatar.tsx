import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const UserAvatar = ({
    avatarUrl,
    avatarFallback,
    className,
}: Readonly<{
    avatarUrl?: string;
    avatarFallback?: string;
    className?: string;
}>) => {
    return (
        <Avatar className={className}>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{avatarFallback ?? 'NO'}</AvatarFallback>
        </Avatar>
    );
};
