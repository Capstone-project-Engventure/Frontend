// lib/store/promptStore.ts
import {create} from "zustand";
import { immer } from "zustand/middleware/immer";
import  promptService  from "@/lib/services/prompt.service";
import { Prompt, PromptFormData } from "@/lib/types/prompt";
import { TableField, ModalField } from "@/lib/types/table";
import { toast } from "react-toastify";

interface PromptStoreState {
  // Data
  prompts: Prompt[];
  selectedPrompt: Prompt | null;

  // UI State
  loading: boolean;
  modalOpen: boolean;
  modalMode: "create" | "edit" | "view" | null;

  // Pagination & Filtering
  currentPage: number;
  totalPages: number;
  pageSize: number;
  searchKeyword: string;
  filters: Record<string, any>;

  // Selection
  selectedIds: Set<number>;

  // Error handling
  error: string | null;

  // Table configuration
  fields: TableField[];
  modalFields: ModalField[];
  breadcrumbs: Array<{ label: string; href: string }>;
  hasImport: boolean;
  hasCustomFetch: boolean;

  // Actions
  setPage: (page: number) => void;
  setSearchKeyword: (kw: string) => void;
  setFilters: (filters: Record<string, any>) => void;

  toggleSelection: (id: number) => void;
  clearSelection: () => void;
  selectAll: () => void;

  openCreateModal: () => void;
  openEditModal: (prompt: Prompt) => void;
  closeModal: () => void;

  fetchPrompts: () => Promise<void>;
  createPrompt: (
    data: PromptFormData
  ) => Promise<{ success: boolean; error?: string }>;
  updatePrompt: (
    id: number | string,
    data: PromptFormData
  ) => Promise<{ success: boolean; error?: string }>;
  deletePrompt: (
    id: number | string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteMultiple: (
    ids: number[]
  ) => Promise<{ success: boolean; error?: string }>;
  duplicatePrompt: (
    id: number
  ) => Promise<{ success: boolean; error?: string }>;
  toggleActive: (
    id: number
  ) => Promise<{ success: boolean; error?: string }>;
  validateTemplate: (
    template: string,
    variables: any[]
  ) => Promise<{ success: boolean; data: any }>;
  testPrompt: (
    id: number,
    testData: Record<string, any>
  ) => Promise<{ success: boolean; data: any }>;

  // For AdvancedDataTable compatibility
  service: {
    list: () => Promise<void>;
    create: (data: PromptFormData) => Promise<{ success: boolean; error?: string }>;
    update: (
      id: number | string,
      data: PromptFormData
    ) => Promise<{ success: boolean; error?: string }>;
    delete: (id: number | string) => Promise<{ success: boolean; error?: string }>;
  };
}

export const usePromptStore = create<PromptStoreState>()(
  immer((set, get) => ({
    // --- initial state ---
    prompts: [],
    selectedPrompt: null,
    loading: false,
    modalOpen: false,
    modalMode: null,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20,
    searchKeyword: "",
    filters: {},
    selectedIds: new Set<number>(),
    error: null,

    // --- table config (static) ---
    fields: [
      { key: "id", label: "ID", type: "number", sortable: true, width: "80px" },
      { key: "name", label: "Tên Prompt", type: "text", sortable: true, searchable: true, width: "200px" },
      {
        key: "content", label: "Nội dung", type: "text", width: "300px",
        render: (v: string) => v.length > 100 ? `${v.slice(0,100)}...` : v
      },
      {
        key: "variables", label: "Biến", type: "number", width: "80px",
        render: (v: any[]) => `${v?.length || 0} biến`
      },
      {
        key: "use_few_shot", label: "Few Shot", type: "badge", width: "100px",
        render: (v: boolean) => v ? "Có" : "Không"
      },
      {
        key: "is_active", label: "Trạng thái", type: "badge", width: "100px",
        render: (v: boolean) => v ? "Hoạt động" : "Tạm dừng"
      },
      { key: "created_at", label: "Ngày tạo", type: "date", sortable: true, width: "120px" },
      { key: "actions", label: "Thao tác", type: "actions", width: "120px" }
    ],
    modalFields: [
      // ... copy y hệt phần cấu hình trong MobX example ...
    ],
    breadcrumbs: [
      { label: "Trang chủ", href: "/admin" },
      { label: "Quản lý Prompt", href: "/admin/prompts" }
    ],
    hasImport: true,
    hasCustomFetch: true,

    // --- sync controls ---
    setPage: (page) => {
      set(state => { state.currentPage = page; });
      get().fetchPrompts();
    },
    setSearchKeyword: (kw) => {
      set(state => {
        state.searchKeyword = kw;
        state.currentPage = 1;
      });
      get().fetchPrompts();
    },
    setFilters: (filters) => {
      set(state => {
        state.filters = { ...filters };
        state.currentPage = 1;
      });
      get().fetchPrompts();
    },

    toggleSelection: (id) => {
      set(state => {
        if (state.selectedIds.has(id)) state.selectedIds.delete(id);
        else state.selectedIds.add(id);
      });
    },
    clearSelection: () => {
      set(state => state.selectedIds.clear());
    },
    selectAll: () => {
      set(state => {
        state.prompts.forEach(p => state.selectedIds.add(p.id));
      });
    },

    openCreateModal: () => {
      set(state => {
        state.modalMode = "create";
        state.selectedPrompt = null;
        state.modalOpen = true;
      });
    },
    openEditModal: (prompt) => {
      set(state => {
        state.modalMode = "edit";
        state.selectedPrompt = prompt;
        state.modalOpen = true;
      });
    },
    closeModal: () => {
      set(state => {
        state.modalOpen = false;
        state.modalMode = null;
        state.selectedPrompt = null;
      });
    },

    // --- API Actions ---
    fetchPrompts: async () => {
      set(state => { state.loading = true; state.error = null; });
      try {
        const resp = await promptService.getAll({
          page: get().currentPage,
          pageSize: get().pageSize,
          keyword: get().searchKeyword,
          filters: get().filters
        });
        if (resp.success && Array.isArray(resp.data)) {
          set(state => {
            state.prompts = resp.data;
            state.totalPages = resp.total_page || 1;
          });
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi xảy ra";
          toast.error(msg);
          set(state => { state.error = msg; });
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi tải dữ liệu";
        toast.error(msg);
        set(state => { state.error = msg; });
      } finally {
        set(state => { state.loading = false; });
      }
    },

    createPrompt: async (data) => {
      try {
        const resp = await promptService.create(data, {});
        if (resp.success) {
          toast.success("Tạo prompt thành công");
          get().closeModal();
          await get().fetchPrompts();
          return { success: true };
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
          toast.error(msg);
          return { success: false, error: msg };
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi tạo prompt";
        toast.error(msg);
        return { success: false, error: msg };
      }
    },

    updatePrompt: async (id, data) => {
      try {
        const resp = await promptService.update(id, data, {});
        if (resp.success) {
          toast.success("Cập nhật prompt thành công");
          get().closeModal();
          await get().fetchPrompts();
          return { success: true };
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
          toast.error(msg);
          return { success: false, error: msg };
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi cập nhật prompt";
        toast.error(msg);
        return { success: false, error: msg };
      }
    },

    deletePrompt: async (id) => {
      try {
        const resp = await promptService.delete(id);
        if (resp.success) {
          toast.success("Xóa prompt thành công");
          await get().fetchPrompts();
          return { success: true };
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
          toast.error(msg);
          return { success: false, error: msg };
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi xóa prompt";
        toast.error(msg);
        return { success: false, error: msg };
      }
    },

    deleteMultiple: async (ids) => {
      try {
        const resp = await promptService.deleteMultiple(ids);
        if (resp.success) {
          toast.success(`Xóa ${ids.length} prompt thành công`);
          get().clearSelection();
          await get().fetchPrompts();
          return { success: true };
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
          toast.error(msg);
          return { success: false, error: msg };
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi xóa prompt";
        toast.error(msg);
        return { success: false, error: msg };
      }
    },

    duplicatePrompt: async (id) => {
      try {
        const resp = await promptService.duplicatePrompt(id);
        if (resp.success) {
          toast.success("Nhân bản prompt thành công");
          await get().fetchPrompts();
          return { success: true };
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
          toast.error(msg);
          return { success: false, error: msg };
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi nhân bản prompt";
        toast.error(msg);
        return { success: false, error: msg };
      }
    },

    toggleActive: async (id) => {
      try {
        const resp = await promptService.toggleActive(id);
        if (resp.success) {
          toast.success("Cập nhật trạng thái thành công");
          await get().fetchPrompts();
          return { success: true };
        } else {
          const msg = typeof resp.data === "string" ? resp.data : "Có lỗi";
          toast.error(msg);
          return { success: false, error: msg };
        }
      } catch (err: any) {
        const msg = err.message || "Lỗi khi cập nhật trạng thái";
        toast.error(msg);
        return { success: false, error: msg };
      }
    },

    validateTemplate: async (template, variables) => {
      try {
        return await promptService.validateTemplate(template, variables);
      } catch (err: any) {
        return { success: false, data: err.message || "Lỗi khi validate" };
      }
    },

    testPrompt: async (id, testData) => {
      try {
        return await promptService.testPrompt(id, testData);
      } catch (err: any) {
        return { success: false, data: err.message || "Lỗi khi test prompt" };
      }
    },

    // AdvancedDataTable compatibility
    service: {
      list: () => get().fetchPrompts(),
      create: (data) => get().createPrompt(data),
      update: (id, data) => get().updatePrompt(id, data),
      delete: (id) => get().deletePrompt(id),
    },
  }))
);
