import React from 'react';
import { ProjectTask } from '../types';
import { PROJECTS as defaultProjects } from '../data/mockData';
import { exportProjectsToCSV } from '../utils/exportUtils';
import { Users, Target, Clock, CheckCircle2, Circle, Briefcase, FileText, BookOpen, FileSpreadsheet } from 'lucide-react';

interface ActionPlanProps {
  projects?: ProjectTask[];
}

export function ActionPlan({ projects }: ActionPlanProps) {
  const projectList = projects && projects.length > 0 ? projects : defaultProjects;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'text-[#ef4444]';
      case 'Alta': return 'text-[#f59e0b]';
      case 'Media': return 'text-[#c0a080]';
      case 'Baja': return 'text-[#888]';
      default: return 'text-[#e0e0e0]';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-serif text-[#c0a080] italic">Plan de Acción Estratégico & Justificación Táctica</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] mt-1">Hoja de ruta priorizada para remediación de brechas ISO/NIST</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportProjectsToCSV(projectList)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c0a080] hover:bg-[#b09070] text-black text-xs font-mono font-bold rounded-sm transition-colors shadow-xs"
            title="Exportar plan de acción a formato CSV / Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar CSV / Excel</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border border-[#222] rounded-sm">
            <Briefcase className="w-4 h-4 text-[#c0a080]" />
            <span className="text-[10px] uppercase tracking-widest text-[#e0e0e0]">C-Level View</span>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-[#0f0f0f] border border-[#222] p-6 rounded-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#c0a080]"></div>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#c0a080]" />
          <h3 className="font-serif text-lg text-[#e0e0e0]">Resumen Ejecutivo de Gobernanza</h3>
        </div>
        <p className="text-[#ccc] text-sm leading-relaxed max-w-4xl">
          El presente plan estratégico traza la hoja de ruta integral para mitigar las brechas identificadas durante la evaluación de cumplimiento entre los controles de <strong>ISO/IEC 27001:2022</strong> y los objetivos de madurez del marco <strong>NIST CSF 2.0</strong>. Las iniciativas han sido costeadas, asignadas a líderes específicos y priorizadas con base en el análisis de brecha, garantizando un retorno de inversión óptimo en ciberresiliencia.
        </p>
      </div>

      {/* Iniciativas de Remediación */}
      <div className="space-y-6 mt-8">
        <h3 className="font-serif text-xl italic text-[#c0a080] border-b border-[#222] pb-2">Iniciativas de Remediación Priorizadas ({projectList.length})</h3>
        
        {projectList.map((project) => (
          <div key={project.id} className="bg-[#0f0f0f] border border-[#222] rounded-sm flex flex-col lg:flex-row overflow-hidden">
            {/* Header info */}
            <div className="p-6 bg-[#111] lg:w-1/3 border-b lg:border-b-0 lg:border-r border-[#222]">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1a1a1a] text-[#c0a080] border border-[#222] rounded-xs">
                    {project.nistCategoryId}
                  </span>
                  {project.isoControlId && (
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1a1a1a] text-[#38bdf8] border border-[#222] rounded-xs">
                      ISO {project.isoControlId}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] uppercase font-mono tracking-widest font-bold ${getPriorityColor(project.priority)}`}>
                  Prioridad {project.priority}
                </span>
              </div>
              <h4 className="font-serif text-lg text-[#e0e0e0] leading-snug mb-4">{project.name}</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-[#ccc]">
                  <Users className="w-4 h-4 text-[#666] shrink-0" />
                  <span><strong>Área / Rol:</strong> {project.owner} {project.roleResponsible ? `(${project.roleResponsible})` : ''}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#ccc]">
                  <Target className="w-4 h-4 text-[#666] shrink-0" />
                  <span><strong>Presupuesto:</strong> {project.resources}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#ccc]">
                  <Clock className="w-4 h-4 text-[#666] shrink-0" />
                  <span><strong>Período:</strong> {project.startDate} a {project.endDate}</span>
                </div>
              </div>
            </div>

            {/* Execution info */}
            <div className="p-6 lg:w-2/3 flex flex-col justify-between space-y-4">
              <div>
                {/* Justificación de Mapeo */}
                {project.mappingJustification && (
                  <div className="mb-4 bg-[#141414] border border-[#222] p-3 rounded-sm space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#c0a080] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Argumentación de Mapeo Normativo:
                    </span>
                    <p className="text-xs text-[#ccc] font-sans italic">
                      "{project.mappingJustification}"
                    </p>
                  </div>
                )}

                <h5 className="text-[11px] uppercase tracking-wider text-[#888] mb-2 font-mono">Métricas de Éxito & KPIs</h5>
                <p className="text-xs text-[#e0e0e0] font-serif mb-4 pl-3 border-l-2 border-[#c0a080] italic">
                  "{project.metrics || 'Aumento verificado en la postura de seguridad.'}"
                </p>

                <h5 className="text-[11px] uppercase tracking-wider text-[#888] mb-3 font-mono">Cronograma e Hitos Operativos ({project.milestones?.length || 0})</h5>
                <div className="space-y-2">
                  {project.milestones?.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      {milestone.status === 'Completado' 
                        ? <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                        : <Circle className="w-4 h-4 text-[#444]" />
                      }
                      <span className={milestone.status === 'Completado' ? 'text-[#10b981] line-through' : 'text-[#888]'}>
                        {milestone.name}
                      </span>
                      <div className="flex-1 border-t border-dashed border-[#222] mx-2"></div>
                      <span className="text-[#666] font-mono tracking-widest text-[9px]">{milestone.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

