export interface Nist2Function {
  code: 'GV' | 'ID' | 'PR' | 'DE' | 'RS' | 'RC';
  name: string;
  englishName: string;
  description: string;
  color: string;
}

export interface Nist2Category {
  id: string;
  functionCode: 'GV' | 'ID' | 'PR' | 'DE' | 'RS' | 'RC';
  name: string;
  description: string;
}

export interface Nist2Subcategory {
  id: string;
  categoryId: string;
  functionCode: 'GV' | 'ID' | 'PR' | 'DE' | 'RS' | 'RC';
  title: string;
  description: string;
}

export const NIST_FUNCTIONS: Nist2Function[] = [
  {
    code: 'GV',
    name: 'Gobernar (Govern)',
    englishName: 'Govern',
    description: 'Establece y monitorea la estrategia de gestión de riesgos de ciberseguridad de la organización, sus expectativas y sus políticas.',
    color: '#c0a080'
  },
  {
    code: 'ID',
    name: 'Identificar (Identify)',
    englishName: 'Identify',
    description: 'Comprende el contexto organizacional de ciberseguridad para gestionar los riesgos en activos, personas, datos y capacidades.',
    color: '#3b82f6'
  },
  {
    code: 'PR',
    name: 'Proteger (Protect)',
    englishName: 'Protect',
    description: 'Implementa salvaguardas para garantizar la prestación de servicios críticos y limitar el impacto de eventos adversos.',
    color: '#10b981'
  },
  {
    code: 'DE',
    name: 'Detectar (Detect)',
    englishName: 'Detect',
    description: 'Desarrolla e implementa actividades oportunas para identificar la ocurrencia de eventos de ciberseguridad.',
    color: '#f59e0b'
  },
  {
    code: 'RS',
    name: 'Responder (Respond)',
    englishName: 'Respond',
    description: 'Ejecuta acciones tras la detección de un incidente de ciberseguridad para contenerlo, analizarlo y mitigar sus efectos.',
    color: '#ef4444'
  },
  {
    code: 'RC',
    name: 'Recuperar (Recover)',
    englishName: 'Recover',
    description: 'Desarrolla y mantiene capacidades para la resiliencia y restauración oportuna de operaciones o servicios afectados.',
    color: '#8b5cf6'
  }
];

export const NIST_2_CATEGORIES: Nist2Category[] = [
  // GOVERN (6 Categorías)
  { id: 'GV.OC', functionCode: 'GV', name: 'Contexto Organizacional (GV.OC)', description: 'Se comprenden las circunstancias generales que afectan las decisiones de gestión de riesgos de ciberseguridad.' },
  { id: 'GV.RM', functionCode: 'GV', name: 'Estrategia de Gestión de Riesgos (GV.RM)', description: 'Se establecen, comunican y utilizan las prioridades, tolerancias y apetito de riesgo de la organización.' },
  { id: 'GV.RR', functionCode: 'GV', name: 'Roles, Responsabilidades y Autoridades (GV.RR)', description: 'Se establecen, comunican y coordinan los roles y responsabilidades de ciberseguridad.' },
  { id: 'GV.PO', functionCode: 'GV', name: 'Políticas (GV.PO)', description: 'La política de ciberseguridad es establecida, comunicada, aplicada y revisada periódicamente.' },
  { id: 'GV.OV', functionCode: 'GV', name: 'Supervisión (GV.OV)', description: 'Los resultados de ciberseguridad se monitorean para informar y ajustar la estrategia organizacional.' },
  { id: 'GV.SC', functionCode: 'GV', name: 'Cadena de Suministro (GV.SC)', description: 'Se gestionan y supervisan los riesgos de ciberseguridad asociados a proveedores y cadena de suministro.' },

  // IDENTIFY (3 Categorías)
  { id: 'ID.AM', functionCode: 'ID', name: 'Gestión de Activos (ID.AM)', description: 'Los activos tecnológicos, de información y personas se identifican y gestionan según su importancia.' },
  { id: 'ID.RA', functionCode: 'ID', name: 'Evaluación de Riesgos (ID.RA)', description: 'La organización comprende el riesgo de ciberseguridad para sus operaciones, activos e individuos.' },
  { id: 'ID.IM', functionCode: 'ID', name: 'Mejora (ID.IM)', description: 'Se identifican e implementan mejoras en los procesos de ciberseguridad basándose en lecciones aprendidas.' },

  // PROTECT (5 Categorías)
  { id: 'PR.AA', functionCode: 'PR', name: 'Gestión de Identidad y Accesos (PR.AA)', description: 'El acceso a activos físicos y lógicos se limita a usuarios, procesos y dispositivos autorizados.' },
  { id: 'PR.AT', functionCode: 'PR', name: 'Concienciación y Capacitación (PR.AT)', description: 'El personal de la organización recibe capacitación y concientización continua en ciberseguridad.' },
  { id: 'PR.DS', functionCode: 'PR', name: 'Seguridad de los Datos (PR.DS)', description: 'Los datos se gestionan con salvaguardas para proteger su confidencialidad, integridad y disponibilidad.' },
  { id: 'PR.PS', functionCode: 'PR', name: 'Seguridad de Plataformas (PR.PS)', description: 'El hardware, software y plataformas se configuran y mantienen de forma segura.' },
  { id: 'PR.IR', functionCode: 'PR', name: 'Resiliencia de Infraestructura (PR.IR)', description: 'Las arquitecturas e infraestructuras tecnológicas se gestionan para resistir eventos adversos.' },

  // DETECT (2 Categorías)
  { id: 'DE.CM', functionCode: 'DE', name: 'Monitoreo Continuo (DE.CM)', description: 'Los activos y redes se monitorean de forma continua para identificar anomalias y eventos sospechosos.' },
  { id: 'DE.AE', functionCode: 'DE', name: 'Análisis de Eventos Adversos (DE.AE)', description: 'Las anomalías e indicadores de compromiso se analizan para confirmar incidentes de ciberseguridad.' },

  // RESPOND (4 Categorías)
  { id: 'RS.MA', functionCode: 'RS', name: 'Gestión de Incidentes (RS.MA)', description: 'Se gestiona la ejecución y coordinación de las respuestas a incidentes detectados.' },
  { id: 'RS.AN', functionCode: 'RS', name: 'Análisis de Incidentes (RS.AN)', description: 'Se investigan los incidentes para asegurar una respuesta adecuada y preservar evidencias.' },
  { id: 'RS.CO', functionCode: 'RS', name: 'Comunicación de Respuesta (RS.CO)', description: 'Las actividades de respuesta se coordinan y comunican con las partes interesadas internas y externas.' },
  { id: 'RS.MI', functionCode: 'RS', name: 'Mitigación de Incidentes (RS.MI)', description: 'Se ejecutan acciones para contener el incidente, prevenir su expansión y mitigar su impacto.' },

  // RECOVER (2 Categorías)
  { id: 'RC.RP', functionCode: 'RC', name: 'Planes de Recuperación (RC.RP)', description: 'Se ejecutan procesos de restauración para asegurar la disponibilidad de sistemas y servicios.' },
  { id: 'RC.CO', functionCode: 'RC', name: 'Comunicación de Recuperación (RC.CO)', description: 'Las actividades de restauración se comunican a audiencias internas y externas correspondientes.' }
];

export const NIST_2_SUBCATEGORIES: Nist2Subcategory[] = [
  // ==========================================
  // 1. GOVERN (GV) - 31 SUBCATEGORÍAS
  // ==========================================
  // GV.OC - Contexto Organizacional (5)
  { id: 'GV.OC-01', categoryId: 'GV.OC', functionCode: 'GV', title: 'Misión y Propósito', description: 'La misión, visión y metas organizacionales se comprenden e informan las decisiones de ciberseguridad.' },
  { id: 'GV.OC-02', categoryId: 'GV.OC', functionCode: 'GV', title: 'Partes Interesadas', description: 'Se identifican, documentan y consideran las expectativas de partes interesadas internas y externas.' },
  { id: 'GV.OC-03', categoryId: 'GV.OC', functionCode: 'GV', title: 'Requisitos Legales y Regulatorios', description: 'Se determinan, comprenden y comunican los requisitos legales, regulatorios y contractuales de ciberseguridad.' },
  { id: 'GV.OC-04', categoryId: 'GV.OC', functionCode: 'GV', title: 'Funciones Críticas y Servicios', description: 'Se identifican y priorizan las funciones críticas y servicios esenciales de la organización.' },
  { id: 'GV.OC-05', categoryId: 'GV.OC', functionCode: 'GV', title: 'Integración en Planificación Estratégica', description: 'Los resultados y necesidades de ciberseguridad se integran en la planificación financiera y operativa.' },

  // GV.RM - Estrategia de Gestión de Riesgos (7)
  { id: 'GV.RM-01', categoryId: 'GV.RM', functionCode: 'GV', title: 'Tolerancia al Riesgo', description: 'El apetito y la tolerancia al riesgo organizacional son definidos, aprobados por la dirección y comunicados.' },
  { id: 'GV.RM-02', categoryId: 'GV.RM', functionCode: 'GV', title: 'Metodología de Evaluación de Riesgos', description: 'Se definen, documentan e implementan marcos estándar para la evaluación y priorización del riesgo.' },
  { id: 'GV.RM-03', categoryId: 'GV.RM', functionCode: 'GV', title: 'Alineación de Decisiones', description: 'Las decisiones operativas y estratégicas se toman en función de los niveles de tolerancia al riesgo.' },
  { id: 'GV.RM-04', categoryId: 'GV.RM', functionCode: 'GV', title: 'Comunicación de Riesgos', description: 'Se establecen canales formales para la comunicación y escalamiento del riesgo a todos los niveles.' },
  { id: 'GV.RM-05', categoryId: 'GV.RM', functionCode: 'GV', title: 'Criterios de Revisión', description: 'Se establecen criterios claros para revisar periódicamente la postura y perfil de riesgo cibernético.' },
  { id: 'GV.RM-06', categoryId: 'GV.RM', functionCode: 'GV', title: 'Evaluación de Efectividad', description: 'Las actividades de gestión de riesgos se evalúan regularmente para medir su efectividad y madurez.' },
  { id: 'GV.RM-07', categoryId: 'GV.RM', functionCode: 'GV', title: 'Marcos y Estándares de Referencia', description: 'La gestión de riesgos adopta y se alinea formalmente con estándares internacionales como NIST e ISO.' },

  // GV.RR - Roles, Responsabilidades y Autoridades (4)
  { id: 'GV.RR-01', categoryId: 'GV.RR', functionCode: 'GV', title: 'Asignación de Roles', description: 'Se definen y asignan roles, responsabilidades y autoridades de ciberseguridad para todo el personal.' },
  { id: 'GV.RR-02', categoryId: 'GV.RR', functionCode: 'GV', title: 'Responsabilidad de la Alta Dirección', description: 'La alta dirección asume la supervisión y responsabilidad final de la gobernanza de ciberseguridad.' },
  { id: 'GV.RR-03', categoryId: 'GV.RR', functionCode: 'GV', title: 'Asignación de Recursos', description: 'Se asignan recursos humanos, tecnológicos y presupuestarios adecuados para ciberseguridad.' },
  { id: 'GV.RR-04', categoryId: 'GV.RR', functionCode: 'GV', title: 'Segregación de Funciones', description: 'Se estructuran roles con adecuada segregación de funciones para prevenir conflictos de interés.' },

  // GV.PO - Políticas (3)
  { id: 'GV.PO-01', categoryId: 'GV.PO', functionCode: 'GV', title: 'Establecimiento de Políticas', description: 'Se desarrollan, aprueban y publican políticas institucionales de ciberseguridad claras y accesibles.' },
  { id: 'GV.PO-02', categoryId: 'GV.PO', functionCode: 'GV', title: 'Revisión y Actualización', description: 'Las políticas se revisan al menos anualmente o ante cambios organizacionales y de amenazas.' },
  { id: 'GV.PO-03', categoryId: 'GV.PO', functionCode: 'GV', title: 'Monitoreo de Cumplimiento de Políticas', description: 'Se establecen mecanismos continuos para verificar la aplicación y cumplimiento de las políticas.' },

  // GV.OV - Supervisión (3)
  { id: 'GV.OV-01', categoryId: 'GV.OV', functionCode: 'GV', title: 'Monitoreo de Resultados de Ciberseguridad', description: 'Se miden y monitorean los indicadores clave de desempeño (KPI) y de riesgo (KRI) de ciberseguridad.' },
  { id: 'GV.OV-02', categoryId: 'GV.OV', functionCode: 'GV', title: 'Revisión Directiva de la Estrategia', description: 'La estrategia de ciberseguridad se ajusta en función de auditorías, métricas y cambios de contexto.' },
  { id: 'GV.OV-03', categoryId: 'GV.OV', functionCode: 'GV', title: 'Evaluaciones e Inspecciones Independientes', description: 'Se realizan revisiones, auditorías externas e inspecciones independientes de la postura de seguridad.' },

  // GV.SC - Cadena de Suministro (9)
  { id: 'GV.SC-01', categoryId: 'GV.SC', functionCode: 'GV', title: 'Programa C-SCRM', description: 'Se establece un programa formal de gestión de riesgos cibernéticos en la cadena de suministro.' },
  { id: 'GV.SC-02', categoryId: 'GV.SC', functionCode: 'GV', title: 'Inventario de Proveedores', description: 'Se identifican, clasifican y documentan todos los proveedores y socios tecnológicos de la cadena.' },
  { id: 'GV.SC-03', categoryId: 'GV.SC', functionCode: 'GV', title: 'Requisitos en Contratos', description: 'Los requisitos de ciberseguridad se integran en acuerdos contractuales y SLAs con terceros.' },
  { id: 'GV.SC-04', categoryId: 'GV.SC', functionCode: 'GV', title: 'Evaluación de Proveedores', description: 'Se realizan evaluaciones periódicas de la postura de ciberseguridad de proveedores críticos.' },
  { id: 'GV.SC-05', categoryId: 'GV.SC', functionCode: 'GV', title: 'Gestión de Fin de Vida de Productos', description: 'Se establecen salvaguardas para el retiro y desincorporación segura de soluciones de proveedores.' },
  { id: 'GV.SC-06', categoryId: 'GV.SC', functionCode: 'GV', title: 'Resiliencia de la Cadena', description: 'Se planifican estrategias para mitigar interrupciones o fallos en proveedores de servicios clave.' },
  { id: 'GV.SC-07', categoryId: 'GV.SC', functionCode: 'GV', title: 'Validación de Componentes', description: 'Se verifican y prueban los componentes de software y hardware suministrados antes de su despliegue.' },
  { id: 'GV.SC-08', categoryId: 'GV.SC', functionCode: 'GV', title: 'Planes de Contingencia con Terceros', description: 'Se elaboran planes alternativos ante la pérdida imprevista de un proveedor esencial.' },
  { id: 'GV.SC-09', categoryId: 'GV.SC', functionCode: 'GV', title: 'Coordinación de Respuesta con Proveedores', description: 'Se establecen protocolos de notificación y respuesta conjunta a incidentes con proveedores.' },

  // ==========================================
  // 2. IDENTIFY (ID) - 20 SUBCATEGORÍAS
  // ==========================================
  // ID.AM - Gestión de Activos (8)
  { id: 'ID.AM-01', categoryId: 'ID.AM', functionCode: 'ID', title: 'Inventario de Hardware', description: 'Se mantiene un inventario exhaustivo y actualizado de todos los dispositivos físicos y componentes de red.' },
  { id: 'ID.AM-02', categoryId: 'ID.AM', functionCode: 'ID', title: 'Inventario de Software', description: 'Se identifican y registran los programas informáticos, licencias y aplicaciones autorizadas.' },
  { id: 'ID.AM-03', categoryId: 'ID.AM', functionCode: 'ID', title: 'Mapeo de Redes y Flujos de Datos', description: 'Se documentan los diagramas de red, interconexiones y los flujos de datos sensibles.' },
  { id: 'ID.AM-04', categoryId: 'ID.AM', functionCode: 'ID', title: 'Inventario de Servicios Cloud', description: 'Se identifican y catalogan los servicios en la nube (SaaS, PaaS, IaaS) e infraestructuras externas.' },
  { id: 'ID.AM-05', categoryId: 'ID.AM', functionCode: 'ID', title: 'Clasificación de Activos', description: 'Los activos se categorizan en función de su criticidad para el negocio y sensibilidad de información.' },
  { id: 'ID.AM-06', categoryId: 'ID.AM', functionCode: 'ID', title: 'Propietarios de Activos', description: 'Se asigna explícitamente un propietario responsable para cada activo físico, lógico o de información.' },
  { id: 'ID.AM-07', categoryId: 'ID.AM', functionCode: 'ID', title: 'Disposición Segura de Activos', description: 'Se siguen procedimientos seguros de sanitización y borrado para la baja final de activos.' },
  { id: 'ID.AM-08', categoryId: 'ID.AM', functionCode: 'ID', title: 'Clasificación de Datos', description: 'La información se etiqueta y gestiona según niveles de confidencialidad e integridad definiendo accesos.' },

  // ID.RA - Evaluación de Riesgos (8)
  { id: 'ID.RA-01', categoryId: 'ID.RA', functionCode: 'ID', title: 'Identificación de Vulnerabilidades', description: 'Se identifican, escanean y documentan continuamente las vulnerabilidades de sistemas y aplicaciones.' },
  { id: 'ID.RA-02', categoryId: 'ID.RA', functionCode: 'ID', title: 'Inteligencia de Amenazas', description: 'Se recopila y analiza inteligencia sobre ciberamenazas (Cyber Threat Intelligence) relevante para el sector.' },
  { id: 'ID.RA-03', categoryId: 'ID.RA', functionCode: 'ID', title: 'Identificación de Amenazas', description: 'Se catalogan las amenazas internas y externas, incluyendo actores maliciosos y desastres.' },
  { id: 'ID.RA-04', categoryId: 'ID.RA', functionCode: 'ID', title: 'Análisis de Impacto en el Negocio', description: 'Se determinan las consecuencias e impactos operativos, financieros y legales de potenciales fallas.' },
  { id: 'ID.RA-05', categoryId: 'ID.RA', functionCode: 'ID', title: 'Estimación de Probabilidades', description: 'Se evalúa la probabilidad de explotación de vulnerabilidades por parte de las amenazas identificadas.' },
  { id: 'ID.RA-06', categoryId: 'ID.RA', functionCode: 'ID', title: 'Priorización de Tratamiento de Riesgo', description: 'Los riesgos de ciberseguridad se calculan, comparan con la tolerancia y se priorizan para su mitigación.' },
  { id: 'ID.RA-07', categoryId: 'ID.RA', functionCode: 'ID', title: 'Evaluación ante Cambios Tecnológicos', description: 'Las evaluaciones de riesgo se actualizan antes de introducir cambios mayores en infraestructura o procesos.' },
  { id: 'ID.RA-08', categoryId: 'ID.RA', functionCode: 'ID', title: 'Riesgos de Inteligencia Artificial', description: 'Se identifican y analizan los riesgos de ciberseguridad asociados a la adopción de herramientas de IA.' },

  // ID.IM - Mejora (4)
  { id: 'ID.IM-01', categoryId: 'ID.IM', functionCode: 'ID', title: 'Lecciones Aprendidas', description: 'Se realizan análisis post-incidente y ejercicios para incorporar lecciones aprendidas al programa.' },
  { id: 'ID.IM-02', categoryId: 'ID.IM', functionCode: 'ID', title: 'Actualización de Procesos', description: 'Se actualizan continuamente los procedimientos operativos de gestión de riesgos e identificación.' },
  { id: 'ID.IM-03', categoryId: 'ID.IM', functionCode: 'ID', title: 'Seguimiento de Remediaciones', description: 'Se monitorea el avance y cumplimiento de los planes de acción derivados de hallazgos y hallazgos.' },
  { id: 'ID.IM-04', categoryId: 'ID.IM', functionCode: 'ID', title: 'Evaluaciones de Madurez (Benchmarking)', description: 'Se evalúa periódicamente la madurez del programa comparándola con pares del sector.' },

  // ==========================================
  // 3. PROTECT (PR) - 21 SUBCATEGORÍAS
  // ==========================================
  // PR.AA - Gestión de Identidad y Accesos (6)
  { id: 'PR.AA-01', categoryId: 'PR.AA', functionCode: 'PR', title: 'Gestión de Identidades', description: 'Se emiten, administran y revocan las identidades digitales de empleados, contratistas y sistemas.' },
  { id: 'PR.AA-02', categoryId: 'PR.AA', functionCode: 'PR', title: 'Control de Acceso Físico', description: 'El acceso físico a instalaciones, centros de datos y áreas sensibles se restringe y monitorea.' },
  { id: 'PR.AA-03', categoryId: 'PR.AA', functionCode: 'PR', title: 'Menor Privilegio (RBAC)', description: 'El acceso lógico a información y sistemas se otorga bajo el principio de menor privilegio e idoneidad.' },
  { id: 'PR.AA-04', categoryId: 'PR.AA', functionCode: 'PR', title: 'Autenticación Robusta (MFA)', description: 'Se exige autenticación de múltiples factores (MFA) para accesos remotos, privilegiados y sensibles.' },
  { id: 'PR.AA-05', categoryId: 'PR.AA', functionCode: 'PR', title: 'Recertificación de Accesos', description: 'Se realizan revisiones y recertificaciones periódicas de permisos y cuentas activas.' },
  { id: 'PR.AA-06', categoryId: 'PR.AA', functionCode: 'PR', title: 'Gestión de Cuentas Privilegiadas (PAM)', description: 'Se aseguran, auditan y custodian las credenciales administrativas mediante soluciones PAM.' },

  // PR.AT - Concienciación y Capacitación (5)
  { id: 'PR.AT-01', categoryId: 'PR.AT', functionCode: 'PR', title: 'Capacitación General', description: 'Se imparten cursos de concientización sobre ciberseguridad a todo el personal durante su ciclo laboral.' },
  { id: 'PR.AT-02', categoryId: 'PR.AT', functionCode: 'PR', title: 'Capacitación Especializada', description: 'El personal técnico y de TI recibe formación avanzada sobre codificación segura, redes y defensas.' },
  { id: 'PR.AT-03', categoryId: 'PR.AT', functionCode: 'PR', title: 'Capacitación a Terceros', description: 'Los proveedores y contratistas reciben instrucciones sobre los estándares de seguridad exigidos.' },
  { id: 'PR.AT-04', categoryId: 'PR.AT', functionCode: 'PR', title: 'Concienciación Ejecutiva', description: 'Los directivos reciben capacitación sobre su rol en la toma de decisiones y riesgos de ciberseguridad.' },
  { id: 'PR.AT-05', categoryId: 'PR.AT', functionCode: 'PR', title: 'Simulaciones de Phishing', description: 'Se realizan campañas periódicas de simulación de ingeniería social para medir y elevar la cultura.' },

  // PR.DS - Seguridad de los Datos (5)
  { id: 'PR.DS-01', categoryId: 'PR.DS', functionCode: 'PR', title: 'Cifrado de Datos en Reposo', description: 'Se aplican algoritmos de cifrado fuertes para proteger datos confidenciales almacenados en discos y BD.' },
  { id: 'PR.DS-02', categoryId: 'PR.DS', functionCode: 'PR', title: 'Cifrado de Datos en Tránsito', description: 'Se asegura el tráfico de red y comunicaciones mediante protocolos criptográficos modernos (TLS).' },
  { id: 'PR.DS-10', categoryId: 'PR.DS', functionCode: 'PR', title: 'Prevención de Fuga de Datos (DLP)', description: 'Se monitorean y previenen las transferencias no autorizadas de información sensible fuera de la red.' },
  { id: 'PR.DS-11', categoryId: 'PR.DS', functionCode: 'PR', title: 'Gestión de Copias de Seguridad', description: 'Se realizan copias de respaldo periódicas en ubicaciones aisladas e inmutables (Air-gapped).' },
  { id: 'PR.DS-12', categoryId: 'PR.DS', functionCode: 'PR', title: 'Pruebas de Restauración', description: 'Se verifica frecuentemente la integridad y capacidad de restauración efectiva de los respaldos.' },

  // PR.PS - Seguridad de Plataformas (5)
  { id: 'PR.PS-01', categoryId: 'PR.PS', functionCode: 'PR', title: 'Configuración Segura (Hardening)', description: 'Se establecen y aplican plantillas de configuración segura (baselines) a servidores y equipos.' },
  { id: 'PR.PS-02', categoryId: 'PR.PS', functionCode: 'PR', title: 'Gestión de Parches', description: 'Se prueban e instalan de forma oportuna parches de seguridad en sistemas operativos y software.' },
  { id: 'PR.PS-03', categoryId: 'PR.PS', functionCode: 'PR', title: 'Protección contra Malware (EDR)', description: 'Se despliegan soluciones de Detección y Respuesta en Endpoint (EDR) con actualización continua.' },
  { id: 'PR.PS-04', categoryId: 'PR.PS', functionCode: 'PR', title: 'Desarrollo Seguro de Software (DevSecOps)', description: 'Se integran revisiones de seguridad, pruebas SAST/DAST y análisis de código en el ciclo SDLC.' },
  { id: 'PR.PS-05', categoryId: 'PR.PS', functionCode: 'PR', title: 'Control de Ejecución de Software', description: 'Se restringe la ejecución de software no autorizado en dispositivos mediante políticas de lista blanca.' },

  // PR.IR - Resiliencia de la Infraestructura (2)
  { id: 'PR.IR-01', categoryId: 'PR.IR', functionCode: 'PR', title: 'Segmentación de Red', description: 'Las redes corporativas e industriales se dividen en zonas de seguridad aisladas por firewalls.' },
  { id: 'PR.IR-02', categoryId: 'PR.IR', functionCode: 'PR', title: 'Redundancia y Alta Disponibilidad', description: 'Se configuran enlaces, servidores y componentes clave con redundancia para evitar puntos de falla.' },

  // ==========================================
  // 4. DETECT (DE) - 11 SUBCATEGORÍAS
  // ==========================================
  // DE.CM - Monitoreo Continuo (6)
  { id: 'DE.CM-01', categoryId: 'DE.CM', functionCode: 'DE', title: 'Monitoreo de Red', description: 'Se analizan continuamente los paquetes y flujos de red para detectar intrusiones o anomalias.' },
  { id: 'DE.CM-02', categoryId: 'DE.CM', functionCode: 'DE', title: 'Monitoreo de Entorno Físico', description: 'Se inspeccionan sensores de acceso y cámaras de seguridad física para detectar eventos no autorizados.' },
  { id: 'DE.CM-03', categoryId: 'DE.CM', functionCode: 'DE', title: 'Monitoreo de Personal y Cuentas', description: 'Se supervisa el comportamiento de usuarios privilegiados para identificar actividades sospechosas.' },
  { id: 'DE.CM-06', categoryId: 'DE.CM', functionCode: 'DE', title: 'Centralización de Eventos (SIEM)', description: 'Se recolectan y centralizan los eventos y registros (logs) de todos los activos en una plataforma SIEM.' },
  { id: 'DE.CM-07', categoryId: 'DE.CM', functionCode: 'DE', title: 'Escaneo Continuo de Vulnerabilidades', description: 'Se monitorea la infraestructura en busca de nuevas vulnerabilidades técnicas o configuraciones débiles.' },
  { id: 'DE.CM-09', categoryId: 'DE.CM', functionCode: 'DE', title: 'Monitoreo de Servicios Externos', description: 'Se supervisa la disponibilidad y seguridad de las conexiones e integraciones con servicios cloud.' },

  // DE.AE - Análisis de Eventos Adversos (5)
  { id: 'DE.AE-02', categoryId: 'DE.AE', functionCode: 'DE', title: 'Correlación de Eventos', description: 'Se aplican reglas de correlación e inteligencia artificial para relacionar eventos dispersos.' },
  { id: 'DE.AE-03', categoryId: 'DE.AE', functionCode: 'DE', title: 'Alertamiento y Umbrales', description: 'Se configuran umbrales precisos para gatillar alertas automáticas ante comportamientos anómalos.' },
  { id: 'DE.AE-04', categoryId: 'DE.AE', functionCode: 'DE', title: 'Análisis de Alcance e Impacto', description: 'Los analistas de seguridad investigan las alertas confirmando si constituyen un incidente real.' },
  { id: 'DE.AE-06', categoryId: 'DE.AE', functionCode: 'DE', title: 'Integración de IoCs', description: 'Se integran indicadores de compromiso (IoC) actualizados en las herramientas de detección.' },
  { id: 'DE.AE-07', categoryId: 'DE.AE', functionCode: 'DE', title: 'Pruebas de Ciberamenazas (Red Teaming)', description: 'Se realizan ejercicios de simulación de adversarios para evaluar la efectividad de la detección.' },

  // ==========================================
  // 5. RESPOND (RS) - 14 SUBCATEGORÍAS
  // ==========================================
  // RS.MA - Gestión de Incidentes (4)
  { id: 'RS.MA-01', categoryId: 'RS.MA', functionCode: 'RS', title: 'Plan de Respuesta a Incidentes', description: 'Se mantiene y prueba regularmente un plan documentado de respuesta a incidentes de ciberseguridad.' },
  { id: 'RS.MA-02', categoryId: 'RS.MA', functionCode: 'RS', title: 'Clasificación y Triage', description: 'Se categorizan y priorizan los incidentes según su severidad, impacto y urgencia.' },
  { id: 'RS.MA-03', categoryId: 'RS.MA', functionCode: 'RS', title: 'Asignación de Equipo CSIRT', description: 'Se cuenta con un equipo de respuesta a incidentes (CSIRT) con roles e instrucciones precisas.' },
  { id: 'RS.MA-04', categoryId: 'RS.MA', functionCode: 'RS', title: 'Escalamiento Operativo', description: 'Se ejecutan los protocolos de escalamiento hacia gerencia y comités según el nivel de gravedad.' },

  // RS.AN - Análisis de Incidentes (3)
  { id: 'RS.AN-03', categoryId: 'RS.AN', functionCode: 'RS', title: 'Análisis de Causa Raíz', description: 'Se investiga a fondo el origen y los vectores utilizados por los atacantes para evitar recurrencias.' },
  { id: 'RS.AN-06', categoryId: 'RS.AN', functionCode: 'RS', title: 'Determinación de Alcance', description: 'Se evalúa con exactitud la extensión de los sistemas, datos y procesos comprometidos.' },
  { id: 'RS.AN-08', categoryId: 'RS.AN', functionCode: 'RS', title: 'Forense Digital', description: 'Se conserva la cadena de custodia y se analizan evidencias digitales conforme a estándares legales.' },

  // RS.CO - Comunicación de Respuesta (4)
  { id: 'RS.CO-02', categoryId: 'RS.CO', functionCode: 'RS', title: 'Notificación Interna', description: 'Se mantiene informados a ejecutivos, asesoría jurídica y empleados según la evolución del evento.' },
  { id: 'RS.CO-03', categoryId: 'RS.CO', functionCode: 'RS', title: 'Notificación a Autoridades y Reguladores', description: 'Se reportan los incidentes a las autoridades competentes y reguladores dentro de los plazos legales.' },
  { id: 'RS.CO-04', categoryId: 'RS.CO', functionCode: 'RS', title: 'Comunicación con Afectados y Clientes', description: 'Se informa transparentemente a clientes o socios cuyo servicio o datos se hayan visto impactados.' },
  { id: 'RS.CO-05', categoryId: 'RS.CO', functionCode: 'RS', title: 'Gestión de Crisis y Prensa', description: 'Se emiten comunicados oficiales de prensa mediante voceros autorizados para proteger la reputación.' },

  // RS.MI - Mitigación de Incidentes (3)
  { id: 'RS.MI-01', categoryId: 'RS.MI', functionCode: 'RS', title: 'Contención de Incidentes', description: 'Se aplican medidas inmediatas (aislamiento de red, bloqueo de cuentas) para frenar el ataque.' },
  { id: 'RS.MI-02', categoryId: 'RS.MI', functionCode: 'RS', title: 'Erradicación de Amenazas', description: 'Se eliminan por completo los artefactos maliciosos, puertas traseras o accesos de los atacantes.' },
  { id: 'RS.MI-03', categoryId: 'RS.MI', functionCode: 'RS', title: 'Cierre de Vulnerabilidades Explotadas', description: 'Se aplican parches y ajustes de seguridad para corregir la falla que originó la intrusión.' },

  // ==========================================
  // 6. RECOVER (RC) - 9 SUBCATEGORÍAS
  // ==========================================
  // RC.RP - Planes de Recuperación (5)
  { id: 'RC.RP-01', categoryId: 'RC.RP', functionCode: 'RC', title: 'Ejecución de DRP/BCP', description: 'Se activan los planes de continuidad y recuperación tecnológica tras contener la amenaza.' },
  { id: 'RC.RP-02', categoryId: 'RC.RP', functionCode: 'RC', title: 'Verificación de Integridad de Sistemas', description: 'Se escanean y validan los sistemas restaurados antes de reanudarlos en producción.' },
  { id: 'RC.RP-03', categoryId: 'RC.RP', functionCode: 'RC', title: 'Actualización de Estrategias de Recuperación', description: 'Se incorporan lecciones aprendidas para reducir tiempos de RTO y RPO en futuras recuperaciones.' },
  { id: 'RC.RP-04', categoryId: 'RC.RP', functionCode: 'RC', title: 'Restablecimiento de Operaciones', description: 'Se retorna progresivamente a las operaciones normales de negocio con supervisión constante.' },
  { id: 'RC.RP-05', categoryId: 'RC.RP', functionCode: 'RC', title: 'Pruebas de Simulación DRP', description: 'Se ejecutan ejercicios periódicos de simulación de caída catastrófica y restauración total.' },

  // RC.CO - Comunicación de Recuperación (4)
  { id: 'RC.CO-03', categoryId: 'RC.CO', functionCode: 'RC', title: 'Notificación de Restauración a Ejecutivos', description: 'Se informa a la dirección sobre la reactivación segura y el estado de la operación.' },
  { id: 'RC.CO-04', categoryId: 'RC.CO', functionCode: 'RC', title: 'Comunicación de Normalización a Clientes', description: 'Se notifica oficialmente a usuarios y clientes el retorno a la disponibilidad total del servicio.' },
  { id: 'RC.CO-05', categoryId: 'RC.CO', functionCode: 'RC', title: 'Reporte Final a Reguladores', description: 'Se entrega el informe formal de cierre del incidente y plan de remediación a entes reguladores.' },
  { id: 'RC.CO-06', categoryId: 'RC.CO', functionCode: 'RC', title: 'Intercambio de Lecciones con la Comunidad', description: 'Se comparte información técnica de forma anónima con comunidades CSIRT para elevar la resiliencia sectorial.' }
];
