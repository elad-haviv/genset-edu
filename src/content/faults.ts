import type { L, LList } from "@/lib/i18n";

export type Readings = { rpm: number; hz: number; v: number; kw: number; pct: number; oil: number; h2o: number; batt: number; fuel: number };

export type FaultScenario = {
  id: string;
  title: L;
  code: string;
  level: "warn" | "shutdown" | "trip";
  alarm: string;
  context: L;
  readings: Readings;
  meaning: { options: L[]; correct: number; explain: L };
  categories: { options: L[]; correct: number[]; explain: L };
  priority: { options: L[]; correct: number; explain: L };
  verify: LList;
};

const run: Readings = { rpm: 1500, hz: 50.0, v: 400, kw: 180, pct: 60, oil: 4.2, h2o: 84, batt: 27.6, fuel: 72 };
const stop: Readings = { rpm: 0, hz: 0, v: 0, kw: 0, pct: 0, oil: 0, h2o: 52, batt: 26.8, fuel: 72 };

export const faultScenarios: FaultScenario[] = [
  {
    id: "oil",
    title: { he: "לחץ שמן נמוך", en: "Low oil pressure" },
    code: "SD-01",
    level: "shutdown",
    alarm: "LOW OIL PRESSURE SHUTDOWN",
    context: { he: "הגנרטור נעצר אחרי 40 דקות ריצה בעומס בינוני. הלחץ האחרון שנרשם ירד בהדרגה.", en: "The set stopped after 40 minutes at medium load. The last logged pressure fell progressively." },
    readings: { ...stop, oil: 0, h2o: 88 },
    meaning: {
      options: [
        { he: "אזהרה בלבד — אפשר להמשיך לרוץ", en: "Warning only — the set may keep running" },
        { he: "כיבוי מגן: לחץ השמן ירד מתחת לסף — המנוע נעצר כדי למנוע נזק למסבים", en: "Protective shutdown: oil pressure fell below threshold — the engine stopped to prevent bearing damage" },
        { he: "תקלה חשמלית באלטרנטור", en: "An alternator electrical fault" },
      ],
      correct: 1,
      explain: { he: "זו הגנת כיבוי קריטית. איפוס והתנעה חוזרת ללא בירור עלולים להרוס את המנוע.", en: "This is a critical shutdown. Resetting and restarting without investigation can destroy the engine." },
    },
    categories: {
      options: [
        { he: "מפלס שמן נמוך / דליפה", en: "Low oil level / leak" },
        { he: "חיישן או חיווט לחץ שמן תקול", en: "Faulty oil-pressure sender or wiring" },
        { he: "משאבת שמן / מסנן סתום", en: "Oil pump / clogged filter" },
        { he: "תדר רשת גבוה", en: "High utility frequency" },
        { he: "דילול שמן או צמיגות לא מתאימה", en: "Oil dilution or wrong viscosity" },
      ],
      correct: [0, 1, 2, 4],
      explain: { he: "תדר הרשת אינו קשור — הגנרטור מנותק ממנה. שאר הקטגוריות כולן אפשריות.", en: "Utility frequency is unrelated — the set is disconnected from it. All other categories are plausible." },
    },
    priority: {
      options: [
        { he: "לאפס ולהתניע שוב כדי לבדוק אם התקלה חוזרת", en: "Reset and restart to see whether it recurs" },
        { he: "לשמור על המנוע מושבת ולמנוע התנעה; בדיקה חזותית ובדיקת מפלס (מנוע עצור וקר) ע״י מוסמך", en: "Keep the engine stopped and prevent starting; visual and level check (engine stopped and cool) by a qualified person" },
        { he: "לנתק את החיישן כדי שלא יכבה שוב", en: "Disconnect the sender so it won't shut down again" },
      ],
      correct: 1,
      explain: { he: "לעולם לא לעקוף הגנה. קודם בודקים את הסיבה הפשוטה והבטוחה — עם המנוע עצור ומבודד.", en: "Never bypass a protection. First check the simple, safe cause — with the engine stopped and isolated." },
    },
    verify: {
      he: ["מפלס שמן ומצבו, סימני דליפה", "השוואת קריאת לחץ עם מד מכני מכויל (ע״י טכנאי מוסמך)", "מצב מסנן השמן ותיעוד ההחלפה האחרונה", "קודי תקלה ב-ECU ויומן אירועים"],
      en: ["Oil level and condition, signs of leaks", "Compare reading with a calibrated mechanical gauge (by a qualified technician)", "Oil-filter condition and last-change record", "ECU fault codes and event log"],
    },
  },
  {
    id: "coolant",
    title: { he: "טמפרטורת נוזל קירור גבוהה", en: "High coolant temperature" },
    code: "SD-02",
    level: "shutdown",
    alarm: "HIGH COOLANT TEMP SHUTDOWN",
    context: { he: "יום חם, ריצה ארוכה בעומס גבוה בחדר גנרטור. הטמפרטורה טיפסה לאורך השעה האחרונה.", en: "A hot day, long run at high load in a generator room. Temperature climbed over the last hour." },
    readings: { ...stop, h2o: 104 },
    meaning: {
      options: [
        { he: "המנוע נעצר כי הקירור לא הצליח לסלק את החום", en: "The engine stopped because cooling could not reject the heat" },
        { he: "התראת מצבר", en: "A battery alarm" },
        { he: "האלטרנטור ייצר מתח גבוה", en: "The alternator produced high voltage" },
      ],
      correct: 0,
      explain: { he: "כיבוי בטמפרטורה גבוהה מגן על המנוע מעיוות וכשל אטמים.", en: "High-temperature shutdown protects the engine from distortion and gasket failure." },
    },
    categories: {
      options: [
        { he: "חזרת אוויר חם בחדר / אוורור לא מספק", en: "Hot-air recirculation / insufficient ventilation" },
        { he: "ליבת רדיאטור סתומה", en: "Blocked radiator core" },
        { he: "מפלס נוזל נמוך / דליפה", en: "Low coolant / leak" },
        { he: "רצועת מאוורר רפויה / תרמוסטט תקוע", en: "Slack fan belt / stuck thermostat" },
        { he: "מתח מצבר גבוה", en: "High battery voltage" },
      ],
      correct: [0, 1, 2, 3],
      explain: { he: "מתח המצבר לא קשור. בחדרי גנרטור, חזרת אוויר חם היא סיבה נפוצה במיוחד.", en: "Battery voltage is unrelated. In generator rooms, hot-air recirculation is a particularly common cause." },
    },
    priority: {
      options: [
        { he: "לפתוח את מכסה הרדיאטור מיד כדי לבדוק מפלס", en: "Open the radiator cap immediately to check level" },
        { he: "להשאיר להתקרר, למנוע התנעה, ולבדוק את סביבת החדר (תריסים, תעלה, חסימות)", en: "Let it cool, prevent restart, and inspect the room (louvres, duct, obstructions)" },
        { he: "להתניע מחדש בעומס מלא", en: "Restart at full load" },
      ],
      correct: 1,
      explain: { he: "מכסה רדיאטור במנוע חם — סכנת כוויות מנוזל רותח בלחץ. בדיקת החדר בטוחה ומיידית.", en: "A radiator cap on a hot engine — scalding risk from pressurised coolant. Inspecting the room is safe and immediate." },
    },
    verify: {
      he: ["תריסי כניסה/יציאה פתוחים ותעלת פריקה שלמה", "ניקיון ליבת הרדיאטור", "מפלס וריכוז נוזל (במנוע קר)", "מתיחת רצועה ותפקוד תרמוסטט"],
      en: ["Inlet/outlet louvres open and discharge duct intact", "Radiator core cleanliness", "Coolant level and concentration (engine cold)", "Belt tension and thermostat operation"],
    },
  },
  {
    id: "charge",
    title: { he: "כשל טעינת מצברים", en: "Battery charging failure" },
    code: "W-07",
    level: "warn",
    alarm: "BATTERY CHARGER FAIL",
    context: { he: "הגנרטור בהמתנה (AUTO). מתח המצבר יורד לאט במשך כמה ימים.", en: "The set is on standby (AUTO). Battery voltage has been slowly falling for days." },
    readings: { ...stop, batt: 23.9, h2o: 45 },
    meaning: {
      options: [
        { he: "אין חשיבות כל עוד הרשת תקינה", en: "Irrelevant while the utility is healthy" },
        { he: "המצברים אינם נטענים — בקרוב הגנרטור לא יוכל להתניע בהפסקת חשמל", en: "Batteries aren't charging — soon the set won't be able to start in an outage" },
        { he: "הגנרטור עומד לעבור לעומס-יתר", en: "The set is about to overload" },
      ],
      correct: 1,
      explain: { he: "זו ״תקלה שקטה״ קלאסית — מתגלה רק כשהגנרטור נדרש.", en: "A classic 'silent failure' — discovered only when the set is needed." },
    },
    categories: {
      options: [
        { he: "אובדן הזנת רשת למטען (מפסק / נתיך)", en: "Loss of charger mains supply (breaker / fuse)" },
        { he: "תקלה במטען", en: "Charger fault" },
        { he: "מצבר בסוף חייו", en: "Battery at end of life" },
        { he: "לחץ שמן נמוך", en: "Low oil pressure" },
      ],
      correct: [0, 1, 2],
      explain: { he: "לחץ שמן אינו קשור לטעינה במצב המתנה.", en: "Oil pressure is unrelated to charging on standby." },
    },
    priority: {
      options: [
        { he: "לדווח מיד כ״גנרטור בסיכון״ ולתאם בדיקה ע״י מוסמך של הזנת המטען, המטען והמצברים", en: "Report immediately as 'generator at risk' and arrange qualified checks of charger supply, charger and batteries" },
        { he: "להתעלם עד הטיפול השנתי", en: "Ignore until the annual service" },
        { he: "לחבר מטען ביתי כלשהו", en: "Connect any household charger" },
      ],
      correct: 0,
      explain: { he: "זמינות הגנרטור נפגעה — זו התראה שדורשת פעולה מהירה, גם אם אין סכנה מיידית.", en: "Generator availability is compromised — this warning needs prompt action even without immediate danger." },
    },
    verify: {
      he: ["הזנת AC למטען ותקינות המפסק", "מתח ותצוגות המטען", "מצב המצברים ובדיקת עומס", "שהתראת המטען מגיעה למערכת הבקרה של המבנה"],
      en: ["AC supply to charger and its breaker", "Charger output and indicators", "Battery condition and load test", "That the charger alarm reaches the BMS"],
    },
  },
  {
    id: "start",
    title: { he: "כשל התנעה", en: "Starting failure" },
    code: "SD-05",
    level: "shutdown",
    alarm: "FAIL TO START",
    context: { he: "בהפעלת ניסיון שבועית המתנע הסתובב, אך המנוע לא ״תפס״ בכל הניסיונות.", en: "During the weekly test run the starter turned, but the engine didn't fire on any attempt." },
    readings: { ...stop, batt: 25.1 },
    meaning: {
      options: [
        { he: "הבקר מיצה את ניסיונות ההתנעה ונעל את המערכת", en: "The controller exhausted its crank attempts and locked out" },
        { he: "הרשת נפלה", en: "The utility failed" },
        { he: "האלטרנטור קצר", en: "The alternator shorted" },
      ],
      correct: 0,
      explain: { he: "מאחר שהמתנע הסתובב, הבעיה סבירה יותר בדלק/אוויר/בקרת מנוע מאשר במצבר.", en: "Since the starter turned, the cause is more likely fuel/air/engine control than battery." },
    },
    categories: {
      options: [
        { he: "אין דלק / מסנן סתום / אוויר במערכת", en: "No fuel / clogged filter / air in system" },
        { he: "סולנואיד דלק או ECU", en: "Fuel solenoid or ECU" },
        { he: "E-STOP לחוץ (לא סביר כאן — המתנע הסתובב)", en: "E-STOP latched (unlikely here — starter turned)" },
        { he: "מנוע קר מאוד ללא חימום", en: "Very cold engine without pre-heat" },
      ],
      correct: [0, 1, 3],
      explain: { he: "E-STOP לחוץ היה מונע גם את סיבוב המתנע.", en: "A latched E-STOP would have prevented cranking too." },
    },
    priority: {
      options: [
        { he: "לנסות להתניע שוב ושוב עד שיצליח", en: "Keep cranking until it starts" },
        { he: "לעצור ניסיונות, לבדוק מפלס דלק וקודי תקלה, ולהעביר לטכנאי מוסמך לבדיקת מערכת הדלק", en: "Stop attempts, check fuel level and fault codes, and pass to a qualified technician for fuel-system checks" },
        { he: "לרסס חומר התנעה לכניסת האוויר", en: "Spray starting fluid into the intake" },
      ],
      correct: 1,
      explain: { he: "התנעות חוזרות שורפות את המתנע ומרוקנות מצברים. חומרי התנעה עלולים לגרום נזק ופיצוץ ואינם בשימוש ללא אישור יצרן.", en: "Repeated cranking burns out the starter and drains batteries. Starting fluids can cause damage and explosions and aren't used without manufacturer approval." },
    },
    verify: {
      he: ["מפלס ואיכות הדלק, ברזי דלק פתוחים", "מסננים ומפריד מים", "קודי ECU ותפקוד סולנואיד הדלק", "מחמם בלוק פועל"],
      en: ["Fuel level and quality, valves open", "Filters and water separator", "ECU codes and fuel-solenoid operation", "Jacket-water heater working"],
    },
  },
  {
    id: "overload",
    title: { he: "עומס-יתר", en: "Overload" },
    code: "W-12",
    level: "warn",
    alarm: "kW OVERLOAD WARNING",
    context: { he: "במהלך הפסקת חשמל מערכות מיזוג נוספות הופעלו. ההספק עלה מעל הדירוג.", en: "During an outage extra air-conditioning was switched on. Power rose above rating." },
    readings: { ...run, kw: 345, pct: 115, hz: 49.3, v: 392, h2o: 92 },
    meaning: {
      options: [
        { he: "העומס גבוה מהדירוג — אם לא יופחת, ההגנה תנתק", en: "Load exceeds rating — if not reduced, protection will trip" },
        { he: "תקלה במצבר", en: "Battery fault" },
        { he: "מצב רגיל בגנרטור STANDBY", en: "Normal for a STANDBY set" },
      ],
      correct: 0,
      explain: { he: "ירידת התדר והמתח מעידה שהמנוע מתקשה להחזיק את העומס.", en: "Dipping frequency and voltage show the engine struggling to hold the load." },
    },
    categories: {
      options: [
        { he: "עומסים לא-חיוניים מחוברים לגנרטור", en: "Non-essential loads connected to the generator" },
        { he: "פריקת עומסים לא פועלת / לא מוגדרת", en: "Load shedding not working / not configured" },
        { he: "הערכת עומס בתכנון נמוכה מדי", en: "Design load estimate too low" },
        { he: "לחץ שמן נמוך", en: "Low oil pressure" },
      ],
      correct: [0, 1, 2],
      explain: { he: "לחץ השמן אינו סיבה לעומס-יתר.", en: "Oil pressure doesn't cause overload." },
    },
    priority: {
      options: [
        { he: "להעלות את סף ההגנה", en: "Raise the protection threshold" },
        { he: "להפחית עומסים לא-חיוניים לפי נוהל המתקן ולעקוב אחר הפרמטרים", en: "Shed non-essential loads per site procedure and monitor parameters" },
        { he: "לא לעשות דבר — ההגנה תטפל", en: "Do nothing — protection will handle it" },
      ],
      correct: 1,
      explain: { he: "הפחתת עומס יזומה שומרת את העומסים הקריטיים מוזנים — במקום ניתוק כולל.", en: "Deliberate load reduction keeps critical loads supplied — instead of a total trip." },
    },
    verify: {
      he: ["רשימת העומסים בזמן האירוע", "הגדרות ותפקוד פריקת העומסים", "בחינה הנדסית של חישוב הביקוש והדירוג"],
      en: ["Loads connected during the event", "Load-shedding settings and operation", "Engineering review of demand calculation and rating"],
    },
  },
  {
    id: "avr",
    title: { he: "תקלת ויסות מתח", en: "Voltage regulation malfunction" },
    code: "SD-09",
    level: "shutdown",
    alarm: "GENERATOR OVER VOLTAGE",
    context: { he: "דקות ספורות לאחר ההתנעה המתח טיפס ותנודד, והבקר כיבה את הגנרטור.", en: "Minutes after starting, voltage climbed and oscillated, and the controller shut the set down." },
    readings: { ...stop, h2o: 66 },
    meaning: {
      options: [
        { he: "המתח חרג מהסף העליון — הגנה על הצרכנים מפני מתח-יתר", en: "Voltage exceeded the upper limit — protecting loads from overvoltage" },
        { he: "המנוע התחמם", en: "The engine overheated" },
        { he: "חסר דלק", en: "Out of fuel" },
      ],
      correct: 0,
      explain: { he: "מתח-יתר עלול להרוס ציוד אלקטרוני ומנועים — ההגנה מגינה על המתקן.", en: "Overvoltage can destroy electronics and motors — the protection safeguards the installation." },
    },
    categories: {
      options: [
        { he: "תקלה ב-AVR", en: "AVR fault" },
        { he: "חיווט חישת מתח (Sensing) פגום", en: "Faulty voltage-sensing wiring" },
        { he: "תנודות מהירות מנוע (Governor)", en: "Engine speed hunting (governor)" },
        { he: "מסנן אוויר סתום", en: "Clogged air filter" },
      ],
      correct: [0, 1, 2],
      explain: { he: "מסנן אוויר משפיע על הספק המנוע, לא ישירות על ויסות המתח.", en: "An air filter affects engine power, not voltage regulation directly." },
    },
    priority: {
      options: [
        { he: "להעביר לטכנאי חשמל מוסמך לבדיקה בציוד מבודד, בלי להתחבר לעומסים", en: "Refer to a qualified electrical technician to check with equipment isolated, without connecting loads" },
        { he: "לכוון את ה-AVR בזמן ריצה כדי ״לראות מה קורה״", en: "Adjust the AVR while running to 'see what happens'" },
        { he: "להתניע ולחבר עומסים כדי לייצב את המתח", en: "Start and connect loads to stabilise voltage" },
      ],
      correct: 0,
      explain: { he: "כיוון בציוד פועל נעשה רק ע״י מוסמך לפי נוהל — ולא כניסוי. אסור לחבר עומסים לגנרטור עם מתח לא יציב.", en: "Adjustment on running equipment only by a qualified person per procedure — never as an experiment. Never connect loads to an unstable supply." },
    },
    verify: {
      he: ["חיבורי החישה ונתיכי ה-AVR (בציוד מבודד)", "יציבות מהירות המנוע", "מיישר מסתובב ועירור", "יומן אירועים — מתי בדיוק החלה החריגה"],
      en: ["AVR sensing connections and fuses (isolated)", "Engine speed stability", "Rotating rectifier and excitation", "Event log — exactly when the deviation began"],
    },
  },
  {
    id: "cooling",
    title: { he: "תקלת מערכת קירור — מפלס נמוך", en: "Cooling system fault — low level" },
    code: "SD-03",
    level: "shutdown",
    alarm: "LOW COOLANT LEVEL",
    context: { he: "נמצאה שלולית ירקרקה מתחת לרדיאטור. הגנרטור כבה זמן קצר לאחר ההתנעה.", en: "A greenish puddle was found under the radiator. The set shut down shortly after starting." },
    readings: { ...stop, h2o: 71 },
    meaning: {
      options: [
        { he: "מפלס נוזל הקירור נמוך — סכנת התחממות מהירה", en: "Coolant level is low — risk of rapid overheating" },
        { he: "דלק בשלולית", en: "Fuel in the puddle" },
        { he: "התראת תחזוקה רגילה", en: "Routine service reminder" },
      ],
      correct: 0,
      explain: { he: "השלולית מצביעה על דליפה. מנוע ללא קירור מספיק ייפגע תוך זמן קצר.", en: "The puddle indicates a leak. An engine without sufficient coolant is damaged quickly." },
    },
    categories: {
      options: [
        { he: "צינור / חבק רופף או סדוק", en: "Loose or cracked hose / clamp" },
        { he: "דליפה בליבת הרדיאטור", en: "Radiator core leak" },
        { he: "אטם משאבת מים", en: "Water pump seal" },
        { he: "תקלה ב-ATS", en: "ATS fault" },
      ],
      correct: [0, 1, 2],
      explain: { he: "ה-ATS אינו קשור למערכת הקירור.", en: "The ATS is unrelated to the cooling system." },
    },
    priority: {
      options: [
        { he: "למלא מים מהברז ולהתניע", en: "Top up with tap water and restart" },
        { he: "למנוע התנעה, לטפל בשפך בבטחה (נוזל רעיל), ולאתר את מקור הדליפה במנוע קר", en: "Prevent restart, handle the spill safely (toxic fluid), and locate the leak with the engine cold" },
        { he: "לנגב ולחכות", en: "Wipe up and wait" },
      ],
      correct: 1,
      explain: { he: "יש לטפל קודם בבטיחות ובסיבה; מילוי בנוזל לא מתאים פוגע בהגנת קורוזיה וקיפאון.", en: "Address safety and cause first; the wrong fluid compromises corrosion and freeze protection." },
    },
    verify: {
      he: ["מקור הדליפה וחבקים", "סוג וריכוז נוזל הקירור לפי היצרן", "חיישן מפלס"],
      en: ["Leak source and clamps", "Coolant type and concentration per manufacturer", "Level sensor"],
    },
  },
  {
    id: "estop",
    title: { he: "הפעלת עצירת חירום", en: "Emergency stop activation" },
    code: "SD-00",
    level: "shutdown",
    alarm: "EMERGENCY STOP",
    context: { he: "הגנרטור כבה פתאום. בבקר מופיעה התראת עצירת חירום. איש לא דיווח על לחיצה.", en: "The set stopped suddenly. The controller shows emergency stop. Nobody reported pressing it." },
    readings: { ...stop, h2o: 80 },
    meaning: {
      options: [
        { he: "מעגל עצירת החירום נפתח — לחיצה על לחצן או תקלה במעגל", en: "The emergency-stop circuit opened — a button press or a circuit fault" },
        { he: "לחץ שמן נמוך", en: "Low oil pressure" },
        { he: "ניתוק רשת", en: "Utility trip" },
      ],
      correct: 0,
      explain: { he: "מעגל E-STOP בנוי ״בטוח בכשל״ — כבל מנותק נראה כמו לחיצה.", en: "E-STOP circuits are fail-safe — a broken wire looks like a press." },
    },
    categories: {
      options: [
        { he: "מישהו לחץ על לחצן (מקומי / חיצוני) בגלל סכנה", en: "Someone pressed a button (local / remote) due to a hazard" },
        { he: "לחיצה בטעות", en: "Accidental press" },
        { he: "חיווט מעגל פגום", en: "Damaged circuit wiring" },
        { he: "טמפרטורת נוזל קירור", en: "Coolant temperature" },
      ],
      correct: [0, 1, 2],
      explain: { he: "קודם כול יש להניח שמישהו זיהה סכנה.", en: "First assume someone saw a hazard." },
    },
    priority: {
      options: [
        { he: "לשחרר מיד את הלחצן ולאפס", en: "Release the button and reset immediately" },
        { he: "לברר למה נלחץ ולוודא שאין סכנה (אש, פגיעה, דליפה) לפני כל איפוס", en: "Find out why it was pressed and confirm there is no hazard (fire, injury, leak) before any reset" },
        { he: "לגשר את המעגל", en: "Bridge the circuit" },
      ],
      correct: 1,
      explain: { he: "E-STOP הוא סימן שאולי יש סכנה. מאפסים רק לאחר שהסיבה ידועה והאזור בטוח.", en: "An E-STOP may signal a hazard. Reset only once the reason is known and the area is safe." },
    },
    verify: {
      he: ["סיור בטיחות בחדר ובסביבה", "איזה לחצן הופעל (יומן אירועים)", "שלמות המעגל — ע״י מוסמך"],
      en: ["Safety walk-round of room and surroundings", "Which button operated (event log)", "Circuit integrity — by a qualified person"],
    },
  },
  {
    id: "fuel",
    title: { he: "התראת אספקת דלק", en: "Fuel supply alarm" },
    code: "W-04",
    level: "warn",
    alarm: "LOW FUEL LEVEL",
    context: { he: "הפסקת חשמל ממושכת. מפלס המיכל היומי יורד ומשאבת המילוי מהמיכל הראשי לא מגיבה.", en: "A prolonged outage. The day-tank level is falling and the transfer pump from the main tank doesn't respond." },
    readings: { ...run, fuel: 14 },
    meaning: {
      options: [
        { he: "הדלק במיכל היומי עומד להיגמר — הגנרטור ייעצר בקרוב", en: "The day tank is running low — the set will stop soon" },
        { he: "איכות הדלק ירודה", en: "Fuel quality is poor" },
        { he: "עומס-יתר", en: "Overload" },
      ],
      correct: 0,
      explain: { he: "זו התראה מוקדמת שמאפשרת לפעול לפני כיבוי.", en: "An early warning allowing action before shutdown." },
    },
    categories: {
      options: [
        { he: "תקלה במשאבת המילוי או בהזנתה", en: "Transfer pump or its supply fault" },
        { he: "מיכל ראשי ריק / שסתום סגור", en: "Main tank empty / valve closed" },
        { he: "מצוף / חיישן מפלס תקול", en: "Faulty float / level sensor" },
        { he: "AVR", en: "AVR" },
      ],
      correct: [0, 1, 2],
      explain: { he: "ה-AVR אינו קשור להזנת הדלק.", en: "The AVR is unrelated to fuel supply." },
    },
    priority: {
      options: [
        { he: "להפעיל את תוכנית החירום לאספקת דלק ולהזעיק מוסמך לטיפול במשאבה, תוך תכנון הפחתת עומס", en: "Activate the fuel contingency plan and call a qualified person for the pump, while planning load reduction" },
        { he: "למלא ידנית מג׳ריקן כשהגנרטור פועל ליד הפליטה", en: "Hand-fill from a jerry can next to the hot exhaust while running" },
        { he: "להתעלם עד הכיבוי", en: "Ignore until shutdown" },
      ],
      correct: 0,
      explain: { he: "מילוי מאולתר ליד משטחים חמים — סכנת שריפה. נדרשת תוכנית אספקה מסודרת.", en: "Improvised refuelling near hot surfaces — fire risk. A planned supply procedure is required." },
    },
    verify: {
      he: ["מצב שסתומים ומיכל ראשי", "הזנה ובקרה של משאבת המילוי", "חיישני מפלס והתראות", "חוזה / נוהל אספקת דלק בחירום"],
      en: ["Valve positions and main tank", "Transfer-pump supply and control", "Level sensors and alarms", "Emergency fuel-supply contract / procedure"],
    },
  },
  {
    id: "cb",
    title: { he: "ניתוק מפסק הגנרטור", en: "Generator circuit breaker trip" },
    code: "T-02",
    level: "trip",
    alarm: "GEN CB TRIPPED — SHORT CIRCUIT",
    context: { he: "בזמן הזנה לעומסים נשמע רעש חזק בלוח המשנה והמפסק הראשי של הגנרטור ניתק מיידית.", en: "While supplying loads a loud bang came from a sub-board and the generator main breaker tripped instantly." },
    readings: { ...run, kw: 0, pct: 0, h2o: 82 },
    meaning: {
      options: [
        { he: "הגנת הקצר ניתקה — ככל הנראה תקלה במורד", en: "Short-circuit protection tripped — likely a downstream fault" },
        { he: "עומס-יתר קל", en: "Mild overload" },
        { he: "תקלת מנוע", en: "Engine fault" },
      ],
      correct: 0,
      explain: { he: "ניתוק מיידי עם רעש חזק מצביע על קצר / קשת חשמלית.", en: "An instant trip with a loud bang indicates a short circuit / arc." },
    },
    categories: {
      options: [
        { he: "קצר בכבל או בלוח המשנה", en: "Short in a cable or sub-board" },
        { he: "תקלה לאדמה", en: "Earth fault" },
        { he: "חוסר סלקטיביות — המפסק במעלה ניתק במקום המקומי", en: "Lack of selectivity — the upstream breaker tripped instead of the local one" },
        { he: "מסנן דלק", en: "Fuel filter" },
      ],
      correct: [0, 1, 2],
      explain: { he: "ניתוק המפסק הראשי ולא המקומי מרמז גם על בעיית תיאום הגנות.", en: "The main rather than local breaker tripping also hints at a coordination issue." },
    },
    priority: {
      options: [
        { he: "לחבר שוב את המפסק כדי להחזיר מתח מהר", en: "Re-close the breaker to restore power quickly" },
        { he: "לא לחבר; להרחיק אנשים מהלוח הפגוע; לבודד ולאתר את התקלה ע״י מוסמך", en: "Do not re-close; keep people away from the damaged board; isolate and locate the fault by a qualified person" },
        { he: "לפתוח את דלת הלוח ולהסתכל מקרוב", en: "Open the board door and look closely" },
      ],
      correct: 1,
      explain: { he: "חיבור על קצר קיים עלול ליצור קשת חשמלית מסוכנת. פתיחת לוח פגוע מחייבת הליך ובידוד.", en: "Closing onto an existing short can create a dangerous arc flash. Opening a damaged board requires procedure and isolation." },
    },
    verify: {
      he: ["אילו הגנות פעלו (יחידת ההגנה, יומן אירועים)", "בדיקת בידוד של המעגל הפגוע (מבודד)", "סקירת תיאום הגנות לגנרטור"],
      en: ["Which protections operated (trip unit, event log)", "Insulation testing of the faulted circuit (isolated)", "Review of protection coordination on generator supply"],
    },
  },
];
