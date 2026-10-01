# DataCanvas — ChatGPT Plugin Extension (MCP)

> **Desarrollado por Ranuk IT Solutions (Emilio Ranucoli)**  
> Transforma cualquier archivo CSV, Excel o tabla de datos en un panel de análisis visual interactivo en tiempo real directamente en ChatGPT (`thread_panel` y `global` sidebar), con exportación ejecutiva en PDF y funnel externo a monetización SaaS.

---

## 🚀 Arquitectura y Capacidades

- **Superficies Soportadas:**
  - `thread_panel`: Panel lateral interactivo en la conversación con widgets de Apache ECharts y tarjetas KPI dinámicas.
  - `global`: Sidebar App permanente en ChatGPT para gestionar dashboards guardados y plantillas de análisis.
  - `file_viewer`: Visor predeterminado para extensiones `.csv`, `.tsv`, `.json` y `.xlsx`.
- **Cómputo en Cliente (Costo $0 para Ranuk):**
  - DuckDB-WASM y Apache ECharts operan íntegramente dentro del iframe sandboxed.
- **Reportes Ejecutivos Oficiales:**
  - Generación de reportes PDF de alta fidelidad (>400KB) mediante el motor oficial [`ranukita_report.py`](file:///Users/emilioranucoli/Apps/ranukita-bridge/scripts/ranukita_report.py).
- **Monetización Externa (Cumplimiento 100% Directrices de OpenAI):**
  - Cero cobros digitales dentro del chat/iframe.
  - Redirección externa transparente vía `window.open` a checkout en `https://datacanvas.ranuk.dev/checkout` ($19/mes o $190/año).

---

## 🛠️ Estructura del Repositorio

```text
rk-mcp-datacanvas/
├── manifest.json            # Manifest oficial de OpenAI Plugin Extension
├── server/
│   ├── main.py             # Servidor FastAPI con soporte JSON-RPC MCP y UI server
│   ├── tools.py            # Lógica analítica y schemas OpenAIUiToolMetadata
│   └── report_bridge.py    # Conexión al motor ranukita_report.py
├── ui/
│   └── index.html          # Interfaz interactiva en iframe con Dark/Light mode y ECharts
├── scripts/
│   ├── rk-mcp-pack.py      # Empaquetador y validador de submission a ZIP
│   └── rk-mcp-growth.py    # Cron diario de crecimiento, monitoreo y sync con ledger
├── tests/
│   └── test_mcp_server.py  # Suite de tests unitarios y de integración
├── submission/
│   ├── video_script.md     # Guion de 75s para el revisor de OpenAI
│   └── test_cases.json     # Casos de prueba verificables
└── dist/
    └── rk-mcp-datacanvas.zip # Archivo para Apps Management Dashboard
```

---

## 🧪 Ejecutar Tests

```bash
python3 -m unittest tests/test_mcp_server.py
```

## 📦 Empaquetar para Envío a OpenAI

```bash
python3 scripts/rk-mcp-pack.py
```

## 🌐 Iniciar Servidor Local

```bash
python3 server/main.py
# Disponible en http://127.0.0.1:7800
```
