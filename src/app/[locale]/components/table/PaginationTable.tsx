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
import { has, set } from "lodash";
import { toast } from "react-toastify";
import ImportModal from "../ImportModal";
import { ExportFile } from "@/lib/export-json";
import AudioPlayer from "../AudioPlayer";
import CustomSelector from "../TopicSelector";
import { OptionProps } from "react-select";
import TopicService from "@/lib/services/topic.service";
import LessonService from "@/lib/services/lesson.service";
import { useTranslations } from "next-intl";

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
  customObjects?: [];
  customTotalPages?: number;
  fields: Field[];
  page: number;
  onPageChange: (page: number) => void;
  service?: any;
  config?: any;
  modalFields?: Field[];
  modalTitle?: string;
  onSuccess?: () => void;
  linkBase?: string;
  breadcrumbs?: { label: string; href?: string }[];
  hasImport?: boolean;
  onHandleFile?: (file: File) => void;
  hasTopicSelector?: boolean;
  hasLessonSelector?: boolean;
  hasBreadcrumb?: boolean;
  hasCustomFetch?: boolean;
}

const PaginationTable: React.FC<PaginationTableProps> = ({
  // objects,
  customObjects,
  customTotalPages,
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
  onHandleFile,
  hasTopicSelector = false,
  hasLessonSelector = false,
  hasBreadcrumb = true,
  hasCustomFetch = false,
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
  const [sortKey, setSortKey] = useState<string>(""); // e.g., "name"
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [topics, setTopics] = useState<OptionProps[]>([]);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const t = useTranslations("PaginationTable");
  const topicService = new TopicService();
  const lessonService = new LessonService();

  const handleFetchData = async () => {
    try {
      if (hasCustomFetch) {
        if (
          customObjects &&
          Array.isArray(customObjects) &&
          customObjects.length > 0
        ) {
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
      const res = await service.getAll({
        page: page,
        pageSize: 10,
        keyword: keyword,
      });

      if (res.success && Array.isArray(res.data)) {
        // Handling sorting:
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

    const form = new FormData();
    if (config) {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "options") {
          form.append("options", JSON.stringify(value));
        } else if (value instanceof File) {
          form.append(key, value);
        } else if (typeof value === "string" && value.startsWith("http")) {
          // This is a URL of the already-uploaded file -> skip
        } else if (value === null || value === undefined || value === "") {
          // Skip empty fields
        } else {
          form.append(key, value);
        }
      });
    } else {
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "options") {
          form.append("options", JSON.stringify(value));
        } else if (value instanceof File) {
          form.append(key, value);
        } else if (typeof value === "string" && value.startsWith("http")) {
          // This is a URL of the already-uploaded file -> skip
        } else if (value === null || value === undefined || value === "") {
          // Skip empty fields
        } else {
          form.append(key, value);
        }
      });
    }

    try {
      let response;
      if (formData.id) {
        response = await service.update(formData.id, form, config);
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
  }, [page, keyword, customObjects]);

  useEffect(() => {
    // Reset selected items when page changes
    const handleSorting = () => {
      const sortedData = [...objects].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        if (aVal instanceof Date && bVal instanceof Date) {
          return sortOrder === "asc"
            ? (aVal as Date).getTime() - (bVal as Date).getTime()
            : (bVal as Date).getTime() - (aVal as Date).getTime();
        }

        return 0;
      });
      if (sortedData.length > 0) {
        setObjects(sortedData);
      }
    };
    handleSorting();
  }, [sortKey, sortOrder]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await topicService.getAll();
        if (res.success && Array.isArray(res.data)) {
          setTopics(
            res.data.map((t: any) => ({
              value: t.id,
              label: t.title,
            }))
          );
        } else {
          setTopics([]);
          toast.error("Error fetching topics");
        }
      } catch (error) {
        console.error("Error fetching topics: ", error);
      }
    };
    fetchTopics();
  }, []);

  // if (!objects || objects.length === 0) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <h1 className="text-2xl font-bold">Không có dữ liệu</h1>
  //     </div>
  //   );
  // }

  function handleSort(key: any) {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

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
              {/* <input
                type="text"
                placeholder="Search vocabulary..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
              <SearchInput keyword={keyword} onChange={setKeyword} />
              <div className="flex flex-row gap-2">
                {hasTopicSelector ? (
                  <CustomSelector
                    topics={topics}
                    value={selectedTopic}
                    onChange={setSelectedTopic}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
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
                  {fields.map((f: any) => (
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
                {objects.length > 0 ? (
                  objects.map((item) => (
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
                          ) : f.key === "options" &&
                            item[f.key] &&
                            Array(item[f.key]) ? (
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
                          {/* <label
                            htmlFor={`file_input_${field.key}`}
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Upload file
                          </label> */}

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
