import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Field } from '@/lib/types';

interface TableCellProps {
  field: Field;
  item: any;
  keyField: string;
  linkBase?: string;
}

export const TableCell: React.FC<TableCellProps> = ({
  field,
  item,
  keyField,
  linkBase
}) => {
  const getValueByPath = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  const renderCellContent = () => {
    const value = item[field.key];

    // Custom render function
    if (field.render && typeof field.render === 'function') {
      return field.render(value, item);
    }

    // Key field with link
    if ((field.key === "title" || field.key === "name" || field.type === "key") && linkBase && value) {
      return (
        <Link
          href={`${linkBase}/${item[keyField]}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {value}
        </Link>
      );
    }

    // Count field (display array length)
    if (field.type === "count" && Array.isArray(value)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value.length}
        </span>
      );
    }

    // Excerpt field (truncate text)
    if (field.type === "excerpt" && value) {
      const maxLength = (field as any).maxLength || 100;
      return (
        <span className="text-gray-600 dark:text-gray-400">
          {typeof value === 'string' && value.length > maxLength 
            ? value.substring(0, maxLength) + '...'
            : value
          }
        </span>
      );
    }

    // Image field
    if (field.type === "image" && value) {
      return (
        <Image
          src={value}
          alt={item.title || "Image"}
          width={40}
          height={40}
          className="rounded object-cover"
        />
      );
    }

    // Audio field
    if (field.type === "audio" && value) {
      return <audio controls src={value} className="w-32" />;
    }

    // Nested field
    if (field.isNest && value && field.nestKey) {
      return <span>{value[field.nestKey]}</span>;
    }

    // MCQ field (Multiple Choice Questions)
    if (field.type === "mcq" && value && Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((opt: { key: string; option: string }, index: number) => (
            <li key={opt.key || index}>
              <strong>{opt?.key?.toUpperCase()}:</strong> {opt.option}
            </li>
          ))}
        </ul>
      );
    }

    // Object field (nested path)
    if (typeof value === "object" && value !== null) {
      // Handle arrays
      if (Array.isArray(value)) {
        if (value.length === 0) return <span>No items</span>;
        
        // Check if it's an array of objects with key/option structure (like MCQ options)
        if (value.length > 0 && typeof value[0] === "object" && value[0]?.key && value[0]?.option) {
          return (
            <ul className="list-disc list-inside text-xs">
              {value.map((opt: { key: string; option: string }, index: number) => (
                <li key={opt.key || index}>
                  <strong>{opt.key?.toUpperCase()}:</strong> {opt.option}
                </li>
              ))}
            </ul>
          );
        }
        
        // For other arrays, join with comma
        return <span>{value.join(", ")}</span>;
      }
      
      // Handle objects
      if (value.name) return <span>{value.name}</span>;
      if (value.title) return <span>{value.title}</span>;
      if (value.label) return <span>{value.label}</span>;
      
      // For other objects, show as JSON string (truncated if too long)
      const jsonStr = JSON.stringify(value);
      if (jsonStr.length > 100) {
        return <span>{jsonStr.substring(0, 100)}...</span>;
      }
      return <span>{jsonStr}</span>;
    }

    // Default: simple value
    return <span>{value || "-"}</span>;
  };

  return (
    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
      {renderCellContent()}
    </td>
  );
};
