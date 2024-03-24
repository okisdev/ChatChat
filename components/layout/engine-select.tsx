import { IoChevronDown } from 'react-icons/io5';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { useAtom } from 'jotai';
import store from '@/hooks/store';
import { useRouter } from 'next/navigation';
import { SearchEngine } from '@/types/settings';

export default function EngineSelect() {
    const router = useRouter();

    const [currentSearchEngine, setCurrentSearchEngine] = useAtom(store.currentSearchEngineAtom);

    const handleSearchEngineChange = (newSearchEngine: SearchEngine) => {};

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex flex-row items-center space-x-2 rounded-md px-2 py-1.5 outline-none transition duration-300 ease-in-out hover:bg-zinc-200/60'>
                <p className='text-sm'>Search Engine: {currentSearchEngine}</p>
                <IoChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuRadioGroup
                    value={currentSearchEngine}
                    onValueChange={(value) => {
                        setCurrentSearchEngine(value as SearchEngine);
                    }}
                >
                    <DropdownMenuRadioItem key='google' value='Google' className='cursor-pointer'>
                        Google
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
