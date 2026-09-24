# 🛡️ CiberGobernanza: Plataforma Abierta de Convergencia Multi-Marco

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![NIST CSF 2.0](https://img.shields.io/badge/Framework-NIST%20CSF%202.0-00E5FF.svg)](https://www.nist.gov/cyberframework)
[![ISO/IEC 27001:2022](https://img.shields.io/badge/Standard-ISO%2FIEC%2027001%3A2022-7C3AED.svg)](https://www.iso.org/standard/27001)
[![Multi--Framework Ready](https://img.shields.io/badge/PDF%20Fusion-DORA%20|%20SOC%202%20|%20ISO%2027701%20|%2031000-10B981.svg)](#-motor-de-ingestión-y-fusión-de-marcos-en-pdf)
[![Stack: React 19 + TypeScript + Vite + Tailwind CSS](https://img.shields.io/badge/Tech%20Stack-React%2019%20%7C%20TS%20%7C%20Tailwind-38BDF8.svg)](#-arquitectura-tecnológica)

> **Plataforma interactiva de código abierto diseñada para unificar la gobernanza documental (ISO/IEC 27001:2022) con la ciberdefensa técnica y operacional (NIST CSF 2.0), integrando un motor inteligente de ingestión y fusión de normativas en PDF (DORA, SOC 2, ISO 27701, ISO 31000, NIS2, PCI-DSS).**

---

## 🎯 Propósito y Filosofía

Los equipos de Seguridad de la Información, CISOs y auditores enfrentan la **"fatiga del cumplimiento"**: auditar los mismos controles una y otra vez bajo diferentes marcos normativos, mantener hojas de cálculo fragmentadas y lidiar con brechas operacionales donde las políticas existen formalmente pero no se ejecutan técnicamente.

**CiberGobernanza** resuelve este dilema articulando:
1. **El "Qué y Cómo gestionarlo"** (ISO/IEC 27001:2022 — Enfoque por Procesos y SGSI).
2. **El "Qué resultado técnico medir y defender"** (NIST CSF 2.0 — Resultados operacionales en *Govern, Identify, Protect, Detect, Respond, Recover*).
3. **El "Principio de Evaluación Única" (Test Once, Comply with Many)**: Ingestión de marcos adicionales vía PDF para mapear automáticamente equivalencias y evitar hasta un 70% del retrabajo en auditorías.

---

## ✨ Funcionalidades Principales

### 1. 📊 Centro de Mando Cyber SOC (Executive Dashboard)
- Radar de madurez multidimensional en tiempo real.
- Distribución de cobertura en las 6 funciones de NIST CSF 2.0 (`GV`, `ID`, `PR`, `DE`, `RS`, `RC`).
- Estado de implementación de los 4 temas del Anexo A de ISO/IEC 27001:2022 (Organizacional, Personas, Físico, Tecnológico).
- Indicadores Clave de Desempeño (KPIs) de cobertura ponderada, brechas críticas y nivel de postura defensiva.

### 2. 🔗 Matriz Bidireccional de Convergencia
- Mapeo detallado de los **93 controles de ISO 27001:2022** con las **106 subcategorías de NIST CSF 2.0**.
- Relaciones cruzadas N:M con porcentaje de cobertura técnica ponderada (0% a 100%).
- Buscador rápido por código de control, palabras clave, dominio o criticidad.
- Exportación instantánea a **Excel / CSV**.

### 3. ⚡ Motor de Ingestión y Fusión de Marcos en PDF
- **Carga interactiva de cualquier marco normativo o estándar en formato PDF** (ej. DORA, SOC 2 Type II, ISO 27701 de Privacidad, ISO 31000 de Gestión de Riesgo, NIS2, PCI-DSS o políticas internas de la organización).
- Extracción de texto mediante `pdfjs-dist` y procesamiento con tokenización semántica y coincidencia fonético-léxica contra el catálogo base.
- Generación inmediata de la **Matriz de Convergencia Multi-Marco**:
  - Detección de controles equivalentes y compartidos.
  - Identificación de brechas específicas no cubiertas por la línea base.
  - Cálculo de la tasa de reutilización y ahorro de horas de auditoría.
- **Acción inmediata**: Conversión de brechas del nuevo marco en tareas del cronograma de remediación con un solo clic.

### 4. 🛡️ Salvaguardas No Negociables (Non-Negotiable Guardrails)
- Supervisión estricta de controles mínimos de supervivencia cibernética:
  - Autenticación Multifactor Resistente al Phishing (MFA/FIDO2).
  - Segmentación de Red y Modelo Zero Trust.
  - Copias de Seguridad Inmutables y Aisladas (Air-Gapped / WORM).
  - Gestión Centralizada de Identidades y Accesos Privilegiados (PAM).
  - Playbooks de Respuesta ante Incidentes y Pruebas Periódicas.
  - Detección Continua de Amenazas (EDR/XDR + SIEM).
- Detección inmediata de falsos cumplimientos: evita declarar un control "cumplido" en papel si no existe evidencia técnica activa.

### 5. 🔍 Diagnóstico de Brechas (Gap Analysis)
- Identificación de desalineaciones entre la política documental y la ejecución técnica.
- Categorización de brechas por impacto en el negocio, probabilidad y esfuerzo de implementación.
- Recomendaciones de ingeniería listas para aplicar.

### 6. 📅 Hoja de Ruta Táctica & Cronograma Gantt
- Plan de remediación estructurado por fases temporales (Q1, Q2, Q3, Q4).
- Asignación de presupuestos (CapEx / OpEx), responsables, dependencias entre proyectos y cálculo de retorno de inversión (ROI) en reducción del riesgo.
- Filtro interactivo de iniciativas derivadas de auditorías o de marcos PDF incorporados.

### 7. 🎯 Simulador de Postura y Escenarios de Riesgo
- Simulación dinámica del impacto de implementar o desatender controles específicos.
- Proyección del score global de seguridad ante auditorías regulatorias y vectores de ataque modernos (Ransomware, Compromiso de Cadena de Suministro, Fuga de Datos).

### 8. 📋 Checklists Operativas y Modo Auditor
- Listas de verificación técnica paso a paso para ingenieros y administradores de sistemas.
- Vista especializada para auditores internos y externos con generación de bitácora de evidencias y trazabilidad.

### 9. 📑 Generador de Informes Ejecutivos y Playbooks
- **PDF Ejecutivo**: Descarga de reportes ejecutivos listos para Junta Directiva y Comités de Auditoría construidos con `jspdf` y `jspdf-autotable`.
- **Playbook Técnico Markdown**: Descarga de guías técnicas en formato Markdown para equipos de ciberdefensa e infraestructura.

---

## 🏗️ Arquitectura Tecnológica

```
cibergobernanza/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx            # Métricas ejecutivas y radar de madurez
│   │   ├── MappingTable.tsx         # Matriz interactiva ISO 27001 ✕ NIST CSF 2.0
│   │   ├── FrameworkFusionHub.tsx   # Motor de ingestión PDF y fusión multi-marco
│   │   ├── NonNegotiables.tsx       # Enforcement de controles no negociables
│   │   ├── GapAnalysis.tsx          # Diagnóstico analítico de brechas
│   │   ├── ProjectGantt.tsx         # Cronograma de remediación y gestión de proyectos
│   │   ├── RiskSimulator.tsx        # Simulador dinámico de impacto y riesgo
│   │   ├── AuditorView.tsx          # Panel especializado para auditores y evidencias
│   │   ├── Checklists.tsx           # Guías de verificación técnica paso a paso
│   │   ├── Reports.tsx              # Exportador PDF, Markdown y Excel/CSV
│   │   ├── Documentation.tsx        # Base de conocimiento y guías metodológicas
│   │   └── Sidebar.tsx              # Navegación del Centro de Mando SOC
│   ├── data/
│   │   ├── nistCsf.ts               # Estructura completa de NIST CSF 2.0 (106 subcat.)
│   │   ├── iso27001.ts              # Catálogo oficial Anexo A ISO/IEC 27001:2022 (93 c.)
│   │   └── defaultFrameworks.ts     # Pre-cargas (DORA, SOC 2, ISO 27701, ISO 31000)
│   ├── lib/                         # Utilidades y configuración
│   ├── utils/
│   │   └── pdfExtractor.ts          # Parser e indexador de documentos PDF (pdfjs-dist)
│   ├── types.ts                     # Definiciones de tipos TypeScript rigurosos
│   ├── App.tsx                      # Orquestador del estado y navegación
│   └── main.tsx                     # Punto de entrada de la aplicación
├── index.html                       # Shell HTML con metadatos de ciberseguridad
├── package.json                     # Dependencias y scripts de construcción
└── tsconfig.json                    # Configuración de TypeScript
```

### Tecnologías Utilizadas:
- **Core**: React 19, TypeScript, Vite.
- **Estilos**: Tailwind CSS v4 con paleta Cyber SOC (`#0B0F19`, `#00E5FF`, `#10B981`, `#7C3AED`, `#F43F5E`).
- **Gráficos**: Recharts (Radar, Barras, Líneas, Dispersión).
- **Procesamiento de Documentos**: `pdfjs-dist` (parsing y extracción de PDF en navegador).
- **Generación de Reportes**: `jspdf` y `jspdf-autotable`.
- **Iconografía**: `lucide-react`.
- **Animaciones**: `motion`.

---

## 🚀 Puesta en Marcha Local

### Prerrequisitos
- **Node.js** >= 18.x
- **npm**, **yarn** o **bun**

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/cibergobernanza.git
cd cibergobernanza
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm run dev
```
La aplicación se levantará en `http://localhost:3000`.

### 4. Compilar para producción
```bash
npm run build
```
Los archivos estáticos listos para desplegar se generarán en la carpeta `dist/`.

---

## 📖 Guía Rápida: Cómo Ficionar un Nuevo Marco (PDF)

1. Ve a la sección **"Fusión Multi-Marco (PDF)"** en la barra lateral.
2. Arrastra o selecciona el documento PDF oficial de la norma (por ejemplo, el texto oficial del reglamento **DORA**, el informe de criterios **SOC 2**, la norma **ISO 27701**, **ISO 31000** o tus políticas internas).
3. Introduce el nombre de la regulación, versión y autoridad emisora.
4. Pulsa **"Procesar y Fusionar con Matriz Base"**.
5. El sistema:
   - Extraerá los artículos y controles del PDF.
   - Cruzará los requisitos contra los controles ya implementados de NIST CSF 2.0 e ISO 27001.
   - Presentará la tasa de cobertura reutilizable y las brechas huérfanas.
6. Haz clic en **"Crear Tarea en Gantt"** sobre cualquier brecha para calendarizar su remediación técnica inmediata.

---

## 🤝 Contribuciones y Código Abierto

¡Las contribuciones de la comunidad de ciberseguridad, auditoría y GRC son bienvenidas!

- **Mapeos adicionales**: Si cuentas con mapeos certificados de NIS2, PCI-DSS 4.0, CIS Controls v8 o ENS (Esquema Nacional de Seguridad), envía un PR con las definiciones en `src/data/`.
- **Detección de patrones en PDF**: Mejoras al motor de extracción léxico-semántica en `src/utils/pdfExtractor.ts`.
- **Nuevas salvaguardas**: Propuestas de *guardrails* críticos no negociables.

Para contribuir:
1. Haz un Fork del proyecto.
2. Crea una rama para tu feature: `git checkout -b feature/nuevo-marco-cis`
3. Haz commit de tus cambios: `git commit -m 'feat: agrega mapeo CIS Controls v8'`
4. Haz push a la rama: `git push origin feature/nuevo-marco-cis`
5. Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.

---

<p align="center">
  Desarrollado con enfoque de ciberdefensa proactiva y gobernanza técnica continua.
</p>
