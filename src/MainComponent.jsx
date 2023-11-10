import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

const CustomMaterial = shaderMaterial(
  { cameraTexture: new THREE.Texture() }, // Initialize texture
  vertexShader,
  fragmentShader
);

const QuadMesh = () => {
  const ref = useRef();

  // Set up UV coordinates for the quad
  const geo = new THREE.PlaneGeometry(2, 2);
  geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2));

  return (
    <mesh ref={ref} geometry={geo}>
      <planeBufferGeometry args={[2, 2]} />
      <CustomMaterial />
    </mesh>
  );
};

const MainComponent = () => {
  const { gl, scene, camera } = useThree();

  // Load camera image texture
  const cameraTexture = new THREE.TextureLoader().load('img.png');
  cameraTexture.minFilter = THREE.LinearFilter; // Adjust texture filtering

  useEffect(() => {
    // Pass the loaded texture to the material
    CustomMaterial.current.uniforms.cameraTexture.value = cameraTexture;

    // Add the quad mesh to the scene
    scene.add(QuadMesh.current);
  }, [scene, cameraTexture]);

  return null;
};

export default MainComponent;
