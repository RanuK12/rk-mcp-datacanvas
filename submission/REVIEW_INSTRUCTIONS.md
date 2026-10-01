# DataCanvas BI — OpenAI App Review Instructions

Copiar y pegar este texto exacto en el campo **Review Information / Testing Instructions**:

```text
DataCanvas is an interactive Model Context Protocol (MCP) data analytics extension.

HOW TO TEST:
1. Provide a CSV dataset in the chat prompt or use this test snippet:
Region,Sales,Target,Quarter
North,45000,40000,Q1
South,32000,35000,Q1
East,29000,28000,Q1
West,51000,48000,Q1

2. Ask ChatGPT:
"Create an interactive visual dashboard of this CSV with KPI metrics and charts."

3. Expected Result:
ChatGPT invokes `datacanvas_render_dashboard`. The native side panel renders an interactive ECharts dashboard displaying KPIs ($157k total volume), category distribution, and live interactive filters.

4. Test Export Feature:
Ask ChatGPT: "Generate an executive PDF summary of these results."
ChatGPT invokes `datacanvas_export_pdf` and returns a valid executive PDF report.

5. External Checkout:
Clicking the "DataCanvas Pro" upgrade badge redirects cleanly via external browser tab to our Stripe-hosted checkout (no in-chat digital transactions).

TEST CREDENTIALS:
No authentication or login credentials required (auth type: none).
```
