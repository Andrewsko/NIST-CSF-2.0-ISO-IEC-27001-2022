import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CustomFramework } from '../types';

export function exportFrameworksToCSV(frameworks: CustomFramework[]): void {
  const headers = [
    'Marco',
    'Código Control',
    'Dominio',
    'Título',
    'Requerimiento',
    'Función NIST CSF 2.0',
    'Control ISO 27001:2022',
    'Solapamiento (%)',
    'Estado Cobertura',
    'Estado Cumplimiento',
    'Evidencias de Auditoría Sugeridas',
    'Acción de Remediación',
    'Responsable'
  ];

  const rows: string[][] = [];

  for (const fw of frameworks) {
    for (const ctrl of fw.controls) {
      rows.push([
        `"${fw.name.replace(/"/g, '""')}"`,
        `"${ctrl.code.replace(/"/g, '""')}"`,
        `"${ctrl.domainName.replace(/"/g, '""')}"`,
        `"${ctrl.title.replace(/"/g, '""')}"`,
        `"${ctrl.requirement.replace(/"/g, '""')}"`,
        `"${ctrl.mappedNistId} - ${ctrl.mappedNistName || ''}"`,
        `"${ctrl.mappedIsoId} - ${ctrl.mappedIsoName || ''}"`,
        `"${ctrl.overlapScore}%"`,
        `"${ctrl.status === 'covered' ? 'Cubierto por Línea Base' : ctrl.status === 'partial' ? 'Parcialmente Cubierto' : 'Brecha / Gap'}"`,
        `"${ctrl.complianceStatus}"`,
        `"${ctrl.auditEvidence.replace(/"/g, '""')}"`,
        `"${ctrl.remediationAction.replace(/"/g, '""')}"`,
        `"${ctrl.roleResponsible || 'CISO'}"`
      ]);
    }
  }

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Matriz_Fusion_Multi_Marcos_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateFusionReportPDF(frameworks: CustomFramework[]): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [6, 182, 212]; // Cyan
  const darkBg = [11, 17, 30]; // Dark Navy

  // Header Banner
  doc.setFillColor(darkBg[0], darkBg[1], darkBg[2]);
  doc.rect(0, 0, 297, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('INFORME DE FUSIÓN Y CONVERGENCIA MULTI-MARCOS REGULATORIOS', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`NIST CSF 2.0 ✕ ISO/IEC 27001:2022 ✕ ${frameworks.map(f => f.code).join(' ✕ ')} | Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 20);

  // Executive Summary Table
  const summaryHeaders = ['Marco Regulatorio / Estándar', 'Tipo de Fuente', 'Controles Totales', 'Cubiertos Línea Base', 'Brechas Netas', '% Solapamiento', '% Cumplimiento Actual'];
  const summaryRows = frameworks.map(f => [
    f.name,
    f.sourceType === 'pdf_upload' ? `PDF (${f.fileName || 'Cargado'})` : 'Estándar Preconfigurado',
    f.fusionMetrics.totalControls.toString(),
    f.fusionMetrics.fullyCovered.toString(),
    f.fusionMetrics.gapControls.toString(),
    `${f.fusionMetrics.overlapPercent}%`,
    `${f.fusionMetrics.compliancePercent}%`
  ]);

  autoTable(doc, {
    head: [summaryHeaders],
    body: summaryRows,
    startY: 32,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 45 },
      5: { fontStyle: 'bold', textColor: [6, 182, 212], halign: 'center' },
      6: { fontStyle: 'bold', textColor: [16, 185, 129], halign: 'center' }
    }
  });

  // Crosswalk Detail Table
  let currentY = (doc as any).lastAutoTable.finalY + 8;

  if (currentY > 175) {
    doc.addPage();
    currentY = 15;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('MATRIZ DE FUSIÓN Y MAPEO DE CONTROLES CRUZADOS', 14, currentY);

  const detailHeaders = ['Marco', 'Código', 'Título del Control', 'Función NIST 2.0', 'Control ISO 27001', 'Solapamiento', 'Estado', 'Evidencia Requerida'];
  
  const detailRows: any[] = [];
  for (const fw of frameworks) {
    for (const c of fw.controls) {
      detailRows.push([
        fw.code,
        c.code,
        c.title,
        c.mappedNistId,
        c.mappedIsoId,
        `${c.overlapScore}%`,
        c.complianceStatus,
        c.auditEvidence
      ]);
    }
  }

  autoTable(doc, {
    head: [detailHeaders],
    body: detailRows,
    startY: currentY + 4,
    theme: 'striped',
    headStyles: {
      fillColor: [6, 182, 212],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      fontSize: 7,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 50 },
      3: { cellWidth: 22 },
      4: { cellWidth: 22 },
      5: { cellWidth: 18, halign: 'center' },
      6: { cellWidth: 24, fontStyle: 'bold' },
      7: { cellWidth: 90 }
    }
  });

  doc.save(`Informe_Ejecutivo_Fusion_Marcos_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function exportComparativePlaybookMarkdown(frameworks: CustomFramework[]): void {
  let md = `# PLAYBOOK DE FUSIÓN Y CONVERGENCIA MULTI-MARCOS REGULATORIOS
*Generado automáticamente por la Plataforma de CiberGobernanza NIST CSF 2.0 ✕ ISO/IEC 27001:2022*
*Fecha de Emisión:* ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

---

## 1. RESUMEN EJECUTIVO DE ARQUITECTURA NORMATIVA
El presente playbook consolida la unificación de múltiples marcos de ciberseguridad, resiliencia y privacidad sobre la línea base fundacional ISO 27001:2022 y NIST CSF 2.0.

| Marco Integrado | Tipo de Ingestión | Controles Totales | Solapamiento con SGSI | Brechas Netas | % Cumplimiento Actual |
| :--- | :--- | :---: | :---: | :---: | :---: |
`;

  for (const fw of frameworks) {
    md += `| **${fw.name} (${fw.code})** | ${fw.sourceType === 'pdf_upload' ? `PDF: ${fw.fileName}` : 'Estándar Preconfigurado'} | ${fw.fusionMetrics.totalControls} | ${fw.fusionMetrics.overlapPercent}% | ${fw.fusionMetrics.gapControls} | **${fw.fusionMetrics.compliancePercent}%** |\n`;
  }

  md += `\n---\n\n## 2. DESGLOSE DETALLADO DE CONTROLES FUSIONADOS\n\n`;

  for (const fw of frameworks) {
    md += `### MARCO: ${fw.name} [${fw.code}]\n`;
    md += `*Categoría:* ${fw.category} | *Versión:* ${fw.version}\n\n`;

    for (const ctrl of fw.controls) {
      md += `#### 🔹 [${ctrl.code}] ${ctrl.title}\n`;
      md += `- **Dominio:** ${ctrl.domainName}\n`;
      md += `- **Requerimiento:** ${ctrl.requirement}\n`;
      md += `- **Mapeo Cruzado NIST CSF 2.0:** \`${ctrl.mappedNistId}\` (${ctrl.mappedNistName || 'Categoría'})\n`;
      md += `- **Mapeo Cruzado ISO 27001:2022:** \`${ctrl.mappedIsoId}\` (${ctrl.mappedIsoName || 'Control'})\n`;
      md += `- **Índice de Solapamiento:** \`${ctrl.overlapScore}%\` (${ctrl.status.toUpperCase()})\n`;
      md += `- **Estado de Cumplimiento:** **${ctrl.complianceStatus}**\n`;
      md += `- **Racional de Convergencia:** ${ctrl.crosswalkJustification}\n`;
      md += `- **Evidencias de Auditoría:** ${ctrl.auditEvidence}\n`;
      md += `- **Acción de Remediación:** ${ctrl.remediationAction}\n`;
      md += `- **Responsable:** \`${ctrl.roleResponsible || 'CISO'}\`\n\n`;
    }
    md += `---\n\n`;
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Playbook_Fusion_Marcos_${new Date().toISOString().slice(0, 10)}.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
