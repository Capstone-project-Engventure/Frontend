import {create} from 'zustand';
import PromptService from '@/lib/services/prompt.service';
import { useApi } from '@/lib/Api';
import { useTopicStore } from './topicStore';
import { useExerciseTypeStore } from './exerciseTypeStore';

interface GenerateState {
  number: number;
  skill: string;
  level: string;
  topicId: string;
  typeId: string;
  mode: 'vertex' | 'ollama';
  useRag: boolean;
  prompt: string;
  prompt_content: string;
  results: any[];
  loading: boolean;
  healthLoading: boolean;
  error: string;
  healthStatus: {
    overall: boolean;
    llm: boolean;
    chain: boolean;
    database: boolean;
    llm_api: boolean;
    mode: string;
  } | null;

  setNumber: (number: number) => void;
  setSkill: (s: string) => void;
  setLevel: (l: string) => void;
  setTopic: (id: string) => void;
  setType: (id: string) => void;
  setMode: (m: 'vertex' | 'ollama') => void;
  setUseRag: (flag: boolean) => void;
  setPromptContent: (text: string) => void;
  updatePrompt: () => Promise<void>;
  checkHealth: () => Promise<boolean>;
  generate: () => Promise<void>;
  exportResults: () => void;
}

export const useGenerateStore = create<GenerateState>((set, get) => ({
  number:1,
  skill: '',
  level: '',
  topicId: '',
  typeId: '',
  mode: 'ollama',
  useRag: false,
  prompt: 'default',
  prompt_content: '',
  results: [],
  loading: false,
  healthLoading: false,
  error: '',
  healthStatus: null,

  setNumber: (number) => set({ number }),
  setSkill: (skill) => set({ skill }),
  setLevel: (level) => set({ level }),
  setTopic: (topicId) => set({ topicId }),
  setType: (typeId) => set({ typeId }),
  setMode: (mode) => set({ mode }),
  setUseRag: (useRag) => set({ useRag }),
  setPromptContent: (text: string) => set({ prompt_content: text }),

  updatePrompt: async () => {
    const {number, skill, level, topicId, typeId, mode, useRag } = get();
    try {
      const promptName = get().prompt;
      const text = await new PromptService().getByName(promptName);
      const topics = useTopicStore.getState().topics;
      const types = useExerciseTypeStore.getState().types;
      const topicTitle = topics.find(t => String(t.id) === String(topicId))?.title || '';
      const typeName = types.find(t => String(t.id) === String(typeId))?.name || '';
      // const text = await new PromptService().getAll({ skill, level, topic: topicTitle, type: typeName, mode, useRag });
     
      // console.log("prompt", text);
      if (typeof text === 'string') {
        set({ prompt_content: text });
      }
    } catch (err) {
      console.error('Prompt update failed', err);
    }
  },

  checkHealth: async () => {
    set({ healthLoading: true });
    try {
      const promptService = new PromptService();
      const mode = get().mode;
      const healthResult = await promptService.checkLLMHealth(mode);
      
      // Log đầy đủ response từ health check
      console.log('=== HEALTH CHECK RESPONSE ===');
      console.log('Success:', healthResult.success);
      console.log('Full response data:', JSON.stringify(healthResult.data, null, 2));
      if (healthResult.error) {
        console.log('Error:', healthResult.error);
      }
      console.log('=============================');
      
      if (healthResult.success) {
        set({ healthStatus: healthResult.data });
        
        // Log chi tiết từng component
        console.log('=== DETAILED COMPONENT STATUS ===');
        console.log('Overall health:', healthResult.data.overall);
        console.log('Database:', healthResult.data.database);
        console.log('LLM API:', healthResult.data.llm_api);
        console.log('LLM (specific mode):', healthResult.data.llm);
        console.log('Chain:', healthResult.data.chain);
        console.log('Mode:', healthResult.data.mode);
        console.log('Components details:', JSON.stringify(healthResult.data.components, null, 2));
        console.log('=================================');
        
        if (!healthResult.data.overall) {
          console.error(`❌ Hệ thống không khỏe mạnh. Mode: ${mode}`);
          console.error('Reason: Overall health check failed');
          return false;
        }
        
        if (!healthResult.data.database) {
          console.error('❌ Kết nối database không khả dụng');
          console.error('Database status:', healthResult.data.components?.database);
          return false;
        }
        
        if (!healthResult.data.llm_api) {
          console.error('❌ LLM API không khả dụng');
          console.error('LLM API status:', healthResult.data.components?.llm_api);
          return false;
        }
        
        if (!healthResult.data.llm) {
          console.error(`❌ LLM không khả dụng cho mode: ${mode}`);
          console.error(`LLM status for ${mode}:`, healthResult.data.components?.[`${mode}_llm`]);
          return false;
        }
        
        console.log(`✅ Hệ thống khỏe mạnh. Mode: ${mode}`);
        console.log('All components are working properly');
        return true;
      } else {
        set({ healthStatus: healthResult.data });
        console.error('=== HEALTH CHECK FAILED ===');
        console.error(`Health check thất bại: ${healthResult.error}`);
        console.error('Response data:', JSON.stringify(healthResult.data, null, 2));
        console.error('===========================');
        return false;
      }
    } catch (error: any) {
      console.error('=== HEALTH CHECK ERROR ===');
      console.error('Health check error:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Không thể kiểm tra health của hệ thống');
      console.error('==========================');
      return false;
    } finally {
      set({ healthLoading: false });
    }
  },

  generate: async () => {
    set({ loading: true, error: '' });
    try {
      // Kiểm tra health trước khi generate
      const isHealthy = await get().checkHealth();
      if (!isHealthy) {
        set({ loading: false, error: 'LLM system is not healthy' });
        return;
      }

      const api = useApi();
      const { number, skill, level, topicId, typeId, prompt, mode, useRag } = get();
      
      console.log('topicId:', topicId, typeof topicId);
      console.log('typeId:', typeId, typeof typeId);
      const topics = useTopicStore.getState().topics;
      console.log('topics:', topics);
      
      if (topics.length === 0) {
        await useTopicStore.getState().fetchTopics();
      }
      const types = useExerciseTypeStore.getState().types;
      const topicTitle = topics.find(t => String(t.id) === String(topicId))?.title || '';
      const typeName = types.find(t => String(t.id) === String(typeId))?.name || '';
      const res = await api.post('exercises/generate', { number,skill, level, topic: topicTitle, type_id: typeName, prompt_name: prompt, mode, use_rag: useRag });
      console.log('Generated exercises:', res.data);
      set({ results: res.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to generate exercise.';
      set({ error: errorMessage });
      console.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  exportResults: () => {
    const blob = new Blob([JSON.stringify(get().results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exercises.json';
    link.click();
  }
}));
