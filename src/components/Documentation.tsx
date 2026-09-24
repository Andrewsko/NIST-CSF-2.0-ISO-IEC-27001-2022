import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  GitMerge, 
  Terminal, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Zap, 
  Activity, 
  Server, 
  Lock, 
  Cpu, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  Code2,
  Workflow,
  Sparkles,
  HelpCircle,
  Clock,
  Key
} from 'lucide-react';
import { NON_NEGOTIABLE_RECOMMENDATIONS } from '../data/nonNegotiablesData';
import { cn } from '../lib/utils';

export function Documentation() {
  const [activeSection, setActiveSection] = useState<string>('architecture');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadMarkdownDocumentation = () => {
    const mdContent = `# CIBERGOBERNANZA: MEMORIA TÉCNICA Y DOCUMENTACIÓN DE LA SOLUCIÓN
**Convergencia Operativa: NIST Cybersecurity Framework 2.0 & ISO/IEC 27001:2022**
*Fecha de Emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}*
*Clasificación: TLP:AMBER+STRICT / Documento Técnico de Arquitectura*

---

## 1. RESUMEN EJECUTIVO & PROPÓSITO
La plataforma **CiberGobernanza** resuelve la desconexión histórica entre el enfoque de gestión por procesos (ISO/IEC 27001:2022) y el marco de resultados operativos y ciberseguridad técnica (NIST CSF 2.0).

### Pilares Fundamentales:
1. **Doble Cobertura Integral**: Mapeo bidireccional entre los 93 controles de ISO 27001 (Anexo A: Organizacional, Personas, Físico, Tecnológico), las 11 cláusulas SGSI (4-10) y las 106 subcategorías de NIST CSF 2.0 (GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER).
2. **Línea Base Mandatoria (12 Salvaguardas No Negociables)**: Conjunto de controles ineludibles cuyo despliegue e integración es mandatorio para garantizar la postura defensiva mínima aceptable.
3. **Motor de Cumplimiento y Enforzamiento en Tiempo Real**: Capacidad de validar, auditar y ejecutar enforzamiento automático de controles con trazabilidad criptográfica inmutable.

---

## 2. ARQUITECTURA DEL MOTOR DE CONVERGENCIA
El motor opera bajo una matriz tridimensional de correlación:
\`\`\`
[NIST CSF 2.0 Subcategory] <---> [Crosswalk Engine] <---> [ISO 27001:2022 Annex A Control]
          |                                                              |
          v                                                              v
[NIST Implementation Tiers 1-4]                              [ISO 27001 Clause 4-10 ISMS]
\`\`\`

### Algoritmo de Cálculo de Madurez:
- **Puntuación NIST CSF 2.0**: Media ponderada de las 6 Funciones Clave (GV, ID, PR, DE, RS, RC). Cada función computa el promedio de sus categorías según nivel de implementación (Tier 1: Parcial = 25%, Tier 2: Informado = 50%, Tier 3: Repetible = 75%, Tier 4: Adaptativo = 100%).
- **Puntuación ISO 27001:2022**: Promedio compuesto entre el porcentaje de controles del Anexo A verificados (93 controles) y las cláusulas del SGSI validadas (11 cláusulas).
- **Postura Global de Ciberdefensa (Cyber Posture Score)**:
  \`Score = (NIST_Compliance * 0.50) + (ISO_AnnexA_Compliance * 0.35) + (ISO_Clauses * 0.15)\`

---

## 3. LAS 12 SALVAGUARDAS NO NEGOCIABLES
Las siguientes salvaguardas constituyen la línea base innegociable de la organización:

${NON_NEGOTIABLE_RECOMMENDATIONS.map((r, i) => `### ${i + 1}. [${r.code}] ${r.title}
- **Pilar**: ${r.pillar}
- **NIST CSF 2.0**: ${r.nistSubcategories.join(', ')}
- **ISO 27001:2022**: ${r.isoControls.map(c => `Control ${c}`).join(', ')}
- **Justificación de Riesgo**: ${r.whyNonNegotiable}
- **Línea Base Mandatoria**: ${r.expectedState}
- **Comando de Verificación**:
\`\`\`bash
${r.verificationCommand}
\`\`\`
`).join('\n')}

---

## 4. INTEGRACIÓN CON SIEM & LOGS DE AUDITORÍA
Formato de evento estandarizado RFC 5424 / CEF para reenvío a Splunk, Microsoft Sentinel o Wazuh:
\`\`\`json
{
  "timestamp": "2026-08-13T14:30:00Z",
  "event_type": "AUDIT_COMPLIANCE_STATE_CHANGE",
  "actor": "CISO_ENGINE_AUTOMATION",
  "framework": "NIST_CSF_2.0_ISO_27001",
  "control_id": "PR.AA-01",
  "iso_reference": "A.5.17, A.8.5",
  "action": "ENFORCE_CONTROL",
  "previous_state": "PENDING_GAP",
  "current_state": "100_PERCENT_ENFORCED",
  "signature": "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
\`\`\`

---
*Generado automáticamente por la Plataforma CiberGobernanza.*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Memoria_Tecnica_CiberGobernanza_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sections = [
    { id: 'architecture', label: 'Arquitectura & Motor', icon: Workflow },
    { id: 'convergence', label: 'Convergencia NIST / ISO', icon: GitMerge },
    { id: 'non-negotiables', label: '12 No Negociables', icon: Zap },
    { id: 'scoring', label: 'Algoritmo de Madurez', icon: Activity },
    { id: 'siem', label: 'Integración SIEM & API', icon: Server },
    { id: 'audit-guide', label: 'Guía de Auditoría Externa', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1e293b] pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              CENTRO DE DOCUMENTACIÓN TÉCNICA
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              SPEC v2.4.0 • NIST CSF 2.0 ✕ ISO/IEC 27001:2022
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-mono text-slate-100 font-semibold tracking-tight">
            Memoria Técnica, Arquitectura & Guía de la Solución
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Documentación exhaustiva sobre la metodología de unificación normativa, algoritmos de cálculo de postura ciber, especificaciones de integración con SIEM y el manual de operaciones para comités de seguridad.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadMarkdownDocumentation}
            className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-semibold text-xs rounded transition-all shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Memoria Técnica (.MD)</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-[#1e293b] pb-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded text-xs font-mono transition-all",
                isActive 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm" 
                  : "bg-[#0b111e] text-slate-400 border border-[#1e293b] hover:border-slate-600 hover:text-slate-200"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: ARCHITECTURE */}
      {activeSection === 'architecture' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-4">
            <h2 className="text-lg font-mono text-cyan-400 flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-cyan-400" />
              <span>1. Arquitectura del Sistema y Flujo de Datos</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              La plataforma opera como una capa de orquestación de gobernanza sobre la infraestructura tecnológica y los procesos corporativos. Conecta dinámicamente los requerimientos de cumplimiento con telemetría técnica en tiempo real.
            </p>

            <div className="bg-[#060a12] p-5 rounded border border-[#1e293b] font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-cyan-300">
{`+-----------------------------------------------------------------------------------+
|                        CAPA DE GOBERNANZA & ESTRATEGIA                             |
|  - ISO/IEC 27001:2022 (Cláusulas 4 a 10: Liderazgo, Riesgos, Objetivos, Auditoría) |
|  - NIST CSF 2.0 Función GOVERN (GV: Gobernanza, Estrategia de Riesgo, Cadena Sum.)|
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                      MOTOR DE CONVERGENCIA & INTERSECCIÓN                          |
|  - Matriz de Mapeo Bidireccional (106 Subcategorías NIST ⟷ 93 Controles ISO)      |
|  - 12 Salvaguardas No Negociables (Línea Base Mandatoria)                         |
|  - Algoritmo de Madurez Ponderada & Score de Postura Ciber (0 a 100%)              |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        CAPA DE CONTROL TÉCNICO & OPERACIÓN                        |
|  - Identidad (MFA / PAM / Zero Trust)     - Detección (EDR / XDR / SOC 24/7)      |
|  - Datos (Cifrado AES-256 / TLS 1.3)      - Resiliencia (Backups 3-2-1 Inmutables)|
|  - DevSecOps (SAST / DAST / CI/CD Seguro) - Respuesta a Incidentes (IRP / CSIRT)  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                       SALIDAS, REPORTES & EVIDENCIAS                               |
|  - Dashboard CISO en Vivo    - Gantt de Proyectos      - Matriz de Brechas (GAPs) |
|  - Certificados PDF          - Exportación Power BI    - Syslog / CEF hacia SIEM  |
+-----------------------------------------------------------------------------------+`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#0e1626] p-4 rounded border border-[#1e293b]">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Capa 1: Evaluación</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Diagnóstico exhaustivo mediante listas de chequeo dinámicas basadas en NIST CSF 2.0 y los 4 temas de ISO 27001 Anexo A.
                </p>
              </div>

              <div className="bg-[#0e1626] p-4 rounded border border-[#1e293b]">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Capa 2: Mitigación</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Generación automática de planes de acción con proyectos priorizados, estimación presupuestaria y cronograma Gantt interactivo.
                </p>
              </div>

              <div className="bg-[#0e1626] p-4 rounded border border-[#1e293b]">
                <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Capa 3: Certificación</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Pista de auditoría inmutable con firmas de tiempo (RFC 3161) y generación de reportes ejecutivos listos para auditorías externas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CONVERGENCE */}
      {activeSection === 'convergence' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-4">
            <h2 className="text-lg font-mono text-emerald-400 flex items-center space-x-2">
              <GitMerge className="w-5 h-5 text-emerald-400" />
              <span>2. Matriz de Convergencia Metodológica NIST CSF 2.0 ✕ ISO/IEC 27001:2022</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              La integración fusiona las 6 Funciones de NIST CSF 2.0 con los 4 Dominios Temáticos del Anexo A de ISO 27001:2022, permitiendo que una sola acción técnica cumpla simultáneamente con múltiples marcos normativos.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#0e1626] p-5 rounded border border-[#1e293b] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase">NIST CSF 2.0 (106 Subcategorías)</span>
                  <span className="text-[10px] font-mono bg-cyan-950/60 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/40">Marco de Resultados</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-cyan-300 font-bold">GOVERN (GV):</span> Gobernanza, gestión del riesgo y contexto organizacional. Cruza directamente con ISO Cláusulas 4, 5, 6 y Control A.5.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-cyan-300 font-bold">IDENTIFY (ID):</span> Inventario de activos, evaluación de riesgos e impacto en el negocio. Cruza con ISO A.5.9, A.5.10, A.8.8.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-cyan-300 font-bold">PROTECT (PR):</span> Gestión de accesos, concientización, seguridad de datos y resiliencia. Cruza con A.5, A.6, A.7, A.8.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-cyan-300 font-bold">DETECT (DE):</span> Monitoreo continuo, telemetría y detección de anomalías. Cruza con A.8.16, A.8.23.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-cyan-300 font-bold">RESPOND & RECOVER (RS/RC):</span> Planes de respuesta a incidentes, remediación y continuidad del negocio. Cruza con A.5.24 - A.5.30.
                  </div>
                </div>
              </div>

              <div className="bg-[#0e1626] p-5 rounded border border-[#1e293b] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">ISO/IEC 27001:2022 (93 Controles)</span>
                  <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">Marco Certificable SGSI</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-emerald-400 font-bold">A.5 Controles Organizacionales (37 Controles):</span> Políticas, roles, gestión de terceros, clasificación de información y respuesta a incidentes.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-emerald-400 font-bold">A.6 Controles de Personas (8 Controles):</span> Selección de personal, acuerdos de confidencialidad, capacitación continua y teletrabajo.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-emerald-400 font-bold">A.7 Controles Físicos (14 Controles):</span> Perímetros de seguridad, protección de salas técnicas, control de accesos físicos y mantenimiento.
                  </div>
                  <div className="p-2.5 bg-[#070b14] rounded border border-[#1e293b]">
                    <span className="font-mono text-emerald-400 font-bold">A.8 Controles Tecnológicos (34 Controles):</span> Autenticación, privilegios, malware, respaldos, cifrado, desarrollo seguro y pruebas de penetración.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: 12 NON-NEGOTIABLES MATRIX */}
      {activeSection === 'non-negotiables' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-4">
            <h2 className="text-lg font-mono text-amber-400 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>3. Las 12 Salvaguardas No Negociables (Línea Base Mandatoria)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Las 12 salvaguardas representan el umbral mínimo que ninguna entidad bajo auditoría puede omitir. Tienen precedencia sobre cualquier control optativo.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NON_NEGOTIABLE_RECOMMENDATIONS.map((rec) => (
                <div key={rec.id} className="bg-[#0e1626] border border-[#1e293b] p-4 rounded hover:border-amber-500/40 transition-colors space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono font-bold">
                      {rec.code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rec.pillar}
                    </span>
                  </div>
                  <h3 className="text-sm font-mono font-semibold text-slate-100">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {rec.whyNonNegotiable}
                  </p>
                  <div className="pt-2 border-t border-[#1e293b] flex flex-wrap gap-2 text-[10px] font-mono">
                    <span className="text-cyan-400">NIST: {rec.nistSubcategories.join(', ')}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-emerald-400">ISO: {rec.isoControls.map(c => `A.${c}`).join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: SCORING ALGORITHM */}
      {activeSection === 'scoring' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-4">
            <h2 className="text-lg font-mono text-cyan-400 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>4. Fórmulas y Algoritmo de Cálculo de Madurez</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              El motor de cálculo computa en tiempo real las métricas de conformidad a partir del estado de cada subcategoría y control verificado.
            </p>

            <div className="space-y-4">
              <div className="bg-[#060a12] p-4 rounded border border-[#1e293b] space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Fórmula 1: Cumplimiento de Función NIST CSF 2.0</span>
                <pre className="text-xs font-mono text-slate-300 bg-[#0c1017] p-3 rounded overflow-x-auto">
{`Function_Score(F) = Sum(Subcategory_Status(i)) / Total_Subcategories(F) * 100
Donde:
  Subcategory_Status = 1 si está verificado, 0 si está pendiente.
  F in { GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER }`}
                </pre>
              </div>

              <div className="bg-[#060a12] p-4 rounded border border-[#1e293b] space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-300 uppercase">Fórmula 2: Cumplimiento ISO/IEC 27001:2022</span>
                <pre className="text-xs font-mono text-slate-300 bg-[#0c1017] p-3 rounded overflow-x-auto">
{`ISO_AnnexA_Percent = (Controles_Verificados / 93) * 100
ISO_Clauses_Percent = (Clausulas_Validadas / 11) * 100
ISO_Total_Score = (ISO_AnnexA_Percent * 0.70) + (ISO_Clauses_Percent * 0.30)`}
                </pre>
              </div>

              <div className="bg-[#060a12] p-4 rounded border border-[#1e293b] space-y-2">
                <span className="text-xs font-mono font-bold text-amber-300 uppercase">Fórmula 3: Cyber Posture Global Score (Índice de Resiliencia)</span>
                <pre className="text-xs font-mono text-slate-300 bg-[#0c1017] p-3 rounded overflow-x-auto">
{`Global_Posture_Score = (NIST_Avg * 0.40) + (ISO_AnnexA * 0.35) + (NonNegotiables_Rate * 0.25)
Escala de Interpretación:
  • 0% - 49%:  CRÍTICO (Defensas inmaduras, alto riesgo de brecha inminente)
  • 50% - 69%: MEDIO (Controles parciales, brechas de configuración)
  • 70% - 89%: ALTO (Línea base sólida, listo para pre-auditoría)
  • 90% - 100%: RESILIENTE / CERTIFICABLE (Cumplimiento total y verificado)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: SIEM & API */}
      {activeSection === 'siem' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-4">
            <h2 className="text-lg font-mono text-cyan-400 flex items-center space-x-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>5. Especificación de Integración SIEM & API de Telemetría</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Estructura de eventos para integración mediante Syslog (RFC 5424), Common Event Format (CEF) o Webhooks REST para ingestión en SIEM (Splunk, Microsoft Sentinel, Wazuh, Elastic).
            </p>

            <div className="space-y-4">
              <div className="bg-[#060a12] p-4 rounded border border-[#1e293b] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase">Payload JSON de Auditoría en Tiempo Real</span>
                  <button
                    onClick={() => handleCopy(`{
  "event_id": "audit-2026-0813-0981",
  "timestamp": "2026-08-13T14:31:00.000Z",
  "source_system": "CiberGobernanza_Engine_v2.4",
  "event_type": "CONTROL_ENFORCEMENT_APPLIED",
  "severity": "INFO",
  "frameworks": {
    "nist_csf_2": {
      "function": "PROTECT",
      "subcategories": ["PR.AA-01", "PR.AA-03"]
    },
    "iso_27001_2022": {
      "domain": "A.8 Controles Tecnológicos",
      "controls": ["8.5", "5.17"]
    }
  },
  "compliance_impact": {
    "previous_global_score": 78.4,
    "new_global_score": 86.2,
    "delta": +7.8
  },
  "audit_trail": {
    "operator": "CISO_AUTOMATION_PIPELINE",
    "hash_sha256": "9f83c6b84a9e224e758a0b0d3e5272a8c3d9b4f2a7e1c8d5a2f3b6c9e0d1a4f7"
  }
}`, 'siem-json')}
                    className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white font-mono"
                  >
                    {copiedKey === 'siem-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'siem-json' ? 'Copiado' : 'Copiar JSON'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-[#0c1017] p-4 rounded overflow-x-auto">
{`{
  "event_id": "audit-2026-0813-0981",
  "timestamp": "2026-08-13T14:31:00.000Z",
  "source_system": "CiberGobernanza_Engine_v2.4",
  "event_type": "CONTROL_ENFORCEMENT_APPLIED",
  "severity": "INFO",
  "frameworks": {
    "nist_csf_2": {
      "function": "PROTECT",
      "subcategories": ["PR.AA-01", "PR.AA-03"]
    },
    "iso_27001_2022": {
      "domain": "A.8 Controles Tecnológicos",
      "controls": ["8.5", "5.17"]
    }
  },
  "compliance_impact": {
    "previous_global_score": 78.4,
    "new_global_score": 86.2,
    "delta": +7.8
  },
  "audit_trail": {
    "operator": "CISO_AUTOMATION_PIPELINE",
    "hash_sha256": "9f83c6b84a9e224e758a0b0d3e5272a8c3d9b4f2a7e1c8d5a2f3b6c9e0d1a4f7"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: AUDIT GUIDE */}
      {activeSection === 'audit-guide' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0b111e] border border-[#1e293b] p-6 rounded-sm space-y-4">
            <h2 className="text-lg font-mono text-emerald-400 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>6. Guía de Preparación para Auditoría de Certificación (Fase 1 y Fase 2)</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paso a paso para superar auditorías formales con casas certificadoras (BSI, AENOR, DNV, SGS, TÜV) o auditorías regulatorias de ciberseguridad.
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-[#0e1626] rounded border border-[#1e293b]">
                <h3 className="text-xs font-mono font-bold text-cyan-300 mb-1">Fase 1: Revisión Documental del SGSI (Cláusulas 4 a 10)</h3>
                <p className="text-xs text-slate-400">
                  El auditor verificará la Declaración de Aplicabilidad (SoA), el alcance del SGSI, la política general de seguridad, los objetivos de ciberseguridad y las actas de revisión por la dirección. Todo esto se encuentra en la pestaña "Vista de Auditor".
                </p>
              </div>

              <div className="p-4 bg-[#0e1626] rounded border border-[#1e293b]">
                <h3 className="text-xs font-mono font-bold text-emerald-300 mb-1">Fase 2: Auditoría Técnica In Situ & Muestreo de Evidencias (Anexo A & NIST)</h3>
                <p className="text-xs text-slate-400">
                  El auditor solicitará pruebas vivas: capturas de configuración de MFA, reportes de escaneo de vulnerabilidades, tickets de atención de incidentes, pruebas de restauración de backups y logs del SIEM. Utilice las pestañas "No Negociables" y "Checklists" para exportar dichas evidencias.
                </p>
              </div>

              <div className="p-4 bg-[#0e1626] rounded border border-[#1e293b]">
                <h3 className="text-xs font-mono font-bold text-amber-300 mb-1">Auditoría Continua y Tratamiento de No Conformidades</h3>
                <p className="text-xs text-slate-400">
                  Cualquier brecha detectada se gestiona desde el "Plan de Acción" y se programa su mitigación en el "Gantt de Proyectos", asegurando cumplimiento dentro de los plazos comprometidos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
