import { Search } from "lucide-react";
import { useCommandPaletteStore } from "../../store/useCommandPaletteStore";

export function GlobalSearch() {
  const open = useCommandPaletteStore((state) => state.open);

  return (
    <button
      type="button"
      onClick={open}
      className="flex w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-left text-sm text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:max-w-sm dark:border-slate-700 dark:hover:border-slate-600 dark:hover:bg-slate-800"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">Search releases, tickets...</span>
      <kbd className="hidden shrink-0 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block dark:border-slate-600 dark:bg-slate-700">
        ⌘K
      </kbd>
    </button>
  );
}
