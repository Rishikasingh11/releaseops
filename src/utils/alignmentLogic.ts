import type {
  AlignmentStatus,
  ProductionRepositoryAlignment,
} from "../types/productionAlignment";

/**
 * Parses semver or decimal versions like 'v4.8', 'v4.8.1', '5.0' into numerical components.
 */
export function parseVersion(versionStr: string): number[] {
  const clean = versionStr.replace(/^[^\d]*/, "").trim();
  const parts = clean.split(".").map((p) => {
    const num = parseInt(p, 10);
    return Number.isNaN(num) ? 0 : num;
  });
  while (parts.length < 3) parts.push(0);
  return parts;
}

/**
 * Returns:
 *  > 0 if v1 > v2
 *  < 0 if v1 < v2
 *  0 if v1 === v2
 */
export function compareVersions(v1: string, v2: string): number {
  const p1 = parseVersion(v1);
  const p2 = parseVersion(v2);

  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const num1 = p1[i] ?? 0;
    const num2 = p2[i] ?? 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

/**
 * Computes version distance in major/minor terms.
 */
export function calculateVersionDiff(vFrom: string, vTo: string): number {
  const [maj1, min1] = parseVersion(vFrom);
  const [maj2, min2] = parseVersion(vTo);
  const majorDiff = (maj1 ?? 0) - (maj2 ?? 0);
  const minorDiff = (min1 ?? 0) - (min2 ?? 0);
  return majorDiff * 10 + minorDiff;
}

export interface AlignmentAnalysisResult {
  status: AlignmentStatus;
  explanation: string;
  recommendation: string;
}

/**
 * Core deterministic alignment business logic utility.
 */
export function calculateAlignment(params: {
  trunkVersion: string;
  releaseVersion: string;
  productionVersion: string;
  commitsAheadReleaseVsProd: number;
  commitsAheadTrunkVsProd: number;
  isDiverged?: boolean;
  divergenceReason?: string;
}): AlignmentAnalysisResult {
  const {
    trunkVersion,
    releaseVersion,
    productionVersion,
    commitsAheadReleaseVsProd,
    isDiverged,
    divergenceReason,
  } = params;

  // Case 4: Diverged branch or production hotfix drift
  if (isDiverged) {
    return {
      status: "DIVERGED",
      explanation:
        divergenceReason ||
        "Unexpected divergence detected between Production and Release. Production commit is not a direct ancestor of the Release candidate lineage.",
      recommendation:
        "Perform cherry-pick verification and backward-merge production hotfix into Release and Trunk branches immediately.",
    };
  }

  const relVsProd = compareVersions(releaseVersion, productionVersion);
  const trunkVsRel = compareVersions(trunkVersion, releaseVersion);
  const versionDistance = calculateVersionDiff(releaseVersion, productionVersion);

  // Case 1: Fully Aligned
  if (relVsProd === 0 && trunkVsRel === 0 && commitsAheadReleaseVsProd === 0) {
    return {
      status: "ALIGNED",
      explanation:
        "Production is fully aligned with the current Release branch and Trunk.",
      recommendation:
        "No action required. Repository release lineage is completely in sync.",
    };
  }

  // Case 3: Major lag or multiple versions behind
  if (versionDistance >= 2 || commitsAheadReleaseVsProd >= 15) {
    return {
      status: "ATTENTION REQUIRED",
      explanation: `Production (${productionVersion}) is behind the active Release branch (${releaseVersion}) by ${Math.max(
        versionDistance,
        1
      )} version(s) and ${commitsAheadReleaseVsProd} commits. Urgent deployment scheduling needed.`,
      recommendation:
        "Schedule an accelerated deployment window and complete final regression validation in staging.",
    };
  }

  // Case 2: Release is ahead and pending deployment
  if (relVsProd > 0 || commitsAheadReleaseVsProd > 0) {
    return {
      status: "RELEASE PENDING",
      explanation: `Release ${releaseVersion} is ahead of the current Production version (${productionVersion}) by ${commitsAheadReleaseVsProd} commit(s) and is awaiting deployment.`,
      recommendation:
        "Verify change approvals and execute deployment pipeline when maintenance window opens.",
    };
  }

  // Trunk ahead but release matches prod
  if (relVsProd === 0 && trunkVsRel > 0) {
    return {
      status: "ALIGNED",
      explanation: `Production matches current Release branch (${productionVersion}). Trunk contains ongoing development (${trunkVersion}) not yet cut into a new release candidate.`,
      recommendation:
        "Standard development lifecycle. Cut next release candidate branch from Trunk during scheduled feature freeze.",
    };
  }

  // Fallback behind
  return {
    status: "BEHIND",
    explanation: `Production (${productionVersion}) is behind the active Release branch (${releaseVersion}).`,
    recommendation:
      "Review pending release in ReleaseOps and complete governance approvals prior to scheduled deployment.",
  };
}

/**
 * Computes dashboard metric summaries across all repositories.
 */
export function summarizeAlignmentMetrics(repos: ProductionRepositoryAlignment[]) {
  const total = repos.length;
  const aligned = repos.filter((r) => r.alignmentStatus === "ALIGNED").length;
  const releasePending = repos.filter(
    (r) => r.alignmentStatus === "RELEASE PENDING"
  ).length;
  const productionBehind = repos.filter(
    (r) => r.alignmentStatus === "BEHIND"
  ).length;
  const divergedOrAttention = repos.filter(
    (r) =>
      r.alignmentStatus === "DIVERGED" ||
      r.alignmentStatus === "ATTENTION REQUIRED"
  ).length;

  return {
    total,
    aligned,
    releasePending,
    productionBehind,
    divergedOrAttention,
  };
}
