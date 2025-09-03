import { motion } from "framer-motion";
import { FolderItem } from "./FolderTree";
import {
  File,
  FileText,
  FileBadge,
  FileSpreadsheet,
  FileImage,
  FileCode,
  Loader2,
  Folder, // <-- import Folder icon
} from "lucide-react";

export interface FileItem {
  key: string;
  name: string;
  size: number;
  lastModified: Date;
  contentType: string;
  url?: string;
  textContent?: string;
}

export const getFileIcon = (contentType: string) => {
  if (contentType.includes("image")) return <FileImage />;
  if (contentType.includes("video")) return <FileBadge />;
  if (contentType.includes("pdf")) return <FileBadge />;
  if (contentType.includes("text")) return <FileText />;
  if (contentType.includes("spreadsheet") || contentType.includes("csv"))
    return <FileSpreadsheet />;
  if (
    contentType.includes("document") ||
    contentType.includes("officedocument")
  )
    return <FileBadge />;
  if (contentType.includes("application/zip")) return <FileCode />;
  return <File />;
};

// Replace the empty div with the actual Folder icon
const FolderItemIcon = () => <Folder className="w-14 h-14 text-yellow-400" />;

interface FileGridProps {
  items: (FileItem | FolderItem)[];
  isLoading: boolean;
  handleFileClick: (file: FileItem) => void;
  setActivePath: (path: string) => void;
}

export const FileGrid = ({
  items,
  isLoading,
  handleFileClick,
  setActivePath,
}: FileGridProps) => {
  if (isLoading) {
    return (
      <div className="text-center p-10 col-span-full w-full">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500" />
        <p className="mt-3 text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {items.length === 0 ? (
        <p className="text-gray-500 col-span-full text-center text-lg">
          This folder is empty. Upload or add a subfolder!
        </p>
      ) : (
        items.map((item) => (
          <motion.div
            key={item.key}
            layout
            whileHover={{
              scale: 1.06,
              boxShadow: "0px 20px 30px rgba(0,0,0,0.15)",
            }}
            onClick={() =>
              (item as FolderItem).key.endsWith("/")
                ? setActivePath(item.key)
                : handleFileClick(item as FileItem)
            }
            className="p-5 bg-white rounded-3xl shadow-lg transition flex flex-col items-center text-center border border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:via-indigo-50 hover:to-blue-50"
          >
            {(item as FolderItem).key.endsWith("/") ? (
              <>
                <FolderItemIcon />
                <p className="mt-3 text-sm font-medium text-gray-700 truncate w-full">
                  {item.name}
                </p>
              </>
            ) : (
              <>
                {getFileIcon((item as FileItem).contentType)}
                <p className="mt-3 text-sm font-medium text-gray-700 truncate w-full">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {((item as FileItem).size / 1024).toFixed(1)} KB
                </p>
                <p className="text-xs text-gray-400">
                  {(item as FileItem).lastModified.toLocaleDateString()}
                </p>
              </>
            )}
          </motion.div>
        ))
      )}
    </motion.div>
  );
};
