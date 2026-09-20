import { Link } from "react-router-dom";
import { ShieldCheck, ShieldAlert, ShieldX, Sparkles, type LucideIcon } from "lucide-react";
import { useReleaseIntelligence } from "../../store/selectors";
import { Badge } from "../common/Badge";
import { Reveal } from "../common/Reveal";
import { riskLevelSolidStyles } from "../../utils/statusStyles";
import { composeRecommendation } from "../../utils/aiInsights";
import { useCountUp } from "../../utils/useCountUp";
import { ROUTES } from "../../routes/paths";

function StatTile({
  icon: Icon,
  label,
  value,
  detail,
  colorClassName,
  pulse = false,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  detail: string;
  colorClassName: string;
  pulse?: boolean;
}) {
  const animatedValue = useCountUp(value);
  return (
    <div className="relative overflow-hidden rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
      {pulse && (
        <span className="absolute right-3 top-3 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
      )}
      <div className={`flex items-center gap-2 ${colorClassName}`}>
        <Icon className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-1 text-3xl font-bold tabular-nums text-white">{animatedValue}</p>
      <p className="text-xs text-slate-400">{detail}</p>
    </div>
  );
}

export function CommandCenter() {
  const intelligence = useReleaseIntelligence();
  const active = intelligence.filter((i) => i.release.status !== "Closed");

  const ready = active.filter((i) => i.risk.level === "Low");
  const atRisk = active.filter((i) => i.risk.level === "Medium" || i.risk.level === "High");
  const blocked = active.filter((i) => i.risk.level === "Critical");

  const mostCritical = [...active].sort((a, b) => b.risk.score - a.risk.score)[0];

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 text-white shadow-sm dark:border-slate-700">
      <div className="flex items-center gap-2 text-blue-300">
        <Sparkles className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-widest">Release Command Center</p>
      </div>
      <p className="mt-2 max-w-2xl text-lg font-semibold text-white">
        ReleaseOps tells you whether a release is actually safe to deploy.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={ShieldCheck}
          label="Ready"
          value={ready.length}
          detail={`release${ready.length === 1 ? "" : "s"} safe to deploy`}
          colorClassName="text-emerald-400"
        />
        <StatTile
          icon={ShieldAlert}
          label="At Risk"
          value={atRisk.length}
          detail={`release${atRisk.length === 1 ? "" : "s"} need attention`}
          colorClassName="text-amber-400"
        />
        <StatTile
          icon={ShieldX}
          label="Blocked"
          value={blocked.length}
          detail={`release${blocked.length === 1 ? "" : "s"} not safe to deploy`}
          colorClassName="text-red-400"
          pulse={blocked.length > 0}
        />
      </div>

      {mostCritical && (
        <Reveal index={1} className="mt-5 rounded-xl bg-white p-5 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Most critical release
              </p>
              <div className="mt-1 flex items-center gap-2">
                <h3 className="text-lg font-semibold">{mostCritical.release.name}</h3>
                <Badge className={`${riskLevelSolidStyles[mostCritical.risk.level]} px-2 py-0.5 text-xs`}>
                  {mostCritical.risk.level.toUpperCase()} RISK
                </Badge>
              </div>
              <p className="text-sm text-slate-400">
                {mostCritical.release.id} · Readiness {mostCritical.readiness.score}%
              </p>
            </div>
            <Link
              to={ROUTES.releaseDetailPath(mostCritical.release.id)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-blue-700"
            >
              View Release
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Top Blockers</p>
              <ul className="mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                {mostCritical.readiness.blockers.slice(0, 3).map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
                {mostCritical.readiness.blockers.length === 0 && <li>None</li>}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pending Approvals
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {mostCritical.approvals.filter(
                  (a) => a.status === "Pending" || a.status === "More Info Requested",
                ).length}{" "}
                pending
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Infrastructure
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {mostCritical.nodes.filter((n) => n.status !== "Healthy").length} node(s) unhealthy
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              Recommended Action
            </p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
              {composeRecommendation(mostCritical.actions)}.
            </p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
