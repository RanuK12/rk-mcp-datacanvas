import React from "react";

interface MascotProps {
  size?: number;
  mood?: "smile" | "wink" | "excited";
  invert?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  size = 280,
  mood = "smile",
  invert = false,
}) => {
  const fg = invert ? "#FFFFFF" : "#0A0A0A";
  const bg = invert ? "#0A0A0A" : "#FFFFFF";
  const accent = "#2563EB";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Halftone / Dither stipple pattern */}
        <pattern
          id={`dither-pattern-${invert ? "inv" : "norm"}`}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="0.9" fill={fg} />
          <circle cx="4.5" cy="4.5" r="0.9" fill={fg} />
        </pattern>
        <pattern
          id={`dither-dense-${invert ? "inv" : "norm"}`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect x="0" y="0" width="2" height="2" fill={fg} />
          <rect x="2" y="2" width="2" height="2" fill={fg} />
        </pattern>
      </defs>

      {/* Subtle drop shadow / halftone shadow behind head */}
      <ellipse
        cx="105"
        cy="158"
        rx="65"
        ry="14"
        fill={`url(#dither-pattern-${invert ? "inv" : "norm"})`}
        opacity="0.45"
      />

      {/* Cute retro computer/bot antenna */}
      <line
        x1="100"
        y1="38"
        x2="100"
        y2="18"
        stroke={fg}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle
        cx="100"
        cy="14"
        r="9"
        fill={accent}
        stroke={fg}
        strokeWidth="4"
      />

      {/* Main big friendly head */}
      <rect
        x="30"
        y="36"
        width="140"
        height="115"
        rx="36"
        fill={bg}
        stroke={fg}
        strokeWidth="8"
      />

      {/* Cheeks stipple dither */}
      <ellipse
        cx="54"
        cy="108"
        rx="14"
        ry="8"
        fill={`url(#dither-dense-${invert ? "inv" : "norm"})`}
        opacity="0.5"
      />
      <ellipse
        cx="146"
        cy="108"
        rx="14"
        ry="8"
        fill={`url(#dither-dense-${invert ? "inv" : "norm"})`}
        opacity="0.5"
      />

      {/* Eyes */}
      {mood === "wink" ? (
        <>
          {/* Left Eye: Big Round Cute */}
          <circle cx="70" cy="86" r="14" fill={fg} />
          <circle cx="66" cy="82" r="5" fill={bg} />
          {/* Right Eye: Wink Arc */}
          <path
            d="M 120 88 Q 134 74 148 88"
            stroke={fg}
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          {/* Left Eye */}
          <circle cx="70" cy="86" r="14" fill={fg} />
          <circle cx="66" cy="82" r="5" fill={bg} />
          {/* Right Eye */}
          <circle cx="130" cy="86" r="14" fill={fg} />
          <circle cx="126" cy="82" r="5" fill={bg} />
        </>
      )}

      {/* Big warm friendly smile */}
      {mood === "excited" ? (
        <path
          d="M 72 108 Q 100 138 128 108 Z"
          fill={fg}
          stroke={fg}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M 76 108 Q 100 132 124 108"
          stroke={fg}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Cute side ear cuffs */}
      <rect
        x="18"
        y="78"
        width="12"
        height="32"
        rx="6"
        fill={fg}
      />
      <rect
        x="170"
        y="78"
        width="12"
        height="32"
        rx="6"
        fill={fg}
      />
    </svg>
  );
};
