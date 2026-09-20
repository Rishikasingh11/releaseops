import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, AlarmClock, ShieldAlert, Mail, type LucideIcon } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { isApprovalOverdue } from "../../utils/calculations";
import { ROUTES } from "../../routes/paths";

interface NotificationItem {
  key: string;
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  detail: string;
  onSelect: () => void;
}

export function NotificationsDropdown() {
  const approvals = useAppStore((state) => state.approvals);
  const releases = useAppStore((state) => state.releases);
  const kubernetesNodes = useAppStore((state) => state.kubernetesNodes);
  const mails = useAppStore((state) => state.mails);
  const markMailRead = useAppStore((state) => state.markMailRead);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useMemo<NotificationItem[]>(() => {
    const overdueItems: NotificationItem[] = approvals.filter(isApprovalOverdue).map((approval) => {
      const release = releases.find((r) => r.id === approval.releaseId);
      return {
        key: `overdue-${approval.id}`,
        icon: AlarmClock,
        iconClassName: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        label: `${approval.type} approval overdue`,
        detail: release?.name ?? approval.releaseId,
        onSelect: () => navigate(ROUTES.approvals),
      };
    });

    const criticalNodeItems: NotificationItem[] = kubernetesNodes
      .filter((node) => node.status === "Critical")
      .map((node) => ({
        key: `node-${node.id}`,
        icon: ShieldAlert,
        iconClassName: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        label: `Critical node: ${node.name}`,
        detail: "Needs immediate attention",
        onSelect: () => navigate(ROUTES.kubernetes),
      }));

    const unreadAlertItems: NotificationItem[] = mails
      .filter((mail) => !mail.read && mail.category === "Alert")
      .map((mail) => ({
        key: `mail-${mail.id}`,
        icon: Mail,
        iconClassName: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        label: mail.subject,
        detail: "Unread alert",
        onSelect: () => {
          markMailRead(mail.id);
          navigate(ROUTES.mails);
        },
      }));

    return [...criticalNodeItems, ...overdueItems, ...unreadAlertItems];
  }, [approvals, releases, kubernetesNodes, mails, markMailRead, navigate]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {notifications.length > 9 ? "9+" : notifications.length}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-command-palette-in absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">
                You're all caught up — no urgent items.
              </p>
            ) : (
              notifications.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      item.onSelect();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50 dark:border-slate-700/50 dark:hover:bg-slate-700/50"
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${item.iconClassName}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                        {item.label}
                      </span>
                      <span className="block truncate text-xs text-slate-400">{item.detail}</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
