import React from 'react';
import { TableCell } from './TableCell';
import { Field } from '@/lib/types';
import { HiPencil, HiTrash } from 'react-icons/hi';

interface TableRowProps {
  item: any;
  fields: Field[];
  keyField: string;
  linkBase?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  item,
  fields,
  keyField,
  linkBase,
  isSelected,
  onSelect,
  onEdit,
  onDelete
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
      <td className="p-4 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
        />
      </td>
      {fields.map((field) => (
        <TableCell
          key={field.key}
          field={field}
          item={item}
          keyField={keyField}
          linkBase={linkBase}
        />
      ))}
      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(item)}
            className="border-2 border-gray-300 rounded-sm p-0.5 text-indigo-600 hover:text-indigo-800"
            title="Edit"
          >
            <HiPencil className="text-lg" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <HiTrash className="text-lg" />
          </button>
        </div>
      </td>
    </tr>
  );
};
