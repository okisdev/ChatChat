import Link from 'next/link';

const AuthFooter = () => {
    return (
        <div className='flex h-36 items-center justify-center'>
            <p className='text-xs'>
                By continuing, you agree to our{' '}
                <Link href='https://www.harrly.com' target='_blank' className='underline'>
                    Terms of Service
                </Link>
                ,{' '}
                <Link href='https://www.harrly.com/privacy-policy' target='_blank' className='underline'>
                    Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href='https://www.harrly.com/cookies' target='_blank' className='underline'>
                    Cookie Policy
                </Link>
                .
            </p>
        </div>
    );
};

export default AuthFooter;
