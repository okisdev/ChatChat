import { customConfig } from '@/config/custom.config';

const AuthFooter = () => {
    return <div className='flex h-36 items-center text-center'>{customConfig.Auth.footer}</div>;
};

export default AuthFooter;
