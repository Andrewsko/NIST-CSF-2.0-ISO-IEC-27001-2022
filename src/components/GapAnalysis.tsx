import React from 'react';
import { ProfileScore } from '../types';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface GapAnalysisProps {
  scores: ProfileScore[];
}

export function GapAnalysis({ scores }: GapAnalysisProps) {
  const criticalGaps = scores.filter(score => score.target - score.current >= 1.5).sort((a, b) => (b.target - b.current) - (a.target - a.current));
  const moderateGaps = scores.filter(score => score.target - score.current > 0 && score.target - score.current < 1.5).sort((a, b) => (b.target - b.current) - (a.target - a.current));

  const getFunctionFullName = (code: string) => {
    const map: Record<string, string> = {
      'GV': 'Gobernanza (Govern)',
      'ID': 'Identificar (Identify)',
      'PR': 'Proteger (Protect)',
      'DE': 'Detectar (Detect)',
      'RS': 'Responder (Respond)',
      'RC': 'Recuperar (Recover)'
    };
    return map[code] || code;
  };

  const getDynamicAssessment = (func: string) => {
    const assessments: Record<string, string> = {
      'GV': 'Assessment de Gobernanza (ISO 5.x). Foco en políticas, roles y revisión directiva.',
      'ID': 'Assessment de Activos y Riesgos (ISO 8.8, 5.9). Foco en inventario y análisis de vulnerabilidades.',
      'PR': 'Assessment de Protección y Concientización (ISO 6.3, 8.5). Foco en controles de acceso y capacitación.',
      'DE': 'Assessment de Monitoreo Continuo (ISO 8.15, 8.16). Foco en SIEM y revisión de logs.',
      'RS': 'Assessment de Respuesta a Incidentes (ISO 5.24). Foco en simulación de incidentes y playbooks.',
      'RC': 'Assessment de Continuidad de Negocio (ISO 5.29). Foco en BCP/DRP y pruebas de restauración.'
    };
    return assessments[func] || 'Assessment Integral de Ciberseguridad.';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-serif text-[#c0a080] italic">Análisis de Brechas Críticas</h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] mt-1">Identificación y priorización de brechas entre el perfil actual y el objetivo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f0f0f] border border-[#222] p-5 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg text-[#e0e0e0]">Brechas Críticas</h2>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#d97706]" />
              <span className="text-[10px] uppercase text-[#666] tracking-widest">Prioridad Alta</span>
            </div>
          </div>
          <div className="space-y-3">
            {criticalGaps.map(gap => (
              <div key={gap.function} className="flex items-start gap-3 border-l-2 border-[#d97706] bg-[#1a1510] p-4">
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-[#d97706] uppercase tracking-tight">Brecha: {getFunctionFullName(gap.function)}</p>
                  <p className="text-xs text-[#ccc] mt-1 leading-snug">
                    El puntaje actual es {gap.current.toFixed(1)}, objetivo {gap.target.toFixed(1)}.
                    Se requiere atención inmediata para cerrar esta brecha.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[#666]">Diferencia</p>
                  <p className="text-lg font-serif italic text-[#d97706]">-{(gap.target - gap.current).toFixed(1)}</p>
                </div>
              </div>
            ))}
            {criticalGaps.length === 0 && <p className="text-[11px] uppercase tracking-wider text-[#888]">No hay brechas críticas.</p>}
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-[#222] p-5 rounded-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg text-[#e0e0e0]">Brechas Moderadas</h2>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#c0a080]" />
              <span className="text-[10px] uppercase text-[#666] tracking-widest">Prioridad Media</span>
            </div>
          </div>
          <div className="space-y-3">
            {moderateGaps.map(gap => (
              <div key={gap.function} className="flex items-start gap-3 border-l-2 border-[#c0a080] bg-[#1a1a1a] p-4">
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-[#c0a080] uppercase tracking-tight">Brecha: {getFunctionFullName(gap.function)}</p>
                  <p className="text-xs text-[#ccc] mt-1 leading-snug">
                    El puntaje actual es {gap.current.toFixed(1)}, objetivo {gap.target.toFixed(1)}.
                    Existen oportunidades de mejora para alcanzar el perfil objetivo.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[#666]">Diferencia</p>
                  <p className="text-lg font-serif italic text-[#c0a080]">-{(gap.target - gap.current).toFixed(1)}</p>
                </div>
              </div>
            ))}
            {moderateGaps.length === 0 && <p className="text-[11px] uppercase tracking-wider text-[#888]">No hay brechas moderadas.</p>}
          </div>
        </div>
      </div>

      <div className="bg-[#0f0f0f] border border-[#222] p-6 rounded-sm mt-8">
        <h2 className="font-serif text-xl italic mb-6 text-[#c0a080]">Recomendaciones Estratégicas y Assessments Sugeridos</h2>
        <ul className="space-y-4">
          {[...criticalGaps, ...moderateGaps].slice(0, 3).map((gap, index) => (
            <li key={gap.function} className="flex items-start gap-4">
              <span className="w-6 h-6 border border-[#c0a080] text-[#c0a080] flex items-center justify-center font-serif text-xs shrink-0 bg-[#1a1a1a]">{index + 1}</span>
              <div>
                <p className="text-[11px] font-bold text-[#e0e0e0] uppercase tracking-wider mb-1">Prioridad: {getFunctionFullName(gap.function)}</p>
                <p className="text-xs text-[#888] leading-relaxed">
                  Brecha detectada de {(gap.target - gap.current).toFixed(1)} puntos. Se recomienda ejecutar el siguiente plan: 
                  <strong className="text-[#ccc] block mt-1">{getDynamicAssessment(gap.function)}</strong>
                </p>
              </div>
            </li>
          ))}
          {criticalGaps.length === 0 && moderateGaps.length === 0 && (
             <li className="flex items-start gap-4">
              <span className="w-6 h-6 border border-[#c0a080] text-[#c0a080] flex items-center justify-center font-serif text-xs shrink-0 bg-[#1a1a1a]">+</span>
              <div>
                <p className="text-[11px] font-bold text-[#e0e0e0] uppercase tracking-wider mb-1">Perfil Objetivo Alcanzado</p>
                <p className="text-xs text-[#888] leading-relaxed">Todos los controles cumplen con el nivel de madurez esperado. Se sugiere mantener el monitoreo continuo.</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
