import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import Breadcrumb from "../breadcumb";
import { SearchInput } from "../SearchInput";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { set } from "lodash";
import { toast } from "react-toastify";
import ImportModal from "../ImportModal";
import { ExportFile } from "@/lib/export-json";
import AudioPlayer from "../AudioPlayer";

interface Field {
  key: string;
  label: string;
  type?:
    | "text"
    | "image"
    | "select"
    | "textarea"
    | "audio"
    | "number"
    | "hidden"
    | "mcq";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  nestKey?: string;
  isNest?: boolean;
  default?: string | number;
  choices?: Array<string>;
}

interface PaginationTableProps {
  fields: Field[];
  page: number;
  onPageChange: (page: number) => void;
  service: any;
  config: any;
  modalFields?: Field[];
  modalTitle?: string;
  onSuccess?: () => void;
  linkBase?: string;
  breadcrumbs?: { label: string; href?: string }[];
  hasImport?: boolean;
  onHandleFile?: (file:File) => void;
}

const PaginationTable: React.FC<PaginationTableProps> = ({
  // objects,
  fields,
  page,
  onPageChange,
  service,
  config,
  modalFields,
  modalTitle = "Add/Edit Item",
  onSuccess,
  linkBase = "",
  breadcrumbs = [],
  hasImport = true,
  onHandleFile = (file:File) => {},
}) => {
  const [objects, setObjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isDialogOpen, setDialogIsOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogBody, setDialogBody] = useState("");

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const handleFetchData = async () => {
    try {
      const res = await service.getAll(page, 10, keyword);
      if (res.success) {
        setObjects(res.data);
        setTotalPages(res.total_page);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleAdd = () => {
    setFormData({});
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await service.delete(id);
      if (response.success) {
        onSuccess?.();
        toast.info(`Đã xóa chủ đề ${selectedItem} thành công!`);
        handleFetchData();
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      alert("Error deleting item");
    } finally {
      setSelectedItem(null);
      setIsLoading(false);
    }
  };

  const toggleDeleteDialog = () => {
    setDialogIsOpen(true);
    if (selectedItems.length > 1) {
      setDialogTitle("Xóa nhiều chủ đề");
      setDialogBody(
        `Bạn có chắc chắn muốn xóa ${selectedItems.length}này không?`
      );
    } else {
      setDialogTitle("Xóa chủ đề");
      setDialogBody("Bạn có chắc chắn muốn xóa này không?");
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    setIsLoading(true);
    try {
      // Assuming service has a deleteMultiple method
      console.log("Deleting items: ", selectedItems);

      const response = await service.deleteMultiple(selectedItems);
      if (response.success) {
        setSelectedItems([]);
        onSuccess?.();
        toast.info(`Đã xóa ${selectedItems.length} chủ đề thành công!`);
      } else {
        alert("Failed to delete items");
      }
    } catch (error) {
      alert("Error deleting items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Check Form data: ", formData);

    const form = new FormData();
    if (config) {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "options") {
          form.append("options", JSON.stringify(value));
        } else if (value instanceof File) {
          form.append(key, value);
        } else {
          form.append(key, value);
        }
      });
    }
    console.log("Check Form data after sign: ", form);
    try {
      let response;
      if (form.id) {
        response = await service.update(form.id, form, config);
      } else {
        response = await service.create(form, config);
      }
      if (response.success) {
        setIsModalOpen(false);
        onSuccess?.();
      } else {
        alert("Failed to save item");
      }
    } catch (error) {
      alert("Error saving item");
    } finally {
      setIsLoading(false);
      handleFetchData();
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    handleFetchData();
  }, [page, keyword]);

  useEffect(() => {
    if (!modalFields) {
      console.log("Check not good: ", modalFields);

      return;
    }
    modalFields.map((field) => {
      if (field.type === "hidden") {
        setFormData({
          ...formData,
          [field.key]: field.default,
        });
      }
    });
    console.log("formData: ", fields, formData);
  }, [modalFields]);

  return (
    <>
      <div className="py-2">
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {selectedItems.length > 0 && (
          <div className="p-4 bg-gray-100 flex justify-between items-center">
            <span>{selectedItems.length} mục được chọn</span>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              disabled={isLoading}
            >
              Xóa {selectedItems.length} mục
            </button>
          </div>
        )}
        <div className="mt-8">
          <div className="flex justify-between mb-4 px-2">
            <div className="w-1/3">
              {/* <input
                type="text"
                placeholder="Search vocabulary..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
              <SearchInput keyword={keyword} onChange={setKeyword} />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                <HiPlus className="text-lg" />
                Add
              </button>
              {hasImport ? (
                <>
                  <button
                    onClick={() => {
                      ExportFile(objects, "data", "json");
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition text-sm border border-primary"
                  >
                    Xuất file
                  </button>

                  <button
                    onClick={() => setIsFileModalOpen(true)}
                    className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-light transition text-sm border border-secondary"
                  >
                    Nhập file
                  </button>
                  <ImportModal
                    isOpen={isFileModalOpen}
                    onClose={() => {
                      setIsFileModalOpen(false);
                    }}
                    onHandleFile={() => onHandleFile()}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="p-4">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(objects.map((obj) => obj.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      checked={selectedItems.length === objects.length}
                    />
                  </th>
                  {fields.map((f: any) => (
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
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
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
                          ) : f.key === "image" && item[f.key] ? (
                            <Image
                              src={item[f.key]}
                              alt={item.title || "Image"}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          ) : f.key === "audio_file" && item[f.key] ? (
                            <AudioPlayer src={item[f.key]} />
                          ) : f.isNest && item[f.key] ? (
                            <span>{item[f.key]?.[f.nestKey]}</span>
                          ) : f.key === "options" && typeof item[f.key] === "object" ? (
                            <ul className="list-disc list-inside">
                              {Object.entries(item[f.key]).map(([optKey, optValue]) => (
                                <li key={optKey}>
                                  <strong>{optKey.toUpperCase()}:</strong> {optValue}
                                </li>
                              ))}
                            </ul>
                          ):(
                            item[f.key]
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="border-2 border-gray-300 rounded-sm p-0.5 text-indigo-600 hover:text-indigo-800"
                            title="Edit"
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item?.id);
                              toggleDeleteDialog();
                            }}
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
                      colSpan={fields.length + 2}
                      className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="flex justify-center items-center gap-2 mt-6 mb-4 ">
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

        {/* Modal */}
        {isModalOpen && modalFields && (
          <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-10 ">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[calc(100vh-2rem)] overflow-y-auto min-w-xl">
              <h2 className="text-xl font-bold mb-4">{modalTitle}</h2>
              <form onSubmit={handleSubmit}>
                {modalFields.map((field) => {
                  if (field.type === "hidden") {
                    return (
                      <input
                        key={field.key}
                        type="hidden"
                        value={field.default || ""}
                        name={field.key}
                      />
                    );
                  }
                  if (
                    field.type === "mcq" &&
                    formData.type !== "3aded9b5-2f14-4814-bf39-707d5bffcb76"
                  ) {
                    return null;
                  }
                  return (
                    <div key={field.key} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.key] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={formData[field.key] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === "mcq" ? (
                        <>
                          {field.choices?.map((opt) => (
                            <div key={opt} className="flex items-center mb-2">
                              <label className="mr-2">{opt}</label>
                              <input
                                key={opt}
                                type="text"
                                placeholder={`Option ${opt}`}
                                value={formData.options?.[opt] || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    options: {
                                      ...(formData.options || {}),
                                      [opt]: e.target.value,
                                    },
                                  })
                                }
                                className="mt-1 mb-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          ))}
                        </>
                      ) : field.type === "image" || field.type === "audio" ? (
                        <input
                          type="file"
                          accept={
                            field.type === "image" ? "image/*" : "audio/*"
                          }
                          onChange={(e) => {
                            console.log(
                              "File selected: ",
                              field.key,
                              e.target.files?.[0]
                            );

                            setFormData({
                              ...formData,
                              [field.key]: e.target.files?.[0],
                            });

                            console.log("Form data: ", formData);
                          }}
                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[field.key] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setDialogIsOpen(false)}
          className="fixed inset-0 bg-gray-400/70 z-12 flex items-center justify-center"
        >
          <DialogPanel transition className={"bg-white p-6 rounded-lg"}>
            <DialogTitle className="text-lg font-bold mb-4">
              {dialogTitle}
            </DialogTitle>
            <p className="p-2 mt-2">{dialogBody}</p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setDialogIsOpen(false);
                  handleDelete(selectedItem);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Xóa
              </button>
              <button
                onClick={() => {
                  setSelectedItems([]);
                  setDialogIsOpen(false);
                }}
                className="ml-2 border px-4 py-2 rounded hover:bg-gray-100"
              >
                Hủy
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </div>
    </>
  );
};

export default PaginationTable;
