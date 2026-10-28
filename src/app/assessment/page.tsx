"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader, Disclaimer, Feedback, ProgressBar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n, type L } from "@/lib/i18n";
import { useProgress, type ExamLevel } from "@/lib/progress";
import { levels, questions, PASS_MARK, type Question } from "@/content/quiz";
import { GensetFigure, RoomPlanFigure } from "@/components/diagrams/QuizFigures";
import { SLDiagram } from "@/components/diagrams/SLDiagram";

const typeLabel: Record<Question["type"], L> = {
  mcq: { he: "שאלה אמריקאית", en: "Multiple choice" },
  scenario: { he: "החלטה בתרחיש", en: "Scenario decision" },
  identify: { he: "זיהוי רכיב", en: "Click to identify" },
  hazard: { he: "זיהוי מפגע", en: "Hazard identification" },
  diagram: { he: "פענוח דיאגרמה", en: "Diagram interpretation" },
};

export default function AssessmentPage() {
  return (
    <Suspense fallback={null}>
      <Assessment />
    </Suspense>
  );
}

function Assessment() {
  const { t } = useI18n();
  const params = useSearchParams();
  const { progress, markVisited, recordExam, update } = useProgress();
  const [level, setLevel] = useState<ExamLevel | null>(null);
  const [certFor, setCertFor] = useState<ExamLevel | null>(null);

  useEffect(() => markVisited("assessment"), [markVisited]);
  useEffect(() => {
    const q = params.get("level");
    if (q === "1" || q === "2" || q === "3") setLevel(q);
  }, [params]);

  if (certFor) return <Certificate level={certFor} onBack={() => setCertFor(null)} name={progress.studentName} setName={(n) => update((p) => ({ ...p, studentName: n }))} />;
  if (level)
    return (
      <Quiz
        key={level}
        level={level}
        onExit={() => setLevel(null)}
        onFinish={(pct) => recordExam(level, pct, pct >= PASS_MARK)}
        onCertificate={() => {
          setCertFor(level);
          setLevel(null);
        }}
      />
    );

  return (
    <div>
      <PageHeader
        icon="award"
        kicker={{ he: "מודול 10 · הערכה", en: "Module 10 · Assessment" }}
        title={{ he: "מרכז מבחנים ותעודות לימודיות", en: "Assessment Center & Educational Certificates" }}
        subtitle={{
          he: `שלושה מסלולים, כל אחד משלב שאלות אמריקאיות, זיהוי רכיבים, זיהוי מפגעים, פענוח דיאגרמות והחלטות בתרחיש. ציון מעבר: ${PASS_MARK}%.`,
          en: `Three tracks, each mixing multiple choice, component identification, hazard identification, diagram interpretation and scenario decisions. Pass mark: ${PASS_MARK}%.`,
        }}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {levels.map((lv) => {
          const ex = progress.exams[lv.id];
          const types = Array.from(new Set(questions[lv.id].map((q) => q.type)));
          return (
            <div key={lv.id} className="panel flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl border text-xl font-black ${ex.passed ? "border-ok/50 bg-ok/10 text-ok" : "border-amber-500/40 bg-amber-500/10 text-amber-400"}`}>L{lv.id}</div>
                {ex.passed && (
                  <span className="chip border-ok/40 bg-ok/10 text-ok">
                    <Icon name="check" className="h-3 w-3" />
                    {t({ he: "עבר", en: "Passed" })}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{t(lv.title)}</h2>
                <div className="mt-1 text-sm text-amber-300/90">{t(lv.audience)}</div>
                <p className="mt-2 text-sm text-slate-400">{t(lv.topics)}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {types.map((ty) => (
                  <span key={ty} className="chip border-white/10 text-slate-400">
                    {t(typeLabel[ty])}
                  </span>
                ))}
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-400">
                  <span>{t({ he: "ציון שיא", en: "Best score" })}</span>
                  <span className="font-mono">
                    {ex.best}% · {ex.attempts} {t({ he: "ניסיונות", en: "attempts" })}
                  </span>
                </div>
                <ProgressBar value={ex.best} tone={ex.passed ? "ok" : "amber"} />
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <button className="btn-primary flex-1" onClick={() => setLevel(lv.id)}>
                  <Icon name="play" className="h-4 w-4" />
                  {ex.attempts ? t({ he: "היבחנו שוב", en: "Retake" }) : t({ he: "התחל מבחן", en: "Start exam" })}
                </button>
                {ex.passed && (
                  <button className="btn-accent" onClick={() => setCertFor(lv.id)}>
                    <Icon name="award" className="h-4 w-4" />
                    {t({ he: "תעודה", en: "Certificate" })}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Disclaimer variant="cert" className="mt-6" />
    </div>
  );
}

function Quiz({ level, onExit, onFinish, onCertificate }: { level: ExamLevel; onExit: () => void; onFinish: (pct: number) => void; onCertificate: () => void }) {
  const { t } = useI18n();
  const [order, setOrder] = useState<Question[]>(questions[level]);
  useEffect(() => setOrder([...questions[level]].sort(() => Math.random() - 0.5)), [level]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [picked, setPicked] = useState<number | string | null>(null);
  const [done, setDone] = useState(false);

  const q = order[i];
  const answered = picked !== null;
  const correctCount = Object.values(answers).filter(Boolean).length;
  const pct = Math.round((correctCount / order.length) * 100);
  const lv = levels.find((x) => x.id === level)!;

  const answer = (v: number | string) => {
    if (answered) return;
    setPicked(v);
    const ok = q.type === "identify" || q.type === "hazard" ? v === q.target : v === q.correct;
    setAnswers((a) => ({ ...a, [q.id]: ok }));
  };

  const next = () => {
    if (i + 1 >= order.length) {
      setDone(true);
      onFinish(Math.round((Object.values(answers).filter(Boolean).length / order.length) * 100));
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  if (done) {
    const passed = pct >= PASS_MARK;
    return (
      <div className="mx-auto max-w-2xl">
        <div className="panel animate-fadeUp p-8 text-center">
          <div className={`mx-auto grid h-24 w-24 place-items-center rounded-full border-4 font-mono text-3xl font-bold ${passed ? "border-ok text-ok" : "border-danger text-danger"}`}>{pct}%</div>
          <h2 className="mt-4 text-2xl font-bold text-white">{passed ? t({ he: "עברתם בהצלחה!", en: "You passed!" }) : t({ he: "לא עברתם הפעם", en: "Not passed this time" })}</h2>
          <p className="mt-2 text-slate-400">
            {t(lv.title)} · {correctCount}/{order.length} · {t({ he: "ציון מעבר", en: "pass mark" })} {PASS_MARK}%
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {passed && (
              <button className="btn-accent" onClick={onCertificate}>
                <Icon name="award" className="h-4 w-4" />
                {t({ he: "הפקת תעודה לימודית", en: "Generate educational certificate" })}
              </button>
            )}
            <button
              className="btn-ghost"
              onClick={() => {
                setOrder([...questions[level]].sort(() => Math.random() - 0.5));
                setI(0);
                setAnswers({});
                setPicked(null);
                setDone(false);
              }}
            >
              <Icon name="reset" className="h-4 w-4" />
              {t({ he: "היבחנו שוב", en: "Retake" })}
            </button>
            <button className="btn-ghost" onClick={onExit}>
              {t({ he: "חזרה למרכז המבחנים", en: "Back to assessment center" })}
            </button>
          </div>
          <div className="mt-6 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
            {order.map((qq, k) => (
              <div key={qq.id} className={`grid h-8 place-items-center rounded font-mono text-xs ${answers[qq.id] ? "bg-ok/20 text-ok" : "bg-danger/20 text-danger"}`}>
                {k + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = answers[q.id];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button className="btn-ghost text-xs" onClick={onExit}>
          <Icon name="close" className="h-4 w-4" />
          {t({ he: "יציאה", en: "Exit" })}
        </button>
        <div className="text-sm font-semibold text-white">{t(lv.title)}</div>
        <span className="font-mono text-sm text-slate-400">
          {i + 1}/{order.length}
        </span>
      </div>
      <ProgressBar value={((i + (answered ? 1 : 0)) / order.length) * 100} />

      <div className="panel animate-fadeUp mt-5 p-6" key={q.id}>
        <span className="chip border-volt-400/40 bg-volt-500/10 text-volt-300">{t(typeLabel[q.type])}</span>
        <h2 className="mt-3 text-xl font-bold leading-snug text-white">{t(q.prompt)}</h2>

        <div className="mt-5">
          {q.type === "identify" && <GensetFigure picked={typeof picked === "string" ? picked : null} target={q.target} answered={answered} onPick={answer} />}
          {q.type === "hazard" && <RoomPlanFigure picked={typeof picked === "string" ? picked : null} target={q.target} answered={answered} onPick={answer} />}
          {q.type === "diagram" && (
            <div className="panel-inset mb-4 p-2" dir="ltr">
              <SLDiagram s={q.state} />
            </div>
          )}
          {(q.type === "mcq" || q.type === "scenario" || q.type === "diagram") && (
            <div className="grid gap-2">
              {q.options.map((o, k) => (
                <button
                  key={k}
                  disabled={answered}
                  onClick={() => answer(k)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition ${
                    answered && k === q.correct ? "border-ok/50 bg-ok/10 text-emerald-100" : picked === k ? "border-danger/50 bg-danger/10 text-red-100" : answered ? "border-white/5 text-slate-500" : "border-white/10 text-slate-200 hover:border-volt-400/50 hover:bg-volt-500/10"
                  }`}
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/5 font-mono text-xs">{String.fromCharCode(65 + k)}</span>
                  {t(o)}
                </button>
              ))}
            </div>
          )}
        </div>

        {answered && (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Feedback ok={!!isCorrect}>{t(q.explain)}</Feedback>
            </div>
            <button className="btn-primary" onClick={next}>
              {i + 1 >= order.length ? t({ he: "סיום", en: "Finish" }) : t({ he: "הבא", en: "Next" })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Certificate({ level, onBack, name, setName }: { level: ExamLevel; onBack: () => void; name: string; setName: (n: string) => void }) {
  const { t, lang } = useI18n();
  const { progress } = useProgress();
  const ex = progress.exams[level];
  const lv = levels.find((x) => x.id === level)!;
  const date = useMemo(() => (ex.date ? new Date(ex.date) : new Date()), [ex.date]);
  const certId = useMemo(() => {
    const s = `${name}|${level}|${ex.best}|${date.toISOString().slice(0, 10)}`;
    let h = 0;
    for (let k = 0; k < s.length; k++) h = (h * 31 + s.charCodeAt(k)) >>> 0;
    return `GA-L${level}-${h.toString(36).toUpperCase().padStart(7, "0")}`;
  }, [name, level, ex.best, date]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-5 flex flex-wrap items-end gap-3">
        <button className="btn-ghost" onClick={onBack}>
          {t({ he: "חזרה", en: "Back" })}
        </button>
        <label className="flex-1">
          <span className="label">{t({ he: "שם מלא לתעודה", en: "Full name for the certificate" })}</span>
          <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder={t({ he: "הקלידו את שמכם", en: "Type your name" })} />
        </label>
        <button className="btn-accent" onClick={() => window.print()} disabled={!name.trim()}>
          <Icon name="print" className="h-4 w-4" />
          {t({ he: "הדפסה / שמירה כ-PDF", en: "Print / save as PDF" })}
        </button>
      </div>

      <div className="print-area relative overflow-hidden rounded-2xl border-[10px] border-double border-amber-500/60 bg-gradient-to-br from-[#0d1730] via-[#0a1222] to-[#111c36] p-10 text-center shadow-2xl print:border-amber-600 print:bg-white print:text-black">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(500px_250px_at_50%_0%,rgba(30,144,255,.15),transparent)] print:hidden" />
        <div className="relative">
          <div className="font-mono text-xs font-bold tracking-[0.5em] text-amber-400 print:text-amber-700">GENSET ACADEMY</div>
          <h1 className="mt-4 text-3xl font-extrabold text-white print:text-black md:text-4xl">{t({ he: "תעודת השלמה לימודית", en: "Certificate of Educational Completion" })}</h1>
          <p className="mt-6 text-slate-400 print:text-gray-600">{t({ he: "מוענקת בזאת ל", en: "This is to certify that" })}</p>
          <div className="mx-auto mt-2 max-w-lg border-b-2 border-amber-500/50 pb-2 text-3xl font-bold text-volt-300 print:text-blue-900">{name.trim() || "—"}</div>
          <p className="mt-6 text-slate-300 print:text-gray-800">{t({ he: "על השלמה בהצלחה של מסלול הלימוד", en: "has successfully completed the learning track" })}</p>
          <div className="mt-2 text-xl font-bold text-white print:text-black">{t(lv.title)}</div>
          <div className="mt-1 text-sm text-slate-400 print:text-gray-600">{t(lv.topics)}</div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="label print:text-gray-500">{t({ he: "ציון", en: "Score" })}</div>
              <div className="mt-1 font-mono text-lg font-bold text-white print:text-black">{ex.best}%</div>
            </div>
            <div>
              <div className="label print:text-gray-500">{t({ he: "תאריך", en: "Date" })}</div>
              <div className="mt-1 font-mono text-lg font-bold text-white print:text-black">{date.toLocaleDateString(lang === "he" ? "he-IL" : "en-GB")}</div>
            </div>
            <div>
              <div className="label print:text-gray-500">{t({ he: "מזהה", en: "ID" })}</div>
              <div className="mt-1 font-mono text-sm font-bold text-white print:text-black">{certId}</div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-xl rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200 print:border-gray-400 print:bg-gray-100 print:text-gray-800">
            {t({
              he: "תעודה זו היא תעודה לימודית בלבד המעידה על השלמת תכני הדרכה בפלטפורמה. היא אינה רישיון מקצועי, אינה הסמכה מוכרת ואינה מקנה הרשאה לבצע עבודות חשמל או עבודות בגנרטורים.",
              en: "This is an educational certificate only, attesting to completion of training content on this platform. It is not a professional licence, not a recognised qualification, and grants no authorisation to perform electrical or generator work.",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
