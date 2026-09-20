import { useState } from "react";
import { PageHeader } from "../components/common/PageHeader";
import { RecentReleasesTable } from "../components/dashboard/RecentReleasesTable";
import { useAppStore } from "../store/useAppStore";
import type { ReleaseStatus } from "../types";

const STATUS_FILTERS: (ReleaseStatus | "All")[] = [
  "All",
  "In Progress",
  "Pending Approval",
  "Ready for Deployment",
  "Deployed",
  "Closed",
  "At Risk",
];

export function ReleasesPage() {
  const releases = useAppStore((state) => state.releases);
  const [statusFilter, setStatusFilter] = useState<ReleaseStatus | "All">("All");

  const filtered =
    statusFilter === "All" ? releases : releases.filter((r) => r.status === statusFilter);

  return (
    <div>
      <PageHeader
        title="Releases"
        description="Browse and manage all planned, in-progress, and completed releases."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === status
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <RecentReleasesTable releases={filtered} />
    </div>
  );
}
