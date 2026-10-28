"use client";

import type { ReactNode } from "react";
import { useI18n, type L } from "@/lib/i18n";

export const COL = {
  L: "#d08a4a",
  N: "#3fb0ff",
  PE: "#2fd47a",
  fault: "#ff4d4d",
  flow: "#ffb547",
  dim: "#3a4558",
  text: "#9fb0c6",
  bg: "#0a1222",
};

/** Frame around an interactive SVG diagram with state buttons and a caption. */
export function DiagramFrame<T extends string>({
  states,
  value,
  onChange,
  caption,
  status,
  children,
  extra,
}: {
  states?: { value: T; label: L }[];
  value?: T;
  onChange?: (v: T) => void;
  caption?: L;
  status?: { tone: "ok" | "warn" | "danger" | "info"; text: L };
  children: ReactNode;
  extra?: ReactNode;
}) {
  const { t } = useI18n();
  const tone = status
    ? { ok: "border-ok/40 bg-ok/10 text-emerald-200", warn: "border-warn/40 bg-warn/10 text-yellow-100", danger: "border-danger/40 bg-danger/10 text-red-200", info: "border-volt-400/40 bg-volt-500/10 text-volt-300" }[status.tone]
    : "";
  return (
    <div className="flex flex-col gap-3">
      {states && value !== undefined && onChange && (
        <div className="flex flex-wrap gap-1.5">
          {states.map((s, i) => (
            <button
              key={s.value}
              onClick={() => onChange(s.value)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                value === s.value ? "border-volt-400/60 bg-volt-500/20 text-white" : "border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              <span className={`grid h-4 w-4 place-items-center rounded-full font-mono text-[9px] ${value === s.value ? "bg-volt-500 text-white" : "bg-white/10"}`}>{i + 1}</span>
              {t(s.label)}
            </button>
          ))}
        </div>
      )}
      <div className="panel-inset relative overflow-hidden p-2" dir="ltr">
        {children}
      </div>
      {extra}
      {status && <div className={`animate-fadeUp rounded-xl border px-3.5 py-2.5 text-sm font-medium ${tone}`} key={t(status.text)}>{t(status.text)}</div>}
      {caption && <p className="text-sm leading-relaxed text-slate-400">{t(caption)}</p>}
    </div>
  );
}

/** Text helper that picks the current language inside SVG. */
export function T({ v }: { v: L }) {
  const { t } = useI18n();
  return <>{t(v)}</>;
}

export function Person({ x, y, state }: { x: number; y: number; state: "safe" | "danger" | "neutral" }) {
  const c = state === "danger" ? COL.fault : state === "safe" ? COL.PE : "#9fb0c6";
  return (
    <g transform={`translate(${x} ${y})`}>
      {state === "danger" && <circle cx={0} cy={-30} r={34} fill={COL.fault} opacity={0.12} className="animate-pulse" />}
      <circle cx={0} cy={-62} r={8} fill="none" stroke={c} strokeWidth={2.5} />
      <path d="M0 -54 V-22 M0 -22 L-10 0 M0 -22 L10 0 M0 -46 L-18 -34 M0 -46 L20 -50" stroke={c} strokeWidth={2.5} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function EarthSymbol({ x, y, color = COL.PE }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2}>
      <line x1={x} y1={y} x2={x} y2={y + 10} />
      <line x1={x - 12} y1={y + 10} x2={x + 12} y2={y + 10} />
      <line x1={x - 8} y1={y + 15} x2={x + 8} y2={y + 15} />
      <line x1={x - 4} y1={y + 20} x2={x + 4} y2={y + 20} />
    </g>
  );
}

export function Source({ x, y, label = "G" }: { x: number; y: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={24} fill={COL.bg} stroke="#ff9a1f" strokeWidth={2} />
      <path d="M-12 0c4-8 8-8 12 0s8 8 12 0" stroke="#ff9a1f" strokeWidth={2} fill="none" />
      <text y={42} textAnchor="middle" fontSize={11} fill={COL.text} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

/** Animated current overlay along a path. */
export function Flow({ d, color = COL.flow, speed = "flow", width = 3, on = true }: { d: string; color?: string; speed?: "flow" | "flow-slow" | "flow-fast"; width?: number; on?: boolean }) {
  if (!on) return null;
  return <path d={d} stroke={color} strokeWidth={width} fill="none" className={speed} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />;
}
