'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Team } from '@prisma/client';

import { toast } from 'react-hot-toast';

import { MdOutlineEdit, MdDelete, MdExitToApp } from 'react-icons/md';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const TeamCard = ({ team }: { team: Team & { isAuthor: boolean } }) => {
    const router = useRouter();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);

    // Team Info
    const [name, setName] = useState(team.name);
    const [accessCode, setAccessCode] = useState(team.accessCode);
    const [openAIKey, setOpenAIKey] = useState(team.openAIKey);
    const [openAIEndpoint, setOpenAIEndpoint] = useState(team.openAIEndpoint);

    const deleteTeam = async () => {
        const response = await fetch('/api/team/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: team.id,
            }),
        });

        if (!response.ok) {
            toast.error('Failed to delete team');
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error('Failed to delete team');
            return;
        }

        toast.success('Team deleted');

        setIsDeleteDialogOpen(false);

        router.refresh();
    };

    const onQuit = async () => {
        const response = await fetch('/api/team/quit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamId: team.id,
            }),
        });

        if (!response.ok) {
            toast.error('Failed to delete team');
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error('Failed to delete team');
            return;
        }

        toast.success('Quit.');

        setIsQuitDialogOpen(false);

        router.refresh();
    };

    const onSave = async () => {
        const response = await fetch(`/api/team/${team.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                accessCode: accessCode,
                openAIKey: openAIKey,
                openAIEndpoint: openAIEndpoint,
            }),
        });

        if (!response.ok) {
            toast.error('Failed to update team');
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error('Failed to update team');
            return;
        }

        toast.success('Team updated');

        setIsEditDialogOpen(false);

        router.refresh();
    };

    return (
        <div className='flex items-center justify-between rounded-xl border p-3 dark:border-stone-400'>
            <div>
                <p className='font-medium'>{team.name}</p>
                <p>{team.accessCode}</p>
            </div>
            {!team.isAuthor ? (
                <div>
                    <Dialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant='outline' disabled={team.isAuthor}>
                                <MdExitToApp className='text-xl' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm to quit Team {team.name}?</DialogTitle>
                                <DialogDescription>This action cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='destructive' onClick={onQuit}>
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <div className='space-x-3'>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant='outline' disabled={!team.isAuthor}>
                                <MdOutlineEdit className='text-xl' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Team: {team.name}</DialogTitle>
                            </DialogHeader>
                            <div className='space-y-3'>
                                <div className='flex flex-col space-y-2'>
                                    <Label htmlFor='name'>Name</Label>
                                    <Input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <Label htmlFor='name'>Access Code</Label>
                                    <Input type='text' value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <Label htmlFor='name'>OpenAI Key</Label>
                                    <Input type='text' value={openAIKey || ''} onChange={(e) => setOpenAIKey(e.target.value)} />
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <Label htmlFor='name'>OpenAI Endpoint</Label>
                                    <Input type='text' value={openAIEndpoint || ''} onChange={(e) => setOpenAIEndpoint(e.target.value)} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant='outline' onClick={onSave}>
                                    Save
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant='destructive' disabled={!team.isAuthor}>
                                <MdDelete className='text-xl' />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm to delete Team {team.name}?</DialogTitle>
                                <DialogDescription>This action cannot be undone. This will permanently delete your team and remove your data from our database.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='destructive' onClick={deleteTeam}>
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
};

export default TeamCard;
