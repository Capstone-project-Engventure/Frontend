import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import { useTableData } from '@/lib/hooks/useTableData';
import { useTableSelection } from '@/lib/hooks/useTableSelection';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { TableActions } from './TableActions';
import { SearchInput } from '@/app/[locale]/components/SearchInput';
import { Pagination } from './Pagination';
import { FormModal } from '@/app/[locale]/components/form/FormModal';
import { Field } from '@/lib/types';

interface PaginationTableProps {
  // Core props only
  fields: Field[];
  service?: any;
  page: number;
  onPageChange: (page: number) => void;

  // Optional customization
  keyField?: string;
  customObjects?: any[];
  customTotalPages?: number;
  modalFields?: Field[];
  modalTitle?: string;
  linkBase?: string;
  breadcrumbs?: { label: string; href?: string }[];
  hasImport?: boolean;
  hasCustomFetch?: boolean;

  // Event handlers
  onAdd?: (data: any) => void;
  onUpdate?: (id: string | number, data: any) => void;
  onDelete?: (id: string | number) => void;
  onBulkDelete?: (ids: (string | number)[]) => Promise<any>;
  onEdit?: (item: any) => any;
  onView?: (item: any) => void;
  onCreate?: () => void;
  onSuccess?: () => void;
}

const AdvancedDataTable: React.FC<PaginationTableProps> = ({
  fields,
  service,
  page,
  onPageChange,
  keyField = "id",
  customObjects,
  customTotalPages,
  modalFields,
  modalTitle = "Add/Edit Item",
  linkBase = "",
  breadcrumbs = [],
  hasImport = true,
  hasCustomFetch = false,
  onAdd,
  onUpdate,
  onDelete,
  onBulkDelete,
  onEdit,
  onView,
  onCreate,
  onSuccess
}) => {
  // Search and filter state
  const [keyword, setKeyword] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Custom hooks
  const { objects, totalPages, isLoading, refetch } = useTableData({
    service,
    customObjects,
    customTotalPages,
    hasCustomFetch,
    page,
    keyword,
    sortKey,
    sortOrder
  });

  const { selectedItems, handleCheckboxChange, toggleSelectAll, clearSelection } = useTableSelection();

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleAdd = () => {
    if (onCreate) {
      onCreate();
      setIsModalOpen(true);
    } else {
      setFormData({});
      setIsModalOpen(true);
    }
  };

  const handleEdit = (item: any) => {
    if (onEdit) {
      const editData = onEdit(item);
      // Use returned data from onEdit or fallback to item
      setFormData(editData && typeof editData === 'object' ? editData : item);
      setIsModalOpen(true);
    } else {
      setFormData(item);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data from the custom event if available, otherwise use current formData
    const submissionData = (e.target as any)?.formData || formData;

    try {
      let response;
      if (submissionData?.id) {
        response = onUpdate
          ? await onUpdate(submissionData.id, submissionData)
          : await service?.update(submissionData.id, submissionData);
      } else {
        response = onAdd
          ? await onAdd(submissionData)
          : await service?.create(submissionData);
      }

      if (response?.success) {
        setIsModalOpen(false);
        setFormData(null);
        refetch();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = onDelete
        ? await onDelete(id)
        : await service?.delete(id);
      
      if (response?.success) {
        refetch();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      if (onBulkDelete) {
        // Use custom bulk delete handler
        await onBulkDelete(selectedItems);
        clearSelection();
        refetch();
        onSuccess?.();
      } else if (service?.bulkDelete) {
        // Use service bulk delete method
        const response = await service.bulkDelete(selectedItems);
        if (response?.success) {
          clearSelection();
          refetch();
          onSuccess?.();
        }
      } else if (onDelete || service?.delete) {
        // Fallback: delete items one by one
        const deletePromises = selectedItems.map(id => 
          onDelete ? onDelete(id) : service?.delete(id)
        );
        
        const responses = await Promise.all(deletePromises);
        const allSuccessful = responses.every(response => response?.success);
        
        if (allSuccessful) {
          clearSelection();
          refetch();
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };

  // Render simplified JSX
  return (
    <div className="relative overflow-x-auto shadow-xl sm:rounded-lg w-full">
      {/* Search and Actions */}
      <div className="mb-4">
        {/* <SearchInput keyword={keyword} onChange={setKeyword} /> */}
        <TableActions
          selectedCount={selectedItems.length}
          onAdd={handleAdd}
          onDeleteSelected={handleBulkDelete}
          onExport={() => {/* Handle export */}}
          onImport={() => {/* Handle import */}}
          hasImport={hasImport}
          isLoading={isLoading}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <TableHeader
            fields={fields}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedItems={selectedItems}
            allItems={objects}
            onToggleSelectAll={() => toggleSelectAll(objects.map(obj => obj.id))}
          />
          <tbody className="bg-white dark:bg-gray-800">
            {objects.length > 0 ? (
              objects.map((item) => (
                <TableRow
                  key={item.id}
                  item={item}
                  fields={fields}
                  keyField={keyField}
                  linkBase={linkBase}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={handleCheckboxChange}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={onView}
                />
              ))
            ) : (
              <tr>
                <td colSpan={fields.length + 2} className="px-6 py-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      {/* Modal */}
      {isModalOpen && (
        <FormModal
          onClose={() => {
            setIsModalOpen(false);
            setFormData(null);
          }}
          onSubmit={handleSubmit}
          fields={modalFields ?? []}
          formData={formData}
          title={modalTitle}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AdvancedDataTable;