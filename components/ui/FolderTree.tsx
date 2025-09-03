// import { Folder } from "lucide-react";

// export interface FolderItem {
//   key: string;
//   name: string;
// }

// export const FolderTree = ({
//   folders,
//   activePath,
//   setActivePath,
// }: {
//   folders: FolderItem[];
//   activePath: string;
//   setActivePath: (path: string) => void;
// }) => (
//   <nav className="flex-1 overflow-y-auto">
//     <ul className="space-y-2">
//       {folders.map((folder) => (
//         <li key={folder.key}>
//           <button
//             onClick={() => setActivePath(folder.key)}
//             className={`flex items-center gap-2 w-full p-2 rounded-lg transition ${
//               activePath === folder.key
//                 ? "bg-blue-100 text-blue-800 font-semibold"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <Folder size={20} />
//             <span className="truncate">{folder.name}</span>
//           </button>
//         </li>
//       ))}
//     </ul>
//   </nav>
// );
import { Folder, Trash2 } from "lucide-react";

export interface FolderItem {
  key: string;
  name: string;
}

export const FolderTree = ({
  folders,
  activePath,
  setActivePath,
  handleDeleteFolder, // new prop
}: {
  folders: FolderItem[];
  activePath: string;
  setActivePath: (path: string) => void;
  handleDeleteFolder: (folder: FolderItem) => void; // new prop type
}) => (
  <nav className="flex-1 overflow-y-auto">
    <ul className="space-y-2">
      {folders.map((folder) => (
        <li key={folder.key} className="flex items-center justify-between">
          <button
            onClick={() => setActivePath(folder.key)}
            className={`flex items-center gap-2 flex-1 p-2 rounded-lg transition ${
              activePath === folder.key
                ? "bg-blue-100 text-blue-800 font-semibold"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Folder size={20} />
            <span className="truncate">{folder.name}</span>
          </button>
          <button
            onClick={() => handleDeleteFolder(folder)}
            className="text-red-500 hover:text-red-700 p-1 rounded-md"
            title="Delete Folder"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  </nav>
);
