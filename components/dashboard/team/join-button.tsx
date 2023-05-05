'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';

import { GrStatusGoodSmall } from 'react-icons/gr';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const JoinButton = () => {
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [accessCode, setAccessCode] = useState<string>('');

    const handleJoin = async () => {
        if (isLoading) {
            return;
        }

        if (accessCode.length === 0) {
            toast.error('Team access code is required');
            return;
        }

        setIsLoading(true);

        const response = await fetch('/api/team/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessCode: accessCode,
            }),
        });

        if (!response.ok) {
            setIsLoading(false);
            toast.error('Failed.');
            return;
        }

        const data = await response.json();

        if (!data.success) {
            setIsLoading(false);
            toast.error(data.error);
            return;
        }

        setIsLoading(false);
        toast.success('Joined.');

        setIsDialogOpen(false);

        router.refresh();
    };

    return (
        <div className='flex justify-end '>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline' className='flex items-center space-x-1 dark:border-stone-400'>
                        <GrStatusGoodSmall className='block text-lg' />
                        <span>Join Team</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Join a Team</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-3'>
                        <div className='space-y-1'>
                            <Label>Team Access Code</Label>
                            <Input placeholder='' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type='submit' onClick={handleJoin}>
                            Join
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JoinButton;
