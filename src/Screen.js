import * as THREE from "three";
import React, { useRef } from "react";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";
import "./App.css";
import textureImg from "./img.png"

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    precision mediump float;

    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform sampler2D uTexture;

    varying vec2 vUv;

    void main() {
      vec3 texture = texture2D(uTexture, vUv).rgb;
      gl_FragColor = vec4(texture, 1.0); 
    }
  `
);

extend({ WaveShaderMaterial });

const Screen = () => {
  const planeRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    // Update the plane's position to match the camera's position
    //planeRef.current.position.copy(camera.position);
    
    // Make the plane look at the camera
    planeRef.current.lookAt(camera.position);
  });
  const [image] = useLoader(THREE.TextureLoader, [
    textureImg
  ]);

  return (
    <mesh ref={planeRef}>
      <planeGeometry args={[1, 1, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={planeRef} uTexture={image} />
    </mesh>
  );
};

export default Screen;
