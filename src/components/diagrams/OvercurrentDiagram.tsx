"use client";

import { useEffect, useMemo, useState } from "react";
import { COL, DiagramFrame, T } from "./common";
import { useI18n } from "@/lib/i18n";

/** Conceptual inverse-time + instantaneous characteristic. Values are illustrative only. */
const MAG = 8;
const X0 = 70;
const X1 = 540;
const Y0 = 20;
const Y1 = 250;
const LX = [-0.3, 1.48];
const LT = [-2, 4];
const px = (i: number) => X0 + ((Math.log10(i) - LX[0]) / (LX[1] - LX[0])) * (X1 - X0);
const py = (t: number) => Y1 - ((Math.log10(t) - LT[0]) / (LT[1] - LT[0])) * (Y1 - Y0);
const thermal = (m: number) => 60 / (m * m - 1);

export function OvercurrentDiagram({ initial = "overload" }: { initial?: string }) {
  const { t } = useI18n();
  const [m, setM] = useState(initial === "short" ? 15 : 2);
  useEffect(() => setM(initial === "short" ? 15 : 2), [initial]);

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 1.06; i <= MAG; i *= 1.04) pts.push(`${px(i).toFixed(1)},${py(Math.min(9000, thermal(i))).toFixed(1)}`);
    pts.push(`${px(MAG).toFixed(1)},${py(0.02).toFixed(1)}`);
    pts.push(`${px(30).toFixed(1)},${py(0.02).toFixed(1)}`);
    return "M" + pts.join(" L");
  }, []);

  const region = m < 1.05 ? "none" : m < MAG ? "thermal" : "magnetic";
  const tripT = region === "thermal" ? Math.min(9000, thermal(m)) : region === "magnetic" ? 0.02 : null;
  const heat = Math.min(1, (m * m) / 25);

  const status =
    region === "none"
      ? { tone: "ok" as const, text: { he: "זרם בתחום הנומינלי — אין ניתוק. הכבל פועל בטמפרטורה התקינה.", en: "Current within rating — no trip. The cable runs at normal temperature." } }
      : region === "thermal"
        ? { tone: "warn" as const, text: { he: "עומס-יתר: האלמנט התרמי מגיב בהשהיה — ככל שהזרם גבוה יותר, הניתוק מהיר יותר (עקום הפוך). ההשהיה מאפשרת זרמי התנעה קצרים.", en: "Overload: the thermal element responds with a delay — the higher the current, the faster the trip (inverse curve). The delay tolerates brief inrush currents." } }
        : { tone: "danger" as const, text: { he: "קצר: מעל סף המגנטי/אלקטרוני — ניתוק מיידי. בהזנה מגנרטור, זרם הקצר נמוך יותר ודועך — יש לוודא שהסף עדיין מושג.", en: "Short circuit: above the magnetic/electronic threshold — instantaneous trip. On generator supply, short-circuit current is lower and decays — verify the threshold is still reached." } };

  return (
    <DiagramFrame
      status={status}
      extra={
        <label className="flex flex-col gap-2 text-sm text-slate-300">
          <span className="flex justify-between">
            <span>{t({ he: "זרם במעגל (כפולות של זרם נומינלי In)", en: "Circuit current (multiples of rated In)" })}</span>
            <span className="font-mono text-volt-300">{m.toFixed(1)} × In</span>
          </span>
          <input type="range" min={0.5} max={25} step={0.1} value={m} onChange={(e) => setM(parseFloat(e.target.value))} dir="ltr" />
        </label>
      }
    >
      <svg viewBox="0 0 640 300" className="w-full">
        {/* grid */}
        {[0.5, 1, 2, 5, 10, 20].map((i) => (
          <line key={i} x1={px(i)} y1={Y0} x2={px(i)} y2={Y1} stroke="#16294a" />
        ))}
        {[-2, -1, 0, 1, 2, 3, 4].map((e) => (
          <line key={e} x1={X0} y1={py(10 ** e)} x2={X1} y2={py(10 ** e)} stroke="#16294a" />
        ))}
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke="#7d8da3" />
        <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#7d8da3" />
        <text x={(X0 + X1) / 2} y={282} textAnchor="middle" fontSize={11} fill={COL.text}>
          <T v={{ he: "זרם I / In (סקאלה לוגריתמית)", en: "Current I / In (log scale)" }} />
        </text>
        <text x={22} y={(Y0 + Y1) / 2} textAnchor="middle" fontSize={11} fill={COL.text} transform={`rotate(-90 22 ${(Y0 + Y1) / 2})`}>
          <T v={{ he: "זמן ניתוק (לוג)", en: "Trip time (log)" }} />
        </text>
        <text x={px(1)} y={Y1 + 14} textAnchor="middle" fontSize={10} fill={COL.text} fontFamily="monospace">1×In</text>
        {/* regions */}
        <rect x={px(1.05)} y={Y0} width={px(MAG) - px(1.05)} height={Y1 - Y0} fill="#ffc531" opacity={region === "thermal" ? 0.08 : 0.03} />
        <rect x={px(MAG)} y={Y0} width={X1 - px(MAG)} height={Y1 - Y0} fill={COL.fault} opacity={region === "magnetic" ? 0.1 : 0.03} />
        <text x={(px(1.05) + px(MAG)) / 2} y={Y0 + 16} textAnchor="middle" fontSize={11} fill="#ffc531">
          <T v={{ he: "אזור תרמי — עומס-יתר", en: "Thermal — overload" }} />
        </text>
        <text x={(px(MAG) + X1) / 2} y={Y0 + 16} textAnchor="middle" fontSize={11} fill={COL.fault}>
          <T v={{ he: "מגנטי — קצר", en: "Magnetic — short circuit" }} />
        </text>
        {/* curve band */}
        <path d={curve} stroke="#3fb0ff" strokeWidth={10} opacity={0.15} fill="none" />
        <path d={curve} stroke="#3fb0ff" strokeWidth={2.5} fill="none" />
        {/* operating point */}
        <line x1={px(m)} y1={Y0} x2={px(m)} y2={Y1} stroke="#e2e8f0" strokeDasharray="4 4" opacity={0.6} />
        {tripT !== null && (
          <>
            <circle cx={px(m)} cy={py(tripT)} r={12} fill={region === "magnetic" ? COL.fault : "#ffc531"} opacity={0.25} className="animate-pulse" />
            <circle cx={px(m)} cy={py(tripT)} r={5} fill={region === "magnetic" ? COL.fault : "#ffc531"} />
          </>
        )}
        <text x={X1 - 4} y={Y1 - 8} textAnchor="end" fontSize={10} fill="#5b6b82">
          <T v={{ he: "עקום מושגי — העקומים בפועל לפי נתוני ההתקן", en: "Conceptual curve — real curves per device data" }} />
        </text>
        {/* cable heat */}
        <g transform="translate(592 60)">
          <rect x={-8} y={0} width={16} height={120} rx={8} fill="#0f1a30" stroke="#24477a" />
          <rect x={-5} y={117 - 114 * heat} width={10} height={114 * heat} rx={5} fill={heat > 0.6 ? COL.fault : heat > 0.2 ? "#ffc531" : COL.PE} style={{ transition: "all .3s" }} />
          <text x={0} y={136} textAnchor="middle" fontSize={9} fill={COL.text}>
            <T v={{ he: "חום כבל", en: "Cable heat" }} />
          </text>
        </g>
      </svg>
    </DiagramFrame>
  );
}
