import { Link } from "react-router-dom";
import type { ReleaseIntelligence } from "../../store/selectors";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { riskLevelSolidStyles } from "../../utils/statusStyles";
import { composeRecommendation } from "../../utils/aiInsights";
import { ROUTES } from "../../routes/paths";

const statementByLevel: Record<string, string> = {
  Critical: "Production deployment should be halted.",
  High: "Production deployment should be delayed.",
  Medium: "This release needs attention before deployment.",
  Low: "This release is on track for deployment.",
};

interface ReleaseRiskCardProps {
  intelligence: ReleaseIntelligence;
}

export function ReleaseRiskCard({ intelligence }: ReleaseRiskCardProps) {
  const { release, risk, actions } = intelligence;

  return (
    <Card hoverLift>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Badge className={`${riskLevelSolidStyles[risk.level]} px-2.5 py-1 text-xs font-semibold tracking-wide`}>
            {risk.level.toUpperCase()} RISK
          </Badge>
          <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">
            {statementByLevel[risk.level]}
          </p>
          <p className="text-sm text-slate-400">
            {release.name} ({release.id}) · Risk score {risk.score}/100
          </p>
        </div>
        <Link
          to={ROUTES.releaseDetailPath(release.id)}
          className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          View Release
        </Link>
      </div>

      {risk.factors.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Reasons</p>
          <ul className="mt-1.5 space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {risk.factors.map((factor) => (
              <li key={factor} className="flex items-start gap-1.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 rounded-lg bg-blue-50/60 p-3 dark:bg-blue-900/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Recommendation</p>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{composeRecommendation(actions)}.</p>
      </div>
    </Card>
  );
}
