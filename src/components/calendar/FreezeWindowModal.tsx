import { useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import type { Environment } from "../../types";

interface FreezeWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FreezeWindowModal({ isOpen, onClose }: FreezeWindowModalProps) {
  const addFreezeWindow = useAppStore((state) => state.addFreezeWindow);
  const showToast = useToastStore((state) => state.showToast);

  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<Environment | "All">("Production");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().slice(0, 10);
  });
  const [reason, setReason] = useState("");
  const [enforced, setEnforced] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFreezeWindow({
      name: name.trim(),
      environment,
      startDate,
      endDate,
      reason: reason.trim() || "Operational stability window.",
      enforced,
    });

    showToast({
      variant: "info",
      title: "Change Freeze Window created",
      description: `${name} (${environment}) from ${startDate} to ${endDate}.`,
    });

    onClose();
    setName("");
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-command-palette-in w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                New Change Freeze Window
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restrict deployments during critical business or compliance periods
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Freeze Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Black Friday Global Freeze or Fiscal Q4 Close"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scope
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="Production">Production Only</option>
                <option value="All">All Environments</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Reason & Policy Context
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Peak retail traffic window. Only P0 emergency hotfixes with CTO approval permitted."
              className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="enforced"
              checked={enforced}
              onChange={(e) => setEnforced(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="enforced" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Enforce strictly (Hard-block deployments to {environment} during this period)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
            >
              Set Freeze Window
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
