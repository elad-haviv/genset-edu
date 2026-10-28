"use client";

import { useEffect, useState } from "react";
import { COL, DiagramFrame, T } from "./common";
import { useI18n, type L } from "@/lib/i18n";

/* ------------------------------------------------------------ Emergency stop */

const estopSteps: L[] = [
  { he: "הלחצן נלחץ וננעל", en: "Button pressed and latched" },
  { he: "המעגל הקשיח נפתח (ללא תלות בתוכנה)", en: "Hard-wired circuit opens (independent of software)" },
  { he: "סולנואיד הדלק / פקודת העצירה — המנוע נעצר", en: "Fuel solenoid / stop command — engine stops" },
  { he: "מפסק הגנרטור נפתח — העומסים מנותקים", en: "Generator breaker opens — loads disconnected" },
  { he: "התראה ננעלת בבקר — אין התנעה אוטומטית", en: "Alarm latched in controller — no auto restart" },
];

export function EStopDiagram() {
  const { t } = useI18n();
  const [step, setStep] = useState(-1);
  const [released, setReleased] = useState(false);
  const [reset, setReset] = useState(false);

  useEffect(() => {
    if (step < 0 || step >= estopSteps.length - 1) return;
    const id = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(id);
  }, [step]);

  const pressed = step >= 0 && !released;
  const running = step < 2;
  const status =
    step < 0
      ? { tone: "info" as const, text: { he: "הגנרטור פועל בעומס. לחצו על לחצן החירום.", en: "The generator is running on load. Press the emergency stop." } }
      : step < estopSteps.length - 1
        ? { tone: "warn" as const, text: estopSteps[step] }
        : !released
          ? { tone: "warn" as const, text: { he: "הגנרטור עצור ונעול. לפני שחרור — לברר את סיבת הלחיצה ולוודא שהסכנה הוסרה.", en: "Set stopped and locked out. Before releasing — find out why it was pressed and confirm the hazard is gone." } }
          : !reset
            ? { tone: "warn" as const, text: { he: "הלחצן שוחרר — והגנרטור עדיין לא מתניע. נדרש איפוס מכוון בבקר.", en: "Button released — and the set still won't start. A deliberate controller reset is required." } }
            : { tone: "ok" as const, text: { he: "אופס בבקר — המערכת חוזרת למצב מוכן. זכרו: E-STOP אינו אמצעי בידוד לעבודה.", en: "Controller reset — the system returns to ready. Remember: E-STOP is not a means of isolation for work." } };

  return (
    <DiagramFrame
      status={status}
      extra={
        <div className="flex flex-wrap gap-2">
          <button className="btn border border-white/10 text-xs text-slate-300" disabled={step < estopSteps.length - 1 || released} onClick={() => setReleased(true)}>
            {t({ he: "שחרור הלחצן (סיבוב)", en: "Release button (twist)" })}
          </button>
          <button className="btn border border-white/10 text-xs text-slate-300" disabled={!released || reset} onClick={() => setReset(true)}>
            {t({ he: "איפוס בבקר", en: "Controller reset" })}
          </button>
          <button
            className="btn border border-white/10 text-xs text-slate-300"
            onClick={() => {
              setStep(-1);
              setReleased(false);
              setReset(false);
            }}
          >
            {t({ he: "התחל מחדש", en: "Start over" })}
          </button>
        </div>
      }
    >
      <svg viewBox="0 0 640 260" className="w-full">
        <g transform="translate(110 130)" style={{ cursor: step < 0 ? "pointer" : "default" }} onClick={() => step < 0 && setStep(0)}>
          <rect x={-70} y={-70} width={140} height={140} rx={12} fill="#ffd000" />
          <circle r={50} fill="#5a0000" />
          <circle r={pressed ? 40 : 46} cy={pressed ? 0 : -3} fill="#e01b1b" stroke="#ff6b6b" strokeWidth={2} style={{ transition: "all .2s" }} />
          {step < 0 && <circle r={58} fill="none" stroke="#ff4d4d" strokeWidth={3} className="animate-pulse" />}
          <text y={88} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#e2e8f0">
            EMERGENCY STOP
          </text>
        </g>
        {estopSteps.map((s, i) => (
          <g key={i} transform={`translate(240 ${30 + i * 44})`}>
            <rect width={370} height={34} rx={8} fill={step >= i ? "rgba(255,77,77,.12)" : "#0f1a30"} stroke={step >= i ? COL.fault : "#24477a"} />
            <circle cx={18} cy={17} r={9} fill={step >= i ? COL.fault : "#16243f"} />
            <text x={18} y={21} textAnchor="middle" fontSize={10} fill="#fff" fontWeight="bold">
              {i + 1}
            </text>
            <text x={36} y={21} fontSize={12} fill={step >= i ? "#fecaca" : COL.text}>
              <T v={s} />
            </text>
          </g>
        ))}
        <g transform="translate(110 30)">
          <circle r={6} fill={running ? COL.PE : COL.dim} className={running ? "animate-pulse" : ""} />
          <text x={12} y={4} fontSize={11} fill={COL.text}>
            {running ? "RUNNING" : "STOPPED"}
          </text>
        </g>
      </svg>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------ Fire */

const fireSources: { id: string; x: number; y: number; title: L; side: "heat" | "fuel" | "oxygen"; text: L }[] = [
  { id: "loose", x: 120, y: 80, side: "heat", title: { he: "חיבור רופף", en: "Loose connection" }, text: { he: "התנגדות מגע → התחממות מקומית. מניעה: הידוק לפי מומנט היצרן, תרמוגרפיה תקופתית.", en: "Contact resistance → local heating. Prevention: torque per manufacturer, periodic thermography." } },
  { id: "exhaust", x: 120, y: 150, side: "heat", title: { he: "פליטה חמה + דליפת דלק", en: "Hot exhaust + fuel leak" }, text: { he: "דלק על משטח חם — מקור הצתה מוכר. מניעה: בידוד, הפרדה, תחזוקת צנרת דלק.", en: "Fuel on a hot surface — a known ignition source. Prevention: insulation, separation, fuel-line maintenance." } },
  { id: "arc", x: 120, y: 220, side: "heat", title: { he: "קשת חשמלית", en: "Arcing" }, text: { he: "קצר או חיבור על תקלה. מניעה: הגנות מתואמות, ציוד סגור, נהלי עבודה.", en: "Short circuit or closing onto a fault. Prevention: coordinated protection, enclosed equipment, work procedures." } },
  { id: "h2", x: 520, y: 80, side: "fuel", title: { he: "מימן ממצברים", en: "Battery hydrogen" }, text: { he: "נפלט בטעינה. מניעה: אוורור, הרחקת מקורות הצתה.", en: "Released during charging. Prevention: ventilation, no ignition sources." } },
  { id: "diesel", x: 520, y: 150, side: "fuel", title: { he: "סולר ושמנים", en: "Diesel & oils" }, text: { he: "מניעה: מאצרה, ניקיון, אחסון במיכלים מאושרים, ללא חומרים דליקים נוספים.", en: "Prevention: bunding, housekeeping, approved tanks, no other combustibles." } },
  { id: "cables", x: 520, y: 220, side: "fuel", title: { he: "בידוד כבלים מחומם", en: "Overheated cable insulation" }, text: { he: "עומס-יתר או קיבוץ צפוף. מניעה: בחירת חתך נכונה והגנת עומס-יתר.", en: "Overload or tight grouping. Prevention: correct sizing and overload protection." } },
];

export function FireDiagram() {
  const { t } = useI18n();
  const [sel, setSel] = useState<string | null>(null);
  const s = fireSources.find((f) => f.id === sel);
  return (
    <DiagramFrame
      status={s ? { tone: "warn", text: s.text } : { tone: "info", text: { he: "שריפה דורשת חום, חומר בעירה וחמצן. לחצו על מקורות הסיכון בחדר הגנרטור.", en: "Fire needs heat, fuel and oxygen. Click the risk sources in a generator room." } }}
    >
      <svg viewBox="0 0 640 290" className="w-full">
        <g transform="translate(320 155)">
          <path d="M0 -110 L105 75 L-105 75 Z" fill="rgba(255,77,77,.08)" stroke="#ff9a1f" strokeWidth={3} />
          <path d="M0 -40 C25 -10 28 15 0 40 C-28 15 -25 -10 0 -40Z" fill="#ff9a1f" opacity={0.85} className="animate-pulse" />
          <text x={-80} y={-20} textAnchor="middle" fontSize={13} fill="#ffb547" fontWeight="bold">
            <T v={{ he: "חום", en: "HEAT" }} />
          </text>
          <text x={80} y={-20} textAnchor="middle" fontSize={13} fill="#ffb547" fontWeight="bold">
            <T v={{ he: "חומר בעירה", en: "FUEL" }} />
          </text>
          <text y={98} textAnchor="middle" fontSize={13} fill="#ffb547" fontWeight="bold">
            <T v={{ he: "חמצן", en: "OXYGEN" }} />
          </text>
        </g>
        {fireSources.map((f) => (
          <g key={f.id} transform={`translate(${f.x} ${f.y})`} onClick={() => setSel(f.id)} style={{ cursor: "pointer" }}>
            <rect x={-95} y={-22} width={190} height={44} rx={10} fill={sel === f.id ? "rgba(255,154,31,.2)" : "#0f1a30"} stroke={sel === f.id ? "#ff9a1f" : "#24477a"} strokeWidth={1.5} />
            <text textAnchor="middle" y={5} fontSize={12} fill={sel === f.id ? "#fff" : COL.text}>
              {t(f.title)}
            </text>
          </g>
        ))}
      </svg>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------ Boundaries */

const roles: { id: string; name: L; zone: number; note: L }[] = [
  { id: "visitor", name: { he: "מבקר / עובד לא מוסמך", en: "Visitor / unqualified" }, zone: 4, note: { he: "נשאר מחוץ לכל הגבולות, בליווי ולפי הנחיה.", en: "Stays outside all boundaries, escorted and instructed." } },
  { id: "observer", name: { he: "עובד מתודרך בליווי", en: "Briefed worker, escorted" }, zone: 2, note: { he: "עשוי להיכנס לאזור המוגבל-חלקית רק בליווי מוסמך — לפי נוהל האתר.", en: "May enter the limited zone only escorted by a qualified person — per site procedure." } },
  { id: "qualified", name: { he: "בעל מקצוע מוסמך עם ציוד מגן", en: "Qualified person with PPE" }, zone: 1, note: { he: "רק לאחר ניתוח סיכונים, היתר עבודה וציוד מגן מתאים. ההעדפה: עבודה בציוד מנותק.", en: "Only after risk assessment, work permit and suitable PPE. Preference: de-energised work." } },
];

export function BoundaryDiagram() {
  const { t } = useI18n();
  const [role, setRole] = useState("visitor");
  const r = roles.find((x) => x.id === role)!;
  const zones = [
    { r: 60, label: { he: "אזור מוגבל", en: "Restricted" }, color: "#ff4d4d" },
    { r: 105, label: { he: "אזור גישה מוגבלת", en: "Limited approach" }, color: "#ffc531" },
    { r: 150, label: { he: "גבול קשת חשמלית*", en: "Arc-flash boundary*" }, color: "#ff9a1f" },
  ];
  return (
    <DiagramFrame
      states={roles.map((x) => ({ value: x.id, label: x.name }))}
      value={role}
      onChange={setRole}
      status={{ tone: r.zone === 1 ? "warn" : "info", text: r.note }}
      caption={{
        he: "* המרחקים אינם מוצגים במכוון — הם תלויים במתח, בזרם הקצר, בזמן הניתוק ובניתוח סיכונים, ונקבעים לפי התקנות והתקנים החלים. גבול הקשת יכול להיות גדול מהאזורים האחרים.",
        en: "* Distances are intentionally not shown — they depend on voltage, fault current, clearing time and risk assessment, and are set by applicable regulations and standards. The arc-flash boundary may exceed the other zones.",
      }}
    >
      <svg viewBox="0 0 640 320" className="w-full">
        {[...zones].reverse().map((z, i) => {
          const idx = zones.length - i;
          const allowed = idx >= r.zone;
          return (
            <g key={z.r}>
              <circle cx={320} cy={160} r={z.r} fill={z.color} opacity={allowed ? 0.06 : 0.16} stroke={z.color} strokeDasharray="6 5" strokeWidth={1.5} />
              <text x={320 + z.r * 0.72} y={160 - z.r * 0.72} fontSize={11} fill={z.color}>
                {t(z.label)}
              </text>
            </g>
          );
        })}
        <rect x={295} y={130} width={50} height={60} rx={4} fill="#1a2433" stroke="#ff4d4d" strokeWidth={2} />
        <text x={320} y={165} textAnchor="middle" fontSize={20}>
          ⚡
        </text>
        {/* person token */}
        {(() => {
          const radius = r.zone >= 3 ? 185 : r.zone === 2 ? 128 : 82;
          return (
            <g transform={`translate(${320 - radius * 0.85} ${160 + radius * 0.5})`} style={{ transition: "transform .5s" }}>
              <circle r={14} fill="#1e90ff" stroke="#fff" strokeWidth={2} />
              <text y={5} textAnchor="middle" fontSize={13}>
                👷
              </text>
            </g>
          );
        })()}
      </svg>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------ Rotating & hot */

const spots: { id: string; x: number; y: number; kind: "rot" | "hot" | "press"; name: L; text: L }[] = [
  { id: "fan", x: 105, y: 150, kind: "rot", name: { he: "מאוורר רדיאטור", en: "Radiator fan" }, text: { he: "מסתובב במהירות גבוהה ועלול להתחיל בכל רגע במצב AUTO. מגן תמיד במקומו.", en: "Spins fast and may start at any moment in AUTO. Guard always in place." } },
  { id: "belt", x: 150, y: 105, kind: "rot", name: { he: "רצועות וגלגלות", en: "Belts & pulleys" }, text: { he: "נקודות לכידה (Nip points) — אסור לבוש רופף, שיער פזור או תכשיטים.", en: "Nip points — no loose clothing, loose hair or jewellery." } },
  { id: "coupling", x: 390, y: 150, kind: "rot", name: { he: "צימוד וגלגל תנופה", en: "Coupling & flywheel" }, text: { he: "מוסתרים בבית הפעמון; אסור להסיר כיסויים כשהמערכת יכולה להסתובב.", en: "Hidden in the bell housing; never remove covers while it can rotate." } },
  { id: "altfan", x: 545, y: 150, kind: "rot", name: { he: "מאוורר אלטרנטור", en: "Alternator fan" }, text: { he: "מושך אוויר דרך פתחי הקצה — אין להכניס חפצים.", en: "Draws air through the end openings — keep objects away." } },
  { id: "manifold", x: 260, y: 205, kind: "hot", name: { he: "סעפת פליטה", en: "Exhaust manifold" }, text: { he: "חם מאוד בזמן ריצה ונשאר חם זמן רב אחרי עצירה.", en: "Very hot while running and stays hot long after stopping." } },
  { id: "turbo", x: 330, y: 215, kind: "hot", name: { he: "טורבו", en: "Turbocharger" }, text: { he: "מהמשטחים החמים ביותר — סכנת כוויה והצתת דלק.", en: "Among the hottest surfaces — burn and fuel-ignition risk." } },
  { id: "pipe", x: 330, y: 265, kind: "hot", name: { he: "צנרת פליטה ומשתיק", en: "Exhaust pipe & silencer" }, text: { he: "חלקים לא מבודדים מהווים סכנת כוויה ומקור הצתה.", en: "Uninsulated sections are a burn hazard and ignition source." } },
  { id: "cap", x: 105, y: 70, kind: "press", name: { he: "מכסה רדיאטור", en: "Radiator cap" }, text: { he: "נוזל קירור חם בלחץ — אין לפתוח במנוע חם.", en: "Hot pressurised coolant — never open on a hot engine." } },
];

export function RotatingDiagram() {
  const { t } = useI18n();
  const [sel, setSel] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);
  const s = spots.find((x) => x.id === sel);
  const color = (k: string) => (k === "rot" ? "#3fb0ff" : k === "hot" ? "#ff4d4d" : "#ffc531");
  return (
    <DiagramFrame
      states={[
        { value: "auto", label: { he: "מצב AUTO — התנעה אפשרית", en: "AUTO — may start" } },
        { value: "loto", label: { he: "מבודד ונעול (LOTO)", en: "Isolated & locked (LOTO)" } },
      ]}
      value={auto ? "auto" : "loto"}
      onChange={(v) => setAuto(v === "auto")}
      status={
        s
          ? { tone: s.kind === "rot" ? "info" : "danger", text: s.text }
          : auto
            ? { tone: "danger", text: { he: "במצב AUTO הגנרטור עשוי להתניע ללא אזהרה. לחצו על אזורי הסיכון בתרשים (מבט על).", en: "In AUTO the set may start without warning. Click the hazard zones in the top-view drawing." } }
            : { tone: "ok", text: { he: "הגנרטור מבודד ונעול — החלקים לא יסתובבו. משטחים עדיין עשויים להיות חמים!", en: "Set isolated and locked — parts won't rotate. Surfaces may still be hot!" } }
      }
    >
      <svg viewBox="0 0 640 300" className="w-full">
        {/* top view of genset */}
        <rect x={60} y={40} width={540} height={220} rx={10} fill="#0f1a30" stroke="#24477a" />
        <rect x={85} y={65} width={40} height={170} rx={4} fill="#1a2433" stroke="#7d8da3" />
        <circle cx={150} cy={150} r={55} fill="none" stroke="#3fb0ff" strokeWidth={1.5} strokeDasharray="4 4" />
        <rect x={170} y={95} width={200} height={110} rx={8} fill="#2a2414" stroke="#a07c34" />
        <text x={270} y={155} textAnchor="middle" fontSize={12} fill="#d6b56b">ENGINE</text>
        <rect x={420} y={100} width={130} height={100} rx={40} fill="#14243a" stroke="#2c4a66" />
        <text x={485} y={155} textAnchor="middle" fontSize={12} fill="#7cc8ff">ALTERNATOR</text>
        <path d="M200 205 H360 V270" stroke="#5b4a40" strokeWidth={10} fill="none" />
        {auto && (
          <g transform="translate(320 25)">
            <rect x={-120} y={-14} width={240} height={26} rx={6} fill="#3a0a0a" stroke="#ff4d4d" />
            <text y={4} textAnchor="middle" fontSize={11} fill="#fecaca" fontWeight="bold" className="animate-blink">
              ⚠ AUTOMATIC START — KEEP CLEAR
            </text>
          </g>
        )}
        {spots.map((p) => (
          <g key={p.id} transform={`translate(${p.x} ${p.y})`} onClick={() => setSel(p.id)} style={{ cursor: "pointer" }}>
            {(p.kind !== "rot" || auto) && <circle r={18} fill={color(p.kind)} opacity={0.15} className="animate-pulse" />}
            <circle r={10} fill={sel === p.id ? color(p.kind) : "#060b16"} stroke={color(p.kind)} strokeWidth={2} />
            <text y={4} textAnchor="middle" fontSize={10} fill={sel === p.id ? "#060b16" : color(p.kind)} fontWeight="bold">
              {p.kind === "rot" ? "↻" : p.kind === "hot" ? "♨" : "P"}
            </text>
          </g>
        ))}
        {s && (
          <text x={320} y={292} textAnchor="middle" fontSize={12} fill="#e2e8f0" fontWeight="bold">
            {t(s.name)}
          </text>
        )}
      </svg>
    </DiagramFrame>
  );
}
