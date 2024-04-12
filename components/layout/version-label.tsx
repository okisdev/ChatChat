import packageInfo from '@/package.json';

export const VersionLabel = () => {
    return <p className='self-center rounded-xl border-2 border-sky-300 bg-sky-200 px-1.5 text-xs dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100'>v{packageInfo.version}</p>;
};
