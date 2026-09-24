/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard, IsoMetrics } from './components/Dashboard';
import { NonNegotiables } from './components/NonNegotiables';
import { MappingTable } from './components/MappingTable';
import { GapAnalysis } from './components/GapAnalysis';
import { ProjectGantt } from './components/ProjectGantt';
import { Reports } from './components/Reports';
import { ActionPlan } from './components/ActionPlan';
import { RiskSimulator } from './components/RiskSimulator';
import { Checklists } from './components/Checklists';
import { AuditorView } from './components/AuditorView';
import { Documentation } from './components/Documentation';
import { FrameworkFusionHub } from './components/FrameworkFusionHub';
import { PROJECTS as initialProjects } from './data/mockData';
import { 
  INITIAL_NIST_CHECKS, 
  INITIAL_ISO_CONTROL_CHECKS, 
  INITIAL_ISO_CLAUSE_CHECKS, 
  ALL_ISO_MAPPINGS 
} from './data/initialChecklistData';
import { NIST_2_SUBCATEGORIES } from './data/nist2Data';
import { ISO_27001_CONTROLS_93, ISO_CLAUSES } from './data/iso27001Data';
import { NON_NEGOTIABLE_RECOMMENDATIONS, NonNegotiableRecommendation } from './data/nonNegotiablesData';
import { PRECONFIGURED_FRAMEWORKS } from './data/frameworksLibrary';
import { 
  NistFunctionCode, 
  ProfileScore, 
  Mapping, 
  AuditLog, 
  ProjectTask, 
  CustomFramework, 
  CustomFrameworkControl,
  ComplianceStatus 
} from './types';

const INDUSTRY_AVERAGES: Record<string, number> = {
  'GV': 3.2,
  'ID': 3.5,
  'PR': 3.0,
  'DE': 2.8,
  'RS': 3.1,
  'RC': 3.2,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  // Master checklist states
  const [nistChecks, setNistChecks] = useState<Record<string, boolean>>(INITIAL_NIST_CHECKS);
  const [isoControlChecks, setIsoControlChecks] = useState<Record<string, boolean>>(INITIAL_ISO_CONTROL_CHECKS);
  const [isoClauseChecks, setIsoClauseChecks] = useState<Record<string, boolean>>(INITIAL_ISO_CLAUSE_CHECKS);

  // Multi-Framework Ingestion and Fusion State
  const [frameworks, setFrameworks] = useState<CustomFramework[]>(PRECONFIGURED_FRAMEWORKS);

  // Custom Mapping overrides (status, expected outcome, requested evidence)
  const [customMappingStatuses, setCustomMappingStatuses] = useState<Record<string, number>>({});
  const [customMappingDetails, setCustomMappingDetails] = useState<Record<string, Partial<Mapping>>>({});

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      action: 'Sistema Inicializado',
      details: 'Carga de 106 subcategorías NIST CSF 2.0 y 93 controles ISO/IEC 27001:2022',
      user: 'Sistema'
    }
  ]);

  // Targets
  const [targets, setTargets] = useState<Record<string, number>>({
    'GV': 4.5,
    'ID': 4.0,
    'PR': 4.0,
    'DE': 4.5,
    'RS': 4.0,
    'RC': 3.5,
  });

  // Calculate NIST Function Scores directly from the 106 Checklist subcategories
  const scores = useMemo<ProfileScore[]>(() => {
    const funcs: NistFunctionCode[] = ['GV', 'ID', 'PR', 'DE', 'RS', 'RC'];

    return funcs.map(funcCode => {
      const funcSubs = NIST_2_SUBCATEGORIES.filter(s => s.functionCode === funcCode);
      const total = funcSubs.length;
      const completed = funcSubs.filter(s => nistChecks[s.id]).length;
      const pct = total > 0 ? (completed / total) * 100 : 0;
      const currentScore = Number(((pct / 100) * 5).toFixed(2));

      return {
        function: funcCode,
        current: currentScore,
        target: targets[funcCode] || 4.0,
        industryAverage: INDUSTRY_AVERAGES[funcCode] || 3.0
      };
    });
  }, [nistChecks, targets]);

  // Calculate ISO Metrics
  const isoMetrics = useMemo<IsoMetrics>(() => {
    const totalIsoControls = ISO_27001_CONTROLS_93.length; // 93
    const completedIsoControls = ISO_27001_CONTROLS_93.filter(c => isoControlChecks[c.id]).length;
    
    let totalIsoClauseReqs = 0;
    let completedIsoClauseReqs = 0;
    ISO_CLAUSES.forEach(c => {
      c.requirements.forEach(req => {
        totalIsoClauseReqs++;
        if (isoClauseChecks[req.id]) completedIsoClauseReqs++;
      });
    });

    const totalNistSubs = NIST_2_SUBCATEGORIES.length; // 106
    const completedNistSubcategories = NIST_2_SUBCATEGORIES.filter(s => nistChecks[s.id]).length;

    const isoAnnexAPercent = Math.round((completedIsoControls / totalIsoControls) * 100);
    const isoClausesPercent = Math.round((completedIsoClauseReqs / totalIsoClauseReqs) * 100);
    const overallIsoPercent = Math.round(((completedIsoControls + completedIsoClauseReqs) / (totalIsoControls + totalIsoClauseReqs)) * 100);
    const nistOverallPercent = Math.round((completedNistSubcategories / totalNistSubs) * 100);
    const globalCompliancePercent = Math.round((overallIsoPercent + nistOverallPercent) / 2);

    return {
      isoAnnexAPercent,
      isoClausesPercent,
      overallIsoPercent,
      nistOverallPercent,
      globalCompliancePercent,
      completedIsoControls,
      completedIsoClauseReqs,
      completedNistSubcategories
    };
  }, [isoControlChecks, isoClauseChecks, nistChecks]);

  // Compute live Mappings for all 93 ISO controls with custom override support
  const mappings = useMemo<Mapping[]>(() => {
    return ALL_ISO_MAPPINGS.map(map => {
      const detailOverride = customMappingDetails[map.id] || {};
      const statusOverride = customMappingStatuses[map.id];

      let implementationStatus = 0;
      if (typeof statusOverride === 'number') {
        implementationStatus = statusOverride;
      } else {
        const isoChecked = !!isoControlChecks[map.isoControlId];
        const nistCategorySubs = NIST_2_SUBCATEGORIES.filter(s => s.categoryId === map.nistCategoryId);
        const completedNist = nistCategorySubs.filter(s => nistChecks[s.id]).length;
        const nistCatPct = nistCategorySubs.length > 0 ? (completedNist / nistCategorySubs.length) * 100 : (isoChecked ? 100 : 0);
        
        implementationStatus = Math.round(( (isoChecked ? 100 : 0) + nistCatPct ) / 2);
      }

      return {
        ...map,
        ...detailOverride,
        implementationStatus
      };
    });
  }, [isoControlChecks, nistChecks, customMappingStatuses, customMappingDetails]);

  // Handlers for Checklist Toggles
  const handleToggleNistSubcategory = (id: string) => {
    setNistChecks(prev => {
      const nextVal = !prev[id];
      const log: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'Checklist NIST CSF 2.0',
        details: `Subcategoría ${id} marcada como ${nextVal ? 'COMPLETADA' : 'PENDIENTE'}`,
        user: 'Auditor'
      };
      setAuditLogs(logs => [log, ...logs]);
      return { ...prev, [id]: nextVal };
    });
  };

  const handleToggleIsoControl = (id: string) => {
    setIsoControlChecks(prev => {
      const nextVal = !prev[id];
      const log: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'Checklist ISO 27001 Anexo A',
        details: `Control ${id} marcado como ${nextVal ? 'CUMPLIDO' : 'INCOMPLETO'}`,
        user: 'Auditor'
      };
      setAuditLogs(logs => [log, ...logs]);
      return { ...prev, [id]: nextVal };
    });
  };

  const handleToggleIsoClauseReq = (id: string) => {
    setIsoClauseChecks(prev => {
      const nextVal = !prev[id];
      const log: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'Checklist Cláusulas SGSI ISO 27001',
        details: `Requisito SGSI ${id} marcado como ${nextVal ? 'CUMPLIDO' : 'PENDIENTE'}`,
        user: 'Auditor'
      };
      setAuditLogs(logs => [log, ...logs]);
      return { ...prev, [id]: nextVal };
    });
  };

  // Batch toggles
  const handleBatchToggleNistCategory = (catId: string, subcategoryIds: string[]) => {
    const allChecked = subcategoryIds.every(id => nistChecks[id]);
    const nextVal = !allChecked;

    setNistChecks(prev => {
      const next = { ...prev };
      subcategoryIds.forEach(id => { next[id] = nextVal; });
      return next;
    });

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Checklist NIST por Categoría',
      details: `Categoría ${catId}: ${subcategoryIds.length} subcategorías marcadas como ${nextVal ? 'COMPLETADAS' : 'PENDIENTES'}`,
      user: 'Auditor'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleBatchToggleIsoDomain = (controlIds: string[]) => {
    const allChecked = controlIds.every(id => isoControlChecks[id]);
    const nextVal = !allChecked;

    setIsoControlChecks(prev => {
      const next = { ...prev };
      controlIds.forEach(id => { next[id] = nextVal; });
      return next;
    });

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Checklist ISO por Dominio',
      details: `${controlIds.length} controles ISO actualizados como ${nextVal ? 'CUMPLIDOS' : 'PENDIENTES'}`,
      user: 'Auditor'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleBatchToggleIsoClause = (reqIds: string[]) => {
    const allChecked = reqIds.every(id => isoClauseChecks[id]);
    const nextVal = !allChecked;

    setIsoClauseChecks(prev => {
      const next = { ...prev };
      reqIds.forEach(id => { next[id] = nextVal; });
      return next;
    });

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Checklist Cláusulas SGSI',
      details: `${reqIds.length} requisitos SGSI actualizados como ${nextVal ? 'CUMPLIDOS' : 'PENDIENTES'}`,
      user: 'Auditor'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  // Project List State
  const [projectList, setProjectList] = useState<ProjectTask[]>(initialProjects);

  const handleAddProject = (newProjectData: Omit<ProjectTask, 'id'>) => {
    const newProj: ProjectTask = {
      ...newProjectData,
      id: `p_${Date.now()}`
    };
    setProjectList(prev => [newProj, ...prev]);

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Iniciativa Creada en Cronograma',
      details: `Iniciativa "${newProj.name}" registrada para ${newProj.owner} con plazo ${newProj.startDate} a ${newProj.endDate} (NIST ${newProj.nistCategoryId})`,
      user: 'Gestor de Proyectos'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleUpdateProject = (updatedProject: ProjectTask) => {
    setProjectList(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Iniciativa Actualizada',
      details: `Iniciativa "${updatedProject.name}" modificada (${updatedProject.progress}% avance, estado: ${updatedProject.status})`,
      user: 'Gestor de Proyectos'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleDeleteProject = (projectId: string) => {
    const proj = projectList.find(p => p.id === projectId);
    setProjectList(prev => prev.filter(p => p.id !== projectId));

    if (proj) {
      const log: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'Iniciativa Eliminada del Cronograma',
        details: `Iniciativa "${proj.name}" eliminada del portafolio`,
        user: 'Gestor de Proyectos'
      };
      setAuditLogs(logs => [log, ...logs]);
    }
  };

  // Mapping Table status change sync
  const handleStatusChange = (mappingId: string, newStatus: number) => {
    const targetMap = ALL_ISO_MAPPINGS.find(m => m.id === mappingId);
    if (!targetMap) return;

    const validStatus = Math.max(0, Math.min(100, newStatus));

    setCustomMappingStatuses(prev => ({ ...prev, [mappingId]: validStatus }));

    // Sync checklist toggles if status is set to complete (>=90) or zero
    if (validStatus >= 90) {
      setIsoControlChecks(prev => ({ ...prev, [targetMap.isoControlId]: true }));
    } else if (validStatus === 0) {
      setIsoControlChecks(prev => ({ ...prev, [targetMap.isoControlId]: false }));
    }

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'Ajuste de Mapeo de Controles',
      details: `Mapeo ${targetMap.isoControlId} ➔ NIST ${targetMap.nistCategoryId} ajustado a ${validStatus}%`,
      user: 'Auditor'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleMappingUpdate = (mappingId: string, updatedFields: Partial<Mapping>) => {
    setCustomMappingDetails(prev => ({
      ...prev,
      [mappingId]: {
        ...prev[mappingId],
        ...updatedFields
      }
    }));

    if (typeof updatedFields.implementationStatus === 'number') {
      handleStatusChange(mappingId, updatedFields.implementationStatus);
    } else {
      const log: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'Criterios de Auditoría Modificados',
        details: `Criterios y evidencias de auditoría actualizadas para el mapeo ${mappingId}`,
        user: 'Auditor'
      };
      setAuditLogs(logs => [log, ...logs]);
    }
  };

  // Computed projects with gaps
  const projects = useMemo(() => {
    return projectList.map(p => {
      const score = scores.find(s => s.function === p.functionCode);
      const gap = score ? Math.max(0, score.target - score.current) : 0;
      let priority: 'Crítica' | 'Alta' | 'Media' | 'Baja' = p.priority || 'Baja';
      let budget = p.baseBudget || 10000;
      
      if (gap >= 1.5 && p.priority !== 'Crítica') {
        priority = 'Crítica';
        budget = Math.round(p.baseBudget * 1.5);
      } else if (gap >= 1.0 && p.priority === 'Baja') {
        priority = 'Alta';
        budget = Math.round(p.baseBudget * 1.2);
      }

      const resourceDetail = p.resources?.includes('|') ? p.resources.split('|')[1]?.trim() : (p.resources || '2 FTEs');
      const resources = `$${budget.toLocaleString('en-US')} USD | ${resourceDetail}`;

      return { ...p, priority, resources, simulatedBudget: budget };
    });
  }, [projectList, scores]);

  // Non-Negotiables Enforcement Engine
  const handleEnforceRecommendation = (rec: NonNegotiableRecommendation) => {
    // 1. Mark NIST subcategories as true
    setNistChecks(prev => {
      const updated = { ...prev };
      rec.nistSubcategories.forEach(subId => {
        updated[subId] = true;
      });
      return updated;
    });

    // 2. Mark ISO Annex A Controls as true
    setIsoControlChecks(prev => {
      const updated = { ...prev };
      rec.isoControls.forEach(ctrlId => {
        updated[ctrlId] = true;
      });
      return updated;
    });

    // 3. Mark ISO Clauses as true
    setIsoClauseChecks(prev => {
      const updated = { ...prev };
      rec.isoClauses.forEach(clId => {
        updated[clId] = true;
      });
      return updated;
    });

    // 4. Update Mappings involving these ISO controls to 100%
    setCustomMappingStatuses(prev => {
      const updated = { ...prev };
      ALL_ISO_MAPPINGS.forEach(m => {
        if (rec.isoControls.includes(m.isoControlId)) {
          updated[m.id] = 100;
        }
      });
      return updated;
    });

    // 5. Update relevant Projects to 100% and Completed status
    setProjectList(prev => prev.map(p => {
      const matchesNist = rec.nistSubcategories.some(sub => sub.startsWith(p.nistCategoryId));
      const matchesIso = p.isoControlId && rec.isoControls.includes(p.isoControlId);
      const matchesFunc = p.functionCode === rec.nistFunction;

      if (matchesNist || matchesIso || matchesFunc) {
        return {
          ...p,
          progress: 100,
          status: 'Completed',
          milestones: p.milestones.map(m => ({ ...m, status: 'Completado' as const }))
        };
      }
      return p;
    }));

    // 6. Record official Audit Log
    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'ENFORCEMENT AUTOMATIZADO DE LÍNEA BASE',
      details: `Salvaguarda No Negociable "${rec.code}: ${rec.shortName}" APLICADA Y GARANTIZADA al 100%. (Subcategorías NIST ${rec.nistSubcategories.join(', ')} e ISO ${rec.isoControls.join(', ')})`,
      user: 'Motor CISO de Cumplimiento Automático'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleEnforceAllRecommendations = () => {
    // 1. Gather all subcategories, controls, and clauses
    const allNistSubs: string[] = [];
    const allIsoCtrls: string[] = [];
    const allIsoClauses: string[] = [];

    NON_NEGOTIABLE_RECOMMENDATIONS.forEach(rec => {
      allNistSubs.push(...rec.nistSubcategories);
      allIsoCtrls.push(...rec.isoControls);
      allIsoClauses.push(...rec.isoClauses);
    });

    // Update NIST
    setNistChecks(prev => {
      const updated = { ...prev };
      allNistSubs.forEach(s => { updated[s] = true; });
      return updated;
    });

    // Update ISO controls
    setIsoControlChecks(prev => {
      const updated = { ...prev };
      allIsoCtrls.forEach(c => { updated[c] = true; });
      return updated;
    });

    // Update ISO clauses
    setIsoClauseChecks(prev => {
      const updated = { ...prev };
      allIsoClauses.forEach(cl => { updated[cl] = true; });
      return updated;
    });

    // Update all mappings
    setCustomMappingStatuses(prev => {
      const updated = { ...prev };
      ALL_ISO_MAPPINGS.forEach(m => {
        if (allIsoCtrls.includes(m.isoControlId)) {
          updated[m.id] = 100;
        }
      });
      return updated;
    });

    // Advance all critical projects to 100%
    setProjectList(prev => prev.map(p => ({
      ...p,
      progress: 100,
      status: 'Completed',
      milestones: p.milestones.map(m => ({ ...m, status: 'Completado' as const }))
    })));

    // Audit log
    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'ENFORCEMENT MASIVO DE LÍNEA BASE NO NEGOCIABLE',
      details: `Se aplicaron y garantizaron automáticamente las 12 Salvaguardas No Negociables NIST CSF 2.0 & ISO/IEC 27001:2022 en todo el SGSI`,
      user: 'Comité CISO / Automatización Certificada'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleRevertRecommendation = (rec: NonNegotiableRecommendation) => {
    // Revert NIST subcategories to false
    setNistChecks(prev => {
      const updated = { ...prev };
      rec.nistSubcategories.forEach(subId => {
        updated[subId] = false;
      });
      return updated;
    });

    // Revert ISO controls to false
    setIsoControlChecks(prev => {
      const updated = { ...prev };
      rec.isoControls.forEach(ctrlId => {
        updated[ctrlId] = false;
      });
      return updated;
    });

    // Revert mappings
    setCustomMappingStatuses(prev => {
      const updated = { ...prev };
      ALL_ISO_MAPPINGS.forEach(m => {
        if (rec.isoControls.includes(m.isoControlId)) {
          updated[m.id] = 20;
        }
      });
      return updated;
    });

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'REVERSIÓN DIAGNÓSTICA DE SALVAGUARDA',
      details: `Salvaguarda "${rec.code}: ${rec.shortName}" restablecida a estado diagnóstico para evaluación de brechas`,
      user: 'Auditor'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  // Multi-Framework Handlers
  const handleAddFramework = (newFramework: CustomFramework) => {
    setFrameworks(prev => {
      const filtered = prev.filter(f => f.id !== newFramework.id && f.code !== newFramework.code);
      return [newFramework, ...filtered];
    });

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'NUEVO MARCO REGULATORIO FUSIONADO',
      details: `Marco "${newFramework.name} (${newFramework.code})" incorporado con ${newFramework.controls.length} controles y ${newFramework.fusionMetrics.overlapPercent}% de solapamiento con la línea base SGSI`,
      user: 'Arquitecto de Cumplimiento'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleRemoveFramework = (frameworkId: string) => {
    const targetFw = frameworks.find(f => f.id === frameworkId);
    setFrameworks(prev => prev.filter(f => f.id !== frameworkId));

    if (targetFw) {
      const log: AuditLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'MARCO REGULATORIO ELIMINADO',
        details: `Marco "${targetFw.name} (${targetFw.code})" removido del centro de mando`,
        user: 'Arquitecto de Cumplimiento'
      };
      setAuditLogs(logs => [log, ...logs]);
    }
  };

  const handleToggleFrameworkActive = (frameworkId: string) => {
    setFrameworks(prev => prev.map(f => {
      if (f.id === frameworkId) {
        const nextActive = !f.active;
        const log: AuditLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          action: 'ESTADO DE MARCO MODIFICADO',
          details: `Marco "${f.name} (${f.code})" ${nextActive ? 'ACTIVADO' : 'DESACTIVADO'} en la matriz de fusión`,
          user: 'Arquitecto de Cumplimiento'
        };
        setAuditLogs(logs => [log, ...logs]);
        return { ...f, active: nextActive };
      }
      return f;
    }));
  };

  const handleUpdateFrameworkControlStatus = (frameworkId: string, controlId: string, status: ComplianceStatus) => {
    setFrameworks(prev => prev.map(fw => {
      if (fw.id !== frameworkId) return fw;

      const updatedControls = fw.controls.map(c => {
        if (c.id === controlId) {
          return { ...c, complianceStatus: status };
        }
        return c;
      });

      const compliantCount = updatedControls.filter(c => c.complianceStatus === 'Cumplido').length;
      const compliancePercent = updatedControls.length > 0 ? Math.round((compliantCount / updatedControls.length) * 100) : 0;

      return {
        ...fw,
        controls: updatedControls,
        fusionMetrics: {
          ...fw.fusionMetrics,
          compliancePercent
        }
      };
    }));

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'ESTADO DE CONTROL ACTUALIZADO',
      details: `Control ${controlId} del marco ${frameworkId} actualizado a estado "${status}"`,
      user: 'Auditor'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  const handleConvertGapToProject = (control: CustomFrameworkControl, frameworkName: string) => {
    const newProj: ProjectTask = {
      id: `p_gap_${Date.now()}`,
      name: `Remediación: [${control.code}] ${control.title}`,
      description: `Remediar brecha normativa identificada en ${frameworkName}. Requisito: ${control.requirement}. Acción: ${control.remediationAction}`,
      functionCode: (control.mappedNistId.slice(0, 2) as NistFunctionCode) || 'PR',
      nistCategoryId: control.mappedNistId,
      isoControlId: control.mappedIsoId,
      progress: 10,
      priority: 'Alta',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      owner: control.roleResponsible || 'SecOps / CISO',
      status: 'In Progress',
      resources: '$18,000 USD | 1 Especialista',
      metrics: '100% de evidencia de auditoría recolectada y brecha mitigada',
      mappingJustification: control.crosswalkJustification,
      maturityProjection: '+0.4 incremento en madurez',
      baseBudget: 18000,
      milestones: [
        { name: 'Evaluación técnica de brecha', date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), status: 'Pendiente' },
        { name: 'Implementación de salvaguarda y evidencia', date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), status: 'Pendiente' },
        { name: 'Validación de auditoría y cierre', date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), status: 'Pendiente' }
      ]
    };

    setProjectList(prev => [newProj, ...prev]);
    setCurrentTab('projects');

    const log: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action: 'BRECHA CONVERTIDA EN PROYECTO GANTT',
      details: `Se generó la iniciativa de remediación "${newProj.name}" en el cronograma para cumplir con ${frameworkName}`,
      user: 'Gestor de Proyectos'
    };
    setAuditLogs(logs => [log, ...logs]);
  };

  // Count enforced non-negotiables
  const nonNegotiablesEnforcedCount = useMemo(() => {
    return NON_NEGOTIABLE_RECOMMENDATIONS.filter(rec => {
      const nistFulfilled = rec.nistSubcategories.length === 0 || rec.nistSubcategories.every(sub => !!nistChecks[sub]);
      const isoFulfilled = rec.isoControls.length === 0 || rec.isoControls.every(ctrl => !!isoControlChecks[ctrl]);
      const clausesFulfilled = rec.isoClauses.length === 0 || rec.isoClauses.every(cl => !!isoClauseChecks[cl]);
      return nistFulfilled && isoFulfilled && clausesFulfilled;
    }).length;
  }, [nistChecks, isoControlChecks, isoClauseChecks]);

  return (
    <div className="flex h-screen bg-[#060911] text-slate-100 font-sans overflow-hidden cyber-grid">
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        nonNegotiablesCount={{
          enforced: nonNegotiablesEnforcedCount,
          total: NON_NEGOTIABLE_RECOMMENDATIONS.length
        }}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {currentTab === 'dashboard' && (
          <Dashboard 
            scores={scores} 
            projects={projects} 
            mappings={mappings} 
            isoMetrics={isoMetrics} 
            onNavigateToTab={setCurrentTab}
            nonNegotiablesEnforcedCount={nonNegotiablesEnforcedCount}
            customFrameworks={frameworks}
          />
        )}
        {currentTab === 'fusion' && (
          <FrameworkFusionHub
            frameworks={frameworks}
            onAddFramework={handleAddFramework}
            onRemoveFramework={handleRemoveFramework}
            onToggleFrameworkActive={handleToggleFrameworkActive}
            onUpdateControlStatus={handleUpdateFrameworkControlStatus}
            onConvertGapToProject={handleConvertGapToProject}
          />
        )}
        {currentTab === 'non-negotiables' && (
          <NonNegotiables 
            nistChecks={nistChecks}
            isoControlChecks={isoControlChecks}
            isoClauseChecks={isoClauseChecks}
            onEnforceRecommendation={handleEnforceRecommendation}
            onEnforceAllRecommendations={handleEnforceAllRecommendations}
            onRevertRecommendation={handleRevertRecommendation}
          />
        )}
        {currentTab === 'documentation' && (
          <Documentation />
        )}
        {currentTab === 'mapping' && (
          <MappingTable 
            mappings={mappings} 
            onStatusChange={handleStatusChange} 
            onMappingUpdate={handleMappingUpdate}
          />
        )}
        {currentTab === 'checklists' && (
          <Checklists 
            nistChecks={nistChecks}
            isoControlChecks={isoControlChecks}
            isoClauseChecks={isoClauseChecks}
            onToggleNistSubcategory={handleToggleNistSubcategory}
            onToggleIsoControl={handleToggleIsoControl}
            onToggleIsoClauseReq={handleToggleIsoClauseReq}
            onBatchToggleNistCategory={handleBatchToggleNistCategory}
            onBatchToggleIsoDomain={handleBatchToggleIsoDomain}
            onBatchToggleIsoClause={handleBatchToggleIsoClause}
          />
        )}
        {currentTab === 'gaps' && <GapAnalysis scores={scores} />}
        {currentTab === 'action-plan' && <ActionPlan projects={projects} />}
        {currentTab === 'projects' && (
          <ProjectGantt 
            projects={projects} 
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
          />
        )}
        {currentTab === 'reports' && <Reports scores={scores} projects={projects} isoMetrics={isoMetrics} />}
        {currentTab === 'simulator' && <RiskSimulator scores={scores} setTargets={setTargets} projects={projects} />}
        {currentTab === 'auditor' && <AuditorView logs={auditLogs} />}
      </main>
    </div>
  );
}

