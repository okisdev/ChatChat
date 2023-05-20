import { FC, memo } from 'react';

import { jetbrains_mono } from '@/app/fonts';

import { toast } from 'react-hot-toast';

import { useTranslations } from 'next-intl';

import ReactMarkdown, { Options } from 'react-markdown';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { FiCopy } from 'react-icons/fi';

export const MemoReactMarkdown: FC<Options> = memo(ReactMarkdown);

const renderMarkdownMessage = (message: string) => {
    return (
        <MemoReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code: CodeComponent,
                h1: ({ children, ...props }: any) => (
                    <h1 className='markdown-h1' {...props}>
                        {children}
                    </h1>
                ),
                h2: ({ children, ...props }: any) => (
                    <h2 className='markdown-h2' {...props}>
                        {children}
                    </h2>
                ),
                h3: ({ children, ...props }: any) => (
                    <h3 className='markdown-h3' {...props}>
                        {children}
                    </h3>
                ),
                h4: ({ children, ...props }: any) => (
                    <h4 className='markdown-h4' {...props}>
                        {children}
                    </h4>
                ),
                h5: ({ children, ...props }: any) => (
                    <h5 className='markdown-h5' {...props}>
                        {children}
                    </h5>
                ),
                ul: ({ children, ...props }: any) => (
                    <ul className='markdown-ul' {...props}>
                        {children}
                    </ul>
                ),
                ol: ({ children, ...props }: any) => (
                    <ol className='markdown-ol' {...props}>
                        {children}
                    </ol>
                ),
                li: ({ children, ...props }: any) => (
                    <li className='markdown-li' {...props}>
                        {children}
                    </li>
                ),
                blockquote: ({ children, ...props }: any) => (
                    <blockquote className='markdown-blockquote' {...props}>
                        {children}
                    </blockquote>
                ),
                a: ({ children, ...props }: any) => (
                    <a className='markdown-a' {...props}>
                        {children}
                    </a>
                ),
                table: ({ children, ...props }: any) => (
                    <table className='markdown-table' {...props}>
                        {children}
                    </table>
                ),
                thead: ({ children, ...props }: any) => (
                    <thead className='markdown-thead' {...props}>
                        {children}
                    </thead>
                ),
                tbody: ({ children, ...props }: any) => (
                    <tbody className='markdown-tbody' {...props}>
                        {children}
                    </tbody>
                ),
                tr: ({ children, ...props }: any) => (
                    <tr className='markdown-tr' {...props}>
                        {children}
                    </tr>
                ),
                th: ({ children, ...props }: any) => (
                    <th className='markdown-th' {...props}>
                        {children}
                    </th>
                ),
                td: ({ children, ...props }: any) => (
                    <td className='markdown-td' {...props}>
                        {children}
                    </td>
                ),
            }}
            linkTarget='_blank'
        >
            {message}
        </MemoReactMarkdown>
    );
};

const renderUserMessage = (message: string) => {
    const lines = message.replace(/\n/g, '\n').split('\n');

    return (
        <p>
            {lines.map((line, index) => (
                <span key={index} style={{ wordWrap: 'break-word' }}>
                    {line}
                    <br />
                </span>
            ))}
        </p>
    );
};

const CodeComponent = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');

    const t = useTranslations('landing');

    return !inline ? (
        <div className={`${jetbrains_mono.className} markdown-code`}>
            <div className='flex justify-end p-1'>
                <div className='space-x-1 text-stone-300'>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                            toast.success(t('Copied'));
                        }}
                    >
                        <FiCopy className='text-lg' />
                    </button>
                    <span className='markdown-code-language'>{(match?.[1] != null ? match[1] : 'unknown').toUpperCase()}</span>
                </div>
            </div>
            <pre className='p-1 text-xs'>
                <SyntaxHighlighter language={match?.[1] != null ? match[1] : 'unknown'} style={atomOneDark} {...props}>
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            </pre>
        </div>
    ) : (
        <code className={className + ' markdown-inline-code'} {...props}>
            {children}
        </code>
    );
};

export { renderMarkdownMessage, renderUserMessage };
