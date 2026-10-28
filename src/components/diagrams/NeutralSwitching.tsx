"use client";

import { useState } from "react";
import { COL, DiagramFrame, EarthSymbol, Flow, T } from "./common";
import type { L } from "@/lib/i18n";

type Opt = "3p" | "3p-bad" | "4p";

const status: Record<Opt, { tone: "ok" | "warn" | "danger" | "info"; text: L }> = {
  "3p": {
    tone: "info",
    text: {
      he: "3 קטבים, אפס מוצק (לא מנותק): האפס של הגנרטור מחובר לאפס המשותף, וחיבור N-PE קיים רק בנקודה אחת (בכניסת המבנה). זרם האפס חוזר לגנרטור דרך מוליך ה-N בלבד.",
      en: "3-pole, solid (unswitched) neutral: the generator neutral joins the common neutral, and the N-PE bond exists at one point only (service entrance). Neutral current returns to the generator via N only.",
    },
  },
  "3p-bad": {
    tone: "danger",
    text: {
      he: "שגוי: 3 קטבים + חיבור N-PE נוסף בגנרטור. נוצר מסלול מקביל — חלק מזרם האפס זורם במוליכי ההארקה ובמבנה. תוצאות: זרם במוליכי PE, הפעלות שווא או חוסר פעולה של הגנות זליגה, הפרעות.",
      en: "Wrong: 3-pole + an extra N-PE bond at the generator. A parallel path forms — part of the neutral current flows in protective conductors and metalwork. Results: current on PE, nuisance trips or failure of earth-fault protection, interference.",
    },
  },
  "4p": {
    tone: "ok",
    text: {
      he: "4 קטבים, אפס מנותק: ה-ATS מעביר גם את ה-N. הגנרטור הוא מקור נפרד עם חיבור N-PE משלו. בכל מצב יש חיבור N-PE פעיל אחד בלבד למקור המזין — ללא מסלולים מקבילים.",
      en: "4-pole, switched neutral: the ATS also transfers N. The generator is a separately derived source with its own N-PE bond. In every position only one N-PE bond is active for the feeding source — no parallel paths.",
    },
  },
};

export function NeutralSwitching() {
  const [o, setO] = useState<Opt>("3p");
  const four = o === "4p";
  const genBond = o !== "3p";
  return (
    <DiagramFrame
      states={[
        { value: "3p", label: { he: "ATS 3 קטבים", en: "3-pole ATS" } },
        { value: "3p-bad", label: { he: "3 קטבים + חיבור כפול (שגוי)", en: "3-pole + double bond (wrong)" } },
        { value: "4p", label: { he: "ATS 4 קטבים", en: "4-pole ATS" } },
      ]}
      value={o}
      onChange={setO}
      status={status[o]}
      caption={{
        he: "המערכת מוצגת במצב הזנה מהגנרטור עם עומס לא מאוזן (זרם באפס). הבחירה בין 3P ל-4P תלויה בשיטת ההארקה, בדרישות התקנות ובהגנות — והיא החלטת תכנון של מהנדס.",
        en: "Shown on generator supply with an unbalanced load (neutral current present). Choosing 3P vs 4P depends on the earthing system, regulations and protection scheme — it is an engineer's design decision.",
      }}
    >
      <svg viewBox="0 0 680 340" className="w-full">
        {/* PE bar */}
        <path d="M60 312 H640" stroke={COL.PE} strokeWidth={3} strokeDasharray="10 5" />
        <text x={630} y={330} textAnchor="end" fontSize={10} fill={COL.PE}>PE</text>
        {/* utility */}
        <g transform="translate(60 75)">
          <circle cx={-6} r={14} fill={COL.bg} stroke={COL.dim} strokeWidth={2} />
          <circle cx={8} r={14} fill={COL.bg} stroke={COL.dim} strokeWidth={2} />
          <text x={0} y={-22} textAnchor="middle" fontSize={10} fill={COL.text}>
            <T v={{ he: "רשת (מנותקת)", en: "Utility (off)" }} />
          </text>
        </g>
        <path d="M82 66 H300" stroke={COL.dim} strokeWidth={3} />
        <path d="M82 90 H250" stroke={COL.N} strokeWidth={2.5} opacity={0.7} />
        {/* MET bond at service entrance */}
        <path d="M200 90 V222 M200 238 V252 M200 268 V312" stroke={COL.PE} strokeWidth={2.5} />
        <circle cx={200} cy={90} r={5} fill="#ffc531" />
        <text x={206} y={84} fontSize={9} fill="#ffc531">
          N-PE (MET)
        </text>
        <EarthSymbol x={200} y={312} />
        {/* generator */}
        <g transform="translate(60 245)">
          <circle r={22} fill={COL.bg} stroke="#ff9a1f" strokeWidth={2.5} />
          <path d="M-11 0c4-8 7-8 11 0s7 8 11 0" stroke="#ff9a1f" strokeWidth={2} fill="none" />
          <text y={-30} textAnchor="middle" fontSize={10} fill="#ffb547" fontWeight="bold">GEN</text>
        </g>
        <path d="M82 230 H300" stroke={COL.L} strokeWidth={3} />
        <path d={`M82 260 H${four ? 300 : 250}`} stroke={COL.N} strokeWidth={2.5} />
        {genBond && (
          <>
            <path d="M140 260 V312" stroke={o === "3p-bad" ? COL.fault : COL.PE} strokeWidth={2.5} />
            <circle cx={140} cy={260} r={5} fill={o === "3p-bad" ? COL.fault : "#ffc531"} />
            <text x={146} y={285} fontSize={9} fill={o === "3p-bad" ? COL.fault : "#ffc531"}>
              N-PE (GEN)
            </text>
          </>
        )}
        {/* neutral handling */}
        {!four ? (
          <>
            <path d="M250 90 V260" stroke={COL.N} strokeWidth={3} />
            <path d="M250 175 H560" stroke={COL.N} strokeWidth={3} />
            <text x={256} y={170} fontSize={9} fill={COL.N}>
              <T v={{ he: "אפס משותף (לא מנותק)", en: "Solid neutral (not switched)" }} />
            </text>
          </>
        ) : (
          <>
            <path d="M250 90 H300" stroke={COL.N} strokeWidth={2.5} opacity={0.7} />
            <path d="M400 175 H560" stroke={COL.N} strokeWidth={3} />
          </>
        )}
        {/* ATS */}
        <rect x={290} y={40} width={110} height={250} rx={10} fill="none" stroke="#3fb0ff" strokeWidth={1.5} />
        <text x={345} y={58} textAnchor="middle" fontSize={11} fill="#7cc8ff" fontWeight="bold">
          ATS {four ? "4P" : "3P"}
        </text>
        {/* L pole */}
        <circle cx={310} cy={66} r={4} fill={COL.dim} />
        <circle cx={310} cy={230} r={4} fill={COL.L} />
        <circle cx={390} cy={140} r={4} fill={COL.L} />
        <path d="M390 140 L312 228" stroke="#e2e8f0" strokeWidth={3} strokeLinecap="round" />
        <path d="M390 140 H560" stroke={COL.L} strokeWidth={3} />
        {four && (
          <>
            <circle cx={310} cy={90} r={4} fill={COL.N} opacity={0.6} />
            <circle cx={310} cy={260} r={4} fill={COL.N} />
            <circle cx={390} cy={175} r={4} fill={COL.N} />
            <path d="M390 175 L312 258" stroke="#e2e8f0" strokeWidth={3} strokeLinecap="round" />
          </>
        )}
        {/* load */}
        <rect x={560} y={120} width={90} height={80} rx={8} fill="#141d2c" stroke="#7d8da3" strokeWidth={2} />
        <text x={605} y={165} textAnchor="middle" fontSize={11} fill={COL.text}>
          <T v={{ he: "עומס", en: "Load" }} />
        </text>
        <path d="M630 200 V312" stroke={COL.PE} strokeWidth={2.5} strokeDasharray="6 3" />
        <text x={568} y={136} fontSize={9} fill={COL.L}>L1-3</text>
        <text x={568} y={192} fontSize={9} fill={COL.N}>N</text>
        {/* flows */}
        <Flow d="M82 230 H312 L390 140 H560" speed="flow" />
        {four ? (
          <Flow d="M560 175 H390 L312 258 H82" color="#7cc8ff" speed="flow-slow" />
        ) : (
          <Flow d="M560 175 H250 V260 H82" color="#7cc8ff" speed="flow-slow" width={o === "3p-bad" ? 1.8 : 3} />
        )}
        {o === "3p-bad" && <Flow d="M250 175 V90 H200 V312 H140 V260" color={COL.fault} speed="flow" width={2.5} />}
        {o === "3p-bad" && (
          <text x={420} y={300} textAnchor="middle" fontSize={11} fill={COL.fault} fontWeight="bold" className="animate-blink">
            <T v={{ he: "⚠ זרם אפס זורם במוליכי ההארקה", en: "⚠ Neutral current flowing on earth conductors" }} />
          </text>
        )}
      </svg>
    </DiagramFrame>
  );
}
