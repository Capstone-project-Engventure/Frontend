import React from 'react';
import { FormField } from './FormField';
import { Field } from '@/lib/types';

interface FormModalProps {
  fields: Field[];
  title: string;
  formData: any;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isLoading: boolean;
}

export const FormModal: React.FC<FormModalProps> = ({
  fields,
  title,
  formData,
  onSubmit,
  onClose,
  isLoading
}) => {
  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[calc(100vh-2rem)] overflow-y-auto min-w-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={onSubmit}>
          {fields.map((field) => (
            <FormField key={field.key} field={field} formData={formData} />
          ))}
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
