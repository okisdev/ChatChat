import { useRouter } from 'next/navigation';
import { IoMdAdd } from 'react-icons/io';

export const AddButton = ({ link }: { link: string }) => {
    const router = useRouter();

    return (
        <button className='cursor-pointer rounded-md p-2 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60' onClick={() => (window.location.href = link)}>
            <IoMdAdd />
        </button>
    );
};
