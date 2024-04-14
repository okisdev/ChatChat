'use client';

import { useState } from 'react';
import { GrResources } from 'react-icons/gr';
import { useAtom } from 'jotai';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { BlockTitle } from '@/components/layout/search/block/block-title';
import { UserAvatar } from '@/components/layout/user-avatar';
import store from '@/hooks/store';
import { useMediaQuery } from '@/hooks/window';
import { TavilyResult } from '@/types/search/resources';

export const Sources = ({ results }: Readonly<{ results: TavilyResult[] }>) => {
    const t = useTranslations();

    const [isAllResources, setIsAllResources] = useState<boolean>(false);

    const [sameCitationId, setSameCitationId] = useAtom<string>(store.sameCitationAtom);

    const isDesktop = useMediaQuery('(min-width: 768px)');

    const shown = isAllResources ? results : isDesktop ? results.slice(0, 3) : results.slice(0, 2);
    const hidden = isAllResources ? [] : isDesktop ? results.slice(3) : results.slice(2);

    const hiddenCount = hidden.length;

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('sources')} icon={GrResources} />
            <div className='flex flex-wrap gap-1'>
                {shown.map((result: TavilyResult, index: number) => (
                    <Link
                        key={index}
                        href={result.url}
                        passHref
                        target='_blank'
                        className={`h-auto w-1/2 cursor-pointer space-y-3 rounded-md bg-neutral-200/70 p-2 transition duration-200 ease-in-out hover:bg-neutral-200/30 dark:text-neutral-200/80 dark:shadow-lg dark:hover:bg-neutral-700 dark:hover:text-neutral-200/90 md:w-3/12 ${sameCitationId == encodeURIComponent(result.url) ? 'dark:bg-neutral-700' : 'dark:bg-neutral-800/70'}`}
                        onMouseEnter={() => setSameCitationId(encodeURIComponent(result.url))}
                        onMouseLeave={() => setSameCitationId('')}
                    >
                        <p className='line-clamp-2 text-xs'>{result.content}</p>
                        <div className='mt-2 flex items-center space-x-2'>
                            <UserAvatar
                                avatarUrl={`https://external-content.duckduckgo.com/ip3/${new URL(result.url).hostname}.ico`}
                                avatarFallback={new URL(result.url).hostname[0]}
                                className='size-4'
                            />
                            <p className='truncate text-xs text-neutral-800/50 dark:text-neutral-200/70'>{new URL(result.url).hostname}</p>
                        </div>
                    </Link>
                ))}
                {!isAllResources && hiddenCount > 0 ? (
                    <button
                        className='flex h-auto w-3/12 cursor-pointer flex-col justify-between space-y-3 rounded-md bg-neutral-200/70 p-2 transition duration-200 ease-in-out hover:bg-neutral-200/30 dark:bg-neutral-800/70 dark:text-neutral-200/80 dark:shadow-lg dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200/90'
                        onClick={() => setIsAllResources(true)}
                    >
                        <div className='flex flex-wrap gap-2'>
                            {hidden.map((result: TavilyResult, index: number) => {
                                return (
                                    <UserAvatar
                                        key={index}
                                        avatarUrl={`https://external-content.duckduckgo.com/ip3/${new URL(result.url).hostname}.ico`}
                                        avatarFallback={new URL(result.url).hostname[0]}
                                        className='size-4'
                                    />
                                );
                            })}
                        </div>
                        <p className='self-center truncate text-xs text-neutral-800/50 dark:text-neutral-200/70'>{t('show_all_resources')}</p>
                    </button>
                ) : (
                    <button
                        className='size-auto cursor-pointer space-y-3 rounded-md bg-neutral-200/70 p-2 transition duration-200 ease-in-out hover:bg-neutral-200/30 dark:bg-neutral-800/70 dark:text-neutral-200/80 dark:shadow-lg dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200/90 md:w-3/12'
                        onClick={() => setIsAllResources(false)}
                    >
                        <p className='self-center truncate text-xs text-neutral-800/50 dark:text-neutral-200/70'>{t('show_less_resources')}</p>
                    </button>
                )}
            </div>
        </div>
    );
};
