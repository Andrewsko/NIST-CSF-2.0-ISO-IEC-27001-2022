import React, { useState, useMemo } from 'react';
import { ISO_27001_CONTROLS_93 } from '../data/iso27001Data';
import { NIST_2_CATEGORIES } from '../data/nist2Data';
import { Mapping } from '../types';
import { exportMappingsToCSV } from '../utils/exportUtils';
import { 
  Search, ShieldCheck, CheckCircle2, AlertCircle, Clock, 
  Target, FileText, Edit3, X, Check, Copy, Download, SlidersHorizontal, Eye, EyeOff, FileSpreadsheet
} from 'lucide-react';

interface MappingTableProps {
  mappings: Mapping[];
  onStatusChange: (mappingId: string, newStatus: number) => void;
  onMappingUpdate?: (mappingId: string, updatedFields: Partial<Mapping>) => void;
}

export function MappingTable({ mappings, onStatusChange, onMappingUpdate }: MappingTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCompactView, setShowCompactView] = useState<boolean>(false);
  
  // Modal for editing control criteria
  const [editingMapping, setEditingMapping] = useState<Mapping | null>(null);
  const [editStatus, setEditStatus] = useState<number>(0);
  const [editJustification, setEditJustification] = useState<string>('');
  const [editExpectedOutcome, setEditExpectedOutcome] = useState<string>('');
  const [editRequestedEvidence, setEditRequestedEvidence] = useState<string>('');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const getIsoControl = (id: string) => ISO_27001_CONTROLS_93.find(c => c.id === id);
  const getNistCategory = (id: string) => NIST_2_CATEGORIES.find(c => c.id === id);

  const filteredMappings = useMemo(() => {
    return mappings.filter(mapping => {
      const iso = getIsoControl(mapping.isoControlId);
      const nist = getNistCategory(mapping.nistCategoryId);

      // Domain filter
      if (selectedDomain !== 'ALL' && iso?.domain !== selectedDomain) {
        return false;
      }

      // Status filter
      if (statusFilter === 'COMPLETED' && mapping.implementationStatus < 90) return false;
      if (statusFilter === 'PROGRESS' && (mapping.implementationStatus < 1 || mapping.implementationStatus >= 90)) return false;
      if (statusFilter === 'PENDING' && mapping.implementationStatus > 0) return false;

      // Search filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesIso = iso?.id.toLowerCase().includes(q) || iso?.name.toLowerCase().includes(q);
        const matchesNist = nist?.id.toLowerCase().includes(q) || nist?.name.toLowerCase().includes(q);
        const matchesJust = mapping.justification?.toLowerCase().includes(q);
        const matchesOutcome = mapping.expectedOutcome?.toLowerCase().includes(q);
        const matchesEvidence = mapping.requestedEvidence?.toLowerCase().includes(q);
        return matchesIso || matchesNist || matchesJust || matchesOutcome || matchesEvidence;
      }

      return true;
    });
  }, [mappings, searchQuery, selectedDomain, statusFilter]);

  const handleOpenEdit = (mapping: Mapping) => {
    setEditingMapping(mapping);
    setEditStatus(mapping.implementationStatus);
    setEditJustification(mapping.justification || '');
    setEditExpectedOutcome(mapping.expectedOutcome || '');
    setEditRequestedEvidence(mapping.requestedEvidence || '');
  };

  const handleSaveEdit = () => {
    if (!editingMapping) return;

    const validStatus = Math.max(0, Math.min(100, Number(editStatus) || 0));

    if (onMappingUpdate) {
      onMappingUpdate(editingMapping.id, {
        implementationStatus: validStatus,
        justification: editJustification,
        expectedOutcome: editExpectedOutcome,
        requestedEvidence: editRequestedEvidence
      });
    } else {
      onStatusChange(editingMapping.id, validStatus);
    }

    setEditingMapping(null);
  };

  const handleQuickStatusInput = (mappingId: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(0, Math.min(100, num));
      onStatusChange(mappingId, clamped);
    } else if (value === '') {
      onStatusChange(mappingId, 0);
    }
  };

  const handleCopyEvidenceReport = () => {
    const lines = filteredMappings.map(m => {
      const iso = getIsoControl(m.isoControlId);
      return `[ISO ${m.isoControlId} - ${iso?.name || ''}] (${m.implementationStatus}% Implementado)
• Resultado Esperado: ${m.expectedOutcome || 'No especificado'}
• Evidencias a Solicitar: ${m.requestedEvidence || 'No especificadas'}
--------------------------------------------------`;
    });

    const reportText = `CHECKLIST DE SOLICITUD DE EVIDENCIAS PARA AUDITORÍA ISO 27001 / NIST CSF 2.0
Fecha de Generación: ${new Date().toLocaleDateString()}
Total de Controles: ${filteredMappings.length}

${lines.join('\n\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#c0a080]" />
            <h2 className="text-2xl font-serif text-[#c0a080] italic">
              Mapeo Múltiple de Controles & Criterios de Auditoría
            </h2>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#888]">
            Ajuste dinámico de estado de implementación (0-100%), metas esperadas y evidencias a solicitar para 93 Controles ISO/IEC 27001:2022 ➔ NIST CSF 2.0
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Export CSV / Excel */}
          <button
            onClick={() => exportMappingsToCSV(filteredMappings)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c0a080] hover:bg-[#b09070] text-black text-xs font-mono font-bold rounded-sm transition-colors shadow-xs"
            title="Exportar la lista actual de mapeos a formato CSV / Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar CSV / Excel</span>
          </button>

          {/* Export Evidence List */}
          <button
            onClick={handleCopyEvidenceReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-[#c0a080] text-xs font-mono rounded-sm transition-colors"
            title="Copiar informe de solicitud de evidencias al portapapeles"
          >
            {copiedToast ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedToast ? '¡Copiado!' : 'Copiar Solicitud de Evidencias'}</span>
          </button>

          {/* Toggle View Compact/Full */}
          <button
            onClick={() => setShowCompactView(!showCompactView)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222] text-[#888] hover:text-[#e0e0e0] text-xs font-mono rounded-sm transition-colors"
          >
            {showCompactView ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{showCompactView ? 'Vista Detallada' : 'Vista Compacta'}</span>
          </button>

          {/* Search Input */}
          <div className="relative flex-1 xl:w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="BUSCAR CONTROL, ESPERADO O EVIDENCIA..." 
              className="w-full pl-9 pr-4 py-1.5 bg-[#0f0f0f] border border-[#222] text-[#e0e0e0] rounded-sm focus:outline-none focus:border-[#c0a080] text-[11px] uppercase tracking-wider placeholder-[#555]"
            />
            <Search className="w-3.5 h-3.5 text-[#555] absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Domain & Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f0f0f] border border-[#222] p-2.5 rounded-sm">
        {/* Domain Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[10px] uppercase font-mono text-[#666] mr-1">Dominio ISO:</span>
          {['ALL', 'Organizacional', 'Personas', 'Físico', 'Tecnológico'].map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase transition-colors rounded-sm whitespace-nowrap ${
                selectedDomain === domain 
                  ? 'bg-[#c0a080] text-black font-bold' 
                  : 'bg-[#141414] text-[#888] hover:text-[#e0e0e0] border border-[#222]'
              }`}
            >
              {domain === 'ALL' ? 'Todos' : domain}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="text-[#666] uppercase mr-1">Estado:</span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2 py-0.5 rounded-sm border ${statusFilter === 'ALL' ? 'bg-[#222] text-[#e0e0e0] border-[#444]' : 'bg-[#111] text-[#666] border-[#1f1f1f]'}`}
          >
            Todos ({mappings.length})
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETED')}
            className={`px-2 py-0.5 rounded-sm border ${statusFilter === 'COMPLETED' ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40' : 'bg-[#111] text-[#666] border-[#1f1f1f]'}`}
          >
            Completados (≥90%)
          </button>
          <button
            onClick={() => setStatusFilter('PROGRESS')}
            className={`px-2 py-0.5 rounded-sm border ${statusFilter === 'PROGRESS' ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/40' : 'bg-[#111] text-[#666] border-[#1f1f1f]'}`}
          >
            En Progreso (1-89%)
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2 py-0.5 rounded-sm border ${statusFilter === 'PENDING' ? 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/40' : 'bg-[#111] text-[#666] border-[#1f1f1f]'}`}
          >
            Pendientes (0%)
          </button>
        </div>
      </div>

      {/* Main Mapping Table */}
      <div className="bg-[#0f0f0f] rounded-sm border border-[#222] overflow-hidden">
        <div className="p-3 bg-[#141414] border-b border-[#222] flex flex-wrap justify-between items-center text-xs font-mono text-[#888] gap-2">
          <span>Mostrando <strong className="text-[#e0e0e0]">{filteredMappings.length}</strong> de {mappings.length} controles alineados ISO ➔ NIST</span>
          <div className="flex items-center gap-3">
            <span className="text-[#c0a080] flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Edición Directa de Estado 0-100%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#121212] z-10 border-b border-[#222]">
              <tr className="text-[10px] uppercase tracking-widest text-[#666]">
                <th className="py-3 px-4 font-normal min-w-[180px]">ISO 27001 Control</th>
                <th className="py-3 px-4 font-normal min-w-[140px]">NIST CSF 2.0</th>
                {!showCompactView && (
                  <>
                    <th className="py-3 px-4 font-normal min-w-[220px]">El Esperado (Resultado)</th>
                    <th className="py-3 px-4 font-normal min-w-[240px]">Evidencias a Solicitar</th>
                  </>
                )}
                <th className="py-3 px-4 font-normal min-w-[200px]">Justificación Técnica</th>
                <th className="py-3 px-4 font-normal text-right min-w-[210px]">Estado de Implementación (%)</th>
                <th className="py-3 px-3 font-normal text-center w-12">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {filteredMappings.length === 0 ? (
                <tr>
                  <td colSpan={showCompactView ? 5 : 7} className="py-12 text-center text-[#666] font-mono text-xs">
                    No se encontraron controles que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredMappings.map((mapping) => {
                  const iso = getIsoControl(mapping.isoControlId);
                  const nist = getNistCategory(mapping.nistCategoryId);
                  const status = mapping.implementationStatus;

                  return (
                    <tr key={mapping.id} className="hover:bg-[#121212] transition-colors group">
                      {/* ISO Control */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-[#e0e0e0] text-base font-medium">{iso?.id || mapping.isoControlId}</span>
                        </div>
                        <div className="text-xs text-[#aaa] mt-0.5 leading-snug" title={iso?.name}>
                          {iso?.name || 'Control ISO 27001'}
                        </div>
                        <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#1a1a1a] border border-[#222] text-[#888] text-[9px] rounded-xs uppercase font-mono tracking-wider">
                          {iso?.domain || 'Anexo A'}
                        </span>
                      </td>

                      {/* NIST Category */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="font-serif text-[#c0a080] text-sm font-medium">{nist?.id || mapping.nistCategoryId}</div>
                        <div className="text-[11px] text-[#aaa] mt-0.5 leading-tight" title={nist?.name}>
                          {nist?.name || 'Categoría NIST'}
                        </div>
                      </td>

                      {/* El Esperado (Resultado) */}
                      {!showCompactView && (
                        <td className="py-3.5 px-4 align-top">
                          <div className="bg-[#141414] border border-[#222] p-2 rounded-xs space-y-1 group-hover:border-[#333] transition-colors">
                            <span className="text-[9px] uppercase font-mono font-bold text-[#c0a080] flex items-center gap-1">
                              <Target className="w-3 h-3 text-[#c0a080]" /> El Esperado:
                            </span>
                            <p className="text-[11px] text-[#ccc] leading-relaxed font-sans">
                              {mapping.expectedOutcome || 'Por definir resultado esperado.'}
                            </p>
                          </div>
                        </td>
                      )}

                      {/* Evidencias a Solicitar */}
                      {!showCompactView && (
                        <td className="py-3.5 px-4 align-top">
                          <div className="bg-[#141414] border border-[#222] p-2 rounded-xs space-y-1 group-hover:border-[#333] transition-colors">
                            <span className="text-[9px] uppercase font-mono font-bold text-[#38bdf8] flex items-center gap-1">
                              <FileText className="w-3 h-3 text-[#38bdf8]" /> Evidencias a Solicitar:
                            </span>
                            <p className="text-[11px] text-[#bbb] leading-relaxed font-sans">
                              {mapping.requestedEvidence || 'Por definir lista de evidencias.'}
                            </p>
                          </div>
                        </td>
                      )}

                      {/* Justificación */}
                      <td className="py-3.5 px-4 align-top">
                        <p className="text-xs text-[#aaa] leading-relaxed font-sans max-w-xs">{mapping.justification}</p>
                      </td>

                      {/* Estado de Implementación (0-100%) */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-col items-end space-y-2">
                          {/* Badge Status */}
                          <div className="flex items-center gap-2">
                            {status >= 90 ? (
                              <span className="flex items-center gap-1 text-[10px] text-[#10b981] font-mono bg-[#10b981]/10 px-2 py-0.5 rounded-xs border border-[#10b981]/20">
                                <CheckCircle2 className="w-3 h-3" /> Completo
                              </span>
                            ) : status >= 40 ? (
                              <span className="flex items-center gap-1 text-[10px] text-[#f59e0b] font-mono bg-[#f59e0b]/10 px-2 py-0.5 rounded-xs border border-[#f59e0b]/20">
                                <Clock className="w-3 h-3" /> En Progreso
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] text-[#ef4444] font-mono bg-[#ef4444]/10 px-2 py-0.5 rounded-xs border border-[#ef4444]/20">
                                <AlertCircle className="w-3 h-3" /> Pendiente
                              </span>
                            )}

                            {/* Direct Percentage Box Input */}
                            <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#333] px-1.5 py-0.5 rounded-xs">
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={status}
                                onChange={(e) => handleQuickStatusInput(mapping.id, e.target.value)}
                                className="w-10 bg-transparent text-right font-mono text-xs text-[#e0e0e0] focus:outline-none focus:text-[#c0a080] font-bold"
                              />
                              <span className="text-[10px] text-[#888] font-mono">%</span>
                            </div>
                          </div>

                          {/* Interactive Range Slider */}
                          <div className="flex items-center gap-2 w-full justify-end">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={mapping.implementationStatus}
                              onChange={(e) => onStatusChange(mapping.id, parseInt(e.target.value, 10))}
                              className="w-36 accent-[#c0a080] cursor-pointer"
                            />
                          </div>

                          {/* Quick Preset Buttons */}
                          <div className="flex items-center gap-1 text-[9px] font-mono">
                            <button 
                              onClick={() => onStatusChange(mapping.id, 0)}
                              className="px-1 py-0.2 bg-[#181818] hover:bg-[#252525] text-[#888] rounded-xs border border-[#222]"
                              title="Establecer a 0%"
                            >
                              0%
                            </button>
                            <button 
                              onClick={() => onStatusChange(mapping.id, 25)}
                              className="px-1 py-0.2 bg-[#181818] hover:bg-[#252525] text-[#888] rounded-xs border border-[#222]"
                              title="Establecer a 25%"
                            >
                              25%
                            </button>
                            <button 
                              onClick={() => onStatusChange(mapping.id, 50)}
                              className="px-1 py-0.2 bg-[#181818] hover:bg-[#252525] text-[#888] rounded-xs border border-[#222]"
                              title="Establecer a 50%"
                            >
                              50%
                            </button>
                            <button 
                              onClick={() => onStatusChange(mapping.id, 75)}
                              className="px-1 py-0.2 bg-[#181818] hover:bg-[#252525] text-[#888] rounded-xs border border-[#222]"
                              title="Establecer a 75%"
                            >
                              75%
                            </button>
                            <button 
                              onClick={() => onStatusChange(mapping.id, 100)}
                              className="px-1 py-0.2 bg-[#181818] hover:bg-[#252525] text-[#10b981] font-bold rounded-xs border border-[#10b981]/30"
                              title="Establecer a 100%"
                            >
                              100%
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Edit Button */}
                      <td className="py-3.5 px-3 align-top text-center">
                        <button
                          onClick={() => handleOpenEdit(mapping)}
                          className="p-1.5 bg-[#1a1a1a] hover:bg-[#282828] text-[#888] hover:text-[#c0a080] rounded-xs border border-[#222] transition-colors"
                          title="Editar resultado esperado y evidencias"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL FOR CRITERIA AND EVIDENCE */}
      {editingMapping && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[#333] rounded-sm max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-[#222] pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#c0a080]">
                  Criterios de Auditoría ISO {editingMapping.isoControlId} ➔ NIST {editingMapping.nistCategoryId}
                </span>
                <h3 className="text-lg font-serif text-[#e0e0e0] mt-1">
                  Editar Esperado, Evidencias & Estado
                </h3>
              </div>
              <button 
                onClick={() => setEditingMapping(null)}
                className="text-[#666] hover:text-[#e0e0e0] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {/* Implementation Status (0-100%) */}
              <div className="bg-[#141414] p-3 border border-[#222] rounded-xs space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono text-[#c0a080] uppercase tracking-wider font-bold">
                    Estado de Implementación del Control (%):
                  </label>
                  <span className="font-mono text-sm text-[#e0e0e0] font-bold">{editStatus}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={editStatus}
                    onChange={(e) => setEditStatus(parseInt(e.target.value, 10))}
                    className="flex-1 accent-[#c0a080] cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editStatus}
                    onChange={(e) => setEditStatus(Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0)))}
                    className="w-16 bg-[#0f0f0f] border border-[#333] px-2 py-1 text-right text-xs text-[#e0e0e0] font-mono"
                  />
                </div>
              </div>

              {/* El Esperado (Resultado Esperado) */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#c0a080] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <Target className="w-3.5 h-3.5" /> El Esperado (Resultado Esperado / Meta del Control):
                </label>
                <textarea
                  rows={3}
                  value={editExpectedOutcome}
                  onChange={(e) => setEditExpectedOutcome(e.target.value)}
                  placeholder="Escriba el resultado o entregable esperado del control..."
                  className="w-full bg-[#141414] border border-[#222] text-[#e0e0e0] p-2.5 rounded-xs focus:outline-none focus:border-[#c0a080] text-xs leading-relaxed"
                />
              </div>

              {/* Evidencias a Solicitar */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                  <FileText className="w-3.5 h-3.5" /> Evidencias a Solicitar (Artefactos para Auditoría):
                </label>
                <textarea
                  rows={3}
                  value={editRequestedEvidence}
                  onChange={(e) => setEditRequestedEvidence(e.target.value)}
                  placeholder="Enumere los documentos, registros o logs que se deben solicitar..."
                  className="w-full bg-[#141414] border border-[#222] text-[#e0e0e0] p-2.5 rounded-xs focus:outline-none focus:border-[#38bdf8] text-xs leading-relaxed"
                />
              </div>

              {/* Justificación de Mapeo */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#888] uppercase tracking-wider font-bold">
                  Justificación Técnica del Mapeo Normativo:
                </label>
                <textarea
                  rows={2}
                  value={editJustification}
                  onChange={(e) => setEditJustification(e.target.value)}
                  className="w-full bg-[#141414] border border-[#222] text-[#ccc] p-2 rounded-xs focus:outline-none focus:border-[#c0a080] text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center gap-3 border-t border-[#222] pt-4">
              <button
                type="button"
                onClick={() => setEditingMapping(null)}
                className="px-4 py-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#222] text-[#888] hover:text-[#e0e0e0] text-xs font-mono rounded-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-[#c0a080] hover:bg-[#d0b090] text-black font-bold text-xs font-mono rounded-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Guardar Criterios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
