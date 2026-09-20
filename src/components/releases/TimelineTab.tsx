import { Activity as ActivityIcon } from "lucide-react";
import type { Activity } from "../../types";
import { Card } from "../common/Card";
import { formatDateTime } from "../../utils/format";

interface TimelineTabProps {
  activities: Activity[];
}

export function TimelineTab({ activities }: TimelineTabProps) {
  return (
    <Card>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li
            key={activity.id}
            className="animate-fade-in-up flex gap-3 text-sm"
            style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ActivityIcon className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                <span className="font-medium text-slate-900 dark:text-slate-100">{activity.actor}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-slate-400">{formatDateTime(activity.timestamp)}</p>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-slate-400">No activity recorded yet.</p>
        )}
      </ul>
    </Card>
  );
}
