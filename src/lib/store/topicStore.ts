import { create }  from 'zustand';
import TopicService from '@/lib/services/topic.service';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TopicState {
  topics: Array<{ id: string; title: string }>;
  fetchTopics: () => Promise<void>;
  clearTopics: () => void;
}
export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      topics: [],
      fetchTopics: async () => {
        if (get().topics.length) return;
        try {
          const res = await new TopicService().getAll({});
          set({ topics: res.data || [] });
        } catch (err) {
          console.error('Failed to fetch topics', err);
        }
      },
      clearTopics: () => {
        set({ topics: [] });
      },
    }),
    {
      name: 'topic-storage',       // key trong localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ topics: state.topics }),
    }
  )
);