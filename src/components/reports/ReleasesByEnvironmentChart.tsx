import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Release } from "../../types";
import { Card } from "../common/Card";
import { useAppStore } from "../../store/useAppStore";

interface ReleasesByEnvironmentChartProps {
  releases: Release[];
}

export function ReleasesByEnvironmentChart({ releases }: ReleasesByEnvironmentChartProps) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const counts = releases.reduce<Record<string, number>>((acc, release) => {
    acc[release.environment] = (acc[release.environment] ?? 0) + 1;
    return acc;
  }, {});
  const data = ["Development", "Staging", "Production"]
    .filter((env) => counts[env])
    .map((env) => ({ name: env, releases: counts[env] }));

  const gridColor = isDarkMode ? "#334155" : "#f1f5f9";
  const tickColor = isDarkMode ? "#94a3b8" : "#64748b";

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Releases by Environment</h2>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">No releases to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
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
            <Bar dataKey="releases" fill="#7c3aed" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
