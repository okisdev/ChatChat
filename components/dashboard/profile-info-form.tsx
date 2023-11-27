'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { User } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { signOut } from 'next-auth/react';

const ProfileInfoForm = ({ user }: any) => {
    const router = useRouter();

    const t = useTranslations('');

    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user.email);
    const [image, setImage] = useState<string>(user.image);

    const [isLoading, setIsLoading] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onSave = async () => {
        setIsLoading(true);

        const response = await fetch(`/api/user/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                image: image,
            }),
        });

        if (!response?.ok) {
            setIsLoading(false);
            toast.error(t('error_something_wrong'));
            return;
        }

        setIsLoading(false);
        toast.success(t('profile_update'));
    };

    const onDelete = async () => {
        const response = await fetch(`/api/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response?.ok) {
            toast.error(t('error_something_wrong'));
            return;
        }

        toast.success(t('account_deleted'));

        await signOut();

        router.push('/');
    };

    return (
        <div className='space-y-10 overflow-auto md:my-36 md:w-10/12 md:space-y-16 xl:w-6/12'>
            <form className='space-y-10 rounded-xl md:p-3'>
                <div className='flex w-full justify-between space-x-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>{t('full_name')}</p>
                        <Input value={name} onChange={(e) => setName(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>{t('email_address')}</p>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                </div>
                <div className='flex w-full flex-col items-start space-y-1'>
                    <p className='text-sm'>{t('avatar')}</p>
                    <Input value={image} onChange={(e) => setImage(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                </div>
                <div className='flex justify-end'>
                    <Button variant='default' onClick={() => onSave()} disabled={isLoading}>
                        <span>{t('save')}</span>
                    </Button>
                </div>
            </form>

            <Separator />

            <div className='space-y-3'>
                <p className='text-lg font-medium'>{t('danger_zoom')}</p>
                <p className='text-sm text-gray-400'>
                    {t('remove_account')}. {t('Please click the button below, please note, This could not be undone')}
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className='text-sm text-red-500'>{t('delete_account')}</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('confirm_delete')}</DialogTitle>
                            <DialogDescription>{t('note_can_not_undone')}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant='destructive' onClick={onDelete}>
                                {t('confirm')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfileInfoForm;
