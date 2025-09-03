import { FileItem } from "./FileGrid";
import { Download } from "lucide-react";

export const AIQueryBox = ({
  previewFile,
  aiQuery,
  setAiQuery,
  handleAiQuery,
  aiLoading,
  aiAnswer,
  handleDeleteFile,
  onClose,
}: {
  previewFile: FileItem;
  aiQuery: string;
  setAiQuery: (val: string) => void;
  handleAiQuery: () => void;
  aiLoading: boolean;
  aiAnswer: string | null;
  handleDeleteFile: (file: FileItem) => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
    <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-auto relative text-gray-800">
      {/* Close & Delete */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
          title="Close"
        >
          ✕
        </button>
        <button
          onClick={() => handleDeleteFile(previewFile)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
          title="Delete File"
        >
          Delete
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">{previewFile.name}</h3>

      {/* AI Query Section */}
      <div className="mt-4 p-4 bg-purple-50 rounded-2xl">
        <h4 className="mb-2 text-purple-700 font-sans font-bold">Query AI</h4>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 border rounded-xl border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-blue-800"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Type your question here..."
          />
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            onClick={handleAiQuery}
          >
            Ask
          </button>
        </div>

        {aiLoading && <p className="mt-2 text-gray-500">Thinking...</p>}

        {aiAnswer && (
          <div className="mt-3 p-4 bg-white rounded-2xl shadow-inner overflow-auto max-h-96 border border-purple-200">
            <strong className="text-purple-700">Answer:</strong>
            <p className="mt-1 text-gray-800">{aiAnswer}</p>
          </div>
        )}
      </div>

      {/* File Preview */}
      {previewFile.contentType.includes("image") ? (
        <img
          src={previewFile.url}
          alt={previewFile.name}
          className="max-h-[50vh] mx-auto rounded-xl mt-4 shadow-lg"
        />
      ) : previewFile.contentType.includes("video") ? (
        <video
          controls
          className="max-h-[50vh] mx-auto rounded-xl mt-4 shadow-lg"
          src={previewFile.url}
        />
      ) : previewFile.contentType.includes("pdf") ? (
        <iframe
          src={previewFile.url}
          className="w-full h-[50vh] rounded-xl mt-4 shadow-inner"
        />
      ) : previewFile.contentType.includes("text/plain") ? (
        <pre className="w-full h-[50vh] rounded-xl p-4 bg-gray-100 overflow-auto mt-4 shadow-inner">
          {previewFile.textContent}
        </pre>
      ) : (
        <div className="text-center p-10">
          <p className="text-gray-600 mb-4">
            Preview not available for this file type.
          </p>
          <a
            href={previewFile.url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            <Download size={18} /> Download File
          </a>
        </div>
      )}
    </div>
  </div>
);
