import React from "react";
import { Sequence, Audio, staticFile } from "remotion";
import { Scene1Hook } from "./components/Scene1Hook";
import { Scene2Features } from "./components/Scene2Features";
import { Scene3Product } from "./components/Scene3Product";
import { Scene4System } from "./components/Scene4System";
import { Scene5Phrase } from "./components/Scene5Phrase";
import { Scene6Outro } from "./components/Scene6Outro";

/**
 * 15s Product Video for DataCanvas BI
 * Resolution: 1920x1080 @ 30fps = 450 frames
 * Beat synced at 120 BPM (1 beat = 15 frames)
 * Direct hard cuts with no slow transitions.
 */
export const ProductVideo: React.FC = () => {
  return (
    <div style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
      {/* Background audio pointing to /public/music.mp3 */}
      <Audio src={staticFile("music.mp3")} />

      {/* 01: 0–2s (frames 0–60, 4 beats): Hook */}
      <Sequence from={0} durationInFrames={60}>
        <Scene1Hook />
      </Sequence>

      {/* 02: 2–5s (frames 60–150, 6 beats): Features */}
      <Sequence from={60} durationInFrames={90}>
        <Scene2Features />
      </Sequence>

      {/* 03: 5–8s (frames 150–240, 6 beats): Product Mockup */}
      <Sequence from={150} durationInFrames={90}>
        <Scene3Product />
      </Sequence>

      {/* 04: 8–11s (frames 240–330, 6 beats): System Architecture Grid */}
      <Sequence from={240} durationInFrames={90}>
        <Scene4System />
      </Sequence>

      {/* 05: 11–13s (frames 330–390, 4 beats): Core Mission Phrase */}
      <Sequence from={330} durationInFrames={60}>
        <Scene5Phrase />
      </Sequence>

      {/* 06: 13–15s (frames 390–450, 4 beats): Outro & CTA */}
      <Sequence from={390} durationInFrames={60}>
        <Scene6Outro />
      </Sequence>
    </div>
  );
};
