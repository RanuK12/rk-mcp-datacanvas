import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const Scene4System: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1: Frame 0–22 -> CSV Rows count up to 1,248
  const rowCount = Math.floor(
    interpolate(frame, [0, 24], [0, 1248], {
      extrapolateRight: "clamp",
    })
  );

  // Beat 2: Frame 22–45 -> DuckDB Query latency 0ms -> 3.2ms + checkmark
  const queryDone = frame >= 24;

  // Beat 3: Frame 45–68 -> ECharts interactive canvas mounted + 60 FPS
  const chartMounted = frame >= 46;

  // Beat 4: Frame 68–90 -> PDF Report Engine 659.56 KB generated + checkmark
  const pdfReady = frame >= 68;

  const cards = [
    {
      step: "// 01 · INGEST",
      title: "CSV Semantic Profiling",
      metric: `${rowCount.toLocaleString()} rows`,
      sub: "Auto-detect schema & data types",
      status: rowCount > 0 ? "STREAMING" : "IDLE",
      done: frame >= 22,
      accent: "#2563EB",
    },
    {
      step: "// 02 · EXECUTION",
      title: "DuckDB-WASM Sandbox",
      metric: queryDone ? "3.2 ms" : "COMPUTING...",
      sub: "100% In-memory columnar SQL",
      status: queryDone ? "COMPILED" : "RUNNING",
      done: queryDone,
      accent: "#16A34A",
    },
    {
      step: "// 03 · VISUALS",
      title: "Apache ECharts Canvas",
      metric: chartMounted ? "60 FPS" : "INIT...",
      sub: "WebGL / SVG dynamic rendering",
      status: chartMounted ? "MOUNTED" : "LOADING",
      done: chartMounted,
      accent: "#2563EB",
    },
    {
      step: "// 04 · DELIVERABLE",
      title: "Ranuk Report Engine",
      metric: pdfReady ? "659.56 KB" : "BUILDING...",
      sub: "High-res unbranded PDF document",
      status: pdfReady ? "EXPORTED" : "GENERATING",
      done: pdfReady,
      accent: "#9333EA",
    },
  ];

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "#FFFFFF",
        color: "#0A0A0A",
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
        padding: 80,
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #0A0A0A",
          paddingBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              textTransform: "uppercase",
              backgroundColor: "#0A0A0A",
              color: "#FFFFFF",
              padding: "6px 14px",
              borderRadius: 6,
            }}
          >
            // 04 – SYSTEM ARCHITECTURE
          </span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>
            PIPELINE IN REAL TIME
          </span>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            fontWeight: 700,
            color: "#16A34A",
          }}
        >
          ● ZERO LATENCY SYNC
        </div>
      </div>

      {/* 2x2 Interactive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 36,
          flex: 1,
          margin: "40px 0",
        }}
      >
        {cards.map((c, i) => {
          const cardSpring = spring({
            frame: frame - i * 6,
            fps,
            config: { damping: 14, mass: 0.8, stiffness: 200 },
          });
          const translateY = interpolate(cardSpring, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                backgroundColor: "#F9FAFB",
                border: "3px solid #0A0A0A",
                borderRadius: 20,
                padding: "36px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transform: `translateY(${translateY}px)`,
                boxShadow: c.done ? "0 16px 32px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#2563EB",
                    letterSpacing: "0.08em",
                  }}
                >
                  {c.step}
                </span>

                <span
                  style={{
                    backgroundColor: c.done ? "#0A0A0A" : "#E5E7EB",
                    color: c.done ? "#FFFFFF" : "#6B7280",
                    fontWeight: 800,
                    fontSize: 14,
                    padding: "4px 12px",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {c.done ? "✓ COMPLETE" : c.status}
                </span>
              </div>

              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#4B5563", marginBottom: 6 }}>
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#0A0A0A",
                    fontFamily: "monospace",
                  }}
                >
                  {c.metric}
                </div>
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#6B7280",
                  borderTop: "1px solid #E5E7EB",
                  paddingTop: 14,
                }}
              >
                {c.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sub-tag */}
      <div
        style={{
          borderTop: "1px solid #E5E7EB",
          paddingTop: 18,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: 600,
          color: "#4B5563",
        }}
      >
        <span>STANDALONE CLIENT RUNTIME · NO EXTERNAL API CALLS</span>
        <span>BENCHMARK: 1,248 ROWS / 3.2MS</span>
      </div>
    </div>
  );
};
