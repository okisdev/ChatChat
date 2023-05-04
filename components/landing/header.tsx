'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import store from '@/hooks/store';
import { useAtom } from 'jotai';

import { FiLayout, FiCode, FiFile, FiMessageCircle, FiChevronDown } from 'react-icons/fi';

import LandingSide from '@/components/landing/side';
import HeaderSettings from '@/components/landing/header-settings';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const LandingHeader = () => {
    const pathname = usePathname();

    const [isHiddenSideAtom, setIsHiddenSideAtom] = useAtom(store.isHiddenSideAtom);

    const handleToggleSide = () => {
        setIsHiddenSideAtom(!isHiddenSideAtom);
    };

    const currentMode = ModeList.find((mode) => mode.link === pathname) || ModeList.find((mode) => mode.value === 'chat');

    return (
        <div className='m-2 flex flex-grow flex-col rounded-lg  bg-white/90 px-4 py-2 shadow backdrop-blur transition-transform duration-500 dark:bg-gray-800 md:p-3'>
            <div className='flex items-center justify-between'>
                <div>
                    <div className='hidden md:block'>
                        <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200' onClick={handleToggleSide} aria-label='Nav'>
                            <FiLayout />
                        </button>
                    </div>
                    <div className='block md:hidden'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className='inline-flex items-center space-x-1 rounded p-1 px-1 transition duration-200 ease-in-out hover:bg-gray-200'>
                                    <FiLayout />
                                </button>
                            </SheetTrigger>
                            <SheetContent position='left' size='xl' className='h-full'>
                                <LandingSide user={null} className='h-full' />
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                <div className='relative flex items-center space-x-3'>
                    <HeaderSettings />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className='inline-flex items-center space-x-1 rounded px-1 transition duration-200 ease-in-out hover:bg-gray-200 focus:outline-none'
                                aria-label='Advanced Configuration Settings'
                            >
                                {currentMode && <currentMode.icon className='block' />}
                                <p className='font-medium'>{currentMode?.title}</p>
                                <FiChevronDown />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='transition duration-200 ease-in-out'>
                            {ModeList.map((mode, index) => (
                                <DropdownMenuItem key={index}>
                                    <Link href={mode.link} className='inline-flex w-full items-center space-x-1'>
                                        <mode.icon className='block' />
                                        <span>{mode.title}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default LandingHeader;

const ModeList = [
    {
        title: 'Chat',
        value: 'chat',
        icon: FiMessageCircle,
        link: '/mode/chat',
    },
    {
        title: 'Code',
        value: 'code',
        icon: FiCode,
        link: '/mode/code',
    },
    {
        title: 'File',
        value: 'file',
        icon: FiFile,
        link: '/mode/file',
    },
];
