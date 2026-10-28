"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";

/** Hebrew versions of the drawing callouts. */
const HE: Record<string, string> = {
  "EXHAUST HIGH": "פליטה גבוהה",
  "FLOOD LEVEL": "מפלס הצפה",
  "FLOOD WATER": "מי הצפה",
  "LEVEL PLINTH · DESIGNED": "יסוד מפולס · מתוכנן",
  "UNEVEN · CRACKING": "לא מפולס · סדקים",
  "SPRING MOUNTS · FLEX CONNECTIONS": "בולמים · חיבורים גמישים",
  "RIGID · VIBRATION INTO STRUCTURE": "קשיח · רעידות למבנה",
  INLET: "כניסה",
  DUCT: "תעלה",
  "HOT AIR RECIRCULATES": "אוויר חם חוזר",
  "BELLOWS · SUPPORT · INSULATED": "צינור גמיש · תמיכה · בידוד",
  "LOW OUTLET → WINDOW (CO)": "יציאה נמוכה ← חלון (CO)",
  "BUNDED TANK": "מיכל במאצרה",
  "DRUMS UNDER HOT EXHAUST": "חביות מתחת לפליטה חמה",
  FIRE: "הפרדת",
  SEPARATION: "אש",
  DETECTOR: "גלאי",
  "COMBUSTIBLES · NO SEPARATION": "חומרים דליקים · ללא הפרדה",
  LOADS: "עומסים",
  "UTILITY (ISOLATED)": "רשת (מנותקת)",
  "BACKFEED TO GRID!": "הזנה חוזרת לרשת!",
  "CABLE LADDER": "סולם כבלים",
  "CABLES ACROSS WALKWAY": "כבלים במעבר",
  "CLEAR ACCESS (PER MANUFACTURER)": "גישה פנויה (לפי היצרן)",
  "NO ROOM TO SERVICE": "אין מקום לתחזוקה",
  INTERCEPTOR: "מפריד שמן",
  "BUND · SPILL CONTAINMENT": "מאצרה · הכלת דליפות",
  DRAIN: "ניקוז",
  "OIL TO SOIL / DRAIN": "שמן לקרקע / לניקוז",
  "RAIN-RESISTANT CANOPY · RAIN CAP": "מעטפת מוגנת גשם · כובע גשם",
  "WATER INTO EXHAUST & ALTERNATOR": "מים לפליטה ולאלטרנטור",
  "ATTENUATORS · SILENCER": "מלכודות קול · משתיק",
  "NOISE TO NEIGHBOURS": "רעש לשכנים",
  "DOORS · AIRFLOW · EXTERNAL E-STOP": "דלתות · זרימת אוויר · E-STOP חיצוני",
  "SEALED BOX": "תיבה אטומה",
  "NO AIRFLOW · NO SERVICE ACCESS": "ללא אוורור · ללא גישה",
};

/**
 * Side-elevation comparison drawings for the installation module.
 * Each topic draws a "proper" and an "improper" variant on a shared base scene.
 */

const C = {
  ground: "#4a3b2c",
  wall: "#2a3546",
  wallFill: "#0f1828",
  eng: "#a07c34",
  alt: "#2c4a66",
  frame: "#4a5361",
  hot: "#ff5a33",
  cool: "#3fb0ff",
  ok: "#2fd47a",
  bad: "#ff4d4d",
  text: "#9fb0c6",
  steel: "#9aa5b4",
};

function Genset({ x, y, tilt = 0, mounts = true, canopy = false }: { x: number; y: number; tilt?: number; mounts?: boolean; canopy?: boolean }) {
  // (x, y) = bottom-left of base frame on the floor
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <rect x={0} y={-10} width={170} height={10} fill={C.frame} />
      {mounts &&
        [20, 75, 135].map((mx) => (
          <path key={mx} d={`M${mx} -10 l3 -3 l-6 -2 l6 -2 l-6 -2 l3 -3`} stroke="#d0d6dd" strokeWidth={1.5} fill="none" />
        ))}
      <g transform={`translate(0 ${mounts ? -12 : 0})`}>
        <rect x={4} y={-62} width={14} height={52} fill="#1b1f25" stroke="#4a5361" />
        <rect x={24} y={-52} width={78} height={42} rx={3} fill={C.eng} />
        <rect x={30} y={-60} width={66} height={9} rx={2} fill="#bcc4cc" />
        <rect x={102} y={-46} width={10} height={34} fill="#6e5524" />
        <rect x={112} y={-50} width={50} height={38} rx={12} fill={C.alt} />
        <rect x={118} y={-66} width={34} height={14} rx={2} fill="#37465a" />
        <rect x={40} y={-82} width={70} height={14} rx={7} fill="#3a3d42" />
        <path d="M60 -60 V-68" stroke="#5b4a40" strokeWidth={6} />
      </g>
      {canopy && <rect x={-8} y={-98} width={186} height={88} rx={4} fill="rgba(61,75,92,.35)" stroke="#6b7a8f" />}
    </g>
  );
}

function Ground({ y = 220 }: { y?: number }) {
  return (
    <g>
      <rect x={0} y={y} width={400} height={260 - y} fill="#1b150f" />
      <line x1={0} y1={y} x2={400} y2={y} stroke={C.ground} strokeWidth={2} />
    </g>
  );
}

function Room({ x = 30, y = 40, w = 300, h = 180 }: { x?: number; y?: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={C.wallFill} stroke={C.wall} strokeWidth={6} />;
}

function Arrow({ d, color, slow }: { d: string; color: string; slow?: boolean }) {
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={3} fill="none" className={slow ? "flow-slow" : "flow"} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${color})` }} />
    </g>
  );
}

function Mark({ x, y, ok }: { x: number; y: number; ok: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={9} fill={ok ? C.ok : C.bad} />
      <path d={ok ? "M-4 0 l3 3 l5 -6" : "M-4 -4 l8 8 M4 -4 l-8 8"} stroke="#fff" strokeWidth={2} fill="none" />
    </g>
  );
}

function Waves({ x, y, color, big }: { x: number; y: number; color: string; big?: boolean }) {
  return (
    <g>
      {[0, 0.6, 1.2].map((d) => (
        <circle key={d} cx={x} cy={y} r={5} fill="none" stroke={color} strokeWidth={1.5}>
          <animate attributeName="r" from="5" to={big ? 70 : 22} dur="1.8s" begin={`${d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.9" to="0" dur="1.8s" begin={`${d}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

function Louvre({ x, y, h = 50, vertical = true }: { x: number; y: number; h?: number; vertical?: boolean }) {
  const n = Math.max(3, Math.round(h / 8));
  return (
    <g>
      {Array.from({ length: n }).map((_, i) =>
        vertical ? <line key={i} x1={x - 4} y1={y + i * (h / n)} x2={x + 4} y2={y + i * (h / n) + 5} stroke={C.steel} strokeWidth={2} /> : null,
      )}
    </g>
  );
}

function Smoke({ x, y, toX, toY }: { x: number; y: number; toX: number; toY: number }) {
  return (
    <g>
      {[0, 0.7, 1.4].map((d) => (
        <circle key={d} cx={x} cy={y} r={5} fill="#8d969e">
          <animate attributeName="cx" from={x} to={toX} dur="2.1s" begin={`${d}s`} repeatCount="indefinite" />
          <animate attributeName="cy" from={y} to={toY} dur="2.1s" begin={`${d}s`} repeatCount="indefinite" />
          <animate attributeName="r" from="4" to="14" dur="2.1s" begin={`${d}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.7" to="0" dur="2.1s" begin={`${d}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

function Label({ x, y, children, color = C.text, anchor = "middle" }: { x: number; y: number; children: ReactNode; color?: string; anchor?: "start" | "middle" | "end" }) {
  const { lang } = useI18n();
  const text = typeof children === "string" && lang === "he" ? HE[children.trim()] ?? children : children;
  return (
    <text x={x} y={y} fontSize={lang === "he" ? 11 : 10} fill={color} textAnchor={anchor} fontFamily={lang === "he" ? "inherit" : "monospace"} fontWeight={600}>
      {text}
    </text>
  );
}

function Window({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={26} height={30} fill="#9cc7e8" opacity={0.35} stroke="#9cc7e8" />
      <line x1={x + 13} y1={y} x2={x + 13} y2={y + 30} stroke="#9cc7e8" />
    </g>
  );
}

export function InstallDiagram({ topic, good }: { topic: string; good: boolean }) {
  const body = (() => {
    switch (topic) {
      case "site":
        return good ? (
          <>
            <Ground />
            <rect x={70} y={200} width={220} height={20} fill="#59626f" />
            <Genset x={95} y={200} />
            <path d="M150 105 V40" stroke="#5b4a40" strokeWidth={6} />
            <Label x={300} y={40}>EXHAUST HIGH</Label>
            <rect x={0} y={232} width={400} height={28} fill="#1e90ff" opacity={0.2} />
            <Label x={330} y={250} color={C.cool}>
              FLOOD LEVEL
            </Label>
            <path d="M340 170 h40 v50 h-40z" fill="#14243a" stroke={C.wall} />
            <Window x={347} y={180} />
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground y={140} />
            <rect x={60} y={140} width={260} height={110} fill="#0b1018" stroke={C.wall} strokeWidth={4} />
            <Genset x={95} y={245} />
            <rect x={62} y={200} width={256} height={48} fill="#1e90ff" opacity={0.35}>
              <animate attributeName="y" values="230;200;230" dur="4s" repeatCount="indefinite" />
            </rect>
            <Label x={190} y={196} color={C.cool}>
              FLOOD WATER
            </Label>
            <path d="M150 165 V120 H330" stroke="#5b4a40" strokeWidth={6} fill="none" />
            <Window x={335} y={95} />
            <Smoke x={330} y={120} toX={345} toY={100} />
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "foundation":
        return good ? (
          <>
            <Ground />
            <rect x={70} y={198} width={230} height={22} fill="#7b8491" />
            {[90, 280].map((x) => (
              <line key={x} x1={x} y1={198} x2={x} y2={232} stroke="#cbd5e1" strokeWidth={2} />
            ))}
            <Genset x={100} y={198} />
            <Label x={185} y={245}>LEVEL PLINTH · DESIGNED</Label>
            <line x1={70} y1={190} x2={300} y2={190} stroke={C.ok} strokeDasharray="4 4" />
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <path d="M60 220 L300 206 L300 220 Z" fill="#59626f" />
            <Genset x={95} y={216} tilt={-3.5} />
            <path d="M150 220 l8 12 l-6 8 l10 14 M230 220 l-5 10 l8 9" stroke={C.bad} strokeWidth={2} fill="none" />
            <Label x={185} y={250} color={C.bad}>
              UNEVEN · CRACKING
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "vibration":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={90} y={220} />
            <Waves x={170} y={180} color={C.ok} />
            <path d="M150 128 v-14 m0 0 h0" stroke="#5b4a40" strokeWidth={6} />
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={i} cx={150} cy={110 - i * 5} rx={6} ry={2} fill="none" stroke="#cbd5e1" />
            ))}
            <path d="M150 92 V60 H330" stroke="#5b4a40" strokeWidth={6} fill="none" />
            <path d="M240 170 q20 0 20 -20 q0 -20 20 -20 H330" stroke="#1f2328" strokeWidth={4} fill="none" />
            <Label x={170} y={240}>SPRING MOUNTS · FLEX CONNECTIONS</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={90} y={220} mounts={false} />
            <Waves x={170} y={205} color={C.bad} big />
            <Waves x={330} y={90} color={C.bad} />
            <path d="M150 128 V60 H330" stroke="#5b4a40" strokeWidth={6} fill="none" />
            <path d="M330 60 l-6 10 l5 6 l-7 10" stroke={C.bad} strokeWidth={2} fill="none" />
            <path d="M240 170 H330" stroke="#1f2328" strokeWidth={4} />
            <Label x={170} y={240} color={C.bad}>
              RIGID · VIBRATION INTO STRUCTURE
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "ventilation":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            <Louvre x={330} y={110} h={70} />
            <Louvre x={30} y={110} h={70} />
            <path d="M33 105 H80 V185 H33" fill="none" stroke={C.steel} strokeWidth={2} />
            <Arrow d="M395 145 H335 M325 150 H150 M140 150 H85" color={C.cool} />
            <Arrow d="M80 145 H0" color={C.hot} />
            <Label x={360} y={100} color={C.cool}>
              INLET
            </Label>
            <Label x={50} y={100} color={C.hot}>
              DUCT
            </Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            <Louvre x={30} y={70} h={30} />
            <Louvre x={30} y={170} h={30} />
            <Arrow d="M95 160 C60 160 50 120 80 110 S170 90 230 120 S200 170 120 160" color={C.hot} slow />
            <Arrow d="M-5 185 H30" color={C.cool} />
            <Arrow d="M30 85 H-5" color={C.hot} />
            <Label x={200} y={70} color={C.bad}>
              HOT AIR RECIRCULATES
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "exhaust":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={i} cx={155} cy={124 - i * 5} rx={6} ry={2} fill="none" stroke="#cbd5e1" />
            ))}
            <path d="M155 106 V90 H330 V30" stroke="#d9dde2" strokeWidth={8} fill="none" />
            <rect x={200} y={80} width={80} height={20} rx={10} fill="#3a3d42" />
            <line x1={240} y1={40} x2={240} y2={80} stroke="#6b7a8f" strokeWidth={2} />
            <path d="M318 26 l24 -6" stroke="#9aa5b4" strokeWidth={4} />
            <Smoke x={330} y={28} toX={360} toY={0} />
            <Label x={250} y={120}>BELLOWS · SUPPORT · INSULATED</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            <path d="M155 128 V100 H330" stroke="#5b4a40" strokeWidth={6} fill="none" />
            <rect x={130} y={96} width={70} height={20} rx={10} fill="#3a3d42" />
            <Window x={345} y={95} />
            <Smoke x={335} y={100} toX={352} toY={110} />
            <Label x={250} y={80} color={C.bad}>
              LOW OUTLET → WINDOW (CO)
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "fuel":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={130} y={220} />
            <rect x={45} y={175} width={70} height={45} fill="none" stroke="#7b8491" strokeWidth={3} />
            <rect x={52} y={160} width={56} height={52} rx={4} fill="#c9a227" />
            <path d="M115 210 H135" stroke="#30343a" strokeWidth={3} />
            <circle cx={95} cy={155} r={4} fill={C.bad} />
            <Label x={80} y={240}>BUNDED TANK</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={60} y={220} />
            <path d="M115 128 V100 H300" stroke="#5b4a40" strokeWidth={6} fill="none" />
            {[250, 285].map((x) => (
              <rect key={x} x={x} y={175} width={28} height={45} rx={3} fill="#2a5fa8" />
            ))}
            <ellipse cx={285} cy={220} rx={50} ry={4} fill="#111" opacity={0.8} />
            <path d="M268 130 c5 -10 12 -8 10 -20 c8 6 10 14 6 22 c-4 6 -14 6 -16 -2z" fill="#ff9a1f" className="animate-pulse" />
            <Label x={270} y={245} color={C.bad}>
              DRUMS UNDER HOT EXHAUST
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "fire":
        return good ? (
          <>
            <Ground />
            <Room />
            <rect x={327} y={40} width={10} height={180} fill="#8a6d3b" />
            <Label x={355} y={60}>FIRE</Label>
            <Label x={355} y={72}>SEPARATION</Label>
            <Genset x={95} y={220} />
            <circle cx={180} cy={52} r={7} fill="#e5e7eb" />
            <Label x={180} y={70}>DETECTOR</Label>
            <rect x={285} y={170} width={12} height={34} rx={5} fill={C.bad} />
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            {[270, 295, 282].map((x, i) => (
              <rect key={i} x={x} y={i === 2 ? 160 : 190} width={26} height={30} fill="#9b7650" />
            ))}
            <path d="M290 150 c6 -14 16 -10 12 -26 c10 8 14 20 8 30 c-6 8 -18 8 -20 -4z" fill="#ff5a1f" className="animate-pulse" />
            <Label x={280} y={240} color={C.bad}>
              COMBUSTIBLES · NO SEPARATION
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "electrical":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={60} y={220} />
            <rect x={260} y={110} width={40} height={70} rx={4} fill="#14243a" stroke={C.cool} />
            <Label x={280} y={150} color={C.cool}>
              ATS
            </Label>
            <Arrow d="M220 160 H260" color="#ffb547" />
            <Arrow d="M300 140 H395" color="#ffb547" />
            <Label x={350} y={130}>LOADS</Label>
            <path d="M280 110 V0" stroke="#5b6b82" strokeWidth={3} />
            <Label x={300} y={20}>UTILITY (ISOLATED)</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={60} y={220} />
            <rect x={270} y={120} width={14} height={18} fill="#e2e8f0" />
            <path d="M220 160 C240 160 250 130 270 130" stroke="#1f2328" strokeWidth={4} fill="none" />
            <Arrow d="M284 130 H330 V0" color={C.bad} />
            <Label x={300} y={20} color={C.bad}>
              BACKFEED TO GRID!
            </Label>
            <Mark x={380} y={40} ok={false} />
          </>
        );
      case "cables":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={60} y={220} />
            <rect x={150} y={60} width={180} height={6} fill={C.steel} />
            <path d="M200 66 V80 q0 20 -20 20 q-10 0 -10 12 V112" stroke="#1f2328" strokeWidth={4} fill="none" />
            <path d="M330 66 V220" stroke="#1f2328" strokeWidth={4} />
            <Label x={240} y={55}>CABLE LADDER</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={60} y={220} />
            <path d="M220 214 C250 222 280 210 330 218" stroke="#1f2328" strokeWidth={5} fill="none" />
            <g transform="translate(270 218) rotate(-25)">
              <circle cx={0} cy={-58} r={7} fill="none" stroke={C.bad} strokeWidth={2} />
              <path d="M0 -50 V-22 L-9 0 M0 -22 L12 -4 M0 -44 L-16 -30 M0 -44 L18 -36" stroke={C.bad} strokeWidth={2} fill="none" />
            </g>
            <Label x={270} y={240} color={C.bad}>
              CABLES ACROSS WALKWAY
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "access":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={115} y={220} />
            {[
              [36, 100, 108],
              [292, 300, 324],
            ].map(([x1, , x2], i) => (
              <g key={i}>
                <line x1={x1} y1={205} x2={x2} y2={205} stroke={C.ok} strokeWidth={2} markerEnd="" />
                <Label x={(x1 + x2) / 2} y={198} color={C.ok}>
                  ↔
                </Label>
              </g>
            ))}
            <line x1={200} y1={46} x2={200} y2={100} stroke={C.ok} strokeWidth={2} strokeDasharray="4 3" />
            <Label x={200} y={240}>CLEAR ACCESS (PER MANUFACTURER)</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room x={80} w={220} />
            <Genset x={88} y={220} />
            <rect x={262} y={110} width={34} height={108} fill="#56606d" />
            {[130, 160, 190].map((y) => (
              <rect key={y} x={266} y={y} width={26} height={18} fill="#9b7650" />
            ))}
            <Label x={190} y={240} color={C.bad}>
              NO ROOM TO SERVICE
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "environment":
        return good ? (
          <>
            <Ground />
            <rect x={60} y={205} width={240} height={15} fill="none" stroke="#7b8491" strokeWidth={3} />
            <Genset x={95} y={205} />
            <rect x={320} y={220} width={30} height={22} fill="#24324a" stroke="#7b8491" />
            <Label x={335} y={256}>INTERCEPTOR</Label>
            <Label x={180} y={245}>BUND · SPILL CONTAINMENT</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Genset x={95} y={220} />
            <path d="M200 220 C230 228 260 240 300 236 C320 234 330 240 340 250" stroke="#3a2a10" strokeWidth={10} fill="none" opacity={0.9} />
            <rect x={330} y={222} width={24} height={30} fill="#111" />
            <Label x={330} y={215} color={C.bad}>
              DRAIN
            </Label>
            <Label x={160} y={245} color={C.bad}>
              OIL TO SOIL / DRAIN
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "weather":
        return good ? (
          <>
            <Ground />
            <Genset x={110} y={220} canopy />
            <path d="M150 112 V80 l14 -6" stroke="#5b4a40" strokeWidth={6} fill="none" />
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={20 + i * 28} y1={0} x2={14 + i * 28} y2={14} stroke={C.cool} strokeWidth={1.5} opacity={0.6}>
                <animate attributeName="y1" values="-20;100" dur="1s" begin={`${i * 0.07}s`} repeatCount="indefinite" />
                <animate attributeName="y2" values="-6;114" dur="1s" begin={`${i * 0.07}s`} repeatCount="indefinite" />
              </line>
            ))}
            <Label x={200} y={240}>RAIN-RESISTANT CANOPY · RAIN CAP</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Genset x={110} y={220} />
            <path d="M150 128 V80" stroke="#5b4a40" strokeWidth={6} />
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={20 + i * 28} y1={0} x2={14 + i * 28} y2={14} stroke={C.cool} strokeWidth={1.5} opacity={0.7}>
                <animate attributeName="y1" values="-20;200" dur="1s" begin={`${i * 0.07}s`} repeatCount="indefinite" />
                <animate attributeName="y2" values="-6;214" dur="1s" begin={`${i * 0.07}s`} repeatCount="indefinite" />
              </line>
            ))}
            <Label x={200} y={240} color={C.bad}>
              WATER INTO EXHAUST & ALTERNATOR
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "noise":
        return good ? (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            {[34, 326].map((x) => (
              <g key={x}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <rect key={i} x={x - 4} y={110 + i * 14} width={8} height={10} fill="#56606d" />
                ))}
              </g>
            ))}
            <Waves x={370} y={140} color={C.ok} />
            <path d="M360 220 v-50 l20 -14 l20 14 v50z" fill="#14243a" stroke={C.wall} />
            <Label x={180} y={240}>ATTENUATORS · SILENCER</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <Room />
            <Genset x={95} y={220} />
            <Louvre x={330} y={110} h={60} />
            <Waves x={335} y={140} color={C.bad} big />
            <path d="M360 220 v-50 l20 -14 l20 14 v50z" fill="#14243a" stroke={C.bad} />
            <Label x={180} y={240} color={C.bad}>
              NOISE TO NEIGHBOURS
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
      case "enclosure":
      default:
        return good ? (
          <>
            <Ground />
            <Genset x={110} y={220} canopy />
            <Louvre x={102} y={130} h={70} />
            <Louvre x={288} y={130} h={70} />
            <Arrow d="M330 165 H292 M280 165 H130 M100 165 H50" color={C.cool} />
            <rect x={232} y={160} width={14} height={14} fill="#ffd000" />
            <circle cx={239} cy={167} r={4} fill={C.bad} />
            <Label x={200} y={240}>DOORS · AIRFLOW · EXTERNAL E-STOP</Label>
            <Mark x={380} y={20} ok />
          </>
        ) : (
          <>
            <Ground />
            <rect x={102} y={118} width={186} height={102} fill="#2a3546" stroke="#6b7a8f" />
            <Label x={195} y={170} color={C.bad}>
              SEALED BOX
            </Label>
            <path d="M190 120 c6 -14 16 -10 12 -26 c10 8 14 20 8 30" stroke={C.hot} strokeWidth={3} fill="none" className="animate-pulse" />
            <Label x={200} y={240} color={C.bad}>
              NO AIRFLOW · NO SERVICE ACCESS
            </Label>
            <Mark x={380} y={20} ok={false} />
          </>
        );
    }
  })();

  return (
    <svg viewBox="0 0 400 260" className="w-full rounded-lg bg-[#081120]">
      <defs>
        <clipPath id={`clip-${topic}-${good}`}>
          <rect width={400} height={260} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${topic}-${good})`}>{body}</g>
    </svg>
  );
}
