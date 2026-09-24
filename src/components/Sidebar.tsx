import React from 'react';
import { 
  LayoutDashboard, 
  GitMerge, 
  AlertTriangle, 
  GanttChartSquare, 
  FileBarChart, 
  Compass, 
  Activity, 
  FileSearch, 
  CheckSquare, 
  Zap, 
  BookOpen, 
  ShieldCheck, 
  Radio, 
  Terminal,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  nonNegotiablesCount?: { enforced: number; total: number };
}

export function Sidebar({ currentTab, setCurrentTab, nonNegotiablesCount = { enforced: 12, total: 12 } }: SidebarProps) {
  const sections = [
    {
      group: 'CENTRO DE MANDO',
      items: [
        { id: 'dashboard', label: 'Cyber SOC Dashboard', icon: LayoutDashboard, badge: 'LIVE' },
        { 
          id: 'fusion', 
          label: 'Fusión Multi-Marcos & PDF', 
          icon: GitMerge, 
          badge: 'PDF / DORA / SOC2',
          highlight: true 
        },
        { 
          id: 'non-negotiables', 
          label: 'No Negociables', 
          icon: Zap, 
          badge: `${nonNegotiablesCount.enforced}/${nonNegotiablesCount.total}`,
          highlight: true 
        },
        { id: 'documentation', label: 'Documentación & Guía', icon: BookOpen, badge: 'DOCS' },
      ]
    },
    {
      group: 'NORMATIVA & CONTROLES',
      items: [
        { id: 'mapping', label: 'Mapeo ISO ✕ NIST', icon: GitMerge },
        { id: 'checklists', label: 'Listas de Chequeo', icon: CheckSquare },
        { id: 'gaps', label: 'Matriz de Brechas', icon: AlertTriangle },
      ]
    },
    {
      group: 'OPERACIONES & GESTIÓN',
      items: [
        { id: 'simulator', label: 'Simulador de Postura', icon: Activity },
        { id: 'action-plan', label: 'Plan de Acción', icon: Compass },
        { id: 'projects', label: 'Gantt & Roadmap', icon: GanttChartSquare },
      ]
    },
    {
      group: 'AUDITORÍA & REPORTES',
      items: [
        { id: 'reports', label: 'Reportes Ejecutivos', icon: FileBarChart },
        { id: 'auditor', label: 'Consola de Auditor', icon: FileSearch },
      ]
    }
  ];

  return (
    <div className="w-64 bg-[#070b12] border-r border-[#152033] text-slate-200 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#152033] bg-[#090e18] relative overflow-hidden">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-sm font-mono font-bold tracking-wider text-slate-100">
                CIBER<span className="text-cyan-400">DEFENSA</span>
              </span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
              NIST 2.0 ✕ ISO 27001
            </p>
          </div>
        </div>

        {/* Live SOC status pill */}
        <div className="mt-3.5 flex items-center justify-between px-2.5 py-1 bg-[#05080f] rounded border border-[#1e293b] text-[10px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold">SOC ACTIVO</span>
          </div>
          <span className="text-slate-500">v2.4</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[9px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {section.group}
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all group",
                      isActive 
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-semibold" 
                        : "text-slate-400 hover:bg-[#0f172a]/60 hover:text-slate-200 border border-transparent"
                    )}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300",
                        item.highlight && !isActive && "text-amber-400"
                      )} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={cn(
                        "text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold",
                        item.highlight 
                          ? (isActive ? "bg-amber-400 text-slate-950 border-amber-400" : "bg-amber-500/15 text-amber-300 border-amber-500/30")
                          : (isActive ? "bg-cyan-400 text-slate-950 border-cyan-400" : "bg-[#111c30] text-slate-400 border-[#1e293b]")
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#152033] bg-[#080d17] text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>SGSI Convergente</span>
        </div>
        <span className="text-slate-600">2026</span>
      </div>
    </div>
  );
}

