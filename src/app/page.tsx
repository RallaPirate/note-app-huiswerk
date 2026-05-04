import { NotesApp } from "@/src/components/notes-app";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-background text-foreground">
      <NotesApp />
    </div>
  );
}
