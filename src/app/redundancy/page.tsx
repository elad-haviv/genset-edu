"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader, Disclaimer, KindBadge, Feedback } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n, type L } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";

type Group = { id: "critical" | "essential" | "general"; name: L; color: string };
const groups: Group[] = [
  { id: "critical", name: { he: "קריטי", en: "Critical" }, color: "#ff4d4d" },
  { id: "essential", name: { he: "חיוני", en: "Essential" }, color: "#ffc531" },
  { id: "general", name: { he: "כללי", en: "General" }, color: "#2fd47a" },
];

type Spof = "none" | "fuel" | "bus";

function binom(n: number, k: number) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - i + 1)) / i;
  return r;
}

export default function RedundancyPage() {
  const { t } = useI18n();
  const { addToList, markVisited, progress } = useProgress();
  const [n, setN] = useState(2);
  const [rating, setRating] = useState(500);
  const [loads, setLoads] = useState({ critical: 200, essential: 250, general: 150 });
  const [failed, setFailed] = useState<number[]>([]);
  const [shedding, setShedding] = useState(true);
  const [spof, setSpof] = useState<Spof>("none");
  const [avail, setAvail] = useState(0.97);

  useEffect(() => markVisited("redundancy"), [markVisited]);

  const total = loads.critical + loads.essential + loads.general;
  const healthy = spof !== "none" ? 0 : n - failed.filter((f) => f < n).length;
  const capacity = healthy * rating;

  const result = useMemo(() => {
    if (healthy === 0) return { supplied: [] as Group["id"][], state: "blackout" as const, perUnit: 0 };
    if (total <= capacity) return { supplied: groups.map((g) => g.id), state: "ok" as const, perUnit: total / healthy };
    if (!shedding) return { supplied: [] as Group["id"][], state: "collapse" as const, perUnit: 0 };
    const order: Group["id"][] = ["critical", "essential", "general"];
    const supplied: Group["id"][] = [];
    let sum = 0;
    for (const g of order) {
      if (sum + loads[g] <= capacity) {
        supplied.push(g);
        sum += loads[g];
      } else break;
    }
    return { supplied, state: supplied.length ? ("shed" as const) : ("collapse" as const), perUnit: sum / healthy };
  }, [healthy, total, capacity, shedding, loads]);

  const needed = Math.ceil(total / rating);
  const nPlus1 = (n - 1) * rating >= total;
  const sysAvail = useMemo(() => {
    let p = 0;
    for (let k = needed; k <= n; k++) p += binom(n, k) * avail ** k * (1 - avail) ** (n - k);
    return needed > n ? 0 : p;
  }, [n, needed, avail]);

  const preset = (kind: "2prime" | "n1") => {
    setSpof("none");
    setFailed([]);
    setShedding(true);
    if (kind === "2prime") {
      setN(2);
      setRating(500);
      setLoads({ critical: 200, essential: 250, general: 150 });
      addToList("redundancyExperiments", "preset-2prime");
    } else {
      setN(3);
      setRating(500);
      setLoads({ critical: 300, essential: 350, general: 250 });
      addToList("redundancyExperiments", "preset-n1");
    }
  };

  const toggleFail = (i: number) => {
    setFailed((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
    addToList("redundancyExperiments", "fail-unit");
  };

  const statusText: Record<typeof result.state, { tone: boolean; text: L }> = {
    ok: { tone: true, text: { he: `כל העומסים מוזנים. כל גנרטור נושא ${result.perUnit.toFixed(0)} kW (${((result.perUnit / rating) * 100).toFixed(0)}% מהדירוג) — חלוקת עומס שווה.`, en: `All loads supplied. Each set carries ${result.perUnit.toFixed(0)} kW (${((result.perUnit / rating) * 100).toFixed(0)}% of rating) — equal load sharing.` } },
    shed: { tone: false, text: { he: `הקיבולת הזמינה (${capacity} kW) קטנה מהעומס (${total} kW). פריקת עומסים לפי עדיפות שמרה על העומסים החשובים; כל גנרטור ב-${((result.perUnit / rating) * 100).toFixed(0)}%.`, en: `Available capacity (${capacity} kW) is below the load (${total} kW). Priority load shedding kept the important loads; each set at ${((result.perUnit / rating) * 100).toFixed(0)}%.` } },
    collapse: { tone: false, text: { he: `עומס-יתר: ${total} kW על ${capacity} kW זמינים, ללא פריקת עומסים. התדר והמתח קורסים וההגנות מנתקות — אובדן אספקה מלא.`, en: `Overload: ${total} kW on ${capacity} kW available, with no load shedding. Frequency and voltage collapse and protections trip — total loss of supply.` } },
    blackout: { tone: false, text: spof !== "none" ? { he: "כשל בנקודת כשל יחידה (SPOF) השבית את כל הגנרטורים בבת אחת — היתירות לא עזרה.", en: "A single-point-of-failure took out all generators at once — redundancy did not help." } : { he: "אין גנרטורים זמינים — אובדן אספקה.", en: "No generators available — loss of supply." } },
  };

  const W = 640;
  const unitX = (i: number) => 80 + (i * (W - 160)) / Math.max(1, n - 1);
  const busLive = result.state === "ok" || result.state === "shed";

  return (
    <div>
      <PageHeader
        icon="layers"
        kicker={{ he: "מודול 07 · אמינות", en: "Module 07 · Reliability" }}
        title={{ he: "אמינות, יתירות וגנרטורים במקביל", en: "Reliability, Redundancy & Paralleled Generators" }}
        subtitle={{
          he: "הגדירו מתקן עם מספר גנרטורים על פס משותף. לחצו על גנרטור כדי להכשיל אותו, והפעילו/כבו פריקת עומסים כדי לראות את ההשפעה על רציפות האספקה.",
          en: "Configure a multi-set installation on a common bus. Click a generator to fail it, and toggle load shedding to see the effect on continuity of supply.",
        }}
        actions={
          <>
            <button className="btn-accent" onClick={() => preset("2prime")}>
              <Icon name="play" className="h-4 w-4" />
              {t({ he: "דוגמה: 2 גנרטורי PRIME זהים", en: "Example: 2 identical PRIME sets" })}
            </button>
            <button className="btn-ghost" onClick={() => preset("n1")}>
              N+1 · 3×500 kW
            </button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <section className="panel p-4">
            <div className="panel-inset p-2" dir="ltr">
              <svg viewBox={`0 0 ${W} 330`} className="w-full">
                {/* loads */}
                {groups.map((g, i) => {
                  const on = result.supplied.includes(g.id);
                  const gx = 120 + i * 200;
                  return (
                    <g key={g.id}>
                      <path d={`M${gx} 70 V42`} stroke={on ? "#ffb547" : "#3a4558"} strokeWidth={3} className={on ? "flow" : ""} />
                      <rect x={gx - 70} y={6} width={140} height={36} rx={8} fill={on ? "rgba(255,181,71,.12)" : "#0f1a30"} stroke={g.color} strokeWidth={1.5} opacity={on ? 1 : 0.45} />
                      <text x={gx} y={22} textAnchor="middle" fontSize={11} fill={on ? "#fff" : "#5b6b82"}>
                        {t(g.name)}
                      </text>
                      <text x={gx} y={36} textAnchor="middle" fontSize={11} fill={on ? g.color : "#5b6b82"} fontFamily="monospace">
                        {loads[g.id]} kW {on ? "" : "✕"}
                      </text>
                    </g>
                  );
                })}
                {/* bus */}
                <rect x={40} y={70} width={W - 80} height={12} rx={4} fill={busLive ? "#ffb547" : result.state === "collapse" ? "#ff4d4d" : "#24324a"} style={{ filter: busLive ? "drop-shadow(0 0 8px #ffb547)" : undefined }} className={result.state === "collapse" ? "animate-blink" : ""} />
                <text x={W - 44} y={100} textAnchor="end" fontSize={10} fill="#9fb0c6" fontFamily="monospace">
                  COMMON BUS {spof === "bus" ? "— FAILED" : ""}
                </text>
                {spof === "bus" && <path d={`M${W / 2 - 14} 64 l28 24 M${W / 2 + 14} 64 l-28 24`} stroke="#ff4d4d" strokeWidth={4} />}
                {/* units */}
                {Array.from({ length: n }).map((_, i) => {
                  const down = failed.includes(i) || spof !== "none";
                  const pct = !down && busLive ? (result.perUnit / rating) * 100 : 0;
                  const ux = unitX(i);
                  return (
                    <g key={i} onClick={() => toggleFail(i)} style={{ cursor: "pointer" }}>
                      <path d={`M${ux} 82 V150`} stroke={!down && busLive ? "#ffb547" : "#3a4558"} strokeWidth={3} className={!down && busLive ? "flow-slow" : ""} />
                      <rect x={ux - 18} y={128} width={36} height={22} rx={4} fill="#0f1a30" stroke="#7d8da3" />
                      <line x1={ux - 10} y1={139} x2={ux + 8} y2={down ? 130 : 139} stroke="#e2e8f0" strokeWidth={2.5} />
                      <rect x={ux - 55} y={160} width={110} height={120} rx={12} fill={down ? "rgba(255,77,77,.08)" : "#0f1a30"} stroke={down ? "#ff4d4d" : "#ff9a1f"} strokeWidth={2} />
                      <circle cx={ux} cy={200} r={22} fill="#060b16" stroke={down ? "#ff4d4d" : "#ff9a1f"} strokeWidth={2} />
                      <g className={down ? "" : "animate-spin"} style={{ transformBox: "fill-box", transformOrigin: "center", animationDuration: "1.2s" }}>
                        <path d={`M${ux - 11} 200c4-8 7-8 11 0s7 8 11 0`} stroke={down ? "#ff4d4d" : "#ffb547"} strokeWidth={2} fill="none" />
                      </g>
                      <text x={ux} y={240} textAnchor="middle" fontSize={11} fill="#e2e8f0" fontWeight="bold">
                        G{i + 1} · {rating} kW
                      </text>
                      <rect x={ux - 40} y={250} width={80} height={8} rx={4} fill="#16243f" />
                      <rect x={ux - 40} y={250} width={Math.min(80, (pct / 100) * 80)} height={8} rx={4} fill={pct > 100 ? "#ff4d4d" : pct > 85 ? "#ffc531" : "#2fd47a"} style={{ transition: "width .5s" }} />
                      <text x={ux} y={272} textAnchor="middle" fontSize={10} fill={down ? "#ff4d4d" : "#9fb0c6"} fontFamily="monospace">
                        {down ? "FAILED" : `${pct.toFixed(0)}%`}
                      </text>
                      {down && <path d={`M${ux - 20} 180 l40 40 M${ux + 20} 180 l-40 40`} stroke="#ff4d4d" strokeWidth={3} opacity={0.8} />}
                    </g>
                  );
                })}
                {spof === "fuel" && (
                  <g>
                    <rect x={W / 2 - 60} y={296} width={120} height={26} rx={6} fill="rgba(255,77,77,.15)" stroke="#ff4d4d" />
                    <text x={W / 2} y={313} textAnchor="middle" fontSize={11} fill="#fecaca">
                      {t({ he: "מיכל דלק משותף — ריק", en: "Common fuel tank — empty" })}
                    </text>
                  </g>
                )}
              </svg>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">{t({ he: "לחצו על גנרטור כדי להכשיל / להחזיר אותו", en: "Click a generator to fail / restore it" })}</p>
          </section>

          <Feedback ok={statusText[result.state].tone}>{t(statusText[result.state].text)}</Feedback>

          <section className="panel grid gap-4 p-5 md:grid-cols-2">
            <Num label={{ he: "מספר גנרטורים", en: "Number of sets" }} value={n} min={2} max={4} step={1} onChange={(v) => { setN(v); setFailed([]); }} unit="" />
            <Num label={{ he: "דירוג PRIME לגנרטור", en: "PRIME rating per set" }} value={rating} min={100} max={1500} step={50} onChange={setRating} unit="kW" />
            {groups.map((g) => (
              <Num key={g.id} label={{ he: `עומס ${g.name.he}`, en: `${g.name.en} load` }} value={loads[g.id]} min={0} max={1500} step={10} onChange={(v) => setLoads((l) => ({ ...l, [g.id]: v }))} unit="kW" />
            ))}
            <div className="flex flex-col justify-end gap-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={shedding}
                  onChange={(e) => {
                    setShedding(e.target.checked);
                    addToList("redundancyExperiments", "shedding");
                  }}
                  className="h-4 w-4 accent-[#1e90ff]"
                />
                {t({ he: "פריקת עומסים לפי עדיפות (Load shedding)", en: "Priority load shedding" })}
              </label>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="panel p-5">
            <div className="label mb-3">{t({ he: "ניתוח תצורה", en: "Configuration analysis" })}</div>
            <dl className="space-y-2 text-sm">
              <Row k={{ he: "עומס כולל", en: "Total load" }} v={`${total} kW`} />
              <Row k={{ he: "קיבולת מותקנת", en: "Installed capacity" }} v={`${n * rating} kW`} />
              <Row k={{ he: "קיבולת זמינה כעת", en: "Available now" }} v={`${capacity} kW`} />
              <Row k={{ he: "גנרטורים נדרשים לעומס", en: "Sets needed for load" }} v={`${needed}`} />
              <Row k={{ he: "N+1 מתקיים?", en: "N+1 satisfied?" }} v={nPlus1 ? "✓" : "✗"} tone={nPlus1 ? "ok" : "bad"} />
            </dl>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              {t({
                he: "N+1: גם כשגנרטור אחד אינו זמין (תקלה או תחזוקה), הנותרים מסוגלים לשאת את כל העומס הנדרש.",
                en: "N+1: even with one set unavailable (fault or maintenance), the remaining sets can carry the full required load.",
              })}
            </p>
          </div>

          <div className="panel p-5">
            <div className="label mb-2">{t({ he: "זמינות מערכת (מושגי)", en: "System availability (conceptual)" })}</div>
            <label className="text-sm text-slate-300">
              <span className="flex justify-between">
                {t({ he: "זמינות גנרטור בודד A", en: "Single-set availability A" })}
                <span className="font-mono text-volt-300" dir="ltr">{avail.toFixed(3)}</span>
              </span>
              <input
                type="range"
                min={0.8}
                max={0.999}
                step={0.001}
                value={avail}
                onChange={(e) => {
                  setAvail(parseFloat(e.target.value));
                  addToList("redundancyExperiments", "availability");
                }}
                className="mt-2 w-full"
                dir="ltr"
              />
            </label>
            <div className="mt-3 rounded-lg bg-navy-950/60 p-3 font-mono text-xs text-slate-300" dir="ltr">
              A_sys = Σ<sub>k={needed}</sub><sup>{n}</sup> C({n},k)·A<sup>k</sup>·(1−A)<sup>{n}−k</sup>
              <div className="mt-2 text-lg font-bold text-white">{(sysAvail * 100).toFixed(3)}%</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <KindBadge kind="example" />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {t({
                he: "הנחות: כשלים בלתי תלויים, ללא כשלים משותפים (Common-mode), ללא התחשבות בזמן תיקון ובכשלי סנכרון. המודל ממחיש מגמה — לא חישוב אמינות הנדסי.",
                en: "Assumptions: independent failures, no common-mode failures, repair time and synchronising failures ignored. Illustrates a trend — not an engineering reliability study.",
              })}
            </p>
          </div>

          <div className="panel p-5">
            <div className="label mb-2">{t({ he: "נקודות כשל יחידות (SPOF)", en: "Single points of failure (SPOF)" })}</div>
            <div className="flex flex-col gap-2">
              {(
                [
                  ["none", { he: "ללא — מצב רגיל", en: "None — normal" }],
                  ["fuel", { he: "מיכל / אספקת דלק משותפת נכשלה", en: "Common fuel tank / supply fails" }],
                  ["bus", { he: "פס צבירה / לוח סנכרון משותף נכשל", en: "Common bus / paralleling switchboard fails" }],
                ] as [Spof, L][]
              ).map(([v, lbl]) => (
                <button
                  key={v}
                  onClick={() => {
                    setSpof(v);
                    if (v !== "none") addToList("redundancyExperiments", "spof");
                  }}
                  className={`rounded-lg border px-3 py-2 text-start text-sm ${spof === v ? (v === "none" ? "border-ok/50 bg-ok/10 text-emerald-100" : "border-danger/50 bg-danger/10 text-red-100") : "border-white/10 text-slate-300 hover:bg-white/5"}`}
                >
                  {t(lbl)}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              {t({
                he: "יתירות בגנרטורים לא מגינה מפני כשל ברכיב משותף. תכנון אמין בוחן גם מערכות דלק, בקרה, ATS, מצברים ופסי צבירה.",
                en: "Generator redundancy doesn't protect against a shared component failing. Reliable design also examines fuel, control, ATS, batteries and busbars.",
              })}
            </p>
          </div>
          <div className="panel p-4 text-xs text-slate-400">
            {t({ he: "ניסויים שבוצעו", en: "Experiments done" })}: {progress.redundancyExperiments.length}
          </div>
          <Disclaimer variant="design" />
        </aside>
      </div>
    </div>
  );
}

function Num({ label, value, min, max, step, onChange, unit }: { label: L; value: number; min: number; max: number; step: number; onChange: (v: number) => void; unit: string }) {
  const { t } = useI18n();
  return (
    <label className="flex flex-col gap-1.5 text-sm text-slate-300">
      <span className="flex justify-between">
        {t(label)}
        <span className="font-mono text-volt-300" dir="ltr">
          {value} {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} dir="ltr" />
    </label>
  );
}

function Row({ k, v, tone }: { k: L; v: string; tone?: "ok" | "bad" }) {
  const { t } = useI18n();
  return (
    <div className="flex justify-between border-b border-white/[0.05] pb-1.5">
      <dt className="text-slate-400">{t(k)}</dt>
      <dd dir="ltr" className={`font-mono font-semibold ${tone === "ok" ? "text-ok" : tone === "bad" ? "text-danger" : "text-white"}`}>{v}</dd>
    </div>
  );
}
