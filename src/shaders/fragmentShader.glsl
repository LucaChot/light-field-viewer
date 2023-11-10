uniform sampler2D cameraTexture;
varying vec2 vUv;

void main() {
  vec3 color = texture2D(cameraTexture, vUv).rgb;
  gl_FragColor = vec4(color, 1.0);
}

