'use client';

import { useState } from 'react';
import { BsImage } from 'react-icons/bs';
import { useTranslations } from 'next-intl';

import { LightBox } from '@/components/layout/lightbox';
import { BlockTitle } from '@/components/layout/search/block/block-title';
import { useMediaQuery } from '@/hooks/window';

export const Images = ({ images, query }: { images: string[]; query?: string }) => {
    const t = useTranslations();

    const [selectedIndex, setSelectedIndex] = useState(0);

    const [open, setOpen] = useState(false);

    const [isAllResources, setIsAllResources] = useState<boolean>(false);

    const isDesktop = useMediaQuery('(min-width: 768px)');

    const shown = isAllResources ? images : isDesktop ? images.slice(0, 4) : images.slice(0, 3);
    const hidden = isAllResources ? [] : isDesktop ? images.slice(4) : images.slice(3);

    const hiddenCount = hidden.length;

    const onClickOnImage = (index: number) => {
        setSelectedIndex(index ?? '0');
        setOpen(true);
    };

    const lightBoxImages = images.map((image) => {
        return {
            alt: query,
            src: image,
        };
    });

    return (
        <div className='space-y-2'>
            <BlockTitle title={t('images')} icon={BsImage} />
            {!images || images.length === 0 ? (
                <div>{t('no_image_found')}</div>
            ) : (
                <div className='flex flex-wrap gap-1 md:gap-2'>
                    <LightBox
                        images={lightBoxImages.map((image) => ({ alt: image.alt || '', src: image.src }))}
                        open={open}
                        setOpen={setOpen}
                        currentIndex={selectedIndex}
                        setCurrentIndex={setSelectedIndex}
                    />
                    {shown.map((image: string, index: number) => (
                        <button key={index} className='relative aspect-video w-1/3 cursor-pointer' onClick={() => onClickOnImage(index)}>
                            {image ? (
                                <img src={image} alt={query} className='size-full rounded-md object-cover transition-opacity duration-200 ease-in-out hover:opacity-80 hover:zoom-in-100' />
                            ) : (
                                <div className='size-full animate-pulse bg-muted' />
                            )}
                        </button>
                    ))}
                    {!isAllResources && hiddenCount > 0 ? (
                        <button
                            className='flex h-auto w-3/12 cursor-pointer flex-col justify-between space-y-3 rounded-md bg-neutral-200/70 p-2 transition duration-200 ease-in-out hover:bg-neutral-200/30 dark:bg-neutral-800/70 dark:text-neutral-200/80 dark:shadow-lg dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200/90'
                            onClick={() => setIsAllResources(true)}
                        >
                            <div className='flex flex-wrap gap-2'>
                                {hidden.map((image: string, index: number) => {
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedIndex(index)}
                                            className='relative flex aspect-video w-3/12 cursor-pointer flex-col items-center justify-center rounded-md bg-black/30 text-sm text-white/80'
                                        >
                                            <img src={image} alt={query} className='h-22 w-full rounded-md' />
                                        </button>
                                    );
                                })}
                            </div>
                            <p className='self-center truncate text-xs text-neutral-800/50 dark:text-neutral-200/70'>{t('show_more_images')}</p>
                        </button>
                    ) : (
                        <button
                            className='size-auto cursor-pointer space-y-3 rounded-md bg-neutral-200/70 p-2 transition duration-200 ease-in-out hover:bg-neutral-200/30 dark:bg-neutral-800/70 dark:text-neutral-200/80 dark:shadow-lg dark:hover:bg-neutral-800/60 dark:hover:text-neutral-200/90 md:w-3/12'
                            onClick={() => setIsAllResources(false)}
                        >
                            <p className='truncate text-xs text-neutral-800/50 dark:text-neutral-200/70'>{t('show_less_images')}</p>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
