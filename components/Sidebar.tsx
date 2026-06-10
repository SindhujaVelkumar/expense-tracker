"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import ConfirmDialog from "./ConfirmDialog";

type Note = {
  id: number;
  title: string;
  content: string;
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

  return (
    <>
      {showSignOutConfirm && (
        <ConfirmDialog
          message="Are you sure you want to sign out?"
          onConfirm={() => signOut({ callbackUrl: "/login" })}
          onCancel={() => setShowSignOutConfirm(false)}
        />
      )}

      {/* Collapse toggle button - always visible */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 text-gray-400 hover:text-white"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "→" : "←"}
      </button>

      {/* Sidebar */}
      {!collapsed && (
        <div className="w-64 border-r flex flex-col h-screen">

          {/* Top section */}
          <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
            <div className="h-6" /> {/* spacer for collapse button */}
            <button
              onClick={onCreateNote}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
            >
              + New Note
            </button>
            <button
              className="border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white p-2 rounded text-sm"
            >
              + New Folder
            </button>

            {/* Notes list */}
            {loading ? (
              <p className="text-gray-400 text-sm">Loading notes...</p>
            ) : (
              <ul className="flex flex-col gap-2 mt-2">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      activeNote?.id === note.id
                        ? "bg-blue-100 text-black"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <span className="truncate text-sm">{note.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      className="text-red-400 hover:text-red-600 text-sm ml-2"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
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