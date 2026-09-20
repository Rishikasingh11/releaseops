import type { ReleasePackage } from "../types";

export const releasePackages: ReleasePackage[] = [
  { id: "PKG-1", releaseId: "REL-1001", name: "payments-api", version: "3.4.0", type: "Service", status: "Building" },
  { id: "PKG-2", releaseId: "REL-1001", name: "payments-webhooks", version: "3.4.0", type: "Service", status: "Pending" },

  { id: "PKG-3", releaseId: "REL-1002", name: "customer-portal-web", version: "2.1.0", type: "Service", status: "Built" },
  { id: "PKG-4", releaseId: "REL-1002", name: "design-system-tokens", version: "2.1.0", type: "Library", status: "Built" },

  { id: "PKG-5", releaseId: "REL-1003", name: "inventory-sync", version: "1.8.0", type: "Service", status: "Built" },
  { id: "PKG-6", releaseId: "REL-1003", name: "sync-infra-config", version: "1.8.0", type: "Infra", status: "Built" },

  { id: "PKG-7", releaseId: "REL-1004", name: "notification-engine", version: "4.0.0", type: "Service", status: "Deployed" },
  { id: "PKG-8", releaseId: "REL-1004", name: "notification-templates", version: "4.0.0", type: "Config", status: "Deployed" },

  { id: "PKG-9", releaseId: "REL-1005", name: "legacy-billing", version: "1.0.0", type: "Service", status: "Deployed" },

  { id: "PKG-10", releaseId: "REL-1006", name: "mobile-auth-service", version: "2.5.0", type: "Service", status: "Failed" },
  { id: "PKG-11", releaseId: "REL-1006", name: "auth-session-store", version: "2.5.0", type: "Infra", status: "Pending" },
];
