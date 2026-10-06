import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, RefreshCw } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { PERSONAS } from "../../types/persona";
import { useToastStore } from "../../store/useToastStore";

export function PersonaDropdown() {
  const currentUser = useAppStore((state) => state.currentUser);
  const switchPersona = useAppStore((state) => state.switchPersona);
  const resetToSeedData = useAppStore((state) => state.resetToSeedData);
  const showToast = useToastStore((state) => state.showToast);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = (id: string, name: string, role: string) => {
    switchPersona(id);
    setIsOpen(false);
    showToast({
      variant: "info",
      title: `Switched persona to ${name}`,
      description: `Active role: ${role}. Permissions and audit actions updated.`,
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset all release, approval, and infrastructure data back to initial demo defaults?")) {
      resetToSeedData();
      setIsOpen(false);
      showToast({
        variant: "success",
        title: "Demo data reset successfully",
        description: "All seed releases, nodes, and approvals restored.",
      });
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 transition-all hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700"
        aria-label="Switch user persona"
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${currentUser.color || "bg-blue-600"}`}
        >
          {currentUser.avatarLetter || currentUser.name.charAt(0)}
        </div>
        <div className="hidden text-left text-xs sm:block">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
          <p className="font-medium text-slate-500 dark:text-slate-400">{currentUser.role}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="animate-command-palette-in absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-700">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Switch Persona (RBAC Demo)
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Test governance & approval gates from different role perspectives.
            </p>
          </div>

          <div className="p-1.5">
            {PERSONAS.map((persona) => {
              const isActive = persona.id === currentUser.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleSwitch(persona.id, persona.name, persona.role)}
                  className={`flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                      : "hover:bg-slate-50 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${persona.color}`}
                    >
                      {persona.avatarLetter}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{persona.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{persona.role}</p>
                    </div>
                  </div>
                  {isActive && <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 p-2 dark:border-slate-700">
            <button
              type="button"
              onClick={handleReset}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset to Demo Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
