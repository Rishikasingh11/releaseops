import { Calendar as CalendarIcon } from "lucide-react";
import { PlaceholderPage } from "../components/common/PlaceholderPage";

export function CalendarPage() {
  return (
    <PlaceholderPage
      title="Calendar"
      description="Release schedule, freeze windows, and important milestones."
      icon={CalendarIcon}
    />
  );
}
