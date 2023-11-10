import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, TextureLoader, LinearFilter} from "three";
import './scene.css';

import vertexShader from './shaders/vertexShader';
import fragmentShader from './shaders/fragmentShader';

const MovingPlane = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef();
  const imageTexture = new TextureLoader().load('path_to_your_image.jpg');
  imageTexture.minFilter = LinearFilter; // Adjust texture filtering

  return (
    <mesh ref={mesh} position={[0, 0, 0]} scale={1.0}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        imageTexture={imageTexture}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [0.0, 0.0, 1.0] }}>
      <MovingPlane />
      <OrbitControls />
    </Canvas>
  );
};


export default Scene;
