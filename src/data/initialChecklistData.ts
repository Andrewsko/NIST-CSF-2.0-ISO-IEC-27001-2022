import { NIST_2_SUBCATEGORIES } from './nist2Data';
import { ISO_27001_CONTROLS_93, ISO_CLAUSES } from './iso27001Data';
import { Mapping } from '../types';

// Pre-seeded NIST Subcategory checks (approx. 65-70% completed across functions)
export const INITIAL_NIST_CHECKS: Record<string, boolean> = (() => {
  const checks: Record<string, boolean> = {};
  
  NIST_2_SUBCATEGORIES.forEach((sub) => {
    // Determine initial status based on function code
    if (sub.functionCode === 'GV') {
      // ~70% completed for Governance
      checks[sub.id] = !sub.id.endsWith('-04') && !sub.id.endsWith('-05');
    } else if (sub.functionCode === 'ID') {
      // ~75% completed for Identify
      checks[sub.id] = !sub.id.endsWith('-03');
    } else if (sub.functionCode === 'PR') {
      // ~45% completed for Protect
      checks[sub.id] = sub.id.endsWith('-01') || sub.id.endsWith('-02');
    } else if (sub.functionCode === 'DE') {
      // ~35% completed for Detect
      checks[sub.id] = sub.id.endsWith('-01');
    } else if (sub.functionCode === 'RS') {
      // ~60% completed for Respond
      checks[sub.id] = sub.id.endsWith('-01') || sub.id.endsWith('-02');
    } else if (sub.functionCode === 'RC') {
      // ~55% completed for Recover
      checks[sub.id] = sub.id.endsWith('-01');
    } else {
      checks[sub.id] = true;
    }
  });

  return checks;
})();

// Pre-seeded ISO Annex A Control checks (93 controls)
export const INITIAL_ISO_CONTROL_CHECKS: Record<string, boolean> = (() => {
  const checks: Record<string, boolean> = {};
  
  ISO_27001_CONTROLS_93.forEach((c) => {
    // Initial completed items (~65% completed)
    const lastNum = parseInt(c.id.split('.')[1] || '0', 10);
    checks[c.id] = lastNum % 3 !== 0;
  });

  return checks;
})();

// Pre-seeded ISO Clause Requirements checks (27 requirements across 11 clauses)
export const INITIAL_ISO_CLAUSE_CHECKS: Record<string, boolean> = (() => {
  const checks: Record<string, boolean> = {};
  
  ISO_CLAUSES.forEach((c) => {
    c.requirements.forEach((req) => {
      // ~70% completed
      checks[req.id] = !req.id.endsWith('.3');
    });
  });

  return checks;
})();

// Helper to determine mapped NIST Category for any ISO control ID
export function getMappedNistCategoryForIso(isoId: string): { 
  nistId: string; 
  justification: string;
  expectedOutcome: string;
  requestedEvidence: string;
} {
  const mappings: Record<string, { nistId: string; justification: string; expectedOutcome?: string; requestedEvidence?: string }> = {
    // Domain 5: Organizacional
    '5.1': { 
      nistId: 'GV.PO', 
      justification: 'Políticas formales de seguridad de la información alineadas con la dirección estratégica.',
      expectedOutcome: 'Política Marco SGSI aprobada por la Alta Dirección, publicada y revisada formalmente cada 12 meses.',
      requestedEvidence: 'Documento de Política de Seguridad firmado, Acta de Comité Directivo de aprobación, Registro de difusión a empleados y acuses LMS.'
    },
    '5.2': { 
      nistId: 'GV.RR', 
      justification: 'Asignación de roles y responsabilidades de ciberseguridad en toda la organización.',
      expectedOutcome: 'Estructura organizacional con roles de seguridad (CISO, Custodios, Oficial de Privacidad) formalizados en descriptivos de puesto.',
      requestedEvidence: 'Organigrama de Seguridad, Descripciones de puesto aprobadas con responsabilidades de ciberseguridad, Cartas de asignación.'
    },
    '5.3': { 
      nistId: 'GV.RR', 
      justification: 'Segregación de funciones incompatibles para prevenir conflictos de interés y fraude.',
      expectedOutcome: 'Matriz de Segregación de Funciones (SoD) definida e implementada para procesos financieros, TI y de seguridad.',
      requestedEvidence: 'Matriz SoD por sistemas críticos, Reporte de incompatibilidades identificadas y controles compensatorios aprobados.'
    },
    '5.4': { 
      nistId: 'GV.RR', 
      justification: 'Responsabilidades de la dirección para garantizar la concienciación y cumplimiento.',
      expectedOutcome: 'Líderes de área evalúan y exigen el cumplimiento de políticas de seguridad a sus equipos de trabajo.',
      requestedEvidence: 'Evaluaciones de desempeño que incluyan metas de seguridad, Minutas de reuniones de seguimiento de líderes de área.'
    },
    '5.5': { 
      nistId: 'GV.OV', 
      justification: 'Mantenimiento de contacto continuo con autoridades regulatorias y de ciberseguridad.',
      expectedOutcome: 'Directorio actualizado de autoridades (CERT/CSIRT nacional, entes reguladores) y canal de escalamiento probado.',
      requestedEvidence: 'Directorio institucional de contactos de emergencia, Registros de notificaciones a autoridades en ejercicios o incidentes.'
    },
    '5.6': { 
      nistId: 'GV.OV', 
      justification: 'Intercambio de información con grupos de interés especial y foros sectoriales.',
      expectedOutcome: 'Membresía activa en foros de ciberseguridad (ISAC, ISSA, FIRST) para el intercambio preventivo de amenazas.',
      requestedEvidence: 'Comprobantes de membresía sectorial, participación en foros y boletines recibidos/enviados.'
    },
    '5.7': { 
      nistId: 'ID.RA', 
      justification: 'Inteligencia sobre amenazas para alimentar las evaluaciones de riesgo organizacional.',
      expectedOutcome: 'Ingestión automatizada de feeds de Cyber Threat Intelligence (CTI) e integración de IoCs en herramientas de seguridad.',
      requestedEvidence: 'SLA con proveedor de CTI, reporte de IoCs bloqueados en SIEM/Firewall en los últimos 90 días, boletines internos de amenazas.'
    },
    '5.8': { 
      nistId: 'GV.RM', 
      justification: 'Integración de la seguridad de la información en la gestión de proyectos corporativos.',
      expectedOutcome: 'Checklist de seguridad e identificación de riesgos integrado obligatoriamente en la metodología PMO/Agile.',
      requestedEvidence: 'Plantilla de evaluación de riesgos en proyectos, Actas de cierre de seguridad para proyectos aprobados.'
    },
    '5.9': { 
      nistId: 'ID.AM', 
      justification: 'Inventario estructurado de activos de información y activos asociados.',
      expectedOutcome: 'Inventario centralizado (CMDB) de activos de información actualizado con propietarios, ubicación y criticidad.',
      requestedEvidence: 'Exportable de la CMDB con fecha de última actualización, muestra de validación de propietarios de activos.'
    },
    '5.10': { 
      nistId: 'PR.AA', 
      justification: 'Reglas de uso aceptable de la información y recursos de procesamiento.',
      expectedOutcome: 'Política de Uso Aceptable (AUP) firmada por el 100% de los colaboradores y contratistas activos.',
      requestedEvidence: 'Política AUP vigente, registros digitales de aceptación firmado por los colaboradores, acuses de onboarding.'
    },
    '5.11': { 
      nistId: 'ID.AM', 
      justification: 'Devolución ordenada de activos al finalizar la relación laboral o contractual.',
      expectedOutcome: 'Checklist de offboarding ejecutado al 100% para devolución de equipos, credenciales y acceso a información.',
      requestedEvidence: 'Bitácoras de salida de personal firmadas por TI y Seguridad, actas de devolución de hardware.'
    },
    '5.12': { 
      nistId: 'PR.DS', 
      justification: 'Clasificación de la información según su valor legal, criticidad y sensibilidad.',
      expectedOutcome: 'Esquema de clasificación de información de 4 niveles (Pública, Interna, Confidencial, Restringida) aplicado.',
      requestedEvidence: 'Política de Clasificación de Información, guía visual de clasificación para usuarios, inventario clasificado.'
    },
    '5.13': { 
      nistId: 'PR.DS', 
      justification: 'Etiquetado de información de acuerdo con el esquema de clasificación definido.',
      expectedOutcome: 'Etiquetado automático o asistido (DLP/MIP) en documentos, correos y repositorios de almacenamiento.',
      requestedEvidence: 'Configuración de políticas de Microsoft Purview/DLP, capturas de encabezados/marcas de agua en documentos.'
    },
    '5.14': { 
      nistId: 'PR.DS', 
      justification: 'Políticas y salvaguardas para la transferencia segura de información.',
      expectedOutcome: 'Uso obligatorio de canales cifrados (SFTP, portales de intercambio seguro, TLS 1.3) para transferencia de datos.',
      requestedEvidence: 'Lista de herramientas autorizadas para transferencia, configuraciones de cifrado de canal, reglas de bloqueo DLP.'
    },
    '5.15': { 
      nistId: 'PR.AA', 
      justification: 'Control de acceso lógico y físico basado en principios de menor privilegio.',
      expectedOutcome: 'Matriz RBAC/ABAC implementada con asignación de permisos según necesidad estricta del puesto.',
      requestedEvidence: 'Matriz de Roles y Permisos, solicitudes de acceso aprobadas, informe de revisión semestral de privilegios.'
    },
    '5.16': { 
      nistId: 'PR.AA', 
      justification: 'Gestión del ciclo de vida completo de identidades y credenciales de acceso.',
      expectedOutcome: 'Sistema IAM/IDP centralizado gestionando aprovisionamiento, modificación y baja automatizada de cuentas.',
      requestedEvidence: 'Configuración del sistema IAM (Azure AD/Okta), logs de alta/baja automática sincronizados con RRHH.'
    },
    '5.17': { 
      nistId: 'PR.AA', 
      justification: 'Procesos seguros para el establecimiento y gestión de información de autenticación.',
      expectedOutcome: 'Gestión segura de contraseñas, secretos e información de autenticación mediante gestores de contraseñas o Vaults.',
      requestedEvidence: 'Política de compleijdad de credenciales, uso corporativo de gestores de secretos (HashiCorp Vault/Keeper).'
    },
    '5.18': { 
      nistId: 'PR.AA', 
      justification: 'Asignación, revisión y revocación periódica de derechos de acceso.',
      expectedOutcome: 'Revisión formal de accesos realizada trimestralmente por los dueños de información con revocación de no requeridos.',
      requestedEvidence: 'Informes de auditoría trimestral de accesos firmados por los dueños de negocio, tickets de eliminación de permisos.'
    },
    '5.19': { 
      nistId: 'GV.SC', 
      justification: 'Evaluación y gestión de riesgos en las relaciones con proveedores y contratistas.',
      expectedOutcome: 'Proceso formal de Due Diligence de ciberseguridad para proveedores antes de la adjudicación de contratos.',
      requestedEvidence: 'Cuestionarios de evaluación de seguridad a proveedores (SIG/CAIQ), matriz de clasificación de riesgo de terceros.'
    },
    '5.20': { 
      nistId: 'GV.SC', 
      justification: 'Inclusión de requisitos de seguridad en contratos y acuerdos con proveedores.',
      expectedOutcome: 'Cláusulas obligatorias de ciberseguridad, confidencialidad, notificación de incidentes (<24h) y auditoría en contratos.',
      requestedEvidence: 'Modelo de anexo de seguridad para contratos de proveedores, muestra de 5 contratos firmados con la cláusula.'
    },
    '5.21': { 
      nistId: 'GV.SC', 
      justification: 'Gestión de riesgos en la cadena de suministro de tecnologías de información (TIC).',
      expectedOutcome: 'Identificación y mitigación de vulnerabilidades en componentes de hardware, software y servicios de terceros.',
      requestedEvidence: 'Análisis de Software Bill of Materials (SBOM) en componentes críticos, informes de riesgo de la cadena de suministro.'
    },
    '5.22': { 
      nistId: 'GV.SC', 
      justification: 'Monitoreo y revisión continua del desempeño y cumplimiento de los proveedores.',
      expectedOutcome: 'Auditorías anuales o revisiones continuas de postura de seguridad (ratings de ciberseguridad) a proveedores críticos.',
      requestedEvidence: 'Informes de monitoreo continuo (SecurityScorecard/BitSight), actas de revisión anual de proveedores clave.'
    },
    '5.23': { 
      nistId: 'GV.SC', 
      justification: 'Seguridad en la adquisición, uso y gestión de servicios en la nube.',
      expectedOutcome: 'Definición del modelo de responsabilidad compartida y controles de seguridad (CSPM) configurados en la nube.',
      requestedEvidence: 'Matriz de responsabilidad compartida por servicio SaaS/PaaS/IaaS, reporte de la herramienta CSPM (Wiz/Prisma).'
    },
    '5.24': { 
      nistId: 'RS.MA', 
      justification: 'Planificación y preparación de la respuesta ante incidentes de ciberseguridad.',
      expectedOutcome: 'Plan de Respuesta a Incidentes (IRP) documentado, con roles, niveles de severidad y playbooks específicos.',
      requestedEvidence: 'Documento IRP actualizado, Playbooks (Ransomware, Phishing, Fuga de Datos), acta de aprobación del CISO.'
    },
    '5.25': { 
      nistId: 'RS.AN', 
      justification: 'Evaluación y clasificación de eventos para determinar si constituyen incidentes.',
      expectedOutcome: 'Criterios claros de triaje y matriz de severidad para la clasificación oportuna de anomalías y eventos de seguridad.',
      requestedEvidence: 'Procedimiento de triaje de eventos, bitácora de tickets de incidentes con nivel de severidad asignado.'
    },
    '5.26': { 
      nistId: 'RS.MA', 
      justification: 'Procedimientos formalizados de respuesta, contención y erradicación de incidentes.',
      expectedOutcome: 'Ejecución rigurosa de acciones de contención inmediata (aislamiento de red, revocación) ante incidentes confirmados.',
      requestedEvidence: 'Informes post-incidente (Post-Mortem), registros de comandos de aislamiento ejecutados en la herramienta EDR.'
    },
    '5.27': { 
      nistId: 'ID.IM', 
      justification: 'Lecciones aprendidas e identificación de mejoras tras la resolución de incidentes.',
      expectedOutcome: 'Sesiones post-incidente realizadas dentro de los 5 días posteriores al cierre para ajustar controles defensivos.',
      requestedEvidence: 'Actas de Lecciones Aprendidas (Post-Incident Reviews), plan de acción corrector registrado en la matriz de riesgos.'
    },
    '5.28': { 
      nistId: 'RS.AN', 
      justification: 'Procedimientos para la recolección, preservación y manejo de evidencia digital.',
      expectedOutcome: 'Cadena de custodia documentada e imágenes forenses preservadas cumpliendo estándares legales (ISO 27037).',
      requestedEvidence: 'Procedimiento de Forense Digital, formatos de cadena de custodia firmados, hashes de verificación de evidencia.'
    },
    '5.29': { 
      nistId: 'RC.RP', 
      justification: 'Continuidad de la seguridad de la información durante interrupciones operativas.',
      expectedOutcome: 'Controles de seguridad operando de manera resiliente durante contingencias sin degradar la postura de protección.',
      requestedEvidence: 'Sección de Ciberseguridad en el Plan de Continuidad de Negocio (BCP), informe de prueba de contingencia.'
    },
    '5.30': { 
      nistId: 'RC.RP', 
      justification: 'Disponibilidad de las TIC para garantizar la continuidad del negocio (DRP/BCP).',
      expectedOutcome: 'Plan de Recuperación ante Desastres (DRP) probado anualmente con RTO < 4h y RPO < 1h en sistemas críticos.',
      requestedEvidence: 'Documento DRP, informe técnico de la prueba de conmutación (Failover/Failback) a sitio secundario o nube.'
    },
    '5.31': { 
      nistId: 'GV.OC', 
      justification: 'Identificación y cumplimiento de requisitos legales, regulatorios y contractuales.',
      expectedOutcome: 'Matriz de Cumplimiento Legal y Regulatorio (Leyes de Privacidad, PCI-DSS, ISO 27001) actualizada.',
      requestedEvidence: 'Matriz de Requisitos Legales de Ciberseguridad, dictamen de asesoría jurídica o auditoría de cumplimiento.'
    },
    '5.32': { 
      nistId: 'GV.OC', 
      justification: 'Protección de los derechos de propiedad intelectual y software bajo licencia.',
      expectedOutcome: '100% del software instalado cuenta con licencias corporativas válidas e inventario controlado.',
      requestedEvidence: 'Reporte de la herramienta SAM (Software Asset Management), certificados de licencias corporativas.'
    },
    '5.33': { 
      nistId: 'PR.DS', 
      justification: 'Protección de registros corporativos contra alteración, destrucción o acceso no autorizado.',
      expectedOutcome: 'Registros clave del negocio almacenados con controles de integridad (Write-Once-Read-Many) y cifrado.',
      requestedEvidence: 'Política de Retención y Custodia de Registros, configuraciones de almacenamiento inmutable (Object Lock).'
    },
    '5.34': { 
      nistId: 'PR.DS', 
      justification: 'Privacidad y protección de datos personales (PII) según la legislación aplicable.',
      expectedOutcome: 'Avisos de privacidad publicados, evaluaciones de impacto (DPIA) realizadas y derechos ARCO/DSAR operativos.',
      requestedEvidence: 'Avisos de Privacidad vigentes, documento DPIA para sistemas críticos, registro de atención a solicitudes de derechos.'
    },
    '5.35': { 
      nistId: 'GV.OV', 
      justification: 'Revisiones independientes y auditorías periódicas de la seguridad de la información.',
      expectedOutcome: 'Auditoría interna o externa del SGSI realizada al menos una vez al año por un tercero calificado.',
      requestedEvidence: 'Informe de Auditoría Externa/Interna ISO 27001, Plan de Acción Correctiva (CAPA) derivado de hallazgos.'
    },
    '5.36': { 
      nistId: 'GV.OV', 
      justification: 'Verificación del cumplimiento de políticas, normas y estándares técnicos.',
      expectedOutcome: 'Monitoreo automatizado del cumplimiento técnico de hardening y configuraciones de seguridad en servidores y red.',
      requestedEvidence: 'Reporte de cumplimiento de línea base de configuración (CIS Benchmarks), resultados de auditoría técnica.'
    },
    '5.37': { 
      nistId: 'PR.PS', 
      justification: 'Documentación y aplicación de procedimientos operativos estándar.',
      expectedOutcome: 'Procedimientos de administración de sistemas, redes y seguridad documentados, aprobados y disponibles.',
      requestedEvidence: 'Manual de Procedimientos Operativos de TI/Seguridad, historial de revisiones y aprobaciones en repositorio central.'
    },

    // Domain 6: Personas
    '6.1': { 
      nistId: 'PR.AT', 
      justification: 'Verificación de antecedentes de candidatos antes del empleo.',
      expectedOutcome: 'Validación previa de referencias, antecedentes penales y credenciales académicas para todo el personal nuevo.',
      requestedEvidence: 'Política de Selección de Personal, muestra de expedientes de contratación con verificación de antecedentes completada.'
    },
    '6.2': { 
      nistId: 'PR.AT', 
      justification: 'Términos contractuales que estipulan responsabilidades de seguridad.',
      expectedOutcome: 'Contratos laborales incorporan obligaciones explícitas de ciberseguridad, confidencialidad y sanciones.',
      requestedEvidence: 'Modelo de Contrato Laboral con cláusulas de ciberseguridad, acuses de firma por parte del colaborador.'
    },
    '6.3': { 
      nistId: 'PR.AT', 
      justification: 'Programa continuo de concientización, educación y formación en ciberseguridad.',
      expectedOutcome: 'Capacitación continua en ciberseguridad con cobertura >90% de empleados y pruebas mensuales de Phishing.',
      requestedEvidence: 'Plan Anual de Concientización, reportes LMS de avance por departamento, informe de tasa de clics en phishing.'
    },
    '6.4': { 
      nistId: 'PR.AT', 
      justification: 'Proceso disciplinario formal para violaciones de políticas de seguridad.',
      expectedOutcome: 'Procedimiento disciplinario claro sanciona las negligencias o violaciones voluntarias a la seguridad.',
      requestedEvidence: 'Reglamento Interior de Trabajo con capítulo de sanciones de ciberseguridad, actas disciplinarias aplicadas.'
    },
    '6.5': { 
      nistId: 'PR.AA', 
      justification: 'Responsabilidades tras la terminación o cambio de puesto de trabajo.',
      expectedOutcome: 'Notificación inmediata a TI/Seguridad para revocación total de accesos al momento de la salida del colaborador.',
      requestedEvidence: 'Tickets de desvinculación con tiempo de respuesta <2 horas para revocación de credenciales, checklist de salida.'
    },
    '6.6': { 
      nistId: 'PR.DS', 
      justification: 'Acuerdos de confidencialidad o no divulgación (NDA) firmados.',
      expectedOutcome: 'NDAs vigentes firmados por empleados, practicantes, contratistas y proveedores antes de acceder a información.',
      requestedEvidence: 'Repositorio de acuerdos NDA firmados, muestra de verificación para personal externo con acceso a datos.'
    },
    '6.7': { 
      nistId: 'PR.PS', 
      justification: 'Seguridad en el trabajo remoto y entornos móviles.',
      expectedOutcome: 'Política de Teletrabajo implementada con cifrado de disco (BitLocker/FileVault), VPN con MFA y contenedores seguros.',
      requestedEvidence: 'Política de Trabajo Remoto, reporte de MDM con estado de cifrado de laptops y configuración VPN.'
    },
    '6.8': { 
      nistId: 'DE.AE', 
      justification: 'Mecanismos para el reporte oportuno de eventos de seguridad por empleados.',
      expectedOutcome: 'Botón de reporte de Phishing u opción accesible para alertar sobre incidentes sospechosos en menos de 1 minuto.',
      requestedEvidence: 'Métricas del botón de reporte en cliente de correo, número de alertas reportadas por usuarios y atendidas.'
    },

    // Domain 7: Físico
    '7.1': { 
      nistId: 'PR.AA', 
      justification: 'Definición y protección de perímetros de seguridad física.',
      expectedOutcome: 'Barreras físicas, puertas de acceso controlado y recepción resguardan las instalaciones corporativas.',
      requestedEvidence: 'Planos de perimétro de seguridad física, inspección física de barreras y puertas con cerradura electrónica.'
    },
    '7.2': { 
      nistId: 'PR.AA', 
      justification: 'Sistemas de control de acceso físico a instalaciones críticas.',
      expectedOutcome: 'Acceso a Data Center y salas de control restringido exclusivamente a personal autorizado mediante tarjeta/biometría.',
      requestedEvidence: 'Listado de personal autorizado para ingresar a áreas críticas, logs de acceso biométrico/tarjeta de los últimos 30 días.'
    },
    '7.3': { 
      nistId: 'PR.AA', 
      justification: 'Protección física de oficinas, salas y recursos de procesamiento.',
      expectedOutcome: 'Áreas de procesamiento de datos protegidas contra intrusiones no autorizadas y miradas indiscretas.',
      requestedEvidence: 'Procedimiento de seguridad en áreas de trabajo, registros de inspecciones sorpresivas de seguridad.'
    },
    '7.4': { 
      nistId: 'DE.CM', 
      justification: 'Monitoreo físico continuo (CCTV, alarmas de intrusión).',
      expectedOutcome: 'Grabación de CCTV las 24/7 en accesos principales y áreas críticas con almacenamiento de video mínimo de 60 días.',
      requestedEvidence: 'Demostración en vivo del sistema CCTV, registros de pruebas de funcionamiento de alarmas de intrusión.'
    },
    '7.5': { 
      nistId: 'PR.IR', 
      justification: 'Protección contra amenazas físicas y desastres naturales o ambientales.',
      expectedOutcome: 'Sistemas de detección/extinción de incendios (FM200/Novec), sensores de humedad y control de temperatura en Data Center.',
      requestedEvidence: 'Certificado de mantenimiento de sistemas de extinción de incendios, logs de sensores de temperatura/humedad.'
    },

    // Domain 8: Tecnológico
    '8.1': { 
      nistId: 'PR.PS', 
      justification: 'Protección de dispositivos finales de usuario (Endpoints).',
      expectedOutcome: 'Endpoints protegidos con cifrado de disco completo, hardening corporativo y bloqueador de dispositivos USB no autorizados.',
      requestedEvidence: 'Consola MDM/Intune con % de cumplimiento de BitLocker/FileVault, política de control de puertos USB.'
    },
    '8.2': { 
      nistId: 'PR.AA', 
      justification: 'Gestión y control estricto de derechos de acceso privileged.',
      expectedOutcome: 'Uso de solución PAM (Privileged Access Management) con rotación automática de credenciales y grabación de sesiones.',
      requestedEvidence: 'Consola PAM (CyberArk/BeyondTrust), reporte de cuentas con privilegios administrativos, grabaciones de sesión.'
    },
    '8.5': { 
      nistId: 'PR.AA', 
      justification: 'Mecanismos de autenticación robusta (MFA, contraseñas complejas).',
      expectedOutcome: 'MFA activado obligatoriamente en el 100% de usuarios para accesos remotos, VPN, SaaS corporativos y consolas.',
      requestedEvidence: 'Captura de pantalla de Conditional Access (Azure AD/Okta/IAM), reporte de usuarios enrolados en MFA.'
    },
    '8.7': { 
      nistId: 'PR.PS', 
      justification: 'Protección y detección automatizada contra código malicioso (EDR/Antivirus).',
      expectedOutcome: 'EDR de última generación instalado en el 100% de servidores y laptops con reglas de aislamiento automatizadas.',
      requestedEvidence: 'Reporte de cobertura de agentes desde consola EDR (CrowdStrike/Defender/SentinelOne), logs de alertas mitigadas.'
    },
    '8.8': { 
      nistId: 'ID.RA', 
      justification: 'Gestión, escaneo y parcheo de vulnerabilidades técnicas.',
      expectedOutcome: 'Escaneo mensual de infraestructura e hipervisores con remediación de parches críticos en un tiempo menor a 14 días.',
      requestedEvidence: 'Reportes de escaneo Nessus/Qualys/Tenable, matriz de aplicación de parches de seguridad (WSUS/Patch Manager).'
    },
    '8.12': { 
      nistId: 'PR.DS', 
      justification: 'Prevención de fuga de datos (DLP) en red, endpoint y nube.',
      expectedOutcome: 'Reglas DLP activas bloqueando el envío de PII, tarjetas de crédito y código fuente por canales no autorizados.',
      requestedEvidence: 'Consola DLP con políticas configuradas en modo Bloqueo, reporte de incidentes de intento de exfiltración de información.'
    },
    '8.13': { 
      nistId: 'PR.DS', 
      justification: 'Estrategia y realización periódica de copias de seguridad (Backups).',
      expectedOutcome: 'Backups automatizados diarios, cifrados e inmutables (regla 3-2-1) con pruebas de restauración trimestrales.',
      requestedEvidence: 'Logs de finalización exitosa de respaldos, acta de prueba de restauración de base de datos crítica.'
    },
    '8.15': { 
      nistId: 'DE.AE', 
      justification: 'Generación, registro y recolección centralizada de eventos de auditoría (Logs).',
      expectedOutcome: 'Centralización de eventos en SIEM con sincronización de tiempo NTP y retención garantizada de 365 días.',
      requestedEvidence: 'Captura de pantalla de la consola SIEM (Splunk/Elastic/Sentinel), lista de fuentes de logs activas, prueba NTP.'
    },
    '8.16': { 
      nistId: 'DE.CM', 
      justification: 'Monitoreo continuo de eventos, tráfico y comportamientos anómalos (SIEM/SOC).',
      expectedOutcome: 'Operación de un SOC 24/7 monitoreando alertas de seguridad con tiempo de respuesta a incidentes (MTTR) < 30 minutos.',
      requestedEvidence: 'SLA del servicio SOC, informes mensuales de métricas de monitoreo (MTTD/MTTR), muestra de escalamiento de alertas.'
    },
    '8.20': { 
      nistId: 'PR.IR', 
      justification: 'Seguridad y protección de redes de datos corporativas.',
      expectedOutcome: 'Firewalls Next-Gen (NGFW) en perimétro con inspección de tráfico SSL/TLS, IPS/IDS y filtrado de reputación.',
      requestedEvidence: 'Diagrama de arquitectura de red perimetral, reglas de firewall auditadas, registros de bloqueos IPS.'
    },
    '8.22': { 
      nistId: 'PR.IR', 
      justification: 'Segmentación de redes (VLANs, Firewalls, Microsegmentación).',
      expectedOutcome: 'Red corporativa segmentada en VLANs independientes (Usuarios, Servidores, DMZ, IoT, Gestión) aisladas por Firewall.',
      requestedEvidence: 'Configuración de VLANs y listas de acceso (ACLs) en switches/firewalls, reporte de pruebas de aislamiento.'
    },
    '8.24': { 
      nistId: 'PR.DS', 
      justification: 'Uso adecuado de técnicas de criptografía para datos en reposo y tránsito.',
      expectedOutcome: 'Cifrado AES-256 para datos en reposo (bases de datos, discos) y TLS 1.3 para datos en tránsito en todas las aplicaciones.',
      requestedEvidence: 'Configuraciones de TLS en servidores web (Qualys SSL Labs A+), parámetros de cifrado de base de datos (TDE).'
    },
    '8.25': { 
      nistId: 'PR.PS', 
      justification: 'Ciclo de vida de desarrollo seguro de software (SSDLC).',
      expectedOutcome: 'Análisis de código estático (SAST) y dinámico (DAST) automatizado en el pipeline de despliegue continuo CI/CD.',
      requestedEvidence: 'Pipeline CI/CD con etapa de escaneo de seguridad (SonarQube/Snyk), política de calidad con umbral de cero hallazgos críticos.'
    }
  };

  const found = mappings[isoId];
  if (found) {
    return {
      nistId: found.nistId,
      justification: found.justification,
      expectedOutcome: found.expectedOutcome || `Procedimiento operativo y controles vigentes para el cumplimiento del control ISO ${isoId}.`,
      requestedEvidence: found.requestedEvidence || `Documento de política/procedimiento aprobado, registros de configuración técnica y bitácoras de operación.`
    };
  }

  // Generic intelligent fallback for remaining ISO controls
  const domainChar = isoId.split('.')[0];
  let defaultOutcome = `Implementación efectiva y operación continua del control ISO ${isoId}.`;
  let defaultEvidence = `Política o procedimiento operativo formalizado, registros de ejecución y evidencia de auditoría técnica.`;

  if (domainChar === '5') {
    defaultOutcome = `Política organizacional y responsabilidad asignada para ${isoId} alineada con el SGSI.`;
    defaultEvidence = `Documento normativo de la política, actas de revisión ejecutiva y registros de difusión.`;
  } else if (domainChar === '6') {
    defaultOutcome = `Salvaguardas de talento humano y gestión de personas activas para el control ISO ${isoId}.`;
    defaultEvidence = `Expedientes de personal, acuerdos firmados, registros de capacitación o evidencias de RRHH.`;
  } else if (domainChar === '7') {
    defaultOutcome = `Protección física, ambiental y de perímetro operacionalizada para el control ISO ${isoId}.`;
    defaultEvidence = `Bitácoras de acceso físico, informes de mantenimiento preventivo y registros de inspección en sitio.`;
  } else if (domainChar === '8') {
    defaultOutcome = `Mecanismo técnico automatizado, configurado y monitoreado para el control ISO ${isoId}.`;
    defaultEvidence = `Capturas de configuración del sistema, logs de eventos de auditoría y reportes técnicos de la consola central.`;
  }

  return {
    nistId: 'GV.PO',
    justification: 'Alineación de controles de seguridad con la política y marco de gobernanza.',
    expectedOutcome: defaultOutcome,
    requestedEvidence: defaultEvidence
  };
}

// Generate FULL MAPPINGS list for all 93 ISO controls
export const ALL_ISO_MAPPINGS: Mapping[] = ISO_27001_CONTROLS_93.map((c) => {
  const mapped = getMappedNistCategoryForIso(c.id);
  return {
    id: `map-${c.id}`,
    isoControlId: c.id,
    nistCategoryId: mapped.nistId,
    justification: mapped.justification,
    expectedOutcome: mapped.expectedOutcome,
    requestedEvidence: mapped.requestedEvidence,
    implementationStatus: 0 // Will be computed dynamically from checklist or state overrides
  };
});
