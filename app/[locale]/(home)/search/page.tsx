'use client';

import { AddButton } from '@/components/layout/add-button';
import { ModelSelect } from '@/components/layout/model-select';
import { SearchWindow } from '@/components/layout/search/search-window';
import { SearchSelect } from '@/components/layout/search-select';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export default function Search() {
    return (
        <main className='m-2 flex h-screen flex-1 flex-col rounded-lg bg-white/70 p-1 shadow dark:bg-neutral-600/30 dark:text-neutral-200/70 md:m-3'>
            <div className='flex items-center justify-between rounded-md bg-transparent'>
                <div className='flex items-center space-x-1 p-2'>
                    <AddButton />
                    <ModelSelect />
                    <SearchSelect />
                </div>
            </div>
            <div className='container w-full overflow-scroll md:mx-auto md:w-10/12'>
                <SearchWindow />
            </div>
        </main>
    );
}
