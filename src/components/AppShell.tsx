"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon } from "./icons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { modules, overallCompletion } from "@/content/modules";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-volt-500 to-volt-600 shadow-[0_0_18px_-4px_rgba(30,144,255,.9)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="8" />
          <path d="M8 12c1.3-2.6 2.7-2.6 4 0s2.7 2.6 4 0" />
        </svg>
        <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />
      </div>
      <div className="leading-none">
        <div className="text-[15px] font-extrabold tracking-[0.12em] text-white">GENSET</div>
        <div className="mt-0.5 text-[10px] font-bold tracking-[0.36em] text-amber-400">ACADEMY</div>
      </div>
    </Link>
  );
}

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <button
      onClick={() => setLang(lang === "he" ? "en" : "he")}
      className="btn-ghost !px-2.5 !py-1.5 text-xs"
      aria-label={lang === "he" ? "Switch to English" : "החלף לעברית"}
    >
      <Icon name="globe" className="h-4 w-4" />
      <span className={lang === "he" ? "text-white" : "text-slate-500"}>עב</span>
      <span className="text-slate-600">/</span>
      <span className={lang === "en" ? "text-white" : "text-slate-500"}>EN</span>
    </button>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { progress } = useProgress();
  const items = [{ id: "home", href: "/", icon: "home" as const, short: { he: "לוח בקרה", en: "Dashboard" }, completion: () => -1 }, ...modules];
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((m) => {
        const active = m.href === "/" ? pathname === "/" : pathname.startsWith(m.href);
        const c = m.completion(progress);
        return (
          <Link
            key={m.id}
            href={m.href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active ? "bg-volt-500/15 text-white ring-1 ring-volt-400/30" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
            }`}
          >
            <Icon name={m.icon} className={`h-[18px] w-[18px] shrink-0 ${active ? "text-volt-300" : "text-slate-500 group-hover:text-slate-300"}`} />
            <span className="flex-1 truncate">{t(m.short)}</span>
            {c >= 0 &&
              (c >= 99.5 ? (
                <Icon name="check" className="h-3.5 w-3.5 text-ok" />
              ) : c > 0 ? (
                <span className="font-mono text-[10px] text-slate-500">{Math.round(c)}%</span>
              ) : null)}
          </Link>
        );
      })}
    </nav>
  );
}

function OverallMeter() {
  const { progress } = useProgress();
  const { t } = useI18n();
  const v = overallCompletion(progress);
  return (
    <div className="panel-inset p-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{t({ he: "התקדמות כוללת", en: "Overall progress" })}</span>
        <span className="font-mono font-bold text-volt-300">{Math.round(v)}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-gradient-to-r from-volt-600 via-volt-400 to-amber-400 transition-all duration-700" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useI18n();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen">
      {/* desktop sidebar */}
      <aside className="no-print sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-5 border-e border-white/[0.06] bg-navy-950/70 p-4 backdrop-blur lg:flex">
        <div className="flex items-center justify-between">
          <Logo />
          <LangToggle />
        </div>
        <OverallMeter />
        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          <NavList />
        </div>
        <p className="text-[10px] leading-relaxed text-slate-600">
          {t({
            he: "פלטפורמה לימודית. אינה מחליפה הכשרה מוסמכת, תקנים, תקנות או הוראות יצרן.",
            en: "Educational platform. Not a substitute for accredited training, standards, regulations or manufacturer instructions.",
          })}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* mobile top bar */}
        <header className="no-print sticky top-0 z-40 flex items-center justify-between border-b border-white/[0.06] bg-navy-950/85 px-4 py-3 backdrop-blur lg:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <LangToggle />
            <button className="btn-ghost !p-2" onClick={() => setOpen(true)} aria-label={t({ he: "פתח תפריט", en: "Open menu" })}>
              <Icon name="menu" />
            </button>
          </div>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 start-0 flex w-72 max-w-[85vw] flex-col gap-4 overflow-y-auto border-e border-white/10 bg-navy-950 p-4">
              <div className="flex items-center justify-between">
                <Logo />
                <button className="btn-ghost !p-2" onClick={() => setOpen(false)} aria-label={t({ he: "סגור", en: "Close" })}>
                  <Icon name="close" />
                </button>
              </div>
              <OverallMeter />
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
