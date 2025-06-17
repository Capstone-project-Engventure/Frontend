import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useApi } from '@/lib/Api';

// Define the shape of each history record
export interface GenerateHistory {
  id: number;
  timestamp: string;
  params: Record<string, any>;
  exercises: any[];
}

interface HistoryState {
  histories: GenerateHistory[];
  fetchHistories: () => Promise<void>;
  addHistory: (history: GenerateHistory) => void;
  clearHistories: () => void;
}

export const useHistoryGenerateStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      histories: [],

      // Fetch from backend if not already loaded
      fetchHistories: async () => {
        if (get().histories.length > 0) return;
        try {
          const api = useApi();
          const res = await api.get('/exercises/history');
          // assumes paginated: { results: GenerateHistory[] }
          set({ histories: res.data.results || [] });
        } catch (err) {
          console.error('Failed to fetch history', err);
        }
      },

      // Add a new record to the top
      addHistory: (history) => {
        set((state) => ({
          histories: [history, ...state.histories],
        }));
      },

      // Clear all
      clearHistories: () => set({ histories: [] }),
    }),
    {
      name: 'history-generate-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ histories: state.histories }),
    }
  )
);

