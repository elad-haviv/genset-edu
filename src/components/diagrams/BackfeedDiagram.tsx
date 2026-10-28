"use client";

import { useState } from "react";
import { COL, DiagramFrame, Flow, Person, Source, T } from "./common";

type Mode = "improvised" | "ats";

export function BackfeedDiagram() {
  const [mode, setMode] = useState<Mode>("improvised");
  const bad = mode === "improvised";
  return (
    <DiagramFrame
      states={[
        { value: "improvised", label: { he: "חיבור מאולתר — ללא מפסק החלפה", en: "Improvised — no transfer switch" } },
        { value: "ats", label: { he: "מפסק החלפה עם שילוב", en: "Interlocked transfer switch" } },
      ]}
      value={mode}
      onChange={setMode}
      status={
        bad
          ? { tone: "danger", text: { he: "הזנה חוזרת! מתח הגנרטור עובר דרך לוח המבנה לרשת. השנאי פועל הפוך ומעלה את המתח לרמת מתח גבוה — עובד הרשת שבטוח שהקו מנותק נמצא בסכנת חיים.", en: "Backfeed! Generator voltage passes through the building panel into the network. The transformer works in reverse, stepping up to high voltage — the line worker who believes the line is dead is in lethal danger." } }
          : { tone: "ok", text: { he: "מפסק ההחלפה מנתק את המבנה מהרשת לפני חיבור הגנרטור. שילוב מכני וחשמלי מונע מצב שבו שני המקורות מחוברים יחד. הרשת נשארת מנותקת ובטוחה.", en: "The transfer switch disconnects the building from the network before connecting the generator. Mechanical and electrical interlocks prevent both sources being connected. The network stays dead and safe." } }
      }
      caption={{ he: "תרחיש: הפסקת חשמל, צוות חברת החשמל עובד על הקו. בעל המבנה מפעיל גנרטור.", en: "Scenario: utility outage, a utility crew is working on the line. The building owner runs a generator." }}
    >
      <svg viewBox="0 0 640 290" className="w-full">
        <line x1={10} y1={270} x2={630} y2={270} stroke="#5b4a3a" strokeWidth={2} />
        {/* substation breaker open */}
        <rect x={14} y={40} width={44} height={36} rx={4} fill={COL.bg} stroke="#7d8da3" />
        <text x={36} y={62} textAnchor="middle" fontSize={9} fill={COL.text}>SUB</text>
        <line x1={58} y1={58} x2={80} y2={40} stroke="#e2e8f0" strokeWidth={3} />
        <text x={36} y={92} textAnchor="middle" fontSize={9} fill={COL.fault}>
          <T v={{ he: "מנותק", en: "OPEN" }} />
        </text>
        {/* HV line on poles */}
        {[110, 200].map((x) => (
          <g key={x}>
            <line x1={x} y1={50} x2={x} y2={270} stroke="#6b5a48" strokeWidth={5} />
            <line x1={x - 18} y1={56} x2={x + 18} y2={56} stroke="#6b5a48" strokeWidth={4} />
          </g>
        ))}
        <path d="M84 50 H260" stroke={bad ? COL.fault : COL.dim} strokeWidth={3} style={{ filter: bad ? `drop-shadow(0 0 6px ${COL.fault})` : undefined }} />
        <text x={150} y={40} textAnchor="middle" fontSize={11} fill={bad ? COL.fault : COL.text} fontWeight="bold">
          {bad ? <T v={{ he: "מתח גבוה — מוזן לאחור!", en: "HIGH VOLTAGE — BACKFED!" }} /> : <T v={{ he: "קו מתח גבוה — מנותק", en: "HV line — de-energised" }} />}
        </text>
        {/* worker on pole */}
        <Person x={130} y={150} state={bad ? "danger" : "safe"} />
        <path d="M130 110 L125 58" stroke={bad ? COL.fault : COL.PE} strokeWidth={2.5} />
        {/* transformer */}
        <g transform="translate(270 70)">
          <circle cx={-8} r={16} fill={COL.bg} stroke="#7d8da3" strokeWidth={2} />
          <circle cx={8} r={16} fill={COL.bg} stroke="#7d8da3" strokeWidth={2} />
          <text y={34} textAnchor="middle" fontSize={9} fill={COL.text}>
            <T v={{ he: "שנאי", en: "Transformer" }} />
          </text>
        </g>
        <path d="M254 70 H260 V50" stroke={bad ? COL.fault : COL.dim} strokeWidth={3} fill="none" />
        <path d="M286 70 H340 V130" stroke={bad ? "#ffb547" : COL.dim} strokeWidth={3} fill="none" />
        {/* building */}
        <path d="M330 270 V130 L460 70 L590 130 V270" fill="#0f1a30" stroke="#2a3a55" strokeWidth={2} />
        <rect x={370} y={150} width={50} height={70} rx={4} fill="#1a2433" stroke="#7d8da3" />
        <text x={395} y={236} textAnchor="middle" fontSize={9} fill={COL.text}>
          <T v={{ he: "לוח ראשי", en: "Main panel" }} />
        </text>
        <path d="M340 130 V170 H370" stroke={bad ? "#ffb547" : COL.dim} strokeWidth={3} fill="none" />
        {bad ? (
          <>
            {/* improvised lead into a socket */}
            <rect x={470} y={190} width={18} height={24} rx={3} fill="#e2e8f0" />
            <path d="M420 200 H470" stroke="#ffb547" strokeWidth={2} />
            <path d="M488 202 C520 210 540 240 560 250" stroke="#1f2328" strokeWidth={5} fill="none" />
          </>
        ) : (
          <>
            <rect x={440} y={150} width={56} height={60} rx={5} fill="#0f1a30" stroke="#3fb0ff" strokeWidth={2} />
            <text x={468} y={178} textAnchor="middle" fontSize={11} fill="#7cc8ff" fontWeight="bold">ATS</text>
            <text x={468} y={195} textAnchor="middle" fontSize={8} fill={COL.text}>
              <T v={{ he: "שילוב", en: "interlock" }} />
            </text>
            <path d="M420 165 H440" stroke={COL.dim} strokeWidth={3} />
            <line x1={440} y1={165} x2={452} y2={156} stroke="#e2e8f0" strokeWidth={2} />
            <path d="M496 185 H530 V250 H560" stroke="#ffb547" strokeWidth={3} fill="none" />
          </>
        )}
        {/* loads */}
        <g transform="translate(430 250)">
          <circle r={12} fill="rgba(255,197,49,.25)" stroke="#ffc531" strokeWidth={2} />
          <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#ffc531" strokeWidth={2} />
        </g>
        <Source x={590} y={235} label="GEN" />
        {bad ? (
          <Flow d="M566 245 C540 240 520 210 488 202 H420 V170 H340 V70 H286 M254 70 H260 V50 H84" color={COL.fault} speed="flow" width={3.5} />
        ) : (
          <Flow d="M566 245 H530 V185 H496" color="#ffb547" speed="flow-slow" />
        )}
      </svg>
    </DiagramFrame>
  );
}
