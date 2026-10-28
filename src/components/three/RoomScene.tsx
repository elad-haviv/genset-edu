"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { CameraControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { GensetModel } from "./GensetModel";
import { Box, Cyl, Pipe, PartStateCtx, Torus, useCanvasTexture, type PartState, type V3 } from "./primitives";
import { FlowParticles, Smoke } from "./Effects";

export type PickKind = "hazard" | "good" | "decoy";

type RoomCtxValue = {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  onPick: (kind: PickKind, id: string) => void;
  found: Set<string>;
  selected: string | null;
  hint: string | null;
  numberOf: (id: string) => number;
};
const RoomCtx = createContext<RoomCtxValue | null>(null);
const useRoom = () => useContext(RoomCtx)!;

/** Room footprint (m). */
const RW = 9;
const RD = 6.5;
const RH = 3.2;
/** Generator placement in the room. */
const G: V3 = [-1.6, 0.15, -0.3];

/** A clickable object in the room. */
function Hot({ id, kind, marker, children }: { id: string; kind: PickKind; marker: V3; children: ReactNode }) {
  const r = useRoom();
  const isFound = kind === "hazard" && r.found.has(id);
  let state: PartState = "normal";
  if (r.selected === id) state = "selected";
  else if (r.hovered === id) state = "hover";
  else if (r.hint === id) state = "hover";
  else if (isFound) state = "flag";

  return (
    <group
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        r.onPick(kind, id);
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        r.setHovered(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        r.setHovered(null);
        document.body.style.cursor = "";
      }}
    >
      <PartStateCtx.Provider value={state}>{children}</PartStateCtx.Provider>
      {(isFound || r.hint === id || (kind === "good" && r.selected === id)) && (
        <Html position={marker} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="relative grid place-items-center">
            <span className={`absolute h-8 w-8 animate-pulseRing rounded-full border-2 ${kind === "good" ? "border-ok" : r.hint === id && !isFound ? "border-amber-400" : "border-danger"}`} />
            <span
              className={`relative grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] font-bold text-white shadow-lg ${
                kind === "good" ? "bg-ok" : r.hint === id && !isFound ? "bg-amber-500" : "bg-danger"
              }`}
            >
              {kind === "good" ? "✓" : isFound ? r.numberOf(id) : "?"}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------------------------------------------------------------- shell */

function RoomShell() {
  const floor = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#3a4048";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 2500; i++) {
        const v = 50 + Math.random() * 30;
        ctx.fillStyle = `rgba(${v},${v + 4},${v + 10},0.35)`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      ctx.strokeStyle = "rgba(0,0,0,.35)";
      ctx.lineWidth = 2;
      for (let x = 0; x <= w; x += w / 6) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += h / 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    },
    512,
    384,
  );
  const wallMat = { color: "#4a5361", roughness: 0.92, metalness: 0.02 } as const;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[RW, RD]} />
        <meshStandardMaterial map={floor} roughness={0.95} />
      </mesh>
      {/* inward-facing walls: invisible from outside, giving a cut-away view */}
      <mesh position={[0, RH / 2, -RD / 2]} receiveShadow>
        <planeGeometry args={[RW, RH]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[-RW / 2, RH / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[RD, RH]} />
        <meshStandardMaterial {...wallMat} color="#434b58" />
      </mesh>
      <mesh position={[RW / 2, RH / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[RD, RH]} />
        <meshStandardMaterial {...wallMat} color="#434b58" />
      </mesh>
      <mesh position={[0, RH / 2, RD / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[RW, RH]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      {/* wall top edges (visible cut line) */}
      <Box size={[RW + 0.2, 0.06, 0.2]} pos={[0, RH, -RD / 2 - 0.1]} color="#8a96a6" cast={false} />
      <Box size={[0.2, 0.06, RD + 0.2]} pos={[-RW / 2 - 0.1, RH, 0]} color="#8a96a6" cast={false} />
      <Box size={[0.2, 0.06, RD + 0.2]} pos={[RW / 2 + 0.1, RH, 0]} color="#8a96a6" cast={false} />
      <Box size={[RW + 0.2, 0.06, 0.2]} pos={[0, RH, RD / 2 + 0.1]} color="#8a96a6" cast={false} />
      {/* thick wall bodies at floor level so the room reads from outside */}
      <Box size={[RW + 0.4, 0.25, 0.2]} pos={[0, 0.125, RD / 2 + 0.1]} color="#59626f" cast={false} />
      {/* concrete plinth */}
      <Box size={[3.7, 0.15, 1.5]} pos={[G[0], 0.075, G[2]]} color="#6b7280" />
    </group>
  );
}

function Louvre({ pos, rotY, w, h, color = "#8b97a8" }: { pos: V3; rotY: number; w: number; h: number; color?: string }) {
  const n = Math.max(3, Math.round(h / 0.12));
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <Box size={[w + 0.1, h + 0.1, 0.05]} pos={[0, 0, -0.01]} color="#20262e" />
      {Array.from({ length: n }).map((_, i) => (
        <Box key={i} size={[w, 0.025, 0.1]} pos={[0, -h / 2 + (i + 0.5) * (h / n), 0.03]} rot={[0.6, 0, 0]} color={color} metal={0.5} />
      ))}
      <Box size={[w + 0.12, 0.04, 0.08]} pos={[0, h / 2 + 0.05, 0.02]} color="#5b6676" />
      <Box size={[w + 0.12, 0.04, 0.08]} pos={[0, -h / 2 - 0.05, 0.02]} color="#5b6676" />
    </group>
  );
}

function Sign({ pos, rotY = 0, kind }: { pos: V3; rotY?: number; kind: "danger" | "exit" | "noise" | "nosmoke" | "auto" }) {
  const tex = useCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    if (kind === "exit") {
      ctx.fillStyle = "#11a54b";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 70px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EXIT ➜", w / 2, h / 2 + 24);
      return;
    }
    if (kind === "danger" || kind === "auto") {
      ctx.fillStyle = "#ffd000";
      ctx.beginPath();
      ctx.moveTo(w / 2, 16);
      ctx.lineTo(w - 20, h - 16);
      ctx.lineTo(20, h - 16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 10;
      ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.font = "bold 90px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(kind === "danger" ? "⚡" : "↻", w / 2, h - 40);
      return;
    }
    if (kind === "noise") {
      ctx.fillStyle = "#1665c0";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h / 2 - 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 80px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🎧", w / 2, h / 2 + 28);
      return;
    }
    ctx.strokeStyle = "#d7262b";
    ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, h / 2 - 16, 0, Math.PI * 2);
    ctx.moveTo(w / 2 - 50, h / 2 - 50);
    ctx.lineTo(w / 2 + 50, h / 2 + 50);
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.fillRect(w / 2 - 50, h / 2 - 6, 90, 14);
  }, kind === "exit" ? 320 : 200, kind === "exit" ? 120 : 200);
  const size: [number, number] = kind === "exit" ? [0.5, 0.19] : [0.3, 0.3];
  return (
    <mesh position={pos} rotation={[0, rotY, 0]}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={tex} emissive={kind === "exit" ? "#11a54b" : "#000"} emissiveIntensity={kind === "exit" ? 0.6 : 0} />
    </mesh>
  );
}

function Door({ open = false }: { open?: boolean }) {
  // On the +x wall, facing into the room.
  return (
    <group position={[RW / 2 - 0.03, 0, 2.2]} rotation={[0, -Math.PI / 2, 0]}>
      <Box size={[1.1, 2.15, 0.06]} pos={[0, 1.075, 0]} color="#20262e" />
      <group position={[-0.5, 0, 0.04]} rotation={[0, open ? -0.6 : 0, 0]}>
        <Box size={[1.0, 2.05, 0.05]} pos={[0.5, 1.03, 0]} color="#7b8797" metal={0.5} rough={0.4} />
        <Box size={[0.12, 0.03, 0.05]} pos={[0.88, 1.05, 0.05]} color="#d0d6de" metal={0.9} />
      </group>
    </group>
  );
}

function Panel({ pos, w = 0.9, open = false, color = "#8a94a3" }: { pos: V3; w?: number; open?: boolean; color?: string }) {
  return (
    <group position={pos}>
      <Box size={[w, 2.0, 0.55]} pos={[0, 1.0, 0]} color={color} metal={0.4} rough={0.45} />
      <Box size={[w, 0.12, 0.6]} pos={[0, 0.06, 0]} color="#2a3038" />
      {open ? (
        <>
          {/* door swung open, exposed busbars */}
          <group position={[-w / 2, 0, 0.28]} rotation={[0, -1.9, 0]}>
            <Box size={[w, 1.8, 0.03]} pos={[w / 2, 1.05, 0]} color={color} metal={0.4} />
          </group>
          <Box size={[w - 0.1, 1.75, 0.02]} pos={[0, 1.05, 0.2]} color="#1a1e24" />
          {[0.6, 0.75, 0.9, 1.05].map((y, i) => (
            <Box key={y} size={[w - 0.2, 0.04, 0.03]} pos={[0, y + 0.4, 0.23]} color={i === 3 ? "#2a6fd6" : "#c97a3a"} metal={0.9} rough={0.25} emissive="#ff6a1f" emissiveIntensity={i === 3 ? 0 : 0.35} />
          ))}
          <Pipe points={[[0.1, 1.2, 0.24], [0.3, 0.9, 0.5], [0.35, 0.3, 0.7], [0.4, 0.03, 0.9]]} r={0.02} color="#222" />
        </>
      ) : (
        <>
          <Box size={[0.03, 1.8, 0.01]} pos={[0, 1.05, 0.28]} color="#3a434e" />
          <Box size={[0.03, 0.12, 0.04]} pos={[w / 2 - 0.08, 1.05, 0.3]} color="#1b1e23" />
          <Box size={[0.2, 0.12, 0.01]} pos={[-w / 4, 1.55, 0.281]} color="#e5e7eb" />
        </>
      )}
    </group>
  );
}

function Extinguisher({ pos, empty = false }: { pos: V3; empty?: boolean }) {
  return (
    <group position={pos}>
      <Box size={[0.22, 0.04, 0.06]} pos={[0, 1.0, 0]} color="#444" />
      <Box size={[0.3, 0.3, 0.01]} pos={[0, 1.55, -0.04]} color="#d7262b" />
      {!empty && (
        <>
          <Cyl r={0.08} h={0.5} pos={[0, 0.8, 0.07]} color="#d7262b" rough={0.35} />
          <Cyl r={0.025} h={0.08} pos={[0, 1.09, 0.07]} color="#111" />
        </>
      )}
    </group>
  );
}

/* ---------------------------------------------------------------- scenarios */

function GoodRoom({ running }: { running: boolean }) {
  // Exhaust tail on the genset is at local (-0.76, 2.47, -0.38).
  const ex: V3 = [G[0] - 0.76, G[1] + 2.4, G[2] - 0.38];
  return (
    <group>
      <Hot id="inlet" kind="good" marker={[RW / 2 - 0.1, 2.6, -0.5]}>
        <Louvre pos={[RW / 2 - 0.05, 1.5, -0.5]} rotY={-Math.PI / 2} w={2.4} h={1.8} />
      </Hot>
      <Hot id="duct" kind="good" marker={[-3.9, 2.0, -0.3]}>
        <Louvre pos={[-RW / 2 + 0.05, 1.13, -0.3]} rotY={Math.PI / 2} w={1.4} h={1.5} />
        {/* duct box between radiator and wall with flexible connection */}
        <group position={[-3.92, 1.13, -0.3]}>
          <Box size={[0.95, 1.6, 0.05]} pos={[0, 0, 0.72]} color="#9aa5b4" metal={0.6} />
          <Box size={[0.95, 1.6, 0.05]} pos={[0, 0, -0.72]} color="#9aa5b4" metal={0.6} />
          <Box size={[0.95, 0.05, 1.46]} pos={[0, 0.8, 0]} color="#9aa5b4" metal={0.6} />
          {[0.25, 0.3, 0.35].map((x) => (
            <Box key={x} size={[0.03, 1.66, 1.5]} pos={[x, 0, 0]} color="#1b1e23" opacity={0.95} />
          ))}
        </group>
      </Hot>
      <Hot id="exhaustA" kind="good" marker={[ex[0], 3.0, -2.2]}>
        <Pipe points={[ex, [ex[0], 2.8, ex[2]], [ex[0], 2.85, ex[2] - 0.4], [ex[0], 2.85, -RD / 2 - 0.4], [ex[0], 3.1, -RD / 2 - 0.5], [ex[0], 3.9, -RD / 2 - 0.5]]} r={0.11} color="#d9dde2" rough={0.7} />
        <Cyl r={0.17} h={0.03} pos={[ex[0], 3.95, -RD / 2 - 0.5]} rot={[0.4, 0, 0]} color="#7b8797" />
        <Box size={[0.04, 0.4, 0.04]} pos={[ex[0], 3.0, -1.6]} color="#555" />
      </Hot>
      <Smoke origin={[ex[0], 4.0, -RD / 2 - 0.5]} active={running} drift={[-0.3, 0, -0.4]} />
      <Hot id="tank" kind="good" marker={[-3.5, 1.4, 2.2]}>
        <Box size={[1.6, 0.35, 1.25]} pos={[-3.5, 0.175, 2.3]} color="#6f7782" opacity={0.95} />
        <Box size={[1.5, 0.3, 1.15]} pos={[-3.5, 0.2, 2.3]} color="#2a3038" />
        <Box size={[1.2, 0.75, 0.75]} pos={[-3.5, 0.75, 2.3]} color="#c9a227" metal={0.4} rough={0.5} />
        <Cyl r={0.04} h={0.4} pos={[-3.2, 1.3, 2.1]} color="#555" />
        <Box size={[0.32, 0.18, 0.01]} pos={[-3.5, 0.85, 2.68]} color="#d7262b" />
        <Pipe points={[[-3.0, 0.4, 2.0], [-2.7, 0.05, 1.6], [-2.2, 0.03, 0.6], [-1.9, 0.2, 0.35]]} r={0.018} color="#30343a" />
      </Hot>
      <Hot id="panels" kind="good" marker={[2.6, 2.4, -2.7]}>
        <Panel pos={[2.1, 0, -RD / 2 + 0.3]} color="#8a94a3" />
        <Panel pos={[3.1, 0, -RD / 2 + 0.3]} w={1.0} color="#8a94a3" />
        <Sign pos={[2.1, 1.75, -RD / 2 + 0.59]} kind="danger" />
        <Sign pos={[3.1, 1.75, -RD / 2 + 0.59]} kind="danger" />
      </Hot>
      <Hot id="tray" kind="good" marker={[0.8, 2.9, -1.3]}>
        {/* overhead cable ladder panel → genset */}
        <group>
          {[
            [2.6, -2.6, 2.6, -0.3],
            [0.4, -0.3, 2.6, -0.3],
          ].map(([x1, z1, x2, z2], i) => {
            const len = Math.hypot(x2 - x1, z2 - z1);
            const ang = Math.atan2(x2 - x1, z2 - z1);
            return (
              <group key={i} position={[(x1 + x2) / 2, 2.7, (z1 + z2) / 2]} rotation={[0, ang, 0]}>
                <Box size={[0.03, 0.08, len]} pos={[0.2, 0, 0]} color="#9aa5b4" metal={0.7} />
                <Box size={[0.03, 0.08, len]} pos={[-0.2, 0, 0]} color="#9aa5b4" metal={0.7} />
                {Array.from({ length: Math.floor(len / 0.3) }).map((_, k) => (
                  <Box key={k} size={[0.4, 0.02, 0.03]} pos={[0, -0.03, -len / 2 + 0.15 + k * 0.3]} color="#9aa5b4" metal={0.7} />
                ))}
                {[-0.1, -0.03, 0.04, 0.11].map((x) => (
                  <Box key={x} size={[0.05, 0.05, len]} pos={[x, 0.02, 0]} color="#1f2328" />
                ))}
              </group>
            );
          })}
          <Box size={[0.04, 0.6, 0.04]} pos={[1.5, 3.0, -0.3]} color="#555" />
          {[0, 1, 2, 3].map((i) => (
            <Pipe key={i} points={[[0.45, 2.7, -0.42 + i * 0.07], [0.1, 2.4, -0.2 + i * 0.04], [-0.1, 1.8, 0.0 + i * 0.02], [-0.2, 1.55, -0.1]]} r={0.025} color={["#7a4a24", "#1a1a1a", "#7d8590", "#2a6fd6"][i]} />
          ))}
        </group>
      </Hot>
      <Hot id="exitA" kind="good" marker={[RW / 2 - 0.2, 2.6, 2.2]}>
        <Door />
        <Sign pos={[RW / 2 - 0.06, 2.35, 2.2]} rotY={-Math.PI / 2} kind="exit" />
        <Sign pos={[RW / 2 - 0.1, 1.6, 2.45]} rotY={-Math.PI / 2} kind="auto" />
        <Sign pos={[RW / 2 - 0.1, 1.6, 2.05]} rotY={-Math.PI / 2} kind="noise" />
        <Sign pos={[RW / 2 - 0.1, 1.6, 1.65]} rotY={-Math.PI / 2} kind="nosmoke" />
        {/* external E-stop by the door */}
        <group position={[RW / 2 - 0.06, 1.3, 1.25]} rotation={[0, -Math.PI / 2, 0]}>
          <Box size={[0.16, 0.16, 0.05]} color="#ffd000" />
          <Cyl r={0.045} h={0.05} axis="z" pos={[0, 0, 0.05]} color="#e01b1b" />
        </group>
      </Hot>
      <Hot id="extinguisher" kind="good" marker={[RW / 2 - 0.3, 1.9, 1.0]}>
        <group rotation={[0, -Math.PI / 2, 0]} position={[RW / 2 - 0.08, 0, 0.9]}>
          <Extinguisher pos={[0, 0, 0]} />
        </group>
        <Box size={[0.3, 0.1, 0.1]} pos={[RW / 2 - 0.08, 2.7, 1.5]} color="#e5e7eb" emissive="#ffffff" emissiveIntensity={0.6} />
      </Hot>
      <Hot id="clearance" kind="good" marker={[G[0], 0.15, 1.2]}>
        <ClearanceZone />
      </Hot>
    </group>
  );
}

function ClearanceZone() {
  const tex = useCanvasTexture((ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = -h; i < w; i += 24) {
      ctx.fillStyle = "#ffd000";
      ctx.beginPath();
      ctx.moveTo(i, h);
      ctx.lineTo(i + 12, h);
      ctx.lineTo(i + 12 + h, 0);
      ctx.lineTo(i + h, 0);
      ctx.fill();
    }
  }, 256, 16);
  const W = 5.6;
  const D = 3.4;
  const strip = 0.08;
  return (
    <group position={[G[0], 0.004, G[2] + 0.1]}>
      {[
        [0, D / 2, W, strip, 0],
        [0, -D / 2, W, strip, 0],
        [W / 2, 0, D, strip, Math.PI / 2],
        [-W / 2, 0, D, strip, Math.PI / 2],
      ].map(([x, z, len, s, r], i) => (
        <mesh key={i} position={[x, 0, z]} rotation={[-Math.PI / 2, 0, r]}>
          <planeGeometry args={[len, s]} />
          <meshStandardMaterial map={tex} transparent color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function BadRoom({ running }: { running: boolean }) {
  const ex: V3 = [G[0] - 0.76, G[1] + 2.4, G[2] - 0.38];
  const exEnd: V3 = [1.2, 2.75, -0.7];
  return (
    <group>
      <Hot id="ventilation" kind="hazard" marker={[RW / 2 - 0.3, 2.2, -0.5]}>
        <Louvre pos={[RW / 2 - 0.05, 1.6, -0.5]} rotY={-Math.PI / 2} w={0.6} h={0.5} />
        {[
          [0, 0.3, 0],
          [0, 0.9, 0.05],
          [0.05, 1.45, -0.1],
          [0, 0.3, 0.6],
          [0.05, 0.9, 0.62],
        ].map(([dx, y, dz], i) => (
          <Box key={i} size={[0.55, 0.55, 0.55]} pos={[RW / 2 - 0.4 - dx, y, -0.6 + dz]} rot={[0, i * 0.2, 0]} color="#9b7650" rough={0.95} />
        ))}
      </Hot>
      <Hot id="recirculation" kind="hazard" marker={[-3.9, 2.3, -0.3]}>
        <mesh position={[-3.9, 1.2, -0.3]}>
          <boxGeometry args={[1.0, 1.8, 1.7]} />
          <meshStandardMaterial color="#ff3b1f" transparent opacity={0.08} depthWrite={false} emissive="#ff3b1f" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[-RW / 2 + 0.02, 1.2, -0.3]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 1.8]} />
          <meshStandardMaterial color="#5b3a2e" transparent opacity={0.35} />
        </mesh>
      </Hot>
      <Hot id="access" kind="hazard" marker={[-1.6, 2.2, 1.0]}>
        {/* shelving jammed against the service side */}
        <group position={[-1.7, 0, 0.95]}>
          {[0.02, 0.6, 1.2, 1.8].map((y) => (
            <Box key={y} size={[2.2, 0.04, 0.45]} pos={[0, y + 0.02, 0]} color="#56606d" metal={0.5} />
          ))}
          {[-1.08, 1.08].map((x) =>
            [-0.2, 0.2].map((z) => <Box key={`${x}${z}`} size={[0.04, 1.85, 0.04]} pos={[x, 0.92, z]} color="#3d4550" />),
          )}
          {[
            [-0.7, 0.8],
            [0.1, 0.8],
            [0.6, 1.4],
            [-0.4, 1.4],
            [0.7, 0.2],
          ].map(([x, y], i) => (
            <Box key={i} size={[0.45, 0.4, 0.38]} pos={[x, y - 0.04 + 0.2, 0]} color={i % 2 ? "#a07d57" : "#3b6ea5"} rough={0.9} />
          ))}
        </group>
      </Hot>
      <Hot id="exhaust" kind="hazard" marker={[exEnd[0], 3.05, exEnd[2]]}>
        <Pipe points={[ex, [ex[0], 2.75, ex[2]], [ex[0] + 0.4, 2.78, -0.7], exEnd]} r={0.075} color="#4a3c33" metal={0.6} rough={0.8} />
        <Cyl r={0.085} h={0.06} axis="x" pos={exEnd} color="#2a2420" />
        <mesh position={[exEnd[0] + 0.6, 2.95, exEnd[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.7, 24]} />
          <meshStandardMaterial color="#111" transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </Hot>
      <Smoke origin={[exEnd[0] + 0.1, exEnd[1], exEnd[2]]} active={running} drift={[1.6, -0.6, 0.6]} rise={0.6} spread={0.6} maxOpacity={0.45} color="#7c8288" count={28} />
      <Hot id="fuel" kind="hazard" marker={[-0.2, 1.6, -2.4]}>
        {[
          [-0.6, -2.5],
          [0.1, -2.6],
        ].map(([x, z]) => (
          <group key={x}>
            <Cyl r={0.29} h={0.88} pos={[x, 0.44, z]} color="#2a5fa8" metal={0.5} rough={0.5} />
            <Torus r={0.29} tube={0.015} rot={[Math.PI / 2, 0, 0]} pos={[x, 0.3, z]} color="#1d4785" />
            <Torus r={0.29} tube={0.015} rot={[Math.PI / 2, 0, 0]} pos={[x, 0.6, z]} color="#1d4785" />
          </group>
        ))}
        <Box size={[0.35, 0.45, 0.17]} pos={[0.55, 0.225, -2.2]} rot={[0, 0.4, 0]} color="#c92a2a" />
        <Box size={[0.35, 0.45, 0.17]} pos={[0.85, 0.17, -2.0]} rot={[Math.PI / 2, 0.2, 0]} color="#c92a2a" />
        <mesh position={[0.4, 0.006, -1.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.6, 28]} />
          <meshStandardMaterial color="#1a1d24" roughness={0.05} metalness={0.6} transparent opacity={0.85} />
        </mesh>
      </Hot>
      <Hot id="signage" kind="hazard" marker={[RW / 2 - 0.2, 2.5, 2.2]}>
        <Door />
        {[1.65, 2.05, 2.45].map((z) => (
          <mesh key={z} position={[RW / 2 - 0.1, 1.6, z]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color="#9aa3ad" transparent opacity={0.35} />
          </mesh>
        ))}
      </Hot>
      <Hot id="exit" kind="hazard" marker={[3.6, 1.6, 2.2]}>
        {[0, 0.16, 0.32].map((y) => (
          <Box key={y} size={[1.2, 0.14, 1.0]} pos={[3.7, y + 0.07, 2.2]} rot={[0, 0.1, 0]} color="#b08a5a" rough={0.95} />
        ))}
        <Box size={[0.7, 0.6, 0.6]} pos={[3.55, 0.78, 2.1]} rot={[0, 0.3, 0]} color="#56606d" metal={0.4} />
        <Box size={[0.4, 0.4, 0.4]} pos={[3.9, 0.68, 2.55]} color="#9b7650" />
      </Hot>
      <Hot id="panel" kind="hazard" marker={[3.1, 2.4, -2.5]}>
        <Panel pos={[3.1, 0, -RD / 2 + 0.3]} w={1.0} open />
      </Hot>
      <Hot id="provisions" kind="hazard" marker={[RW / 2 - 0.3, 1.9, 0.9]}>
        <group rotation={[0, -Math.PI / 2, 0]} position={[RW / 2 - 0.08, 0, 0.9]}>
          <Extinguisher pos={[0, 0, 0]} empty />
        </group>
      </Hot>
      <Hot id="cables" kind="hazard" marker={[1.2, 0.5, 0.9]}>
        {[0, 1, 2, 3].map((i) => (
          <Pipe
            key={i}
            points={[
              [3.1 + i * 0.05, 0.1, -2.6],
              [2.6 + i * 0.05, 0.03, -1.2],
              [1.8 + i * 0.04, 0.03, 0.6 + i * 0.04],
              [0.6, 0.03, 1.1 + i * 0.03],
              [0.2, 0.03, 0.6],
              [-0.2, 0.25, 0.25],
            ]}
            r={0.03}
            color={["#7a4a24", "#1a1a1a", "#7d8590", "#2a6fd6"][i]}
          />
        ))}
        <mesh position={[1.9, 0.005, 0.7]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 28]} />
          <meshStandardMaterial color="#3b5a78" roughness={0.05} metalness={0.3} transparent opacity={0.6} />
        </mesh>
      </Hot>
      {/* decoys: things that are fine */}
      <Hot id="decoy-ats" kind="decoy" marker={[2.1, 2.3, -2.7]}>
        <Panel pos={[2.1, 0, -RD / 2 + 0.3]} />
        <Sign pos={[2.1, 1.75, -RD / 2 + 0.59]} kind="danger" />
      </Hot>
      <Hot id="decoy-light" kind="decoy" marker={[0, 3.0, -3.1]}>
        <Box size={[1.2, 0.08, 0.15]} pos={[0, 2.95, -RD / 2 + 0.1]} color="#e5e7eb" emissive="#ffffff" emissiveIntensity={0.5} />
      </Hot>
    </group>
  );
}

/* ---------------------------------------------------------------- airflow */

function Airflow({ scenario }: { scenario: "A" | "B" }) {
  if (scenario === "A") {
    return (
      <>
        <FlowParticles color="#3fb0ff" path={[[RW / 2 + 0.3, 1.5, -0.5], [2.5, 1.4, -0.4], [0.6, 1.2, -0.3], [-1.6, 1.3, -0.3], [-3.0, 1.15, -0.3]]} count={70} speed={0.22} spread={0.9} size={0.05} />
        <FlowParticles color="#ff6a3d" path={[[-3.3, 1.15, -0.3], [-3.9, 1.15, -0.3], [-RW / 2 - 0.6, 1.2, -0.3], [-RW / 2 - 1.4, 1.5, -0.3]]} count={40} speed={0.35} spread={0.7} size={0.055} />
      </>
    );
  }
  return (
    <>
      <FlowParticles color="#3fb0ff" path={[[RW / 2 + 0.2, 1.6, -0.5], [3.0, 1.5, -0.4], [1.2, 1.3, -0.3]]} count={12} speed={0.18} spread={0.3} size={0.04} />
      <FlowParticles
        color="#ff4d2e"
        path={[[-3.3, 1.15, -0.3], [-4.1, 1.4, -0.4], [-4.0, 2.4, 0.4], [-2.0, 2.7, 1.2], [0.2, 2.2, 1.0], [0.7, 1.4, 0.4], [-0.6, 1.2, -0.3], [-2.4, 1.15, -0.3], [-3.2, 1.15, -0.3]]}
        count={90}
        speed={0.12}
        spread={0.6}
        size={0.055}
      />
    </>
  );
}

/* ---------------------------------------------------------------- root */

export type RoomSceneProps = {
  scenario: "A" | "B";
  found: string[];
  selected: string | null;
  hint: string | null;
  airflow: boolean;
  onPick: (kind: PickKind, id: string) => void;
  numberOf: (id: string) => number;
  resetKey: number;
};

export default function RoomScene(p: RoomSceneProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const cc = useRef<CameraControls>(null);
  const ctx = useMemo<RoomCtxValue>(
    () => ({ hovered, setHovered, onPick: p.onPick, found: new Set(p.found), selected: p.selected, hint: p.hint, numberOf: p.numberOf }),
    [hovered, p.onPick, p.found, p.selected, p.hint, p.numberOf],
  );

  useEffect(() => {
    void cc.current?.setLookAt(6.5, 7.5, 9.5, -0.2, 0.6, -0.4, true);
  }, [p.resetKey, p.scenario]);

  useEffect(() => () => void (document.body.style.cursor = ""), []);

  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [6.5, 7.5, 9.5], fov: 42, near: 0.1, far: 120 }}>
      <color attach="background" args={["#070d1a"]} />
      <fog attach="fog" args={["#070d1a", 22, 45]} />
      <ambientLight intensity={0.45} />
      <hemisphereLight args={["#cfe3ff", "#1a2233", 0.5]} />
      <directionalLight position={[6, 12, 8]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0004} />
      <pointLight position={[0, 2.9, 0]} intensity={8} distance={9} color={p.scenario === "A" ? "#e8f1ff" : "#ffd7a1"} />
      <RoomCtx.Provider value={ctx}>
        <RoomShell />
        <group position={G}>
          <PartStateCtx.Provider value="normal">
            <group
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                if (p.scenario === "B") p.onPick("decoy", "decoy-genset");
              }}
            >
              <GensetModel interactive={false} running={p.airflow} smoke={false} />
            </group>
          </PartStateCtx.Provider>
        </group>
        {p.scenario === "A" ? <GoodRoom running={p.airflow} /> : <BadRoom running={p.airflow} />}
        {p.airflow && <Airflow scenario={p.scenario} />}
      </RoomCtx.Provider>
      <CameraControls ref={cc} makeDefault minDistance={3} maxDistance={22} maxPolarAngle={Math.PI * 0.47} smoothTime={0.5} />
    </Canvas>
  );
}
