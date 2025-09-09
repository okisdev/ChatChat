import Image from 'next/image';

export default function Home() {
  return (
    <div className='grid h-full min-h-0 grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-sans sm:p-20'>
      <main className='row-start-2 flex flex-col items-center gap-[32px] sm:items-start'>
        <Image
          alt='Next.js logo'
          className='dark:invert'
          height={38}
          priority
          src='/next.svg'
          width={180}
        />
        <ol className='list-inside list-decimal text-center font-mono text-sm/6 sm:text-left'>
          <li className='mb-2 tracking-[-.01em]'>
            Get started by editing{' '}
            <code className='rounded bg-black/[.05] px-1 py-0.5 font-mono font-semibold dark:bg-white/[.06]'>
              app/page.tsx
            </code>
            .
          </li>
          <li className='tracking-[-.01em]'>
            Save and see your changes instantly.
          </li>
        </ol>

        <div className='flex flex-col items-center gap-4 sm:flex-row'>
          <a
            className='flex h-10 items-center justify-center gap-2 rounded-full border border-transparent border-solid bg-foreground px-4 font-medium text-background text-sm transition-colors hover:bg-[#383838] sm:h-12 sm:w-auto sm:px-5 sm:text-base dark:hover:bg-[#ccc]'
            href='https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Image
              alt='Vercel logomark'
              className='dark:invert'
              height={20}
              src='/vercel.svg'
              width={20}
            />
            Deploy now
          </a>
          <a
            className='flex h-10 w-full items-center justify-center rounded-full border border-black/[.08] border-solid px-4 font-medium text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] sm:h-12 sm:w-auto sm:px-5 sm:text-base md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]'
            href='https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
            rel='noopener noreferrer'
            target='_blank'
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-[24px]'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          rel='noopener noreferrer'
          target='_blank'
        >
          <Image
            alt='File icon'
            aria-hidden
            height={16}
            src='/file.svg'
            width={16}
          />
          Learn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          rel='noopener noreferrer'
          target='_blank'
        >
          <Image
            alt='Window icon'
            aria-hidden
            height={16}
            src='/window.svg'
            width={16}
          />
          Examples
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          rel='noopener noreferrer'
          target='_blank'
        >
          <Image
            alt='Globe icon'
            aria-hidden
            height={16}
            src='/globe.svg'
            width={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
