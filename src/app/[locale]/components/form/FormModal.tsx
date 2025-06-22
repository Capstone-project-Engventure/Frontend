import React, { useState, useEffect } from 'react';
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
  formData: initialFormData,
  onSubmit,
  onClose,
  isLoading
}) => {
  const [localFormData, setLocalFormData] = useState(initialFormData || {});

  // Update local form data when initial data changes
  useEffect(() => {
    setLocalFormData(initialFormData || {});
  }, [initialFormData]);

  const handleChange = (key: string, value: any) => {
    setLocalFormData((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();    
    // Update the original formData reference and call onSubmit with the real event
    Object.assign(initialFormData || {}, localFormData);
    
    // Add the form data to the event target for access in parent
    (e.target as any).formData = localFormData;
    
    onSubmit(e);
  };

  return (
    <div className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[calc(100vh-2rem)] overflow-y-auto min-w-xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <FormField 
              key={field.key} 
              field={field} 
              formData={localFormData}
              onChange={handleChange}
            />
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
