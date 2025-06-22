// // lib/store/promptStore.ts
// import {create} from "zustand";
// import { immer } from "zustand/middleware/immer";
// import  PromptService  from "@/lib/services/prompt.service";
// import { Prompt, PromptFormData } from "@/lib/types/prompt";
// import { TableField, ModalField } from "@/lib/types/table";
// import { toast } from "react-toastify";
// const promptService = new PromptService();

// interface PromptStoreState {
//   // Data
//   prompts: Prompt[];
//   selectedPrompt: Prompt | null;

//   // UI State
//   loading: boolean;
//   modalOpen: boolean;
//   modalMode: "create" | "edit" | "view" | null;

//   // Pagination & Filtering
//   currentPage: number;
//   totalPages: number;
//   pageSize: number;
//   searchKeyword: string;
//   filters: Record<string, any>;

//   // Selection
//   selectedIds: Set<number>;

//   // Error handling
//   error: string | null;

//   // Table configuration
//   fields: TableField[];
//   modalFields: ModalField[];
//   breadcrumbs: Array<{ label: string; href: string }>;
//   hasImport: boolean;
//   hasCustomFetch: boolean;

//   // Actions
//   setPage: (page: number) => void;
//   setSearchKeyword: (kw: string) => void;
//   setFilters: (filters: Record<string, any>) => void;

//   toggleSelection: (id: number) => void;
//   clearSelection: () => void;
//   selectAll: () => void;

//   openCreateModal: () => void;
//   openEditModal: (prompt: Prompt) => void;
//   closeModal: () => void;

//   fetchPrompts: () => Promise<void>;
//   createPrompt: (
//     data: PromptFormData
//   ) => Promise<{ success: boolean; error?: string }>;
//   updatePrompt: (
//     id: number | string,
//     data: PromptFormData
//   ) => Promise<{ success: boolean; error?: string }>;
//   deletePrompt: (
//     id: number | string
//   ) => Promise<{ success: boolean; error?: string }>;
//   deleteMultiple: (
//     ids: number[]
//   ) => Promise<{ success: boolean; error?: string }>;
//   duplicatePrompt: (
//     id: number
//   ) => Promise<{ success: boolean; error?: string }>;
//   toggleActive: (
//     id: number
//   ) => Promise<{ success: boolean; error?: string }>;
//   validateTemplate: (
//     template: string,
//     variables: any[]
//   ) => Promise<{ success: boolean; data: any }>;
//   testPrompt: (
//     id: number,
//     testData: Record<string, any>
//   ) => Promise<{ success: boolean; data: any }>;

//   // For AdvancedDataTable compatibility
//   service: {
//     list: () => Promise<void>;
//     create: (data: PromptFormData) => Promise<{ success: boolean; error?: string }>;
//     update: (
//       id: number | string,
//       data: PromptFormData
//     ) => Promise<{ success: boolean; error?: string }>;
//     delete: (id: number | string) => Promise<{ success: boolean; error?: string }>;
//   };
// }

// export const usePromptStore = create<PromptStoreState>()(
//   immer((set, get) => ({
//     // --- initial state ---
//     prompts: [],
//     selectedPrompt: null,
//     loading: false,
//     modalOpen: false,
//     modalMode: null,
//     currentPage: 1,
//     totalPages: 1,
//     pageSize: 20,
//     searchKeyword: "",
//     filters: {},
//     selectedIds: new Set<number>(),
//     error: null,

//     // --- table config (static) ---
//     fields: [
//       { key: "id", label: "ID", type: "number", sortable: true, width: "80px" },
//       { key: "name", label: "Tên Prompt", type: "text", sortable: true, searchable: true, width: "200px" },
//       {
//         key: "content", label: "Nội dung", type: "text", width: "300px",
//         render: (v: string) => v.length > 100 ? `${v.slice(0,100)}...` : v
//       },
//       {
//         key: "variables", label: "Biến", type: "number", width: "80px",
//         render: (v: any[]) => `${v?.length || 0} biến`
//       },
//       {
//         key: "use_few_shot", label: "Few Shot", type: "badge", width: "100px",
//         render: (v: boolean) => v ? "Có" : "Không"
//       },
//       {
//         key: "is_active", label: "Trạng thái", type: "badge", width: "100px",
//         render: (v: boolean) => v ? "Hoạt động" : "Tạm dừng"
//       },
//       { key: "created_at", label: "Ngày tạo", type: "date", sortable: true, width: "120px" },
//       { key: "actions", label: "Thao tác", type: "actions", width: "120px" }
//     ],
//     modalFields: [
//       // ... copy y hệt phần cấu hình trong MobX example ...
//     ],
//     breadcrumbs: [
//       { label: "Trang chủ", href: "/admin" },
//       { label: "Quản lý Prompt", href: "/admin/prompts" }
//     ],
//     hasImport: true,
//     hasCustomFetch: true,

//     // --- sync controls ---
//     setPage: (page) => {
//       set(state => { state.currentPage = page; });
//       get().fetchPrompts();
//     },
//     setSearchKeyword: (kw) => {
//       set(state => {
//         state.searchKeyword = kw;
//         state.currentPage = 1;
//       });
//       get().fetchPrompts();
//     },
//     setFilters: (filters) => {
//       set(state => {
//         state.filters = { ...filters };
//         state.currentPage = 1;
//       });
//       get().fetchPrompts();
//     },

//     toggleSelection: (id) => {
//       set(state => {
//         if (state.selectedIds.has(id)) state.selectedIds.delete(id);
//         else state.selectedIds.add(id);
//       });
//     },
//     clearSelection: () => {
//       set(state => state.selectedIds.clear());
//     },
//     selectAll: () => {
//       set(state => {
//         state.prompts.forEach(p => state.selectedIds.add(p.id));
//       });
//     },

//     openCreateModal: () => {
//       set(state => {
//         state.modalMode = "create";
//         state.selectedPrompt = null;
//         state.modalOpen = true;
//       });
//     },
//     openEditModal: (prompt) => {
//       set(state => {
//         state.modalMode = "edit";
//         state.selectedPrompt = prompt;
//         state.modalOpen = true;
//       });
//     },
//     closeModal: () => {
//       set(state => {
//         state.modalOpen = false;
//         state.modalMode = null;
//         state.selectedPrompt = null;
//       });
//     },

//     // --- API Actions ---
//     fetchPrompts: async () => {
//       set(state => { state.loading = true; state.error = null; });
//       try {
//         const resp = await promptService.getAll({
//           page: get().currentPage,
//           pageSize: get().pageSize,
//           keyword: get().searchKeyword,
//           filters: get().filters
//         });
//         if (resp.success && Array.isArray(resp.data)) {
//           set(state => {
//             state.prompts = resp.data;
//             state.totalPages = resp.total_page || 1;
//           });
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi xảy ra";
//           toast.error(msg);
//           set(state => { state.error = msg; });
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi tải dữ liệu";
//         toast.error(msg);
//         set(state => { state.error = msg; });
//       } finally {
//         set(state => { state.loading = false; });
//       }
//     },

//     createPrompt: async (data) => {
//       try {
//         const resp = await promptService.create(data, {});
//         if (resp.success) {
//           toast.success("Tạo prompt thành công");
//           get().closeModal();
//           await get().fetchPrompts();
//           return { success: true };
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
//           toast.error(msg);
//           return { success: false, error: msg };
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi tạo prompt";
//         toast.error(msg);
//         return { success: false, error: msg };
//       }
//     },

//     updatePrompt: async (id, data) => {
//       try {
//         const resp = await promptService.update(id, data, {});
//         if (resp.success) {
//           toast.success("Cập nhật prompt thành công");
//           get().closeModal();
//           await get().fetchPrompts();
//           return { success: true };
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
//           toast.error(msg);
//           return { success: false, error: msg };
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi cập nhật prompt";
//         toast.error(msg);
//         return { success: false, error: msg };
//       }
//     },

//     deletePrompt: async (id) => {
//       try {
//         const resp = await promptService.delete(id);
//         if (resp.success) {
//           toast.success("Xóa prompt thành công");
//           await get().fetchPrompts();
//           return { success: true };
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
//           toast.error(msg);
//           return { success: false, error: msg };
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi xóa prompt";
//         toast.error(msg);
//         return { success: false, error: msg };
//       }
//     },

//     deleteMultiple: async (ids) => {
//       try {
//         const resp = await promptService.deleteMultiple(ids);
//         if (resp.success) {
//           toast.success(`Xóa ${ids.length} prompt thành công`);
//           get().clearSelection();
//           await get().fetchPrompts();
//           return { success: true };
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
//           toast.error(msg);
//           return { success: false, error: msg };
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi xóa prompt";
//         toast.error(msg);
//         return { success: false, error: msg };
//       }
//     },

//     duplicatePrompt: async (id) => {
//       try {
//         const resp = await promptService.duplicatePrompt(id);
//         if (resp.success) {
//           toast.success("Nhân bản prompt thành công");
//           await get().fetchPrompts();
//           return { success: true };
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
//           toast.error(msg);
//           return { success: false, error: msg };
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi nhân bản prompt";
//         toast.error(msg);
//         return { success: false, error: msg };
//       }
//     },

//     toggleActive: async (id) => {
//       try {
//         const resp = await promptService.toggleActive(id);
//         if (resp.success) {
//           toast.success("Cập nhật trạng thái thành công");
//           await get().fetchPrompts();
//           return { success: true };
//         } else {
//           const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
//           toast.error(msg);
//           return { success: false, error: msg };
//         }
//       } catch (err: any) {
//         const msg = err.message || "Lỗi khi cập nhật trạng thái";
//         toast.error(msg);
//         return { success: false, error: msg };
//       }
//     },

//     validateTemplate: async (template, variables) => {
//       try {
//         return await promptService.validateTemplate(template, variables);
//       } catch (err: any) {
//         return { success: false, data: err.message || "Lỗi khi validate" };
//       }
//     },

//     testPrompt: async (id, testData) => {
//       try {
//         return await promptService.testPrompt(id, testData);
//       } catch (err: any) {
//         return { success: false, data: err.message || "Lỗi khi test prompt" };
//       }
//     },

//     // AdvancedDataTable compatibility
//     service: {
//       list: () => get().fetchPrompts(),
//       create: (data) => get().createPrompt(data),
//       update: (id, data) => get().updatePrompt(id, data),
//       delete: (id) => get().deletePrompt(id),
//     },
//   }))
// );

import { create } from 'zustand';
import PromptService from '@/lib/services/prompt.service';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Prompt } from '../types/prompt';

interface PromptState {
  // Data
  prompts: Array<Prompt>;
  recentPrompts: Array<Prompt>;
  selectedPrompt: Prompt | null;
  lastFetchTime: number | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchPrompts: (force?: boolean) => Promise<void>;
  fetchRecentPrompts: () => Promise<void>;
  getPromptsBySkillAndType: (skill?: string, type?: string) => Promise<Prompt[]>;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  getPromptByName: (name: string) => Promise<Prompt | null>;
  clearPrompts: () => void;
  clearError: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const promptService = new PromptService();

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      // Initial state
      prompts: [],
      recentPrompts: [],
      selectedPrompt: null,
      lastFetchTime: null,
      isLoading: false,
      error: null,

      // Fetch all prompts with smart caching
      fetchPrompts: async (force = false) => {
        const state = get();
        const now = Date.now();
        
        // Check if we need to fetch (cache expired or force refresh)
        const shouldFetch = force || 
          !state.lastFetchTime || 
          (now - state.lastFetchTime) > CACHE_DURATION ||
          state.prompts.length === 0;

        if (!shouldFetch) {
          console.log('📦 Using cached prompts');
          return;
        }

        set({ isLoading: true, error: null });
        
        try {
          console.log('🔄 Fetching prompts from API...');
          const res = await promptService.getAllPrompts();
          
          if (res.success && Array.isArray(res.data)) {
            set({ 
              prompts: res.data,
              lastFetchTime: now,
              isLoading: false,
              error: null
            });
            console.log(`✅ Fetched ${res.data.length} prompts`);
          } else {
            throw new Error(res.error || 'Failed to fetch prompts');
          }
        } catch (err) {
          console.error('❌ Failed to fetch prompts', err);
          set({ 
            error: err instanceof Error ? err.message : 'Failed to fetch prompts',
            isLoading: false 
          });
        }
      },

      // Fetch recent prompts (frequently used)
      fetchRecentPrompts: async () => {
        try {
          const res = await promptService.getRecentPrompts(4);
          if (res.success) {
            set({ recentPrompts: res.data });
          }
        } catch (err) {
          console.error('Failed to fetch recent prompts', err);
        }
      },

      // Get prompts filtered by skill and type
      getPromptsBySkillAndType: async (skill?: string, type?: string) => {
        try {
          const res = await promptService.getPromptsBySkillAndType(skill, type);
          if (res.success) {
            return res.data;
          }
          return [];
        } catch (err) {
          console.error('Failed to fetch filtered prompts', err);
          return [];
        }
      },

      // Set selected prompt for the form
      setSelectedPrompt: (prompt: Prompt | null) => {
        set({ selectedPrompt: prompt });
      },

      // Get specific prompt by name
      getPromptByName: async (name: string) => {
        try {
          const res = await promptService.getByName(name);
          if (res.success && res.data) {
            return res.data;
          }
          return null;
        } catch (err) {
          console.error('Failed to fetch prompt by name', err);
          return null;
        }
      },

      // Clear all prompts and cache
      clearPrompts: () => {
        set({ 
          prompts: [], 
          recentPrompts: [],
          selectedPrompt: null,
          lastFetchTime: null,
          error: null
        });
      },

      // Clear error state
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'prompt-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        prompts: state.prompts, 
        recentPrompts: state.recentPrompts,
        lastFetchTime: state.lastFetchTime
      }),
      // Don't persist loading states and selected prompt
      version: 1,
    }
  )
);
