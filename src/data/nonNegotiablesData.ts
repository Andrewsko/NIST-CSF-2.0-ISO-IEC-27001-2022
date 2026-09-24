import { NistFunctionCode } from '../types';

export interface TechnicalSnippet {
  title: string;
  technology: string;
  language: 'bash' | 'powershell' | 'json' | 'yaml' | 'sql' | 'dockerfile';
  code: string;
  explanation: string;
}

export interface ImplementationPhase {
  phaseNumber: number;
  phaseName: string;
  description: string;
  actionItems: string[];
  deliverable: string;
}

export interface NonNegotiableRecommendation {
  id: string;
  code: string;
  title: string;
  shortName: string;
  pillar: 'Identidad y Acceso' | 'Resiliencia & Datos' | 'Detección & SOC' | 'Gobernanza & Terceros' | 'Vulnerabilidades & DevSecOps' | 'Respuesta & Continuidad';
  criticality: 'No Negociable Absoluto' | 'Mandatorio Regulatorio' | 'Salvaguarda Crítica';
  nistFunction: NistFunctionCode;
  nistSubcategories: string[];
  isoControls: string[];
  isoClauses: string[];
  whyNonNegotiable: string;
  expectedState: string;
  mandatorySLAs: string[];
  auditEvidenceRequired: string[];
  verificationCommand: string;
  implementationPhases: ImplementationPhase[];
  technicalSnippets: TechnicalSnippet[];
}

export const NON_NEGOTIABLE_RECOMMENDATIONS: NonNegotiableRecommendation[] = [
  {
    id: 'nn-01',
    code: 'NN-MFA-01',
    title: '1. Autenticación Multifactor Universal (MFA) & Cero Confianza (Zero Trust)',
    shortName: 'MFA Universal & Zero Trust',
    pillar: 'Identidad y Acceso',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'PR',
    nistSubcategories: ['PR.AA-01', 'PR.AA-02', 'PR.AA-05'],
    isoControls: ['5.15', '5.16', '5.17', '5.18', '8.5'],
    isoClauses: ['9.1'],
    whyNonNegotiable: 'Más del 80% de las brechas de ciberseguridad corporativas se originan por credenciales comprometidas o phishing. La ausencia de MFA en accesos remotos (VPN/RDP), consolas cloud y aplicaciones SaaS constituye una no-conformidad mayor inmediata en auditorías ISO 27001:2022 y degrada la madurez NIST CSF 2.0 a Tier 1 (Parcial).',
    expectedState: '100% de los usuarios humanos (empleados, contratistas, directivos) y administradores deben autenticarse mediante MFA resistente a phishing (FIDO2 / WebAuthn, passkeys o TOTP con número contextual). Bloqueo total de protocolos de autenticación básica/legada y políticas de Acceso Condicional basadas en riesgo.',
    mandatorySLAs: [
      '100% de cuentas con acceso a la red corporativa o nube deben tener MFA activo.',
      '0 cuentas de administrador con contraseñas de factor único.',
      'Bloqueo de autenticación básica (POP3, IMAP, SMTP sin OAuth2) en menos de 24 horas.',
      'Revocación automática de tokens de sesión ante detección de IP riesgosa en < 5 minutos.'
    ],
    auditEvidenceRequired: [
      'Reporte consolidado de Tenant (Azure Entra ID / Okta / Google Workspace) con porcentaje de adopción de MFA del 100%.',
      'Captura y export JSON de Directivas de Acceso Condicional (Conditional Access Policies) configuradas como "Require MFA".',
      'Política de Control de Acceso y Gestión de Identidades firmada por CISO y Dirección.',
      'Muestreo de logs de inicio de sesión con validación de segundo factor exitoso.'
    ],
    verificationCommand: 'az rest --method get --url "https://graph.microsoft.com/v1.0/reports/credentialUserRegistrationDetails" | jq \'.value[] | select(.isMfaRegistered == false)\'',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Inventario & Política de Cero Confianza',
        description: 'Mapear todos los repositorios de identidades (AD local, Entra ID, Okta, LDAP) y publicar la directiva de MFA obligatorio.',
        actionItems: [
          'Identificar todas las cuentas de usuario, cuentas de servicio y cuentas de terceros activas.',
          'Formalizar la Política de Autenticación Segura prohibiendo excepciones no autorizadas por escrito.',
          'Definir métodos MFA permitidos (FIDO2 / Microsoft Authenticator con coincidencia de números / YubiKeys).'
        ],
        deliverable: 'Inventario de identidades y Política de MFA aprobada.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Configuración de Directivas y Acceso Condicional',
        description: 'Implementar directivas en el IdP para requerir MFA en todos los accesos externos y consolas de gestión.',
        actionItems: [
          'Crear directiva de Acceso Condicional para Administradores: MFA FIDO2 obligatorio en cada inicio de sesión.',
          'Crear directiva para todos los empleados: MFA obligatorio fuera de ubicaciones confiables y verificación de dispositivo gestionado (Intune/MDM).',
          'Deshabilitar protocolos de autenticación heredada (Legacy Auth) en todo el Tenant.'
        ],
        deliverable: 'Directivas de Acceso Condicional activas en modo "Report-only" y luego "Enforced".'
      },
      {
        phaseNumber: 3,
        phaseName: 'Despliegue y Enrolamiento Guiado',
        description: 'Capacitar a los usuarios y forzar el registro de segundo factor en un plazo máximo no prorrogable de 14 días.',
        actionItems: [
          'Enviar guía paso a paso a usuarios finales para registro en Microsoft Authenticator / Passkeys.',
          'Habilitar el período de registro forzado en el primer inicio de sesión.',
          'Establecer mesa de ayuda técnica prioritaria para soporte de enrolamiento.'
        ],
        deliverable: '100% de usuarios registrados con método MFA válido.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Auditoría Continua y Monitoreo de Bypass',
        description: 'Monitorear eventos de fallo de MFA, fatiga de MFA (MFA bombing) y tokens robados mediante SIEM.',
        actionItems: [
          'Configurar alertas SIEM automáticas ante más de 3 solicitudes de MFA denegadas en 5 minutos.',
          'Revisar mensualmente la lista de cuentas de emergencia (Break-Glass) y rotar sus llaves FIDO2.',
          'Ejecutar pruebas de simulación de acceso no autorizado para verificar que el IdP bloquee la sesión.'
        ],
        deliverable: 'Panel de monitoreo de identidades en SIEM y reporte mensual de auditoría.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Directiva PowerShell para Auditar Usuarios Sin MFA en Microsoft Entra ID',
        technology: 'PowerShell / Microsoft.Graph',
        language: 'powershell',
        code: `# Conectar a Microsoft Graph con privilegios de reporte
Connect-MgGraph -Scopes "User.Read.All", "Reports.Read.All"

# Obtener todos los usuarios y su estado de registro MFA
$mfaReport = Get-MgReportCredentialUserRegistrationDetail -All | Select-Object UserPrincipalName, IsMfaRegistered, IsMfaCapable, DefaultMfaMethod

# Filtrar usuarios no conformes (Sin MFA)
$nonCompliantUsers = $mfaReport | Where-Object { $_.IsMfaRegistered -eq $false }

Write-Host "Total de usuarios sin MFA: $($nonCompliantUsers.Count)" -ForegroundColor Red
$nonCompliantUsers | Export-Csv -Path "./Auditoria_Usuarios_Sin_MFA.csv" -NoTypeInformation
Write-Host "Reporte generado: Auditoria_Usuarios_Sin_MFA.csv" -ForegroundColor Green`,
        explanation: 'Script automatizado para auditoría que extrae en segundos todas las cuentas que incumplen la directiva no negociable de MFA.'
      },
      {
        title: 'Configuración Terraform para Bloqueo de Legacy Auth y MFA Obligatorio',
        technology: 'Terraform / AzureAD Provider',
        language: 'json',
        code: `{
  "resource": {
    "azuread_conditional_access_policy": {
      "enforce_mfa_all_users": {
        "display_name": "SEC-01-Enforce-MFA-All-Users-And-Block-Legacy-Auth",
        "state": "enabled",
        "conditions": {
          "users": {
            "included_users": ["All"],
            "excluded_users": ["break-glass-admin@empresa.com"]
          },
          "applications": {
            "included_applications": ["All"]
          },
          "client_app_types": ["all"]
        },
        "grant_controls": {
          "operator": "OR",
          "built_in_controls": ["mfa", "compliantDevice"]
        }
      }
    }
  }
}`,
        explanation: 'Infraestructura como código (IaC) para garantizar que la política de MFA y bloqueo de Legacy Auth sea inmutable y rastreable en Git.'
      }
    ]
  },
  {
    id: 'nn-02',
    code: 'NN-BCK-02',
    title: '2. Copias de Seguridad Inmutables (Regla 3-2-1-1-0) & Resiliencia Anti-Ransomware',
    shortName: 'Backups Inmutables 3-2-1-1-0',
    pillar: 'Resiliencia & Datos',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'RC',
    nistSubcategories: ['PR.DS-11', 'RC.RP-01', 'RC.RP-02', 'RC.CO-03'],
    isoControls: ['8.13', '8.14', '5.29', '5.30'],
    isoClauses: ['8.2', '8.3'],
    whyNonNegotiable: 'El ransomware moderno busca deliberadamente destruir, cifrar o alterar los repositorios de respaldo antes de cifrar los servidores de producción. Sin copias de seguridad inmutables (WORM) y desconectadas (Air-Gapped), la continuidad del negocio es imposible y el pago del rescate no garantiza la recuperación.',
    expectedState: 'Arquitectura de respaldo según la regla 3-2-1-1-0: 3 copias de datos, en 2 medios distintos, 1 copia fuera de sitio (Offsite Cloud), 1 copia inmutable (Object Lock WORM / Air-Gapped) y 0 errores en pruebas de restauración semestrales automatizadas con credenciales completamente independientes del dominio corporativo.',
    mandatorySLAs: [
      'RPO (Punto Objetivo de Recuperación) <= 1 hora para bases de datos críticas.',
      'RTO (Tiempo Objetivo de Recuperación) <= 4 horas para infraestructura central.',
      'Inmutabilidad Object Lock activa por un mínimo de 30 a 90 días no modificables ni por el root.',
      'Pruebas de restauración en entorno aislado con frecuencia mínima trimestral.'
    ],
    auditEvidenceRequired: [
      'Acta y reporte técnico de prueba de restauración simulada con firma de conformidad de TI y Auditoría.',
      'Captura de pantalla de AWS S3 Object Lock en modo "Compliance" o Azure Blob Immutable Storage con retención legal.',
      'Arquitectura de red demostrando que el repositorio de backup no está unido al Active Directory de producción.',
      'Matriz de RPO y RTO formalmente aprobada por el Comité de Continuidad de Negocio.'
    ],
    verificationCommand: 'aws s3api get-object-lock-configuration --bucket backup-inmutable-produccion',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Aislamiento de Identidad de Backup',
        description: 'Separar totalmente las cuentas de administración de backup del dominio de producción.',
        actionItems: [
          'Crear una cuenta cloud o servidor de backup en un Tenant/VPC completamente separado sin relación de confianza.',
          'Configurar MFA físico (llave de seguridad hardware) exclusivo para el acceso a la plataforma de respaldo.',
          'Prohibir el uso de cuentas de dominio corporativo para ejecutar agentes de backup.'
        ],
        deliverable: 'Matriz de segregación de accesos de respaldo y credenciales aisladas.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Configuración de Repositorios Inmutables (WORM)',
        description: 'Habilitar almacenamiento con bloqueo de escritura que impida el borrado o modificación por ransomware.',
        actionItems: [
          'Configurar AWS S3 Object Lock en modo Compliance o Veeam Hardened Repository Linux con XFS reflink.',
          'Establecer período de inmutabilidad mínima de 30 días para backups diarios y 365 días para mensuales.',
          'Habilitar el cifrado del respaldo en tránsito (TLS 1.3) y en reposo (AES-256 con llave KMS propia).'
        ],
        deliverable: 'Repositorio inmutable validado con prueba de intento de borrado bloqueada.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Automatización de Respaldos y Monitoreo de Integridad',
        description: 'Programar trabajos de respaldo automatizados con verificación de integridad de hash sha256.',
        actionItems: [
          'Automatizar respaldos diarios incrementales y semanales completos con verificación automática SureBackup.',
          'Configurar alertas automáticas en caso de fallo de trabajo de backup enviadas a canal de monitoreo 24/7.',
          'Asegurar la replicación secundaria a una segunda región geográfica distinta.'
        ],
        deliverable: 'Cronograma de backup activo con 100% de tareas exitosas.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Simulacros de Restauración en Modo Bare-Metal',
        description: 'Ejecutar pruebas reales de restauración de servidores y bases de datos desde cero.',
        actionItems: [
          'Ejecutar restauración de base de datos crítica en ambiente de sandbox aislado y validar consistencia de datos.',
          'Medir tiempos reales de recuperación y contrastar contra el RTO/RPO contractual.',
          'Elaborar informe formal de lecciones aprendidas para el comité directivo.'
        ],
        deliverable: 'Certificado de prueba de recuperación semestral con métricas RTO/RPO.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Creación de Bucket S3 Inmutable con Modo Compliance en AWS CLI',
        technology: 'AWS CLI / S3 Object Lock',
        language: 'bash',
        code: `# 1. Crear Bucket con soporte de bloqueo de objetos habilitado
aws s3api create-bucket --bucket sec-prod-immutable-backups-2026 --region us-east-1 --object-lock-enabled-for-bucket

# 2. Habilitar Versionamiento estricto
aws s3api put-bucket-versioning --bucket sec-prod-immutable-backups-2026 --versioning-configuration Status=Enabled

# 3. Aplicar configuración de bloqueo en modo COMPLIANCE por 90 días (imposible de borrar ni por cuenta root de AWS)
aws s3api put-object-lock-configuration --bucket sec-prod-immutable-backups-2026 --object-lock-configuration '{
  "ObjectLockRule": {
    "DefaultRetention": {
      "Mode": "COMPLIANCE",
      "Days": 90
    }
  }
}'

# 4. Bloquear todo acceso público al bucket
aws s3api put-public-access-block --bucket sec-prod-immutable-backups-2026 --public-access-block-configuration '{
  "BlockPublicAcls": true,
  "IgnorePublicAcls": true,
  "BlockPublicPolicy": true,
  "RestrictPublicBuckets": true
}'`,
        explanation: 'Comandos oficiales AWS para aprovisionar un repositorio inmutable WORM a prueba de ataques de ransomware y amenazas internas.'
      }
    ]
  },
  {
    id: 'nn-03',
    code: 'NN-PAM-03',
    title: '3. Gestión de Cuentas Privilegiadas (PAM), Bóvedas & Just-in-Time (JIT)',
    shortName: 'PAM, Bóvedas Seguras & JIT',
    pillar: 'Identidad y Acceso',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'PR',
    nistSubcategories: ['PR.AA-05', 'GV.RR-02', 'GV.OC-03'],
    isoControls: ['8.2', '5.18', '5.15'],
    isoClauses: ['5.3', '9.2'],
    whyNonNegotiable: 'El uso compartido de cuentas `root`, `administrator` o `sa` sin trazabilidad nominativa y sin rotación automática de claves es la principal causa de persistencia y movimiento lateral en ciberataques. ISO 27001 control A.8.2 y NIST PR.AA-05 exigen asignación y uso estrictamente controlado de privilegios de acceso privilegiado.',
    expectedState: '0 uso de credenciales administrativas fijas en equipos locales o servidores. Implementación de solución PAM con bóveda de contraseñas, rotación automática posterior a cada uso, elevación de privilegios Just-in-Time (JIT) con aprobación y grabación completa de sesiones RDP/SSH.',
    mandatorySLAs: [
      'Rotación automática de contraseñas privilegiadas cada 24 horas o inmediatamente tras su check-in.',
      'Vigencia máxima de sesión privilegiada temporal (JIT): 4 horas máximo.',
      '100% de sesiones administrativas remotas grabadas e indexadas para auditoría forense.',
      'Revocación inmediata (< 1 hora) de privilegios ante desvinculación laboral.'
    ],
    auditEvidenceRequired: [
      'Registro de auditoría del sistema PAM mostrando el historial de check-out/check-in y rotación automática de credenciales.',
      'Políticas de Just-in-Time (JIT) configuradas en Azure PIM o CyberArk/BeyondTrust/HashiCorp Vault.',
      'Evidencia de eliminación de administradores locales en todas las estaciones de trabajo de los usuarios finales.',
      'Reporte de revisión trimestral de derechos de acceso privilegiado firmado por el CISO.'
    ],
    verificationCommand: 'az role assignment list --include-classic-administrators true --query "[?roleDefinitionName==\'Owner\']"',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Descubrimiento y Eliminación de Cuentas Locales',
        description: 'Identificar todas las cuentas con permisos elevados en la infraestructura y estaciones de trabajo.',
        actionItems: [
          'Ejecutar escaneo de red para detectar cuentas de servicio y administradores locales en endpoints.',
          'Eliminar permisos de administrador local a todos los usuarios estándar mediante GPO o Microsoft Intune (LAPS).',
          'Identificar y catalogar todas las cuentas de servicio con privilegios de Dominio.'
        ],
        deliverable: 'Inventario depurado de cuentas privilegiadas y despliegue de Windows LAPS.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Bóveda PAM y Rotación Automática',
        description: 'Centralizar las credenciales maestras en una bóveda de contraseñas de alta seguridad.',
        actionItems: [
          'Enrolar cuentas de root de Linux, administradores de Dominio y llaves de acceso en la bóveda PAM.',
          'Configurar rotación automática de contraseñas con complejidad de al menos 24 caracteres aleatorios.',
          'Habilitar autenticación multifactor obligatoria para acceder a la consola de la bóveda PAM.'
        ],
        deliverable: 'Bóveda PAM en producción con rotación activa.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Privilegio Mínimo Just-In-Time (JIT)',
        description: 'Sustituir privilegios permanentes por asignaciones temporales sujetas a aprobación y justificación de ticket.',
        actionItems: [
          'Configurar Microsoft Entra PIM o CyberArk para roles de Global Admin y Domain Admin.',
          'Exigir número de ticket de soporte/incidente y aprobación de jefatura para elevar permisos.',
          'Limitar la ventana de tiempo de elevación a un máximo de 2 a 4 horas.'
        ],
        deliverable: '0 administradores permanentes en producción (100% elegibles JIT).'
      },
      {
        phaseNumber: 4,
        phaseName: 'Grabación de Sesiones y Auditoría Forense',
        description: 'Supervisar y auditar en tiempo real todas las acciones ejecutadas con privilegios elevados.',
        actionItems: [
          'Habilitar grabación de sesiones de video y keystroke para sesiones SSH y RDP vía PAM Gateway.',
          'Integrar logs del PAM con el SIEM corporativo con alertas inmediatas por acceso anómalo fuera de horario.',
          'Realizar auditoría trimestral de justificaciones de elevación de privilegios.'
        ],
        deliverable: 'Logs de auditoría forense continuos y reporte de revisión de accesos.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Directiva GPO / PowerShell para Habilitar Windows LAPS (Local Admin Password Solution)',
        technology: 'PowerShell / Active Directory GPO',
        language: 'powershell',
        code: `# Configurar directiva de Windows LAPS en Active Directory / Entra ID
Set-LapsADPasswordEncryptionConfig -Identity "OU=Workstations,DC=empresa,DC=local" -EnableEncryption $true

# Crear política de rotación automática para la cuenta Administrador local
$LapsSettings = @{
    PasswordComplexity = "LargeLetters, SmallLetters, Numbers, SpecialCharacters"
    PasswordLength     = 20
    PasswordAgeDays    = 7
    AdministratorAccountName = "LocalAdminSec"
}

# Consultar la contraseña rotada de un equipo específico de forma auditada
Get-LapsADPassword -Identity "WS-FINANZAS-01" | Format-List`,
        explanation: 'Garantiza que cada estación de trabajo y servidor posea una contraseña de administrador local única, aleatoria y rotada automáticamente cada 7 días.'
      }
    ]
  },
  {
    id: 'nn-04',
    code: 'NN-EDR-04',
    title: '4. EDR / XDR Centralizado & Monitoreo Inmutable 24/7 (SIEM / SOC / Sincronización NTP)',
    shortName: 'EDR/XDR & SOC 24/7',
    pillar: 'Detección & SOC',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'DE',
    nistSubcategories: ['DE.CM-01', 'DE.CM-03', 'DE.AE-02', 'DE.AE-03'],
    isoControls: ['8.15', '8.16', '8.17', '8.19'],
    isoClauses: ['9.1'],
    whyNonNegotiable: 'El tiempo promedio de permanencia (dwell time) de un atacante antes de ser detectado sin EDR/SOC es de más de 200 días. Sin centralización de logs inmutables y sincronización horaria precisa (NTP), la reconstrucción forense es imposible y las alertas tempranas se pierden entre silos de información.',
    expectedState: 'Despliegue del 100% del agente EDR/XDR en servidores y estaciones de trabajo con aislamiento de red automatizado. Envío de telemetría y logs críticos a SIEM/SOC centralizado con retención inmutable mínima de 365 días y sincronización NTP basada en fuentes Stratum 1.',
    mandatorySLAs: [
      '100% de cobertura de agente EDR/XDR en activos tecnológicos activos.',
      'Sincronización horaria (NTP) con desvío menor a 100 milisegundos en toda la red.',
      'Tiempo medio de detección (MTTD) <= 15 minutos para alertas críticas.',
      'Retención de logs de seguridad en SIEM durante un mínimo de 365 días inalterables.'
    ],
    auditEvidenceRequired: [
      'Reporte de cobertura de EDR (Microsoft Defender for Endpoint / CrowdStrike / SentinelOne) al 100%.',
      'Configuración de sincronización de tiempo NTP en routers, firewalls, servidores y controladores de dominio.',
      'Arquitectura de ingesta de SIEM (Microsoft Sentinel / Splunk / Elastic) y políticas de retención de 1 año.',
      'Ejemplo de ticket de investigación de incidente gestionado por el SOC con tiempos de respuesta.'
    ],
    verificationCommand: 'w32tm /query /status && systemctl status auditd',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Sincronización Horaria Segura (NTP)',
        description: 'Configurar todas las fuentes de eventos contra servidores de tiempo corporativos sincronizados.',
        actionItems: [
          'Designar controladores de dominio y servidores NTP primarios sincronizados con fuentes Stratum 1 (pool.ntp.org con autenticación).',
          'Forzar sincronización horaria por GPO en Windows y chrony/systemd-timesyncd en Linux.',
          'Monitorear desvíos de reloj (Clock Drift) para evitar invalidación de logs forenses.'
        ],
        deliverable: 'Auditoría de sincronización NTP en 100% de nodos.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Despliegue de Agente EDR/XDR con Anti-Tampering',
        description: 'Instalar y bloquear la desinstalación no autorizada de la solución de detección y respuesta.',
        actionItems: [
          'Desplegar agente EDR en estaciones de trabajo, servidores Windows/Linux y contenedores.',
          'Habilitar protección contra alteraciones (Tamper Protection) y bloqueo de desinstalación por contraseña.',
          'Configurar modo de respuesta automática (Automated Remediation / Block on Sight).'
        ],
        deliverable: 'Consola EDR con 100% de agentes en estado "Healthy".'
      },
      {
        phaseNumber: 3,
        phaseName: 'Ingesta de Logs en SIEM y Reglas de Correlación',
        description: 'Enviar eventos de autenticación, firewall, VPN, DNS y cambios de configuración al SIEM.',
        actionItems: [
          'Configurar Syslog / Event Hubs para ingesta de firewalls, proxies y Active Directory.',
          'Habilitar reglas de detección basadas en MITRE ATT&CK (ej. T1003 Credential Dumping, T1059 Command and Scripting).',
          'Asegurar el almacenamiento WORM de los logs para cumplimiento legal y auditoría.'
        ],
        deliverable: 'Flujo continuo de ingesta y panel de correlación en SIEM.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Operación SOC 24/7 y Playbooks de Contención',
        description: 'Garantizar monitoreo ininterrumpido con capacidad de aislamiento de host en 1 clic.',
        actionItems: [
          'Establecer matriz de escalamiento y guardias 24/7/365 para atención de incidentes P1.',
          'Automatizar playbook de aislamiento de red del host infectado mediante API de EDR.',
          'Ejecutar simulacros mensuales de detección de malware simulado (Atomic Red Team).'
        ],
        deliverable: 'SLA de MTTD < 15min y MTTR < 30min certificado en métricas mensuales.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Configuración NTP Segura en Linux (/etc/chrony/chrony.conf)',
        technology: 'Linux Chrony NTP',
        language: 'bash',
        code: `# Servidores NTP autorizados con sincronización rápida
server time.google.com iburst minpoll 4 maxpoll 8
server pool.ntp.org iburst minpoll 4 maxpoll 8

# Umbral de corrección de salto inicial de tiempo si el desvío es mayor a 1 segundo
makestep 1.0 3

# Forzar log de mediciones y rastreo
logdir /var/log/chrony
log measurements statistics tracking

# Verificar estado y desvío horario:
# chronyc tracking && chronyc sources -v`,
        explanation: 'Asegura que todos los servidores Linux mantengan sincronía precisa al milisegundo para correlación de logs forenses en auditorías.'
      }
    ]
  },
  {
    id: 'nn-05',
    code: 'NN-VULN-05',
    title: '5. Ciclo Continuo de Gestión de Vulnerabilidades y Parchado con SLA Estricto',
    shortName: 'Gestión de Vulnerabilidades & SLAs',
    pillar: 'Vulnerabilidades & DevSecOps',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'ID',
    nistSubcategories: ['ID.RA-01', 'PR.PS-02', 'ID.IM-01'],
    isoControls: ['8.8', '8.19', '5.9'],
    isoClauses: ['8.1', '10.1'],
    whyNonNegotiable: 'Las vulnerabilidades conocidas con código de explotación público (CISA KEV) son la puerta de entrada de ataques masivos. Sin un SLA de parchado no negociable basado en el riesgo real, la infraestructura permanece expuesta a exploits conocidos por meses.',
    expectedState: 'Escaneo automatizado semanal de vulnerabilidades en infraestructura interna, externa, contenedores y nube. Aplicación obligatoria de parches de seguridad cumpliendo SLAs estrictos: Críticas con exploit activo <= 7 días; Altas <= 14 días; Medias <= 30 días.',
    mandatorySLAs: [
      'Vulnerabilidades Críticas (CVSS 9.0-10.0 o CISA KEV): Parchado en <= 7 días calendario.',
      'Vulnerabilidades Altas (CVSS 7.0-8.9): Parchado en <= 14 días calendario.',
      'Escaneo semanal automatizado del 100% de activos en el inventario.',
      '0 excepciones de parchado sin análisis de riesgo formal aprobado por el CISO.'
    ],
    auditEvidenceRequired: [
      'Reportes ejecutivos y técnicos mensuales de escaneo de vulnerabilidades (Tenable / Qualys / Rapid7).',
      'Matriz de SLAs de parchado firmada por la Gerencia de TI y CISO.',
      'Historial de tickets de cambio (Change Management) evidenciando la aplicación de parches en los plazos SLA.',
      'Registro formal de excepciones de seguridad con controles compensatorios vigentes.'
    ],
    verificationCommand: 'curl -s https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json | jq \'.vulnerabilities | length\'',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Descubrimiento Automatizado de Activos y Escaneo',
        description: 'Vincular el inventario de hardware y software a agentes de escaneo continuo.',
        actionItems: [
          'Desplegar agentes de vulnerabilidad en endpoints, servidores virtuales, bases de datos y appliances.',
          'Configurar escaneos de superficie de ataque externa (EASM) para detectar puertos y servicios expuestos a Internet.',
          'Clasificar activos según criticidad de negocio (Nivel 1: Misión Crítica, Nivel 2: Operación, Nivel 3: Soporte).'
        ],
        deliverable: 'Matriz de activos clasificados y escaneo continuo programado.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Priorización Basada en Amenaza Real (CISA KEV & EPSS)',
        description: 'Priorizar vulnerabilidades no sólo por CVSS sino por probabilidad real de explotación.',
        actionItems: [
          'Cruzar hallazgos con la base de datos de Vulnerabilidades Conocidas Explotadas de CISA (KEV).',
          'Utilizar puntuación EPSS (Exploit Prediction Scoring System) para priorizar CVEs activamente atacadas.',
          'Generar tickets de remediación automáticos dirigidos a los administradores de sistemas responsables.'
        ],
        deliverable: 'Tablero de remediación priorizado por riesgo real.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Ciclo Automatizado de Parchado y Ventanas de Mantenimiento',
        description: 'Establecer calendarios de actualización predecibles para sistemas operativos y aplicaciones.',
        actionItems: [
          'Configurar WSUS / Microsoft Intune / Ansible / Patch Manager para distribución automática de parches en anillos.',
          'Probar parches en ambiente de pre-producción durante 48 horas antes del despliegue masivo.',
          'Ejecutar ventanas de mantenimiento programadas quincenales para servidores productivos.'
        ],
        deliverable: 'Proceso de distribución en anillos activo y cumplimiento de SLAs.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Re-escaneo de Verificación y Cierre de Hallazgos',
        description: 'Confirmar técnicamente que el parche cerró la vulnerabilidad y no generó regresiones.',
        actionItems: [
          'Ejecutar re-escaneo automático post-parchado a las 24 horas de la remediación.',
          'Validar que el CVE pase a estado "Remediado" en la plataforma de gestión.',
          'Presentar métricas de cumplimiento de SLA al Comité de Seguridad mensual.'
        ],
        deliverable: 'Reporte de tendencia de reducción de deuda técnica de seguridad.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Playbook Ansible para Actualización Automatizada de Parches de Seguridad en Linux',
        technology: 'Ansible Automation',
        language: 'yaml',
        code: `---
- name: SEC-PATCH-01 Actualizacion de Parches de Seguridad Criticos
  hosts: all
  become: yes
  tasks:
    - name: Actualizar repositorios y aplicar unicamente parches de seguridad (Ubuntu/Debian)
      apt:
        upgrade: dist
        update_cache: yes
        only_upgrade: yes
      when: ansible_os_family == "Debian"

    - name: Aplicar parches de seguridad en RHEL / Rocky Linux
      dnf:
        name: '*'
        state: latest
        security: yes
      when: ansible_os_family == "RedHat"

    - name: Verificar si se requiere reinicio del sistema
      stat:
        path: /var/run/reboot-required
      register: reboot_required_file

    - name: Notificar a equipo de operaciones si se requiere reinicio
      debug:
        msg: "El servidor {{ inventory_hostname }} requiere reinicio por actualizacion de Kernel."
      when: reboot_required_file.stat.exists`,
        explanation: 'Automatiza la aplicación no negociable de parches de seguridad en flotas de servidores Linux reduciendo la ventana de exposición.'
      }
    ]
  },
  {
    id: 'nn-06',
    code: 'NN-ENC-06',
    title: '6. Cifrado Fuerte Universal en Reposo y en Tránsito (AES-256 / TLS 1.3 / KMS)',
    shortName: 'Cifrado Fuerte AES-256 & TLS 1.3',
    pillar: 'Resiliencia & Datos',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'PR',
    nistSubcategories: ['PR.DS-01', 'PR.DS-02', 'PR.DS-10'],
    isoControls: ['8.24', '8.20', '8.21'],
    isoClauses: ['8.2'],
    whyNonNegotiable: 'La pérdida o robo de un dispositivo portátil o la intercepción de tráfico no cifrado en redes públicas conduce a brechas masivas y sanciones severas (GDPR / Leyes de Privacidad). ISO 27001 control A.8.24 y NIST PR.DS-01 exigen criptografía robusta y gestión segura de claves.',
    expectedState: 'Cifrado de disco completo (BitLocker / FileVault / LUKS con TPM) en el 100% de laptops y estaciones. Cifrado AES-256 en reposo en todas las bases de datos y buckets cloud con llaves administradas (KMS) y rotadas anualmente. Cifrado obligatorio en tránsito mediante TLS 1.3 con certificados válidos y HSTS.',
    mandatorySLAs: [
      '100% de dispositivos portátiles con cifrado de disco completo verificado por MDM.',
      '0 servicios web públicos o APIs con versiones TLS obsoletas (TLS 1.0, 1.1, SSL v3) o cifrados débiles.',
      'Rotación anual automática de llaves criptográficas maestras en KMS / HSM.',
      'Cifrado en reposo habilitado por defecto en todo nuevo recurso cloud creado.'
    ],
    auditEvidenceRequired: [
      'Reporte de Microsoft Intune / Jamf certificando el 100% de laptops con BitLocker/FileVault activo.',
      'Resultados de análisis SSL Labs (calificación A+) para todos los portales y APIs públicas.',
      'Configuración de AWS KMS / Azure Key Vault evidenciando políticas de rotación de llaves activa.',
      'Política Criptográfica formal aprobada definiendo algoritmos permitidos (AES-256, RSA >= 3072, ECC >= 256).'
    ],
    verificationCommand: 'nmap --script ssl-enum-ciphers -p 443 portal.empresa.com',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Cifrado de Endpoints y Dispositivos Portátiles',
        description: 'Forzar el cifrado de disco completo en todas las computadoras corporativas.',
        actionItems: [
          'Crear directiva de cumplimiento en Microsoft Intune: Forzar BitLocker con chip TPM 2.0 y respaldo de clave de recuperación en Entra ID.',
          'Habilitar FileVault en equipos macOS con custodia de llaves institucionales en Jamf/MDM.',
          'Bloquear el acceso condicional a los datos de la empresa para cualquier equipo que no reporte estado cifrado.'
        ],
        deliverable: '100% de endpoints cifrados reportados en panel MDM.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Cifrado en Reposo en Bases de Datos y Almacenamiento Cloud',
        description: 'Asegurar que ningún dato resida en texto claro en servidores o almacenamiento cloud.',
        actionItems: [
          'Habilitar TDE (Transparent Data Encryption) en todas las instancias de SQL Server, PostgreSQL y Oracle.',
          'Configurar Default Encryption en todos los buckets S3, Azure Storage Accounts y Google Cloud Storage.',
          'Custodiar llaves criptográficas en módulos HSM o Key Vault con control de acceso restrictivo.'
        ],
        deliverable: 'Auditoría cloud con 0 recursos de almacenamiento sin cifrado.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Cifrado en Tránsito y Eliminación de Cifrados Obsoletos',
        description: 'Modernizar protocolos de transporte para comunicaciones internas y externas.',
        actionItems: [
          'Configurar servidores web, balanceadores de carga y APIs para aceptar únicamente TLS 1.2 y TLS 1.3.',
          'Deshabilitar suites de cifrado débiles (DES, 3DES, RC4, CBC ciphers) y habilitar HSTS con max-age=31536000.',
          'Exigir túneles VPN cifrados con IPsec / WireGuard para cualquier acceso administrativo remoto.'
        ],
        deliverable: 'Calificación SSL Labs "A+" en todos los dominios públicos.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Gestión del Ciclo de Vida de Llaves Criptográficas',
        description: 'Establecer procedimientos formales de generación, custodia, rotación y revocación.',
        actionItems: [
          'Automatizar la rotación anual de llaves KMS maestras.',
          'Implementar alertas automáticas 30 días antes del vencimiento de certificados TLS/SSL.',
          'Documentar el procedimiento de revocación de emergencia ante sospecha de compromiso de clave.'
        ],
        deliverable: 'Registro de rotación de llaves y monitoreo de certificados sin interrupciones.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Configuración NGINX Endurecida para TLS 1.3 Estricto y HSTS',
        technology: 'NGINX Web Server',
        language: 'bash',
        code: `# Protocolos seguros unicamente (TLS 1.2 y TLS 1.3)
ssl_protocols TLSv1.2 TLSv1.3;

# Cifrados modernos con Forward Secrecy
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers off;

# Parametros de sesion y optimizacion
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# Cabecera HSTS obligatoria (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;`,
        explanation: 'Configuración no negociable de transporte seguro para servidores web y APIs eliminando cualquier vector de ataque Man-in-the-Middle.'
      }
    ]
  },
  {
    id: 'nn-07',
    code: 'NN-TPRM-07',
    title: '7. Gestión de Riesgos en Cadena de Suministro y Proveedores Críticos (TPRM)',
    shortName: 'Riesgo de Proveedores & Terceros',
    pillar: 'Gobernanza & Terceros',
    criticality: 'Mandatorio Regulatorio',
    nistFunction: 'GV',
    nistSubcategories: ['GV.SC-04', 'GV.SC-05', 'GV.SC-07', 'GV.SC-08'],
    isoControls: ['5.19', '5.20', '5.21', '5.22', '5.23'],
    isoClauses: ['4.2', '6.1.2'],
    whyNonNegotiable: 'Más del 60% de los incidentes de impacto severo ingresan a través de proveedores de software, consultoría, hosting o servicios administrados (MSP). NIST CSF 2.0 introdujo la función de Gobernanza con un enfoque masivo en Supply Chain (GV.SC) e ISO 27001 dedica 5 controles específicos a la cadena de suministro.',
    expectedState: 'Inventario exhaustivo y clasificación de riesgo de todos los proveedores con acceso a datos o sistemas. Cláusulas contractuales obligatorias de ciberseguridad (notificación de incidentes en <24h, derecho a auditoría, NDA, cumplimiento ISO 27001/SOC 2) y evaluación anual de debida diligencia técnica.',
    mandatorySLAs: [
      '100% de contratos de proveedores tecnológicos con cláusulas de ciberseguridad vinculantes.',
      'SLA de notificación de brechas por parte de proveedores en menos de 24 horas desde su detección.',
      'Evaluación anual formal de riesgo a todos los proveedores clasificados como Críticos / Nivel 1.',
      'Desactivación de accesos de terceros en un plazo máximo de 2 horas al término del servicio.'
    ],
    auditEvidenceRequired: [
      'Inventario clasificado de proveedores de servicios y tecnología por nivel de criticidad (Alto, Medio, Bajo).',
      'Muestreo de 5 contratos de proveedores clave evidenciando cláusulas de seguridad, confidencialidad y SLAs.',
      'Cuestionarios de evaluación de ciberseguridad (SIG Lite / CAIQ) diligenciados y calificados.',
      'Reportes de atestación SOC 2 Tipo II o certificados ISO/IEC 27001 vigentes de los proveedores cloud.'
    ],
    verificationCommand: 'jq \'.vendors[] | select(.riskLevel == "Critical" and .assessmentValid == false)\' /var/sec/tprm_inventory.json',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Inventario y Categorización de Proveedores',
        description: 'Identificar a todos los terceros que procesan, almacenan o tienen acceso lógico a datos institucionales.',
        actionItems: [
          'Cruzar compras y pagos de TI con el área financiera para identificar todos los servicios SaaS y consultores.',
          'Clasificar proveedores en Nivel 1 (Crítico: Acceso a datos sensibles o infraestructura), Nivel 2 (Medio) y Nivel 3 (Bajo).',
          'Establecer el registro oficial de terceros en el SGSI.'
        ],
        deliverable: 'Matriz consolidada de proveedores y nivel de criticidad asignado.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Estandarización de Cláusulas Contractuales de Seguridad',
        description: 'Garantizar que todo acuerdo comercial contenga salvaguardas legales de ciberseguridad.',
        actionItems: [
          'Incorporar el Anexo de Seguridad de la Información en todos los pliegos y contratos.',
          'Estipular obligación de notificación de incidentes en <24 horas y derecho de auditoría técnica.',
          'Exigir seguros de ciberriesgo y certificaciones (ISO 27001 / SOC 2) a proveedores críticos.'
        ],
        deliverable: 'Modelo de cláusulas de ciberseguridad aprobado por el área legal.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Evaluación Técnica de Debida Diligencia (Due Diligence)',
        description: 'Evaluar formalmente la postura de seguridad antes de contratar y anualmente durante la vigencia.',
        actionItems: [
          'Enviar cuestionario de seguridad estructurado (conforme a controles ISO 27001 / NIST CSF).',
          'Verificar reportes SOC 2 Tipo II y alcance de certificados ISO 27001.',
          'Ejecutar escaneos de reputación y superficie de ataque externa sobre los dominios del proveedor.'
        ],
        deliverable: 'Informes de evaluación de riesgo técnico por cada proveedor crítico.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Control de Accesos Temporales y Monitoreo de Salida',
        description: 'Asegurar que los proveedores accedan únicamente mediante canales controlados.',
        actionItems: [
          'Prohibir accesos permanentes de terceros; habilitar cuentas nominativas temporales mediante PAM/VPN con MFA.',
          'Auditar y grabar sesiones remotas ejecutadas por personal externo.',
          'Ejecutar checklist de desaprovisionamiento inmediato al concluir el contrato o proyecto.'
        ],
        deliverable: 'Procedimiento de offboarding de terceros y bitácora de accesos auditada.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Modelo de Cláusula Contractual No Negociable de Notificación de Incidentes',
        technology: 'Legal / Cláusulas Contractuales',
        language: 'bash',
        code: `# CLÁUSULA VINCULANTE DE CIBERSEGURIDAD Y REPORTE DE INCIDENTES (MODELO NO NEGOCIABLE)
1. Notificación Obligatoria: EL PROVEEDOR se compromete a notificar a LA EMPRESA por escrito
   en un plazo improrrogable no superior a VEINTICUATRO (24) HORAS tras haber detectado o tenido
   sospecha fundada de cualquier Incidente de Seguridad o Acceso No Autorizado que pueda comprometer
   la Confidencialidad, Integridad o Disponibilidad de los Datos de LA EMPRESA.

2. Cooperación Forense: EL PROVEEDOR facilitará sin dilación registros de auditoría, logs de
   conexión y reportes de análisis de causa raíz elaborados por equipos forenses independientes.

3. Derecho de Auditoría: LA EMPRESA se reserva el derecho de realizar auditorías de seguridad
   técnicas (directamente o a través de terceros autorizados) con un preaviso de 5 días hábiles.

4. Devolución y Destrucción Segura: Al término de la relación, EL PROVEEDOR certificará mediante
   acta notariada la destrucción segura de toda copia de datos conforme al estándar NIST SP 800-88.`,
        explanation: 'Texto contractual estándar para anexar a contratos de servicios tecnológicos y proveedores de software.'
      }
    ]
  },
  {
    id: 'nn-08',
    code: 'NN-IRP-08',
    title: '8. Plan Operativo de Respuesta a Incidentes (IRP), Playbooks & Cadena de Custodia',
    shortName: 'Plan de Respuesta a Incidentes & IRP',
    pillar: 'Respuesta & Continuidad',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'RS',
    nistSubcategories: ['RS.MA-01', 'RS.MA-02', 'RS.AN-03', 'RS.CO-02', 'RS.MI-01'],
    isoControls: ['5.24', '5.25', '5.26', '5.27', '5.28'],
    isoClauses: ['8.2', '8.3'],
    whyNonNegotiable: 'Durante una crisis o ciberataque activo, la improvisación garantiza el fracaso, la destrucción de evidencias forenses y el incremento millonario de pérdidas operativas. NIST RS e ISO 27001 (5.24-5.28) exigen procedimientos probados, roles definidos (CSIRT/CIRT) y playbooks específicos por vector de ataque.',
    expectedState: 'Plan de Respuesta a Incidentes (IRP) documentado y formalizado con equipo CSIRT multidisciplinario. Playbooks operativos para los 5 principales vectores (Ransomware, Compromiso de Correo BEC, Exfiltración de Datos, Ataque de Denegación de Servicio DDoS y Fuga de Credenciales). Simulacros Tabletop semestrales.',
    mandatorySLAs: [
      'Convocatoria y activación del Comité de Crisis en menos de 30 minutos desde la declaración del incidente P1.',
      'Contención inicial del vector de ataque en menos de 60 minutos.',
      'Preservación de evidencia forense (imágenes de memoria RAM y discos) con cadena de custodia formal.',
      'Simulacro de incidente (Tabletop Exercise) ejecutado y documentado cada 6 meses.'
    ],
    auditEvidenceRequired: [
      'Documento del Plan de Respuesta a Incidentes (IRP) vigente y aprobado por la Alta Dirección.',
      'Playbooks técnicos detallados para Ransomware, Phishing/BEC y Acceso No Autorizado.',
      'Acta y reporte de resultados del último simulacro de mesa (Tabletop Exercise) con C-Level y TI.',
      'Formularios de Cadena de Custodia Forense y acuerdos de retención con empresa forense externa (Retainer).'
    ],
    verificationCommand: 'cat /etc/security/incident_response_plan_v2.md | grep -E "(RACI|CSIRT|Escalation)"',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Estructuración del Equipo CSIRT y Matriz RACI',
        description: 'Definir líderes técnicos, portavoces legales, comunicación corporativa y roles directivos.',
        actionItems: [
          'Designar al Comandante del Incidente (Incident Commander), Líder Técnico, Asesor Legal y Enlace de Comunicaciones.',
          'Construir matriz de contactos de emergencia fuera de banda (canales Signal/llamada telefónica independientes del correo corporativo).',
          'Contratar un servicio de respuesta a incidentes bajo demanda (IR Retainer) con SLA garantizado de 2 a 4 horas.'
        ],
        deliverable: 'Matriz RACI de incidentes y directorio de emergencia fuera de banda.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Elaboración de Playbooks Específicos por Escenario',
        description: 'Escribir guías técnicas paso a paso para contención, erradicación y recuperación.',
        actionItems: [
          'Elaborar Playbook de Ransomware: Aislamiento de red de VLANs, preservación de memoria volátil y validación de backups.',
          'Elaborar Playbook de Compromiso de Cuentas (BEC): Revocación de sesiones, bloqueo de reglas de reenvío de buzón y reseteo de claves.',
          'Elaborar Playbook de Exfiltración: Identificación de endpoints comprometidos, bloqueo de IPs C2 en firewall y reporte legal.'
        ],
        deliverable: 'Set de 5 playbooks técnicos operativos aprobados.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Simulacros de Mesa (Tabletop Exercises)',
        description: 'Poner a prueba la toma de decisiones directiva y técnica ante un ataque simulado.',
        actionItems: [
          'Diseñar escenario realista de ataque de ransomware con doble extorsión afectando sistemas centrales.',
          'Ejecutar ejercicio de mesa con participación de CISO, CIO, CEO, Legal y Recursos Humanos.',
          'Evaluar tiempos de respuesta, eficacia de comunicaciones y decisiones de pago de rescate (política cero pago).'
        ],
        deliverable: 'Informe de lecciones aprendidas y plan de mejora continua.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Preservación Forense y Notificación Regulatoria',
        description: 'Asegurar que las evidencias sean legalmente admisibles y cumplir plazos de reporte a autoridades.',
        actionItems: [
          'Capacitar a administradores en preservación de memoria RAM antes de apagar o reiniciar servidores infectados.',
          'Establecer formato de cadena de custodia de evidencias digitales (hashes SHA-256).',
          'Documentar procedimiento de notificación a autoridades de protección de datos conforme a la legislación aplicable.'
        ],
        deliverable: 'Kit de herramientas forenses y plantilla de reporte regulatorio.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Script de Preservación Forense Rápida en Endpoint Linux / Servidor',
        technology: 'Linux Forensics / Bash',
        language: 'bash',
        code: `#!/bin/bash
# SCRIPT DE RECOLECCIÓN FORENSE DE EMERGENCIA (NO APAGAR EL SERVIDOR)
CASE_ID="INC_$(date +%Y%m%d_%H%M%S)"
EVID_DIR="/tmp/\${CASE_ID}_evidence"
mkdir -p "$EVID_DIR"

echo "[+] 1. Capturando fecha y hora sincronizada..."
date -u > "$EVID_DIR/timestamp_utc.txt"

echo "[+] 2. Capturando conexiones de red activas y sockets..."
ss -tulpn > "$EVID_DIR/network_sockets.txt"
netstat -anp >> "$EVID_DIR/network_netstat.txt"

echo "[+] 3. Capturando procesos en ejecucion y arbol de procesos..."
ps auxf > "$EVID_DIR/process_tree.txt"

echo "[+] 4. Capturando usuarios conectados y sesiones activas..."
w > "$EVID_DIR/active_users.txt"
last -n 50 > "$EVID_DIR/login_history.txt"

echo "[+] 5. Capturando reglas de firewall locales..."
iptables-save > "$EVID_DIR/iptables_rules.txt"

echo "[+] 6. Generando Hashes SHA256 de la evidencia..."
sha256sum "$EVID_DIR"/* > "$EVID_DIR/SHA256SUMS.txt"

echo "[✓] Evidencia recolectada exitosamente en $EVID_DIR con cadena de custodia inicial."`,
        explanation: 'Script de primera respuesta para capturar evidencia volátil antes de que sea borrada o alterada por el atacante.'
      }
    ]
  },
  {
    id: 'nn-09',
    code: 'NN-AWR-09',
    title: '9. Programa Continuo de Concientización, Phishing Simulado y Cultura de Seguridad',
    shortName: 'Concientización & Phishing Simulado',
    pillar: 'Identidad y Acceso',
    criticality: 'Mandatorio Regulatorio',
    nistFunction: 'PR',
    nistSubcategories: ['PR.AT-01', 'PR.AT-02'],
    isoControls: ['6.3'],
    isoClauses: ['7.2', '7.3'],
    whyNonNegotiable: 'El factor humano es el vector inicial en más del 70% de las intrusiones (correos de phishing, ingeniería social, vishing, QRishing). Un programa de concientización anual de una sola vez es totalmente ineficaz; ISO 27001 (6.3) y NIST (PR.AT) exigen formación continua basada en roles y medición práctica de conductas.',
    expectedState: 'Programa formal de capacitación en ciberseguridad con inducción obligatoria al 100% de nuevos ingresos. Campañas mensuales de simulación de phishing adaptadas al contexto organizacional, con reentrenamiento inmediato para usuarios reincidentes y tasa de clics objetivo inferior al 5%.',
    mandatorySLAs: [
      '100% de nuevos empleados capacitados en sus primeros 15 días laborales.',
      '1 campaña de simulación de phishing ejecutada cada mes a toda la plantilla.',
      'Tasa de fallo en phishing (Click Rate) menor al 5% a nivel corporativo.',
      'Reentrenamiento obligatorio en < 48 horas para cualquier usuario que ingrese credenciales en simulaciones.'
    ],
    auditEvidenceRequired: [
      'Registro de asistencia y constancias de aprobación del curso de inducción de seguridad.',
      'Reportes mensuales de las plataformas de simulación de phishing (KnowBe4 / Microsoft Defender / Proofpoint).',
      'Plan anual de capacitación y concientización firmado por Recursos Humanos y CISO.',
      'Materiales informativos y boletines de alerta emitidos ante nuevas amenazas emergentes.'
    ],
    verificationCommand: 'cat /var/log/phishing_campaign_stats.json | jq \'.campaigns[-1] | {click_rate: .clickRate, reported_rate: .reportedRate}\'',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Inducción y Capacitación Obligatoria',
        description: 'Garantizar que todo colaborador conozca las responsabilidades de seguridad desde el primer día.',
        actionItems: [
          'Integrar módulo interactivo de ciberseguridad en el proceso de Onboarding de Recursos Humanos.',
          'Exigir la firma de la Carta de Compromiso y Política de Uso Aceptable de Activos.',
          'Impartir formación diferenciada para áreas críticas (Finanzas, TI, Recursos Humanos y Alta Dirección).'
        ],
        deliverable: '100% de constancias de inducción registradas en expediente laboral.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Simulaciones Mensuales de Phishing e Ingeniería Social',
        description: 'Entrenar el reconocimiento práctico de ataques en el flujo de trabajo diario.',
        actionItems: [
          'Configurar plataforma de simulación con plantillas realistas (notificaciones de paquetería, solicitudes de RRHH, facturas).',
          'Instalar botón de "Reportar Phishing" en Outlook/Gmail para incentivar el reporte activo.',
          'Medir mensualmente dos indicadores clave: Tasa de Clics (Phish-prone %) y Tasa de Reporte Activo.'
        ],
        deliverable: 'Reporte mensual de métricas de simulación y ranking de departamentos.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Reentrenamiento y Gamificación',
        description: 'Abordar las fallas de manera pedagógica y reconocer a los usuarios más cautelosos.',
        actionItems: [
          'Asignar micro-cápsula de video de 5 minutos automáticamente al usuario que hace clic en una prueba.',
          'Establecer programa de "Campeones de Seguridad" para premiar a los colaboradores con mejor récord de reporte.',
          'Escalar a jefaturas los casos de usuarios con más de 3 fallos consecutivos en un trimestre.'
        ],
        deliverable: 'Reducción sostenida de la tasa de vulnerabilidad humana por debajo del 5%.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Comunicaciones de Amenazas en Tiempo Real',
        description: 'Mantener a la organización en alerta preventiva frente a fraudes activos.',
        actionItems: [
          'Publicar alertas inmediatas ante olas masivas de phishing detectadas en el correo corporativo.',
          'Realizar campañas específicas durante temporadas de alto riesgo (ej. CyberDay, Navidad, Cierre Fiscal).',
          'Evaluar anualmente la cultura de seguridad mediante encuestas de clima de ciberseguridad.'
        ],
        deliverable: 'Boletines de seguridad emitidos y encuesta anual de cultura de seguridad.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Estructura de Métricas Clave de Concientización para Cuadro de Mando Directivo',
        technology: 'KPIs de Seguridad Humana',
        language: 'json',
        code: `{
  "programaConcientizacion2026": {
    "coberturaInduccionNuevosIngresos": "100%",
    "campanaMensualPhishing": {
      "frecuencia": "Mensual (12 al año)",
      "totalEmpleadosEvaluados": 1250,
      "tasaDeClicsObjetivo": "< 5.0%",
      "tasaDeClicsActual": "2.4%",
      "tasaDeReporteActivo": "68.2%",
      "usuariosReincidentesEntrenados": "100%"
    },
    "capacitacionEspecializada": {
      "desarrolladoresSeguros": "100% certificados en OWASP Top 10",
      "personalFinanciero": "100% entrenado en fraude BEC y suplantacion de CEO",
      "altaDireccion": "Taller de Cibergobernanza y Manejo de Crisis completado"
    }
  }
}`,
        explanation: 'Estructura cuantitativa para presentar avances no negociables en cultura de seguridad ante el Comité de Auditoría.'
      }
    ]
  },
  {
    id: 'nn-10',
    code: 'NN-DEV-10',
    title: '10. Seguridad en el Ciclo de Vida del Software (DevSecOps, SAST/DAST & SBOM)',
    shortName: 'DevSecOps, SAST/DAST & SBOM',
    pillar: 'Vulnerabilidades & DevSecOps',
    criticality: 'Mandatorio Regulatorio',
    nistFunction: 'PR',
    nistSubcategories: ['PR.PS-06', 'GV.SC-06'],
    isoControls: ['8.25', '8.26', '8.27', '8.28', '8.30', '8.31'],
    isoClauses: ['8.1'],
    whyNonNegotiable: 'El software desarrollado internamente o por terceros con fallas de diseño o librerías vulnerables (Log4j, vulnerabilidades de código abierto) introduce puertas traseras permanentes. ISO 27001 (8.25-8.31) y NIST PR.PS-06 obligan a incorporar controles de seguridad automatizados en cada fase del pipeline CI/CD.',
    expectedState: 'Integración obligatoria de herramientas de Análisis Estático de Seguridad (SAST), Análisis de Dependencias (SCA) y Verificación de Secretos en el pipeline de Git antes de cualquier pase a producción. Generación automática del SBOM (Software Bill of Materials) y separación estricta de ambientes Dev/QA/Prod.',
    mandatorySLAs: [
      'Bloqueo automático de commits o Pull Requests que contengan llaves, passwords o API keys en texto claro.',
      '0 vulnerabilidades Críticas o Altas no resueltas permitidas en despliegues a producción.',
      'Generación obligatoria de SBOM (CycloneDX / SPDX) por cada build de producción.',
      'Separación física/lógica total entre ambientes de Desarrollo, Pruebas y Producción sin datos reales no anonimizados.'
    ],
    auditEvidenceRequired: [
      'Configuración de pipelines CI/CD (GitHub Actions / GitLab CI / Azure DevOps) evidenciando análisis SAST y SCA obligatorios.',
      'Inventario de Software Bill of Materials (SBOM) generado para los principales aplicativos institucionales.',
      'Política de Desarrollo Seguro de Software (Secure SDLC) basada en OWASP Top 10 y aprobada por el CISO.',
      'Reporte de escaneo de secretos demostrando 0 credenciales hardcodeadas en repositorios de código.'
    ],
    verificationCommand: 'trivy fs --severity CRITICAL,HIGH --exit-code 1 .',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Política de Desarrollo Seguro y Formación en OWASP',
        description: 'Establecer lineamientos claros de codificación y capacitar a los equipos de ingeniería.',
        actionItems: [
          'Publicar el estándar de desarrollo seguro institucional alineado a OWASP ASVS y NIST SSDF.',
          'Capacitar a desarrolladores en prevención de inyecciones SQL, XSS, autenticación rota y deserialización insegura.',
          'Prohibir estrictamente el uso de datos reales de clientes en entornos de desarrollo y pruebas.'
        ],
        deliverable: 'Estándar Secure SDLC formal y registro de capacitación técnica.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Escaneo Automatizado de Secretos y Dependencias (SCA)',
        description: 'Impedir la fuga de credenciales en Git y auditar paquetes de terceros.',
        actionItems: [
          'Instalar pre-commit hooks (TruffleHog / Gitleaks) para bloquear commits con secretos.',
          'Integrar escaneo SCA (Dependabot / Snyk / Trivy) para detectar vulnerabilidades en librerías de NPM, Maven, NuGet, Pip.',
          'Generar automáticamente el inventario SBOM en formato CycloneDX en cada compilación.'
        ],
        deliverable: 'Pipeline con puertas de calidad de seguridad (Quality Gates) activas.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Análisis Estático (SAST) y Dinámico (DAST) en CI/CD',
        description: 'Analizar el código fuente y las aplicaciones en ejecución de forma automatizada.',
        actionItems: [
          'Incorporar SonarQube / Semgrep / Checkmarx en el pipeline de Pull Requests.',
          'Configurar regla de bloqueo de build si se detectan vulnerabilidades de severidad Alta o Crítica.',
          'Ejecutar pruebas DAST automatizadas (OWASP ZAP) sobre ambientes de Staging antes del pase a Producción.'
        ],
        deliverable: 'Reportes de análisis de código limpios de vulnerabilidades críticas.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Pruebas de Penetración (Pentesting) Periódicas',
        description: 'Validar la seguridad de las aplicaciones mediante hacking ético profesional.',
        actionItems: [
          'Contratar pruebas de intrusión caja gris anuales sobre aplicaciones críticas antes de pases mayores.',
          'Registrar hallazgos en la matriz de riesgos y exigir remediación en plazos de SLA.',
          'Emitir carta formal de cierre de vulnerabilidades (Attestation Letter) para clientes y auditores.'
        ],
        deliverable: 'Informe de Penetration Testing y carta de atestación de seguridad.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Workflow GitHub Actions para Análisis DevSecOps Automatizado (Gitleaks, Trivy & SAST)',
        technology: 'GitHub Actions / DevSecOps Pipeline',
        language: 'yaml',
        code: `name: SEC-DevSecOps-Pipeline-Gate

on:
  push:
    branches: [ "main", "release/*" ]
  pull_request:
    branches: [ "main" ]

jobs:
  security-gate:
    name: "Auditoria Automatizada de Seguridad"
    runs-on: ubuntu-latest
    steps:
      - name: Descargar Codigo Fuente
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      # 1. Deteccion de Secretos y Llaves Expuestas
      - name: Escanear Secretos con Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      # 2. Analisis de Vulnerabilidades en Dependencias y SBOM
      - name: Escaneo de Vulnerabilidades con Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'
          exit-code: '1' # Falla el pipeline si hay vulnerabilidades criticas
          format: 'table'`,
        explanation: 'Pipeline de integración continua no negociable que bloquea automáticamente la compilación si detecta secretos o vulnerabilidades críticas en el código.'
      }
    ]
  },
  {
    id: 'nn-11',
    code: 'NN-GOV-11',
    title: '11. Gobernanza de Ciberseguridad, Aprobación de Alta Dirección y Matriz CISO',
    shortName: 'Gobernanza CISO & Alta Dirección',
    pillar: 'Gobernanza & Terceros',
    criticality: 'No Negociable Absoluto',
    nistFunction: 'GV',
    nistSubcategories: ['GV.OC-01', 'GV.PO-01', 'GV.RR-01', 'GV.OV-01'],
    isoControls: ['5.1', '5.2', '5.3', '5.4'],
    isoClauses: ['5.1', '5.2', '5.3', '9.3'],
    whyNonNegotiable: 'Sin el respaldo explícito de la Alta Dirección, asignación presupuestaria y una estructura de roles con autoridad clara (CISO independiente), cualquier iniciativa técnica de seguridad fracasa ante conflictos de interés operativos. La Cláusula 5 de ISO 27001 y la función GOVERN de NIST 2.0 son el pilar fundacional obligatorio.',
    expectedState: 'Comité de Seguridad de la Información establecido con reuniones trimestrales documentadas. Política General de Seguridad de la Información formalmente aprobada por el Directorio/CEO y revisada anualmente. Asignación formal de rol CISO con presupuesto asignado y reporte directo a la Alta Dirección.',
    mandatorySLAs: [
      'Revisión anual obligatoria de todo el cuerpo normativo de políticas del SGSI.',
      'Reunión trimestral obligatoria del Comité de Seguridad de la Información con actas firmadas.',
      'Presupuesto anual de ciberseguridad formalmente aprobado y protegido contra recortes operativos.',
      'Presentación semestral del estado de riesgos y métricas de madurez ante la Junta Directiva.'
    ],
    auditEvidenceRequired: [
      'Política General de Seguridad de la Información (PGSI) vigente, firmada por el CEO/Directorio.',
      'Actas de reunión del Comité de Ciberseguridad de los últimos 4 trimestres con firmas de los directores.',
      'Organigrama formal evidenciando la designación del CISO y su independencia operativa.',
      'Declaración de Aplicabilidad (SoA) firmada correspondiente a los 93 controles de ISO 27001:2022.'
    ],
    verificationCommand: 'ls -la /docs/governance/politica_general_seguridad_firmada.pdf',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Compromiso Directivo y Constitución del Comité',
        description: 'Formalizar el gobierno corporativo de la seguridad de la información.',
        actionItems: [
          'Elaborar el Acta de Constitución del Comité de Ciberseguridad integrado por Dirección General, Legal, TI, CISO y Operaciones.',
          'Definir el estatuto del Comité y calendario de sesiones ordinarias trimestrales.',
          'Asignar formalmente la responsabilidad y autoridad del rol de CISO / Oficial de Seguridad.'
        ],
        deliverable: 'Acta de constitución del comité y designación formal del CISO.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Cuerpo Normativo y Política General de Seguridad',
        description: 'Redactar y publicar el marco de políticas obligatorias de la organización.',
        actionItems: [
          'Redactar la Política General de Seguridad de la Información alineada a los objetivos de negocio.',
          'Desarrollar las 15 políticas específicas (Control de Acceso, Criptografía, Respaldos, Teletrabajo, etc.).',
          'Obtener la firma formal de aprobación del CEO / Junta Directiva y difundir a todo el personal.'
        ],
        deliverable: 'Conjunto normativo completo publicado en intranet corporativa.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Declaración de Aplicabilidad (SoA) y Gestión de Riesgos',
        description: 'Justificar la inclusión o exclusión de cada control de ISO 27001 y NIST CSF 2.0.',
        actionItems: [
          'Diligenciar la Declaración de Aplicabilidad (SoA) para los 93 controles de ISO 27001:2022.',
          'Ejecutar la evaluación cuantitativa de riesgos de activos de información.',
          'Aprobar formalmente el Plan de Tratamiento de Riesgos por parte del Comité.'
        ],
        deliverable: 'Documento SoA y Matriz de Riesgos formalmente aprobados.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Revisión por la Dirección y Auditoría Interna',
        description: 'Evaluar el desempeño del SGSI y asegurar la mejora continua.',
        actionItems: [
          'Ejecutar auditoría interna anual del SGSI con auditores certificados independientes.',
          'Presentar el informe de revisión por la dirección al Directorio (conforme a Cláusula 9.3).',
          'Gestionar no conformidades y oportunidades de mejora identificadas.'
        ],
        deliverable: 'Informe formal de Revisión por la Dirección y plan de acciones correctivas.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Estructura Obligatoria de la Política General de Seguridad (Alineada a ISO 27001:2022 Cláusula 5.2)',
        technology: 'Gobernanza / Marco de Políticas',
        language: 'bash',
        code: `# POLÍTICA GENERAL DE SEGURIDAD DE LA INFORMACIÓN (PGSI) - ESTRUCTURA OBLIGATORIA
1. Propósito y Alcance: Aplicable a todo el personal, contratistas, sistemas, nubes y sedes.
2. Compromiso de la Dirección: La Alta Dirección provee los recursos humanos y financieros necesarios.
3. Principios Rectores:
   a. Confidencialidad, Integridad y Disponibilidad como activos estratégicos.
   b. Enfoque basado en gestión de riesgos continua y cumplimiento legal estricto.
   c. Cero tolerancia al uso indebido o no autorizado de activos de información.
4. Organización y Roles: Asignación de responsabilidades mediante Matriz RACI.
5. Consecuencias del Incumplimiento: Sanciones disciplinarias y legales proporcionales.
6. Aprobación: Firmado digitalmente por el Director Ejecutivo (CEO) con fecha y control de cambios.`,
        explanation: 'Estructura documental mandataria para superar auditorías de certificación ISO 27001 sin no-conformidades en Cláusula 5.'
      }
    ]
  },
  {
    id: 'nn-12',
    code: 'NN-NET-12',
    title: '12. Segmentación de Redes, Microsegmentación y Monitoreo de Postura Cloud (CSPM)',
    shortName: 'Segmentación de Red & CSPM Cloud',
    pillar: 'Identidad y Acceso',
    criticality: 'Mandatorio Regulatorio',
    nistFunction: 'PR',
    nistSubcategories: ['PR.IR-01', 'PR.DS-07', 'DE.CM-09'],
    isoControls: ['8.20', '8.21', '8.22', '8.23'],
    isoClauses: ['8.1'],
    whyNonNegotiable: 'Las redes planas corporativas permiten que el compromiso de una sola estación de trabajo secundaria (ej. recepción) resulte en el control inmediato de los servidores centrales de base de datos. En entornos cloud, los errores de configuración (buckets públicos, puertos de administración 22/3389 expuestos) causan la mayoría de las fugas masivas.',
    expectedState: 'Separación estricta de redes mediante VLANs y firewalls de nueva generación (NGFW): Segmento de Usuarios, Segmento de Servidores, Segmento de Gestión OOB, Zona Desmilitarizada (DMZ) y Red de Invitados aislada. En la nube, despliegue de CSPM con remediación automática de configuraciones inseguras.',
    mandatorySLAs: [
      '0 estaciones de trabajo de usuarios con visibilidad o acceso directo a puertos de gestión de servidores (SSH/RDP).',
      '0 recursos cloud con puertos administrativos o bases de datos expuestas a Internet (0.0.0.0/0).',
      'Aislamiento total de la red de invitados (Guest Wi-Fi) sin visibilidad hacia la red corporativa.',
      'Escaneo diario de CSPM contra el benchmark CIS con índice de cumplimiento superior al 90%.'
    ],
    auditEvidenceRequired: [
      'Diagrama de arquitectura de red formal mostrando segmentación de VLANs, DMZ y reglas de firewall NGFW.',
      'Reporte de postura de seguridad cloud (Microsoft Defender for Cloud / AWS Security Hub / Prisma Cloud).',
      'Matriz de flujos de red y reglas de filtrado aprobadas por el equipo de seguridad.',
      'Evidencia de auditoría semestral de reglas de firewall y eliminación de reglas "ANY/ANY".'
    ],
    verificationCommand: 'nmap -sS -p 22,3389,1433,5432 10.0.0.0/24 -Pn',
    implementationPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Mapeo de Flujos de Tráfico y Diseño de Zonas',
        description: 'Mapear la comunicación legítima entre aplicaciones y diseñar zonas de confianza.',
        actionItems: [
          'Identificar dependencias de tráfico entre frontend, backend y bases de datos.',
          'Definir zonas de seguridad: Zona DMZ (pública), Zona de Aplicaciones, Zona de Datos Segura y Zona de Gestión.',
          'Prohibir la comunicación directa este-oeste entre servidores no relacionados.'
        ],
        deliverable: 'Diagrama de zonificación de red y matriz de interconexión aprobada.'
      },
      {
        phaseNumber: 2,
        phaseName: 'Implementación de VLANs y Filtrado NGFW',
        description: 'Segmentar la red física y virtual con políticas de inspección de estado.',
        actionItems: [
          'Configurar VLANs dedicadas en switches y routers con gateway en el Firewall NGFW.',
          'Crear reglas de firewall basadas en principio de denegación por defecto (Default Deny).',
          'Habilitar inspección de amenazas (IPS/IDS, Antivirus de Red y filtrado de URL) en las políticas de inter-zona.'
        ],
        deliverable: 'VLANs operativas con políticas de bloqueo de tráfico no autorizado.'
      },
      {
        phaseNumber: 3,
        phaseName: 'Seguridad Cloud y Despliegue de CSPM',
        description: 'Monitorear y corregir desvíos de seguridad en entornos AWS, Azure y Google Cloud.',
        actionItems: [
          'Activar AWS Security Hub / Microsoft Defender for Cloud con estándares CIS Benchmarks.',
          'Configurar políticas de remediación automática para cerrar puertos 22/3389 expuestos a 0.0.0.0/0.',
          'Implementar Security Groups estrictos y redes virtuales privadas (VPC/VNet) aisladas.'
        ],
        deliverable: 'Tablero CSPM activo con cumplimiento CIS > 90%.'
      },
      {
        phaseNumber: 4,
        phaseName: 'Microsegmentación y Zero Trust Network Access (ZTNA)',
        description: 'Evolucionar hacia accesos basados en identidad y contexto del dispositivo.',
        actionItems: [
          'Reemplazar VPNs tradicionales por soluciones ZTNA donde los usuarios acceden únicamente a aplicaciones autorizadas.',
          'Implementar microsegmentación a nivel de host en servidores mediante agentes o políticas de SDN.',
          'Auditar semestralmente reglas huérfanas o redundantes en firewalls.'
        ],
        deliverable: 'Arquitectura ZTNA desplegada y reporte de auditoría de reglas de firewall.'
      }
    ],
    technicalSnippets: [
      {
        title: 'Política Terraform AWS para Bloqueo Global de Puertos de Gestión Expuestos a Internet',
        technology: 'Terraform / AWS Security Groups',
        language: 'json',
        code: `{
  "resource": {
    "aws_security_group": "sec_sg_app_tier": {
      "name": "sec-sg-app-tier-internal-only",
      "description": "Permitir unicamete trafico desde la DMZ sin acceso a Internet",
      "vpc_id": "\${aws_vpc.main.id}",
      "ingress": [
        {
          "description": "Trafico HTTPS unicamente desde balanceador de carga",
          "from_port": 443,
          "to_port": 443,
          "protocol": "tcp",
          "security_groups": ["\${aws_security_group.alb_sg.id}"]
        }
      ],
      "egress": [
        {
          "from_port": 0,
          "to_port": 0,
          "protocol": "-1",
          "cidr_blocks": ["0.0.0.0/0"]
        }
      ]
    }
  }
}`,
        explanation: 'Garantiza por código que los servidores de aplicaciones nunca tengan puertos abiertos directamente a Internet.'
      }
    ]
  }
];
