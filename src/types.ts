export type NistFunctionCode = 'GV' | 'ID' | 'PR' | 'DE' | 'RS' | 'RC';

export interface NistCategory {
  id: string; // e.g., 'GOV.PO'
  function: NistFunctionCode;
  name: string;
  description: string;
}

export interface IsoControl {
  id: string; // e.g., '5.1'
  name: string;
  domain: string; // e.g., 'Organizational'
}

export interface Mapping {
  id: string;
  nistCategoryId: string;
  isoControlId: string;
  justification: string;
  implementationStatus: number; // 0 to 100
  expectedOutcome?: string; // El esperado / Resultado esperado / Meta del control
  requestedEvidence?: string; // Evidencias a solicitar / Artefactos de auditoría
}

export interface ProfileScore {
  function: NistFunctionCode;
  current: number; // 0 to 5 (or 0-100)
  target: number;
  industryAverage: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  user: string;
}

export type ProjectStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';

export interface Milestone {
  name: string;
  date: string;
  status: 'Completado' | 'Pendiente';
}

export interface ProjectTask {
  id: string;
  name: string;
  description?: string;
  nistCategoryId: string; // The gap it addresses
  isoControlId?: string; // Associated ISO control
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  progress: number; // 0 to 100
  status: ProjectStatus;
  owner: string; // Department / Entity
  roleResponsible?: string; // Specific responsible person / role
  priority: 'Crítica' | 'Alta' | 'Media' | 'Baja';
  baseBudget: number;
  simulatedBudget?: number;
  functionCode: NistFunctionCode;
  resources: string;
  metrics: string;
  mappingJustification?: string; // Solid rationale for ISO 27001 & NIST CSF 2.0 mapping
  maturityProjection?: string; // Maturity level impact projection
  milestones: Milestone[];
}

export type ComplianceStatus = 'Cumplido' | 'En Progreso' | 'No Implementado' | 'No Aplica';
export type CoverageStatus = 'covered' | 'partial' | 'gap';

export interface CustomFrameworkControl {
  id: string; // e.g. "DORA.ART.6.1", "SOC2.CC6.1"
  code: string;
  domainId: string;
  domainName: string;
  title: string;
  requirement: string;
  intent?: string;
  mappedNistId: string; // e.g. "GV.SC", "PR.AA"
  mappedNistName?: string;
  mappedIsoId: string; // e.g. "5.19", "5.15"
  mappedIsoName?: string;
  crosswalkJustification: string;
  overlapScore: number; // 0 to 100%
  status: CoverageStatus;
  complianceStatus: ComplianceStatus;
  auditEvidence: string;
  remediationAction: string;
  roleResponsible?: string;
  notes?: string;
}

export interface FrameworkDomain {
  id: string;
  name: string;
  description: string;
  controlCount: number;
}

export interface FrameworkFusionMetrics {
  totalControls: number;
  fullyCovered: number;
  partiallyCovered: number;
  gapControls: number;
  overlapPercent: number; // % covered by NIST/ISO baseline
  compliancePercent: number;
  synergyIndex: number;
}

export interface CustomFramework {
  id: string; // e.g. "dora", "soc2", "iso27701", "iso31000", "custom-..."
  code: string; // "DORA", "SOC2", "ISO 27701", "ISO 31000", "NIS2", "PCI-DSS"
  name: string;
  shortName: string;
  category: string;
  version: string;
  description: string;
  sourceType: 'pdf_upload' | 'preconfigured_standard';
  fileName?: string;
  fileSize?: string;
  uploadedAt: string;
  active: boolean; // whether active in unified dashboard & mapping
  domains: FrameworkDomain[];
  controls: CustomFrameworkControl[];
  fusionMetrics: FrameworkFusionMetrics;
}

