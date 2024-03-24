'use client';

import { FaArrowUp } from 'react-icons/fa6';
import { Textarea } from '@/components/ui/textarea';

interface InputBoxProps {
    input: string;
    handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function InputBox(props: Readonly<InputBoxProps>) {
    const { input, handleInput, handleSubmit } = props;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    };

    return (
        <form className='relative w-10/12 pb-3' onSubmit={handleSubmit}>
            <Textarea
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder='Type your message here'
                className='resize-none rounded-xl border border-stone-400/40 outline-none transition duration-200 ease-in-out hover:border-stone-500/50 focus-visible:border-stone-800/80 focus-visible:ring-0 focus-visible:ring-offset-0'
            />
            <button className='absolute bottom-5 right-2 flex cursor-pointer items-center justify-center rounded-xl border p-2 transition duration-300 ease-in-out hover:bg-stone-300/30'>
                <FaArrowUp />
            </button>
        </form>
    );
}
