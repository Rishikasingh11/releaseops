import { Menu, Moon, Sun } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { PersonaDropdown } from "./PersonaDropdown";

export function Topbar() {
  const toggleMobileSidebar = useAppStore((state) => state.toggleMobileSidebar);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <GlobalSearch />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <Sun className={`h-5 w-5 transition-all ${isDarkMode ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
          <Moon className={`absolute inset-0 m-2 h-5 w-5 transition-all ${isDarkMode ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"}`} />
        </button>
        <NotificationsDropdown />
        <PersonaDropdown />
      </div>
    </header>
  );
}
