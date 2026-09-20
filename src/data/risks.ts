import type { Risk } from "../types";

export const risks: Risk[] = [
  { id: "RISK-1", releaseId: "REL-1001", title: "PSP certification delay", description: "Sandbox certification with new payment processor may slip past target date.", severity: "High", likelihood: "Medium", mitigation: "Escalate with PSP account manager; hold parallel path with current provider.", status: "Open" },
  { id: "RISK-2", releaseId: "REL-1001", title: "Currency rounding regression", description: "Rounding bug could cause incorrect EU checkout totals if unresolved before code freeze.", severity: "Critical", likelihood: "Medium", mitigation: "Prioritize PAY-203 fix and add regression test suite.", status: "Open" },

  { id: "RISK-3", releaseId: "REL-1002", title: "Low-risk visual regressions", description: "Minor visual regressions possible on older browsers.", severity: "Low", likelihood: "Low", mitigation: "Manual QA pass on Safari 15 and IE11 fallback.", status: "Mitigated" },

  { id: "RISK-4", releaseId: "REL-1003", title: "Peak load during migration window", description: "Warehouse feed volume peaks could coincide with cutover window.", severity: "Medium", likelihood: "Low", mitigation: "Schedule cutover during off-peak hours; monitor DLQ depth.", status: "Mitigated" },

  { id: "RISK-5", releaseId: "REL-1006", title: "Auth session store migration failure", description: "Redis cluster migration is incomplete; refresh token rotation bug causes logout loops in current build.", severity: "Critical", likelihood: "High", mitigation: "Roll back session store migration; hotfix refresh token logic before retry.", status: "Open" },
  { id: "RISK-6", releaseId: "REL-1006", title: "Partner SDK compatibility", description: "Partner apps using older SDK versions may break with new auth flow.", severity: "High", likelihood: "Medium", mitigation: "Publish compatibility shim and extended deprecation notice.", status: "Open" },
];
