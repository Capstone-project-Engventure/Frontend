import React from 'react';

interface PaginationCardProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const PaginationCard: React.FC<PaginationCardProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}) => {
    // Nếu chỉ có 1 trang hoặc ít hơn thì không hiển thị pagination
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <nav className={`flex items-center justify-center ${className}`} aria-label="Pagination">
            <div className="flex items-center space-x-1">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-l-md ${currentPage === 1
                        ? 'text-gray-300 bg-white border border-gray-300 cursor-not-allowed'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 cursor-pointer'}`}
                >
                    <span className="sr-only">Previous</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Page numbers */}
                {visiblePages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300">
                                ...
                            </span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border cursor-pointer ${currentPage === page
                                    ? 'z-10 bg-amber-50 border-amber-500 text-amber-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-r-md ${currentPage === totalPages
                        ? 'text-gray-300 bg-white border border-gray-300 cursor-not-allowed'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 cursor-pointer'}`}
                >
                    <span className="sr-only">Next</span>
                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default PaginationCard;