import {
  LayoutDashboard,
  Rocket,
  Ticket,
  Boxes,
  Mail,
  CheckSquare,
  BarChart3,
  Calendar,
  Sparkles,
  Settings,
} from "lucide-react";
import type { NavItem } from "../types/nav";
import { ROUTES } from "./paths";

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Releases", path: ROUTES.releases, icon: Rocket },
  { label: "Jira", path: ROUTES.jira, icon: Ticket },
  { label: "Mirantis Kubernetes", path: ROUTES.kubernetes, icon: Boxes },
  { label: "Mails", path: ROUTES.mails, icon: Mail },
  { label: "Approvals", path: ROUTES.approvals, icon: CheckSquare },
  { label: "Reports", path: ROUTES.reports, icon: BarChart3 },
  { label: "Calendar", path: ROUTES.calendar, icon: Calendar },
  { label: "AI Insights", path: ROUTES.aiInsights, icon: Sparkles },
  { label: "Settings", path: ROUTES.settings, icon: Settings },
];
