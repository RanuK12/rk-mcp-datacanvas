"""
Servidor MCP principal de DataCanvas (ChatGPT Plugin Extension).
Provee protocolo MCP JSON-RPC, metadata de UI (@openai/mcp-extensions) y servidor de UI estática.
"""
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import os

from tools import profile_dataset, build_render_dashboard_payload
from report_bridge import generate_executive_pdf

app = FastAPI(title="DataCanvas MCP Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UI_DIR = os.path.join(os.path.dirname(BASE_DIR), "ui")
REPORTS_DIR = os.path.join(os.path.dirname(BASE_DIR), "dist", "reports")

# Definición de herramientas MCP
TOOLS_DEFINITIONS = [
    {
        "name": "datacanvas_profile_dataset",
        "description": "Profiles any CSV, TSV, or JSON table to infer column types, detect anomalies, and recommend optimal charts.",
        "inputSchema": {
            "type": "object",
            "required": ["raw_data"],
            "properties": {
                "raw_data": {
                    "type": "string",
                    "description": "Raw string containing CSV, TSV, or JSON rows"
                }
            }
        }
    },
    {
        "name": "datacanvas_render_dashboard",
        "description": "Renders an interactive conversation panel dashboard with KPI cards, dynamic charts, and live filters.",
        "inputSchema": {
            "type": "object",
            "required": ["title", "raw_data"],
            "properties": {
                "title": {
                    "type": "string",
                    "description": "Executive title of the dashboard"
                },
                "raw_data": {
                    "type": "string",
                    "description": "CSV or JSON table data to visualize"
                },
                "charts": {
                    "type": "array",
                    "description": "Optional list of chart configurations (chart_type, x_axis, y_axis, aggregation)",
                    "items": {"type": "object"}
                },
                "theme": {
                    "type": "string",
                    "enum": ["dark", "light", "auto"],
                    "default": "auto"
                }
            }
        },
        "_meta": {
            "openai/ui": {
                "entrypoints": [
                    {"type": "thread_panel"},
                    {"type": "global"}
                ],
                "resourceUri": "ui://datacanvas/dashboard"
            }
        }
    },
    {
        "name": "datacanvas_export_pdf",
        "description": "Compiles the active dashboard into an executive, high-fidelity PDF report powered by Ranuk Report Engine.",
        "inputSchema": {
            "type": "object",
            "required": ["title", "summary_paragraphs"],
            "properties": {
                "title": {"type": "string"},
                "subtitle": {"type": "string"},
                "summary_paragraphs": {
                    "type": "array",
                    "items": {"type": "string"}
                },
                "key_metrics_table": {
                    "type": "object",
                    "properties": {
                        "headers": {"type": "array", "items": {"type": "string"}},
                        "rows": {"type": "array", "items": {"type": "array"}}
                    }
                }
            }
        }
    }
]

@app.get("/")
def root():
    return {
        "service": "DataCanvas MCP Server",
        "status": "online",
        "version": "1.0.0",
        "provider": "Ranuk IT Solutions",
        "endpoints": {
            "mcp_rpc": "/mcp",
            "ui_app": "/ui",
            "manifest": "/manifest.json"
        }
    }

@app.get("/manifest.json")
def get_manifest():
    manifest_path = os.path.join(os.path.dirname(BASE_DIR), "manifest.json")
    if os.path.exists(manifest_path):
        return FileResponse(manifest_path, media_type="application/json")
    return {"error": "Manifest not found"}

@app.get("/ui", response_class=HTMLResponse)
def serve_ui():
    index_html = os.path.join(UI_DIR, "index.html")
    if os.path.exists(index_html):
        with open(index_html, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>DataCanvas UI Bundle Missing</h1>"

@app.post("/mcp")
async def handle_mcp_rpc(request: Request):
    """
    Controlador JSON-RPC estándar para Model Context Protocol (MCP).
    """
    body = await request.json()
    method = body.get("method")
    req_id = body.get("id", 1)
    params = body.get("params", {})

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {"listChanged": False},
                    "resources": {"subscribe": False, "listChanged": False}
                },
                "serverInfo": {
                    "name": "rk-mcp-datacanvas",
                    "version": "1.0.0"
                }
            }
        }

    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": TOOLS_DEFINITIONS
            }
        }

    elif method == "tools/call":
        tool_name = params.get("name")
        arguments = params.get("arguments", {})

        if tool_name == "datacanvas_profile_dataset":
            raw_data = arguments.get("raw_data", "")
            result = profile_dataset(raw_data)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [{"type": "text", "text": str(result)}]
                }
            }

        elif tool_name == "datacanvas_render_dashboard":
            title = arguments.get("title", "Executive Analytics")
            raw_data = arguments.get("raw_data", "")
            charts = arguments.get("charts", [])
            theme = arguments.get("theme", "auto")
            
            payload = build_render_dashboard_payload(title, raw_data, charts, theme)
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": f"DataCanvas rendered: '{title}' with {payload['dataset_summary']['total_rows']} rows. Panel is active in ChatGPT."
                        }
                    ],
                    "_meta": payload["_meta"],
                    "data": payload
                }
            }

        elif tool_name == "datacanvas_export_pdf":
            title = arguments.get("title", "Executive Data Report")
            subtitle = arguments.get("subtitle", "Generated by DataCanvas")
            summary_paras = arguments.get("summary_paragraphs", ["Executive analysis."])
            key_metrics_table = arguments.get("key_metrics_table")

            sections = [
                {
                    "heading": "1. Resumen Ejecutivo de Datos",
                    "paragraphs": summary_paras
                }
            ]
            if key_metrics_table and "headers" in key_metrics_table and "rows" in key_metrics_table:
                sections.append({
                    "heading": "2. Tabla de Métricas Clave",
                    "table": key_metrics_table
                })

            os.makedirs(REPORTS_DIR, exist_ok=True)
            output_file = os.path.join(REPORTS_DIR, f"report_{req_id}.pdf")
            pdf_result = generate_executive_pdf(title, subtitle, sections, output_file)

            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {
                    "content": [
                        {
                            "type": "text",
                            "text": f"PDF generado con éxito. Peso: {pdf_result.get('size_kb', 0)} KB. Descarga disponible."
                        }
                    ],
                    "download_url": f"/api/download_pdf/report_{req_id}.pdf",
                    "details": pdf_result
                }
            }

        else:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {
                    "code": -32601,
                    "message": f"Herramienta no encontrada: {tool_name}"
                }
            }

    return {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {
            "code": -32600,
            "message": f"Método no soportado: {method}"
        }
    }

@app.get("/api/download_pdf/{filename}")
def download_pdf(filename: str):
    file_path = os.path.join(REPORTS_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename=filename)
    raise HTTPException(status_code=404, detail="Archivo no encontrado")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=7800, reload=True)
