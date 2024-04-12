'use client';

import Lightbox from 'react-spring-lightbox';
import { ImagesList } from 'react-spring-lightbox/dist/types/ImagesList';

export const LightBox = ({
    images,
    open,
    setOpen,
    currentIndex,
    setCurrentIndex,
}: {
    images: ImagesList;
    open: boolean;
    setOpen: (open: boolean) => void;
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
}) => {
    const gotoPrevious = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

    const gotoNext = () => currentIndex + 1 < images.length && setCurrentIndex(currentIndex + 1);

    return <Lightbox isOpen={open} onPrev={gotoPrevious} onNext={gotoNext} images={images} currentIndex={currentIndex} className='bg-gray-300/70 dark:bg-gray-800/70' onClose={() => setOpen(false)} />;
};
