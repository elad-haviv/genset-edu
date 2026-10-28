import type { L } from "@/lib/i18n";

export type GenState = "off" | "cranking" | "warmup" | "ready" | "onload" | "cooldown" | "shutdown" | "failed";

export type SimState = {
  utility: boolean;
  gen: GenState;
  /** Transfer switch position: utility, generator or neutral (open). */
  ats: "U" | "G" | "O";
  genCb: "closed" | "open" | "tripped";
  /** Fraction of rated generator load (0..1.4) shown on the gauge. */
  load: number;
  alarm?: { level: "warn" | "shutdown" | "trip"; text: L };
  /** Text shown in the controller's status line. */
  status: L;
};

export type SimStep = { at: L; title: L; text: L; state: SimState; ms: number };

export type SimScenario = { id: string; title: L; desc: L; steps: SimStep[] };

const base: SimState = { utility: true, gen: "off", ats: "U", genCb: "open", load: 0, status: { he: "AUTO — מוכן", en: "AUTO — ready" } };
const s = (p: Partial<SimState>): SimState => ({ ...base, ...p });

export const simScenarios: SimScenario[] = [
  {
    id: "normal",
    title: { he: "אספקת רשת תקינה", en: "Utility supply available" },
    desc: { he: "המצב הרגיל: העומסים מוזנים מהרשת, הגנרטור במצב AUTO ומוכן.", en: "Normal state: loads fed from the utility, generator in AUTO and ready." },
    steps: [
      {
        at: { he: "מצב רגיל", en: "Normal" },
        title: { he: "הרשת מזינה את המתקן", en: "Utility feeds the installation" },
        text: {
          he: "ה-ATS במצב רשת. הבקר מנטר את מתח ותדר הרשת ברציפות. המטען שומר על המצברים, מחמם הבלוק שומר על המנוע חם — כדי שהגנרטור יוכל להתניע ולקבל עומס במהירות.",
          en: "The ATS is in the utility position. The controller monitors utility voltage and frequency continuously. The charger maintains batteries and the jacket heater keeps the engine warm — so the set can start and accept load quickly.",
        },
        state: s({}),
        ms: 5000,
      },
    ],
  },
  {
    id: "outage",
    title: { he: "אובדן רשת והעברה אוטומטית", en: "Utility loss & automatic transfer" },
    desc: { he: "רצף מלא: זיהוי הפסקה, התנעה, התייצבות, והעברת העומסים לגנרטור.", en: "Full sequence: outage detection, start, stabilisation and transfer of loads to the generator." },
    steps: [
      { at: { he: "t₀", en: "t₀" }, title: { he: "הרשת תקינה", en: "Utility healthy" }, text: { he: "העומסים מוזנים מהרשת.", en: "Loads fed from utility." }, state: s({}), ms: 2200 },
      {
        at: { he: "t₀ + השהיית זיהוי", en: "t₀ + detection delay" },
        title: { he: "אובדן רשת", en: "Utility lost" },
        text: {
          he: "מתח הרשת נעלם. הבקר ממתין השהיית זיהוי קצרה (ניתנת לכיוון) כדי לא להגיב להפרעות רגעיות. העומסים כרגע ללא מתח — למעט אלה שמוזנים מ-UPS.",
          en: "Utility voltage disappears. The controller waits a short adjustable detection delay to ignore momentary dips. Loads are currently dead — except those on UPS.",
        },
        state: s({ utility: false, ats: "U", status: { he: "רשת: כשל — השהיית התנעה", en: "Mains fail — start delay" } }),
        ms: 2600,
      },
      {
        at: { he: "פקודת התנעה", en: "Start command" },
        title: { he: "התנעה (Cranking)", en: "Cranking" },
        text: {
          he: "הבקר מפעיל את המתנע ואת סולנואיד הדלק. אם המנוע לא מתניע בזמן מוגבל — יש הפסקה וניסיון נוסף, עד מספר ניסיונות מוגדר.",
          en: "The controller energises the starter and fuel solenoid. If the engine doesn't fire within a set time, it rests and retries, up to a set number of attempts.",
        },
        state: s({ utility: false, gen: "cranking", status: { he: "התנעה — ניסיון 1", en: "Cranking — attempt 1" } }),
        ms: 2400,
      },
      {
        at: { he: "התייצבות", en: "Stabilising" },
        title: { he: "עלייה למהירות ומתח", en: "Run-up to speed and voltage" },
        text: {
          he: "המנוע מגיע למהירות נומינלית, ה-AVR מעלה את המתח. הבקר ממתין שהמתח והתדר יהיו בתחום המוגדר (ולעיתים זמן חימום) לפני מתן אישור העברה.",
          en: "The engine reaches rated speed and the AVR builds voltage. The controller waits for voltage and frequency to be within limits (and sometimes a warm-up time) before permitting transfer.",
        },
        state: s({ utility: false, gen: "warmup", status: { he: "התייצבות V / Hz", en: "Stabilising V / Hz" } }),
        ms: 2600,
      },
      {
        at: { he: "גנרטור זמין", en: "Generator available" },
        title: { he: "אספקת גנרטור זמינה", en: "Generator supply available" },
        text: { he: "המתח והתדר יציבים. מפסק הגנרטור סגור — הגנרטור מוכן לקבל עומס.", en: "Voltage and frequency are stable. The generator breaker closes — the set is ready to accept load." },
        state: s({ utility: false, gen: "ready", genCb: "closed", status: { he: "גנרטור זמין", en: "Generator available" } }),
        ms: 2200,
      },
      {
        at: { he: "העברה", en: "Transfer" },
        title: { he: "העברה פתוחה (Open transition)", en: "Open-transition transfer" },
        text: {
          he: "ה-ATS מתנתק מהרשת, עובר דרך מצב ניטרלי, ומתחבר לגנרטור. השילוב המכני והחשמלי מבטיח שלעולם לא יחוברו שני המקורות יחד — מונע הזנה חוזרת.",
          en: "The ATS opens from the utility, passes through neutral and closes to the generator. Mechanical and electrical interlocks ensure the two sources are never connected together — preventing backfeed.",
        },
        state: s({ utility: false, gen: "ready", genCb: "closed", ats: "O", status: { he: "העברה…", en: "Transferring…" } }),
        ms: 1600,
      },
      {
        at: { he: "על גנרטור", en: "On generator" },
        title: { he: "העומסים מוזנים מהגנרטור", en: "Loads on generator" },
        text: {
          he: "העומסים מתחברים — לעיתים בשלבים (Load steps) כדי לא לחרוג מיכולת קבלת העומס של המנוע. הבקר מנטר מתח, תדר, הספק, לחץ שמן וטמפרטורה.",
          en: "Loads connect — sometimes in steps so as not to exceed the engine's load-acceptance capability. The controller monitors voltage, frequency, power, oil pressure and temperature.",
        },
        state: s({ utility: false, gen: "onload", genCb: "closed", ats: "G", load: 0.62, status: { he: "על עומס", en: "On load" } }),
        ms: 4000,
      },
    ],
  },
  {
    id: "restore",
    title: { he: "חזרת רשת והחזרה", en: "Utility restoration & retransfer" },
    desc: { he: "הרשת חוזרת: השהיית יציבות, החזרה לרשת, קירור ועצירה.", en: "Utility returns: stability delay, retransfer, cool-down and stop." },
    steps: [
      { at: { he: "על גנרטור", en: "On generator" }, title: { he: "הגנרטור מזין", en: "Generator feeding" }, text: { he: "העומסים מוזנים מהגנרטור.", en: "Loads are fed by the generator." }, state: s({ utility: false, gen: "onload", genCb: "closed", ats: "G", load: 0.62, status: { he: "על עומס", en: "On load" } }), ms: 2000 },
      {
        at: { he: "חזרת רשת", en: "Utility returns" },
        title: { he: "השהיית חזרה (Return delay)", en: "Return delay" },
        text: {
          he: "הרשת חזרה, אבל הבקר לא ממהר: הוא ממתין זמן מוגדר כדי לוודא שהרשת יציבה, ולא תיפול שוב מיד אחרי ההחזרה.",
          en: "The utility is back, but the controller doesn't rush: it waits a set time to confirm the utility is stable and won't fail again right after retransfer.",
        },
        state: s({ utility: true, gen: "onload", genCb: "closed", ats: "G", load: 0.62, status: { he: "רשת תקינה — השהיית חזרה", en: "Mains OK — return delay" } }),
        ms: 3000,
      },
      {
        at: { he: "החזרה", en: "Retransfer" },
        title: { he: "העברה חזרה לרשת", en: "Transfer back to utility" },
        text: { he: "ה-ATS עובר דרך ניטרלי בחזרה לרשת. הפסקה קצרה לעומסים במעבר פתוח.", en: "The ATS passes through neutral back to the utility. A brief break for loads in open transition." },
        state: s({ utility: true, gen: "ready", genCb: "closed", ats: "O", status: { he: "העברה לרשת…", en: "Transfer to mains…" } }),
        ms: 1600,
      },
      {
        at: { he: "קירור", en: "Cool-down" },
        title: { he: "ריצת קירור ללא עומס", en: "Off-load cool-down" },
        text: {
          he: "הגנרטור ממשיך לרוץ ללא עומס זמן מוגדר כדי לקרר את הטורבו והמנוע בהדרגה — עצירה חמה מיידית מקצרת את חיי הטורבו.",
          en: "The set keeps running off-load for a set time to cool the turbo and engine gradually — an immediate hot stop shortens turbo life.",
        },
        state: s({ utility: true, gen: "cooldown", genCb: "open", ats: "U", status: { he: "קירור", en: "Cooling down" } }),
        ms: 3000,
      },
      { at: { he: "סיום", en: "End" }, title: { he: "עצירה וחזרה ל-AUTO", en: "Stop and return to AUTO" }, text: { he: "המנוע נעצר והמערכת חוזרת להמתנה.", en: "The engine stops and the system returns to standby." }, state: s({}), ms: 2500 },
    ],
  },
  {
    id: "alarm",
    title: { he: "התראת הגנה — עומס-יתר", en: "Protection alarm — overload" },
    desc: { he: "עומס חורג מיכולת הגנרטור: אזהרה, ואז ניתוק מפסק.", en: "Load exceeds the generator's capability: warning, then breaker trip." },
    steps: [
      { at: { he: "על גנרטור", en: "On generator" }, title: { he: "הזנה רגילה", en: "Normal supply" }, text: { he: "הגנרטור מזין 70% מהדירוג.", en: "The set supplies 70% of rating." }, state: s({ utility: false, gen: "onload", genCb: "closed", ats: "G", load: 0.7, status: { he: "על עומס", en: "On load" } }), ms: 2000 },
      {
        at: { he: "עלייה בעומס", en: "Load increase" },
        title: { he: "אזהרת עומס-יתר", en: "Overload warning" },
        text: {
          he: "עומסים נוספים (למשל מזגנים שחזרו לפעול) מעלים את ההספק מעל הדירוג. הבקר מתריע; במתקן מתוכנן היטב פריקת עומסים לא-חיוניים תתבצע כאן.",
          en: "Additional loads (e.g. chillers restarting) push power above rating. The controller warns; in a well-designed installation non-essential load shedding would act here.",
        },
        state: s({ utility: false, gen: "onload", genCb: "closed", ats: "G", load: 1.18, alarm: { level: "warn", text: { he: "אזהרה: עומס-יתר kW", en: "WARNING: kW overload" } }, status: { he: "אזהרה פעילה", en: "Warning active" } }),
        ms: 3200,
      },
      {
        at: { he: "ניתוק", en: "Trip" },
        title: { he: "ניתוק מפסק הגנרטור", en: "Generator breaker trip" },
        text: {
          he: "ההגנה מנתקת את מפסק הגנרטור כדי להגן על הגנרטור והכבלים. העומסים ללא מתח. הגנרטור ממשיך לרוץ ללא עומס לקירור. לפני חיבור מחדש — בירור הסיבה ע״י מוסמך.",
          en: "Protection opens the generator breaker to protect machine and cables. Loads are dead. The set runs off-load to cool. Before re-closing — cause investigated by a qualified person.",
        },
        state: s({ utility: false, gen: "cooldown", genCb: "tripped", ats: "G", load: 0, alarm: { level: "trip", text: { he: "ניתוק: עומס-יתר — מפסק גנרטור", en: "TRIP: overload — gen breaker" } }, status: { he: "ניתוק חשמלי", en: "Electrical trip" } }),
        ms: 4500,
      },
    ],
  },
  {
    id: "unavailable",
    title: { he: "גנרטור לא זמין", en: "Generator unavailable" },
    desc: { he: "הרשת נופלת והגנרטור לא מתניע — כשל התנעה.", en: "Utility fails and the generator won't start — fail to start." },
    steps: [
      { at: { he: "t₀", en: "t₀" }, title: { he: "אובדן רשת", en: "Utility lost" }, text: { he: "הרשת נופלת; הבקר נותן פקודת התנעה.", en: "Utility fails; the controller commands a start." }, state: s({ utility: false, status: { he: "רשת: כשל", en: "Mains fail" } }), ms: 2000 },
      { at: { he: "ניסיון 1", en: "Attempt 1" }, title: { he: "התנעה — ללא הצלחה", en: "Cranking — no fire" }, text: { he: "המתנע מסובב לאט — מתח המצבר קורס תחת עומס.", en: "The starter turns slowly — battery voltage collapses under load." }, state: s({ utility: false, gen: "cranking", status: { he: "התנעה — ניסיון 1", en: "Cranking — attempt 1" } }), ms: 2000 },
      { at: { he: "המתנה", en: "Rest" }, title: { he: "הפסקה בין ניסיונות", en: "Rest between attempts" }, text: { he: "הפסקה להגנה על המתנע ולהתאוששות המצבר.", en: "Rest to protect the starter and let the battery recover." }, state: s({ utility: false, status: { he: "המתנה בין ניסיונות", en: "Crank rest" } }), ms: 1400 },
      { at: { he: "ניסיון אחרון", en: "Final attempt" }, title: { he: "ניסיון אחרון", en: "Final attempt" }, text: { he: "גם הניסיון האחרון נכשל.", en: "The last attempt also fails." }, state: s({ utility: false, gen: "cranking", status: { he: "התנעה — ניסיון אחרון", en: "Cranking — final attempt" } }), ms: 2000 },
      {
        at: { he: "כשל", en: "Fail" },
        title: { he: "כשל התנעה — העומסים ללא אספקה", en: "Fail to start — loads unsupplied" },
        text: {
          he: "הבקר נועל את המערכת עם התראת Fail to start. המתקן בחושך. זה בדיוק התרחיש שתחזוקה מונעת (מצברים, מטען, דלק) והפעלות ניסיון נועדו למנוע — ובמתקנים קריטיים, גם יתירות (N+1).",
          en: "The controller locks out with a Fail-to-start alarm. The site is dark. This is exactly what preventive maintenance (batteries, charger, fuel) and test runs aim to prevent — and in critical sites, redundancy (N+1).",
        },
        state: s({ utility: false, gen: "failed", alarm: { level: "shutdown", text: { he: "כיבוי: כשל התנעה", en: "SHUTDOWN: fail to start" } }, status: { he: "נעילה — כשל התנעה", en: "Lockout — fail to start" } }),
        ms: 5000,
      },
    ],
  },
];
