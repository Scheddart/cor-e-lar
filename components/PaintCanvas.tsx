'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// GLSL vertex shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// GLSL fragment shader — domain-warped paint pour simulation
const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  // Hash function for noise
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  // Fractal Brownian Motion — layered noise for organic feel
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 6; ++i) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(100.0);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.08;

    // Domain warping: two layers of FBM drive each other
    vec2 q = vec2(
      fbm(uv + vec2(0.0, 0.0) + t * 0.3),
      fbm(uv + vec2(5.2, 1.3) + t * 0.2)
    );

    vec2 r = vec2(
      fbm(uv + 3.5 * q + vec2(1.7, 9.2) + t * 0.5),
      fbm(uv + 3.5 * q + vec2(8.3, 2.8) + t * 0.4)
    );

    float f = fbm(uv + 4.0 * r + t * 0.15);

    // Brand color palette
    vec3 orange  = vec3(1.0,  0.30, 0.10); // #FF4D1A
    vec3 navy    = vec3(0.11, 0.17, 0.29); // #1C2B4A
    vec3 cream   = vec3(0.96, 0.93, 0.88); // #F5EDE0
    vec3 gold    = vec3(0.79, 0.63, 0.29); // #C9A04A
    vec3 dark    = vec3(0.04, 0.04, 0.04); // #0A0A0A

    // Layer colors using domain-warped values
    vec3 color = mix(dark, navy, clamp(f * 2.0, 0.0, 1.0));
    color = mix(color, orange, clamp(pow(f, 2.5) * 3.0, 0.0, 0.8));
    color = mix(color, gold,   clamp(length(q) * 0.5, 0.0, 0.5));
    color = mix(color, cream,  clamp(r.x * r.y * 0.8, 0.0, 0.2));

    // Vignette — darken edges for cinematic framing
    float dist = length(uv - 0.5);
    float vignette = smoothstep(0.9, 0.3, dist);
    color *= mix(0.2, 1.0, vignette);

    // Subtle brightness lift
    color = pow(color, vec3(0.9));

    gl_FragColor = vec4(color, 1.0);
  }
`

function PaintMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function PaintCanvas() {
  return (
    <div
      className="absolute inset-0"
      role="img"
      aria-label="Animação fluida de tinta em movimento — visual decorativo do hero"
    >
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        frameloop="always"
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
        }}
        camera={{ fov: 35, near: 0.1, far: 10, position: [0, 0, 1] }}
      >
        <PaintMesh />
      </Canvas>
    </div>
  )
}
