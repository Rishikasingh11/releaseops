import type { ReleaseNote } from "../types";

export const releaseNotes: ReleaseNote[] = [
  { id: "NOTE-1", releaseId: "REL-1001", author: "Priya Nair", content: "Tokenization integration on track; blocked on PSP sandbox certification.", timestamp: "2026-09-07T15:00:00Z" },
  { id: "NOTE-2", releaseId: "REL-1002", author: "Sofia Torres", content: "All UI issues resolved, awaiting CAB approval before staging deploy.", timestamp: "2026-09-07T09:30:00Z" },
  { id: "NOTE-3", releaseId: "REL-1003", author: "Grace Oduya", content: "Load tests passed at 5x expected volume. Ready for production cutover.", timestamp: "2026-09-07T18:30:00Z" },
  { id: "NOTE-4", releaseId: "REL-1004", author: "Marcus Lee", content: "Deployed successfully. Monitoring SMS delivery rates over next 48h.", timestamp: "2026-09-05T09:00:00Z" },
  { id: "NOTE-5", releaseId: "REL-1006", author: "Aiden Brooks", content: "Critical logout loop bug found in staging. Recommend holding rollout.", timestamp: "2026-09-08T07:15:00Z" },
];
