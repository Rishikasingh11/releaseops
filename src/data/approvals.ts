import type { Approval } from "../types";

const workflow = (
  releaseId: string,
  idPrefix: string,
  statuses: Approval["status"][],
  requestedBase: string,
  dueBase: string,
  approvers: string[],
): Approval[] => {
  const types: Approval["type"][] = [
    "CAB",
    "Security",
    "Change Advisory",
    "Business",
    "Deployment",
  ];
  return types.map((type, index) => ({
    id: `${idPrefix}-${index + 1}`,
    releaseId,
    type,
    approver: approvers[index],
    requestedDate: requestedBase,
    dueDate: dueBase,
    status: statuses[index],
    order: index + 1,
  }));
};

export const approvals: Approval[] = [
  ...workflow(
    "REL-1001",
    "APR-1001",
    ["Pending", "Pending", "Pending", "Pending", "Pending"],
    "2026-09-08T00:00:00Z",
    "2026-09-14T00:00:00Z",
    ["Karen Ibbotson", "Felix Grant", "Nadia Osei", "Ravi Chandran", "Ops Team"],
  ),
  ...workflow(
    "REL-1002",
    "APR-1002",
    ["Approved", "Approved", "Pending", "Pending", "Pending"],
    "2026-09-05T00:00:00Z",
    "2026-09-10T00:00:00Z",
    ["Karen Ibbotson", "Felix Grant", "Nadia Osei", "Ravi Chandran", "Ops Team"],
  ),
  ...workflow(
    "REL-1003",
    "APR-1003",
    ["Approved", "Approved", "Approved", "Approved", "Pending"],
    "2026-09-02T00:00:00Z",
    "2026-09-08T00:00:00Z",
    ["Karen Ibbotson", "Felix Grant", "Nadia Osei", "Ravi Chandran", "Ops Team"],
  ),
  ...workflow(
    "REL-1004",
    "APR-1004",
    ["Approved", "Approved", "Approved", "Approved", "Approved"],
    "2026-08-28T00:00:00Z",
    "2026-09-02T00:00:00Z",
    ["Karen Ibbotson", "Felix Grant", "Nadia Osei", "Ravi Chandran", "Ops Team"],
  ),
  ...workflow(
    "REL-1005",
    "APR-1005",
    ["Approved", "Approved", "Approved", "Approved", "Approved"],
    "2026-08-20T00:00:00Z",
    "2026-08-25T00:00:00Z",
    ["Karen Ibbotson", "Felix Grant", "Nadia Osei", "Ravi Chandran", "Ops Team"],
  ),
  ...workflow(
    "REL-1006",
    "APR-1006",
    ["Approved", "More Info Requested", "Pending", "Pending", "Pending"],
    "2026-09-01T00:00:00Z",
    "2026-09-05T00:00:00Z",
    ["Karen Ibbotson", "Felix Grant", "Nadia Osei", "Ravi Chandran", "Ops Team"],
  ),
];
