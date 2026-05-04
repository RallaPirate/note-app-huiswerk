import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotesApp } from "@/src/components/notes-app";

const loadNotesMock = vi.fn();
const saveNotesMock = vi.fn();

vi.mock("@/src/lib/notes-storage", () => ({
  loadNotes: () => loadNotesMock(),
  saveNotes: (notes: unknown) => saveNotesMock(notes),
}));

describe("NotesApp create note", () => {
  beforeEach(() => {
    loadNotesMock.mockReset();
    saveNotesMock.mockReset();
    loadNotesMock.mockReturnValue([]);
    vi.spyOn(crypto, "randomUUID").mockReturnValue("note-id-1");
  });

  it("saves a note when title, category, and content are entered", async () => {
    const user = userEvent.setup();

    render(<NotesApp />);

    await user.click(screen.getByRole("button", { name: "Open note form" }));
    await user.type(screen.getByLabelText("Titel"), "Shopping list");
    await user.type(screen.getByLabelText("Categorie"), "Personal");
    await user.type(
      screen.getByLabelText("Notitie"),
      "Buy milk, eggs, and bread.",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByRole("button", { name: "Shopping list" }),
    ).toBeInTheDocument();
  });

  it("blocks save when title or content is empty", async () => {
    const user = userEvent.setup();

    render(<NotesApp />);

    await user.click(screen.getByRole("button", { name: "Open note form" }));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Title and content are required.",
    );
    expect(screen.queryByText("No notes to show.")).toBeInTheDocument();
    expect(saveNotesMock).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          content: expect.any(String),
        }),
      ]),
    );
  });

  it("allows long title and content to be entered and saved", async () => {
    const user = userEvent.setup();
    const longTitle = "T".repeat(250);
    const longContent = "Long note content ".repeat(300);

    render(<NotesApp />);

    await user.click(screen.getByRole("button", { name: "Open note form" }));
    fireEvent.change(screen.getByLabelText("Titel"), {
      target: { value: longTitle },
    });
    await user.type(screen.getByLabelText("Categorie"), "Archive");
    fireEvent.change(screen.getByLabelText("Notitie"), {
      target: { value: longContent },
    });
    await user.click(screen.getByRole("button", { name: "Save" }));

    const savedNoteButton = screen.getByRole("button", { name: longTitle });
    expect(savedNoteButton).toBeInTheDocument();

    await user.click(savedNoteButton);
    expect(screen.getByLabelText("Notitie")).toHaveValue(longContent);
  });
});
