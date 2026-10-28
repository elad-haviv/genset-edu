"use client";

import Link from "next/link";
import { Icon } from "@/components/icons";
import { Disclaimer, ProgressBar, Ring } from "@/components/ui";
import { useI18n, type L } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { modules, overallCompletion } from "@/content/modules";

const trackLabel: Record<string, L> = {
  explore: { he: "חקירה תלת-ממדית", en: "3D exploration" },
  simulate: { he: "סימולציה", en: "Simulation" },
  learn: { he: "למידה", en: "Learning" },
  assess: { he: "הערכה", en: "Assessment" },
};

function HeroDiagram() {
  // A live, looping mini single-line diagram: utility ↔ generator → ATS → loads.
  return (
    <svg viewBox="0 0 420 220" className="h-full w-full" role="img" aria-label="Animated power system">
      <defs>
        <linearGradient id="hg" x1="0" x2="1">
          <stop offset="0" stopColor="#1e90ff" />
          <stop offset="1" stopColor="#7cc8ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* utility */}
      <g transform="translate(40 40)">
        <path d="M0 40 L15 0 L30 40 M5 25 H25 M8 15 H22" stroke="#7d8da3" strokeWidth="2" fill="none" />
        <text x="15" y="-6" textAnchor="middle" fontSize="10" fill="#7d8da3" fontFamily="monospace">GRID</text>
      </g>
      {/* generator */}
      <g transform="translate(55 165)">
        <circle r="18" fill="#0a1222" stroke="#ff9a1f" strokeWidth="2" />
        <path d="M-9 0c3-6 6-6 9 0s6 6 9 0" stroke="#ff9a1f" strokeWidth="2" fill="none" />
        <text y="34" textAnchor="middle" fontSize="10" fill="#ffb547" fontFamily="monospace">GEN</text>
      </g>
      <path d="M55 82 V105 H150" stroke="#2d3f5c" strokeWidth="3" fill="none" />
      <path d="M73 165 H120 V125 H150" stroke="#ff9a1f" strokeWidth="3" fill="none" className="flow" filter="url(#glow)" />
      {/* ATS */}
      <rect x="150" y="92" width="54" height="46" rx="6" fill="#0f1a30" stroke="#3fb0ff" strokeWidth="1.5" />
      <text x="177" y="119" textAnchor="middle" fontSize="11" fill="#7cc8ff" fontWeight="700" fontFamily="monospace">ATS</text>
      <path d="M204 115 H250" stroke="url(#hg)" strokeWidth="3" className="flow" filter="url(#glow)" />
      {/* MDB */}
      <rect x="250" y="80" width="14" height="70" rx="2" fill="#3fb0ff" opacity=".9" />
      <text x="257" y="170" textAnchor="middle" fontSize="9" fill="#7d8da3" fontFamily="monospace">MDB</text>
      {[92, 115, 138].map((y, i) => (
        <g key={y}>
          <path d={`M264 ${y} H330`} stroke="url(#hg)" strokeWidth="2.5" className="flow-slow" />
          <rect x="330" y={y - 11} width="58" height="22" rx="5" fill="#0f1a30" stroke={i === 0 ? "#ff4d4d" : i === 1 ? "#ffc531" : "#2fd47a"} strokeWidth="1.2" />
          <text x="359" y={y + 4} textAnchor="middle" fontSize="9" fill="#cbd5e1" fontFamily="monospace">
            {["CRITICAL", "ESSENTIAL", "GENERAL"][i]}
          </text>
        </g>
      ))}
      <circle cx="55" cy="105" r="3" fill="#ff4d4d" className="animate-blink" />
    </svg>
  );
}

export default function Dashboard() {
  const { t } = useI18n();
  const { progress, loaded } = useProgress();
  const overall = overallCompletion(progress);
  const next = modules.find((m) => m.completion(progress) < 100) ?? modules[0];
  const done = modules.filter((m) => m.completion(progress) >= 99.5).length;
  const passed = (["1", "2", "3"] as const).filter((k) => progress.exams[k].passed).length;

  return (
    <div className="space-y-8">
      {/* hero */}
      <section className="panel relative overflow-hidden !p-0">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_80%_20%,rgba(30,144,255,.18),transparent)]" />
        <div className="relative grid gap-6 p-6 md:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <div className="chip border-amber-500/40 bg-amber-500/10 text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              {t({ he: "סימולטור הדרכה הנדסי", en: "Engineering training simulator" })}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
              {t({ he: "הנדסה ובטיחות של", en: "Engineering & safety of" })}
              <br />
              <span className="bg-gradient-to-l from-volt-300 via-volt-400 to-amber-400 bg-clip-text text-transparent">
                {t({ he: "גנרטורי דיזל", en: "diesel generator sets" })}
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400">
              {t({
                he: "סביבת למידה אינטראקטיבית לחשמלאים, מהנדסים, טכנאי אחזקה ומתכננים: מודל תלת-ממדי מלא, חדר גנרטור עם מפגעים, סימולטור העברה, אבחון תקלות ומבחנים.",
                en: "An interactive learning environment for electricians, engineers, maintenance technicians and designers: a full 3D model, a hazard-filled generator room, a transfer simulator, fault diagnosis and assessments.",
              })}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={next.href} className="btn-primary !px-5 !py-2.5">
                <Icon name="play" className="h-4 w-4" />
                {overall > 0 ? t({ he: "המשך ללמוד", en: "Continue learning" }) : t({ he: "התחל כאן", en: "Start here" })}
                <span className="opacity-70">· {t(next.short)}</span>
              </Link>
              <Link href="/explorer" className="btn-ghost !px-5 !py-2.5">
                <Icon name="cube" className="h-4 w-4" />
                {t({ he: "לסייר התלת-ממדי", en: "Open 3D explorer" })}
              </Link>
            </div>
          </div>
          <div className="panel-inset relative h-56 p-2 md:h-64">
            <div className="absolute start-3 top-2 font-mono text-[10px] tracking-widest text-slate-500">LIVE · SLD-01</div>
            <HeroDiagram />
          </div>
        </div>
      </section>

      {/* stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel flex items-center gap-4 p-5">
          <Ring value={loaded ? overall : 0} size={68} />
          <div>
            <div className="label">{t({ he: "התקדמות כוללת", en: "Overall progress" })}</div>
            <div className="mt-1 text-sm text-slate-300">{t({ he: "נשמר מקומית בדפדפן", en: "Saved locally in your browser" })}</div>
          </div>
        </div>
        <Stat icon="layers" label={{ he: "מודולים שהושלמו", en: "Modules completed" }} value={`${done}/${modules.length}`} />
        <Stat icon="cube" label={{ he: "רכיבים שנלמדו", en: "Components studied" }} value={`${progress.explorerViewed.length}/19`} />
        <Stat icon="award" label={{ he: "תעודות לימודיות", en: "Educational certificates" }} value={`${passed}/3`} accent />
      </section>

      {/* modules */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-white">{t({ he: "מודולי ההדרכה", en: "Training modules" })}</h2>
          <span className="text-xs text-slate-500">{t({ he: "כל המודולים פעילים ואינטראקטיביים", en: "All modules are live and interactive" })}</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m, i) => {
            const c = m.completion(progress);
            return (
              <Link key={m.id} href={m.href} className="panel group relative flex flex-col gap-3 overflow-hidden p-5 transition hover:-translate-y-0.5 hover:border-volt-400/30">
                <div className="absolute -end-10 -top-10 h-32 w-32 rounded-full bg-volt-500/10 blur-2xl transition group-hover:bg-volt-500/20" />
                <div className="relative flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl border border-volt-400/25 bg-volt-500/10 text-volt-300 transition group-hover:scale-105">
                    <Icon name={m.icon} className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400/80">{t(trackLabel[m.track])}</div>
                  <h3 className="mt-1 font-bold text-white">{t(m.title)}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{t(m.desc)}</p>
                </div>
                <div className="relative mt-auto flex items-center gap-3 pt-2">
                  <ProgressBar value={c} tone={c >= 99.5 ? "ok" : "volt"} />
                  <span className="w-10 text-end font-mono text-xs text-slate-400">{Math.round(c)}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* tracks */}
      <section className="grid gap-4 lg:grid-cols-3">
        {(
          [
            { k: "1", title: { he: "רמה 1 — יסודות הגנרטור", en: "Level 1 — Generator Fundamentals" }, who: { he: "טכנאים וחשמלאים: זיהוי רכיבים ובטיחות בסיסית", en: "Technicians & electricians: component ID and basic safety" } },
            { k: "2", title: { he: "רמה 2 — התקנה ותחזוקה", en: "Level 2 — Installation & Maintenance" }, who: { he: "טכנאים ומהנדסים: התקנה, בדיקות בטיחות ואבחון", en: "Technicians & engineers: installation, inspections, diagnosis" } },
            { k: "3", title: { he: "רמה 3 — הנדסה מתקדמת", en: "Level 3 — Advanced Engineering" }, who: { he: "מהנדסים ומתכננים: הגנות, יתירות וארכיטקטורה", en: "Engineers & designers: protection, redundancy, architecture" } },
          ] as const
        ).map((tr) => {
          const ex = progress.exams[tr.k];
          return (
            <Link key={tr.k} href={`/assessment?level=${tr.k}`} className="panel group flex items-center gap-4 p-5 transition hover:border-amber-500/30">
              <div
                className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl border text-xl font-black ${
                  ex.passed ? "border-ok/50 bg-ok/10 text-ok" : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                }`}
              >
                {ex.passed ? <Icon name="award" className="h-7 w-7" /> : `L${tr.k}`}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white">{t(tr.title)}</div>
                <div className="mt-0.5 text-xs text-slate-400">{t(tr.who)}</div>
                <div className="mt-1.5 font-mono text-[11px] text-slate-500">
                  {ex.attempts > 0 ? `${t({ he: "ציון שיא", en: "Best" })}: ${ex.best}% · ${ex.attempts} ${t({ he: "ניסיונות", en: "attempts" })}` : t({ he: "טרם נבחנת", en: "Not attempted" })}
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <Disclaimer />
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: Parameters<typeof Icon>[0]["name"]; label: L; value: string; accent?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="panel flex items-center gap-4 p-5">
      <div className={`grid h-12 w-12 place-items-center rounded-xl border ${accent ? "border-amber-500/30 bg-amber-500/10 text-amber-400" : "border-volt-400/25 bg-volt-500/10 text-volt-300"}`}>
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div>
        <div className="label">{t(label)}</div>
        <div className="mt-1 font-mono text-2xl font-bold text-white">{value}</div>
      </div>
    </div>
  );
}
