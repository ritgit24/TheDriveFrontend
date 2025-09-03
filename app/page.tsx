"use client";

import { useState, useEffect } from "react";
import { Search, Upload, FolderPlus, HardDrive, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Inter, Roboto } from "next/font/google";
import { Folder } from "lucide-react";
import { InputModal } from "@/components/ui/InputModal";
import { FolderTree } from "@/components/ui/FolderTree";
import { FileGrid } from "@/components/ui/FileGrid";
import { AIQueryBox } from "@/components/ui/AIQueryBox";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

// Backend URLs
const BACKEND_URL = "https://fastapi-service-517338245513.us-central1.run.app";
const AI_BACKEND_URL = "http://127.0.0.1:8000";

// Interfaces
interface FileItem {
  key: string;
  name: string;
  size: number;
  lastModified: Date;
  contentType: string;
  url?: string;
  textContent?: string;
}

interface FolderItem {
  key: string;
  name: string;
}

export default function Page() {
  const [items, setItems] = useState<(FileItem | FolderItem)[]>([]);
  const [activePath, setActivePath] = useState("root/");
  const [isLoading, setIsLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [totalStorage, setTotalStorage] = useState(0);
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch S3 content
  useEffect(() => {
    fetchS3Content();
  }, [activePath]);

  const fetchS3Content = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/list?prefix=${activePath}`);
      const data = await response.json();

      const files = (data.files || []).map((f: any) => ({
        key: f.key,
        name: f.name,
        size: f.size,
        lastModified: new Date(f.lastModified),
        contentType: f.contentType,
      }));

      const folders = (data.folders || []).map((f: any) => ({
        key: f.key,
        name: f.name,
      }));

      setItems([...folders, ...files]);
      setTotalStorage(data.totalStorage || 0);
    } catch (err) {
      console.error(err);
      setItems([]);
      setTotalStorage(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Add folder
  const handleAddFolder = async (folderName: string) => {
    if (!folderName) return;
    setIsLoading(true);
    try {
      await fetch(`${BACKEND_URL}/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: `${activePath}${folderName}/` }),
      });
      fetchS3Content();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Upload files
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (!uploadedFiles.length) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("path", activePath);
    uploadedFiles.forEach((file) => formData.append("files", file));

    try {
      await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: formData });
      fetchS3Content();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete file
  const handleDeleteFile = async (file: FileItem) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/delete?key=${file.key}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete file.");
      fetchS3Content();
      setPreviewFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete file.");
    } finally {
      setIsLoading(false);
    }
  };

  // File click / preview
  const handleFileClick = async (file: FileItem) => {
    try {
      const res = await fetch(`${BACKEND_URL}/presigned-url?key=${file.key}`);
      if (!res.ok) throw new Error("Failed to get presigned URL.");
      const data = await res.json();
      let fileWithContent = { ...file, url: data.url };

      if (file.contentType.includes("text/plain")) {
        const textRes = await fetch(data.url);
        if (textRes.ok) fileWithContent.textContent = await textRes.text();
      }
      setPreviewFile(fileWithContent);
    } catch (err) {
      console.error(err);
    }
  };

  const FolderItemIcon = () => <Folder className="w-14 h-14 text-yellow-400" />;

  // AI query
  // const handleAiQuery = async () => {
  //   if (!aiQuery || !previewFile) return;
  //   setAiLoading(true);
  //   setAiAnswer(null);
  //   try {
  //     const res = await fetch(`${AI_BACKEND_URL}/chat/query`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ q: aiQuery, scope: "drive", file_id: previewFile.key, use_llm: true }),
  //     });
  //     const data = await res.json();
  //     setAiAnswer(data.answer || "No answer returned.");
  //   } catch (err) {
  //     console.error(err);
  //     setAiAnswer("Error querying AI.");
  //   } finally {
  //     setAiLoading(false);
  //   }
  // };
// Delete entire folder
const handleDeleteFolder = async (folder: FolderItem) => {
  if (!confirm(`Delete folder "${folder.name}" and all its contents?`)) return;
  setIsLoading(true);
  try {
    const res = await fetch(`${BACKEND_URL}/delete-folder`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: folder.key }), // send folder key/path
    });
    if (!res.ok) throw new Error("Failed to delete folder.");
    fetchS3Content(); // refresh the view
  } catch (err) {
    console.error(err);
    alert("Failed to delete folder.");
  } finally {
    setIsLoading(false);
  }
};

  const handleAiQuery = async () => {
  if (!aiQuery || !previewFile) return;
  setAiLoading(true);
  setAiAnswer(null);

  try {
    let endpoint = "";
    let body: any = {};

    if (previewFile.contentType.includes("text")) {
      endpoint = "/chat/query";
      body = { q: aiQuery, scope: "file", file_id: previewFile.key, use_llm: true };
    } else if (previewFile.contentType.startsWith("image/")) {
      endpoint = "/highlight/describe_image";
      body = { q: aiQuery, file_id: previewFile.key, bbox: null }; 
      // bbox can be user-selected region later
    } else {
      setAiAnswer("Unsupported file type for AI query.");
      return;
    }

    const res = await fetch(`${AI_BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setAiAnswer(data.answer || "No answer returned.");
  } catch (err) {
    console.error(err);
    setAiAnswer("Error querying AI.");
  } finally {
    setAiLoading(false);
  }
};


  return (
  <div className={`min-h-screen flex bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 ${inter.variable} font-sans`}>
    {/* Sidebar */}
    <aside className="w-80 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-gray-200 p-6 flex flex-col rounded-r-3xl font-sans">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        <HardDrive className="text-indigo-600" size={24} />
      </h2>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-5 py-3 mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transform transition duration-300"
      >
        <FolderPlus size={20} /> New Folder
      </button>
     <FolderTree
  folders={items.filter((i) => (i as FolderItem).key.endsWith("/")) as FolderItem[]}
  activePath={activePath}
  setActivePath={setActivePath}
  handleDeleteFolder={handleDeleteFolder} // pass your delete function
/>

{/* Auth Section at bottom */}
<div className="mt-auto pt-6 border-t border-gray-200 flex flex-col gap-3 ">
  <a
    href="/signup"
    className="px-5 py-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow hover:bg-green-600 transition text-center font-bold"
  >
    Sign Up
  </a>

  <a
    href="/login"
    className="px-5 py-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white rounded-2xl shadow hover:bg-green-600 transition text-center font-bold"
  >
    Log In
  </a>
</div>


      {/* <div className="mt-6">
        <p className="text-sm text-gray-600 mb-2">Storage Used</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {(totalStorage / (1024 * 1024)).toFixed(2)} MB of {(storageLimit / (1024 * 1024)).toFixed(0)} MB
        </p>
      </div> */}
    </aside>

    {/* Main */}
    <main className="flex-1 p-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white rounded-3xl shadow-2xl p-8 mb-8 flex items-center justify-between transform hover:scale-102 transition-all duration-300">
        <div>
          <h1 className="text-4xl font-bold">Store and Ask !</h1>
          <p className="text-sm text-indigo-100 mt-1">Store, manage, and access all your files.</p>
        </div>
        <HardDrive size={44} className="opacity-70" />
      </div>

      {/* Header + Search */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {activePath === "root/" ? "My Drive" : activePath.split("/").slice(-2, -1)}
          </h2>
          {activePath !== "root/" && (
            <button
              onClick={() => {
                const trimmedPath = activePath.endsWith("/") ? activePath.slice(0, -1) : activePath;
                const parts = trimmedPath.split("/");
                parts.pop();
                setActivePath(parts.length === 0 ? "root/" : parts.join("/") + "/");
              }}
              className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition"
            >
              Go Up
            </button>
          )}
        </div>
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-12 pr-4 py-3 rounded-3xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-200 shadow-sm text-gray-700 bg-white/90"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
        </div>
      </header>

      {/* Actions */}
      <div className="mb-8 flex gap-4 items-center">
        <label className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white rounded-3xl cursor-pointer shadow-lg hover:scale-105 transform transition duration-300 font-medium">
          <Upload size={22} /> Upload Files
          <input type="file" multiple className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {/* File Grid */}
      <FileGrid
        items={items}
        isLoading={isLoading}
        setActivePath={setActivePath}
        handleFileClick={handleFileClick}
      />
    </main>

    {/* Input Modal */}
    <InputModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onSubmit={handleAddFolder}
      title="Create New Folder"
      placeholder="Enter folder name"
    />

    {/* Preview + AI Modal */}
    {previewFile && (
      <AIQueryBox
        previewFile={previewFile}
        aiQuery={aiQuery}
        setAiQuery={setAiQuery}
        aiAnswer={aiAnswer}
        aiLoading={aiLoading}
        handleAiQuery={handleAiQuery}
        handleDeleteFile={handleDeleteFile}
        onClose={() => setPreviewFile(null)}
      />
    )}
  </div>
);
}
