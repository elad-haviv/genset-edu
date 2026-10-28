import type { L, LList } from "@/lib/i18n";
import type { Kind } from "@/components/ui";

export type InstallTopic = {
  id: string;
  title: L;
  principle: L;
  good: LList;
  bad: LList;
  consequence: L;
  note: { kind: Kind; text: L };
};

export const installTopics: InstallTopic[] = [
  {
    id: "site",
    title: { he: "בחירת מיקום", en: "Site selection" },
    principle: { he: "המיקום קובע את איכות האוויר, הפליטה, הגישה, הרעש וההגנה מפני הצפה ואש. החלטה שגויה כאן כמעט בלתי ניתנת לתיקון בהמשך.", en: "Location determines air supply, exhaust dispersion, access, noise and protection from flooding and fire. A wrong decision here is almost impossible to fix later." },
    good: { he: ["גישה לרכב שירות ולמילוי דלק", "מרחק מחלונות, כניסות אוויר ושכנים", "מעל מפלס הצפה צפוי", "מסלול להכנסה והוצאה של הגנרטור"], en: ["Access for service vehicles and refuelling", "Distance from windows, air intakes and neighbours", "Above expected flood level", "A route to bring the set in and out"] },
    bad: { he: ["מרתף נמוך ללא הגנת הצפה", "פליטה ליד חלונות או כניסות אוויר של המבנה", "חדר פנימי ללא קיר חיצוני לאוורור"], en: ["Low basement without flood protection", "Exhaust near windows or building air intakes", "Internal room with no external wall for ventilation"] },
    consequence: { he: "גנרטור מוצף או חנוק מאוויר לא יפעל בדיוק כשיידרש.", en: "A flooded or air-starved generator will not run exactly when needed." },
    note: { kind: "recommendation", text: { he: "יש לבחון מיקום מול דרישות רשויות התכנון, הכבאות והגנת הסביבה כבר בשלב הקונספט.", en: "Check the location against planning, fire and environmental authority requirements at concept stage." } },
  },
  {
    id: "foundation",
    title: { he: "יסוד הגנרטור", en: "Generator foundation" },
    principle: { he: "היסוד נושא את משקל הגנרטור והדלק ומקבל את הכוחות הדינמיים. הוא חייב להיות מפולס, בעל כושר נשיאה מתאים ומתוכנן ע״י מהנדס בניין לפי נתוני היצרן.", en: "The foundation carries the weight of set and fuel and the dynamic forces. It must be level, adequately load-bearing and designed by a structural engineer from manufacturer data." },
    good: { he: ["יסוד בטון מפולס לפי תכנון קונסטרוקטיבי", "הפרדה מהרצפה הסובבת כשנדרש להפחתת העברת רעידות", "עיגון לפי הוראות היצרן"], en: ["Level concrete plinth per structural design", "Separation from surrounding slab where needed to reduce vibration transfer", "Anchoring per manufacturer instructions"] },
    bad: { he: ["רצפה לא מפולסת", "הנחה על רצפה ללא בדיקת עומסים", "יסוד שמחובר קשיח למבנה רגיש לרעידות"], en: ["Uneven floor", "Placing on a slab without load verification", "Plinth rigidly tied into a vibration-sensitive structure"] },
    consequence: { he: "סדקים, רעידות במבנה, עיוות השלדה ובלאי מואץ של מסבים וצימוד.", en: "Cracking, building vibration, frame distortion and accelerated bearing and coupling wear." },
    note: { kind: "manufacturer", text: { he: "משקל, נקודות עיגון ודרישות פילוס — לפי שרטוט ההתקנה של היצרן.", en: "Weight, anchor points and levelling requirements — per the manufacturer's installation drawing." } },
  },
  {
    id: "vibration",
    title: { he: "בידוד רעידות", en: "Vibration isolation" },
    principle: { he: "בולמים מבודדים את הרעידות רק אם אין ״גשרים״ קשיחים שעוקפים אותם. כל צינור, כבל ותעלה המחוברים לגנרטור חייבים קטע גמיש.", en: "Isolators only work if no rigid 'bridges' bypass them. Every pipe, cable and duct connected to the set needs a flexible section." },
    good: { he: ["בולמים בסוג ובכמות לפי היצרן", "צינור גמיש לפליטה, חיבור גמיש לתעלת רדיאטור", "קטעי צנרת דלק גמישים ולולאת כבל"], en: ["Isolators of type and number per manufacturer", "Exhaust bellows, flexible radiator-duct connection", "Flexible fuel hoses and a cable loop"] },
    bad: { he: ["צנרת פליטה קשיחה מהמנוע לקיר", "כבלים מתוחים ישר לתעלה", "בולמים ״מוברגים עד הסוף״"], en: ["Rigid exhaust pipe from engine to wall", "Cables pulled taut straight into a tray", "Isolators bolted solid"] },
    consequence: { he: "סדקים בצנרת פליטה ← דליפת CO; עייפות בחיבורי כבלים ← התחממות ושריפה.", en: "Exhaust cracks → CO leaks; cable termination fatigue → heating and fire." },
    note: { kind: "principle", text: { he: "יעילות הבידוד תלויה ביחס בין תדר העירור לתדר הטבעי של מערכת הבולמים.", en: "Isolation efficiency depends on the ratio of excitation frequency to the isolator system's natural frequency." } },
  },
  {
    id: "ventilation",
    title: { he: "אוורור ופליטת חום", en: "Ventilation & heat rejection" },
    principle: { he: "האוויר צריך לסלק את החום שנפלט לחדר (מנוע, אלטרנטור, פליטה), לספק אוויר בעירה ולקרר את הרדיאטור — בלי לחרוג מההגבלה המותרת של המאוורר.", en: "Air must remove heat rejected to the room (engine, alternator, exhaust), supply combustion air and cool the radiator — without exceeding the fan's allowable restriction." },
    good: { he: ["זרימה מהאלטרנטור לכיוון הרדיאטור", "תעלת פריקה אטומה לתריס יציאה", "שטחי תריסים לפי חישוב, כולל הפסדי רשתות"], en: ["Flow from alternator end towards radiator", "Sealed discharge duct to outlet louvre", "Louvre areas from calculation, including screen losses"] },
    bad: { he: ["כניסה ויציאה באותו קיר — קצר זרימה", "רדיאטור פורק לחדר", "תריסים קטנים או חסומים"], en: ["Inlet and outlet on the same wall — short-circuit", "Radiator discharging into the room", "Small or blocked louvres"] },
    consequence: { he: "התחממות, Derating וכיבוי בטמפרטורה גבוהה — בדיוק בימי שרב שבהם העומס מרבי.", en: "Overheating, derating and high-temperature shutdown — exactly on hot days when demand peaks." },
    note: { kind: "manufacturer", text: { he: "ספיקת אוויר, חום נפלט והגבלה מותרת לקוחים מגיליון הנתונים של היצרן — לא מהערכה.", en: "Airflow, heat rejection and allowable restriction come from the manufacturer's data sheet — not estimates." } },
  },
  {
    id: "exhaust",
    title: { he: "ניתוב פליטה", en: "Exhaust routing" },
    principle: { he: "מערכת הפליטה צריכה להוציא את הגזים בבטחה אל מחוץ למבנה, בלחץ נגדי מותר, עם מניעת חדירת גשם ובלי להעביר משקל או רעידות למנוע.", en: "The exhaust must discharge gases safely outside, within allowable back pressure, prevent rain ingress and not transfer weight or vibration to the engine." },
    good: { he: ["צינור גמיש בחיבור למנוע", "תמיכה עצמאית למשתיק ולצנרת", "בידוד תרמי, ניקוז עיבויים, כובע גשם", "יציאה גבוהה הרחק מפתחים"], en: ["Flexible bellows at the engine", "Independent support for silencer and piping", "Insulation, condensate drain, rain cap", "High discharge away from openings"] },
    bad: { he: ["משתיק כבד תלוי על הטורבו", "יציאה נמוכה ליד חלון", "צנרת ארוכה עם הרבה קשתות — לחץ נגדי גבוה"], en: ["Heavy silencer hanging on the turbo", "Low outlet near a window", "Long run with many bends — high back pressure"] },
    consequence: { he: "חדירת CO למבנה, נזק לטורבו, אובדן הספק ושריפה מצנרת לא מבודדת.", en: "CO entering the building, turbo damage, power loss and fire from uninsulated piping." },
    note: { kind: "manufacturer", text: { he: "לחץ נגדי מרבי וקוטר צנרת מינימלי — לפי היצרן; חישוב לחץ נגדי הוא חלק מהתכנון.", en: "Maximum back pressure and minimum pipe size — per manufacturer; a back-pressure calculation is part of design." } },
  },
  {
    id: "fuel",
    title: { he: "בטיחות מערכת הדלק", en: "Fuel system safety" },
    principle: { he: "מערכת הדלק צריכה לספק דלק נקי באופן אמין, למנוע דליפות וזיהום, ולהיות מופרדת ממקורות חום והצתה.", en: "The fuel system must deliver clean fuel reliably, prevent leaks and contamination, and be separated from heat and ignition sources." },
    good: { he: ["מיכל דופן כפולה / מאצרה עם חיישן דליפה", "שסתום ניתוק דלק בחירום הנגיש מבחוץ", "אוורור מיכל אל מחוץ למבנה", "תכנית לבדיקת איכות דלק"], en: ["Double-wall / bunded tank with leak sensor", "Emergency fuel shut-off accessible from outside", "Tank vent to outside", "Fuel-quality testing plan"] },
    bad: { he: ["חביות פתוחות בחדר", "צנרת דלק צמודה לפליטה", "אין מאצרה"], en: ["Open drums in the room", "Fuel line next to exhaust", "No bund"] },
    consequence: { he: "שריפה, זיהום סביבתי, וכשל הגנרטור עקב דלק מזוהם.", en: "Fire, environmental contamination and generator failure from contaminated fuel." },
    note: { kind: "regulation", text: { he: "כמויות, מרחקים ומיגון מיכלי דלק כפופים לדרישות רשות הכבאות והגנת הסביבה.", en: "Fuel quantities, distances and tank protection are subject to fire and environmental authority requirements." } },
  },
  {
    id: "fire",
    title: { he: "היבטי הגנה מאש", en: "Fire protection considerations" },
    principle: { he: "חדר גנרטור מכיל דלק, חום וחשמל. ההגנה כוללת הפרדת אש מהמבנה, גילוי, כיבוי מתאים ויכולת לעצור את הגנרטור ואת זרם הדלק מבחוץ.", en: "A generator room contains fuel, heat and electricity. Protection includes fire separation, detection, suitable suppression and the ability to stop the set and the fuel flow from outside." },
    good: { he: ["הפרדת אש לפי דרישות הכבאות", "גלאים ומערכת כיבוי לפי תכנון יועץ", "E-STOP וניתוק דלק חיצוניים"], en: ["Fire separation per fire authority", "Detection and suppression per consultant design", "External E-STOP and fuel shut-off"] },
    bad: { he: ["חומרים דליקים מאוחסנים בחדר", "פתחים לא מוגנים בין החדר למבנה"], en: ["Combustibles stored in the room", "Unprotected openings between room and building"] },
    consequence: { he: "התפשטות שריפה למבנה ואובדן אספקת החירום בזמן החירום עצמו.", en: "Fire spreading into the building and loss of emergency supply during the emergency itself." },
    note: { kind: "regulation", text: { he: "הדרישות נקבעות ע״י רשות הכבאות והיועץ — אין כאן ערכים מספריים.", en: "Requirements are set by the fire authority and consultant — no numerical values are given here." } },
  },
  {
    id: "electrical",
    title: { he: "תכנון החשמל", en: "Electrical installation planning" },
    principle: { he: "תכנון מקור חלופי כולל: מפסק החלפה מתאים, שיטת הארקה ואופן חיבור N-PE, תיאום הגנות לשני המקורות, וחלוקת עומסים לפי חשיבות.", en: "Alternative-source design covers: a suitable transfer switch, earthing system and N-PE arrangement, protection coordination for both sources, and load grouping by priority." },
    good: { he: ["ATS עם שילוב מכני וחשמלי", "הפרדת עומסי חירום / חיוניים / רגילים", "בדיקת הגנות במצב הזנה מגנרטור"], en: ["ATS with mechanical and electrical interlocks", "Separation of emergency / essential / normal loads", "Protection verified on generator supply"] },
    bad: { he: ["חיבור ישיר ללא מפסק החלפה", "כיול הגנות לפי הרשת בלבד", "חיבורי N-PE כפולים"], en: ["Direct connection without a transfer switch", "Protection set for utility only", "Duplicate N-PE bonds"] },
    consequence: { he: "הזנה חוזרת, הגנות שלא פועלות, ניתוקי שווא.", en: "Backfeed, protections that don't operate, nuisance trips." },
    note: { kind: "regulation", text: { he: "תכנון וביצוע — ע״י בעלי רישיון ובהתאם לתקנות החשמל ולדרישות ספק החשמל.", en: "Design and installation by licensed persons per electrical regulations and network operator requirements." } },
  },
  {
    id: "cables",
    title: { he: "ניהול כבלים", en: "Cable management" },
    principle: { he: "כבלי הכוח נבחרים לפי זרם, שיטת התקנה, טמפרטורה, קיבוץ ומפל מתח, ומנותבים כך שיהיו מוגנים מכנית ומופרדים ממקורות חום ודלק.", en: "Power cables are sized for current, installation method, temperature, grouping and voltage drop, and routed to be mechanically protected and segregated from heat and fuel." },
    good: { he: ["סולמות / תעלות מכוסות", "הפרדה בין כבלי כוח ובקרה", "לולאה גמישה בחיבור לגנרטור", "אטימת מעברי אש"], en: ["Ladders / covered trenches", "Segregation of power and control cables", "Flexible loop at the set", "Fire-stopping at penetrations"] },
    bad: { he: ["כבלים על הרצפה במעבר", "ליד צנרת פליטה", "חיבור מתוח ללא מרווח תנועה"], en: ["Cables on the floor across the walkway", "Next to exhaust piping", "Taut termination with no movement allowance"] },
    consequence: { he: "נזק לבידוד, התחממות, מעידה ושריפה.", en: "Insulation damage, heating, tripping and fire." },
    note: { kind: "principle", text: { he: "בחירת כבלים לפי IEC 60364-5-52 ותקנות החשמל.", en: "Cable selection per IEC 60364-5-52 and electrical regulations." } },
  },
  {
    id: "access",
    title: { he: "נגישות ומרווחי תחזוקה", en: "Accessibility & maintenance clearances" },
    principle: { he: "צריך להיות אפשר לבצע כל פעולת תחזוקה בבטחה ולהחליף רכיבים גדולים. המרווחים נקבעים לפי היצרן ולפי דרישות מרחב העבודה בתקנות החשמל.", en: "Every maintenance task must be possible safely, and large components replaceable. Clearances come from the manufacturer and working-space requirements in electrical regulations." },
    good: { he: ["מעבר היקפי פנוי", "גישה חופשית לצד השירות וללוחות", "מסלול להוצאת רדיאטור / אלטרנטור"], en: ["Clear perimeter walkway", "Free access to service side and panels", "Route for removing radiator / alternator"] },
    bad: { he: ["גנרטור צמוד לקיר", "אחסון בחדר", "לוח חשמל שדלתו לא נפתחת עד הסוף"], en: ["Set against the wall", "Storage in the room", "Panel door that can't open fully"] },
    consequence: { he: "תחזוקה לקויה או מסוכנת, וקושי בפינוי בחירום.", en: "Poor or dangerous maintenance and hindered escape." },
    note: { kind: "manufacturer", text: { he: "אין כאן מידות — המרווחים המחייבים מופיעים בשרטוטי היצרן ובתקנות.", en: "No dimensions are given — binding clearances are in manufacturer drawings and regulations." } },
  },
  {
    id: "environment",
    title: { he: "היבטים סביבתיים", en: "Environmental considerations" },
    principle: { he: "גנרטור פולט גזים, חלקיקים ורעש, ומכיל דלק ושמנים. יש לעמוד בהיתרי פליטה ובדרישות למניעת זיהום קרקע ומים.", en: "A generator emits gases, particulates and noise, and contains fuel and oils. Emission permits and soil/water protection requirements must be met." },
    good: { he: ["מאצרות ומלכודות שמן", "סילוק פסולת מסוכנת לפי דין", "מערכות טיפול בפליטה כשנדרש"], en: ["Bunds and oil interceptors", "Lawful hazardous-waste disposal", "Exhaust after-treatment where required"] },
    bad: { he: ["ניקוז חופשי לביוב", "הצטברות שמן משומש"], en: ["Free drainage to sewer", "Accumulating used oil"] },
    consequence: { he: "זיהום, קנסות ועצירת פעילות.", en: "Pollution, fines and operating restrictions." },
    note: { kind: "regulation", text: { he: "דרישות המשרד להגנת הסביבה והרשות המקומית — לפי ההיתר.", en: "Environmental ministry and local authority requirements — per permit." } },
  },
  {
    id: "weather",
    title: { he: "הגנה מפני מזג אוויר", en: "Weather protection" },
    principle: { he: "בהתקנה חיצונית יש להגן מפני גשם, אבק, קרינת שמש וחול, בלי לפגוע באוורור.", en: "Outdoor installations must be protected from rain, dust, solar gain and sand without compromising airflow." },
    good: { he: ["מעטפת בדרגת הגנה מתאימה", "תריסים מונעי גשם", "כובע גשם בפליטה", "מחמם נגד עיבוי"], en: ["Enclosure of suitable protection rating", "Rain-resistant louvres", "Exhaust rain cap", "Anti-condensation heater"] },
    bad: { he: ["פתחים פתוחים לגשם", "יציאת פליטה ללא הגנה", "מסנני אוויר בסביבה מאובקת ללא תחזוקה"], en: ["Openings exposed to rain", "Unprotected exhaust outlet", "Air filters in dusty sites without maintenance"] },
    consequence: { he: "חדירת מים למנוע ולאלטרנטור, קורוזיה וכשלי בידוד.", en: "Water entering engine and alternator, corrosion and insulation failure." },
    note: { kind: "recommendation", text: { he: "באזורים מדבריים או חופיים יש לבחור מעטפת וחומרים מתאימים לסביבה.", en: "In desert or coastal sites, choose enclosure and materials suited to the environment." } },
  },
  {
    id: "noise",
    title: { he: "הפחתת רעש", en: "Noise reduction" },
    principle: { he: "מקורות הרעש: פליטה, מאוורר, מנוע ורעידות במבנה. הטיפול משלב משתיק מתאים, מעטפת / קירות אקוסטיים, מלכודות קול בתריסים ובידוד רעידות.", en: "Noise sources: exhaust, fan, engine and structure-borne vibration. Treatment combines an appropriate silencer, acoustic enclosure / walls, attenuators at louvres and vibration isolation." },
    good: { he: ["מלכודות קול (Attenuators) בכניסה וביציאה", "משתיק בדרגה מתאימה", "בידוד רעידות מהמבנה"], en: ["Attenuators at inlet and outlet", "Silencer of suitable grade", "Vibration isolation from the structure"] },
    bad: { he: ["תריסים פתוחים לכיוון שכנים", "משתיק לא מתאים"], en: ["Louvres facing neighbours", "Inadequate silencer"] },
    consequence: { he: "חריגה מתקנות הרעש ותלונות; חשיפת עובדים לרעש.", en: "Exceeding noise regulations and complaints; worker noise exposure." },
    note: { kind: "regulation", text: { he: "מפלסי הרעש המותרים — לפי תקנות מניעת מפגעים (רעש) והיתר הבנייה. מלכודות קול מוסיפות הגבלה לזרימת האוויר.", en: "Permitted noise levels — per noise-nuisance regulations and building permit. Attenuators add airflow restriction." } },
  },
  {
    id: "enclosure",
    title: { he: "תכנון מעטפת (Canopy)", en: "Generator enclosure design" },
    principle: { he: "מעטפת היא חדר קטן: היא חייבת לאזן בין הגנה מזג אוויר, הנחתת רעש, אוורור, גישה לתחזוקה ובטיחות (דלתות, תאורה, E-STOP חיצוני).", en: "An enclosure is a small room: it balances weather protection, noise attenuation, ventilation, maintenance access and safety (doors, lighting, external E-STOP)." },
    good: { he: ["דלתות גישה לצד השירות ולמצברים", "E-STOP חיצוני מסומן", "נקודות הרמה ושילוט"], en: ["Access doors to service side and batteries", "Labelled external E-STOP", "Lifting points and signage"] },
    bad: { he: ["מעטפת ״מאולתרת״ שחונקת את הרדיאטור", "אין גישה למסננים ללא פירוק"], en: ["Improvised enclosure that starves the radiator", "Filters inaccessible without dismantling"] },
    consequence: { he: "התחממות, תחזוקה לקויה וסיכון לעובדים.", en: "Overheating, poor maintenance and worker risk." },
    note: { kind: "manufacturer", text: { he: "מעטפת של יצרן נבדקת יחד עם הגנרטור; שינוי בה עלול לשנות את ביצועי הקירור.", en: "A manufacturer's enclosure is tested with the set; modifying it may change cooling performance." } },
  },
];
