"use client";
import { useState, useEffect, useCallback } from "react";
import VocabularyService from "@/lib/services/vocabulary.service";
import PaginationTable from "@/app/components/table/PaginationTable";
import Breadcrumb from "@/app/components/breadcumb";
import { HiPlus } from "react-icons/hi";
import debounce from "lodash.debounce";
import TopicService from "@/lib/services/topic.service";
import { Topic } from "@/lib/types/topic";

function VocabCard({ vocab }: { vocab: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full">
      <img
        src={vocab.image}
        alt={vocab.word}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="font-semibold text-lg">{vocab.word}</h3>
      <p className="text-gray-600 italic">({vocab.part_of_speech})</p>
      <p className="text-gray-800 mb-1">{vocab.meaning}</p>
      <p className="text-sm text-gray-500">{vocab.example_sentence}</p>
    </div>
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

  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedPOS, setSelectedPOS] = useState("");

  const fetchVocabByFilters = async (topicId = "", pos = "") => {
    setIsLoading(true);
    setError("");
    try {
      const res = await vocabularyService.getAllVocabulary(
        page,
        pageSize,
        searchKeyword,
        topicId,
        pos
      );
      if (!res.success) throw new Error("Failed to fetch");
      setVocab(res.data || []);
      setTotalPages(res.total_page || 1);
      setSelectedTopic(topicId);
      setSelectedPOS(pos);
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

  const fetchVocab = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await vocabularyService.getAllVocabulary(
        page,
        pageSize,
        searchKeyword
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

  useEffect(() => {
    fetchVocab();
  }, [page, pageSize, searchKeyword]);

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await topicService.getAll();
      setTopicList(res.data || []);
    };
    fetchTopics();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vocabulary List</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-row">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <select
                className="border px-3 py-2 rounded"
                onChange={(e) => {
                  setPage(1);
                  setSearchKeyword(""); // Reset search if needed
                  fetchVocabByFilters(e.target.value, selectedPOS);
                }}
              >
                <option value="">All Topics</option>
                {topicList.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>

              <select
                className="border px-3 py-2 rounded"
                onChange={(e) => {
                  setPage(1);
                  fetchVocabByFilters(selectedTopic, e.target.value);
                }}
              >
                <option value="">Loại từ</option>
                <option value="n">Danh từ</option>
                <option value="v">Động từ</option>
                <option value="adj">Tính từ</option>
              </select>
            </div>
          </div>
          {/* <PaginationTable
            objects={vocab}
            fields={fields}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            service={vocabularyService}
            modalFields={modalFields}
            modalTitle="Add/Edit Vocabulary"
            onSuccess={fetchVocab}
            breadcrumbs={breadcrumbs}
          /> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vocab.map((item) => (
              <VocabCard key={item.id} vocab={item} />
            ))}
          </div>
          {/* <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          /> */}
        </>
      )}
    </div>
  );
}
