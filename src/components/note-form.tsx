"use client";

import { useState } from "react";
import type { NoteDraft } from "@/src/types/note";

export interface NoteFormProps {
  mode: "create" | "edit";
  initialDraft: NoteDraft;
  onSave: (draft: NoteDraft) => void;
  onCancel: () => void;
}

export function NoteForm({
  mode,
  initialDraft,
  onSave,
  onCancel,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialDraft.title);
  const [category, setCategory] = useState(initialDraft.category);
  const [content, setContent] = useState(initialDraft.content);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  );

  return (
    <form
      aria-label={mode === "create" ? "Create note" : "Edit note"}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900"
      onSubmit={(e) => {
        e.preventDefault();
        if (title.trim() === "" || content.trim() === "") {
          setValidationMessage("Title and content are required.");
          return;
        }
        setValidationMessage(null);
        onSave({ title, category, content });
      }}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="note-title" className="text-sm font-medium">
          Titel
        </label>
        <input
          id="note-title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setValidationMessage(null);
          }}
          placeholder="Voer titel in"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="note-category" className="text-sm font-medium">
          Categorie
        </label>
        <input
          id="note-category"
          name="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Voer categorie in"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="note-content" className="text-sm font-medium">
          Notitie
        </label>
        <textarea
          id="note-content"
          name="content"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setValidationMessage(null);
          }}
          placeholder="Voer notitie in"
          rows={6}
          className="resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950"
        />
      </div>
      {validationMessage ? (
        <p
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {validationMessage}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
