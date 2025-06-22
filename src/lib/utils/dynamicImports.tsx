import dynamic from 'next/dynamic';
import React, { ComponentType } from 'react';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Dynamic import wrapper with loading state
export const createDynamicComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: ComponentType;
    ssr?: boolean;
  }
) => {
  return dynamic(importFn, {
    loading: options?.loading || LoadingSpinner,
    ssr: options?.ssr ?? true,
  });
};

// Heavy components that should be loaded dynamically
export const DynamicImportModal = createDynamicComponent(
  () => import('@/app/[locale]/components/ImportModal'),
  { ssr: false }
);

export const DynamicPaginationTable = createDynamicComponent(
  () => import('@/app/[locale]/components/table/PaginationTable'),
  { ssr: false }
);

export const DynamicAdvancedDataTable = createDynamicComponent(
  () => import('@/app/[locale]/components/table/AdvancedDataTable'),
  { ssr: false }
);

export const DynamicTipTapEditor = createDynamicComponent(
  () => import('@tiptap/react').then(mod => ({ default: mod.EditorContent })),
  { ssr: false }
);

export const DynamicRecharts = createDynamicComponent(
  () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })),
  { ssr: false }
);

// Utility for conditional dynamic imports
export const conditionalImport = async <T>(
  condition: boolean,
  importFn: () => Promise<T>
): Promise<T | null> => {
  if (condition) {
    return await importFn();
  }
  return null;
};

// Icon bundles for better tree shaking
export const loadLucideIcons = () => import('lucide-react');
export const loadHeroIcons = () => import('react-icons/hi');
export const loadFontAwesome = () => import('react-icons/fa'); 