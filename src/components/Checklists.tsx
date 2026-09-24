import React, { useState, useMemo } from 'react';
import { NIST_FUNCTIONS, NIST_2_CATEGORIES, NIST_2_SUBCATEGORIES, Nist2Subcategory } from '../data/nist2Data';
import { ISO_CLAUSES, ISO_27001_CONTROLS_93, Iso27001Control, IsoClause } from '../data/iso27001Data';
import { Search, Filter, CheckCircle2, Circle, ChevronDown, ChevronRight, RotateCcw, ShieldCheck, ListChecks, Layers, BookOpen, CheckSquare, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export interface ChecklistsProps {
  nistChecks?: Record<string, boolean>;
  isoControlChecks?: Record<string, boolean>;
  isoClauseChecks?: Record<string, boolean>;
  onToggleNistSubcategory?: (id: string) => void;
  onToggleIsoControl?: (id: string) => void;
  onToggleIsoClauseReq?: (id: string) => void;
  onBatchToggleNistCategory?: (catId: string, subcategoryIds: string[]) => void;
  onBatchToggleIsoDomain?: (controlIds: string[]) => void;
  onBatchToggleIsoClause?: (reqIds: string[]) => void;
}

export function Checklists(props: ChecklistsProps = {}) {
  const [activeTab, setActiveTab] = useState<'NIST' | 'ISO'>('NIST');
  
  // ISO Sub-tab: Annex A (93 controls) vs Clauses (11 clauses)
  const [isoSubTab, setIsoSubTab] = useState<'ANNEX_A' | 'CLAUSES'>('ANNEX_A');

  // Filters for NIST
  const [selectedNistFunction, setSelectedNistFunction] = useState<string>('ALL');
  const [selectedNistCategory, setSelectedNistCategory] = useState<string>('ALL');

  // Filters for ISO Annex A
  const [selectedIsoDomain, setSelectedIsoDomain] = useState<string>('ALL');

  // Filters for ISO Clauses
  const [selectedIsoClause, setSelectedIsoClause] = useState<string>('ALL');

  // Common filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fallback local state if props are not provided
  const [localNistChecks, setLocalNistChecks] = useState<Record<string, boolean>>({});
  const [localIsoControlChecks, setLocalIsoControlChecks] = useState<Record<string, boolean>>({});
  const [localIsoClauseChecks, setLocalIsoClauseChecks] = useState<Record<string, boolean>>({});

  const nistChecks = props.nistChecks ?? localNistChecks;
  const isoControlChecks = props.isoControlChecks ?? localIsoControlChecks;
  const isoClauseChecks = props.isoClauseChecks ?? localIsoClauseChecks;

  // Expanded state maps
  const [expandedNistCategories, setExpandedNistCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NIST_2_CATEGORIES.forEach(cat => { initial[cat.id] = true; });
    return initial;
  });

  const [expandedIsoDomains, setExpandedIsoDomains] = useState<Record<string, boolean>>({
    'Organizacional': true,
    'Personas': true,
    'Físico': true,
    'Tecnológico': true
  });

  const [expandedIsoClauses, setExpandedIsoClauses] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ISO_CLAUSES.forEach(c => { initial[c.id] = true; });
    return initial;
  });

  // Toggles
  const toggleNistSubcategory = (id: string) => {
    if (props.onToggleNistSubcategory) {
      props.onToggleNistSubcategory(id);
    } else {
      setLocalNistChecks(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleIsoControl = (id: string) => {
    if (props.onToggleIsoControl) {
      props.onToggleIsoControl(id);
    } else {
      setLocalIsoControlChecks(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleIsoClauseReq = (id: string) => {
    if (props.onToggleIsoClauseReq) {
      props.onToggleIsoClauseReq(id);
    } else {
      setLocalIsoClauseChecks(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const toggleNistCategoryExpand = (catId: string) => {
    setExpandedNistCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const toggleIsoDomainExpand = (domain: string) => {
    setExpandedIsoDomains(prev => ({ ...prev, [domain]: !prev[domain] }));
  };

  const toggleIsoClauseExpand = (clauseId: string) => {
    setExpandedIsoClauses(prev => ({ ...prev, [clauseId]: !prev[clauseId] }));
  };

  // Batch toggles
  const toggleNistCategoryBatch = (catId: string, subcategoryIds: string[]) => {
    if (props.onBatchToggleNistCategory) {
      props.onBatchToggleNistCategory(catId, subcategoryIds);
    } else {
      const allChecked = subcategoryIds.every(id => nistChecks[id]);
      setLocalNistChecks(prev => {
        const next = { ...prev };
        subcategoryIds.forEach(id => { next[id] = !allChecked; });
        return next;
      });
    }
  };

  const toggleIsoDomainBatch = (controlIds: string[]) => {
    if (props.onBatchToggleIsoDomain) {
      props.onBatchToggleIsoDomain(controlIds);
    } else {
      const allChecked = controlIds.every(id => isoControlChecks[id]);
      setLocalIsoControlChecks(prev => {
        const next = { ...prev };
        controlIds.forEach(id => { next[id] = !allChecked; });
        return next;
      });
    }
  };

  const toggleIsoClauseBatch = (reqIds: string[]) => {
    if (props.onBatchToggleIsoClause) {
      props.onBatchToggleIsoClause(reqIds);
    } else {
      const allChecked = reqIds.every(id => isoClauseChecks[id]);
      setLocalIsoClauseChecks(prev => {
        const next = { ...prev };
        reqIds.forEach(id => { next[id] = !allChecked; });
        return next;
      });
    }
  };

  // Global Expand / Collapse
  const setAllNistExpanded = (expanded: boolean) => {
    const next: Record<string, boolean> = {};
    NIST_2_CATEGORIES.forEach(cat => { next[cat.id] = expanded; });
    setExpandedNistCategories(next);
  };

  const setAllIsoClausesExpanded = (expanded: boolean) => {
    const next: Record<string, boolean> = {};
    ISO_CLAUSES.forEach(c => { next[c.id] = expanded; });
    setExpandedIsoClauses(next);
  };

  // STATS CALCULATIONS
  // NIST Stats
  const totalNistSubcategories = NIST_2_SUBCATEGORIES.length; // 106
  const completedNistSubcategories = useMemo(() => {
    return Object.values(nistChecks).filter(Boolean).length;
  }, [nistChecks]);
  const nistProgressPercent = Math.round((completedNistSubcategories / totalNistSubcategories) * 100);

  // ISO Annex A Stats (93 controls)
  const totalIsoControls = ISO_27001_CONTROLS_93.length; // 93
  const completedIsoControls = useMemo(() => {
    return Object.values(isoControlChecks).filter(Boolean).length;
  }, [isoControlChecks]);
  const isoControlProgressPercent = Math.round((completedIsoControls / totalIsoControls) * 100);

  // ISO Clauses Stats (11 clauses / 27 requirements)
  const allIsoClauseReqs = useMemo(() => {
    return ISO_CLAUSES.flatMap(c => c.requirements);
  }, []);
  const totalIsoClauseReqs = allIsoClauseReqs.length;
  const completedIsoClauseReqs = useMemo(() => {
    return Object.values(isoClauseChecks).filter(Boolean).length;
  }, [isoClauseChecks]);
  const isoClauseProgressPercent = Math.round((completedIsoClauseReqs / totalIsoClauseReqs) * 100);

  // Overall ISO Combined Progress
  const totalIsoItems = totalIsoControls + totalIsoClauseReqs;
  const completedIsoItems = completedIsoControls + completedIsoClauseReqs;
  const overallIsoProgressPercent = Math.round((completedIsoItems / totalIsoItems) * 100);

  // FILTERED LISTS
  // NIST Filtered Categories & Subcategories
  const filteredNistCategories = useMemo(() => {
    return NIST_2_CATEGORIES.filter(cat => {
      if (selectedNistFunction !== 'ALL' && cat.functionCode !== selectedNistFunction) return false;
      if (selectedNistCategory !== 'ALL' && cat.id !== selectedNistCategory) return false;
      return true;
    });
  }, [selectedNistFunction, selectedNistCategory]);

  const categoryNistSubcategoriesMap = useMemo(() => {
    const map: Record<string, Nist2Subcategory[]> = {};
    NIST_2_SUBCATEGORIES.forEach(sub => {
      if (selectedNistFunction !== 'ALL' && sub.functionCode !== selectedNistFunction) return;
      if (selectedNistCategory !== 'ALL' && sub.categoryId !== selectedNistCategory) return;
      
      const isChecked = !!nistChecks[sub.id];
      if (statusFilter === 'COMPLETED' && !isChecked) return;
      if (statusFilter === 'PENDING' && isChecked) return;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = sub.id.toLowerCase().includes(q);
        const matchesTitle = sub.title.toLowerCase().includes(q);
        const matchesDesc = sub.description.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesDesc) return;
      }

      if (!map[sub.categoryId]) {
        map[sub.categoryId] = [];
      }
      map[sub.categoryId].push(sub);
    });
    return map;
  }, [selectedNistFunction, selectedNistCategory, statusFilter, searchQuery, nistChecks]);

  // ISO Annex A Filtered Domains & Controls
  const isoDomains = ['Organizacional', 'Personas', 'Físico', 'Tecnológico'];
  
  const domainIsoControlsMap = useMemo(() => {
    const map: Record<string, Iso27001Control[]> = {
      'Organizacional': [],
      'Personas': [],
      'Físico': [],
      'Tecnológico': []
    };

    ISO_27001_CONTROLS_93.forEach(control => {
      if (selectedIsoDomain !== 'ALL' && control.domain !== selectedIsoDomain) return;

      const isChecked = !!isoControlChecks[control.id];
      if (statusFilter === 'COMPLETED' && !isChecked) return;
      if (statusFilter === 'PENDING' && isChecked) return;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = control.id.toLowerCase().includes(q);
        const matchesName = control.name.toLowerCase().includes(q);
        const matchesDesc = control.description.toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesDesc) return;
      }

      if (map[control.domain]) {
        map[control.domain].push(control);
      }
    });

    return map;
  }, [selectedIsoDomain, statusFilter, searchQuery, isoControlChecks]);

  // ISO Clauses Filtered
  const filteredIsoClauses = useMemo(() => {
    return ISO_CLAUSES.filter(clause => {
      if (selectedIsoClause !== 'ALL' && clause.id !== selectedIsoClause) return false;
      return true;
    });
  }, [selectedIsoClause]);

  const clauseRequirementsMap = useMemo(() => {
    const map: Record<string, typeof allIsoClauseReqs> = {};
    ISO_CLAUSES.forEach(clause => {
      const filteredReqs = clause.requirements.filter(req => {
        const isChecked = !!isoClauseChecks[req.id];
        if (statusFilter === 'COMPLETED' && !isChecked) return false;
        if (statusFilter === 'PENDING' && isChecked) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesId = req.id.toLowerCase().includes(q);
          const matchesTitle = req.title.toLowerCase().includes(q);
          const matchesDesc = req.description.toLowerCase().includes(q);
          const matchesClauseCode = clause.code.toLowerCase().includes(q);
          const matchesClauseTitle = clause.title.toLowerCase().includes(q);
          return matchesId || matchesTitle || matchesDesc || matchesClauseCode || matchesClauseTitle;
        }
        return true;
      });

      map[clause.id] = filteredReqs;
    });
    return map;
  }, [selectedIsoClause, statusFilter, searchQuery, isoClauseChecks, allIsoClauseReqs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-serif text-3xl font-light tracking-tight text-[#e0e0e0]">
            Checklists Operativos de Ciberseguridad
          </h2>
          <p className="text-[#888] text-sm mt-1 uppercase tracking-widest flex items-center gap-2 flex-wrap">
            <span>NIST CSF 2.0 (106 Subcategorías)</span>
            <span className="text-[#444]">•</span>
            <span className="text-[#c0a080]">ISO/IEC 27001:2022 (11 Cláusulas SGSI + 93 Controles Anexo A)</span>
          </p>
        </div>

        {/* Framework Selector Tabs */}
        <div className="flex bg-[#0f0f0f] p-1 border border-[#222] rounded-sm">
          <button
            onClick={() => setActiveTab('NIST')}
            className={cn(
              "px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-xs flex items-center gap-2",
              activeTab === 'NIST' ? "bg-[#c0a080] text-[#050505] shadow-sm font-bold" : "text-[#888] hover:text-[#e0e0e0]"
            )}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            NIST CSF 2.0 ({completedNistSubcategories}/{totalNistSubcategories})
          </button>
          <button
            onClick={() => setActiveTab('ISO')}
            className={cn(
              "px-5 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-xs flex items-center gap-2",
              activeTab === 'ISO' ? "bg-[#c0a080] text-[#050505] shadow-sm font-bold" : "text-[#888] hover:text-[#e0e0e0]"
            )}
          >
            <ListChecks className="w-3.5 h-3.5" />
            ISO/IEC 27001:2022 ({completedIsoItems}/{totalIsoItems})
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS CARDS */}
      {activeTab === 'NIST' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex flex-col justify-between">
            <div className="text-[10px] uppercase tracking-widest text-[#888]">Progreso Global NIST 2.0</div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-3xl text-[#e0e0e0]">{nistProgressPercent}%</span>
              <span className="text-xs text-[#c0a080]">{completedNistSubcategories} de {totalNistSubcategories}</span>
            </div>
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#c0a080] h-full transition-all duration-300" style={{ width: `${nistProgressPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm">
            <div className="text-[10px] uppercase tracking-widest text-[#888]">Estructura del Framework</div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-[#151515] p-2 border border-[#222] rounded-sm">
                <span className="block font-serif text-lg text-[#c0a080]">6</span>
                <span className="text-[9px] uppercase text-[#666]">Funciones</span>
              </div>
              <div className="bg-[#151515] p-2 border border-[#222] rounded-sm">
                <span className="block font-serif text-lg text-[#e0e0e0]">22</span>
                <span className="text-[9px] uppercase text-[#666]">Categorías</span>
              </div>
              <div className="bg-[#151515] p-2 border border-[#222] rounded-sm">
                <span className="block font-serif text-lg text-[#3b82f6]">{totalNistSubcategories}</span>
                <span className="text-[9px] uppercase text-[#666]">Subcategorías</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm md:col-span-2 flex flex-col justify-between">
            <div className="text-[10px] uppercase tracking-widest text-[#888] mb-2">Avance por Función NIST</div>
            <div className="grid grid-cols-6 gap-2">
              {NIST_FUNCTIONS.map(fn => {
                const fnSubs = NIST_2_SUBCATEGORIES.filter(s => s.functionCode === fn.code);
                const fnCompleted = fnSubs.filter(s => nistChecks[s.id]).length;
                const fnPercent = fnSubs.length > 0 ? Math.round((fnCompleted / fnSubs.length) * 100) : 0;
                return (
                  <div key={fn.code} className="bg-[#141414] border border-[#222] p-2 rounded-sm text-center">
                    <span className="text-[10px] font-bold block" style={{ color: fn.color }}>{fn.code}</span>
                    <span className="text-xs text-[#e0e0e0] font-mono mt-0.5 block">{fnPercent}%</span>
                    <span className="text-[8px] text-[#666] block mt-0.5">{fnCompleted}/{fnSubs.length}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ISO Overview Cards */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex flex-col justify-between">
            <div className="text-[10px] uppercase tracking-widest text-[#888]">Cumplimiento Global ISO 27001</div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-3xl text-[#e0e0e0]">{overallIsoProgressPercent}%</span>
              <span className="text-xs text-[#c0a080]">{completedIsoItems} de {totalIsoItems}</span>
            </div>
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#c0a080] h-full transition-all duration-300" style={{ width: `${overallIsoProgressPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm flex flex-col justify-between">
            <div className="text-[10px] uppercase tracking-widest text-[#888]">11 Cláusulas del SGSI (0 a 10)</div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="font-serif text-2xl text-[#3b82f6]">{isoClauseProgressPercent}%</span>
              <span className="text-xs text-[#888]">{completedIsoClauseReqs} / {totalIsoClauseReqs} Requisitos</span>
            </div>
            <div className="w-full bg-[#1a1a1a] h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#3b82f6] h-full transition-all duration-300" style={{ width: `${isoClauseProgressPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm md:col-span-2 flex flex-col justify-between">
            <div className="text-[10px] uppercase tracking-widest text-[#888] mb-2">Anexo A - 93 Controles de Seguridad</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { domain: 'Organizacional', code: '5', count: 37, color: '#c0a080' },
                { domain: 'Personas', code: '6', count: 8, color: '#10b981' },
                { domain: 'Físico', code: '7', count: 14, color: '#f59e0b' },
                { domain: 'Tecnológico', code: '8', count: 34, color: '#3b82f6' }
              ].map(d => {
                const domainControls = ISO_27001_CONTROLS_93.filter(c => c.domain === d.domain);
                const domainCompleted = domainControls.filter(c => isoControlChecks[c.id]).length;
                const dPercent = Math.round((domainCompleted / d.count) * 100);
                return (
                  <div key={d.domain} className="bg-[#141414] border border-[#222] p-2 rounded-sm text-center">
                    <span className="text-[10px] font-bold block" style={{ color: d.color }}>Dom. {d.code}</span>
                    <span className="text-xs text-[#e0e0e0] font-mono mt-0.5 block">{dPercent}%</span>
                    <span className="text-[8px] text-[#666] block mt-0.5">{domainCompleted}/{d.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ISO SUB-NAVIGATION SWITCHER */}
      {activeTab === 'ISO' && (
        <div className="flex border-b border-[#222] pb-2 gap-3 items-center">
          <button
            onClick={() => setIsoSubTab('ANNEX_A')}
            className={cn(
              "px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-xs flex items-center gap-2 border",
              isoSubTab === 'ANNEX_A' 
                ? "bg-[#1c1c1c] text-[#c0a080] border-[#c0a080] font-bold" 
                : "bg-[#0f0f0f] text-[#777] border-[#222] hover:text-[#ccc]"
            )}
          >
            <ShieldCheck className="w-4 h-4 text-[#c0a080]" />
            Anexo A: 93 Controles de Seguridad ({completedIsoControls}/93)
          </button>

          <button
            onClick={() => setIsoSubTab('CLAUSES')}
            className={cn(
              "px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all rounded-xs flex items-center gap-2 border",
              isoSubTab === 'CLAUSES' 
                ? "bg-[#1c1c1c] text-[#3b82f6] border-[#3b82f6] font-bold" 
                : "bg-[#0f0f0f] text-[#777] border-[#222] hover:text-[#ccc]"
            )}
          >
            <BookOpen className="w-4 h-4 text-[#3b82f6]" />
            Cláusulas Principales del SGSI (0 a 10) ({completedIsoClauseReqs}/{totalIsoClauseReqs})
          </button>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#0f0f0f] border border-[#222] p-4 rounded-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
            <input
              type="text"
              placeholder={
                activeTab === 'NIST' 
                  ? "Buscar subcategoría NIST (ej. GV.OC-01)..." 
                  : isoSubTab === 'ANNEX_A'
                    ? "Buscar control Anexo A (ej. 5.1, 8.15, cifrado, backup)..."
                    : "Buscar cláusula o requisito ISO (ej. 4.1, Liderazgo, SoA)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151515] border border-[#262626] rounded-sm pl-9 pr-4 py-2 text-xs text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#c0a080]"
            />
          </div>

          {/* NIST Function Filter Pills */}
          {activeTab === 'NIST' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedNistFunction('ALL')}
                className={cn(
                  "px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-xs font-semibold whitespace-nowrap transition-colors border",
                  selectedNistFunction === 'ALL' ? "bg-[#222] text-[#e0e0e0] border-[#444]" : "bg-[#141414] text-[#777] border-[#222] hover:text-[#ccc]"
                )}
              >
                Todas (6)
              </button>
              {NIST_FUNCTIONS.map(fn => (
                <button
                  key={fn.code}
                  onClick={() => {
                    setSelectedNistFunction(fn.code);
                    setSelectedNistCategory('ALL');
                  }}
                  className={cn(
                    "px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1",
                    selectedNistFunction === fn.code ? "bg-[#1e1e1e] border-[#c0a080] text-[#e0e0e0]" : "bg-[#141414] text-[#777] border-[#222] hover:text-[#ccc]"
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: fn.color }}></span>
                  {fn.code}
                </button>
              ))}
            </div>
          )}

          {/* ISO Domain Filter Pills for Annex A */}
          {activeTab === 'ISO' && isoSubTab === 'ANNEX_A' && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setSelectedIsoDomain('ALL')}
                className={cn(
                  "px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-xs font-semibold whitespace-nowrap transition-colors border",
                  selectedIsoDomain === 'ALL' ? "bg-[#222] text-[#e0e0e0] border-[#444]" : "bg-[#141414] text-[#777] border-[#222] hover:text-[#ccc]"
                )}
              >
                Todos (93)
              </button>
              {[
                { name: 'Organizacional', label: '5. Organizacional (37)' },
                { name: 'Personas', label: '6. Personas (8)' },
                { name: 'Físico', label: '7. Físico (14)' },
                { name: 'Tecnológico', label: '8. Tecnológico (34)' }
              ].map(d => (
                <button
                  key={d.name}
                  onClick={() => setSelectedIsoDomain(d.name)}
                  className={cn(
                    "px-2.5 py-1.5 text-[10px] uppercase tracking-wider rounded-xs font-bold whitespace-nowrap transition-colors border",
                    selectedIsoDomain === d.name ? "bg-[#1e1e1e] border-[#c0a080] text-[#e0e0e0]" : "bg-[#141414] text-[#777] border-[#222] hover:text-[#ccc]"
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          {/* ISO Clauses Dropdown Filter */}
          {activeTab === 'ISO' && isoSubTab === 'CLAUSES' && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-[#666] tracking-wider">Cláusula:</span>
              <select
                value={selectedIsoClause}
                onChange={(e) => setSelectedIsoClause(e.target.value)}
                className="bg-[#151515] border border-[#262626] text-[#ccc] text-xs py-1.5 px-3 rounded-sm focus:outline-none focus:border-[#3b82f6]"
              >
                <option value="ALL">Todas las Cláusulas (0 a 10)</option>
                {ISO_CLAUSES.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-2 border-l border-[#222] pl-3">
            <span className="text-[10px] uppercase text-[#666] tracking-wider font-medium hidden lg:inline">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#151515] border border-[#262626] text-[#ccc] text-xs py-1.5 px-3 rounded-sm focus:outline-none focus:border-[#c0a080]"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="COMPLETED">Completados</option>
            </select>
          </div>
        </div>

        {/* NIST Secondary Category Selector */}
        {activeTab === 'NIST' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-[#1a1a1a] gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-[#666] tracking-wider">Categoría:</span>
              <select
                value={selectedNistCategory}
                onChange={(e) => setSelectedNistCategory(e.target.value)}
                className="bg-[#151515] border border-[#262626] text-[#ccc] text-xs py-1 px-2 rounded-sm focus:outline-none focus:border-[#c0a080] max-w-xs"
              >
                <option value="ALL">Todas las Categorías (22)</option>
                {NIST_2_CATEGORIES
                  .filter(c => selectedNistFunction === 'ALL' || c.functionCode === selectedNistFunction)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      [{c.functionCode}] {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-[#888]">
              <button onClick={() => setAllNistExpanded(true)} className="hover:text-[#c0a080] transition-colors">
                Expandir Todo
              </button>
              <span>•</span>
              <button onClick={() => setAllNistExpanded(false)} className="hover:text-[#c0a080] transition-colors">
                Colapsar Todo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT VIEWS */}
      
      {/* 1. NIST CSF 2.0 VIEW */}
      {activeTab === 'NIST' && (
        <div className="space-y-4">
          {filteredNistCategories.map(cat => {
            const subcategories = categoryNistSubcategoriesMap[cat.id] || [];
            const allSubcategoriesInCat = NIST_2_SUBCATEGORIES.filter(s => s.categoryId === cat.id);
            const catCompletedCount = allSubcategoriesInCat.filter(s => nistChecks[s.id]).length;
            const isFullyCompleted = allSubcategoriesInCat.length > 0 && catCompletedCount === allSubcategoriesInCat.length;
            const fnInfo = NIST_FUNCTIONS.find(f => f.code === cat.functionCode);
            const isExpanded = !!expandedNistCategories[cat.id];

            if (subcategories.length === 0 && (searchQuery || statusFilter !== 'ALL')) {
              return null;
            }

            return (
              <div 
                key={cat.id} 
                className={cn(
                  "bg-[#0f0f0f] border rounded-sm overflow-hidden transition-colors",
                  isFullyCompleted ? "border-[#223d2e]" : "border-[#222]"
                )}
              >
                <div 
                  className="p-4 bg-[#141414] hover:bg-[#181818] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                  onClick={() => toggleNistCategoryExpand(cat.id)}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-[#666] hover:text-[#e0e0e0]">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <span 
                      className="px-2 py-0.5 text-[10px] font-bold rounded-xs border"
                      style={{ color: fnInfo?.color, borderColor: `${fnInfo?.color}40`, backgroundColor: `${fnInfo?.color}10` }}
                    >
                      {cat.functionCode}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#e0e0e0] font-medium">{cat.name}</span>
                        {isFullyCompleted && (
                          <span className="text-[9px] bg-[#10b98120] text-[#10b981] px-2 py-0.5 border border-[#10b98140] rounded-sm uppercase tracking-widest font-bold">
                            Completo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#777] mt-0.5 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#c0a080] font-bold">{catCompletedCount} / {allSubcategoriesInCat.length}</span>
                      <span className="text-[10px] text-[#666] block uppercase tracking-wider">Subcategorías</span>
                    </div>

                    <button
                      onClick={() => toggleNistCategoryBatch(cat.id, allSubcategoriesInCat.map(s => s.id))}
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#aaa] hover:text-[#e0e0e0] rounded-xs transition-colors whitespace-nowrap"
                    >
                      {catCompletedCount === allSubcategoriesInCat.length ? 'Desmarcar Cat.' : 'Completar Cat.'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="divide-y divide-[#181818] bg-[#0b0b0b] p-2">
                    {subcategories.map(sub => {
                      const isChecked = !!nistChecks[sub.id];
                      return (
                        <div
                          key={sub.id}
                          onClick={() => toggleNistSubcategory(sub.id)}
                          className={cn(
                            "p-3 rounded-sm flex items-start gap-3.5 hover:bg-[#121212] transition-colors cursor-pointer group",
                            isChecked ? "bg-[#0e1611]" : ""
                          )}
                        >
                          <button className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#444] group-hover:text-[#888]" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={cn("font-mono text-xs font-bold", isChecked ? "text-[#10b981]" : "text-[#c0a080]")}>
                                {sub.id}
                              </span>
                              <span className={cn("text-xs font-semibold", isChecked ? "text-[#a3e635] line-through opacity-75" : "text-[#e0e0e0]")}>
                                {sub.title}
                              </span>
                            </div>
                            <p className={cn("text-xs mt-1 leading-relaxed", isChecked ? "text-[#5f7367]" : "text-[#888]")}>
                              {sub.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. ISO/IEC 27001 - ANNEX A (93 CONTROLS) VIEW */}
      {activeTab === 'ISO' && isoSubTab === 'ANNEX_A' && (
        <div className="space-y-4">
          {isoDomains.map(domain => {
            if (selectedIsoDomain !== 'ALL' && selectedIsoDomain !== domain) return null;
            
            const controls = domainIsoControlsMap[domain] || [];
            const allDomainControls = ISO_27001_CONTROLS_93.filter(c => c.domain === domain);
            const domainCompletedCount = allDomainControls.filter(c => isoControlChecks[c.id]).length;
            const isDomainFullyCompleted = allDomainControls.length > 0 && domainCompletedCount === allDomainControls.length;
            const isExpanded = !!expandedIsoDomains[domain];

            if (controls.length === 0 && (searchQuery || statusFilter !== 'ALL')) {
              return null;
            }

            const domainCode = domain === 'Organizacional' ? '5' : domain === 'Personas' ? '6' : domain === 'Físico' ? '7' : '8';
            const domainColor = domain === 'Organizacional' ? '#c0a080' : domain === 'Personas' ? '#10b981' : domain === 'Físico' ? '#f59e0b' : '#3b82f6';

            return (
              <div 
                key={domain} 
                className={cn(
                  "bg-[#0f0f0f] border rounded-sm overflow-hidden transition-colors",
                  isDomainFullyCompleted ? "border-[#223d2e]" : "border-[#222]"
                )}
              >
                {/* Domain Header */}
                <div 
                  className="p-4 bg-[#141414] hover:bg-[#181818] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                  onClick={() => toggleIsoDomainExpand(domain)}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-[#666] hover:text-[#e0e0e0]">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <span 
                      className="px-2.5 py-0.5 text-[10px] font-bold rounded-xs border uppercase font-mono"
                      style={{ color: domainColor, borderColor: `${domainColor}40`, backgroundColor: `${domainColor}10` }}
                    >
                      Dominio {domainCode}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#e0e0e0] font-medium">Controles de Categoría {domain}</span>
                        {isDomainFullyCompleted && (
                          <span className="text-[9px] bg-[#10b98120] text-[#10b981] px-2 py-0.5 border border-[#10b98140] rounded-sm uppercase tracking-widest font-bold">
                            Completo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#777] mt-0.5">Anexo A ISO/IEC 27001:2022 • {allDomainControls.length} Controles de seguridad</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#c0a080] font-bold">{domainCompletedCount} / {allDomainControls.length}</span>
                      <span className="text-[10px] text-[#666] block uppercase tracking-wider">Verificados</span>
                    </div>

                    <button
                      onClick={() => toggleIsoDomainBatch(allDomainControls.map(c => c.id))}
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#aaa] hover:text-[#e0e0e0] rounded-xs transition-colors whitespace-nowrap"
                    >
                      {domainCompletedCount === allDomainControls.length ? 'Desmarcar Dom.' : 'Completar Dom.'}
                    </button>
                  </div>
                </div>

                {/* Controls List */}
                {isExpanded && (
                  <div className="divide-y divide-[#181818] bg-[#0b0b0b] p-2">
                    {controls.map(control => {
                      const isChecked = !!isoControlChecks[control.id];
                      return (
                        <div
                          key={control.id}
                          onClick={() => toggleIsoControl(control.id)}
                          className={cn(
                            "p-3.5 rounded-sm flex items-start gap-3.5 hover:bg-[#121212] transition-colors cursor-pointer group",
                            isChecked ? "bg-[#0e1611]" : ""
                          )}
                        >
                          <button className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#444] group-hover:text-[#888]" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={cn("font-mono text-xs font-bold px-1.5 py-0.5 rounded-xs border", isChecked ? "bg-[#10b98120] text-[#10b981] border-[#10b98140]" : "bg-[#1f1f1f] text-[#c0a080] border-[#333]")}>
                                ISO {control.id}
                              </span>
                              <span className={cn("text-xs font-semibold", isChecked ? "text-[#a3e635] line-through opacity-75" : "text-[#e0e0e0]")}>
                                {control.name}
                              </span>
                            </div>
                            <p className={cn("text-xs mt-1.5 leading-relaxed", isChecked ? "text-[#5f7367]" : "text-[#888]")}>
                              {control.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. ISO/IEC 27001 - CLAUSES 0 TO 10 VIEW */}
      {activeTab === 'ISO' && isoSubTab === 'CLAUSES' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-[#888] px-1">
            <span>Listado de Requisitos del SGSI conforme a ISO/IEC 27001:2022 (Cláusulas 0 a 10)</span>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider">
              <button onClick={() => setAllIsoClausesExpanded(true)} className="hover:text-[#3b82f6] transition-colors">
                Expandir Todo
              </button>
              <span>•</span>
              <button onClick={() => setAllIsoClausesExpanded(false)} className="hover:text-[#3b82f6] transition-colors">
                Colapsar Todo
              </button>
            </div>
          </div>

          {filteredIsoClauses.map(clause => {
            const reqs = clauseRequirementsMap[clause.id] || [];
            const clauseReqsTotal = clause.requirements;
            const completedReqsInClause = clauseReqsTotal.filter(r => isoClauseChecks[r.id]).length;
            const isClauseFullyCompleted = clauseReqsTotal.length > 0 && completedReqsInClause === clauseReqsTotal.length;
            const isExpanded = !!expandedIsoClauses[clause.id];

            if (reqs.length === 0 && (searchQuery || statusFilter !== 'ALL')) {
              return null;
            }

            return (
              <div
                key={clause.id}
                className={cn(
                  "bg-[#0f0f0f] border rounded-sm overflow-hidden transition-colors",
                  isClauseFullyCompleted ? "border-[#1e3a5f]" : "border-[#222]"
                )}
              >
                {/* Clause Header */}
                <div
                  className="p-4 bg-[#121720] hover:bg-[#161e2a] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                  onClick={() => toggleIsoClauseExpand(clause.id)}
                >
                  <div className="flex items-center gap-3">
                    <button className="text-[#666] hover:text-[#e0e0e0]">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-[#3b82f6]" /> : <ChevronRight className="w-4 h-4 text-[#3b82f6]" />}
                    </button>

                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-xs border border-[#3b82f640] bg-[#3b82f610] text-[#3b82f6] uppercase font-mono">
                      {clause.code}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-base text-[#e0e0e0] font-medium">{clause.title}</span>
                        {isClauseFullyCompleted && (
                          <span className="text-[9px] bg-[#3b82f620] text-[#3b82f6] px-2 py-0.5 border border-[#3b82f640] rounded-sm uppercase tracking-widest font-bold">
                            Completo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#888] mt-0.5">{clause.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <span className="text-xs font-mono text-[#3b82f6] font-bold">{completedReqsInClause} / {clauseReqsTotal.length}</span>
                      <span className="text-[10px] text-[#666] block uppercase tracking-wider">Requisitos</span>
                    </div>

                    <button
                      onClick={() => toggleIsoClauseBatch(clauseReqsTotal.map(r => r.id))}
                      className="text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#1a2230] hover:bg-[#202b3d] border border-[#2d3a4e] text-[#93c5fd] rounded-xs transition-colors whitespace-nowrap"
                    >
                      {completedReqsInClause === clauseReqsTotal.length ? 'Desmarcar Cláusu.' : 'Completar Cláusu.'}
                    </button>
                  </div>
                </div>

                {/* Requirements List */}
                {isExpanded && (
                  <div className="divide-y divide-[#181818] bg-[#0b0b0b] p-2">
                    {reqs.map(req => {
                      const isChecked = !!isoClauseChecks[req.id];
                      return (
                        <div
                          key={req.id}
                          onClick={() => toggleIsoClauseReq(req.id)}
                          className={cn(
                            "p-3.5 rounded-sm flex items-start gap-3.5 hover:bg-[#121212] transition-colors cursor-pointer group",
                            isChecked ? "bg-[#0d1b2a]" : ""
                          )}
                        >
                          <button className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                            {isChecked ? (
                              <CheckCircle2 className="w-5 h-5 text-[#3b82f6]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#444] group-hover:text-[#888]" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className={cn("font-mono text-xs font-bold px-1.5 py-0.5 rounded-xs border", isChecked ? "bg-[#3b82f620] text-[#60a5fa] border-[#3b82f640]" : "bg-[#1f1f1f] text-[#3b82f6] border-[#333]")}>
                                Req. {req.id}
                              </span>
                              <span className={cn("text-xs font-semibold", isChecked ? "text-[#93c5fd] line-through opacity-75" : "text-[#e0e0e0]")}>
                                {req.title}
                              </span>
                            </div>
                            <p className={cn("text-xs mt-1.5 leading-relaxed", isChecked ? "text-[#64748b]" : "text-[#888]")}>
                              {req.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
