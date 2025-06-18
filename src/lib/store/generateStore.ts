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
  error: string;

  setNumber: (number: number) => void;
  setSkill: (s: string) => void;
  setLevel: (l: string) => void;
  setTopic: (id: string) => void;
  setType: (id: string) => void;
  setMode: (m: 'vertex' | 'ollama') => void;
  setUseRag: (flag: boolean) => void;
  setPromptContent: (text: string) => void;
  updatePrompt: () => Promise<void>;
  generate: () => Promise<void>;
  exportResults: () => void;
}

export const useGenerateStore = create<GenerateState>((set, get) => ({
  number:1,
  skill: '',
  level: '',
  topicId: '',
  typeId: '',
  mode: 'vertex',
  useRag: false,
  prompt: 'default',
  prompt_content: '',
  results: [],
  loading: false,
  error: '',

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
      const topicTitle = topics.find(t => t.id === topicId)?.title || '';
      const typeName = types.find(t => t.id === typeId)?.name || '';
      // const text = await new PromptService().getAll({ skill, level, topic: topicTitle, type: typeName, mode, useRag });
     
      // console.log("prompt", text);
      set({ prompt_content: text });
    } catch (err) {
      console.error('Prompt update failed', err);
    }
  },

  generate: async () => {
    set({ loading: true, error: '' });
    try {
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
      const topicTitle = topics.find(t => t.id == topicId)?.title || '';
      const typeName = types.find(t => t.id == typeId)?.name || '';
      const res = await api.post('exercises/generate', { number,skill, level, topic: topicTitle, type_id: typeName, prompt_name: prompt, mode, use_rag: useRag });
      console.log('Generated exercises:', res.data);
      set({ results: res.data });
    } catch (err) {
      set({ error: 'Failed to generate exercise.' });
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
