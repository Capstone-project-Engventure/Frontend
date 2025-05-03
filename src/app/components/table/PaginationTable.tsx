import Link from "next/link";
import { useState } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
export default function PaginationTable({
  objects = [],
  fields = [],
  page = 1,
  totalPages = 1,
  onPageChange = () => {},
  onAdd = (formData: any) => {},
  onDelete = (id: number) => {},
  onUpdate = (formData: any) => {},
  linkBase = "",
}) {
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState<any>(null);
  const isModalOpen = formData !== null;

  const handleEdit = (item) => {
    setFormData(item); // item includes id -> edit
  };

  const handleAddClick = () => {
    const emptyData = {};
    fields.forEach((f) => {
      emptyData[f.key] = "";
    });
    setFormData(emptyData); // no id -> add
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (formData.id) {
      onUpdate(formData); // Edit
    } else {
      onAdd(formData); // Add
    }
    setFormData(null);
  };

  const handleCloseModal = () => {
    setFormData(null);
  };

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {fields.map((f) => (
                <th
                  key={f.key}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase"
                >
                  {f.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {objects.length > 0 ? (
              objects.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  {fields.map((f) => (
                    <td
                      key={f.key}
                      className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {f.key === "title" && linkBase ? (
                        <Link
                          href={`${linkBase}/${item.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {item[f.key]}
                        </Link>
                      ) : (
                        item[f.key]
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                      >
                        <HiPencil className="text-lg" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <HiTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  Không co du lieu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`px-3 py-1 rounded-md border text-sm ${
            page <= 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-blue-600 border-blue-300 hover:bg-blue-50"
          }`}
        >
          <HiChevronLeft />
        </button>

        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`px-3 py-1 rounded-md border text-sm ${
            page >= totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "text-blue-600 border-blue-300 hover:bg-blue-50"
          }`}
        >
          <HiChevronRight />
        </button>
      </div>
     
    </div>
  );
}
