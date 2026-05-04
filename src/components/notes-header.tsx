"use client";

export interface NotesHeaderProps {
  titleSearch: string;
  onTitleSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  categoryOptions: string[];
  isFormOpen: boolean;
  onToggleForm: () => void;
}

export function NotesHeader({
  titleSearch,
  onTitleSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  isFormOpen,
  onToggleForm,
}: NotesHeaderProps) {
  return (
    <header className="flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-700 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:max-w-xs">
        <label htmlFor="title-search" className="text-sm font-medium">
          Title search
        </label>
        <input
          id="title-search"
          type="search"
          value={titleSearch}
          onChange={(e) => onTitleSearchChange(e.target.value)}
          placeholder="Filter by title"
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950"
        />
      </div>
      <div className="flex flex-col gap-1 sm:w-48">
        <label htmlFor="category-filter" className="text-sm font-medium">
          Category
        </label>
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950"
        >
          <option value="">All categories</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="button"
          onClick={onToggleForm}
          aria-expanded={isFormOpen}
          aria-label={isFormOpen ? "Close note form" : "Open note form"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </header>
  );
}
