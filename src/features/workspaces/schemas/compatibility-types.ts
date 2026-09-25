export type CompatibilityState =
  | 'compatible'
  | 'incompatible'
  | 'unknown'
  | 'conflicting-evidence';
export type EvidenceKind =
  | 'developer-declared'
  | 'source-metadata'
  | 'community-tested'
  | 'automated-test'
  | 'manual-curation';
export type EvidenceClaim = {
  id: string;
  kind: EvidenceKind;
  result: 'compatible' | 'incompatible' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  provenance: string;
  url: string | null;
  observedAt: string;
  expiresAt: string;
  eligible: boolean;
  detail: string;
};
export type CompatibilityEntry = {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  enabled: boolean;
  versionId: string | null;
  versionName: string | null;
  versionNumber: string | null;
  provider: string | null;
  sourceUrl: string | null;
  sourceSyncedAt: string | null;
  sourceStatus: string | null;
  available: boolean;
  support: { platform: string; kind: string; versions: string[] }[];
  dependencies: {
    sourceProjectId: string | null;
    sourceVersionId: string | null;
    name: string | null;
    type: string;
    platform: string | null;
  }[];
  evidence: EvidenceClaim[];
};
export type DependencyIdentity = {
  provider: string;
  externalId: string;
  projectId: string;
  name: string;
  versionId?: string;
  url: string;
};
export type CuratedRelationship = {
  id: string;
  fromProjectId: string;
  toProjectId: string;
  fromVersionId: string | null;
  toVersionId: string | null;
  kind: 'required' | 'optional' | 'conflict' | 'overlap';
  versionRange: string | null;
  platform: string | null;
  minecraftVersion: string | null;
  provenance: string;
  url: string;
  observedAt: string;
  expiresAt: string;
};
export type DependencyFinding = {
  id: string;
  fromEntryId: string;
  targetProjectId: string | null;
  targetEntryId: string | null;
  targetName: string;
  kind:
    | 'required'
    | 'optional'
    | 'conflict'
    | 'overlap'
    | 'unknown'
    | 'embedded';
  state:
    | 'satisfied'
    | 'missing'
    | 'incompatible'
    | 'unknown'
    | 'optional-missing'
    | 'conflict'
    | 'overlap';
  reason: string;
  provenance: string;
  url: string | null;
  observedAt: string;
  requiredVersionId: string | null;
  suggestedUrl: string | null;
};
export type CompatibilityReport = {
  engineVersion: string;
  platform: string;
  minecraftVersion: string;
  computedAt: string;
  entries: {
    id: string;
    projectId: string;
    name: string;
    enabled: boolean;
    versionName: string | null;
    state: CompatibilityState;
    reason: string;
    evidence: EvidenceClaim[];
  }[];
  findings: DependencyFinding[];
  cycles: string[][];
  summary: {
    compatible: number;
    incompatible: number;
    unknown: number;
    conflicting: number;
    blocked: number;
  };
};
export type CompatibilitySnapshot = {
  platform: string;
  minecraftVersion: string;
  entries: CompatibilityEntry[];
  projects: DependencyIdentity[];
  versions: DependencyIdentity[];
  relationships: CuratedRelationship[];
};
