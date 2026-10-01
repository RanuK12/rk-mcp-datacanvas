"""
Bridge oficial para generar Reportes Ejecutivos PDF usando el motor ranukita_report.py.
Cumple estrictamente con la directiva de Ranuk IT Solutions (PDFs binarios reales >400KB).
"""
import os
import json
import subprocess
import tempfile
from typing import Dict, Any, List

OFFICIAL_REPORT_SCRIPT = "/Users/emilioranucoli/Apps/ranukita-bridge/scripts/ranukita_report.py"

def generate_executive_pdf(
    title: str,
    subtitle: str,
    sections_data: List[Dict[str, Any]],
    output_pdf_path: str,
    theme: str = "dark"
) -> Dict[str, Any]:
    """
    Genera un informe PDF con identidad oficial de Ranuk IT Solutions.
    """
    spec = {
        "title": title or "Executive Business Intelligence Report",
        "subtitle": subtitle or "Generated via DataCanvas by Ranuk IT Solutions",
        "sections": sections_data
    }

    # Escribir spec.json temporal
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as f:
        json.dump(spec, f, ensure_ascii=False, indent=2)
        spec_path = f.name

    try:
        # Asegurar directorio destino
        os.makedirs(os.path.dirname(os.path.abspath(output_pdf_path)), exist_ok=True)
        
        cmd = [
            "python3",
            OFFICIAL_REPORT_SCRIPT,
            spec_path,
            output_pdf_path,
            "--theme",
            theme
        ]
        
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Validar tamaño del PDF
        if not os.path.exists(output_pdf_path):
            return {"status": "error", "message": "El archivo PDF no fue creado."}
            
        file_size_bytes = os.path.getsize(output_pdf_path)
        file_size_kb = file_size_bytes / 1024
        
        return {
            "status": "success",
            "pdf_path": output_pdf_path,
            "size_bytes": file_size_bytes,
            "size_kb": round(file_size_kb, 2),
            "is_valid_size": file_size_kb > 400
        }
    except subprocess.CalledProcessError as e:
        return {
            "status": "error",
            "message": f"Fallo al ejecutar motor de reportes: {e.stderr or e.stdout}"
        }
    finally:
        if os.path.exists(spec_path):
            os.remove(spec_path)
