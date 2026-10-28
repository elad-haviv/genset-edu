"use client";

import { ContactShadows, Environment, Grid, Lightformer } from "@react-three/drei";

/** Shared studio lighting, environment reflections and engineering grid floor. */
export function Stage({ grid = true, shadows = true, fog = true }: { grid?: boolean; shadows?: boolean; fog?: boolean }) {
  return (
    <>
      <color attach="background" args={["#070d1a"]} />
      {fog && <fog attach="fog" args={["#070d1a", 12, 30]} />}
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#bcd8ff", "#1a2233", 0.55]} />
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#7cc8ff" />
      <pointLight position={[0, 3, 3]} intensity={6} distance={8} color="#ff9a1f" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer intensity={1.2} position={[6, 2, 4]} rotation-y={-Math.PI / 3} scale={[6, 3, 1]} color="#cfe6ff" />
        <Lightformer intensity={0.8} position={[-6, 2, -3]} rotation-y={Math.PI / 3} scale={[6, 3, 1]} color="#ffd9a8" />
      </Environment>
      {grid && (
        <Grid
          infiniteGrid
          position={[0, -0.001, 0]}
          cellSize={0.25}
          sectionSize={1}
          cellColor="#16294a"
          sectionColor="#24477a"
          cellThickness={0.6}
          sectionThickness={1}
          fadeDistance={22}
          fadeStrength={1.5}
        />
      )}
      {shadows && <ContactShadows position={[0, 0.002, 0]} opacity={0.55} scale={12} blur={2.4} far={4} resolution={1024} />}
    </>
  );
}
