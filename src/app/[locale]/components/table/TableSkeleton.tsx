import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-4">
        {/* Table header skeleton */}
        <div className="flex space-x-4">
          {[...Array(cols)].map((_, i) => (
            <div 
              key={`header-skel-${i}`} 
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
              style={{ flex: i === cols - 1 ? '0 0 80px' : '1' }} // Last column is smaller
            ></div>
          ))}
        </div>
        {/* Table rows skeleton */}
        {[...Array(rows)].map((_, i) => (
          <div key={`row-skel-${i}`} className="flex space-x-4">
            {[...Array(cols)].map((_, j) => (
              <div 
                key={`cell-skel-${i}-${j}`} 
                className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                style={{ flex: j === cols - 1 ? '0 0 80px' : '1' }} // Last column is smaller
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton; 