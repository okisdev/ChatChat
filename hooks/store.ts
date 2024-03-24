import { atom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// import types
import { GeneralPreferences, GeneralProviderSettings, SearchEngine, Theme } from '@/types/settings';
import { Provider } from '@/config/provider';
import { GeneralModel, Model } from '@/types/model';
import { OpenAIModelId, OpenAIModelName } from '@/config/provider/openai';
import { Conversation } from '@/types/conversation';

// setup storage
const storage = createJSONStorage(() => sessionStorage);

// provider management
const generalProviderSettingsAtom = atomWithStorage<GeneralProviderSettings | null>('currentProviderSettings', null);

// model management
const currentUseModelAtom = atomWithStorage<GeneralModel>('currentUseModel', {
    provider: Provider.OpenAI,
    model_id: 'gpt-4-0125-preview' as OpenAIModelId,
    model_name: 'GPT-4 0125 Preview' as OpenAIModelName,
});

const recentUsedModelsAtom = atomWithStorage<GeneralModel[] | null>('recentUsedModels', null);

// search engine management
const currentSearchEngineAtom = atomWithStorage<SearchEngine>('searchEngine', SearchEngine.Google);

// settings management
const themeAtom = atom<Theme>(Theme.System);

const useUnifiedEndpointAtom = atomWithStorage<boolean>('useUnifiedEndpoint', false);

const generalPreferencesAtom = atomWithStorage<GeneralPreferences>('generalPreferences', {
    theme: Theme.System,
    // sendKey: 'enter',
    enterSend: true,
    autoRead: false,
    // renderMode: 'markdown',
    useMarkdown: false,
    autoScroll: false,
});

// conversation management
const conversations = atomWithStorage<Conversation[] | null>('conversations', null);

// export atoms
export default {
    currentUseModelAtom,
    recentUsedModelsAtom,
    currentSearchEngineAtom,
    generalProviderSettingsAtom,
    themeAtom,
    generalPreferencesAtom,
    useUnifiedEndpointAtom,
    conversations,
};
