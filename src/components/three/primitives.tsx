"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import * as THREE from "three";

export type V3 = [number, number, number];

/** Visual state of the enclosing selectable part. */
export type PartState = "normal" | "hover" | "selected" | "dim" | "flag";
export const PartStateCtx = createContext<PartState>("normal");

const HIGHLIGHT: Record<PartState, { color: string; intensity: number } | null> = {
  normal: null,
  dim: null,
  hover: { color: "#ff9a1f", intensity: 0.45 },
  selected: { color: "#1e90ff", intensity: 0.7 },
  flag: { color: "#ff3b3b", intensity: 0.6 },
};

export function Mat({
  color,
  metal = 0.35,
  rough = 0.55,
  emissive,
  emissiveIntensity = 1,
  opacity = 1,
  map,
  side,
}: {
  color: string;
  metal?: number;
  rough?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  map?: THREE.Texture | null;
  side?: THREE.Side;
}) {
  const state = useContext(PartStateCtx);
  const hl = HIGHLIGHT[state];
  const dim = state === "dim";
  const finalOpacity = dim ? 0.1 : opacity;
  return (
    <meshStandardMaterial
      color={color}
      metalness={metal}
      roughness={rough}
      map={map ?? null}
      emissive={hl ? hl.color : emissive ?? "#000000"}
      emissiveIntensity={hl ? hl.intensity : emissive ? emissiveIntensity : 0}
      transparent={finalOpacity < 1}
      opacity={finalOpacity}
      depthWrite={finalOpacity >= 1}
      side={side ?? THREE.FrontSide}
    />
  );
}

type Common = {
  pos?: V3;
  rot?: V3;
  color: string;
  metal?: number;
  rough?: number;
  emissive?: string;
  emissiveIntensity?: number;
  opacity?: number;
  map?: THREE.Texture | null;
  cast?: boolean;
};

export function Box({ size, pos = [0, 0, 0], rot = [0, 0, 0], cast = true, ...m }: Common & { size: V3 }) {
  return (
    <mesh position={pos} rotation={rot} castShadow={cast} receiveShadow>
      <boxGeometry args={size} />
      <Mat {...m} />
    </mesh>
  );
}

/** Cylinder; `axis` aligns it to x, y or z. */
export function Cyl({
  r,
  r2,
  h,
  seg = 28,
  axis = "y",
  pos = [0, 0, 0],
  rot,
  open = false,
  cast = true,
  ...m
}: Common & { r: number; r2?: number; h: number; seg?: number; axis?: "x" | "y" | "z"; open?: boolean }) {
  const axisRot: V3 = axis === "x" ? [0, 0, Math.PI / 2] : axis === "z" ? [Math.PI / 2, 0, 0] : [0, 0, 0];
  return (
    <mesh position={pos} rotation={rot ?? axisRot} castShadow={cast} receiveShadow>
      <cylinderGeometry args={[r2 ?? r, r, h, seg, 1, open]} />
      <Mat {...m} side={open ? THREE.DoubleSide : undefined} />
    </mesh>
  );
}

export function Torus({ r, tube, pos = [0, 0, 0], rot = [0, 0, 0], arc = Math.PI * 2, ...m }: Common & { r: number; tube: number; arc?: number }) {
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <torusGeometry args={[r, tube, 12, 40, arc]} />
      <Mat {...m} />
    </mesh>
  );
}

export function Sphere({ r, pos = [0, 0, 0], ...m }: Common & { r: number }) {
  return (
    <mesh position={pos} castShadow>
      <sphereGeometry args={[r, 20, 14]} />
      <Mat {...m} />
    </mesh>
  );
}

/** A smooth tube following a list of points. */
export function Pipe({ points, r, ...m }: Omit<Common, "pos" | "rot"> & { points: V3[]; r: number }) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, "catmullrom", 0.2);
    return new THREE.TubeGeometry(curve, Math.max(16, points.length * 12), r, 12, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(points), r]);
  return (
    <mesh geometry={geom} castShadow>
      <Mat {...m} />
    </mesh>
  );
}

/** Generates a canvas texture once (client only). */
export function useCanvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w = 256, h = 256, deps: unknown[] = []) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) draw(ctx, w, h);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function Group({ children, pos, rot, scale }: { children: ReactNode; pos?: V3; rot?: V3; scale?: number | V3 }) {
  return (
    <group position={pos} rotation={rot} scale={scale}>
      {children}
    </group>
  );
}
