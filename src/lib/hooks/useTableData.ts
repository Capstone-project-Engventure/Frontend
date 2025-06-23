import { useState, useEffect, useMemo } from 'react';

interface UseTableDataProps {
  service?: any;
  fetchFunction?: (args: any) => Promise<any>;
  customObjects?: any[];
  customTotalPages?: number;
  hasCustomFetch?: boolean;
  page: number;
  keyword: string;
  filterArgs?: any;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
}

export const useTableData = ({
  service,
  fetchFunction,
  customObjects,
  customTotalPages,
  hasCustomFetch,
  page,
  keyword,
  filterArgs,
  sortKey,
  sortOrder
}: UseTableDataProps) => {
  const [objects, setObjects] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      if (hasCustomFetch) {
        if (customObjects && Array.isArray(customObjects)) {
          console.log('Using custom objects:', customObjects);
          
          setObjects(customObjects);
          setTotalPages(customTotalPages || 1);
          return;
        }
      }

      if (!service && !fetchFunction) {
        // If no service or fetchFunction, but not using custom fetch, set empty array
        if (!hasCustomFetch) {
          setObjects([]);
          setTotalPages(1);
        }
        return;
      }

      const fetchArgs = {
        page,
        pageSize: 10,
        keyword,
        filter: filterArgs || null,
        sortKey,
        sortOrder,
      };

      const res = fetchFunction
        ? await fetchFunction(fetchArgs)
        : await service.getAll(fetchArgs);

      if (res.success && Array.isArray(res.data)) {
        setObjects(res.data);
        setTotalPages(res.total_page);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [page, keyword, customObjects, sortKey, sortOrder]);

  const sortedObjects = useMemo(() => {
    if (!sortKey) return objects;
    return [...objects].sort((a, b) => {
      const aVal = a?.[sortKey];
      const bVal = b?.[sortKey];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === "string")
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      if (typeof aVal === "number")
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      return 0;
    });
  }, [objects, sortKey, sortOrder]);

  return {
    objects: sortedObjects,
    totalPages,
    isLoading,
    refetch: handleFetchData
  };
};