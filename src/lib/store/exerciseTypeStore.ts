import {create} from 'zustand';
import ExerciseTypeService from '@/lib/services/exercise-types.service';

interface TypeState {
  types: Array<{ id: string; name: string }>;
  fetchTypes: () => Promise<void>;
}

export const useExerciseTypeStore = create<TypeState>((set, get) => ({
  types: [],
  fetchTypes: async () => {
    if (get().types.length) return;
    try {
      const res = await new ExerciseTypeService().getAll({});
      set({ types: res.data || [] });
    } catch (err) {
      console.error('Failed to fetch exercise types', err);
    }
  }
}));