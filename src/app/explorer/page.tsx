"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PageHeader, Segmented, Disclaimer, Bullets, Feedback } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n, type L } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { useWebGL } from "@/lib/webgl";
import { components, componentById, subsystemLabels, subsystemColor, type Subsystem } from "@/content/components";

const ExplorerScene = dynamic(() => import("@/components/three/ExplorerScene"), {
  ssr: false,
  loading: () => <ViewportLoading />,
});

function ViewportLoading() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-volt-500/30 border-t-volt-400" />
        <span className="font-mono text-xs tracking-widest">LOADING 3D MODEL…</span>
      </div>
    </div>
  );
}

type Tab = "function" | "principle" | "failures" | "maintenance" | "hazards";
const tabs: { value: Tab; label: L }[] = [
  { value: "function", label: { he: "תפקיד", en: "Function" } },
  { value: "principle", label: { he: "עקרון פעולה", en: "Principle" } },
  { value: "failures", label: { he: "תסמיני כשל", en: "Failures" } },
  { value: "maintenance", label: { he: "תחזוקה", en: "Maintenance" } },
  { value: "hazards", label: { he: "בטיחות", en: "Safety" } },
];

const ROUNDS = 8;

function shuffle<T>(a: T[]) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

type Challenge = { queue: string[]; index: number; score: number; missed: boolean; done: boolean; lastResult: null | "ok" | "miss" };

export default function ExplorerPage() {
  const { t, tl } = useI18n();
  const { progress, addToList, markVisited, update } = useProgress();
  const webgl = useWebGL();

  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [explode, setExplode] = useState(0);
  const [running, setRunning] = useState(false);
  const [enclosure, setEnclosure] = useState(false);
  const [labels, setLabels] = useState(false);
  const [filter, setFilter] = useState<Subsystem | "all">("all");
  const [tab, setTab] = useState<Tab>("function");
  const [resetKey, setResetKey] = useState(0);
  const [view, setView] = useState<"3d" | "list">("3d");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [flagged, setFlagged] = useState<string | null>(null);

  useEffect(() => markVisited("explorer"), [markVisited]);
  useEffect(() => {
    if (webgl === false) setView("list");
  }, [webgl]);

  const select = useCallback(
    (id: string) => {
      setSelected(id);
      addToList("explorerViewed", id);
    },
    [addToList],
  );

  const onSceneSelect = useCallback(
    (id: string) => {
      if (!challenge || challenge.done) return select(id);
      const target = challenge.queue[challenge.index];
      if (id === target) {
        setFlagged(null);
        setSelected(id);
        setChallenge((c) => c && { ...c, score: c.score + (c.missed ? 0 : 1), lastResult: "ok" });
        setTimeout(() => {
          setSelected(null);
          setChallenge((c) => {
            if (!c) return c;
            const next = c.index + 1;
            if (next >= c.queue.length) {
              const pct = Math.round((c.score / c.queue.length) * 100);
              update((p) => ({ ...p, explorerChallengeBest: Math.max(p.explorerChallengeBest, pct) }));
              return { ...c, done: true, lastResult: null };
            }
            return { ...c, index: next, missed: false, lastResult: null };
          });
        }, 1100);
      } else {
        setFlagged(id);
        setTimeout(() => setFlagged((f) => (f === id ? null : f)), 700);
        setChallenge((c) => c && { ...c, missed: true, lastResult: "miss" });
      }
    },
    [challenge, select, update],
  );

  const startChallenge = () => {
    setSelected(null);
    setLabels(false);
    setEnclosure(false);
    setFilter("all");
    setView("3d");
    setResetKey((k) => k + 1);
    setChallenge({ queue: shuffle(components.map((c) => c.id)).slice(0, ROUNDS), index: 0, score: 0, missed: false, done: false, lastResult: null });
  };

  const isDimmed = useCallback((id: string) => filter !== "all" && componentById[id]?.subsystem !== filter, [filter]);
  const labelFor = useCallback((id: string) => componentById[id]?.tag ?? id, []);

  const comp = selected && !challenge ? componentById[selected] : null;
  const viewed = new Set(progress.explorerViewed);

  const inChallenge = !!challenge && !challenge.done;
  const target = inChallenge ? componentById[challenge.queue[challenge.index]] : null;

  const filterOptions = useMemo(
    () => (["all", "mechanical", "electrical", "cooling", "fuel", "control"] as const).map((v) => ({ value: v, label: subsystemLabels[v] })),
    [],
  );

  return (
    <div>
      <PageHeader
        icon="cube"
        kicker={{ he: "מודול 01 · חקירה תלת-ממדית", en: "Module 01 · 3D exploration" }}
        title={{ he: "סייר גנרטור דיזל תלת-ממדי", en: "3D Diesel Generator Explorer" }}
        subtitle={{
          he: "סובבו (גרירה), התקרבו (גלגלת / צביטה) ולחצו על רכיב כדי לפתוח את כרטיס ההדרכה שלו. השתמשו בתצוגה מפוצצת, במצב הפעלה ובסינון מערכות.",
          en: "Rotate (drag), zoom (wheel / pinch) and click a component to open its training card. Use exploded view, run mode and subsystem filters.",
        }}
        actions={
          <>
            <Segmented
              size="sm"
              value={view}
              onChange={(v) => setView(v)}
              options={[
                { value: "3d", label: { he: "תלת-ממד", en: "3D view" }, icon: "cube" },
                { value: "list", label: { he: "רשימה נגישה", en: "Accessible list" }, icon: "list" },
              ]}
            />
            {!inChallenge ? (
              <button className="btn-accent" onClick={startChallenge} disabled={webgl === false}>
                <Icon name="target" className="h-4 w-4" />
                {t({ he: "אתגר זיהוי", en: "Identify challenge" })}
              </button>
            ) : (
              <button className="btn-ghost" onClick={() => setChallenge(null)}>
                <Icon name="close" className="h-4 w-4" />
                {t({ he: "יציאה מהאתגר", en: "Exit challenge" })}
              </button>
            )}
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* viewport */}
        <div className="flex flex-col gap-3">
          {view === "3d" && (
            <div className="panel relative h-[58vh] min-h-[380px] overflow-hidden !p-0 md:h-[68vh]">
              {webgl !== false && (
                <ExplorerScene
                  selected={selected}
                  onSelect={onSceneSelect}
                  hovered={hovered}
                  onHover={setHovered}
                  explode={explode}
                  running={running}
                  enclosure={enclosure}
                  labels={labels && !inChallenge}
                  isDimmed={isDimmed}
                  labelFor={labelFor}
                  flagged={flagged}
                  resetKey={resetKey}
                  autoFocus={!inChallenge}
                />
              )}

              {/* HUD: top */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
                <div className="pointer-events-auto rounded-xl border border-white/10 bg-navy-950/75 px-3 py-2 backdrop-blur">
                  <div className="font-mono text-[10px] tracking-widest text-slate-500">GENSET · 400V · 50Hz · 4P</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className={`h-2 w-2 rounded-full ${running ? "animate-pulse bg-ok" : "bg-slate-500"}`} />
                    <span className="text-slate-300">{running ? t({ he: "פועל · 1500 סל״ד", en: "Running · 1500 rpm" }) : t({ he: "עצור · מצב AUTO", en: "Stopped · AUTO" })}</span>
                  </div>
                </div>
                {hovered && !inChallenge && componentById[hovered] && (
                  <div className="animate-fadeUp rounded-xl border border-amber-500/40 bg-navy-950/85 px-3 py-2 text-sm text-amber-300 backdrop-blur">
                    {t(componentById[hovered].name)}
                  </div>
                )}
              </div>

              {/* challenge banner */}
              {challenge && (
                <div className="absolute inset-x-3 top-16 mx-auto max-w-md md:top-3">
                  <div className="animate-fadeUp rounded-xl border border-amber-500/40 bg-navy-950/90 p-3 text-center shadow-2xl backdrop-blur">
                    {!challenge.done && target ? (
                      <>
                        <div className="label text-amber-400">
                          {t({ he: "אתגר זיהוי", en: "Identify challenge" })} · {challenge.index + 1}/{challenge.queue.length}
                        </div>
                        <div className="mt-1 text-lg font-bold text-white">
                          {t({ he: "לחצו על:", en: "Click on:" })} <span className="text-amber-400">{t(target.name)}</span>
                        </div>
                        <div className="mt-1 h-5 text-xs">
                          {challenge.lastResult === "ok" && <span className="text-ok">✓ {t({ he: "נכון!", en: "Correct!" })}</span>}
                          {challenge.lastResult === "miss" && <span className="text-danger">✗ {t({ he: "לא זה — נסו שוב", en: "Not that — try again" })}</span>}
                        </div>
                        <div className="mt-1 font-mono text-xs text-slate-400">
                          {t({ he: "ניקוד", en: "Score" })}: {challenge.score}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="label text-ok">{t({ he: "האתגר הושלם", en: "Challenge complete" })}</div>
                        <div className="mt-1 text-2xl font-bold text-white">{Math.round((challenge.score / challenge.queue.length) * 100)}%</div>
                        <div className="text-xs text-slate-400">
                          {challenge.score}/{challenge.queue.length} {t({ he: "זיהויים בניסיון ראשון", en: "first-try identifications" })}
                        </div>
                        <div className="mt-2 flex justify-center gap-2">
                          <button className="btn-accent !py-1.5 text-xs" onClick={startChallenge}>
                            <Icon name="reset" className="h-3.5 w-3.5" />
                            {t({ he: "שוב", en: "Again" })}
                          </button>
                          <button className="btn-ghost !py-1.5 text-xs" onClick={() => setChallenge(null)}>
                            {t({ he: "סגור", en: "Close" })}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* HUD: bottom toolbar */}
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 bg-gradient-to-t from-navy-950/95 to-transparent p-3 pt-8">
                <ToolButton active={explode > 0} onClick={() => setExplode((e) => (e > 0 ? 0 : 1))} icon="explode" label={{ he: "תצוגה מפוצצת", en: "Exploded" }} />
                <ToolButton active={running} onClick={() => setRunning((r) => !r)} icon={running ? "pause" : "play"} label={running ? { he: "עצור", en: "Stop" } : { he: "הפעל", en: "Run" }} tone="ok" />
                <ToolButton active={enclosure} onClick={() => setEnclosure((e) => !e)} icon={enclosure ? "eye" : "eyeOff"} label={{ he: "מעטפת", en: "Enclosure" }} disabled={inChallenge} />
                <ToolButton active={labels} onClick={() => setLabels((v) => !v)} icon="info" label={{ he: "תוויות", en: "Labels" }} disabled={inChallenge} />
                <ToolButton
                  onClick={() => {
                    if (!inChallenge) setSelected(null);
                    setResetKey((k) => k + 1);
                  }}
                  icon="reset"
                  label={{ he: "איפוס מבט", en: "Reset view" }}
                />
                {explode > 0 && (
                  <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-950/80 px-3 py-1.5 text-xs text-slate-400">
                    {t({ he: "פיצוץ", en: "Explode" })}
                    <input type="range" min={0.2} max={1.4} step={0.05} value={explode} onChange={(e) => setExplode(parseFloat(e.target.value))} className="w-24" />
                  </label>
                )}
              </div>

              {webgl === false && (
                <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-slate-400">
                  {t({ he: "הדפדפן אינו תומך ב-WebGL. השתמשו בתצוגת הרשימה הנגישה.", en: "Your browser doesn't support WebGL. Use the accessible list view." })}
                </div>
              )}
            </div>
          )}

          {/* subsystem filter */}
          {!inChallenge && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="label">{t({ he: "סינון מערכת", en: "Subsystem" })}</span>
              <Segmented size="sm" value={filter} onChange={setFilter} options={filterOptions} />
            </div>
          )}

          {/* component chips / accessible list */}
          <div className={`panel p-4 ${view === "list" ? "" : "hidden md:block"}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="label">{t({ he: "רכיבי המערכת", en: "System components" })}</span>
              <span className="font-mono text-xs text-slate-400">
                {viewed.size}/{components.length} {t({ he: "נלמדו", en: "studied" })}
              </span>
            </div>
            <div className={view === "list" ? "grid gap-2 sm:grid-cols-2" : "flex flex-wrap gap-1.5"}>
              {components
                .filter((c) => filter === "all" || c.subsystem === filter)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => (inChallenge ? onSceneSelect(c.id) : select(c.id))}
                    className={`flex items-center gap-2 rounded-lg border text-start transition ${
                      view === "list" ? "px-3 py-2.5 text-sm" : "px-2.5 py-1 text-xs"
                    } ${
                      selected === c.id
                        ? "border-volt-400/70 bg-volt-500/20 text-white"
                        : "border-white/[0.08] bg-white/[0.02] text-slate-300 hover:border-volt-400/40 hover:bg-volt-500/10"
                    }`}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: subsystemColor[c.subsystem] }} />
                    <span className="flex-1">{inChallenge ? c.tag : t(c.name)}</span>
                    {viewed.has(c.id) && !inChallenge && <Icon name="check" className="h-3.5 w-3.5 text-ok" />}
                    {view === "list" && !inChallenge && <span className="text-[11px] text-slate-500">{t(subsystemLabels[c.subsystem])}</span>}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* info panel */}
        <aside className="flex flex-col gap-4">
          {comp ? (
            <div className="panel animate-fadeUp overflow-hidden !p-0" key={comp.id}>
              <div className="relative border-b border-white/[0.06] bg-gradient-to-br from-volt-500/15 to-transparent p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="chip border-white/15 font-mono text-[10px]" style={{ color: subsystemColor[comp.subsystem] }}>
                      {comp.tag} · {t(subsystemLabels[comp.subsystem])}
                    </span>
                    <h2 className="mt-2 text-xl font-bold text-white">{t(comp.name)}</h2>
                    <p className="mt-1 text-sm text-slate-400">{t(comp.summary)}</p>
                  </div>
                  <button className="btn-ghost !p-1.5" onClick={() => setSelected(null)} aria-label={t({ he: "סגור", en: "Close" })}>
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4 flex flex-wrap gap-1">
                  {tabs.map((tb) => (
                    <button
                      key={tb.value}
                      onClick={() => setTab(tb.value)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                        tab === tb.value
                          ? tb.value === "hazards"
                            ? "bg-danger/20 text-red-200 ring-1 ring-danger/40"
                            : "bg-volt-500/20 text-volt-300 ring-1 ring-volt-400/40"
                          : "text-slate-400 hover:bg-white/5"
                      }`}
                    >
                      {t(tb.label)}
                    </button>
                  ))}
                </div>
                <div className="min-h-[180px]">
                  {tab === "function" && <p className="text-sm leading-relaxed text-slate-300">{t(comp.function)}</p>}
                  {tab === "principle" && <p className="text-sm leading-relaxed text-slate-300">{t(comp.principle)}</p>}
                  {tab === "failures" && <Bullets items={tl(comp.failures)} tone="amber" />}
                  {tab === "maintenance" && <Bullets items={tl(comp.maintenance)} tone="ok" />}
                  {tab === "hazards" && (
                    <div className="space-y-3">
                      <Bullets items={tl(comp.hazards)} tone="danger" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <NavStep current={comp.id} onGo={select} />
                </div>
              </div>
            </div>
          ) : (
            <div className="panel p-5">
              <div className="flex items-center gap-2 text-volt-300">
                <Icon name="info" className="h-5 w-5" />
                <span className="label text-volt-300">{t({ he: "איך מתחילים", en: "Getting started" })}</span>
              </div>
              <ol className="mt-3 space-y-2.5 text-sm text-slate-300">
                {[
                  { he: "לחצו על רכיב במודל או ברשימה כדי לפתוח את כרטיס ההדרכה.", en: "Click a component in the model or list to open its training card." },
                  { he: "״תצוגה מפוצצת״ מפרידה את הרכיבים — שימושי לרכיבים קטנים.", en: "'Exploded' separates parts — useful for small components." },
                  { he: "״הפעל״ מדמה ריצה: מאוורר מסתובב, פליטה, טורבו חם, נתוני בקר.", en: "'Run' simulates operation: spinning fan, exhaust, hot turbo, controller data." },
                  { he: "סננו לפי מערכת כדי לראות רק את רכיבי הדלק, הבקרה וכד׳.", en: "Filter by subsystem to isolate fuel, control parts, etc." },
                  { he: "סיימתם? נסו את ״אתגר הזיהוי״.", en: "Done? Try the 'Identify challenge'." },
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-volt-500/20 font-mono text-[10px] text-volt-300">{i + 1}</span>
                    <span>{t(s)}</span>
                  </li>
                ))}
              </ol>
              {progress.explorerChallengeBest > 0 && (
                <div className="mt-4">
                  <Feedback ok={progress.explorerChallengeBest >= 80}>
                    {t({ he: "שיא אתגר הזיהוי שלך:", en: "Your identify-challenge best:" })} <b>{progress.explorerChallengeBest}%</b>
                  </Feedback>
                </div>
              )}
            </div>
          )}

          <div className="panel p-4">
            <div className="label mb-2">{t({ he: "מקרא מערכות", en: "Subsystem legend" })}</div>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
              {(Object.keys(subsystemColor) as Subsystem[]).map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: subsystemColor[s] }} />
                  {t(subsystemLabels[s])}
                </div>
              ))}
            </div>
          </div>
          <Disclaimer />
        </aside>
      </div>
    </div>
  );
}

function ToolButton({
  active,
  onClick,
  icon,
  label,
  tone = "volt",
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  icon: Parameters<typeof Icon>[0]["name"];
  label: L;
  tone?: "volt" | "ok";
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const on = tone === "ok" ? "border-ok/60 bg-ok/15 text-ok" : "border-volt-400/60 bg-volt-500/20 text-volt-300";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`btn !px-3 !py-1.5 border text-xs backdrop-blur ${active ? on : "border-white/10 bg-navy-950/80 text-slate-300 hover:border-volt-400/40"}`}
    >
      <Icon name={icon} className="h-4 w-4" />
      {t(label)}
    </button>
  );
}

function NavStep({ current, onGo }: { current: string; onGo: (id: string) => void }) {
  const { t, dir } = useI18n();
  const i = components.findIndex((c) => c.id === current);
  const prev = components[(i - 1 + components.length) % components.length];
  const next = components[(i + 1) % components.length];
  return (
    <>
      <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => onGo(prev.id)}>
        <Icon name="chevron" className={`h-3.5 w-3.5 ${dir === "ltr" ? "rotate-180" : ""}`} />
        {t(prev.name)}
      </button>
      <button className="btn-ghost !px-2.5 !py-1 text-xs" onClick={() => onGo(next.id)}>
        {t(next.name)}
        <Icon name="chevron" className={`h-3.5 w-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
      </button>
    </>
  );
}
