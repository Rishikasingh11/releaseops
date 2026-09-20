import { useState } from "react";
import { Mail as MailIcon, Inbox, ShieldAlert, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { MetricCard } from "../components/common/MetricCard";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { ApprovalActions } from "../components/approvals/ApprovalActions";
import { useAppStore } from "../store/useAppStore";
import { formatDateTime } from "../utils/format";
import type { MailCategory } from "../types";

const TABS: (MailCategory | "All")[] = ["All", "Approval", "Information", "Alert"];

const categoryStyles: Record<MailCategory, string> = {
  Approval: "bg-amber-50 text-amber-700 border-amber-200",
  Information: "bg-blue-50 text-blue-700 border-blue-200",
  Alert: "bg-red-50 text-red-700 border-red-200",
};

export function MailsPage() {
  const mails = useAppStore((state) => state.mails);
  const approvals = useAppStore((state) => state.approvals);
  const releases = useAppStore((state) => state.releases);
  const markMailRead = useAppStore((state) => state.markMailRead);
  const [tab, setTab] = useState<MailCategory | "All">("All");

  const unread = mails.filter((m) => !m.read).length;
  const approvalMails = mails.filter((m) => m.category === "Approval").length;
  const alertMails = mails.filter((m) => m.category === "Alert").length;

  const filtered = mails
    .filter((mail) => tab === "All" || mail.category === tab)
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return (
    <div>
      <PageHeader title="Mails" description="Simulated release notification emails and stakeholder communication." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Mails" value={mails.length} icon={Inbox} tone="info" />
        <MetricCard label="Unread" value={unread} icon={MailIcon} tone="info" emphasize={unread > 0} />
        <MetricCard label="Approval Mails" value={approvalMails} icon={ShieldAlert} tone="warning" />
        <MetricCard label="Alerts" value={alertMails} icon={AlertTriangle} tone="danger" emphasize={alertMails > 0} />
      </div>

      <div className="my-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === t
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t === "All" ? "All" : `${t}s`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((mail) => {
          const release = releases.find((r) => r.id === mail.releaseId);
          const approval = approvals.find((a) => a.id === mail.approvalId);
          const isUnreadAlert = !mail.read && mail.category === "Alert";
          return (
            <Card
              key={mail.id}
              hoverLift
              onClick={() => markMailRead(mail.id)}
              className={`cursor-pointer ${
                isUnreadAlert
                  ? "border-l-4 border-l-red-400 bg-red-50/30"
                  : !mail.read
                    ? "border-l-4 border-l-blue-400 bg-blue-50/30"
                    : "hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isUnreadAlert ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <MailIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {mail.subject}
                      {!mail.read && (
                        <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500 align-middle" />
                      )}
                    </p>
                    <p className="text-xs text-slate-400">
                      From {mail.from} · {formatDateTime(mail.timestamp)}
                      {release ? ` · ${release.name}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{mail.body}</p>
                    {approval && (
                      <div className="mt-3">
                        <ApprovalActions approval={approval} />
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={categoryStyles[mail.category]} dot={mail.category === "Alert"}>
                  {mail.category}
                </Badge>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card>
            <p className="text-sm text-slate-400">No mails in this category.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
