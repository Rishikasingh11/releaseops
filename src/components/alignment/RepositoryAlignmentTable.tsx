import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronRight,
  GitBranch,
  ArrowUpDown,
  Filter,
  RotateCcw,
} from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import {
  alignmentStatusStyles,
  urgentAlignmentStatuses,
} from "../../utils/statusStyles";
import { ROUTES } from "../../routes/paths";
import type { ProductionRepositoryAlignment } from "../../types/productionAlignment";

interface RepositoryAlignmentTableProps {
  alignments: ProductionRepositoryAlignment[];
}

type SortField = "repository" | "application" | "commitsAhead" | "alignment";
type SortOrder = "asc" | "desc";

export function RepositoryAlignmentTable({ alignments }: RepositoryAlignmentTableProps) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState<string>("All");
  const [selectedEnv, setSelectedEnv] = useState<string>("All");
  const [selectedApp, setSelectedApp] = useState<string>("All");
  const [selectedReleaseStatus, setSelectedReleaseStatus] = useState<string>("All");

  const [sortField, setSortField] = useState<SortField>("commitsAhead");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Unique applications for filter dropdown
  const uniqueApplications = useMemo(() => {
    return Array.from(new Set(alignments.map((a) => a.applicationName))).sort();
  }, [alignments]);

  // Unique environments for filter dropdown
  const uniqueEnvironments = useMemo(() => {
    return Array.from(new Set(alignments.map((a) => a.environment))).sort();
  }, [alignments]);

  // Unique release statuses
  const uniqueReleaseStatuses = useMemo(() => {
    return Array.from(new Set(alignments.map((a) => a.releaseStatus))).sort();
  }, [alignments]);

  // Filtering
  const filteredAlignments = useMemo(() => {
    return alignments.filter((repo) => {
      const q = search.trim().toLowerCase();
      if (q) {
        const matchesRepo = repo.repositoryName.toLowerCase().includes(q);
        const matchesApp = repo.applicationName.toLowerCase().includes(q);
        const matchesTrunkVer = repo.trunkVersion.toLowerCase().includes(q);
        const matchesRelVer = repo.releaseVersion.toLowerCase().includes(q);
        const matchesProdVer = repo.productionVersion.toLowerCase().includes(q);
        if (
          !matchesRepo &&
          !matchesApp &&
          !matchesTrunkVer &&
          !matchesRelVer &&
          !matchesProdVer
        ) {
          return false;
        }
      }

      if (
        selectedAlignment !== "All" &&
        repo.alignmentStatus !== selectedAlignment
      ) {
        return false;
      }

      if (selectedEnv !== "All" && repo.environment !== selectedEnv) {
        return false;
      }

      if (selectedApp !== "All" && repo.applicationName !== selectedApp) {
        return false;
      }

      if (
        selectedReleaseStatus !== "All" &&
        repo.releaseStatus !== selectedReleaseStatus
      ) {
        return false;
      }

      return true;
    });
  }, [
    alignments,
    search,
    selectedAlignment,
    selectedEnv,
    selectedApp,
    selectedReleaseStatus,
  ]);

  // Sorting
  const sortedAlignments = useMemo(() => {
    return [...filteredAlignments].sort((a, b) => {
      let comp = 0;
      if (sortField === "repository") {
        comp = a.repositoryName.localeCompare(b.repositoryName);
      } else if (sortField === "application") {
        comp = a.applicationName.localeCompare(b.applicationName);
      } else if (sortField === "commitsAhead") {
        comp = a.commitsAheadReleaseVsProd - b.commitsAheadReleaseVsProd;
      } else if (sortField === "alignment") {
        comp = a.alignmentStatus.localeCompare(b.alignmentStatus);
      }

      return sortOrder === "asc" ? comp : -comp;
    });
  }, [filteredAlignments, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedAlignment("All");
    setSelectedEnv("All");
    setSelectedApp("All");
    setSelectedReleaseStatus("All");
  };

  const isFiltered =
    Boolean(search.trim()) ||
    selectedAlignment !== "All" ||
    selectedEnv !== "All" ||
    selectedApp !== "All" ||
    selectedReleaseStatus !== "All";

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by repository, application, or version (e.g. v4.7)..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Alignment Status */}
            <select
              value={selectedAlignment}
              onChange={(e) => setSelectedAlignment(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Filter by alignment status"
            >
              <option value="All">All Alignment Statuses</option>
              <option value="ALIGNED">ALIGNED</option>
              <option value="RELEASE PENDING">RELEASE PENDING</option>
              <option value="BEHIND">BEHIND</option>
              <option value="DIVERGED">DIVERGED</option>
              <option value="ATTENTION REQUIRED">ATTENTION REQUIRED</option>
            </select>

            {/* Environment */}
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Filter by environment"
            >
              <option value="All">All Environments</option>
              {uniqueEnvironments.map((env) => (
                <option key={env} value={env}>
                  {env}
                </option>
              ))}
            </select>

            {/* Application */}
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Filter by application"
            >
              <option value="All">All Applications</option>
              {uniqueApplications.map((app) => (
                <option key={app} value={app}>
                  {app}
                </option>
              ))}
            </select>

            {/* Release Status */}
            <select
              value={selectedReleaseStatus}
              onChange={(e) => setSelectedReleaseStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              aria-label="Filter by release status"
            >
              <option value="All">All Release Statuses</option>
              {uniqueReleaseStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-700">
              <th
                className="cursor-pointer px-6 py-3 font-medium hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => toggleSort("repository")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Repository</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 font-medium hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => toggleSort("application")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Application</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-3 py-3 font-medium">Env</th>
              <th className="px-3 py-3 font-medium">Trunk</th>
              <th className="px-3 py-3 font-medium">Release</th>
              <th className="px-3 py-3 font-medium">Production</th>
              <th className="px-3 py-3 font-medium">Trunk Status</th>
              <th className="px-3 py-3 font-medium">Release Status</th>
              <th
                className="cursor-pointer px-4 py-3 font-medium hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => toggleSort("alignment")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Alignment</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                className="cursor-pointer px-3 py-3 font-medium hover:text-slate-600 dark:hover:text-slate-200"
                onClick={() => toggleSort("commitsAhead")}
              >
                <div className="flex items-center gap-1.5">
                  <span>Commits Ahead</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-4 py-3 font-medium">Last Deployment</th>
              <th className="w-16 px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlignments.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-slate-400">
                  <Filter className="mx-auto mb-2 h-6 w-6 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">No repositories matched your filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-2 text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Clear all filters
                  </button>
                </td>
              </tr>
            ) : (
              sortedAlignments.map((repo) => {
                const isUrgent = urgentAlignmentStatuses.has(repo.alignmentStatus);

                return (
                  <tr
                    key={repo.repositoryId}
                    onClick={() =>
                      navigate(ROUTES.productionAlignmentDetailPath(repo.repositoryId))
                    }
                    className="group cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/40"
                  >
                    {/* Repository Name */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <GitBranch className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                            {repo.repositoryName}
                          </p>
                          <p className="font-mono text-[11px] text-slate-400">
                            {repo.productionCommit}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Application */}
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                      <span className="font-medium">{repo.applicationName}</span>
                    </td>

                    {/* Environment */}
                    <td className="px-3 py-3.5">
                      <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {repo.environment}
                      </span>
                    </td>

                    {/* Trunk Version */}
                    <td className="px-3 py-3.5">
                      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {repo.trunkVersion}
                      </span>
                    </td>

                    {/* Release Version */}
                    <td className="px-3 py-3.5">
                      <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {repo.releaseVersion}
                      </span>
                    </td>

                    {/* Production Version */}
                    <td className="px-3 py-3.5">
                      <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {repo.productionVersion}
                      </span>
                    </td>

                    {/* Trunk Status */}
                    <td className="px-3 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {repo.trunkStatus}
                    </td>

                    {/* Release Status */}
                    <td className="px-3 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      {repo.releaseStatus}
                    </td>

                    {/* Alignment Badge */}
                    <td className="px-4 py-3.5">
                      <Badge
                        className={alignmentStatusStyles[repo.alignmentStatus]}
                        dot={isUrgent}
                      >
                        {repo.alignmentStatus}
                      </Badge>
                    </td>

                    {/* Commits Ahead */}
                    <td className="px-3 py-3.5 text-xs font-medium">
                      {repo.commitsAheadReleaseVsProd > 0 ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                          +{repo.commitsAheadReleaseVsProd} commits
                        </span>
                      ) : repo.isDiverged ? (
                        <span className="font-semibold text-red-600 dark:text-red-400">
                          Diverged
                        </span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          In sync
                        </span>
                      )}
                    </td>

                    {/* Last Deployment */}
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {repo.lastProductionDeployment}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {repo.deployedBy}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
