export interface Persona {
  id: string;
  name: string;
  role: string;
  title: string;
  email: string;
  avatarLetter: string;
  color: string;
  permissions: string[];
}

export const PERSONAS: Persona[] = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    role: "Release Manager",
    title: "Lead Release Engineer",
    email: "alex.morgan@company.com",
    avatarLetter: "A",
    color: "bg-blue-600",
    permissions: [
      "Can advance release statuses",
      "Can schedule releases",
      "Can override gates with CAB approval",
      "Can trigger deployments",
    ],
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Security Lead",
    title: "Head of AppSec & Compliance",
    email: "priya.nair@company.com",
    avatarLetter: "P",
    color: "bg-purple-600",
    permissions: [
      "Can approve Security & Compliance gates",
      "Can flag security vulnerabilities",
      "Can accept risk exceptions",
    ],
  },
  {
    id: "dave-chen",
    name: "Dave Chen",
    role: "DevOps / SRE Lead",
    title: "Principal Site Reliability Engineer",
    email: "dave.chen@company.com",
    avatarLetter: "D",
    color: "bg-emerald-600",
    permissions: [
      "Can manage Kubernetes clusters & nodes",
      "Can heal nodes & trigger rollouts",
      "Can execute emergency rollbacks",
    ],
  },
  {
    id: "sarah-lin",
    name: "Sarah Lin",
    role: "QA Lead",
    title: "Quality Assurance Director",
    email: "sarah.lin@company.com",
    avatarLetter: "S",
    color: "bg-amber-600",
    permissions: [
      "Can approve QA & Performance gates",
      "Can log Jira deployment blockers",
      "Can sign off on automated test suites",
    ],
  },
];
