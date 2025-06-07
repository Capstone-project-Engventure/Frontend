import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
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
import { has, set } from "lodash";
import { toast } from "react-toastify";
import ImportModal from "../ImportModal";
import { ExportFile } from "@/lib/export-json";
import AudioPlayer from "../AudioPlayer";
import { useTranslations } from "next-intl";
import { FetchArgs, ServiceResponse } from "@/lib/types/api";

interface Field {
  key: string;
  label: string;
  type?:
    | "key"
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
  customObjects?: [];
  customTotalPages?: number;
  fields: Field[];
  keyField?: string;
  page: number;
  onPageChange: (page: number) => void;
  service?: any;
  objectType?: any;
  config?: any;
  modalFields?: Field[];
  modalTitle?: string;
  onSuccess?: () => void;
  linkBase?: string;
  breadcrumbs?: { label: string; href?: string }[];
  hasImport?: boolean;
  fetchArgs?: FetchArgs;
  filterArgs?: any;
  filterComponents?: React.ReactNode;
  customActions?: React.ReactNode;
  fetchFunction?: (args: FetchArgs) => Promise<ServiceResponse>;
  onAdd?: (data: any, config: any) => void;
  onUpdate?: (id: string, data: any, config: any) => void;
  onHandleFile?: (file: File) => void;
  hasBreadcrumb?: boolean;
  hasCustomFetch?: boolean;
}

const PaginationTable: React.FC<PaginationTableProps> = ({
  // objects,
  customObjects,
  customTotalPages,
  fields,
  keyField = "id",
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
  fetchFunction,
  filterArgs,
  // fetchArgs,
  filterComponents,
  customActions,
  onHandleFile,
  onAdd,
  onUpdate,
  hasBreadcrumb = true,
  hasCustomFetch = false,
}) => {
  const [objects, setObjects] = useState<any[]>([]);
  const [isMounted] = useState({ current: true });
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

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
  const [sortKey, setSortKey] = useState<string>(""); // e.g., "name"
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const t = useTranslations("PaginationTable");

  const handleFetchData = async () => {
    if (!service && !fetchFunction) return;
    try {
      if (hasCustomFetch) {
        if (customObjects && Array.isArray(customObjects)) {
          setObjects(customObjects);
          setTotalPages(customTotalPages || 1);
          return;
        } else {
          console.error(
            "Custom objects is not an array or is undefined",
            customObjects
          );
          return;
        }
      }

      const fetchArgs: FetchArgs = {
        page,
        pageSize: 10,
        keyword,
        filter: filterArgs ? filterArgs : null,
        sortKey,
        sortOrder,
      };
      console.log("check args: ", fetchArgs);

      const res = fetchFunction
        ? await fetchFunction(fetchArgs)
        : await service.getAll(fetchArgs);
      console.log("Response: ", res);

      if (!res.success || !Array.isArray(res.data)) {
        toast.error(res.message || t("apiError"));
        return;
      }
      if (isMounted.current) {
        console.log("Setting objects: ", res.data);

        setObjects(res.data);
        setTotalPages(res.total_page);
        if (page > res.total_page) onPageChange(res.total_page || 1);
      } else {
        console.warn("Component is unmounted, skipping state update.");
      }
    } catch (err) {
      console.log("Error: ", err);
      toast.error(t("networkError"));
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
        toast.error("Failed to delete item");
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
      console.log("Deleting items: ", selectedItems);

      const response = await service.deleteMultiple(selectedItems);
      if (response.success) {
        setSelectedItems([]);
        onSuccess?.();
        toast.info(`Đã xóa ${selectedItems.length} chủ đề thành công!`);
        handleFetchData();
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
    console.log("Check formData: ", formData);

    let dataToSend = { ...formData };

    const isMultiPart = config?.headers?.["Content-Type"]?.includes(
      "multipart/form-data"
    );
    if (isMultiPart) {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "options") {
          form.append("options", JSON.stringify(value));
        } else if (value instanceof File) {
          form.append(key, value);
        } else if (typeof value === "string" && value.startsWith("http")) {
          // If the value is a URL, append it directly
          form.append(key, value);
        } else if (value !== null && value !== undefined && value !== "") {
          form.append(key, value);
        } else {
          form.append(key, value);
        }
      });
      dataToSend = form;
    }

    console.log("Check formData after : ", dataToSend);

    try {
      let response;
      if (formData.id) {
        response = onUpdate
          ? await onUpdate(formData.id, dataToSend, config)
          : await service.update(formData.id, dataToSend, config);
      } else {
        response = onAdd
          ? await onAdd(dataToSend, config)
          : await service.create(dataToSend, config);
      }
      if (response.success) {
        setIsModalOpen(false);
        handleFetchData();
        await onSuccess?.();
      } else {
        toast.error("Failed to save item");
      }
    } catch (error) {
      toast.error("Error saving item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    handleFetchData();
  }, [isMounted.current, page, keyword, customObjects]);

  function handleSort(key: string) {
    if (!key) return;
    setSortKey((prev) => (prev === key ? prev : key));
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  // Method to take nest field
  const getValueByPath = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

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

  return (
    <>
      {hasBreadcrumb && (
        <div className="py-2">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
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
            <div className="flex flex-col gap-2 w-1/3">
              <SearchInput keyword={keyword} onChange={setKeyword} />
              {filterComponents && (
                <div className="mb-4 flex flex-wrap gap-4 items-center">
                  {filterComponents}
                </div>
              )}
            </div>
            <div className="flex flex-row gap-2 items-center">
              {customActions ? customActions : <></>}
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                <HiPlus className="text-lg" />
                {t("add")}
              </button>
              {hasImport ? (
                <>
                  <button
                    onClick={() => {
                      ExportFile(objects, "data", "json");
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-light transition text-sm border border-primary"
                  >
                    {t("exportFile")}
                  </button>

                  <button
                    onClick={() => setIsFileModalOpen(true)}
                    className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-light transition text-sm border border-secondary"
                  >
                    {t("importFile")}
                  </button>
                  <ImportModal
                    isOpen={isFileModalOpen}
                    onClose={() => {
                      setIsFileModalOpen(false);
                    }}
                    onHandleFile={onHandleFile}
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
                  <th scope="col" className="p-4 text-center">
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
                  {(fields as Field[]).map((f) => (
                    <th
                      key={f.key}
                      className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase"
                      onClick={() => handleSort(f.key)}
                    >
                      <div className="flex items-center gap-1">
                        {f.label}
                        {sortKey === f.key && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {sortedObjects.length > 0 ? (
                  sortedObjects.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      {(fields as Field[]).map((f) => (
                        <td
                          key={f.key}
                          className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300"
                        >
                          {(f.key === "title" || f.type === "key") &&
                          linkBase ? (
                            <Link
                              href={`${linkBase}/${item[keyField]}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {item[f.key]}
                            </Link>
                          ) : f.type === "image" && item[f.key] ? (
                            <Image
                              src={item[f.key]}
                              alt={item.title || "Image"}
                              width={40}
                              height={40}
                              className="rounded object-cover"
                            />
                          ) : f.type === "audio" && item[f.key] ? (
                            <AudioPlayer src={item[f.key]} />
                          ) : f.isNest && item[f.key] ? (
                            <span>{item[f.key]?.[f.nestKey]}</span>
                          ) : f.type === "mcq" &&
                            item[f.key] &&
                            Array.isArray(item[f.key]) ? (
                            <ul className="list-disc list-inside">
                              {item[f.key].map(
                                (opt: { key: string; option: string }) => (
                                  <li key={opt.key}>
                                    <strong>{opt.key.toUpperCase()}:</strong>{" "}
                                    {opt.option}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : typeof item[f.key] === "object" && item[f.key] ? (
                            <span>{getValueByPath(item, f.key)}</span>
                          ) : (
                            <span>{item[f.key]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="border-2 border-gray-300 rounded-sm p-0.5 text-indigo-600 hover:text-indigo-800"
                            title={t("edit")}
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(item?.id);
                              toggleDeleteDialog();
                            }}
                            className="text-red-600 hover:text-red-800"
                            title={t("delete")}
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
                  if (field.type === "mcq") {
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
                          {Array.from(formData.options || []).map(
                            (opt, index) => {
                              return (
                                <div
                                  key={opt?.key}
                                  className="flex items-center mb-2"
                                >
                                  <label className="mr-2">{opt?.key}</label>
                                  <input
                                    key={opt?.key}
                                    type="text"
                                    placeholder={`Option ${opt}`}
                                    value={formData.options[index].option || ""}
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
                              );
                            }
                          )}
                        </>
                      ) : field.type === "image" || field.type === "audio" ? (
                        <div className="mb-4">
                          <input
                            type="file"
                            accept={
                              field.type === "image" ? "image/*" : "audio/*"
                            }
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [field.key]: e.target.files?.[0],
                              });
                            }}
                            className=" p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            aria-describedby={`file_input_help_${field.key}`}
                          />
                          <p
                            id={`file_input_help_${field.key}`}
                            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                          >
                            {field.type === "image"
                              ? "PNG, JPG or GIF (MAX. 800x400px)"
                              : "MP3, WAV or similar formats"}
                          </p>

                          {/* Hiển thị preview file nếu có */}
                          {formData[field.key] && (
                            <div className="mt-2">
                              {field.type === "image" ? (
                                <img
                                  src={
                                    typeof formData[field.key] === "string"
                                      ? formData[field.key]
                                      : URL.createObjectURL(formData[field.key])
                                  }
                                  alt="Preview"
                                  className="max-w-xs max-h-40 rounded shadow"
                                />
                              ) : (
                                <audio
                                  controls
                                  src={
                                    typeof formData[field.key] === "string"
                                      ? formData[field.key]
                                      : URL.createObjectURL(formData[field.key])
                                  }
                                  className="w-full mt-1"
                                />
                              )}
                            </div>
                          )}
                        </div>
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
                {t("delete")}
              </button>
              <button
                onClick={() => {
                  setSelectedItems([]);
                  setDialogIsOpen(false);
                }}
                className="ml-2 border px-4 py-2 rounded hover:bg-gray-100"
              >
                {t("cancel")}
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      </div>
    </>
  );
};

export default PaginationTable;
