"use client";

import { useEffect, useState } from "react";
import { PageHeader, Disclaimer, Bullets, KindBadge, Feedback, Segmented } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { safetyTopics, safetyExercises, type DiagramKey } from "@/content/safety";
import { TouchDiagram } from "@/components/diagrams/TouchDiagram";
import { EarthingDiagram } from "@/components/diagrams/EarthingDiagram";
import { RCDDiagram } from "@/components/diagrams/RCDDiagram";
import { OvercurrentDiagram } from "@/components/diagrams/OvercurrentDiagram";
import { IsolationDiagram } from "@/components/diagrams/IsolationDiagram";
import { LotoExercise } from "@/components/diagrams/LotoExercise";
import { BackfeedDiagram } from "@/components/diagrams/BackfeedDiagram";
import { EStopDiagram, FireDiagram, BoundaryDiagram, RotatingDiagram } from "@/components/diagrams/MiscDiagrams";

function Diagram({ k, state, onLoto }: { k: DiagramKey; state?: string; onLoto: (ok: boolean) => void }) {
  switch (k) {
    case "touch":
      return <TouchDiagram initial={state} />;
    case "earthing":
      return <EarthingDiagram initial={state} />;
    case "rcd":
      return <RCDDiagram />;
    case "overcurrent":
      return <OvercurrentDiagram initial={state} />;
    case "isolation":
      return <IsolationDiagram />;
    case "loto":
      return <LotoExercise onComplete={onLoto} />;
    case "backfeed":
      return <BackfeedDiagram />;
    case "estop":
      return <EStopDiagram />;
    case "fire":
      return <FireDiagram />;
    case "boundary":
      return <BoundaryDiagram />;
    case "rotating":
      return <RotatingDiagram />;
  }
}

export default function SafetyPage() {
  const { t, tl } = useI18n();
  const { progress, addToList, markVisited, update } = useProgress();
  const [view, setView] = useState<"topics" | "exercises">("topics");
  const [id, setId] = useState(safetyTopics[0].id);
  const topic = safetyTopics.find((x) => x.id === id)!;

  useEffect(() => markVisited("safety"), [markVisited]);
  useEffect(() => {
    if (view === "topics") addToList("safetyTopics", id);
  }, [id, view, addToList]);

  const recordExercise = (exId: string, ok: boolean) => update((p) => ({ ...p, safetyExercises: { ...p.safetyExercises, [exId]: p.safetyExercises[exId] || ok } }));

  const idx = safetyTopics.findIndex((x) => x.id === id);
  const viewed = new Set(progress.safetyTopics);

  return (
    <div>
      <PageHeader
        icon="bolt"
        kicker={{ he: "מודול 03 · בטיחות חשמל", en: "Module 03 · Electrical safety" }}
        title={{ he: "מרכז למידת בטיחות חשמל", en: "Electrical Safety Learning Center" }}
        subtitle={{
          he: "16 נושאים עם דיאגרמות מונפשות המציגות מצב תקין, מצב תקלה ותגובת ההגנה — ותרגילי החלטה מבוססי תרחיש.",
          en: "16 topics with animated diagrams showing normal conditions, fault conditions and the protective response — plus scenario-based decision exercises.",
        }}
        actions={
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "topics", label: { he: "נושאים ודיאגרמות", en: "Topics & diagrams" }, icon: "bolt" },
              { value: "exercises", label: { he: "תרגילי החלטה", en: "Decision exercises" }, icon: "target" },
            ]}
          />
        }
      />

      {view === "topics" ? (
        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <nav className="panel h-fit p-2 lg:sticky lg:top-6">
            <div className="flex gap-1 overflow-x-auto lg:flex-col">
              {safetyTopics.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setId(s.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm transition ${
                    id === s.id ? "bg-volt-500/15 text-white ring-1 ring-volt-400/30" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">{t(s.title)}</span>
                  {viewed.has(s.id) && <Icon name="check" className="h-3.5 w-3.5 text-ok" />}
                </button>
              ))}
            </div>
          </nav>

          <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <section className="panel p-5" key={topic.id}>
              <div className="label text-volt-300/80">{t({ he: "סימולציה מושגית", en: "Conceptual simulation" })}</div>
              <h2 className="mb-4 mt-1 text-xl font-bold text-white">{t(topic.title)}</h2>
              <Diagram k={topic.diagram} state={topic.diagramState} onLoto={(ok) => recordExercise("loto", ok)} />
            </section>
            <section className="panel flex flex-col gap-4 p-5">
              <p className="text-[15px] leading-relaxed text-slate-200">{t(topic.summary)}</p>
              <Bullets items={tl(topic.points)} />
              <div className="space-y-2.5 border-t border-white/[0.06] pt-4">
                {topic.notes.map((n, i) => (
                  <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <KindBadge kind={n.kind} />
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{t(n.text)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex justify-between gap-2 pt-2">
                <button className="btn-ghost text-xs" disabled={idx === 0} onClick={() => setId(safetyTopics[idx - 1].id)}>
                  {t({ he: "הקודם", en: "Previous" })}
                </button>
                <button className="btn-primary text-xs" disabled={idx === safetyTopics.length - 1} onClick={() => setId(safetyTopics[idx + 1].id)}>
                  {t({ he: "הנושא הבא", en: "Next topic" })}
                </button>
              </div>
              <Disclaimer />
            </section>
          </div>
        </div>
      ) : (
        <Exercises done={progress.safetyExercises} onAnswer={recordExercise} />
      )}
    </div>
  );
}

function Exercises({ done, onAnswer }: { done: Record<string, boolean>; onAnswer: (id: string, ok: boolean) => void }) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const correctCount = safetyExercises.filter((e) => answers[e.id] === e.correct).length;
  const answered = Object.keys(answers).length;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        {safetyExercises.map((ex, i) => {
          const a = answers[ex.id];
          const has = a !== undefined;
          return (
            <div key={ex.id} className="panel p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/15 font-mono text-sm font-bold text-amber-400">{i + 1}</span>
                <p className="pt-1 font-medium text-slate-100">{t(ex.scenario)}</p>
              </div>
              <div className="mt-4 grid gap-2">
                {ex.options.map((o, oi) => {
                  const chosen = a === oi;
                  const right = has && oi === ex.correct;
                  return (
                    <button
                      key={oi}
                      disabled={has}
                      onClick={() => {
                        setAnswers((s) => ({ ...s, [ex.id]: oi }));
                        onAnswer(ex.id, oi === ex.correct);
                      }}
                      className={`rounded-xl border px-4 py-2.5 text-start text-sm transition ${
                        right ? "border-ok/50 bg-ok/10 text-emerald-100" : chosen ? "border-danger/50 bg-danger/10 text-red-100" : has ? "border-white/5 text-slate-500" : "border-white/10 text-slate-300 hover:border-volt-400/50 hover:bg-volt-500/10"
                      }`}
                    >
                      {t(o)}
                    </button>
                  );
                })}
              </div>
              {has && (
                <div className="mt-3">
                  <Feedback ok={a === ex.correct}>{t(ex.explain)}</Feedback>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <aside className="space-y-4">
        <div className="panel sticky top-20 p-5">
          <div className="label">{t({ he: "ציון בסבב הנוכחי", en: "This round" })}</div>
          <div className="mt-2 font-mono text-4xl font-bold text-white">
            {correctCount}
            <span className="text-xl text-slate-500">/{safetyExercises.length}</span>
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {answered}/{safetyExercises.length} {t({ he: "נענו", en: "answered" })} · {Object.values(done).filter(Boolean).length} {t({ he: "נפתרו נכון אי-פעם", en: "ever solved correctly" })}
          </div>
          <button className="btn-ghost mt-4 w-full text-xs" onClick={() => setAnswers({})}>
            <Icon name="reset" className="h-4 w-4" />
            {t({ he: "התחל סבב חדש", en: "New round" })}
          </button>
        </div>
        <Disclaimer />
      </aside>
    </div>
  );
}
