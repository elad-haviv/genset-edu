"use client";

import { useI18n } from "@/lib/i18n";

export type CtrlRow = { label: string; value: string; unit?: string; tone?: "ok" | "warn" | "danger" | "dim" };
export type CtrlLed = { label: string; on: boolean; color: "green" | "amber" | "red" | "blue"; blink?: boolean };

const ledColor = { green: "#2fd47a", amber: "#ffb547", red: "#ff4d4d", blue: "#3fb0ff" };
const toneCls = { ok: "text-[#7dffb0]", warn: "text-[#ffd27a]", danger: "text-[#ff8080]", dim: "text-[#4d6a7a]" };

/** A realistic-looking generator controller front panel (display only). */
export function ControllerDisplay({
  mode,
  status,
  alarm,
  rows,
  leds,
  model = "GC-8000",
}: {
  mode: "AUTO" | "MAN" | "OFF";
  status: string;
  alarm?: { level: "warn" | "shutdown" | "trip"; text: string } | null;
  rows: CtrlRow[];
  leds: CtrlLed[];
  model?: string;
}) {
  const { t } = useI18n();
  return (
    <div className="rounded-2xl border border-black/60 bg-gradient-to-b from-[#3a4250] to-[#262c35] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_20px_40px_-20px_rgba(0,0,0,.9)]" dir="ltr">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-300">{model}</span>
        <span className="font-mono text-[9px] tracking-widest text-slate-500">GENSET CONTROLLER</span>
      </div>
      {/* LCD */}
      <div className="relative overflow-hidden rounded-lg border-4 border-[#14181d] bg-[#071a1f] p-3 font-mono shadow-[inset_0_0_30px_rgba(0,0,0,.8)]">
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.025)_0px,rgba(255,255,255,.025)_1px,transparent_1px,transparent_3px)]" />
        <div className="flex items-center justify-between border-b border-[#1d3a40] pb-1.5 text-[11px]">
          <span className="text-[#7dd3fc]">MODE: {mode}</span>
          <span className="text-[#7dffb0]">{status}</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[12px]">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between gap-2">
              <span className="text-[#5f8f99]">{r.label}</span>
              <span className={toneCls[r.tone ?? "ok"]}>
                {r.value}
                {r.unit && <span className="ms-1 text-[10px] text-[#5f8f99]">{r.unit}</span>}
              </span>
            </div>
          ))}
        </div>
        <div className={`mt-2 min-h-[22px] rounded px-2 py-0.5 text-[12px] font-bold ${alarm ? (alarm.level === "warn" ? "bg-[#3a2c05] text-[#ffd27a]" : "animate-blink bg-[#3a0a0a] text-[#ff8080]") : "text-[#2f5a60]"}`}>
          {alarm ? `${alarm.level === "warn" ? "⚠ WARNING" : alarm.level === "trip" ? "⛔ ELEC TRIP" : "⛔ SHUTDOWN"}: ${alarm.text}` : t({ he: "אין התראות פעילות", en: "NO ACTIVE ALARMS" })}
        </div>
      </div>
      {/* LEDs and (display-only) keypad */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap gap-3">
          {leds.map((l) => (
            <div key={l.label} className="flex flex-col items-center gap-1">
              <span
                className={`h-2.5 w-2.5 rounded-full ${l.on && l.blink ? "animate-blink" : ""}`}
                style={{ background: l.on ? ledColor[l.color] : "#1b2128", boxShadow: l.on ? `0 0 8px ${ledColor[l.color]}` : "inset 0 1px 2px #000" }}
              />
              <span className="font-mono text-[8px] tracking-wider text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5" aria-hidden="true">
          {(["OFF", "MAN", "AUTO"] as const).map((k) => (
            <span key={k} className={`grid h-7 w-10 place-items-center rounded-md border font-mono text-[9px] font-bold ${mode === k ? "border-volt-400/60 bg-[#1d2a3a] text-volt-300" : "border-black/50 bg-[#2b323c] text-slate-400"}`}>
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
