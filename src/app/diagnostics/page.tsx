"use client";

import { useEffect, useState } from "react";
import { PageHeader, Disclaimer, Bullets, Feedback, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { faultScenarios, type FaultScenario } from "@/content/faults";
import { ControllerDisplay, type CtrlRow } from "@/components/ControllerDisplay";

function rows(s: FaultScenario): CtrlRow[] {
  const r = s.readings;
  return [
    { label: "GEN V", value: String(r.v), unit: "V", tone: r.v === 0 ? "dim" : r.v < 395 ? "warn" : "ok" },
    { label: "FREQ", value: r.hz.toFixed(1), unit: "Hz", tone: r.hz === 0 ? "dim" : r.hz < 49.5 ? "warn" : "ok" },
    { label: "RPM", value: String(r.rpm), tone: r.rpm === 0 ? "dim" : "ok" },
    { label: "LOAD", value: String(r.kw), unit: `kW ${r.pct}%`, tone: r.pct > 100 ? "danger" : "ok" },
    { label: "OIL P", value: r.oil.toFixed(1), unit: "bar", tone: s.id === "oil" ? "danger" : r.oil === 0 ? "dim" : "ok" },
    { label: "COOLANT", value: String(r.h2o), unit: "°C", tone: r.h2o > 100 ? "danger" : r.h2o > 90 ? "warn" : "ok" },
    { label: "BATT", value: r.batt.toFixed(1), unit: "V", tone: r.batt < 24.5 ? "warn" : "ok" },
    { label: "FUEL", value: String(r.fuel), unit: "%", tone: r.fuel < 20 ? "warn" : "ok" },
  ];
}

export default function DiagnosticsPage() {
  const { t, tl } = useI18n();
  const { progress, recordDiagnostic, markVisited } = useProgress();
  const [id, setId] = useState(faultScenarios[0].id);
  const [stage, setStage] = useState(0);
  const [meaning, setMeaning] = useState<number | null>(null);
  const [cats, setCats] = useState<number[]>([]);
  const [catsDone, setCatsDone] = useState(false);
  const [prio, setPrio] = useState<number | null>(null);

  const s = faultScenarios.find((x) => x.id === id)!;
  useEffect(() => markVisited("diagnostics"), [markVisited]);

  const reset = (newId?: string) => {
    if (newId) setId(newId);
    setStage(0);
    setMeaning(null);
    setCats([]);
    setCatsDone(false);
    setPrio(null);
  };

  const catScore = (() => {
    const good = cats.filter((c) => s.categories.correct.includes(c)).length;
    const bad = cats.filter((c) => !s.categories.correct.includes(c)).length;
    return Math.max(0, (good - bad) / s.categories.correct.length);
  })();
  const score = Math.round((meaning === s.meaning.correct ? 30 : 0) + catScore * 40 + (prio === s.priority.correct ? 30 : 0));

  useEffect(() => {
    if (stage === 4) recordDiagnostic(s.id, score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const stages = [
    { he: "התראה", en: "Alarm" },
    { he: "משמעות", en: "Meaning" },
    { he: "קטגוריות", en: "Categories" },
    { he: "עדיפות בטוחה", en: "Safe priority" },
    { he: "סיכום", en: "Debrief" },
  ];

  return (
    <div>
      <PageHeader
        icon="alert"
        kicker={{ he: "מודול 08 · אבחון", en: "Module 08 · Diagnostics" }}
        title={{ he: "אבחון תקלות אינטראקטיבי", en: "Interactive Fault Diagnosis" }}
        subtitle={{
          he: "קראו את ההתראה בבקר, פענחו את משמעותה, בחרו קטגוריות תקלה אפשריות וקבעו מה הצעד הבטוח הראשון. אין כאן התערבות בציוד פועל — רק חשיבה אבחונית.",
          en: "Read the controller alarm, interpret it, select plausible fault categories and decide the safe first step. No intervention in running equipment — diagnostic reasoning only.",
        }}
      />

      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <nav className="panel h-fit p-2 lg:sticky lg:top-6">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {faultScenarios.map((f) => {
              const best = progress.diagnostics[f.id];
              return (
                <button
                  key={f.id}
                  onClick={() => reset(f.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm transition ${id === f.id ? "bg-volt-500/15 text-white ring-1 ring-volt-400/30" : "text-slate-400 hover:bg-white/[0.04]"}`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${f.level === "warn" ? "bg-amber-400" : "bg-danger"}`} />
                  <span className="flex-1">{t(f.title)}</span>
                  {best !== undefined && <span className={`font-mono text-[10px] ${best >= 80 ? "text-ok" : "text-amber-400"}`}>{best}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="grid gap-5 2xl:grid-cols-[420px_minmax(0,1fr)]">
          <div className="space-y-4">
            <ControllerDisplay
              mode="AUTO"
              status={s.readings.rpm > 0 ? "RUNNING" : s.level === "warn" ? "STANDBY" : "LOCKED OUT"}
              alarm={{ level: s.level, text: s.alarm }}
              rows={rows(s)}
              leds={[
                { label: "MAINS", on: s.id !== "start", color: "green" },
                { label: "GEN", on: s.readings.rpm > 0, color: "green" },
                { label: "WARN", on: s.level === "warn", color: "amber", blink: true },
                { label: "SHUTDOWN", on: s.level === "shutdown", color: "red", blink: true },
                { label: "TRIP", on: s.level === "trip", color: "red", blink: true },
              ]}
            />
            <div className="panel p-4">
              <div className="flex items-center justify-between">
                <span className="label">{t({ he: "קוד התראה", en: "Alarm code" })}</span>
                <span className="font-mono text-sm text-amber-400">{s.code}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{t(s.context)}</p>
            </div>
          </div>

          <section className="panel p-5">
            <div className="mb-5 flex items-center gap-2">
              {stages.map((st, i) => (
                <div key={i} className="flex flex-1 flex-col gap-1">
                  <div className={`h-1.5 rounded-full ${i < stage ? "bg-volt-500" : i === stage ? "bg-amber-400" : "bg-white/10"}`} />
                  <span className={`hidden text-[10px] sm:block ${i === stage ? "text-amber-300" : "text-slate-500"}`}>{t(st)}</span>
                </div>
              ))}
            </div>

            {stage === 0 && (
              <div className="animate-fadeUp space-y-4">
                <h2 className="text-xl font-bold text-white">{t(s.title)}</h2>
                <p className="text-slate-300">{t({ he: "עיינו בתצוגת הבקר: מצב, נוריות ופרמטרים. מה ההתראה אומרת לכם?", en: "Study the controller: status, LEDs and parameters. What is the alarm telling you?" })}</p>
                <button className="btn-primary" onClick={() => setStage(1)}>
                  {t({ he: "התחל אבחון", en: "Start diagnosis" })}
                </button>
              </div>
            )}

            {stage === 1 && (
              <Step
                q={{ he: "מה משמעות ההתראה?", en: "What does the alarm mean?" }}
                options={s.meaning.options}
                correct={s.meaning.correct}
                value={meaning}
                onPick={setMeaning}
                explain={s.meaning.explain}
                onNext={() => setStage(2)}
              />
            )}

            {stage === 2 && (
              <div className="animate-fadeUp space-y-3">
                <h3 className="text-lg font-semibold text-white">{t({ he: "אילו קטגוריות תקלה אפשריות? (בחירה מרובה)", en: "Which fault categories are plausible? (multi-select)" })}</h3>
                <div className="grid gap-2">
                  {s.categories.options.map((o, i) => {
                    const on = cats.includes(i);
                    const right = s.categories.correct.includes(i);
                    return (
                      <button
                        key={i}
                        disabled={catsDone}
                        onClick={() => setCats((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-start text-sm transition ${
                          catsDone
                            ? right
                              ? "border-ok/50 bg-ok/10 text-emerald-100"
                              : on
                                ? "border-danger/50 bg-danger/10 text-red-100"
                                : "border-white/5 text-slate-500"
                            : on
                              ? "border-volt-400/60 bg-volt-500/15 text-white"
                              : "border-white/10 text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <span className={`grid h-4 w-4 place-items-center rounded border ${on ? "border-volt-400 bg-volt-500" : "border-white/30"}`}>{on && <Icon name="check" className="h-3 w-3 text-white" />}</span>
                        {t(o)}
                      </button>
                    );
                  })}
                </div>
                {!catsDone ? (
                  <button className="btn-primary" disabled={cats.length === 0} onClick={() => setCatsDone(true)}>
                    {t({ he: "בדוק", en: "Check" })}
                  </button>
                ) : (
                  <>
                    <Feedback ok={catScore >= 0.99}>{t(s.categories.explain)}</Feedback>
                    <button className="btn-primary" onClick={() => setStage(3)}>
                      {t({ he: "המשך", en: "Continue" })}
                    </button>
                  </>
                )}
              </div>
            )}

            {stage === 3 && (
              <Step
                q={{ he: "מהו הצעד הראשון הבטוח והנכון?", en: "What is the safe and correct first step?" }}
                options={s.priority.options}
                correct={s.priority.correct}
                value={prio}
                onPick={setPrio}
                explain={s.priority.explain}
                onNext={() => setStage(4)}
              />
            )}

            {stage === 4 && (
              <div className="animate-fadeUp space-y-5">
                <div className="flex items-center gap-4">
                  <div className={`grid h-20 w-20 place-items-center rounded-2xl border-2 font-mono text-2xl font-bold ${score >= 80 ? "border-ok text-ok" : score >= 50 ? "border-amber-400 text-amber-400" : "border-danger text-danger"}`}>{score}</div>
                  <div>
                    <div className="text-lg font-bold text-white">{t({ he: "סיכום תרחיש", en: "Scenario debrief" })}</div>
                    <div className="text-sm text-slate-400">
                      {t({ he: "משמעות", en: "Meaning" })} {meaning === s.meaning.correct ? 30 : 0}/30 · {t({ he: "קטגוריות", en: "Categories" })} {Math.round(catScore * 40)}/40 · {t({ he: "עדיפות", en: "Priority" })} {prio === s.priority.correct ? 30 : 0}/30
                    </div>
                    <div className="mt-2 w-56">
                      <ProgressBar value={score} tone={score >= 80 ? "ok" : "amber"} />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-volt-400/20 bg-volt-500/5 p-4">
                  <div className="label mb-2 text-volt-300">{t({ he: "מה בעל מקצוע מוסמך יבדוק", en: "What a qualified professional should verify" })}</div>
                  <Bullets items={tl(s.verify)} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-ghost" onClick={() => reset()}>
                    <Icon name="reset" className="h-4 w-4" />
                    {t({ he: "נסו שוב", en: "Retry" })}
                  </button>
                  {faultScenarios.findIndex((f) => f.id === id) < faultScenarios.length - 1 && (
                    <button className="btn-primary" onClick={() => reset(faultScenarios[faultScenarios.findIndex((f) => f.id === id) + 1].id)}>
                      {t({ he: "לתרחיש הבא", en: "Next scenario" })}
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="mt-6">
              <Disclaimer />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Step({
  q,
  options,
  correct,
  value,
  onPick,
  explain,
  onNext,
}: {
  q: { he: string; en: string };
  options: { he: string; en: string }[];
  correct: number;
  value: number | null;
  onPick: (i: number) => void;
  explain: { he: string; en: string };
  onNext: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="animate-fadeUp space-y-3">
      <h3 className="text-lg font-semibold text-white">{t(q)}</h3>
      <div className="grid gap-2">
        {options.map((o, i) => (
          <button
            key={i}
            disabled={value !== null}
            onClick={() => onPick(i)}
            className={`rounded-xl border px-4 py-2.5 text-start text-sm transition ${
              value !== null && i === correct ? "border-ok/50 bg-ok/10 text-emerald-100" : value === i ? "border-danger/50 bg-danger/10 text-red-100" : value !== null ? "border-white/5 text-slate-500" : "border-white/10 text-slate-300 hover:border-volt-400/50 hover:bg-volt-500/10"
            }`}
          >
            {t(o)}
          </button>
        ))}
      </div>
      {value !== null && (
        <>
          <Feedback ok={value === correct}>{t(explain)}</Feedback>
          <button className="btn-primary" onClick={onNext}>
            {t({ he: "המשך", en: "Continue" })}
          </button>
        </>
      )}
    </div>
  );
}
