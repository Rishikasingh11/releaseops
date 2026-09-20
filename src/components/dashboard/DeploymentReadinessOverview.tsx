import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Release } from "../../types";
import { Card } from "../common/Card";
import { useReleaseIntelligence } from "../../store/selectors";
import { useAppStore } from "../../store/useAppStore";

interface DeploymentReadinessOverviewProps {
  releases: Release[];
}

export function DeploymentReadinessOverview({ releases }: DeploymentReadinessOverviewProps) {
  const intelligence = useReleaseIntelligence();
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const releaseIds = new Set(releases.map((r) => r.id));

  const chartData = intelligence
    .filter((item) => releaseIds.has(item.release.id))
    .map((item) => ({
      name: item.release.id.replace("REL-", "R-"),
      readiness: item.readiness.score,
    }));

  const gridColor = isDarkMode ? "#334155" : "#f1f5f9";
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Deployment Readiness</h2>
      {chartData.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">No releases to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: isDarkMode ? "#1e293b" : "#f8fafc" }}
              contentStyle={{
                borderRadius: 8,
                borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                fontSize: 13,
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                color: isDarkMode ? "#e2e8f0" : "#0f172a",
              }}
            />
            <Bar dataKey="readiness" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
