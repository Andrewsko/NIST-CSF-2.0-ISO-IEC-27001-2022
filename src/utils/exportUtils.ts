import { Mapping, ProjectTask, ProfileScore } from '../types';
import { ISO_27001_CONTROLS_93 } from '../data/iso27001Data';
import { NIST_2_CATEGORIES } from '../data/nist2Data';
import { IsoMetrics } from '../components/Dashboard';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to escape CSV cell content
function escapeCSV(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

// Helper to trigger file download in browser
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports mappings (ISO 27001 ➔ NIST CSF 2.0) to Excel-compatible CSV with UTF-8 BOM
 */
export function exportMappingsToCSV(mappings: Mapping[]) {
  const headers = [
    'ID Control ISO',
    'Nombre Control ISO',
    'Dominio ISO',
    'ID Categoría NIST',
    'Nombre Categoría NIST',
    'Estado Implementación (%)',
    'Nivel Estado',
    'El Esperado (Resultado)',
    'Evidencias a Solicitar',
    'Justificación Mapeo Normativo'
  ];

  const rows = mappings.map(m => {
    const iso = ISO_27001_CONTROLS_93.find(c => c.id === m.isoControlId);
    const nist = NIST_2_CATEGORIES.find(c => c.id === m.nistCategoryId);
    const statusVal = m.implementationStatus;
    const statusText = statusVal >= 90 ? 'Completo' : statusVal >= 40 ? 'En Progreso' : 'Pendiente';

    return [
      escapeCSV(m.isoControlId),
      escapeCSV(iso?.name || 'Control ISO'),
      escapeCSV(iso?.domain || 'Anexo A'),
      escapeCSV(m.nistCategoryId),
      escapeCSV(nist?.name || 'Categoría NIST'),
      escapeCSV(m.implementationStatus),
      escapeCSV(statusText),
      escapeCSV(m.expectedOutcome || ''),
      escapeCSV(m.requestedEvidence || ''),
      escapeCSV(m.justification || '')
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(csvContent, `Mapeo_Controles_ISO27001_NISTCSF2.0_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

const FUNCTION_NAMES: Record<string, string> = {
  GV: 'Gobernanza',
  ID: 'Identificación',
  PR: 'Protección',
  DE: 'Detección',
  RS: 'Respuesta',
  RC: 'Recuperación'
};

// Helper to parse numeric dollar value from string like "$35,000 USD"
function parseBudgetNumber(str: string | undefined): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

// Helper to compute duration in days
function calculateDurationDays(startStr: string, endStr: string): number {
  try {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    if (isNaN(start) || isNaN(end)) return 30;
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  } catch {
    return 30;
  }
}

/**
 * Exports project schedule (Cronograma) to Excel-compatible CSV with UTF-8 BOM
 */
export function exportProjectsToCSV(projects: ProjectTask[]) {
  exportGanttToExcel(projects);
}

/**
 * Exports GANTT schedule optimized for Excel with Duration in Days, Clean Numeric Budget & Milestones
 */
export function exportGanttToExcel(projects: ProjectTask[]) {
  const headers = [
    'WBS Task ID',
    'Nombre de la Iniciativa',
    'Fecha Inicio (YYYY-MM-DD)',
    'Fecha Fin (YYYY-MM-DD)',
    'Duracion (Dias)',
    'Avance (%)',
    'Estado',
    'Prioridad',
    'Presupuesto (USD Numeric)',
    'Presupuesto Formateado',
    'Area / Departamento',
    'Lider / Responsable',
    'Codigo Funcion NIST',
    'Nombre Funcion NIST',
    'Categoria NIST',
    'Control ISO Mapeado',
    'Total Hitos (Milestones)',
    'Detalle de Hitos',
    'Metricas KPI de Exito',
    'Impacto Madurez Proyectado',
    'Fundamentacion Normativa'
  ];

  const rows = projects.map(p => {
    const durationDays = calculateDurationDays(p.startDate, p.endDate);
    const numericBudget = parseBudgetNumber(p.resources);
    const fnName = FUNCTION_NAMES[p.functionCode] || p.functionCode;
    const milestonesStr = p.milestones ? p.milestones.map(m => `[${m.status === 'Completado' ? 'X' : ' '}] ${m.name} (${m.date})`).join('; ') : 'Sin hitos';

    return [
      escapeCSV(p.id),
      escapeCSV(p.name),
      escapeCSV(p.startDate),
      escapeCSV(p.endDate),
      escapeCSV(durationDays),
      escapeCSV(p.progress),
      escapeCSV(p.status),
      escapeCSV(p.priority),
      escapeCSV(numericBudget),
      escapeCSV(p.resources),
      escapeCSV(p.owner),
      escapeCSV(p.roleResponsible || 'Asignado'),
      escapeCSV(p.functionCode),
      escapeCSV(fnName),
      escapeCSV(p.nistCategoryId),
      escapeCSV(p.isoControlId || 'N/A'),
      escapeCSV(p.milestones ? p.milestones.length : 0),
      escapeCSV(milestonesStr),
      escapeCSV(p.metrics),
      escapeCSV(p.maturityProjection || ''),
      escapeCSV(p.mappingJustification || '')
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(csvContent, `GANTT_Cronograma_Excel_ISO27001_NIST_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports GANTT schedule formatted specifically as a Power BI Star-Schema Dataset
 */
export function exportGanttToPowerBI(projects: ProjectTask[]) {
  const headers = [
    'Iniciativa_ID',
    'Iniciativa_Nombre',
    'Fecha_Inicio',
    'Fecha_Fin',
    'Duracion_Dias',
    'Porcentaje_Avance',
    'Estado_Codigo',
    'Prioridad_Nivel',
    'Presupuesto_USD',
    'Departamento_Owner',
    'Rol_Responsable',
    'NIST_Funcion_Codigo',
    'NIST_Funcion_Nombre',
    'NIST_Categoria_ID',
    'ISO_27001_Control_ID',
    'Total_Hitos',
    'Hitos_Completados',
    'Metrica_KPI',
    'Proyeccion_Madurez',
    'SLA_Estado_Riesgo'
  ];

  const rows = projects.map(p => {
    const durationDays = calculateDurationDays(p.startDate, p.endDate);
    const numericBudget = parseBudgetNumber(p.resources);
    const fnName = FUNCTION_NAMES[p.functionCode] || p.functionCode;
    const completedMilestones = p.milestones ? p.milestones.filter(m => m.status === 'Completado').length : 0;
    const slaRisk = p.progress < 25 && p.priority === 'Crítica' ? 'Riesgo Alto' : p.progress >= 90 ? 'En Regla' : 'En Seguimiento';

    return [
      escapeCSV(p.id),
      escapeCSV(p.name),
      escapeCSV(p.startDate),
      escapeCSV(p.endDate),
      escapeCSV(durationDays),
      escapeCSV(p.progress),
      escapeCSV(p.status),
      escapeCSV(p.priority),
      escapeCSV(numericBudget),
      escapeCSV(p.owner),
      escapeCSV(p.roleResponsible || 'Asignado'),
      escapeCSV(p.functionCode),
      escapeCSV(fnName),
      escapeCSV(p.nistCategoryId),
      escapeCSV(p.isoControlId || 'N/A'),
      escapeCSV(p.milestones ? p.milestones.length : 0),
      escapeCSV(completedMilestones),
      escapeCSV(p.metrics),
      escapeCSV(p.maturityProjection || ''),
      escapeCSV(slaRisk)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(','), ...rows].join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(csvContent, `PowerBI_Dataset_GANTT_Ciberseguridad_${dateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports GANTT dataset in JSON format for Power BI REST API / Web connector feed
 */
export function exportGanttToJSON(projects: ProjectTask[]) {
  const formattedProjects = projects.map(p => {
    const durationDays = calculateDurationDays(p.startDate, p.endDate);
    const numericBudget = parseBudgetNumber(p.resources);
    const fnName = FUNCTION_NAMES[p.functionCode] || p.functionCode;

    return {
      iniciativaId: p.id,
      nombre: p.name,
      fechaInicio: p.startDate,
      fechaFin: p.endDate,
      duracionDias: durationDays,
      porcentajeAvance: p.progress,
      estado: p.status,
      prioridad: p.priority,
      presupuestoUSD: numericBudget,
      presupuestoTexto: p.resources,
      departamentoOwner: p.owner,
      rolResponsable: p.roleResponsible || 'Asignado',
      nistFuncionCodigo: p.functionCode,
      nistFuncionNombre: fnName,
      nistCategoriaId: p.nistCategoryId,
      isoControlId: p.isoControlId || 'N/A',
      metricasKPI: p.metrics,
      proyeccionMadurez: p.maturityProjection || '',
      hitos: p.milestones || []
    };
  });

  const jsonStr = JSON.stringify(formattedProjects, null, 2);
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadFile(jsonStr, `PowerBI_Datafeed_GANTT_${dateStr}.json`, 'application/json');
}

/**
 * Generates a Power Query M-Code Snippet for Power BI Advanced Editor
 */
export function generatePowerBIMCodeSnippet(projects: ProjectTask[]): string {
  return `// CÓDIGO POWER QUERY M PARA POWER BI DESKTOP
// Copie este código y péguelo en "Editor Avanzado" en Power BI Desktop
let
    // Reemplace la ruta de archivo local según su equipo
    Source = Csv.Document(File.Contents("C:\\Ruta\\A\\PowerBI_Dataset_GANTT_Ciberseguridad.csv"),[Delimiter=",", Columns=20, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"Iniciativa_ID", type text},
        {"Iniciativa_Nombre", type text},
        {"Fecha_Inicio", type date},
        {"Fecha_Fin", type date},
        {"Duracion_Dias", Int64.Type},
        {"Porcentaje_Avance", Int64.Type},
        {"Estado_Codigo", type text},
        {"Prioridad_Nivel", type text},
        {"Presupuesto_USD", Currency.Type},
        {"Departamento_Owner", type text},
        {"Rol_Responsable", type text},
        {"NIST_Funcion_Codigo", type text},
        {"NIST_Funcion_Nombre", type text},
        {"NIST_Categoria_ID", type text},
        {"ISO_27001_Control_ID", type text},
        {"Total_Hitos", Int64.Type},
        {"Hitos_Completados", Int64.Type},
        {"Metrica_KPI", type text},
        {"Proyeccion_Madurez", type text},
        {"SLA_Estado_Riesgo", type text}
    })
in
    #"Changed Type"`;
}

/**
 * Generates and downloads a high-quality, professional executive PDF report
 */
export function generateExecutiveReportPDF(
  scores: ProfileScore[],
  projects: ProjectTask[],
  isoMetrics?: IsoMetrics
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const avgCurrent = scores.reduce((acc, curr) => acc + curr.current, 0) / (scores.length || 1);
  const isoPercent = isoMetrics?.overallIsoPercent ?? 82;
  const nistPercent = isoMetrics?.nistOverallPercent ?? 70;
  const globalPercent = isoMetrics?.globalCompliancePercent ?? 76;
  const currentDateStr = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Page Colors
  const darkBg = [15, 15, 15]; // #0f0f0f
  const goldAccent = [192, 160, 128]; // #c0a080
  const headerGray = [30, 30, 30];

  // Helper for Header banner on PDF
  const drawHeader = (pageTitle: string) => {
    // Dark top banner
    doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
    doc.rect(0, 0, 210, 28, 'F');

    // Gold accent bar
    doc.setFillColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.rect(0, 27, 210, 1.5, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('INFORMES DE CIBERGOBERNANZA INTEGRADA ISO 27001 / NIST CSF 2.0', 14, 12);

    doc.setTextColor(goldAccent[0], goldAccent[1], goldAccent[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(pageTitle.toUpperCase(), 14, 19);

    doc.setTextColor(180, 180, 180);
    doc.setFontSize(8);
    doc.text(`Fecha: ${currentDateStr}`, 196, 19, { align: 'right' });
  };

  // Helper for Footer
  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 282, 196, 282);

    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('CONFIDENCIAL — USO EXCLUSIVO DE LA ALTA DIRECCIÓN Y AUDITORÍA', 14, 287);
    doc.text(`Página ${pageNum} de ${totalPages}`, 196, 287, { align: 'right' });
  };

  // ==================== PAGE 1: RESUMEN EJECUTIVO & KPIs ====================
  drawHeader('Resumen Ejecutivo para la Alta Dirección');

  let yPos = 38;

  // Title section
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Informe Ejecutivo de Postura de Ciberseguridad', 14, yPos);
  yPos += 7;

  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.text('Alineación Estratégica entre ISO/IEC 27001:2022 y NIST Cybersecurity Framework 2.0', 14, yPos);
  yPos += 10;

  // KPI Boxes
  const kpiY = yPos;
  const kpiWidth = 56;
  const kpiHeight = 22;

  // KPI 1: Madurez
  doc.setFillColor(245, 245, 247);
  doc.setDrawColor(220, 220, 225);
  doc.roundedRect(14, kpiY, kpiWidth, kpiHeight, 1.5, 1.5, 'FD');
  
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('MADUREZ PROMEDIO NIST', 18, kpiY + 6);

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${avgCurrent.toFixed(2)} / 5.0`, 18, kpiY + 15);

  // KPI 2: Cobertura ISO
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(77, kpiY, kpiWidth, kpiHeight, 1.5, 1.5, 'FD');

  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('COBERTURA ISO 27001:2022', 81, kpiY + 6);

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${isoPercent}%`, 81, kpiY + 15);

  // KPI 3: Cumplimiento Global
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(140, kpiY, kpiWidth, kpiHeight, 1.5, 1.5, 'FD');

  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('CUMPLIMIENTO GLOBAL', 144, kpiY + 6);

  doc.setTextColor(192, 120, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${globalPercent}%`, 144, kpiY + 15);

  yPos += kpiHeight + 12;

  // Executive Statement Block
  doc.setFillColor(250, 248, 245);
  doc.setDrawColor(192, 160, 128);
  doc.rect(14, yPos, 182, 38, 'FD');

  doc.setFillColor(192, 160, 128);
  doc.rect(14, yPos, 2, 38, 'F'); // Left accent bar

  doc.setTextColor(120, 90, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DECLARACIÓN EJECUTIVA DE CIBERGOBERNANZA', 20, yPos + 7);

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const execText = `Se ha completado la evaluación de cumplimiento operativo integrando los 93 controles de ISO/IEC 27001:2022 y las 106 subcategorías del marco NIST CSF 2.0. La organización presenta un índice global de cumplimiento del ${globalPercent}% y un nivel de madurez técnica general de ${avgCurrent.toFixed(2)} sobre 5.0. Las inversiones de remediación deben focalizarse prioritariamente en las brechas identificadas en las funciones de Gobierno (GV) y Protección (PR).`;
  
  const splitExec = doc.splitTextToSize(execText, 170);
  doc.text(splitExec, 20, yPos + 14);

  yPos += 46;

  // Table 1: Function Maturity Scores
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Diagnóstico de Madurez por Función NIST CSF 2.0', 14, yPos);
  yPos += 4;

  const scoresTableData = scores.map(s => {
    const gap = (s.target - s.current).toFixed(2);
    const gapNum = s.target - s.current;
    const statusText = gapNum >= 1.5 ? 'CRÍTICO' : gapNum >= 0.8 ? 'ATENCIÓN' : 'ADECUADO';

    const fnName = FUNCTION_NAMES[s.function] || s.function;
    return [
      `${s.function} - ${fnName}`,
      `${s.current.toFixed(2)} / 5.0`,
      `${s.target.toFixed(2)} / 5.0`,
      `${gap} Pts`,
      statusText
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Función NIST', 'Madurez Actual', 'Perfil Objetivo', 'Brecha (Gap)', 'Estado de Riesgo']],
    body: scoresTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: 'bold' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 28, halign: 'center' },
      4: { cellWidth: 34, halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'CRÍTICO') {
          data.cell.styles.textColor = [220, 38, 38];
        } else if (data.cell.raw === 'ATENCIÓN') {
          data.cell.styles.textColor = [217, 119, 6];
        } else {
          data.cell.styles.textColor = [16, 185, 129];
        }
      }
    }
  });

  // Table 2: Critical Initiatives
  // @ts-expect-error autoTable adds lastAutoTable to doc
  yPos = doc.lastAutoTable.finalY + 12;

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Iniciativas de Remediación Prioritarias (Brechas Críticas)', 14, yPos);
  yPos += 4;

  const projectRows = projects
    .filter(p => p.priority === 'Crítica' || p.priority === 'Alta')
    .slice(0, 6)
    .map(p => [
      p.name,
      `NIST ${p.nistCategoryId}`,
      p.priority,
      p.owner,
      p.resources.split('|')[0]?.trim() || p.resources,
      `${p.progress}% (${p.status})`
    ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Iniciativa Estratégica', 'Categoría', 'Prioridad', 'Líder / Área', 'Presupuesto', 'Avance (%)']],
    body: projectRows.length > 0 ? projectRows : [['Todas las áreas cumplen el perfil objetivo', 'N/A', 'Baja', 'CISO', '$0 USD', '100%']],
    theme: 'grid',
    headStyles: {
      fillColor: [192, 160, 128],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [50, 50, 50]
    },
    columnStyles: {
      0: { cellWidth: 58, fontStyle: 'bold' },
      1: { cellWidth: 24, halign: 'center' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 28 },
      4: { cellWidth: 26, halign: 'right' },
      5: { cellWidth: 24, halign: 'center' }
    }
  });

  // Signatures Section on bottom of Page 1 or Page 2
  // @ts-expect-error autoTable adds lastAutoTable to doc
  let sigY = doc.lastAutoTable.finalY + 18;
  if (sigY > 240) {
    doc.addPage();
    drawHeader('Aprobación y Firmas Institucionales');
    sigY = 45;
  }

  doc.setLineWidth(0.4);
  doc.setDrawColor(180, 180, 180);
  
  // Signature Box 1
  doc.line(20, sigY, 85, sigY);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CISO / Director de Ciberseguridad', 52.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Aprobación de la Evaluación de Riesgos', 52.5, sigY + 9, { align: 'center' });

  // Signature Box 2
  doc.line(125, sigY, 190, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Comité de Auditoría / Alta Dirección', 157.5, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Conformidad del Plan de Remediación', 157.5, sigY + 9, { align: 'center' });

  // Draw footer for Page 1
  drawFooter(1, 1);

  // Save PDF file
  const fileDateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Reporte_Ejecutivo_Cibergobernanza_${fileDateStr}.pdf`);
}

/**
 * Export Non-Negotiable Recommendations to structured CSV (Excel Ready)
 */
export function exportNonNegotiablesToCSV(
  recommendations: Array<{
    id: string;
    code: string;
    title: string;
    shortName: string;
    pillar: string;
    criticality: string;
    nistFunction: string;
    nistSubcategories: string[];
    isoControls: string[];
    whyNonNegotiable: string;
    expectedState: string;
    mandatorySLAs: string[];
    auditEvidenceRequired: string[];
    verificationCommand: string;
  }>,
  appliedStatus: Record<string, boolean>
) {
  const headers = [
    'Código No Negociable',
    'Título de la Recomendación',
    'Pilar de Seguridad',
    'Criticidad',
    'Estado de Aplicación',
    'Función NIST CSF 2.0',
    'Subcategorías NIST Vinculadas',
    'Controles ISO 27001:2022',
    'Por qué es No Negociable (Riesgo)',
    'Resultado Esperado (Línea Base)',
    'SLAs Obligatorios',
    'Evidencias de Auditoría Requeridas',
    'Comando de Verificación Técnica'
  ];

  const rows = recommendations.map(rec => {
    const isEnforced = !!appliedStatus[rec.id];
    return [
      escapeCSV(rec.code),
      escapeCSV(rec.title),
      escapeCSV(rec.pillar),
      escapeCSV(rec.criticality),
      escapeCSV(isEnforced ? 'GARANTIZADO 100% (EN VIGOR)' : 'PENDIENTE DE REMEDIACIÓN'),
      escapeCSV(rec.nistFunction),
      escapeCSV(rec.nistSubcategories.join(', ')),
      escapeCSV(rec.isoControls.join(', ')),
      escapeCSV(rec.whyNonNegotiable),
      escapeCSV(rec.expectedState),
      escapeCSV(rec.mandatorySLAs.join(' | ')),
      escapeCSV(rec.auditEvidenceRequired.join('; ')),
      escapeCSV(rec.verificationCommand)
    ];
  });

  const csvContent = '\uFEFF' + [
    headers.join(';'),
    ...rows.map(r => r.join(';'))
  ].join('\r\n');

  const fileDateStr = new Date().toISOString().slice(0, 10);
  downloadFile(csvContent, `Recomendaciones_No_Negociables_NIST2_ISO27001_${fileDateStr}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export Non-Negotiable Recommendations Playbook to Markdown format for Devs/SysAdmins
 */
export function exportNonNegotiablesPlaybookMarkdown(
  recommendations: Array<{
    id: string;
    code: string;
    title: string;
    shortName: string;
    pillar: string;
    criticality: string;
    nistFunction: string;
    nistSubcategories: string[];
    isoControls: string[];
    whyNonNegotiable: string;
    expectedState: string;
    mandatorySLAs: string[];
    auditEvidenceRequired: string[];
    verificationCommand: string;
    implementationPhases: Array<{
      phaseNumber: number;
      phaseName: string;
      description: string;
      actionItems: string[];
      deliverable: string;
    }>;
    technicalSnippets: Array<{
      title: string;
      technology: string;
      language: string;
      code: string;
      explanation: string;
    }>;
  }>,
  appliedStatus: Record<string, boolean>
) {
  const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  
  let md = `# MANUAL TÉCNICO Y PLAYBOOK DE SALVAGUARDAS NO NEGOCIABLES
## Alineación Mandatoria NIST CSF 2.0 & ISO/IEC 27001:2022
**Fecha de Emisión:** ${dateStr}  
**Clasificación:** Confidencial / Uso Interno TI & CISO  
**Objetivo:** Establecer la línea base de controles técnicos y de gobierno ineludibles para mitigar riesgos críticos y garantizar el cumplimiento regulatorio y de certificación.

---

## ÍNDICE DE CONTROLES NO NEGOCIABLES

${recommendations.map((r, i) => `${i + 1}. [${r.title}](#${r.id}) — **${appliedStatus[r.id] ? '✅ APLICADO Y GARANTIZADO' : '⚠️ PENDIENTE'}**`).join('\n')}

---

`;

  recommendations.forEach((rec, idx) => {
    const isEnforced = appliedStatus[rec.id];
    md += `\n<a id="${rec.id}"></a>\n`;
    md += `## ${idx + 1}. ${rec.title}\n\n`;
    md += `- **Código:** \`${rec.code}\`\n`;
    md += `- **Pilar:** ${rec.pillar}\n`;
    md += `- **Criticidad:** ${rec.criticality}\n`;
    md += `- **Estado Actual:** ${isEnforced ? '🟢 **GARANTIZADO 100% & EN VIGOR**' : '🔴 **PENDIENTE DE APLICACIÓN**'}\n`;
    md += `- **Alineación Normativa:**\n`;
    md += `  - **NIST CSF 2.0:** ${rec.nistSubcategories.map(s => `\`${s}\``).join(', ')} (Función: ${rec.nistFunction})\n`;
    md += `  - **ISO/IEC 27001:2022:** ${rec.isoControls.map(c => `\`Control ${c}\``).join(', ')}\n\n`;

    md += `### 📌 Por qué es No Negociable (Riesgo y Justificación de Auditoría)\n`;
    md += `${rec.whyNonNegotiable}\n\n`;

    md += `### 🎯 Estado Objetivo Mandatorio (Línea Base)\n`;
    md += `${rec.expectedState}\n\n`;

    md += `### ⏱️ SLAs y Métricas Obligatorias\n`;
    rec.mandatorySLAs.forEach(sla => {
      md += `- ${sla}\n`;
    });
    md += `\n`;

    md += `### 📋 Evidencias Requeridas para Auditoría Externa\n`;
    rec.auditEvidenceRequired.forEach(ev => {
      md += `- [ ] ${ev}\n`;
    });
    md += `\n`;

    md += `### 💻 Comando de Verificación Automatizada\n`;
    md += `\`\`\`bash\n${rec.verificationCommand}\n\`\`\`\n\n`;

    md += `### 🛠️ Guía de Implementación Paso a Paso\n\n`;
    rec.implementationPhases.forEach(ph => {
      md += `#### Fase ${ph.phaseNumber}: ${ph.phaseName}\n`;
      md += `${ph.description}\n\n`;
      md += `**Acciones Clave:**\n`;
      ph.actionItems.forEach(a => {
        md += `- ${a}\n`;
      });
      md += `\n**Entregable:** \`${ph.deliverable}\`\n\n`;
    });

    if (rec.technicalSnippets && rec.technicalSnippets.length > 0) {
      md += `### 🔧 Configuraciones Técnicas y Scripts de Hardening\n\n`;
      rec.technicalSnippets.forEach(snip => {
        md += `#### ${snip.title} (${snip.technology})\n`;
        md += `\`\`\`${snip.language}\n${snip.code}\n\`\`\`\n`;
        md += `*${snip.explanation}*\n\n`;
      });
    }

    md += `---\n`;
  });

  md += `\n## CONSTANCIA DE AUDITORÍA Y CERTIFICACIÓN
Este documento constituye el estándar de referencia de seguridad informática institucional. Toda excepción debe ser autorizada por escrito por el CISO y el Comité de Seguridad de la Información.
`;

  const fileDateStr = new Date().toISOString().slice(0, 10);
  downloadFile(md, `Playbook_Tecnico_No_Negociables_${fileDateStr}.md`, 'text/markdown;charset=utf-8;');
}

/**
 * Generate PDF Certificate of Non-Negotiables Enforcement
 */
export function generateNonNegotiablesCertificatePDF(
  recommendations: Array<{
    id: string;
    code: string;
    title: string;
    shortName: string;
    pillar: string;
    criticality: string;
    nistSubcategories: string[];
    isoControls: string[];
  }>,
  appliedStatus: Record<string, boolean>
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const total = recommendations.length;
  const appliedCount = recommendations.filter(r => appliedStatus[r.id]).length;
  const pct = Math.round((appliedCount / total) * 100);

  // Background frame
  doc.setFillColor(250, 250, 252);
  doc.rect(0, 0, 210, 297, 'F');

  // Border frame
  doc.setDrawColor(192, 160, 128);
  doc.setLineWidth(1.2);
  doc.rect(10, 10, 190, 277);

  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, 186, 273);

  // Title
  doc.setTextColor(192, 160, 128);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CERTIFICADO DE CONFORMIDAD TÉCNICA', 105, 30, { align: 'center' });

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.text('LÍNEA BASE DE RECOMENDACIONES NO NEGOCIABLES', 105, 38, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Convergencia Crítica NIST CSF 2.0 & ISO/IEC 27001:2022', 105, 44, { align: 'center' });

  // Badge Status
  const badgeY = 54;
  doc.setFillColor(pct === 100 ? 236 : 254, pct === 100 ? 253 : 243, pct === 100 ? 245 : 199);
  doc.setDrawColor(pct === 100 ? 16 : 245, pct === 100 ? 185 : 158, pct === 100 ? 129 : 11);
  doc.roundedRect(45, badgeY, 120, 18, 3, 3, 'FD');

  doc.setTextColor(pct === 100 ? 6 : 146, pct === 100 ? 95 : 64, pct === 100 ? 70 : 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(
    pct === 100 ? `100% GARANTIZADO (${total}/${total} SALVAGUARDAS EN VIGOR)` : `COBERTURA PARCIAL: ${pct}% (${appliedCount}/${total} APLICADAS)`,
    105,
    badgeY + 11,
    { align: 'center' }
  );

  // Table
  const tableData = recommendations.map(rec => {
    const isEnforced = appliedStatus[rec.id];
    return [
      rec.code,
      rec.shortName,
      rec.pillar,
      `NIST: ${rec.nistSubcategories.length} | ISO: ${rec.isoControls.length}`,
      isEnforced ? 'GARANTIZADO' : 'PENDIENTE'
    ];
  });

  autoTable(doc, {
    startY: 80,
    head: [['Código', 'Salvaguarda No Negociable', 'Pilar', 'Controles Cruzados', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [50, 50, 50]
    },
    columnStyles: {
      0: { cellWidth: 26, fontStyle: 'bold' },
      1: { cellWidth: 64, fontStyle: 'bold' },
      2: { cellWidth: 36 },
      3: { cellWidth: 32, halign: 'center' },
      4: { cellWidth: 28, halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 4) {
        if (data.cell.raw === 'GARANTIZADO') {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [220, 38, 38];
        }
      }
    }
  });

  // Footer & Signatures
  // @ts-expect-error autoTable adds lastAutoTable to doc
  const finalY = Math.min(240, doc.lastAutoTable.finalY + 16);

  doc.setLineWidth(0.4);
  doc.setDrawColor(180, 180, 180);

  doc.line(25, finalY, 85, finalY);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('CISO / Responsable de Seguridad', 55, finalY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Verificación de Enforzamiento Técnico', 55, finalY + 9, { align: 'center' });

  doc.line(125, finalY, 185, finalY);
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Auditor Líder ISO 27001 / NIST', 155, finalY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Atestación de Cumplimiento', 155, finalY + 9, { align: 'center' });

  const fileDateStr = new Date().toISOString().slice(0, 10);
  doc.save(`Certificado_No_Negociables_${fileDateStr}.pdf`);
}
