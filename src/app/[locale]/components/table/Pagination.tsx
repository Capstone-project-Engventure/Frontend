import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6 mb-4">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-3 py-1 rounded-md border text-sm ${
          currentPage <= 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-blue-600 border-blue-300 hover:bg-blue-50"
        }`}
      >
        <HiChevronLeft />
      </button>

      <span className="text-sm text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-3 py-1 rounded-md border text-sm ${
          currentPage >= totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-blue-600 border-blue-300 hover:bg-blue-50"
        }`}
      >
        <HiChevronRight />
      </button>
    </div>
  );
};