import { NistCategory, IsoControl, Mapping, ProfileScore, ProjectTask } from '../types';
import { ISO_27001_CONTROLS_93 } from './iso27001Data';

export const NIST_CATEGORIES: NistCategory[] = [
  { id: 'GV.OC', function: 'GV', name: 'Contexto organizativo (GV.OC)', description: 'Se comprenden las circunstancias que afectan las decisiones de gestión de riesgos.' },
  { id: 'GV.RM', function: 'GV', name: 'Estrategia de gestión de riesgos (GV.RM)', description: 'Se establecen, comunican y utilizan las prioridades y tolerancias al riesgo.' },
  { id: 'GV.RR', function: 'GV', name: 'Roles, responsabilidades y autoridades (GV.RR)', description: 'Se establecen y comunican funciones en materia de seguridad cibernética.' },
  { id: 'GV.PO', function: 'GV', name: 'Política (GV.PO)', description: 'La política de seguridad cibernética es establecida, comunicada y aplicada.' },
  { id: 'GV.OV', function: 'GV', name: 'Supervisión (GV.OV)', description: 'Los resultados se utilizan para informar, mejorar y ajustar la estrategia.' },
  { id: 'GV.SC', function: 'GV', name: 'Riesgos de cadena de suministro (GV.SC)', description: 'Se gestionan y supervisan los riesgos de la cadena de suministro cibernética.' },
  { id: 'ID.AM', function: 'ID', name: 'Gestión de activos (ID.AM)', description: 'Los activos se identifican y gestionan de acuerdo con su importancia.' },
  { id: 'ID.RA', function: 'ID', name: 'Evaluación de riesgos (ID.RA)', description: 'La organización comprende el riesgo de seguridad cibernética.' },
  { id: 'ID.IM', function: 'ID', name: 'Mejora (ID.IM)', description: 'Se identifican mejoras en los procesos y actividades de gestión de riesgos.' },
  { id: 'PR.AA', function: 'PR', name: 'Gestión de identidades y accesos (PR.AA)', description: 'El acceso se limita a usuarios autorizados y se gestiona según el riesgo.' },
  { id: 'PR.AT', function: 'PR', name: 'Concienciación y capacitación (PR.AT)', description: 'Se proporciona capacitación en seguridad cibernética al personal.' },
  { id: 'PR.DS', function: 'PR', name: 'Seguridad de los datos (PR.DS)', description: 'Los datos se gestionan para proteger su confidencialidad e integridad.' },
  { id: 'PR.PS', function: 'PR', name: 'Seguridad de plataformas (PR.PS)', description: 'El hardware, software y servicios se gestionan de forma segura.' },
  { id: 'PR.IR', function: 'PR', name: 'Resiliencia de la infraestructura (PR.IR)', description: 'Las arquitecturas se gestionan para proteger los activos y su resiliencia.' },
  { id: 'DE.CM', function: 'DE', name: 'Monitoreo continuo (DE.CM)', description: 'Los activos se monitorean para encontrar anomalías y eventos adversos.' },
  { id: 'DE.AE', function: 'DE', name: 'Análisis de eventos adversos (DE.AE)', description: 'Se analizan anomalías e indicadores de compromiso para detectar incidentes.' },
  { id: 'RS.MA', function: 'RS', name: 'Gestión de incidentes (RS.MA)', description: 'Se gestionan las respuestas a los incidentes detectados.' },
  { id: 'RS.AN', function: 'RS', name: 'Análisis de incidentes (RS.AN)', description: 'Se investigan los incidentes para garantizar una respuesta eficaz.' },
  { id: 'RS.CO', function: 'RS', name: 'Comunicación de la respuesta (RS.CO)', description: 'Las actividades se coordinan con las partes interesadas.' },
  { id: 'RS.MI', function: 'RS', name: 'Mitigación de incidentes (RS.MI)', description: 'Se previenen la expansión del incidente y se mitigan sus efectos.' },
  { id: 'RC.RP', function: 'RC', name: 'Ejecución de plan de recuperación (RC.RP)', description: 'Se realizan actividades para restaurar la disponibilidad de los sistemas.' },
  { id: 'RC.CO', function: 'RC', name: 'Comunicación de recuperación (RC.CO)', description: 'Se coordinan las actividades de restauración interna y externamente.' }
];

export const ISO_CONTROLS: IsoControl[] = ISO_27001_CONTROLS_93.map(c => ({
  id: c.id,
  name: c.name,
  domain: c.domain
}));

export const MAPPINGS: Mapping[] = [
  { id: 'm1', nistCategoryId: 'GV.PO', isoControlId: '5.1', justification: 'Las políticas de seguridad proporcionan la base para la categoría de Política de Gobernanza.', implementationStatus: 95 },
  { id: 'm2', nistCategoryId: 'GV.RR', isoControlId: '5.2', justification: 'Definición de roles y responsabilidades para asegurar rendición de cuentas.', implementationStatus: 90 },
  { id: 'm3', nistCategoryId: 'GV.RM', isoControlId: '5.8', justification: 'Integración del riesgo en los proyectos de la organización.', implementationStatus: 60 },
  { id: 'm4', nistCategoryId: 'GV.OV', isoControlId: '5.36', justification: 'Revisión y cumplimiento de las directrices establecidas.', implementationStatus: 75 },
  { id: 'm5', nistCategoryId: 'GV.SC', isoControlId: '5.19', justification: 'Gestión sistemática de los riesgos provenientes de la cadena de suministro.', implementationStatus: 40 },
  { id: 'm6', nistCategoryId: 'ID.AM', isoControlId: '5.9', justification: 'Mantenimiento de inventarios de activos tecnológicos y de información.', implementationStatus: 85 },
  { id: 'm7', nistCategoryId: 'ID.RA', isoControlId: '8.8', justification: 'Evaluación y tratamiento de vulnerabilidades técnicas para comprender el riesgo.', implementationStatus: 65 },
  { id: 'm8', nistCategoryId: 'PR.AA', isoControlId: '5.15', justification: 'Políticas para control de acceso físico y lógico.', implementationStatus: 80 },
  { id: 'm9', nistCategoryId: 'PR.AA', isoControlId: '8.5', justification: 'Mecanismos de autenticación robusta.', implementationStatus: 70 },
  { id: 'm10', nistCategoryId: 'PR.AT', isoControlId: '6.3', justification: 'Educación y formación continua en ciberseguridad.', implementationStatus: 30 },
  { id: 'm11', nistCategoryId: 'PR.DS', isoControlId: '8.13', justification: 'Protección y disponibilidad de la información mediante respaldos periódicos.', implementationStatus: 88 },
  { id: 'm12', nistCategoryId: 'PR.IR', isoControlId: '8.20', justification: 'Protección integral de infraestructuras y dispositivos de red.', implementationStatus: 75 },
  { id: 'm13', nistCategoryId: 'DE.CM', isoControlId: '8.16', justification: 'Monitoreo de redes, sistemas y aplicaciones para detectar anomalías.', implementationStatus: 25 },
  { id: 'm14', nistCategoryId: 'DE.AE', isoControlId: '8.15', justification: 'Recolección y análisis de logs para identificar incidentes potenciales.', implementationStatus: 50 },
  { id: 'm15', nistCategoryId: 'RS.MA', isoControlId: '5.24', justification: 'Planificación de la respuesta ante incidentes detectados.', implementationStatus: 70 },
  { id: 'm16', nistCategoryId: 'RC.RP', isoControlId: '5.29', justification: 'Restauración de operaciones manteniendo niveles adecuados de seguridad.', implementationStatus: 55 }
];

export const PROFILE_SCORES: ProfileScore[] = [
  { function: 'GV', current: 3.5, target: 4.5, industryAverage: 3.2 },
  { function: 'ID', current: 3.8, target: 4.0, industryAverage: 3.5 },
  { function: 'PR', current: 2.2, target: 4.0, industryAverage: 3.1 },
  { function: 'DE', current: 1.8, target: 4.5, industryAverage: 2.8 },
  { function: 'RS', current: 3.0, target: 4.0, industryAverage: 3.0 },
  { function: 'RC', current: 2.8, target: 3.5, industryAverage: 2.9 }
];

export const PROJECTS: ProjectTask[] = [
  {
    id: 'p1',
    name: 'Implementación de Plataforma de Concientización',
    nistCategoryId: 'PR.AT',
    isoControlId: '6.3',
    startDate: '2026-08-15',
    endDate: '2026-10-15',
    progress: 15,
    status: 'In Progress',
    owner: 'Recursos Humanos / TI',
    roleResponsible: 'Líder de Formación & CISO',
    priority: 'Crítica',
    baseBudget: 15000,
    functionCode: 'PR',
    resources: '$15,000 USD | 2 FTEs',
    metrics: '95% de empleados capacitados con calificación >80/100',
    mappingJustification: 'Cumple de manera directa con el control ISO 27001:2022 6.3 (Toma de conciencia) y la subcategoría NIST CSF 2.0 PR.AT-01. Mitiga el riesgo de ingeniería social y ataques de phishing en un 65%.',
    maturityProjection: '+1.8 puntos de madurez proyectados en la Función Protect (PR)',
    milestones: [
      { name: 'Evaluación de proveedores de LMS', date: '2026-08-25', status: 'Completado' },
      { name: 'Despliegue de módulos interactivos', date: '2026-09-15', status: 'Pendiente' },
      { name: 'Simulacro de phishing y evaluación final', date: '2026-10-10', status: 'Pendiente' }
    ]
  },
  {
    id: 'p2',
    name: 'Despliegue de SIEM para Monitoreo Continuo',
    nistCategoryId: 'DE.CM',
    isoControlId: '8.16 / 8.15',
    startDate: '2026-09-01',
    endDate: '2026-12-01',
    progress: 0,
    status: 'Not Started',
    owner: 'SOC / Seguridad Operativa',
    roleResponsible: 'Líder SOC & Ingeniero de Seguridad',
    priority: 'Crítica',
    baseBudget: 55000,
    functionCode: 'DE',
    resources: '$55,000 USD | 3 FTEs (Ing. Seguridad)',
    metrics: 'Tiempo medio de detección (MTTD) < 10 minutos',
    mappingJustification: 'Corresponde con ISO 27001:2022 8.16 (Monitoreo de actividades) y 8.15 (Registros), alineado con NIST CSF 2.0 DE.CM-01 y DE.AE-01 para la recolección centralizada y correlación automatizada de eventos.',
    maturityProjection: '+2.2 puntos de madurez proyectados en la Función Detect (DE)',
    milestones: [
      { name: 'Diseño de arquitectura lógica e ingesta de logs', date: '2026-09-15', status: 'Pendiente' },
      { name: 'Integración de fuentes de datos (ISO 8.15)', date: '2026-10-30', status: 'Pendiente' },
      { name: 'Go-Live del SIEM y reglas de correlación', date: '2026-11-20', status: 'Pendiente' }
    ]
  },
  {
    id: 'p3',
    name: 'Actualización de Planes de Continuidad (BCP/DRP)',
    nistCategoryId: 'RC.RP',
    isoControlId: '5.29 / 5.30',
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    progress: 40,
    status: 'In Progress',
    owner: 'Riesgos & Resiliencia',
    roleResponsible: 'Oficial de Continuidad del Negocio',
    priority: 'Media',
    baseBudget: 12000,
    functionCode: 'RC',
    resources: '$12,000 USD | 1 FTE',
    metrics: 'Al menos 1 simulacro BCP ejecutado con RTO < 4 horas',
    mappingJustification: 'Responde a los requerimientos de ISO 27001:2022 5.29 (Seguridad durante interrupciones) y 5.30 (Preparación de las TIC) y la función NIST Recover (RC.RP-01) para la restauración ordenada de servicios críticos.',
    maturityProjection: '+0.9 puntos de madurez proyectados en la Función Recover (RC)',
    milestones: [
      { name: 'Revisión documental BIA y análisis de impacto', date: '2026-08-15', status: 'Completado' },
      { name: 'Actualización de procedimientos operativos (ISO 5.29)', date: '2026-09-10', status: 'Pendiente' },
      { name: 'Aprobación del comité de dirección y prueba BCP', date: '2026-09-25', status: 'Pendiente' }
    ]
  },
  {
    id: 'p4',
    name: 'Auditoría y Gestión de Riesgos a Proveedores Críticos',
    nistCategoryId: 'GV.SC',
    isoControlId: '5.19 / 5.21',
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    progress: 0,
    status: 'Not Started',
    owner: 'Compras / Legal & CISO',
    roleResponsible: 'Oficial de Compras & Auditor Externo',
    priority: 'Alta',
    baseBudget: 20000,
    functionCode: 'GV',
    resources: '$20,000 USD | Auditores',
    metrics: '100% de proveedores Top 10 evaluados bajo ISO 5.19',
    mappingJustification: 'Satisface el requisito normativo ISO 27001:2022 5.19 (Seguridad en relaciones con proveedores) y NIST CSF 2.0 GV.SC-01 para la evaluación de riesgos en la cadena de suministro tecnológica.',
    maturityProjection: '+1.1 puntos de madurez proyectados en la Función Governance (GV)',
    milestones: [
      { name: 'Mapeo y clasificación de proveedores críticos', date: '2026-10-15', status: 'Pendiente' },
      { name: 'Auditoría de cumplimiento y revisión contractual', date: '2026-11-10', status: 'Pendiente' }
    ]
  }
];
