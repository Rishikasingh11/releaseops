import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CornerDownLeft, Rocket, Ticket, GitBranch, type LucideIcon } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useCommandPaletteStore } from "../../store/useCommandPaletteStore";
import { NAV_ITEMS } from "../../routes/navConfig";
import { ROUTES } from "../../routes/paths";

interface PaletteItem {
  key: string;
  icon: LucideIcon;
  label: string;
  detail?: string;
  group: "Pages" | "Releases" | "Jira Issues" | "Repositories";
  onSelect: () => void;
}

export function CommandPalette() {
  const releases = useAppStore((state) => state.releases);
  const jiraIssues = useAppStore((state) => state.jiraIssues);
  const productionAlignments = useAppStore((state) => state.productionAlignments);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const toggle = useCommandPaletteStore((state) => state.toggle);
  const close = useCommandPaletteStore((state) => state.close);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifierK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isModifierK) {
        event.preventDefault();
        toggle();
      } else if (event.key === "Escape") {
        close();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle, close]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setHighlightedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const items = useMemo<PaletteItem[]>(() => {
    const trimmed = query.trim().toLowerCase();

    const pageItems: PaletteItem[] = NAV_ITEMS.filter((item) =>
      trimmed ? item.label.toLowerCase().includes(trimmed) : true,
    ).map((item) => ({
      key: `page-${item.path}`,
      icon: item.icon,
      label: item.label,
      detail: "Go to page",
      group: "Pages" as const,
      onSelect: () => navigate(item.path),
    }));

    if (!trimmed) {
      return pageItems;
    }

    const releaseItems: PaletteItem[] = releases
      .filter(
        (release) =>
          release.name.toLowerCase().includes(trimmed) ||
          release.id.toLowerCase().includes(trimmed) ||
          release.version.toLowerCase().includes(trimmed),
      )
      .slice(0, 5)
      .map((release) => ({
        key: `release-${release.id}`,
        icon: Rocket,
        label: release.name,
        detail: `${release.id} · ${release.status}`,
        group: "Releases" as const,
        onSelect: () => navigate(ROUTES.releaseDetailPath(release.id)),
      }));

    const issueItems: PaletteItem[] = jiraIssues
      .filter(
        (issue) =>
          issue.key.toLowerCase().includes(trimmed) || issue.summary.toLowerCase().includes(trimmed),
      )
      .slice(0, 5)
      .map((issue) => {
        const release = releases.find((r) => r.id === issue.releaseId);
        return {
          key: `issue-${issue.id}`,
          icon: Ticket,
          label: `${issue.key}: ${issue.summary}`,
          detail: release ? release.name : issue.status,
          group: "Jira Issues" as const,
          onSelect: () => (release ? navigate(ROUTES.releaseDetailPath(release.id)) : navigate(ROUTES.jira)),
        };
      });

    const repoItems: PaletteItem[] = productionAlignments
      .filter(
        (repo) =>
          repo.repositoryName.toLowerCase().includes(trimmed) ||
          repo.applicationName.toLowerCase().includes(trimmed) ||
          repo.productionVersion.toLowerCase().includes(trimmed),
      )
      .slice(0, 5)
      .map((repo) => ({
        key: `repo-${repo.repositoryId}`,
        icon: GitBranch,
        label: repo.repositoryName,
        detail: `${repo.applicationName} · ${repo.alignmentStatus} (${repo.productionVersion})`,
        group: "Repositories" as const,
        onSelect: () =>
          navigate(ROUTES.productionAlignmentDetailPath(repo.repositoryId)),
      }));

    return [...repoItems, ...releaseItems, ...issueItems, ...pageItems];
  }, [query, releases, jiraIssues, productionAlignments, navigate]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const handleSelect = (item: PaletteItem) => {
    item.onSelect();
    close();
  };

  if (!isOpen) return null;

  const groups: PaletteItem["group"][] = [
    "Repositories",
    "Releases",
    "Jira Issues",
    "Pages",
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-slate-900/40 pt-[12vh]"
      onClick={close}
    >
      <div
        className="animate-command-palette-in w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-700">
          <Command className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search releases, Jira issues, or jump to a page..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightedIndex((i) => Math.min(i + 1, items.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightedIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && items[highlightedIndex]) {
                handleSelect(items[highlightedIndex]);
              }
            }}
          />
          <kbd className="hidden shrink-0 rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:block dark:border-slate-600">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-96 overflow-y-auto py-2">
          {items.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">No matches for "{query}".</p>
          ) : (
            groups.map((group) => {
              const groupItems = items.filter((item) => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {group}
                  </p>
                  {groupItems.map((item) => {
                    const globalIndex = items.indexOf(item);
                    const isHighlighted = globalIndex === highlightedIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        onClick={() => handleSelect(item)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${
                          isHighlighted
                            ? "bg-blue-50 dark:bg-blue-900/30"
                            : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-slate-800 dark:text-slate-100">
                            {item.label}
                          </span>
                          {item.detail && (
                            <span className="block truncate text-xs text-slate-400">{item.detail}</span>
                          )}
                        </span>
                        {isHighlighted && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-slate-300" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400 dark:border-slate-700">
          <span>Navigate with ↑ ↓, select with ↵</span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-slate-200 px-1 py-0.5 dark:border-slate-600">⌘/Ctrl</kbd>
            <kbd className="rounded border border-slate-200 px-1 py-0.5 dark:border-slate-600">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
