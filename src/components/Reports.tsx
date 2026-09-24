import React, { useState } from 'react';
import { Download, Mail, PieChart, Shield, CheckCircle2, Award, FileText, Printer, Check, AlertTriangle } from 'lucide-react';
import { ProfileScore, ProjectTask } from '../types';
import { IsoMetrics } from './Dashboard';
import { generateExecutiveReportPDF } from '../utils/exportUtils';

interface ReportsProps {
  scores: ProfileScore[];
  projects: ProjectTask[];
  isoMetrics?: IsoMetrics;
}

const FUNCTION_NAMES: Record<string, string> = {
  GV: 'Gobernanza',
  ID: 'Identificación',
  PR: 'Protección',
  DE: 'Detección',
  RS: 'Respuesta',
  RC: 'Recuperación'
};

export function Reports({ scores, projects, isoMetrics }: ReportsProps) {
  const [emailSentToast, setEmailSentToast] = useState(false);

  const avgCurrent = scores.reduce((acc, curr) => acc + curr.current, 0) / (scores.length || 1);
  const avgTarget = scores.reduce((acc, curr) => acc + curr.target, 0) / (scores.length || 1);
  const isoPercent = isoMetrics?.overallIsoPercent ?? 82;
  const nistPercent = isoMetrics?.nistOverallPercent ?? 70;
  const globalPercent = isoMetrics?.globalCompliancePercent ?? 76;

  const handleDownloadPDF = () => {
    generateExecutiveReportPDF(scores, projects, isoMetrics);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSentToast(true);
    setTimeout(() => setEmailSentToast(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-serif text-[#c0a080] italic">Reportes Ejecutivos para Alta Dirección</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] mt-1">
            Resumen consolidado de brechas críticas, estado de cumplimiento y exportación oficial a PDF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Send Email */}
          <button 
            onClick={handleSendEmail}
            className="flex items-center space-x-2 bg-[#0f0f0f] border border-[#222] text-[#e0e0e0] px-3.5 py-2 rounded-sm text-[11px] uppercase tracking-wider font-mono hover:bg-[#1a1a1a] transition-colors"
          >
            {emailSentToast ? <Check className="w-4 h-4 text-[#10b981]" /> : <Mail className="w-4 h-4 text-[#c0a080]" />}
            <span>{emailSentToast ? '¡Enviado a Dirección!' : 'Enviar por Email'}</span>
          </button>

          {/* Quick Print */}
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-[#141414] border border-[#333] text-[#aaa] hover:text-[#e0e0e0] px-3.5 py-2 rounded-sm text-[11px] uppercase tracking-wider font-mono hover:bg-[#1f1f1f] transition-colors"
            title="Vista de impresión del navegador"
          >
            <Printer className="w-4 h-4" />
            <span>Vista Previa / Imprimir</span>
          </button>

          {/* Generate PDF */}
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 bg-[#c0a080] text-[#050505] px-4 py-2 rounded-sm text-[11px] uppercase tracking-wider font-mono font-bold hover:bg-[#b09070] transition-colors shadow-sm"
            title="Descargar reporte corporativo oficial en formato PDF"
          >
            <Download className="w-4 h-4" />
            <span>Generar Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Layout Container */}
      <div className="bg-[#0f0f0f] rounded-sm border border-[#222] p-8 max-w-4xl mx-auto w-full space-y-8 print:p-0 print:border-none print:bg-white print:text-black">
        {/* Report Header */}
        <div className="border-b border-[#222] pb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-[#c0a080] rounded-sm flex items-center justify-center text-[#050505] font-serif text-xl font-bold">G</div>
              <h1 className="text-2xl font-serif text-[#c0a080] tracking-wide">ESTADO DE CIBERGOBERNANZA INTEGRADO</h1>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#888]">ISO/IEC 27001:2022 (SGSI + Anexo A) & NIST CSF 2.0</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-[#666]">Fecha de Emisión Oficial</p>
            <p className="text-sm font-serif italic text-[#e0e0e0] mt-1">{new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-[#1a1a1a] border border-[#333] text-[9px] font-mono text-[#c0a080] rounded-xs uppercase">
              Versión Oficial 2.0
            </span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#141414] p-5 rounded-sm border border-[#222] flex items-center space-x-4">
            <div className="p-3 border border-[#222] text-[#c0a080] rounded-sm bg-[#0f0f0f]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#666] tracking-widest font-mono">Madurez Promedio NIST</p>
              <p className="text-2xl font-serif text-[#e0e0e0] mt-0.5">{avgCurrent.toFixed(2)} <span className="text-sm text-[#666] font-normal">/ {avgTarget.toFixed(1)}</span></p>
            </div>
          </div>

          <div className="bg-[#141414] p-5 rounded-sm border border-[#222] flex items-center space-x-4">
            <div className="p-3 border border-[#222] text-[#c0a080] rounded-sm bg-[#0f0f0f]">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#666] tracking-widest font-mono">Cobertura ISO 27001</p>
              <p className="text-2xl font-serif text-[#e0e0e0] mt-0.5">{isoPercent}%</p>
              <p className="text-[9px] text-[#888] font-mono">93 Controles + 11 Cláusulas</p>
            </div>
          </div>

          <div className="bg-[#141414] p-5 rounded-sm border border-[#222] flex items-center space-x-4">
            <div className="p-3 border border-[#222] text-[#c0a080] rounded-sm bg-[#0f0f0f]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-[#666] tracking-widest font-mono">Cumplimiento Global</p>
              <p className="text-2xl font-serif text-[#c0a080] mt-0.5">{globalPercent}%</p>
              <p className="text-[9px] text-[#888] font-mono">NIST CSF 2.0 (106 Subcat.)</p>
            </div>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="bg-[#141414] border border-[#222] p-6 rounded-sm space-y-3">
          <div className="flex items-center gap-2 text-[#c0a080]">
            <FileText className="w-4 h-4" />
            <h2 className="font-serif text-base uppercase tracking-wider text-[#e0e0e0]">1. Resumen Ejecutivo de la Alta Dirección</h2>
          </div>
          <p className="text-[#ccc] text-xs leading-relaxed font-sans">
            La organización ha completado la fase de diagnóstico de ciberseguridad integrando las 106 subcategorías de <strong>NIST CSF 2.0</strong> y los 93 controles de <strong>ISO/IEC 27001:2022</strong>. Se evidencia un avance consolidado con un índice general de cumplimiento del <strong>{globalPercent}%</strong> y una madurez de <strong>{avgCurrent.toFixed(2)} sobre 5.0</strong>. Se recomienda priorizar recursos presupuestales para solventar las brechas en las funciones de Gobierno y Protección.
          </p>
        </div>

        {/* Function Gap Table */}
        <div className="space-y-3">
          <h2 className="font-serif text-base text-[#e0e0e0] border-b border-[#222] pb-2">
            2. Diagnóstico de Madurez & Brechas por Función NIST CSF 2.0
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-[#141414] text-[#888] border-b border-[#222] text-[10px] uppercase">
                  <th className="py-2.5 px-3">Función NIST</th>
                  <th className="py-2.5 px-3 text-center">Madurez Actual</th>
                  <th className="py-2.5 px-3 text-center">Perfil Objetivo</th>
                  <th className="py-2.5 px-3 text-center">Brecha (Gap)</th>
                  <th className="py-2.5 px-3 text-center">Nivel de Riesgo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {scores.map((s) => {
                  const gap = s.target - s.current;
                  const riskLevel = gap >= 1.5 ? 'Alto (Crítico)' : gap >= 0.8 ? 'Medio (Atención)' : 'Bajo (Adecuado)';
                  const riskBadge = gap >= 1.5 
                    ? 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30' 
                    : gap >= 0.8 
                    ? 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30' 
                    : 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/30';

                  return (
                    <tr key={s.function} className="hover:bg-[#121212]">
                      <td className="py-3 px-3 font-bold text-[#e0e0e0]">
                        {s.function} - {FUNCTION_NAMES[s.function] || s.function}
                      </td>
                      <td className="py-3 px-3 text-center text-[#ccc]">{s.current.toFixed(2)} / 5.0</td>
                      <td className="py-3 px-3 text-center text-[#888]">{s.target.toFixed(2)} / 5.0</td>
                      <td className="py-3 px-3 text-center font-bold text-[#c0a080]">{gap.toFixed(2)} Pts</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-xs border text-[10px] ${riskBadge}`}>
                          {riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Projects List */}
        <div className="space-y-3">
          <h2 className="font-serif text-base text-[#e0e0e0] border-b border-[#222] pb-2">
            3. Portafolio de Iniciativas de Remediación Priorizadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.slice(0, 6).map((p) => (
              <div key={p.id} className="bg-[#141414] border border-[#222] p-4 rounded-sm space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#1f1f1f] border border-[#333] text-[#c0a080] rounded-xs font-bold">
                    NIST {p.nistCategoryId}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs border ${
                    p.priority === 'Crítica' ? 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30' : 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30'
                  }`}>
                    {p.priority}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-xs text-[#e0e0e0] leading-snug">{p.name}</h3>
                <div className="flex justify-between items-center text-[10px] font-mono text-[#888] pt-1 border-t border-[#222]">
                  <span>Área: {p.owner}</span>
                  <span className="text-[#c0a080] font-bold">{p.resources}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-[#222] flex flex-col sm:flex-row justify-between items-center text-[9px] uppercase tracking-widest text-[#555] gap-2">
          <p>Confidencial — Uso Interno Exclusivo de Auditoría y Dirección Corporativa</p>
          <p>Governance Unified Platform (NIST CSF 2.0 & ISO 27001)</p>
        </div>
      </div>
    </div>
  );
}
