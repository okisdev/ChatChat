'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

import { toast } from 'react-hot-toast';

import { TiPinOutline, TiDeleteOutline, TiBrush } from 'react-icons/ti';

import { Input } from '@/components/ui/input';

const SideHistory = () => {
    const router = useRouter();

    const t = useTranslations('landing.side');

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
        const newTitle = prompt('Enter new title');

        if (newTitle) {
            const history = localStorage.getItem(`histories-${type}-${id}`);
            if (history) {
                const historyObj = JSON.parse(history);
                historyObj.title = newTitle;
                localStorage.setItem(`histories-${type}-${id}`, JSON.stringify(historyObj));
                toast.success('Title changed');
            }
        }
    };

    const onHistoryDelete = (id: string, type: string) => {
        localStorage.removeItem(`histories-${type}-${id}`);
        toast.success('History deleted');

        const updateEvent = new CustomEvent('localStorageUpdated');
        window.dispatchEvent(updateEvent);
    };

    const onShareClick = async (type: string, id: string) => {
        const story = localStorage.getItem(`histories-${type}-${id}`) as string;

        if (!story) {
            toast.error('Error: Story not found');
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
            if (response.status === 409) {
                navigator.clipboard.writeText(window.location.host + `/s/${id}`);
                toast.error(`Share already exists: ${id}`);
                return;
            }
            toast.error('Error: Something went wrong');
            return;
        }

        const data = await response.json();

        if (!data.success) {
            toast.error('Error: Something went wrong');
            return;
        }

        navigator.clipboard.writeText(window.location.host + `/s/${id}`);
        toast.success(`Share: ${id} link copied`);
    };

    const searchedHistories =
        userInput !== ''
            ? histories.filter((history) => history.title.toLowerCase().includes(userInput.toLowerCase())).sort((a, b) => b.timestamp - a.timestamp)
            : histories.filter((history) => !pinHistories.some((pinHistory) => pinHistory.id === history.id)).sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className='space-y-2 px-2'>
            <div>
                <Input
                    placeholder={t('Search History')}
                    value={userInput}
                    onChange={(e) => {
                        setUserInput(e.target.value);
                    }}
                />
            </div>
            <div className='h-96 w-full space-y-1 overflow-auto md:h-64'>
                {pinHistories.map((pinHistory) => {
                    return (
                        <div
                            key={'pin-' + pinHistory.id}
                            className='flex w-full select-none items-center justify-between rounded bg-blue-100 p-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:bg-slate-500 dark:hover:bg-stone-600'
                        >
                            <div className='inline-flex items-center space-x-2'>
                                <button className='block' onClick={() => onHistoryUnpin(pinHistory.id)}>
                                    <TiPinOutline className='fill-blue-500 text-lg' />
                                </button>
                                {pinHistory.type == 'chat' ? (
                                    <button className='max-w-[150px]' onClick={() => router.push(`/mode/${pinHistory.type}?share=${pinHistory.id}`)}>
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
                            className='flex w-full select-none items-center justify-between rounded p-1 transition duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-stone-600'
                        >
                            <div className='inline-flex items-center space-x-2'>
                                <button className='block' onClick={() => onHistoryPin(history.id)}>
                                    <TiPinOutline className='text-lg hover:fill-blue-500' />
                                </button>
                                {history.type == 'chat' ? (
                                    <button className='max-w-[150px]' onClick={() => router.push(`/mode/${history.type}?share=${history.id}`)}>
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
