"use client";

import { useState } from "react";
import { COL, DiagramFrame } from "./common";
import { Icon } from "@/components/icons";
import { useI18n, type L } from "@/lib/i18n";

type Src = { id: string; name: L; why: L; x: number; y: number };

const sources: Src[] = [
  { id: "utility", name: { he: "הזנת רשת דרך ה-ATS", en: "Utility supply via ATS" }, why: { he: "הלוח והמפסק עשויים להיות מוזנים מהרשת גם כשהגנרטור עצור.", en: "Switchboard and breaker may be fed from the utility even when the set is stopped." }, x: 90, y: 60 },
  { id: "gen", name: { he: "מוצא הגנרטור", en: "Generator output" }, why: { he: "כל עוד הגנרטור עשוי להסתובב — יש מתח בהדקים.", en: "Whenever the set may rotate — its terminals are live." }, x: 90, y: 150 },
  { id: "batt", name: { he: "מצברים — התנעה אוטומטית", en: "Batteries — automatic start" }, why: { he: "במצב AUTO, אובדן רשת או הפעלת ניסיון יתניעו את המנוע.", en: "In AUTO, a mains loss or scheduled exercise will crank the engine." }, x: 90, y: 240 },
  { id: "charger", name: { he: "הזנת AC למטען", en: "Charger AC supply" }, why: { he: "מתח רשת בתוך ארון הבקרה, בנפרד מהמפסק הראשי.", en: "Mains voltage inside the control cabinet, separate from the main breaker." }, x: 550, y: 60 },
  { id: "heater", name: { he: "מחממי בלוק ונגד-עיבוי", en: "Jacket & anti-condensation heaters" }, why: { he: "מעגלי AC נפרדים שנשארים מחוברים גם בגנרטור עצור.", en: "Separate AC circuits that remain energised with the set stopped." }, x: 550, y: 150 },
  { id: "remote", name: { he: "פקודת התנעה מרחוק (BMS)", en: "Remote start signal (BMS)" }, why: { he: "מערכת חיצונית יכולה לשלוח פקודת התנעה.", en: "An external system can issue a start command." }, x: 550, y: 240 },
];

export function IsolationDiagram() {
  const { t } = useI18n();
  const [iso, setIso] = useState<Record<string, boolean>>({});
  const [locked, setLocked] = useState(false);
  const [verified, setVerified] = useState(false);
  const remaining = sources.filter((s) => !iso[s.id]).length;

  const toggle = (id: string) => {
    if (locked) return;
    setIso((s) => ({ ...s, [id]: !s[id] }));
    setVerified(false);
  };

  const status =
    remaining > 0
      ? { tone: "danger" as const, text: { he: `עדיין ${remaining} מקורות אנרגיה פעילים — אסור להתחיל עבודה.`, en: `${remaining} energy source(s) still active — work must not start.` } }
      : !locked
        ? { tone: "warn" as const, text: { he: "כל המקורות נותקו — עכשיו נעילה ותיוג אישיים, כדי שאף אחד לא יחזיר אותם.", en: "All sources disconnected — now apply personal locks and tags so nobody restores them." } }
        : !verified
          ? { tone: "warn" as const, text: { he: "ננעל ותויג. נותר: וידוא העדר מתח ע״י אדם מוסמך במכשיר בדיקה תקין (בדיקת המכשיר לפני ואחרי).", en: "Locked and tagged. Remaining: verify absence of voltage by a qualified person with a proven tester (prove before and after)." } }
          : { tone: "ok" as const, text: { he: "בידוד הושלם ברמת העיקרון: כל המקורות מנותקים, נעולים, מתויגים ומוודאים. רק עכשיו — עבודה לפי נוהל.", en: "Isolation complete in principle: all sources disconnected, locked, tagged and verified. Only now — work per procedure." } };

  return (
    <DiagramFrame
      status={status}
      caption={{ he: "לחצו על כל מקור אנרגיה כדי לנתק אותו. שימו לב שגנרטור במתקן אינו ״מכשיר אחד עם תקע אחד״.", en: "Click each energy source to isolate it. Note that an installed generator is not 'one appliance with one plug'." }}
      extra={
        <div className="flex flex-wrap gap-2">
          <button className="btn border border-amber-500/40 text-xs text-amber-300" disabled={remaining > 0 || locked} onClick={() => setLocked(true)}>
            <Icon name="lock" className="h-4 w-4" />
            {t({ he: "נעילה ותיוג", en: "Lock & tag" })}
          </button>
          <button className="btn border border-ok/40 text-xs text-emerald-200" disabled={!locked || verified} onClick={() => setVerified(true)}>
            <Icon name="check" className="h-4 w-4" />
            {t({ he: "וידוא העדר מתח", en: "Verify absence of voltage" })}
          </button>
          <button
            className="btn border border-white/10 text-xs text-slate-300"
            onClick={() => {
              setIso({});
              setLocked(false);
              setVerified(false);
            }}
          >
            <Icon name="reset" className="h-4 w-4" />
            {t({ he: "איפוס", en: "Reset" })}
          </button>
        </div>
      }
    >
      <svg viewBox="0 0 640 300" className="w-full">
        {/* generator in the middle */}
        <g transform="translate(320 150)">
          <rect x={-90} y={-55} width={180} height={110} rx={12} fill="#141d2c" stroke={remaining === 0 ? COL.PE : "#ff9a1f"} strokeWidth={2} />
          <text y={-12} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#e2e8f0">GENSET</text>
          <text y={10} textAnchor="middle" fontSize={11} fill={COL.text}>
            {remaining === 0 ? t({ he: "מבודד", en: "ISOLATED" }) : t({ he: "מחושמל / עלול להתניע", en: "LIVE / MAY START" })}
          </text>
          {locked && (
            <g transform="translate(0 32)">
              <rect x={-30} y={-10} width={60} height={20} rx={4} fill="#ff9a1f" />
              <text y={4} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#060b16">
                LOCKED
              </text>
            </g>
          )}
        </g>
        {sources.map((s) => {
          const off = !!iso[s.id];
          const left = s.x < 320;
          const x2 = left ? 230 : 410;
          return (
            <g key={s.id} onClick={() => toggle(s.id)} style={{ cursor: locked ? "default" : "pointer" }}>
              <path d={`M${left ? s.x + 70 : s.x - 70} ${s.y} H${(s.x + x2) / 2} V150 H${x2}`} stroke={off ? COL.dim : "#ffb547"} strokeWidth={2.5} fill="none" className={off ? "" : "flow-slow"} strokeDasharray={off ? "4 6" : undefined} />
              <rect x={s.x - 70} y={s.y - 24} width={140} height={48} rx={10} fill={off ? "#0f1a30" : "#2a1c0a"} stroke={off ? COL.PE : "#ffb547"} strokeWidth={1.5} />
              <foreignObject x={s.x - 66} y={s.y - 22} width={132} height={44}>
                <div className="flex h-full items-center justify-center text-center text-[10.5px] leading-tight" style={{ color: off ? "#86efac" : "#fde68a" }}>
                  {t(s.name)}
                </div>
              </foreignObject>
              {off && locked && <text x={s.x + (left ? 62 : -62)} y={s.y - 16} fontSize={12} textAnchor="middle">🔒</text>}
            </g>
          );
        })}
      </svg>
      <div className="grid gap-1.5 p-2 sm:grid-cols-2" dir="auto">
        {sources.map((s) => (
          <div key={s.id} className={`text-xs ${iso[s.id] ? "text-slate-500 line-through" : "text-slate-400"}`}>
            <b className="text-slate-300">{t(s.name)}:</b> {t(s.why)}
          </div>
        ))}
      </div>
    </DiagramFrame>
  );
}
