"""
Suite de tests unitarios y de integración para DataCanvas MCP Server.
"""
import sys
import os
import unittest
from fastapi.testclient import TestClient

SERVER_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "server")
sys.path.insert(0, SERVER_DIR)

from main import app
from tools import profile_dataset, build_render_dashboard_payload
from report_bridge import generate_executive_pdf

class TestDataCanvasMCPServer(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.sample_csv = "Region,Revenue,Expenses\nNorth,50000,30000\nSouth,40000,28000\nEast,35000,21000\nWest,60000,42000"

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertEqual(data["provider"], "Ranuk IT Solutions")

    def test_profile_dataset(self):
        profile = profile_dataset(self.sample_csv)
        self.assertEqual(profile["status"], "success")
        self.assertEqual(profile["total_rows"], 4)
        self.assertIn("Region", profile["columns"])
        self.assertIn("Revenue", profile["columns"])
        self.assertEqual(profile["profiles"]["Region"]["type"], "categorical")
        self.assertEqual(profile["profiles"]["Revenue"]["type"], "numeric")

    def test_build_render_dashboard_payload(self):
        payload = build_render_dashboard_payload("Q1 Sales Report", self.sample_csv, [])
        self.assertEqual(payload["title"], "Q1 Sales Report")
        self.assertIn("_meta", payload)
        self.assertIn("openai/ui", payload["_meta"])
        self.assertEqual(payload["_meta"]["openai/ui"]["resourceUri"], "ui://datacanvas/dashboard")

    def test_mcp_initialize_rpc(self):
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {}
        }
        res = self.client.post("/mcp", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("result", data)
        self.assertEqual(data["result"]["serverInfo"]["name"], "rk-mcp-datacanvas")

    def test_mcp_tools_list_rpc(self):
        payload = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/list",
            "params": {}
        }
        res = self.client.post("/mcp", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        tools = data["result"]["tools"]
        tool_names = [t["name"] for t in tools]
        self.assertIn("datacanvas_profile_dataset", tool_names)
        self.assertIn("datacanvas_render_dashboard", tool_names)
        self.assertIn("datacanvas_export_pdf", tool_names)

    def test_ui_serves_html(self):
        res = self.client.get("/ui")
        self.assertEqual(res.status_code, 200)
        self.assertIn("DataCanvas — Live Inspector", res.text)
        self.assertIn("btn-export-pdf", res.text)

    def test_pdf_report_bridge(self):
        output_pdf = "/tmp/test_datacanvas_report.pdf"
        sections = [
            {
                "heading": "1. Resumen Ejecutivo de Prueba",
                "paragraphs": ["Reporte generado durante la suite de tests automatizados de DataCanvas."],
                "table": {
                    "headers": ["Métrica", "Valor"],
                    "rows": [["Ingresos Q1", "$185,000"], ["Margen", "38%"]]
                }
            }
        ]
        result = generate_executive_pdf("Test Report", "Subtítulo de prueba", sections, output_pdf)
        self.assertEqual(result["status"], "success")
        self.assertTrue(os.path.exists(output_pdf))
        self.assertTrue(result["is_valid_size"])  # Debe ser > 400KB según la directiva oficial

if __name__ == "__main__":
    unittest.main()
