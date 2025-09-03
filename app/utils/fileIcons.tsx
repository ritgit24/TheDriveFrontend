import {
  File,
  FileText,
  FileBadge,
  FileSpreadsheet,
  FileImage,
  FileCode,
} from "lucide-react";

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
