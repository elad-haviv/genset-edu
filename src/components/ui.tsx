"use client";

import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";
import { useI18n, l, type L } from "@/lib/i18n";

export function PageHeader({
  icon,
  kicker,
  title,
  subtitle,
  actions,
}: {
  icon: IconName;
  kicker: L;
  title: L;
  subtitle: L;
  actions?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex items-start gap-4">
        <div className="relative mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-volt-400/30 bg-volt-500/10 text-volt-300">
          <Icon name={icon} className="h-6 w-6" />
          <span className="absolute -bottom-1 -end-1 h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(255,154,31,.9)]" />
        </div>
        <div>
          <div className="label text-volt-300/80">{t(kicker)}</div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">{t(title)}</h1>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-400 md:text-base">{t(subtitle)}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`panel p-5 ${className}`}>{children}</div>;
}

export function SectionTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-300">
        <span className="h-3 w-1 rounded bg-amber-500" />
        {children}
      </h2>
      {aside}
    </div>
  );
}

/** Classification of a statement so students can tell binding rules from advice. */
export type Kind = "principle" | "recommendation" | "example" | "manufacturer" | "regulation";

const kindStyle: Record<Kind, { cls: string; label: L }> = {
  principle: { cls: "border-volt-400/40 bg-volt-500/10 text-volt-300", label: l("עיקרון הנדסי", "Engineering principle") },
  recommendation: { cls: "border-ok/40 bg-ok/10 text-ok", label: l("המלצה הנדסית", "Engineering recommendation") },
  example: { cls: "border-slate-400/40 bg-slate-400/10 text-slate-300", label: l("דוגמה להמחשה", "Illustrative example") },
  manufacturer: { cls: "border-amber-400/40 bg-amber-500/10 text-amber-400", label: l("דרישת יצרן", "Manufacturer-specific") },
  regulation: { cls: "border-danger/40 bg-danger/10 text-red-300", label: l("תקן / תקנה מחייבים", "Binding standard / regulation") },
};

export function KindBadge({ kind }: { kind: Kind }) {
  const { t } = useI18n();
  const s = kindStyle[kind];
  return <span className={`chip ${s.cls}`}>{t(s.label)}</span>;
}

export function Disclaimer({ variant = "work", className = "" }: { variant?: "work" | "design" | "calc" | "cert"; className?: string }) {
  const { t } = useI18n();
  const text: Record<string, L> = {
    work: l(
      "תוכן לימודי מושגי בלבד. כל עבודה בפועל על גנרטורים, לוחות חשמל וציוד מחושמל או פועל מחייבת בעלי רישיון חשמל מתאים, הסמכה ומיומנות — בהתאם לחוק החשמל ותקנותיו, הוראות היצרן ונהלי הבטיחות באתר.",
      "Conceptual educational content only. Any actual work on generators, switchboards and energized or running equipment requires suitably licensed, qualified and competent personnel, in accordance with applicable electrical law and regulations, manufacturer instructions and site safety procedures.",
    ),
    design: l(
      "ההסדרים המוצגים הם המחשות מושגיות ואינם תכניות ביצוע מאושרות. תכנון בפועל נקבע ע״י מהנדס מוסמך לפי התקנים והתקנות החלים, דרישות היצרן ורשויות (כיבוי אש, איכות סביבה וכד׳).",
      "The arrangements shown are conceptual illustrations, not approved construction drawings. Actual design must be produced by a qualified engineer per applicable standards and regulations, manufacturer requirements and authority requirements (fire, environmental, etc.).",
    ),
    calc: l(
      "מחשבון לימודי. אינו מחליף תכנון חשמלי מאושר, בחירת ציוד ע״י מהנדס או אימות הנדסי של היצרן.",
      "Educational calculator. Not a substitute for certified electrical design, engineer equipment selection or manufacturer engineering verification.",
    ),
    cert: l(
      "תעודה לימודית בלבד — אינה רישיון מקצועי, הסמכה או היתר לביצוע עבודות חשמל.",
      "Educational certificate only — not a professional licence, qualification or authorisation to perform electrical work.",
    ),
  };
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-amber-200/90 ${className}`}>
      <Icon name="hardhat" className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
      <span>{t(text[variant])}</span>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: L | string; icon?: IconName }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
}) {
  const { t } = useI18n();
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-navy-950/60 p-1" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition ${
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
          } ${value === o.value ? "bg-volt-500 text-white shadow-[0_0_14px_-4px_rgba(30,144,255,.9)]" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}
        >
          {o.icon && <Icon name={o.icon} className="h-4 w-4" />}
          {t(o.label)}
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({ value, tone = "volt" }: { value: number; tone?: "volt" | "amber" | "ok" }) {
  const c = tone === "amber" ? "from-amber-600 to-amber-400" : tone === "ok" ? "from-emerald-600 to-ok" : "from-volt-600 to-volt-300";
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <div className={`h-full rounded-full bg-gradient-to-r ${c} transition-all duration-700`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Ring({ value, size = 64, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.07)" strokeWidth={5} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(100, value) / 100)}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#1e90ff" />
            <stop offset="1" stopColor="#7cc8ff" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-mono text-sm font-bold text-white">{Math.round(value)}%</div>
          {label && <div className="text-[9px] text-slate-400">{label}</div>}
        </div>
      </div>
    </div>
  );
}

export function Bullets({ items, tone = "volt" }: { items: string[]; tone?: "volt" | "amber" | "danger" | "ok" }) {
  const dot = { volt: "bg-volt-400", amber: "bg-amber-500", danger: "bg-danger", ok: "bg-ok" }[tone];
  return (
    <ul className="space-y-1.5">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
          <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export function Feedback({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div
      className={`animate-fadeUp flex items-start gap-2.5 rounded-xl border p-3 text-sm leading-relaxed ${
        ok ? "border-ok/40 bg-ok/10 text-emerald-100" : "border-danger/40 bg-danger/10 text-red-100"
      }`}
    >
      <Icon name={ok ? "check" : "x"} className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? "text-ok" : "text-danger"}`} />
      <div>{children}</div>
    </div>
  );
}
