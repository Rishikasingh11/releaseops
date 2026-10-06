import type { Environment } from "./release";

export interface FreezeWindow {
  id: string;
  name: string;
  environment: Environment | "All";
  startDate: string;
  endDate: string;
  reason: string;
  enforced: boolean;
}
