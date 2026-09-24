import React from 'react';
import { AuditLog } from '../types';
import { Download, FileSearch, History } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AuditorViewProps {
  logs: AuditLog[];
}

export function AuditorView({ logs }: AuditorViewProps) {
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Fecha,Usuario,Acción,Detalles\n"
      + logs.map(l => `${l.id},${l.timestamp},${l.user},${l.action},"${l.details}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "log_auditoria_mappings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-serif text-3xl font-light tracking-tight text-[#e0e0e0]">Vista de Auditor</h2>
          <p className="text-[#888] text-sm mt-1 uppercase tracking-widest">Log Histórico de Modificaciones</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-[#c0a080] hover:bg-[#b09070] text-[#050505] px-6 py-2.5 rounded-sm font-medium text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar Log a CSV
        </button>
      </div>

      <div className="bg-[#0f0f0f] border border-[#222] rounded-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#151515] text-[10px] uppercase tracking-widest text-[#888] border-b border-[#222]">
              <tr>
                <th className="py-4 px-6 font-normal">Fecha y Hora</th>
                <th className="py-4 px-6 font-normal">Usuario</th>
                <th className="py-4 px-6 font-normal">Acción</th>
                <th className="py-4 px-6 font-normal">Detalle Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#111] transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap text-[#888] text-xs">
                    {format(new Date(log.timestamp), "dd MMM yyyy, HH:mm:ss", { locale: es })}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2 py-0.5 bg-[#1a1a1a] border border-[#222] text-[#c0a080] text-[9px] rounded-sm uppercase tracking-widest">
                      {log.user}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[#ccc] text-xs">
                    {log.action}
                  </td>
                  <td className="py-4 px-6 text-[#888] text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#888] text-sm">
                    No se encontraron registros de auditoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
