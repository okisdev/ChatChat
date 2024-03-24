import packageInfo from '@/package.json';

export const VersionLabel = () => {
    return <p className='self-center rounded-xl border-2 border-sky-300 bg-sky-200 px-1.5 text-xs'>v{packageInfo.version}</p>;
};
