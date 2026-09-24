import React, { useState, useMemo } from 'react';
import { ProjectTask, NistFunctionCode, ProjectStatus, Milestone } from '../types';
import { 
  exportProjectsToCSV, 
  exportGanttToExcel, 
  exportGanttToPowerBI, 
  exportGanttToJSON, 
  generatePowerBIMCodeSnippet 
} from '../utils/exportUtils';
import { differenceInDays, parseISO, format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Filter, Plus, Edit3, Trash2, Calendar, UserCheck, ShieldCheck, 
  CheckCircle2, Circle, Clock, DollarSign, Search, FileText, X, 
  TrendingUp, Award, Layers, AlertCircle, BookOpen, ChevronRight, BarChart3, FileSpreadsheet,
  Database, Copy, Check, ExternalLink, Download, Code, Sparkles
} from 'lucide-react';

export interface ProjectGanttProps {
  projects: ProjectTask[];
  onAddProject?: (newProject: Omit<ProjectTask, 'id'>) => void;
  onUpdateProject?: (updatedProject: ProjectTask) => void;
  onDeleteProject?: (projectId: string) => void;
}

const NIST_FUNCTIONS_MAP: Record<NistFunctionCode, string> = {
  'GV': 'Gobernanza (GV)',
  'ID': 'Identificación (ID)',
  'PR': 'Protección (PR)',
  'DE': 'Detección (DE)',
  'RS': 'Respuesta (RS)',
  'RC': 'Recuperación (RC)'
};

export function ProjectGantt({ 
  projects, 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject 
}: ProjectGanttProps) {
  // View controls & Filters
  const [viewMode, setViewMode] = useState<'gantt' | 'argumentation' | 'owners'>('gantt');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwner, setFilterOwner] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterFunction, setFilterFunction] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectTask | null>(null);

  // Export Modal State (Excel / Power BI)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copiedMCodeToast, setCopiedMCodeToast] = useState(false);

  // Detail Drawer State for Argumentation View
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<ProjectTask | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNistCategoryId, setFormNistCategoryId] = useState('PR.AT');
  const [formIsoControlId, setFormIsoControlId] = useState('6.3');
  const [formFunctionCode, setFormFunctionCode] = useState<NistFunctionCode>('PR');
  const [formStartDate, setFormStartDate] = useState('2026-08-15');
  const [formEndDate, setFormEndDate] = useState('2026-10-15');
  const [formProgress, setFormProgress] = useState(0);
  const [formStatus, setFormStatus] = useState<ProjectStatus>('Not Started');
  const [formOwner, setFormOwner] = useState('TI / CISO');
  const [formRoleResponsible, setFormRoleResponsible] = useState('Líder de Ciberseguridad');
  const [formPriority, setFormPriority] = useState<'Crítica' | 'Alta' | 'Media' | 'Baja'>('Alta');
  const [formBaseBudget, setFormBaseBudget] = useState(15000);
  const [formResources, setFormResources] = useState('$15,000 USD | 2 FTEs');
  const [formMetrics, setFormMetrics] = useState('');
  const [formMappingJustification, setFormMappingJustification] = useState('');
  const [formMaturityProjection, setFormMaturityProjection] = useState('');
  const [formMilestones, setFormMilestones] = useState<Milestone[]>([]);
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('2026-09-01');

  // Filter options
  const owners = useMemo(() => ['All', ...Array.from(new Set(projects.map(p => p.owner)))], [projects]);
  const priorities = ['All', 'Crítica', 'Alta', 'Media', 'Baja'];
  const statuses = ['All', 'In Progress', 'Not Started', 'Completed', 'Delayed'];

  // Filtered projects list
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchOwner = filterOwner === 'All' || p.owner === filterOwner;
      const matchPriority = filterPriority === 'All' || p.priority === filterPriority;
      const matchFunction = filterFunction === 'All' || p.functionCode === filterFunction;
      const matchStatus = filterStatus === 'All' || p.status === filterStatus;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = q === '' || 
        p.name.toLowerCase().includes(q) ||
        p.nistCategoryId.toLowerCase().includes(q) ||
        (p.isoControlId && p.isoControlId.toLowerCase().includes(q)) ||
        p.owner.toLowerCase().includes(q) ||
        (p.roleResponsible && p.roleResponsible.toLowerCase().includes(q)) ||
        (p.mappingJustification && p.mappingJustification.toLowerCase().includes(q));

      return matchOwner && matchPriority && matchFunction && matchStatus && matchSearch;
    });
  }, [projects, filterOwner, filterPriority, filterFunction, filterStatus, searchQuery]);

  // Metrics summary
  const summaryMetrics = useMemo(() => {
    const totalCount = projects.length;
    const activeCount = projects.filter(p => p.status === 'In Progress').length;
    const totalBudget = projects.reduce((acc, p) => acc + (p.baseBudget || 0), 0);
    
    let totalMilestones = 0;
    let completedMilestones = 0;
    projects.forEach(p => {
      p.milestones?.forEach(m => {
        totalMilestones++;
        if (m.status === 'Completado') completedMilestones++;
      });
    });

    const avgProgress = totalCount > 0 ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalCount) : 0;

    return {
      totalCount,
      activeCount,
      totalBudget,
      completedMilestones,
      totalMilestones,
      avgProgress
    };
  }, [projects]);

  // Timeline boundaries (Default June 1 to Dec 31, 2026)
  const minDate = new Date('2026-06-01');
  const maxDate = new Date('2026-12-31');
  const totalDays = Math.max(differenceInDays(maxDate, minDate), 1);

  // Status color badge
  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed': return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30';
      case 'In Progress': return 'bg-[#c0a080]/20 text-[#c0a080] border-[#c0a080]/30';
      case 'Not Started': return 'bg-[#333] text-[#888] border-[#444]';
      case 'Delayed': return 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30';
      default: return 'bg-[#222] text-[#aaa] border-[#333]';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Crítica': return 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20';
      case 'Alta': return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20';
      case 'Media': return 'text-[#c0a080] bg-[#c0a080]/10 border-[#c0a080]/20';
      default: return 'text-[#888] bg-[#222] border-[#333]';
    }
  };

  // Open Modal for Create or Edit
  const handleOpenModal = (project?: ProjectTask) => {
    if (project) {
      setEditingProject(project);
      setFormName(project.name);
      setFormNistCategoryId(project.nistCategoryId);
      setFormIsoControlId(project.isoControlId || '5.1');
      setFormFunctionCode(project.functionCode || 'PR');
      setFormStartDate(project.startDate);
      setFormEndDate(project.endDate);
      setFormProgress(project.progress);
      setFormStatus(project.status);
      setFormOwner(project.owner);
      setFormRoleResponsible(project.roleResponsible || 'CISO / Líder de Proyecto');
      setFormPriority(project.priority);
      setFormBaseBudget(project.baseBudget || 10000);
      setFormResources(project.resources || `$${project.baseBudget} USD | 2 FTEs`);
      setFormMetrics(project.metrics || '');
      setFormMappingJustification(project.mappingJustification || '');
      setFormMaturityProjection(project.maturityProjection || '');
      setFormMilestones(project.milestones ? [...project.milestones] : []);
    } else {
      setEditingProject(null);
      setFormName('');
      setFormNistCategoryId('PR.AA');
      setFormIsoControlId('5.15');
      setFormFunctionCode('PR');
      setFormStartDate('2026-09-01');
      setFormEndDate('2026-11-30');
      setFormProgress(0);
      setFormStatus('Not Started');
      setFormOwner('CISO / TI');
      setFormRoleResponsible('Líder de Ciberseguridad');
      setFormPriority('Alta');
      setFormBaseBudget(25000);
      setFormResources('$25,000 USD | 2 FTEs');
      setFormMetrics('Cumplimiento del 100% en controles seleccionados');
      setFormMappingJustification('Alineación directa con los controles ISO 27001 y las subcategorías de NIST CSF 2.0 para mitigar brechas de acceso y gobernanza.');
      setFormMaturityProjection('+1.5 Puntos de Madurez Proyectados');
      setFormMilestones([
        { name: 'Fase de Evaluación e Inventario', date: '2026-09-15', status: 'Pendiente' },
        { name: 'Implementación Operativa', date: '2026-10-30', status: 'Pendiente' },
        { name: 'Auditoría de Validación', date: '2026-11-20', status: 'Pendiente' }
      ]);
    }
    setIsModalOpen(true);
  };

  // Add milestone to form
  const handleAddMilestone = () => {
    if (!newMilestoneName.trim()) return;
    setFormMilestones(prev => [
      ...prev,
      { name: newMilestoneName.trim(), date: newMilestoneDate, status: 'Pendiente' }
    ]);
    setNewMilestoneName('');
  };

  const handleToggleMilestone = (index: number) => {
    setFormMilestones(prev => prev.map((m, i) => {
      if (i === index) {
        return { ...m, status: m.status === 'Completado' ? 'Pendiente' : 'Completado' };
      }
      return m;
    }));
  };

  const handleDeleteMilestone = (index: number) => {
    setFormMilestones(prev => prev.filter((_, i) => i !== index));
  };

  // Save Modal
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const projectData = {
      name: formName.trim(),
      nistCategoryId: formNistCategoryId.trim(),
      isoControlId: formIsoControlId.trim(),
      functionCode: formFunctionCode,
      startDate: formStartDate,
      endDate: formEndDate,
      progress: Number(formProgress),
      status: formStatus,
      owner: formOwner.trim(),
      roleResponsible: formRoleResponsible.trim(),
      priority: formPriority,
      baseBudget: Number(formBaseBudget),
      resources: formResources.trim(),
      metrics: formMetrics.trim(),
      mappingJustification: formMappingJustification.trim(),
      maturityProjection: formMaturityProjection.trim(),
      milestones: formMilestones
    };

    if (editingProject && onUpdateProject) {
      onUpdateProject({
        ...projectData,
        id: editingProject.id
      });
    } else if (onAddProject) {
      onAddProject(projectData);
    }

    setIsModalOpen(false);
  };

  // Delete project
  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Está seguro de eliminar la iniciativa "${name}" del cronograma?`)) {
      if (onDeleteProject) {
        onDeleteProject(id);
      }
      if (selectedProjectForDetail?.id === id) {
        setSelectedProjectForDetail(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Page Title & Main Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-[#c0a080]" />
            <h2 className="text-2xl font-serif text-[#c0a080] italic">Cronograma de Proyectos & Plan de Remediación</h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] mt-1">
            Gestión de iniciativas, proyección temporizada, asignación de responsables y argumentación sólida ISO/NIST
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View selector tabs */}
          <div className="flex items-center bg-[#0f0f0f] border border-[#222] p-1 rounded-sm">
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors rounded-sm flex items-center gap-1.5 ${
                viewMode === 'gantt' ? 'bg-[#c0a080] text-black font-bold' : 'text-[#888] hover:text-[#e0e0e0]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Gantt Interactivo</span>
            </button>
            <button
              onClick={() => setViewMode('argumentation')}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors rounded-sm flex items-center gap-1.5 ${
                viewMode === 'argumentation' ? 'bg-[#c0a080] text-black font-bold' : 'text-[#888] hover:text-[#e0e0e0]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Argumentación & Mapeo</span>
            </button>
            <button
              onClick={() => setViewMode('owners')}
              className={`px-3 py-1.5 text-xs font-mono uppercase transition-colors rounded-sm flex items-center gap-1.5 ${
                viewMode === 'owners' ? 'bg-[#c0a080] text-black font-bold' : 'text-[#888] hover:text-[#e0e0e0]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Responsables & Equipos</span>
            </button>
          </div>

          {/* Export Excel / Power BI Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center space-x-2 bg-[#1a1a1a] border border-[#c0a080]/40 text-[#c0a080] px-3.5 py-2 rounded-sm text-xs uppercase tracking-wider font-mono font-bold hover:bg-[#222] hover:border-[#c0a080] transition-all shadow-sm group"
            title="Exportar el Gantt a Microsoft Excel o conectar con Power BI Desktop"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#c0a080] group-hover:scale-110 transition-transform" />
            <span>Exportar Excel / Power BI</span>
          </button>

          {/* Add project button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-[#c0a080] text-[#050505] px-4 py-2 rounded-sm text-xs uppercase tracking-wider font-bold hover:bg-[#b09070] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Iniciativa</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex items-center space-x-3">
          <div className="p-2.5 bg-[#1a1a1a] text-[#c0a080] border border-[#222] rounded-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#666] tracking-widest">Iniciativas Totales</p>
            <p className="text-xl font-serif text-[#e0e0e0] font-medium mt-0.5">{summaryMetrics.totalCount}</p>
            <p className="text-[10px] text-[#888]">{summaryMetrics.activeCount} En Ejecución</p>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex items-center space-x-3">
          <div className="p-2.5 bg-[#1a1a1a] text-[#10b981] border border-[#222] rounded-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#666] tracking-widest">Avance Promedio</p>
            <p className="text-xl font-serif text-[#10b981] font-medium mt-0.5">{summaryMetrics.avgProgress}%</p>
            <p className="text-[10px] text-[#888]">{summaryMetrics.completedMilestones} de {summaryMetrics.totalMilestones} Hitos Cumplidos</p>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex items-center space-x-3">
          <div className="p-2.5 bg-[#1a1a1a] text-[#38bdf8] border border-[#222] rounded-sm">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#666] tracking-widest">Presupuesto Estimado</p>
            <p className="text-xl font-serif text-[#38bdf8] font-medium mt-0.5">${summaryMetrics.totalBudget.toLocaleString()} USD</p>
            <p className="text-[10px] text-[#888]">Asignación Total</p>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex items-center space-x-3">
          <div className="p-2.5 bg-[#1a1a1a] text-[#f59e0b] border border-[#222] rounded-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#666] tracking-widest">Alineación Normativa</p>
            <p className="text-xl font-serif text-[#f59e0b] font-medium mt-0.5">ISO 27001 + NIST 2.0</p>
            <p className="text-[10px] text-[#888]">Sólida Fundamentación</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0f0f0f] border border-[#222] p-3 rounded-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="BUSCAR POR NOMBRE, RESPONSABLE, ISO O NIST..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#141414] border border-[#222] text-[#e0e0e0] text-xs font-mono uppercase rounded-sm focus:outline-none focus:border-[#c0a080] placeholder-[#555]"
          />
          <Search className="w-4 h-4 text-[#555] absolute left-3 top-2" />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#141414] border border-[#222] px-2.5 py-1 rounded-sm">
            <Filter className="w-3.5 h-3.5 text-[#888]" />
            <span className="text-[10px] uppercase text-[#666] font-mono">Filtros:</span>
          </div>

          <select
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            className="bg-[#141414] border border-[#222] text-xs text-[#ccc] px-2.5 py-1 focus:outline-none focus:border-[#c0a080] rounded-sm font-mono"
          >
            {owners.map(o => <option key={o} value={o}>{o === 'All' ? 'Área: Todas' : o}</option>)}
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#141414] border border-[#222] text-xs text-[#ccc] px-2.5 py-1 focus:outline-none focus:border-[#c0a080] rounded-sm font-mono"
          >
            {priorities.map(p => <option key={p} value={p}>{p === 'All' ? 'Prioridad: Todas' : `Prioridad: ${p}`}</option>)}
          </select>

          <select
            value={filterFunction}
            onChange={(e) => setFilterFunction(e.target.value)}
            className="bg-[#141414] border border-[#222] text-xs text-[#ccc] px-2.5 py-1 focus:outline-none focus:border-[#c0a080] rounded-sm font-mono"
          >
            <option value="All">NIST Función: Todas</option>
            {Object.entries(NIST_FUNCTIONS_MAP).map(([code, label]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#141414] border border-[#222] text-xs text-[#ccc] px-2.5 py-1 focus:outline-none focus:border-[#c0a080] rounded-sm font-mono"
          >
            {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'Estado: Todos' : s}</option>)}
          </select>
        </div>
      </div>

      {/* VIEW 1: GANTT INTERACTIVO */}
      {viewMode === 'gantt' && (
        <div className="bg-[#0f0f0f] border border-[#222] p-6 rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#222] pb-4">
            <div>
              <h3 className="font-serif text-lg text-[#e0e0e0]">Proyección Temporizada de Proyectos (Gantt 2026)</h3>
              <p className="text-xs text-[#888]">Haga clic en cualquier barra o botón de edición para modificar plazos, responsables o hitos</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-[10px] font-mono text-[#888]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#10b981] rounded-xs"></span> Completado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#c0a080] rounded-xs"></span> En Progreso
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#444] rounded-xs"></span> No Iniciado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#ef4444] rounded-xs"></span> Retrasado
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[850px]">
              {/* Timeline Month Header */}
              <div className="flex border-b border-[#222] pb-2 text-[10px] font-mono uppercase text-[#666] tracking-widest pl-[320px]">
                <div className="w-[14%] text-center">Jun 2026</div>
                <div className="w-[14%] text-center">Jul 2026</div>
                <div className="w-[14%] text-center border-x border-[#222]/50 bg-[#141414] text-[#c0a080]">Ago 2026 (Actual)</div>
                <div className="w-[14%] text-center">Sep 2026</div>
                <div className="w-[14%] text-center">Oct 2026</div>
                <div className="w-[14%] text-center">Nov 2026</div>
                <div className="w-[16%] text-center">Dic 2026</div>
              </div>

              {/* Projects List */}
              <div className="space-y-4 mt-4">
                {filteredProjects.length === 0 ? (
                  <div className="text-center text-[#666] text-xs font-mono py-12">
                    No se encontraron iniciativas de proyectos que coincidan con los filtros.
                  </div>
                ) : (
                  filteredProjects.map(project => {
                    let start = parseISO(project.startDate);
                    let end = parseISO(project.endDate);

                    if (!isValid(start)) start = minDate;
                    if (!isValid(end)) end = maxDate;

                    const offsetDays = Math.max(differenceInDays(start, minDate), 0);
                    const durationDays = Math.max(differenceInDays(end, start), 7); // minimum 7 days visibility

                    const leftPercent = Math.min((offsetDays / totalDays) * 100, 95);
                    const widthPercent = Math.min((durationDays / totalDays) * 100, 100 - leftPercent);

                    return (
                      <div key={project.id} className="group relative flex items-center h-16 hover:bg-[#121212] p-2 rounded-sm transition-colors border border-transparent hover:border-[#222]">
                        {/* Left Info Column */}
                        <div className="w-[310px] shrink-0 pr-4 flex flex-col justify-center">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#e0e0e0] truncate max-w-[190px]" title={project.name}>
                              {project.name}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs border ${getPriorityBadge(project.priority)}`}>
                              {project.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-1 text-[10px]">
                            <div className="flex items-center gap-1.5 font-mono text-[#888]">
                              <span className="text-[#c0a080] font-bold">{project.nistCategoryId}</span>
                              {project.isoControlId && (
                                <span className="text-[#38bdf8]">| ISO {project.isoControlId}</span>
                              )}
                            </div>
                            <span className="text-[#666] truncate max-w-[100px]" title={project.roleResponsible || project.owner}>
                              {project.owner}
                            </span>
                          </div>
                        </div>

                        {/* Right Gantt Bar Column */}
                        <div className="flex-1 relative h-8 bg-[#141414] rounded-sm overflow-hidden border border-[#222]">
                          {/* Grid background lines */}
                          <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                              <div key={i} className="border-r border-[#444] h-full w-full"></div>
                            ))}
                          </div>

                          {/* Gantt Bar */}
                          <div
                            onClick={() => setSelectedProjectForDetail(project)}
                            className={`absolute top-1 bottom-1 rounded-sm flex items-center px-2 cursor-pointer transition-all shadow-md group-hover:brightness-110 border ${getStatusBadge(project.status)}`}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${Math.max(widthPercent, 4)}%`
                            }}
                            title={`${project.name} (${project.startDate} a ${project.endDate}) - ${project.progress}% Completado`}
                          >
                            {/* Inner Progress Fill */}
                            <div
                              className="absolute top-0 left-0 bottom-0 bg-[#fff]/15 rounded-xs"
                              style={{ width: `${project.progress}%` }}
                            ></div>

                            <span className="relative z-10 text-[10px] font-mono font-bold truncate">
                              {project.progress}% • {format(start, 'dd MMM', { locale: es })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="ml-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedProjectForDetail(project)}
                            title="Ver Argumentación Técnica y Detalle"
                            className="p-1.5 text-[#888] hover:text-[#c0a080] hover:bg-[#1a1a1a] rounded-sm"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenModal(project)}
                            title="Editar Proyecto"
                            className="p-1.5 text-[#888] hover:text-[#38bdf8] hover:bg-[#1a1a1a] rounded-sm"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, project.name)}
                            title="Eliminar Proyecto"
                            className="p-1.5 text-[#888] hover:text-[#ef4444] hover:bg-[#1a1a1a] rounded-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MATRIZ DE ARGUMENTACIÓN & MAPEO NORMATIVO */}
      {viewMode === 'argumentation' && (
        <div className="space-y-6">
          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex justify-between items-center">
            <div>
              <h3 className="font-serif text-lg text-[#e0e0e0]">Sólida Argumentación Normativa y Justificación Técnica</h3>
              <p className="text-xs text-[#888]">Justificación detallada del mapeo entre ISO/IEC 27001:2022 y NIST CSF 2.0 por cada iniciativa de remediación</p>
            </div>
            <span className="text-xs font-mono text-[#c0a080] bg-[#1a1a1a] px-3 py-1 border border-[#222] rounded-sm">
              {filteredProjects.length} Iniciativas Evaluadas
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-[#0f0f0f] border border-[#222] rounded-sm p-6 space-y-4 hover:border-[#333] transition-colors">
                <div className="flex justify-between items-start gap-2 border-b border-[#222] pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-[#c0a080]/10 border border-[#c0a080]/30 text-[#c0a080] text-[10px] font-mono font-bold rounded-sm">
                        {project.nistCategoryId}
                      </span>
                      {project.isoControlId && (
                        <span className="px-2 py-0.5 bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-[10px] font-mono font-bold rounded-sm">
                          ISO {project.isoControlId}
                        </span>
                      )}
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm border ${getPriorityBadge(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <h4 className="font-serif text-base text-[#e0e0e0] font-medium">{project.name}</h4>
                  </div>

                  <button
                    onClick={() => handleOpenModal(project)}
                    className="p-1.5 text-[#888] hover:text-[#c0a080] hover:bg-[#1a1a1a] rounded-sm shrink-0"
                    title="Editar proyecto"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Argumentación técnica */}
                <div className="bg-[#141414] border border-[#222] p-4 rounded-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#c0a080] font-mono uppercase font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Fundamentación y Argumentación Normativa</span>
                  </div>
                  <p className="text-xs text-[#ccc] leading-relaxed font-sans italic">
                    "{project.mappingJustification || 'Iniciativa diseñada para cerrar la brecha de cumplimiento entre los controles de seguridad y los requerimientos del marco NIST CSF 2.0.'}"
                  </p>
                </div>

                {/* Proyección de Madurez & Impacto */}
                {project.maturityProjection && (
                  <div className="flex items-center gap-2 text-xs text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 p-2.5 rounded-sm font-mono">
                    <TrendingUp className="w-4 h-4 shrink-0" />
                    <span><strong>Impacto Proyectado:</strong> {project.maturityProjection}</span>
                  </div>
                )}

                {/* Grid info */}
                <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#222] pt-3">
                  <div>
                    <span className="text-[10px] uppercase text-[#666] block font-mono">Responsables</span>
                    <p className="text-[#e0e0e0] font-medium mt-0.5">{project.owner}</p>
                    <p className="text-[10px] text-[#888]">{project.roleResponsible || 'Asignado a CISO'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-[#666] block font-mono">Cronograma & Estado</span>
                    <p className="text-[#e0e0e0] font-medium mt-0.5">{project.startDate} a {project.endDate}</p>
                    <p className="text-[10px] text-[#c0a080] font-mono">{project.status} ({project.progress}%)</p>
                  </div>
                </div>

                {/* Milestones count */}
                <div className="flex justify-between items-center text-xs font-mono text-[#888] pt-2 border-t border-[#1f1f1f]">
                  <span>Hitos Registrados: {project.milestones?.length || 0}</span>
                  <span>Presupuesto: ${project.baseBudget?.toLocaleString()} USD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: RESPONSABLES & EQUIPOS */}
      {viewMode === 'owners' && (
        <div className="space-y-6">
          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm">
            <h3 className="font-serif text-lg text-[#e0e0e0]">Asignación de Responsabilidades por Área y Rol</h3>
            <p className="text-xs text-[#888]">Carga de trabajo, iniciativas asignadas y distribución de responsabilidades por departamento</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {owners.filter(o => o !== 'All').map(ownerName => {
              const ownerProjects = projects.filter(p => p.owner === ownerName);
              const ownerBudget = ownerProjects.reduce((acc, p) => acc + (p.baseBudget || 0), 0);
              const ownerAvgProgress = ownerProjects.length > 0
                ? Math.round(ownerProjects.reduce((acc, p) => acc + p.progress, 0) / ownerProjects.length)
                : 0;

              return (
                <div key={ownerName} className="bg-[#0f0f0f] border border-[#222] rounded-sm p-5 space-y-4">
                  <div className="flex justify-between items-start border-b border-[#222] pb-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-[#c0a080]" />
                      <h4 className="font-serif text-base text-[#e0e0e0] font-medium">{ownerName}</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-[#1a1a1a] text-[#c0a080] border border-[#222] px-2 py-0.5 rounded-sm">
                      {ownerProjects.length} Proyectos
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#888]">
                      <span>Avance Promedio:</span>
                      <span className="text-[#10b981] font-bold">{ownerAvgProgress}%</span>
                    </div>
                    <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#10b981] h-full transition-all duration-300" style={{ width: `${ownerAvgProgress}%` }}></div>
                    </div>

                    <div className="flex justify-between text-[#888] pt-2">
                      <span>Presupuesto Administrado:</span>
                      <span className="text-[#38bdf8] font-bold">${ownerBudget.toLocaleString()} USD</span>
                    </div>
                  </div>

                  <div className="border-t border-[#222] pt-3 space-y-2">
                    <span className="text-[10px] uppercase text-[#666] font-mono block">Iniciativas Asignadas:</span>
                    {ownerProjects.map(p => (
                      <div key={p.id} className="bg-[#141414] border border-[#222] p-2.5 rounded-sm space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#e0e0e0] font-medium truncate max-w-[180px]">{p.name}</span>
                          <span className="text-[#c0a080] font-mono text-[10px]">{p.progress}%</span>
                        </div>
                        <p className="text-[10px] text-[#888]">{p.roleResponsible || 'Líder de Proyecto'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAIL MODAL / DRAWER FOR A SELECTED PROJECT */}
      {selectedProjectForDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex justify-end animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border-l border-[#222] w-full max-w-2xl h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-[#222] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#c0a080]/10 border border-[#c0a080]/30 text-[#c0a080] text-xs font-mono font-bold rounded-sm">
                    {selectedProjectForDetail.nistCategoryId}
                  </span>
                  {selectedProjectForDetail.isoControlId && (
                    <span className="px-2 py-0.5 bg-[#38bdf8]/10 border border-[#38bdf8]/30 text-[#38bdf8] text-xs font-mono font-bold rounded-sm">
                      ISO {selectedProjectForDetail.isoControlId}
                    </span>
                  )}
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-sm border ${getPriorityBadge(selectedProjectForDetail.priority)}`}>
                    Prioridad {selectedProjectForDetail.priority}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#e0e0e0]">{selectedProjectForDetail.name}</h3>
              </div>

              <button
                onClick={() => setSelectedProjectForDetail(null)}
                className="p-2 text-[#888] hover:text-[#e0e0e0] hover:bg-[#1a1a1a] rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Regulatory Argumentation Section */}
            <div className="bg-[#141414] border border-[#222] p-5 rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#c0a080] font-mono font-bold uppercase">
                <BookOpen className="w-4 h-4" />
                <span>Argumentación Normativa & Justificación de Mapeo</span>
              </div>
              <p className="text-xs text-[#ccc] leading-relaxed font-sans">
                {selectedProjectForDetail.mappingJustification || 'Sólida alineación con los estándares internacionales ISO/IEC 27001:2022 y NIST CSF 2.0.'}
              </p>
            </div>

            {/* Impact Projection */}
            {selectedProjectForDetail.maturityProjection && (
              <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/20 rounded-sm flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#10b981] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#10b981] block">Proyección de Madurez</span>
                  <p className="text-xs font-mono font-bold text-[#e0e0e0]">{selectedProjectForDetail.maturityProjection}</p>
                </div>
              </div>
            )}

            {/* Key Information */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-[#141414] border border-[#222] p-4 rounded-sm">
              <div>
                <span className="text-[#666] block uppercase text-[10px]">Departamento / Área:</span>
                <span className="text-[#e0e0e0] font-bold mt-0.5 block">{selectedProjectForDetail.owner}</span>
              </div>
              <div>
                <span className="text-[#666] block uppercase text-[10px]">Responsable Directo:</span>
                <span className="text-[#e0e0e0] font-bold mt-0.5 block">{selectedProjectForDetail.roleResponsible || 'CISO'}</span>
              </div>
              <div>
                <span className="text-[#666] block uppercase text-[10px]">Período de Ejecución:</span>
                <span className="text-[#e0e0e0] mt-0.5 block">{selectedProjectForDetail.startDate} a {selectedProjectForDetail.endDate}</span>
              </div>
              <div>
                <span className="text-[#666] block uppercase text-[10px]">Presupuesto Asignado:</span>
                <span className="text-[#38bdf8] font-bold mt-0.5 block">${selectedProjectForDetail.baseBudget?.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#888]">Métricas de Éxito & KPIs:</span>
              <div className="p-3 bg-[#141414] border border-[#222] rounded-sm text-xs text-[#ccc] italic">
                "{selectedProjectForDetail.metrics || 'Evaluación periódica de efectividad operativa.'}"
              </div>
            </div>

            {/* Milestones timeline */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-[#888]">Hitos y Cronograma Operativo ({selectedProjectForDetail.milestones?.length || 0}):</span>
              </div>

              <div className="space-y-2">
                {selectedProjectForDetail.milestones?.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#141414] border border-[#222] rounded-sm text-xs">
                    <div className="flex items-center gap-2">
                      {m.status === 'Completado' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#666]" />
                      )}
                      <span className={m.status === 'Completado' ? 'text-[#10b981] line-through' : 'text-[#e0e0e0]'}>
                        {m.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#888]">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#222]">
              <button
                onClick={() => {
                  const proj = selectedProjectForDetail;
                  setSelectedProjectForDetail(null);
                  handleOpenModal(proj);
                }}
                className="px-4 py-2 bg-[#38bdf8] text-black font-bold font-mono text-xs uppercase rounded-sm hover:bg-[#0284c7] transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar Iniciativa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#0f0f0f] border border-[#222] rounded-sm max-w-3xl w-full my-8 p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#222] pb-4">
              <div>
                <h3 className="font-serif text-xl text-[#c0a080]">
                  {editingProject ? 'Editar Iniciativa en Cronograma' : 'Registrar Nueva Iniciativa de Remediación'}
                </h3>
                <p className="text-[10px] uppercase font-mono text-[#888] mt-0.5">
                  Proyección temporizada, asignación de responsables y argumentación sólida ISO/NIST
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#888] hover:text-[#e0e0e0] hover:bg-[#1a1a1a] rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              {/* General Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-[#c0a080] border-b border-[#1f1f1f] pb-1 font-bold">
                  1. Información General del Proyecto
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Nombre de la Iniciativa *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Despliegue de Control de Acceso Privilegiado (PAM)"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Categoría NIST CSF 2.0 *</label>
                    <input
                      type="text"
                      required
                      value={formNistCategoryId}
                      onChange={(e) => setFormNistCategoryId(e.target.value)}
                      placeholder="e.g. PR.AA, DE.CM, GV.SC"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Control Mapeado ISO 27001:2022</label>
                    <input
                      type="text"
                      value={formIsoControlId}
                      onChange={(e) => setFormIsoControlId(e.target.value)}
                      placeholder="e.g. 5.15 / 8.5"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Función NIST CSF 2.0</label>
                    <select
                      value={formFunctionCode}
                      onChange={(e) => setFormFunctionCode(e.target.value as NistFunctionCode)}
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    >
                      {Object.entries(NIST_FUNCTIONS_MAP).map(([code, label]) => (
                        <option key={code} value={code}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Prioridad</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as any)}
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    >
                      <option value="Crítica">Crítica</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Argumentación sólida */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-[#c0a080] border-b border-[#1f1f1f] pb-1 font-bold">
                  2. Sólida Argumentación Normativa y Proyección de Madurez
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">
                      Justificación Técnica y Fundamentación de Mapeo (NIST + ISO) *
                    </label>
                    <textarea
                      rows={3}
                      value={formMappingJustification}
                      onChange={(e) => setFormMappingJustification(e.target.value)}
                      placeholder="Explique detalladamente por qué esta iniciativa se mapea a ISO 27001 y NIST CSF 2.0, el riesgo que mitiga y su impacto operativo..."
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-sans"
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">
                      Proyección de Incremento en Nivel de Madurez
                    </label>
                    <input
                      type="text"
                      value={formMaturityProjection}
                      onChange={(e) => setFormMaturityProjection(e.target.value)}
                      placeholder="e.g. +1.8 puntos de madurez proyectados en la Función Protect (PR)"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Responsables y Fechas */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-[#c0a080] border-b border-[#1f1f1f] pb-1 font-bold">
                  3. Asignación de Responsables y Proyección Temporizada
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Departamento / Área Responsable</label>
                    <input
                      type="text"
                      value={formOwner}
                      onChange={(e) => setFormOwner(e.target.value)}
                      placeholder="e.g. TI / CISO, SOC, Riesgos, Compras"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Rol / Líder Responsable Directo</label>
                    <input
                      type="text"
                      value={formRoleResponsible}
                      onChange={(e) => setFormRoleResponsible(e.target.value)}
                      placeholder="e.g. CISO / Oficial de Seguridad Operativa"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Fecha de Inicio</label>
                    <input
                      type="date"
                      value={formStartDate}
                      onChange={(e) => setFormStartDate(e.target.value)}
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Fecha de Término (Proyección)</label>
                    <input
                      type="date"
                      value={formEndDate}
                      onChange={(e) => setFormEndDate(e.target.value)}
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Estado Actual</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    >
                      <option value="Not Started">No Iniciado</option>
                      <option value="In Progress">En Progreso</option>
                      <option value="Completed">Completado</option>
                      <option value="Delayed">Retrasado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-mono text-[#888]">Porcentaje de Avance</label>
                      <span className="text-xs font-mono font-bold text-[#c0a080]">{formProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={formProgress}
                      onChange={(e) => setFormProgress(Number(e.target.value))}
                      className="w-full accent-[#c0a080] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Presupuesto ($ USD)</label>
                    <input
                      type="number"
                      value={formBaseBudget}
                      onChange={(e) => setFormBaseBudget(Number(e.target.value))}
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-[#888]">Métricas de Éxito / KPIs</label>
                    <input
                      type="text"
                      value={formMetrics}
                      onChange={(e) => setFormMetrics(e.target.value)}
                      placeholder="e.g. Cobertura > 95% de sistemas críticos"
                      className="w-full bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080]"
                    />
                  </div>
                </div>
              </div>

              {/* Milestones Editor */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase text-[#c0a080] border-b border-[#1f1f1f] pb-1 font-bold">
                  4. Hitos Operativos y Puntos de Control
                </h4>

                <div className="space-y-2">
                  {formMilestones.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-[#141414] border border-[#222] rounded-sm text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleMilestone(idx)}
                          className="text-[#888] hover:text-[#10b981]"
                        >
                          {m.status === 'Completado' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                          ) : (
                            <Circle className="w-4 h-4 text-[#666]" />
                          )}
                        </button>
                        <span className={m.status === 'Completado' ? 'line-through text-[#10b981]' : 'text-[#e0e0e0]'}>
                          {m.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-[10px]">
                        <span className="text-[#888]">{m.date}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteMilestone(idx)}
                          className="text-[#888] hover:text-[#ef4444]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add new milestone inline */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newMilestoneName}
                      onChange={(e) => setNewMilestoneName(e.target.value)}
                      placeholder="Nuevo hito operativo..."
                      className="flex-1 bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080]"
                    />
                    <input
                      type="date"
                      value={newMilestoneDate}
                      onChange={(e) => setNewMilestoneDate(e.target.value)}
                      className="bg-[#141414] border border-[#222] text-xs text-[#e0e0e0] p-2 rounded-sm focus:outline-none focus:border-[#c0a080] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="px-3 py-2 bg-[#1a1a1a] border border-[#333] text-[#c0a080] text-xs font-mono font-bold rounded-sm hover:bg-[#222]"
                    >
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#333] text-[#888] text-xs font-mono uppercase rounded-sm hover:text-[#e0e0e0]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c0a080] text-black font-bold font-mono text-xs uppercase rounded-sm hover:bg-[#b09070] transition-colors"
                >
                  {editingProject ? 'Guardar Cambios' : 'Registrar Iniciativa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT TO EXCEL / POWER BI MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f0f0f] border border-[#222] rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#222] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#1a1a1a] border border-[#333] text-[#c0a080] rounded-sm">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif text-xl text-[#e0e0e0] italic">Exportar Cronograma GANTT</h2>
                  <p className="text-[10px] font-mono text-[#888] uppercase tracking-wider mt-0.5">
                    Integración con Microsoft Excel & Power BI Desktop / Web
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="text-[#888] hover:text-[#e0e0e0] p-1 rounded-sm hover:bg-[#1f1f1f] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Export Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Excel Gantt */}
              <div className="bg-[#141414] border border-[#222] hover:border-[#c0a080]/50 p-4 rounded-sm flex flex-col justify-between space-y-3 transition-colors group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#c0a080] bg-[#1f1f1f] px-2 py-0.5 border border-[#333] rounded-xs">
                      Excel Friendly
                    </span>
                    <FileSpreadsheet className="w-4 h-4 text-[#888] group-hover:text-[#c0a080] transition-colors" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-[#e0e0e0]">Microsoft Excel (.CSV)</h3>
                  <p className="text-[11px] text-[#aaa] leading-relaxed">
                    Plantilla Gantt estructurada con cálculo automático de duración en días, presupuesto en número flotante USD, porcentaje de avance e hitos.
                  </p>
                </div>
                <button
                  onClick={() => {
                    exportGanttToExcel(filteredProjects);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 bg-[#1a1a1a] border border-[#333] text-[#c0a080] hover:bg-[#c0a080] hover:text-black font-mono text-xs font-bold py-2 px-3 rounded-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar CSV Excel</span>
                </button>
              </div>

              {/* Option 2: Power BI Star Schema */}
              <div className="bg-[#141414] border border-[#222] hover:border-[#f59e0b]/50 p-4 rounded-sm flex flex-col justify-between space-y-3 transition-colors group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#f59e0b] bg-[#1f1f1f] px-2 py-0.5 border border-[#333] rounded-xs">
                      DAX Ready
                    </span>
                    <Database className="w-4 h-4 text-[#888] group-hover:text-[#f59e0b] transition-colors" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-[#e0e0e0]">Dataset Power BI (.CSV)</h3>
                  <p className="text-[11px] text-[#aaa] leading-relaxed">
                    Esquema estelar (Star-Schema) optimizado con nombres de columna unificados, fechas ISO-8601 y medidas de riesgo SLA para Power BI.
                  </p>
                </div>
                <button
                  onClick={() => {
                    exportGanttToPowerBI(filteredProjects);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 bg-[#1a1a1a] border border-[#333] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black font-mono text-xs font-bold py-2 px-3 rounded-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Power BI Dataset</span>
                </button>
              </div>

              {/* Option 3: JSON Feed */}
              <div className="bg-[#141414] border border-[#222] hover:border-[#3b82f6]/50 p-4 rounded-sm flex flex-col justify-between space-y-3 transition-colors group">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#3b82f6] bg-[#1f1f1f] px-2 py-0.5 border border-[#333] rounded-xs">
                      REST API / Feed
                    </span>
                    <Code className="w-4 h-4 text-[#888] group-hover:text-[#3b82f6] transition-colors" />
                  </div>
                  <h3 className="font-sans font-bold text-sm text-[#e0e0e0]">Datafeed JSON</h3>
                  <p className="text-[11px] text-[#aaa] leading-relaxed">
                    Estructura JSON completa para conectores web de Power BI Service, automatizaciones con Power Automate o canalizaciones ETL.
                  </p>
                </div>
                <button
                  onClick={() => {
                    exportGanttToJSON(filteredProjects);
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 bg-[#1a1a1a] border border-[#333] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white font-mono text-xs font-bold py-2 px-3 rounded-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Feed JSON</span>
                </button>
              </div>
            </div>

            {/* Power Query M-Code Direct Snippet Box */}
            <div className="bg-[#141414] border border-[#222] p-4 rounded-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#c0a080]" />
                  <h3 className="font-mono text-xs font-bold uppercase text-[#e0e0e0]">
                    Consulta Power Query M (Editor Avanzado Power BI)
                  </h3>
                </div>
                <button
                  onClick={() => {
                    const code = generatePowerBIMCodeSnippet(filteredProjects);
                    navigator.clipboard.writeText(code);
                    setCopiedMCodeToast(true);
                    setTimeout(() => setCopiedMCodeToast(false), 3000);
                  }}
                  className="flex items-center space-x-1.5 bg-[#1f1f1f] border border-[#333] text-[#c0a080] hover:bg-[#2a2a2a] px-3 py-1.5 rounded-sm text-xs font-mono font-bold transition-colors"
                >
                  {copiedMCodeToast ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMCodeToast ? '¡Código M Copiado!' : 'Copiar Código M'}</span>
                </button>
              </div>

              <div className="bg-[#0a0a0a] border border-[#222] p-3 rounded-sm overflow-x-auto">
                <pre className="font-mono text-[10px] text-[#888] leading-relaxed whitespace-pre font-normal">
                  {generatePowerBIMCodeSnippet(filteredProjects)}
                </pre>
              </div>
            </div>

            {/* Step by step connection guide */}
            <div className="bg-[#141414] border border-[#222] p-4 rounded-sm space-y-2">
              <h4 className="font-mono text-xs font-bold uppercase text-[#c0a080] flex items-center gap-1.5">
                <span>Pasos para Conectar Power BI Desktop</span>
              </h4>
              <ol className="list-decimal list-inside text-xs text-[#bbb] space-y-1.5 font-sans leading-normal">
                <li>Haga clic en <strong>"Descargar Power BI Dataset"</strong> arriba para guardar el archivo CSV en su equipo.</li>
                <li>Abra <strong>Power BI Desktop</strong> y seleccione <code className="text-[#c0a080] bg-[#1f1f1f] px-1 py-0.5 rounded-xs font-mono text-[10px]">Obtener Datos &gt; Texto o CSV</code>.</li>
                <li>Seleccione el archivo descargado (<code className="text-[#c0a080] font-mono text-[10px]">PowerBI_Dataset_GANTT_Ciberseguridad.csv</code>).</li>
                <li>Haga clic en <strong>Cargar</strong> para construir sus reportes visuales o haga clic en <strong>Transformar datos</strong> para pegar el código M en el Editor Avanzado.</li>
              </ol>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-[#222]">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-5 py-2 bg-[#1a1a1a] border border-[#333] text-[#e0e0e0] font-mono text-xs uppercase rounded-sm hover:bg-[#222] transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
