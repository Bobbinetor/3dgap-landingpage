"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  RoundedBox,
  ContactShadows,
  Sparkles,
  Lightformer,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { useTheme } from "./theme-provider";

const LAYERS = 56;
const HEIGHT = 3.7;
const TWIST = Math.PI * 1.25;

/**
 * A 3D-printed twisted vessel: 52 stacked rounded layers, each rotated and
 * scaled along a vase profile. Reads as a generative print sculpture and
 * literally celebrates the FDM layer-by-layer build.
 */
function LayeredVessel({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  const layers = useMemo(() => {
    const out: { y: number; w: number; rot: number; thickness: number }[] = [];
    for (let i = 0; i < LAYERS; i++) {
      const t = i / (LAYERS - 1);
      // vase profile: narrow base, full low belly, tapered neck, soft flare
      const belly = Math.pow(Math.sin(Math.PI * Math.min(1, t * 0.96 + 0.02)), 0.68);
      const flare = 0.06 * Math.max(0, t - 0.88) * 8; // subtle rim flare
      const profile = 0.62 + 0.86 * belly + flare;
      out.push({
        y: (t - 0.5) * HEIGHT,
        w: profile,
        rot: t * TWIST,
        thickness: (HEIGHT / LAYERS) * 0.86,
      });
    }
    return out;
  }, []);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.22;
    if (inner.current) {
      const { x, y } = state.pointer;
      inner.current.rotation.x = THREE.MathUtils.lerp(inner.current.rotation.x, y * 0.18, 0.05);
      inner.current.rotation.z = THREE.MathUtils.lerp(inner.current.rotation.z, -x * 0.12, 0.05);
      inner.current.position.y = THREE.MathUtils.lerp(
        inner.current.position.y,
        Math.sin(state.clock.elapsedTime * 0.7) * 0.06,
        0.05
      );
    }
  });

  return (
    <group ref={inner}>
      <group ref={group}>
        {layers.map((l, i) => (
          <RoundedBox
            key={i}
            args={[l.w, l.thickness, l.w]}
            radius={Math.min(l.thickness * 0.42, 0.06)}
            smoothness={3}
            position={[0, l.y, 0]}
            rotation={[0, l.rot, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={accent}
              metalness={1}
              roughness={0.19}
              envMapIntensity={1.35}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
}

function Rig() {
  // subtle, slow camera drift toward the pointer for depth
  useFrame((state) => {
    const targetX = state.pointer.x * 0.4;
    const targetY = 0.2 + state.pointer.y * 0.25;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.03);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const accent = dark ? "#38bdf8" : "#0369a1";

  return (
    <>
      <ambientLight intensity={dark ? 0.18 : 0.5} />
      <spotLight
        position={[4, 7, 5]}
        angle={0.45}
        penumbra={1}
        intensity={dark ? 3 : 2}
        color={dark ? "#e0f2fe" : "#ffffff"}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, -1, -3]} intensity={1.6} color={accent} />
      <pointLight position={[3, -3, 4]} intensity={0.5} color={dark ? "#7dd3fc" : "#bae6fd"} />

      <LayeredVessel accent={accent} />

      <Sparkles
        count={36}
        scale={[7, 9, 7]}
        size={2.2}
        speed={0.25}
        opacity={dark ? 0.6 : 0.4}
        color={accent}
      />

      <ContactShadows
        position={[0, -2.15, 0]}
        opacity={dark ? 0.55 : 0.32}
        scale={12}
        blur={2.8}
        far={4.2}
        color={dark ? "#000000" : "#3a2e1a"}
      />

      <Environment resolution={256} environmentIntensity={dark ? 0.5 : 0.85}>
        <Lightformer intensity={2} position={[0, 4, 4]} scale={[8, 3, 1]} color="#e0f2fe" />
        <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={[3, 6, 1]} color={accent} />
        <Lightformer intensity={1} position={[4, -2, 2]} scale={[4, 4, 1]} color="#bae6fd" />
      </Environment>

      <Rig />

      <EffectComposer enableNormalPass={false}>
        <Bloom
          intensity={dark ? 0.85 : 0.45}
          luminanceThreshold={dark ? 0.55 : 0.75}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.2, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
