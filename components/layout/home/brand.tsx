import VersionBadge from '@/components/layout/home/version-badge';

export default function Brand() {
    return (
        <div className='flex items-center justify-between px-3'>
            <button
                className='text-lg font-semibold'
                onClick={() => {
                    window.location.href = '/';
                }}
            >
                Chat Chat
            </button>
            <VersionBadge />
        </div>
    );
}
