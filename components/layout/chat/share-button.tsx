import { LuShare } from 'react-icons/lu';

export const ShareButton = () => {
    return (
        <div className='flex items-center space-x-1 p-2'>
            <div className='cursor-pointer rounded-md p-2 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60'>
                <LuShare />
            </div>
        </div>
    );
};
