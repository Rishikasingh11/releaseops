import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Rocket, ShieldCheck, Zap, Layers } from "lucide-react";
import { useAppStore, type NewReleaseInput } from "../../store/useAppStore";
import { useToastStore } from "../../store/useToastStore";
import { ROUTES } from "../../routes/paths";

interface CreateReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateReleaseModal({ isOpen, onClose }: CreateReleaseModalProps) {
  const navigate = useNavigate();
  const createRelease = useAppStore((state) => state.createRelease);
  const currentUser = useAppStore((state) => state.currentUser);
  const showToast = useToastStore((state) => state.showToast);

  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [environment, setEnvironment] = useState<"Development" | "Staging" | "Production">("Production");
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [releaseManager, setReleaseManager] = useState(currentUser.name);
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState<"standard" | "soc2" | "hotfix">("standard");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const input: NewReleaseInput = {
      name: name.trim(),
      version: version.trim() || "1.0.0",
      environment,
      targetDate,
      releaseManager: releaseManager.trim() || currentUser.name,
      description: description.trim() || "Planned release with standard governance gates.",
      template,
    };

    const newRelease = createRelease(input);
    showToast({
      variant: "success",
      title: `Release ${newRelease.name} created`,
      description: `Initialized with ${template.toUpperCase()} governance gates.`,
    });
    onClose();
    navigate(ROUTES.releaseDetailPath(newRelease.id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="animate-command-palette-in w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Rocket className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Create New Release</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Initialize release plan, environment target, and governance gates
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Release Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Unified Checkout & Apple Pay"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Version *
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="3.5.0"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Environment
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="Production">Production</option>
                <option value="Staging">Staging</option>
                <option value="Development">Development</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Release Manager
              </label>
              <input
                type="text"
                value={releaseManager}
                onChange={(e) => setReleaseManager(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Description & Scope
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High-level description of what this release ships and key architectural dependencies..."
              className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Governance Template
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setTemplate("standard")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  template === "standard"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <Layers className="h-3.5 w-3.5 text-blue-600" />
                  Standard Enterprise
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  4 gates: Security, QA, CAB, and Deployment sign-off.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplate("soc2")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  template === "soc2"
                    ? "border-purple-600 bg-purple-50/50 dark:bg-purple-900/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                  High-Compliance (SOC2)
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  5 gates: AppSec, QA, Architecture, Privacy, & CAB.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTemplate("hotfix")}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  template === "hotfix"
                    ? "border-amber-600 bg-amber-50/50 dark:bg-amber-900/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 dark:text-slate-100">
                  <Zap className="h-3.5 w-3.5 text-amber-600" />
                  Hotfix Fast-Track
                </div>
                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  2 expedited gates: SRE Fast-track & Eng Lead.
                </p>
              </button>
            </div>
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
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Create Release
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
