// import dynamic from 'next/dynamic';
// import React from 'react';
// import type { DynamicOptionsLoadingProps } from 'next/dist/shared/lib/dynamic' 

// Loading component
// const LoadingSpinner = () => (
//   <div className="flex items-center justify-center p-4">
//     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//   </div>
// );

// // Simple dynamic imports without complex typing
// export const DynamicImportModal = dynamic(
//   () => import('@/app/[locale]/components/ImportModal'),
//   { 
//     loading: () => <LoadingSpinner />,
//     ssr: false 
//   }
// );

// export const DynamicPaginationTable = dynamic(
//   () => import('@/app/[locale]/components/table/PaginationTable'),
//   { 
//     loading: () => <LoadingSpinner />,
//     ssr: false 
//   }
// );

// export const DynamicAdvancedDataTable = dynamic(
//   () => import('@/app/[locale]/components/table/AdvancedDataTable'),
//   { 
//     loading: () => <LoadingSpinner />,
//     ssr: false 
//   }
// );

// export const DynamicTipTapEditor = dynamic(
//   () => import('@tiptap/react').then(mod => ({ default: mod.EditorContent })),
//   { 
//     loading: () => <LoadingSpinner />,
//     ssr: false 
//   }
// );

// export const DynamicRecharts = dynamic(
//   () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })),
//   { 
//     loading: () => <LoadingSpinner />,
//     ssr: false 
//   }
// );

// // Icon bundles for better tree shaking
// export const loadLucideIcons = () => import('lucide-react');
// export const loadHeroIcons = () => import('react-icons/hi');
// export const loadFontAwesome = () => import('react-icons/fa'); 