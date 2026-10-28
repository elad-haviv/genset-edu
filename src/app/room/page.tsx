"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader, Segmented, Disclaimer, Feedback, KindBadge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { useWebGL } from "@/lib/webgl";
import { roomHazards, roomGoodFeatures, roomChecklist } from "@/content/room";
import type { PickKind } from "@/components/three/RoomScene";

const RoomScene = dynamic(() => import("@/components/three/RoomScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-volt-500/30 border-t-volt-400" />
    </div>
  ),
});

type Picked = { kind: PickKind; id: string } | null;

export default function RoomPage() {
  const { t } = useI18n();
  const { progress, addToList, markVisited, update } = useProgress();
  const webgl = useWebGL();

  const [mode, setMode] = useState<"3d" | "checklist">("3d");
  const [scenario, setScenario] = useState<"A" | "B">("B");
  const [found, setFound] = useState<string[]>([]);
  const [misses, setMisses] = useState(0);
  const [hints, setHints] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [picked, setPicked] = useState<Picked>(null);
  const [airflow, setAirflow] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => markVisited("room"), [markVisited]);
  useEffect(() => {
    if (webgl === false) setMode("checklist");
  }, [webgl]);

  const onPick = useCallback(
    (kind: PickKind, id: string) => {
      setPicked({ kind, id });
      if (kind === "hazard") {
        setFound((f) => (f.includes(id) ? f : [...f, id]));
        addToList("roomFound", id);
        setHint((h) => (h === id ? null : h));
      } else if (kind === "good") {
        addToList("roomGoodViewed", id);
      } else {
        setMisses((m) => m + 1);
      }
    },
    [addToList],
  );

  const numberOf = useCallback((id: string) => found.indexOf(id) + 1, [found]);

  const restart = () => {
    setFound([]);
    setMisses(0);
    setHints(0);
    setHint(null);
    setPicked(null);
    setResetKey((k) => k + 1);
  };

  const giveHint = () => {
    const remaining = roomHazards.filter((h) => !found.includes(h.id));
    if (!remaining.length) return;
    const h = remaining[Math.floor(Math.random() * remaining.length)];
    setHint(h.id);
    setHints((n) => n + 1);
    setTimeout(() => setHint((x) => (x === h.id ? null : x)), 4500);
  };

  const total = roomHazards.length;
  const complete = found.length === total;
  const score = Math.max(0, found.length * 10 - misses * 2 - hints * 3);

  const hazard = picked?.kind === "hazard" ? roomHazards.find((h) => h.id === picked.id) : null;
  const good = picked?.kind === "good" ? roomGoodFeatures.find((g) => g.id === picked.id) : null;

  return (
    <div>
      <PageHeader
        icon="room"
        kicker={{ he: "מודול 02 · חדר גנרטור", en: "Module 02 · Generator room" }}
        title={{ he: "תכנון חדר גנרטור — זיהוי מפגעים", en: "Generator Room Design — Hazard Identification" }}
        subtitle={{
          he: "שני חדרים, אותו גנרטור. בתרחיש B הוסתרו 10 ליקויים הנדסיים ובטיחותיים — אתרו אותם בלחיצה. בתרחיש A ראו כיצד נראה הסדר תקין ברמת העיקרון.",
          en: "Two rooms, the same generator. Scenario B hides 10 engineering and safety deficiencies — find them by clicking. Scenario A shows what a sound arrangement looks like in principle.",
        }}
        actions={
          <Segmented
            size="sm"
            value={mode}
            onChange={setMode}
            options={[
              { value: "3d", label: { he: "חדר תלת-ממדי", en: "3D room" }, icon: "cube" },
              { value: "checklist", label: { he: "רשימת ביקורת נגישה", en: "Accessible checklist" }, icon: "list" },
            ]}
          />
        }
      />

      {mode === "checklist" ? (
        <Checklist onBest={(pct) => update((p) => ({ ...p, roomChecklistBest: Math.max(p.roomChecklistBest, pct) }))} best={progress.roomChecklistBest} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Segmented
                value={scenario}
                onChange={(v) => {
                  setScenario(v);
                  setPicked(null);
                  setHint(null);
                }}
                options={[
                  { value: "B", label: { he: "תרחיש B — חדר לא בטוח", en: "Scenario B — Unsafe room" }, icon: "warning" },
                  { value: "A", label: { he: "תרחיש A — חדר מתוכנן היטב", en: "Scenario A — Well designed" }, icon: "shield" },
                ]}
              />
            </div>

            <div className="panel relative h-[58vh] min-h-[400px] overflow-hidden !p-0 md:h-[68vh]">
              <RoomScene scenario={scenario} found={found} selected={picked?.id ?? null} hint={hint} airflow={airflow} onPick={onPick} numberOf={numberOf} resetKey={resetKey} />

              <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3">
                <div className={`rounded-xl border px-3 py-2 backdrop-blur ${scenario === "B" ? "border-danger/40 bg-danger/10" : "border-ok/40 bg-ok/10"}`}>
                  <div className="font-mono text-[10px] tracking-widest text-slate-400">{scenario === "B" ? "SCENARIO B · INSPECTION" : "SCENARIO A · REFERENCE"}</div>
                  <div className={`text-sm font-semibold ${scenario === "B" ? "text-red-200" : "text-emerald-200"}`}>
                    {scenario === "B" ? t({ he: "מצאו את כל הליקויים", en: "Find all deficiencies" }) : t({ he: "לחצו על אלמנטים מסומנים ללמידה", en: "Click elements to learn" })}
                  </div>
                </div>
                {scenario === "B" && (
                  <div className="rounded-xl border border-white/10 bg-navy-950/80 px-3 py-2 text-end backdrop-blur">
                    <div className="font-mono text-2xl font-bold text-white">
                      {found.length}
                      <span className="text-slate-500">/{total}</span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-400">
                      {t({ he: "ניקוד", en: "SCORE" })} {score} · {t({ he: "החטאות", en: "MISSES" })} {misses}
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 bg-gradient-to-t from-navy-950/95 to-transparent p-3 pt-8">
                <button onClick={() => setAirflow((a) => !a)} className={`btn !py-1.5 border text-xs ${airflow ? "border-volt-400/60 bg-volt-500/20 text-volt-300" : "border-white/10 bg-navy-950/80 text-slate-300"}`}>
                  <Icon name="fan" className="h-4 w-4" />
                  {t({ he: "זרימת אוויר והפעלה", en: "Airflow & run" })}
                </button>
                {scenario === "B" && (
                  <>
                    <button onClick={giveHint} disabled={complete} className="btn !py-1.5 border border-amber-500/40 bg-navy-950/80 text-xs text-amber-300">
                      <Icon name="hint" className="h-4 w-4" />
                      {t({ he: "רמז (−3)", en: "Hint (−3)" })}
                    </button>
                    <button onClick={restart} className="btn !py-1.5 border border-white/10 bg-navy-950/80 text-xs text-slate-300">
                      <Icon name="reset" className="h-4 w-4" />
                      {t({ he: "התחל מחדש", en: "Restart" })}
                    </button>
                  </>
                )}
                <button onClick={() => setResetKey((k) => k + 1)} className="btn !py-1.5 border border-white/10 bg-navy-950/80 text-xs text-slate-300">
                  <Icon name="target" className="h-4 w-4" />
                  {t({ he: "איפוס מבט", en: "Reset view" })}
                </button>
              </div>
            </div>

            {airflow && (
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-volt-400" /> {t({ he: "אוויר קר נכנס", en: "Cool inlet air" })}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5a33]" /> {t({ he: "אוויר חם מהרדיאטור", en: "Hot radiator air" })}
                </span>
                <span className="text-slate-500">{t({ he: "סובבו את החדר כדי לראות מכל זווית", en: "Orbit the room to see every angle" })}</span>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            {complete && scenario === "B" && (
              <div className="panel animate-fadeUp border-ok/30 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-ok/15 text-ok">
                    <Icon name="award" className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{t({ he: "כל הליקויים אותרו!", en: "All deficiencies found!" })}</div>
                    <div className="text-sm text-slate-400">
                      {t({ he: "ניקוד", en: "Score" })}: <b className="text-white">{score}</b>/{total * 10} · {misses} {t({ he: "החטאות", en: "misses" })} · {hints} {t({ he: "רמזים", en: "hints" })}
                    </div>
                  </div>
                </div>
                <button className="btn-ghost mt-3 w-full text-xs" onClick={() => setScenario("A")}>
                  {t({ he: "השוו לתרחיש A — החדר התקין", en: "Compare with Scenario A — the sound room" })}
                </button>
              </div>
            )}

            {hazard && (
              <div className="panel animate-fadeUp overflow-hidden !p-0" key={hazard.id}>
                <div className="border-b border-white/[0.06] bg-gradient-to-br from-danger/20 to-transparent p-5">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-danger font-mono text-xs font-bold text-white">{numberOf(hazard.id)}</span>
                    <span className="label text-red-300">{t({ he: "ליקוי אותר", en: "Deficiency found" })}</span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold text-white">{t(hazard.title)}</h2>
                </div>
                <div className="space-y-4 p-5 text-sm">
                  <Section icon="eye" title={{ he: "מה רואים", en: "What we see" }} tone="text-slate-300">
                    {t(hazard.observed)}
                  </Section>
                  <Section icon="warning" title={{ he: "השלכות אפשריות", en: "Potential consequences" }} tone="text-red-300">
                    {t(hazard.consequence)}
                  </Section>
                  <Section icon="lightbulb" title={{ he: "העיקרון ההנדסי", en: "Engineering principle" }} tone="text-volt-300">
                    {t(hazard.principle)}
                  </Section>
                  <Section icon="check" title={{ he: "ברמת העיקרון — הסדר תקין", en: "In principle — sound practice" }} tone="text-ok">
                    {t(hazard.correct)}
                  </Section>
                </div>
              </div>
            )}

            {good && (
              <div className="panel animate-fadeUp p-5" key={good.id}>
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-ok font-bold text-white">✓</span>
                  <span className="label text-ok">{t({ he: "הסדר מומלץ", en: "Sound arrangement" })}</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-white">{t(good.title)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{t(good.text)}</p>
                <div className="mt-3">
                  <KindBadge kind="recommendation" />
                </div>
              </div>
            )}

            {picked?.kind === "decoy" && (
              <Feedback ok={false}>
                {picked.id === "decoy-genset"
                  ? t({ he: "הגנרטור עצמו תקין — הליקויים נמצאים בהתקנה ובחדר שסביבו. (−2)", en: "The generator itself is fine — the deficiencies are in the installation and room around it. (−2)" })
                  : t({ he: "זה אינו ליקוי בתרחיש הזה. חפשו שוב. (−2)", en: "That is not a deficiency in this scenario. Keep looking. (−2)" })}
              </Feedback>
            )}

            {!picked && (
              <div className="panel p-5">
                <div className="label mb-2 text-volt-300">{t({ he: "הוראות", en: "Instructions" })}</div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {scenario === "B"
                    ? t({
                        he: "סרקו את החדר: אוורור, פליטה, דלק, לוחות, כבלים, יציאה ושילוט. לחיצה על ליקוי מסמנת אותו ומציגה הסבר. לחיצה על פריט תקין מורידה 2 נקודות. הפעילו ״זרימת אוויר״ כדי לראות את חזרת האוויר החם.",
                        en: "Scan the room: ventilation, exhaust, fuel, panels, cables, exit and signage. Clicking a deficiency marks it and explains it. Clicking something acceptable costs 2 points. Turn on 'Airflow' to see hot-air recirculation.",
                      })
                    : t({ he: "לחצו על האלמנטים בחדר כדי ללמוד מדוע ההסדר נחשב תקין ברמת העיקרון.", en: "Click elements in the room to learn why the arrangement is sound in principle." })}
                </p>
              </div>
            )}

            {scenario === "B" ? (
              <div className="panel p-4">
                <div className="label mb-2">{t({ he: "יומן ממצאים", en: "Findings log" })}</div>
                <ol className="space-y-1.5">
                  {roomHazards.map((h, i) => {
                    const n = found.indexOf(h.id);
                    return (
                      <li key={h.id}>
                        <button
                          disabled={n < 0}
                          onClick={() => setPicked({ kind: "hazard", id: h.id })}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-start text-sm transition ${n >= 0 ? "text-slate-200 hover:bg-white/5" : "text-slate-600"}`}
                        >
                          <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[10px] ${n >= 0 ? "bg-danger text-white" : "border border-white/10"}`}>{n >= 0 ? n + 1 : ""}</span>
                          {n >= 0 ? t(h.title) : `${t({ he: "ליקוי", en: "Deficiency" })} ${i + 1} — ???`}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : (
              <div className="panel p-4">
                <div className="label mb-2">{t({ he: "אלמנטים לחקירה", en: "Elements to explore" })}</div>
                <div className="flex flex-wrap gap-1.5">
                  {roomGoodFeatures.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => onPick("good", g.id)}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition ${picked?.id === g.id ? "border-ok/60 bg-ok/15 text-ok" : "border-white/10 text-slate-300 hover:border-ok/40"}`}
                    >
                      {progress.roomGoodViewed.includes(g.id) && "✓ "}
                      {t(g.title)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Disclaimer variant="design" />
          </aside>
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, tone, children }: { icon: Parameters<typeof Icon>[0]["name"]; title: { he: string; en: string }; tone: string; children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div>
      <div className={`mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${tone}`}>
        <Icon name={icon} className="h-3.5 w-3.5" />
        {t(title)}
      </div>
      <p className="leading-relaxed text-slate-300">{children}</p>
    </div>
  );
}

function Checklist({ onBest, best }: { onBest: (pct: number) => void; best: number }) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const all = Object.keys(answers).length === roomChecklist.length;
  const correct = useMemo(() => roomChecklist.filter((c) => answers[c.id] === c.hazard).length, [answers]);
  const pct = Math.round((correct / roomChecklist.length) * 100);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="panel p-5">
        <p className="mb-4 text-sm text-slate-400">
          {t({
            he: "גרסה נגישה של תרגיל החדר: לכל תצפית מהשטח, סווגו אם היא ליקוי בטיחותי/הנדסי או הסדר תקין.",
            en: "Accessible version of the room exercise: classify each site observation as a safety/engineering deficiency or an acceptable arrangement.",
          })}
        </p>
        <ol className="space-y-2">
          {roomChecklist.map((c, i) => {
            const a = answers[c.id];
            const right = submitted && a === c.hazard;
            const wrong = submitted && a !== undefined && a !== c.hazard;
            return (
              <li key={c.id} className={`rounded-xl border p-3 transition ${right ? "border-ok/40 bg-ok/5" : wrong ? "border-danger/40 bg-danger/5" : "border-white/[0.07] bg-white/[0.02]"}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <span className="font-mono text-xs text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-sm text-slate-200">{t(c.text)}</span>
                  <div className="flex gap-1.5">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        disabled={submitted}
                        onClick={() => setAnswers((s) => ({ ...s, [c.id]: v }))}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                          a === v ? (v ? "border-danger/60 bg-danger/20 text-red-200" : "border-ok/60 bg-ok/20 text-emerald-200") : "border-white/10 text-slate-400 hover:bg-white/5"
                        }`}
                      >
                        {v ? t({ he: "ליקוי", en: "Deficiency" }) : t({ he: "תקין", en: "Acceptable" })}
                      </button>
                    ))}
                  </div>
                </div>
                {submitted && c.ref && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{t(roomHazards.find((h) => h.id === c.ref)!.consequence)}</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <aside className="space-y-4">
        <div className="panel sticky top-20 p-5">
          <div className="label">{t({ he: "תוצאה", en: "Result" })}</div>
          {submitted ? (
            <>
              <div className="mt-2 font-mono text-4xl font-bold text-white">{pct}%</div>
              <div className="text-sm text-slate-400">
                {correct}/{roomChecklist.length} {t({ he: "סיווגים נכונים", en: "correct classifications" })}
              </div>
              <button
                className="btn-ghost mt-4 w-full"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                }}
              >
                <Icon name="reset" className="h-4 w-4" />
                {t({ he: "נסו שוב", en: "Try again" })}
              </button>
            </>
          ) : (
            <>
              <div className="mt-2 text-sm text-slate-400">
                {Object.keys(answers).length}/{roomChecklist.length} {t({ he: "סווגו", en: "classified" })}
              </div>
              <button
                className="btn-primary mt-4 w-full"
                disabled={!all}
                onClick={() => {
                  setSubmitted(true);
                  onBest(pct);
                }}
              >
                {t({ he: "בדוק תשובות", en: "Check answers" })}
              </button>
            </>
          )}
          {best > 0 && <div className="mt-3 text-xs text-slate-500">{t({ he: "שיא", en: "Best" })}: {best}%</div>}
        </div>
        <Disclaimer variant="design" />
      </aside>
    </div>
  );
}
