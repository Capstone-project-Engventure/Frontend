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

    // Key field with link
    if ((field.key === "title" || field.type === "key") && linkBase && value) {
      return (
        <Link
          href={`${linkBase}/${item[keyField]}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {value}
        </Link>
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
      return <span>{getValueByPath(item, field.key)}</span>;
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
