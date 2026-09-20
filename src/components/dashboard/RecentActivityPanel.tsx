import { Activity as ActivityIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../common/Card";
import { useAppStore } from "../../store/useAppStore";
import { timeAgo } from "../../utils/format";
import { ROUTES } from "../../routes/paths";

export function RecentActivityPanel() {
  const activities = useAppStore((state) => state.activities);
  const releases = useAppStore((state) => state.releases);

  const recent = [...activities]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .slice(0, 6);

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h2>
      <ul className="space-y-4">
        {recent.map((activity, index) => {
          const release = releases.find((r) => r.id === activity.releaseId);
          return (
            <li
              key={activity.id}
              className="animate-fade-in-up flex gap-3 text-sm"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <ActivityIcon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{activity.actor}</span>{" "}
                  {activity.action}
                </p>
                <p className="text-xs text-slate-400">
                  {release ? (
                    <Link
                      to={ROUTES.releaseDetailPath(release.id)}
                      className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                    >
                      {release.name}
                    </Link>
                  ) : (
                    "Unknown release"
                  )}{" "}
                  · {timeAgo(activity.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
        {recent.length === 0 && (
          <p className="text-sm text-slate-400">No activity recorded yet.</p>
        )}
      </ul>
    </Card>
  );
}
