import type { L, LList } from "@/lib/i18n";
import type { Kind } from "@/components/ui";

export type DiagramKey = "touch" | "earthing" | "rcd" | "overcurrent" | "isolation" | "loto" | "backfeed" | "estop" | "fire" | "boundary" | "rotating";

export type SafetyTopic = {
  id: string;
  title: L;
  diagram: DiagramKey;
  /** Initial state for diagrams that support several. */
  diagramState?: string;
  summary: L;
  points: LList;
  notes: { kind: Kind; text: L }[];
};

export const safetyTopics: SafetyTopic[] = [
  {
    id: "shock",
    title: { he: "סכנות התחשמלות", en: "Electric shock hazards" },
    diagram: "touch",
    diagramState: "nofault-pe",
    summary: {
      he: "התחשמלות מתרחשת כשגוף האדם משלים מעגל בין שתי נקודות בפוטנציאל שונה. חומרת הפגיעה תלויה בגודל הזרם, במסלולו בגוף ובמשך החשיפה.",
      en: "Electric shock occurs when the body completes a circuit between two points at different potentials. Severity depends on current magnitude, path through the body and duration.",
    },
    points: {
      he: ["מגע ישיר — נגיעה בחלק שמחושמל בתפקוד רגיל (מוליך, פס צבירה)", "מגע עקיף — נגיעה בחלק מתכתי שהתחשמל עקב תקלת בידוד", "השפעות הזרם על הגוף מתוארות ב-IEC 60479-1 כתלות בזרם ובזמן", "מסלול יד-ליד או יד-רגל עובר דרך אזור הלב", "גם לאחר כיבוי גנרטור יש לוודא העדר מתח — ייתכנו מקורות הזנה נוספים"],
      en: ["Direct contact — touching a part live in normal service (conductor, busbar)", "Indirect contact — touching exposed metal made live by an insulation fault", "Effects of current on the body are described in IEC 60479-1 as a function of current and time", "Hand-to-hand or hand-to-foot paths cross the heart region", "Even after a generator stops, absence of voltage must be verified — other sources may exist"],
    },
    notes: [
      { kind: "principle", text: { he: "הגנה מפני התחשמלות בנויה משכבות: הגנה בסיסית (בידוד, מעטפות) והגנה בתקלה (הארקה + ניתוק אוטומטי). IEC 60364-4-41.", en: "Shock protection is layered: basic protection (insulation, enclosures) and fault protection (earthing + automatic disconnection). IEC 60364-4-41." } },
      { kind: "regulation", text: { he: "בישראל חלות תקנות החשמל (הארקות ושיטות הגנה בפני חשמול) ותקנות החשמל הנוספות — יש לפעול לפי הנוסח העדכני.", en: "In Israel the Electricity Regulations (earthing and protection against electric shock) and related regulations apply — always use the current version." } },
    ],
  },
  {
    id: "touch",
    title: { he: "מתח מגע ומתח תקלה", en: "Touch voltage & fault voltage" },
    diagram: "touch",
    diagramState: "fault-nope",
    summary: {
      he: "מתח תקלה הוא המתח שמופיע בין חלק מתכתי חשוף לבין האדמה בזמן תקלת בידוד. מתח מגע הוא החלק ממנו שאדם יכול לגשר בגופו בפועל.",
      en: "Fault voltage is the voltage that appears between exposed metal and earth during an insulation fault. Touch voltage is the part of it a person can actually bridge with their body.",
    },
    points: {
      he: ["ללא מוליך הארקה תקין — המעטפת עשויה לעלות כמעט למתח הפאזה", "עם מוליך הארקה — מתח המגע מוגבל ע״י חלוקת המתח בלולאת התקלה", "זמן הניתוק המרבי המותר תלוי במתח ובסוג המעגל — נקבע בתקן ובתקנות", "השוואת פוטנציאלים מקטינה הפרשי מתח בין חלקים שניתן לגעת בהם בו-זמנית"],
      en: ["Without an intact protective conductor the enclosure may rise almost to phase voltage", "With a protective conductor, touch voltage is limited by the voltage division in the fault loop", "Maximum permitted disconnection time depends on voltage and circuit type — set by the standard and regulations", "Equipotential bonding reduces voltage between simultaneously accessible parts"],
    },
    notes: [
      { kind: "principle", text: { he: "התנגדות לולאת התקלה הנמוכה מאפשרת זרם תקלה גבוה מספיק להפעלת ההגנה בזמן הנדרש.", en: "Low fault-loop impedance allows enough fault current to operate the protective device within the required time." } },
      { kind: "example", text: { he: "בדיאגרמה — המספרים הם המחשה בלבד, לא ערכי תכנון.", en: "In the diagram — any values are illustrative, not design values." } },
    ],
  },
  {
    id: "earthing",
    title: { he: "הארקת הגנה והשוואת פוטנציאלים", en: "Protective earthing & bonding" },
    diagram: "touch",
    diagramState: "fault-pe",
    summary: {
      he: "הארקת הגנה מחברת חלקים מתכתיים חשופים למוליך הגנה (PE). בתקלת בידוד נוצר מסלול מכוון לזרם התקלה, וההגנה מנתקת את ההזנה.",
      en: "Protective earthing connects exposed metal to the protective conductor (PE). During an insulation fault, it provides a deliberate path for fault current so that protection disconnects the supply.",
    },
    points: {
      he: ["מוליך PE מסומן ירוק-צהוב ואסור לשמש למטרה אחרת", "בגנרטור: הדק הארקה בשלדה ובתיבת ההדקים, וחיבור לפס השוואת הפוטנציאלים הראשי", "רציפות מוליך ההגנה נבדקת ע״י בודק מוסמך", "ניתוק PE לא משבש את פעולת הציוד — ולכן הוא מסוכן ״בשקט״"],
      en: ["The PE conductor is green-yellow and must not be used for any other purpose", "On a genset: earth stud on the frame and in the terminal box, bonded to the main earthing terminal", "Protective-conductor continuity is tested by an authorised tester", "A disconnected PE does not affect equipment operation — so it is 'silently' dangerous"],
    },
    notes: [
      { kind: "principle", text: { he: "הארקה לבדה אינה מגינה — היא חייבת לעבוד יחד עם אמצעי ניתוק אוטומטי מתואם.", en: "Earthing alone does not protect — it must work together with a coordinated automatic disconnection device." } },
    ],
  },
  {
    id: "neutral",
    title: { he: "סידורי אפס והארקה בגנרטור", en: "Neutral & earthing arrangements" },
    diagram: "earthing",
    diagramState: "TN-S",
    summary: {
      he: "גנרטור הוא מקור הזנה. כאשר הוא מזין את המתקן, חייבת להיות נקודת חיבור אחת ומוגדרת בין האפס (N) להארקה (PE) כדי שההגנות יפעלו — ואסור שיהיו חיבורים כפולים.",
      en: "A generator is a source of supply. When it feeds the installation there must be one defined connection between neutral (N) and earth (PE) so protections can operate — and no duplicate bonds.",
    },
    points: {
      he: ["מפסק החלפה 4-קוטבי (מנתק גם את N) — הגנרטור מוגדר כמקור נפרד, עם חיבור N-PE משלו", "מפסק 3-קוטבי (N משותף) — האפס של הגנרטור מחובר דרך האפס המשותף, ואסור להוסיף חיבור N-PE בגנרטור", "חיבור N-PE כפול יוצר זרמי אפס במוליכי ההגנה ועלול לשבש הגנות זליגה", "הבחירה נעשית בתכנון ע״י מהנדס בהתאם לשיטת ההארקה ולתקנות"],
      en: ["4-pole transfer switch (switches N too) — the generator is a separately derived source with its own N-PE bond", "3-pole switch (solid neutral) — the generator neutral is referenced through the common neutral; no N-PE bond is added at the generator", "Duplicate N-PE bonds cause neutral current on protective conductors and can upset earth-fault protection", "The choice is made in design by an engineer according to the earthing system and regulations"],
    },
    notes: [
      { kind: "principle", text: { he: "ראו את הסימולטור ב״מערכת חשמל ו-ATS״ — לשונית 3P/4P — להמחשה מונפשת.", en: "See the Power System & ATS simulator — 3P/4P tab — for an animated illustration." } },
      { kind: "regulation", text: { he: "שיטות ההארקה המותרות ואופן חיבור מקור חלופי כפופים לתקנות החשמל ולדרישות חברת החשמל.", en: "Permitted earthing systems and how an alternative source is connected are subject to electrical regulations and utility requirements." } },
    ],
  },
  {
    id: "systems",
    title: { he: "שיטות הארקה: TN-S, TN-C-S, IT", en: "Earthing systems: TN-S, TN-C-S, IT" },
    diagram: "earthing",
    diagramState: "TN-C-S",
    summary: {
      he: "שיטת ההארקה מתארת כיצד מקור ההזנה מחובר לאדמה (אות ראשונה) וכיצד החלקים המתכתיים מחוברים (אות שנייה). היא קובעת את מסלול זרם התקלה ואת אמצעי ההגנה המתאים.",
      en: "The earthing system describes how the source is connected to earth (first letter) and how exposed metal parts are connected (second letter). It determines the fault-current path and suitable protection.",
    },
    points: {
      he: ["TN-S — נקודת הכוכב מוארקת; מוליכי N ו-PE נפרדים לכל אורך המתקן", "TN-C-S — מוליך PEN משותף בחלק מהרשת, ומנקודה מסוימת מפוצל ל-N ו-PE (לא מחברים מחדש)", "IT — המקור מבודד מהאדמה או מוארק דרך עכבה גבוהה; תקלה ראשונה אינה גורמת לניתוק אך חייבת להתגלות ע״י מנטר בידוד ולהיות מתוקנת", "תקלה שנייה ב-IT לפני תיקון הראשונה עלולה להיות קצר בין-פאזי דרך האדמה"],
      en: ["TN-S — star point earthed; separate N and PE conductors throughout", "TN-C-S — combined PEN in part of the system, split into N and PE at a defined point (never recombined)", "IT — source isolated from earth or earthed through high impedance; a first fault does not trip but must be detected by an insulation monitor and repaired", "A second fault in IT before clearing the first can be a phase-to-phase fault via earth"],
    },
    notes: [
      { kind: "principle", text: { he: "ההגדרות לפי IEC 60364-1. שיטת IT נפוצה במתקנים שבהם רציפות הזנה קריטית (למשל חדרי ניתוח), עם דרישות ייעודיות.", en: "Definitions per IEC 60364-1. IT systems are common where supply continuity is critical (e.g. operating theatres), with dedicated requirements." } },
    ],
  },
  {
    id: "earthfault",
    title: { he: "הגנה מפני תקלה לאדמה", en: "Earth fault protection concepts" },
    diagram: "touch",
    diagramState: "trip",
    summary: {
      he: "תקלה לאדמה היא חיבור לא מכוון בין מוליך חי לבין חלק מוארק. מטרת ההגנה — לנתק במהירות לפני שמתח המגע יגרום לפגיעה, ולפני שהתחממות תגרום לשריפה.",
      en: "An earth fault is an unintended connection between a live conductor and an earthed part. Protection aims to disconnect quickly before touch voltage causes harm and before heating causes fire.",
    },
    points: {
      he: ["ניתוק אוטומטי ע״י מפסק זרם או נתיך — אם זרם התקלה מספיק גבוה", "ממסר זליגה (Earth fault relay / G) — בגנרטורים ובלוחות גדולים", "ממסר פחת (RCD) — לזרמי זליגה קטנים והגנה נוספת", "זרם הקצר של גנרטור נמוך משל רשת — יש לוודא שההגנות יפעלו גם כשמוזנים מהגנרטור"],
      en: ["Automatic disconnection by breaker or fuse — if fault current is high enough", "Earth-fault relay (G) — on generators and large switchboards", "RCD — for small leakage currents and additional protection", "Generator fault current is lower than utility — verify protections operate when fed from the generator"],
    },
    notes: [
      { kind: "recommendation", text: { he: "בתכנון מתקן עם גנרטור יש לבדוק תיאום הגנות עבור שני מקורות ההזנה — רשת וגנרטור.", en: "When designing with a generator, protection coordination must be verified for both sources — utility and generator." } },
    ],
  },
  {
    id: "rcd",
    title: { he: "ממסר פחת (RCD)", en: "Residual current protection (RCD)" },
    diagram: "rcd",
    summary: {
      he: "ממסר פחת משווה את הזרם הנכנס לזרם החוזר. כל הפרש (זרם שדולף לאדמה — למשל דרך גוף אדם) מעל רגישות ההתקן גורם לניתוק.",
      en: "An RCD compares outgoing and returning current. Any difference (current leaking to earth — e.g. through a person) above its sensitivity trips the device.",
    },
    points: {
      he: ["הזרמים עוברים דרך שנאי טבעתי; במצב תקין השטפים מתקזזים", "זליגה יוצרת שטף שיורי המשרה מתח בליפוף החישה ← ניתוק", "RCD אינו מגן מפני עומס-יתר או קצר בין פאזה לאפס", "לחצן הבדיקה בודק את המנגנון — לא את מתקן ההארקה", "קיימים סוגים (AC, A, F, B) בהתאם לצורת זרם הזליגה הצפויה"],
      en: ["Conductors pass through a toroidal transformer; normally fluxes cancel", "Leakage creates residual flux inducing voltage in the sense winding → trip", "An RCD does not protect against overload or phase-neutral short circuit", "The test button tests the mechanism — not the earthing installation", "Types (AC, A, F, B) depend on the expected leakage waveform"],
    },
    notes: [
      { kind: "principle", text: { he: "תקני מוצר: IEC 61008 / IEC 61009. הדרישה היכן להתקין RCD נקבעת בתקנות ובתקן ההתקנה.", en: "Product standards: IEC 61008 / IEC 61009. Where RCDs are required is set by regulations and the installation standard." } },
      { kind: "recommendation", text: { he: "שימו לב: חיבורי N-PE כפולים במתקן עם גנרטור עלולים לגרום להפעלות שווא של פחת.", en: "Note: duplicate N-PE bonds in a generator installation can cause RCD nuisance tripping." } },
    ],
  },
  {
    id: "shortcircuit",
    title: { he: "הגנה מפני קצר", en: "Short-circuit protection" },
    diagram: "overcurrent",
    diagramState: "short",
    summary: {
      he: "קצר הוא חיבור בעכבה נמוכה מאוד בין מוליכים בפוטנציאל שונה. הזרם עולה פי כמה וכמה מהזרם הנומינלי, וההגנה חייבת לנתק כמעט מיידית.",
      en: "A short circuit is a very low-impedance connection between conductors at different potentials. Current rises to many times rated current and protection must disconnect almost instantly.",
    },
    points: {
      he: ["מנגנון מגנטי / אלקטרוני מגיב מיידית לזרמים גבוהים", "כושר הניתוק של המפסק חייב להיות גבוה מזרם הקצר הצפוי בנקודת ההתקנה", "בגנרטור, זרם הקצר דועך עם הזמן — חשוב לכיול ההגנות ולסלקטיביות", "קצר גורם לקשת חשמלית, לכוחות אלקטרודינמיים ולחום עז"],
      en: ["Magnetic / electronic element responds instantly to high currents", "Breaking capacity must exceed the prospective short-circuit current at the point of installation", "With a generator, short-circuit current decays over time — important for settings and selectivity", "A short circuit produces arcing, electrodynamic forces and intense heat"],
    },
    notes: [
      { kind: "principle", text: { he: "תקן מפסקים: IEC 60947-2 (תעשייתי), IEC 60898-1 (ביתי). העקומים בדיאגרמה הם קונספטואליים.", en: "Breaker standards: IEC 60947-2 (industrial), IEC 60898-1 (domestic). Curves in the diagram are conceptual." } },
    ],
  },
  {
    id: "overload",
    title: { he: "הגנה מפני עומס-יתר", en: "Overload protection" },
    diagram: "overcurrent",
    diagramState: "overload",
    summary: {
      he: "עומס-יתר הוא זרם גבוה מהנומינלי במעגל תקין. הוא לא מסוכן מיידית אבל מחמם כבלים וציוד לאורך זמן, ולכן ההגנה מגיבה בהשהיה הפוכה לגודל הזרם.",
      en: "Overload is current above rating in a healthy circuit. It is not instantly dangerous but heats cables and equipment over time, so protection responds with a delay inversely related to current.",
    },
    points: {
      he: ["מנגנון תרמי (בימטל) או אלקטרוני בעקום זמן-זרם הפוך", "תיאום בין זרם העומס, זרם ההגנה וכושר ההולכה של הכבל", "גנרטור בעומס-יתר: ירידת תדר ומתח, התחממות ולבסוף ניתוק המפסק", "פריקת עומסים לפי עדיפות יכולה למנוע ניתוק מלא"],
      en: ["Thermal (bimetal) or electronic element with an inverse time-current curve", "Coordination between load current, protective setting and cable ampacity", "Generator in overload: frequency and voltage dip, heating and finally breaker trip", "Priority load shedding can prevent a total trip"],
    },
    notes: [
      { kind: "principle", text: { he: "עקרון התיאום: זרם תכנון ≤ זרם נומינלי של ההגנה ≤ כושר הולכת הכבל (IEC 60364-4-43).", en: "Coordination principle: design current ≤ protective device rating ≤ cable ampacity (IEC 60364-4-43)." } },
    ],
  },
  {
    id: "isolation",
    title: { he: "עקרונות ניתוק ובידוד", en: "Electrical isolation principles" },
    diagram: "isolation",
    summary: {
      he: "בידוד (Isolation) הוא ניתוק בטוח ומוודא של כל מקורות האנרגיה מהציוד לפני עבודה. בגנרטור יש כמה מקורות: רשת, גנרטור, מצברים, מטען, מחממים ומתח בקרה חיצוני.",
      en: "Isolation is the secure, verified disconnection of all energy sources from equipment before work. A generator installation has several: utility, generator, batteries, charger, heaters and external control supplies.",
    },
    points: {
      he: ["ההתקן המנתק חייב להיות מתאים לבידוד (Isolator) ונעיל", "לחצן חירום ומצב OFF בבקר אינם אמצעי בידוד", "יש למנוע התנעה אוטומטית — כולל ניתוק מצברים לפי נוהל היצרן", "וידוא העדר מתח ע״י אדם מוסמך בכלי מדידה מתאים ונבדק"],
      en: ["The disconnecting device must be suitable for isolation and lockable", "Emergency stop and controller OFF are not means of isolation", "Automatic start must be prevented — including battery disconnection per manufacturer procedure", "Absence of voltage verified by a qualified person with a suitable, proven instrument"],
    },
    notes: [
      { kind: "regulation", text: { he: "עבודה במתקן חשמל מותרת רק לבעלי רישיון מתאים, בהתאם לחוק החשמל ותקנותיו ולנהלי המעסיק.", en: "Work on electrical installations is permitted only to appropriately licensed persons, under electrical law, regulations and employer procedures." } },
    ],
  },
  {
    id: "loto",
    title: { he: "נעילה ותיוג (LOTO)", en: "Lockout / Tagout (LOTO)" },
    diagram: "loto",
    summary: {
      he: "נעילה ותיוג מבטיחים שאיש לא יחזיר אנרגיה לציוד בזמן שעובדים עליו. כל עובד שם מנעול אישי, והציוד חוזר לשירות רק אחרי שכל המנעולים הוסרו בידי בעליהם.",
      en: "Lockout/tagout ensures nobody re-energises equipment while people work on it. Each worker applies a personal lock, and equipment returns to service only after every lock is removed by its owner.",
    },
    points: {
      he: ["זיהוי כל מקורות האנרגיה — חשמלית, מכנית, תרמית, לחץ, כימית (דלק)", "הודעה לגורמים המושפעים", "כיבוי מסודר, ניתוק, נעילה ותיוג", "שחרור אנרגיה אגורה (למשל המתנה להתקררות, פריקת לחץ)", "וידוא העדר אנרגיה לפני תחילת העבודה"],
      en: ["Identify all energy sources — electrical, mechanical, thermal, pressure, chemical (fuel)", "Notify affected people", "Orderly shutdown, isolation, lock and tag", "Release stored energy (e.g. allow cooling, relieve pressure)", "Verify zero energy before starting work"],
    },
    notes: [
      { kind: "principle", text: { he: "התרגיל כאן הוא הבנת הלוגיקה של התהליך — הנוהל המחייב הוא של הארגון והיצרן.", en: "The exercise here builds understanding of the logic — the binding procedure is the organisation's and the manufacturer's." } },
    ],
  },
  {
    id: "backfeed",
    title: { he: "סכנת הזנה חוזרת (Backfeed)", en: "Generator backfeed hazards" },
    diagram: "backfeed",
    summary: {
      he: "גנרטור המחובר למתקן ללא מפסק החלפה מתאים עלול להזין חזרה את רשת החשמל. השנאי מעלה את המתח לרמת מתח גבוה — וחושף עובדי רשת שבטוחים שהקו מנותק לסכנת מוות.",
      en: "A generator connected without a suitable transfer switch can feed back into the utility network. The transformer steps the voltage up — exposing line workers who believe the line is dead to lethal danger.",
    },
    points: {
      he: ["מפסק החלפה (ATS / ידני) עם שילוב מכני וחשמלי מונע חיבור בו-זמני", "חיבור גנרטור ״מאולתר״ דרך שקע — אסור ומסוכן ביותר", "חזרת רשת על גנרטור מחובר עלולה גם להרוס את הגנרטור", "חיבור מקור חלופי מחייב אישור ותיאום לפי דרישות הדין וספק החשמל"],
      en: ["A transfer switch (ATS / manual) with mechanical and electrical interlocking prevents simultaneous connection", "Improvised connection of a generator via a socket outlet is prohibited and extremely dangerous", "Utility restoration onto a connected generator can also destroy the generator", "Connecting an alternative source requires approval and coordination per law and the network operator"],
    },
    notes: [
      { kind: "regulation", text: { he: "חיבור מקור הזנה חלופי למתקן מוסדר בתקנות החשמל ובדרישות ספק החשמל.", en: "Connecting an alternative supply source is governed by electrical regulations and the network operator's requirements." } },
    ],
  },
  {
    id: "estop",
    title: { he: "עצירת חירום", en: "Emergency shutdown" },
    diagram: "estop",
    summary: {
      he: "עצירת חירום נועדה לעצור במהירות סכנה מתפתחת — שריפה, פגיעה באדם, דליפה. היא חייבת להיות נגישה, מסומנת, ולפעול גם כשהבקר אינו תקין (מעגל קשיח).",
      en: "Emergency stop exists to halt a developing hazard quickly — fire, injury, leak. It must be accessible, clearly marked and work even if the controller is faulty (hard-wired circuit).",
    },
    points: {
      he: ["לחצן אדום על רקע צהוב, ננעל במצב לחוץ", "בדרך כלל: אחד על הגנרטור ואחד מחוץ לחדר", "שחרור הלחצן אינו מתניע — נדרש איפוס מכוון", "E-STOP ≠ בידוד: אחרי עצירה עדיין ייתכן מתח במעגלי בקרה ומהרשת"],
      en: ["Red button on a yellow background, latching", "Typically one on the set and one outside the room", "Releasing the button does not restart — a deliberate reset is required", "E-STOP ≠ isolation: control circuits and utility supply may still be live after a stop"],
    },
    notes: [
      { kind: "principle", text: { he: "עקרונות לתכנון פונקציית עצירת חירום: ISO 13850; ציוד חשמלי של מכונות: IEC 60204-1.", en: "Design principles for emergency stop function: ISO 13850; electrical equipment of machines: IEC 60204-1." } },
    ],
  },
  {
    id: "fire",
    title: { he: "סכנות שריפה חשמלית", en: "Electrical fire hazards" },
    diagram: "fire",
    summary: {
      he: "חדר גנרטור משלב דלק, משטחים חמים, חשמל בהספק גבוה ומצברים פולטי מימן. שריפה יכולה להתחיל מחיבור רופף, מעומס-יתר, מקשת חשמלית או מדלק שנוגע בצנרת פליטה.",
      en: "A generator room combines fuel, hot surfaces, high-power electricity and hydrogen-emitting batteries. Fire can start from a loose connection, overload, arcing, or fuel contacting exhaust piping.",
    },
    points: {
      he: ["חיבור רופף ← התנגדות מגע ← התחממות מקומית", "דליפת דלק על פליטה חמה — מקור הצתה מוכר", "כבלים בחתך לא מספק או מקובצים — התחממות", "שימוש במטף מתאים לסוג השריפה; כיבוי בציוד חשמלי מחייב חומר כיבוי מתאים"],
      en: ["Loose connection → contact resistance → local heating", "Fuel leaking onto hot exhaust — a well-known ignition source", "Undersized or tightly grouped cables — overheating", "Use an extinguisher suited to the fire class; electrical equipment requires a suitable agent"],
    },
    notes: [
      { kind: "recommendation", text: { he: "תרמוגרפיה תקופתית בלוחות ובחיבורים ע״י מוסמך מאפשרת לגלות התחממות מוקדם.", en: "Periodic thermography of panels and connections by a qualified person detects heating early." } },
    ],
  },
  {
    id: "boundary",
    title: { he: "גבולות עבודה בטוחים", en: "Safe working boundaries" },
    diagram: "boundary",
    summary: {
      he: "סביב ציוד מחושמל מוגדרים אזורים שבהם נדרשים הרשאה, ציוד מגן אישי ונהלים מתאימים. המרחקים תלויים במתח, בסוג העבודה ובניתוח סיכוני קשת — ונקבעים לפי התקנות והתקנים החלים.",
      en: "Around energized equipment, zones are defined where authorisation, PPE and procedures are required. Distances depend on voltage, task and arc-flash risk analysis — and are set by applicable regulations and standards.",
    },
    points: {
      he: ["אזור מוגבל — רק לאנשים מוסמכים ומאושרים", "גבול קשת חשמלית — ממנו ואילך נדרש ציוד מגן לפי ניתוח סיכונים", "העדפה ראשונה: עבודה בציוד מנותק ומבודד", "מחסומים ושילוט מגדירים פיזית את האזור"],
      en: ["Restricted zone — qualified, authorised persons only", "Arc-flash boundary — beyond it PPE is required per risk assessment", "First preference: work de-energised and isolated", "Barriers and signs physically define the zone"],
    },
    notes: [
      { kind: "regulation", text: { he: "מרחקי הגישה ודרישות הציוד אינם מוצגים כאן במספרים — הם נקבעים בתקנות ובתקנים (למשל IEC 50110 / NFPA 70E במקומות בהם הוא מאומץ) ובניתוח הסיכונים באתר.", en: "Approach distances and PPE requirements are intentionally not given numerically — they are set by regulations and standards (e.g. EN 50110 / NFPA 70E where adopted) and site risk assessment." } },
    ],
  },
  {
    id: "rotating",
    title: { he: "חלקים מסתובבים ומשטחים חמים", en: "Rotating equipment & hot surfaces" },
    diagram: "rotating",
    summary: {
      he: "גנרטור במצב AUTO עשוי להתניע בכל רגע ללא אזהרה. מאוורר, רצועות וצימוד יכולים ללכוד בגדים ואיברים; סעפת, טורבו ופליטה חמים מספיק לגרום לכוויות קשות ולהצית דלק.",
      en: "A generator in AUTO may start at any moment without warning. Fan, belts and coupling can trap clothing and limbs; manifold, turbo and exhaust are hot enough to cause severe burns and ignite fuel.",
    },
    points: {
      he: ["מגני מאוורר ורצועות חייבים להיות במקומם בזמן הפעלה", "אין לבוש רופף, תכשיטים או שיער פזור ליד ציוד מסתובב", "משטחים נשארים חמים זמן רב לאחר העצירה", "נוזל קירור בלחץ — אין לפתוח מכסה במנוע חם"],
      en: ["Fan and belt guards must be in place whenever the set can run", "No loose clothing, jewellery or loose hair near rotating equipment", "Surfaces stay hot long after stopping", "Pressurised coolant — never open the cap on a hot engine"],
    },
    notes: [
      { kind: "principle", text: { he: "שמירה על מיגון: ISO 13857 (מרחקי בטיחות מאזורים מסוכנים), ISO 14120 (מגנים).", en: "Guarding: ISO 13857 (safety distances to danger zones), ISO 14120 (guards)." } },
    ],
  },
];

export type SafetyExercise = {
  id: string;
  scenario: L;
  options: L[];
  correct: number;
  explain: L;
};

export const safetyExercises: SafetyExercise[] = [
  {
    id: "ex1",
    scenario: { he: "טכנאי מבקש לבדוק את המאוורר של גנרטור הנמצא במצב AUTO. מהי ההחלטה הנכונה?", en: "A technician wants to inspect the fan of a generator that is in AUTO. What is the right decision?" },
    options: [
      { he: "לגשת מהר כי הרשת תקינה והגנרטור לא אמור להתניע", en: "Go ahead quickly — the utility is healthy so it shouldn't start" },
      { he: "ללחוץ על E-STOP ולעבוד", en: "Press E-STOP and work" },
      { he: "לעצור את העבודה עד לבידוד ונעילה מלאים לפי הנוהל ע״י מוסמך, כולל מניעת התנעה", en: "Stop until full isolation and lockout per procedure by an authorised person, including start prevention" },
      { he: "להעביר את הבקר ל-MAN", en: "Switch the controller to MAN" },
    ],
    correct: 2,
    explain: { he: "במצב AUTO הגנרטור יתניע בכל אובדן רשת או בהפעלת ניסיון מתוזמנת. E-STOP ו-MAN אינם אמצעי בידוד. נדרש LOTO מלא.", en: "In AUTO the set starts on any mains loss or scheduled exercise. E-STOP and MAN are not isolation. Full LOTO is required." },
  },
  {
    id: "ex2",
    scenario: { he: "בבדיקה נמצא שמוליך ההארקה של שלדת הגנרטור מנותק. הגנרטור פועל כרגיל. מה המשמעות?", en: "An inspection finds the generator frame's earth conductor disconnected. The set runs normally. What does this mean?" },
    options: [
      { he: "אין בעיה — הגנרטור עובד", en: "No problem — the set works" },
      { he: "מצב מסוכן: בתקלת בידוד השלדה עלולה להתחשמל וההגנה לא תפעל כמתוכנן — לדווח ולטפל ע״י מוסמך", en: "Dangerous: on an insulation fault the frame may become live and protection may not operate as designed — report for qualified repair" },
      { he: "רק בעיה של רעש חשמלי", en: "Only an electrical-noise issue" },
      { he: "לחבר בעצמי בחוט כלשהו", en: "Reconnect it myself with any wire" },
    ],
    correct: 1,
    explain: { he: "ניתוק PE אינו משפיע על התפקוד ולכן ״שקט״, אך מבטל את ההגנה בתקלה. התיקון — ע״י מוסמך ובחומר ובחתך מתאימים.", en: "A missing PE doesn't affect operation — it is 'silent' — but defeats fault protection. Repair by a qualified person with suitable material and size." },
  },
  {
    id: "ex3",
    scenario: { he: "בעל עסק רוצה לחבר גנרטור נייד לשקע בלוח כדי ״להחזיק״ את העסק בהפסקת חשמל. מה הסכנה העיקרית?", en: "A business owner wants to plug a portable generator into a socket to keep the shop running in an outage. What is the main danger?" },
    options: [
      { he: "הגנרטור יתחמם", en: "The generator will overheat" },
      { he: "הזנה חוזרת לרשת — סכנת חיים לעובדי הרשת ולמשתמשים, וגם חיבור בו-זמני כשהרשת חוזרת", en: "Backfeed into the network — lethal danger to line workers and users, plus paralleling when mains returns" },
      { he: "צריכת דלק גבוהה", en: "High fuel consumption" },
      { he: "אין סכנה אם הגנרטור קטן", en: "No danger if the generator is small" },
    ],
    correct: 1,
    explain: { he: "ללא מפסק החלפה עם שילוב, המתח מהגנרטור יכול לחזור לרשת דרך השנאי. החיבור חייב להיעשות ע״י מוסמך ובאמצעים המאושרים.", en: "Without an interlocked transfer switch, generator voltage can return to the network through the transformer. Connection must be done by an authorised person with approved means." },
  },
  {
    id: "ex4",
    scenario: { he: "ה-RCD במעגל ניתק מיד לאחר העברה לגנרטור, אבל לא ניתק כשההזנה מהרשת. מה ההסבר המושגי הסביר?", en: "An RCD tripped right after transfer to the generator but never on utility supply. What is the likely conceptual explanation?" },
    options: [
      { he: "הגנרטור מייצר תדר גבוה מדי", en: "The generator frequency is too high" },
      { he: "ייתכן סידור אפס/הארקה שגוי (למשל חיבור N-PE כפול) שגורם לזרם אפס לעבור במסלול לא מתוכנן — דורש בדיקה הנדסית", en: "Possibly a wrong neutral/earth arrangement (e.g. duplicate N-PE bond) letting neutral current take an unintended path — needs engineering review" },
      { he: "יש לעקוף את ה-RCD בזמן עבודה מגנרטור", en: "The RCD should be bypassed when on generator" },
      { he: "המצבר חלש", en: "The battery is weak" },
    ],
    correct: 1,
    explain: { he: "לעולם אין לעקוף הגנה. ניתוקים שמופיעים רק במקור אחד מצביעים לעיתים על בעיית סידור N-PE/מפסק החלפה — לבדיקת מהנדס/חשמלאי מוסמך.", en: "Never bypass protection. Trips that occur only on one source often point to an N-PE / transfer-switch arrangement issue — for review by an engineer / licensed electrician." },
  },
  {
    id: "ex5",
    scenario: { he: "אחרי עצירת הגנרטור צריך להחליף מסנן שמן. מה הסדר הנכון ברמת העיקרון?", en: "After stopping the set, an oil filter needs replacing. What is the right order in principle?" },
    options: [
      { he: "להחליף מיד כשהמנוע עוד חם כדי שהשמן יזרום", en: "Replace immediately while hot so the oil drains" },
      { he: "למנוע התנעה (LOTO), לאפשר התקררות, להשתמש בציוד מגן — ואז לבצע לפי הוראות היצרן", en: "Prevent start (LOTO), allow to cool, use PPE — then follow the manufacturer's instructions" },
      { he: "להשאיר ב-AUTO כדי שאם תהיה הפסקת חשמל הוא יעבוד", en: "Leave in AUTO so it runs if there is an outage" },
      { he: "ללחוץ E-STOP בלבד", en: "Only press E-STOP" },
    ],
    correct: 1,
    explain: { he: "יש לשלוט בכל מקורות האנרגיה — כולל התנעה אוטומטית ושמן חם. עבודה מכנית דורשת גם היא נעילה ותיוג.", en: "Control all energy sources — including automatic start and hot oil. Mechanical work also requires lockout/tagout." },
  },
  {
    id: "ex6",
    scenario: { he: "מפסק הגנרטור ניתק בזמן אספקה לעומסים. מה הצעד הראשון הנכון?", en: "The generator breaker tripped while supplying loads. What is the right first step?" },
    options: [
      { he: "לחבר מחדש מיד — העומסים חייבים חשמל", en: "Re-close immediately — loads need power" },
      { he: "להחזיק את ידית המפסק כדי שלא ינתק שוב", en: "Hold the handle so it won't trip again" },
      { he: "לבדוק את סיבת הניתוק (עומס-יתר / קצר / זליגה) לפני כל חיבור — ע״י מוסמך", en: "Determine the trip cause (overload / short / earth fault) before any re-close — by a qualified person" },
      { he: "להעלות את כיול ההגנה", en: "Raise the protection setting" },
    ],
    correct: 2,
    explain: { he: "חיבור על תקלה קיימת עלול לגרום לקשת חשמלית ולנזק. שינוי כיול לא מבוקר מבטל את ההגנה.", en: "Closing onto an existing fault can cause arc flash and damage. Uncontrolled setting changes defeat protection." },
  },
  {
    id: "ex7",
    scenario: { he: "בחדר הגנרטור יש ריח של גזי פליטה בזמן ריצה. מה ההחלטה הנכונה?", en: "There is a smell of exhaust gas in the generator room during a run. What is the right decision?" },
    options: [
      { he: "לפתוח חלון ולהמשיך לעבוד בחדר", en: "Open a window and keep working in the room" },
      { he: "לצאת מהחדר, למנוע כניסה, לעצור את הגנרטור באופן בטוח (למשל E-STOP חיצוני) ולדווח לבדיקה מקצועית", en: "Leave the room, prevent entry, stop the set safely (e.g. external E-STOP) and report for professional inspection" },
      { he: "לחפש את הדליפה עם הגנרטור פועל", en: "Look for the leak with the set running" },
      { he: "להתעלם — זה נורמלי", en: "Ignore it — it's normal" },
    ],
    correct: 1,
    explain: { he: "CO חסר ריח — אם מריחים גזי פליטה ייתכן שגם CO נמצא בחדר. בטיחות האנשים קודמת לרציפות האספקה.", en: "CO is odourless — if exhaust gas is smelt, CO may well be present. People's safety comes before continuity of supply." },
  },
  {
    id: "ex8",
    scenario: { he: "מצבר ההתנעה נמצא בתא סגור ללא אוורור, ובסמוך מתבצעות עבודות ריתוך. מה הסכנה?", en: "The starting battery is in a closed, unventilated box and welding is being done nearby. What is the hazard?" },
    options: [
      { he: "רק ירידה בקיבולת", en: "Only a capacity loss" },
      { he: "הצטברות מימן וסכנת פיצוץ ממקור הצתה", en: "Hydrogen accumulation and explosion risk from an ignition source" },
      { he: "אין סכנה במצבר סגור", en: "No danger with a closed battery" },
      { he: "זרם זליגה לאדמה", en: "Earth leakage current" },
    ],
    correct: 1,
    explain: { he: "מצברים פולטים מימן בטעינה. יש לאוורר ולהרחיק מקורות הצתה; עבודה חמה מחייבת היתר ונוהל.", en: "Batteries emit hydrogen when charging. Ventilate and keep ignition sources away; hot work requires a permit and procedure." },
  },
];
