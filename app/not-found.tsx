export default function NotFound() {
    return (
        <div className='mx-auto flex h-screen items-center justify-center'>
            <div className='flex flex-col space-y-4 text-center'>
                <p className='text-lg font-bold'>404 Not Found</p>
                <p className='text-sm'>The source you requested is unavailable.</p>
            </div>
        </div>
    );
}
