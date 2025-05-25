"use client";
import { useState, useEffect, useCallback } from "react";
import { Transition } from "@headlessui/react";
import VocabularyService from "@/lib/services/vocabulary.service";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import debounce from "lodash.debounce";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
import TopicSelect from "@/app/[locale]/components/TopicSelector";
import { OptionType } from "@/lib/types/option";
import { ExportFile } from "@/lib/export-json";
import ImportModal from "@/app/[locale]/components/ImportModal";
import { Vocabulary } from "@/lib/types/vocabulary";
import { toast } from "react-toastify";

type VocabModalProps = {
  vocab?: Vocabulary;
  mode: "view" | "edit" | "add";
  onClose: () => void;
  onSave?: (data: Vocabulary) => void;
};
function VocabModal({ vocab, mode, onClose, onSave }: VocabModalProps) {
  if (!vocab) return null;
  const isViewMode = mode === "view";
  const [form, setForm] = useState<Vocabulary>({
    id: 0,
    word: "",
    part_of_speech: "",
    meaning: "",
    example_sentence: "",
    image: "",
  });
  useEffect(() => {
    if (vocab) setForm(vocab);
  }, [vocab]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-700/70 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ×
        </button>

        {form.image && !isViewMode ? (
          <div className="mb-4">
            <label className="block font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
            />
          </div>
        ) : (
          form.image && (
            <img
              src={form.image}
              alt={form.word}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )
        )}

        {isViewMode ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{form.word}</h2>
            <p className="italic text-gray-600 mb-2">{form.part_of_speech}</p>
            <p className="mb-2 text-gray-800">{form.meaning}</p>
            <p className="text-gray-500 text-sm">{form.example_sentence}</p>
          </>
        ) : (
          <form className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Word</label>
              <input
                type="text"
                name="word"
                value={form.word}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Part of Speech</label>
              <input
                type="text"
                name="part_of_speech"
                value={form.part_of_speech}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Meaning</label>
              <textarea
                name="meaning"
                value={form.meaning}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                rows={3}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Example Sentence</label>
              <textarea
                name="example_sentence"
                value={form.example_sentence}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
                rows={3}
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {mode === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function VocabCard({
  vocab,
  onEdit,
  onDelete,
  onClick,
}: {
  vocab: any;
  onEdit: (vocab: any) => void;
  onDelete: (vocab: any) => void;
  onClick: (vocab: any) => void;
}) {
  return (
    // <div className="bg-white rounded-lg shadow-md p-4 w-full">
    <>
      <div
        className="relative bg-white rounded-lg shadow-md p-4 w-full cursor-pointer hover:shadow-lg transition"
        onClick={() => onClick(vocab)}
      >
        {/* Edit & Delete Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vocab);
            }}
          >
            <HiPencil size={18} />
          </button>
          <button
            className="text-red-600 hover:text-red-800"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(vocab);
            }}
          >
            <HiTrash size={18} />
          </button>
        </div>

        {vocab.image && (
          <img
            src={vocab.image}
            alt={vocab.word}
            className="w-full h-32 object-cover rounded-md mb-2"
          />
        )}
        <h3 className="font-semibold text-lg">{vocab.word}</h3>
        <p className="text-gray-600 italic">({vocab.part_of_speech})</p>
        <p className="text-gray-800 mb-1">{vocab.meaning}</p>
        <p className="text-sm text-gray-500">{vocab.example_sentence}</p>
      </div>
    </>
  );
}

export default function AdminVocabulary() {
  const vocabularyService = new VocabularyService();
  const topicService = new TopicService();
  const [vocab, setVocab] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [topicListSelection, setTopicListSelection] = useState<[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<OptionType>({
    value: "",
    label: "Tìm kiếm chủ đề...",
  });
  const [selectedPOS, setSelectedPOS] = useState("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState(null);

  const fetchVocabByFilters = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("selectedTopic", selectedTopic);

      if (!selectedTopic) {
        setSelectedTopic({ value: "", label: "" });
      }
      if (!selectedPOS || selectedPOS == "") {
        setSelectedPOS("");
      }
      console.log("selectedPOS", selectedPOS);
      const res = await vocabularyService.getAllVocabulary(
        page,
        pageSize,
        searchKeyword,
        selectedTopic?.value,
        selectedPOS
      );
      if (!res.success) throw new Error("Failed to fetch");
      setVocab(res.data || []);
      setTotalPages(res.total_page || 1);
    } catch (err) {
      setError("Error loading vocabulary");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchKeyword(value);
      setPage(1); // Reset to first page when searching
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const fields = [
    { key: "image", label: "Image", type: "image" },
    { key: "word", label: "Word" },
    { key: "meaning", label: "Meaning" },
    { key: "part_of_speech", label: "Word type" },
    { key: "example_sentence", label: "Examples" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "word", label: "Word", type: "text" },
    { key: "meaning", label: "Meaning", type: "text" },
    {
      key: "part_of_speech",
      label: "Word type",
      type: "select",
      options: [
        { value: "n", label: "Noun" },
        { value: "v", label: "Verb" },
        { value: "adj", label: "Adjective" },
      ],
    },
    { key: "example_sentence", label: "Examples", type: "textarea" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "image", label: "Image", type: "image" },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Vocabulary", href: "/admin/exercises/vocabulary" },
  ];

  const toggleImportFile = () => {
    setIsFileModalOpen(!isFileModalOpen);
  };

  const handleEdit = (item: any) => {
    console.log("Edit", item);
    item.mode = "edit";
    setSelectedVocab(item);
    // open edit form or modal
  };

  const handleDelete = async (item: any) => {
    if (confirm(`Delete ${item.word}?`)) {
      console.log("Delete", item);
      // call delete API
      const res =await vocabularyService.delete(item.id);
      if (res.success){
        toast.success("Delete successfully", {
          position: "top-right",
      })}
      else {
        toast.error("Delete failed", {
          position: "top-right",})
      
      }
    }
  };

  const handleClick = (item: any) => {
    setSelectedVocab(item);
    item.mode = "view";
    setSelectedVocab(item);
  };

  const handleImportFile = async (file: any) => {
    try {
      const res = await vocabularyService.importVocabByFile(file);
      console.log("res", res);
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setIsFileModalOpen(false);
    }
  };

  useEffect(() => {
    fetchVocabByFilters();
  }, [page, pageSize, searchKeyword, selectedTopic, selectedPOS]);

  useEffect(() => {
    const fetchTopics = async () => {
      await topicService.getAll().then((res) => {
        if (!res.success) throw new Error("Failed to fetch topics");
        if (Array.isArray(res.data)) {
          const tempList = [];
          res.data.map((topic: Topic) =>
            tempList.push({
              value: topic.id,
              label: topic.title,
            })
          );
          setTopicListSelection(tempList);
        }
        setTopicList(res.data);
      });
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (!error) return;
    toast.error(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
    setError("");
  }, [error]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vocabulary List</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex flex-row">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between w-full">
              <div className="flex flex-row gap-2">
                <TopicSelect
                  topics={topicListSelection}
                  onChange={setSelectedTopic}
                  value={selectedTopic}
                />

                <select
                  className="border px-3 py-2 rounded"
                  onChange={(e) => {
                    setPage(1);
                    setSelectedPOS(e.target.value);
                  }}
                >
                  <option value="">Loại từ</option>
                  <option value="n">Danh từ</option>
                  <option value="v">Động từ</option>
                  <option value="adj">Tính từ</option>
                </select>
              </div>
              <div className="flex flex-row gap-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                  onClick={() => {
                    ExportFile(vocab, "vocabulary", "json");
                  }}
                >
                  Xuất file
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                  onClick={() => {
                    setIsFileModalOpen(true);
                  }}
                >
                  Nhập file Json
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vocab.map((item) => (
              <VocabCard
                key={item.id}
                vocab={item}
                onEdit={()=>handleEdit(
                  item
                )}
                onDelete={()=>handleDelete(item)}
                onClick={()=>handleClick(item)}
              />
            ))}
          </div>
          {selectedVocab && (
            <VocabModal
              vocab={selectedVocab}
              onClose={() => setSelectedVocab(null)}
              mode={selectedVocab.mode || "view"}
            />
          )}
        </>
      )}
      <ImportModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onHandleFile={handleImportFile}
      />
      {/* {error && (

      )} */}
    </div>
  );
}
