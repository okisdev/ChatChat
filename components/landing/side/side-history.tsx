'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import { TfiMoreAlt } from 'react-icons/tfi';
import { BiImport, BiExport, BiBrush } from 'react-icons/bi';
import { TiPinOutline, TiDeleteOutline, TiBrush } from 'react-icons/ti';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const SideHistory = () => {
    const router = useRouter();

    const t = useTranslations('landing');

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

    const onTitleChange = (id: string, type: string) => {
        const newTitle = prompt(t('Enter new title'));

        if (newTitle) {
            const history = localStorage.getItem(`histories-${type}-${id}`);
            if (history) {
                const historyObj = JSON.parse(history);
                historyObj.title = newTitle;
                localStorage.setItem(`histories-${type}-${id}`, JSON.stringify(historyObj));
                toast.success(t('Title changed'));
            }
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

    const handleExportHistory = () => {
        const data = histories.map((item) => {
            return item;
        });

        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const download = document.createElement('a');

        download.href = url;
        download.download = `chatchat-history-${new Date().getTime()}.json`;
        download.click();
    };

    const handleImportHistory = () => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = 'application/json';
        input.click();

        input.onchange = () => {
            const file = input.files?.[0];

            if (file) {
                const reader = new FileReader();

                reader.readAsText(file, 'UTF-8');

                reader.onload = (e) => {
                    const result = e.target?.result;

                    if (result) {
                        const data = JSON.parse(result as string);

                        if (data) {
                            data.forEach((item: HistoryProps) => {
                                localStorage.setItem(`histories-${item.type}-${item.id}`, JSON.stringify(item));
                            });

                            toast.success(t('Imported history successfully!'));
                        }
                    }
                };
            }

            const updateEvent = new CustomEvent('localStorageUpdated');
            window.dispatchEvent(updateEvent);
        };
    };

    const handleClearHistory = () => {
        const chatKeys = Object.keys(localStorage).filter((key) => key.startsWith('histories-'));

        chatKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        setHistories([]);

        toast.success(t('Cleared history successfully!'));

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
    };

    const searchedHistories =
        userInput !== ''
            ? histories.filter((history) => history.title.toLowerCase().includes(userInput.toLowerCase())).sort((a, b) => b.timestamp - a.timestamp)
            : histories.filter((history) => !pinHistories.some((pinHistory) => pinHistory.id === history.id)).sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className='space-y-2 px-2'>
            <div className='flex flex-row space-x-2'>
                <Input
                    placeholder={t('Search History')}
                    value={userInput}
                    onChange={(e) => {
                        setUserInput(e.target.value);
                    }}
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant='ghost' className='inline-flex items-center'>
                            <TfiMoreAlt />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('History')}</DialogTitle>
                        </DialogHeader>
                        <div className='flex flex-col space-y-3'>
                            <div className='flex space-x-3'>
                                <Button variant='secondary' className='flex items-center space-x-0.5' onClick={handleExportHistory}>
                                    <BiExport />
                                    <span>{t('Export')}</span>
                                </Button>
                                <Button variant='secondary' className='flex items-center space-x-0.5' onClick={handleImportHistory}>
                                    <BiImport />
                                    <span>{t('Import')}</span>
                                </Button>
                                <Button variant='destructive' className='flex items-center space-x-0.5' onClick={handleClearHistory}>
                                    <BiBrush />
                                    <span>{t('Clear')}</span>
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='h-96 w-full space-y-1 overflow-auto md:h-64'>
                {pinHistories.map((pinHistory) => {
                    return (
                        <div
                            key={'pin-' + pinHistory.id}
                            className='flex w-full select-none items-center justify-between rounded bg-blue-100 p-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:bg-slate-500 dark:hover:bg-stone-700'
                        >
                            <div className='inline-flex items-center space-x-2'>
                                <button className='block' onClick={() => onHistoryUnpin(pinHistory.id)}>
                                    <TiPinOutline className='fill-blue-500 text-lg' />
                                </button>
                                {pinHistory.type == 'chat' ? (
                                    <button className='max-w-[150px]' onClick={() => router.push(`/mode/${pinHistory.type}?history=${pinHistory.id}`)}>
                                        <p className='overflow-hidden truncate text-ellipsis text-sm'>{pinHistory.title}</p>
                                    </button>
                                ) : (
                                    <div className='max-w-[150px]'>
                                        <p className='overflow-hidden truncate text-ellipsis text-sm'>{pinHistory.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center space-x-1'>
                                <button className='rounded border border-blue-300 px-0.5 text-xs' onClick={() => onShareClick(pinHistory.type, pinHistory.id)}>
                                    {pinHistory.type}
                                </button>
                                <button className='block' onClick={() => onTitleChange(pinHistory.id, pinHistory.type)}>
                                    <TiBrush className='text-lg hover:fill-green-500' />
                                </button>
                                <button className='block' onClick={() => onHistoryDelete(pinHistory.id, pinHistory.type)}>
                                    <TiDeleteOutline className='text-lg hover:fill-red-500' />
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
                                        <p className='overflow-hidden truncate text-ellipsis text-sm'>{history.title}</p>
                                    </button>
                                ) : (
                                    <div className='max-w-[150px]'>
                                        <p className='overflow-hidden truncate text-ellipsis text-sm'>{history.title}</p>
                                    </div>
                                )}
                            </div>
                            <div className='flex items-center space-x-1'>
                                <button className='rounded border border-blue-300 px-0.5 text-xs' onClick={() => onShareClick(history.type, history.id)}>
                                    {history.type}
                                </button>
                                <button className='block' onClick={() => onTitleChange(history.id, history.type)}>
                                    <TiBrush className='text-lg hover:fill-green-500' />
                                </button>
                                <button className='block' onClick={() => onHistoryDelete(history.id, history.type)}>
                                    <TiDeleteOutline className='text-lg hover:fill-red-500' />
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
