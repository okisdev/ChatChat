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

    const t = useTranslations('dashboard');

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
            toast.error(t('Error: Something went wrong'));
            return;
        }

        setIsLoading(false);
        toast.success(t('Profile updated'));
    };

    const onDelete = async () => {
        const response = await fetch(`/api/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response?.ok) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        toast.success(t('Account deleted'));

        await signOut();

        router.push('/');
    };

    return (
        <div className='space-y-10 overflow-auto md:my-36 md:w-10/12 md:space-y-16 xl:w-6/12'>
            <form className='space-y-10 rounded-xl md:p-3'>
                <div className='flex w-full justify-between space-x-3'>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>{t('Full Name')}</p>
                        <Input value={name as string} onChange={(e) => setName(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                    <div className='flex w-full flex-col items-start space-y-1'>
                        <p className='text-sm'>{t('Email Address')}</p>
                        <Input value={email as string} onChange={(e) => setEmail(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                    </div>
                </div>
                <div className='flex w-full flex-col items-start space-y-1'>
                    <p className='text-sm'>{t('Avatar')}</p>
                    <Input value={image as string} onChange={(e) => setImage(e.target.value)} className='dark:border-stone-400 dark:bg-stone-500' />
                </div>
                <div className='flex justify-end'>
                    <Button variant='default' onClick={() => onSave()} disabled={isLoading}>
                        <span>{t('Save')}</span>
                    </Button>
                </div>
            </form>

            <Separator />

            <div className='space-y-3'>
                <p className='text-lg font-medium'>{t('Danger Zoom')}</p>
                <p className='text-sm text-gray-400'>
                    {t('If you want to permanently remove your account')}. {t('Please click the button below, please note, This could not be undone')}
                </p>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <button className='text-sm text-red-500'>{t('Delete Account')}</button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Confirming Deletion')}</DialogTitle>
                            <DialogDescription>{t('Please note: This could not be undone')}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant='destructive' onClick={onDelete}>
                                {t('Confirm')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ProfileInfoForm;
