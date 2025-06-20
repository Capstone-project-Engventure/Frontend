"use client";

import { Vocabulary } from "@/lib/types/vocabulary";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import { Fragment, use, useRef, useState } from "react";
interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHandleFile: (file: File) => Promise<void>;
}

export default function ImportModal({
  isOpen,
  onClose,
  onHandleFile,
}: ImportModalProps) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidExtension = (file: File) => {
    const allowedExtensions = ["csv", "json", "xls", "xlsx"];
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    return allowedExtensions.includes(ext);
  };

  const handleFileRead = async () => {
    setError("");
    try {
      setLoading(true);
      if (!selectedFile) {
        setError("Please select a file.");
        setLoading(false);
        return;
      }
      setSelectedFile(selectedFile);
      await onHandleFile(selectedFile);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to parse file.");
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setFileName(null);
    }
  };

  const handleFileChange = async (e:any) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidExtension(file)) {
      setError("Unsupported file type. Only CSV, JSON, XLS/XLSX are allowed.");
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
    return true;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700/70 bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle className="text-lg font-medium text-gray-900">
                  Chọn file
                </DialogTitle>
                <div className="mt-4">
                  <div className="w-full mb-5">
                    <label className="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 ">
                      <div className="mb-3 flex items-center justify-center">
                        <Image
                          src="/upload-cloud.svg"
                          alt="upload"
                          width={52}
                          height={52}
                        />
                      </div>
                      <h2 className="text-center text-gray-400   text-xs font-normal leading-4 mb-1">
                        JSON, CSV , XLSX , smaller than 15MB
                      </h2>
                      <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                        Drag and Drop your file here or
                      </h4>
                      {/* <input id="dropzone-file" type="file" className="hidden" /> */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm mb-4">{error}</div>
                  )}
                  {/* Progress Bar */}
                  <div className="w-full grid gap-1">
                    {fileName && (
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src="/document.svg"
                              alt="upload"
                              width={48}
                              height={48}
                            />

                            <div className="grid gap-1">
                              <h4 className="text-gray-900 text-sm font-normal font-['Inter'] leading-snug">
                                {fileName}
                              </h4>
                              <h5 className="text-gray-400   text-xs font-normal font-['Inter'] leading-[18px]">
                                Upload complete
                              </h5>
                            </div>
                          </div>
                          <div
                            className="cursor-pointer"
                            onClick={() => setFileName(null)}
                          >
                            <Image
                              src="/remove-icon.svg"
                              alt="upload"
                              width={28}
                              height={28}
                            />
                          </div>
                        </div>
                        <div className="w-full h-1 bg-gray-200 rounded-full">
                          <div
                            className={`h-1 bg-blue-500 rounded-full`}
                            style={{ width: `100%` }} // Assuming the upload is complete
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      setError("");
                      onClose();
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-blue-500 rounded text-white hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={!selectedFile || loading}
                    onClick={handleFileRead}
                  >
                    Nhập file
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
