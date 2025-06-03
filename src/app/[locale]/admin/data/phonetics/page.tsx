"use client";
import PaginationTable from "@/app/[locale]/components/table/PaginationTable";
import SoundService from "@/lib/services/sound.service";
import { Sound } from "@/lib/types/sound";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { Table, Pagination } from 'antd';
// import axios from 'axios';

const PronunciationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const soundService = new SoundService();
  const locale = useLocale();

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Phonetics", href: "/admin/data/phonetics" },
  ];
  const fields = [
    { key: "symbol", label: "Symbol", type: "key" },
    { key: "sound_audio_url", label: "Sound audio", type: "audio" },
    { key: "word", label: "Word", type: "text" },
    // { key: "sound_pronounce", label: "Sound pronounce" },
    // { key: "word_pronounce", label: "Word pronounce" },
    { key: "word_audio_url", label: "Word audio", type: "audio" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "symbol", label: "Symbol", type: "text" },
    { key: "word", label: "Word", type: "text" },
    { key: "sound_pronounce", label: "Sound pronounce", type: "textarea" },
    { key: "word_pronounce", label: "Word pronounce", type: "textarea" },
    { key: "sound_audio", label: "Sound audio", type: "audio" },
    { key: "word_audio", label: "Word audio", type: "audio" },
    { key: "description", label: "Description", type: "text" },
    { key: "translation", label: "Translation", type: "text" },
  ];

  const onHandleFile = async (file: File) => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }
    try {
      soundService.importByFile(file);
    } catch (error) {
      toast.error("Error importing file");
    }
  };

  const onPageChange = (page: number) => {
    setPage(page);
  };

  return (
    <div>
      <PaginationTable
        fields={fields}
        keyField="id"
        breadcrumbs={breadcrumbs}
        page={page}
        onPageChange={onPageChange}
        service={soundService}
        linkBase={"/" + locale + "/admin/data/phonetics"}
        modalFields={modalFields}
        onHandleFile={onHandleFile}
      />
    </div>
  );
};

export default PronunciationPage;
