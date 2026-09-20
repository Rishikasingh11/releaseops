export type NodeStatus = "Healthy" | "Warning" | "Critical";

export interface KubernetesCluster {
  id: string;
  name: string;
  environment: "Development" | "Staging" | "Production";
  region: string;
  nodeIds: string[];
}

export interface KubernetesNode {
  id: string;
  name: string;
  clusterId: string;
  status: NodeStatus;
  cpuUsage: number;
  memoryUsage: number;
  lastSeen: string;
}
