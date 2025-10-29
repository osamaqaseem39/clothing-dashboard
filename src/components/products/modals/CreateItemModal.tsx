import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateItemModalProps {
  isOpen: boolean;
  title: string;
  fields?: Array<{
    name: string;
    label: string;
    type?: 'text' | 'select';
    options?: Array<{ value: string; label: string }>; // for select
    required?: boolean;
  }>;
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  onClose: () => void;
  submitLabel?: string;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  isOpen,
  title,
  fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: false },
  ],
  initialValues = {},
  onSubmit,
  onClose,
  submitLabel = 'Create',
}) => {
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset only when modal opens to avoid wiping user input on re-renders
      setFormValues(initialValues);
      setError(null);
      setIsSaving(false);
    }
    // Intentionally exclude initialValues to avoid reset on identity changes
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // basic required validation
    for (const f of fields) {
      if (f.required && !String(formValues[f.name] ?? '').trim()) {
        setError(`${f.label} is required`);
        return;
      }
    }

    try {
      setIsSaving(true);
      await onSubmit(formValues);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {f.label}{f.required ? ' *' : ''}
              </label>
              {f.type === 'select' ? (
                <select
                  value={formValues[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select {f.label}</option>
                  {f.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formValues[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItemModal;


