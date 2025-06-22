import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useApi } from '@/lib/Api';
import { toast } from 'react-toastify';

// Define the shape of each history record
export interface GenerateHistory {
  id: number;
  created_at: string;
  params: Record<string, any>;
  response: any;
  created_exercises: any[];
}

interface HistoryState {
  histories: GenerateHistory[];
  loading: boolean;
  error: string | null;
  fetchHistories: () => Promise<void>;
  addHistory: (history: GenerateHistory) => void;
  clearHistories: () => void;
  refreshHistories: () => Promise<void>;
}

export const useHistoryGenerateStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      histories: [],
      loading: false,
      error: null,

      // Fetch from backend 
      fetchHistories: async () => {
        if (get().histories.length > 0 && !get().error) return; // Skip if already loaded and no error
        
        set({ loading: true, error: null });
        try {
          const api = useApi();
          // Use the correct endpoint from backend: /api/v1/exercises/history-generate (no trailing slash)
          const res = await api.get('/history-generate');
          
          // Backend returns paginated results
          const histories = res.data.results || res.data || [];
          console.log('Fetched histories:', histories);
          
          set({ histories, loading: false });
        } catch (err: any) {
          const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch history';
          console.error('Failed to fetch history:', err);
          set({ error: errorMessage, loading: false });
          toast.error('Failed to load generation history');
        }
      },

      // Refresh histories (force reload)
      refreshHistories: async () => {
        set({ histories: [], error: null }); // Clear existing data
        await get().fetchHistories();
      },

      // Add a new record to the top (local state only, backend should handle persistence)
      addHistory: (history) => {
        set((state) => ({
          histories: [history, ...state.histories],
        }));
      },

      // Clear all
      clearHistories: () => {
        set({ histories: [], error: null });
      },
    }),
    {
      name: 'history-generate-storage', // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        histories: state.histories.slice(0, 20) // Only persist latest 20 entries to avoid localStorage bloat
      }),
    }
  )
);

