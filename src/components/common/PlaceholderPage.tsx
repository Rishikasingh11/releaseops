import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { Card } from "./Card";
import { PageHeader } from "./PageHeader";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon = Sparkles }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Icon className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Coming soon to ReleaseOps</p>
        <p className="max-w-sm text-sm text-slate-400 dark:text-slate-500">
          This module is on the roadmap. The rest of the platform — Dashboard, Releases, Jira,
          Kubernetes, Approvals, Mails, and AI Insights — is fully interactive today.
        </p>
      </Card>
    </div>
  );
}
