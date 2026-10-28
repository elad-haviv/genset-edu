"use client";

import { useEffect, useState } from "react";
import { PageHeader, Segmented, Disclaimer, KindBadge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { simScenarios, type SimState } from "@/content/simulator";
import { SLDiagram, busPowered } from "@/components/diagrams/SLDiagram";
import { NeutralSwitching } from "@/components/diagrams/NeutralSwitching";
import { ControllerDisplay, type CtrlRow } from "@/components/ControllerDisplay";

function readings(s: SimState): CtrlRow[] {
  const live = ["warmup", "ready", "onload", "cooldown"].includes(s.gen);
  const crank = s.gen === "cranking";
  const kw = Math.round(s.load * 300);
  return [
    { label: "MAINS V", value: s.utility ? "400" : "0", unit: "V", tone: s.utility ? "ok" : "danger" },
    { label: "MAINS f", value: s.utility ? "50.0" : "0.0", unit: "Hz", tone: s.utility ? "ok" : "danger" },
    { label: "GEN V", value: live ? (s.gen === "warmup" ? "392" : s.load > 1 ? "388" : "400") : "0", unit: "V", tone: live ? "ok" : "dim" },
    { label: "GEN f", value: live ? (s.load > 1 ? "49.2" : s.gen === "warmup" ? "49.8" : "50.0") : "0.0", unit: "Hz", tone: live ? (s.load > 1 ? "warn" : "ok") : "dim" },
    { label: "RPM", value: live ? "1500" : crank ? "180" : "0", tone: live || crank ? "ok" : "dim" },
    { label: "LOAD", value: `${kw}`, unit: `kW ${Math.round(s.load * 100)}%`, tone: s.load > 1 ? "danger" : s.load > 0.85 ? "warn" : "ok" },
    { label: "OIL P", value: live ? "4.2" : crank ? "0.6" : "0.0", unit: "bar", tone: live ? "ok" : "dim" },
    { label: "BATT", value: crank ? (s.gen === "cranking" && s.alarm ? "17.9" : "20.4") : live ? "27.8" : "26.9", unit: "V", tone: crank ? "warn" : "ok" },
  ];
}

export default function SimulatorPage() {
  const { t } = useI18n();
  const { markVisited, addToList, progress } = useProgress();
  const [tab, setTab] = useState<"sld" | "neutral">("sld");
  const [scId, setScId] = useState("outage");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const sc = simScenarios.find((s) => s.id === scId)!;
  const cur = sc.steps[Math.min(step, sc.steps.length - 1)];
  const st = cur.state;

  useEffect(() => markVisited("simulator"), [markVisited]);
  useEffect(() => {
    if (tab === "neutral") addToList("simScenarios", "3p4p");
  }, [tab, addToList]);

  useEffect(() => {
    if (!playing) return;
    if (step >= sc.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((x) => x + 1), cur.ms);
    return () => clearTimeout(id);
  }, [playing, step, sc, cur.ms]);

  useEffect(() => {
    if (step === sc.steps.length - 1) addToList("simScenarios", sc.id);
  }, [step, sc, addToList]);

  const choose = (id: string) => {
    setScId(id);
    setStep(0);
    setPlaying(true);
  };

  const bus = busPowered(st);

  return (
    <div>
      <PageHeader
        icon="sld"
        kicker={{ he: "מודול 05 · סימולטור מערכת", en: "Module 05 · System simulator" }}
        title={{ he: "סימולטור מערכת חשמל, גנרטור ו-ATS", en: "Generator Electrical System & ATS Simulator" }}
        subtitle={{
          he: "דיאגרמה חד-קווית מונפשת: רשת → מפסק החלפה אוטומטי → לוח ראשי → עומסים, עם גנרטור כמקור חלופי. בחרו תרחיש וצפו בהתנהגות המערכת שלב אחר שלב.",
          en: "Animated single-line diagram: Utility → ATS → Main distribution board → loads, with a standby generator. Pick a scenario and watch the system behave step by step.",
        }}
        actions={
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "sld", label: { he: "תרחישי הפעלה", en: "Operating scenarios" }, icon: "sld" },
              { value: "neutral", label: { he: "ATS 3P מול 4P", en: "3P vs 4P ATS" }, icon: "layers" },
            ]}
          />
        }
      />

      {tab === "sld" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {simScenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => choose(s.id)}
                  className={`rounded-xl border px-3 py-2 text-start text-sm transition ${scId === s.id ? "border-volt-400/60 bg-volt-500/15 text-white" : "border-white/10 text-slate-300 hover:bg-white/5"}`}
                >
                  <span className="flex items-center gap-1.5">
                    {progress.simScenarios.includes(s.id) && <Icon name="check" className="h-3.5 w-3.5 text-ok" />}
                    {t(s.title)}
                  </span>
                </button>
              ))}
            </div>

            <div className="panel relative p-3">
              <div className="absolute start-4 top-3 flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500">
                <span className={`h-2 w-2 rounded-full ${bus ? "bg-amber-400 shadow-[0_0_8px_#ffb547]" : "bg-danger"}`} />
                SLD · {bus ? "LOADS ENERGISED" : "LOADS DEAD"}
              </div>
              <div className="pt-5" dir="ltr">
                <SLDiagram s={st} />
              </div>
            </div>

            {/* transport */}
            <div className="panel flex flex-wrap items-center gap-3 p-3">
              <button className="btn-ghost !p-2" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0} aria-label={t({ he: "שלב קודם", en: "Previous step" })}>
                <Icon name="chevron" className="h-4 w-4 rotate-180 rtl:rotate-0" />
              </button>
              <button className="btn-primary !px-4" onClick={() => (step >= sc.steps.length - 1 ? (setStep(0), setPlaying(true)) : setPlaying((p) => !p))}>
                <Icon name={playing ? "pause" : step >= sc.steps.length - 1 ? "reset" : "play"} className="h-4 w-4" />
                {playing ? t({ he: "השהה", en: "Pause" }) : step >= sc.steps.length - 1 ? t({ he: "הפעל שוב", en: "Replay" }) : t({ he: "הפעל", en: "Play" })}
              </button>
              <button className="btn-ghost !p-2" onClick={() => setStep((x) => Math.min(sc.steps.length - 1, x + 1))} disabled={step >= sc.steps.length - 1} aria-label={t({ he: "שלב הבא", en: "Next step" })}>
                <Icon name="chevron" className="h-4 w-4 rtl:rotate-180" />
              </button>
              <div className="flex flex-1 items-center gap-1.5">
                {sc.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setStep(i);
                      setPlaying(false);
                    }}
                    className={`h-2 flex-1 rounded-full transition ${i < step ? "bg-volt-500" : i === step ? "bg-amber-400" : "bg-white/10"}`}
                    aria-label={`${i + 1}`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-slate-400">
                {step + 1}/{sc.steps.length}
              </span>
            </div>

            <div className="panel animate-fadeUp p-5" key={`${scId}-${step}`}>
              <div className="flex items-center gap-2">
                <span className="chip border-amber-500/40 bg-amber-500/10 font-mono text-amber-400">{t(cur.at)}</span>
                <h2 className="text-lg font-bold text-white">{t(cur.title)}</h2>
              </div>
              <p className="mt-2 leading-relaxed text-slate-300">{t(cur.text)}</p>
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <ControllerDisplay
              mode="AUTO"
              status={t(st.status)}
              alarm={st.alarm ? { level: st.alarm.level, text: t(st.alarm.text) } : null}
              rows={readings(st)}
              leds={[
                { label: "MAINS", on: st.utility, color: "green" },
                { label: "GEN", on: ["ready", "onload", "cooldown"].includes(st.gen), color: "green" },
                { label: "ON LOAD", on: st.ats === "G" && st.genCb === "closed", color: "amber" },
                { label: "WARN", on: st.alarm?.level === "warn", color: "amber", blink: true },
                { label: "FAULT", on: !!st.alarm && st.alarm.level !== "warn", color: "red", blink: true },
              ]}
            />
            <div className="panel p-5">
              <div className="label mb-2">{t(sc.title)}</div>
              <p className="text-sm text-slate-400">{t(sc.desc)}</p>
              <ol className="mt-3 space-y-1.5">
                {sc.steps.map((s, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        setStep(i);
                        setPlaying(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1 text-start text-sm ${i === step ? "bg-amber-500/10 text-amber-200" : i < step ? "text-slate-300" : "text-slate-500"}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${i <= step ? "bg-amber-400" : "bg-white/20"}`} />
                      {t(s.title)}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="panel space-y-2 p-4 text-sm text-slate-400">
              <KindBadge kind="example" />
              <p>
                {t({
                  he: "זמני ההשהיה, ערכי המתח וההספק בסימולטור הם להמחשה בלבד. ההגדרות בפועל נקבעות בתכנון ובהוראות היצרן.",
                  en: "Delays, voltage and power values in the simulator are illustrative only. Actual settings are determined in design and per manufacturer instructions.",
                })}
              </p>
            </div>
            <Disclaimer />
          </aside>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="panel p-5">
            <NeutralSwitching />
          </div>
          <aside className="flex flex-col gap-4">
            <div className="panel space-y-3 p-5 text-sm leading-relaxed text-slate-300">
              <h3 className="font-bold text-white">{t({ he: "השיקולים העיקריים", en: "Key considerations" })}</h3>
              <ul className="list-disc space-y-1.5 ps-5">
                <li>{t({ he: "שיטת ההארקה של המתקן והיכן מותר / נדרש חיבור N-PE.", en: "The installation earthing system and where an N-PE bond is permitted / required." })}</li>
                <li>{t({ he: "האם הגנרטור הוא ״מקור נפרד״ (Separately derived) — עם חיבור N-PE משלו.", en: "Whether the generator is a separately derived source — with its own N-PE bond." })}</li>
                <li>{t({ he: "הגנות זליגה / RCD — מסלולי זרם מקבילים עלולים לשבש אותן.", en: "Earth-fault / RCD protection — parallel current paths can upset them." })}</li>
                <li>{t({ he: "ניתוק N בזמן העברה וזרמי אפס בעומסים לא מאוזנים.", en: "Neutral disconnection during transfer and neutral current with unbalanced loads." })}</li>
                <li>{t({ he: "דרישות התקנות וספק החשמל לחיבור מקור חלופי.", en: "Regulatory and network-operator requirements for connecting an alternative source." })}</li>
              </ul>
              <KindBadge kind="principle" />
            </div>
            <Disclaimer variant="design" />
          </aside>
        </div>
      )}
    </div>
  );
}
