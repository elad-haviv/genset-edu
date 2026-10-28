"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PageHeader, Disclaimer, Segmented } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n, type L } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import type { CalculatorId } from "@/content/calculators";

const SQ3 = Math.sqrt(3);
const fmt = (v: number, d = 1) => (Number.isFinite(v) ? v.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d }) : "—");

const list: { id: CalculatorId; title: L; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { id: "power3ph", title: { he: "הספק, זרם ומתח תלת-פאזי", en: "Three-phase power, current & voltage" }, icon: "bolt" },
  { id: "kwkva", title: { he: "המרת kW ↔ kVA", en: "kW ↔ kVA conversion" }, icon: "layers" },
  { id: "pf", title: { he: "מקדם הספק ומשולש ההספקים", en: "Power factor & power triangle" }, icon: "gauge" },
  { id: "loading", title: { he: "אחוז העמסת גנרטור", en: "Generator loading percentage" }, icon: "alert" },
  { id: "demand", title: { he: "הערכת ביקוש עומס (מושגי)", en: "Conceptual load demand estimate" }, icon: "list" },
  { id: "redundancy", title: { he: "השוואת קיבולת ויתירות", en: "Redundancy capacity comparison" }, icon: "sld" },
];

export default function CalculatorsPage() {
  const { t } = useI18n();
  const { markVisited, addToList, progress } = useProgress();
  const [id, setId] = useState<CalculatorId>("power3ph");
  useEffect(() => markVisited("calculators"), [markVisited]);
  const used = () => addToList("calculators", id);

  return (
    <div>
      <PageHeader
        icon="calc"
        kicker={{ he: "מודול 09 · חישובים", en: "Module 09 · Calculations" }}
        title={{ he: "מחשבונים הנדסיים לימודיים", en: "Educational Engineering Calculators" }}
        subtitle={{
          he: "כל מחשבון מציג את הנוסחה, היחידות, ההנחות והמגבלות — כדי להבין את החישוב, לא רק לקבל מספר.",
          en: "Each calculator shows its formula, units, assumptions and limitations — to understand the calculation, not just get a number.",
        }}
      />
      <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
        <nav className="panel h-fit p-2 lg:sticky lg:top-6">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {list.map((c) => (
              <button
                key={c.id}
                onClick={() => setId(c.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm transition ${id === c.id ? "bg-volt-500/15 text-white ring-1 ring-volt-400/30" : "text-slate-400 hover:bg-white/[0.04]"}`}
              >
                <Icon name={c.icon} className="h-4 w-4 shrink-0" />
                <span className="flex-1">{t(c.title)}</span>
                {progress.calculators.includes(c.id) && <Icon name="check" className="h-3.5 w-3.5 text-ok" />}
              </button>
            ))}
          </div>
        </nav>
        <div className="space-y-4" onInput={used} onClick={(e) => (e.target as HTMLElement).closest("button[role=tab]") && used()}>
          {id === "power3ph" && <Power3ph />}
          {id === "kwkva" && <KwKva />}
          {id === "pf" && <PowerFactor />}
          {id === "loading" && <Loading />}
          {id === "demand" && <Demand />}
          {id === "redundancy" && <Redundancy />}
          <Disclaimer variant="calc" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- shared UI */

function Field({ label, unit, value, onChange, step = 1, min = 0, max }: { label: L; unit: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number }) {
  const { t } = useI18n();
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-slate-300">{t(label)}</span>
      <div className="flex items-center gap-2" dir="ltr">
        <input type="number" className="input font-mono" value={Number.isFinite(value) ? value : ""} step={step} min={min} max={max} onChange={(e) => onChange(parseFloat(e.target.value))} />
        <span className="w-12 shrink-0 font-mono text-xs text-slate-400">{unit}</span>
      </div>
    </label>
  );
}

function Out({ label, value, unit, tone }: { label: L; value: string; unit: string; tone?: "ok" | "warn" | "danger" }) {
  const { t } = useI18n();
  const c = tone === "danger" ? "text-danger" : tone === "warn" ? "text-amber-400" : tone === "ok" ? "text-ok" : "text-white";
  return (
    <div className="panel-inset p-4">
      <div className="label">{t(label)}</div>
      <div className="mt-1 flex items-baseline gap-1.5" dir="ltr">
        <span className={`font-mono text-2xl font-bold ${c}`}>{value}</span>
        <span className="font-mono text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-volt-400/20 bg-volt-500/5 px-4 py-3 font-mono text-sm leading-relaxed text-volt-300" dir="ltr">
      {children}
    </div>
  );
}

function Notes({ assumptions, limits }: { assumptions: L[]; limits: L[] }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="label mb-2">{t({ he: "הנחות", en: "Assumptions" })}</div>
        <ul className="list-disc space-y-1 ps-5 text-sm text-slate-300">
          {assumptions.map((a, i) => (
            <li key={i}>{t(a)}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
        <div className="label mb-2 text-amber-400">{t({ he: "מגבלות", en: "Limitations" })}</div>
        <ul className="list-disc space-y-1 ps-5 text-sm text-slate-300">
          {limits.map((a, i) => (
            <li key={i}>{t(a)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: L; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="panel space-y-5 p-5">
      <h2 className="text-xl font-bold text-white">{t(title)}</h2>
      {children}
    </section>
  );
}

const balanced: L = { he: "מערכת תלת-פאזית מאוזנת, צורת גל סינוסית", en: "Balanced three-phase system, sinusoidal waveforms" };
const noHarm: L = { he: "אינו מתחשב בהרמוניות, בחוסר איזון או במפלי מתח", en: "Does not account for harmonics, unbalance or voltage drop" };

/* ---------------------------------------------------------------- calculators */

function Power3ph() {
  const [mode, setMode] = useState<"fromI" | "fromP">("fromI");
  const [v, setV] = useState(400);
  const [i, setI] = useState(250);
  const [pf, setPf] = useState(0.8);
  const [p, setP] = useState(140);
  const S = mode === "fromI" ? (SQ3 * v * i) / 1000 : p / pf;
  const P = mode === "fromI" ? S * pf : p;
  const I = mode === "fromI" ? i : (p * 1000) / (SQ3 * v * pf);
  const Q = Math.sqrt(Math.max(0, S * S - P * P));
  return (
    <Card title={{ he: "הספק, זרם ומתח תלת-פאזי", en: "Three-phase power, current & voltage" }}>
      <Segmented
        size="sm"
        value={mode}
        onChange={setMode}
        options={[
          { value: "fromI", label: { he: "מזרם → הספק", en: "Current → power" } },
          { value: "fromP", label: { he: "מהספק → זרם", en: "Power → current" } },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={{ he: "מתח שלוב V(L-L)", en: "Line voltage V(L-L)" }} unit="V" value={v} onChange={setV} />
        {mode === "fromI" ? <Field label={{ he: "זרם קו I", en: "Line current I" }} unit="A" value={i} onChange={setI} /> : <Field label={{ he: "הספק פעיל P", en: "Active power P" }} unit="kW" value={p} onChange={setP} />}
        <Field label={{ he: "מקדם הספק cos φ", en: "Power factor cos φ" }} unit="" value={pf} onChange={setPf} step={0.01} max={1} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Out label={{ he: "הספק פעיל P", en: "Active power P" }} value={fmt(P)} unit="kW" />
        <Out label={{ he: "הספק מדומה S", en: "Apparent power S" }} value={fmt(S)} unit="kVA" />
        <Out label={{ he: "הספק עיוור Q", en: "Reactive power Q" }} value={fmt(Q)} unit="kvar" />
        <Out label={{ he: "זרם קו I", en: "Line current I" }} value={fmt(I)} unit="A" />
      </div>
      <Formula>
        S = √3 · V<sub>LL</sub> · I &nbsp;&nbsp;|&nbsp;&nbsp; P = S · cos φ &nbsp;&nbsp;|&nbsp;&nbsp; Q = √(S² − P²) &nbsp;&nbsp;|&nbsp;&nbsp; I = P / (√3 · V<sub>LL</sub> · cos φ)
      </Formula>
      <Notes
        assumptions={[balanced, { he: "V הוא מתח שלוב (בין פאזות), I הוא זרם קו", en: "V is line-to-line voltage, I is line current" }]}
        limits={[noHarm, { he: "אינו מחליף חישוב חתך כבל, הגנות או מפל מתח", en: "Not a substitute for cable sizing, protection or voltage-drop calculation" }]}
      />
    </Card>
  );
}

function KwKva() {
  const [dir, setDir] = useState<"kva2kw" | "kw2kva">("kva2kw");
  const [val, setVal] = useState(625);
  const [pf, setPf] = useState(0.8);
  const res = dir === "kva2kw" ? val * pf : val / pf;
  return (
    <Card title={{ he: "המרת kW ↔ kVA", en: "kW ↔ kVA conversion" }}>
      <Segmented
        size="sm"
        value={dir}
        onChange={setDir}
        options={[
          { value: "kva2kw", label: "kVA → kW" },
          { value: "kw2kva", label: "kW → kVA" },
        ]}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dir === "kva2kw" ? { he: "הספק מדומה", en: "Apparent power" } : { he: "הספק פעיל", en: "Active power" }} unit={dir === "kva2kw" ? "kVA" : "kW"} value={val} onChange={setVal} />
        <Field label={{ he: "מקדם הספק", en: "Power factor" }} unit="" value={pf} onChange={setPf} step={0.01} max={1} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Out label={dir === "kva2kw" ? { he: "הספק פעיל", en: "Active power" } : { he: "הספק מדומה", en: "Apparent power" }} value={fmt(res)} unit={dir === "kva2kw" ? "kW" : "kVA"} />
      </div>
      <Formula>P [kW] = S [kVA] · cos φ &nbsp;&nbsp;⇔&nbsp;&nbsp; S [kVA] = P [kW] / cos φ</Formula>
      <Notes
        assumptions={[{ he: "דירוגי גנרטורים מוצגים לרוב ב-kVA במקדם הספק 0.8 — יש לבדוק בגיליון הנתונים", en: "Generator ratings are commonly quoted in kVA at 0.8 PF — check the datasheet" }]}
        limits={[
          { he: "המנוע מוגבל ב-kW והאלטרנטור ב-kVA (זרם) — שני הגבולות חייבים להתקיים", en: "The engine is limited in kW and the alternator in kVA (current) — both limits must be respected" },
          { he: "מקדם הספק קיבולי (מוביל) דורש בדיקה מול עקום היכולת של האלטרנטור", en: "Leading (capacitive) PF requires checking against the alternator capability curve" },
        ]}
      />
    </Card>
  );
}

function PowerFactor() {
  const [p, setP] = useState(400);
  const [q, setQ] = useState(300);
  const s = Math.hypot(p, q);
  const pf = s > 0 ? p / s : 0;
  const phi = (Math.atan2(q, p) * 180) / Math.PI;
  const scale = 220 / Math.max(p, q, 1);
  return (
    <Card title={{ he: "מקדם הספק ומשולש ההספקים", en: "Power factor & power triangle" }}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <Field label={{ he: "הספק פעיל P", en: "Active power P" }} unit="kW" value={p} onChange={setP} />
          <Field label={{ he: "הספק עיוור Q (השראי)", en: "Reactive power Q (inductive)" }} unit="kvar" value={q} onChange={setQ} />
          <div className="grid grid-cols-3 gap-2">
            <Out label={{ he: "S", en: "S" }} value={fmt(s, 0)} unit="kVA" />
            <Out label={{ he: "cos φ", en: "cos φ" }} value={fmt(pf, 3)} unit="" tone={pf < 0.8 ? "warn" : "ok"} />
            <Out label={{ he: "φ", en: "φ" }} value={fmt(phi, 1)} unit="°" />
          </div>
        </div>
        <div className="panel-inset grid place-items-center p-3" dir="ltr">
          <svg viewBox="0 0 280 260" className="w-full max-w-sm">
            <line x1={30} y1={230} x2={30 + p * scale} y2={230} stroke="#2fd47a" strokeWidth={4} />
            <line x1={30 + p * scale} y1={230} x2={30 + p * scale} y2={230 - q * scale} stroke="#ffb547" strokeWidth={4} />
            <line x1={30} y1={230} x2={30 + p * scale} y2={230 - q * scale} stroke="#3fb0ff" strokeWidth={4} />
            <path d={`M70 230 A40 40 0 0 0 ${30 + 40 * Math.cos((phi * Math.PI) / 180)} ${230 - 40 * Math.sin((phi * Math.PI) / 180)}`} stroke="#e2e8f0" fill="none" />
            <text x={30 + (p * scale) / 2} y={250} fill="#2fd47a" fontSize={12} textAnchor="middle" fontFamily="monospace">
              P {fmt(p, 0)} kW
            </text>
            <text x={36 + p * scale} y={230 - (q * scale) / 2} fill="#ffb547" fontSize={12} fontFamily="monospace">
              Q
            </text>
            <text x={20 + (p * scale) / 2} y={220 - (q * scale) / 2} fill="#3fb0ff" fontSize={12} textAnchor="end" fontFamily="monospace">
              S
            </text>
            <text x={80} y={222} fill="#e2e8f0" fontSize={11}>
              φ
            </text>
          </svg>
        </div>
      </div>
      <Formula>
        S = √(P² + Q²) &nbsp;|&nbsp; cos φ = P / S &nbsp;|&nbsp; φ = arctan(Q / P)
      </Formula>
      <Notes
        assumptions={[balanced, { he: "עומס השראי (מנועים, שנאים) — Q חיובי", en: "Inductive load (motors, transformers) — positive Q" }]}
        limits={[noHarm, { he: "עם הרמוניות, מקדם ההספק האמיתי שונה ממקדם ההספק של ההרמוניה הבסיסית (cos φ)", en: "With harmonics, true power factor differs from displacement power factor (cos φ)" }]}
      />
    </Card>
  );
}

function Loading() {
  const { t } = useI18n();
  const [kva, setKva] = useState(625);
  const [kwR, setKwR] = useState(500);
  const [lkw, setLkw] = useState(380);
  const [lkva, setLkva] = useState(470);
  const kwPct = (lkw / kwR) * 100;
  const kvaPct = (lkva / kva) * 100;
  const worst = Math.max(kwPct, kvaPct);
  const tone = (v: number) => (v > 100 ? "danger" : v > 85 ? "warn" : "ok");
  return (
    <Card title={{ he: "אחוז העמסת גנרטור", en: "Generator loading percentage" }}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label={{ he: "דירוג גנרטור (kVA)", en: "Set rating (kVA)" }} unit="kVA" value={kva} onChange={setKva} />
        <Field label={{ he: "דירוג גנרטור (kW)", en: "Set rating (kW)" }} unit="kW" value={kwR} onChange={setKwR} />
        <Field label={{ he: "עומס בפועל (kW)", en: "Actual load (kW)" }} unit="kW" value={lkw} onChange={setLkw} />
        <Field label={{ he: "עומס בפועל (kVA)", en: "Actual load (kVA)" }} unit="kVA" value={lkva} onChange={setLkva} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Out label={{ he: "העמסת kW (מנוע)", en: "kW loading (engine)" }} value={fmt(kwPct)} unit="%" tone={tone(kwPct)} />
        <Out label={{ he: "העמסת kVA (אלטרנטור)", en: "kVA loading (alternator)" }} value={fmt(kvaPct)} unit="%" tone={tone(kvaPct)} />
        <Out label={{ he: "הגבול הקובע", en: "Governing limit" }} value={fmt(worst)} unit="%" tone={tone(worst)} />
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/5">
        <div className={`h-full rounded-full transition-all ${worst > 100 ? "bg-danger" : worst > 85 ? "bg-amber-400" : "bg-ok"}`} style={{ width: `${Math.min(100, worst)}%` }} />
      </div>
      {worst < 30 && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
          {t({
            he: "עומס נמוך לאורך זמן בגנרטור דיזל עלול לגרום ל-Wet stacking (הצטברות דלק לא שרוף בפליטה). יש לבדוק את הנחיית היצרן לגבי עומס מינימלי והפעלות בעומס.",
            en: "Prolonged light loading of a diesel set can cause wet stacking (unburnt fuel in the exhaust). Check the manufacturer's guidance on minimum load and load exercising.",
          })}
        </p>
      )}
      <Formula>Loading_kW = P_load / P_rated × 100% &nbsp;|&nbsp; Loading_kVA = S_load / S_rated × 100%</Formula>
      <Notes
        assumptions={[{ he: "הדירוגים לפי מצב ההפעלה הרלוונטי (STANDBY / PRIME / COP)", en: "Ratings for the relevant duty (STANDBY / PRIME / COP)" }]}
        limits={[
          { he: "לא כולל ירידת הספק (Derating) בגובה ובטמפרטורה — לפי היצרן", en: "Excludes altitude and temperature derating — per manufacturer" },
          { he: "לא בודק יכולת קבלת עומס פתאומי (Load step) או התנעת מנועים", en: "Doesn't check load-step acceptance or motor starting" },
        ]}
      />
    </Card>
  );
}

type Row = { name: string; kw: number; df: number };

function Demand() {
  const { t } = useI18n();
  const [rows, setRows] = useState<Row[]>([
    { name: "HVAC", kw: 180, df: 0.8 },
    { name: "Lighting", kw: 60, df: 0.9 },
    { name: "Pumps", kw: 75, df: 0.7 },
    { name: "IT / UPS", kw: 90, df: 1 },
  ]);
  const [pf, setPf] = useState(0.85);
  const [margin, setMargin] = useState(15);
  const connected = rows.reduce((s, r) => s + (r.kw || 0), 0);
  const demand = rows.reduce((s, r) => s + (r.kw || 0) * (r.df || 0), 0);
  const withMargin = demand * (1 + margin / 100);
  const update = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: k === "name" ? v : parseFloat(v) } : r)));
  return (
    <Card title={{ he: "הערכת ביקוש עומס (מושגי)", en: "Conceptual load demand estimate" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-xs text-slate-400">
              <th className="p-2 text-start">{t({ he: "צרכן", en: "Load" })}</th>
              <th className="p-2 text-start">{t({ he: "הספק מותקן (kW)", en: "Installed (kW)" })}</th>
              <th className="p-2 text-start">{t({ he: "מקדם ביקוש (0–1)", en: "Demand factor (0–1)" })}</th>
              <th className="p-2 text-start">{t({ he: "ביקוש (kW)", en: "Demand (kW)" })}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-white/[0.05]">
                <td className="p-1.5">
                  <input className="input" value={r.name} onChange={(e) => update(i, "name", e.target.value)} />
                </td>
                <td className="p-1.5">
                  <input className="input font-mono" type="number" value={Number.isFinite(r.kw) ? r.kw : ""} onChange={(e) => update(i, "kw", e.target.value)} />
                </td>
                <td className="p-1.5">
                  <input className="input font-mono" type="number" step={0.05} min={0} max={1} value={Number.isFinite(r.df) ? r.df : ""} onChange={(e) => update(i, "df", e.target.value)} />
                </td>
                <td className="p-1.5 font-mono text-volt-300">{fmt((r.kw || 0) * (r.df || 0))}</td>
                <td className="p-1.5">
                  <button className="btn-ghost !p-1.5" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label={t({ he: "הסר", en: "Remove" })}>
                    <Icon name="x" className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-ghost text-xs" onClick={() => setRows((rs) => [...rs, { name: t({ he: "צרכן חדש", en: "New load" }), kw: 10, df: 1 }])}>
        + {t({ he: "הוסף צרכן", en: "Add load" })}
      </button>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={{ he: "מרווח לגדילה עתידית", en: "Future growth margin" }} unit="%" value={margin} onChange={setMargin} />
        <Field label={{ he: "מקדם הספק משוער", en: "Estimated power factor" }} unit="" value={pf} onChange={setPf} step={0.01} max={1} />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Out label={{ he: "הספק מחובר", en: "Connected load" }} value={fmt(connected, 0)} unit="kW" />
        <Out label={{ he: "ביקוש משוער", en: "Estimated demand" }} value={fmt(demand, 0)} unit="kW" />
        <Out label={{ he: "כולל מרווח", en: "With margin" }} value={fmt(withMargin, 0)} unit="kW" />
        <Out label={{ he: "הספק מדומה", en: "Apparent" }} value={fmt(withMargin / pf, 0)} unit="kVA" />
      </div>
      <Formula>P_demand = Σ (P_installed,i × DF_i) &nbsp;|&nbsp; P_design = P_demand × (1 + margin) &nbsp;|&nbsp; S = P_design / cos φ</Formula>
      <Notes
        assumptions={[{ he: "מקדמי הביקוש הם קלט של המשתמש — ערכי ברירת המחדל להמחשה בלבד, לא ערכים תקניים", en: "Demand factors are user inputs — defaults are illustrative only, not standard values" }]}
        limits={[
          { he: "אינו מתחשב בהתנעת מנועים, בעומסים לא-ליניאריים (UPS, VFD) ובתגובת הגנרטור לשלבי עומס", en: "Ignores motor starting, non-linear loads (UPS, VFD) and generator response to load steps" },
          { he: "בחירת גנרטור בפועל דורשת כלי בחירה של היצרן ותכנון מהנדס", en: "Actual set selection requires the manufacturer's sizing tools and engineering design" },
        ]}
      />
    </Card>
  );
}

function Redundancy() {
  const { t } = useI18n();
  const [load, setLoad] = useState(900);
  const [unit, setUnit] = useState(500);
  const opts = [1, 2, 3, 4];
  return (
    <Card title={{ he: "השוואת קיבולת ויתירות", en: "Redundancy capacity comparison" }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={{ he: "עומס נדרש", en: "Required load" }} unit="kW" value={load} onChange={setLoad} />
        <Field label={{ he: "דירוג גנרטור יחיד", en: "Single set rating" }} unit="kW" value={unit} onChange={setUnit} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" dir="ltr">
          <thead>
            <tr className="text-xs text-slate-400">
              <th className="p-2 text-left">{t({ he: "מס׳ גנרטורים", en: "Sets" })}</th>
              <th className="p-2 text-left">{t({ he: "קיבולת", en: "Capacity" })}</th>
              <th className="p-2 text-left">{t({ he: "העמסה רגילה", en: "Normal loading" })}</th>
              <th className="p-2 text-left">{t({ he: "אחרי אובדן יחידה", en: "After losing one" })}</th>
              <th className="p-2 text-left">{t({ he: "סיווג", en: "Class" })}</th>
            </tr>
          </thead>
          <tbody>
            {opts.map((n) => {
              const cap = n * unit;
              const normal = (load / cap) * 100;
              const after = n > 1 ? (load / ((n - 1) * unit)) * 100 : Infinity;
              const needed = Math.ceil(load / unit);
              const cls = n < needed ? "✗ < N" : n === needed ? "N" : `N+${n - needed}`;
              return (
                <tr key={n} className="border-t border-white/[0.05] font-mono">
                  <td className="p-2 text-white">{n}</td>
                  <td className="p-2">{cap} kW</td>
                  <td className={`p-2 ${normal > 100 ? "text-danger" : normal > 85 ? "text-amber-400" : "text-ok"}`}>{fmt(normal, 0)}%</td>
                  <td className={`p-2 ${after > 100 ? "text-danger" : after > 85 ? "text-amber-400" : "text-ok"}`}>{Number.isFinite(after) ? `${fmt(after, 0)}%` : "—"}</td>
                  <td className="p-2 font-bold text-volt-300">{cls}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Formula>N = ⌈P_load / P_unit⌉ &nbsp;|&nbsp; Loading = P_load / (n · P_unit) &nbsp;|&nbsp; N+1 ⇔ (n − 1) · P_unit ≥ P_load</Formula>
      <Notes
        assumptions={[{ he: "גנרטורים זהים עם חלוקת עומס שווה", en: "Identical sets with equal load sharing" }]}
        limits={[
          { he: "אינו כולל נקודות כשל משותפות, זמני סנכרון ויכולת קבלת עומס לאחר כשל", en: "Excludes common-mode failures, synchronising time and post-failure load acceptance" },
          { he: "רמת היתירות הנדרשת נקבעת לפי דרישות המתקן, הסטנדרטים הרלוונטיים וניתוח סיכונים", en: "Required redundancy level is set by facility requirements, relevant standards and risk analysis" },
        ]}
      />
    </Card>
  );
}
