"use client";

import type { SimState } from "@/content/simulator";
import { COL, Flow, T } from "./common";

const genLive = (s: SimState) => ["warmup", "ready", "onload", "cooldown"].includes(s.gen);
const genRunning = (s: SimState) => s.gen !== "off" && s.gen !== "failed" && s.gen !== "shutdown";

export function busPowered(s: SimState) {
  return (s.ats === "U" && s.utility) || (s.ats === "G" && genLive(s) && s.genCb === "closed");
}

/** Animated single-line diagram: Utility / Generator → ATS → MDB → loads. */
export function SLDiagram({ s }: { s: SimState }) {
  const gl = genLive(s);
  const bus = busPowered(s);
  const fromU = bus && s.ats === "U";
  const fromG = bus && s.ats === "G";
  const genSideLive = gl && s.genCb === "closed";
  const live = "#ffb547";
  const dead = COL.dim;
  const blade = s.ats === "U" ? "M430 155 L352 112" : s.ats === "G" ? "M430 155 L352 198" : "M430 155 L362 150";

  return (
    <svg viewBox="0 0 700 330" className="w-full">
      <defs>
        <filter id="sglow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* utility source */}
      <g transform="translate(90 50)">
        <circle cx={-9} r={17} fill={COL.bg} stroke={s.utility ? "#7cc8ff" : dead} strokeWidth={2} />
        <circle cx={9} r={17} fill={COL.bg} stroke={s.utility ? "#7cc8ff" : dead} strokeWidth={2} />
        <text x={-34} y={5} textAnchor="end" fontSize={11} fill={s.utility ? "#7cc8ff" : COL.fault} fontWeight="bold">
          <T v={{ he: "רשת", en: "UTILITY" }} />
        </text>
        {!s.utility && (
          <text x={-34} y={20} textAnchor="end" fontSize={10} fill={COL.fault} className="animate-blink">
            <T v={{ he: "אין מתח", en: "NO VOLTAGE" }} />
          </text>
        )}
      </g>
      <path d="M90 67 V110 H345" stroke={s.utility ? "#7cc8ff" : dead} strokeWidth={3} fill="none" />
      {/* generator */}
      <g transform="translate(90 245)">
        <circle r={26} fill={COL.bg} stroke={gl ? "#ff9a1f" : s.gen === "failed" ? COL.fault : dead} strokeWidth={2.5} filter={gl ? "url(#sglow)" : undefined} />
        <g className={genRunning(s) ? "origin-center animate-spin" : ""} style={{ transformBox: "fill-box", animationDuration: s.gen === "cranking" ? "1.2s" : "0.5s" }}>
          <path d="M-13 0c4-9 9-9 13 0s9 9 13 0" stroke={gl ? "#ff9a1f" : "#7d8da3"} strokeWidth={2.5} fill="none" />
        </g>
        <text y={46} textAnchor="middle" fontSize={11} fill={gl ? "#ffb547" : COL.text} fontWeight="bold">
          GEN
        </text>
        <text y={60} textAnchor="middle" fontSize={9} fill={COL.text} fontFamily="monospace">
          {s.gen.toUpperCase()}
        </text>
      </g>
      <path d="M116 245 H170" stroke={gl ? live : dead} strokeWidth={3} />
      {/* generator breaker */}
      <g>
        <rect x={170} y={232} width={40} height={26} rx={4} fill={COL.bg} stroke={s.genCb === "tripped" ? COL.fault : "#7d8da3"} strokeWidth={s.genCb === "tripped" ? 2.5 : 1.5} />
        <line x1={178} y1={245} x2={202} y2={s.genCb === "closed" ? 245 : 236} stroke="#e2e8f0" strokeWidth={3} strokeLinecap="round" style={{ transition: "all .3s" }} />
        <text x={190} y={275} textAnchor="middle" fontSize={9} fill={s.genCb === "tripped" ? COL.fault : COL.text}>
          {s.genCb === "tripped" ? "TRIPPED" : "GEN CB"}
        </text>
      </g>
      <path d="M210 245 H300 V198 H345" stroke={genSideLive ? live : dead} strokeWidth={3} fill="none" />
      {/* ATS */}
      <rect x={330} y={80} width={110} height={150} rx={10} fill="#0c1628" stroke="#3fb0ff" strokeWidth={1.5} />
      <text x={385} y={98} textAnchor="middle" fontSize={11} fill="#7cc8ff" fontWeight="bold">
        ATS
      </text>
      <circle cx={352} cy={110} r={4} fill={s.utility ? "#7cc8ff" : dead} />
      <circle cx={352} cy={200} r={4} fill={genSideLive ? live : dead} />
      <circle cx={430} cy={155} r={4} fill={bus ? live : dead} />
      <path d={blade} stroke="#e2e8f0" strokeWidth={3.5} strokeLinecap="round" style={{ transition: "d .5s" }} />
      <text x={360} y={130} fontSize={8} fill={COL.text}>U</text>
      <text x={360} y={190} fontSize={8} fill={COL.text}>G</text>
      <text x={385} y={222} textAnchor="middle" fontSize={8} fill={COL.text}>
        {s.ats === "O" ? "NEUTRAL" : s.ats === "U" ? "→ UTILITY" : "→ GEN"}
      </text>
      {/* busbar */}
      <path d="M430 155 H480" stroke={bus ? live : dead} strokeWidth={3} />
      <rect x={478} y={70} width={12} height={180} rx={3} fill={bus ? live : "#24324a"} style={{ transition: "fill .3s", filter: bus ? "drop-shadow(0 0 6px #ffb547)" : undefined }} />
      <text x={484} y={268} textAnchor="middle" fontSize={10} fill={COL.text} fontWeight="bold">
        MDB
      </text>
      {/* loads */}
      {[
        { y: 95, c: "#ff4d4d", n: { he: "קריטי", en: "Critical" } },
        { y: 160, c: "#ffc531", n: { he: "חיוני", en: "Essential" } },
        { y: 225, c: "#2fd47a", n: { he: "כללי", en: "General" } },
      ].map((ld) => (
        <g key={ld.y}>
          <path d={`M490 ${ld.y} H570`} stroke={bus ? live : dead} strokeWidth={2.5} />
          <rect x={570} y={ld.y - 20} width={110} height={40} rx={8} fill={bus ? "rgba(255,181,71,.12)" : COL.bg} stroke={ld.c} strokeWidth={1.5} />
          <circle cx={590} cy={ld.y} r={7} fill={bus ? "#ffd27a" : "#1a2433"} style={{ filter: bus ? "drop-shadow(0 0 6px #ffd27a)" : undefined }} />
          <text x={605} y={ld.y + 4} fontSize={11} fill={bus ? "#fff" : COL.text}>
            <T v={ld.n} />
          </text>
          {(fromU || fromG) && <Flow d={`M490 ${ld.y} H570`} speed="flow-slow" color={fromU ? "#7cc8ff" : "#ffb547"} width={2.5} />}
        </g>
      ))}
      {/* source flows */}
      {fromU && <Flow d="M90 67 V110 H352 L430 155 H484" color="#7cc8ff" speed="flow" />}
      {fromG && <Flow d="M116 245 H300 V198 H352 L430 155 H484" color="#ffb547" speed="flow" />}
      {/* load gauge */}
      <g transform="translate(190 60)">
        <text x={0} y={0} textAnchor="middle" fontSize={9} fill={COL.text}>
          <T v={{ he: "עומס גנרטור", en: "Gen load" }} />
        </text>
        <rect x={-50} y={8} width={100} height={10} rx={5} fill="#16243f" />
        <rect x={-50} y={8} width={Math.min(100, s.load * 80)} height={10} rx={5} fill={s.load > 1 ? COL.fault : s.load > 0.8 ? "#ffc531" : COL.PE} style={{ transition: "width .6s" }} />
        <line x1={30} y1={4} x2={30} y2={22} stroke="#e2e8f0" strokeDasharray="2 2" />
        <text x={0} y={34} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={s.load > 1 ? COL.fault : "#e2e8f0"}>
          {Math.round(s.load * 100)}%
        </text>
      </g>
    </svg>
  );
}
