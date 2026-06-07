"use client";

import { useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "Untitled",
      content: "",
    };
    setNotes([...notes, newNote]);
    setActiveNote(newNote);
  };

  const updateNote = (field: "title" | "content", value: string) => {
    if (!activeNote) return;
    const updated = { ...activeNote, [field]: value };
    setActiveNote(updated);
    setNotes(notes.map((n) => (n.id === activeNote.id ? updated : n)));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null);
  };

  return (
    <div className="flex h-screen">
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
                activeNote?.id === note.id ? "bg-blue-100 text-black" : "hover:bg-gray-100 hover:text-black"
              }`}
            >
              <span className="truncate">{note.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
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
            <input
              type="text"
              value={activeNote.title}
              onChange={(e) => updateNote("title", e.target.value)}
              className="text-2xl font-bold bg-transparent outline-none text-white"
              placeholder="Note title"
            />
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote("content", e.target.value)}
              className="flex-1 bg-transparent outline-none resize-none text-white"
              placeholder="Start writing..."
            />
          </>
        ) : (
          <p className="text-gray-400">Select a note or create a new one</p>
        )}
      </div>
    </div>
  );
}