"use client";

import { useState } from "react";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import Calculator from "@/components/Calculator";

type Note = {
  id: number;
  title: string;
  content: string;
};

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error";
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled",
      content: "",
    };
    setNotes((prev) => [...prev, newNote]);
    setActiveNote(newNote);
    showToast("Note created!");
  };

  const updateNote = (field: "title" | "content", value: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, [field]: value };
    setActiveNote(updated);
    setNotes((prev) => prev.map((n) => (n.id === activeNote.id ? updated : n)));
  };

  const saveNote = () => {
    showToast("Note saved!");
  };

  const handleDeleteClick = (id: number) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmId === null) return;
    setNotes((prev) => prev.filter((n) => n.id !== confirmId));
    if (activeNote?.id === confirmId) setActiveNote(null);
    showToast("Note deleted!", "error");
    setConfirmId(null);
  };

  const handleCancelDelete = () => {
    setConfirmId(null);
  };

  return (
    <div className="flex h-screen">
      <Toast toasts={toasts} />

      {confirmId !== null && (
        <ConfirmDialog
          message="Are you sure you want to delete this note?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* Sidebar */}
      <div className="w-64 border-r p-4 flex flex-col gap-3">
        <button
          onClick={createNote}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          + New Note
        </button>
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li
              key={note.id}
              onClick={() => setActiveNote(note)}
              className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                activeNote?.id === note.id
                  ? "bg-blue-100 text-black"
                  : "hover:bg-gray-100 hover:text-black"
              }`}
            >
              <span className="truncate">{note.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(note.id);
                }}
                className="text-red-400 hover:text-red-600 text-sm ml-2"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        {activeNote ? (
          <>
            <div className="flex justify-between items-center">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote("title", e.target.value)}
                className="text-2xl font-bold bg-transparent outline-none text-white"
                placeholder="Note title"
              />
              <button
                onClick={saveNote}
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm"
              >
                Save
              </button>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote("content", e.target.value)}
              className="flex-1 bg-transparent outline-none resize-none text-white"
              placeholder="Start writing..."
            />
            <Calculator content={activeNote.content} />
          </>
        ) : (
          <p className="text-gray-400">Select a note or create a new one</p>
        )}
      </div>
    </div>
  );
}