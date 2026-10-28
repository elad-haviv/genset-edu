import type { IconName } from "@/components/icons";
import type { L } from "@/lib/i18n";
import type { Progress } from "@/lib/progress";
import { components } from "./components";
import { roomHazards } from "./room";
import { safetyTopics, safetyExercises } from "./safety";
import { installTopics } from "./installation";
import { simScenarios } from "./simulator";
import { faultScenarios } from "./faults";
import { calculatorIds } from "./calculators";

export type ModuleDef = {
  id: string;
  href: string;
  icon: IconName;
  title: L;
  short: L;
  desc: L;
  track: "explore" | "simulate" | "learn" | "assess";
  completion: (p: Progress) => number;
};

const pct = (n: number, d: number) => (d === 0 ? 0 : Math.min(100, (n / d) * 100));

export const modules: ModuleDef[] = [
  {
    id: "explorer",
    href: "/explorer",
    icon: "cube",
    track: "explore",
    title: { he: "סייר גנרטור תלת-ממדי", en: "3D Generator Explorer" },
    short: { he: "גנרטור 3D", en: "3D Generator" },
    desc: { he: "סובב, פרק ובחן 19 רכיבים של מערכת גנרטור דיזל — עם תצוגה מפוצצת, מצב הפעלה ואתגר זיהוי.", en: "Rotate, explode and inspect 19 components of a diesel genset — with exploded view, run mode and an identification challenge." },
    completion: (p) => pct(p.explorerViewed.length, components.length) * 0.8 + (p.explorerChallengeBest >= 80 ? 20 : p.explorerChallengeBest * 0.2),
  },
  {
    id: "room",
    href: "/room",
    icon: "room",
    track: "explore",
    title: { he: "חדר גנרטור — זיהוי מפגעים", en: "Generator Room — Hazard Hunt" },
    short: { he: "חדר גנרטור", en: "Generator Room" },
    desc: { he: "השווה בין חדר מתוכנן היטב לחדר לא בטוח. אתר את המפגעים בתלת-ממד והבן את ההשלכות.", en: "Compare a well-designed room with an unsafe one. Locate the hazards in 3D and understand their consequences." },
    completion: (p) => pct(p.roomFound.length, roomHazards.length) * 0.85 + (p.roomChecklistBest >= 80 ? 15 : 0),
  },
  {
    id: "safety",
    href: "/safety",
    icon: "bolt",
    track: "learn",
    title: { he: "מרכז בטיחות חשמל", en: "Electrical Safety Center" },
    short: { he: "בטיחות חשמל", en: "Electrical Safety" },
    desc: { he: "מתח מגע, שיטות הארקה, פחת, הגנות, ניתוק, נעילה ותיוג, הזנה חוזרת — בדיאגרמות מונפשות.", en: "Touch voltage, earthing systems, RCDs, protection, isolation, LOTO and backfeed — with animated diagrams." },
    completion: (p) => pct(p.safetyTopics.length, safetyTopics.length) * 0.6 + pct(Object.values(p.safetyExercises).filter(Boolean).length, safetyExercises.length) * 0.4,
  },
  {
    id: "installation",
    href: "/installation",
    icon: "build",
    track: "learn",
    title: { he: "הנדסת התקנה", en: "Installation Engineering" },
    short: { he: "התקנה", en: "Installation" },
    desc: { he: "יסודות, בידוד רעידות, אוורור, פליטה, דלק, כבילה ומרווחי תחזוקה — השוואה נכון / שגוי.", en: "Foundations, vibration isolation, ventilation, exhaust, fuel, cabling and clearances — proper vs. improper." },
    completion: (p) => pct(p.installTopics.length, installTopics.length),
  },
  {
    id: "simulator",
    href: "/simulator",
    icon: "sld",
    track: "simulate",
    title: { he: "סימולטור מערכת חשמל ו-ATS", en: "Power System & ATS Simulator" },
    short: { he: "סימולטור ATS", en: "ATS Simulator" },
    desc: { he: "דיאגרמה חד-קווית מונפשת: אובדן רשת, התנעה, העברה, חזרת רשת ותקלות. כולל ATS תלת/ארבע-קוטבי.", en: "Animated single-line diagram: mains loss, start, transfer, restoration and faults. Includes 3-pole vs 4-pole ATS." },
    completion: (p) => pct(p.simScenarios.length, simScenarios.length + 1),
  },
  {
    id: "modes",
    href: "/modes",
    icon: "gauge",
    track: "learn",
    title: { he: "מצבי הפעלה ודירוגים", en: "Operating Modes & Ratings" },
    short: { he: "מצבי הפעלה", en: "Ratings" },
    desc: { he: "STANDBY, PRIME ו-CONTINUOUS — פרופילי עומס, מגבלות ומשמעות לאמינות.", en: "STANDBY, PRIME and CONTINUOUS — load profiles, limitations and reliability implications." },
    completion: (p) => pct(p.modesViewed.length, 4),
  },
  {
    id: "redundancy",
    href: "/redundancy",
    icon: "layers",
    track: "simulate",
    title: { he: "אמינות ויתירות", en: "Reliability & Redundancy" },
    short: { he: "יתירות", en: "Redundancy" },
    desc: { he: "גנרטורים במקביל, N+1, חלוקת עומס, נקודות כשל יחידות ופריקת עומסים לפי עדיפות.", en: "Paralleled sets, N+1, load sharing, single points of failure and priority load shedding." },
    completion: (p) => pct(p.redundancyExperiments.length, 4),
  },
  {
    id: "diagnostics",
    href: "/diagnostics",
    icon: "alert",
    track: "simulate",
    title: { he: "אבחון תקלות", en: "Fault Diagnosis" },
    short: { he: "אבחון תקלות", en: "Diagnostics" },
    desc: { he: "10 תרחישי התראה על בקר מציאותי — פענוח, קטגוריות תקלה וסדרי עדיפויות בטוחים.", en: "10 alarm scenarios on a realistic controller — interpretation, fault categories and safe priorities." },
    completion: (p) => pct(Object.keys(p.diagnostics).length, faultScenarios.length),
  },
  {
    id: "calculators",
    href: "/calculators",
    icon: "calc",
    track: "learn",
    title: { he: "מחשבונים הנדסיים", en: "Engineering Calculators" },
    short: { he: "מחשבונים", en: "Calculators" },
    desc: { he: "הספק תלת-פאזי, kW/kVA, מקדם הספק, אחוז העמסה, הערכת ביקוש והשוואת יתירות.", en: "Three-phase power, kW/kVA, power factor, loading, demand estimate and redundancy comparison." },
    completion: (p) => pct(p.calculators.length, calculatorIds.length),
  },
  {
    id: "assessment",
    href: "/assessment",
    icon: "award",
    track: "assess",
    title: { he: "מרכז מבחנים ותעודות", en: "Assessment & Certificates" },
    short: { he: "מבחנים", en: "Assessment" },
    desc: { he: "שלוש רמות הסמכה לימודית: יסודות, התקנה ותחזוקה, והנדסה מתקדמת.", en: "Three educational tracks: fundamentals, installation & maintenance, and advanced engineering." },
    completion: (p) => (["1", "2", "3"] as const).filter((k) => p.exams[k].passed).length * (100 / 3),
  },
];

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<string, ModuleDef>;

export function overallCompletion(p: Progress) {
  return modules.reduce((s, m) => s + m.completion(p), 0) / modules.length;
}
