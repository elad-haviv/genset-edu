"use client";

import { useEffect, useState } from "react";
import { COL, DiagramFrame, EarthSymbol, Flow, Person, Source, T } from "./common";
import type { L } from "@/lib/i18n";

export type TouchState = "nofault-pe" | "fault-nope" | "fault-pe" | "trip";

const states: { value: TouchState; label: L }[] = [
  { value: "nofault-pe", label: { he: "פעולה תקינה", en: "Normal operation" } },
  { value: "fault-nope", label: { he: "תקלה — ללא הארקה", en: "Fault — no PE" } },
  { value: "fault-pe", label: { he: "תקלה — עם הארקה", en: "Fault — with PE" } },
  { value: "trip", label: { he: "ההגנה מנתקת", en: "Protection trips" } },
];

const status: Record<TouchState, { tone: "ok" | "warn" | "danger" | "info"; text: L }> = {
  "nofault-pe": { tone: "ok", text: { he: "זרם העבודה זורם ב-L וחוזר ב-N. המעטפת המתכתית בפוטנציאל האדמה — אין מתח מגע.", en: "Load current flows out on L and back on N. The metal enclosure is at earth potential — no touch voltage." } },
  "fault-nope": { tone: "danger", text: { he: "תקלת בידוד ומוליך ההארקה חסר: המעטפת מתחשמלת והזרם עובר דרך גוף האדם לאדמה. הזרם קטן מכדי להפעיל את המפסק — אך מסוכן לחיים!", en: "Insulation fault with no protective conductor: the enclosure becomes live and current flows through the person to earth. Too small to trip the breaker — but potentially lethal!" } },
  "fault-pe": { tone: "warn", text: { he: "עם מוליך PE: זרם תקלה גבוה חוזר דרך ה-PE למקור. מתח המגע מוגבל ע״י חלוקת המתח בלולאת התקלה — וזרם התקלה גבוה מספיק כדי להפעיל את ההגנה.", en: "With PE: a high fault current returns via PE to the source. Touch voltage is limited by the voltage division in the fault loop — and the fault current is high enough to operate protection." } },
  trip: { tone: "ok", text: { he: "ההגנה ניתקה את ההזנה בזמן הנדרש. המעטפת חוזרת לפוטנציאל אפס. הארקה + ניתוק אוטומטי = הגנה בתקלה.", en: "Protection disconnected the supply within the required time. The enclosure returns to zero potential. Earthing + automatic disconnection = fault protection." } },
};

export function TouchDiagram({ initial = "nofault-pe" }: { initial?: string }) {
  const [s, setS] = useState<TouchState>((initial as TouchState) ?? "nofault-pe");
  useEffect(() => setS((initial as TouchState) ?? "nofault-pe"), [initial]);

  const pe = s !== "fault-nope";
  const fault = s === "fault-nope" || s === "fault-pe";
  const live = s !== "trip";
  const touch = s === "fault-nope" ? "danger" : s === "fault-pe" ? "neutral" : "safe";

  return (
    <DiagramFrame states={states} value={s} onChange={setS} status={status[s]}>
      <svg viewBox="0 0 640 310" className="w-full">
        {/* ground */}
        <line x1={20} y1={292} x2={620} y2={292} stroke="#5b4a3a" strokeWidth={2} />
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={i} x1={24 + i * 20} y1={292} x2={14 + i * 20} y2={302} stroke="#5b4a3a" strokeWidth={1} />
        ))}
        <Source x={70} y={140} />
        {/* conductors */}
        <path d="M70 116 V60 H170 M210 60 H460 V100" stroke={live ? COL.L : COL.dim} strokeWidth={3} fill="none" />
        <path d="M460 180 V262 H70 V164" stroke={COL.N} strokeWidth={3} fill="none" />
        <line x1={70} y1={262} x2={70} y2={280} stroke={COL.PE} strokeWidth={2} />
        <EarthSymbol x={70} y={280} />
        {/* breaker */}
        <circle cx={170} cy={60} r={4} fill={COL.L} />
        <circle cx={210} cy={60} r={4} fill={live ? COL.L : COL.dim} />
        <line x1={170} y1={60} x2={208} y2={s === "trip" ? 34 : 56} stroke="#e2e8f0" strokeWidth={3} strokeLinecap="round" style={{ transition: "all .4s" }} />
        <text x={190} y={30} textAnchor="middle" fontSize={11} fill={COL.text}>
          <T v={{ he: "מפסק", en: "Breaker" }} />
        </text>
        {/* enclosure + load */}
        <rect x={400} y={80} width={120} height={170} rx={6} fill="#141d2c" stroke={fault && live ? COL.fault : "#7d8da3"} strokeWidth={fault && live ? 3 : 2} />
        <path d="M460 100 l12 8 l-24 10 l24 10 l-24 10 l24 10 l-24 10 l12 8 V180" stroke={live ? "#cbd5e1" : COL.dim} strokeWidth={2} fill="none" />
        <text x={430} y={240} fontSize={11} fill={COL.text}>
          <T v={{ he: "מעטפת מתכת", en: "Metal case" }} />
        </text>
        {/* PE */}
        {pe ? (
          <path d="M400 210 H330 V276 H70" stroke={COL.PE} strokeWidth={3} strokeDasharray="10 5" fill="none" />
        ) : (
          <g>
            <path d="M400 210 H360 M320 210 H330 V276 H70" stroke={COL.dim} strokeWidth={3} strokeDasharray="10 5" fill="none" />
            <text x={340} y={215} fontSize={20} fill={COL.fault} textAnchor="middle" fontWeight="bold">
              ✕
            </text>
          </g>
        )}
        {/* fault */}
        {fault && (
          <path d="M460 125 l15 -6 l8 10 l15 -6 l8 8 l14 -4" stroke={COL.fault} strokeWidth={3} fill="none" className="animate-blink" />
        )}
        {/* current flows */}
        <Flow on={s === "nofault-pe"} d="M70 116 V60 H460 V180 V262 H70 V164" speed="flow-slow" />
        <Flow on={s === "fault-pe"} d="M70 116 V60 H460 V125 L520 125 L520 210 L400 210 H330 V276 H70" color={COL.fault} speed="flow-fast" width={4} />
        <Flow on={s === "fault-nope"} d="M70 116 V60 H460 V125 L520 125 V238 L540 244 L545 292 H70" color={COL.fault} speed="flow" />
        <Person x={545} y={290} state={touch} />
        <g transform="translate(545 290) scale(-1 1)">
          <path d="M0 -46 L22 -50" stroke={touch === "danger" ? COL.fault : touch === "safe" ? COL.PE : "#9fb0c6"} strokeWidth={2.5} />
        </g>
        {/* labels */}
        <text x={300} y={52} fontSize={12} fill={COL.L} fontWeight="bold">L</text>
        <text x={300} y={256} fontSize={12} fill={COL.N} fontWeight="bold">N</text>
        {pe && <text x={250} y={270} fontSize={12} fill={COL.PE} fontWeight="bold">PE</text>}
        {/* meter */}
        <g transform="translate(560 40)">
          <rect x={-60} y={-22} width={120} height={56} rx={8} fill="#06101e" stroke="#24477a" />
          <text x={0} y={-6} textAnchor="middle" fontSize={10} fill={COL.text}>
            <T v={{ he: "מתח מגע", en: "Touch voltage" }} />
          </text>
          <text x={0} y={16} textAnchor="middle" fontSize={14} fontWeight="bold" fontFamily="monospace" fill={s === "fault-nope" ? COL.fault : s === "fault-pe" ? "#ffc531" : COL.PE}>
            {s === "fault-nope" ? "≈ U₀ !" : s === "fault-pe" ? "LIMITED" : "0 V"}
          </text>
        </g>
      </svg>
    </DiagramFrame>
  );
}
