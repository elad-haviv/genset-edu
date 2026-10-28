"use client";

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Box, Cyl, Mat, Pipe, PartStateCtx, Torus, useCanvasTexture, type PartState, type V3 } from "./primitives";
import { Smoke } from "./Effects";

/** Geometry metadata per selectable component: focus centre, exploded-view offset and camera distance. */
export const partMeta: Record<string, { center: V3; offset: V3; dist: number }> = {
  engine: { center: [-0.35, 0.85, 0], offset: [0, 0, 0], dist: 3.2 },
  alternator: { center: [1.05, 0.78, 0], offset: [0.9, 0, 0], dist: 2.6 },
  avr: { center: [1.1, 1.32, 0.26], offset: [0.9, 0.55, 0.6], dist: 1.1 },
  radiator: { center: [-1.6, 0.98, 0], offset: [-0.95, 0, 0], dist: 3 },
  turbo: { center: [0.2, 1.18, -0.5], offset: [0, 0.3, -0.75], dist: 1.4 },
  injection: { center: [-0.2, 1.05, 0.4], offset: [0, 0.35, 0.6], dist: 1.8 },
  fuelfilters: { center: [0.15, 0.82, 0.42], offset: [0.15, 0, 0.85], dist: 1.2 },
  oilfilters: { center: [-0.69, 0.6, 0.42], offset: [-0.1, -0.05, 0.9], dist: 1.2 },
  starter: { center: [0.3, 0.55, 0.4], offset: [0.3, -0.25, 0.75], dist: 1.2 },
  batteries: { center: [-0.6, 0.35, 0.52], offset: [-0.2, -0.3, 1.0], dist: 1.4 },
  charger: { center: [1.62, 1.3, 0], offset: [1.45, 0.2, 0.4], dist: 1.1 },
  ecu: { center: [-0.6, 0.82, -0.36], offset: [-0.2, 0, -0.85], dist: 1.2 },
  controller: { center: [1.02, 1.92, 0.1], offset: [1.0, 0.9, 0.55], dist: 1.4 },
  breaker: { center: [1.43, 1.3, 0.1], offset: [1.55, 0.45, 0.05], dist: 1.4 },
  estop: { center: [1.26, 1.92, 0.16], offset: [1.0, 0.9, 0.9], dist: 0.9 },
  exhaust: { center: [0, 2.0, -0.4], offset: [0, 0.85, -0.35], dist: 2.6 },
  mounts: { center: [0.2, 0.27, 0.4], offset: [0, -0.35, 0], dist: 2.4 },
  earthing: { center: [1.45, 0.12, 0.64], offset: [0.9, -0.55, 0.55], dist: 1.0 },
  baseframe: { center: [0, 0.11, 0], offset: [0, -0.75, 0], dist: 4 },
};

type ModelCtxValue = {
  selected: string | null;
  hovered: string | null;
  isDimmed: (id: string) => boolean;
  flagged?: string | null;
  explode: React.MutableRefObject<number>;
  rpm: React.MutableRefObject<number>;
  running: boolean;
  interactive: boolean;
  showLabels: boolean;
  labelFor?: (id: string) => string;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
};

const ModelCtx = createContext<ModelCtxValue | null>(null);
const useModel = () => {
  const c = useContext(ModelCtx);
  if (!c) throw new Error("ModelCtx missing");
  return c;
};

function Part({ id, children }: { id: string; children: ReactNode }) {
  const ctx = useModel();
  const ref = useRef<THREE.Group>(null);
  const meta = partMeta[id];

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const e = ctx.explode.current;
    g.position.set(meta.offset[0] * e, meta.offset[1] * e, meta.offset[2] * e);
  });

  let state: PartState = "normal";
  if (ctx.flagged === id) state = "flag";
  else if (ctx.selected === id) state = "selected";
  else if (ctx.hovered === id) state = "hover";
  else if (ctx.isDimmed(id)) state = "dim";

  const handlers = ctx.interactive
    ? {
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          ctx.onSelect?.(id);
        },
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          ctx.onHover?.(id);
          document.body.style.cursor = "pointer";
        },
        onPointerOut: () => {
          ctx.onHover?.(null);
          document.body.style.cursor = "";
        },
      }
    : {};

  const showTag = ctx.interactive && (ctx.showLabels || ctx.selected === id) && state !== "dim";

  return (
    <group ref={ref} {...handlers}>
      <PartStateCtx.Provider value={state}>{children}</PartStateCtx.Provider>
      {showTag && (
        <Html position={meta.center} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
          <div className="relative flex flex-col items-center">
            {ctx.selected === id && <span className="absolute top-1/2 h-6 w-6 -translate-y-1/2 animate-pulseRing rounded-full border-2 border-volt-300" />}
            <span
              className={`relative whitespace-nowrap rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide shadow-lg ${
                ctx.selected === id ? "border-volt-300 bg-volt-500 text-white" : "border-white/20 bg-navy-950/85 text-slate-200"
              }`}
            >
              {ctx.labelFor ? ctx.labelFor(id) : id}
            </span>
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------------------------------------------------------------- colours */
const C = {
  engine: "#a07c34",
  engineDark: "#6e5524",
  steel: "#a9b3be",
  darkSteel: "#4a525d",
  black: "#1b1e23",
  alt: "#2c4a66",
  altDark: "#1d3348",
  frame: "#2a3038",
  rubber: "#141414",
  hot: "#5b4a40",
  copper: "#c97a3a",
  canopy: "#3d4b5c",
};

/* ---------------------------------------------------------------- parts */

function Engine() {
  const cyl = [-0.975, -0.725, -0.475, -0.225, 0.025, 0.275];
  return (
    <Part id="engine">
      {/* block, sump, head, rocker cover */}
      <Box size={[1.5, 0.6, 0.62]} pos={[-0.35, 0.8, 0]} color={C.engine} metal={0.45} rough={0.5} />
      <Box size={[1.26, 0.16, 0.5]} pos={[-0.38, 0.42, 0]} color={C.engineDark} />
      <Box size={[1.42, 0.16, 0.54]} pos={[-0.35, 1.18, 0]} color={C.engine} metal={0.45} rough={0.45} />
      <RoundedBox args={[1.34, 0.12, 0.36]} radius={0.04} position={[-0.35, 1.32, 0.02]} castShadow>
        <Mat color={C.steel} metal={0.8} rough={0.3} />
      </RoundedBox>
      {cyl.map((x) => (
        <group key={x}>
          <Box size={[0.18, 0.42, 0.04]} pos={[x, 0.88, 0.325]} color={C.engine} metal={0.45} />
          <Box size={[0.18, 0.42, 0.04]} pos={[x, 0.88, -0.325]} color={C.engine} metal={0.45} />
          <Cyl r={0.016} h={0.03} pos={[x, 1.395, 0.12]} color={C.darkSteel} metal={0.9} />
          <Cyl r={0.016} h={0.03} pos={[x, 1.395, -0.08]} color={C.darkSteel} metal={0.9} />
          {/* exhaust manifold runners */}
          <Cyl r={0.04} h={0.16} axis="z" pos={[x, 1.12, -0.34]} color={C.hot} metal={0.6} rough={0.7} />
        </group>
      ))}
      <Cyl r={0.07} h={1.2} axis="x" pos={[-0.37, 1.12, -0.43]} color={C.hot} metal={0.6} rough={0.7} />
      {/* timing cover, pulleys and belt */}
      <Box size={[0.06, 0.72, 0.58]} pos={[-1.13, 0.84, 0]} color={C.engineDark} />
      <Cyl r={0.13} h={0.06} axis="x" pos={[-1.19, 0.55, 0]} color={C.darkSteel} metal={0.8} />
      <Cyl r={0.1} h={0.06} axis="x" pos={[-1.19, 1.0, 0]} color={C.darkSteel} metal={0.8} />
      <Box size={[0.025, 0.46, 0.022]} pos={[-1.2, 0.775, 0.116]} color={C.rubber} />
      <Box size={[0.025, 0.46, 0.022]} pos={[-1.2, 0.775, -0.116]} color={C.rubber} />
      {/* charge alternator */}
      <Cyl r={0.075} h={0.13} axis="x" pos={[-1.08, 1.02, 0.25]} color={C.steel} metal={0.7} />
      {/* air filter + intake hose to turbo */}
      <Cyl r={0.13} h={0.44} axis="x" pos={[-0.25, 1.58, -0.18]} color={C.black} rough={0.8} />
      <Cyl r={0.135} h={0.04} axis="x" pos={[-0.49, 1.58, -0.18]} color={C.darkSteel} />
      <Pipe points={[[0.0, 1.58, -0.18], [0.25, 1.55, -0.3], [0.33, 1.4, -0.48], [0.31, 1.25, -0.5]]} r={0.05} color={C.black} rough={0.9} />
      {/* bell housing */}
      <Cyl r={0.44} r2={0.36} h={0.2} axis="x" pos={[0.5, 0.78, 0]} color={C.engineDark} metal={0.5} />
      {/* engine mounting brackets */}
      {[-0.85, 0.2].map((x) =>
        [-0.37, 0.37].map((z) => <Box key={`${x}${z}`} size={[0.14, 0.18, 0.1]} pos={[x, 0.39, z]} color={C.engineDark} />),
      )}
      {/* dipstick */}
      <Cyl r={0.008} h={0.32} pos={[-0.9, 0.86, 0.36]} color="#ffd23f" />
      <Torus r={0.025} tube={0.008} pos={[-0.9, 1.04, 0.36]} color="#ffd23f" />
      {/* lifting eyes */}
      <Torus r={0.05} tube={0.014} pos={[-0.95, 1.43, 0]} color={C.darkSteel} metal={0.8} />
      <Torus r={0.05} tube={0.014} pos={[0.25, 1.43, 0]} color={C.darkSteel} metal={0.8} />
    </Part>
  );
}

function Alternator() {
  const fan = useRef<THREE.Group>(null);
  const { rpm } = useModel();
  useFrame((_, dt) => {
    if (fan.current) fan.current.rotation.x += dt * 22 * rpm.current;
  });
  const plate = useCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#d9dee5";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1b2a3a";
    ctx.font = "bold 26px monospace";
    ctx.fillText("ALTERNATOR", 14, 34);
    ctx.font = "18px monospace";
    ctx.fillText("3~  50 Hz  1500 rpm", 14, 64);
    ctx.fillText("IP23   Ins. H", 14, 90);
    ctx.fillText("ISO 8528-3", 14, 116);
  }, 256, 128);
  return (
    <Part id="alternator">
      <Cyl r={0.4} h={0.86} axis="x" pos={[1.06, 0.78, 0]} color={C.alt} metal={0.55} rough={0.4} />
      <Cyl r={0.43} h={0.06} axis="x" pos={[0.64, 0.78, 0]} color={C.altDark} metal={0.5} />
      {[0.78, 0.92, 1.06, 1.2, 1.34].map((x) => (
        <Torus key={x} r={0.4} tube={0.016} rot={[0, Math.PI / 2, 0]} pos={[x, 0.78, 0]} color={C.altDark} metal={0.6} />
      ))}
      <Cyl r={0.37} h={0.08} axis="x" pos={[1.53, 0.78, 0]} color={C.altDark} metal={0.5} />
      {/* rear vent + visible cooling fan */}
      <Cyl r={0.3} h={0.01} axis="x" pos={[1.575, 0.78, 0]} color="#0b0e12" rough={1} />
      <group ref={fan} position={[1.58, 0.78, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} rotation={[(i / 8) * Math.PI * 2, 0, 0]}>
            <Box size={[0.012, 0.22, 0.05]} pos={[0, 0.15, 0]} color={C.steel} metal={0.8} />
          </group>
        ))}
      </group>
      {[0.3, 0.22, 0.14].map((r) => (
        <Torus key={r} r={r} tube={0.008} rot={[0, Math.PI / 2, 0]} pos={[1.6, 0.78, 0]} color={C.darkSteel} />
      ))}
      {/* feet */}
      <Box size={[0.7, 0.1, 0.86]} pos={[1.1, 0.37, 0]} color={C.altDark} />
      {/* terminal box */}
      <Box size={[0.5, 0.32, 0.46]} pos={[1.0, 1.32, 0]} color={C.alt} metal={0.5} rough={0.45} />
      <Box size={[0.52, 0.03, 0.48]} pos={[1.0, 1.495, 0]} color={C.altDark} />
      <mesh position={[0.88, 1.32, 0.232]}>
        <planeGeometry args={[0.18, 0.09]} />
        <Mat color="#ffffff" map={plate} metal={0.2} rough={0.6} />
      </mesh>
    </Part>
  );
}

function AVR() {
  const { rpm } = useModel();
  const led = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((s) => {
    if (led.current) led.current.emissiveIntensity = rpm.current > 0.5 ? 1.5 + Math.sin(s.clock.elapsedTime * 6) * 0.8 : 0.2;
  });
  return (
    <Part id="avr">
      <Box size={[0.22, 0.17, 0.035]} pos={[1.12, 1.32, 0.25]} color="#17603a" metal={0.2} rough={0.6} />
      {[-0.07, -0.035, 0, 0.035, 0.07].map((x) => (
        <Box key={x} size={[0.012, 0.14, 0.04]} pos={[1.12 + x, 1.32, 0.287]} color={C.steel} metal={0.9} rough={0.3} />
      ))}
      <Box size={[0.05, 0.02, 0.02]} pos={[1.05, 1.24, 0.275]} color="#e9e9e9" />
      <mesh position={[1.2, 1.395, 0.27]}>
        <sphereGeometry args={[0.012, 10, 8]} />
        <meshStandardMaterial ref={led} color="#2fd47a" emissive="#2fd47a" emissiveIntensity={0.2} />
      </mesh>
    </Part>
  );
}

function Radiator() {
  const fan = useRef<THREE.Group>(null);
  const { rpm } = useModel();
  useFrame((_, dt) => {
    if (fan.current) fan.current.rotation.x -= dt * 18 * rpm.current;
  });
  const core = useCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = "#15191e";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#3a434e";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 4) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    ctx.strokeStyle = "#596573";
    ctx.lineWidth = 2;
    for (let y = 0; y < h; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  });
  return (
    <Part id="radiator">
      {/* core */}
      <mesh position={[-1.7, 0.98, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.02, 1.12]} />
        <Mat color="#ffffff" map={core} metal={0.5} rough={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Box size={[0.08, 1.12, 1.02]} pos={[-1.65, 0.98, 0]} color="#101317" metal={0.3} opacity={0.97} />
      <Box size={[0.2, 0.12, 1.12]} pos={[-1.65, 1.6, 0]} color={C.frame} metal={0.5} />
      <Box size={[0.2, 0.12, 1.12]} pos={[-1.65, 0.36, 0]} color={C.frame} metal={0.5} />
      <Box size={[0.16, 1.36, 0.08]} pos={[-1.65, 0.98, 0.56]} color={C.frame} metal={0.5} />
      <Box size={[0.16, 1.36, 0.08]} pos={[-1.65, 0.98, -0.56]} color={C.frame} metal={0.5} />
      <Cyl r={0.045} h={0.05} pos={[-1.65, 1.685, 0.32]} color="#c8cdd3" metal={0.8} />
      {/* shroud */}
      <Cyl r={0.5} h={0.16} axis="x" open pos={[-1.5, 0.98, 0]} color={C.frame} metal={0.4} />
      {/* fan */}
      <group ref={fan} position={[-1.44, 0.98, 0]}>
        <Cyl r={0.07} h={0.08} axis="x" color={C.darkSteel} metal={0.8} />
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={i} rotation={[(i / 6) * Math.PI * 2, 0, 0]}>
            <Box size={[0.015, 0.36, 0.13]} pos={[0, 0.25, 0]} rot={[0.35, 0, 0]} color="#30353c" metal={0.4} />
          </group>
        ))}
      </group>
      <Cyl r={0.025} h={0.26} axis="x" pos={[-1.32, 0.98, 0]} color={C.darkSteel} metal={0.8} />
      {/* fan guard */}
      {[0.47, 0.3, 0.14].map((r) => (
        <Torus key={r} r={r} tube={0.007} rot={[0, Math.PI / 2, 0]} pos={[-1.37, 0.98, 0]} color="#ffb547" metal={0.3} />
      ))}
      {/* hoses */}
      <Pipe points={[[-1.1, 1.18, 0.16], [-1.3, 1.42, 0.2], [-1.48, 1.56, 0.24], [-1.56, 1.58, 0.24]]} r={0.04} color={C.black} rough={0.9} />
      <Pipe points={[[-1.1, 0.52, -0.16], [-1.3, 0.42, -0.26], [-1.48, 0.38, -0.3], [-1.56, 0.38, -0.3]]} r={0.04} color={C.black} rough={0.9} />
    </Part>
  );
}

function Turbo() {
  const { running } = useModel();
  const hot = running ? "#ff4a12" : undefined;
  return (
    <Part id="turbo">
      <Pipe points={[[0.18, 1.12, -0.43], [0.15, 1.16, -0.47], [0.11, 1.18, -0.5]]} r={0.055} color={C.hot} metal={0.6} />
      <Torus r={0.09} tube={0.055} rot={[0, Math.PI / 2, 0]} pos={[0.1, 1.18, -0.5]} color={C.hot} metal={0.6} rough={0.6} emissive={hot} emissiveIntensity={0.35} />
      <Cyl r={0.09} h={0.08} axis="x" pos={[0.1, 1.18, -0.5]} color={C.hot} metal={0.6} rough={0.6} emissive={hot} emissiveIntensity={0.35} />
      <Cyl r={0.05} h={0.14} axis="x" pos={[0.2, 1.18, -0.5]} color={C.darkSteel} metal={0.8} />
      <Torus r={0.085} tube={0.05} rot={[0, Math.PI / 2, 0]} pos={[0.3, 1.18, -0.5]} color="#c3cad2" metal={0.85} rough={0.25} />
      <Cyl r={0.085} h={0.08} axis="x" pos={[0.3, 1.18, -0.5]} color="#c3cad2" metal={0.85} rough={0.25} />
    </Part>
  );
}

function Injection() {
  const cyl = [-0.975, -0.725, -0.475, -0.225, 0.025, 0.275];
  return (
    <Part id="injection">
      <Box size={[0.34, 0.2, 0.14]} pos={[-0.2, 0.9, 0.42]} color={C.darkSteel} metal={0.75} rough={0.35} />
      <Box size={[0.3, 0.05, 0.1]} pos={[-0.2, 1.02, 0.42]} color={C.steel} metal={0.8} />
      {cyl.map((x, i) => (
        <group key={x}>
          <Pipe
            points={[
              [-0.3 + i * 0.04, 1.04, 0.42],
              [-0.3 + i * 0.04, 1.14, 0.43],
              [x, 1.24, 0.34],
              [x, 1.3, 0.25],
            ]}
            r={0.008}
            color="#cfd6dd"
            metal={0.9}
            rough={0.25}
          />
          <Cyl r={0.02} h={0.09} pos={[x, 1.29, 0.24]} color="#d9dee3" metal={0.9} />
        </group>
      ))}
    </Part>
  );
}

function FuelFilters() {
  return (
    <Part id="fuelfilters">
      <Box size={[0.34, 0.05, 0.12]} pos={[0.15, 0.95, 0.42]} color={C.darkSteel} metal={0.7} />
      {[0.08, 0.22].map((x) => (
        <group key={x}>
          <Cyl r={0.055} h={0.2} pos={[x, 0.83, 0.43]} color="#eef0f2" rough={0.5} />
          <Cyl r={0.057} h={0.03} pos={[x, 0.86, 0.43]} color="#1e90ff" />
        </group>
      ))}
      <Cyl r={0.05} h={0.07} pos={[0.08, 0.695, 0.43]} color="#9cc7e8" opacity={0.6} metal={0.1} rough={0.1} />
      <Pipe points={[[0.0, 0.95, 0.42], [-0.06, 0.95, 0.44], [-0.1, 0.92, 0.45]]} r={0.012} color={C.black} />
    </Part>
  );
}

function OilFilters() {
  return (
    <Part id="oilfilters">
      <Box size={[0.34, 0.05, 0.1]} pos={[-0.69, 0.72, 0.4]} color={C.engineDark} />
      {[-0.78, -0.6].map((x) => (
        <group key={x}>
          <Cyl r={0.065} h={0.2} pos={[x, 0.6, 0.42]} color="#d8dde2" rough={0.45} />
          <Cyl r={0.067} h={0.025} pos={[x, 0.55, 0.42]} color="#ff9a1f" />
        </group>
      ))}
    </Part>
  );
}

function Starter() {
  return (
    <Part id="starter">
      <Cyl r={0.08} h={0.3} axis="x" pos={[0.3, 0.52, 0.4]} color="#202328" metal={0.5} />
      <Cyl r={0.083} h={0.04} axis="x" pos={[0.17, 0.52, 0.4]} color={C.steel} metal={0.8} />
      <Cyl r={0.045} h={0.18} axis="x" pos={[0.32, 0.62, 0.43]} color={C.steel} metal={0.8} />
      <Cyl r={0.012} h={0.04} pos={[0.38, 0.67, 0.43]} color={C.copper} metal={0.9} />
    </Part>
  );
}

function Batteries() {
  return (
    <Part id="batteries">
      <Box size={[0.64, 0.025, 0.22]} pos={[-0.6, 0.235, 0.52]} color={C.darkSteel} />
      {[-0.75, -0.45].map((x) => (
        <group key={x}>
          <Box size={[0.26, 0.2, 0.17]} pos={[x, 0.35, 0.52]} color="#16181c" rough={0.7} />
          <Box size={[0.265, 0.03, 0.175]} pos={[x, 0.46, 0.52]} color="#3c4148" />
          <Cyl r={0.017} h={0.035} pos={[x - 0.08, 0.49, 0.52]} color="#d93a3a" />
          <Cyl r={0.017} h={0.035} pos={[x + 0.08, 0.49, 0.52]} color="#30343a" />
        </group>
      ))}
      <Pipe points={[[-0.67, 0.5, 0.52], [-0.6, 0.53, 0.52], [-0.53, 0.5, 0.52]]} r={0.01} color="#30343a" />
      <Pipe points={[[-0.37, 0.5, 0.52], [-0.2, 0.52, 0.55], [0.1, 0.5, 0.5], [0.32, 0.66, 0.44]]} r={0.012} color="#d93a3a" />
    </Part>
  );
}

function Charger() {
  return (
    <Part id="charger">
      <Box size={[0.07, 0.26, 0.24]} pos={[1.615, 1.3, 0]} color="#4b5563" metal={0.4} />
      {[-0.06, -0.03, 0, 0.03].map((y) => (
        <Box key={y} size={[0.005, 0.012, 0.16]} pos={[1.652, 1.3 + y, 0]} color="#1b1e23" />
      ))}
      <mesh position={[1.652, 1.4, 0.07]}>
        <sphereGeometry args={[0.012, 10, 8]} />
        <meshStandardMaterial color="#2fd47a" emissive="#2fd47a" emissiveIntensity={1.4} />
      </mesh>
    </Part>
  );
}

function ECU() {
  return (
    <Part id="ecu">
      <Box size={[0.3, 0.22, 0.05]} pos={[-0.6, 0.82, -0.345]} color="#2b2f36" metal={0.5} />
      {[-0.08, -0.05, -0.02, 0.01, 0.04, 0.07].map((y) => (
        <Box key={y} size={[0.28, 0.012, 0.025]} pos={[-0.6, 0.82 + y, -0.38]} color={C.steel} metal={0.9} rough={0.3} />
      ))}
      <Box size={[0.08, 0.05, 0.04]} pos={[-0.42, 0.88, -0.36]} color="#111" />
      <Pipe points={[[-0.42, 0.88, -0.38], [-0.3, 0.95, -0.4], [-0.1, 0.96, -0.38]]} r={0.012} color={C.black} />
    </Part>
  );
}

function Controller({ running }: { running: boolean }) {
  const screen = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#06121f";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = running ? "#2fd47a" : "#ffb547";
      ctx.font = "bold 22px monospace";
      ctx.fillText(running ? "RUNNING  ON LOAD" : "AUTO  READY", 12, 30);
      ctx.fillStyle = "#7cc8ff";
      ctx.font = "18px monospace";
      const rows = running
        ? ["L-L  400 V", "f    50.0 Hz", "P    142 kW", "OIL  4.1 bar", "H2O  84 °C"]
        : ["L-L    0 V", "f     0.0 Hz", "BATT 27.2 V", "OIL  0.0 bar", "H2O  41 °C"];
      rows.forEach((r, i) => ctx.fillText(r, 12, 60 + i * 22));
    },
    256,
    180,
    [running],
  );
  return (
    <Part id="controller">
      <Box size={[0.04, 0.26, 0.04]} pos={[0.82, 1.62, 0.05]} color={C.darkSteel} />
      <Box size={[0.04, 0.26, 0.04]} pos={[1.22, 1.62, 0.05]} color={C.darkSteel} />
      <Box size={[0.62, 0.44, 0.16]} pos={[1.02, 1.92, 0.05]} color="#2e3846" metal={0.45} rough={0.4} />
      <Box size={[0.6, 0.42, 0.005]} pos={[1.02, 1.92, 0.132]} color="#38455a" />
      <mesh position={[0.96, 1.97, 0.136]}>
        <planeGeometry args={[0.28, 0.2]} />
        <meshStandardMaterial map={screen} emissive="#ffffff" emissiveMap={screen} emissiveIntensity={0.9} toneMapped={false} />
      </mesh>
      {[0.82, 0.88, 0.94, 1.0, 1.06].map((x, i) => (
        <Cyl key={x} r={0.017} h={0.02} axis="z" pos={[x, 1.79, 0.142]} color={i === 0 ? "#d93a3a" : i === 1 ? "#2fd47a" : "#cfd6dd"} />
      ))}
      <Cyl r={0.025} h={0.02} axis="z" pos={[1.15, 1.79, 0.142]} color="#ffb547" />
    </Part>
  );
}

function EStop() {
  return (
    <Part id="estop">
      <Box size={[0.12, 0.12, 0.01]} pos={[1.24, 1.95, 0.138]} color="#ffd000" />
      <Cyl r={0.02} h={0.03} axis="z" pos={[1.24, 1.95, 0.155]} color="#555" />
      <Cyl r={0.042} r2={0.036} h={0.035} axis="z" pos={[1.24, 1.95, 0.18]} color="#e01b1b" rough={0.35} />
    </Part>
  );
}

function Breaker({ running }: { running: boolean }) {
  const colors = ["#7a4a24", "#1a1a1a", "#7d8590", "#2a6fd6"];
  return (
    <Part id="breaker">
      <Box size={[0.3, 0.4, 0.42]} pos={[1.43, 1.3, 0]} color="#3b4654" metal={0.45} />
      <Box size={[0.17, 0.22, 0.04]} pos={[1.43, 1.3, 0.225]} color="#141618" />
      <Box size={[0.05, 0.07, 0.05]} pos={[1.43, running ? 1.34 : 1.27, 0.255]} color="#2a2a2a" />
      <Box size={[0.07, 0.02, 0.005]} pos={[1.43, 1.39, 0.246]} color={running ? "#d93a3a" : "#2fd47a"} emissive={running ? "#d93a3a" : "#2fd47a"} emissiveIntensity={0.6} />
      {colors.map((c, i) => (
        <Pipe
          key={c}
          points={[
            [1.36 + i * 0.045, 1.1, 0.1],
            [1.36 + i * 0.045, 0.9, 0.3],
            [1.38 + i * 0.045, 0.45, 0.45],
            [1.4 + i * 0.045, 0.25, 0.52],
          ]}
          r={0.018}
          color={c}
          rough={0.8}
          emissive={running && i < 3 ? "#ff9a1f" : undefined}
          emissiveIntensity={0.25}
        />
      ))}
    </Part>
  );
}

function Exhaust() {
  return (
    <Part id="exhaust">
      <Cyl r={0.075} h={0.2} pos={[0.1, 1.36, -0.5]} color={C.hot} metal={0.6} />
      {Array.from({ length: 9 }).map((_, i) => (
        <Torus key={i} r={0.082} tube={0.014} rot={[Math.PI / 2, 0, 0]} pos={[0.1, 1.48 + i * 0.026, -0.5]} color="#c3cad2" metal={0.9} rough={0.25} />
      ))}
      <Cyl r={0.072} h={0.24} open pos={[0.1, 1.58, -0.5]} color="#9aa3ad" metal={0.9} />
      <Pipe points={[[0.1, 1.7, -0.5], [0.12, 1.84, -0.46], [0.2, 1.9, -0.4]]} r={0.07} color={C.hot} metal={0.6} />
      <Cyl r={0.2} h={1.1} axis="x" pos={[0, 2.05, -0.38]} color="#3a3d42" metal={0.4} rough={0.75} />
      <Cyl r={0.205} h={0.04} axis="x" pos={[0.55, 2.05, -0.38]} color="#52565c" />
      <Cyl r={0.205} h={0.04} axis="x" pos={[-0.55, 2.05, -0.38]} color="#52565c" />
      {[-0.3, 0.3].map((x) => (
        <Torus key={x} r={0.205} tube={0.012} rot={[0, Math.PI / 2, 0]} pos={[x, 2.05, -0.38]} color={C.steel} metal={0.8} />
      ))}
      <Pipe points={[[-0.55, 2.05, -0.38], [-0.7, 2.06, -0.38], [-0.76, 2.2, -0.38], [-0.76, 2.42, -0.38]]} r={0.065} color={C.hot} metal={0.6} />
      <Cyl r={0.09} h={0.02} pos={[-0.76, 2.47, -0.38]} rot={[0, 0, 0.5]} color="#555b63" metal={0.6} />
      {/* support struts */}
      {[-0.35, 0.35].map((x) => (
        <group key={x}>
          <Box size={[0.04, 1.84, 0.04]} pos={[x, 1.08, -0.62]} color={C.frame} />
          <Box size={[0.04, 0.04, 0.26]} pos={[x, 1.87, -0.5]} color={C.frame} />
        </group>
      ))}
    </Part>
  );
}

function Mounts() {
  const pos: [number, number][] = [];
  [-0.85, 0.2, 1.1].forEach((x) => [-0.4, 0.4].forEach((z) => pos.push([x, z])));
  return (
    <Part id="mounts">
      {pos.map(([x, z]) => (
        <group key={`${x}${z}`}>
          <Box size={[0.14, 0.015, 0.14]} pos={[x, 0.228, z]} color={C.darkSteel} metal={0.7} />
          <Cyl r={0.055} r2={0.045} h={0.07} pos={[x, 0.27, z]} color={C.rubber} rough={0.95} metal={0} />
          <Box size={[0.12, 0.015, 0.12]} pos={[x, 0.31, z]} color={C.darkSteel} metal={0.7} />
        </group>
      ))}
    </Part>
  );
}

function Earthing() {
  const label = useCanvasTexture((ctx, w, h) => {
    const stripe = 18;
    for (let i = -h; i < w + h; i += stripe * 2) {
      ctx.fillStyle = "#1f9d4a";
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + stripe, 0);
      ctx.lineTo(i + stripe + h, h);
      ctx.lineTo(i + h, h);
      ctx.fill();
      ctx.fillStyle = "#f2d000";
      ctx.beginPath();
      ctx.moveTo(i + stripe, 0);
      ctx.lineTo(i + stripe * 2, 0);
      ctx.lineTo(i + stripe * 2 + h, h);
      ctx.lineTo(i + stripe + h, h);
      ctx.fill();
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(w / 2 - 38, h / 2 - 34, 76, 68);
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 6;
    const cx = w / 2;
    const cy = h / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 26);
    ctx.lineTo(cx, cy);
    ctx.moveTo(cx - 26, cy);
    ctx.lineTo(cx + 26, cy);
    ctx.moveTo(cx - 17, cy + 10);
    ctx.lineTo(cx + 17, cy + 10);
    ctx.moveTo(cx - 8, cy + 20);
    ctx.lineTo(cx + 8, cy + 20);
    ctx.stroke();
  }, 192, 128);
  return (
    <Part id="earthing">
      <mesh position={[1.3, 0.12, 0.613]}>
        <planeGeometry args={[0.15, 0.1]} />
        <Mat color="#ffffff" map={label} rough={0.6} metal={0.1} />
      </mesh>
      <Box size={[0.1, 0.06, 0.02]} pos={[1.47, 0.12, 0.62]} color={C.copper} metal={0.9} rough={0.3} />
      <Cyl r={0.018} h={0.08} axis="z" pos={[1.47, 0.12, 0.66]} color={C.copper} metal={0.9} rough={0.3} />
      <Pipe points={[[1.47, 0.12, 0.69], [1.55, 0.06, 0.82], [1.75, 0.02, 0.98], [2.0, 0.02, 1.05]]} r={0.016} color="#2fa84f" rough={0.7} />
    </Part>
  );
}

function BaseFrame() {
  return (
    <Part id="baseframe">
      <Box size={[3.3, 0.22, 0.12]} pos={[0, 0.11, 0.55]} color={C.frame} metal={0.55} rough={0.45} />
      <Box size={[3.3, 0.22, 0.12]} pos={[0, 0.11, -0.55]} color={C.frame} metal={0.55} rough={0.45} />
      <Box size={[0.12, 0.22, 1.1]} pos={[1.6, 0.11, 0]} color={C.frame} metal={0.55} />
      <Box size={[0.12, 0.22, 1.1]} pos={[-1.6, 0.11, 0]} color={C.frame} metal={0.55} />
      <Box size={[3.0, 0.2, 0.96]} pos={[0, 0.1, 0]} color="#22272e" metal={0.4} />
      {/* fill cap, level gauge, lifting holes */}
      <Cyl r={0.05} h={0.05} pos={[-1.2, 0.225, 0.3]} color="#ffd000" />
      <Box size={[0.12, 0.08, 0.01]} pos={[0.4, 0.12, 0.612]} color="#cfd6dd" />
      {[-1.3, 1.3].map((x) => (
        <Cyl key={x} r={0.04} h={0.13} axis="z" pos={[x, 0.11, 0.55]} color="#0d0f12" />
      ))}
    </Part>
  );
}

function Enclosure() {
  const mat = { color: C.canopy, metal: 0.4, rough: 0.5, opacity: 0.32 };
  const W = 3.74;
  const H = 2.36;
  const D = 1.56;
  const cz = -0.05;
  return (
    <group raycast={() => null}>
      <PartStateCtx.Provider value="normal">
        <group>
          <Box size={[W, 0.03, D]} pos={[0, H, cz]} {...mat} cast={false} />
          <Box size={[W, H - 0.22, 0.03]} pos={[0, 0.22 + (H - 0.22) / 2, cz + D / 2]} {...mat} cast={false} />
          <Box size={[W, H - 0.22, 0.03]} pos={[0, 0.22 + (H - 0.22) / 2, cz - D / 2]} {...mat} cast={false} />
          <Box size={[0.03, H - 0.22, D]} pos={[W / 2, 0.22 + (H - 0.22) / 2, cz]} {...mat} cast={false} />
          <Box size={[0.03, H - 0.22, D]} pos={[-W / 2, 0.22 + (H - 0.22) / 2, cz]} {...mat} cast={false} />
          {/* frame edges */}
          {[
            [W / 2, cz + D / 2],
            [-W / 2, cz + D / 2],
            [W / 2, cz - D / 2],
            [-W / 2, cz - D / 2],
          ].map(([x, z]) => (
            <Box key={`${x}${z}`} size={[0.05, H - 0.2, 0.05]} pos={[x, 0.22 + (H - 0.22) / 2, z]} color="#536173" metal={0.5} cast={false} />
          ))}
          {/* door seams on the service side */}
          {[-1.1, 0, 1.1].map((x) => (
            <Box key={x} size={[0.012, H - 0.4, 0.035]} pos={[x, 1.25, cz + D / 2 + 0.005]} color="#0f141a" cast={false} />
          ))}
          {/* outlet louvres at radiator end, inlet louvres at alternator end */}
          {Array.from({ length: 12 }).map((_, i) => (
            <Box key={`o${i}`} size={[0.05, 0.02, D - 0.2]} pos={[-W / 2 - 0.02, 0.45 + i * 0.12, cz]} rot={[0, 0, 0.5]} color="#536173" cast={false} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={`i${i}`} size={[0.7, 0.02, 0.05]} pos={[1.3, 0.6 + i * 0.12, cz + D / 2 + 0.02]} rot={[0.5, 0, 0]} color="#536173" cast={false} />
          ))}
        </group>
      </PartStateCtx.Provider>
    </group>
  );
}

/* ---------------------------------------------------------------- root */

export type GensetModelProps = {
  selected?: string | null;
  hovered?: string | null;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  explode?: number;
  running?: boolean;
  showEnclosure?: boolean;
  showLabels?: boolean;
  labelFor?: (id: string) => string;
  isDimmed?: (id: string) => boolean;
  flagged?: string | null;
  interactive?: boolean;
  smoke?: boolean;
};

export function GensetModel({
  selected = null,
  hovered = null,
  onSelect,
  onHover,
  explode = 0,
  running = false,
  showEnclosure = false,
  showLabels = false,
  labelFor,
  isDimmed,
  flagged,
  interactive = true,
  smoke = true,
}: GensetModelProps) {
  const explodeRef = useRef(explode);
  const rpm = useRef(running ? 1 : 0);
  const root = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    explodeRef.current = THREE.MathUtils.damp(explodeRef.current, explode, 4, dt);
    rpm.current = THREE.MathUtils.damp(rpm.current, running ? 1 : 0, running ? 1.2 : 0.8, dt);
    if (root.current) {
      const v = rpm.current * 0.0025;
      root.current.position.y = Math.sin(state.clock.elapsedTime * 90) * v;
      root.current.position.x = Math.cos(state.clock.elapsedTime * 73) * v * 0.5;
    }
  });

  useEffect(() => () => void (document.body.style.cursor = ""), []);

  const ctx = useMemo<ModelCtxValue>(
    () => ({
      selected,
      hovered,
      isDimmed: isDimmed ?? (() => false),
      flagged,
      explode: explodeRef,
      rpm,
      running,
      interactive,
      showLabels,
      labelFor,
      onSelect,
      onHover,
    }),
    [selected, hovered, isDimmed, flagged, running, interactive, showLabels, labelFor, onSelect, onHover],
  );

  return (
    <ModelCtx.Provider value={ctx}>
      <group ref={root}>
        <BaseFrame />
        <Mounts />
        <Engine />
        <Alternator />
        <AVR />
        <Radiator />
        <Turbo />
        <Injection />
        <FuelFilters />
        <OilFilters />
        <Starter />
        <Batteries />
        <Charger />
        <ECU />
        <Controller running={running} />
        <EStop />
        <Breaker running={running} />
        <Exhaust />
        <Earthing />
        {showEnclosure && <Enclosure />}
      </group>
      {smoke && <Smoke origin={[-0.76, 2.5, -0.38]} active={running} drift={[-0.3, 0, 0]} />}
    </ModelCtx.Provider>
  );
}
