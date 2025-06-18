"use client";

import React, { Component } from "react";
import { FaSearch } from "react-icons/fa";

type SearchInputProps = {
  keyword: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({
  keyword,
  onChange,
  placeholder = "",
}: SearchInputProps) {
  return (
    <div className="flex flex-row relative">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={keyword}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
