import { PageHeader } from "../components/common/PageHeader";
import { ReleaseCalendar } from "../components/calendar/ReleaseCalendar";

export function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Release & Deployment Calendar"
        description="Track release schedule milestones, scheduled maintenance windows, and enterprise change freeze periods."
      />
      <ReleaseCalendar />
    </div>
  );
}
