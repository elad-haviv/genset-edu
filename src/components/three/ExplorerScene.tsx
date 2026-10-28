"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { GensetModel, partMeta } from "./GensetModel";
import { Stage } from "./Stage";

export type ExplorerSceneProps = {
  selected: string | null;
  onSelect: (id: string) => void;
  hovered: string | null;
  onHover: (id: string | null) => void;
  explode: number;
  running: boolean;
  enclosure: boolean;
  labels: boolean;
  isDimmed: (id: string) => boolean;
  labelFor: (id: string) => string;
  flagged?: string | null;
  /** Increment to reset the camera to the overview. */
  resetKey: number;
  /** When false, selecting a component doesn't move the camera (challenge mode). */
  autoFocus?: boolean;
};

const HOME = { pos: [4.3, 2.7, 4.6] as const, target: [0, 0.9, 0] as const };

function CameraRig({ selected, explode, resetKey, autoFocus }: { selected: string | null; explode: number; resetKey: number; autoFocus: boolean }) {
  const cc = useRef<CameraControls>(null);

  useEffect(() => {
    const c = cc.current;
    if (!c || !selected || !autoFocus) return;
    const m = partMeta[selected];
    if (!m) return;
    const t = m.center.map((v, i) => v + m.offset[i] * explode) as [number, number, number];
    let dir: [number, number, number] = [t[0] * 0.35, 0.55, t[2] < -0.2 ? -1 : 1];
    if (selected === "radiator") dir = [-1, 0.35, 0.55];
    if (selected === "baseframe" || selected === "mounts") dir = [0.5, 0.7, 1];
    const len = Math.hypot(...dir);
    const d = m.dist * (1 + explode * 0.35);
    void c.setLookAt(t[0] + (dir[0] / len) * d, t[1] + (dir[1] / len) * d, t[2] + (dir[2] / len) * d, t[0], t[1], t[2], true);
  }, [selected, explode, autoFocus]);

  useEffect(() => {
    const c = cc.current;
    if (!c) return;
    const k = 1 + explode * 0.5;
    void c.setLookAt(HOME.pos[0] * k, HOME.pos[1] * k, HOME.pos[2] * k, ...HOME.target, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  return <CameraControls ref={cc} makeDefault minDistance={0.6} maxDistance={14} maxPolarAngle={Math.PI * 0.495} smoothTime={0.45} />;
}

export default function ExplorerScene(p: ExplorerSceneProps) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [...HOME.pos], fov: 40, near: 0.05, far: 100 }} gl={{ antialias: true, preserveDrawingBuffer: false }}>
      <Stage />
      <GensetModel
        selected={p.selected}
        hovered={p.hovered}
        onSelect={p.onSelect}
        onHover={p.onHover}
        explode={p.explode}
        running={p.running}
        showEnclosure={p.enclosure}
        showLabels={p.labels}
        labelFor={p.labelFor}
        isDimmed={p.isDimmed}
        flagged={p.flagged}
      />
      <CameraRig selected={p.selected} explode={p.explode} resetKey={p.resetKey} autoFocus={p.autoFocus ?? true} />
    </Canvas>
  );
}
