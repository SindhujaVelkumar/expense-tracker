"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import ConfirmDialog from "./ConfirmDialog";

type Note = {
  id: number;
  title: string;
  content: string;
  folder_id: number | null;
};

type Folder = {
  id: number;
  name: string;
  color: string;
};

type SidebarProps = {
  notes: Note[];
  activeNote: Note | null;
  loading: boolean;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: number) => void;
};

export default function Sidebar({
  notes,
  activeNote,
  loading,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("#6366f1");

  useEffect(() => {
    fetch("/api/folders")
      .then((res) => res.json())
      .then((data) => setFolders(Array.isArray(data) ? data : []));
  }, []);

  const toggleFolder = (id: number) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    const res = await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName, color: newFolderColor }),
    });
    const folder = await res.json();
    setFolders((prev) => [...prev, folder]);
    setNewFolderName("");
    setNewFolderColor("#6366f1");
    setShowNewFolder(false);
  };

  const uncategorizedNotes = notes.filter((n) => !n.folder_id);

  return (
    <>
      {showSignOutConfirm && (
        <ConfirmDialog
          message="Are you sure you want to sign out?"
          onConfirm={() => signOut({ callbackUrl: "/login" })}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}

      {/* Hamburger toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 text-gray-400 hover:text-white"
      >
        {collapsed ? "→" : "←"}
      </button>

      {!collapsed && (
        <div className="w-64 border-r flex flex-col h-screen">

          {/* Top actions */}
          <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
            <div className="h-6" />
            <button
              onClick={onCreateNote}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
            >
              + New Note
            </button>
            <button
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white p-2 rounded text-sm"
            >
              + New Folder
            </button>

            {/* New folder form */}
            {showNewFolder && (
              <div className="flex flex-col gap-2 p-2 border border-gray-700 rounded">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-transparent border border-gray-600 rounded p-1 text-sm text-white outline-none"
                />
                <div className="flex items-center gap-2">
                  <label className="text-gray-400 text-xs">Color:</label>
                  <input
                    type="color"
                    value={newFolderColor}
                    onChange={(e) => setNewFolderColor(e.target.value)}
                    className="w-8 h-6 rounded cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createFolder}
                    className="flex-1 bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewFolder(false)}
                    className="flex-1 bg-gray-700 text-white p-1 rounded text-xs hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Folders */}
            {folders.map((folder) => {
              const folderNotes = notes.filter((n) => n.folder_id === folder.id);
              const isExpanded = expandedFolders.includes(folder.id);
              return (
                <div key={folder.id}>
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-800 text-sm"
                  >
                    <span style={{ color: folder.color }}>
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    <span style={{ color: folder.color }} className="truncate flex-1 text-left">
                      {folder.name}
                    </span>
                    <span className="text-gray-500 text-xs">{folderNotes.length}</span>
                  </button>
                  {isExpanded && (
                    <ul className="ml-4 flex flex-col gap-1">
                      {folderNotes.length === 0 ? (
                        <li className="text-gray-500 text-xs p-1">No notes</li>
                      ) : (
                        folderNotes.map((note) => (
                          <li
                            key={note.id}
                            onClick={() => onSelectNote(note)}
                            className={`p-2 rounded cursor-pointer flex justify-between items-center text-sm ${
                              activeNote?.id === note.id
                                ? "bg-blue-100 text-black"
                                : "hover:bg-gray-100 hover:text-black"
                            }`}
                          >
                            <span className="truncate">{note.title}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteNote(note.id);
                              }}
                              className="text-red-400 hover:text-red-600 text-xs ml-2"
                            >
                              ✕
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                </div>
              );
            })}

            {/* Uncategorized notes */}
            {uncategorizedNotes.length > 0 && (
              <div>
                <p className="text-gray-500 text-xs px-2 py-1 uppercase tracking-wide">
                  Inbox
                </p>
                <ul className="flex flex-col gap-1">
                  {uncategorizedNotes.map((note) => (
                    <li
                      key={note.id}
                      onClick={() => onSelectNote(note)}
                      className={`p-2 rounded cursor-pointer flex justify-between items-center text-sm ${
                        activeNote?.id === note.id
                          ? "bg-blue-100 text-black"
                          : "hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      <span className="truncate">{note.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="text-red-400 hover:text-red-600 text-xs ml-2"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="p-4 border-t flex flex-col gap-1">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm p-2 rounded hover:bg-gray-800">
              👤 Profile
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm p-2 rounded hover:bg-gray-800">
              ⚙️ Settings
            </button>
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm p-2 rounded hover:bg-gray-800"
            >
              Sign out
            </button>
          </div>

        </div>
      )}
    </>
  );
}