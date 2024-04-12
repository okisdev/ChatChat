import { IconType } from 'react-icons/lib';

interface BlockTitleProps {
    title: string;
    icon: IconType;
}

export const BlockTitle = (props: BlockTitleProps) => {
    return (
        <div className='flex items-center space-x-1.5'>
            <props.icon size={26} className='size-6' />
            <p className='text-xl font-semibold text-neutral-800/80 dark:text-neutral-200/80'>{props.title}</p>
        </div>
    );
};
