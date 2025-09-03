import { useState } from "react";

export const InputModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder: string;
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative">
        {/* Title color */}
        <h3 className="text-lg font-semibold mb-4 text-red-600">{title}</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4
                       focus:outline-none focus:ring-2 focus:ring-red-400
                       text-red-700 placeholder-red-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
