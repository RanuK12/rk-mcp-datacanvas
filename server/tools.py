"""
Tools y lógica analítica para DataCanvas MCP Server.
"""
from typing import Dict, Any, List
import csv
import io
import json

def profile_dataset(raw_data: str) -> Dict[str, Any]:
    """
    Analiza un fragmento CSV o JSON y devuelve estadísticas, tipos de columnas y sugerencias de gráficos.
    """
    rows = []
    headers = []
    
    raw_clean = raw_data.strip()
    if raw_clean.startswith("[") or raw_clean.startswith("{"):
        try:
            parsed = json.loads(raw_clean)
            if isinstance(parsed, list) and len(parsed) > 0 and isinstance(parsed[0], dict):
                headers = list(parsed[0].keys())
                rows = [[str(item.get(h, "")) for h in headers] for item in parsed]
        except Exception:
            pass

    if not headers:
        # Fallback a CSV
        try:
            reader = csv.reader(io.StringIO(raw_clean))
            all_rows = list(reader)
            if all_rows:
                headers = [h.strip() for h in all_rows[0]]
                rows = all_rows[1:]
        except Exception as e:
            return {"error": f"No se pudo parsear el dataset: {str(e)}"}

    if not headers or not rows:
        return {"error": "El dataset proporcionado está vacío o no contiene filas válidas."}

    total_rows = len(rows)
    column_profiles = {}
    numeric_candidates = []
    categorical_candidates = []

    for idx, col_name in enumerate(headers):
        values = [r[idx].strip() for r in rows if len(r) > idx]
        empty_count = sum(1 for v in values if v == "" or v.lower() in ("null", "none", "nan"))
        
        # Test numeric
        num_valid = 0
        sum_val = 0.0
        for v in values:
            try:
                cleaned_v = v.replace("$", "").replace(",", "").replace("%", "")
                val_float = float(cleaned_v)
                sum_val += val_float
                num_valid += 1
            except ValueError:
                pass
        
        is_numeric = (num_valid / max(1, len(values))) > 0.7
        col_type = "numeric" if is_numeric else "categorical"
        
        if is_numeric:
            numeric_candidates.append(col_name)
            avg_val = round(sum_val / max(1, num_valid), 2)
            column_profiles[col_name] = {
                "type": "numeric",
                "missing": empty_count,
                "sample_avg": avg_val
            }
        else:
            categorical_candidates.append(col_name)
            unique_vals = list(set(values))[:10]
            column_profiles[col_name] = {
                "type": "categorical",
                "missing": empty_count,
                "distinct_count": len(set(values)),
                "sample_values": unique_vals[:5]
            }

    # Recomendación automática de gráficos
    suggested_charts = []
    if categorical_candidates and numeric_candidates:
        suggested_charts.append({
            "chart_type": "bar",
            "x_axis": categorical_candidates[0],
            "y_axis": numeric_candidates[0],
            "aggregation": "sum"
        })
        if len(numeric_candidates) > 1:
            suggested_charts.append({
                "chart_type": "line",
                "x_axis": categorical_candidates[0],
                "y_axis": numeric_candidates[1],
                "aggregation": "avg"
            })
        else:
            suggested_charts.append({
                "chart_type": "donut",
                "x_axis": categorical_candidates[0],
                "y_axis": numeric_candidates[0],
                "aggregation": "sum"
            })

    return {
        "status": "success",
        "total_rows": total_rows,
        "columns": headers,
        "profiles": column_profiles,
        "suggested_charts": suggested_charts
    }

def build_render_dashboard_payload(
    title: str,
    raw_data: str,
    charts: List[Dict[str, Any]],
    theme: str = "auto"
) -> Dict[str, Any]:
    """
    Prepara el contrato de visualización para el iframe de ChatGPT.
    """
    profile = profile_dataset(raw_data)
    return {
        "title": title,
        "dataset_summary": {
            "total_rows": profile.get("total_rows", 0),
            "columns": profile.get("columns", [])
        },
        "charts": charts or profile.get("suggested_charts", []),
        "raw_data": raw_data,
        "theme": theme,
        "ui_entrypoint": "ui://datacanvas/dashboard",
        "_meta": {
            "openai/ui": {
                "entrypoints": [
                    {"type": "thread_panel"},
                    {"type": "global"}
                ],
                "resourceUri": "ui://datacanvas/dashboard"
            }
        }
    }
