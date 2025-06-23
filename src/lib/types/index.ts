import React from 'react';

export interface Field {
  key: string;
  label: string;
  type?: string;
    // | "key"
    // | "text"
    // | "image"
    // | "select"
    // | "textarea"
    // | "audio"
    // | "number"
    // | "hidden"
    // | "mcq";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  nestKey?: string;
  isNest?: boolean;
  default?: string | number;
  choices?: Array<string>;
  maxLength?: number;
  render?: (value: any, item?: any) => React.ReactNode;
}


export interface Option{
  key: string;
  option: string;
}