"use client";

import type { Note } from "@/src/types/note";

export interface NoteListProps {
  notes: Note[];
  onSelectNote: (id: string) => void;
}

export function NoteList({ notes, onSelectNote }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
        No notes to show.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {notes.map((note) => (
        <li key={note.id}>
          <button
            type="button"
            onClick={() => onSelectNote(note.id)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-950"
          >
            {note.title || "(No title)"}
          </button>
        </li>
      ))}
    </ul>
  );
}
