'use client';

import { FaDownload } from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';

export const renderMarkdownMessage = (content: string, hightlight?: string, setHightLight?: (value: string) => void) => {
    return (
        <ReactMarkdown
            className='space-y-5'
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                p: ({ children, ...props }: any) => (
                    <div className='text-sm md:text-base' {...props}>
                        {children}
                    </div>
                ),
                h1: ({ children, ...props }: any) => (
                    <h1 className='my-2 text-2xl font-bold' {...props}>
                        {children}
                    </h1>
                ),
                h2: ({ children, ...props }: any) => (
                    <h2 className='my-2 text-xl font-bold' {...props}>
                        {children}
                    </h2>
                ),
                h3: ({ children, ...props }: any) => (
                    <h3 className='my-2 text-lg font-bold' {...props}>
                        {children}
                    </h3>
                ),
                h4: ({ children, ...props }: any) => (
                    <h4 className='my-2 text-base font-bold' {...props}>
                        {children}
                    </h4>
                ),
                h5: ({ children, ...props }: any) => (
                    <h5 className='my-2 text-sm font-bold' {...props}>
                        {children}
                    </h5>
                ),
                h6: ({ children, ...props }: any) => (
                    <h6 className='my-2 text-xs font-bold' {...props}>
                        {children}
                    </h6>
                ),
                ul: ({ children, ...props }: any) => (
                    <ul className='mx-4 my-2 list-inside list-disc' {...props}>
                        {children}
                    </ul>
                ),
                ol: ({ children, ...props }: any) => (
                    <ol className='my-2 list-inside list-decimal' {...props}>
                        {children}
                    </ol>
                ),
                li: ({ children, ...props }: any) => (
                    <li className='my-2 text-base' {...props}>
                        {children}
                    </li>
                ),
                blockquote: ({ children, ...props }: any) => (
                    <blockquote className='my-2 border-l-4 border-gray-400 p-2' {...props}>
                        {children}
                    </blockquote>
                ),
                button: ({ children, ...props }: any) => (
                    <Link
                        {...props}
                        href={props.href}
                        target='_blank'
                        className='underline'
                        onMouseEnter={() => setHightLight && setHightLight(encodeURIComponent(props.href))}
                        onMouseLeave={() => setHightLight && setHightLight('')}
                    >
                        {children}
                    </Link>
                ),
                pre: ({ children, ...props }: any) => (
                    <pre className='overflow-auto whitespace-pre-wrap rounded-md bg-neutral-200 p-1 dark:bg-neutral-600' {...props}>
                        {children}
                    </pre>
                ),
                code: ({ children, ...props }: any) => (
                    <code className='overflow-auto whitespace-pre-wrap rounded-md bg-neutral-200 p-1 dark:bg-neutral-600' {...props}>
                        {children}
                    </code>
                ),
                img: ({ children, ...props }: any) => (
                    <div className='container relative mx-auto w-full md:w-1/2'>
                        <img className='container mx-auto' {...props} />
                        <button
                            className='absolute bottom-0 right-3 rounded-md bg-neutral-200 p-2 transition duration-200 ease-in-out hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200/90 dark:shadow-lg dark:hover:bg-neutral-700 dark:hover:shadow-xl'
                            onClick={() => {
                                const link = document.createElement('a');
                                link.target = '_blank';
                                link.href = props.src;
                                link.download = props.src;
                                link.click();
                            }}
                        >
                            <FaDownload />
                        </button>
                    </div>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export const RenderSimpleMessage = ({ content }: { content: string }) => {
    return <div>{content}</div>;
};
