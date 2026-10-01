import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Mascot } from "./Mascot";

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy spring with tight damping and minimal overshoot
  const mascotSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 180 },
  });

  const mascotX = interpolate(mascotSpring, [0, 1], [650, 0]);

  // False timecode calculation: TC 00:00:01:XX
  const framesPart = String(frame % 30).padStart(2, "0");
  const secondsPart = String(Math.floor(frame / 30)).padStart(2, "0");
  const timecode = `00:00:${secondsPart}:${framesPart}`;

  // Word-by-word reveal timing
  const words = ["Still", "waiting", "on", "static", "matplotlib", "PNGs?"];

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
      {/* Top Header Bar */}
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
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              backgroundColor: "#0A0A0A",
              color: "#FFFFFF",
              padding: "6px 14px",
              borderRadius: 6,
            }}
          >
            // 01 – hook
          </span>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
            DataCanvas BI
          </span>
        </div>

        <div
          style={{
            fontFamily: "monospace",
            fontSize: 26,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#DC2626",
              display: "inline-block",
              opacity: frame % 16 < 8 ? 1 : 0.2,
            }}
          />
          <span>REC [TC {timecode}]</span>
        </div>
      </div>

      {/* Main Kinetic Content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        {/* Kinetic Words */}
        <div style={{ maxWidth: 1050 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#2563EB",
              marginBottom: 20,
            }}
          >
            ChatGPT Data Analytics
          </div>

          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              display: "flex",
              flexWrap: "wrap",
              gap: "18px 24px",
            }}
          >
            {words.map((w, idx) => {
              // Word staggered entrance based on 120 bpm beats (every 6-8 frames)
              const wordDelay = idx * 6;
              const wordSpring = spring({
                frame: frame - wordDelay,
                fps,
                config: { damping: 15, mass: 0.6, stiffness: 220 },
              });
              const translateY = interpolate(wordSpring, [0, 1], [40, 0]);
              const opacity = interpolate(wordSpring, [0, 1], [0, 1]);

              const isHighlight = w.includes("matplotlib") || w.includes("PNGs?");

              return (
                <span
                  key={idx}
                  style={{
                    display: "inline-block",
                    transform: `translateY(${translateY}px)`,
                    opacity,
                    color: isHighlight ? "#2563EB" : "#0A0A0A",
                    textDecoration: isHighlight ? "underline" : "none",
                    textDecorationThickness: "6px",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>

        {/* Mascot entering from right */}
        <div
          style={{
            transform: `translateX(${mascotX}px)`,
            marginRight: 40,
          }}
        >
          <Mascot size={340} mood="smile" />
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
        <span>STATUS: UPGRADING CHATGPT INTERFACE</span>
        <span>MODEL CONTEXT PROTOCOL (MCP)</span>
      </div>
    </div>
  );
};
