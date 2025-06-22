import { create } from "zustand";
import ExerciseTypeService from "@/lib/services/exercise-types.service";

interface ExerciseType {
  id: string;
  name: string;
  description?: string;
}

interface TypeState {
  types: Array<ExerciseType>;
  fetchTypes: () => Promise<void>;
}

export const useExerciseTypeStore = create<TypeState>((set, get) => ({
  types: [],
  fetchTypes: async () => {
    if (get().types.length) return;
    try {
      const res = await new ExerciseTypeService().getAll({});
      if (res.success && Array.isArray(res.data)) {
        set({
          types: res.data.map((item: any) => ({ 
            id: item.id, 
            name: item.name, 
            description: item.description 
          }))
        });
      }
    } catch (err) {
      console.error("Failed to fetch exercise types", err);
    }
  },
}));
