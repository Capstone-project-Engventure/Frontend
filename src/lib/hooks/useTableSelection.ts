import { useState } from 'react';

export const useTableSelection = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = (allIds: string[]) => {
    setSelectedItems(allIds);
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const toggleSelectAll = (allIds: string[]) => {
    if (selectedItems.length === allIds.length) {
      clearSelection();
    } else {
      selectAll(allIds);
    }
  };

  return {
    selectedItems,
    handleCheckboxChange,
    selectAll,
    clearSelection,
    toggleSelectAll
  };
};
