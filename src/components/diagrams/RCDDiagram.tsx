"use client";

import { useEffect, useState } from "react";
import { COL, DiagramFrame, EarthSymbol, Flow, Person, Source, T } from "./common";
import { useI18n } from "@/lib/i18n";

type Phase = "normal" | "leak" | "tripped";

export function RCDDiagram() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("normal");
  const [cause, setCause] = useState<"person" | "test">("person");

  useEffect(() => {
    if (phase !== "leak") return;
    const id = setTimeout(() => setPhase("tripped"), 1600);
    return () => clearTimeout(id);
  }, [phase]);

  const live = phase !== "tripped";
  const leak = phase === "leak";

  const status =
    phase === "normal"
      ? { tone: "ok" as const, text: { he: "I(L) = I(N): השטפים המגנטיים בטבעת מתקזזים — אין מתח בליפוף החישה.", en: "I(L) = I(N): magnetic fluxes in the toroid cancel — no voltage in the sense winding." } }
      : phase === "leak"
        ? { tone: "danger" as const, text: cause === "person" ? { he: "זרם דולף דרך גוף האדם לאדמה ואינו חוזר ב-N. ΔI ≠ 0 → שטף שיורי → ליפוף החישה מפעיל את מנגנון הניתוק…", en: "Current leaks through the person to earth and does not return on N. ΔI ≠ 0 → residual flux → the sense winding drives the trip mechanism…" } : { he: "לחצן הבדיקה יוצר זרם הפרש מבוקר דרך נגד פנימי — בודק את המנגנון בלבד…", en: "The test button creates a controlled difference current through an internal resistor — testing the mechanism only…" } }
        : { tone: "ok" as const, text: { he: "ה-RCD ניתק את L ואת N. שימו לב: RCD מגביל את משך החשיפה, אבל אינו מונע את ההלם הראשוני ואינו תחליף לבידוד והארקה.", en: "The RCD disconnected L and N. Note: an RCD limits exposure duration, but does not prevent the initial shock and is no substitute for insulation and earthing." } };

  return (
    <DiagramFrame
      status={status}
      extra={
        <div className="flex flex-wrap gap-2">
          <button
            className="btn border border-danger/40 text-xs text-red-200"
            disabled={phase !== "normal"}
            onClick={() => {
              setCause("person");
              setPhase("leak");
            }}
          >
            {t({ he: "אדם נוגע במוליך חי", en: "Person touches live conductor" })}
          </button>
          <button
            className="btn border border-white/10 text-xs text-slate-300"
            disabled={phase !== "normal"}
            onClick={() => {
              setCause("test");
              setPhase("leak");
            }}
          >
            {t({ he: "לחצן בדיקה (T)", en: "Test button (T)" })}
          </button>
          <button className="btn border border-white/10 text-xs text-slate-300" disabled={phase !== "tripped"} onClick={() => setPhase("normal")}>
            {t({ he: "איפוס", en: "Reset" })}
          </button>
        </div>
      }
    >
      <svg viewBox="0 0 640 300" className="w-full">
        <line x1={20} y1={282} x2={620} y2={282} stroke="#5b4a3a" strokeWidth={2} />
        <Source x={60} y={120} />
        <path d="M60 96 V70 H250" stroke={COL.L} strokeWidth={3} fill="none" />
        <path d="M60 144 V170 H250" stroke={COL.N} strokeWidth={3} fill="none" />
        <path d="M60 170 V250" stroke={COL.PE} strokeWidth={2} />
        <EarthSymbol x={60} y={250} />
        {/* toroid */}
        <ellipse cx={200} cy={120} rx={26} ry={74} fill="none" stroke={leak ? "#ffc531" : "#7d8da3"} strokeWidth={8} opacity={0.85} />
        {leak && <ellipse cx={200} cy={120} rx={36} ry={84} fill="none" stroke="#ffc531" strokeWidth={2} className="animate-pulse" />}
        <path d="M226 120 H262 V200 H300" stroke={leak ? "#ffc531" : "#7d8da3"} strokeWidth={1.5} fill="none" />
        <rect x={300} y={186} width={60} height={28} rx={5} fill={COL.bg} stroke={leak ? "#ffc531" : "#7d8da3"} />
        <text x={330} y={204} textAnchor="middle" fontSize={10} fill={COL.text}>
          <T v={{ he: "מנגנון", en: "Trip coil" }} />
        </text>
        <path d="M330 186 V150" stroke="#7d8da3" strokeDasharray="3 3" />
        {/* contacts */}
        {[70, 170].map((y) => (
          <g key={y}>
            <circle cx={260} cy={y} r={4} fill={y === 70 ? COL.L : COL.N} />
            <circle cx={300} cy={y} r={4} fill={live ? (y === 70 ? COL.L : COL.N) : COL.dim} />
            <line x1={260} y1={y} x2={298} y2={live ? y - 3 : y - 26} stroke="#e2e8f0" strokeWidth={3} strokeLinecap="round" style={{ transition: "all .3s" }} />
          </g>
        ))}
        <rect x={180} y={30} width={140} height={190} rx={10} fill="none" stroke="#24477a" strokeDasharray="5 4" />
        <text x={250} y={24} textAnchor="middle" fontSize={11} fill="#7cc8ff" fontWeight="bold">RCD</text>
        {/* downstream */}
        <path d="M300 70 H520 V110" stroke={live ? COL.L : COL.dim} strokeWidth={3} fill="none" />
        <path d="M300 170 H520 V150" stroke={live ? COL.N : COL.dim} strokeWidth={3} fill="none" />
        <circle cx={520} cy={130} r={20} fill={live ? "rgba(255,197,49,.18)" : COL.bg} stroke={live ? "#ffc531" : COL.dim} strokeWidth={2} />
        <path d="M506 116 L534 144 M534 116 L506 144" stroke={live ? "#ffc531" : COL.dim} strokeWidth={2} />
        {/* currents */}
        <Flow on={live} d="M60 96 V70 H520 V110" speed="flow-slow" />
        <Flow on={live && !(leak && cause === "person")} d="M520 150 V170 H60 V144" speed="flow-slow" color="#7cc8ff" />
        <Flow on={live && leak && cause === "person"} d="M520 150 V170 H60 V144" speed="flow-slow" color="#7cc8ff" width={1.5} />
        {cause === "person" && (
          <>
            <Person x={420} y={280} state={leak ? "danger" : phase === "tripped" ? "safe" : "neutral"} />
            {phase !== "normal" && <path d="M440 230 L420 70" stroke="#9fb0c6" strokeWidth={2.5} />}
            <Flow on={leak} d="M420 72 L438 228 L420 252 V282 H60 V250" color={COL.fault} speed="flow" />
          </>
        )}
        {/* readouts */}
        <g fontFamily="monospace" fontSize={11}>
          <text x={350} y={62} fill={COL.L}>I(L) = {live ? (leak ? "I + ΔI" : "I") : "0"}</text>
          <text x={350} y={190} fill={COL.N}>I(N) = {live ? "I" : "0"}</text>
          <text x={560} y={40} textAnchor="middle" fill={leak ? "#ffc531" : COL.text} fontWeight="bold">
            ΔI = {leak ? "≠ 0" : "0"}
          </text>
        </g>
      </svg>
    </DiagramFrame>
  );
}
