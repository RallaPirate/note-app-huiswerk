"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadNotes, saveNotes } from "@/src/lib/notes-storage";
import type { Note, NoteDraft } from "@/src/types/note";
import { NoteForm } from "@/src/components/note-form";
import { NoteList } from "@/src/components/note-list";
import { NotesHeader } from "@/src/components/notes-header";

const emptyDraft: NoteDraft = { title: "", category: "", content: "" };

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setNotes(loadNotes());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    saveNotes(notes);
  }, [notes, hydrated]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const n of notes) {
      if (n.category.trim() !== "") {
        set.add(n.category);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const q = titleSearch.trim().toLowerCase();
    return notes.filter((n) => {
      const titleMatch =
        q === "" || n.title.toLowerCase().includes(q);
      const categoryMatch =
        categoryFilter === "" || n.category === categoryFilter;
      return titleMatch && categoryMatch;
    });
  }, [notes, titleSearch, categoryFilter]);

  const editingNote = useMemo(
    () =>
      editingNoteId === null
        ? null
        : notes.find((n) => n.id === editingNoteId) ?? null,
    [notes, editingNoteId],
  );

  const formInitialDraft: NoteDraft =
    editingNote === null
      ? emptyDraft
      : {
          title: editingNote.title,
          category: editingNote.category,
          content: editingNote.content,
        };

  const toggleForm = useCallback(() => {
    setIsFormOpen((open) => !open);
    setEditingNoteId(null);
  }, []);

  const openEdit = useCallback((id: string) => {
    setEditingNoteId(id);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingNoteId(null);
  }, []);

  const handleSave = useCallback(
    (draft: NoteDraft) => {
      if (editingNoteId === null) {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title: draft.title,
          category: draft.category,
          content: draft.content,
        };
        setNotes((prev) => [...prev, newNote]);
      } else {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingNoteId
              ? {
                  ...n,
                  title: draft.title,
                  category: draft.category,
                  content: draft.content,
                }
              : n,
          ),
        );
      }
      closeForm();
    },
    [editingNoteId, closeForm],
  );

  const handleDelete = useCallback(() => {
    if (editingNoteId === null) {
      return;
    }

    const confirmed = window.confirm(
      "Weet u zeker dat u deze notitie wilt verwijderen?",
    );

    if (!confirmed) {
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== editingNoteId));
    closeForm();
  }, [editingNoteId, closeForm]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
      <NotesHeader
        titleSearch={titleSearch}
        onTitleSearchChange={setTitleSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categoryOptions={categoryOptions}
        isFormOpen={isFormOpen}
        onToggleForm={toggleForm}
      />
      <section aria-labelledby="notes-list-heading">
        <h2 id="notes-list-heading" className="sr-only">
          Note titles
        </h2>
        <NoteList notes={filteredNotes} onSelectNote={openEdit} />
      </section>
      {isFormOpen ? (
        <NoteForm
          key={editingNoteId ?? "create"}
          mode={editingNoteId === null ? "create" : "edit"}
          initialDraft={formInitialDraft}
          onSave={handleSave}
          onCancel={closeForm}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  );
}
