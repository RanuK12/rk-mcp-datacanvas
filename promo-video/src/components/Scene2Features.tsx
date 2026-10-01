import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Scene2Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card 1 spring (starts immediately at frame 0)
  const card1Spring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 180 },
  });
  const card1Y = interpolate(card1Spring, [0, 1], [300, 0]);
  const card1Rotate = interpolate(card1Spring, [0, 1], [-4, -1]);

  // Card 2 spring (starts on beat 2, frame 25)
  const card2Spring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 190 },
  });
  const card2Y = interpolate(card2Spring, [0, 1], [350, 0]);
  const card2Rotate = interpolate(card2Spring, [0, 1], [5, 1.5]);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "#2563EB",
        color: "#FFFFFF",
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
          borderBottom: "2px solid rgba(255,255,255,0.3)",
          paddingBottom: 24,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            backgroundColor: "#FFFFFF",
            color: "#2563EB",
            padding: "6px 14px",
            borderRadius: 6,
          }}
        >
          // 02 – CORE ENGINE
        </span>
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
          }}
        >
          DUCKDB-WASM + ECHARTS 5.5
        </span>
      </div>

      {/* Main Stacked Cards Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Card 1: Feature 01 */}
        <div
          style={{
            width: 1100,
            backgroundColor: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 24,
            padding: "44px 56px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
            border: "4px solid #0A0A0A",
            transform: `translateY(${card1Y - 70}px) rotate(${card1Rotate}deg)`,
            position: "absolute",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {/* Dither Database Chip Icon */}
            <svg width="84" height="84" viewBox="0 0 100 100" fill="none">
              <rect x="15" y="15" width="70" height="70" rx="14" fill="#0A0A0A" />
              <circle cx="35" cy="35" r="5" fill="#FFFFFF" />
              <circle cx="65" cy="35" r="5" fill="#FFFFFF" />
              <circle cx="35" cy="65" r="5" fill="#FFFFFF" />
              <circle cx="65" cy="65" r="5" fill="#FFFFFF" />
              <rect x="42" y="42" width="16" height="16" fill="#2563EB" />
            </svg>

            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#2563EB",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                // FEATURE 01 · CLIENT-SIDE WASM
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  marginBottom: 6,
                }}
              >
                DuckDB-WASM In-Browser
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#4B5563" }}>
                0ms query latency · 100% data privacy · Zero server load
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#F3F4F6",
              border: "2px solid #E5E7EB",
              borderRadius: 14,
              padding: "16px 28px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#6B7280" }}>
              COST PER QUERY
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#16A34A" }}>
              $0.00
            </div>
          </div>
        </div>

        {/* Card 2: Feature 02 (Stacked on top) */}
        <div
          style={{
            width: 1120,
            backgroundColor: "#FFFFFF",
            color: "#0A0A0A",
            borderRadius: 24,
            padding: "44px 56px",
            boxShadow: "0 35px 70px rgba(0,0,0,0.35)",
            border: "4px solid #0A0A0A",
            transform: `translateY(${card2Y + 80}px) rotate(${card2Rotate}deg)`,
            position: "absolute",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {/* Dither ECharts Icon */}
            <svg width="84" height="84" viewBox="0 0 100 100" fill="none">
              <rect x="15" y="15" width="70" height="70" rx="14" fill="#2563EB" />
              <rect x="30" y="55" width="10" height="25" fill="#FFFFFF" />
              <rect x="46" y="38" width="10" height="42" fill="#FFFFFF" />
              <rect x="62" y="24" width="10" height="56" fill="#FFFFFF" />
            </svg>

            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#2563EB",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                // FEATURE 02 · NATIVE UI PANEL
              </div>
              <div
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  marginBottom: 6,
                }}
              >
                Interactive ECharts Panels
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#4B5563" }}>
                Drill-down filters · Zoomable trendlines · One-click theme toggle
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#EFF6FF",
              border: "2px solid #BFDBFE",
              borderRadius: 14,
              padding: "16px 28px",
              textAlign: "right",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1E40AF" }}>
              UI EXPERIENCE
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: "#2563EB" }}>
              60 FPS
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-tag */}
      <div
        style={{
          borderTop: "2px solid rgba(255,255,255,0.3)",
          paddingTop: 18,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: 600,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <span>ARCHITECTURE: CLIENT-SIDE WASM EXTENSION</span>
        <span>ZERO LATENCY DUCKDB SANDBOX</span>
      </div>
    </div>
  );
};
