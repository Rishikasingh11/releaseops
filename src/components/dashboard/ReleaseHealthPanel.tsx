import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { Release } from "../../types";
import { Card } from "../common/Card";
import { useAppStore } from "../../store/useAppStore";

interface ReleaseHealthPanelProps {
  releases: Release[];
}

const COLORS: Record<string, string> = {
  "In Progress": "#2563eb",
  "Pending Approval": "#d97706",
  "Ready for Deployment": "#7c3aed",
  Deployed: "#16a34a",
  Closed: "#94a3b8",
  "At Risk": "#dc2626",
};

export function ReleaseHealthPanel({ releases }: ReleaseHealthPanelProps) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const counts = releases.reduce<Record<string, number>>((acc, release) => {
    acc[release.status] = (acc[release.status] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([status, value]) => ({ name: status, value }));

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Release Health</h2>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-400">No releases to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] ?? "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                fontSize: 13,
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                color: isDarkMode ? "#e2e8f0" : "#0f172a",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: isDarkMode ? "#cbd5e1" : "#334155" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
