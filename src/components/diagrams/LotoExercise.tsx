"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Feedback } from "@/components/ui";
import { useI18n, type L } from "@/lib/i18n";

const steps: { id: string; text: L; why: L }[] = [
  { id: "prepare", text: { he: "הכנה: זיהוי כל מקורות האנרגיה והודעה לגורמים המושפעים", en: "Prepare: identify all energy sources and notify affected people" }, why: { he: "אי אפשר לבודד מקור שלא זוהה.", en: "You can't isolate a source you haven't identified." } },
  { id: "shutdown", text: { he: "כיבוי מסודר של הציוד", en: "Orderly shutdown of the equipment" }, why: { he: "עצירה רגילה (כולל קירור) לפני ניתוק — לא ניתוק תחת עומס.", en: "Normal stop (incl. cool-down) before isolating — not disconnecting under load." } },
  { id: "isolate", text: { he: "ניתוק כל המקורות: חשמל, התנעה אוטומטית, דלק", en: "Isolate all sources: electrical, auto-start, fuel" }, why: { he: "כל מקור — בהתקן ניתוק מתאים.", en: "Every source — with a suitable isolating device." } },
  { id: "lock", text: { he: "התקנת מנעול ותג אישיים לכל עובד", en: "Apply a personal lock and tag for each worker" }, why: { he: "המנעול מבטיח שרק בעליו יכול להחזיר את האנרגיה.", en: "The lock ensures only its owner can restore energy." } },
  { id: "stored", text: { he: "שחרור אנרגיה אגורה: התקררות, פריקת לחץ, מתח שיורי", en: "Release stored energy: cool down, relieve pressure, residual charge" }, why: { he: "חום, לחץ וקיבוליות נשארים גם אחרי ניתוק.", en: "Heat, pressure and capacitance remain after disconnection." } },
  { id: "verify", text: { he: "וידוא העדר אנרגיה/מתח ע״י מוסמך במכשיר בדוק", en: "Verify zero energy / absence of voltage by a qualified person with a proven tester" }, why: { he: "לעולם לא להניח — תמיד לוודא.", en: "Never assume — always verify." } },
  { id: "work", text: { he: "ביצוע העבודה, ובסיומה: פינוי, ספירת אנשים, הסרת מנעולים ע״י בעליהם", en: "Do the work; then clear tools, account for people, owners remove their locks" }, why: { he: "החזרה לשירות היא שלב מסוכן בפני עצמו.", en: "Return to service is a hazardous step in itself." } },
];

export function LotoExercise({ onComplete }: { onComplete?: (correct: boolean) => void }) {
  const { t } = useI18n();
  const [shuffled, setShuffled] = useState(steps);
  useEffect(() => setShuffled([...steps].sort(() => Math.random() - 0.5)), []);
  const [order, setOrder] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const done = order.length === steps.length;

  const pick = (id: string) => {
    if (order.includes(id) || done) return;
    const expected = steps[order.length].id;
    if (id === expected) {
      const next = [...order, id];
      setOrder(next);
      setWrong(null);
      if (next.length === steps.length) onComplete?.(errors === 0);
    } else {
      setWrong(id);
      setErrors((e) => e + 1);
      setTimeout(() => setWrong((w) => (w === id ? null : w)), 900);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="label mb-2">{t({ he: "שלבים (לחצו לפי הסדר הנכון)", en: "Steps (click in the right order)" })}</div>
        <div className="space-y-2">
          {shuffled.map((s) => {
            const used = order.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => pick(s.id)}
                disabled={used}
                className={`w-full rounded-xl border p-3 text-start text-sm transition ${
                  used ? "border-white/5 text-slate-600" : wrong === s.id ? "animate-pulse border-danger/60 bg-danger/15 text-red-100" : "border-white/10 bg-white/[0.02] text-slate-200 hover:border-volt-400/50 hover:bg-volt-500/10"
                }`}
              >
                {t(s.text)}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <div className="label mb-2">{t({ he: "הרצף שלכם", en: "Your sequence" })}</div>
        <ol className="space-y-2">
          {steps.map((s, i) => {
            const placed = order[i] === s.id;
            return (
              <li key={s.id} className={`flex gap-3 rounded-xl border p-3 text-sm ${placed ? "animate-fadeUp border-ok/30 bg-ok/5" : "border-dashed border-white/10"}`}>
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-xs ${placed ? "bg-ok text-navy-950" : "bg-white/5 text-slate-500"}`}>{i + 1}</span>
                {placed ? (
                  <div>
                    <div className="text-slate-100">{t(s.text)}</div>
                    <div className="mt-0.5 text-xs text-slate-400">{t(s.why)}</div>
                  </div>
                ) : (
                  <span className="text-slate-600">…</span>
                )}
              </li>
            );
          })}
        </ol>
        {done && (
          <div className="mt-3 space-y-2">
            <Feedback ok={errors === 0}>
              {errors === 0
                ? t({ he: "מושלם — הרצף נכון ללא טעויות.", en: "Perfect — correct sequence with no mistakes." })
                : t({ he: `הרצף הושלם עם ${errors} טעויות. נסו שוב ללא טעויות.`, en: `Sequence completed with ${errors} mistakes. Try again without errors.` })}
            </Feedback>
            <button
              className="btn-ghost text-xs"
              onClick={() => {
                setOrder([]);
                setErrors(0);
              }}
            >
              <Icon name="reset" className="h-4 w-4" />
              {t({ he: "שוב", en: "Again" })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
