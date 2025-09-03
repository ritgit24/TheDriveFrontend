"use client";

import { useState } from "react";
import { Folder } from "lucide-react";

export type FileItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  file: File;
};

export type FolderType = {
  id: string;
  name: string;
  files: FileItem[];
  folders: FolderType[];
};

type FolderTreeProps = {
  folders: FolderType[];
  activePath: string[];
  setActivePath: React.Dispatch<React.SetStateAction<string[]>>;
};

export function FolderTree({ folders, activePath, setActivePath }: FolderTreeProps) {
  // Recursive function to render nested folders
  const renderFolders = (folderList: FolderType[], level = 0) => {
    return folderList.map((folder) => {
      const isActive = activePath.includes(folder.id);

      return (
        <div key={folder.id} className={`ml-${level * 4}`}>
          <div
            className={`flex items-center gap-2 p-2 cursor-pointer rounded ${
              isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() =>
              setActivePath((prev) => {
                const index = prev.indexOf(folder.id);
                if (index !== -1) return prev.slice(0, index + 1);
                return [...prev, folder.id];
              })
            }
          >
            <Folder size={18} /> {folder.name}
          </div>

          {/* Render subfolders recursively */}
          {folder.folders.length > 0 && renderFolders(folder.folders, level + 1)}
        </div>
      );
    });
  };

  return <div className="overflow-y-auto flex-1">{renderFolders(folders)}</div>;
}
