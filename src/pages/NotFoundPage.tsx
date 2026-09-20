import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">404</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">This page does not exist.</p>
      <Link
        to={ROUTES.dashboard}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
