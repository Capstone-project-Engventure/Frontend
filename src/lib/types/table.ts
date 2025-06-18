import React from 'react';

export interface TableField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'badge' | 'json' | 'actions';
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  render?: (value: any, record: any) => React.ReactNode;
  className?: string;
}

export interface ModalField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'json' | 'array' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  help?: string;
  validation?: (value: any) => string | null;
  options?: Array<{ value: any; label: string }>;
  disabled?: boolean;
  defaultValue?: any;
  className?: string;
  rows?: number; // for textarea
  min?: number; // for number
  max?: number; // for number
  step?: number; // for number
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface TableAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (record: any) => void;
  disabled?: (record: any) => boolean;
  type?: 'default' | 'primary' | 'danger' | 'warning';
  confirm?: {
    title: string;
    content: string;
  };
}

export interface TableConfig {
  fields: TableField[];
  modalFields: ModalField[];
  breadcrumbs: BreadcrumbItem[];
  actions?: TableAction[];
  hasImport?: boolean;
  hasExport?: boolean;
  hasCustomFetch?: boolean;
  hasSearch?: boolean;
  hasPagination?: boolean;
  hasSelection?: boolean;
  pageSize?: number;
}