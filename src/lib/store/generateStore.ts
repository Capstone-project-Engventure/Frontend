import {create} from 'zustand';
import PromptService from '@/lib/services/prompt.service';
import { useApi } from '@/lib/Api';
import { useTopicStore } from './topicStore';
import { useExerciseTypeStore } from './exerciseTypeStore';
import { toast } from 'react-toastify';

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
      
      if (healthResult.success) {
        set({ healthStatus: healthResult.data });
        
        if (!healthResult.data.overall) {
          toast.error(`Hệ thống không khỏe mạnh. Mode: ${mode}`);
          return false;
        }
        
        if (!healthResult.data.database) {
          toast.error('Kết nối database không khả dụng');
          return false;
        }
        
        if (!healthResult.data.llm_api) {
          toast.error('LLM API không khả dụng');
          return false;
        }
        
        if (!healthResult.data.llm) {
          toast.error(`LLM không khả dụng cho mode: ${mode}`);
          return false;
        }
        
        toast.success(`Hệ thống khỏe mạnh. Mode: ${mode}`);
        return true;
      } else {
        set({ healthStatus: healthResult.data });
        toast.error(`Health check thất bại: ${healthResult.error}`);
        return false;
      }
    } catch (error: any) {
      console.error('Health check error:', error);
      toast.error('Không thể kiểm tra health của hệ thống');
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
      toast.error(errorMessage);
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
