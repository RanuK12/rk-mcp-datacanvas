import React from "react";
import { Composition } from "remotion";
import { ProductVideo } from "./ProductVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="ProductVideo"
        component={ProductVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
