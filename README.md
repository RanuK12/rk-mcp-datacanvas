# DataCanvas — ChatGPT Plugin Extension (MCP)

<p align="center">
  <img src="https://img.shields.io/badge/OpenAI-Plugin%20Extension%20(MCP)-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Plugin Extension"/>
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11+"/>
  <img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Frontend-Tailwind%20%7C%20ECharts-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind & ECharts"/>
  <img src="https://img.shields.io/badge/License-Proprietary%20Ranuk%20IT-blue?style=for-the-badge" alt="License"/>
</p>

> **Desarrollado y operado por Ranuk IT Solutions (Emilio Ranucoli)**

**Tu CSV, convertido en tablero dentro de ChatGPT.**
Pegá una planilla y DataCanvas arma gráficos, filtros y KPIs en el panel lateral, sin salir de la conversación. Cuando lo tenés, lo exportás a PDF para mandarlo.

*EN — Turn any CSV into a live dashboard inside ChatGPT. Paste a spreadsheet and DataCanvas builds charts, filters and KPI cards in the side panel, then exports a PDF you can send.*

---

## Qué hace hoy

- Recibe datos CSV, TSV o JSON pegados en ChatGPT y perfila las columnas.
- Arma un panel interactivo con gráficos (barras, líneas, donut), filtros y tarjetas KPI.
- Exporta un reporte PDF.
- Corre como servidor MCP (FastAPI, puerto 7800), con tests en `tests/test_mcp_server.py`.

## Cómo funciona

1. Abrís DataCanvas en ChatGPT.
2. Pegás o subís tus datos.
3. Filtrás, cambiás el tipo de gráfico y exportás.

**Para quién:** quien arma reportes de ventas o de operación cada semana en Excel y quiere mostrarlos sin abrir Power BI.

## Privacidad

Los datos que pegás se envían al servidor MCP de DataCanvas para perfilarlos y armar el panel; para el PDF, el servidor genera el archivo. No se procesan solo en el navegador. Detalle en [PRIVACY.md](PRIVACY.md).

## Plan Pro

Todavía no está disponible. Hoy no hay límite de PDFs ni marca de agua, ni conexión a bases de datos.

## Soporte

soporte@ranuk.dev

---

## Estructura del repositorio

```text
rk-mcp-datacanvas/
├── manifest.json
├── server/
│   ├── main.py            # Servidor FastAPI (MCP JSON-RPC + UI)
│   ├── tools.py           # Perfilado de datos y payload del panel
│   └── report_bridge.py   # Generación del PDF
├── ui/index.html          # Panel interactivo (Tailwind + ECharts)
├── scripts/
├── tests/test_mcp_server.py
└── submission/
```

---

## 🚀 Guía de Inicio Rápido

### 1. Ejecutar Tests de Verificación
```bash
python3 -m unittest tests/test_mcp_server.py
```

### 2. Iniciar Servidor MCP Localmente
```bash
python3 server/main.py
# El servidor iniciará en http://127.0.0.1:7800
```

### 3. Exponer con Túnel Cloudflare (para pruebas con OpenAI)
```bash
cloudflared tunnel --url http://127.0.0.1:7800
```

### 4. Regenerar el Paquete de Envío
```bash
python3 scripts/rk-mcp-pack.py
```

### 5. Ejecutar Cron de Crecimiento Manualmente
```bash
python3 scripts/rk-mcp-growth.py
```
