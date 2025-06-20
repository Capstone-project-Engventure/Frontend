"use client";
import AdvancedDataTable from "@/app/[locale]/components/table/AdvancedDataTable";
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
  const locale = useLocale()
  const soundService = new SoundService();

  const breadcrumbs = [
    { label: "Home", href: "/admin/home" },
    { label: "Pronunciation practice", href: "/admin/exercises/pronunciation" },
  ]
  const fields = [
    { key: "symbol", label: "Symbol" },
    { key: "word", label: "Word", type:"text" },
    { key: "sound_pronounce", label: "Sound pronounce", type:"textarea" },
    { key: "word_pronounce", label: "Word pronounce", type:"textarea" },
    { key: "sound_audio", label: "Audio", type: "audio" },
    { key: "word_audio", label: "Audio", type: "audio" },
    { key: "description", label: "Description" },
  ];

  const modalFields = [
    { key: "symbol", label: "Symbol", type: "text" },
    { key: "word", label: "Word", type: "text" },
    { key: "sound_pronounce", label: "Sound pronounce", type: "textarea" },
    { key: "word_pronounce", label: "Word pronounce", type: "textarea" },
    { key: "sound_audio", label: "Audio", type: "audio" },
    { key: "word_audio", label: "Audio", type: "audio" },
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
      <AdvancedDataTable
        fields={fields}
        keyField="symbol"
        breadcrumbs={breadcrumbs}
        page={page}
        onPageChange={onPageChange}
        service={soundService}
        linkBase={"/"+ locale + "/admin/exercises/pronunciation/id"}
        modalFields={modalFields}
      />
    </div>
  );
};

export default PronunciationPage;
