export type ApprovalType =
  | "CAB"
  | "Security"
  | "Change Advisory"
  | "Business"
  | "Deployment";

export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "More Info Requested";

export interface Approval {
  id: string;
  releaseId: string;
  type: ApprovalType;
  approver: string;
  requestedDate: string;
  dueDate: string;
  status: ApprovalStatus;
  order: number;
  comment?: string;
}
