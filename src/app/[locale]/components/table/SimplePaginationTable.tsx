import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Field {
  key: string;
  label: string;
  type?: "text" | "image" | "audio" | "number" | "link";
  nestKey?: string;
  isNest?: boolean;
}

interface SimplePaginationTableProps {
  data: any[];
  fields: Field[];
  keyField?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  linkBase?: string;
  loading?: boolean;
}

const SimplePaginationTable: React.FC<SimplePaginationTableProps> = ({
  data = [],
  fields,
  keyField = "id",
  currentPage,
  totalPages,
  onPageChange,
  linkBase = "",
  loading = false,
}) => {
  // Hàm để lấy giá trị từ nested object
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  // Render cell content dựa trên type của field
  const renderCellContent = (item: any, field: Field) => {
    const value = field.isNest ? item[field.key]?.[field.nestKey] : item[field.key];

    if (!value) return <span>-</span>;

    switch (field.type) {
      case "image":
        return (
          <Image
            src={value}
            alt={item.title || "Image"}
            width={40}
            height={40}
            className="rounded object-cover"
          />
        );
      
      case "audio":
        return (
          <audio controls className="w-32">
            <source src={value} />
            Your browser does not support the audio element.
          </audio>
        );
      
      case "link":
        return linkBase ? (
          <Link
            href={`${linkBase}/${item[keyField]}`}
            className="text-blue-600 hover:underline"
          >
            {value}
          </Link>
        ) : (
          <span>{value}</span>
        );
      
      case "number":
        return <span>{Number(value).toLocaleString()}</span>;
      
      default:
        return <span>{value}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {fields.map((field) => (
                <th
                  key={field.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item[keyField] || index} className="hover:bg-gray-50">
                  {fields.map((field) => (
                    <td
                      key={field.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {renderCellContent(item, field)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={fields.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Không có dữ liệu để hiển thị
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`p-2 rounded-md border text-sm ${
              currentPage <= 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-300 hover:bg-blue-50"
            }`}
          >
            <HiChevronLeft />
          </button>

          <div className="flex items-center gap-1">
            {/* Hiển thị số trang */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-50 border border-blue-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`p-2 rounded-md border text-sm ${
              currentPage >= totalPages
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-blue-600 border-blue-300 hover:bg-blue-50"
            }`}
          >
            <HiChevronRight />
          </button>
        </div>
      )}

      {/* Thông tin trang */}
      <div className="text-center text-sm text-gray-500 mt-2">
        Trang {currentPage} / {totalPages} ({data.length} mục)
      </div>
    </div>
  );
};

export default SimplePaginationTable;F