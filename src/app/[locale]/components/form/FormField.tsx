import { Field } from '@/lib/types';
import React from 'react';

interface FormFieldProps {
  field: Field;
  formData: any;
  onChange?: (key: string, value: any) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  formData,
  onChange
}) => {
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

  const handleChange = (value: any) => {
    if (onChange) {
      onChange(field.key, value);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>

      {field.type === "textarea" ? (
        <textarea
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      ) : field.type === "select" ? (
        <select
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select {field.label}</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "image" || field.type === "audio" ? (
        <div>
          <input
            type="file"
            accept={field.type === "image" ? "image/*" : "audio/*"}
            onChange={(e) => handleChange(e.target.files?.[0])}
            className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {/* File preview */}
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
          type={field.type === "number" ? "number" : "text"}
          value={formData[field.key] || ""}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={field.placeholder}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      )}
    </div>
  );
};