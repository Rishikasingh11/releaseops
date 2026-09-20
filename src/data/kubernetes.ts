import type { KubernetesCluster, KubernetesNode } from "../types";

export const kubernetesNodes: KubernetesNode[] = [
  { id: "NODE-01", name: "prod-use1-node-01", clusterId: "CLU-01", status: "Healthy", cpuUsage: 42, memoryUsage: 58, lastSeen: "2026-09-08T09:12:00Z" },
  { id: "NODE-02", name: "prod-use1-node-02", clusterId: "CLU-01", status: "Healthy", cpuUsage: 51, memoryUsage: 63, lastSeen: "2026-09-08T09:11:00Z" },
  { id: "NODE-03", name: "prod-use1-node-03", clusterId: "CLU-01", status: "Warning", cpuUsage: 78, memoryUsage: 81, lastSeen: "2026-09-08T09:10:00Z" },
  { id: "NODE-04", name: "prod-use1-node-04", clusterId: "CLU-01", status: "Critical", cpuUsage: 94, memoryUsage: 96, lastSeen: "2026-09-08T08:52:00Z" },

  { id: "NODE-05", name: "prod-euw1-node-01", clusterId: "CLU-02", status: "Healthy", cpuUsage: 38, memoryUsage: 47, lastSeen: "2026-09-08T09:12:00Z" },
  { id: "NODE-06", name: "prod-euw1-node-02", clusterId: "CLU-02", status: "Healthy", cpuUsage: 45, memoryUsage: 52, lastSeen: "2026-09-08T09:13:00Z" },
  { id: "NODE-07", name: "prod-euw1-node-03", clusterId: "CLU-02", status: "Warning", cpuUsage: 71, memoryUsage: 74, lastSeen: "2026-09-08T09:09:00Z" },

  { id: "NODE-08", name: "staging-main-node-01", clusterId: "CLU-03", status: "Healthy", cpuUsage: 29, memoryUsage: 35, lastSeen: "2026-09-08T09:05:00Z" },
  { id: "NODE-09", name: "staging-main-node-02", clusterId: "CLU-03", status: "Warning", cpuUsage: 66, memoryUsage: 70, lastSeen: "2026-09-08T09:04:00Z" },

  { id: "NODE-10", name: "dev-sandbox-node-01", clusterId: "CLU-04", status: "Healthy", cpuUsage: 21, memoryUsage: 30, lastSeen: "2026-09-08T09:00:00Z" },
];

export const kubernetesClusters: KubernetesCluster[] = [
  { id: "CLU-01", name: "prod-us-east", environment: "Production", region: "us-east-1", nodeIds: ["NODE-01", "NODE-02", "NODE-03", "NODE-04"] },
  { id: "CLU-02", name: "prod-eu-west", environment: "Production", region: "eu-west-1", nodeIds: ["NODE-05", "NODE-06", "NODE-07"] },
  { id: "CLU-03", name: "staging-main", environment: "Staging", region: "us-east-1", nodeIds: ["NODE-08", "NODE-09"] },
  { id: "CLU-04", name: "dev-sandbox", environment: "Development", region: "us-west-2", nodeIds: ["NODE-10"] },
];
