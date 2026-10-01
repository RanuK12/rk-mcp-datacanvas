#!/usr/bin/env python3
"""
Empaquetador y validador oficial de OpenAI Plugin Extension para DataCanvas.
Genera el paquete ZIP de distribución verificado para Apps Management Dashboard.
"""
import os
import sys
import json
import zipfile

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT_DIR, "dist")
ZIP_OUTPUT = os.path.join(DIST_DIR, "rk-mcp-datacanvas.zip")

def validate_and_pack():
    print("=== OpenAI MCP Extension Packager ===")
    os.makedirs(DIST_DIR, exist_ok=True)
    
    # 1. Validar manifest.json
    manifest_path = os.path.join(ROOT_DIR, "manifest.json")
    if not os.path.exists(manifest_path):
        print("ERROR: manifest.json no encontrado.")
        sys.exit(1)
        
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest = json.load(f)
        
    required_keys = ["name_for_human", "name_for_model", "description_for_human", "api", "ui", "privacy_policy_url"]
    for k in required_keys:
        if k not in manifest:
            print(f"ERROR: Falta clave requerida en manifest: {k}")
            sys.exit(1)
            
    print("✓ manifest.json validado correctamente.")

    # 2. Validar UI
    ui_index = os.path.join(ROOT_DIR, "ui", "index.html")
    if not os.path.exists(ui_index):
        print("ERROR: ui/index.html no encontrado.")
        sys.exit(1)
    print("✓ UI bundle detectado.")

    # 3. Crear archivo ZIP
    print(f"Comprimiendo assets en {ZIP_OUTPUT}...")
    files_to_pack = [
        "manifest.json",
        "README.md",
        "server/main.py",
        "server/tools.py",
        "server/report_bridge.py",
        "ui/index.html",
        "submission/test_cases.json",
        "submission/video_script.md"
    ]

    with zipfile.ZipFile(ZIP_OUTPUT, "w", zipfile.ZIP_DEFLATED) as zipf:
        for rel_path in files_to_pack:
            abs_path = os.path.join(ROOT_DIR, rel_path)
            if os.path.exists(abs_path):
                zipf.write(abs_path, rel_path)
                print(f"  + Agregado: {rel_path}")
            else:
                print(f"  ! Advertencia: {rel_path} no existe (se omite)")

    file_size_kb = os.path.getsize(ZIP_OUTPUT) / 1024
    print(f"\n✓ Paquete generado con éxito: {ZIP_OUTPUT} ({file_size_kb:.1f} KB)")
    print("✓ Listo para subir en OpenAI Apps Management Dashboard.")

if __name__ == "__main__":
    validate_and_pack()
