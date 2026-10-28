"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, Disclaimer, Bullets, KindBadge, Feedback } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n, type L, type LList } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";

type ModeId = "standby" | "prime" | "continuous";

const modes: { id: ModeId; tag: string; iso: string; name: L; color: string; app: L; profile: L; limits: LList; examples: LList; reliability: L }[] = [
  {
    id: "standby",
    tag: "STANDBY",
    iso: "ESP",
    color: "#3fb0ff",
    name: { he: "גיבוי חירום", en: "Emergency standby" },
    app: { he: "אספקת חשמל בזמן הפסקת רשת בלבד, במתקן שבו הרשת היא המקור הרגיל.", en: "Power supply during utility outages only, where the utility is the normal source." },
    profile: { he: "עומס משתנה, שעות ריצה מעטות בשנה.", en: "Variable load, few running hours per year." },
    limits: {
      he: ["ISO 8528-1 מגדיר ESP לשימוש בהפסקות רשת או בבדיקות — עם מגבלת שעות שנתית (התקן מציין עד 200 שעות בשנה)", "ההספק הממוצע על פני 24 שעות מוגבל (בתקן: 70% מ-ESP אלא אם הוסכם אחרת עם יצרן המנוע)", "אין יכולת עומס-יתר מעל דירוג ה-ESP", "אינו מיועד לריצה מקבילה עם הרשת לצורך חיסכון אנרגיה"],
      en: ["ISO 8528-1 defines ESP for utility outages or testing — with an annual hours limit (the standard states up to 200 h per year)", "Average power over 24 h is limited (the standard: 70% of ESP unless otherwise agreed with the engine manufacturer)", "No overload capability above the ESP rating", "Not intended for paralleling with the utility for energy savings"],
    },
    examples: { he: ["בניין משרדים", "מערכות בטיחות חיים", "מתקני תקשורת עם רשת אמינה"], en: ["Office buildings", "Life-safety systems", "Telecom sites with reliable utility"] },
    reliability: { he: "הגנרטור כמעט לא רץ — לכן האמינות תלויה בתחזוקה, בבדיקות תקופתיות בעומס ובמצברים/דלק תקינים.", en: "The set rarely runs — so reliability depends on maintenance, periodic load testing and healthy batteries/fuel." },
  },
  {
    id: "prime",
    tag: "PRIME",
    iso: "PRP",
    color: "#ffb547",
    name: { he: "הספק עיקרי", en: "Prime power" },
    app: { he: "הגנרטור הוא המקור העיקרי (אין רשת או רשת לא אמינה), עם עומס משתנה.", en: "The generator is the main source (no or unreliable utility), with variable load." },
    profile: { he: "עומס משתנה, מספר שעות לא מוגבל בשנה.", en: "Variable load, unlimited hours per year." },
    limits: {
      he: ["שעות ריצה לא מוגבלות בעומס משתנה", "ההספק הממוצע על פני 24 שעות מוגבל (בתקן: 70% מ-PRP אלא אם הוסכם אחרת)", "יכולת עומס-יתר מוגבלת קיימת אצל חלק מהיצרנים — רק לפי גיליון הנתונים", "דירוג PRP נמוך מדירוג ה-ESP של אותו גנרטור"],
      en: ["Unlimited running hours at variable load", "Average power over 24 h is limited (the standard: 70% of PRP unless otherwise agreed)", "Limited overload capability is offered by some manufacturers — only per the datasheet", "PRP is lower than the ESP of the same generator set"],
    },
    examples: { he: ["אתרי כרייה ובנייה מרוחקים", "אזורים ללא רשת", "תעשייה עם רשת לא יציבה"], en: ["Remote mines and construction sites", "Off-grid areas", "Industry with unstable utility"] },
    reliability: { he: "שעות ריצה רבות = בלאי ותחזוקה תכופה. ביתירות (N+1) ניתן לבצע תחזוקה ללא הפסקה.", en: "Many running hours = wear and frequent maintenance. Redundancy (N+1) enables maintenance without interruption." },
  },
  {
    id: "continuous",
    tag: "CONTINUOUS",
    iso: "COP",
    color: "#2fd47a",
    name: { he: "הספק רציף", en: "Continuous power" },
    app: { he: "אספקה רציפה של עומס קבוע (בסיס) לאורך שעות לא מוגבלות.", en: "Continuous supply of a constant (base) load for unlimited hours." },
    profile: { he: "עומס קבוע (100% מ-COP), ללא הגבלת שעות.", en: "Constant load (100% of COP), unlimited hours." },
    limits: {
      he: ["מיועד לעומס קבוע — לא לעומס משתנה", "דירוג נמוך יותר מ-PRP — אותו מנוע ״עובד בנוחות״", "אין יכולת עומס-יתר"],
      en: ["Intended for constant load — not variable load", "Rating lower than PRP — the same engine 'works comfortably'", "No overload capability"],
    },
    examples: { he: ["תחנות כוח מקומיות לעומס בסיס", "אספקה רציפה לתהליך תעשייתי", "מתקני שאיבה בעומס קבוע"], en: ["Local base-load plants", "Continuous industrial process supply", "Constant-load pumping stations"] },
    reliability: { he: "עומס יציב מפחית מתחים תרמיים; התכנון כולל לרוב יתירות ותחזוקה מתוכננת.", en: "Stable load reduces thermal stresses; design usually includes redundancy and planned maintenance." },
  },
];

/** Illustrative ratings of one generator set — real ratios are manufacturer specific. */
const RATING = { standby: 550, prime: 500, continuous: 400 };

export default function ModesPage() {
  const { t, tl } = useI18n();
  const { addToList, markVisited, progress } = useProgress();
  const [sel, setSel] = useState<ModeId>("standby");
  const [base, setBase] = useState(220);
  const [peak, setPeak] = useState(430);
  const [peakH, setPeakH] = useState(6);
  const [hours, setHours] = useState(150);
  const [quiz, setQuiz] = useState<Record<string, ModeId>>({});

  useEffect(() => markVisited("modes"), [markVisited]);
  useEffect(() => addToList("modesViewed", sel), [sel, addToList]);

  const profile = useMemo(() => {
    // 24 hourly values: peak centred in the working day
    const start = Math.round(12 - peakH / 2);
    return Array.from({ length: 24 }, (_, h) => (h >= start && h < start + peakH ? peak : base));
  }, [base, peak, peakH]);
  const avg = profile.reduce((a, b) => a + b, 0) / 24;
  const max = Math.max(...profile);
  const variable = peak !== base;

  const checks = (m: ModeId) => {
    const r = RATING[m];
    const items: { ok: boolean; text: L }[] = [{ ok: max <= r, text: { he: `שיא ${max} kW ${max <= r ? "≤" : ">"} דירוג ${r} kW`, en: `Peak ${max} kW ${max <= r ? "≤" : ">"} rating ${r} kW` } }];
    if (m !== "continuous") items.push({ ok: avg <= 0.7 * r, text: { he: `ממוצע 24 ש׳ ${avg.toFixed(0)} kW = ${((avg / r) * 100).toFixed(0)}% (גבול התקן: 70%)`, en: `24 h average ${avg.toFixed(0)} kW = ${((avg / r) * 100).toFixed(0)}% (standard limit: 70%)` } });
    if (m === "standby") items.push({ ok: hours <= 200, text: { he: `${hours} שעות בשנה (ESP: עד 200 לפי התקן)`, en: `${hours} h/year (ESP: up to 200 per the standard)` } });
    if (m === "continuous") items.push({ ok: !variable, text: { he: variable ? "העומס משתנה — COP מיועד לעומס קבוע" : "עומס קבוע", en: variable ? "Load varies — COP is intended for constant load" : "Constant load" } });
    return items;
  };

  const W = 560;
  const H = 200;
  const ymax = 650;
  const y = (v: number) => H - 20 - (v / ymax) * (H - 40);
  const x = (h: number) => 40 + (h / 24) * (W - 60);
  const path = profile.map((v, h) => `${h === 0 ? "M" : "L"}${x(h)} ${y(v)} L${x(h + 1)} ${y(v)}`).join(" ");

  const apps: { id: string; text: L; answer: ModeId; why: L }[] = [
    { id: "a1", text: { he: "בית חולים עם רשת אמינה — גיבוי למקרה הפסקה", en: "Hospital with reliable utility — backup during outages" }, answer: "standby", why: { he: "הגנרטור פועל רק בהפסקות ובבדיקות.", en: "Runs only during outages and tests." } },
    { id: "a2", text: { he: "מחנה עבודה מרוחק ללא רשת, עומס משתנה לאורך היום", en: "Remote work camp with no utility, load varying through the day" }, answer: "prime", why: { he: "מקור עיקרי, שעות לא מוגבלות, עומס משתנה.", en: "Main source, unlimited hours, variable load." } },
    { id: "a3", text: { he: "תחנת שאיבה העובדת 24/7 בעומס קבוע", en: "Pumping station running 24/7 at constant load" }, answer: "continuous", why: { he: "עומס קבוע לאורך זמן בלתי מוגבל.", en: "Constant load for unlimited time." } },
  ];

  return (
    <div>
      <PageHeader
        icon="gauge"
        kicker={{ he: "מודול 06 · דירוגי הספק", en: "Module 06 · Power ratings" }}
        title={{ he: "מצבי הפעלה: STANDBY · PRIME · CONTINUOUS", en: "Operating Modes: STANDBY · PRIME · CONTINUOUS" }}
        subtitle={{
          he: "אותו גנרטור מקבל דירוגי הספק שונים לפי אופן השימוש. בנו פרופיל עומס יומי וראו כיצד הוא נבחן מול כל דירוג.",
          en: "The same generator carries different power ratings depending on duty. Build a daily load profile and see how it measures against each rating.",
        }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setSel(m.id)}
            className={`panel group p-5 text-start transition ${sel === m.id ? "ring-2" : "hover:-translate-y-0.5"}`}
            style={{ ["--tw-ring-color" as string]: m.color }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-black tracking-wider" style={{ color: m.color }}>
                {m.tag}
              </span>
              <span className="chip border-white/15 font-mono text-slate-300">ISO 8528-1 · {m.iso}</span>
            </div>
            <div className="mt-1 font-semibold text-white">{t(m.name)}</div>
            <p className="mt-2 text-sm text-slate-400">{t(m.app)}</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="font-mono text-3xl font-bold text-white">{RATING[m.id]}</span>
              <span className="pb-1 text-sm text-slate-400">kW*</span>
              {progress.modesViewed.includes(m.id) && <Icon name="check" className="mb-1.5 ms-auto h-4 w-4 text-ok" />}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full" style={{ width: `${(RATING[m.id] / 550) * 100}%`, background: m.color }} />
            </div>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {t({ he: "* ערכי kW להמחשה בלבד, עבור גנרטור דמיוני. היחסים בין הדירוגים משתנים בין יצרנים ודגמים.", en: "* kW values are illustrative only, for a hypothetical set. Ratios between ratings vary by manufacturer and model." })}
      </p>

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <section className="panel p-5">
          <div className="label mb-3">{t({ he: "בונה פרופיל עומס יומי", en: "Daily load-profile builder" })}</div>
          <div className="panel-inset p-2" dir="ltr">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              {[0, 100, 200, 300, 400, 500, 600].map((v) => (
                <g key={v}>
                  <line x1={40} x2={W - 20} y1={y(v)} y2={y(v)} stroke="#16294a" />
                  <text x={34} y={y(v) + 3} fontSize={9} fill="#5b6b82" textAnchor="end" fontFamily="monospace">
                    {v}
                  </text>
                </g>
              ))}
              {[0, 6, 12, 18, 24].map((h) => (
                <text key={h} x={x(h)} y={H - 4} fontSize={9} fill="#5b6b82" textAnchor="middle" fontFamily="monospace">
                  {h}:00
                </text>
              ))}
              {modes.map((m) => (
                <g key={m.id} opacity={sel === m.id ? 1 : 0.35}>
                  <line x1={40} x2={W - 20} y1={y(RATING[m.id])} y2={y(RATING[m.id])} stroke={m.color} strokeWidth={sel === m.id ? 2 : 1} strokeDasharray="6 4" />
                  <text x={W - 22} y={y(RATING[m.id]) - 4} fontSize={9} fill={m.color} textAnchor="end" fontFamily="monospace">
                    {m.tag}
                  </text>
                </g>
              ))}
              {sel !== "continuous" && <line x1={40} x2={W - 20} y1={y(0.7 * RATING[sel])} y2={y(0.7 * RATING[sel])} stroke="#ff9a1f" strokeWidth={1} opacity={0.6} />}
              <path d={`${path} L${x(24)} ${y(0)} L${x(0)} ${y(0)} Z`} fill="rgba(30,144,255,.18)" />
              <path d={path} stroke="#7cc8ff" strokeWidth={2.5} fill="none" />
              <line x1={40} x2={W - 20} y1={y(avg)} y2={y(avg)} stroke="#e2e8f0" strokeDasharray="2 3" />
              <text x={44} y={y(avg) - 4} fontSize={9} fill="#e2e8f0" fontFamily="monospace">
                AVG {avg.toFixed(0)} kW
              </text>
            </svg>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Slider label={{ he: "עומס בסיס", en: "Base load" }} unit="kW" min={0} max={600} step={10} value={base} onChange={setBase} />
            <Slider label={{ he: "עומס שיא", en: "Peak load" }} unit="kW" min={0} max={650} step={10} value={peak} onChange={setPeak} />
            <Slider label={{ he: "משך השיא ביום", en: "Peak duration per day" }} unit="h" min={0} max={24} step={1} value={peakH} onChange={setPeakH} />
            <Slider label={{ he: "שעות ריצה בשנה", en: "Running hours per year" }} unit="h" min={10} max={8760} step={10} value={hours} onChange={setHours} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {modes.map((m) => {
              const c = checks(m.id);
              const ok = c.every((x) => x.ok);
              return (
                <div key={m.id} className={`rounded-xl border p-3 ${ok ? "border-ok/30 bg-ok/5" : "border-danger/30 bg-danger/5"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold" style={{ color: m.color }}>
                      {m.tag}
                    </span>
                    <Icon name={ok ? "check" : "x"} className={`h-4 w-4 ${ok ? "text-ok" : "text-danger"}`} />
                  </div>
                  <ul className="mt-2 space-y-1">
                    {c.map((x, i) => (
                      <li key={i} className={`text-xs ${x.ok ? "text-slate-300" : "text-red-200"}`}>
                        {x.ok ? "✓" : "✗"} {t(x.text)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <button className="btn-ghost mt-3 text-xs" onClick={() => addToList("modesViewed", "profile")}>
            <Icon name="check" className="h-4 w-4" />
            {t({ he: "סמן שתרגלתי את בונה הפרופיל", en: "Mark profile exercise done" })}
          </button>
        </section>

        <aside className="flex flex-col gap-4">
          {modes
            .filter((m) => m.id === sel)
            .map((m) => (
              <div key={m.id} className="panel animate-fadeUp space-y-4 p-5">
                <div>
                  <span className="font-mono text-lg font-black" style={{ color: m.color }}>
                    {m.tag}
                  </span>
                  <span className="ms-2 text-white">{t(m.name)}</span>
                </div>
                <div>
                  <div className="label mb-1">{t({ he: "פרופיל עומס", en: "Load profile" })}</div>
                  <p className="text-sm text-slate-300">{t(m.profile)}</p>
                </div>
                <div>
                  <div className="label mb-2">{t({ he: "מגבלות הפעלה", en: "Operating limitations" })}</div>
                  <Bullets items={tl(m.limits)} tone="amber" />
                </div>
                <div>
                  <div className="label mb-2">{t({ he: "יישומים טיפוסיים", en: "Typical applications" })}</div>
                  <Bullets items={tl(m.examples)} />
                </div>
                <div>
                  <div className="label mb-1">{t({ he: "השלכות לאמינות", en: "Reliability implications" })}</div>
                  <p className="text-sm text-slate-300">{t(m.reliability)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <KindBadge kind="regulation" />
                  <KindBadge kind="manufacturer" />
                </div>
                <p className="text-xs text-slate-500">
                  {t({
                    he: "ההגדרות מבוססות על ISO 8528-1. יש לאמת מול המהדורה העדכנית של התקן ומול גיליון הנתונים של היצרן — המונחים והמגבלות משתנים בין יצרנים.",
                    en: "Definitions are based on ISO 8528-1. Verify against the current edition of the standard and the manufacturer's datasheet — terminology and limits vary between manufacturers.",
                  })}
                </p>
              </div>
            ))}
          <div className="panel p-5">
            <div className="label mb-3">{t({ he: "התאימו דירוג ליישום", en: "Match the rating to the application" })}</div>
            <div className="space-y-3">
              {apps.map((a) => (
                <div key={a.id}>
                  <p className="text-sm text-slate-200">{t(a.text)}</p>
                  <div className="mt-1.5 flex gap-1.5">
                    {modes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setQuiz((q) => ({ ...q, [a.id]: m.id }))}
                        className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${quiz[a.id] === m.id ? (m.id === a.answer ? "border-ok/60 bg-ok/15 text-ok" : "border-danger/60 bg-danger/15 text-red-300") : "border-white/10 text-slate-400"}`}
                      >
                        {m.tag}
                      </button>
                    ))}
                  </div>
                  {quiz[a.id] && (
                    <div className="mt-1.5">
                      <Feedback ok={quiz[a.id] === a.answer}>{t(a.why)}</Feedback>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Disclaimer variant="design" />
        </aside>
      </div>
    </div>
  );
}

function Slider({ label, unit, min, max, step, value, onChange }: { label: L; unit: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const { t } = useI18n();
  return (
    <label className="flex flex-col gap-1.5 text-sm text-slate-300">
      <span className="flex justify-between">
        <span>{t(label)}</span>
        <span className="font-mono text-volt-300" dir="ltr">
          {value} {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} dir="ltr" />
    </label>
  );
}
