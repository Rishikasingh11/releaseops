import { NavLink } from "react-router-dom";
import { Rocket, X } from "lucide-react";
import { NAV_ITEMS } from "../../routes/navConfig";
import { useAppStore } from "../../store/useAppStore";

export function Sidebar() {
  const isMobileSidebarOpen = useAppStore((state) => state.isMobileSidebarOpen);
  const closeMobileSidebar = useAppStore((state) => state.closeMobileSidebar);

  return (
    <>
      {/* Backdrop, mobile only */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-transform duration-200 ease-in-out md:static md:z-auto md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">ReleaseOps</span>
          </div>
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
