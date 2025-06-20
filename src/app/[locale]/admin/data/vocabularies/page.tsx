"use client";
import { useState, useEffect, useCallback } from "react";
import { Transition } from "@headlessui/react";
import VocabularyService from "@/lib/services/vocabulary.service";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import Breadcrumb from "@/app/[locale]/components/breadcumb";
import { HiPlus, HiPencil, HiTrash, HiSearch, HiDownload, HiUpload, HiX } from "react-icons/hi";
import debounce from "lodash.debounce";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";
import CustomSelector from "@/app/[locale]/components/CustomSelector";
import { OptionType } from "@/lib/types/option";
import { ExportFile } from "@/lib/export-json";
import ImportModal from "@/app/[locale]/components/ImportModal";
import { Vocabulary } from "@/lib/types/vocabulary";
import { toast } from "react-toastify";

type VocabModalProps = {
  vocab?: Vocabulary | null;
  mode: "view" | "edit" | "add";
  onClose: () => void;
  onSave?: (data: Vocabulary) => void;
};

type VocabWithMode = Vocabulary & { mode?: "view" | "edit" | "add" };

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
    if (onSave && form.word.trim() && form.meaning.trim()) {
      onSave(form);
    }
  };

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "add" ? "Add New Word" : mode === "edit" ? "Edit Word" : "Word Details"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {/* Image Section */}
            {form.image && (
              <div className="mb-6">
                <img
                  src={form.image}
                  alt={form.word}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}

            {isViewMode ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{form.word}</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {form.part_of_speech}
                  </span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">Meaning</h4>
                  <p className="text-gray-800">{form.meaning}</p>
                </div>

                {form.example_sentence && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">Example</h4>
                    <p className="text-gray-800 italic">"{form.example_sentence}"</p>
                  </div>
                )}
              </div>
            ) : (
              <form className="space-y-6">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Word */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Word *
                  </label>
                  <input
                    type="text"
                    name="word"
                    value={form.word}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Part of Speech */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part of Speech
                  </label>
                  <select
                    name="part_of_speech"
                    value={form.part_of_speech}
                    onChange={(e) => setForm(prev => ({ ...prev, part_of_speech: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select part of speech</option>
                    <option value="n">Noun</option>
                    <option value="v">Verb</option>
                    <option value="adj">Adjective</option>
                    <option value="adv">Adverb</option>
                    <option value="prep">Preposition</option>
                  </select>
                </div>

                {/* Meaning */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meaning *
                  </label>
                  <textarea
                    name="meaning"
                    value={form.meaning}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Example Sentence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Example Sentence
                  </label>
                  <textarea
                    name="example_sentence"
                    value={form.example_sentence}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!form.word.trim() || !form.meaning.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    {mode === "edit" ? "Update Word" : "Add Word"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
}

function VocabCard({
  vocab,
  onEdit,
  onDelete,
  onClick,
}: {
  vocab: Vocabulary;
  onEdit: (vocab: Vocabulary) => void;
  onDelete: (vocab: Vocabulary) => void;
  onClick: (vocab: Vocabulary) => void;
}) {
  return (
    <div
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 overflow-hidden"
      onClick={() => onClick(vocab)}
    >
      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          className="p-2 bg-white/90 hover:bg-blue-50 text-blue-600 rounded-full shadow-sm transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(vocab);
          }}
        >
          <HiPencil className="w-4 h-4" />
        </button>
        <button
          className="p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full shadow-sm transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(vocab);
          }}
        >
          <HiTrash className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      {vocab.image && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={vocab.image}
            alt={vocab.word}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{vocab.word}</h3>
          {vocab.part_of_speech && (
            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
              {vocab.part_of_speech}
            </span>
          )}
        </div>
        
        <p className="text-gray-700 text-sm mb-3 line-clamp-2">{vocab.meaning}</p>
        
        {vocab.example_sentence && (
          <p className="text-xs text-gray-500 italic line-clamp-2">
            "{vocab.example_sentence}"
          </p>
        )}
      </div>
    </div>
  );
}

export default function AdminVocabulary() {
  const vocabularyService = new VocabularyService();
  const topicService = new TopicService();
  
  const [vocab, setVocab] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [topicListSelection, setTopicListSelection] = useState<OptionType[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<OptionType | null>(null);
  const [selectedPOS, setSelectedPOS] = useState("");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<VocabWithMode | null>(null);

  const fetchVocabByFilters = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await vocabularyService.getAllVocabulary(
        page,
        pageSize,
        searchKeyword,
        selectedTopic?.value || "",
        selectedPOS || ""
      );
      if (!res.success) throw new Error("Failed to fetch vocabulary");
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
      setPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleEdit = (item: Vocabulary) => {
    setSelectedVocab({ ...item, mode: "edit" });
  };

  const handleDelete = async (item: Vocabulary) => {
    if (confirm(`Are you sure you want to delete "${item.word}"?`)) {
      try {
        const res = await vocabularyService.delete(item.id);
        if (res.success) {
          toast.success("Word deleted successfully", {
            position: "top-right",
          });
          fetchVocabByFilters(); // Refresh the list
        } else {
          toast.error("Failed to delete word", {
            position: "top-right",
          });
        }
      } catch (err) {
        toast.error("Error deleting word", {
          position: "top-right",
        });
      }
    }
  };

  const handleClick = (item: Vocabulary) => {
    setSelectedVocab({ ...item, mode: "view" });
  };

  const handleSave = async (data: Vocabulary) => {
    try {
      const res = selectedVocab?.mode === "edit" 
        ? await vocabularyService.update(data.id, data)
        : await vocabularyService.create(data);
      
      if (res.success) {
        toast.success(`Word ${selectedVocab?.mode === "edit" ? "updated" : "added"} successfully`, {
          position: "top-right",
        });
        setSelectedVocab(null);
        fetchVocabByFilters();
      } else {
        toast.error(`Failed to ${selectedVocab?.mode === "edit" ? "update" : "add"} word`, {
          position: "top-right",
        });
      }
    } catch (err) {
      toast.error(`Error ${selectedVocab?.mode === "edit" ? "updating" : "adding"} word`, {
        position: "top-right",
      });
    }
  };

  const handleImportFile = async (file: File) => {
    try {
      const res = await vocabularyService.importVocabByFile(file);
      if (res.status === 200) {
        toast.success("File imported successfully", {
          position: "top-right",
        });
        fetchVocabByFilters();
      } else {
        toast.error("Failed to import file", {
          position: "top-right",
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setIsFileModalOpen(false);
    }
  };

  const handleAddNew = () => {
    setSelectedVocab({
      id: 0,
      word: "",
      part_of_speech: "",
      meaning: "",
      example_sentence: "",
      image: "",
      mode: "add"
    });
  };

  useEffect(() => {
    fetchVocabByFilters();
  }, [page, pageSize, searchKeyword, selectedTopic, selectedPOS]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await topicService.getAll();
        if (!res.success) throw new Error("Failed to fetch topics");
        
        if (Array.isArray(res.data)) {
          const tempList: OptionType[] = res.data.map((topic: Topic) => ({
            value: topic.id.toString(),
            label: topic.title,
          }));
          setTopicListSelection(tempList);
        }
        setTopicList(res.data);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vocabulary Management</h1>
          <p className="text-gray-600">Manage your vocabulary collection</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filters */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search vocabulary..."
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <CustomSelector
                objects={topicListSelection}
                onChange={setSelectedTopic}
                value={selectedTopic}
                multiple={false}
                placeholder="Select Topic"
              />

              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedPOS}
                onChange={(e) => {
                  setPage(1);
                  setSelectedPOS(e.target.value);
                }}
              >
                <option value="">All Parts of Speech</option>
                <option value="n">Noun</option>
                <option value="v">Verb</option>
                <option value="adj">Adjective</option>
                <option value="adv">Adverb</option>
                <option value="prep">Preposition</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <HiPlus className="w-5 h-5" />
                Add Word
              </button>
              
              <button
                onClick={() => ExportFile(vocab, "vocabulary", "json")}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <HiDownload className="w-5 h-5" />
                Export
              </button>
              
              <button
                onClick={() => setIsFileModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
              >
                <HiUpload className="w-5 h-5" />
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : vocab.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vocabulary found</p>
            <button
              onClick={handleAddNew}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add your first word
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vocab.map((item) => (
                <VocabCard
                  key={item.id}
                  vocab={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={handleClick}
                />
              ))}
            </div>

            {/* Pagination would go here */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {selectedVocab && (
          <VocabModal
            vocab={selectedVocab}
            onClose={() => setSelectedVocab(null)}
            mode={selectedVocab.mode || "view"}
            onSave={handleSave}
          />
        )}

        <ImportModal
          isOpen={isFileModalOpen}
          onClose={() => setIsFileModalOpen(false)}
          onHandleFile={handleImportFile}
        />
      </div>
    </div>
  );
}