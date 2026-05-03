import type { Note } from "@/src/types/note";

const STORAGE_KEY = "noteapp:notes";

function isNoteRecord(value: unknown): value is Note {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.category === "string" &&
    typeof o.content === "string"
  );
}

export function loadNotes(): Note[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const notes: Note[] = [];
    for (const item of parsed) {
      if (isNoteRecord(item)) {
        notes.push({
          id: item.id,
          title: item.title,
          category: item.category,
          content: item.content,
        });
      }
    }
    return notes;
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // Quota or private mode — ignore
  }
}
