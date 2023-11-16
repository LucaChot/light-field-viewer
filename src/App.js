import * as THREE from "three";
import React, { useRef, Suspense } from "react";
import { Canvas, extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { shaderMaterial, OrbitControls } from "@react-three/drei";
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
    varying mat4 V_k;
    varying mat4 P_k;

    void main() {
      vUv = uv;
      V_k = modelViewMatrix;
      P_k = projectionMatrix;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
    }
  `,
  // Fragment Shader
  glsl`
    precision mediump float;

    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying mat4 V_k;
    varying mat4 P_k;
    // Camera properties
    vec3 cam_pos = vec3(0.0, 0.0, 5.0);
    vec3 lookAtPosition = vec3(0.0, 0.0, 0.0);
    vec3 upDirection = vec3(0.0, 1.0, 0.0);

    mat4 createViewMatrix(vec3 eye, vec3 target, vec3 up) {
        vec3 f = normalize(target - eye);
        vec3 r = normalize(cross(up, f));
        vec3 u = cross(f, r);

        return mat4(
            vec4(r, 0.0),
            vec4(u, 0.0),
            vec4(-f, 0.0),
            vec4(0.0, 0.0, 0.0, 1.0)
        ) * mat4(
            vec4(1.0, 0.0, 0.0, 0.0),
            vec4(0.0, 1.0, 0.0, 0.0),
            vec4(0.0, 0.0, 1.0, 0.0),
            vec4(-eye, 1.0)
        );
    }

    mat4 createProjection(vec3 N, vec3 w_f, mat4 viewMatrix) {
      vec3 N_c = (viewMatrix * vec4(N, 1)).xyz;
      vec3 w_f_c = (viewMatrix * vec4(w_f, 1)).xyz;
      return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(N_c, -dot(N_c, w_f_c)),
        vec4(0.0, 0.0, 1.0, 0.0)
      );
    }


    void main() {
      vec4 p_k = vec4(vUv * 2.0 - 1.0, 0 , 1);
      vec3 N = vec3(0.0, 0.0, 1.0);
      vec3 w_f = vec3(0.0, 0.0, 0.0);

      mat4 V_i = createViewMatrix(cam_pos, lookAtPosition, upDirection);

      mat4 P_k = createProjection(N, w_f, V_k);
      mat4 P_i = createProjection(N, w_f, V_i);
      vec4 p_i = P_i * V_i * inverse(V_k) * inverse(P_k) * p_k;
      vec2 uv = (p_i.xy + 1.0) / 2.0;
      vec3 tex = vec3(0.0, 0.0, 0.0);
      if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
        tex = vec3(texture2D(uTexture, uv).rgb);
      }
      gl_FragColor = vec4(tex, 1.0); 
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
    //planeRef.current.lookAt(camera.position);
  });
  const [image] = useLoader(THREE.TextureLoader, [
    textureImg
  ]);

  const verticalFOV = camera.fov * (Math.PI / 180); // Convert FOV to radians
  const height = 2 * Math.tan(verticalFOV / 2) * camera.position.z;
  const aspect = window.innerWidth / window.innerHeight;
  const width = height * aspect;

  return (
    <mesh ref={planeRef}>
      <planeGeometry args={[width, height, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={planeRef} uTexture={image} />
    </mesh>
  );
};

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

const App = () => {
  return (
    <>
      <Scene />
    </>
  );
};

export default App;
