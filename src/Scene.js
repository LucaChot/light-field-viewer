import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Screen from "./Screen";

const Scene = () => {
  return (
    <Canvas camera={{ fov: 12, position: [0, 0, 5] }}>
      <Suspense fallback={null}>
        <Screen />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
