import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Mascot } from "./Mascot";

export const Scene5Phrase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Kinetic typography spring for Line 1
  const line1Spring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 200 },
  });
  const line1Y = interpolate(line1Spring, [0, 1], [40, 0]);
  const line1Opacity = interpolate(line1Spring, [0, 1], [0, 1]);

  // Kinetic typography spring for Line 2 (beat 2, frame 15)
  const line2Spring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 200 },
  });
  const line2Y = interpolate(line2Spring, [0, 1], [40, 0]);
  const line2Opacity = interpolate(line2Spring, [0, 1], [0, 1]);

  // Mascot spring entrance
  const mascotSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 180 },
  });
  const mascotScale = interpolate(mascotSpring, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: "#0A0A0A",
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
      {/* Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #262626",
          paddingBottom: 24,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            padding: "6px 14px",
            borderRadius: 6,
          }}
        >
          // 05 – MISSION
        </span>
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#9CA3AF",
          }}
        >
          END-TO-END AUTOMATION
        </span>
      </div>

      {/* Main Split: Massive Punchy Typography + Mascot */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          padding: "0 40px",
        }}
      >
        <div style={{ maxWidth: 1100 }}>
          <div
            style={{
              fontSize: 98,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              transform: `translateY(${line1Y}px)`,
              opacity: line1Opacity,
              marginBottom: 16,
              color: "#9CA3AF",
            }}
          >
            You prompt.
          </div>

          <div
            style={{
              fontSize: 104,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              transform: `translateY(${line2Y}px)`,
              opacity: line2Opacity,
              color: "#FFFFFF",
            }}
          >
            We handle the{" "}
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontStyle: "italic",
                color: "#3B82F6",
              }}
            >
              rest.
            </span>
          </div>
        </div>

        {/* Mascot with Wink */}
        <div
          style={{
            transform: `scale(${mascotScale})`,
            marginRight: 60,
          }}
        >
          <Mascot size={360} mood="wink" invert={true} />
        </div>
      </div>

      {/* Bottom Sub-tag */}
      <div
        style={{
          borderTop: "2px solid #262626",
          paddingTop: 18,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          fontWeight: 600,
          color: "#9CA3AF",
        }}
      >
        <span>RANUK IT SOLUTIONS · AUTOMATED INTELLIGENCE</span>
        <span>CHATGPT + MCP NATIVE ECOSYSTEM</span>
      </div>
    </div>
  );
};
