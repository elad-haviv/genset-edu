"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { V3 } from "./primitives";

/** Rising, expanding puffs of exhaust smoke. */
export function Smoke({
  origin,
  active,
  color = "#8d969e",
  count = 24,
  drift = [0.25, 0, 0],
  rise = 1.3,
  spread = 0.3,
  maxOpacity = 0.35,
}: {
  origin: V3;
  active: boolean;
  color?: string;
  count?: number;
  drift?: V3;
  rise?: number;
  spread?: number;
  maxOpacity?: number;
}) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const seeds = useMemo(() => Array.from({ length: count }, (_, i) => ({ phase: i / count, jitter: Math.random() * 2 - 1 })), [count]);
  const level = useRef(0);

  useFrame((state, dt) => {
    level.current = THREE.MathUtils.damp(level.current, active ? 1 : 0, 1.5, dt);
    const t0 = state.clock.elapsedTime * 0.45;
    seeds.forEach((s, i) => {
      const m = refs.current[i];
      if (!m) return;
      const t = (t0 + s.phase) % 1;
      m.position.set(
        origin[0] + drift[0] * t + s.jitter * spread * t * 0.4,
        origin[1] + rise * t + drift[1] * t,
        origin[2] + drift[2] * t + Math.sin((t + s.phase) * 9) * spread * 0.2 * t,
      );
      const sc = 0.05 + t * 0.32;
      m.scale.setScalar(sc);
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.opacity = (1 - t) * maxOpacity * level.current * Math.min(1, t * 6);
      m.visible = mat.opacity > 0.005;
    });
  });

  return (
    <group>
      {seeds.map((_, i) => (
        <mesh key={i} ref={(el) => {
            refs.current[i] = el;
          }} raycast={() => null}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color={color} transparent opacity={0} depthWrite={false} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Particles flowing along a path — used to visualise airflow. */
export function FlowParticles({
  path,
  color,
  count = 40,
  speed = 0.25,
  size = 0.06,
  spread = 0.35,
  visible = true,
}: {
  path: V3[];
  color: string;
  count?: number;
  speed?: number;
  size?: number;
  spread?: number;
  visible?: boolean;
}) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(path.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(path)],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () => Array.from({ length: count }, () => ({ p: Math.random(), o: new THREE.Vector3((Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread) })),
    [count, spread],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    seeds.forEach((s, i) => {
      s.p = (s.p + dt * speed) % 1;
      curve.getPointAt(s.p, tmp);
      dummy.position.copy(tmp).add(s.o);
      const fade = Math.sin(s.p * Math.PI);
      dummy.scale.setScalar(size * (0.4 + fade * 0.8));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} visible={visible} raycast={() => null}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  );
}
