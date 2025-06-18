import { Field } from '@/lib/types';
import React from 'react';

interface TableHeaderProps {
  fields: Field[];
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  onSort: (key: string) => void;
  selectedItems: string[];
  allItems: any[];
  onToggleSelectAll: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  fields,
  sortKey,
  sortOrder,
  onSort,
  selectedItems,
  allItems,
  onToggleSelectAll
}) => {
  return (
    <thead className="bg-gray-100 dark:bg-gray-700">
      <tr>
        <th scope="col" className="p-4 text-center">
          <input
            type="checkbox"
            onChange={onToggleSelectAll}
            checked={selectedItems.length === allItems.length && allItems.length > 0}
          />
        </th>
        {fields.map((field) => (
          <th
            key={field.key}
            className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase cursor-pointer"
            onClick={() => onSort(field.key)}
          >
            <div className="flex items-center gap-1">
              {field.label}
              {sortKey === field.key && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </div>
          </th>
        ))}
        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
          Actions
        </th>
      </tr>
    </thead>
  );
};