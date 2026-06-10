"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import Calculator from "@/components/Calculator";
import Sidebar from "@/components/Sidebar";

type Note = {
  id: number;
  title: string;
  content: string;
  folder_id: number | null;
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
  const [loading, setLoading] = useState(true);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // Load notes on page load
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const createNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled", content: "" }),
    });
    const newNote = await res.json();
    setNotes((prev) => [newNote, ...prev]);
    setActiveNote(newNote);
  };

  const updateNote = (field: "title" | "content", value: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, [field]: value };
    setActiveNote(updated);
    setNotes((prev) => prev.map((n) => (n.id === activeNote.id ? updated : n)));
  };

  const saveNote = async () => {
    if (!activeNote) return;
    await fetch(`/api/notes/${activeNote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: activeNote.title, content: activeNote.content }),
    });
    showToast("Note saved!");
  };

  const handleDeleteClick = (id: number) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (confirmId === null) return;
    await fetch(`/api/notes/${confirmId}`, { method: "DELETE" });
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

        <Sidebar
          notes={notes}
          activeNote={activeNote}
          loading={loading}
          onSelectNote={setActiveNote}
          onCreateNote={createNote}
          onDeleteNote={handleDeleteClick}
        />

      {/* Editor */}
      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
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
              placeholder={`Start writing...\n\nUse + for income and - for expenses:\n+ Salary - Rs. 30,000/-\n- Rent - Rs. 7,000/-`}
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