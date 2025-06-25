import { HiPlus } from "react-icons/hi";

interface TableActionsProps {
  selectedCount: number;
  onAdd: () => void;
  onDeleteSelected: () => void;
  onExport: () => void;
  onImport: () => void;
  hasImport: boolean;
  customActions?: React.ReactNode;
  isLoading: boolean;
}

export const TableActions: React.FC<TableActionsProps> = ({
  selectedCount,
  onAdd,
  onDeleteSelected,
  onExport,
  onImport,
  hasImport,
  customActions,
  isLoading
}) => {
  return (
    <div className="flex justify-between my-3 px-4">
      <div className="flex items-center gap-4">
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedCount} items selected
            </span>
            <button
              onClick={onDeleteSelected}
              className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              disabled={isLoading}
            >
              Delete {selectedCount}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center">
        {customActions}
        <button
          onClick={onAdd}
          className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
        >
          <HiPlus className="text-lg" />
          Add
        </button>
        {hasImport && (
          <>
            <button
              onClick={onExport}
              className="cursor-pointer flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
            >
              Export
            </button>
            <button
              onClick={onImport}
              className="cursor-pointer flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm"
            >
              Import
            </button>
          </>
        )}
      </div>
    </div>
  );
};
