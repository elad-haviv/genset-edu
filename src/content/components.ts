import type { L, LList } from "@/lib/i18n";

export type Subsystem = "mechanical" | "electrical" | "cooling" | "fuel" | "control";

export type GenComponent = {
  id: string;
  name: L;
  tag: string;
  subsystem: Subsystem;
  summary: L;
  function: L;
  principle: L;
  failures: LList;
  maintenance: LList;
  hazards: LList;
};

export const subsystemLabels: Record<Subsystem | "all", L> = {
  all: { he: "כל המערכות", en: "All systems" },
  mechanical: { he: "מכנית", en: "Mechanical" },
  electrical: { he: "חשמלית", en: "Electrical" },
  cooling: { he: "קירור ופליטה", en: "Cooling & exhaust" },
  fuel: { he: "דלק ושמן", en: "Fuel & lube" },
  control: { he: "בקרה והגנה", en: "Control & protection" },
};

export const subsystemColor: Record<Subsystem, string> = {
  mechanical: "#8aa0b8",
  electrical: "#3fb0ff",
  cooling: "#2fd4c4",
  fuel: "#ffb547",
  control: "#c792ff",
};

export const components: GenComponent[] = [
  {
    id: "engine",
    tag: "ENGINE",
    name: { he: "מנוע דיזל", en: "Diesel engine" },
    subsystem: "mechanical",
    summary: { he: "המניע הראשי — ממיר אנרגיה כימית של הדלק לאנרגיה מכנית סיבובית.", en: "The prime mover — converts the fuel's chemical energy into rotating mechanical energy." },
    function: {
      he: "מנוע בעירה פנימית בהצתה בדחיסה המסובב את רוטור האלטרנטור במהירות קבועה. מהירות הסיבוב קובעת את תדר המתח המופק, ולכן ווסת המהירות (Governor) שומר עליה יציבה בכל שינוי עומס.",
      en: "A compression-ignition internal combustion engine that turns the alternator rotor at constant speed. Shaft speed sets the output frequency, so the speed governor holds it steady as load changes.",
    },
    principle: {
      he: "אוויר נדחס בצילינדר עד שטמפרטורתו גבוהה מספיק להצית את הדלק המוזרק. מחזור ארבע פעימות: יניקה, דחיסה, עבודה ופליטה. התדר נקבע ע״י f = n·p/120 (n — סל״ד, p — מספר קטבים), ולכן למשל אלטרנטור 4 קטבים ב-50Hz מסתובב ב-1500 סל״ד.",
      en: "Air is compressed in the cylinder until it is hot enough to ignite injected fuel. Four-stroke cycle: intake, compression, power, exhaust. Frequency follows f = n·p/120 (n = rpm, p = poles), so e.g. a 4-pole alternator at 50 Hz turns at 1500 rpm.",
    },
    failures: {
      he: ["עשן שחור — בעירה לא מלאה, עומס יתר, מסנן אוויר חסום או בעיית הזרקה", "עשן לבן/כחלחל — דלק לא שרוף, נוזל קירור או שמן נשרפים", "ירידה בהספק ותנודות מהירות (Hunting) — בעיית ווסת או אספקת דלק", "רעשים ונקישות חריגים, צריכת שמן גבוהה, דליפות"],
      en: ["Black smoke — incomplete combustion, overload, blocked air filter or injection problem", "White/blue smoke — unburnt fuel, coolant or oil being burnt", "Loss of power and speed hunting — governor or fuel-supply problem", "Abnormal knocking or noise, high oil consumption, leaks"],
    },
    maintenance: {
      he: ["החלפת שמן ומסננים לפי מרווחי היצרן (שעות פעולה / זמן)", "בדיקת מסנן אוויר ומחוון סתימה", "בדיקת רצועות, צנרת ודליפות", "הפעלות ניסיון תקופתיות בעומס — לפי תכנית התחזוקה ודרישות היצרן", "נטילת דגימות שמן לניתוח מגמות (המלצה)"],
      en: ["Oil and filter changes at manufacturer intervals (hours / calendar)", "Air-filter inspection and restriction indicator check", "Belt, hose and leak inspection", "Periodic exercising under load — per maintenance plan and manufacturer guidance", "Oil sampling for trend analysis (recommended)"],
    },
    hazards: {
      he: ["חלקים מסתובבים — מאוורר, רצועות, גלגל תנופה", "משטחים חמים מאוד: סעפת פליטה, טורבו, צנרת פליטה", "התנעה אוטומטית ללא התראה במצב AUTO", "גזי פליטה (CO) ורעש גבוה"],
      en: ["Rotating parts — fan, belts, flywheel", "Very hot surfaces: exhaust manifold, turbo, exhaust pipe", "Automatic start without warning while in AUTO", "Exhaust gases (CO) and high noise"],
    },
  },
  {
    id: "alternator",
    tag: "ALTERNATOR",
    name: { he: "אלטרנטור (גנרטור סינכרוני)", en: "Alternator (synchronous generator)" },
    subsystem: "electrical",
    summary: { he: "ממיר את האנרגיה המכנית של המנוע לאנרגיה חשמלית תלת-פאזית.", en: "Converts the engine's mechanical energy into three-phase electrical power." },
    function: {
      he: "גנרטור סינכרוני ללא מברשות: הרוטור (שדה מגנטי) מסתובב בתוך הסטטור ומשרה בו מתח תלת-פאזי. מערכת עירור (Exciter) עם מיישר מסתובב מספקת זרם ישר לשדה הראשי, ונשלטת ע״י ה-AVR.",
      en: "Brushless synchronous generator: the rotor field turns inside the stator and induces a three-phase voltage. An exciter with a rotating rectifier feeds DC to the main field, controlled by the AVR.",
    },
    principle: {
      he: "חוק פאראדיי — שינוי שטף מגנטי דרך ליפופי הסטטור משרה כוח אלקטרו-מניע. גודל המתח תלוי בזרם העירור ובמהירות; התדר תלוי במהירות בלבד. מקדם ההספק של העומס משפיע על זרם העירור הנדרש.",
      en: "Faraday's law — changing magnetic flux through the stator windings induces EMF. Voltage magnitude depends on excitation current and speed; frequency on speed alone. Load power factor affects the excitation required.",
    },
    failures: {
      he: ["ירידת התנגדות בידוד הליפופים — לחות, לכלוך, התחממות", "כשל דיודות במיישר המסתובב — אובדן או חוסר יציבות מתח", "התחממות יתר עקב חסימת פתחי אוורור או עומס יתר", "רעידות ובלאי מסבים"],
      en: ["Winding insulation degradation — moisture, dirt, overheating", "Rotating-rectifier diode failure — loss or instability of voltage", "Overheating due to blocked air openings or overload", "Vibration and bearing wear"],
    },
    maintenance: {
      he: ["מדידת התנגדות בידוד ע״י בעל מקצוע מוסמך, עם הציוד מבודד ומנותק", "ניקוי פתחי כניסת ויציאת אוויר", "בדיקת הידוק חיבורים בתיבת ההדקים (ע״י מוסמך, בציוד מנותק)", "שימון/בדיקת מסבים לפי היצרן", "שימוש בגופי חימום נגד עיבוי כשהציוד מושבת (אם קיימים)"],
      en: ["Insulation resistance testing by a qualified person, with equipment isolated", "Clean air inlet and outlet openings", "Terminal-box connection checks (by a qualified person, equipment isolated)", "Bearing lubrication/inspection per manufacturer", "Use of anti-condensation heaters when idle (where fitted)"],
    },
    hazards: {
      he: ["מתח מסוכן בהדקים כל עוד הגנרטור מסתובב — גם אם המפסק פתוח", "מתח שיורי וקבלים בעירור", "חלקים מסתובבים בצימוד", "משטחים חמים"],
      en: ["Dangerous voltage at terminals whenever the machine rotates — even with the breaker open", "Residual voltage and excitation capacitors", "Rotating coupling", "Hot surfaces"],
    },
  },
  {
    id: "avr",
    tag: "AVR",
    name: { he: "ווסת מתח אוטומטי (AVR)", en: "Automatic Voltage Regulator (AVR)" },
    subsystem: "control",
    summary: { he: "שומר על מתח המוצא יציב ע״י בקרת זרם העירור.", en: "Keeps output voltage stable by controlling excitation current." },
    function: {
      he: "ה-AVR מודד את מתח המוצא ומשווה אותו לערך רצוי. הוא מגדיל או מקטין את זרם העירור לאלטרנטור כדי לשמור על מתח קבוע מול שינויי עומס ומקדם הספק.",
      en: "The AVR senses output voltage, compares it with a set point, and raises or lowers exciter field current to hold voltage constant despite load and power-factor changes.",
    },
    principle: {
      he: "בקר בחוג סגור (לרוב PID). כולל לרוב הגנת תת-תדר (U/f) המפחיתה מתח במהירויות נמוכות כדי למנוע עירור-יתר בזמן התנעה או עומס כבד פתאומי.",
      en: "Closed-loop controller (typically PID). Usually includes under-frequency (V/Hz) roll-off that reduces voltage at low speed to prevent over-excitation during start-up or heavy load steps.",
    },
    failures: {
      he: ["מתח גבוה או נמוך באופן קבוע", "תנודות מתח (Hunting) — כיול יציבות לקוי", "אובדן מוחלט של מתח מוצא", "פגיעה מנחשולי מתח או לחות"],
      en: ["Persistently high or low voltage", "Voltage hunting — poor stability tuning", "Total loss of output voltage", "Damage from surges or moisture"],
    },
    maintenance: {
      he: ["בדיקה חזותית לסימני התחממות ולחות", "כיוון והתאמה רק ע״י בעל מקצוע מוסמך ולפי הוראות היצרן", "בדיקת איכות מתח במבחני עומס תקופתיים"],
      en: ["Visual inspection for heat damage and moisture", "Adjustment only by a qualified person per manufacturer instructions", "Check voltage quality during periodic load tests"],
    },
    hazards: {
      he: ["ממוקם בתיבת ההדקים — סמוך להדקי מתח מסוכן", "כיוון לא נכון עלול לגרום למתח-יתר ולנזק לצרכנים"],
      en: ["Located in the terminal box — close to hazardous live terminals", "Incorrect adjustment can cause overvoltage and damage connected loads"],
    },
  },
  {
    id: "radiator",
    tag: "COOLING",
    name: { he: "רדיאטור ומערכת קירור", en: "Radiator & cooling system" },
    subsystem: "cooling",
    summary: { he: "מסלק את חום המנוע לסביבה באמצעות נוזל קירור ומאוורר.", en: "Rejects engine heat to atmosphere via coolant and fan." },
    function: {
      he: "משאבת מים מזרימה נוזל קירור דרך גוש המנוע; התרמוסטט מווסת את הזרימה לרדיאטור. המאוורר דוחף אוויר דרך הליבה ומסלק את החום. בחדר גנרטור, אוויר החם חייב לצאת החוצה ולא לחזור לכניסה.",
      en: "A water pump circulates coolant through the engine; the thermostat controls flow to the radiator. The fan pushes air through the core to reject heat. In a generator room, the hot air must be discharged outside and must not recirculate to the inlet.",
    },
    principle: {
      he: "העברת חום בהסעה. יכולת הקירור תלויה בספיקת האוויר ובטמפרטורת האוויר הנכנס — לכן היצרן מגדיר טמפרטורת סביבה מרבית ולחץ נגדי מרבי מותר על המאוורר (Restriction).",
      en: "Convective heat transfer. Cooling capacity depends on air flow and inlet air temperature — so the manufacturer specifies a maximum ambient temperature and a maximum allowable external restriction on the fan.",
    },
    failures: {
      he: ["טמפרטורת נוזל קירור גבוהה — ליבה סתומה, רצועה רפויה, מפלס נמוך", "דליפות בצנרת ובליבה", "חזרת אוויר חם (Recirculation) בחדר", "תרמוסטט תקוע"],
      en: ["High coolant temperature — blocked core, slack belt, low level", "Hose and core leaks", "Hot-air recirculation in the room", "Stuck thermostat"],
    },
    maintenance: {
      he: ["בדיקת מפלס וריכוז נוזל קירור (מנוע קר בלבד)", "ניקוי ליבת הרדיאטור", "בדיקת צנרת ורצועות", "בדיקת תקינות מחמם בלוק (Jacket water heater) אם מותקן"],
      en: ["Check coolant level and concentration (engine cold only)", "Clean radiator core", "Inspect hoses and belts", "Check jacket-water heater operation where fitted"],
    },
    hazards: {
      he: ["מערכת בלחץ ובחום — אסור לפתוח מכסה רדיאטור כשהמנוע חם", "מאוורר מסתובב — עלול להתחיל לפעול באופן אוטומטי", "נוזל קירור רעיל"],
      en: ["Pressurised and hot — never open the radiator cap on a hot engine", "Rotating fan — may start automatically", "Toxic coolant"],
    },
  },
  {
    id: "turbo",
    tag: "TURBO",
    name: { he: "מגדש טורבו", en: "Turbocharger" },
    subsystem: "mechanical",
    summary: { he: "מנצל את אנרגיית גזי הפליטה כדי לדחוס אוויר נכנס ולהגדיל הספק.", en: "Uses exhaust energy to compress intake air and increase power." },
    function: {
      he: "טורבינה המונעת ע״י גזי הפליטה מסובבת מדחס על אותו ציר. האוויר הדחוס (לרוב דרך מצנן ביניים) מאפשר לשרוף יותר דלק בכל מחזור.",
      en: "An exhaust-driven turbine spins a compressor on a common shaft. Compressed air (usually via an aftercooler) allows more fuel to be burnt per cycle.",
    },
    principle: {
      he: "תגובת הטורבו לשינויי עומס אינה מיידית (Turbo lag) — זו אחת הסיבות לכך שקבלת עומס פתאומי גדול מוגבלת ע״י היצרן.",
      en: "Turbo response to load changes is not instantaneous (turbo lag) — one reason the manufacturer limits the size of sudden load steps.",
    },
    failures: {
      he: ["רעש שריקה חריג", "דליפת שמן לצד הפליטה או היניקה", "עשן שחור ואובדן הספק", "נזק מגופים זרים"],
      en: ["Abnormal whistling noise", "Oil leaking into intake or exhaust side", "Black smoke and loss of power", "Foreign-object damage"],
    },
    maintenance: {
      he: ["בדיקת צנרת אוויר ומחברים לדליפות", "שמירה על מסנן אוויר תקין", "הימנעות מכיבוי מיידי לאחר עומס — זמן קירור לפי היצרן"],
      en: ["Check air ducting and clamps for leaks", "Maintain a healthy air filter", "Avoid hot shutdown after load — cool-down period per manufacturer"],
    },
    hazards: {
      he: ["אחד המשטחים החמים ביותר בגנרטור", "סיבוב במהירות גבוהה מאוד"],
      en: ["One of the hottest surfaces on the generator", "Very high rotational speed"],
    },
  },
  {
    id: "injection",
    tag: "FUEL INJ.",
    name: { he: "מערכת הזרקת דלק", en: "Fuel injection system" },
    subsystem: "fuel",
    summary: { he: "מזריקה כמות מדויקת של דלק בלחץ גבוה בתזמון הנכון.", en: "Injects a precise quantity of fuel at high pressure at the right time." },
    function: {
      he: "משאבת לחץ גבוה (או מסילה משותפת — Common Rail) ומזרקים מרססים את הדלק לתוך תא הבעירה. במנועים אלקטרוניים ה-ECU שולט בכמות ובתזמון.",
      en: "A high-pressure pump (or common rail) and injectors atomise fuel into the combustion chamber. In electronic engines the ECU controls quantity and timing.",
    },
    principle: {
      he: "ריסוס עדין ותזמון נכון הם תנאי לבעירה מלאה. כמות הדלק נקבעת ע״י ווסת המהירות כדי לשמור על סל״ד קבוע בעומס משתנה.",
      en: "Fine atomisation and correct timing are prerequisites for complete combustion. Fuel quantity is set by the governor to keep speed constant as load varies.",
    },
    failures: {
      he: ["מזרק מטפטף — עשן, דפיקות", "זיהום מים או חיידקים בדלק", "אוויר במערכת — קשיי התנעה", "דליפות בצנרת לחץ גבוה"],
      en: ["Dribbling injector — smoke, knocking", "Water or microbial contamination in fuel", "Air in the system — hard starting", "High-pressure line leaks"],
    },
    maintenance: {
      he: ["שמירה על ניקיון הדלק ומסננים תקינים", "טיפול במזרקים רק במעבדה / טכנאי מוסמך"],
      en: ["Maintain clean fuel and healthy filters", "Injector service only by a specialist workshop / qualified technician"],
    },
    hazards: {
      he: ["סילון דלק בלחץ גבוה עלול לחדור לעור — פגיעה חמורה", "סכנת דליקה מדלק על משטחים חמים"],
      en: ["High-pressure fuel jets can penetrate skin — serious injury", "Fire risk from fuel on hot surfaces"],
    },
  },
  {
    id: "fuelfilters",
    tag: "FUEL FLT",
    name: { he: "מסנני דלק ומפריד מים", en: "Fuel filters & water separator" },
    subsystem: "fuel",
    summary: { he: "מגנים על מערכת ההזרקה מפני חלקיקים ומים.", en: "Protect the injection system from particles and water." },
    function: {
      he: "מסנן ראשוני עם מפריד מים ומסנן משני עדין. מערכות הזרקה מודרניות רגישות מאוד לזיהום, ולכן הסינון קריטי לאמינות.",
      en: "A primary filter with water separator and a fine secondary filter. Modern injection systems are very sensitive to contamination, so filtration is critical for reliability.",
    },
    principle: {
      he: "מים כבדים מהסולר ושוקעים בקערת המפריד. דלק שמאוחסן זמן רב בגנרטורי חירום נוטה לספוח לחות ולזיהום מיקרוביאלי.",
      en: "Water is denser than diesel and settles in the separator bowl. Fuel stored for long periods in standby sets tends to absorb moisture and grow microbial contamination.",
    },
    failures: {
      he: ["סתימה — אובדן הספק, כיבוי תחת עומס", "הצטברות מים בקערה", "חדירת אוויר לאחר החלפה"],
      en: ["Clogging — power loss, shutdown under load", "Water accumulation in the bowl", "Air ingress after replacement"],
    },
    maintenance: {
      he: ["ניקוז מים מהמפריד", "החלפה לפי מרווחי היצרן", "בדיקת איכות דלק תקופתית במיכלים (המלצה)"],
      en: ["Drain water from the separator", "Replace at manufacturer intervals", "Periodic fuel-quality testing in tanks (recommended)"],
    },
    hazards: {
      he: ["דלק דליק — אין עבודה ליד משטחים חמים או מקורות הצתה", "פסולת דלק — לסלק לפי דין"],
      en: ["Flammable fuel — no work near hot surfaces or ignition sources", "Waste fuel must be disposed of lawfully"],
    },
  },
  {
    id: "oilfilters",
    tag: "OIL FLT",
    name: { he: "מסנני שמן ומערכת סיכה", en: "Oil filters & lubrication" },
    subsystem: "fuel",
    summary: { he: "שומרים על שמן נקי שמגן על מסבים וחלקים נעים.", en: "Keep the oil clean to protect bearings and moving parts." },
    function: {
      he: "משאבת שמן מזרימה שמן תחת לחץ למסבים, לגל הארכובה ולטורבו. המסנן מרחיק חלקיקי בלאי ופיח. חיישן לחץ שמן מזין את הבקר להתראה ולכיבוי.",
      en: "An oil pump delivers pressurised oil to bearings, crankshaft and turbo. The filter removes wear particles and soot. An oil-pressure sender feeds the controller for alarm and shutdown.",
    },
    principle: {
      he: "שכבת שמן בלחץ מפרידה בין משטחים נעים. אובדן לחץ שמן גורם לנזק מהיר ובלתי הפיך — לכן זו הגנת כיבוי קריטית.",
      en: "A pressurised oil film separates moving surfaces. Loss of oil pressure causes rapid, irreversible damage — hence it is a critical shutdown protection.",
    },
    failures: {
      he: ["לחץ שמן נמוך — מפלס נמוך, מסנן סתום, משאבה או חיישן", "דילול שמן בסולר", "דליפות מאטמים"],
      en: ["Low oil pressure — low level, clogged filter, pump or sender", "Oil dilution with fuel", "Seal leaks"],
    },
    maintenance: {
      he: ["בדיקת מפלס שמן במנוע מושבת", "החלפת שמן ומסנן לפי היצרן", "שימוש בדרגת שמן שהיצרן מאשר"],
      en: ["Check oil level with the engine stopped", "Change oil and filter per manufacturer", "Use only manufacturer-approved oil grade"],
    },
    hazards: {
      he: ["שמן חם עלול לגרום לכוויות", "שמן משומש — פסולת מסוכנת"],
      en: ["Hot oil can cause burns", "Used oil is hazardous waste"],
    },
  },
  {
    id: "starter",
    tag: "STARTER",
    name: { he: "מתנע (סטרטר)", en: "Starter motor" },
    subsystem: "electrical",
    summary: { he: "מנוע DC המסובב את המנוע עד להתנעה עצמית.", en: "DC motor that cranks the engine until it fires." },
    function: {
      he: "מנוע זרם ישר בעל מומנט גבוה. גלגל שיניים (Pinion) נשלב בגלגל השיניים של גלגל התנופה. הבקר מבצע ניסיונות התנעה מוגבלים בזמן עם הפסקות ביניהם.",
      en: "A high-torque DC motor. A pinion engages the flywheel ring gear. The controller performs time-limited crank attempts with rest periods between them.",
    },
    principle: {
      he: "צורך זרם גבוה מאוד מהמצברים בעת ההתנעה. מתח מצבר נמוך גורם לסיבוב איטי ולכשל התנעה.",
      en: "Draws very high current from the batteries while cranking. Low battery voltage results in slow cranking and start failure.",
    },
    failures: {
      he: ["אין סיבוב — מצבר, חיבורים, ממסר או סולנואיד", "סיבוב איטי — מצבר חלש או חיבורים מוחמצנים", "בלאי שיני Pinion"],
      en: ["No crank — battery, connections, relay or solenoid", "Slow crank — weak battery or corroded connections", "Pinion tooth wear"],
    },
    maintenance: {
      he: ["בדיקת חיבורי כבלים למצברים (במצב מבודד)", "מעקב אחר זמני התנעה ביומן"],
      en: ["Check battery cable connections (isolated)", "Log crank times for trend monitoring"],
    },
    hazards: {
      he: ["זרמים גבוהים מאוד — קצר במצבר מסוכן", "התנעה אוטומטית אפשרית במצב AUTO"],
      en: ["Very high currents — a battery short circuit is dangerous", "Automatic start possible in AUTO mode"],
    },
  },
  {
    id: "batteries",
    tag: "BATTERY",
    name: { he: "מצברי התנעה", en: "Starting batteries" },
    subsystem: "electrical",
    summary: { he: "מקור האנרגיה להתנעה ולבקר — החוליה הנפוצה ביותר בכשלי התנעה.", en: "Energy source for cranking and the controller — the most common weak link in start failures." },
    function: {
      he: "מצברי עופרת-חומצה או אחרים לפי היצרן, במתח DC (לרוב 12V או 24V). מזינים את המתנע, הבקר וה-ECU. במתקנים קריטיים קיימות לעיתים מערכות מצברים כפולות.",
      en: "Lead-acid or other types per manufacturer, at DC voltage (commonly 12 V or 24 V). Supply starter, controller and ECU. Critical installations sometimes use dual battery systems.",
    },
    principle: {
      he: "קיבולת המצבר יורדת בטמפרטורות נמוכות ועם הגיל. מצבר עשוי להציג מתח מנוחה תקין ובכל זאת לקרוס תחת זרם ההתנעה.",
      en: "Battery capacity falls with low temperature and age. A battery can show normal resting voltage and still collapse under cranking current.",
    },
    failures: {
      he: ["מצבר חלש / מתבלה", "קורוזיה בהדקים", "טעינת-יתר או טעינת-חסר", "התייבשות אלקטרוליט"],
      en: ["Weak / ageing battery", "Terminal corrosion", "Over- or under-charging", "Electrolyte dry-out"],
    },
    maintenance: {
      he: ["בדיקת מתח ומצב, ובדיקת עומס ע״י מוסמך", "ניקוי הדקים", "החלפה יזומה לפי גיל ומצב (המלצה)", "אוורור מקום המצברים"],
      en: ["Voltage/condition checks and load testing by a qualified person", "Clean terminals", "Proactive replacement by age and condition (recommended)", "Ventilate the battery location"],
    },
    hazards: {
      he: ["פליטת מימן בטעינה — סכנת פיצוץ; אין להכניס מקורות הצתה", "אלקטרוליט חומצי — הגנת עיניים ועור", "זרם קצר גבוה מאוד"],
      en: ["Hydrogen released during charging — explosion risk; keep ignition sources away", "Acidic electrolyte — eye and skin protection", "Very high short-circuit current"],
    },
  },
  {
    id: "charger",
    tag: "CHARGER",
    name: { he: "מטען מצברים", en: "Battery charger" },
    subsystem: "electrical",
    summary: { he: "שומר על המצברים טעונים בזמן שהגנרטור בהמתנה.", en: "Keeps batteries charged while the set is on standby." },
    function: {
      he: "מטען המוזן מרשת החשמל ומחזיק את המצברים במצב טעינת ציפה (Float). בזמן ריצה, אלטרנטור הטעינה של המנוע (Charge alternator) טוען את המצברים.",
      en: "A mains-fed charger maintains batteries at float. While running, the engine's charge alternator charges the batteries.",
    },
    principle: {
      he: "אובדן הזנת הרשת למטען או תקלה במטען יגרמו לפריקה איטית של המצברים — תקלה שקטה שמתגלה לרוב רק כשהגנרטור נדרש להתניע. לכן חשוב שהבקר יתריע על כשל מטען.",
      en: "Loss of the charger's mains supply or a charger fault slowly discharges the batteries — a silent failure usually discovered only when the set must start. The controller should therefore alarm on charger failure.",
    },
    failures: {
      he: ["אין יציאה — נתיך, הזנה או כרטיס", "מתח טעינה לא מתאים לסוג המצבר", "חיבור התראת כשל לא מחווט"],
      en: ["No output — fuse, supply or board", "Charge voltage unsuited to battery type", "Fail alarm contact not wired"],
    },
    maintenance: {
      he: ["בדיקת נוריות ותצוגות המטען", "וידוא שהתראות כשל מגיעות לבקר / למערכת הבקרה של המבנה"],
      en: ["Check charger indicators and display", "Verify fail alarms reach the controller / BMS"],
    },
    hazards: {
      he: ["הזנת רשת AC בתוך הארון — מתח מסוכן", "טעינה בסביבה לא מאווררת — מימן"],
      en: ["AC mains inside the enclosure — hazardous voltage", "Charging in unventilated space — hydrogen"],
    },
  },
  {
    id: "ecu",
    tag: "ECU",
    name: { he: "יחידת בקרת מנוע (ECU)", en: "Engine Control Unit (ECU)" },
    subsystem: "control",
    summary: { he: "המחשב של המנוע — שולט בהזרקה ובמהירות ומנטר חיישנים.", en: "The engine's computer — controls injection and speed and monitors sensors." },
    function: {
      he: "מעבד נתוני חיישנים (מהירות, לחצים, טמפרטורות) ושולט במזרקים ובווסת האלקטרוני. מתקשר עם בקר הגנרטור, לרוב בפרוטוקול J1939/CAN, ומדווח קודי תקלה.",
      en: "Processes sensor data (speed, pressures, temperatures) and drives injectors and the electronic governor. Communicates with the generator controller, often over J1939/CAN, and reports fault codes.",
    },
    principle: {
      he: "בקרת מהירות בחוג סגור — שומרת על תדר יציב. אובדן תקשורת בין ה-ECU לבקר הוא תקלה שמחייבת בירור.",
      en: "Closed-loop speed control — keeps frequency stable. Loss of communication between ECU and controller is a fault that must be investigated.",
    },
    failures: {
      he: ["קודי תקלה של חיישנים", "אובדן תקשורת CAN", "רגישות למתח הזנה נמוך בזמן התנעה"],
      en: ["Sensor fault codes", "CAN communication loss", "Sensitivity to low supply voltage during cranking"],
    },
    maintenance: {
      he: ["קריאת קודי תקלה עם כלי האבחון של היצרן", "עדכוני תוכנה רק ע״י נציג מוסמך"],
      en: ["Read fault codes with the manufacturer's service tool", "Software updates only by authorised service"],
    },
    hazards: {
      he: ["שינוי פרמטרים לא מורשה עלול לבטל הגנות"],
      en: ["Unauthorised parameter changes can defeat protections"],
    },
  },
  {
    id: "controller",
    tag: "GEN CTRL",
    name: { he: "בקר גנרטור", en: "Generator controller" },
    subsystem: "control",
    summary: { he: "ה'מוח' של המערכת — התנעה, הגנות, מדידות והתראות.", en: "The system 'brain' — starting, protections, metering and alarms." },
    function: {
      he: "מנהל רצף התנעה ועצירה, מצבי עבודה (OFF / MAN / AUTO), מדידת מתח, זרם, תדר והספק, הגנות מנוע וגנרטור, התראות ותקשורת למערכות חיצוניות. בגנרטורים במקביל הוא מבצע גם סנכרון וחלוקת עומס.",
      en: "Manages start/stop sequencing, operating modes (OFF / MAN / AUTO), metering of voltage, current, frequency and power, engine and generator protections, alarms and remote communications. In parallel systems it also synchronises and shares load.",
    },
    principle: {
      he: "מבחין בין אזהרה (Warning — התראה בלבד) לבין כיבוי (Shutdown — עצירה מיידית) ולעיתים גם פריקת עומס וקירור (Electrical trip + cooldown). כל איפוס של התראת כיבוי מחייב בירור הסיבה.",
      en: "Distinguishes warnings (alarm only) from shutdowns (immediate stop), and sometimes electrical trip with cooldown. Every shutdown reset requires investigation of the cause.",
    },
    failures: {
      he: ["תצוגה כבויה — אובדן הזנת DC", "התראות שווא מחיישן תקול", "הגדרות שגויות לאחר שינוי"],
      en: ["Blank display — DC supply loss", "Nuisance alarms from a faulty sender", "Incorrect settings after changes"],
    },
    maintenance: {
      he: ["בדיקת יומן אירועים", "בדיקת פונקציונליות של התראות והגנות ע״י מוסמך במסגרת תחזוקה", "גיבוי הגדרות"],
      en: ["Review the event log", "Functional checks of alarms and protections by a qualified person as part of maintenance", "Back up settings"],
    },
    hazards: {
      he: ["במצב AUTO הגנרטור עשוי להתניע בכל רגע", "ארון הבקר עשוי להכיל מתחי AC"],
      en: ["In AUTO the set may start at any moment", "The controller cabinet may contain AC voltages"],
    },
  },
  {
    id: "breaker",
    tag: "MCCB/ACB",
    name: { he: "מפסק ראשי של הגנרטור", en: "Main generator circuit breaker" },
    subsystem: "control",
    summary: { he: "מגן על הגנרטור והכבלים מפני עומס-יתר וקצר, ומאפשר ניתוק.", en: "Protects generator and cables against overload and short circuit and provides switching." },
    function: {
      he: "מפסק זרם (MCCB או ACB) עם יחידת הגנה תרמית/מגנטית או אלקטרונית. מנתק אוטומטית בעומס-יתר, בקצר ולעיתים בזליגה לאדמה. סלקטיביות עם ההגנות במורד נקבעת בתכנון.",
      en: "A circuit breaker (MCCB or ACB) with thermal-magnetic or electronic trip unit. Trips automatically on overload, short circuit and sometimes earth fault. Selectivity with downstream protection is established in design.",
    },
    principle: {
      he: "זרם הקצר של גנרטור נמוך בהרבה מזה של שנאי רשת ויורד עם הזמן (תגובה תת-חולפת → חולפת → מתמדת). לכן כיול ההגנות חייב להתאים לגנרטור ולא רק לרשת.",
      en: "A generator's short-circuit current is much lower than a utility transformer's and decays over time (subtransient → transient → steady state). Protection settings must therefore suit the generator, not just the utility.",
    },
    failures: {
      he: ["ניתוק עקב עומס-יתר או קצר במורד", "כיול שגוי — ניתוקי שווא או חוסר הגנה", "בלאי מגעים"],
      en: ["Trip due to downstream overload or short circuit", "Wrong settings — nuisance trips or no protection", "Contact wear"],
    },
    maintenance: {
      he: ["בדיקת מפסק ויחידת הגנה ע״י מוסמך לפי היצרן", "תיעוד הגדרות ההגנה", "בירור סיבת ניתוק לפני חיבור מחדש"],
      en: ["Breaker and trip-unit testing by a qualified person per manufacturer", "Record protection settings", "Investigate trip cause before re-closing"],
    },
    hazards: {
      he: ["צד הגנרטור של המפסק נשאר מחושמל כשהגנרטור פועל", "סכנת קשת חשמלית בעת חיבור על תקלה"],
      en: ["Generator side remains live while the set runs", "Arc-flash risk when closing onto a fault"],
    },
  },
  {
    id: "estop",
    tag: "E-STOP",
    name: { he: "לחצן עצירת חירום", en: "Emergency stop button" },
    subsystem: "control",
    summary: { he: "עוצר את הגנרטור מיד במצב חירום.", en: "Stops the generator immediately in an emergency." },
    function: {
      he: "לחצן פטרייה אדום על רקע צהוב הננעל במצב לחוץ. מנתק את הזנת הדלק / העצירה של המנוע באמצעות מעגל בטיחות קשיח, ולעיתים קיים לחצן נוסף מחוץ לחדר.",
      en: "A red mushroom-head on a yellow background that latches when pressed. Stops fuel supply / engine via a hard-wired safety circuit; often a second button is installed outside the room.",
    },
    principle: {
      he: "עצירת חירום היא אמצעי לעצירת סכנה — לא אמצעי לבידוד לצורך עבודה. אחרי שחרור הלחצן אין התנעה אוטומטית עד לאיפוס מכוון בבקר.",
      en: "Emergency stop is a means to stop a hazard — not a means of isolation for work. Releasing the button must not restart the set until a deliberate controller reset.",
    },
    failures: {
      he: ["לחצן נשאר לחוץ — הגנרטור לא יתניע בחירום", "חיווט מעגל פגום", "לחצן חיצוני לא מסומן או מוסתר"],
      en: ["Button left latched — set will not start in an emergency", "Faulty circuit wiring", "Remote button unlabeled or hidden"],
    },
    maintenance: {
      he: ["בדיקה פונקציונלית תקופתית ע״י מוסמך", "וידוא שילוט ונגישות"],
      en: ["Periodic functional testing by a qualified person", "Verify signage and accessibility"],
    },
    hazards: {
      he: ["E-STOP אינו מבטיח העדר מתח — יש לבצע נעילה ותיוג לפני עבודה"],
      en: ["E-STOP does not guarantee absence of voltage — perform lockout/tagout before work"],
    },
  },
  {
    id: "exhaust",
    tag: "EXHAUST",
    name: { he: "מערכת פליטה ומשתיק", en: "Exhaust system & silencer" },
    subsystem: "cooling",
    summary: { he: "מוליכה את גזי הפליטה החוצה בבטחה ומפחיתה רעש.", en: "Carries exhaust gases safely outside and reduces noise." },
    function: {
      he: "סעפת, צינור גמיש (Bellows), משתיק וצנרת המובילה את הגזים החוצה. הצינור הגמיש בולע תזוזות ורעידות והתפשטות תרמית.",
      en: "Manifold, flexible bellows, silencer and piping carrying gases outside. The flexible section absorbs movement, vibration and thermal expansion.",
    },
    principle: {
      he: "לחץ נגדי (Back pressure) גבוה מהמותר ע״י היצרן מפחית הספק ומעלה טמפרטורות. נקודת היציאה צריכה למנוע חזרת גזים למבנה ולכניסות אוויר.",
      en: "Back pressure above the manufacturer limit reduces power and raises temperatures. The outlet location must prevent gases re-entering the building or air intakes.",
    },
    failures: {
      he: ["דליפות גזים בחיבורים", "סדק בצינור הגמיש", "חדירת מי גשם", "Wet stacking — הצטברות דלק לא שרוף בעבודה ממושכת בעומס נמוך"],
      en: ["Gas leaks at joints", "Cracked flexible section", "Rainwater ingress", "Wet stacking — unburnt fuel build-up from prolonged light-load running"],
    },
    maintenance: {
      he: ["בדיקה חזותית לדליפות ופיח", "בדיקת תמיכות ובידוד תרמי", "ניקוז עיבויים אם קיים"],
      en: ["Visual inspection for leaks and soot", "Check supports and thermal insulation", "Drain condensate where provided"],
    },
    hazards: {
      he: ["פחמן חד-חמצני (CO) — גז חסר ריח וקטלני", "משטחים חמים מאוד — סכנת כוויות ודליקה"],
      en: ["Carbon monoxide (CO) — odourless and lethal", "Very hot surfaces — burn and fire risk"],
    },
  },
  {
    id: "mounts",
    tag: "AVM",
    name: { he: "בולמי רעידות", en: "Anti-vibration mounts" },
    subsystem: "mechanical",
    summary: { he: "מבודדים את רעידות המנוע מהשלדה ומהמבנה.", en: "Isolate engine vibration from the frame and building." },
    function: {
      he: "בולמי גומי או קפיצים בין המנוע/אלטרנטור לשלדת הבסיס, ולעיתים גם בין השלדה ליסוד. מפחיתים העברת רעידות ורעש למבנה.",
      en: "Rubber or spring isolators between engine/alternator and the base frame, and sometimes between frame and foundation. Reduce vibration and structure-borne noise.",
    },
    principle: {
      he: "בידוד רעידות יעיל כאשר תדר הטבעי של הבולם נמוך משמעותית מתדר העירור. בשל כך כל חיבור קשיח למבנה (צנרת, כבלים) חייב לכלול קטע גמיש.",
      en: "Isolation is effective when the mount's natural frequency is well below the excitation frequency. Hence every connection to the building (pipes, cables) must include a flexible section.",
    },
    failures: {
      he: ["גומי סדוק או מתקשה", "קפיץ מנוון או מוברג עד הסוף (Bottoming)", "חיבורים קשיחים שעוקפים את הבידוד"],
      en: ["Cracked or hardened rubber", "Collapsed spring or bolted solid (bottoming)", "Rigid connections short-circuiting the isolation"],
    },
    maintenance: {
      he: ["בדיקה חזותית של מצב הבולמים", "וידוא שהצנרת והכבלים גמישים בנקודת החיבור"],
      en: ["Visual inspection of mount condition", "Verify pipes and cables are flexible at the connection"],
    },
    hazards: {
      he: ["רעידות מוגברות עלולות לשחרר חיבורים חשמליים ולגרום לסדקים"],
      en: ["Increased vibration can loosen electrical connections and cause cracking"],
    },
  },
  {
    id: "earthing",
    tag: "PE",
    name: { he: "הדקי הארקה והשוואת פוטנציאלים", en: "Earthing terminals & bonding" },
    subsystem: "electrical",
    summary: { he: "מחברים את חלקי המתכת למערכת הארקה להגנה מפני חשמול.", en: "Connect metal parts to the earthing system to protect against electric shock." },
    function: {
      he: "הדק הארקה על השלדה והדק PE בתיבת ההדקים. מחברים את כל החלקים המתכתיים החשופים למוליך הארקה, כך שבתקלת בידוד יזרום זרם תקלה שיפעיל את ההגנה. אופן חיבור האפס (N) לאדמה בגנרטור תלוי בשיטת ההארקה ובמבנה מפסק ההחלפה.",
      en: "An earth stud on the frame and a PE terminal in the terminal box. All exposed metal parts are connected to the protective conductor so that an insulation fault produces a fault current that operates protection. Whether the generator neutral is bonded to earth depends on the earthing system and the transfer-switch arrangement.",
    },
    principle: {
      he: "מטרת ההארקה: להגביל את מתח המגע ולאפשר ניתוק אוטומטי מהיר של ההזנה בעת תקלה (IEC 60364-4-41). מוליכי השוואת פוטנציאלים מקטינים הפרשי מתח בין חלקים מתכתיים.",
      en: "Purpose: limit touch voltage and enable fast automatic disconnection of supply on fault (IEC 60364-4-41). Bonding conductors reduce voltage differences between metal parts.",
    },
    failures: {
      he: ["חיבור רופף או מוחמצן", "מוליך הארקה מנותק לאחר עבודה", "חיבור N-PE כפול / שגוי — זרמי אפס במוליכי הארקה"],
      en: ["Loose or corroded connection", "Protective conductor left disconnected after work", "Duplicate / incorrect N-PE bond — neutral current flowing on earth conductors"],
    },
    maintenance: {
      he: ["בדיקה חזותית של רציפות ושלמות", "מדידות לולאת תקלה והארקה ע״י בודק מוסמך לפי התקנות"],
      en: ["Visual check of continuity and integrity", "Earth-loop and earthing measurements by an authorised tester per regulations"],
    },
    hazards: {
      he: ["ניתוק מוליך הארקה יוצר מצב מסוכן ללא כל סימן חיצוני"],
      en: ["A disconnected protective conductor creates a dangerous condition with no outward sign"],
    },
  },
  {
    id: "baseframe",
    tag: "BASE/TANK",
    name: { he: "שלדת בסיס ומיכל יומי", en: "Base frame & day tank" },
    subsystem: "fuel",
    summary: { he: "השלדה הנושאת את כל המערכת, לרוב עם מיכל דלק משולב.", en: "The frame that carries the whole set, often with an integral fuel tank." },
    function: {
      he: "שלדת פלדה הנושאת את המנוע והאלטרנטור, ובגנרטורים רבים כוללת מיכל דלק יומי בבסיס (Sub-base tank) — לעיתים עם דופן כפולה למניעת דליפות.",
      en: "A steel frame carrying engine and alternator; many sets include a sub-base day tank — sometimes double-walled to contain leaks.",
    },
    principle: {
      he: "השלדה חייבת להיות מפולסת ונתמכת היטב. גודל המיכל וסידורי המילוי, האוורור, וההכלה כפופים לדרישות הרשויות ולדרישות כיבוי אש.",
      en: "The frame must be level and properly supported. Tank size, fill, venting and containment arrangements are subject to authority and fire-safety requirements.",
    },
    failures: {
      he: ["דליפה מהמיכל", "חיישן מפלס תקול", "מים בתחתית המיכל"],
      en: ["Tank leak", "Faulty level sender", "Water at the bottom of the tank"],
    },
    maintenance: {
      he: ["בדיקת חיישן דליפה בדופן כפולה", "ניקוז מים ובדיקת איכות דלק", "בדיקת מכסה מילוי ואוורור"],
      en: ["Test the interstitial leak sensor", "Drain water and check fuel quality", "Inspect fill cap and vent"],
    },
    hazards: {
      he: ["אדי דלק — אין מקורות הצתה", "סכנת החלקה משפך דלק"],
      en: ["Fuel vapour — no ignition sources", "Slip hazard from spills"],
    },
  },
];

export const componentById = Object.fromEntries(components.map((c) => [c.id, c])) as Record<string, GenComponent>;
