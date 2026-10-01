import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Scene3Product: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for headline
  const textSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 180 },
  });
  const textY = interpolate(textSpring, [0, 1], [50, 0]);
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);

  // Entrance spring for UI Mockup
  const uiSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 170 },
  });
  const uiX = interpolate(uiSpring, [0, 1], [300, 0]);
  const uiScale = interpolate(uiSpring, [0, 1], [0.94, 1]);

  // Dynamic bar height animation
  const barProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 160 },
  });

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
            // 03 – PRODUCT
          </span>
          <span style={{ fontSize: 28, fontWeight: 700 }}>
            NATIVE CONVERSATION PANEL
          </span>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 24,
            fontWeight: 700,
            color: "#2563EB",
          }}
        >
          ● ACTIVE THREAD PANEL
        </div>
      </div>

      {/* Main Split: Kinetic Text Left, UI Mockup Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          gap: 60,
        }}
      >
        {/* Left Column: Kinetic Headline */}
        <div
          style={{
            flex: 1,
            transform: `translateY(${textY}px)`,
            opacity: textOpacity,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#4B5563",
              marginBottom: 16,
            }}
          >
            From raw CSV to boardroom
          </div>

          <div
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: 32,
            }}
          >
            DataCanvas turns it into{" "}
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, "Times New Roman", serif',
                fontStyle: "italic",
                fontWeight: 700,
                color: "#2563EB",
                display: "inline-block",
              }}
            >
              dashboards.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              fontSize: 24,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "#2563EB", fontSize: 28 }}>✓</span>
              <span>Renders live inside ChatGPT sidebar</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "#2563EB", fontSize: 28 }}>✓</span>
              <span>Full client-side WASM filtering</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: "#2563EB", fontSize: 28 }}>✓</span>
              <span>1-Click unbranded executive PDF export</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real UI Mockup */}
        <div
          style={{
            width: 820,
            transform: `translateX(${uiX}px) scale(${uiScale})`,
            backgroundColor: "#171717",
            borderRadius: 20,
            border: "3px solid #0A0A0A",
            boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
            overflow: "hidden",
            color: "#FFFFFF",
          }}
        >
          {/* Window Chrome Header */}
          <div
            style={{
              backgroundColor: "#262626",
              padding: "14px 22px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #404040",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#EF4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#10B981" }} />
              <span style={{ fontSize: 16, fontWeight: 700, marginLeft: 12, color: "#E5E7EB" }}>
                DataCanvas Live Inspector
              </span>
            </div>
            <div
              style={{
                backgroundColor: "#2563EB",
                fontSize: 14,
                fontWeight: 800,
                padding: "6px 14px",
                borderRadius: 8,
              }}
            >
              Exportar PDF
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: 26 }}>
            {/* KPI Cards Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div style={{ backgroundColor: "#262626", padding: 16, borderRadius: 12, border: "1px solid #404040" }}>
                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Registros</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#FFFFFF" }}>1,248</div>
                <div style={{ fontSize: 11, color: "#10B981", fontWeight: 700 }}>↑ 100% parseado</div>
              </div>
              <div style={{ backgroundColor: "#262626", padding: 16, borderRadius: 12, border: "1px solid #404040" }}>
                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Volumen Total</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#3B82F6" }}>$48,920.00</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Métrica agregada</div>
              </div>
              <div style={{ backgroundColor: "#262626", padding: 16, borderRadius: 12, border: "1px solid #404040" }}>
                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Promedio / Reg</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#C084FC" }}>$39.19</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>En vivo en cliente</div>
              </div>
            </div>

            {/* Real Chart Visual with Animated Bars */}
            <div
              style={{
                backgroundColor: "#262626",
                borderRadius: 14,
                padding: "20px 24px",
                border: "1px solid #404040",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 14, color: "#9CA3AF" }}>
                <span>Distribución por Región</span>
                <span style={{ color: "#3B82F6", fontWeight: 700 }}>DuckDB 0ms</span>
              </div>

              <div style={{ display: "flex", alignItems: "flex-end", height: 140, gap: 24, paddingBottom: 10, borderBottom: "1px solid #525252" }}>
                {[
                  { label: "Norte", h: 120 },
                  { label: "Sur", h: 85 },
                  { label: "Este", h: 105 },
                  { label: "Oeste", h: 75 },
                  { label: "Centro", h: 50 },
                  { label: "Latam", h: 115 },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: "100%",
                        height: item.h * barProgress,
                        backgroundColor: "#2563EB",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.1s ease-out",
                      }}
                    />
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
        <span>MCP JSON-RPC · REALTIME SSE TRANSPORT</span>
        <span>OPENAI APIS APPROVED ARCHITECTURE</span>
      </div>
    </div>
  );
};
