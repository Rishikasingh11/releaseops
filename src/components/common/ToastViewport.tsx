import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore, type ToastVariant } from "../../store/useToastStore";

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; className: string; iconClassName: string }> = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-white dark:border-emerald-800 dark:bg-slate-800",
    iconClassName: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  error: {
    icon: XCircle,
    className: "border-red-200 bg-white dark:border-red-800 dark:bg-slate-800",
    iconClassName: "bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-400",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-white dark:border-blue-800 dark:bg-slate-800",
    iconClassName: "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  },
};

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const styles = variantStyles[toast.variant];
        const Icon = styles.icon;
        return (
          <div
            key={toast.id}
            className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-lg border p-3.5 shadow-lg ${styles.className}`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${styles.iconClassName}`}>
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
