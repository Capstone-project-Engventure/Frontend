import { create } from "zustand";
import PromptService from "@/lib/services/prompt.service";

interface PromptState {
  prompts: Array<{ id: string; name: string }>;
  fetchPrompts: () => Promise<void>;
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  fetchPrompts: async () => {
    if (get().prompts.length) return;
    try {
      const res = await new PromptService().getAll();
      set({ prompts: res.data || [] });
    } catch (err) {
      console.error("Failed to fetch prompts", err);
    }
  },
}));
