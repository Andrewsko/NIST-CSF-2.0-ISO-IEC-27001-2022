import React, { useState, useMemo } from 'react';
import { 
  NON_NEGOTIABLE_RECOMMENDATIONS, 
  NonNegotiableRecommendation 
} from '../data/nonNegotiablesData';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Award, 
  Lock, 
  Layers, 
  Clock, 
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { 
  exportNonNegotiablesToCSV, 
  exportNonNegotiablesPlaybookMarkdown, 
  generateNonNegotiablesCertificatePDF 
} from '../utils/exportUtils';
import { cn } from '../lib/utils';

interface NonNegotiablesProps {
  nistChecks: Record<string, boolean>;
  isoControlChecks: Record<string, boolean>;
  isoClauseChecks: Record<string, boolean>;
  onEnforceRecommendation: (rec: NonNegotiableRecommendation) => void;
  onEnforceAllRecommendations: () => void;
  onRevertRecommendation?: (rec: NonNegotiableRecommendation) => void;
}

export function NonNegotiables({
  nistChecks,
  isoControlChecks,
  isoClauseChecks,
  onEnforceRecommendation,
  onEnforceAllRecommendations,
  onRevertRecommendation
}: NonNegotiablesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'enforced' | 'pending'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(NON_NEGOTIABLE_RECOMMENDATIONS[0]?.id || null);
  const [activeTabByCard, setActiveTabByCard] = useState<Record<string, 'playbook' | 'tech' | 'evidence' | 'slas'>>({});
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Compute live applied status for each recommendation based on underlying NIST and ISO checks
  const appliedStatus = useMemo(() => {
    const statusMap: Record<string, boolean> = {};
    
    NON_NEGOTIABLE_RECOMMENDATIONS.forEach(rec => {
      // Considered enforced if all its NIST subcategories and ISO controls are checked
      const nistFulfilled = rec.nistSubcategories.length === 0 || rec.nistSubcategories.every(sub => !!nistChecks[sub]);
      const isoFulfilled = rec.isoControls.length === 0 || rec.isoControls.every(ctrl => !!isoControlChecks[ctrl]);
      const clausesFulfilled = rec.isoClauses.length === 0 || rec.isoClauses.every(cl => !!isoClauseChecks[cl]);

      statusMap[rec.id] = nistFulfilled && isoFulfilled && clausesFulfilled;
    });

    return statusMap;
  }, [nistChecks, isoControlChecks, isoClauseChecks]);

  const totalCount = NON_NEGOTIABLE_RECOMMENDATIONS.length;
  const enforcedCount = Object.values(appliedStatus).filter(Boolean).length;
  const pendingCount = totalCount - enforcedCount;
  const complianceRate = Math.round((enforcedCount / totalCount) * 100);

  // Filtered recommendations
  const filteredRecommendations = useMemo(() => {
    return NON_NEGOTIABLE_RECOMMENDATIONS.filter(rec => {
      const isEnforced = appliedStatus[rec.id];

      // Status filter
      if (selectedStatus === 'enforced' && !isEnforced) return false;
      if (selectedStatus === 'pending' && isEnforced) return false;

      // Pillar filter
      if (selectedPillar !== 'all' && rec.pillar !== selectedPillar) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const inTitle = rec.title.toLowerCase().includes(query);
        const inCode = rec.code.toLowerCase().includes(query);
        const inWhy = rec.whyNonNegotiable.toLowerCase().includes(query);
        const inNist = rec.nistSubcategories.some(s => s.toLowerCase().includes(query));
        const inIso = rec.isoControls.some(c => c.toLowerCase().includes(query));
        return inTitle || inCode || inWhy || inNist || inIso;
      }

      return true;
    });
  }, [appliedStatus, selectedPillar, selectedStatus, searchTerm]);

  const handleCopy = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(snippetId);
    setTimeout(() => setCopiedSnippet(null), 2500);
  };

  const getCardTab = (recId: string) => activeTabByCard[recId] || 'playbook';
  const setCardTab = (recId: string, tab: 'playbook' | 'tech' | 'evidence' | 'slas') => {
    setActiveTabByCard(prev => ({ ...prev, [recId]: tab }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1e293b] pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              LÍNEA BASE MANDATORIA
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              NIST CSF 2.0 ✕ ISO/IEC 27001:2022
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-mono text-slate-100 font-semibold tracking-tight">
            Salvaguardas & Recomendaciones No Negociables
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Línea base ineludible de controles técnicos y de gobernanza derivados de la convergencia NIST 2.0 e ISO 27001. Permite garantizar su aplicación inmediata en el sistema e instruye detalladamente la arquitectura técnica para su despliegue en campo.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs rounded transition-all shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Automatizar y Aplicar Todo ({enforcedCount}/{totalCount})</span>
          </button>

          <div className="flex items-center space-x-1.5 bg-[#0b111e] p-1 border border-[#1e293b] rounded">
            <button
              onClick={() => exportNonNegotiablesPlaybookMarkdown(NON_NEGOTIABLE_RECOMMENDATIONS, appliedStatus)}
              title="Descargar Playbook Técnico Completo en Markdown"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 hover:bg-[#1e293b] text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Playbook .MD</span>
            </button>
            <button
              onClick={() => exportNonNegotiablesToCSV(NON_NEGOTIABLE_RECOMMENDATIONS, appliedStatus)}
              title="Exportar a CSV compatible con Excel"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 hover:bg-[#1e293b] text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel CSV</span>
            </button>
            <button
              onClick={() => generateNonNegotiablesCertificatePDF(NON_NEGOTIABLE_RECOMMENDATIONS, appliedStatus)}
              title="Generar Certificado Oficial en PDF"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 hover:bg-[#1e293b] text-slate-300 hover:text-white rounded text-xs font-mono transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificado PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Tasa de Garantía</p>
              <p className="text-2xl font-mono font-bold text-cyan-400 mt-1">{complianceRate}%</p>
            </div>
            <div className={cn(
              "w-10 h-10 rounded flex items-center justify-center",
              complianceRate === 100 ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50" : "bg-[#070b14] text-slate-400 border border-[#1e293b]"
            )}>
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="w-full bg-[#070b14] h-1.5 rounded-full mt-4 overflow-hidden border border-[#1e293b]">
            <div 
              className={cn("h-full transition-all duration-500", complianceRate === 100 ? "bg-emerald-500" : "bg-cyan-400")}
              style={{ width: `${complianceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Salvaguardas En Vigor</p>
              <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">{enforcedCount} <span className="text-sm font-mono text-slate-500">/ {totalCount}</span></p>
            </div>
            <div className="w-10 h-10 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-3">Cumplimiento técnico verificado en el sistema</p>
        </div>

        <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Pendientes de Enforzamiento</p>
              <p className="text-2xl font-mono font-bold text-amber-400 mt-1">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-3">Brechas de alto riesgo auditables</p>
        </div>

        <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">Controles Mapeados</p>
              <p className="text-2xl font-mono font-bold text-slate-200 mt-1">106 <span className="text-xs text-cyan-400">NIST</span> | 93 <span className="text-xs text-emerald-400">ISO</span></p>
            </div>
            <div className="w-10 h-10 rounded bg-[#070b14] text-cyan-400 border border-[#1e293b] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] font-mono text-slate-500 mt-3">Intersección integral 100% auditable</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b111e] border border-[#1e293b] p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por control, tecnología, SLA o riesgo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070b14] border border-[#1e293b] rounded pl-9 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Pillar Selector */}
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="bg-[#070b14] border border-[#1e293b] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Todos los Pilares</option>
            <option value="Identidad y Acceso">Identidad y Acceso</option>
            <option value="Resiliencia & Datos">Resiliencia & Datos</option>
            <option value="Detección & SOC">Detección & SOC</option>
            <option value="Gobernanza & Terceros">Gobernanza & Terceros</option>
            <option value="Vulnerabilidades & DevSecOps">Vulnerabilidades & DevSecOps</option>
            <option value="Respuesta & Continuidad">Respuesta & Continuidad</option>
          </select>

          {/* Status Filter buttons */}
          <div className="flex items-center bg-[#070b14] border border-[#1e293b] rounded p-0.5 font-mono">
            <button
              onClick={() => setSelectedStatus('all')}
              className={cn(
                "px-2.5 py-1.5 text-xs rounded transition-colors",
                selectedStatus === 'all' ? "bg-cyan-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
              )}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setSelectedStatus('enforced')}
              className={cn(
                "px-2.5 py-1.5 text-xs rounded transition-colors flex items-center space-x-1",
                selectedStatus === 'enforced' ? "bg-emerald-600 text-white font-semibold" : "text-slate-400 hover:text-emerald-400"
              )}
            >
              <Check className="w-3 h-3" />
              <span>Garantizados ({enforcedCount})</span>
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={cn(
                "px-2.5 py-1.5 text-xs rounded transition-colors flex items-center space-x-1",
                selectedStatus === 'pending' ? "bg-amber-600 text-white font-semibold" : "text-slate-400 hover:text-amber-400"
              )}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Pendientes ({pendingCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <div className="bg-[#111] border border-[#222] p-12 text-center rounded-sm">
            <ShieldAlert className="w-12 h-12 text-[#666] mx-auto mb-3" />
            <p className="text-base text-[#e0e0e0] font-medium">No se encontraron recomendaciones con los filtros seleccionados</p>
            <p className="text-xs text-[#888] mt-1">Intenta ajustar el término de búsqueda o restablecer los filtros.</p>
          </div>
        ) : (
          filteredRecommendations.map((rec) => {
            const isEnforced = appliedStatus[rec.id];
            const isExpanded = expandedId === rec.id;
            const currentTab = getCardTab(rec.id);

            return (
              <div 
                key={rec.id}
                className={cn(
                  "border rounded-sm transition-all duration-200 bg-[#0c0c0c]",
                  isEnforced ? "border-[#222] hover:border-[#333]" : "border-amber-900/40 hover:border-amber-700/60",
                  isExpanded && "ring-1 ring-[#c0a080]/30"
                )}
              >
                {/* Header Summary Row */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5",
                      isEnforced 
                        ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40" 
                        : "bg-amber-950/40 text-amber-400 border border-amber-800/50"
                    )}>
                      {isEnforced ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#161616] text-[#c0a080] border border-[#2a2a2a] rounded text-[10px] font-mono font-bold">
                          {rec.code}
                        </span>
                        <span className="px-2 py-0.5 bg-[#1a1a1a] text-[#aaa] rounded text-[10px] font-medium">
                          {rec.pillar}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-semibold",
                          isEnforced 
                            ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60" 
                            : "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                        )}>
                          {isEnforced ? '🟢 GARANTIZADO 100% (EN VIGOR)' : '🔴 PENDIENTE DE APLICACIÓN'}
                        </span>
                      </div>

                      <h2 className="text-base lg:text-lg font-medium text-[#e0e0e0] leading-snug">
                        {rec.title}
                      </h2>

                      {/* Normative Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#888] pt-1">
                        <span className="text-[#aaa] font-medium">NIST CSF 2.0:</span>
                        {rec.nistSubcategories.map(sub => (
                          <span key={sub} className="px-1.5 py-0.5 bg-[#141414] border border-[#262626] rounded text-[10px] font-mono text-[#c0a080]">
                            {sub}
                          </span>
                        ))}
                        <span className="text-[#555]">•</span>
                        <span className="text-[#aaa] font-medium">ISO 27001:</span>
                        {rec.isoControls.map(ctrl => (
                          <span key={ctrl} className="px-1.5 py-0.5 bg-[#141414] border border-[#262626] rounded text-[10px] font-mono text-emerald-400">
                            Control {ctrl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center space-x-2.5 shrink-0 self-end lg:self-center">
                    {isEnforced ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-emerald-400 flex items-center font-medium bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-900/40">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                          Salvaguarda Aplicada
                        </span>
                        {onRevertRecommendation && (
                          <button
                            onClick={() => onRevertRecommendation(rec)}
                            title="Revertir estado para diagnóstico"
                            className="p-1.5 hover:bg-[#222] text-[#666] hover:text-[#bbb] rounded transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => onEnforceRecommendation(rec)}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#c0a080] hover:bg-[#d4b595] text-black font-semibold text-xs rounded transition-colors shadow-sm"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Garantizar y Aplicar</span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-[#161616] hover:bg-[#202020] text-[#ccc] border border-[#262626] rounded text-xs transition-colors"
                    >
                      <span>{isExpanded ? 'Ocultar Guía' : 'Ver Guía Técnica'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Deep Details Panel */}
                {isExpanded && (
                  <div className="border-t border-[#1a1a1a] bg-[#080808] p-6 space-y-6">
                    {/* Rationale & Expected State Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#111] border border-red-950/40 p-4 rounded-sm">
                        <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Por Qué Es No Negociable (Riesgo & Auditoría)</span>
                        </div>
                        <p className="text-xs text-[#bbb] leading-relaxed">
                          {rec.whyNonNegotiable}
                        </p>
                      </div>

                      <div className="bg-[#111] border border-emerald-950/40 p-4 rounded-sm">
                        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Resultado Esperado / Línea Base Mandatoria</span>
                        </div>
                        <p className="text-xs text-[#bbb] leading-relaxed">
                          {rec.expectedState}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Tabs for Deep Content */}
                    <div className="flex border-b border-[#222]">
                      <button
                        onClick={() => setCardTab(rec.id, 'playbook')}
                        className={cn(
                          "px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center space-x-2",
                          currentTab === 'playbook' 
                            ? "border-[#c0a080] text-[#c0a080] bg-[#111]/60" 
                            : "border-transparent text-[#888] hover:text-white"
                        )}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>1. Cómo Aplicarse Paso a Paso (Fases 1-4)</span>
                      </button>

                      <button
                        onClick={() => setCardTab(rec.id, 'tech')}
                        className={cn(
                          "px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center space-x-2",
                          currentTab === 'tech' 
                            ? "border-[#c0a080] text-[#c0a080] bg-[#111]/60" 
                            : "border-transparent text-[#888] hover:text-white"
                        )}
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>2. Configuraciones Técnicas & Scripts</span>
                      </button>

                      <button
                        onClick={() => setCardTab(rec.id, 'evidence')}
                        className={cn(
                          "px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center space-x-2",
                          currentTab === 'evidence' 
                            ? "border-[#c0a080] text-[#c0a080] bg-[#111]/60" 
                            : "border-transparent text-[#888] hover:text-white"
                        )}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>3. Evidencias de Auditoría Requeridas</span>
                      </button>

                      <button
                        onClick={() => setCardTab(rec.id, 'slas')}
                        className={cn(
                          "px-4 py-2.5 text-xs font-medium border-b-2 transition-colors flex items-center space-x-2",
                          currentTab === 'slas' 
                            ? "border-[#c0a080] text-[#c0a080] bg-[#111]/60" 
                            : "border-transparent text-[#888] hover:text-white"
                        )}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>4. SLAs Obligatorios & Verificación</span>
                      </button>
                    </div>

                    {/* TAB 1: Step-by-Step Playbook */}
                    {currentTab === 'playbook' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {rec.implementationPhases.map((phase) => (
                          <div key={phase.phaseNumber} className="bg-[#111] border border-[#222] p-4 rounded-sm space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1c1c1c] text-[#c0a080] rounded">
                                Fase {phase.phaseNumber}
                              </span>
                              <span className="text-[10px] text-[#666] font-mono">Entregable Certificable</span>
                            </div>
                            <h3 className="text-sm font-semibold text-[#e0e0e0]">
                              {phase.phaseName}
                            </h3>
                            <p className="text-xs text-[#888]">
                              {phase.description}
                            </p>
                            <div className="space-y-1.5 pt-1">
                              <p className="text-[10px] uppercase tracking-wider text-[#aaa] font-semibold">Acciones Ineludibles:</p>
                              {phase.actionItems.map((act, i) => (
                                <div key={i} className="flex items-start space-x-2 text-xs text-[#ccc]">
                                  <span className="text-[#c0a080] font-bold">•</span>
                                  <span>{act}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#1c1c1c] flex items-center text-[11px] text-emerald-400 font-mono">
                              <CheckCircle2 className="w-3 h-3 mr-1.5 shrink-0" />
                              <span>{phase.deliverable}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB 2: Technical Snippets & CLI */}
                    {currentTab === 'tech' && (
                      <div className="space-y-4 pt-2">
                        {rec.technicalSnippets.map((snip, idx) => {
                          const snipKey = `${rec.id}-${idx}`;
                          const isCopied = copiedSnippet === snipKey;

                          return (
                            <div key={idx} className="bg-[#111] border border-[#222] rounded-sm overflow-hidden">
                              <div className="bg-[#161616] px-4 py-2.5 flex items-center justify-between border-b border-[#222]">
                                <div className="flex items-center space-x-2">
                                  <Terminal className="w-4 h-4 text-[#c0a080]" />
                                  <span className="text-xs font-semibold text-[#e0e0e0]">{snip.title}</span>
                                  <span className="text-[10px] font-mono text-[#888] bg-[#0c0c0c] px-2 py-0.5 rounded border border-[#2a2a2a]">
                                    {snip.technology}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleCopy(snip.code, snipKey)}
                                  className="flex items-center space-x-1 px-2.5 py-1 bg-[#222] hover:bg-[#2a2a2a] text-[#ddd] rounded text-[11px] transition-colors"
                                >
                                  {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{isCopied ? 'Copiado' : 'Copiar Código'}</span>
                                </button>
                              </div>

                              <pre className="p-4 text-xs font-mono text-emerald-300 bg-[#060606] overflow-x-auto leading-relaxed">
                                <code>{snip.code}</code>
                              </pre>

                              <div className="p-3 bg-[#111] border-t border-[#1c1c1c] text-xs text-[#888] italic">
                                💡 {snip.explanation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* TAB 3: Audit Evidence Checklist */}
                    {currentTab === 'evidence' && (
                      <div className="bg-[#111] border border-[#222] p-5 rounded-sm space-y-4 pt-4">
                        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#c0a080]">
                          <FileText className="w-4 h-4" />
                          <span>Artefactos y Documentación que el Auditor Exigirá In Situ:</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {rec.auditEvidenceRequired.map((ev, i) => (
                            <div key={i} className="flex items-start space-x-3 bg-[#0d0d0d] p-3.5 rounded border border-[#1e1e1e]">
                              <div className="w-5 h-5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3" />
                              </div>
                              <span className="text-xs text-[#ccc] leading-relaxed">{ev}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: SLAs & Verification Command */}
                    {currentTab === 'slas' && (
                      <div className="space-y-4 pt-2">
                        <div className="bg-[#111] border border-[#222] p-4 rounded-sm">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Métricas & SLAs Mandatorios de Operación:</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {rec.mandatorySLAs.map((sla, i) => (
                              <div key={i} className="flex items-start space-x-2 bg-[#0c0c0c] p-3 rounded border border-[#1e1e1e] text-xs text-[#ccc]">
                                <span className="text-amber-400 font-bold">⏱</span>
                                <span>{sla}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#111] border border-[#222] p-4 rounded-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#c0a080] flex items-center space-x-2">
                              <Terminal className="w-4 h-4" />
                              <span>Comando CLI de Verificación Automática:</span>
                            </span>
                            <button
                              onClick={() => handleCopy(rec.verificationCommand, `verif-${rec.id}`)}
                              className="text-[11px] text-[#888] hover:text-white flex items-center space-x-1"
                            >
                              {copiedSnippet === `verif-${rec.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedSnippet === `verif-${rec.id}` ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-[#060606] text-xs font-mono text-cyan-300 rounded border border-[#1c1c1c] overflow-x-auto">
                            <code>{rec.verificationCommand}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Global Enforcement */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-[#333] max-w-lg w-full p-6 rounded shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#c0a080]/20 text-[#c0a080] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-[#e0e0e0] font-medium">
                  Automatizar y Garantizar Toda la Línea Base
                </h3>
                <p className="text-xs text-[#888] mt-1">
                  Esta acción actualizará simultáneamente el estado de las 12 salvaguardas no negociables:
                </p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222] p-3 rounded text-xs space-y-2 text-[#aaa]">
              <div className="flex items-center space-x-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Marca como cumplidas las subcategorías NIST CSF 2.0 asociadas.</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Marca como verificados los controles de ISO/IEC 27001 Anexo A y Cláusulas.</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Ajusta el porcentaje de mapeos de auditoría al 100% de implementación.</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Actualiza el avance de los proyectos en el cronograma Gantt y registra auditoría.</span>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-[#222] hover:bg-[#2a2a2a] text-[#ccc] text-xs rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onEnforceAllRecommendations();
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 bg-[#c0a080] hover:bg-[#d4b595] text-black font-semibold text-xs rounded transition-colors shadow-lg"
              >
                Confirmar y Garantizar Todo (100%)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
