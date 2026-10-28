"use client";

import type { ReactNode } from "react";

type Props = { picked: string | null; target: string; answered: boolean; onPick: (id: string) => void };

function Region({ id, p, children }: { id: string; p: Props; children: ReactNode }) {
  const isTarget = p.answered && id === p.target;
  const isWrong = p.answered && id === p.picked && id !== p.target;
  return (
    <g
      onClick={() => !p.answered && p.onPick(id)}
      className={`transition ${p.answered ? "" : "cursor-pointer hover:opacity-80 [&>*]:hover:stroke-[#ff9a1f]"}`}
      style={{ filter: isTarget ? "drop-shadow(0 0 8px #2fd47a)" : isWrong ? "drop-shadow(0 0 8px #ff4d4d)" : undefined }}
    >
      {children}
      {(isTarget || isWrong) && <title>{id}</title>}
    </g>
  );
}

const S = (p: Props, id: string, base: string) => (p.answered && id === p.target ? "#2fd47a" : p.answered && id === p.picked ? "#ff4d4d" : base);

/** Unlabelled side elevation of a genset for click-to-identify questions. */
export function GensetFigure(p: Props) {
  return (
    <svg viewBox="0 0 600 300" className="w-full rounded-xl bg-[#081120]">
      <Region id="baseframe" p={p}>
        <rect x={30} y={255} width={530} height={20} rx={3} fill="#2a3038" stroke={S(p, "baseframe", "#4a5361")} strokeWidth={2} />
      </Region>
      <Region id="mounts" p={p}>
        {[110, 230, 400].map((x) => (
          <rect key={x} x={x} y={244} width={22} height={11} rx={2} fill="#141414" stroke={S(p, "mounts", "#555")} strokeWidth={2} />
        ))}
      </Region>
      <Region id="radiator" p={p}>
        <rect x={38} y={70} width={34} height={180} rx={3} fill="#15191e" stroke={S(p, "radiator", "#596573")} strokeWidth={3} />
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={42} x2={68} y1={80 + i * 12} y2={80 + i * 12} stroke="#3a434e" />
        ))}
      </Region>
      <Region id="engine" p={p}>
        <rect x={88} y={120} width={215} height={124} rx={6} fill="#a07c34" stroke={S(p, "engine", "#6e5524")} strokeWidth={3} />
        <rect x={98} y={104} width={195} height={18} rx={5} fill="#a9b3be" stroke={S(p, "engine", "#6e5524")} strokeWidth={2} />
      </Region>
      <Region id="turbo" p={p}>
        <circle cx={270} cy={92} r={16} fill="#5b4a40" stroke={S(p, "turbo", "#7a6252")} strokeWidth={3} />
        <circle cx={292} cy={92} r={13} fill="#c3cad2" stroke={S(p, "turbo", "#9aa3ad")} strokeWidth={2} />
      </Region>
      <Region id="exhaust" p={p}>
        <rect x={110} y={34} width={200} height={34} rx={17} fill="#3a3d42" stroke={S(p, "exhaust", "#52565c")} strokeWidth={3} />
        <rect x={262} y={66} width={14} height={14} fill="#5b4a40" stroke={S(p, "exhaust", "#5b4a40")} />
        <rect x={96} y={10} width={12} height={40} fill="#5b4a40" stroke={S(p, "exhaust", "#5b4a40")} />
      </Region>
      <Region id="fuelfilters" p={p}>
        <rect x={214} y={176} width={14} height={36} rx={4} fill="#eef0f2" stroke={S(p, "fuelfilters", "#9aa3ad")} strokeWidth={2} />
        <rect x={232} y={176} width={14} height={36} rx={4} fill="#eef0f2" stroke={S(p, "fuelfilters", "#9aa3ad")} strokeWidth={2} />
      </Region>
      <Region id="batteries" p={p}>
        <rect x={98} y={212} width={46} height={32} rx={2} fill="#16181c" stroke={S(p, "batteries", "#3c4148")} strokeWidth={3} />
        <rect x={148} y={212} width={46} height={32} rx={2} fill="#16181c" stroke={S(p, "batteries", "#3c4148")} strokeWidth={3} />
        <circle cx={108} cy={209} r={4} fill="#d93a3a" />
        <circle cx={158} cy={209} r={4} fill="#d93a3a" />
      </Region>
      <Region id="alternator" p={p}>
        <rect x={318} y={116} width={150} height={128} rx={40} fill="#2c4a66" stroke={S(p, "alternator", "#1d3348")} strokeWidth={3} />
        {[350, 380, 410, 440].map((x) => (
          <line key={x} x1={x} x2={x} y1={120} y2={240} stroke="#1d3348" strokeWidth={3} />
        ))}
      </Region>
      <Region id="controller" p={p}>
        <rect x={375} y={34} width={92} height={62} rx={5} fill="#2e3846" stroke={S(p, "controller", "#536173")} strokeWidth={3} />
        <rect x={384} y={44} width={44} height={28} fill="#0a3a3a" />
        <rect x={392} y={96} width={6} height={20} fill="#4a525d" />
        <rect x={444} y={96} width={6} height={20} fill="#4a525d" />
      </Region>
      <Region id="estop" p={p}>
        <rect x={438} y={44} width={22} height={22} fill="#ffd000" stroke={S(p, "estop", "#ffd000")} strokeWidth={2} />
        <circle cx={449} cy={55} r={8} fill="#e01b1b" />
      </Region>
      <Region id="breaker" p={p}>
        <rect x={478} y={130} width={56} height={70} rx={4} fill="#3b4654" stroke={S(p, "breaker", "#536173")} strokeWidth={3} />
        <rect x={496} y={150} width={20} height={28} fill="#141618" />
      </Region>
      <Region id="earthing" p={p}>
        <rect x={536} y={258} width={22} height={14} fill="#1f9d4a" stroke={S(p, "earthing", "#f2d000")} strokeWidth={3} />
      </Region>
    </svg>
  );
}

/** Unlabelled top-view of an unsafe generator room for hazard-identification questions. */
export function RoomPlanFigure(p: Props) {
  return (
    <svg viewBox="0 0 600 340" className="w-full rounded-xl bg-[#081120]">
      <rect x={20} y={20} width={560} height={300} fill="#1b2129" stroke="#4a5361" strokeWidth={8} />
      {/* genset (not a hazard) */}
      <Region id="genset" p={p}>
        <rect x={150} y={130} width={230} height={80} rx={6} fill="#2a2414" stroke={S(p, "genset", "#a07c34")} strokeWidth={2} />
        <rect x={150} y={130} width={20} height={80} fill="#15191e" />
        <rect x={300} y={140} width={70} height={60} rx={20} fill="#2c4a66" />
      </Region>
      <Region id="recirc" p={p}>
        <path d="M140 140 C90 120 80 90 120 80 S200 100 190 125" stroke={S(p, "recirc", "#ff5a33")} strokeWidth={4} fill="none" strokeDasharray="8 5" className="flow-slow" />
        <path d="M140 200 C90 220 80 250 120 260 S200 240 190 215" stroke={S(p, "recirc", "#ff5a33")} strokeWidth={4} fill="none" strokeDasharray="8 5" className="flow-slow" />
        <rect x={30} y={110} width={110} height={120} fill="rgba(255,90,51,.07)" />
      </Region>
      <Region id="exhaust" p={p}>
        <path d="M200 135 V100 H330" stroke={S(p, "exhaust", "#5b4a40")} strokeWidth={10} fill="none" />
        <circle cx={340} cy={100} r={14} fill="#7c8288" opacity={0.5} />
        <circle cx={360} cy={92} r={18} fill="#7c8288" opacity={0.35} />
      </Region>
      <Region id="fuel" p={p}>
        <circle cx={260} cy={60} r={18} fill="#2a5fa8" stroke={S(p, "fuel", "#1d4785")} strokeWidth={3} />
        <circle cx={300} cy={60} r={18} fill="#2a5fa8" stroke={S(p, "fuel", "#1d4785")} strokeWidth={3} />
        <ellipse cx={285} cy={88} rx={40} ry={8} fill="#111" opacity={0.8} />
      </Region>
      <Region id="panel" p={p}>
        <rect x={440} y={28} width={60} height={34} fill="#8a94a3" stroke={S(p, "panel", "#5b6676")} strokeWidth={3} />
        <path d="M440 62 L410 92" stroke={S(p, "panel", "#8a94a3")} strokeWidth={5} />
        <rect x={448} y={52} width={44} height={6} fill="#c97a3a" />
      </Region>
      <Region id="ats" p={p}>
        <rect x={510} y={28} width={60} height={34} fill="#8a94a3" stroke={S(p, "ats", "#5b6676")} strokeWidth={3} />
        <path d="M528 36 l6 -6 l6 6z" fill="#ffd000" />
      </Region>
      <Region id="cables" p={p}>
        <path d="M470 62 C480 140 420 260 330 270 C280 275 260 240 290 212" stroke={S(p, "cables", "#1f2328")} strokeWidth={6} fill="none" />
      </Region>
      <Region id="exit" p={p}>
        <rect x={572} y={240} width={12} height={60} fill="#7b8797" />
        <rect x={520} y={238} width={42} height={30} fill="#b08a5a" stroke={S(p, "exit", "#8a6a40")} strokeWidth={3} />
        <rect x={525} y={272} width={42} height={30} fill="#b08a5a" stroke={S(p, "exit", "#8a6a40")} strokeWidth={3} />
      </Region>
      <Region id="inlet" p={p}>
        <rect x={572} y={150} width={10} height={30} fill="#9aa5b4" stroke={S(p, "inlet", "#9aa5b4")} strokeWidth={2} />
      </Region>
    </svg>
  );
}
