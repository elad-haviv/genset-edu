"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader, Disclaimer, Bullets, KindBadge, Segmented, Feedback } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { installTopics } from "@/content/installation";
import { InstallDiagram } from "@/components/diagrams/InstallDiagram";

export default function InstallationPage() {
  const { t, tl } = useI18n();
  const { progress, addToList, markVisited } = useProgress();
  const [id, setId] = useState(installTopics[0].id);
  const [mode, setMode] = useState<"compare" | "test">("compare");
  const [goodLeft, setGoodLeft] = useState(true);
  const [answer, setAnswer] = useState<null | boolean>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const topic = installTopics.find((x) => x.id === id)!;
  const idx = installTopics.findIndex((x) => x.id === id);

  useEffect(() => markVisited("installation"), [markVisited]);
  useEffect(() => {
    if (mode === "compare") addToList("installTopics", id);
  }, [id, mode, addToList]);
  useEffect(() => {
    setAnswer(null);
    if (mode === "test") setGoodLeft(Math.random() > 0.5);
  }, [id, mode]);

  const pick = (pickedGood: boolean) => {
    if (answer !== null) return;
    setAnswer(pickedGood);
    setScore((s) => ({ right: s.right + (pickedGood ? 1 : 0), total: s.total + 1 }));
    if (pickedGood) addToList("installTopics", id);
  };

  const panels = mode === "compare" ? [true, false] : goodLeft ? [true, false] : [false, true];

  return (
    <div>
      <PageHeader
        icon="build"
        kicker={{ he: "מודול 04 · הנדסת התקנה", en: "Module 04 · Installation engineering" }}
        title={{ he: "הנדסת התקנת גנרטורים", en: "Generator Installation Engineering" }}
        subtitle={{
          he: "14 נושאי תכנון, כל אחד עם השוואה מונפשת בין הסדר נכון לשגוי. במצב ״בחנו את עצמכם״ הצדדים מתערבבים — זהו את ההסדר התקין.",
          en: "14 design topics, each with an animated comparison of proper and improper arrangements. In 'Test yourself' the sides are shuffled — identify the sound arrangement.",
        }}
        actions={
          <>
            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { value: "compare", label: { he: "השוואה", en: "Compare" }, icon: "eye" },
                { value: "test", label: { he: "בחנו את עצמכם", en: "Test yourself" }, icon: "target" },
              ]}
            />
            <Link href="/room" className="btn-ghost">
              <Icon name="room" className="h-4 w-4" />
              {t({ he: "השוואה תלת-ממדית בחדר", en: "3D room comparison" })}
            </Link>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
        <nav className="panel h-fit p-2 lg:sticky lg:top-6">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {installTopics.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setId(s.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm transition ${
                  id === s.id ? "bg-volt-500/15 text-white ring-1 ring-volt-400/30" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                <span className="font-mono text-[10px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">{t(s.title)}</span>
                {progress.installTopics.includes(s.id) && <Icon name="check" className="h-3.5 w-3.5 text-ok" />}
              </button>
            ))}
          </div>
        </nav>

        <div className="space-y-5">
          <section className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-white">{t(topic.title)}</h2>
              {mode === "test" && (
                <span className="font-mono text-sm text-slate-400">
                  {t({ he: "ניקוד", en: "Score" })}: {score.right}/{score.total}
                </span>
              )}
            </div>
            {mode === "test" && <p className="mt-1 text-sm text-amber-300">{t({ he: "איזה מהשרטוטים מציג הסדר תקין?", en: "Which drawing shows the sound arrangement?" })}</p>}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {panels.map((good, i) => {
                const reveal = mode === "compare" || answer !== null;
                const chosenWrong = mode === "test" && answer !== null && !good && answer === false;
                return (
                  <div key={`${id}-${i}-${good}`} className="flex flex-col gap-2">
                    <button
                      disabled={mode === "compare" || answer !== null}
                      onClick={() => pick(good)}
                      className={`relative overflow-hidden rounded-xl border-2 transition ${
                        reveal ? (good ? "border-ok/50" : "border-danger/50") : "border-white/10 hover:border-volt-400/60"
                      } ${chosenWrong ? "ring-4 ring-danger/30" : ""}`}
                    >
                      <InstallDiagram topic={id} good={good} />
                      {mode === "test" && answer === null && (
                        <span className="absolute start-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-volt-500 font-bold text-white">{i === 0 ? "A" : "B"}</span>
                      )}
                    </button>
                    {reveal && (
                      <div className={`flex items-center gap-2 text-sm font-semibold ${good ? "text-ok" : "text-danger"}`}>
                        <Icon name={good ? "check" : "x"} className="h-4 w-4" />
                        {good ? t({ he: "הסדר תקין (מושגי)", en: "Sound arrangement (conceptual)" }) : t({ he: "הסדר שגוי", en: "Improper arrangement" })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {mode === "test" && answer !== null && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex-1">
                  <Feedback ok={answer}>{answer ? t({ he: "נכון!", en: "Correct!" }) : t({ he: "לא נכון — ראו את ההסבר למטה.", en: "Not quite — see the explanation below." })}</Feedback>
                </div>
                <button className="btn-primary" disabled={idx === installTopics.length - 1} onClick={() => setId(installTopics[idx + 1].id)}>
                  {t({ he: "הנושא הבא", en: "Next topic" })}
                </button>
              </div>
            )}
          </section>

          {(mode === "compare" || answer !== null) && (
            <section className="grid gap-5 md:grid-cols-2">
              <div className="panel space-y-3 p-5 md:col-span-2">
                <div className="label text-volt-300">{t({ he: "העיקרון ההנדסי", en: "Engineering principle" })}</div>
                <p className="leading-relaxed text-slate-200">{t(topic.principle)}</p>
              </div>
              <div className="panel p-5">
                <div className="label mb-3 text-ok">{t({ he: "הסדר תקין", en: "Proper practice" })}</div>
                <Bullets items={tl(topic.good)} tone="ok" />
              </div>
              <div className="panel p-5">
                <div className="label mb-3 text-red-300">{t({ he: "טעויות נפוצות", en: "Common mistakes" })}</div>
                <Bullets items={tl(topic.bad)} tone="danger" />
                <p className="mt-3 rounded-lg bg-danger/10 p-3 text-sm text-red-100">
                  <b>{t({ he: "השלכה: ", en: "Consequence: " })}</b>
                  {t(topic.consequence)}
                </p>
              </div>
              <div className="panel p-5 md:col-span-2">
                <KindBadge kind={topic.note.kind} />
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{t(topic.note.text)}</p>
              </div>
            </section>
          )}
          <Disclaimer variant="design" />
        </div>
      </div>
    </div>
  );
}
