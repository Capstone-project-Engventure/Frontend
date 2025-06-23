import { create } from 'zustand';
import TopicService from '@/lib/services/topic.service';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Topic } from '../types/topic';

interface TopicState {
  topics: Array<Topic>;
  categoryCounts: Record<string, number>;
  lastFetchTime: number | null;
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  filteredTopics: Array<Topic>;
  fetchTopics: (force?: boolean) => Promise<void>;
  fetchCategoryStats: () => Promise<void>;
  setSelectedCategory: (category: string) => void;
  getTopicsByCategory: (category: string) => Array<Topic>;
  clearTopics: () => void;
  clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const topicService = new TopicService();

export const useTopicStore = create<TopicState>()(
  persist(
    (set, get) => ({
      topics: [],
      categoryCounts: {},
      lastFetchTime: null,
      isLoading: false,
      error: null,
      selectedCategory: '',
      filteredTopics: [],
      fetchTopics: async (force = false) => {
        const state = get();
        const now = Date.now();
        
        const shouldFetch = force || 
          !state.lastFetchTime || 
          (now - state.lastFetchTime) > CACHE_DURATION ||
          state.topics.length === 0;

        if (!shouldFetch) {
          console.log('📦 Using cached topics');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 Fetching topics from API...');
          const res = await topicService.getAll({});
          
          if (res.success && Array.isArray(res.data)) {
            const topics = res.data.map((topic: any) => ({
              ...topic,
              id: topic.id,
            }));

            set({ 
              topics,
              lastFetchTime: now,
              isLoading: false,
              error: null
            });

            const { selectedCategory } = get();
            if (selectedCategory) {
              const filtered = topics.filter(topic => topic.category === selectedCategory);
              set({ filteredTopics: filtered });
            } else {
              set({ filteredTopics: topics });
            }

            console.log(`✅ Fetched ${topics.length} topics`);
          } else {
            throw new Error('Failed to fetch topics');
          }
        } catch (err) {
          console.error('❌ Failed to fetch topics', err);
          set({ 
            error: err instanceof Error ? err.message : 'Failed to fetch topics',
            isLoading: false 
          });
        }
      },
      fetchCategoryStats: async () => {
        try {
          const res = await topicService.getCategoryStats();
          if (res.success && res.data) {
            set({ categoryCounts: res.data });
          }
        } catch (err) {
          console.error('Failed to fetch category stats', err);
        }
      },
      setSelectedCategory: (category: string) => {
        const { topics } = get();
        const filteredTopics = category 
          ? topics.filter(topic => topic.category === category)
          : topics;
        
        set({ 
          selectedCategory: category,
          filteredTopics
        });
      },
      getTopicsByCategory: (category: string) => {
        const { topics } = get();
        return category 
          ? topics.filter(topic => topic.category === category)
          : topics;
      },
      clearTopics: () => {
        set({ 
          topics: [], 
          categoryCounts: {},
          lastFetchTime: null,
          selectedCategory: '',
          filteredTopics: [],
          error: null
        });
      },
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'topic-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        topics: state.topics, 
        categoryCounts: state.categoryCounts,
        lastFetchTime: state.lastFetchTime
      }),
      version: 2,
    }
  )
);