import React, { useMemo } from 'react';
import { ProfileScore, ProjectTask } from '../types';
import { Activity, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface RiskSimulatorProps {
  scores: ProfileScore[];
  setTargets: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  projects: ProjectTask[];
}

export function RiskSimulator({ scores, setTargets, projects }: RiskSimulatorProps) {
  const handleScoreChange = (functionCode: string, newTarget: number) => {
    setTargets(prev => ({ ...prev, [functionCode]: newTarget }));
  };

  const totalBudget = useMemo(() => projects.reduce((acc, p) => acc + (p.simulatedBudget || 0), 0), [projects]);
  const baseBudget = 70000; // 15k + 45k + 10k
  const budgetDiff = totalBudget - baseBudget;

  const getFunctionFullName = (code: string) => {
    const map: Record<string, string> = {
      'GV': 'Gobernanza', 'ID': 'Identificar', 'PR': 'Proteger',
      'DE': 'Detectar', 'RS': 'Responder', 'RC': 'Recuperar'
    };
    return map[code] || code;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-serif text-[#c0a080] italic">Simulador de Riesgo & Presupuesto</h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] mt-1">Ajuste de madurez objetivo y su impacto en recursos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#0f0f0f] border border-[#222] p-6 rounded-sm flex flex-col">
          <h3 className="font-serif text-lg text-[#e0e0e0] mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#c0a080]" />
            Madurez Objetivo (Target)
          </h3>
          <div className="space-y-6 flex-1">
            {scores.map(score => (
              <div key={score.function}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] uppercase tracking-wider text-[#ccc] font-bold">{getFunctionFullName(score.function)}</span>
                  <span className="text-xs text-[#c0a080] font-serif italic border border-[#222] px-2 py-0.5 bg-[#1a1a1a]">{score.target.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5" 
                  value={score.target}
                  onChange={(e) => handleScoreChange(score.function, parseFloat(e.target.value))}
                  className="w-full accent-[#c0a080]"
                />
                <div className="flex justify-between text-[9px] uppercase tracking-widest text-[#666] mt-1">
                  <span>Actual: {score.current.toFixed(1)}</span>
                  <span>Gap: {Math.max(0, score.target - score.current).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#0f0f0f] border border-[#222] p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-[#c0a080]" />
                <h3 className="text-[10px] uppercase tracking-widest text-[#666]">Impacto Presupuestario</h3>
              </div>
              <p className="text-4xl font-serif text-[#e0e0e0] mt-2">${totalBudget.toLocaleString('en-US')}</p>
              <div className="mt-4 text-xs flex items-center gap-2">
                {budgetDiff > 0 ? (
                  <span className="text-[#d97706] bg-[#1a1510] border border-[#d97706]/30 px-2 py-1 rounded-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +${budgetDiff.toLocaleString('en-US')} (Aumento)
                  </span>
                ) : budgetDiff < 0 ? (
                  <span className="text-[#c0a080] bg-[#1a1a1a] border border-[#c0a080]/30 px-2 py-1 rounded-sm flex items-center gap-1">
                    -${Math.abs(budgetDiff).toLocaleString('en-US')} (Ahorro)
                  </span>
                ) : (
                  <span className="text-[#888] bg-[#1a1a1a] border border-[#222] px-2 py-1 rounded-sm">Sin variación</span>
                )}
              </div>
            </div>

            <div className="bg-[#0f0f0f] border border-[#222] p-6 rounded-sm">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#d97706]" />
                <h3 className="text-[10px] uppercase tracking-widest text-[#666]">Proyectos Críticos</h3>
              </div>
              <p className="text-4xl font-serif text-[#e0e0e0] mt-2">{projects.filter(p => p.priority === 'Crítica').length}</p>
              <div className="mt-4 text-[10px] uppercase tracking-widest text-[#888]">
                Iniciativas de alta prioridad
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#222] p-6 rounded-sm">
            <h3 className="font-serif text-lg text-[#e0e0e0] mb-4">Plan de Acción Ajustado</h3>
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between border-b border-[#222] pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs font-bold text-[#ccc] uppercase tracking-wider">{p.name}</p>
                    <p className="text-[10px] text-[#666] uppercase tracking-widest mt-1">{p.nistCategoryId} | {p.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm mb-1 inline-block
                      ${p.priority === 'Crítica' ? 'bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20' : 
                        p.priority === 'Alta' ? 'bg-[#c0a080]/10 text-[#c0a080] border border-[#c0a080]/20' : 
                        'bg-[#1a1a1a] text-[#888] border border-[#222]'}`}>
                      {p.priority}
                    </p>
                    <p className="text-[11px] text-[#e0e0e0] font-serif italic block">${(p.simulatedBudget || 0).toLocaleString('en-US')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
