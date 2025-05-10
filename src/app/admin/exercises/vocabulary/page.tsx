"use client";
import { useState, useEffect, useCallback } from "react";
import VocabularyService from "@/lib/services/vocabulary.service";
import PaginationTable from "@/app/components/table/PaginationTable";
import Breadcrumb from "@/app/components/breadcumb";
import { HiPlus } from "react-icons/hi";
import debounce from "lodash.debounce";

export default function AdminVocabulary() {
  const vocabularyService = new VocabularyService();
  const [vocab, setVocab] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vocabulary List</h2>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <PaginationTable
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
          />
        </>
      )}
    </div>
  );
}
