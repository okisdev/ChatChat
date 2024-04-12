import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { Provider } from '@/config/provider';
import { OpenAIModelId, OpenAIModelName } from '@/config/provider/openai';
import { SearchEngine } from '@/config/search';
import { Conversation } from '@/types/conversation';
import { Model, SimpleModel } from '@/types/model';
import { SearchEngineSetting } from '@/types/search';
import { AdvancedSettings, ConversationSettings, Preference, ProviderSetting, Theme } from '@/types/settings';

// provider management
const currentProviderSettingsAtom = atomWithStorage<ProviderSetting | null>('currentProviderSettings', null);

const customProviderModelAtom = atomWithStorage<Model[] | null>('customProviderModel', null);

// search engine management
const currentSearchEngineSettingsAtom = atomWithStorage<SearchEngineSetting | null>('currentSearchEngineSettings', null);

const currentSearchEngineAtom = atomWithStorage<SearchEngine>('currentSearchEngine', SearchEngine.Tavily);

// model management
const currentUseModelAtom = atomWithStorage<SimpleModel>('currentUseModel', {
    provider: Provider.OpenAI,
    model_id: 'gpt-3.5-turbo' as OpenAIModelId,
    model_name: 'GPT-3.5 Turbo' as OpenAIModelName,
});

const recentUsedModelsAtom = atomWithStorage<SimpleModel[] | null>('recentUsedModels', null);

// settings management
const themeAtom = atom<Theme>(Theme.System);

const preferencesAtom = atomWithStorage<Preference>('preferences', {
    theme: Theme.System,
    // sendKey: 'enter',
    enterSend: true,
    // autoRead: false,
    // renderMode: 'markdown',
    useMarkdown: false,
    // autoScroll: false,
});

const advancedSettingsAtom = atomWithStorage<AdvancedSettings>('advancedSettings', {
    unifiedEndpoint: false,
    streamMessages: false,
});

const conversationSettingsAtom = atomWithStorage<ConversationSettings>('conversationSettings', {
    numOfContext: 0,
    systemPrompt: null,
});

// conversation management
const conversationsAtom = atomWithStorage<Conversation[] | null>('conversations', null);

// search management
const sameCitationAtom = atom<string>('sameCitationId');
const isProSearchAtom = atomWithStorage<boolean>('pro', false);

// export atoms
export default {
    currentUseModelAtom,
    recentUsedModelsAtom,
    currentProviderSettingsAtom,
    customProviderModelAtom,
    currentSearchEngineSettingsAtom,
    currentSearchEngineAtom,
    themeAtom,
    preferencesAtom,
    advancedSettingsAtom,
    conversationSettingsAtom,
    conversationsAtom,
    sameCitationAtom,
    isProSearchAtom,
};
