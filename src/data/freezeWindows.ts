import type { FreezeWindow } from "../types";

export const freezeWindows: FreezeWindow[] = [
  {
    id: "FREEZE-01",
    name: "Q3 Financial Year-End Close Freeze",
    environment: "Production",
    startDate: "2026-09-28",
    endDate: "2026-10-02",
    reason: "Quarterly financial ledger close, SOX compliance audit, and automated tax reporting runs.",
    enforced: true,
  },
  {
    id: "FREEZE-02",
    name: "Core Mirantis Infrastructure Upgrade",
    environment: "All",
    startDate: "2026-09-22",
    endDate: "2026-09-23",
    reason: "Upgrading control plane nodes and Calico CNI overlay network across primary clusters.",
    enforced: false,
  },
];
