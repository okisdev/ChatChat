import { Input } from '@/components/ui/custom/input';
import { SearchEngineSetting } from '@/types/search';

export const TavilySearchEngine = ({ tavily, setTavily }: { tavily: SearchEngineSetting['Tavily'] | null; setTavily: (value: SearchEngineSetting['Tavily'] | null) => void }) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-0.5'>
                <p className='px-1 text-sm'>Tavily API Key</p>
                <Input
                    type='text'
                    placeholder='tvly-xxxx'
                    value={tavily?.apiKey}
                    onChange={(e) => {
                        setTavily({
                            apiKey: e.target.value,
                        });
                    }}
                />
            </div>
        </div>
    );
};
