export interface IsoClauseRequirement {
  id: string; // e.g., '4.1'
  clauseId: string; // e.g., 'C4'
  title: string;
  description: string;
}

export interface IsoClause {
  id: string; // e.g., 'C0', 'C1', ..., 'C10'
  code: string; // e.g., 'Cláusula 0'
  title: string;
  description: string;
  requirements: IsoClauseRequirement[];
}

export interface Iso27001Control {
  id: string; // e.g., '5.1'
  domain: 'Organizacional' | 'Personas' | 'Físico' | 'Tecnológico';
  domainCode: '5' | '6' | '7' | '8';
  name: string;
  description: string;
}

export const ISO_CLAUSES: IsoClause[] = [
  {
    id: 'C0',
    code: 'Cláusula 0',
    title: 'Introducción',
    description: 'Establece los principios generales, el enfoque basado en riesgos y la compatibilidad de ISO/IEC 27001 con otros sistemas de gestión.',
    requirements: [
      { id: '0.1', clauseId: 'C0', title: 'Generalidades y Enfoque del SGSI', description: 'Comprensión de los objetivos de preservar la confidencialidad, integridad y disponibilidad mediante un proceso de gestión de riesgos.' },
      { id: '0.2', clauseId: 'C0', title: 'Compatibilidad con otros Sistemas de Gestión', description: 'Alineación estructural con el modelo de Alto Nivel de ISO (HLS) para integración con ISO 9001, ISO 22301, etc.' }
    ]
  },
  {
    id: 'C1',
    code: 'Cláusula 1',
    title: 'Objeto y campo de aplicación',
    description: 'Especifica los requisitos para establecer, implementar, mantener y mejorar continuamente un Sistema de Gestión de la Seguridad de la Información (SGSI).',
    requirements: [
      { id: '1.1', clauseId: 'C1', title: 'Requisitos de Aplicabilidad Universal', description: 'Todos los requisitos de las Cláusulas 4 a 10 son genéricos y aplicables a cualquier organización independientemente de su tamaño o sector.' }
    ]
  },
  {
    id: 'C2',
    code: 'Cláusula 2',
    title: 'Referencias normativas',
    description: 'Indica los documentos indispensables para la aplicación de esta norma internacional.',
    requirements: [
      { id: '2.1', clauseId: 'C2', title: 'ISO/IEC 27000 - Vocabulario y Visión General', description: 'Referencia a los términos y definiciones fundamentales utilizados en la familia de normas ISO/IEC 27000.' }
    ]
  },
  {
    id: 'C3',
    code: 'Cláusula 3',
    title: 'Términos y definiciones',
    description: 'Define la terminología clave utilizada en ISO/IEC 27001:2022.',
    requirements: [
      { id: '3.1', clauseId: 'C3', title: 'Terminología Estándar de Seguridad', description: 'Aplicación formal de las definiciones de activo, riesgo, vulnerabilidad, amenaza, declaración de aplicabilidad (SoA), etc.' }
    ]
  },
  {
    id: 'C4',
    code: 'Cláusula 4',
    title: 'Contexto de la organización',
    description: 'Determina las cuestiones internas y externas, las partes interesadas y el alcance del SGSI.',
    requirements: [
      { id: '4.1', clauseId: 'C4', title: 'Comprensión de la Organización y de su Contexto', description: 'Identificación de factores internos y externos (legales, tecnológicos, competitivos, culturales) que afectan los resultados del SGSI.' },
      { id: '4.2', clauseId: 'C4', title: 'Comprensión de Necesidades y Expectativas de Partes Interesadas', description: 'Determinación de partes interesadas (clientes, reguladores, socios) y sus requisitos relevantes de seguridad.' },
      { id: '4.3', clauseId: 'C4', title: 'Determinación del Alcance del SGSI', description: 'Documentación del alcance físico, organizacional y tecnológico del SGSI, considerando interfaces y dependencias.' },
      { id: '4.4', clauseId: 'C4', title: 'Sistema de Gestión de la Seguridad de la Información', description: 'Establecimiento, implementación, mantenimiento y mejora continua de los procesos del SGSI.' }
    ]
  },
  {
    id: 'C5',
    code: 'Cláusula 5',
    title: 'Liderazgo',
    description: 'Establece el compromiso de la alta dirección, la política de seguridad y la asignación de roles.',
    requirements: [
      { id: '5.1', clauseId: 'C5', title: 'Liderazgo y Compromiso de la Dirección', description: 'La alta dirección demuestra liderazgo asegurando recursos, integración en procesos de negocio y promoviendo la mejora.' },
      { id: '5.2', clauseId: 'C5', title: 'Política de Seguridad de la Información', description: 'Aprobación, comunicación y disponibilidad documental de la política principal alineada al propósito de la organización.' },
      { id: '5.3', clauseId: 'C5', title: 'Roles, Responsabilidades y Autoridades Organizacionales', description: 'Asignación formal de responsabilidades para asegurar la conformidad del SGSI y reportar su desempeño.' }
    ]
  },
  {
    id: 'C6',
    code: 'Cláusula 6',
    title: 'Planificación',
    description: 'Define la gestión de riesgos, tratamiento de riesgos, Declaración de Aplicabilidad (SoA) y objetivos de seguridad.',
    requirements: [
      { id: '6.1.1', clauseId: 'C6', title: 'Acciones para Abordar Riesgos y Oportunidades', description: 'Planificación general para asegurar que el SGSI pueda lograr sus resultados previstos y prevenir efectos no deseados.' },
      { id: '6.1.2', clauseId: 'C6', title: 'Evaluación de Riesgos de Seguridad de la Información', description: 'Definición e implementación de un proceso formal de apreciación de riesgos con criterios de aceptación y propietarios.' },
      { id: '6.1.3', clauseId: 'C6', title: 'Tratamiento de Riesgos y Declaración de Aplicabilidad (SoA)', description: 'Selección de controles del Anexo A, formulación del plan de tratamiento y elaboración de la Declaración de Aplicabilidad (SoA).' },
      { id: '6.2', clauseId: 'C6', title: 'Objetivos de Seguridad de la Información y Planificación', description: 'Establecimiento de objetivos medibles, alineados a la política, monitoreados y con planes detallados de ejecución.' },
      { id: '6.3', clauseId: 'C6', title: 'Planificación de los Cambios', description: 'Determinación de la necesidad de cambios en el SGSI y su ejecución estructurada y planificada.' }
    ]
  },
  {
    id: 'C7',
    code: 'Cláusula 7',
    title: 'Apoyo',
    description: 'Asegura los recursos, competencias, concienciación, comunicación e información documentada.',
    requirements: [
      { id: '7.1', clauseId: 'C7', title: 'Recursos', description: 'Provisión de los recursos financieros, humanos y tecnológicos necesarios para el establecimiento y operación del SGSI.' },
      { id: '7.2', clauseId: 'C7', title: 'Competencia', description: 'Determinación y verificación de la competencia requerida del personal en función de educación, formación y experiencia.' },
      { id: '7.3', clauseId: 'C7', title: 'Concienciación', description: 'Garantía de que todo el personal comprenda la política, su contribución al SGSI y las implicaciones del incumplimiento.' },
      { id: '7.4', clauseId: 'C7', title: 'Comunicación', description: 'Definición de comunicaciones internas y externas relevantes (qué, cuándo, a quién, cómo y quién comunica).' },
      { id: '7.5', clauseId: 'C7', title: 'Información Documentada (Creación, Control y Distribución)', description: 'Creación, actualización, aprobación, almacenamiento, protección, distribución y retención de documentos del SGSI.' }
    ]
  },
  {
    id: 'C8',
    code: 'Cláusula 8',
    title: 'Operación',
    description: 'Ejecución y control operativo de la evaluación y tratamiento de riesgos de seguridad.',
    requirements: [
      { id: '8.1', clauseId: 'C8', title: 'Planificación y Control Operacional', description: 'Ejecución de planes para cumplir los requisitos de seguridad y control de procesos contratados externamente.' },
      { id: '8.2', clauseId: 'C8', title: 'Ejecución de la Evaluación de Riesgos', description: 'Realización de evaluaciones de riesgo a intervalos planificados o cuando ocurran cambios significativos.' },
      { id: '8.3', clauseId: 'C8', title: 'Ejecución del Tratamiento de Riesgos', description: 'Implementación del plan de tratamiento de riesgos de seguridad de la información aprobado.' }
    ]
  },
  {
    id: 'C9',
    code: 'Cláusula 9',
    title: 'Evaluación del desempeño',
    description: 'Medición, seguimiento, auditorías internas y revisiones por la dirección.',
    requirements: [
      { id: '9.1', clauseId: 'C9', title: 'Seguimiento, Medición, Análisis y Evaluación', description: 'Monitoreo y evaluación del desempeño y eficacia de la seguridad de la información y del SGSI.' },
      { id: '9.2', clauseId: 'C9', title: 'Auditoría Interna', description: 'Planificación e impartición de auditorías internas a intervalos planificados para verificar conformidad y efectividad.' },
      { id: '9.3', clauseId: 'C9', title: 'Revisión por la Dirección', description: 'Revisiones periódicas de la alta dirección sobre el estado del SGSI, métricas, auditorías, riesgos y oportunidades.' }
    ]
  },
  {
    id: 'C10',
    code: 'Cláusula 10',
    title: 'Mejora',
    description: 'Gestión de no conformidades, acciones correctivas y mejora continua del SGSI.',
    requirements: [
      { id: '10.1', clauseId: 'C10', title: 'No Conformidad y Acciones Correctivas', description: 'Reacción ante no conformidades, evaluación de causas raíz e implementación de acciones correctivas.' },
      { id: '10.2', clauseId: 'C10', title: 'Mejora Continua', description: 'Mejora continua de la idoneidad, adecuación y eficacia del Sistema de Gestión de la Seguridad de la Información.' }
    ]
  }
];

export const ISO_27001_CONTROLS_93: Iso27001Control[] = [
  // ==========================================
  // DOMINIO 5: CONTROLES ORGANIZACIONALES (37)
  // ==========================================
  { id: '5.1', domain: 'Organizacional', domainCode: '5', name: 'Políticas para la seguridad de la información', description: 'Definición, aprobación, publicación y revisión periódica de las políticas de seguridad.' },
  { id: '5.2', domain: 'Organizacional', domainCode: '5', name: 'Roles y responsabilidades de seguridad', description: 'Asignación y comunicación de roles y responsabilidades de seguridad de la información.' },
  { id: '5.3', domain: 'Organizacional', domainCode: '5', name: 'Segregación de funciones', description: 'Separación de tareas e incongruencias para reducir el riesgo de acceso no autorizado o fraude.' },
  { id: '5.4', domain: 'Organizacional', domainCode: '5', name: 'Responsabilidades de la dirección', description: 'Garantía de que la gerencia exija cumplimiento de seguridad al personal.' },
  { id: '5.5', domain: 'Organizacional', domainCode: '5', name: 'Contacto con autoridades', description: 'Mantenimiento de contactos adecuados con autoridades legales y reguladores pertinentes.' },
  { id: '5.6', domain: 'Organizacional', domainCode: '5', name: 'Contacto con grupos de interés especial', description: 'Intercambio de información con foros, asociaciones y grupos especializados en ciberseguridad.' },
  { id: '5.7', domain: 'Organizacional', domainCode: '5', name: 'Inteligencia de amenazas', description: 'Recopilación y análisis de información sobre ciberamenazas para adaptar la postura defensiva.' },
  { id: '5.8', domain: 'Organizacional', domainCode: '5', name: 'Seguridad en la gestión de proyectos', description: 'Integración formal de requisitos de seguridad de la información en todo proyecto.' },
  { id: '5.9', domain: 'Organizacional', domainCode: '5', name: 'Inventario de información y activos asociados', description: 'Identificación y catalogación de información, hardware, software y servicios asociados.' },
  { id: '5.10', domain: 'Organizacional', domainCode: '5', name: 'Uso aceptable de la información y activos', description: 'Reglas para el uso adecuado de información, infraestructura y dispositivos corporativos.' },
  { id: '5.11', domain: 'Organizacional', domainCode: '5', name: 'Devolución de activos', description: 'Procedimientos para la devolución de activos al terminar la relación laboral o contractual.' },
  { id: '5.12', domain: 'Organizacional', domainCode: '5', name: 'Clasificación de la información', description: 'Categorización de datos según su sensibilidad legal, crítica y valor para el negocio.' },
  { id: '5.13', domain: 'Organizacional', domainCode: '5', name: 'Etiquetado de la información', description: 'Marcado y marcado físico/lógico de información de acuerdo con el esquema de clasificación.' },
  { id: '5.14', domain: 'Organizacional', domainCode: '5', name: 'Transferencia de información', description: 'Reglas, procedimientos y acuerdos para la transferencia segura de datos en todo canal.' },
  { id: '5.15', domain: 'Organizacional', domainCode: '5', name: 'Control de acceso', description: 'Políticas para restringir el acceso lógico y físico conforme a necesidades del negocio.' },
  { id: '5.16', domain: 'Organizacional', domainCode: '5', name: 'Gestión de identidades', description: 'Ciclo de vida completo de identidades de usuarios, procesos y servicios.' },
  { id: '5.17', domain: 'Organizacional', domainCode: '5', name: 'Información de autenticación', description: 'Gestión segura de credenciales, contraseñas, claves e información de autenticación.' },
  { id: '5.18', domain: 'Organizacional', domainCode: '5', name: 'Derechos de acceso', description: 'Asignación, modificación y revocación de privilegios respetando el menor privilegio.' },
  { id: '5.19', domain: 'Organizacional', domainCode: '5', name: 'Seguridad en relaciones con proveedores', description: 'Procesos para mitigar riesgos derivados del acceso de terceros a activos de información.' },
  { id: '5.20', domain: 'Organizacional', domainCode: '5', name: 'Acuerdos de seguridad con proveedores', description: 'Establecimiento e inclusión de requisitos explícitos de seguridad en contratos con terceros.' },
  { id: '5.21', domain: 'Organizacional', domainCode: '5', name: 'Seguridad en la cadena de suministro de TIC', description: 'Gestión de riesgos asociados a la adquisición de productos y servicios tecnológicos.' },
  { id: '5.22', domain: 'Organizacional', domainCode: '5', name: 'Monitoreo y revisión de servicios de proveedores', description: 'Auditoría y evaluación continua del cumplimiento de acuerdos de nivel de servicio (SLA).' },
  { id: '5.23', domain: 'Organizacional', domainCode: '5', name: 'Seguridad en el uso de servicios en la nube', description: 'Procesos para adquirir, gestionar, usar y abandonar servicios cloud de forma segura.' },
  { id: '5.24', domain: 'Organizacional', domainCode: '5', name: 'Planificación de gestión de incidentes', description: 'Preparación de procesos, roles y procedimientos para responder a incidentes.' },
  { id: '5.25', domain: 'Organizacional', domainCode: '5', name: 'Evaluación de eventos de seguridad', description: 'Criterios para calificar eventos e identificar si constituyen incidentes confirmados.' },
  { id: '5.26', domain: 'Organizacional', domainCode: '5', name: 'Respuesta a incidentes de seguridad', description: 'Ejecución de protocolos documentados para contener, investigar y solucionar incidentes.' },
  { id: '5.27', domain: 'Organizacional', domainCode: '5', name: 'Aprender de los incidentes de seguridad', description: 'Aprovechamiento del análisis post-incidente para prevenir recurrencias y mejorar controles.' },
  { id: '5.28', domain: 'Organizacional', domainCode: '5', name: 'Recolección de evidencia', description: 'Identificación y conservación de evidencias digitales conforme a estándares forenses.' },
  { id: '5.29', domain: 'Organizacional', domainCode: '5', name: 'Seguridad durante interrupciones (Continuidad)', description: 'Planificación para mantener la seguridad de la información en contingencias o desastres.' },
  { id: '5.30', domain: 'Organizacional', domainCode: '5', name: 'Preparación de las TIC para la continuidad', description: 'Disponibilidad y redundancia tecnológica para garantizar la continuidad del negocio.' },
  { id: '5.31', domain: 'Organizacional', domainCode: '5', name: 'Requisitos legales y contractuales', description: 'Identificación y documentación de obligaciones legales, regulaciones y acuerdos.' },
  { id: '5.32', domain: 'Organizacional', domainCode: '5', name: 'Derechos de propiedad intelectual', description: 'Protección de software, licencias, patentes y derechos de autor de la organización.' },
  { id: '5.33', domain: 'Organizacional', domainCode: '5', name: 'Protección de registros', description: 'Resguardo de registros clave contra alteración, pérdida y destrucción no autorizada.' },
  { id: '5.34', domain: 'Organizacional', domainCode: '5', name: 'Privacidad y protección de datos personales (PII)', description: 'Cumplimiento de regulaciones de privacidad y protección de datos personales.' },
  { id: '5.35', domain: 'Organizacional', domainCode: '5', name: 'Revisión independiente de la seguridad', description: 'Realización periódica de auditorías e inspecciones por entes independientes.' },
  { id: '5.36', domain: 'Organizacional', domainCode: '5', name: 'Cumplimiento de políticas y estándares', description: 'Monitoreo continuo del cumplimiento de políticas internas de seguridad.' },
  { id: '5.37', domain: 'Organizacional', domainCode: '5', name: 'Procedimientos operativos documentados', description: 'Documentación accesible de procedimientos para tareas operativas repetitivas o críticas.' },

  // ==========================================
  // DOMINIO 6: CONTROLES DE PERSONAS (8)
  // ==========================================
  { id: '6.1', domain: 'Personas', domainCode: '6', name: 'Depuración y selección de candidatos (Screening)', description: 'Verificaciones de antecedentes para todos los candidatos a empleo antes de la contratación.' },
  { id: '6.2', domain: 'Personas', domainCode: '6', name: 'Términos y condiciones de empleo', description: 'Acuerdos contractuales que estipulen las responsabilidades de seguridad del personal.' },
  { id: '6.3', domain: 'Personas', domainCode: '6', name: 'Concientización, educación y formación', description: 'Programas periódicos de capacitación en seguridad para empleados y contratistas.' },
  { id: '6.4', domain: 'Personas', domainCode: '6', name: 'Proceso disciplinario', description: 'Procedimiento formal para tomar medidas contra empleados que cometan violaciones de seguridad.' },
  { id: '6.5', domain: 'Personas', domainCode: '6', name: 'Responsabilidades tras la terminación del contrato', description: 'Obligaciones de seguridad vigentes tras la salida o cambio de puesto de un colaborador.' },
  { id: '6.6', domain: 'Personas', domainCode: '6', name: 'Acuerdos de confidencialidad (NDA)', description: 'Firma y cumplimiento de acuerdos de no divulgación que protejan la información.' },
  { id: '6.7', domain: 'Personas', domainCode: '6', name: 'Trabajo remoto (Teletrabajo)', description: 'Medidas de seguridad aplicables a actividades realizadas fuera de la oficina corporativa.' },
  { id: '6.8', domain: 'Personas', domainCode: '6', name: 'Reporte de eventos de seguridad', description: 'Mecanismo para que los empleados reporten oportunamente debilidades o eventos sospechosos.' },

  // ==========================================
  // DOMINIO 7: CONTROLES FÍSICOS (14)
  // ==========================================
  { id: '7.1', domain: 'Físico', domainCode: '7', name: 'Perímetros de seguridad física', description: 'Uso de barreras físicas, muros y controles de acceso para proteger instalaciones.' },
  { id: '7.2', domain: 'Físico', domainCode: '7', name: 'Entrada física', description: 'Control y registro de accesos de personal autorizado y visitantes a áreas protegidas.' },
  { id: '7.3', domain: 'Físico', domainCode: '7', name: 'Aseguramiento de oficinas y salas', description: 'Diseño y protección física de áreas donde se procesa o almacena información confidencial.' },
  { id: '7.4', domain: 'Físico', domainCode: '7', name: 'Monitoreo de seguridad física', description: 'Uso de CCTV, alarmas y guardias para detectar accesos físicos no autorizados.' },
  { id: '7.5', domain: 'Físico', domainCode: '7', name: 'Protección contra amenazas físicas y ambientales', description: 'Defensas contra incendios, inundaciones, sismos, explosiones y otros desastres.' },
  { id: '7.6', domain: 'Físico', domainCode: '7', name: 'Trabajo en áreas seguras', description: 'Reglas para el personal que opera dentro de zonas físicas de alta seguridad.' },
  { id: '7.7', domain: 'Físico', domainCode: '7', name: 'Escritorio y pantalla limpia', description: 'Políticas para evitar papeles desatendidos e información expuesta en pantallas vacías.' },
  { id: '7.8', domain: 'Físico', domainCode: '7', name: 'Ubicación y protección de equipos', description: 'Emplazamiento de servidores y equipos para reducir riesgos de daños o accesos indebidos.' },
  { id: '7.9', domain: 'Físico', domainCode: '7', name: 'Seguridad de activos fuera de las instalaciones', description: 'Protección de portátiles y dispositivos utilizados fuera de la organización.' },
  { id: '7.10', domain: 'Físico', domainCode: '7', name: 'Medios de almacenamiento', description: 'Gestión segura del ciclo de vida, transporte y destrucción de discos y medios de respaldo.' },
  { id: '7.11', domain: 'Físico', domainCode: '7', name: 'Suministros de servicio (Servicios públicos)', description: 'Protección de suministros de energía (UPS), agua, aire acondicionado y telecomunicaciones.' },
  { id: '7.12', domain: 'Físico', domainCode: '7', name: 'Seguridad del cableado', description: 'Protección de cables de datos y energía contra interceptaciones o daños físicos.' },
  { id: '7.13', domain: 'Físico', domainCode: '7', name: 'Mantenimiento de equipos', description: 'Mantenimiento preventivo y correctivo de infraestructura tecnológica por personal autorizado.' },
  { id: '7.14', domain: 'Físico', domainCode: '7', name: 'Eliminación o reutilización segura de equipos', description: 'Sanitización o destrucción física de equipos antes de su disposición final.' },

  // ==========================================
  // DOMINIO 8: CONTROLES TECNOLÓGICOS (34)
  // ==========================================
  { id: '8.1', domain: 'Tecnológico', domainCode: '8', name: 'Dispositivos de usuario final', description: 'Protección de computadoras, móviles y tablets contra accesos y software malicioso.' },
  { id: '8.2', domain: 'Tecnológico', domainCode: '8', name: 'Derechos de acceso privilegiado', description: 'Restricción y control estricto del uso de cuentas con permisos de administrador.' },
  { id: '8.3', domain: 'Tecnológico', domainCode: '8', name: 'Restricción de acceso a la información', description: 'Limitación de acceso a aplicaciones e información conforme a la política de control de acceso.' },
  { id: '8.4', domain: 'Tecnológico', domainCode: '8', name: 'Acceso al código fuente', description: 'Protección de repositorios de código fuente mediante controles estricto de lectura y escritura.' },
  { id: '8.5', domain: 'Tecnológico', domainCode: '8', name: 'Autenticación segura', description: 'Uso de MFA, contraseñas robustas y autenticación sin contraseña en plataformas clave.' },
  { id: '8.6', domain: 'Tecnológico', domainCode: '8', name: 'Gestión de capacidad', description: 'Monitoreo y proyección de uso de procesamiento, disco y red para evitar caídas.' },
  { id: '8.7', domain: 'Tecnológico', domainCode: '8', name: 'Protección contra malware', description: 'Despliegue de software antivirus/EDR actualizado en servidores y equipos finales.' },
  { id: '8.8', domain: 'Tecnológico', domainCode: '8', name: 'Gestión de vulnerabilidades técnicas', description: 'Identificación, evaluación y parcheo oportuno de fallas de seguridad conocidas.' },
  { id: '8.9', domain: 'Tecnológico', domainCode: '8', name: 'Gestión de configuraciones', description: 'Establecimiento, documentación y hardening de configuraciones base de seguridad.' },
  { id: '8.10', domain: 'Tecnológico', domainCode: '8', name: 'Eliminación de información', description: 'Borrado seguro de datos almacenados cuando ya no sean requeridos legal o comercialmente.' },
  { id: '8.11', domain: 'Tecnológico', domainCode: '8', name: 'Enmascaramiento de datos (Data Masking)', description: 'Uso de seudonimización, anonimización o enmascarado para proteger datos sensibles.' },
  { id: '8.12', domain: 'Tecnológico', domainCode: '8', name: 'Prevención de fuga de datos (DLP)', description: 'Monitoreo y bloqueo de exfiltración no autorizada de información confidencial.' },
  { id: '8.13', domain: 'Tecnológico', domainCode: '8', name: 'Copias de seguridad de la información (Backup)', description: 'Generación, resguardo inmutable y prueba periódica de copias de respaldo.' },
  { id: '8.14', domain: 'Tecnológico', domainCode: '8', name: 'Redundancia de instalaciones de procesamiento', description: 'Duplicación de componentes y clusters para garantizar alta disponibilidad tecnológica.' },
  { id: '8.15', domain: 'Tecnológico', domainCode: '8', name: 'Registros (Logging)', description: 'Generación, protección y retención de registros de eventos, accesos y errores del sistema.' },
  { id: '8.16', domain: 'Tecnológico', domainCode: '8', name: 'Actividades de monitoreo', description: 'Monitoreo continuo de tráfico, comportamiento y logs para detectar anomalías.' },
  { id: '8.17', domain: 'Tecnológico', domainCode: '8', name: 'Sincronización de relojes', description: 'Sincronización horaria (NTP) de todos los sistemas con fuentes de tiempo de precisión.' },
  { id: '8.18', domain: 'Tecnológico', domainCode: '8', name: 'Uso de programas de utilidad privilegiados', description: 'Control y restricción de herramientas capaces de eludir controles del sistema operativo.' },
  { id: '8.19', domain: 'Tecnológico', domainCode: '8', name: 'Instalación de software en sistemas operativos', description: 'Restricción y procedimientos de aprobación para la instalación de programas.' },
  { id: '8.20', domain: 'Tecnológico', domainCode: '8', name: 'Seguridad de redes', description: 'Protección y gestión de redes e infraestructura de comunicaciones corporativa.' },
  { id: '8.21', domain: 'Tecnológico', domainCode: '8', name: 'Seguridad de los servicios de red', description: 'Aseguramiento de parámetros de seguridad en servicios de red públicos o privados.' },
  { id: '8.22', domain: 'Tecnológico', domainCode: '8', name: 'Segregación de redes', description: 'División de la red en segmentos o VLANs según criticidad y tipo de activo.' },
  { id: '8.23', domain: 'Tecnológico', domainCode: '8', name: 'Filtrado web', description: 'Restricción de acceso a sitios web maliciosos o no autorizados desde la red interna.' },
  { id: '8.24', domain: 'Tecnológico', domainCode: '8', name: 'Uso de criptografía', description: 'Políticas y gestión de llaves para el cifrado de datos en reposo y tránsito.' },
  { id: '8.25', domain: 'Tecnológico', domainCode: '8', name: 'Ciclo de vida de desarrollo seguro (SDLC)', description: 'Inclusión de requisitos y revisiones de seguridad en cada fase del desarrollo de software.' },
  { id: '8.26', domain: 'Tecnológico', domainCode: '8', name: 'Requisitos de seguridad de las aplicaciones', description: 'Definición de requerimientos de seguridad antes del desarrollo o compra de aplicaciones.' },
  { id: '8.27', domain: 'Tecnológico', domainCode: '8', name: 'Principios de arquitectura e ingeniería de sistemas', description: 'Diseño de sistemas bajo principios de defensa en profundidad y seguridad por diseño.' },
  { id: '8.28', domain: 'Tecnológico', domainCode: '8', name: 'Codificación segura (Secure Coding)', description: 'Aplicación de estándares de programación segura para mitigar OWASP Top 10.' },
  { id: '8.29', domain: 'Tecnológico', domainCode: '8', name: 'Pruebas de seguridad en desarrollo y aceptación', description: 'Pruebas de penetración, SAST/DAST y análisis de código previas a producción.' },
  { id: '8.30', domain: 'Tecnológico', domainCode: '8', name: 'Desarrollo subcontratado (Outsourced)', description: 'Supervisión y auditoría del software desarrollado por fabricantes o consultores terceros.' },
  { id: '8.31', domain: 'Tecnológico', domainCode: '8', name: 'Separación de entornos de desarrollo, prueba y producción', description: 'Aislamiento estricto entre ambiente de desarrollo, QA y producción.' },
  { id: '8.32', domain: 'Tecnológico', domainCode: '8', name: 'Gestión del cambio', description: 'Control de cambios en sistemas, configuraciones y software con pruebas y reversión.' },
  { id: '8.33', domain: 'Tecnológico', domainCode: '8', name: 'Información sobre pruebas de desarrollo', description: 'Selección y protección de datos utilizados en fases de prueba (evitando datos reales PII).' },
  { id: '8.34', domain: 'Tecnológico', domainCode: '8', name: 'Protección de sistemas durante pruebas', description: 'Precauciones al realizar pruebas de auditoría o escaneos para evitar interrupción de servicios.' }
];
