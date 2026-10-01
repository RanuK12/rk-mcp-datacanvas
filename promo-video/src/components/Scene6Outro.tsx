import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Mascot } from "./Mascot";

export const Scene6Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for central block
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 190 },
  });
  const translateY = interpolate(enterSpring, [0, 1], [50, 0]);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Subtle button pulse
  const btnPulse = Math.sin(frame * 0.15) * 2;

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
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Top Tagline */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #0A0A0A",
          paddingBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            backgroundColor: "#0A0A0A",
            color: "#FFFFFF",
            padding: "6px 14px",
            borderRadius: 6,
          }}
        >
          // 06 – CALL TO ACTION
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#2563EB",
          }}
        >
          AVAILABLE ON OPENAI APPS DIRECTORY
        </span>
      </div>

      {/* Centerpiece: Mascot above Wordmark, Subtitle, CTA Button & URL */}
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Mascot Perched on Top */}
        <Mascot size={190} mood="excited" />

        {/* Wordmark */}
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#0A0A0A",
            lineHeight: 1,
          }}
        >
          DataCanvas <span style={{ color: "#2563EB" }}>BI</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: "#4B5563",
            maxWidth: 800,
            letterSpacing: "-0.01em",
          }}
        >
          Interactive CSV dashboards & executive reports inside ChatGPT
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 12,
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontSize: 28,
            fontWeight: 800,
            padding: "18px 46px",
            borderRadius: 999,
            border: "3px solid #0A0A0A",
            boxShadow: "0 12px 24px rgba(37,99,235,0.3)",
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            transform: `translateY(${btnPulse}px)`,
          }}
        >
          <span>Get DataCanvas Pro</span>
          <span style={{ fontSize: 32 }}>→</span>
        </div>

        {/* Domain URL */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 32,
            fontWeight: 800,
            color: "#0A0A0A",
            marginTop: 8,
            letterSpacing: "-0.02em",
          }}
        >
          ranuk.dev/datacanvas
        </div>
      </div>

      {/* Bottom Social Proof Bar */}
      <div
        style={{
          width: "100%",
          borderTop: "2px solid #0A0A0A",
          paddingTop: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 22,
          fontWeight: 700,
          color: "#374151",
          letterSpacing: "-0.01em",
        }}
      >
        <span>1.2B ChatGPT Users</span>
        <span style={{ margin: "0 16px", color: "#9CA3AF" }}>·</span>
        <span>100% In-Browser Privacy</span>
        <span style={{ margin: "0 16px", color: "#9CA3AF" }}>·</span>
        <span style={{ color: "#16A34A" }}>$0 Server Fees</span>
      </div>
    </div>
  );
};
