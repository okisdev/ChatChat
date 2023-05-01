import AuthForm from '@/components/auth/form';
import AuthHeader from '@/components/auth/header';
import AuthFooter from '@/components/auth/footer';

export default function LoginPage() {
    return (
        <div className='container mx-auto flex h-screen flex-col items-center justify-between'>
            <AuthHeader />

            <AuthForm login={true} />

            <AuthFooter />
        </div>
    );
}
