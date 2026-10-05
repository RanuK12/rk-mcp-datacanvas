#!/usr/bin/env python3
# (c) 2026 Ranuk IT Solutions - ranuk.dev
"""
Campaña de difusión cada 3 días para DataCanvas BI en X (@ranuk_dev).
Publica con videos Motion Design de 15s Full HD y banners de alta conversión.
"""
import os
import sys
import json
import time
import argparse
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = ROOT_DIR / "docs"
POST_SCRIPT = Path.home() / "Apps" / "ranukita-bridge" / "scripts" / "rk-x-post.py"
STATE_FILE = Path.home() / ".ranukita" / "datacanvas_promo_state.json"

TWEETS = [
    {
        "id": "ANGLE_1_MOTION_WALKTHROUGH",
        "text": (
            "Still waiting on static matplotlib PNGs inside ChatGPT?\n\n"
            "We launched DataCanvas BI: a native Model Context Protocol extension that transforms tabular data into reactive, in-browser dashboards with DuckDB-WASM and Apache ECharts.\n\n"
            "Explore metrics live and export executive PDF reports in seconds.\n\n"
            "Try the Pro pass at https://buy.stripe.com/4gMfZaaQf3A2e6vdjf4Ja01 today."
        ),
        "video": Path.home() / "Desktop/Oficina_Ranuk/rk-motion-forge/dist/videos/datacanvas_walkthrough_24s.mp4",
        "image": DOCS_DIR / "datacanvas_promo_banner.jpg"
    },
    {
        "id": "ANGLE_2_BUSINESS_EXECUTIVE",
        "text": (
            "For engineers, consultants, and founders analyzing data in ChatGPT:\n\n"
            "DataCanvas BI turns raw CSV tables into interactive client-ready dashboards in under ten seconds.\n"
            "• Local DuckDB-WASM engine with zero backend data transmission\n"
            "• Reactive Apache ECharts filters\n"
            "• One-click executive PDF report export\n\n"
            "Connect your workflow at https://buy.stripe.com/4gMfZaaQf3A2e6vdjf4Ja01 directly."
        ),
        "video": Path.home() / "Desktop/Oficina_Ranuk/rk-motion-forge/dist/videos/datacanvas_teaser_12s.mp4",
        "image": DOCS_DIR / "datacanvas_screenshot.png"
    },
    {
        "id": "ANGLE_3_DEV_MCP_ARCHITECTURE",
        "text": (
            "The next evolution of AI tools is not more markdown text, but embedded interactive micro-frontends.\n\n"
            "We architected DataCanvas on Model Context Protocol (MCP) to bring interactive dashboards into ChatGPT sidebars.\n\n"
            "Open source codebase with Pro cloud features.\n\n"
            "Check out https://github.com/RanuK12/rk-mcp-datacanvas and https://buy.stripe.com/4gMfZaaQf3A2e6vdjf4Ja01 now."
        ),
        "video": Path.home() / "Desktop/Oficina_Ranuk/rk-motion-forge/dist/videos/datacanvas_promo_15s.mp4",
        "image": DOCS_DIR / "datacanvas_promo_banner.jpg"
    }
]

def load_state():
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return {"last_index": -1, "last_posted_ts": 0}

def save_state(state):
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

def run_promo(dry_run=False, force=False):
    state = load_state()
    now = time.time()
    
    interval = 3 * 86400
    elapsed = now - state.get("last_posted_ts", 0)
    
    if not force and elapsed < interval and not dry_run:
        days_left = (interval - elapsed) / 86400
        print(f"[DataCanvas X Promo] Aún faltan {days_left:.1f} días para el próximo tweet programado.")
        return

    next_idx = (state.get("last_index", -1) + 1) % len(TWEETS)
    tweet = TWEETS[next_idx]

    has_video = "video" in tweet and tweet["video"].exists()
    has_image = "image" in tweet and tweet["image"].exists()

    print("==================================================")
    print(f"Ángulo a publicar [{next_idx + 1}/{len(TWEETS)}]: {tweet['id']}")
    if has_video:
        print(f"Video MP4: {tweet['video']} ({os.path.getsize(tweet['video']) / (1024*1024):.1f} MB)")
    elif has_image:
        print(f"Imagen: {tweet['image']}")
    print("--------------------------------------------------")
    print(tweet["text"])
    print("==================================================")

    if dry_run:
        print("[DRY-RUN] Tweet y multimedia verificados. Listo para postear.")
        return

    if not POST_SCRIPT.exists():
        print(f"ERROR: {POST_SCRIPT} no encontrado.")
        sys.exit(1)

    cmd = [
        "python3",
        str(POST_SCRIPT),
        "--account", "ranuk_dev",
        "--text", tweet["text"],
    ]

    if has_video:
        cmd.extend(["--video", str(tweet["video"])])
    elif has_image:
        cmd.extend(["--image", str(tweet["image"])])

    print("Ejecutando publicación vía rk-x-post.py...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(res.stdout)
    if res.returncode == 0:
        state["last_index"] = next_idx
        state["last_posted_ts"] = now
        save_state(state)
        print("✓ Publicación en @ranuk_dev exitosa.")
    else:
        print(f"Error al publicar en X: {res.stderr}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Muestra el contenido sin publicar")
    parser.add_argument("--force", action="store_true", help="Fuerza publicación sin esperar 3 días")
    args = parser.parse_args()
    run_promo(dry_run=args.dry_run, force=args.force)
