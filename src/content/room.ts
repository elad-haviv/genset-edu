import type { L } from "@/lib/i18n";

export type RoomHazard = {
  id: string;
  title: L;
  observed: L;
  consequence: L;
  principle: L;
  correct: L;
};

/** Deficiencies built into Scenario B (unsafe room). Each id matches a clickable 3D object. */
export const roomHazards: RoomHazard[] = [
  {
    id: "ventilation",
    title: { he: "אוורור לא מספק", en: "Insufficient ventilation" },
    observed: {
      he: "פתח כניסת האוויר קטן ומשמש למעשה כמחסן — קרטונים חוסמים את התריס.",
      en: "The air-inlet opening is undersized and partly blocked by stored cartons.",
    },
    consequence: {
      he: "המנוע, האלטרנטור והרדיאטור אינם מקבלים מספיק אוויר: עליית טמפרטורת החדר, התראת טמפרטורת נוזל קירור, ירידת הספק (Derating), כיבוי בזמן החירום שבו הגנרטור נדרש.",
      en: "Engine, alternator and radiator are starved of air: room temperature rises, high coolant-temperature alarms, power derating, and shutdown during the very emergency the set is needed for.",
    },
    principle: {
      he: "שטח הפתחים וספיקת האוויר נקבעים לפי חום הנפלט לחדר, אוויר הבעירה וההגבלה (Restriction) המרבית שהיצרן מתיר. התכנון כולל תריסים, רשתות ומסננים — שכולם יוצרים התנגדות לזרימה.",
      en: "Opening area and airflow are sized from heat rejected to the room, combustion air and the manufacturer's maximum allowable restriction. Louvres, screens and filters all add flow resistance and must be included.",
    },
    correct: {
      he: "פתח כניסה בגודל שחושב לפי נתוני היצרן, ממוקם מאחורי האלטרנטור, פנוי לחלוטין מחסימות.",
      en: "Inlet opening sized from manufacturer data, located behind the alternator and kept completely clear.",
    },
  },
  {
    id: "recirculation",
    title: { he: "חזרת אוויר חם מהרדיאטור", en: "Hot radiator air recirculation" },
    observed: {
      he: "הרדיאטור פורק אוויר חם לתוך החדר ללא תעלה (Duct) לתריס היציאה. האוויר החם חוזר ונשאב שוב.",
      en: "The radiator discharges into the room with no duct to the outlet louvre. Hot air is drawn back in.",
    },
    consequence: {
      he: "טמפרטורת אוויר הכניסה לרדיאטור עולה בהדרגה ← עלייה מתמשכת בטמפרטורת נוזל הקירור ← התראה וכיבוי. התקלה מופיעה לרוב רק בריצה ממושכת ובעומס גבוה.",
      en: "Radiator inlet air temperature climbs progressively → coolant temperature rises → alarm and shutdown. Typically appears only in long runs at high load.",
    },
    principle: {
      he: "יש להפריד בין אוויר קר נכנס לאוויר חם יוצא: תעלת פריקה עם חיבור גמיש בין הרדיאטור לקיר, ומיקום פתחי כניסה ויציאה כך שלא ייווצר קצר-זרימה — גם מחוץ למבנה.",
      en: "Separate cool inlet air from hot discharge air: a discharge duct with a flexible connection from radiator to wall, and inlet/outlet positions that prevent short-circuiting — outside the building too.",
    },
    correct: {
      he: "תעלת פריקה אטומה עם חיבור גמיש לתריס יציאה, בצד הנגדי לכניסת האוויר.",
      en: "Sealed discharge duct with flexible connection to an outlet louvre on the opposite side from the inlet.",
    },
  },
  {
    id: "access",
    title: { he: "גישה מוגבלת לתחזוקה", en: "Restricted maintenance access" },
    observed: {
      he: "הגנרטור צמוד לקיר, ומדפי אחסון חוסמים את צד השירות (מסננים, מצברים, לוח בקרה).",
      en: "The set is pushed against the wall and storage shelving blocks the service side (filters, batteries, control panel).",
    },
    consequence: {
      he: "תחזוקה נדחית או מבוצעת בתנוחות מסוכנות סמוך לחלקים חמים ומסתובבים. קשה לבצע חילוץ, כיבוי או פינוי בחירום.",
      en: "Maintenance is skipped or done in awkward positions near hot and rotating parts. Rescue, firefighting and escape are hindered.",
    },
    principle: {
      he: "מרווחי גישה סביב הגנרטור והלוחות נקבעים לפי דרישות היצרן, תקנות החשמל (מרחבי עבודה מול לוחות) והצורך להוציא רכיבים גדולים. התכנון משאיר מסלול להחלפת רדיאטור / אלטרנטור.",
      en: "Clearances around the set and panels follow manufacturer requirements, electrical regulations (working space in front of switchboards) and the need to remove large components. Design leaves a route to replace the radiator / alternator.",
    },
    correct: {
      he: "מעבר פנוי סביב כל הגנרטור, צד שירות פתוח, אין אחסון בחדר.",
      en: "Clear walkway around the whole set, open service side, no storage in the room.",
    },
  },
  {
    id: "exhaust",
    title: { he: "מערכת פליטה לא תקינה", en: "Inadequate exhaust arrangement" },
    observed: {
      he: "צינור הפליטה מסתיים בתוך החדר / ליד תריס הכניסה, ללא צינור גמיש וללא בידוד תרמי. יש סימני פיח.",
      en: "The exhaust ends inside the room / near the inlet louvre, with no flexible section and no thermal insulation. Soot marks are visible.",
    },
    consequence: {
      he: "חדירת פחמן חד-חמצני (CO) לחדר ולמבנה — סכנת חיים. צינור קשיח נסדק מרעידות; צנרת לא מבודדת מעלה את טמפרטורת החדר ומהווה סכנת כוויות ודליקה.",
      en: "Carbon monoxide (CO) enters the room and building — life-threatening. Rigid pipe cracks from vibration; uninsulated pipe raises room temperature and is a burn and fire hazard.",
    },
    principle: {
      he: "פליטה אל מחוץ למבנה, הרחק מפתחים, חלונות וכניסות אוויר, עם צינור גמיש בחיבור למנוע, תמיכה עצמאית, בידוד תרמי, מניעת חדירת גשם, ולחץ נגדי בגבולות שהיצרן מתיר.",
      en: "Discharge outside the building, away from openings, windows and air intakes, with a flexible connection at the engine, independent support, insulation, rain protection and back pressure within manufacturer limits.",
    },
    correct: {
      he: "צנרת מבודדת עם צינור גמיש, יציאה דרך הקיר/הגג למקום בטוח ומוגן מגשם.",
      en: "Insulated piping with flexible section, exiting through wall/roof to a safe, rain-protected location.",
    },
  },
  {
    id: "fuel",
    title: { he: "אחסון דלק במיקום לא תקין", en: "Improper fuel storage" },
    observed: {
      he: "חביות סולר וג׳ריקנים פתוחים ליד צנרת הפליטה החמה, ללא מאצרה (Bund) וללא שילוט.",
      en: "Diesel drums and open jerry cans next to the hot exhaust, with no bund and no signage.",
    },
    consequence: {
      he: "סכנת דליקה ושריפה, זיהום קרקע וניקוז במקרה דליפה, וקושי בכיבוי. כמויות דלק בחדר כפופות לדרישות הרשויות.",
      en: "Fire risk, soil/drain contamination if spilled, and difficult firefighting. Fuel quantities in the room are subject to authority requirements.",
    },
    principle: {
      he: "דלק מאוחסן במיכלים מאושרים עם מאצרה / דופן כפולה, מרוחק ממקורות חום, עם אוורור ושילוט. כמויות והפרדות אש נקבעים ע״י רשות הכבאות ותקנים רלוונטיים.",
      en: "Fuel is stored in approved tanks with bunding / double wall, away from heat, vented and signed. Quantities and fire separation are set by the fire authority and relevant standards.",
    },
    correct: {
      he: "מיכל יומי בתוך מאצרה, במרחק מהפליטה, עם אוורור ושילוט; מיכל ראשי בהתאם לאישור הרשויות.",
      en: "Day tank inside a bund, away from the exhaust, vented and signed; main storage per authority approval.",
    },
  },
  {
    id: "signage",
    title: { he: "חסר שילוט אזהרה", en: "Missing warning signage" },
    observed: {
      he: "אין שילוט ״סכנת חשמל״, ״התנעה אוטומטית״, ״רעש — חובת מגני שמיעה״ או איסור עישון.",
      en: "No 'electrical hazard', 'automatic start', 'noise — hearing protection' or no-smoking signs.",
    },
    consequence: {
      he: "אנשים נכנסים בלי לדעת שהגנרטור עלול להתניע בכל רגע, נחשפים לרעש, או מכניסים מקורות הצתה.",
      en: "People enter unaware that the set may start at any moment, are exposed to noise, or bring ignition sources.",
    },
    principle: {
      he: "שילוט הוא שכבת הגנה מנהלית — לא תחליף לאמצעים הנדסיים, אך חובה כשסיכון נשאר. סימני בטיחות לפי תקני סימון בטיחות (כגון ISO 7010) ודרישות הדין המקומי.",
      en: "Signage is an administrative control — not a substitute for engineering measures, but required where risk remains. Safety signs follow safety-sign standards (e.g. ISO 7010) and local legal requirements.",
    },
    correct: {
      he: "שילוט ברור על הדלת ובחדר: מתח מסוכן, התנעה אוטומטית, רעש, איסור עישון, כניסה למורשים בלבד.",
      en: "Clear signs on the door and in the room: hazardous voltage, automatic start, noise, no smoking, authorised entry only.",
    },
  },
  {
    id: "exit",
    title: { he: "יציאת חירום חסומה", en: "Obstructed emergency exit" },
    observed: {
      he: "משטחים וציוד ישן חוסמים את הדלת; הדלת נפתחת פנימה ואין שלט יציאה מואר.",
      en: "Pallets and old equipment block the door; the door opens inward and there is no illuminated exit sign.",
    },
    consequence: {
      he: "בשריפה, דליפת CO או פגיעה חשמלית — עיכוב קריטי בפינוי ובכניסת צוותי חילוץ.",
      en: "In a fire, CO leak or electrical injury — critical delay in escape and in rescue access.",
    },
    principle: {
      he: "דרכי מילוט פנויות תמיד, דלתות בכיוון המילוט כנדרש, תאורת חירום ושילוט יציאה — בהתאם לדרישות הבטיחות והכבאות.",
      en: "Escape routes always clear, doors opening in the direction of escape as required, emergency lighting and exit signs — per safety and fire requirements.",
    },
    correct: {
      he: "יציאה פנויה עם שלט יציאה מואר ותאורת חירום, דלת נפתחת החוצה.",
      en: "Clear exit with illuminated exit sign and emergency lighting, door opening outward.",
    },
  },
  {
    id: "panel",
    title: { he: "ציוד חשמלי לא מוגן", en: "Unprotected electrical equipment" },
    observed: {
      he: "דלת לוח החשמל פתוחה, חלקים חיים חשופים, כיסויים הוסרו וכבל מאולתר מחובר.",
      en: "The switchboard door is open, live parts are exposed, covers removed and a makeshift cable connected.",
    },
    consequence: {
      he: "סכנת התחשמלות במגע ישיר ותקלת קשת חשמלית. אבק, לחות וטיפות דלק חודרים ללוח.",
      en: "Risk of direct-contact electric shock and arc flash. Dust, moisture and fuel droplets enter the panel.",
    },
    principle: {
      he: "הגנה בסיסית מפני מגע ישיר — בידוד, מחסומים ומעטפות (IEC 60364-4-41). לוחות סגורים ונעולים, דרגת הגנה (IP) מתאימה לסביבה, ועבודה רק ע״י מורשים.",
      en: "Basic protection against direct contact — insulation, barriers and enclosures (IEC 60364-4-41). Panels closed and locked, IP rating suited to the environment, work by authorised persons only.",
    },
    correct: {
      he: "לוחות סגורים ונעולים עם כל הכיסויים, מרחב עבודה פנוי מולם ושילוט.",
      en: "Panels closed and locked with all covers fitted, clear working space in front and signage.",
    },
  },
  {
    id: "provisions",
    title: { he: "חסרים אמצעי בטיחות", en: "Missing safety provisions" },
    observed: {
      he: "תושבת המטף ריקה, אין לחצן עצירת חירום מחוץ לחדר ואין תאורת חירום.",
      en: "The extinguisher bracket is empty, there is no emergency stop outside the room and no emergency lighting.",
    },
    consequence: {
      he: "לא ניתן לעצור את הגנרטור או לטפל בשריפה מתחילתה בלי להיכנס לחדר המסוכן.",
      en: "The set cannot be stopped and an incipient fire cannot be tackled without entering the hazardous room.",
    },
    principle: {
      he: "אמצעי כיבוי מתאימים לסוג הסיכון (דלק וחשמל), גלאים, עצירת חירום נגישה מחוץ לחדר ותאורת חירום — לפי דרישות רשות הכבאות, היועץ והתקנים.",
      en: "Extinguishers suited to the risk (fuel and electrical), detection, an emergency stop accessible from outside, and emergency lighting — per fire authority, consultant and standards requirements.",
    },
    correct: {
      he: "מטף מתאים בכניסה, לחצן חירום חיצוני מסומן, גלאים ותאורת חירום.",
      en: "Suitable extinguisher at the entrance, labelled external E-stop, detection and emergency lighting.",
    },
  },
  {
    id: "cables",
    title: { he: "ניתוב כבלים לקוי", en: "Poor cable routing" },
    observed: {
      he: "כבלי הכוח מונחים על הרצפה, חוצים את מעבר ההליכה, עוברים בשלולית ליד הדלק וללא קטע גמיש בחיבור לגנרטור.",
      en: "Power cables lie on the floor across the walkway, through a puddle near the fuel, with no flexible section at the generator.",
    },
    consequence: {
      he: "סכנת מעידה, פגיעה מכנית בבידוד, חדירת לחות ודלק, ועייפות מכנית בנקודת החיבור עקב רעידות — עד לתקלת בידוד ושריפה.",
      en: "Trip hazard, mechanical damage to insulation, moisture and fuel ingress, and fatigue at the termination due to vibration — leading to insulation failure and fire.",
    },
    principle: {
      he: "כבלים בתעלות / סולמות או בתעלות רצפה מכוסות, מופרדים מצנרת דלק ופליטה, עם קטע גמיש בכניסה לגנרטור המותקן על בולמים, ובחתך שנקבע לפי זרם, התקנה, טמפרטורה ומפל מתח.",
      en: "Cables on trays / ladders or in covered floor trenches, separated from fuel and exhaust, with a flexible section at the resiliently-mounted set, sized for current, installation method, temperature and voltage drop.",
    },
    correct: {
      he: "סולם כבלים עילי או תעלה מכוסה, הפרדה מהדלק, וקטע גמיש בחיבור לגנרטור.",
      en: "Overhead ladder or covered trench, separated from fuel, with a flexible section at the set.",
    },
  },
];

export type RoomFeature = { id: string; title: L; text: L };

/** Highlights of Scenario A (properly designed room). */
export const roomGoodFeatures: RoomFeature[] = [
  { id: "inlet", title: { he: "תריס כניסת אוויר", en: "Inlet louvre" }, text: { he: "ממוקם מאחורי האלטרנטור כך שהאוויר הקר זורם לאורך הגנרטור — מהאלטרנטור, דרך המנוע אל הרדיאטור.", en: "Located behind the alternator so cool air sweeps along the set — alternator, engine, then radiator." } },
  { id: "duct", title: { he: "תעלת פריקת רדיאטור", en: "Radiator discharge duct" }, text: { he: "תעלה אטומה עם חיבור גמיש מובילה את האוויר החם ישירות החוצה ומונעת חזרה.", en: "A sealed duct with flexible connection carries hot air straight outside and prevents recirculation." } },
  { id: "exhaustA", title: { he: "פליטה מבודדת", en: "Insulated exhaust" }, text: { he: "צינור גמיש בחיבור למנוע, משתיק, בידוד תרמי ויציאה גבוהה מחוץ למבנה.", en: "Flexible connection at the engine, silencer, insulation and high-level discharge outside." } },
  { id: "tank", title: { he: "מיכל יומי במאצרה", en: "Bunded day tank" }, text: { he: "מיכל עם דופן כפולה / מאצרה, הרחק מהפליטה, עם אוורור ושילוט.", en: "Double-wall / bunded tank, away from exhaust, vented and signed." } },
  { id: "panels", title: { he: "לוחות חשמל סגורים", en: "Closed switchboards" }, text: { he: "לוחות ATS ו-MDB סגורים ונעולים, עם מרחב עבודה פנוי מולם.", en: "ATS and MDB panels closed and locked, with clear working space in front." } },
  { id: "tray", title: { he: "סולם כבלים עילי", en: "Overhead cable ladder" }, text: { he: "כבלי הכוח מנותבים מעל המעבר, מופרדים מהדלק, עם קטע גמיש לגנרטור.", en: "Power cables run overhead, segregated from fuel, with a flexible tail to the set." } },
  { id: "exitA", title: { he: "יציאה ושילוט", en: "Exit & signage" }, text: { he: "דלת פנויה הנפתחת החוצה, שלט יציאה מואר, שילוט אזהרה ועצירת חירום חיצונית.", en: "Clear outward-opening door, illuminated exit sign, warning signs and external E-stop." } },
  { id: "extinguisher", title: { he: "מטף ואמצעי בטיחות", en: "Extinguisher & safety" }, text: { he: "מטף מתאים בכניסה ותאורת חירום.", en: "Suitable extinguisher at the entrance and emergency lighting." } },
  { id: "clearance", title: { he: "מרווחי תחזוקה", en: "Maintenance clearances" }, text: { he: "שטח מסומן פנוי סביב הגנרטור — מאפשר תחזוקה בטוחה ופינוי.", en: "Marked clear zone around the set — enables safe maintenance and escape." } },
];

/** Accessible (non-3D) inspection checklist: real deficiencies mixed with acceptable observations. */
export const roomChecklist: { id: string; text: L; hazard: boolean; ref?: string }[] = [
  { id: "c1", hazard: true, ref: "recirculation", text: { he: "הרדיאטור פורק אוויר חם לחלל החדר, ללא תעלה.", en: "The radiator discharges hot air into the room, with no duct." } },
  { id: "c2", hazard: false, text: { he: "תריס כניסת האוויר ממוקם מאחורי האלטרנטור.", en: "The air-inlet louvre is located behind the alternator." } },
  { id: "c3", hazard: true, ref: "exhaust", text: { he: "צינור הפליטה מסתיים בתוך החדר ואינו מבודד.", en: "The exhaust pipe terminates inside the room and is uninsulated." } },
  { id: "c4", hazard: false, text: { he: "הגנרטור מותקן על בולמי רעידות ויסוד מפולס.", en: "The set is mounted on anti-vibration mounts and a level plinth." } },
  { id: "c5", hazard: true, ref: "fuel", text: { he: "ג׳ריקני סולר פתוחים מאוחסנים ליד הפליטה.", en: "Open diesel jerry cans are stored next to the exhaust." } },
  { id: "c6", hazard: true, ref: "exit", text: { he: "משטחים חוסמים את דלת היציאה.", en: "Pallets obstruct the exit door." } },
  { id: "c7", hazard: false, text: { he: "לוח ה-ATS סגור ונעול, עם שלט ״סכנת חשמל״.", en: "The ATS panel is closed and locked, with an 'electrical hazard' sign." } },
  { id: "c8", hazard: true, ref: "panel", text: { he: "דלת לוח פתוחה עם חלקים חיים חשופים.", en: "A switchboard door is open with exposed live parts." } },
  { id: "c9", hazard: true, ref: "cables", text: { he: "כבלי כוח מונחים על הרצפה וחוצים את המעבר.", en: "Power cables lie on the floor across the walkway." } },
  { id: "c10", hazard: false, text: { he: "קיים צינור גמיש בין המנוע לצנרת הפליטה.", en: "A flexible bellows connects the engine to the exhaust piping." } },
  { id: "c11", hazard: true, ref: "provisions", text: { he: "תושבת המטף ריקה ואין לחצן חירום חיצוני.", en: "The extinguisher bracket is empty and there is no external E-stop." } },
  { id: "c12", hazard: true, ref: "access", text: { he: "מדפי אחסון צמודים לצד השירות של הגנרטור.", en: "Storage shelving is placed tight against the service side of the set." } },
  { id: "c13", hazard: true, ref: "signage", text: { he: "אין שילוט ״התנעה אוטומטית״ על הדלת.", en: "There is no 'automatic start' sign on the door." } },
  { id: "c14", hazard: true, ref: "ventilation", text: { he: "קרטונים חוסמים חלק מתריס כניסת האוויר.", en: "Cartons block part of the air-inlet louvre." } },
  { id: "c15", hazard: false, text: { he: "מטען המצברים מציג נורית טעינה תקינה.", en: "The battery charger shows a normal charging indication." } },
];
