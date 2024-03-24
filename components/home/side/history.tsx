'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import { TiPinOutline, TiDeleteOutline, TiBrush } from 'react-icons/ti';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SideHistory = () => {
    const router = useRouter();

    const t = useTranslations('');

    const [userInput, setUserInput] = useState<string>('');

    const [histories, setHistories] = useState<HistoryProps[]>([]);
    const [pinHistories, setPinHistories] = useState<HistoryProps[]>([]);

    useEffect(() => {
        const updateHistories = () => {
            const conversationKeys = Object.keys(localStorage).filter((key) => key.startsWith('histories-'));

            const conversationValues = conversationKeys.map((key) => {
                const chatValue = localStorage.getItem(key);
                return JSON.parse(chatValue || '{}');
            });

            setHistories(conversationValues);
        };

        updateHistories();

        window.addEventListener('localStorageUpdated', updateHistories);

        return () => {
            window.removeEventListener('localStorageUpdated', updateHistories);
        };
    }, []);

    const onHistoryPin = (id: string) => {
        setPinHistories((prev) => [...prev, histories?.find((history) => history.id == id) as HistoryProps]);
    };

    const onHistoryUnpin = (id: string) => {
        setPinHistories((prev) => prev.filter((history) => history.id != id));
    };

    const [newTitle, setNewTitle] = useState<string | null>(null);
    const [titleDialogOpen, setTitleDialogOpen] = useState<boolean>(false);

    const onSaveTitleChange = (id: string, type: string, title: string) => {
        if (newTitle !== title) {
            const history = localStorage.getItem(`histories-${type}-${id}`);

            if (history) {
                const historyObj = JSON.parse(history);
                historyObj.title = newTitle;
                localStorage.setItem(`histories-${type}-${id}`, JSON.stringify(historyObj));
                toast.success(t('Title changed'));

                const updateEvent = new CustomEvent('localStorageUpdated');
                window.dispatchEvent(updateEvent);
            }

            setTitleDialogOpen(false);
            setNewTitle(null);
        }
    };

    const onHistoryDelete = (id: string, type: string) => {
        localStorage.removeItem(`histories-${type}-${id}`);
        toast.success(t('History deleted'));

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
    };

    const onShareClick = async (type: string, id: string) => {
        const story = localStorage.getItem(`histories-${type}-${id}`) as string;

        if (!story) {
            toast.error(t('Error: Conversation not found'));
            return;
        }

        const response = await fetch(`/api/share`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                story,
            }),
        });

        if (!response.ok) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error(t('Error: Something went wrong'));
            return;
        }

        if (data.type == 'update') {
            navigator.clipboard.writeText(window.location.host + `/s/${id}`);
            toast.success(`${t('Updated the previous share:')} ${id}`);
            return;
        }

        navigator.clipboard.writeText(window.location.host + `/s/${id}`);
        toast.success(`${t('Copied share link:')} ${id}`);
    };

    const searchedHistories =
        userInput !== ''
            ? histories.filter((history) => history.title.toLowerCase().includes(userInput.toLowerCase())).sort((a, b) => b.timestamp - a.timestamp)
            : histories.filter((history) => !pinHistories.some((pinHistory) => pinHistory.id === history.id)).sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className='space-y-2 px-2'>
            <Input
                placeholder={t('Search History')}
                value={userInput}
                onChange={(e) => {
                    setUserInput(e.target.value);
                }}
                className='bg-neutral-100 dark:bg-neutral-700'
            />
            <div className='h-96 w-full space-y-1 overflow-auto md:h-64'>
                {pinHistories.map((pinHistory) => {
                    return (
                        <div
                            key={'pin-' + pinHistory.id}
                            className='flex w-full select-none items-center justify-between rounded bg-blue-100 p-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-stone-700'
                        >
                            <div className='inline-flex items-center space-x-2'>
                                <button className='block' onClick={() => onHistoryUnpin(pinHistory.id)}>
                                    <TiPinOutline className='fill-blue-500 text-lg' />
                                </button>
                                {pinHistory.type == 'chat' ? (
                                    <button className='max-w-[150px]' onClick={() => router.push(`/mode/${pinHistory.type}?history=${pinHistory.id}`)}>
                                        <p className='overflow-hidden truncate text-sm'>{pinHistory.title}</p>
                                    </button>
                                ) : (
                                    <div className='max-w-[150px]'>
                                        <p className='overflow-hidden truncate text-sm'>{pinHistory.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center space-x-1'>
                                <button className='rounded border border-blue-300 px-0.5 text-xs' onClick={() => onShareClick(pinHistory.type, pinHistory.id)}>
                                    {pinHistory.type}
                                </button>
                                <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button className='block'>
                                            <TiBrush className='text-lg transition duration-500 ease-in-out hover:fill-green-500' />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-[425px]'>
                                        <DialogHeader>
                                            <DialogTitle>Edit Title</DialogTitle>
                                        </DialogHeader>
                                        <div className='flex items-center'>
                                            <Input type='text' defaultValue={pinHistory.title} onChange={(e) => setNewTitle(e.target.value)} />
                                        </div>
                                        <DialogFooter>
                                            <Button type='submit' onClick={() => onSaveTitleChange(pinHistory.id, pinHistory.type, pinHistory.title)}>
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <button className='block' onClick={() => onHistoryDelete(pinHistory.id, pinHistory.type)}>
                                    <TiDeleteOutline className='text-lg transition duration-500 ease-in-out hover:fill-red-500' />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {searchedHistories.map((history) => {
                    return (
                        <div
                            key={history.id}
                            className='flex w-full select-none items-center justify-between rounded p-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-700'
                        >
                            <div className='inline-flex items-center space-x-2'>
                                <button className='block' onClick={() => onHistoryPin(history.id)}>
                                    <TiPinOutline className='text-lg hover:fill-blue-500' />
                                </button>
                                {history.type == 'chat' ? (
                                    <button className='max-w-[150px]' onClick={() => router.push(`/mode/${history.type}?history=${history.id}`)}>
                                        <p className='overflow-hidden truncate text-sm'>{history.title}</p>
                                    </button>
                                ) : (
                                    <div className='max-w-[150px]'>
                                        <p className='overflow-hidden truncate text-sm'>{history.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center space-x-1'>
                                <button className='rounded border border-blue-300 px-0.5 text-xs' onClick={() => onShareClick(history.type, history.id)}>
                                    {history.type}
                                </button>
                                <Dialog open={titleDialogOpen} onOpenChange={setTitleDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button className='block'>
                                            <TiBrush className='text-lg transition duration-500 ease-in-out hover:fill-green-500' />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className='sm:max-w-[425px]'>
                                        <DialogHeader>
                                            <DialogTitle>Edit Title</DialogTitle>
                                        </DialogHeader>
                                        <div className='flex items-center'>
                                            <Input type='text' defaultValue={history.title} onChange={(e) => setNewTitle(e.target.value)} />
                                        </div>
                                        <DialogFooter>
                                            <Button type='submit' onClick={() => onSaveTitleChange(history.id, history.type, history.title)}>
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <button className='block' onClick={() => onHistoryDelete(history.id, history.type)}>
                                    <TiDeleteOutline className='text-lg transition duration-500 ease-in-out hover:fill-red-500' />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SideHistory;
