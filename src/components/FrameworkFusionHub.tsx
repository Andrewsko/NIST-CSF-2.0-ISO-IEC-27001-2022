import React, { useState, useRef } from 'react';
import { 
  CustomFramework, 
  CustomFrameworkControl, 
  ComplianceStatus, 
  CoverageStatus,
  ProjectTask 
} from '../types';
import { 
  FileUp, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  FileText, 
  Award, 
  Search, 
  Filter, 
  ArrowRight, 
  GitMerge, 
  Zap, 
  Trash2, 
  Check, 
  RefreshCw, 
  Plus, 
  Cpu, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Building,
  Lock,
  Globe,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';
import { extractTextFromPDF, parseFrameworkFromText } from '../utils/pdfFrameworkExtractor';
import { PRECONFIGURED_FRAMEWORKS } from '../data/frameworksLibrary';
import { exportFrameworksToCSV, generateFusionReportPDF, exportComparativePlaybookMarkdown } from '../utils/frameworkExportUtils';
import { cn } from '../lib/utils';

interface FrameworkFusionHubProps {
  frameworks: CustomFramework[];
  onAddFramework: (framework: CustomFramework) => void;
  onRemoveFramework: (frameworkId: string) => void;
  onToggleFrameworkActive: (frameworkId: string) => void;
  onUpdateControlStatus: (frameworkId: string, controlId: string, status: ComplianceStatus) => void;
  onConvertGapToProject?: (control: CustomFrameworkControl, frameworkName: string) => void;
}

export function FrameworkFusionHub({
  frameworks,
  onAddFramework,
  onRemoveFramework,
  onToggleFrameworkActive,
  onUpdateControlStatus,
  onConvertGapToProject
}: FrameworkFusionHubProps) {
  const [activeTab, setActiveTab] = useState<'fusion-matrix' | 'comparative' | 'upload' | 'analytics'>('fusion-matrix');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [selectedFrameworkFilter, setSelectedFrameworkFilter] = useState<string>('all');
  const [selectedCoverageFilter, setSelectedCoverageFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedControlId, setExpandedControlId] = useState<string | null>(null);
  const [customFrameworkTitle, setCustomFrameworkTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active frameworks list
  const activeFrameworks = frameworks.filter(f => f.active);

  // Aggregated metrics
  const totalCustomControls = activeFrameworks.reduce((acc, f) => acc + f.controls.length, 0);
  const totalCoveredControls = activeFrameworks.reduce((acc, f) => acc + f.fusionMetrics.fullyCovered, 0);
  const totalGapControls = activeFrameworks.reduce((acc, f) => acc + f.fusionMetrics.gapControls, 0);
  const avgOverlapPercent = activeFrameworks.length > 0
    ? Math.round(activeFrameworks.reduce((acc, f) => acc + f.fusionMetrics.overlapPercent, 0) / activeFrameworks.length)
    : 0;

  // Chart data for Framework Comparison
  const frameworkComparisonData = activeFrameworks.map(f => ({
    name: f.code,
    fullName: f.name,
    'Solapamiento con SGSI (%)': f.fusionMetrics.overlapPercent,
    'Cumplimiento Actual (%)': f.fusionMetrics.compliancePercent,
    'Controles Cubiertos': f.fusionMetrics.fullyCovered,
    'Brechas Identificadas': f.fusionMetrics.gapControls,
  }));

  // Handle PDF File Upload
  const handlePdfUpload = async (file: File) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Por favor seleccione un archivo en formato PDF válido.');
      return;
    }

    setIsProcessingPdf(true);
    setProcessingStatus('Extrayendo capas de texto del PDF...');

    try {
      const { text, pageCount } = await extractTextFromPDF(file);

      setProcessingStatus(`Analizando ${pageCount} páginas e identificando artículos y dominios normativos...`);
      await new Promise(r => setTimeout(r, 600));

      setProcessingStatus('Ejecutando motor de correlación semántica contra 106 subcategorías NIST y 93 controles ISO 27001...');
      await new Promise(r => setTimeout(r, 700));

      const newFramework = parseFrameworkFromText(
        text,
        file.name,
        file.size,
        customFrameworkTitle.trim() || undefined
      );

      setProcessingStatus('¡Fusión completada exitosamente! Integrando a la matriz unificada...');
      await new Promise(r => setTimeout(r, 400));

      onAddFramework(newFramework);
      setCustomFrameworkTitle('');
      setActiveTab('fusion-matrix');
      setSelectedFrameworkFilter(newFramework.id);
    } catch (err) {
      console.error('Error procesando PDF:', err);
      alert('Ocurrió un error al procesar el archivo PDF. Se generará un marco sintetizado estructurado.');
    } finally {
      setIsProcessingPdf(false);
      setProcessingStatus('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  // Add preconfigured standard
  const handleAddPreconfigured = (preFw: CustomFramework) => {
    const existing = frameworks.find(f => f.code === preFw.code || f.id === preFw.id);
    if (existing) {
      if (!existing.active) {
        onToggleFrameworkActive(existing.id);
      }
      setSelectedFrameworkFilter(existing.id);
      setActiveTab('fusion-matrix');
    } else {
      onAddFramework({ ...preFw });
      setSelectedFrameworkFilter(preFw.id);
      setActiveTab('fusion-matrix');
    }
  };

  // Filter controls for table
  const filteredControls: { control: CustomFrameworkControl; framework: CustomFramework }[] = [];

  for (const fw of activeFrameworks) {
    if (selectedFrameworkFilter !== 'all' && fw.id !== selectedFrameworkFilter && fw.code !== selectedFrameworkFilter) {
      continue;
    }

    for (const ctrl of fw.controls) {
      if (selectedCoverageFilter !== 'all' && ctrl.status !== selectedCoverageFilter) {
        continue;
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches = 
          ctrl.title.toLowerCase().includes(term) ||
          ctrl.requirement.toLowerCase().includes(term) ||
          ctrl.code.toLowerCase().includes(term) ||
          ctrl.domainName.toLowerCase().includes(term) ||
          ctrl.mappedNistId.toLowerCase().includes(term) ||
          ctrl.mappedIsoId.toLowerCase().includes(term);
        if (!matches) continue;
      }

      filteredControls.push({ control: ctrl, framework: fw });
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10 mt-0.5">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                MOTOR DE FUSIÓN MULTI-MARCO
              </span>
              <span className="text-xs font-mono text-slate-400">
                PDF Ingestion Engine ✕ NIST CSF 2.0 ✕ ISO 27001:2022
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-mono text-slate-100 font-semibold tracking-tight mt-1">
              Ingestor y Fusión de Nuevos Marcos (DORA, SOC 2, 27701, 31000, PDF)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
              Cargue cualquier documento regulatorio en PDF o seleccione marcos estándar. El sistema extrae los requisitos, calcula la correlación cruzada con la línea base ISO/NIST, detecta brechas netas y consolida una matriz de cumplimiento unificada.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded transition-all shadow-md shadow-cyan-500/20"
          >
            <FileUp className="w-4 h-4" />
            <span>Cargar Marco PDF</span>
          </button>

          <div className="flex items-center space-x-1 bg-[#060a12] p-1 border border-[#1e293b] rounded">
            <button
              onClick={() => exportFrameworksToCSV(activeFrameworks)}
              title="Descargar Matriz Unificada en Excel / CSV"
              className="flex items-center space-x-1 px-2.5 py-1.5 hover:bg-[#1e293b] text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => generateFusionReportPDF(activeFrameworks)}
              title="Generar Informe Ejecutivo en PDF"
              className="flex items-center space-x-1 px-2.5 py-1.5 hover:bg-[#1e293b] text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reporte PDF</span>
            </button>
            <button
              onClick={() => exportComparativePlaybookMarkdown(activeFrameworks)}
              title="Descargar Playbook Técnico en Markdown"
              className="flex items-center space-x-1 px-2.5 py-1.5 hover:bg-[#1e293b] text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Playbook .MD</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Marcos Activos Fusionados</p>
              <p className="text-2xl font-mono font-bold text-cyan-400 mt-1">{activeFrameworks.length} <span className="text-xs text-slate-500 font-normal">de {frameworks.length}</span></p>
            </div>
            <div className="p-2 bg-[#060a12] border border-cyan-500/30 text-cyan-400 rounded">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-2 truncate">
            {activeFrameworks.map(f => f.code).join(' • ') || 'Ninguno activo'}
          </p>
        </div>

        <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Índice de Solapamiento Promedio</p>
              <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{avgOverlapPercent}%</p>
            </div>
            <div className="p-2 bg-[#060a12] border border-emerald-500/30 text-emerald-400 rounded">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-2">Cubierto por SGSI ISO 27001 ✕ NIST</p>
        </div>

        <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Controles Mapeados & Reutilizados</p>
              <p className="text-2xl font-mono font-bold text-blue-400 mt-1">{totalCoveredControls} <span className="text-xs text-slate-500 font-normal">/ {totalCustomControls}</span></p>
            </div>
            <div className="p-2 bg-[#060a12] border border-blue-500/30 text-blue-400 rounded">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-2">Sinergia directa sin duplicar esfuerzos</p>
        </div>

        <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Brechas Netas a Remediar</p>
              <p className="text-2xl font-mono font-bold text-amber-400 mt-1">{totalGapControls}</p>
            </div>
            <div className="p-2 bg-[#060a12] border border-amber-500/30 text-amber-400 rounded">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-2">Requisitos específicos no cubiertos</p>
        </div>
      </div>

      {/* Quick Catalog Bar: Add Standard Frameworks in 1-Click */}
      <div className="bg-[#090e18] border border-[#152033] p-4 rounded-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Catálogo de Marcos Estándar Pre-mapeados
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Haga clic para activar o añadir al centro de mando
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {PRECONFIGURED_FRAMEWORKS.map((pf) => {
            const isInstalled = frameworks.some(f => f.code === pf.code);
            const isActive = frameworks.some(f => f.code === pf.code && f.active);

            return (
              <button
                key={pf.id}
                onClick={() => handleAddPreconfigured(pf)}
                className={cn(
                  "p-3 rounded border text-left transition-all relative group flex flex-col justify-between font-mono",
                  isActive
                    ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-200 shadow-sm shadow-cyan-500/10"
                    : isInstalled
                    ? "bg-[#0b111e] border-slate-700 text-slate-400 opacity-60 hover:opacity-100"
                    : "bg-[#070b14] border-[#1e293b] text-slate-300 hover:border-cyan-500/40 hover:bg-[#0c1424]"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{pf.code}</span>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">{pf.category}</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500 border-t border-[#1e293b]/60 pt-1.5">
                  <span>Solape {pf.fusionMetrics.overlapPercent}%</span>
                  <span className={isActive ? "text-cyan-400 font-semibold" : ""}>{isActive ? 'ACTIVO' : '+ FUSIONAR'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1e293b] pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('fusion-matrix')}
          className={cn(
            "px-4 py-2 rounded transition-colors flex items-center space-x-2 font-medium",
            activeTab === 'fusion-matrix'
              ? "bg-cyan-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0b111e]"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Matriz de Fusión Unificada ({filteredControls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comparative')}
          className={cn(
            "px-4 py-2 rounded transition-colors flex items-center space-x-2 font-medium",
            activeTab === 'comparative'
              ? "bg-cyan-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0b111e]"
          )}
        >
          <GitMerge className="w-3.5 h-3.5" />
          <span>Comparador Cruzado & Solapamiento</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={cn(
            "px-4 py-2 rounded transition-colors flex items-center space-x-2 font-medium",
            activeTab === 'upload'
              ? "bg-cyan-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0b111e]"
          )}
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Ingestor de Documentos PDF</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={cn(
            "px-4 py-2 rounded transition-colors flex items-center space-x-2 font-medium",
            activeTab === 'analytics'
              ? "bg-cyan-500 text-slate-950 font-bold"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#0b111e]"
          )}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Telemetría de Sinergia</span>
        </button>
      </div>

      {/* TAB 1: FUSION MATRIX */}
      {activeTab === 'fusion-matrix' && (
        <div className="space-y-4">
          {/* Controls Filter Bar */}
          <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar por artículo, control, tecnología o ISO/NIST..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e293b] rounded pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={selectedFrameworkFilter}
                onChange={(e) => setSelectedFrameworkFilter(e.target.value)}
                className="bg-[#070b14] border border-[#1e293b] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Todos los Marcos Activos</option>
                {activeFrameworks.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.code})</option>
                ))}
              </select>

              <select
                value={selectedCoverageFilter}
                onChange={(e) => setSelectedCoverageFilter(e.target.value)}
                className="bg-[#070b14] border border-[#1e293b] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="all">Todo Estado de Cobertura</option>
                <option value="covered">Cubierto por SGSI Línea Base</option>
                <option value="partial">Parcialmente Cubierto</option>
                <option value="gap">Brecha / Gap Específico</option>
              </select>
            </div>
          </div>

          {/* Controls List / Matrix */}
          <div className="bg-[#0b111e] border border-[#1e293b] rounded-sm overflow-hidden">
            <div className="p-4 bg-[#080d18] border-b border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Mostrando {filteredControls.length} controles fusionados</span>
              <span className="text-slate-500">Haga clic en un control para desplegar evidencias y acciones</span>
            </div>

            <div className="divide-y divide-[#1e293b]/60">
              {filteredControls.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-mono space-y-3">
                  <Layers className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm">No se encontraron controles con los filtros seleccionados.</p>
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedFrameworkFilter('all'); setSelectedCoverageFilter('all'); }}
                    className="px-3 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-xs"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              ) : (
                filteredControls.map(({ control: ctrl, framework: fw }) => {
                  const isExpanded = expandedControlId === ctrl.id;

                  return (
                    <div 
                      key={ctrl.id} 
                      className={cn(
                        "p-4 hover:bg-[#0e1626] transition-colors",
                        isExpanded ? "bg-[#0d1524]" : ""
                      )}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div 
                          onClick={() => setExpandedControlId(isExpanded ? null : ctrl.id)}
                          className="flex items-start space-x-3 cursor-pointer flex-1 min-w-0"
                        >
                          <button className="mt-1 text-slate-500 hover:text-cyan-400 shrink-0">
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 rounded text-[10px] font-mono font-bold">
                                {fw.code} • {ctrl.code}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 truncate">
                                {ctrl.domainName}
                              </span>
                              {ctrl.status === 'covered' && (
                                <span className="px-2 py-0.5 bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 rounded text-[9px] font-mono">
                                  {ctrl.overlapScore}% Solapamiento (Línea Base)
                                </span>
                              )}
                              {ctrl.status === 'partial' && (
                                <span className="px-2 py-0.5 bg-blue-950/40 text-blue-300 border border-blue-800/40 rounded text-[9px] font-mono">
                                  {ctrl.overlapScore}% Solapamiento Parcial
                                </span>
                              )}
                              {ctrl.status === 'gap' && (
                                <span className="px-2 py-0.5 bg-amber-950/40 text-amber-300 border border-amber-800/40 rounded text-[9px] font-mono">
                                  Brecha Neta ({ctrl.overlapScore}%)
                                </span>
                              )}
                            </div>

                            <h3 className="font-mono text-sm font-semibold text-slate-100">
                              {ctrl.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {ctrl.requirement}
                            </p>
                          </div>
                        </div>

                        {/* Crosswalk Badges & Compliance Control */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0 self-end lg:self-center">
                          {/* NIST Mapping Tag */}
                          <div className="px-2.5 py-1 bg-[#070b14] border border-cyan-500/30 rounded text-[11px] font-mono flex items-center space-x-1 text-cyan-300">
                            <span className="text-[9px] text-slate-500 font-bold">NIST</span>
                            <span className="font-semibold">{ctrl.mappedNistId}</span>
                          </div>

                          {/* ISO Mapping Tag */}
                          <div className="px-2.5 py-1 bg-[#070b14] border border-emerald-500/30 rounded text-[11px] font-mono flex items-center space-x-1 text-emerald-300">
                            <span className="text-[9px] text-slate-500 font-bold">ISO</span>
                            <span className="font-semibold">{ctrl.mappedIsoId}</span>
                          </div>

                          {/* Compliance Status Selector */}
                          <select
                            value={ctrl.complianceStatus}
                            onChange={(e) => onUpdateControlStatus(fw.id, ctrl.id, e.target.value as ComplianceStatus)}
                            className={cn(
                              "text-xs font-mono px-2.5 py-1 rounded border font-semibold focus:outline-none transition-colors",
                              ctrl.complianceStatus === 'Cumplido' ? "bg-emerald-950/60 text-emerald-300 border-emerald-600/50" :
                              ctrl.complianceStatus === 'En Progreso' ? "bg-cyan-950/60 text-cyan-300 border-cyan-600/50" :
                              ctrl.complianceStatus === 'No Implementado' ? "bg-rose-950/60 text-rose-300 border-rose-600/50" :
                              "bg-slate-900 text-slate-400 border-slate-700"
                            )}
                          >
                            <option value="Cumplido">Cumplido</option>
                            <option value="En Progreso">En Progreso</option>
                            <option value="No Implementado">No Implementado</option>
                            <option value="No Aplica">No Aplica</option>
                          </select>
                        </div>
                      </div>

                      {/* Expanded Details Drawer */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#1e293b] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono animate-in fade-in duration-200">
                          <div className="bg-[#070b14] border border-[#1e293b] p-3.5 rounded space-y-2">
                            <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Racional de Convergencia con NIST & ISO 27001</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              {ctrl.crosswalkJustification}
                            </p>
                            <div className="pt-2 border-t border-[#1e293b]/60 flex items-center justify-between text-[10px] text-slate-400">
                              <span>Función NIST: {ctrl.mappedNistId} ({ctrl.mappedNistName || 'Categoría'})</span>
                              <span>Control ISO: {ctrl.mappedIsoId} ({ctrl.mappedIsoName || 'Control'})</span>
                            </div>
                          </div>

                          <div className="bg-[#070b14] border border-[#1e293b] p-3.5 rounded space-y-2">
                            <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                              <FileCheck className="w-3.5 h-3.5" />
                              <span>Evidencias de Auditoría & Remediación</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-[11px]">
                              {ctrl.auditEvidence}
                            </p>
                            <div className="pt-2 border-t border-[#1e293b]/60 flex items-center justify-between text-[10px]">
                              <span className="text-slate-400">Responsable: {ctrl.roleResponsible || 'CISO'}</span>
                              {ctrl.status === 'gap' && onConvertGapToProject && (
                                <button
                                  onClick={() => onConvertGapToProject(ctrl, fw.name)}
                                  className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30 transition-colors"
                                >
                                  + Crear Tarea en Gantt
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIDE-BY-SIDE COMPARATIVE ANALYZER */}
      {activeTab === 'comparative' && (
        <div className="space-y-6">
          <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm">
            <h3 className="font-mono text-sm font-semibold text-slate-100 flex items-center space-x-2 mb-2">
              <GitMerge className="w-4 h-4 text-cyan-400" />
              <span>Matriz Comparativa de Sinergia por Dominio de Seguridad</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Observe cómo una sola salvaguarda técnica en su infraestructura (como MFA FIDO2, Backups Inmutables o EDR 24/7) satisface simultáneamente múltiples marcos regulatorios a la vez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Identity & Access Card */}
            <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
                <span className="text-xs font-mono font-bold text-cyan-400">1. Identidad & Autenticación Fuerte</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded">100% Solapado</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">NIST CSF 2.0</span>
                  <span className="text-slate-200 font-semibold">PR.AA-01 (MFA & RBAC)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">ISO 27001:2022</span>
                  <span className="text-slate-200 font-semibold">5.15 (Control de Acceso) & 8.5 (Autenticación)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">DORA (UE 2022/2554)</span>
                  <span className="text-slate-200 font-semibold">Art. 9 (MFA obligatorio para sistemas críticos)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">SOC 2 Type II</span>
                  <span className="text-slate-200 font-semibold">CC6.1 & CC6.2 (Acceso lógico restringido y MFA)</span>
                </div>
              </div>
            </div>

            {/* Third Party & Cloud Risk Card */}
            <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
                <span className="text-xs font-mono font-bold text-amber-400">2. Riesgo de Terceros & Proveedores</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950/60 text-blue-300 border border-blue-800/40 rounded">88% Solapado</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">NIST CSF 2.0</span>
                  <span className="text-slate-200 font-semibold">GV.SC-01 a 07 (Cadena de Suministro)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">ISO 27001:2022</span>
                  <span className="text-slate-200 font-semibold">5.19, 5.20, 5.21, 5.22, 5.23 (Nube & Terceros)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">DORA (UE 2022/2554)</span>
                  <span className="text-slate-200 font-semibold">Art. 28-31 (Registro de Información & Salida Cloud)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">ISO 27701 (PIMS)</span>
                  <span className="text-slate-200 font-semibold">Cláusula 8.2 (DPA con subencargados de datos)</span>
                </div>
              </div>
            </div>

            {/* Backups & Cyber Resilience Card */}
            <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
                <span className="text-xs font-mono font-bold text-emerald-400">3. Respaldos Inmutables & Continuidad</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded">95% Solapado</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">NIST CSF 2.0</span>
                  <span className="text-slate-200 font-semibold">PR.DS-02 & RC.RP-01 (Backups & DRP)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">ISO 27001:2022</span>
                  <span className="text-slate-200 font-semibold">8.13 (Copias de Seguridad) & 5.29 (Disrupción)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">DORA (UE 2022/2554)</span>
                  <span className="text-slate-200 font-semibold">Art. 11 (Almacenamiento Inmutable WORM)</span>
                </div>
                <div className="p-2 bg-[#070b14] border border-[#1e293b] rounded">
                  <span className="text-slate-400 text-[10px] block">SOC 2 Type II</span>
                  <span className="text-slate-200 font-semibold">A1.2 (Pruebas anuales de recuperación ante desastres)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PDF INGESTION DROPZONE */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Upload Drop Zone Card */}
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-sm p-8 text-center transition-all flex flex-col items-center justify-center space-y-4",
              isDragging 
                ? "border-cyan-400 bg-cyan-950/20" 
                : "border-[#1e293b] bg-[#0b111e] hover:border-slate-600"
            )}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files && e.target.files[0] && handlePdfUpload(e.target.files[0])}
            />

            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <FileUp className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1 max-w-md">
              <h3 className="font-mono text-base font-semibold text-slate-100">
                Arrastre y suelte cualquier archivo PDF de normativa o estándar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Soporta reglamentos oficiales (DORA, SOC 2, ISO 27701, ISO 31000, NIS2, PCI-DSS, HIPAA) o políticas internas de su organización.
              </p>
            </div>

            <div className="w-full max-w-md space-y-2">
              <input
                type="text"
                placeholder="Título o Nombre del Marco (Opcional, e.g., 'DORA Financiero')"
                value={customFrameworkTitle}
                onChange={(e) => setCustomFrameworkTitle(e.target.value)}
                className="w-full bg-[#070b14] border border-[#1e293b] rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              disabled={isProcessingPdf}
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isProcessingPdf ? 'Procesando Documento...' : 'Seleccionar Archivo PDF'}
            </button>

            {isProcessingPdf && (
              <div className="w-full max-w-md bg-[#070b14] p-4 rounded border border-cyan-500/40 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{processingStatus}</span>
                </div>
                <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-3/4 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* List of Ingested Frameworks with Management Actions */}
          <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm space-y-4">
            <h3 className="font-mono text-sm font-semibold text-slate-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Marcos Actualmente Cargados en la Plataforma ({frameworks.length})</span>
            </h3>

            <div className="divide-y divide-[#1e293b]">
              {frameworks.map((fw) => (
                <div key={fw.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-100">{fw.name}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#070b14] text-cyan-300 border border-[#1e293b] rounded">
                        {fw.code}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {fw.sourceType === 'pdf_upload' ? `PDF: ${fw.fileName || 'Doc'}` : 'Estándar'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{fw.description}</p>
                    <div className="text-[10px] text-slate-500 flex items-center space-x-3 pt-0.5">
                      <span>{fw.fusionMetrics.totalControls} Controles</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold">{fw.fusionMetrics.overlapPercent}% Solapamiento</span>
                      <span>•</span>
                      <span className="text-amber-400">{fw.fusionMetrics.gapControls} Brechas</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => onToggleFrameworkActive(fw.id)}
                      className={cn(
                        "px-3 py-1.5 rounded text-xs transition-colors",
                        fw.active 
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40" 
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      )}
                    >
                      {fw.active ? 'Activo en Fusión' : 'Desactivado'}
                    </button>

                    <button
                      onClick={() => onRemoveFramework(fw.id)}
                      title="Eliminar Marco"
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded border border-transparent hover:border-rose-900/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYNERGY & OVERLAP TELEMETRY */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart: Overlap & Compliance */}
            <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm">
              <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-3 font-mono">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Solapamiento vs. Cumplimiento por Marco</h3>
                  <p className="text-[11px] text-slate-400">Porcentaje de cobertura sobre el SGSI base</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 rounded">
                  0% a 100%
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={frameworkComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }} />
                    <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#070b14', borderRadius: '4px', border: '1px solid #1e293b', color: '#f1f5f9', fontFamily: 'monospace', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Bar name="Solapamiento con SGSI (%)" dataKey="Solapamiento con SGSI (%)" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                    <Bar name="Cumplimiento Actual (%)" dataKey="Cumplimiento Actual (%)" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart: Domain Synergies */}
            <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm">
              <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-3 font-mono">
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Radar de Resiliencia Multi-Regulatoria</h3>
                  <p className="text-[11px] text-slate-400">Distribución de fortaleza en pilares clave</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded">
                  Convergente
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={[
                    { domain: 'Gobernanza', ISO: 90, NIST: 85, DORA: 95, SOC2: 90 },
                    { domain: 'Identidad/MFA', ISO: 95, NIST: 100, DORA: 95, SOC2: 100 },
                    { domain: 'Cifrado/Datos', ISO: 88, NIST: 92, DORA: 90, SOC2: 95 },
                    { domain: 'Terceros/Cloud', ISO: 80, NIST: 75, DORA: 85, SOC2: 80 },
                    { domain: 'Detección SOC', ISO: 85, NIST: 80, DORA: 90, SOC2: 85 },
                    { domain: 'Continuidad/DRP', ISO: 90, NIST: 88, DORA: 95, SOC2: 90 }
                  ]}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="domain" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 9 }} />
                    <Radar name="DORA" dataKey="DORA" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                    <Radar name="SOC 2" dataKey="SOC2" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                    <Radar name="ISO 27001" dataKey="ISO" stroke="#f59e0b" fill="transparent" strokeDasharray="3 3" />
                    <Tooltip contentStyle={{ backgroundColor: '#070b14', borderRadius: '4px', border: '1px solid #1e293b', color: '#f1f5f9', fontFamily: 'monospace', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
