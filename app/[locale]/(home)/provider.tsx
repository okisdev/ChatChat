import { AI as AiProvider } from '@/app/[locale]/(home)/action';

export default function HomeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return <AiProvider>{children}</AiProvider>;
}
