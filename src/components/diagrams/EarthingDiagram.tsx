"use client";

import { useEffect, useState } from "react";
import { COL, DiagramFrame, EarthSymbol, Flow, T } from "./common";
import type { L } from "@/lib/i18n";
import { useI18n } from "@/lib/i18n";

type Sys = "TN-S" | "TN-C-S" | "IT";

const desc: Record<Sys, L> = {
  "TN-S": { he: "TN-S: נקודת הכוכב מוארקת במקור; מוליכי N ו-PE נפרדים לכל האורך. מסלול תקלה בעכבה נמוכה דרך ה-PE.", en: "TN-S: star point earthed at the source; N and PE separate throughout. Low-impedance fault path via PE." },
  "TN-C-S": { he: "TN-C-S: מוליך PEN משולב עד נקודת הכניסה למבנה, שם הוא מפוצל ל-N ול-PE ומחובר להארקת יסוד. אחרי הפיצול — אסור לחבר ביניהם שוב.", en: "TN-C-S: combined PEN up to the building intake, where it splits into N and PE and is bonded to the local electrode. After the split they must never be rejoined." },
  IT: { he: "IT: המקור מבודד מהאדמה (או דרך עכבה גבוהה). החלקים המתכתיים מוארקים מקומית. תקלה ראשונה — זרם קטן, התראה ממנטר בידוד (IMD), ללא ניתוק.", en: "IT: source isolated from earth (or via high impedance). Exposed parts earthed locally. First fault — tiny current, insulation monitor (IMD) alarm, no trip." },
};

export function EarthingDiagram({ initial = "TN-S" }: { initial?: string }) {
  const { t } = useI18n();
  const [sys, setSys] = useState<Sys>((initial as Sys) ?? "TN-S");
  const [fault, setFault] = useState(false);
  useEffect(() => {
    setSys((initial as Sys) ?? "TN-S");
    setFault(false);
  }, [initial]);

  const isIT = sys === "IT";
  const splitX = 330;

  const status = !fault
    ? { tone: "info" as const, text: desc[sys] }
    : isIT
      ? { tone: "warn" as const, text: { he: "תקלה ראשונה ב-IT: זרם התקלה זעיר (דרך קיבוליות הרשת). המתקן ממשיך לפעול, ה-IMD מתריע — יש לאתר ולתקן לפני שתופיע תקלה שנייה.", en: "First fault in IT: tiny fault current (via network capacitance). Supply continues; the IMD alarms — locate and repair before a second fault occurs." } }
      : { tone: "danger" as const, text: { he: "תקלה ב-TN: זרם תקלה גבוה בלולאה L1 → מעטפת → PE → נקודת הכוכב. ההגנה (מפסק/נתיך) מנתקת אוטומטית.", en: "Fault in TN: high fault current in the loop L1 → enclosure → PE → star point. Protection (breaker/fuse) disconnects automatically." } };

  return (
    <DiagramFrame
      states={[
        { value: "TN-S", label: { he: "TN-S", en: "TN-S" } },
        { value: "TN-C-S", label: { he: "TN-C-S", en: "TN-C-S" } },
        { value: "IT", label: { he: "IT", en: "IT" } },
      ]}
      value={sys}
      onChange={(v) => {
        setSys(v);
        setFault(false);
      }}
      status={status}
      extra={
        <button onClick={() => setFault((f) => !f)} className={`btn self-start border text-xs ${fault ? "border-danger/60 bg-danger/20 text-red-200" : "border-white/10 text-slate-300"}`}>
          {fault ? t({ he: "נקה תקלה", en: "Clear fault" }) : t({ he: "הדמה תקלה לאדמה ב-L1", en: "Simulate L1 earth fault" })}
        </button>
      }
    >
      <svg viewBox="0 0 640 300" className="w-full">
        {/* building */}
        <rect x={300} y={20} width={325} height={265} rx={10} fill="none" stroke="#2a3a55" strokeDasharray="6 6" />
        <text x={612} y={38} textAnchor="end" fontSize={11} fill={COL.text}>
          <T v={{ he: "מתקן הצרכן", en: "Consumer installation" }} />
        </text>
        {/* source: star-connected secondary */}
        <g transform="translate(70 90)">
          <circle r={34} fill={COL.bg} stroke="#ff9a1f" strokeWidth={2} />
          <path d="M0 0 V-22 M0 0 L19 11 M0 0 L-19 11" stroke="#ff9a1f" strokeWidth={2} />
          <circle r={3} fill="#ff9a1f" />
          <text y={-44} textAnchor="middle" fontSize={11} fill={COL.text}>
            <T v={{ he: "מקור (כוכב)", en: "Source (star)" }} />
          </text>
        </g>
        {/* phases */}
        {[50, 64, 78].map((y, i) => (
          <g key={y}>
            <path d={`M104 ${y} H600`} stroke={COL.L} strokeWidth={2.5} opacity={i === 0 ? 1 : 0.6} />
            <text x={112} y={y - 3} fontSize={10} fill={COL.L}>L{i + 1}</text>
          </g>
        ))}
        {/* neutral / PEN / PE per system */}
        {sys === "TN-S" && (
          <>
            <path d="M70 90 V110 H600" stroke={COL.N} strokeWidth={2.5} fill="none" />
            <path d="M70 110 V140" stroke={COL.PE} strokeWidth={2.5} />
            <path d="M70 130 H600" stroke={COL.PE} strokeWidth={2.5} strokeDasharray="8 4" fill="none" />
            <EarthSymbol x={70} y={140} />
            <text x={150} y={106} fontSize={10} fill={COL.N}>N</text>
            <text x={150} y={126} fontSize={10} fill={COL.PE}>PE</text>
          </>
        )}
        {sys === "TN-C-S" && (
          <>
            <path d={`M70 90 V120 H${splitX}`} stroke={COL.PE} strokeWidth={4} fill="none" />
            <path d={`M70 120 H${splitX}`} stroke={COL.N} strokeWidth={1.5} strokeDasharray="6 6" fill="none" />
            <path d="M70 120 V140" stroke={COL.PE} strokeWidth={2.5} />
            <EarthSymbol x={70} y={140} />
            <text x={150} y={114} fontSize={10} fill={COL.PE}>PEN</text>
            <circle cx={splitX} cy={120} r={5} fill="#ffc531" />
            <path d={`M${splitX} 120 V110 H600`} stroke={COL.N} strokeWidth={2.5} fill="none" />
            <path d={`M${splitX} 120 V130 H600`} stroke={COL.PE} strokeWidth={2.5} strokeDasharray="8 4" fill="none" />
            <path d={`M${splitX} 130 V200`} stroke={COL.PE} strokeWidth={2} />
            <EarthSymbol x={splitX} y={200} />
            <text x={splitX + 8} y={150} fontSize={10} fill="#ffc531">
              <T v={{ he: "נקודת פיצול", en: "Split point" }} />
            </text>
          </>
        )}
        {isIT && (
          <>
            <path d="M70 90 V128" stroke="#7d8da3" strokeWidth={2} strokeDasharray="3 4" />
            <rect x={56} y={128} width={28} height={22} rx={3} fill={fault ? "#3a2a0a" : COL.bg} stroke="#ffc531" />
            <text x={70} y={143} textAnchor="middle" fontSize={9} fill="#ffc531" fontWeight="bold">IMD</text>
            <path d="M70 150 V170" stroke={COL.PE} strokeWidth={2} />
            <EarthSymbol x={70} y={170} />
            {fault && <circle cx={70} cy={139} r={18} fill="none" stroke="#ffc531" strokeWidth={2} className="animate-pulse" />}
            <path d="M520 230 V250" stroke={COL.PE} strokeWidth={2} />
            <EarthSymbol x={520} y={250} />
            <text x={530} y={248} fontSize={10} fill={COL.PE}>
              <T v={{ he: "הארקה מקומית", en: "Local earth" }} />
            </text>
          </>
        )}
        {/* appliance */}
        <rect x={470} y={160} width={100} height={70} rx={6} fill="#141d2c" stroke={fault ? COL.fault : "#7d8da3"} strokeWidth={2} />
        <text x={520} y={200} textAnchor="middle" fontSize={11} fill={COL.text}>
          <T v={{ he: "צרכן", en: "Load" }} />
        </text>
        <path d="M500 50 V160" stroke={COL.L} strokeWidth={2} />
        {!isIT && <path d="M520 110 V160" stroke={COL.N} strokeWidth={2} />}
        {!isIT && <path d="M555 130 V160" stroke={COL.PE} strokeWidth={2} strokeDasharray="5 3" />}
        {fault && <path d="M500 140 l10 -5 l6 8 l10 -6" stroke={COL.fault} strokeWidth={3} fill="none" className="animate-blink" />}
        {/* fault flows */}
        {fault && sys === "TN-S" && <Flow d="M104 50 H500 V140 L526 137 L555 160 V130 H70 V90" color={COL.fault} speed="flow-fast" width={3.5} />}
        {fault && sys === "TN-C-S" && <Flow d={`M104 50 H500 V140 L526 137 L555 160 V130 H${splitX} V120 H70 V90`} color={COL.fault} speed="flow-fast" width={3.5} />}
        {fault && isIT && <Flow d="M104 50 H500 V140 L526 137 L520 230 V262 H70 V170" color="#ffc531" speed="flow-slow" width={1.5} />}
      </svg>
    </DiagramFrame>
  );
}
