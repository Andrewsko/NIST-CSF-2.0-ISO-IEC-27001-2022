import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { ProfileScore, ProjectTask, Mapping, CustomFramework } from '../types';
import { 
  ShieldCheck, 
  Target, 
  AlertCircle, 
  CheckCircle2, 
  ListChecks, 
  BookOpen, 
  Layers, 
  Award, 
  Zap, 
  ArrowRight, 
  Sparkles,
  Activity,
  Terminal,
  Cpu,
  Radio,
  FileText,
  Lock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  GitMerge,
  FileUp
} from 'lucide-react';
import { NON_NEGOTIABLE_RECOMMENDATIONS } from '../data/nonNegotiablesData';
import { cn } from '../lib/utils';

export interface IsoMetrics {
  isoAnnexAPercent: number;
  isoClausesPercent: number;
  overallIsoPercent: number;
  nistOverallPercent: number;
  globalCompliancePercent: number;
  completedIsoControls: number;
  completedIsoClauseReqs: number;
  completedNistSubcategories: number;
}

interface DashboardProps {
  scores: ProfileScore[];
  projects: ProjectTask[];
  mappings: Mapping[];
  isoMetrics?: IsoMetrics;
  onNavigateToTab?: (tab: string) => void;
  nonNegotiablesEnforcedCount?: number;
  customFrameworks?: CustomFramework[];
}

export function Dashboard({ 
  scores, 
  projects, 
  mappings, 
  isoMetrics, 
  onNavigateToTab,
  nonNegotiablesEnforcedCount = 0,
  customFrameworks = []
}: DashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'radar' | 'domains'>('overview');

  const avgCurrent = scores.reduce((acc, curr) => acc + curr.current, 0) / scores.length;
  const avgTarget = scores.reduce((acc, curr) => acc + curr.target, 0) / scores.length;
  const overallNistCompliance = avgTarget > 0 ? (avgCurrent / avgTarget) * 100 : 0;

  const totalNonNegotiables = NON_NEGOTIABLE_RECOMMENDATIONS.length;
  const nonNegotiablesRate = Math.round((nonNegotiablesEnforcedCount / totalNonNegotiables) * 100);

  const globalCompliance = isoMetrics?.globalCompliancePercent ?? Math.round(overallNistCompliance);

  // Determine Defense Posture Level
  const getDefenseLevel = (score: number) => {
    if (score >= 90) return { label: 'CERTIFICABLE / RESILIENTE', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', bar: 'bg-emerald-500' };
    if (score >= 70) return { label: 'DEFENSA ROBUSTA', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30', bar: 'bg-cyan-500' };
    if (score >= 50) return { label: 'POSTURA INTERMEDIA', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', bar: 'bg-amber-500' };
    return { label: 'BRECHA CRÍTICA', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', bar: 'bg-rose-500' };
  };

  const defenseLevel = getDefenseLevel(globalCompliance);

  const stats = [
    { 
      title: 'Score Global de Ciberdefensa', 
      value: `${globalCompliance}%`, 
      subtitle: `NIST: ${isoMetrics?.nistOverallPercent ?? Math.round(overallNistCompliance)}% • ISO: ${isoMetrics?.overallIsoPercent ?? 0}%`,
      icon: ShieldCheck,
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      badge: 'UNIFICADO'
    },
    { 
      title: 'Salvaguardas No Negociables', 
      value: `${nonNegotiablesEnforcedCount}/${totalNonNegotiables}`, 
      subtitle: `${nonNegotiablesRate}% de Línea Base Garantizada`,
      icon: Zap,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      badge: 'CRÍTICO'
    },
    { 
      title: 'ISO 27001:2022 (Anexo A)', 
      value: `${isoMetrics?.isoAnnexAPercent ?? 0}%`, 
      subtitle: `${isoMetrics?.completedIsoControls ?? 0} de 93 Controles Verificados`,
      icon: ListChecks,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      badge: 'ANEXO A'
    },
    { 
      title: 'Cláusulas SGSI (4 a 10)', 
      value: `${isoMetrics?.isoClausesPercent ?? 0}%`, 
      subtitle: `${isoMetrics?.completedIsoClauseReqs ?? 0} de 27 Requisitos Clave`,
      icon: BookOpen,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      badge: 'GOBERNANZA'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* HUD Top Bar */}
      <div className="bg-[#0b111e] border border-[#1e293b] p-5 rounded-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10 mt-0.5">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                CENTRO DE MANDO CIBERNETICO
              </span>
              <span className="text-xs font-mono text-slate-400">
                NIST CSF 2.0 ✕ ISO/IEC 27001:2022
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-mono text-slate-100 font-semibold tracking-tight mt-1">
              Consola de CiberGobernanza & Postura Defensiva
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
              Monitoreo en tiempo real de madurez normativa, enforzamiento de controles críticos y telemetría para auditoría ejecutiva.
            </p>
          </div>
        </div>

        {/* Defense Status Pill & Quick Nav */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 self-end lg:self-center">
          <div className={cn("px-3.5 py-2 rounded border font-mono text-xs flex items-center space-x-2", defenseLevel.bg)}>
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase leading-none">Estado de Defensa</span>
              <span className={cn("font-bold", defenseLevel.color)}>{defenseLevel.label}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('documentation')}
            className="flex items-center space-x-1.5 px-3 py-2 bg-[#060a12] hover:bg-[#0f172a] text-slate-300 hover:text-white border border-[#1e293b] rounded text-xs font-mono transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Guía & Docs</span>
          </button>
        </div>
      </div>

      {/* Prominent Cyber Callout Banner: Non-Negotiables */}
      <div className="bg-gradient-to-r from-[#070e1b] via-[#091426] to-[#070b14] border border-cyan-500/30 p-5 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-radial from-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-start space-x-4 relative z-10">
          <div className="w-11 h-11 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-mono font-bold uppercase tracking-wider rounded">
                LÍNEA BASE MANDATORIA
              </span>
              <span className="text-xs font-mono text-amber-300">
                {nonNegotiablesEnforcedCount} de {totalNonNegotiables} Salvaguardas en Vigor ({nonNegotiablesRate}%)
              </span>
            </div>
            <h2 className="text-base font-mono text-slate-100 font-semibold mt-1">
              Salvaguardas & Recomendaciones No Negociables
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              MFA FIDO2, Backups Inmutables 3-2-1, EDR 24/7, PAM/JIT, Cifrado AES-256/TLS 1.3, CISO y SLAs de Vulnerabilidad auditables.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 self-end md:self-center relative z-10">
          <div className="w-36 hidden lg:block">
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Garantía</span>
              <span className="text-amber-300 font-bold">{nonNegotiablesRate}%</span>
            </div>
            <div className="w-full bg-[#0b111e] h-2 rounded-full overflow-hidden border border-[#1e293b]">
              <div 
                className="bg-amber-400 h-full transition-all duration-500 shadow-sm shadow-amber-400/50" 
                style={{ width: `${nonNegotiablesRate}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('non-negotiables')}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-mono font-bold text-xs rounded transition-all shadow-lg shadow-amber-500/20"
          >
            <span>Ver y Aplicar Línea Base</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cyber KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-[#0b111e] border border-[#1e293b] hover:border-slate-600 p-5 rounded-sm flex items-start justify-between transition-all group relative overflow-hidden"
          >
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate">{stat.title}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#060a12] text-slate-400 border border-[#1e293b] rounded">
                  {stat.badge}
                </span>
              </div>
              <p className={cn("text-2xl font-mono font-bold mt-1", stat.color)}>{stat.value}</p>
              <p className="text-[11px] font-mono text-slate-400 truncate">{stat.subtitle}</p>
            </div>
            <div className={cn("p-2.5 bg-[#060a12] border rounded shrink-0 ml-3", stat.borderColor, stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Interactive Posture Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart Panel */}
        <div className="bg-[#0b111e] p-5 rounded-sm border border-[#1e293b]">
          <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-3">
            <div>
              <h3 className="font-mono text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Radar de Madurez por Función (NIST CSF 2.0)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Perfil Actual vs. Perfil Objetivo vs. Industria</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 rounded">
              Escala 0 a 5.0
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={scores}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="function" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600, fontFamily: 'monospace' }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#475569', fontSize: 10 }} />
                <Radar name="Perfil Actual" dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                <Radar name="Perfil Objetivo" dataKey="target" stroke="#94a3b8" fill="transparent" strokeDasharray="3 3" />
                <Radar name="Promedio Industria" dataKey="industryAverage" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeDasharray="2 2" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#070b14', borderRadius: '4px', border: '1px solid #1e293b', color: '#f1f5f9', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Panel */}
        <div className="bg-[#0b111e] p-5 rounded-sm border border-[#1e293b] flex flex-col">
          <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-3">
            <div>
              <h3 className="font-mono text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Nivel de Madurez Operativa por Pilar NIST</span>
              </h3>
              <p className="text-[11px] text-slate-400">Comparativa directa de brechas hacia el objetivo</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 rounded">
              Tier 1 a Tier 4
            </span>
          </div>

          <div className="h-80 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scores} margin={{ top: 15, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="function" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }} />
                <YAxis domain={[0, 5]} stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'monospace' }} />
                <Tooltip
                  cursor={{ fill: '#0f172a' }}
                  contentStyle={{ backgroundColor: '#070b14', borderRadius: '4px', border: '1px solid #1e293b', color: '#f1f5f9', fontFamily: 'monospace', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar name="Actual" dataKey="current" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                <Bar name="Objetivo" dataKey="target" fill="#334155" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ISO 27001 Annex A & Clauses Breakdown */}
      <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#1e293b] pb-4">
          <div>
            <h3 className="font-mono text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Desglose por Dominios ISO/IEC 27001:2022</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Estado de implementación en tiempo real derivado de los checklists operativos
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 rounded">
              Anexo A: {isoMetrics?.isoAnnexAPercent ?? 0}% ({isoMetrics?.completedIsoControls ?? 0}/93)
            </span>
            <span className="px-2.5 py-1 bg-blue-950/40 text-blue-300 border border-blue-800/40 rounded">
              Cláusulas: {isoMetrics?.isoClausesPercent ?? 0}% ({isoMetrics?.completedIsoClauseReqs ?? 0}/27)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#070b14] border border-[#1e293b] p-4 rounded hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-cyan-400 font-mono font-bold">A.5 Organizacional</span>
              <span className="text-slate-400 font-mono text-[10px]">37 Controles</span>
            </div>
            <div className="w-full bg-[#0b111e] h-2 rounded-full overflow-hidden border border-[#1e293b]">
              <div 
                className="bg-cyan-500 h-full transition-all duration-300" 
                style={{ width: `${isoMetrics?.isoAnnexAPercent ?? 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">Políticas, roles, terceros y riesgos</p>
          </div>

          <div className="bg-[#070b14] border border-[#1e293b] p-4 rounded hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-emerald-400 font-mono font-bold">A.6 Personas</span>
              <span className="text-slate-400 font-mono text-[10px]">8 Controles</span>
            </div>
            <div className="w-full bg-[#0b111e] h-2 rounded-full overflow-hidden border border-[#1e293b]">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300" 
                style={{ width: `${isoMetrics?.isoAnnexAPercent ?? 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">Concienciación, acuerdos y teletrabajo</p>
          </div>

          <div className="bg-[#070b14] border border-[#1e293b] p-4 rounded hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-amber-400 font-mono font-bold">A.7 Físico</span>
              <span className="text-slate-400 font-mono text-[10px]">14 Controles</span>
            </div>
            <div className="w-full bg-[#0b111e] h-2 rounded-full overflow-hidden border border-[#1e293b]">
              <div 
                className="bg-amber-500 h-full transition-all duration-300" 
                style={{ width: `${isoMetrics?.isoAnnexAPercent ?? 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">Perímetros, salas y cableado seguro</p>
          </div>

          <div className="bg-[#070b14] border border-[#1e293b] p-4 rounded hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-blue-400 font-mono font-bold">A.8 Tecnológico</span>
              <span className="text-slate-400 font-mono text-[10px]">34 Controles</span>
            </div>
            <div className="w-full bg-[#0b111e] h-2 rounded-full overflow-hidden border border-[#1e293b]">
              <div 
                className="bg-blue-500 h-full transition-all duration-300" 
                style={{ width: `${isoMetrics?.isoAnnexAPercent ?? 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-2">MFA, EDR, cifrado, backups y DevSecOps</p>
          </div>
        </div>
      </div>

      {/* Multi-Framework Ingestion & Crosswalk Hub Card */}
      <div className="bg-[#0b111e] border border-cyan-500/30 p-6 rounded-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-[9px] font-mono font-bold uppercase">
                  CONVERGENCIA EXPANSIVA
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {customFrameworks.filter(f => f.active).length} Marcos Activos (DORA, SOC 2, ISO 27701, ISO 31000, PDF)
                </span>
              </div>
              <h3 className="font-mono text-sm font-semibold text-slate-100 mt-1">
                Fusión y Solapamiento de Marcos Regulatorios
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
                Incorpore cualquier normativa subiendo su documento PDF o activando estándares preconfigurados. El motor calcula el porcentaje de solapamiento con NIST 2.0 y ISO 27001, eliminando la duplicación de controles y auditorías.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('fusion')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono font-bold text-xs rounded transition-all shadow-md shadow-cyan-500/20"
            >
              <FileUp className="w-4 h-4" />
              <span>Abrir Ingestor de Marcos & PDF</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mini frameworks chip row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#1e293b]/60">
          {customFrameworks.slice(0, 4).map((f) => (
            <div key={f.id} className="p-2.5 bg-[#070b14] border border-[#1e293b] rounded flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-slate-200 text-[11px] block">{f.code}</span>
                <span className="text-[10px] text-slate-500 truncate block">{f.category}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold">{f.fusionMetrics.overlapPercent}% Solapado</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
