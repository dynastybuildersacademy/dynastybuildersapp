// ============================================================
//  Dynasty Builders Academy — auth.js  v2.1
//  Single source of truth: TEAM, ROLES, AGENTS, session mgmt
//  Load via <script src="auth.js"></script> on every page
//  All exports are global (no module syntax for Netlify compat)
// ============================================================

// ── 1. BRAND & CONFIG ─────────────────────────────────────────
const TEAM = {
  name:    "Dynasty Builders Academy",
  brand:   "DBA",
  website: "https://agent.dynastybuildersapp.com",
  tagline: "Making Dreams Come True, One Policy at a Time",
  phone:   "310-995-6507",
  email:   "info@dynastybuildersapp.com",
  colors:  { primary: "#0A1628", accent: "#C9A84C" },
  monday: {
    boardRecruits:   "18409897469",  // Recruiting Pipeline — prospects considering the business
    boardEvents:     "18411962317",  // Events — BOM registrations, Zoom webinars
    boardCallLog:    "18411252612",  // Call Production Log — tracker session saves
    boardBOMGuests:  "18393747809",  // BOM Guests
    boardBOMAttend:  "",               // BOM Attendance — created by bom.html on first save (auto-creates)
    boardPolicies:   "18397757902",  // Policy Applications — submitted → pending → approved → inforce
    boardLightsOut:  "18415179731",  // PHP Lights Out 2026 contest
    boardTop25:      "18216458584",  // Top 25 prospect management
    boardSurveys:    "18415701893",  // Financial Surveys — static, admin-created
    boardAgents:     "18411252280"   // Agent Roster — DBA agent records, synced from agents.html
  },
  makeOrgId:  "7534787",
  makeRegion: "us2"
};

// ── 2. ROLES (PHP Agency Official 16-Level Structure) ─────────
// Source: PHP Agency Core Foundation #1 — System (©PHP Agency 2023)
// Levels 1–4 are the primary DBA focus. Levels 5–16 are senior leadership.
const ROLES = {
  // ── DBA Active Levels ──────────────────────────────────────
  trainee:            { label: "Trainee",                       phpLevel: 1,  level: 10,  osAccess: false, color: "#6B7C93", comm: "30%",       commBonus: null    },
  associate:          { label: "Associate",                     phpLevel: 2,  level: 20,  osAccess: false, color: "#BB8FCE", comm: "40%",       commBonus: null    },
  field_associate:    { label: "Field Associate",               phpLevel: 3,  level: 30,  osAccess: false, color: "#5DADE2", comm: "50%",       commBonus: null    },
  director:           { label: "Director",                      phpLevel: 4,  level: 40,  osAccess: false, color: "#27AE60", comm: "60%",       commBonus: null    },
  producing_md:       { label: "Producing Marketing Director",  phpLevel: 5,  level: 50,  osAccess: false, color: "#E8C97A", comm: "70%",       commBonus: "120%"  },
  marketing_director: { label: "Marketing Director",            phpLevel: 6,  level: 60,  osAccess: true,  color: "#C9A84C", comm: "75%",       commBonus: "120%"  },
  senior_md:          { label: "Senior Marketing Director",     phpLevel: 7,  level: 65,  osAccess: true,  color: "#C9A84C", comm: "77%",       commBonus: "122%"  },
  executive_md:       { label: "Executive Marketing Director",  phpLevel: 8,  level: 70,  osAccess: true,  color: "#C9A84C", comm: "78%",       commBonus: "123%"  },
  // ── Senior Leadership ──────────────────────────────────────
  svp:                { label: "Senior Vice-President",         phpLevel: 9,  level: 75,  osAccess: true,  color: "#C9A84C", comm: "79%",       commBonus: "124%"  },
  evp:                { label: "Executive Vice-President",      phpLevel: 10, level: 80,  osAccess: true,  color: "#C9A84C", comm: "80%",       commBonus: "125%"  },
  presidents_council: { label: "President's Council",           phpLevel: 11, level: 82,  osAccess: true,  color: "#C9A84C", comm: "81%",       commBonus: "126%"  },
  chairmans_council:  { label: "Chairman's Council",            phpLevel: 12, level: 84,  osAccess: true,  color: "#C9A84C", comm: "82%",       commBonus: "127%"  },
  board_council:      { label: "Board Council",                 phpLevel: 13, level: 86,  osAccess: true,  color: "#C9A84C", comm: "82.5%",     commBonus: "127.5%"},
  senior_board_council:{ label: "Senior Board Council",         phpLevel: 14, level: 88,  osAccess: true,  color: "#C9A84C", comm: "83%",       commBonus: "128%"  },
  exec_board_council: { label: "Executive Board Council",       phpLevel: 15, level: 90,  osAccess: true,  color: "#C9A84C", comm: "83.5%",     commBonus: "128.5%"},
  senior_exec_board:  { label: "Sr. Executive Board Council",   phpLevel: 16, level: 92,  osAccess: true,  color: "#C9A84C", comm: "84%",       commBonus: "129%"  },
  // ── Admin/Agency Builder (internal DBA) ────────────────────
  licensing_coach:    { label: "Licensing Coach",               phpLevel: 8,  level: 95,  osAccess: true,  color: "#2DCA73", comm: "—",          commBonus: "—"     },
  agency_builder:     { label: "Agency Builder",                phpLevel: 8,  level: 95,  osAccess: true,  color: "#C9A84C", comm: "78%+",      commBonus: "123%+" },
  super_admin:        { label: "Super Admin",                    phpLevel: 99, level: 999, osAccess: true,  color: "#E8C97A", comm: "—",          commBonus: "—"     },
  admin:              { label: "Admin",                         phpLevel: 8,  level: 100, osAccess: true,  color: "#C9A84C", comm: "78%+",      commBonus: "123%+" },
  guest:              { label: "Guest",                         phpLevel: 0,  level: 0,   osAccess: false, color: "#4A5568", comm: "—",         commBonus: null    }
};

const ROLE_ORDER = [
  'admin','agency_builder','super_admin',
  'senior_exec_board','exec_board_council','senior_board_council','board_council',
  'chairmans_council','presidents_council','evp','svp',
  'executive_md','senior_md','marketing_director','producing_md',
  'director','field_associate','associate','trainee','guest'
];

// ── PHP SYSTEM FLOW (official progression) ────────────────────
// Source: PHP Agency Core Foundation #1 System Flow diagram
const PHP_SYSTEM_FLOW = [
  {
    week: 'WEEK 1',
    stage: 'New Associate',
    milestone: 'Qualify for Fast Start School',
    color: '#C0392B',
    tasks: [
      'Meet Spouse/Partner',
      'Build Business Plan',
      'Build Top 25 List',
      '3 FTs & 3 Guests to BOM',
      'Complete Financial Analysis',
      'Attend Life Class',
      'Attend Big Event',
      'Earn Sprint Award'
    ]
  },
  {
    week: 'MONTH 1',
    stage: 'Graduate Fast Start School',
    milestone: 'Get a Promotion',
    color: '#C0392B',
    tasks: [
      'Get Life License',
      'Complete 10 FTs',
      '3++3 Associate',
      '10+10 Field Associate',
      '25+25 Director'
    ]
  },
  {
    week: 'MONTH 1 ON',
    stage: 'Qualify for President\'s Club',
    milestone: 'Become a Certified Trainer',
    color: '#C0392B',
    tasks: [
      '10 Rec (Average)',
      '25 Rec (Above Average)',
      '50 Rec (Competitor)',
      '100 Rec (Record Breaker)'
    ]
  },
  {
    week: 'MONTH 3–6',
    stage: 'Develop Direct FAs',
    milestone: 'Get Coached to Become MD',
    color: '#C0392B',
    tasks: [
      '$50,000 Income+',
      '90 Day Run to MD',
      'Graduate PHP University'
    ]
  },
  {
    week: 'MONTH 6–12',
    stage: 'Marketing Director Promotion',
    milestone: 'Develop Other MDs',
    color: '#C0392B',
    tasks: [
      '3 Direct FAs',
      '15 Licensed Agents',
      '50 Rec & 100K Points in 90 Days',
      'Coached by SVP to Become SVP'
    ]
  }
];

// ── PROMOTION REQUIREMENTS (official PHP guidelines) ──────────
const PHP_PROMO_REQS = {
  trainee: {
    next: 'Associate',
    nextRole: 'associate',
    timeframe: 'Month 1',
    personal: { recruits: 3, apps: 3, points: 3000 },
    team: null,
    notes: 'Graduate Fast Start School'
  },
  associate: {
    next: 'Field Associate',
    nextRole: 'field_associate',
    timeframe: 'Month 1–3',
    personal: { recruits: 10, apps: 10, points: 10000 },
    team: null,
    notes: 'Qualify for President\'s Club'
  },
  field_associate: {
    next: 'Director',
    nextRole: 'director',
    timeframe: 'Month 3–6',
    personal: { recruits: 25, apps: 0, points: 0 },
    team: null,
    notes: 'Develop Direct FAs; get coached to become MD'
  },
  director: {
    next: 'Producing Marketing Director',
    nextRole: 'producing_md',
    timeframe: 'Month 6–12',
    personal: { recruits: 3, apps: 0, points: 0 },
    team: { recruits: 15, points: 100000, notes: '3 Direct FAs, 15 licensed agents, 50 Rec & 100K pts in 90 days' },
    notes: '3 Direct FAs · 15 Licensed Agents · 50 Rec & 100K Points in 90 days'
  },
  producing_md: {
    next: 'Marketing Director',
    nextRole: 'marketing_director',
    timeframe: 'Month 6–12',
    personal: null,
    team: null,
    notes: 'Coached by SVP to become SVP. Develop Other MDs.'
  }
};

// ── 3. AGENTS ─────────────────────────────────────────────────
// ── ORG MONDAY API KEY ────────────────────────────────────────────────────────
// Standalone constant — accessible everywhere, even before AUTH object is ready
const MONDAY_ORG_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY1Nzg0OTc3NSwiYWFpIjoxMSwidWlkIjo2MTY2MDI5NCwiaWFkIjoiMjAyNi0wNS0xM1QwOTo0OTowNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM3NjI1MTMsInJnbiI6InVzZTEifQ.eCbOAEJTC3mcsit4IjVWOw3r2wyQBYL4lN5Qmnok0r0';
// ── AGENTS ROSTER ─────────────────────────────────────────────────────────────
// To assign an agent their personal Top 25 board:
//   1. Create their board in Monday.com (duplicate board 18419015866 as template)
//   2. Copy the board ID from the Monday.com URL (/boards/XXXXXXXXXX)
//   3. Add or update: top25BoardId: "XXXXXXXXXX" in their entry below
//   4. Deploy — the agent will load their board automatically on next login
//   Agents without a top25BoardId fall back to the default board (8270757684)
// Last synced from DBA Agent Roster (board 18411252280): 2026-08-18
// ─────────────────────────────────────────────────────────────────────────────
const AGENTS = [
  { id:"deigar526", phpId:"1417894", name:"Deisy Garcia", pin:"5261", role:"trainee", level:20, uplineId:"obi001", email:"deisygarcia1713@gmail.com", phone:"2133175067", enrollmentDate:"2026-06-27", adminTier:"admin" },
  { id:"obi001", phpId:"10146", name:"Obi Iroezi", pin:"1111", role:"senior_md", level:65, uplineId:"", email:"obi@yourdynastybuilder.com", phone:"3109956507", top25BoardId:"18419015866", licenseStates:["CA","TX"], enrollmentDate:"2022-01-01", adminTier:"super_user" },
  { id:"jen001", phpId:"", name:"Jen Iroezi", pin:"1111", role:"senior_md", level:65, uplineId:"obi001", email:"jen@yourdynastybuilder.com", phone:"3109956508", top25BoardId:"8052087599", licenseStates:["CA"], enrollmentDate:"2022-01-01" },
  { id:"mag001", phpId:"10200", name:"Magdalene Ibezim", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"8270052654", licenseStates:["TX"], enrollmentDate:"2022-06-01" },
  { id:"sha001", phpId:"10401", name:"Shantesa Archie", pin:"1111", role:"trainee", level:20, uplineId:"chi001", email:"", phone:"", licenseStates:["TX"], enrollmentDate:"2025-01-10" },
  { id:"dba000", phpId:"", name:"DBA Super Admin", pin:"1111", role:"super_admin", level:100, uplineId:"", email:"admin@yourdynastybuilder.com", phone:"", enrollmentDate:"2022-01-01" },
  { id:"bli001", phpId:"82854", name:"Blessing Ikejemba", pin:"1111", role:"executive_md", level:70, uplineId:"obi001", email:"", phone:"", enrollmentDate:"2024-01-01" },
  { id:"emo001", phpId:"", name:"Emeka Okereke", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", enrollmentDate:"2025-01-01" },
  { id:"alecas487", phpId:"", name:"Alex Castro", pin:"1111", role:"trainee", level:20, uplineId:"bli001", email:"alex@authorityfactory88.com", phone:"7142091524", licenseStates:["CA"], enrollmentDate:"2024-06-05" },
  { id:"joymoj126", phpId:"1412126", name:"Joy Mojokwu", pin:"1111", role:"trainee", level:20, uplineId:"", email:"mokogwuj@gmail.com", phone:"9096822392", enrollmentDate:"2026-06-07" },
  { id:"franwa448", phpId:"1412126", name:"Francis Nwadiba", pin:"1111", role:"trainee", level:20, uplineId:"ireibe452", email:"mokogwuj@gmail.com", phone:"9096822392", enrollmentDate:"2026-06-06" },
  { id:"virosi239", phpId:"1411448", name:"Virginia Osita", pin:"1111", role:"trainee", level:20, uplineId:"managu956", email:"meetfarco2020@gmail.com", phone:"4244452758", enrollmentDate:"2026-06-05" },
  { id:"marrod050", phpId:"1411050", name:"Marcela Rodriguez", pin:"1111", role:"trainee", level:20, uplineId:"", email:"marcyrodriguez808@gmail.com", phone:"3236749258", enrollmentDate:"2026-06-04" },
  { id:"jawsal547", phpId:"1411050", name:"Jawad Salaam", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"marcyrodriguez808@gmail.com", phone:"3236749258", enrollmentDate:"2026-05-31" },
  { id:"emmoke796", phpId:"1408547", name:"Emmanuel Okereke", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"jawadsalaam@hotmail.com", phone:"3108620454", top25BoardId:"18414813028", enrollmentDate:"2026-05-23" },
  { id:"judaka326", phpId:"1405796", name:"Jude Akalawu", pin:"1111", role:"trainee", level:20, uplineId:"godchu897", email:"michaelokereke002@gmail.com", phone:"3232372009", enrollmentDate:"2026-05-17" },
  { id:"fidorj220", phpId:"1404326", name:"Fidelis Orji", pin:"1111", role:"trainee", level:20, uplineId:"godchu897", email:"phpdynastybuilders@gmail.com", phone:"3104046508", top25BoardId:"18415187026", enrollmentDate:"2026-05-17" },
  { id:"managu956", phpId:"1404220", name:"Manuel Aguilar", pin:"1111", role:"field_associate", level:30, uplineId:"jacaba757", email:"orjifidelischinweike@gmail.com", phone:"4243812069", enrollmentDate:"2026-05-16" },
  { id:"babola634", phpId:"1403634", name:"Babatunde Olaide", pin:"1111", role:"trainee", level:20, uplineId:"", email:"olaa.may27@gmail.com", phone:"8184663998", enrollmentDate:"2026-05-16" },
  { id:"andwil788", phpId:"1403634", name:"Andrew Williams", pin:"1111", role:"trainee", level:20, uplineId:"godchu897", email:"olaa.may27@gmail.com", phone:"8184663998", enrollmentDate:"2026-05-13" },
  { id:"anglew957", phpId:"1402788", name:"Angela Lewis", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"andrewbwilliams41@gmail.com", phone:"5623596245", enrollmentDate:"2026-05-08" },
  { id:"mauony491", phpId:"1401957", name:"Maureen Onyia-Ekwuazi", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"poetry8638@gmail.com", phone:"3108660176", enrollmentDate:"2026-05-05" },
  { id:"ireibe452", phpId:"1401491", name:"Irene Ibekwe", pin:"1111", role:"trainee", level:20, uplineId:"danjho261", email:"monicaonyia23@gmail.com", phone:"4243474306", enrollmentDate:"2026-05-05" },
  { id:"danjho261", phpId:"1401452", name:"Daniella Jhonson", pin:"1111", role:"associate", level:20, uplineId:"", email:"ireneibekwe1616@yahoo.com", phone:"8322891880", top25BoardId:"18411670330", enrollmentDate:"2026-05-02" },
  { id:"conchu516", phpId:"1401261", name:"Conleth Chukwu", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"jhonsonscorporategroup@gmail.com", phone:"4242534292", top25BoardId:"18412529902", enrollmentDate:"2026-05-01" },
  { id:"reguri510", phpId:"1400516", name:"Regina Urigwe", pin:"1111", role:"trainee", level:20, uplineId:"godchu897", email:"marymadona74@gmail.com", phone:"3234036017", enrollmentDate:"2026-05-01" },
  { id:"liluzo343", phpId:"1400510", name:"Lilly Uzondu-Umeojiako", pin:"1111", role:"trainee", level:20, uplineId:"godchu897", email:"reginaurigwe@gmail.com", phone:"4042711895", enrollmentDate:"2026-04-10" },
  { id:"godchu897", phpId:"1397343", name:"Godis Chukwukere", pin:"1111", role:"associate", level:20, uplineId:"jacaba757", email:"ifylili12@gmail.com", phone:"3235348102", enrollmentDate:"2026-04-01" },
  { id:"joytor331", phpId:"1395897", name:"Joy Toritseju", pin:"1111", role:"trainee", level:20, uplineId:"goonwa076", email:"godischukwukere@engineer.com", phone:"3018757073", enrollmentDate:"2026-03-31" },
  { id:"miabow031", phpId:"1395331", name:"Mia Bowie", pin:"1111", role:"trainee", level:20, uplineId:"goonwa076", email:"joytoritseju2005@gmail.com", phone:"4422493723", enrollmentDate:"2026-03-23" },
  { id:"matbec358", phpId:"1394031", name:"Matthew Beck", pin:"1111", role:"trainee", level:20, uplineId:"mohahm9866", email:"ms.bg303@gmail.com", phone:"7202897247", enrollmentDate:"2026-03-10" },
  { id:"winmum345", phpId:"1391358", name:"Winny Mumbarhi", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"matt@mattaffiliate.com", phone:"9167928875", enrollmentDate:"2026-03-10" },
  { id:"josker926", phpId:"1391345", name:"Josephine Kerian", pin:"1111", role:"trainee", level:20, uplineId:"herbet122", email:"mumbarhiwinny@gmail.com", phone:"7205885175", enrollmentDate:"2026-03-08" },
  { id:"elinwo056", phpId:"1390926", name:"Elie Nwokorie", pin:"1111", role:"trainee", level:20, uplineId:"geonwa339", email:"josephinekerian@gmail.com", phone:"2407580235", enrollmentDate:"2026-02-15" },
  { id:"chinwo043", phpId:"1385056", name:"Chidinma Nwokorie", pin:"1111", role:"trainee", level:20, uplineId:"", email:"elieolu14@gmail.com", phone:"3108083201", enrollmentDate:"2026-02-15" },
  { id:"ijeokp039", phpId:"1385043", name:"Ijeoma Okpara", pin:"1111", role:"trainee", level:20, uplineId:"", email:"andienwokorie@gmail.com", phone:"3108192771", enrollmentDate:"2026-02-15" },
  { id:"keleke297", phpId:"1385039", name:"Kelechi Ekeanyanwu", pin:"1111", role:"trainee", level:20, uplineId:"", email:"ijokpara@hotmail.com", phone:"3232829986", enrollmentDate:"2026-02-05" },
  { id:"aimeig458", phpId:"1381297", name:"Aimanose Eigbedion", pin:"1111", role:"trainee", level:20, uplineId:"bleeke611", email:"kelechi_21@yahoo.com", phone:"7204486194", enrollmentDate:"2026-02-01" },
  { id:"yalshe002", phpId:"1380458", name:"Yaleca Shelby", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"eigbediona@gmail.com", phone:"5736474228", enrollmentDate:"2026-02-01" },
  { id:"teamik798", phpId:"1380002", name:"Tea Mikadze", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"tymeless14@gmail.com", phone:"7202121053", top25BoardId:"18412529902", enrollmentDate:"2026-01-31" },
  { id:"torsha095", phpId:"1379798", name:"Tornike Shalikashvili", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"teamikadze76@gmail.com", phone:"2137715590", top25BoardId:"18411670429", enrollmentDate:"2026-01-29" },
  { id:"teajoh786", phpId:"1379095", name:"Teairra Johnson", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"tornikeshalikashvili91@gmail.com", phone:"7169943753", enrollmentDate:"2026-01-17" },
  { id:"ninpac400", phpId:"1377786", name:"Nino Pachulia", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"n.pachulia@yahoo.com", phone:"9084337138", top25BoardId:"18411670429", enrollmentDate:"2026-01-10" },
  { id:"tortsa743", phpId:"1374743", name:"Tornike Tsagareishvili", pin:"1111", role:"field_associate", level:30, uplineId:"jacaba757", email:"tsagarat010@gmail.com", phone:"3109935746", top25BoardId:"18394078194", enrollmentDate:"2025-12-31" },
  { id:"uzoama613", phpId:"1374613", name:"Uzoma Amaefula", pin:"1111", role:"trainee", level:20, uplineId:"emmnwo473", email:"uzobeeke@yahoo.com", phone:"9517503727", top25BoardId:"18400160335", enrollmentDate:"2025-12-31" },
  { id:"chimgb387", phpId:"1374387", name:"Chimezie Mgbobile", pin:"1111", role:"trainee", level:20, uplineId:"emmnwo473", email:"brightstonex@gmail.com", phone:"5014787215", enrollmentDate:"2025-12-30" },
  { id:"abetil877", phpId:"1373877", name:"Abebe Tilahuun", pin:"1111", role:"trainee", level:20, uplineId:"mieasr9984", email:"abexcool@gmail.com", phone:"7202263559", enrollmentDate:"2025-12-24" },
  { id:"kenxiv533", phpId:"1373533", name:"Kennedy Xivir", pin:"1111", role:"trainee", level:20, uplineId:"ramash421", email:"xivirkennedy170@gmail.com", phone:"3232523415", enrollmentDate:"2025-12-20" },
  { id:"apryou832", phpId:"1371832", name:"April Young", pin:"1111", role:"trainee", level:20, uplineId:"onoedo636", email:"aprilyoung123@yahoo.com", phone:"3106219145", top25BoardId:"18400160335", enrollmentDate:"2025-12-06" },
  { id:"dawmen649", phpId:"1370649", name:"Dawit Mengisteab", pin:"1111", role:"trainee", level:20, uplineId:"mohahm9866", email:"dmengisteab757@gmail.com", phone:"7203277241", top25BoardId:"18216452519", enrollmentDate:"2025-11-30" },
  { id:"bolbal574", phpId:"1369574", name:"Bolanle Balogun", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"bolajioye@yahoo.com", phone:"9256588420", enrollmentDate:"2025-11-20" },
  { id:"melpad946", phpId:"1368946", name:"Melissa Padilla", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"meli891026@gmail.com", phone:"6268402591", enrollmentDate:"2025-11-15" },
  { id:"arimuh040", phpId:"1366040", name:"Arif Muhammad", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"arif.shakir51@gmail.com", phone:"3235341358", enrollmentDate:"2025-10-29" },
  { id:"marleo994", phpId:"1364994", name:"Mark Ponce De Leon", pin:"1111", role:"associate", level:20, uplineId:"obi001", email:"markjpdl@hotmail.com", phone:"5623505181", enrollmentDate:"2025-10-17" },
  { id:"steben289", phpId:"1364289", name:"Stephan Bennett", pin:"1111", role:"trainee", level:20, uplineId:"", email:"insurewithbennett@gmail.com", phone:"4065798030", top25BoardId:"18410267607", enrollmentDate:"2025-10-16" },
  { id:"titikh526", phpId:"1363526", name:"Titilope Ikhile", pin:"1111", role:"associate", level:20, uplineId:"obi001", email:"titilope@gmail.com", phone:"9252340575", top25BoardId:"18417763345", enrollmentDate:"2025-10-12" },
  { id:"jahsta022", phpId:"1362022", name:"Jahnel Stamp", pin:"1111", role:"trainee", level:20, uplineId:"onoedo636", email:"jahnel3059@gmail.com", phone:"6123666259", top25BoardId:"18410267607", enrollmentDate:"2025-10-01" },
  { id:"emeuba208", phpId:"1361208", name:"Emeka Ubachunwa", pin:"1111", role:"trainee", level:20, uplineId:"cosaba718", email:"mekss2001@yahoo.com", phone:"4245673571", top25BoardId:"10003269761", enrollmentDate:"2025-10-01" },
  { id:"oumtin108", phpId:"1360108", name:"Oumar Tine", pin:"1111", role:"trainee", level:20, uplineId:"onoedo636", email:"tineoumar61@gmail.com", phone:"3233290367", enrollmentDate:"2025-09-24" },
  { id:"chrgod663", phpId:"1359663", name:"Christal Godfrey", pin:"1111", role:"trainee", level:20, uplineId:"onoedo636", email:"godfreychristal977@gmail.com", phone:"3239796096", enrollmentDate:"2025-09-20" },
  { id:"sopgon304", phpId:"1357304", name:"Sophia Gonzalez", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"sophiegg101@gmail.com", phone:"8182569669", enrollmentDate:"2025-09-12" },
  { id:"nenuko241", phpId:"1357241", name:"Nene Uko", pin:"1111", role:"field_associate", level:30, uplineId:"goonwa076", email:"neneukocoach@gmail.com", phone:"3102201299", enrollmentDate:"2025-09-11" },
  { id:"ranbro949", phpId:"1356949", name:"Randall Brownfield", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"mmarandall84@gmail.com", phone:"7605243708", enrollmentDate:"2025-09-10" },
  { id:"aslfer937", phpId:"1355937", name:"Asley Fernandes", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"asleyferns@gmail.com", phone:"8322937321", enrollmentDate:"2025-09-05" },
  { id:"steudo121", phpId:"1355121", name:"Stella Udoh", pin:"1111", role:"associate", level:20, uplineId:"jacaba757", email:"perfection4stella@gmail.com", phone:"4244503394", top25BoardId:"18426825795", enrollmentDate:"2025-09-01" },
  { id:"fraaba441", phpId:"1354441", name:"Francis Abanobi", pin:"1111", role:"trainee", level:20, uplineId:"cosaba718", email:"francisabanobi11@gmail.com", phone:"5627374966", enrollmentDate:"2025-08-31" },
  { id:"esooro893", phpId:"1353893", name:"Esohe Oronsaye", pin:"1111", role:"trainee", level:20, uplineId:"taioje599", email:"taiyeojeikere@aol.com", phone:"9516409080", enrollmentDate:"2025-08-29" },
  { id:"katsal890", phpId:"1353890", name:"Kate Salami", pin:"1111", role:"trainee", level:20, uplineId:"taioje599", email:"taiyeojeikere@gmail.ccom", phone:"9516624678", enrollmentDate:"2025-08-29" },
  { id:"jacaba757", phpId:"1353757", name:"Jacinta Abanobi", pin:"1111", role:"director", level:40, uplineId:"cosaba718", email:"zaramekpere048@gmail.com", phone:"5625896701", enrollmentDate:"2025-08-29" },
  { id:"cosaba718", phpId:"1353718", name:"Cosmas Abanobi", pin:"1111", role:"director", level:40, uplineId:"goonwa076", email:"cosmasabanobi046@gmail.com", phone:"5622664286", top25BoardId:"9933217087", enrollmentDate:"2025-08-28" },
  { id:"flonwa701", phpId:"1353701", name:"Florence Nwana", pin:"1111", role:"trainee", level:20, uplineId:"glookh486", email:"florencenwana@yahoo.com", phone:"5622159121", top25BoardId:"8994331783", enrollmentDate:"2025-08-28" },
  { id:"taomor024", phpId:"1353024", name:"Taofikat Morakinyo", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"morakinyot1@gmail.com", phone:"9739543140", enrollmentDate:"2025-08-23" },
  { id:"adosep242", phpId:"1352242", name:"Adorina Kouriel Seperghan", pin:"1111", role:"trainee", level:20, uplineId:"ramash421", email:"ado0at@yahoo.com", phone:"2092770768", enrollmentDate:"2025-08-19" },
  { id:"rongou178", phpId:"1352178", name:"Ronita Gouryal", pin:"1111", role:"trainee", level:20, uplineId:"ramash421", email:"rgouriyal@outlook.com", phone:"2095317594", enrollmentDate:"2025-08-18" },
  { id:"rymard750", phpId:"1351750", name:"Rymond Samonia Ardeshai", pin:"1111", role:"trainee", level:20, uplineId:"ramash421", email:"rymond.sa@gmail.com", phone:"8186973249", enrollmentDate:"2025-08-16" },
  { id:"tarpro557", phpId:"1348557", name:"Taryn Provinchain", pin:"1111", role:"trainee", level:20, uplineId:"chesim0407", email:"tarynnn13@gmail.com", phone:"4247506026", enrollmentDate:"2025-07-30" },
  { id:"olueji935", phpId:"1347935", name:"Oluchi Ejike", pin:"1111", role:"trainee", level:20, uplineId:"jusoko818", email:"ejike.oluchi@yahoo.co.uk", phone:"3233201750", enrollmentDate:"2025-07-25" },
  { id:"latcha805", phpId:"1347805", name:"Latiff Chagpar", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"lchagpar@gmail.com", phone:"7147469810", enrollmentDate:"2025-07-24" },
  { id:"feloju853", phpId:"1346853", name:"Felicia Ojukwu", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"chidiogo@yahoo.com", phone:"9092435197", enrollmentDate:"2025-07-17" },
  { id:"emmnwo473", phpId:"1346473", name:"Emmanuel Nwokeji", pin:"1111", role:"trainee", level:20, uplineId:"magibe8244", email:"necshagg@gmail.com", phone:"4244565689", enrollmentDate:"2025-07-16" },
  { id:"susuka198", phpId:"1344198", name:"Susan Ukaegbu", pin:"1111", role:"associate", level:20, uplineId:"goonwa076", email:"susan90247@gmail.com", phone:"3235930896", enrollmentDate:"2025-07-01" },
  { id:"prieme780", phpId:"1343780", name:"Princess Emeruwa", pin:"1111", role:"trainee", level:20, uplineId:"maroko654", email:"princessemeruwa219@gmail.com", phone:"3108485821", enrollmentDate:"2025-07-01" },
  { id:"lyndia091", phpId:"1343091", name:"Lynette Diarra", pin:"1111", role:"trainee", level:20, uplineId:"mohahm9866", email:"weareyoung2557@gmail.com", phone:"7206090928", enrollmentDate:"2025-06-26" },
  { id:"nafafs398", phpId:"1342398", name:"Nafiseh Afshari", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"afshar.na1988@gmail.com", phone:"7209341811", enrollmentDate:"2025-06-19" },
  { id:"vanvan673", phpId:"1341673", name:"Vander Vanzinetti", pin:"1111", role:"trainee", level:20, uplineId:"maroko654", email:"ayovander@gmail.com", phone:"9493101885", enrollmentDate:"2025-06-12" },
  { id:"nicmor638", phpId:"1340638", name:"Nicole Moreno", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"nicolemoren0@icloud.com", phone:"8189345411", enrollmentDate:"2025-06-04" },
  { id:"chieli576", phpId:"1340576", name:"Chidinma Elias-Ohuabunwa", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"chidinmaelias88@gmail.com", phone:"4089905057", enrollmentDate:"2025-06-03" },
  { id:"briabe536", phpId:"1340536", name:"Bright Abengowe", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"brightabengowe113@gmail.com", phone:"3235349745", enrollmentDate:"2025-06-03" },
  { id:"goonwa076", phpId:"1338076", name:"Goodluck Nwaka", pin:"1111", role:"director", level:40, uplineId:"magibe8244", email:"cnwaka043@gmail.com", phone:"3107069461", enrollmentDate:"2025-05-17" },
  { id:"edeash642", phpId:"1337642", name:"Edessa Ashourkarim", pin:"1111", role:"associate", level:20, uplineId:"ramash421", email:"edessab@gmail.com", phone:"8185719289", enrollmentDate:"2025-05-15" },
  { id:"marand462", phpId:"1337462", name:"Martin Andernians", pin:"1111", role:"trainee", level:20, uplineId:"ramash421", email:"martinandernians1983@gmail.com", phone:"7477451438", enrollmentDate:"2025-05-14" },
  { id:"radhar952", phpId:"1334952", name:"Radiant Harrison", pin:"1111", role:"trainee", level:20, uplineId:"edrhar102", email:"radiantharrison21@gmail.com", phone:"4044681348", enrollmentDate:"2025-05-01" },
  { id:"glookh486", phpId:"1334486", name:"Glory Okhilua", pin:"1111", role:"trainee", level:20, uplineId:"anteme387", email:"aronoglory@yahoo.com", phone:"3239845866", enrollmentDate:"2025-04-30" },
  { id:"govtak976", phpId:"1333976", name:"Govargiz Ebrahimi Dizaj Takyeh", pin:"1111", role:"trainee", level:20, uplineId:"ramash421", email:"givoebrahimi@yahoo.com", phone:"8184168314", enrollmentDate:"2025-04-28" },
  { id:"ramash421", phpId:"1332421", name:"Ramel Ashourkarim", pin:"1111", role:"field_associate", level:30, uplineId:"", email:"ramela87@yahoo.com", phone:"8182701275", enrollmentDate:"2025-04-16" },
  { id:"daismi741", phpId:"1331741", name:"DaiSean Smith", pin:"1111", role:"trainee", level:20, uplineId:"aribar814", email:"daiseansmith321@icloud.com", phone:"9514784268", top25BoardId:"9122818834", enrollmentDate:"2025-04-12" },
  { id:"abrram382", phpId:"1331382", name:"Abraham Ramos", pin:"1111", role:"trainee", level:20, uplineId:"aribar814", email:"ramosabraham889@gmail.com", phone:"3232291808", enrollmentDate:"2025-04-11" },
  { id:"anteme387", phpId:"1330387", name:"Anthonia Emechete", pin:"1111", role:"field_associate", level:30, uplineId:"", email:"ifyoki@yahoo.com", phone:"3103468485", enrollmentDate:"2025-04-02" },
  { id:"petlaa358", phpId:"1330358", name:"Peter Laabs", pin:"1111", role:"trainee", level:20, uplineId:"taymat304", email:"laabspeter2@gmail.com", phone:"6266580695", enrollmentDate:"2025-04-02" },
  { id:"mamdio324", phpId:"1330324", name:"Mamadou Diop", pin:"1111", role:"trainee", level:20, uplineId:"onoedo636", email:"mouhakara1996@gmail.com", phone:"6469837286", enrollmentDate:"2025-04-02" },
  { id:"maktas475", phpId:"1329475", name:"Makayla Tasker", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"tmakayla1030@gmail.com", phone:"3104806987", enrollmentDate:"2025-03-31" },
  { id:"taymat304", phpId:"1329304", name:"Taylonee Matthews", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"taylonee.matthews@icloud.com", phone:"2137169284", enrollmentDate:"2025-03-30" },
  { id:"aribar814", phpId:"1328814", name:"Ariel Barrera", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"arielbarrera903@gmail.com", phone:"3107402395", enrollmentDate:"2025-03-26" },
  { id:"desesp804", phpId:"1327804", name:"Destiny Espinoza", pin:"1111", role:"trainee", level:20, uplineId:"taioje599", email:"destiny.159793@icloud.com", phone:"9099775163", top25BoardId:"8325616671", enrollmentDate:"2025-03-20" },
  { id:"onyagb716", phpId:"1326716", name:"Onyinyechukwu Agbo", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"onyiagbo95@gmail.com", phone:"6267317090", enrollmentDate:"2025-03-15" },
  { id:"walbuc961", phpId:"1324961", name:"Walter Buchanan", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"wbuchanan.gr@gmail.com", phone:"6263943609", enrollmentDate:"2025-03-03" },
  { id:"chiikw857", phpId:"1323857", name:"Chigozie Ikwueze", pin:"1111", role:"trainee", level:20, uplineId:"amairu592", email:"chigozie_ikwueze011@yahoo.com", phone:"8176091115", enrollmentDate:"2025-03-01" },
  { id:"linrad767", phpId:"1318767", name:"Linda Guerra Rada", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"lindaguerrarada@gmail.com", phone:"6319921010", enrollmentDate:"2025-02-05" },
  { id:"shasca360", phpId:"1318360", name:"Shania Scarbrough", pin:"1111", role:"trainee", level:20, uplineId:"sarmor601", email:"shania383xx@gmail.com", phone:"4043874506", enrollmentDate:"2025-02-01" },
  { id:"onoedo636", phpId:"1316636", name:"Onochie Edozie", pin:"1111", role:"field_associate", level:30, uplineId:"maroko654", email:"onochiegeorge1@gmail.com", phone:"4244565890", enrollmentDate:"2025-01-24" },
  { id:"kemscu310", phpId:"1315310", name:"Kemar Sculley", pin:"1111", role:"trainee", level:20, uplineId:"tyrjam978", email:"kemarsculley@gmail.com", phone:"7177798236", top25BoardId:"8270851734", enrollmentDate:"2025-01-15" },
  { id:"stefro032", phpId:"1314032", name:"Steve Frost", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"frost.stevew@gmail.com", phone:"2192526194", enrollmentDate:"2025-01-07" },
  { id:"herbet122", phpId:"1313122", name:"Herve Betonga", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"hervebetonga@gmail.com", phone:"8594449279", enrollmentDate:"2025-01-01" },
  { id:"eluoch947", phpId:"1312947", name:"Eluemunor Ochonogor", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"oeluemunor@yahoo.com", phone:"4709836368", enrollmentDate:"2025-01-01" },
  { id:"joseph673", phpId:"1312673", name:"Joseph Ephias", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"josephguzman04@icloud.com", phone:"8058643075", enrollmentDate:"2024-12-31" },
  { id:"bleeke611", phpId:"1308611", name:"Blessing Ekeanyanwu", pin:"1111", role:"trainee", level:20, uplineId:"", email:"osonduamadi@comcast.net", phone:"3038858080", enrollmentDate:"2024-11-23" },
  { id:"jallig406", phpId:"1307406", name:"Jalen Liggins", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"jalenbliggins@gmail.com", phone:"2136787604", enrollmentDate:"2024-11-15" },
  { id:"georob122", phpId:"1307122", name:"Georkira Robinson", pin:"1111", role:"trainee", level:20, uplineId:"sarmor601", email:"gkrobinson06@gmail.com", phone:"8503714638", enrollmentDate:"2024-11-12" },
  { id:"jusoko818", phpId:"1303818", name:"Justina Okonkwo", pin:"1111", role:"associate", level:20, uplineId:"maroko654", email:"ejike.justina@yahoo.com", phone:"3239447729", enrollmentDate:"2024-11-01" },
  { id:"bialop382", phpId:"1303382", name:"Bianca R Lopez", pin:"1111", role:"field_associate", level:30, uplineId:"sornas052", email:"bianca.r.lopez80@gmail.com", phone:"7204733200", enrollmentDate:"2024-10-31" },
  { id:"franwa742", phpId:"1302742", name:"Frank Nwaneri", pin:"1111", role:"trainee", level:20, uplineId:"magibe8244", email:"franeriq01@yahoo.com", phone:"7022839782", enrollmentDate:"2024-10-29" },
  { id:"gabzel675", phpId:"1302675", name:"Gabriel Augusto Guerrero Zelaya", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"gabrielguerrero931@gmail.com", phone:"7203131789", enrollmentDate:"2024-10-28" },
  { id:"amairu592", phpId:"1301592", name:"Amaka Iruobe", pin:"1111", role:"field_associate", level:30, uplineId:"magibe8244", email:"amaka.i.phpagency@gmail.com", phone:"7024902725", enrollmentDate:"2024-10-19" },
  { id:"adefag179", phpId:"1301179", name:"Aderinsola Fagbamila", pin:"1111", role:"trainee", level:20, uplineId:"magibe8244", email:"fagbamilaaderinsola@yahoo.com", phone:"3039998779", top25BoardId:"8596152528", enrollmentDate:"2024-10-16" },
  { id:"taioje599", phpId:"1297599", name:"Taiye Ojeikere", pin:"1111", role:"field_associate", level:30, uplineId:"olaoje288", email:"taiyeojeikere@gmail.com", phone:"9092014792", enrollmentDate:"2024-09-30" },
  { id:"iheulu967", phpId:"1296967", name:"Iheanacho Ulu", pin:"1111", role:"trainee", level:20, uplineId:"vanudo398", email:"achoulu@gmail.com", phone:"3104670357", enrollmentDate:"2024-09-26" },
  { id:"tyrjam978", phpId:"1295978", name:"Tyrone James", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"jamestyrone219@gmail.com", phone:"7175519965", enrollmentDate:"2024-09-17" },
  { id:"shihou242", phpId:"1294242", name:"Shila Houshmand", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"shilahoushmand33@gmail.com", phone:"9495545346", enrollmentDate:"2024-09-07" },
  { id:"chomor979", phpId:"1293979", name:"Chosa Morris", pin:"1111", role:"trainee", level:20, uplineId:"sarmor601", email:"chosamorris578@gmail.com", phone:"6785008402", enrollmentDate:"2024-09-06" },
  { id:"chrfeo955", phpId:"1293955", name:"Christopher M Feola", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"83mx63toyota@gmail.com", phone:"3527373889", enrollmentDate:"2024-09-06" },
  { id:"elimor645", phpId:"1293645", name:"Elijah Morris", pin:"1111", role:"trainee", level:20, uplineId:"sarmor601", email:"elijahmorris40@gmail.com", phone:"6788533035", enrollmentDate:"2024-09-05" },
  { id:"edrhar102", phpId:"1293102", name:"Edrinna Harrison", pin:"1111", role:"field_associate", level:30, uplineId:"sornas052", email:"edrinnaharrison20@gmail.com", phone:"4046030690", enrollmentDate:"2024-09-01" },
  { id:"jashar069", phpId:"1293069", name:"Jasmine Harris", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"harrisjasmine966@gmail.com", phone:"9016612049", top25BoardId:"8270844063", enrollmentDate:"2024-09-01" },
  { id:"shasha662", phpId:"1292662", name:"Shadian Shaw", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"shawshadian271@gmail.com", phone:"5164102735", enrollmentDate:"2024-09-01" },
  { id:"steige063", phpId:"1292063", name:"Stephanie Ige", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"slige70@gmail.com", phone:"9014856805", enrollmentDate:"2024-08-31" },
  { id:"lacpic522", phpId:"1291522", name:"LaChance Pickett", pin:"1111", role:"trainee", level:20, uplineId:"", email:"lachancepickett1@gmail.com", phone:"7207750511", enrollmentDate:"2024-08-29" },
  { id:"vanudo398", phpId:"1290398", name:"Vanessa Udom", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"vanessaudom@yahoo.com", phone:"3472338678", enrollmentDate:"2024-08-21" },
  { id:"danwhi414", phpId:"1288414", name:"Daniel White", pin:"1111", role:"trainee", level:20, uplineId:"julpac408", email:"d73639@gmail.com", phone:"7206361612", enrollmentDate:"2024-08-03" },
  { id:"julpac408", phpId:"1288408", name:"Julia Pacheco", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"juliadp2054@gmail.com", phone:"7028011120", enrollmentDate:"2024-08-03" },
  { id:"simogb575", phpId:"1287575", name:"Simon Ogbonna", pin:"1111", role:"trainee", level:20, uplineId:"chesim0407", email:"sirchinaka2020@gmail.com", phone:"4243106996", enrollmentDate:"2024-07-31" },
  { id:"bregon200", phpId:"1286200", name:"Brenda Gonzalez", pin:"1111", role:"trainee", level:20, uplineId:"mohahm9866", email:"gonzalezsbee@gmail.com", phone:"7209780300", enrollmentDate:"2024-07-19" },
  { id:"coremm611", phpId:"1284611", name:"Corliss Emmanuel", pin:"1111", role:"associate", level:20, uplineId:"egbbev353", email:"corlissemmanuel@icloud.com", phone:"3239630107", enrollmentDate:"2024-07-10" },
  { id:"tifhaw038", phpId:"1284038", name:"Tiffiney Hawkins", pin:"1111", role:"trainee", level:20, uplineId:"chesim0407", email:"s.hawkins.t@gmail.com", phone:"2139441496", enrollmentDate:"2024-07-05" },
  { id:"sonash119", phpId:"1283119", name:"Sonita Ashu", pin:"1111", role:"trainee", level:20, uplineId:"olupin485", email:"ngozisonita@yahoo.com", phone:"3109162890", enrollmentDate:"2024-07-01" },
  { id:"maroko654", phpId:"1282654", name:"Maryjane Okonkwo", pin:"1111", role:"associate", level:20, uplineId:"magibe8244", email:"benardmaryjane@gmail.com", phone:"3233748331", enrollmentDate:"2024-06-30" },
  { id:"pauaho864", phpId:"1280864", name:"Paule Ahoudjo", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"hahoudjo@yahoo.com", phone:"2148624826", enrollmentDate:"2024-06-19" },
  { id:"nnaude801", phpId:"1279801", name:"Nnamdi Udengwu", pin:"1111", role:"trainee", level:20, uplineId:"catrho7170", email:"udengwumathiasnnamdi16@gmail.com", phone:"3105054086", enrollmentDate:"2024-06-16" },
  { id:"donade473", phpId:"1279473", name:"Donald Adedokun", pin:"1111", role:"trainee", level:20, uplineId:"olupin485", email:"realdsoja247@gmail.com", phone:"4244750720", enrollmentDate:"2024-06-16" },
  { id:"megwoo547", phpId:"1277547", name:"Megan Woods", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"mnwoods89@gmail.com", phone:"8177076049", enrollmentDate:"2024-06-07" },
  { id:"leshin227", phpId:"1277227", name:"Lesia Hinds", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"lesiahi2@gmail.com", phone:"2142082258", enrollmentDate:"2024-06-06" },
  { id:"kaylov993", phpId:"1274993", name:"Kayla Love", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"kokolovecare@gmail.com", phone:"5109935301", enrollmentDate:"2024-05-31" },
  { id:"darcob976", phpId:"1268976", name:"Darin Cobb", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"dcobb1510@yahoo.com", phone:"8503339523", enrollmentDate:"2024-04-29" },
  { id:"dwaarz803", phpId:"1267803", name:"Dwayne Arzu", pin:"1111", role:"trainee", level:20, uplineId:"egbbev353", email:"dkeona@yahoo.com", phone:"9512752284", enrollmentDate:"2024-04-20" },
  { id:"juatir779", phpId:"1267779", name:"Juan Moreno Tirado", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"rm5125640@gmail.com", phone:"6264131913", enrollmentDate:"2024-04-20" },
  { id:"sarmor601", phpId:"1267601", name:"Sarah Morris", pin:"1111", role:"associate", level:20, uplineId:"bricas8135", email:"sarahmorris5966@gmail.com", phone:"6787498167", enrollmentDate:"2024-04-19" },
  { id:"rikmit353", phpId:"1264353", name:"Rika Mitchell", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"rikamitchell@yahoo.com", phone:"7208378667", enrollmentDate:"2024-04-02" },
  { id:"okuuju022", phpId:"1264022", name:"Okuny Ujulu", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"okunyujulu4@gmail.com", phone:"7206923414", enrollmentDate:"2024-04-01" },
  { id:"elilot864", phpId:"1262864", name:"Elizabeth Lott", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"elizabethlott44@gmail.com", phone:"7206623227", enrollmentDate:"2024-03-31" },
  { id:"olupin485", phpId:"1261485", name:"Olubunmi Pinmiloye", pin:"1111", role:"field_associate", level:30, uplineId:"obi001", email:"bunmide16@gmail.com", phone:"3109978106", enrollmentDate:"2024-03-27" },
  { id:"verlop742", phpId:"1259742", name:"Veronica Lopez", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"vlopez2011@att.net", phone:"3236275380", enrollmentDate:"2024-03-16" },
  { id:"oluodu101", phpId:"1259101", name:"Oluwarotimi Odubanjo", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"lanrewajuodu@gmail.com", phone:"6824009935", enrollmentDate:"2024-03-16" },
  { id:"triloc087", phpId:"1258087", name:"Trinity Lockett", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"julecasey71@gmail.com", phone:"2567706381", enrollmentDate:"2024-03-16" },
  { id:"bonjoh952", phpId:"1253952", name:"BONARD JOHNSON", pin:"1111", role:"trainee", level:20, uplineId:"coltho757", email:"bonardsrjohnson@gmail.com", phone:"5623405811", enrollmentDate:"2024-03-06" },
  { id:"ayaegb397", phpId:"1253397", name:"Aya Egbuho", pin:"1111", role:"trainee", level:20, uplineId:"linosa5055", email:"ayaegbuho@gmail.com", phone:"3106428224", enrollmentDate:"2024-03-03" },
  { id:"josjen451", phpId:"1252451", name:"Josephine Jenkins", pin:"1111", role:"trainee", level:20, uplineId:"chesim0407", email:"josephinejenkins13@gmail.com", phone:"3344501789", enrollmentDate:"2024-03-01" },
  { id:"wiljoh348", phpId:"1251348", name:"Willie Johnson", pin:"1111", role:"trainee", level:20, uplineId:"catrho7170", email:"babydlow3011@gmail.com", phone:"3233389284", enrollmentDate:"2024-02-29" },
  { id:"unachi966", phpId:"1249966", name:"Unachukwu R Chidiebere", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"remigiuschidiebereu@gmail.com", phone:"7206305552", enrollmentDate:"2024-02-25" },
  { id:"jacfar867", phpId:"1248867", name:"Jacqueline Farquharson", pin:"1111", role:"trainee", level:20, uplineId:"mohahm9866", email:"jfarqu@yahoo.com", phone:"3524459963", enrollmentDate:"2024-02-16" },
  { id:"monly802", phpId:"1246802", name:"Monica Ly", pin:"1111", role:"field_associate", level:30, uplineId:"coltho757", email:"monica.ly@pm.me", phone:"2132906180", enrollmentDate:"2024-02-14" },
  { id:"suzbri214", phpId:"1246214", name:"Suzette Bridgemahon", pin:"1111", role:"trainee", level:20, uplineId:"", email:"skbridgemahon@gmail.com", phone:"2532308645", enrollmentDate:"2024-02-11" },
  { id:"egbbev353", phpId:"1245353", name:"Egbert Bevans", pin:"1111", role:"field_associate", level:30, uplineId:"obi001", email:"ebevansphp@gmail.com", phone:"3107523520", enrollmentDate:"2024-02-07" },
  { id:"mankor240", phpId:"1244240", name:"Many Kormany", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"manykormany@gmail.com", phone:"7025964289", enrollmentDate:"2024-02-01" },
  { id:"josgoe821", phpId:"1243821", name:"Josiah Goering", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"josiahgoering21@gmail.com", phone:"7202107877", enrollmentDate:"2024-01-31" },
  { id:"hartop516", phpId:"1242516", name:"Harut Topchyan", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"harut.topchyan@yahoo.com", phone:"8186674915", enrollmentDate:"2024-01-20" },
  { id:"coltho757", phpId:"1240757", name:"COLLETTE THOMPSON", pin:"1111", role:"associate", level:20, uplineId:"bricas8135", email:"collettecampbell437@gmail.com", phone:"3239448909", enrollmentDate:"2024-01-11" },
  { id:"lorhar732", phpId:"1240732", name:"Lorenzo Harper", pin:"1111", role:"trainee", level:20, uplineId:"chrdav6711", email:"harperlorenzo9@yahoo.com", phone:"3034080621", enrollmentDate:"2024-01-11" },
  { id:"geonwa339", phpId:"1240339", name:"George Nwaeke", pin:"1111", role:"trainee", level:20, uplineId:"linosa5055", email:"georgrnwaeke110@gmail.com", phone:"3239966935", enrollmentDate:"2024-01-08" },
  { id:"chiakp183", phpId:"1239183", name:"Chidera Akpudiogwu", pin:"1111", role:"trainee", level:20, uplineId:"emeakp5823", email:"sherisweetlove557@gmail.com", phone:"3102615430", top25BoardId:"18418856132", enrollmentDate:"2024-01-01" },
  { id:"zoehamo746", phpId:"", name:"Zoe Hammond", pin:"1111", role:"trainee", level:20, uplineId:"", email:"zmonyettr@gmail.com", phone:"3145374746", enrollmentDate:"2026-06-06" },
  { id:"britmal001", phpId:"", name:"Brittany C. Malbry", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"Brittanycaseyl.Phpagency@gmail.com", phone:"5626068592", enrollmentDate:"2026-06-12" },
  { id:"romcru001", phpId:"1422030", name:"Romeo Cruz", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"romeocruz211@gmail.com", phone:"3107339994", top25BoardId:"18426535441", enrollmentDate:"2026-06-13" },
  { id:"ifenk001", phpId:"", name:"Ifeyinwa Nkpolara", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"phpdynastylicensing@gmail.com", phone:"2138875978", enrollmentDate:"2026-06-15" },
  { id:"chi001", phpId:"10301", name:"Chidozie N.", pin:"1111", role:"trainee", level:20, uplineId:"mag001", email:"", phone:"", top25BoardId:"18414813028", licenseStates:["TX"], enrollmentDate:"2023-01-15" },
  { id:"jac001", phpId:"10402", name:"Jacinta U.", pin:"1111", role:"trainee", level:20, uplineId:"chi001", email:"", phone:"", licenseStates:["TX"], enrollmentDate:"2023-06-01" },
  { id:"cos001", phpId:"10501", name:"Cosmas E.", pin:"1111", role:"trainee", level:20, uplineId:"", email:"", phone:"", licenseStates:["TX"], enrollmentDate:"2023-09-01" },
  { id:"gio001", phpId:"10502", name:"Gio M.", pin:"1111", role:"trainee", level:20, uplineId:"mag001", email:"", phone:"", licenseStates:["TX"], enrollmentDate:"2023-08-01" },
  { id:"nin001", phpId:"10601", name:"Nina R.", pin:"1111", role:"trainee", level:20, uplineId:"", email:"", phone:"", licenseStates:["TX"], enrollmentDate:"2024-02-01" },
  { id:"and001", phpId:"10602", name:"Andrew T.", pin:"1111", role:"trainee", level:20, uplineId:"", email:"", phone:"", licenseStates:["TX"], enrollmentDate:"2024-03-01" },
  { id:"mau001", phpId:"10701", name:"Maureen I.", pin:"1111", role:"trainee", level:20, uplineId:"chi001", email:"", phone:"", enrollmentDate:"2025-03-01" },
  { id:"lil001", phpId:"10702", name:"Lily A.", pin:"1111", role:"trainee", level:20, uplineId:"", email:"", phone:"", enrollmentDate:"2025-04-01" },
  { id:"anuele794", phpId:"794123", name:"Anulika Eleodi", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"anulieleodi@gmail.com", phone:"3108003536", enrollmentDate:"2019-05-13" },
  { id:"olaoje288", phpId:"288823", name:"Ola E. Ojeikere", pin:"1111", role:"trainee", level:20, uplineId:"", email:"ojeikere77@gmail.com", phone:"3104002514", enrollmentDate:"2019-07-03" },
  { id:"sornas052", phpId:"52906", name:"Soroush Nasirzadeh", pin:"1111", role:"trainee", level:20, uplineId:"", email:"soroush.nasirzadeh@gmail.com", phone:"8182679155", enrollmentDate:"2016-08-17" },
  { id:"vicunk001", phpId:"", name:"Vicky", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"7913240558" },
  { id:"rosanu417", phpId:"", name:"Rose Anuarita", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"18417943185", adminTier:"admin" },
  { id:"graofu633", phpId:"", name:"Grace Olufa", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"18403963633" },
  { id:"natvau738", phpId:"", name:"Nathaniel Vaughn", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"18399753738" },
  { id:"israuko828", phpId:"", name:"Israel Uko", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"18020253828" },
  { id:"danuko108", phpId:"", name:"Daniel Uko", pin:"1111", role:"trainee", level:20, uplineId:"obi001", email:"", phone:"", top25BoardId:"18397351108" },
  { id:"dchen05", phpId:"", name:"David Chen", pin:"9988", role:"marketing_director", level:100, uplineId:"", email:"", phone:"5553456789" },
  { id:"enguyen02", phpId:"", name:"Emily Nguyen", pin:"1927", role:"director", level:60, uplineId:"", email:"", phone:"5557654321" },
  { id:"mlee03", phpId:"", name:"Marcus Lee", pin:"7654", role:"trainee", level:20, uplineId:"", email:"", phone:"5559871234" },
  { id:"mohmus120", phpId:"1426120", name:"Mohamed Musa", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"mohamed772600@icloud.com", phone:"7207869766", enrollmentDate:"2026-08-15" },
  { id:"noatse417", phpId:"1425417", name:"Noah Tsegaye", pin:"1111", role:"trainee", level:20, uplineId:"romcru001", email:"noahtsegaye27@gmail.com", phone:"3107285543", enrollmentDate:"2026-08-10" },
  { id:"calsha154", phpId:"1425154", name:"Calvin Shannon", pin:"1111", role:"trainee", level:20, uplineId:"sornas052", email:"calvin.shannon06@gmail.com", phone:"6789395883", enrollmentDate:"2026-08-08" },
  { id:"iulsmo023", phpId:"1424023", name:"Iuliia Smorodina", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"smorodinaiuliia@gmail.com", phone:"5626176869", enrollmentDate:"2026-07-31" },
  { id:"marthi290", phpId:"1423290", name:"Marcel Thiel", pin:"1111", role:"associate", level:20, uplineId:"tortsa743", email:"marceljthiel80@gmail.com", phone:"3236290260", top25BoardId:"18426534536", enrollmentDate:"2026-07-25" },
  { id:"harbal179", phpId:"1422179", name:"Harley Secundino Baltazar", pin:"1111", role:"trainee", level:20, uplineId:"deigar526", email:"contactharley28@gmail.com", phone:"3236183036", enrollmentDate:"2026-07-16" },
  { id:"dapuza145", phpId:"1422145", name:"Daphne Uzayisenga", pin:"1111", role:"trainee", level:20, uplineId:"twianu136", email:"daphnaalana01@gmail.com", phone:"3159920518", enrollmentDate:"2026-07-16" },
  { id:"pauuvi582", phpId:"1418582", name:"Michi Uvidia", pin:"1111", role:"trainee", level:20, uplineId:"conchu516", email:"puvidia@gmail.com", phone:"3238095958", enrollmentDate:"2026-06-30" },
  { id:"morsin895", phpId:"1417895", name:"Morgan Singleton", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"msingleton1333@gmail.com", phone:"3109456493", enrollmentDate:"2026-06-27" },
  { id:"nnendu300", phpId:"1417300", name:"Nneka Ndukwe", pin:"1111", role:"trainee", level:20, uplineId:"managu956", email:"ekanvene@yahoo.com", phone:"5626206937", enrollmentDate:"2026-06-23" },
  { id:"chiony786", phpId:"1416786", name:"Chidera Onyekwere", pin:"1111", role:"trainee", level:20, uplineId:"goonwa076", email:"chideraonyekwere129@gmail.com", phone:"3102133833", enrollmentDate:"2026-06-20" },
  { id:"anarey760", phpId:"1416760", name:"Ana Reyes", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"annaestrada437@yahoo.com", phone:"3109386281", enrollmentDate:"2026-06-20" },
  { id:"jlywhi483", phpId:"1415483", name:"JLynn Whitaker", pin:"1111", role:"trainee", level:20, uplineId:"tortsa743", email:"whitakerjlynn@gmail.com", phone:"3104133995", enrollmentDate:"2026-06-17" },
  { id:"yurnak867", phpId:"1414867", name:"Yuri Nakatani", pin:"1111", role:"trainee", level:20, uplineId:"bricas8135", email:"yurinakatani02@gmail.com", phone:"4244439421", enrollmentDate:"2026-06-14" },
  { id:"cosuhu368", phpId:"1414368", name:"Cosmas Uhuo", pin:"1111", role:"trainee", level:20, uplineId:"steudo121", email:"coscusanas@gmail.com", phone:"6056419640", enrollmentDate:"2026-06-11" },
  { id:"maumye341", phpId:"1414341", name:"Maureen Myers", pin:"1111", role:"trainee", level:20, uplineId:"regofo333", email:"cosmasabanobi088@gmail.com", phone:"2135451057", enrollmentDate:"2026-06-11" },
  { id:"regofo333", phpId:"1409333", name:"Regina Ofoedu", pin:"1111", role:"trainee", level:20, uplineId:"jacaba757", email:"ofoeduoby@gmail.com", phone:"3236217520", enrollmentDate:"2026-06-01" },
  { id:"twianu136", phpId:"1409136", name:"Twishimye Anuarita", pin:"1111", role:"field_associate", level:30, uplineId:"bricas8135", email:"shimyerose123@gmail.com", phone:"6022993207", enrollmentDate:"2026-06-01" },
  { id:"antpen9809", phpId:"1429809", name:"Antoine Penn", pin:"9809", role:"trainee", uplineId:"kaylov993", email:"antoine.penn44@gmail.com", phone:"5104073707", enrollmentDate:"2026-09-03" },
  { id:"kimran8945", phpId:"1428945", name:"Kimberly Randle", pin:"8945", role:"trainee", uplineId:"goonwa076", email:"kimberlyrandle79@yahoo.com", phone:"4242853314", enrollmentDate:"2026-09-01" },
  { id:"ayoolo8545", phpId:"1428545", name:"Ayodele Olorode", pin:"8545", role:"trainee", uplineId:"eunodu5638", email:"ayoolorode@gmail.com", phone:"3237037827", enrollmentDate:"2026-08-29" },
  { id:"henmal8357", phpId:"1428357", name:"Henry Romero Maldonado", pin:"8357", role:"trainee", uplineId:"obi001", email:"contact@romerolocksley.com", phone:"5715350727", enrollmentDate:"2026-08-28" },
  { id:"canper8027", phpId:"1428027", name:"Candy Perez", pin:"8027", role:"trainee", uplineId:"marthi290", email:"cperez2017@gmail.com", phone:"6267863638", top25BoardId:"18428867821", enrollmentDate:"2026-09-01" },
  { id:"eunodu5638", phpId:"1425638", name:"Eunice Oduwole", pin:"5638", role:"trainee", uplineId:"jacaba757", email:"folukeobems@yahoo.com", phone:"5596142160", enrollmentDate:"2026-08-12" },
  { id:"proemm2121", phpId:"1422121", name:"Promise Emmanuel", pin:"2121", role:"trainee", uplineId:"cosaba718", email:"promisewisdom7@gmail.com", phone:"3233581765", enrollmentDate:"2026-07-16" },
  { id:"keleke1773", phpId:"1421773", name:"Kelvin Ekeh", pin:"1773", role:"trainee", uplineId:"jacaba757", email:"ekehkelvin44@gmail.com", phone:"8622319651", enrollmentDate:"2026-07-15" },
  { id:"ebeaug4168", phpId:"1404168", name:"Ebenezer Augustine", pin:"4168", role:"trainee", uplineId:"goonwa076", email:"eseogheneau@gmail.com", phone:"4244305475", enrollmentDate:"2026-05-16" },
  { id:"prochi1109", phpId:"1431109", name:"Prosper Chinatu", pin:"1109", role:"trainee", uplineId:"chieli576", email:"chinatuprosper2006@gmail.com", phone:"2816973330", top25BoardId:"18430883524", enrollmentDate:"2026-09-13" },
  { id:"marste1078", phpId:"1431078", name:"Markus Steele", pin:"1078", role:"trainee", uplineId:"tortsa743", email:"markussteele20@gmail.com", phone:"4243331628", enrollmentDate:"2026-09-13" },
  { id:"bricas8135", phpId:"1068135", name:"Brittany Casey", pin:"8135", role:"producing_md", level:50, uplineId:"obi001", email:"", phone:"" },
  { id:"chesim0407", phpId:"1070407", name:"Cherri Sims", pin:"0407", role:"field_associate", uplineId:"bricas8135", email:"cherrisimsphp@gmail.com", phone:"3104936173", top25BoardId:"8282733428", enrollmentDate:"2021-08-31", mdTeamId:"obi001" },
  { id:"maraje415", phpId:"1404415", name:"Mariam Ajetunmobi", pin:"1111", role:"trainee", level:20, uplineId:"jacaba757", email:"maryamoriyomi26@gmail.com", phone:"3107567228", enrollmentDate:"2026-05-17" },
  { id:"raydur1647", phpId:"1431647", name:"Rayleen Duran", pin:"1647", role:"trainee", level:10, uplineId:"canper8027", email:"rayleenduran78@gmail.com", phone:"6262907490", enrollmentDate:"2026-09-16" },
  { id:"merben1035", phpId:"1431035", name:"Merlin Benavides", pin:"1035", role:"trainee", level:10, uplineId:"canper8027", email:"txtianaaa@gmail.com", phone:"8187241663", enrollmentDate:"2026-09-12" },
  { id:"ezeaku1034", phpId:"1431034", name:"Eze Akubuiro", pin:"1034", role:"trainee", level:10, uplineId:"marthi290", email:"ezeakubuiro@gmail.com", phone:"2138768024", enrollmentDate:"2026-09-12" },
  { id:"carsor0876", phpId:"1430876", name:"Caroline Sorunke", pin:"0876", role:"trainee", level:10, uplineId:"pauebo7256", email:"csorunke@gmail.com", phone:"7077186946", enrollmentDate:"2026-09-12" },
  { id:"augmkp9905", phpId:"1429905", name:"Augustina Mkpadi", pin:"9905", role:"trainee", level:10, uplineId:"bli001", email:"ifedika2016@gmail.com", phone:"3106250792", enrollmentDate:"2026-09-04" },
  { id:"cynflo9412", phpId:"1429412", name:"Cynthia Flores", pin:"9412", role:"trainee", level:10, uplineId:"tortsa743", email:"cynthia17flores@gmail.com", phone:"8186053107", enrollmentDate:"2026-09-01" },
  { id:"paunwo9043", phpId:"1429043", name:"Paul Amechi Nwofili", pin:"9043", role:"trainee", level:10, uplineId:"chimba1908", email:"chinenyemba50@gmail.com", phone:"4245260871", enrollmentDate:"2026-09-01" },
  { id:"petgod8580", phpId:"1428580", name:"Peter Godslaw", pin:"8580", role:"trainee", level:10, uplineId:"pauebo7256", email:"petabs@yahoo.com", phone:"3107141428", enrollmentDate:"2026-08-29" },
  { id:"deloss8394", phpId:"1428394", name:"Delphin Ganongo Ossali", pin:"8394", role:"trainee", level:10, uplineId:"chimba1908", email:"gladisedelphin755@gmail.com", phone:"7125615159", enrollmentDate:"2026-08-29" },
  { id:"geoekp8287", phpId:"1428287", name:"Georgy Ekpenisi", pin:"8287", role:"trainee", level:10, uplineId:"chiiko8228", email:"georgykechi75@gmail.com", phone:"8185710596", enrollmentDate:"2026-08-28" },
  { id:"rissho7929", phpId:"1427929", name:"Risikat  Omolola Shodiya", pin:"7929", role:"trainee", level:10, uplineId:"chimba1908", email:"lola5ayos@yahoo.com", phone:"3104901802", enrollmentDate:"2026-08-25" },
  { id:"jesleo7473", phpId:"1427473", name:"Jessica Leija De Leon", pin:"7473", role:"trainee", level:10, uplineId:"bli001", email:"jessicandeleon@icloud.com", phone:"9494827918", enrollmentDate:"2026-08-21" },
  { id:"flonwo7437", phpId:"1427437", name:"Florence Nwosu", pin:"7437", role:"trainee", level:10, uplineId:"chimba1908", email:"revflorencenwosu@gmail.com", phone:"4243404249", enrollmentDate:"2026-08-21" },
  { id:"pauebo7256", phpId:"1427256", name:"Pauline Ebo", pin:"7256", role:"trainee", level:10, uplineId:"chimba1908", email:"ebopauline6@gmail.com", phone:"6266010918", enrollmentDate:"2026-08-20" },
  { id:"geonno7142", phpId:"1427142", name:"George Nnoli", pin:"7142", role:"trainee", level:10, uplineId:"chimba1908", email:"tujorn@gmail.com", phone:"5624125700", enrollmentDate:"2026-08-19" },
  { id:"peaibe6964", phpId:"1426964", name:"Peace Ibeabuchi", pin:"6964", role:"trainee", level:10, uplineId:"chimba1908", email:"peace_nedum@yahoo.com", phone:"5629689980", enrollmentDate:"2026-08-17" },
  { id:"chumba6273", phpId:"1426273", name:"Chukwuedozie Mba", pin:"6273", role:"trainee", level:10, uplineId:"chimba1908", email:"edomba@hotmail.com", phone:"3109865663", enrollmentDate:"2026-08-15" },
  { id:"monkii5870", phpId:"1425870", name:"Monika Kiir", pin:"5870", role:"trainee", level:10, uplineId:"conmad3521", email:"monicachristo09@gmail.com", phone:"2819072660", enrollmentDate:"2026-08-13" },
  { id:"okeeke5828", phpId:"1425828", name:"Okechukwu Eke", pin:"5828", role:"trainee", level:10, uplineId:"chimba1908", email:"okechukwueke2006@gmail.com", phone:"9095454282", enrollmentDate:"2026-08-13" },
  { id:"mckfio5523", phpId:"1425523", name:"Mckenzie Fiore", pin:"5523", role:"trainee", level:10, uplineId:"bli001", email:"mckenziefiore1@gmail.com", phone:"3159415950", enrollmentDate:"2026-08-11" },
  { id:"sanjon4006", phpId:"1424006", name:"Sandra Jonah", pin:"4006", role:"trainee", level:10, uplineId:"chimba1908", email:"uzsann@yahoo.com", phone:"6197489599", enrollmentDate:"2026-07-31" },
  { id:"gabjau3363", phpId:"1423363", name:"Gabriel Jauregui", pin:"3363", role:"trainee", level:10, uplineId:"bli001", email:"bruingabe1@sbcglobal.net", phone:"9097205917", enrollmentDate:"2026-07-27" },
  { id:"chimba1908", phpId:"1421908", name:"Chinenye Mba", pin:"1908", role:"associate", level:20, uplineId:"bli001", email:"chinenyemba50@gmail.com", phone:"3106864082", enrollmentDate:"2026-07-16" },
  { id:"rapukp0286", phpId:"1420286", name:"Raphael Ukpe", pin:"0286", role:"trainee", level:10, uplineId:"janukp1947", email:"ralphukpe@yahoo.com", phone:"3239738774", enrollmentDate:"2026-07-01" },
  { id:"cyroko9989", phpId:"1419989", name:"Cyril Okonye", pin:"9989", role:"trainee", level:10, uplineId:"elfndu8547", email:"cyrino4al@yahoo.com", phone:"6467551591", enrollmentDate:"2026-07-01" },
  { id:"leeogo9813", phpId:"1419813", name:"Leena Ogoke", pin:"9813", role:"trainee", level:10, uplineId:"elfndu8547", email:"m.goke@yahoo.com", phone:"3109952815", enrollmentDate:"2026-07-01" },
  { id:"chaech9624", phpId:"1419624", name:"Charity Echema", pin:"9624", role:"trainee", level:10, uplineId:"elfndu8547", email:"echem@aol.com", phone:"4246100165", enrollmentDate:"2026-07-01" },
  { id:"ansozu2084", phpId:"1412084", name:"Anselm Ozuzu", pin:"2084", role:"trainee", level:10, uplineId:"ngoony7013", email:"anselmozuzu@gmail.com", phone:"9514107975", enrollmentDate:"2026-06-07" },
  { id:"jeysau1593", phpId:"1411593", name:"Jeydy Saucedo", pin:"1593", role:"trainee", level:10, uplineId:"fraike8179", email:"jeydysaucedo2002@gmail.com", phone:"2138557001", enrollmentDate:"2026-06-06" },
  { id:"ngoeze0533", phpId:"1410533", name:"Ngozi Ezenwafor", pin:"0533", role:"trainee", level:10, uplineId:"conmad3521", email:"preciousmaris@yahoo.com", phone:"3235793008", enrollmentDate:"2026-06-04" },
  { id:"chawil0274", phpId:"1410274", name:"Champelle Williams", pin:"0274", role:"trainee", level:10, uplineId:"delwil2738", email:"champelle92@gmail.com", phone:"2104879893", enrollmentDate:"2026-06-03" },
  { id:"ihuoka8526", phpId:"1408526", name:"Ihuoma Okam", pin:"8526", role:"trainee", level:10, uplineId:"chialo3971", email:"ihuoma2002us@yahoo.com", phone:"6197883494", enrollmentDate:"2026-05-31" },
  { id:"chraka8178", phpId:"1408178", name:"Christabel Akanno", pin:"8178", role:"trainee", level:10, uplineId:"berugb5885", email:"charitydurugbo@yahoo.com", phone:"3237236650", enrollmentDate:"2026-05-31" },
  { id:"chinwo8146", phpId:"1408146", name:"Chigozie Nwobi", pin:"8146", role:"trainee", level:10, uplineId:"berugb5885", email:"oluekwu@yahoo.com", phone:"3233925420", enrollmentDate:"2026-05-31" },
  { id:"ijenwo8136", phpId:"1408136", name:"Ijeoma Nwobi", pin:"8136", role:"trainee", level:10, uplineId:"berugb5885", email:"juli_042005@yahoo.com", phone:"3104048469", enrollmentDate:"2026-05-31" },
  { id:"mernwo8123", phpId:"1408123", name:"Mercy Nwobi", pin:"8123", role:"trainee", level:10, uplineId:"berugb5885", email:"mercynwobi@yahoo.com", phone:"3104047392", enrollmentDate:"2026-05-31" },
  { id:"wenume8072", phpId:"1408072", name:"Wendy Umeokafor", pin:"8072", role:"trainee", level:10, uplineId:"chialo3971", email:"umeokafor.wendy@gmail.com", phone:"3235357657", enrollmentDate:"2026-05-31" },
  { id:"veranu8067", phpId:"1408067", name:"Veronica Anubalu", pin:"8067", role:"trainee", level:10, uplineId:"", email:"blengikep@gmail.com", phone:"4242003903", enrollmentDate:"2026-05-31" },
  { id:"faitay7874", phpId:"1407874", name:"Faith Taylor", pin:"7874", role:"trainee", level:10, uplineId:"chialo3971", email:"fae7758@gmail.com", phone:"9482033966", enrollmentDate:"2026-05-31" },
  { id:"antalo7484", phpId:"1407484", name:"Anthony Alozie", pin:"7484", role:"trainee", level:10, uplineId:"chialo3971", email:"aalozie1@hotmail.com", phone:"6601418771", enrollmentDate:"2026-05-30" },
  { id:"hapaja7002", phpId:"1407002", name:"Hapiness Ajaebo", pin:"7002", role:"trainee", level:10, uplineId:"", email:"happineeamaka66@gmail.com", phone:"3109547452", enrollmentDate:"2026-05-30" },
  { id:"ememad6387", phpId:"1406387", name:"Emeka Madu", pin:"6387", role:"trainee", level:10, uplineId:"conmad3521", email:"bowellus@yahoo.com", phone:"7076565000", enrollmentDate:"2026-05-27" },
  { id:"shaorj5941", phpId:"1405941", name:"Shawn Orjiakor", pin:"5941", role:"trainee", level:10, uplineId:"eliani9105", email:"orjiakorshawn@gmail.com", phone:"3238993315", enrollmentDate:"2026-05-23" },
  { id:"davuzo5647", phpId:"1405647", name:"David Uzoma", pin:"5647", role:"trainee", level:10, uplineId:"", email:"davidsonchima.dc@gmail.com", phone:"4244269427", enrollmentDate:"2026-05-21" },
  { id:"goouzo5496", phpId:"1405496", name:"Goodness Uzoma", pin:"5496", role:"trainee", level:10, uplineId:"", email:"goodsliss@gmail.com", phone:"3239075027", enrollmentDate:"2026-05-20" },
  { id:"amaume5470", phpId:"1405470", name:"Amazu A. Umeh", pin:"5470", role:"trainee", level:10, uplineId:"dareze5941", email:"amazuumeh@gmail.com", phone:"3109519266", enrollmentDate:"2026-05-20" },
  { id:"kimwil4147", phpId:"1404147", name:"Kimberly Williams", pin:"4147", role:"trainee", level:10, uplineId:"delwil2738", email:"kim_williams971@yahoo.com", phone:"9033889752", enrollmentDate:"2026-05-16" },
  { id:"marcar4099", phpId:"1404099", name:"Martha Carter", pin:"4099", role:"trainee", level:10, uplineId:"delwil2738", email:"williamsdelonia@yahoo.com", phone:"2547473052", enrollmentDate:"2026-05-16" },
  { id:"delwil4040", phpId:"1404040", name:"Delonia Williams", pin:"4040", role:"trainee", level:10, uplineId:"delwil2738", email:"aveyw36@gmail.com", phone:"9795257418", enrollmentDate:"2026-05-16" },
  { id:"krymen4025", phpId:"1404025", name:"Krystal Mendez", pin:"4025", role:"trainee", level:10, uplineId:"delwil2738", email:"krystal_mendez12@yahoo.com", phone:"8177513234", enrollmentDate:"2026-05-16" },
  { id:"conmad3521", phpId:"1403521", name:"Concilia Madu", pin:"3521", role:"associate", level:20, uplineId:"ngoony7013", email:"conciliamadu@yahoo.com", phone:"4243231561", enrollmentDate:"2026-05-16" },
  { id:"delwil2738", phpId:"1402738", name:"Delonia Williams", pin:"2738", role:"field_associate", level:30, uplineId:"bli001", email:"williamsdelonia5@yahoo.com", phone:"2544265482", enrollmentDate:"2026-05-13" },
  { id:"eriwil2597", phpId:"1402597", name:"Erica Wilson", pin:"2597", role:"trainee", level:10, uplineId:"bli001", email:"errawilson314@gmail.com", phone:"2132814782", enrollmentDate:"2026-05-13" },
  { id:"haifad9286", phpId:"1399286", name:"Hailey Fadipe", pin:"9286", role:"trainee", level:10, uplineId:"bli001", email:"hfadipe400@gmail.com", phone:"6196211770", enrollmentDate:"2026-04-25" },
  { id:"eliani9105", phpId:"1399105", name:"Elizabeth Aniokoye", pin:"9105", role:"associate", level:20, uplineId:"bli001", email:"aniokoye@gmail.com", phone:"3233457348", enrollmentDate:"2026-04-24" },
  { id:"chuokp8619", phpId:"1398619", name:"Chukwudi Okpu", pin:"8619", role:"trainee", level:10, uplineId:"fraike8179", email:"mrsirclear@gmail.com", phone:"8186123142", enrollmentDate:"2026-04-20" },
  { id:"antfie8263", phpId:"1398263", name:"Anton Fierro", pin:"8263", role:"trainee", level:10, uplineId:"fraike8179", email:"antonethanfierro@gmail.com", phone:"6266365177", enrollmentDate:"2026-04-16" },
  { id:"ngoony7013", phpId:"1397013", name:"Ngozi Onyeji-ozuzu", pin:"7013", role:"associate", level:20, uplineId:"bli001", email:"ngozionyejiozuzu@gmail.com", phone:"7272760074", enrollmentDate:"2026-04-07" },
  { id:"chiazi5946", phpId:"1395946", name:"Chidi Azinge", pin:"5946", role:"trainee", level:10, uplineId:"dareze5941", email:"chizinge@yahoo.com", phone:"3109685047", enrollmentDate:"2026-04-01" },
  { id:"berugb5885", phpId:"1395885", name:"Bernice Ugboaja", pin:"5885", role:"field_associate", level:30, uplineId:"elfndu8547", email:"oluekwu@gmail.com", phone:"3239449946", enrollmentDate:"2026-04-01" },
  { id:"mareze5849", phpId:"1395849", name:"Maria Ezembaji", pin:"5849", role:"trainee", level:10, uplineId:"marnwo0980", email:"amorachiezembaji@gmail.com", phone:"3103513505", enrollmentDate:"2026-04-01" },
  { id:"nkoonu4925", phpId:"1394925", name:"Nkonyelu Onuegbu", pin:"4925", role:"trainee", level:10, uplineId:"bli001", email:"umenk2001@yahoo.com", phone:"5625654059", enrollmentDate:"2026-03-29" },
  { id:"flojou2807", phpId:"1392807", name:"Florence Joubin", pin:"2807", role:"trainee", level:10, uplineId:"fraike8179", email:"flochu13@gmail.com", phone:"9143566088", enrollmentDate:"2026-03-16" },
  { id:"lawoff2623", phpId:"1392623", name:"Lawrence Offokansi", pin:"2623", role:"trainee", level:10, uplineId:"fraike8179", email:"amaoge04@gmail.com", phone:"7148182304", enrollmentDate:"2026-03-16" },
  { id:"chichu2596", phpId:"1392596", name:"Chinelo Chudi-Igwe", pin:"2596", role:"trainee", level:10, uplineId:"fraike8179", email:"fiketuonye@gmail.com", phone:"7146433812", enrollmentDate:"2026-03-16" },
  { id:"ogochu2585", phpId:"1392585", name:"Ogochukwu Chudi-Igwe", pin:"2585", role:"trainee", level:10, uplineId:"fraike8179", email:"ogovigwee@gmail.com", phone:"5077062539", enrollmentDate:"2026-03-16" },
  { id:"eziogu2580", phpId:"1392580", name:"Ezinwanne Oguagha", pin:"2580", role:"trainee", level:10, uplineId:"chiogu3938", email:"chikaedu@gmail.com", phone:"3232922023", enrollmentDate:"2026-03-15" },
  { id:"chiogu2571", phpId:"1392571", name:"Chika Oguagha", pin:"2571", role:"trainee", level:10, uplineId:"chiogu3938", email:"chikaedu@hotmail.com", phone:"4242211114", enrollmentDate:"2026-03-15" },
  { id:"chuogu2570", phpId:"1392570", name:"Chukwuemelie Oguagha", pin:"2570", role:"trainee", level:10, uplineId:"chiogu3938", email:"chuoguagha@gmail.com", phone:"9096329967", enrollmentDate:"2026-03-15" },
  { id:"cyngid2314", phpId:"1392314", name:"Cynthia Gideon", pin:"2314", role:"trainee", level:10, uplineId:"elfndu8547", email:"robin9298@yahoo.com", phone:"3233922355", enrollmentDate:"2026-03-15" },
  { id:"merume2166", phpId:"1392166", name:"Mercy Umeokafor", pin:"2166", role:"trainee", level:10, uplineId:"augalo1298", email:"mercyumeokafor@yahoo.com", phone:"3239459012", enrollmentDate:"2026-03-14" },
  { id:"janukp1947", phpId:"1391947", name:"Janet Ukpe", pin:"1947", role:"associate", level:20, uplineId:"esteko9905", email:"imaralph2008@yahoo.com", phone:"3237473773", enrollmentDate:"2026-03-13" },
  { id:"jerrey1490", phpId:"1391490", name:"Jereny Reyes", pin:"1490", role:"trainee", level:10, uplineId:"micedw8462", email:"jereny.reyes@gmail.com", phone:"2012828222", enrollmentDate:"2026-03-11" },
  { id:"ashbuf0053", phpId:"1390053", name:"Ashley Buford", pin:"0053", role:"trainee", level:10, uplineId:"", email:"buford.ashley.23@gmail.com", phone:"4249020032", enrollmentDate:"2026-03-04" },
  { id:"setkeu9983", phpId:"1389983", name:"Seth Keul", pin:"9983", role:"trainee", level:10, uplineId:"bli001", email:"redgrockers@gmail.com", phone:"7194647573", enrollmentDate:"2026-03-04" },
  { id:"esteko9905", phpId:"1389905", name:"Esther Ekong", pin:"9905", role:"trainee", level:10, uplineId:"elfndu8547", email:"estherekong@att.net", phone:"3235616006", enrollmentDate:"2026-03-03" },
  { id:"ifuogu9352", phpId:"1389352", name:"Ifunanya Oguagha", pin:"9352", role:"trainee", level:10, uplineId:"chiogu3938", email:"oguaghanya@gmail.com", phone:"3103084772", enrollmentDate:"2026-03-01" },
  { id:"chioff9160", phpId:"1389160", name:"Chiamaka Offokansi", pin:"9160", role:"trainee", level:10, uplineId:"chioff6393", email:"chiamaka.offokansi@gmail.com", phone:"3108665792", enrollmentDate:"2026-03-01" },
  { id:"chioff9087", phpId:"1389087", name:"Chidera Offokansi", pin:"9087", role:"trainee", level:10, uplineId:"chioff6393", email:"coffokan@gmail.com", phone:"3109852856", enrollmentDate:"2026-03-01" },
  { id:"chioff8997", phpId:"1388997", name:"Chika Offokansi", pin:"8997", role:"trainee", level:10, uplineId:"chioff6393", email:"chikaoffokansi@hotmail.com", phone:"3108630172", enrollmentDate:"2026-03-01" },
  { id:"johimo8380", phpId:"1388380", name:"John Imoh", pin:"8380", role:"trainee", level:10, uplineId:"fraike8179", email:"johnimoh935@gmail.com", phone:"6193437797", enrollmentDate:"2026-03-01" },
  { id:"regnjo8278", phpId:"1388278", name:"Reginald Njoku", pin:"8278", role:"trainee", level:10, uplineId:"fraike8179", email:"frankoike@yahoo.com", phone:"3238075650", enrollmentDate:"2026-03-01" },
  { id:"emeoff8160", phpId:"1388160", name:"Emeka Offokansi", pin:"8160", role:"trainee", level:10, uplineId:"fraike8179", email:"stanrichman2@gmail.com", phone:"4044686819", enrollmentDate:"2026-03-01" },
  { id:"crimar8110", phpId:"1388110", name:"Cristina Martinez", pin:"8110", role:"trainee", level:10, uplineId:"marven7650", email:"sunflower252008@gmail.com", phone:"4248888914", enrollmentDate:"2026-03-01" },
  { id:"marrod8071", phpId:"1388071", name:"Maria De Jesus Rodriguez", pin:"8071", role:"trainee", level:10, uplineId:"rossan5715", email:"rossie2513@gmail.com", phone:"7325329381", enrollmentDate:"2026-02-28" },
  { id:"olifor8054", phpId:"1388054", name:"Olivia Forster", pin:"8054", role:"trainee", level:10, uplineId:"micedw8462", email:"johnchatham03@gmail.com", phone:"9733683491", enrollmentDate:"2026-02-28" },
  { id:"antgar8027", phpId:"1388027", name:"Antonia Garcia-Santos", pin:"8027", role:"trainee", level:10, uplineId:"rossan5715", email:"nena87367@gmail.com", phone:"9089377314", enrollmentDate:"2026-02-28" },
  { id:"sansan7816", phpId:"1387816", name:"Santa Juliana Martinez Sanchez", pin:"7816", role:"trainee", level:10, uplineId:"rossan5715", email:"santamartinezsanchez@gmail.com", phone:"8484371149", enrollmentDate:"2026-02-28" },
  { id:"yaimar7808", phpId:"1387808", name:"Yaisi Margarita De Leon Martinez", pin:"7808", role:"trainee", level:10, uplineId:"rossan5715", email:"yaisideleon215@gmail.com", phone:"9087273118", enrollmentDate:"2026-02-28" },
  { id:"sammur6618", phpId:"1386618", name:"Samuel Murray", pin:"6618", role:"trainee", level:10, uplineId:"fraike8179", email:"samuelmurray32@yahoo.com", phone:"2133997411", enrollmentDate:"2026-02-25" },
  { id:"wilraf6118", phpId:"1386118", name:"Wilson Rafael-Fernandez", pin:"6118", role:"trainee", level:10, uplineId:"rossan5715", email:"fernandezwilson019@gmail.com", phone:"7328249940", enrollmentDate:"2026-02-21" },
  { id:"andper6096", phpId:"1386096", name:"Andry Perez", pin:"6096", role:"trainee", level:10, uplineId:"rossan5715", email:"andripeez19944@gmail.com", phone:"8483488611", enrollmentDate:"2026-02-21" },
  { id:"yacser6072", phpId:"1386072", name:"Yacayra Serrano", pin:"6072", role:"trainee", level:10, uplineId:"rossan5715", email:"yacairaserrano2513@gmail.com", phone:"2014961162", enrollmentDate:"2026-02-21" },
  { id:"marher5894", phpId:"1385894", name:"Marino Hernandez", pin:"5894", role:"trainee", level:10, uplineId:"rossan5715", email:"marinohernandes0102@icloud.com", phone:"7328961466", enrollmentDate:"2026-02-21" },
  { id:"marher5882", phpId:"1385882", name:"Maria Altagracia Fernandez Hernandez", pin:"5882", role:"trainee", level:10, uplineId:"rossan5715", email:"marinohernandez12345@gmail.com", phone:"7327701480", enrollmentDate:"2026-02-21" },
  { id:"merjer5702", phpId:"1385702", name:"Meredith Jerez", pin:"5702", role:"trainee", level:10, uplineId:"rossan5715", email:"meredithjerez02@hotmail.com", phone:"2019720028", enrollmentDate:"2026-02-20" },
  { id:"nwazeb4198", phpId:"1384198", name:"Nwakanma Zebulun", pin:"4198", role:"trainee", level:10, uplineId:"nkeeze4119", email:"zebkanma@gmail.com", phone:"4244143448", enrollmentDate:"2026-02-15" },
  { id:"janama4166", phpId:"1384166", name:"Jane AMAEFULE", pin:"4166", role:"trainee", level:10, uplineId:"nkeeze4119", email:"janeamaefule76@gmail.com", phone:"2134983314", enrollmentDate:"2026-02-15" },
  { id:"debcyp4061", phpId:"1384061", name:"Deborah Cyprian", pin:"4061", role:"trainee", level:10, uplineId:"nkeeze4119", email:"debbysaint8@gmail.com", phone:"2244637554", enrollmentDate:"2026-02-14" },
  { id:"shavil1151", phpId:"1381151", name:"Shaolin Lewis Villanueva", pin:"1151", role:"trainee", level:10, uplineId:"augalo1298", email:"shaolinvillanueva@gmail.com", phone:"2136044729", enrollmentDate:"2026-02-04" },
  { id:"shedun1136", phpId:"1381136", name:"Shemar Dunkley", pin:"1136", role:"trainee", level:10, uplineId:"micedw8462", email:"youngdunkas123@outlook.com", phone:"4435721903", enrollmentDate:"2026-02-04" },
  { id:"marnwo0980", phpId:"1380980", name:"Maria U. Nwokeliba", pin:"0980", role:"associate", level:20, uplineId:"nkeeze4119", email:"nkelibaosb@gmail.com", phone:"2139380387", enrollmentDate:"2026-02-03" },
  { id:"oliane9053", phpId:"1379053", name:"Olivia Anene", pin:"9053", role:"trainee", level:10, uplineId:"augalo1298", email:"oliveanene@yahoo.com", phone:"8183900840", enrollmentDate:"2026-01-28" },
  { id:"pauver6402", phpId:"1376402", name:"Paul Verdin", pin:"6402", role:"trainee", level:10, uplineId:"fraike8179", email:"paulverdin@live.com", phone:"9512936630", enrollmentDate:"2026-01-10" },
  { id:"chioff6393", phpId:"1376393", name:"Chibuzo Offokansi", pin:"6393", role:"associate", level:20, uplineId:"fraike8179", email:"chibuzz@yahoo.com", phone:"3103460490", enrollmentDate:"2026-01-10" },
  { id:"stachu4964", phpId:"1374964", name:"Stanley Chukwuegbo", pin:"4964", role:"trainee", level:10, uplineId:"agachu2473", email:"libanestanley2750@gmail.com", phone:"3102566722", enrollmentDate:"2026-01-01" },
  { id:"kinike4807", phpId:"1374807", name:"Kingsley Ikeanyi", pin:"4807", role:"trainee", level:10, uplineId:"helike4762", email:"kingsleyikeanyi@gmail.com", phone:"3233394212", enrollmentDate:"2026-01-01" },
  { id:"munnwo4778", phpId:"1374778", name:"Munachimso Nwodili", pin:"4778", role:"trainee", level:10, uplineId:"helike4762", email:"monwodili@gmail.com", phone:"4242460146", enrollmentDate:"2025-12-31" },
  { id:"helike4762", phpId:"1374762", name:"Helen Ify Ikeanyi-ezeasor", pin:"4762", role:"trainee", level:10, uplineId:"bli001", email:"ifeanyiikeanyi@gmail.com", phone:"4242325410", enrollmentDate:"2025-12-31" },
  { id:"chaony4230", phpId:"1374230", name:"Charles Onyilofor", pin:"4230", role:"trainee", level:10, uplineId:"chiony9598", email:"conyilofor@msn.com", phone:"2022554122", enrollmentDate:"2025-12-28" },
  { id:"nkeeze4119", phpId:"1374119", name:"Nkechinyere Ezeikpe", pin:"4119", role:"field_associate", level:30, uplineId:"", email:"giftezeikpe@gmail.com", phone:"3232149087", enrollmentDate:"2025-12-27" },
  { id:"chueze4118", phpId:"1374118", name:"Chukwuemeka Ezenagu", pin:"4118", role:"trainee", level:10, uplineId:"agachu2473", email:"johnezenagu37@gmail.com", phone:"3239630856", enrollmentDate:"2025-12-27" },
  { id:"henchu4115", phpId:"1374115", name:"Henrietta Chukwuegbo", pin:"4115", role:"trainee", level:10, uplineId:"agachu2473", email:"ngozichukwuegbo22@gmail.com", phone:"3105314225", enrollmentDate:"2025-12-27" },
  { id:"synbur3839", phpId:"1373839", name:"Synisha Burroughs", pin:"3839", role:"trainee", level:10, uplineId:"", email:"synishaburroughs@gmail.com", phone:"3234122263", enrollmentDate:"2025-12-24" },
  { id:"marbat3534", phpId:"1373534", name:"Maria Escobedo Batres", pin:"3534", role:"trainee", level:10, uplineId:"bli001", email:"marieamour@outlook.com", phone:"5626435812", enrollmentDate:"2025-12-20" },
  { id:"agachu2473", phpId:"1372473", name:"Agatha Chukwuegbo", pin:"2473", role:"associate", level:20, uplineId:"", email:"chuksagatha18@gmail.com", phone:"3104620801", enrollmentDate:"2025-12-13" },
  { id:"geoogu1962", phpId:"1371962", name:"George Ogubi", pin:"1962", role:"trainee", level:10, uplineId:"joynwa3287", email:"otigag2@gmail.com", phone:"3237196433", enrollmentDate:"2025-12-08" },
  { id:"munony1683", phpId:"1371683", name:"Munachiso Onyilofor", pin:"1683", role:"trainee", level:10, uplineId:"chiony9598", email:"munachisoonyilofor@gmail.com", phone:"2404670621", enrollmentDate:"2025-12-05" },
  { id:"chiony1680", phpId:"1371680", name:"Chidimma Onyilofor", pin:"1680", role:"trainee", level:10, uplineId:"chiony9598", email:"chima469@gmail.com", phone:"3016905255", enrollmentDate:"2025-12-05" },
  { id:"shitho1591", phpId:"1371591", name:"Shiriiah Thompson", pin:"1591", role:"trainee", level:10, uplineId:"", email:"shiriiahthompson19@gmail.com", phone:"4243485536", enrollmentDate:"2025-12-04" },
  { id:"ngoeze0639", phpId:"1370639", name:"Ngozi Eze", pin:"0639", role:"trainee", level:10, uplineId:"joynwa3287", email:"ugonne24@gmail.com", phone:"5103334704", enrollmentDate:"2025-11-30" },
  { id:"bribla0484", phpId:"1370484", name:"Brianna Blasing", pin:"0484", role:"trainee", level:10, uplineId:"fraike8179", email:"annajblasing@gmail.com", phone:"4245992231", enrollmentDate:"2025-11-29" },
  { id:"micnah0194", phpId:"1370194", name:"Michelle Nah", pin:"0194", role:"trainee", level:10, uplineId:"fraike8179", email:"csunnie22@gmail.com", phone:"2137816673", enrollmentDate:"2025-11-26" },
  { id:"agbdad9870", phpId:"1369870", name:"Agboola Dada", pin:"9870", role:"trainee", level:10, uplineId:"dareze5941", email:"ceapresident_17th@aol.com", phone:"3109536233", enrollmentDate:"2025-11-22" },
  { id:"ogedim9604", phpId:"1369604", name:"Ogechukwu Dimelu", pin:"9604", role:"trainee", level:10, uplineId:"joynwa3287", email:"ogedimelu@yahoo.com", phone:"7472356664", enrollmentDate:"2025-11-21" },
  { id:"chiony9598", phpId:"1369598", name:"Chinenye Onyilofor", pin:"9598", role:"associate", level:20, uplineId:"joynwa3287", email:"chichi795@msn.com", phone:"2403388222", enrollmentDate:"2025-11-21" },
  { id:"essbri8766", phpId:"1368766", name:"Essence Bridges", pin:"8766", role:"trainee", level:10, uplineId:"bli001", email:"essencefbridges10@gmail.com", phone:"4246031230", enrollmentDate:"2025-11-15" },
  { id:"marner8547", phpId:"1368547", name:"Martha Nerio", pin:"8547", role:"trainee", level:10, uplineId:"", email:"neriomartha@gmail.com", phone:"3236130515", enrollmentDate:"2025-11-13" },
  { id:"davony8327", phpId:"1368327", name:"David Onyabe", pin:"8327", role:"trainee", level:10, uplineId:"ikhimu0911", email:"david.onyabe@gmail.com", phone:"4107906567", enrollmentDate:"2025-11-12" },
  { id:"jesgar7564", phpId:"1367564", name:"Jessie Garcia", pin:"7564", role:"trainee", level:10, uplineId:"fraike8179", email:"myworkspace.123@outlook.com", phone:"7144697203", enrollmentDate:"2025-11-05" },
  { id:"ugonwu7262", phpId:"1367262", name:"Ugochukwu Nwuwa", pin:"7262", role:"trainee", level:10, uplineId:"fraike8179", email:"u.nwuwa@gmail.com", phone:"3105006657", enrollmentDate:"2025-11-01" },
  { id:"ijeosa6746", phpId:"1366746", name:"Ijeoma Osakwe", pin:"6746", role:"trainee", level:10, uplineId:"elfndu8547", email:"rosy4favour@gmail.com", phone:"3106290586", enrollmentDate:"2025-11-01" },
  { id:"ugoajo6622", phpId:"1366622", name:"Ugochukwu Ajoku", pin:"6622", role:"trainee", level:10, uplineId:"elfndu8547", email:"ajokuugochukwu194@gmail.com", phone:"8135314372", enrollmentDate:"2025-11-01" },
  { id:"onuchr6259", phpId:"1366259", name:"Onuora Chris", pin:"6259", role:"trainee", level:10, uplineId:"micedw8462", email:"adiorahonuora@gmail.com", phone:"8622559789", enrollmentDate:"2025-10-30" },
  { id:"diefre5744", phpId:"1365744", name:"Diego Freitas", pin:"5744", role:"trainee", level:10, uplineId:"alebra7560", email:"diego.freitas0223@gmail.com", phone:"3103861492", enrollmentDate:"2025-10-25" },
  { id:"ifende5093", phpId:"1365093", name:"Ifeanyi Timothy Ndedigwe", pin:"5093", role:"trainee", level:10, uplineId:"taiodu0781", email:"ifeanyindedigwe@gmail.com", phone:"2136914473", enrollmentDate:"2025-10-18" },
  { id:"cheols4027", phpId:"1364027", name:"Chevas Olson", pin:"4027", role:"trainee", level:10, uplineId:"", email:"olsonchevas1@gmail.com", phone:"7274087935", enrollmentDate:"2025-10-15" },
  { id:"rondav4018", phpId:"1364018", name:"Ronnie Davidsom", pin:"4018", role:"trainee", level:10, uplineId:"", email:"ronniemd727@yahoo.com", phone:"3239520981", enrollmentDate:"2025-10-15" },
  { id:"ailcor3875", phpId:"1363875", name:"Ailin Grullon Correia", pin:"3875", role:"trainee", level:10, uplineId:"rossan5715", email:"ailinmg@hotmail.com", phone:"7329255612", enrollmentDate:"2025-10-14" },
  { id:"mmeoke3724", phpId:"1363724", name:"Mmeridi Okenwa", pin:"3724", role:"trainee", level:10, uplineId:"", email:"mmeridiokenwa@gmail.com", phone:"3108493267", enrollmentDate:"2025-10-14" },
  { id:"saimen3587", phpId:"1363587", name:"Saily Bautista Menjivar", pin:"3587", role:"trainee", level:10, uplineId:"rossan5715", email:"sailymenjivar303@gmail.com", phone:"9085021377", enrollmentDate:"2025-10-12" },
  { id:"joynwa3287", phpId:"1363287", name:"Joy Nwabueze", pin:"3287", role:"associate", level:20, uplineId:"bli001", email:"ugonne@yahoo.com", phone:"8187232408", enrollmentDate:"2025-10-10" },
  { id:"oluwal2991", phpId:"1362991", name:"Olumuyiwa Wallace", pin:"2991", role:"trainee", level:10, uplineId:"", email:"muyiwawallace@gmail.com", phone:"3109870979", enrollmentDate:"2025-10-08" },
  { id:"brajoh2619", phpId:"1362619", name:"Brandon Johnson", pin:"2619", role:"trainee", level:10, uplineId:"chialo3971", email:"bjohnso112@yahoo.com", phone:"3107436836", enrollmentDate:"2025-10-04" },
  { id:"prasha2276", phpId:"1362276", name:"Pratick Shantaiya", pin:"2276", role:"trainee", level:10, uplineId:"", email:"prat.shant96@gmail.com", phone:"8186148156", enrollmentDate:"2025-10-01" },
  { id:"cliike2152", phpId:"1362152", name:"Clinton Ikechi", pin:"2152", role:"trainee", level:10, uplineId:"augalo1298", email:"clintonikechi23@gmail.com", phone:"2138014549", enrollmentDate:"2025-10-01" },
  { id:"emeoke1636", phpId:"1361636", name:"Emeka Frank Okechi", pin:"1636", role:"trainee", level:10, uplineId:"dareze5941", email:"frankemmy.oj@gmail.com", phone:"4242005915", enrollmentDate:"2025-10-01" },
  { id:"chiaju1210", phpId:"1361210", name:"Chidi Ajufo", pin:"1210", role:"trainee", level:10, uplineId:"augalo1298", email:"chidiajufo@gmail.com", phone:"3103835287", enrollmentDate:"2025-10-01" },
  { id:"estabr0919", phpId:"1360919", name:"Esthefania Abreu", pin:"0919", role:"trainee", level:10, uplineId:"rossan5715", email:"esthefaniabreu@gmail.com", phone:"2016161535", enrollmentDate:"2025-09-30" },
  { id:"trihar0754", phpId:"1360754", name:"Trisha Hartfield", pin:"0754", role:"trainee", level:10, uplineId:"elfndu8547", email:"trishahartfield@gmail.com", phone:"3103032996", enrollmentDate:"2025-09-28" },
  { id:"adoflo0659", phpId:"1360659", name:"Adolfo Flores", pin:"0659", role:"trainee", level:10, uplineId:"dareze5941", email:"floresand10@gmail.com", phone:"4242335857", enrollmentDate:"2025-09-27" },
  { id:"janoka9420", phpId:"1359420", name:"Jane Okali", pin:"9420", role:"trainee", level:10, uplineId:"bli001", email:"okalijne@gmail.com", phone:"9084056717", enrollmentDate:"2025-09-18" },
  { id:"aliorj9294", phpId:"1359294", name:"Alice Orji", pin:"9294", role:"trainee", level:10, uplineId:"dareze5941", email:"lulualice2026@gmail.com", phone:"2137199076", enrollmentDate:"2025-09-17" },
  { id:"brijoh8216", phpId:"1358216", name:"Brianna Johnson", pin:"8216", role:"trainee", level:10, uplineId:"rosfut5939", email:"mixedbri143@gmail.com", phone:"2069818077", enrollmentDate:"2025-09-15" },
  { id:"sargik7718", phpId:"1357718", name:"Sarah Gikonyo", pin:"7718", role:"trainee", level:10, uplineId:"chiiko8228", email:"giwellth@gmail.com", phone:"9515779747", enrollmentDate:"2025-09-13" },
  { id:"ransmi7678", phpId:"1357678", name:"Randy Smith", pin:"7678", role:"trainee", level:10, uplineId:"micsmi7653", email:"rmsmith86@live.com", phone:"9518332535", enrollmentDate:"2025-09-13" },
  { id:"micsmi7653", phpId:"1357653", name:"Michelle Smith", pin:"7653", role:"trainee", level:10, uplineId:"chiiko8228", email:"masmith92@live.com", phone:"9512731651", enrollmentDate:"2025-09-13" },
  { id:"alebra7560", phpId:"1357560", name:"Alexander Bradford", pin:"7560", role:"trainee", level:10, uplineId:"dareze5941", email:"alexbradford722@gmail.com", phone:"5624745632", enrollmentDate:"2025-09-13" },
  { id:"micken6697", phpId:"1356697", name:"Michael Nyamekye Kennedy", pin:"6697", role:"trainee", level:10, uplineId:"rosfut5939", email:"mike.nnk91@gmail.com", phone:"9179408215", enrollmentDate:"2025-09-09" },
  { id:"oluola6528", phpId:"1356528", name:"Olusegun Israel Olaopa", pin:"6528", role:"trainee", level:10, uplineId:"ikhimu0911", email:"olusegunolaopa@gmail.com", phone:"9734892265", enrollmentDate:"2025-09-08" },
  { id:"krioke6183", phpId:"1356183", name:"Kristen Okenwa", pin:"6183", role:"trainee", level:10, uplineId:"", email:"grahamk1021@gmail.com", phone:"4243912776", enrollmentDate:"2025-09-06" },
  { id:"viculi6140", phpId:"1356140", name:"Victoria Uliem", pin:"6140", role:"trainee", level:10, uplineId:"jefuli1597", email:"uliemngozi@yahoo.com", phone:"7473239172", enrollmentDate:"2025-09-06" },
  { id:"sunude6035", phpId:"1356035", name:"Sunday Udeh", pin:"6035", role:"trainee", level:10, uplineId:"augalo1298", email:"michaeludeh83@gmail.com", phone:"3104483969", enrollmentDate:"2025-09-05" },
  { id:"okiovw4177", phpId:"1354177", name:"Okiyoma Ovwighose", pin:"4177", role:"trainee", level:10, uplineId:"", email:"okiyomaadesoye@gmail.com", phone:"6092097097", enrollmentDate:"2025-08-30" },
  { id:"joseze4119", phpId:"1354119", name:"Joshua Ezekude", pin:"4119", role:"trainee", level:10, uplineId:"augalo1298", email:"chukwuebukagotit76@gmail.com", phone:"3102569341", enrollmentDate:"2025-08-30" },
  { id:"rosmuo4112", phpId:"1354112", name:"Rose Muo", pin:"4112", role:"trainee", level:10, uplineId:"fraike8179", email:"muozumo@aol.com", phone:"3232523889", enrollmentDate:"2025-08-30" },
  { id:"chiogu3938", phpId:"1353938", name:"Chiedu Oguagha", pin:"3938", role:"associate", level:20, uplineId:"fraike8179", email:"chikaedum@gmail.com", phone:"4242210529", enrollmentDate:"2025-08-30" },
  { id:"chiimo3630", phpId:"1353630", name:"Chidi Imoh", pin:"3630", role:"trainee", level:10, uplineId:"fraike8179", email:"cimoh@yahoo.com", phone:"3106184972", enrollmentDate:"2025-08-28" },
  { id:"ogeike3499", phpId:"1353499", name:"Ogechukwu Ikeotuonye", pin:"3499", role:"trainee", level:10, uplineId:"fraike8179", email:"ogeiikeotuonye@gmail.com", phone:"5622508893", enrollmentDate:"2025-08-27" },
  { id:"lucavi3446", phpId:"1353446", name:"Lucia Mireya Avina", pin:"3446", role:"trainee", level:10, uplineId:"dareze5941", email:"luciamireyaavina@gmail.com", phone:"2134656007", enrollmentDate:"2025-08-27" },
  { id:"siewhi3018", phpId:"1353018", name:"Sierra Whitaker", pin:"3018", role:"trainee", level:10, uplineId:"dareze5941", email:"sierra.whitaker09@gmail.com", phone:"3233503848", enrollmentDate:"2025-08-23" },
  { id:"brygua2402", phpId:"1352402", name:"Bryan Guardado", pin:"2402", role:"trainee", level:10, uplineId:"dareze5941", email:"bguardado626@gmail.com", phone:"5623475764", enrollmentDate:"2025-08-20" },
  { id:"louwes2394", phpId:"1352394", name:"Lourdes Blessing Wesby", pin:"2394", role:"trainee", level:10, uplineId:"dareze5941", email:"lourdeswesby@gmail.com", phone:"3109908228", enrollmentDate:"2025-08-20" },
  { id:"chioke2198", phpId:"1352198", name:"Chijioke Okegbe", pin:"2198", role:"trainee", level:10, uplineId:"", email:"chijiokeokegbe@yahoo.com", phone:"4692884914", enrollmentDate:"2025-08-18" },
  { id:"douvar1245", phpId:"1351245", name:"Douglas Vargas", pin:"1245", role:"trainee", level:10, uplineId:"chiiko8228", email:"natlexmd@gmail.com", phone:"8183260190", enrollmentDate:"2025-08-14" },
  { id:"emeoff1086", phpId:"1351086", name:"Emem Offong", pin:"1086", role:"trainee", level:10, uplineId:"chiiko8228", email:"emem.offong@gmail.com", phone:"4173397837", enrollmentDate:"2025-08-14" },
  { id:"mirbel0995", phpId:"1350995", name:"Miriam Belen", pin:"0995", role:"trainee", level:10, uplineId:"marven7650", email:"mima_q99@yahoo.com", phone:"5627455215", enrollmentDate:"2025-08-13" },
  { id:"dalcan0560", phpId:"1350560", name:"Dalisia Cannon", pin:"0560", role:"trainee", level:10, uplineId:"dareze5941", email:"dalisiacannon@yahoo.com", phone:"3237881948", enrollmentDate:"2025-08-09" },
  { id:"orlcas0559", phpId:"1350559", name:"Orlando Castro", pin:"0559", role:"trainee", level:10, uplineId:"dareze5941", email:"oecastro@icloud.com", phone:"4242078627", enrollmentDate:"2025-08-09" },
  { id:"robonu0199", phpId:"1350199", name:"Robinson Onuigbo", pin:"0199", role:"trainee", level:10, uplineId:"fraike8179", email:"wotgroups@gmail.com", phone:"2132714516", enrollmentDate:"2025-08-02" },
  { id:"chleze9751", phpId:"1349751", name:"Chloe Ezeudu", pin:"9751", role:"trainee", level:10, uplineId:"sanhil7295", email:"chlxezeudu@gmail.com", phone:"4247890276", enrollmentDate:"2025-08-01" },
  { id:"jayfie8728", phpId:"1348728", name:"Jaylen Fierro", pin:"8728", role:"trainee", level:10, uplineId:"augalo1298", email:"jaylen11889@gmail.com", phone:"6579009665", enrollmentDate:"2025-07-31" },
  { id:"elfndu8547", phpId:"1348547", name:"Elfrida Ndukwe", pin:"8547", role:"field_associate", level:30, uplineId:"dareze5941", email:"elfy4real@gmail.com", phone:"3107666584", enrollmentDate:"2025-07-30" },
  { id:"laswhi8542", phpId:"1348542", name:"LaShawn White", pin:"8542", role:"trainee", level:10, uplineId:"sanhil7295", email:"maydavid422@gmail.com", phone:"3236951450", enrollmentDate:"2025-07-30" },
  { id:"ricore8352", phpId:"1348352", name:"Ricardo Orea", pin:"8352", role:"trainee", level:10, uplineId:"dareze5941", email:"rickorea24@gmail.com", phone:"3236821754", enrollmentDate:"2025-07-29" },
  { id:"marven7650", phpId:"1347650", name:"Margarita Ventura", pin:"7650", role:"associate", level:20, uplineId:"dareze5941", email:"ogmaggie98@yahoo.com", phone:"4242880421", enrollmentDate:"2025-07-23" },
  { id:"ngoeze7342", phpId:"1347342", name:"Ngozi Ezeudu", pin:"7342", role:"trainee", level:10, uplineId:"dareze5941", email:"ngobiezeudu@yahoo.com", phone:"4242400987", enrollmentDate:"2025-07-19" },
  { id:"ememor7338", phpId:"1347338", name:"Emelina Morales", pin:"7338", role:"trainee", level:10, uplineId:"marmor6846", email:"mrsmorales47@yahoo.com", phone:"3232034506", enrollmentDate:"2025-07-19" },
  { id:"sanhil7295", phpId:"1347295", name:"Sandra Hill", pin:"7295", role:"associate", level:20, uplineId:"dareze5941", email:"victoriessan@yahoo.com", phone:"2136135346", enrollmentDate:"2025-07-19" },
  { id:"opeaki6967", phpId:"1346967", name:"Opeyemi Akinsanya", pin:"6967", role:"trainee", level:10, uplineId:"marobi9047", email:"sanyaopeyemi5@gmail.com", phone:"9259847138", enrollmentDate:"2025-07-17" },
  { id:"marmor6846", phpId:"1346846", name:"Martin Morales", pin:"6846", role:"trainee", level:10, uplineId:"dareze5941", email:"lakers4452@hotmail.com", phone:"3238429200", enrollmentDate:"2025-07-17" },
  { id:"dareze5941", phpId:"1345941", name:"Darlington Ezeudu", pin:"5941", role:"field_associate", level:30, uplineId:"fraike8179", email:"ezeuduattnet@gmail.com", phone:"4242402472", enrollmentDate:"2025-07-12" },
  { id:"rosfut5939", phpId:"1345939", name:"Rosemary Futse", pin:"5939", role:"field_associate", level:30, uplineId:"bli001", email:"mfutse@yahoo.com", phone:"5093393727", enrollmentDate:"2025-07-12" },
  { id:"amaike3806", phpId:"1343806", name:"Amarachukwu Ikeotuonye", pin:"3806", role:"trainee", level:10, uplineId:"fraike8179", email:"amaranaomii@icloud.com", phone:"3238720188", enrollmentDate:"2025-07-01" },
  { id:"obioff3409", phpId:"1343409", name:"Obianuju Offokansi", pin:"3409", role:"trainee", level:10, uplineId:"fraike8179", email:"ujuanne@yahoo.com", phone:"5622426946", enrollmentDate:"2025-06-28" },
  { id:"theebo3407", phpId:"1343407", name:"Thelma Ebo", pin:"3407", role:"trainee", level:10, uplineId:"fraike8179", email:"tellisha101@gmail.com", phone:"5622403657", enrollmentDate:"2025-06-28" },
  { id:"jamdix3174", phpId:"1343174", name:"Jamhar Dixon", pin:"3174", role:"trainee", level:10, uplineId:"preony8886", email:"jamhardixon@gmail.com", phone:"6464317443", enrollmentDate:"2025-06-27" },
  { id:"marowa2546", phpId:"1342546", name:"Margaret Owaka", pin:"2546", role:"trainee", level:10, uplineId:"bli001", email:"marg.owaka@gmail.com", phone:"3235731108", enrollmentDate:"2025-06-21" },
  { id:"temade1802", phpId:"1341802", name:"Temitope Adediwura", pin:"1802", role:"trainee", level:10, uplineId:"taiodu0781", email:"adediwuratemmy@gmail.com", phone:"3235168735", enrollmentDate:"2025-06-14" },
  { id:"samlar1721", phpId:"1341721", name:"Samuel Lara", pin:"1721", role:"trainee", level:10, uplineId:"joslar8936", email:"slucrative1@icloud.com", phone:"4245425320", enrollmentDate:"2025-06-13" },
  { id:"marobi9047", phpId:"1339047", name:"Martins Obika", pin:"9047", role:"trainee", level:10, uplineId:"taiodu0781", email:"somtoobika@gmail.com", phone:"4109729366", enrollmentDate:"2025-05-28" },
  { id:"joslar8936", phpId:"1338936", name:"Jose Lara", pin:"8936", role:"trainee", level:10, uplineId:"chrano1445", email:"joecsun13@live.com", phone:"8183212793", enrollmentDate:"2025-05-27" },
  { id:"fraike8179", phpId:"1338179", name:"Francis Iketuonye", pin:"8179", role:"director", level:40, uplineId:"bli001", email:"frankoike@yahoo.com", phone:"3107213402", enrollmentDate:"2025-05-17" },
  { id:"chialo7328", phpId:"1337328", name:"Chizitere Alozie", pin:"7328", role:"trainee", level:10, uplineId:"augalo1298", email:"chizitere.alozie@gmail.com", phone:"6197059335", enrollmentDate:"2025-05-13" },
  { id:"nwaesi7232", phpId:"1337232", name:"Nwadiuto Esiobu", pin:"7232", role:"trainee", level:10, uplineId:"ikhimu0911", email:"diutoe@gmail.com", phone:"9545593369", enrollmentDate:"2025-05-11" },
  { id:"adamba6888", phpId:"1336888", name:"Adaeze Mbagwu", pin:"6888", role:"trainee", level:10, uplineId:"augalo1298", email:"adaeze.mbagwu@gmail.com", phone:"5626375474", enrollmentDate:"2025-05-08" },
  { id:"davodi6603", phpId:"1336603", name:"David Odiakosa", pin:"6603", role:"trainee", level:10, uplineId:"bli001", email:"davidodiakosa15@gmail.com", phone:"4242876190", enrollmentDate:"2025-05-05" },
  { id:"preerh6553", phpId:"1336553", name:"Precious Erhunmwuosere", pin:"6553", role:"associate", level:20, uplineId:"ikhimu0911", email:"preciouserhunmwuosere@gmail.com", phone:"2018955964", enrollmentDate:"2025-05-05" },
  { id:"maujon3507", phpId:"1333507", name:"Maurice Jones", pin:"3507", role:"trainee", level:10, uplineId:"", email:"artofmoney1@gmail.com", phone:"3107518837", enrollmentDate:"2025-04-25" },
  { id:"emmoke2842", phpId:"1332842", name:"Emmanuel Okebhagbe", pin:"2842", role:"trainee", level:10, uplineId:"joyadi7718", email:"eclef22@yahoo.com", phone:"3019071356", enrollmentDate:"2025-04-21" },
  { id:"petade1870", phpId:"1331870", name:"Peter Adejumo", pin:"1870", role:"trainee", level:10, uplineId:"taiodu0781", email:"padejumo140@gmail.com", phone:"6614409691", enrollmentDate:"2025-04-13" },
  { id:"joyimu0913", phpId:"1330913", name:"Joy Imumorin", pin:"0913", role:"trainee", level:10, uplineId:"ikhimu0911", email:"joyeimumorin76@gmail.com", phone:"6077933046", enrollmentDate:"2025-04-07" },
  { id:"ikhimu0911", phpId:"1330911", name:"Ikhide Imumorin", pin:"0911", role:"associate", level:20, uplineId:"chiiko8228", email:"igiaaa2021@gmail.com", phone:"6077933116", enrollmentDate:"2025-04-07" },
  { id:"marshe0596", phpId:"1330596", name:"Mariyam Shekoni", pin:"0596", role:"trainee", level:10, uplineId:"bli001", email:"shekonimariyam16@gmail.com", phone:"3237402724", enrollmentDate:"2025-04-04" },
  { id:"priadi9654", phpId:"1329654", name:"Prince Adiboshi", pin:"9654", role:"trainee", level:10, uplineId:"joyadi7718", email:"princeadiboshi@gmail.com", phone:"9546442298", enrollmentDate:"2025-04-01" },
  { id:"davadi9621", phpId:"1329621", name:"David Adiboshi", pin:"9621", role:"trainee", level:10, uplineId:"joyadi7718", email:"joypdj@gmail.com", phone:"2023892976", enrollmentDate:"2025-04-01" },
  { id:"clijr8933", phpId:"1328933", name:"Clifford Labriel Jr.", pin:"8933", role:"trainee", level:10, uplineId:"", email:"clabriel208@gmail.com", phone:"3103458085", enrollmentDate:"2025-03-27" },
  { id:"joyadi7718", phpId:"1327718", name:"Joy Adiboshi", pin:"7718", role:"associate", level:20, uplineId:"nzunwa2044", email:"php.joyrich@gmail.com", phone:"2029975154", enrollmentDate:"2025-03-19" },
  { id:"tercov7651", phpId:"1327651", name:"Terrance Covington", pin:"7651", role:"trainee", level:10, uplineId:"", email:"terrancecovington.ca@gmail.com", phone:"2133021449", enrollmentDate:"2025-03-19" },
  { id:"segcas6203", phpId:"1326203", name:"Segrid Alexander Castro", pin:"6203", role:"trainee", level:10, uplineId:"bli001", email:"freshupsmedia@gmail.com", phone:"7142091524", enrollmentDate:"2025-03-13" },
  { id:"patric5722", phpId:"1325722", name:"Patricia Rice", pin:"5722", role:"trainee", level:10, uplineId:"", email:"rice.patricia20@yahoo.com", phone:"5626748414", enrollmentDate:"2025-03-08" },
  { id:"domdon5019", phpId:"1325019", name:"Dominic Donato", pin:"5019", role:"trainee", level:10, uplineId:"bli001", email:"parkourhavok19@gmail.com", phone:"6167804942", enrollmentDate:"2025-03-03" },
  { id:"jersan4564", phpId:"1324564", name:"Jeremiah Sanusi", pin:"4564", role:"trainee", level:10, uplineId:"bli001", email:"sanusijeremiah@gmail.com", phone:"2138524524", enrollmentDate:"2025-03-01" },
  { id:"ashtuc4347", phpId:"1324347", name:"Asha Tucker", pin:"4347", role:"trainee", level:10, uplineId:"rodcor2787", email:"tucker.82asha@gmail.com", phone:"3239943950", enrollmentDate:"2025-03-01" },
  { id:"rodcor2787", phpId:"1322787", name:"Rodney Corn", pin:"2787", role:"trainee", level:10, uplineId:"", email:"understandingwisdom79@gmail.com", phone:"3605160265", enrollmentDate:"2025-02-26" },
  { id:"uchkan7043", phpId:"1317043", name:"Uchechi Kanu", pin:"7043", role:"trainee", level:10, uplineId:"augalo1298", email:"uchechikanu20@gmail.com", phone:"3109948626", enrollmentDate:"2025-01-28" },
  { id:"stahor6389", phpId:"1316389", name:"Stacy Horton", pin:"6389", role:"trainee", level:10, uplineId:"bli001", email:"stacy.j.horton05@gmail.com", phone:"3104209898", enrollmentDate:"2025-01-22" },
  { id:"tifhin6388", phpId:"1316388", name:"Tiffany Hines", pin:"6388", role:"trainee", level:10, uplineId:"", email:"tiffanyhines.az1@gmail.com", phone:"3106289149", enrollmentDate:"2025-01-22" },
  { id:"niahen6362", phpId:"1316362", name:"Nia Henson", pin:"6362", role:"trainee", level:10, uplineId:"", email:"niahenson.0@gmail.com", phone:"9094779574", enrollmentDate:"2025-01-22" },
  { id:"vivany5779", phpId:"1315779", name:"Vivian Ahuzizeronwu Anyanwu", pin:"5779", role:"trainee", level:10, uplineId:"bli001", email:"vivianchidera36@gmail.com", phone:"4243749445", enrollmentDate:"2025-01-18" },
  { id:"pauanu4466", phpId:"1314466", name:"Paula C Anugo", pin:"4466", role:"trainee", level:10, uplineId:"augalo1298", email:"paulaanugo@yahoo.com", phone:"5168082680", enrollmentDate:"2025-01-10" },
  { id:"faljul4220", phpId:"1314220", name:"Fallone Julien", pin:"4220", role:"trainee", level:10, uplineId:"bli001", email:"fallone.julien@yahoo.com", phone:"6093317006", enrollmentDate:"2025-01-09" },
  { id:"passch3926", phpId:"1313926", name:"Passion Schoolfield", pin:"3926", role:"trainee", level:10, uplineId:"bli001", email:"passionschoolfield@gmail.com", phone:"6026709856", enrollmentDate:"2025-01-06" },
  { id:"biaala2167", phpId:"1312167", name:"Bianca Middelijn Alaniz", pin:"2167", role:"trainee", level:10, uplineId:"", email:"blancamiddelijn8@gmail.com", phone:"2144909196", enrollmentDate:"2024-12-24" },
  { id:"chiume2039", phpId:"1312039", name:"Chizoma Umerie", pin:"2039", role:"trainee", level:10, uplineId:"olialo3950", email:"chizoma_umerie@yahoo.com", phone:"6196577637", enrollmentDate:"2024-12-23" },
  { id:"janbro1600", phpId:"1311600", name:"Janie Brown", pin:"1600", role:"trainee", level:10, uplineId:"elfndu8547", email:"abundantnotaryonwheels@mail.com", phone:"5102906480", enrollmentDate:"2024-12-18" },
  { id:"spebel1599", phpId:"1311599", name:"Spencer Bello", pin:"1599", role:"trainee", level:10, uplineId:"jefuli1597", email:"bellospencer@yahoo.com", phone:"8187915463", enrollmentDate:"2024-12-18" },
  { id:"jefuli1597", phpId:"1311597", name:"Jeffrey Uliem", pin:"1597", role:"trainee", level:10, uplineId:"olialo3950", email:"lucas14_uliem@yahoo.com", phone:"8184778286", enrollmentDate:"2024-12-18" },
  { id:"stapas8242", phpId:"1308242", name:"Stacy Paschal-washington", pin:"8242", role:"trainee", level:10, uplineId:"edioke0512", email:"missmarie819@gmail.com", phone:"3107028781", enrollmentDate:"2024-11-21" },
  { id:"kevcos7822", phpId:"1307822", name:"Kevin Costanza", pin:"7822", role:"trainee", level:10, uplineId:"bli001", email:"kevincostanza1@gmail.com", phone:"3233457359", enrollmentDate:"2024-11-18" },
  { id:"mauphi7527", phpId:"1307527", name:"Maureen Phillips", pin:"7527", role:"trainee", level:10, uplineId:"", email:"kuikahash@yahoo.com", phone:"3106223352", enrollmentDate:"2024-11-16" },
  { id:"jalhey7251", phpId:"1307251", name:"Jalen Heyward", pin:"7251", role:"trainee", level:10, uplineId:"chialo3971", email:"heyward.jalen@gmail.com", phone:"9195257665", enrollmentDate:"2024-11-13" },
  { id:"emmnwo6963", phpId:"1306963", name:"Emmanuel Divine Nwoko", pin:"6963", role:"trainee", level:10, uplineId:"stenwo4767", email:"divinehooper26@gmail.com", phone:"9514169786", enrollmentDate:"2024-11-11" },
  { id:"emmnwo6958", phpId:"1306958", name:"Emmanuel Nwoko", pin:"6958", role:"trainee", level:10, uplineId:"stenwo4767", email:"enwoko21@gmail.com", phone:"6264280161", enrollmentDate:"2024-11-11" },
  { id:"chaokp6927", phpId:"1306927", name:"Charity Okpara", pin:"6927", role:"trainee", level:10, uplineId:"chiiko8228", email:"elroihomecare@gmail.com", phone:"4243969893", enrollmentDate:"2024-11-11" },
  { id:"dennno6906", phpId:"1306906", name:"Denice Nnomadim", pin:"6906", role:"trainee", level:10, uplineId:"chiiko8228", email:"denice_nneka@yahoo.com", phone:"9098527181", enrollmentDate:"2024-11-11" },
  { id:"pauuba6010", phpId:"1306010", name:"Pauline Ubani", pin:"6010", role:"trainee", level:10, uplineId:"stenwo4767", email:"ubanipauline@gmail.com", phone:"6264225663", enrollmentDate:"2024-11-09" },
  { id:"prechi5953", phpId:"1305953", name:"Precious Chigaemezu", pin:"5953", role:"trainee", level:10, uplineId:"chialo3971", email:"preciousngozi72@gmail.com", phone:"3109785270", enrollmentDate:"2024-11-09" },
  { id:"stenwo4767", phpId:"1304767", name:"Stella Nwoko", pin:"4767", role:"field_associate", level:30, uplineId:"chiiko8228", email:"fefe22.sn@gmail.com", phone:"6264280029", enrollmentDate:"2024-11-04" },
  { id:"beroko3184", phpId:"1303184", name:"Bernard Okonkwo", pin:"3184", role:"trainee", level:10, uplineId:"euceke9049", email:"bernardokonkwo2@gmail.com", phone:"4245710155", enrollmentDate:"2024-10-31" },
  { id:"shajim2962", phpId:"1302962", name:"Shamsudeen I. Jimoh", pin:"2962", role:"trainee", level:10, uplineId:"bli001", email:"sabojim484@gmail.com", phone:"3238189367", enrollmentDate:"2024-10-30" },
  { id:"andibu2863", phpId:"1302863", name:"Andrew Ibude", pin:"2863", role:"trainee", level:10, uplineId:"petnwo0887", email:"ibudeandrew77@gmail.com", phone:"7473644929", enrollmentDate:"2024-10-30" },
  { id:"vireke2816", phpId:"1302816", name:"Virginia Eke", pin:"2816", role:"trainee", level:10, uplineId:"euceke9049", email:"urfinancialwoman@gmail.com", phone:"5102219307", enrollmentDate:"2024-10-29" },
  { id:"esteke2810", phpId:"1302810", name:"Esther Eke-Huber", pin:"2810", role:"trainee", level:10, uplineId:"euceke9049", email:"nkajaachumma64@gmail.com", phone:"8329083707", enrollmentDate:"2024-10-29" },
  { id:"vivrub2809", phpId:"1302809", name:"Vivien Rubio", pin:"2809", role:"trainee", level:10, uplineId:"euceke9049", email:"vivien.e.rubio@gmail.com", phone:"7602200507", enrollmentDate:"2024-10-29" },
  { id:"steeke2616", phpId:"1302616", name:"Stephanie Ekenze", pin:"2616", role:"trainee", level:10, uplineId:"olueke3453", email:"stephanie.ekenze@gmail.com", phone:"6177635437", enrollmentDate:"2024-10-28" },
  { id:"sebeke2612", phpId:"1302612", name:"Sebastian Ekenze", pin:"2612", role:"trainee", level:10, uplineId:"olueke3453", email:"sebekenze@gmail.com", phone:"6615239808", enrollmentDate:"2024-10-28" },
  { id:"kenkat2466", phpId:"1302466", name:"Kenneth Katas", pin:"2466", role:"trainee", level:10, uplineId:"bli001", email:"kenkatas@gmail.com", phone:"7144085727", enrollmentDate:"2024-10-26" },
  { id:"nixmuh1221", phpId:"1301221", name:"Nixon Kekeni Muhatia", pin:"1221", role:"trainee", level:10, uplineId:"bli001", email:"nkekeni@yahoo.com", phone:"2097924835", enrollmentDate:"2024-10-16" },
  { id:"innoke1107", phpId:"1301107", name:"Innocentia Obiageli Okere", pin:"1107", role:"trainee", level:10, uplineId:"euceke9049", email:"innocentiaokere77@gmail.com", phone:"4706249547", enrollmentDate:"2024-10-16" },
  { id:"clieke1064", phpId:"1301064", name:"Clifford Eke", pin:"1064", role:"trainee", level:10, uplineId:"euceke9049", email:"eleganzacosmetics@yahoo.com", phone:"9096330030", enrollmentDate:"2024-10-16" },
  { id:"ajuosu1027", phpId:"1301027", name:"Ajuka Osuji", pin:"1027", role:"trainee", level:10, uplineId:"euceke9049", email:"adasbeautyroom@gmail.com", phone:"9097253382", enrollmentDate:"2024-10-16" },
  { id:"petnwo0887", phpId:"1300887", name:"Peter Nwosu", pin:"0887", role:"trainee", level:10, uplineId:"euceke9049", email:"petersonjames7044@myyahoo.com", phone:"4243358078", enrollmentDate:"2024-10-16" },
  { id:"adetor9451", phpId:"1299451", name:"Adewale Toriola", pin:"9451", role:"trainee", level:10, uplineId:"euceke9049", email:"atoriola17@gmail.com", phone:"2676158469", enrollmentDate:"2024-10-10" },
  { id:"thaulo9436", phpId:"1299436", name:"Thaddaeus Uloko", pin:"9436", role:"trainee", level:10, uplineId:"bli001", email:"teddyuloko@yahoo.com", phone:"3477773971", enrollmentDate:"2024-10-10" },
  { id:"maxono8716", phpId:"1298716", name:"Maxwell Ononiwu", pin:"8716", role:"trainee", level:10, uplineId:"olialo3950", email:"mononiwu@outlook.com", phone:"6178423548", enrollmentDate:"2024-10-05" },
  { id:"akuari8301", phpId:"1298301", name:"Akunna Arinze-okoye", pin:"8301", role:"trainee", level:10, uplineId:"olueke3453", email:"akunnaarinzeokoye@gmail.com", phone:"8329608082", enrollmentDate:"2024-10-02" },
  { id:"raumax8269", phpId:"1298269", name:"Raul Maximo", pin:"8269", role:"trainee", level:10, uplineId:"sarbur2192", email:"raulmaximo7@gmail.com", phone:"3107067505", enrollmentDate:"2024-10-01" },
  { id:"eraibe8018", phpId:"1298018", name:"Erasmus Ibebuike", pin:"8018", role:"trainee", level:10, uplineId:"markuf5790", email:"iberasmus@yahoo.com", phone:"3232727092", enrollmentDate:"2024-10-01" },
  { id:"morolo7994", phpId:"1297994", name:"MOROMOKE Olowookere", pin:"7994", role:"trainee", level:10, uplineId:"markuf5790", email:"rumrumquize@yahoo.com", phone:"3107067113", enrollmentDate:"2024-10-01" },
  { id:"adwass7679", phpId:"1297679", name:"Adwubi Osei Assibey", pin:"7679", role:"trainee", level:10, uplineId:"markuf5790", email:"k_aoa@yahoo.com", phone:"7142545087", enrollmentDate:"2024-10-01" },
  { id:"samola7004", phpId:"1297004", name:"Samuel Olawuyi", pin:"7004", role:"trainee", level:10, uplineId:"osidan1380", email:"kennyblackdud@gmail.com", phone:"3235729542", enrollmentDate:"2024-09-26" },
  { id:"jodste6580", phpId:"1296580", name:"Jodi Steo", pin:"6580", role:"trainee", level:10, uplineId:"chiiko8228", email:"jodisteo@gmail.com", phone:"2089707300", enrollmentDate:"2024-09-23" },
  { id:"eniawo4265", phpId:"1294265", name:"Eniola Awobayiku", pin:"4265", role:"trainee", level:10, uplineId:"augalo1298", email:"sutofarogbe@yahoo.com", phone:"5109674227", enrollmentDate:"2024-09-07" },
  { id:"olueke3453", phpId:"1293453", name:"Oluchi Ekenze", pin:"3453", role:"associate", level:20, uplineId:"chiiko8228", email:"olykenz@gmail.com", phone:"6616440461", enrollmentDate:"2024-09-04" },
  { id:"samoka3339", phpId:"1293339", name:"Samuel Okafor", pin:"3339", role:"trainee", level:10, uplineId:"chiiko8228", email:"samuel.esther.okafor@gmail.com", phone:"3105602816", enrollmentDate:"2024-09-02" },
  { id:"chiiko3301", phpId:"1293301", name:"Chijioke Ikonte", pin:"3301", role:"trainee", level:10, uplineId:"chiiko0525", email:"coikonte@gmail.com", phone:"9095491005", enrollmentDate:"2024-09-02" },
  { id:"chiiko3300", phpId:"1293300", name:"Chibuzo Ikonte", pin:"3300", role:"trainee", level:10, uplineId:"chiiko0525", email:"chibuzoikonte@gmail.com", phone:"9098278707", enrollmentDate:"2024-09-02" },
  { id:"chiiko3298", phpId:"1293298", name:"Chiemeziem Ikonte", pin:"3298", role:"trainee", level:10, uplineId:"chiiko0525", email:"chiemeziemikonte@gmail.com", phone:"9096359934", enrollmentDate:"2024-09-02" },
  { id:"sannno3287", phpId:"1293287", name:"Sandra Nnomadim", pin:"3287", role:"trainee", level:10, uplineId:"ngonno1584", email:"snnenna1@gmail.com", phone:"9098527031", enrollmentDate:"2024-09-02" },
  { id:"chiiko3110", phpId:"1293110", name:"Chijioke Ikonte", pin:"3110", role:"trainee", level:10, uplineId:"chiiko8228", email:"cikonte@yahoo.com", phone:"2132802088", enrollmentDate:"2024-09-01" },
  { id:"sarsan2604", phpId:"1292604", name:"Sara Sanchez", pin:"2604", role:"trainee", level:10, uplineId:"matgas7445", email:"s_sanchez69@hotmail.com", phone:"6193794139", enrollmentDate:"2024-09-01" },
  { id:"joyokp2537", phpId:"1292537", name:"Joyce Nwadiuto Okpara", pin:"2537", role:"trainee", level:10, uplineId:"edioke0512", email:"nwadiutoj@yahoo.com", phone:"9096383461", enrollmentDate:"2024-09-01" },
  { id:"racgas2412", phpId:"1292412", name:"RACHELLE Gaston", pin:"2412", role:"trainee", level:10, uplineId:"matgas7445", email:"jrachelleg42@gmail.com", phone:"7276557058", enrollmentDate:"2024-09-01" },
  { id:"imeetu2155", phpId:"1292155", name:"Imeh Etudoh", pin:"2155", role:"trainee", level:10, uplineId:"adeetu2136", email:"imeh.etudoh@gmail.com", phone:"6264652744", enrollmentDate:"2024-08-31" },
  { id:"adeetu2136", phpId:"1292136", name:"Adebisi Etudoh", pin:"2136", role:"trainee", level:10, uplineId:"bli001", email:"aseurimi@gmail.com", phone:"6264357527", enrollmentDate:"2024-08-31" },
  { id:"ngonno1584", phpId:"1291584", name:"Ngozi Nnomadim", pin:"1584", role:"trainee", level:10, uplineId:"chiiko8228", email:"okparanc76@yahoo.com", phone:"9098527022", enrollmentDate:"2024-08-29" },
  { id:"osidan1380", phpId:"1291380", name:"Osita Daniel-Nwulu", pin:"1380", role:"trainee", level:10, uplineId:"markuf5790", email:"cynnies@sbcglobal.net", phone:"5622217082", enrollmentDate:"2024-08-28" },
  { id:"chiiko0525", phpId:"1290525", name:"Chidinma Ikonte", pin:"0525", role:"associate", level:20, uplineId:"chiiko8228", email:"chidinma_ikonte@yahoo.com", phone:"9512845055", enrollmentDate:"2024-08-22" },
  { id:"edioke0512", phpId:"1290512", name:"Edison Okeh", pin:"0512", role:"trainee", level:10, uplineId:"chiiko8228", email:"okehedison@gmail.com", phone:"5627629077", enrollmentDate:"2024-08-22" },
  { id:"chiokw9737", phpId:"1289737", name:"Chifurumnanya Okwuobu", pin:"9737", role:"trainee", level:10, uplineId:"chiiko8228", email:"arno9st@gmail.com", phone:"9099400150", enrollmentDate:"2024-08-17" },
  { id:"olieke9153", phpId:"1289153", name:"Olivia Eke", pin:"9153", role:"trainee", level:10, uplineId:"euceke9049", email:"oliviaeke23@icloud.com", phone:"9096333469", enrollmentDate:"2024-08-14" },
  { id:"easban8416", phpId:"1288416", name:"Easton Bancroft", pin:"8416", role:"trainee", level:10, uplineId:"matgas7445", email:"ignaciobancroft@yahoo.com", phone:"4243915623", enrollmentDate:"2024-08-03" },
  { id:"chiiko8228", phpId:"1288228", name:"Chioma Ikonte", pin:"8228", role:"field_associate", level:30, uplineId:"bli001", email:"chioma_ikonte@yahoo.com", phone:"6615420828", enrollmentDate:"2024-08-02" },
  { id:"matgas7445", phpId:"1287445", name:"Mathaus Gaston", pin:"7445", role:"associate", level:20, uplineId:"bli001", email:"mathausgaston@gmail.com", phone:"3238071463", enrollmentDate:"2024-07-31" },
  { id:"racril6919", phpId:"1286919", name:"Rachel Riley", pin:"6919", role:"trainee", level:10, uplineId:"johoko5456", email:"pinklad11@yahoo.com", phone:"9092407939", enrollmentDate:"2024-07-26" },
  { id:"munagh5591", phpId:"1285591", name:"Munachimso Aghasili", pin:"5591", role:"trainee", level:10, uplineId:"", email:"aghasilim@gmail.com", phone:"2096848591", enrollmentDate:"2024-07-16" },
  { id:"ruttem5308", phpId:"1285308", name:"Ruth Deborah Tembo", pin:"5308", role:"trainee", level:10, uplineId:"", email:"deborahrtembo@gmail.com", phone:"8184510677", enrollmentDate:"2024-07-15" },
  { id:"eliima4786", phpId:"1284786", name:"Elizabeth Imaa", pin:"4786", role:"trainee", level:10, uplineId:"bli001", email:"lizimaa@hotmail.com", phone:"6266646658", enrollmentDate:"2024-07-11" },
  { id:"joywat4389", phpId:"1284389", name:"Joy Watson", pin:"4389", role:"trainee", level:10, uplineId:"", email:"thisisjoyuk@yahoo.co.uk", phone:"6402020331", enrollmentDate:"2024-07-08" },
  { id:"chiibe3810", phpId:"1283810", name:"Chinasa Ibeabuchi", pin:"3810", role:"trainee", level:10, uplineId:"bli001", email:"zinnyicecool@gmail.com", phone:"7472356819", enrollmentDate:"2024-07-03" },
  { id:"ruljef3558", phpId:"1283558", name:"Rulon` Jeffs", pin:"3558", role:"trainee", level:10, uplineId:"mickha7489", email:"geoffreysruleon@gmail.com", phone:"4355256376", enrollmentDate:"2024-07-01" },
  { id:"jofgon2327", phpId:"1282327", name:"Jofer Gonzalez", pin:"2327", role:"trainee", level:10, uplineId:"bli001", email:"jofer2264@gmail.com", phone:"4699520863", enrollmentDate:"2024-06-29" },
  { id:"lovgor1694", phpId:"1281694", name:"Lovette Gordon", pin:"1694", role:"trainee", level:10, uplineId:"bli001", email:"gordonlove24@gmail.com", phone:"3104389961", enrollmentDate:"2024-06-26" },
  { id:"nahnko1414", phpId:"1281414", name:"Nahtali-Noel Ebai Nkongho", pin:"1414", role:"trainee", level:10, uplineId:"bli001", email:"n.nkongho@yahoo.com", phone:"9172467015", enrollmentDate:"2024-06-24" },
  { id:"nhuluu1165", phpId:"1281165", name:"Nhung Luu", pin:"1165", role:"trainee", level:10, uplineId:"", email:"michelleyluu@gmail.com", phone:"8182633142", enrollmentDate:"2024-06-22" },
  { id:"karmir1136", phpId:"1281136", name:"Kara Miranda", pin:"1136", role:"trainee", level:10, uplineId:"mohjab1493", email:"karamiaquerida@yahoo.com", phone:"6267332705", enrollmentDate:"2024-06-21" },
  { id:"ihedur0821", phpId:"1280821", name:"Iheanyi Duru", pin:"0821", role:"trainee", level:10, uplineId:"johoko5456", email:"uzohwuihe@yahoo.com", phone:"3236758217", enrollmentDate:"2024-06-19" },
  { id:"danbai7893", phpId:"1277893", name:"Daniel Baird", pin:"7893", role:"trainee", level:10, uplineId:"", email:"danielbaird6@gmail.com", phone:"8432296029", enrollmentDate:"2024-06-10" },
  { id:"carfar7153", phpId:"1277153", name:"Carlos Farias", pin:"7153", role:"trainee", level:10, uplineId:"diagod3893", email:"itofaruga@gmail.com", phone:"4244857469", enrollmentDate:"2024-06-05" },
  { id:"meltay5826", phpId:"1275826", name:"Melanie Taylor", pin:"5826", role:"trainee", level:10, uplineId:"", email:"meleahnee@gmail.com", phone:"2133785098", enrollmentDate:"2024-06-01" },
  { id:"jenbak5696", phpId:"1275696", name:"Jennifer Baker", pin:"5696", role:"trainee", level:10, uplineId:"jaiwil3223", email:"baker21jennifer@gmail.com", phone:"3232135428", enrollmentDate:"2024-06-01" },
  { id:"desdou5579", phpId:"1275579", name:"Deshaune Douver", pin:"5579", role:"trainee", level:10, uplineId:"bli001", email:"deshaunedouve@gmail.com", phone:"3236163064", enrollmentDate:"2024-06-01" },
  { id:"haskha5521", phpId:"1275521", name:"Hassan Khayat", pin:"5521", role:"trainee", level:10, uplineId:"mickha7489", email:"mickel.1@hotmail.com", phone:"3108046305", enrollmentDate:"2024-06-01" },
  { id:"bronel5307", phpId:"1275307", name:"Broderick Nelson", pin:"5307", role:"trainee", level:10, uplineId:"jaiwil3223", email:"brodericknelson34@gmail.com", phone:"5623104933", enrollmentDate:"2024-05-31" },
  { id:"taysar5023", phpId:"1275023", name:"Taylor Sarakaitis", pin:"5023", role:"trainee", level:10, uplineId:"mohjab1493", email:"taylorsarakaitis@gmail.com", phone:"9098011694", enrollmentDate:"2024-05-31" },
  { id:"mermed4771", phpId:"1274771", name:"Mercedes Medrano", pin:"4771", role:"trainee", level:10, uplineId:"jaiwil3223", email:"mmedrano0503@gmail.com", phone:"6264789438", enrollmentDate:"2024-05-30" },
  { id:"vicphi4612", phpId:"1274612", name:"Victoria Phinney", pin:"4612", role:"trainee", level:10, uplineId:"mohjab1493", email:"victoriaphinney@gmail.com", phone:"9099735889", enrollmentDate:"2024-05-30" },
  { id:"mohmor4544", phpId:"1274544", name:"Mohammad Mortada", pin:"4544", role:"trainee", level:10, uplineId:"mickha7489", email:"mohammadqazwini@icloud.com", phone:"9096557858", enrollmentDate:"2024-05-29" },
  { id:"estsot4408", phpId:"1274408", name:"Estela Soto", pin:"4408", role:"trainee", level:10, uplineId:"mohjab1493", email:"gabrielasoto22@yahoo.com", phone:"5625766212", enrollmentDate:"2024-05-29" },
  { id:"rafqui4406", phpId:"1274406", name:"Rafael Gonzalo Rivera Quintanilla", pin:"4406", role:"trainee", level:10, uplineId:"mickha7489", email:"riverarafael7@icloud.com", phone:"2135396789", enrollmentDate:"2024-05-29" },
  { id:"jazalv4194", phpId:"1274194", name:"Jazmine Alvarado", pin:"4194", role:"trainee", level:10, uplineId:"mohjab1493", email:"jazminealvarado04@gmail.com", phone:"5628376091", enrollmentDate:"2024-05-28" },
  { id:"catlun3979", phpId:"1273979", name:"Catherine Luna", pin:"3979", role:"trainee", level:10, uplineId:"mohjab1493", email:"cathyluna1103@gmail.com", phone:"9094619968", enrollmentDate:"2024-05-26" },
  { id:"denrob3902", phpId:"1273902", name:"Denita Roberts", pin:"3902", role:"trainee", level:10, uplineId:"aliwar3888", email:"1970droberts@gmail.com", phone:"3234235858", enrollmentDate:"2024-05-25" },
  { id:"lauros3894", phpId:"1273894", name:"Laura Rosa", pin:"3894", role:"trainee", level:10, uplineId:"chialo3971", email:"lalefieve@gmail.com", phone:"7472506281", enrollmentDate:"2024-05-25" },
  { id:"diagod3893", phpId:"1273893", name:"Diana Godinez", pin:"3893", role:"trainee", level:10, uplineId:"mohjab1493", email:"godinezalexadiana@gmail.com", phone:"9096709771", enrollmentDate:"2024-05-25" },
  { id:"jersmi3892", phpId:"1273892", name:"Jeremiah Smith", pin:"3892", role:"trainee", level:10, uplineId:"jaiwil3223", email:"jeremiaha.smith@outlook.com", phone:"4243515204", enrollmentDate:"2024-05-25" },
  { id:"aliwar3888", phpId:"1273888", name:"Alice Warkie", pin:"3888", role:"trainee", level:10, uplineId:"taiodu0781", email:"alicewarkie115@gmail.com", phone:"7605346734", enrollmentDate:"2024-05-25" },
  { id:"kaysky3586", phpId:"1273586", name:"Kaycee Keneth Skyeagle", pin:"3586", role:"trainee", level:10, uplineId:"", email:"kayceegroupinc@gmail.com", phone:"8323354098", enrollmentDate:"2024-05-24" },
  { id:"alijab3226", phpId:"1273226", name:"Ali Jaber", pin:"3226", role:"trainee", level:10, uplineId:"mickha7489", email:"alijaber22@yahoo.com", phone:"6262413349", enrollmentDate:"2024-05-22" },
  { id:"jaiwil3223", phpId:"1273223", name:"Jai Treone Williams", pin:"3223", role:"associate", level:20, uplineId:"", email:"callmejai19@gmail.com", phone:"3235901314", enrollmentDate:"2024-05-22" },
  { id:"sarbur2192", phpId:"1272192", name:"Sara Burgos", pin:"2192", role:"trainee", level:10, uplineId:"mickha7489", email:"sara_burgos@yahoo.com", phone:"3105673951", enrollmentDate:"2024-05-13" },
  { id:"jimjab2038", phpId:"1272038", name:"Jimmy Jaber", pin:"2038", role:"trainee", level:10, uplineId:"mickha7489", email:"blackstonent1@gmail.com", phone:"3104359939", enrollmentDate:"2024-05-11" },
  { id:"mohjab1493", phpId:"1271493", name:"Mohamad Jaber", pin:"1493", role:"director", level:40, uplineId:"mickha7489", email:"mjaber33@yahoo.com", phone:"6262413869", enrollmentDate:"2024-05-08" },
  { id:"ogoonw1007", phpId:"1271007", name:"Ogochukwu Kingsley Onwo", pin:"1007", role:"trainee", level:10, uplineId:"yoenkw8585", email:"ogoc1991@gmail.com", phone:"3234929145", enrollmentDate:"2024-05-04" },
  { id:"adrflo0032", phpId:"1270032", name:"Adrian Flores", pin:"0032", role:"trainee", level:10, uplineId:"mickha7489", email:"aflores5252@gmail.com", phone:"9499734754", enrollmentDate:"2024-05-01" },
  { id:"uloisa9467", phpId:"1269467", name:"Uloma Isang", pin:"9467", role:"trainee", level:10, uplineId:"chialo3971", email:"isanguloma@gmail.com", phone:"6198171427", enrollmentDate:"2024-04-30" },
  { id:"alikha9086", phpId:"1269086", name:"Ali Khayat", pin:"9086", role:"trainee", level:10, uplineId:"mickha7489", email:"alisamkhayat@unclesamgabon.com", phone:"3108740804", enrollmentDate:"2024-04-29" },
  { id:"benaka8767", phpId:"1268767", name:"Benjamine Aka", pin:"8767", role:"trainee", level:10, uplineId:"sopaka7077", email:"bencheka@aol.com", phone:"3238546041", enrollmentDate:"2024-04-27" },
  { id:"lizflo8756", phpId:"1268756", name:"Lizet Florentino", pin:"8756", role:"trainee", level:10, uplineId:"", email:"lizet.florentino1991@gmail.com", phone:"2139524100", enrollmentDate:"2024-04-27" },
  { id:"yoenkw8585", phpId:"1268585", name:"Yoel Emmanuel Nkwocha", pin:"8585", role:"trainee", level:10, uplineId:"sopaka7077", email:"nkwowhite@gmail.com", phone:"2136714163", enrollmentDate:"2024-04-27" },
  { id:"haykha8411", phpId:"1268411", name:"Hayat Khayat", pin:"8411", role:"trainee", level:10, uplineId:"mickha7489", email:"hayatdaisy@yahoo.com", phone:"6264281885", enrollmentDate:"2024-04-26" },
  { id:"elioco7992", phpId:"1267992", name:"Eliza O'Connor", pin:"7992", role:"trainee", level:10, uplineId:"nahjos8827", email:"elizarocha.oconnor@gmail.com", phone:"6463714800", enrollmentDate:"2024-04-23" },
  { id:"mickha7489", phpId:"1267489", name:"Mickel Khayat", pin:"7489", role:"director", level:40, uplineId:"bli001", email:"mkhayat@fasakha.com", phone:"3108907742", enrollmentDate:"2024-04-18" },
  { id:"sopaka7077", phpId:"1267077", name:"Sophia Chidinma Chinyere Aka", pin:"7077", role:"field_associate", level:30, uplineId:"bli001", email:"sophiaakaphp@gmail.com", phone:"2134561578", enrollmentDate:"2024-04-17" },
  { id:"chabro5950", phpId:"1265950", name:"Chavonne Brown", pin:"5950", role:"trainee", level:10, uplineId:"micedw8462", email:"acinsured@proton.me", phone:"9083076958", enrollmentDate:"2024-04-10" },
  { id:"kimtho5392", phpId:"1265392", name:"Kimberley Thomas", pin:"5392", role:"trainee", level:10, uplineId:"nahjos8827", email:"kimytthomas@gmail.com", phone:"2019230537", enrollmentDate:"2024-04-08" },
  { id:"jacblo4024", phpId:"1264024", name:"Jacqueline Blockson", pin:"4024", role:"trainee", level:10, uplineId:"marbat8887", email:"chocolatedrop899@yahoo.com", phone:"3233158877", enrollmentDate:"2024-04-01" },
  { id:"jefoka2817", phpId:"1262817", name:"Jeff Okam", pin:"2817", role:"trainee", level:10, uplineId:"augalo1298", email:"nwora7@yahoo.com", phone:"6195650932", enrollmentDate:"2024-03-31" },
  { id:"wilalo2800", phpId:"1262800", name:"William Alozie", pin:"2800", role:"trainee", level:10, uplineId:"olialo3950", email:"walozie@yahoo.com", phone:"6197579455", enrollmentDate:"2024-03-31" },
  { id:"casmer2221", phpId:"1262221", name:"Castillo Villegas Yikaury Mercedes", pin:"2221", role:"trainee", level:10, uplineId:"rossan5715", email:"castillovillegasyikaury@gmail.com", phone:"7325582527", enrollmentDate:"2024-03-30" },
  { id:"davtan2104", phpId:"1262104", name:"David Tangarife", pin:"2104", role:"trainee", level:10, uplineId:"rossan5715", email:"davidtangarife26@gmail.com", phone:"9084255033", enrollmentDate:"2024-03-30" },
  { id:"dorgod1734", phpId:"1261734", name:"Dorothy Godwin", pin:"1734", role:"trainee", level:10, uplineId:"", email:"dalaribe@yahoo.com", phone:"8186694322", enrollmentDate:"2024-03-28" },
  { id:"chrnun1556", phpId:"1261556", name:"Chris Nunez", pin:"1556", role:"trainee", level:10, uplineId:"micedw8462", email:"chris.nunez815@gmail.com", phone:"7187721929", enrollmentDate:"2024-03-28" },
  { id:"josalo1551", phpId:"1261551", name:"Josephine Alozie", pin:"1551", role:"trainee", level:10, uplineId:"olialo3950", email:"joebestmkt@yahoo.com", phone:"5165476984", enrollmentDate:"2024-03-28" },
  { id:"ifenkw9807", phpId:"1259807", name:"Ifeoma Nkwocha", pin:"9807", role:"trainee", level:10, uplineId:"olialo3950", email:"ifeoma0505@gmail.com", phone:"8052595198", enrollmentDate:"2024-03-16" },
  { id:"ciamul9458", phpId:"1259458", name:"Ciara Mullen", pin:"9458", role:"trainee", level:10, uplineId:"ugomad0222", email:"ciaramlln@outlook.com", phone:"4086791687", enrollmentDate:"2024-03-16" },
  { id:"terarm7856", phpId:"1257856", name:"Terry Armstead", pin:"7856", role:"trainee", level:10, uplineId:"marbat8887", email:"sueetmeat@gmail.com", phone:"3107551429", enrollmentDate:"2024-03-16" },
  { id:"danbat7779", phpId:"1257779", name:"Danilo Batson", pin:"7779", role:"trainee", level:10, uplineId:"marbat8887", email:"djbatson19@gmail.com", phone:"5625081256", enrollmentDate:"2024-03-16" },
  { id:"lilchu7552", phpId:"1257552", name:"Lily Chukwuneke", pin:"7552", role:"trainee", level:10, uplineId:"oluuzo7425", email:"nikkyhi234@gmail.com", phone:"3478532791", enrollmentDate:"2024-03-15" },
  { id:"emenwe7539", phpId:"1257539", name:"EMEKA Nweke", pin:"7539", role:"trainee", level:10, uplineId:"johoko5456", email:"nestengltd@gmail.com", phone:"3235234047", enrollmentDate:"2024-03-15" },
  { id:"lesmcc6772", phpId:"1256772", name:"Leslie McCarthy", pin:"6772", role:"trainee", level:10, uplineId:"johoko5456", email:"mccarthylesles@yahoo.com", phone:"5623880778", enrollmentDate:"2024-03-15" },
  { id:"brinwa6629", phpId:"1256629", name:"Bridget Nwagbo", pin:"6629", role:"trainee", level:10, uplineId:"johoko5456", email:"bchineze@hotmail.com", phone:"5053408792", enrollmentDate:"2024-03-15" },
  { id:"glodeg6613", phpId:"1256613", name:"Gloria Goodman De-Graft", pin:"6613", role:"trainee", level:10, uplineId:"johoko5456", email:"glopatt@yahoo.com", phone:"5624796586", enrollmentDate:"2024-03-15" },
  { id:"emmuzo6112", phpId:"1256112", name:"Emmanuel Uzor", pin:"6112", role:"trainee", level:10, uplineId:"oluuzo7425", email:"mekstrust@yahoo.com", phone:"9295365153", enrollmentDate:"2024-03-13" },
  { id:"onyibe5648", phpId:"1255648", name:"Onyinyechi Irene Ibediro", pin:"5648", role:"trainee", level:10, uplineId:"markuf5790", email:"onyi.ire@gmail.com", phone:"3234121769", enrollmentDate:"2024-03-12" },
  { id:"valaka5481", phpId:"1255481", name:"Valerian Chidera Aka", pin:"5481", role:"trainee", level:10, uplineId:"doraka5476", email:"valerianholea50@gmail.com", phone:"8182175645", enrollmentDate:"2024-03-12" },
  { id:"doraka5476", phpId:"1255476", name:"Doris Aka", pin:"5476", role:"trainee", level:10, uplineId:"", email:"vindoris82@yahoo.com", phone:"4242445756", enrollmentDate:"2024-03-12" },
  { id:"kevosu5103", phpId:"1255103", name:"Kevin Uchechukwu Osuji", pin:"5103", role:"trainee", level:10, uplineId:"johoko5456", email:"osuji77@gmail.com", phone:"7732955539", enrollmentDate:"2024-03-10" },
  { id:"debyeb4732", phpId:"1254732", name:"Debora Yeboah", pin:"4732", role:"trainee", level:10, uplineId:"markuf5790", email:"princessyeboah22@gmail.com", phone:"5625567141", enrollmentDate:"2024-03-09" },
  { id:"debmon3344", phpId:"1253344", name:"Deborah Ann Montgomery", pin:"3344", role:"trainee", level:10, uplineId:"olialo3950", email:"debbannmon@yahoo.com", phone:"3234720415", enrollmentDate:"2024-03-02" },
  { id:"sunnwu3098", phpId:"1253098", name:"Sunday Nwufo", pin:"3098", role:"trainee", level:10, uplineId:"bli001", email:"nwufochinedu@gmail.com", phone:"9087020030", enrollmentDate:"2024-03-01" },
  { id:"samban9016", phpId:"1249016", name:"Samuel Banahene", pin:"9016", role:"trainee", level:10, uplineId:"johoko5456", email:"s.banahene@yahoo.com", phone:"9142954126", enrollmentDate:"2024-02-17" },
  { id:"marbat8887", phpId:"1248887", name:"Marleen Batson", pin:"8887", role:"associate", level:20, uplineId:"bli001", email:"mbatson63@gmail.com", phone:"5625081258", enrollmentDate:"2024-02-17" },
  { id:"vicnne8597", phpId:"1248597", name:"Victoria Nnebe", pin:"8597", role:"trainee", level:10, uplineId:"", email:"uzjnnebe@gmail.com", phone:"8189235192", enrollmentDate:"2024-02-16" },
  { id:"oluuzo7425", phpId:"1247425", name:"Oluchukwu Uzor", pin:"7425", role:"associate", level:20, uplineId:"", email:"lucheezebeauty@gmail.com", phone:"3479827464", enrollmentDate:"2024-02-15" },
  { id:"susdon6747", phpId:"1246747", name:"Susana Donis", pin:"6747", role:"trainee", level:10, uplineId:"vicchi4669", email:"susana3jc@yahoo.com", phone:"3232109642", enrollmentDate:"2024-02-14" },
  { id:"ifunwe6190", phpId:"1246190", name:"Ifunanya Nweke", pin:"6190", role:"trainee", level:10, uplineId:"nkeoko5981", email:"kechez@sbcglobal.net", phone:"3103418916", enrollmentDate:"2024-02-11" },
  { id:"ambhol6078", phpId:"1246078", name:"Amber Holden", pin:"6078", role:"trainee", level:10, uplineId:"nkeoko5981", email:"amazinglyamby@gmail.com", phone:"2134248672", enrollmentDate:"2024-02-10" },
  { id:"aloeke6054", phpId:"1246054", name:"Alozie Ekeke", pin:"6054", role:"trainee", level:10, uplineId:"nkeoko5981", email:"ekekealozie8@gmail.com", phone:"3236718339", enrollmentDate:"2024-02-10" },
  { id:"corbro5817", phpId:"1245817", name:"Coretta Brown", pin:"5817", role:"trainee", level:10, uplineId:"ebobro0313", email:"cocobrown555555@gmail.com", phone:"4048831109", enrollmentDate:"2024-02-10" },
  { id:"markuf5790", phpId:"1245790", name:"Mary Kuffour", pin:"5790", role:"trainee", level:10, uplineId:"olialo3950", email:"mrsvumoren@yahoo.com", phone:"2138847992", enrollmentDate:"2024-02-09" },
  { id:"melbel5091", phpId:"1245091", name:"Melissa Belalcazar", pin:"5091", role:"trainee", level:10, uplineId:"micedw8462", email:"melissabphpagency@gmail.com", phone:"3479354876", enrollmentDate:"2024-02-06" },
  { id:"uchume4878", phpId:"1244878", name:"Uchechukwu Umeibe", pin:"4878", role:"trainee", level:10, uplineId:"olialo3950", email:"umeibe30@gmail.com", phone:"3235141206", enrollmentDate:"2024-02-05" },
  { id:"junwoj4850", phpId:"1244850", name:"Junior Wojuola", pin:"4850", role:"trainee", level:10, uplineId:"nkeoko5981", email:"charlesfrank098@gmail.com", phone:"4244894593", enrollmentDate:"2024-02-05" },
  { id:"vicchi4669", phpId:"1244669", name:"Victor Chime", pin:"4669", role:"trainee", level:10, uplineId:"olialo3950", email:"chimevictor50@gmail.com", phone:"4242232721", enrollmentDate:"2024-02-03" },
  { id:"mictet4664", phpId:"1244664", name:"Michael Tetteh", pin:"4664", role:"field_associate", level:30, uplineId:"bli001", email:"metetteh5427@gmail.com", phone:"3233845020", enrollmentDate:"2024-02-03" },
  { id:"onoati4532", phpId:"1244532", name:"Onome Atiyota", pin:"4532", role:"trainee", level:10, uplineId:"augati6977", email:"onomet@gmail.com", phone:"7607991377", enrollmentDate:"2024-02-03" },
  { id:"linuma4142", phpId:"1244142", name:"Linda Umaru", pin:"4142", role:"trainee", level:10, uplineId:"johoko5456", email:"blengike@gmail.com", phone:"9497489138", enrollmentDate:"2024-02-01" },
  { id:"ifenwe4126", phpId:"1244126", name:"Ifeoma Nweke", pin:"4126", role:"trainee", level:10, uplineId:"johoko5456", email:"john.okonkwo@compass.com", phone:"3236743426", enrollmentDate:"2024-02-01" },
  { id:"maryus4091", phpId:"1244091", name:"Maria Yusuf", pin:"4091", role:"trainee", level:10, uplineId:"johoko5456", email:"kechez60@gmail.com", phone:"9493001612", enrollmentDate:"2024-02-01" },
  { id:"chialo3971", phpId:"1243971", name:"Chidera Alozie", pin:"3971", role:"field_associate", level:30, uplineId:"augalo1298", email:"chideraalozie12@gmail.com", phone:"8184159812", enrollmentDate:"2024-02-01" },
  { id:"olialo3950", phpId:"1243950", name:"Olivia Alozie", pin:"3950", role:"field_associate", level:30, uplineId:"augalo1298", email:"oliviaalozie63@gmail.com", phone:"8188632622", enrollmentDate:"2024-02-01" },
  { id:"jazrod3944", phpId:"1243944", name:"Jazmin Rodriguez", pin:"3944", role:"trainee", level:10, uplineId:"rossan5715", email:"rodriguez.jax94@gmail.com", phone:"8489970303", enrollmentDate:"2024-02-01" },
  { id:"onynwa3721", phpId:"1243721", name:"Onyekachukwu Nwana", pin:"3721", role:"trainee", level:10, uplineId:"augalo1298", email:"onyiika@gmail.com", phone:"8188567952", enrollmentDate:"2024-01-31" },
  { id:"graabr2277", phpId:"1242277", name:"Gracelynn Abraham", pin:"2277", role:"trainee", level:10, uplineId:"davabr6587", email:"gtbridges@ucdavis.edu", phone:"5105930076", enrollmentDate:"2024-01-19" },
  { id:"augalo1298", phpId:"1241298", name:"Augustine Alozie", pin:"1298", role:"field_associate", level:30, uplineId:"johoko5456", email:"augionyedika@yahoo.com", phone:"8184712430", enrollmentDate:"2024-01-15" },
  { id:"mirach1158", phpId:"1241158", name:"Miriam Achilefu", pin:"1158", role:"trainee", level:10, uplineId:"bli001", email:"miriamachilefu@gmail.com", phone:"3239738858", enrollmentDate:"2024-01-13" },
  { id:"aliati0788", phpId:"1240788", name:"Alice-Deloise Atiegar", pin:"0788", role:"trainee", level:10, uplineId:"davabr6587", email:"alicedatiegar@gmail.com", phone:"4152400433", enrollmentDate:"2024-01-11" },
  { id:"matoge0448", phpId:"1240448", name:"Matthias Ogege", pin:"0448", role:"trainee", level:10, uplineId:"ugomad0222", email:"oviematthias@gmail.com", phone:"6502903632", enrollmentDate:"2024-01-09" },
  { id:"ugomad0222", phpId:"1240222", name:"Ugochukwu Maduafokwa", pin:"0222", role:"trainee", level:10, uplineId:"davabr6587", email:"micmadu.php@gmail.com", phone:"6508637439", enrollmentDate:"2024-01-06" },
  { id:"ellkab9402", phpId:"1239402", name:"Ellia Kabba", pin:"9402", role:"trainee", level:10, uplineId:"maloko8702", email:"", phone:"2134298241", enrollmentDate:"2024-01-01" },
  { id:"jenhen9221", phpId:"1239221", name:"Jennifer Henry", pin:"9221", role:"trainee", level:10, uplineId:"nkeoko5981", email:"jesusreal58@yahoo.com", phone:"6197010739", enrollmentDate:"2024-01-01" },
  { id:"emmike9180", phpId:"1239180", name:"Emmanuel Ikeokonta", pin:"9180", role:"trainee", level:10, uplineId:"prohum8941", email:"", phone:"3109458261", enrollmentDate:"2024-01-01" },
  { id:"prohum8941", phpId:"1238941", name:"Promise Humphrey", pin:"8941", role:"trainee", level:10, uplineId:"stahum8782", email:"phumphrey053@gmail.com", phone:"6263487147", enrollmentDate:"2023-12-31" },
  { id:"stahum8782", phpId:"1238782", name:"Stacy Humphrey", pin:"8782", role:"trainee", level:10, uplineId:"bli001", email:"stacyhmphry@gmail.com", phone:"3109136388", enrollmentDate:"2023-12-31" },
  { id:"jhoade8397", phpId:"1238397", name:"Jhonathan Ade", pin:"8397", role:"trainee", level:10, uplineId:"rossan5715", email:"ade.jhonathan24@gmail.com", phone:"4434336439", enrollmentDate:"2023-12-30" },
  { id:"carsue8350", phpId:"1238350", name:"Carlos Juan Suero", pin:"8350", role:"trainee", level:10, uplineId:"rossan5715", email:"suerocarlos1965@gmail.com", phone:"8482397860", enrollmentDate:"2023-12-29" },
  { id:"eurros8184", phpId:"1238184", name:"Euri Rosario", pin:"8184", role:"trainee", level:10, uplineId:"rossan5715", email:"eurir690@gmail.com", phone:"7327888942", enrollmentDate:"2023-12-28" },
  { id:"tifhar8154", phpId:"1238154", name:"Tiffany Harris", pin:"8154", role:"trainee", level:10, uplineId:"sornas052", email:"horotonswife@gmail.com", phone:"3035208989", enrollmentDate:"2023-12-28" },
  { id:"dammac7975", phpId:"1237975", name:"Damiete MacHarry", pin:"7975", role:"trainee", level:10, uplineId:"nkeoko5981", email:"dmacharry@kcu.edu", phone:"8455983001", enrollmentDate:"2023-12-27" },
  { id:"catrho7170", phpId:"1237170", name:"Catrice Rhodes", pin:"7170", role:"field_associate", level:30, uplineId:"bricas8135", email:"catricerhodes9315@gmail.com", phone:"5622122080", enrollmentDate:"2023-12-16" },
  { id:"obichi7155", phpId:"1237155", name:"Obiajulum Chidebelu", pin:"7155", role:"trainee", level:10, uplineId:"antoka7149", email:"mobblitz44@gmail.com", phone:"9257278087", enrollmentDate:"2023-12-16" },
  { id:"antoka7149", phpId:"1237149", name:"Anthony Okafor", pin:"7149", role:"trainee", level:10, uplineId:"obi001", email:"somiliso7stars@gmail.com", phone:"7073058139", enrollmentDate:"2023-12-16" },
  { id:"cleenw7059", phpId:"1237059", name:"Clementina Enwereji", pin:"7059", role:"trainee", level:10, uplineId:"judenw2745", email:"clemzobis@yahoo.com", phone:"6232397914", enrollmentDate:"2023-12-16" },
  { id:"augati6977", phpId:"1236977", name:"Augustine Atiyota", pin:"6977", role:"trainee", level:10, uplineId:"nkeoko5981", email:"vediri@msn.com", phone:"7607991155", enrollmentDate:"2023-12-16" },
  { id:"chrdav6711", phpId:"1236711", name:"Chris Davis", pin:"6711", role:"trainee", level:10, uplineId:"sornas052", email:"etherealpreparations@gmail.com", phone:"7206364813", enrollmentDate:"2023-12-15" },
  { id:"eritre6602", phpId:"1236602", name:"Eric Trejo", pin:"6602", role:"trainee", level:10, uplineId:"obi001", email:"e_trejo84@rocketmail.com", phone:"5628794971", enrollmentDate:"2023-12-14" },
  { id:"davabr6587", phpId:"1236587", name:"David Abraham", pin:"6587", role:"associate", level:20, uplineId:"johoko5456", email:"d.p.ifeanyichukwu@gmail.com", phone:"5623356807", enrollmentDate:"2023-12-14" },
  { id:"emeakp5823", phpId:"1235823", name:"Emeka Akpudiogwu", pin:"5823", role:"field_associate", level:30, uplineId:"ifuibe7942", email:"emekabarthakpu@gmail.com", phone:"3102427072", enrollmentDate:"2023-12-07" },
  { id:"chiaha5809", phpId:"1235809", name:"Chinwe Patricia Ahazie", pin:"5809", role:"trainee", level:10, uplineId:"nkeoko5981", email:"patricia@corebookkeeping.com", phone:"9252345237", enrollmentDate:"2023-12-07" },
  { id:"rossan5715", phpId:"1235715", name:"Rosa Sanchez", pin:"5715", role:"director", level:40, uplineId:"micedw8462", email:"rosaphpagent@gmail.com", phone:"8482528035", enrollmentDate:"2023-12-07" },
  { id:"tasals5169", phpId:"1235169", name:"Tashara Van Alstyne", pin:"5169", role:"trainee", level:10, uplineId:"ebobro0313", email:"tasharava@gmail.com", phone:"8043005369", enrollmentDate:"2023-12-01" },
  { id:"emmose5013", phpId:"1235013", name:"Emmanuel Osemwegie", pin:"5013", role:"trainee", level:10, uplineId:"", email:"emmylife@msn.com", phone:"7132698070", enrollmentDate:"2023-12-01" },
  { id:"nnechi4989", phpId:"1234989", name:"Nnebuogor Chidebelu", pin:"4989", role:"trainee", level:10, uplineId:"", email:"fomachidebelu@gmail.com", phone:"3109803067", enrollmentDate:"2023-12-01" },
  { id:"nwanze4370", phpId:"1234370", name:"Nwakanma Nzeadibe", pin:"4370", role:"trainee", level:10, uplineId:"nnechi3055", email:"exodus33143314@gmail.com", phone:"8322310816", enrollmentDate:"2023-11-30" },
  { id:"albnya4277", phpId:"1234277", name:"Albertina Nyantee", pin:"4277", role:"trainee", level:10, uplineId:"sufbie1777", email:"tiadeb100@yahoo.com", phone:"4694501749", enrollmentDate:"2023-11-30" },
  { id:"chinze4147", phpId:"1234147", name:"Chidinma Nzeadibe", pin:"4147", role:"trainee", level:10, uplineId:"nnechi3055", email:"igbere246@gmail.com", phone:"7139928653", enrollmentDate:"2023-11-29" },
  { id:"afonwa4145", phpId:"1234145", name:"Afoma Nwankwo", pin:"4145", role:"trainee", level:10, uplineId:"nnechi3055", email:"afomanzeadibe@gmail.com", phone:"2819124931", enrollmentDate:"2023-11-29" },
  { id:"faigre3473", phpId:"1233473", name:"Faith Greene", pin:"3473", role:"trainee", level:10, uplineId:"micnwi3971", email:"angelfg845@gmail.com", phone:"9087874945", enrollmentDate:"2023-11-22" },
  { id:"humuba3246", phpId:"1233246", name:"Humphrey Ubachukwu", pin:"3246", role:"trainee", level:10, uplineId:"bli001", email:"humphreyuba@yahoo.com", phone:"3233266264", enrollmentDate:"2023-11-18" },
  { id:"nnechi3055", phpId:"1233055", name:"Nneka Chidolue", pin:"3055", role:"associate", level:20, uplineId:"", email:"foodwritermom@gmail.com", phone:"8325337894", enrollmentDate:"2023-11-17" },
  { id:"beaani2885", phpId:"1232885", name:"Beatrice Aniba", pin:"2885", role:"trainee", level:10, uplineId:"ndiese5626", email:"anibabeatrice@gmail.com", phone:"4435839339", enrollmentDate:"2023-11-16" },
  { id:"akiola2542", phpId:"1232542", name:"Akintayo Olaomi", pin:"2542", role:"trainee", level:10, uplineId:"", email:"tayoolaomi@yahoo.com", phone:"4439857836", enrollmentDate:"2023-11-16" },
  { id:"rahfra2205", phpId:"1232205", name:"Rahabu Fraser", pin:"2205", role:"trainee", level:10, uplineId:"", email:"kidra65@gmail.com", phone:"9193481080", enrollmentDate:"2023-11-15" },
  { id:"linoko1516", phpId:"1231516", name:"Linda Okoli", pin:"1516", role:"associate", level:20, uplineId:"sufbie1777", email:"lindaalee2002@yahoo.co.uk", phone:"3162266248", enrollmentDate:"2023-11-11" },
  { id:"adeoye1304", phpId:"1231304", name:"Adetoyese Oyeyemi", pin:"1304", role:"trainee", level:10, uplineId:"johoko5456", email:"toyeseoyeyemi@gmail.com", phone:"3235957401", enrollmentDate:"2023-11-11" },
  { id:"simmar1300", phpId:"1231300", name:"Simone Martin", pin:"1300", role:"trainee", level:10, uplineId:"sornas052", email:"simonescott34@yahoo.com", phone:"7202805304", enrollmentDate:"2023-11-11" },
  { id:"azuonw0766", phpId:"1230766", name:"Azu Asonye Onwudebe", pin:"0766", role:"trainee", level:10, uplineId:"chionw0698", email:"azuasonye@yahoo.com", phone:"7135055514", enrollmentDate:"2023-11-07" },
  { id:"chionw0698", phpId:"1230698", name:"Chinatu Onwudebe", pin:"0698", role:"trainee", level:10, uplineId:"", email:"chinanaonwudebe@gmail.com", phone:"7132444764", enrollmentDate:"2023-11-07" },
  { id:"sadmor0553", phpId:"1230553", name:"Sadrica Morgan", pin:"0553", role:"trainee", level:10, uplineId:"bricas8135", email:"sjmorgan03@gmail.com", phone:"3239520532", enrollmentDate:"2023-11-04" },
  { id:"ebobro0313", phpId:"1230313", name:"Ebony Brown", pin:"0313", role:"trainee", level:10, uplineId:"", email:"ebonysbrown13@gmail.com", phone:"4048387225", enrollmentDate:"2023-11-02" },
  { id:"bosgba0275", phpId:"1230275", name:"Bosede Gbadebo", pin:"0275", role:"trainee", level:10, uplineId:"", email:"bosedegbadebo@gmail.com", phone:"2414676389", enrollmentDate:"2023-11-02" },
  { id:"chionw0206", phpId:"1230206", name:"Chijioke Onwudebe", pin:"0206", role:"trainee", level:10, uplineId:"", email:"onwudebeassociates@gmail.com", phone:"7133026650", enrollmentDate:"2023-11-01" },
  { id:"donuti9788", phpId:"1229788", name:"Donald Uti", pin:"9788", role:"trainee", level:10, uplineId:"peaoko8288", email:"donnyou54@gmail.com", phone:"5622506641", enrollmentDate:"2023-11-01" },
  { id:"najbur9745", phpId:"1229745", name:"Najati Burrow", pin:"9745", role:"trainee", level:10, uplineId:"peaoko8288", email:"najati17@gmail.com", phone:"6199715445", enrollmentDate:"2023-11-01" },
  { id:"kwasar9718", phpId:"1229718", name:"Kwabena Sarkodie-mensah", pin:"9718", role:"trainee", level:10, uplineId:"nkeoko5981", email:"kobbysm@gmail.com", phone:"9493450041", enrollmentDate:"2023-11-01" },
  { id:"oluogu9121", phpId:"1229121", name:"Oluwakemi Ogunyemi", pin:"9121", role:"trainee", level:10, uplineId:"", email:"chubykemmy@gmail.com", phone:"2062014703", enrollmentDate:"2023-10-30" },
  { id:"mestsi8875", phpId:"1228875", name:"Meskerem Tsighe", pin:"8875", role:"trainee", level:10, uplineId:"sornas052", email:"meskytsighe@gmail.com", phone:"7208136461", enrollmentDate:"2023-10-28" },
  { id:"maloko8702", phpId:"1228702", name:"Malachy Ejike Okoye", pin:"8702", role:"trainee", level:10, uplineId:"peroko8700", email:"jykio@yahoo.com", phone:"7138879870", enrollmentDate:"2023-10-26" },
  { id:"peroko8700", phpId:"1228700", name:"Perpetua Okoye", pin:"8700", role:"trainee", level:10, uplineId:"bli001", email:"amakaibekilo2001@yahoo.com", phone:"3465883074", enrollmentDate:"2023-10-26" },
  { id:"jayoko8570", phpId:"1228570", name:"JayTee OKONKWO", pin:"8570", role:"trainee", level:10, uplineId:"nkeoko5981", email:"jt.okonkwo@gmail.com", phone:"9493904002", enrollmentDate:"2023-10-25" },
  { id:"peaoko8288", phpId:"1228288", name:"Pearl Okonkwo", pin:"8288", role:"trainee", level:10, uplineId:"nkeoko5981", email:"pearl.okonkwo@gmail.com", phone:"8582040150", enrollmentDate:"2023-10-23" },
  { id:"isaadr8021", phpId:"1228021", name:"Isaac Adrien", pin:"8021", role:"trainee", level:10, uplineId:"obi001", email:"isaacadrien@yahoo.com", phone:"8148106556", enrollmentDate:"2023-10-20" },
  { id:"adeola7655", phpId:"1227655", name:"Adepeju Olaniyi", pin:"7655", role:"trainee", level:10, uplineId:"", email:"", phone:"2698152514", enrollmentDate:"2023-10-17" },
  { id:"debott7628", phpId:"1227628", name:"Debi Otto", pin:"7628", role:"trainee", level:10, uplineId:"nkeoko5981", email:"debiotto2@gmail.com", phone:"7143357754", enrollmentDate:"2023-10-16" },
  { id:"olatej7188", phpId:"1227188", name:"Olayinka Tejuosho", pin:"7188", role:"trainee", level:10, uplineId:"", email:"yinkatej01@gmail.com", phone:"6787540429", enrollmentDate:"2023-10-15" },
  { id:"dougic7099", phpId:"1227099", name:"Douglas G. Gichana", pin:"7099", role:"trainee", level:10, uplineId:"", email:"doug.gichana@gmail.com", phone:"8322667725", enrollmentDate:"2023-10-15" },
  { id:"manaya6865", phpId:"1226865", name:"Manny Ayala", pin:"6865", role:"associate", level:20, uplineId:"", email:"deeayala7@gmail.com", phone:"8186617954", enrollmentDate:"2023-10-14" },
  { id:"primac6291", phpId:"1226291", name:"Priscillia Macaulay", pin:"6291", role:"trainee", level:10, uplineId:"nkeoko5981", email:"greatventures@icloud.com", phone:"6572478407", enrollmentDate:"2023-10-13" },
  { id:"adecok5866", phpId:"1225866", name:"Adedoyin Coker", pin:"5866", role:"trainee", level:10, uplineId:"bli001", email:"doyincoker@gmail.com", phone:"3027539555", enrollmentDate:"2023-10-11" },
  { id:"ireoko5860", phpId:"1225860", name:"Irene Okon", pin:"5860", role:"trainee", level:10, uplineId:"bli001", email:"imoh75@gmail.com", phone:"2489938894", enrollmentDate:"2023-10-11" },
  { id:"lovose5841", phpId:"1225841", name:"Love Osemwegie", pin:"5841", role:"trainee", level:10, uplineId:"", email:"loveosemwegie@yahoo.com", phone:"8325526523", enrollmentDate:"2023-10-11" },
  { id:"reghun5460", phpId:"1225460", name:"Regail Hunt", pin:"5460", role:"trainee", level:10, uplineId:"nkeoko5981", email:"regailhunt@gmail.com", phone:"9092057355", enrollmentDate:"2023-10-08" },
  { id:"johoko5456", phpId:"1225456", name:"John Okonkwo", pin:"5456", role:"producing_md", level:50, uplineId:"nkeoko5981", email:"kechez62@yahoo.com", phone:"8584720835", enrollmentDate:"2023-10-08" },
  { id:"ugoegw4698", phpId:"1224698", name:"Ugoezi Egwim", pin:"4698", role:"trainee", level:10, uplineId:"chiana9825", email:"hegwim@gmail.com", phone:"2404419451", enrollmentDate:"2023-10-04" },
  { id:"johmcc4669", phpId:"1224669", name:"Johnnetta Mccullough", pin:"4669", role:"trainee", level:10, uplineId:"nkeoko5981", email:"jmccullough1103@gmail.com", phone:"3363071627", enrollmentDate:"2023-10-03" },
  { id:"olusun4659", phpId:"1224659", name:"Olubunmi Sunmbola", pin:"4659", role:"trainee", level:10, uplineId:"pausun4657", email:"matibunmi@gmail.com", phone:"3082251286", enrollmentDate:"2023-10-03" },
  { id:"pausun4657", phpId:"1224657", name:"Paul Sunmbola", pin:"4657", role:"trainee", level:10, uplineId:"", email:"sunmbolap@gmail.com", phone:"3087651107", enrollmentDate:"2023-10-03" },
  { id:"cynasa4483", phpId:"1224483", name:"Cynthia Asante", pin:"4483", role:"trainee", level:10, uplineId:"comlaw2432", email:"ashantiqueen7@gmail.com", phone:"8186486828", enrollmentDate:"2023-10-01" },
  { id:"iraadi4177", phpId:"1224177", name:"Iranlowooluwa Adibuah", pin:"4177", role:"trainee", level:10, uplineId:"ogeeke0687", email:"iranlowoadibuah@gmail.com", phone:"7014053391", enrollmentDate:"2023-10-01" },
  { id:"emmaku4002", phpId:"1224002", name:"Emmanuel Akuamoah", pin:"4002", role:"trainee", level:10, uplineId:"comlaw2432", email:"dasebre07@gmail.com", phone:"9512377044", enrollmentDate:"2023-10-01" },
  { id:"patwek3858", phpId:"1223858", name:"Patricia Wekhomba", pin:"3858", role:"trainee", level:10, uplineId:"ogeeke0687", email:"pwekhombal@gmail.com", phone:"2139847818", enrollmentDate:"2023-10-01" },
  { id:"kribai3752", phpId:"1223752", name:"Kristella Baidoe-Ansah", pin:"3752", role:"trainee", level:10, uplineId:"comlaw2432", email:"kristellabaidoeansah@gmail.com", phone:"4245422730", enrollmentDate:"2023-09-30" },
  { id:"elidon3722", phpId:"1223722", name:"Elizabeth Donkor", pin:"3722", role:"trainee", level:10, uplineId:"comlaw2432", email:"lizbonsu1@gmail.com", phone:"2145461809", enrollmentDate:"2023-09-30" },
  { id:"isagya3668", phpId:"1223668", name:"Isaac Gyan", pin:"3668", role:"trainee", level:10, uplineId:"ifuibe7942", email:"gyanisaac23@gmail.com", phone:"3237810906", enrollmentDate:"2023-09-30" },
  { id:"judeke3386", phpId:"1223386", name:"Jude Ekenta", pin:"3386", role:"trainee", level:10, uplineId:"ogeeke0687", email:"ogechukwuekenta@gmail.com", phone:"3104028126", enrollmentDate:"2023-09-30" },
  { id:"funbab3211", phpId:"1223211", name:"Funmilola Babalola", pin:"3211", role:"trainee", level:10, uplineId:"akikil9709", email:"funmilola_babalola@yahoo.com", phone:"9512899678", enrollmentDate:"2023-09-29" },
  { id:"rosmet3163", phpId:"1223163", name:"Rosemund Metu", pin:"3163", role:"trainee", level:10, uplineId:"bli001", email:"readingradiant5@gmail.com", phone:"5164018777", enrollmentDate:"2023-09-28" },
  { id:"chiezi2755", phpId:"1222755", name:"Chinyere Duru Ezieme", pin:"2755", role:"trainee", level:10, uplineId:"ogeeke0687", email:"youngchiny@yahoo.com", phone:"4242001609", enrollmentDate:"2023-09-26" },
  { id:"agbuhu2665", phpId:"1222665", name:"Agbor Uhurebor", pin:"2665", role:"trainee", level:10, uplineId:"doruhu2662", email:"lurebor@yahoo.com", phone:"4049930451", enrollmentDate:"2023-09-25" },
  { id:"doruhu2662", phpId:"1222662", name:"Dorothy Uhurebor", pin:"2662", role:"trainee", level:10, uplineId:"", email:"uhurebor@gmail.com", phone:"7703105709", enrollmentDate:"2023-09-25" },
  { id:"comlaw2432", phpId:"1222432", name:"Comfort Lawehy", pin:"2432", role:"field_associate", level:30, uplineId:"ogeeke0687", email:"apulawehy@yahoo.com", phone:"3108921294", enrollmentDate:"2023-09-23" },
  { id:"melosa1756", phpId:"1221756", name:"Meli Osakwe", pin:"1756", role:"trainee", level:10, uplineId:"linosa5055", email:"osakuemeli01@gmail.com", phone:"5622505121", enrollmentDate:"2023-09-16" },
  { id:"joyegu1130", phpId:"1221130", name:"Joy Egungwu", pin:"1130", role:"trainee", level:10, uplineId:"", email:"joyegungwu@hotmail.com", phone:"3105314467", enrollmentDate:"2023-09-16" },
  { id:"ifeonw1018", phpId:"1221018", name:"Ifeyinwa Onwelumadu", pin:"1018", role:"trainee", level:10, uplineId:"", email:"ifey1234@gmail.com", phone:"2704210355", enrollmentDate:"2023-09-16" },
  { id:"meroli0991", phpId:"1220991", name:"Mercy Oliti", pin:"0991", role:"trainee", level:10, uplineId:"linosa5055", email:"mercyoliti@gmail.com", phone:"3109458044", enrollmentDate:"2023-09-15" },
  { id:"briyou0592", phpId:"1220592", name:"Bright Young", pin:"0592", role:"trainee", level:10, uplineId:"", email:"youngojigba@yahoo.com", phone:"3478764599", enrollmentDate:"2023-09-15" },
  { id:"oluosu0476", phpId:"1220476", name:"Oluwasayo Osuntade", pin:"0476", role:"trainee", level:10, uplineId:"", email:"omokunmi6868@gmail.com", phone:"9729224523", enrollmentDate:"2023-09-14" },
  { id:"mieasr9984", phpId:"1219984", name:"Mielat Asrat", pin:"9984", role:"trainee", level:10, uplineId:"sornas052", email:"mielatasrat7@gmail.com", phone:"3038819482", enrollmentDate:"2023-09-13" },
  { id:"chiana9825", phpId:"1219825", name:"Chinwenwa Anaejionu", pin:"9825", role:"field_associate", level:30, uplineId:"", email:"ittakesgod@yahoo.com", phone:"2407669971", enrollmentDate:"2023-09-12" },
  { id:"akikil9709", phpId:"1219709", name:"Akinkunmi Kilanko", pin:"9709", role:"trainee", level:10, uplineId:"", email:"rightperiod@hotmail.com", phone:"9512867273", enrollmentDate:"2023-09-11" },
  { id:"emmaba9290", phpId:"1219290", name:"Emmanuel Abar", pin:"9290", role:"trainee", level:10, uplineId:"", email:"abarhero@yahoo.com", phone:"8323448219", enrollmentDate:"2023-09-08" },
  { id:"chiali8729", phpId:"1218729", name:"Chinonso Alinnor", pin:"8729", role:"trainee", level:10, uplineId:"preony8886", email:"alinbo2000@yahoo.com", phone:"8327746772", enrollmentDate:"2023-09-04" },
  { id:"vicada8394", phpId:"1218394", name:"Victoria Adanike", pin:"8394", role:"trainee", level:10, uplineId:"", email:"rolidapeb1970@gmail.com", phone:"5595968481", enrollmentDate:"2023-09-01" },
  { id:"ifeibe8356", phpId:"1218356", name:"Ifeanyi Ibezim", pin:"8356", role:"trainee", level:10, uplineId:"ifuibe7942", email:"ifeanyiprecious7878@gmail.com", phone:"3109043517", enrollmentDate:"2023-09-01" },
  { id:"magibe8244", phpId:"1218244", name:"Magdaline Ibezim", pin:"8244", role:"director", level:40, uplineId:"ifuibe7942", email:"megibezim223@gmail.com", phone:"3104677075", enrollmentDate:"2023-09-01" },
  { id:"cecmar8064", phpId:"1218064", name:"Cecilia Maravilla", pin:"8064", role:"field_associate", level:30, uplineId:"jesgue2342", email:"cmaravillaphp@gmail.com", phone:"2138804117", enrollmentDate:"2023-09-01" },
  { id:"ifuibe7942", phpId:"1217942", name:"Ifunanya Ibezim", pin:"7942", role:"trainee", level:10, uplineId:"obi001", email:"ibezimifunanya66@gmail.com", phone:"4248673399", enrollmentDate:"2023-09-01" },
  { id:"guemer7890", phpId:"1217890", name:"Guerline Merassaint", pin:"7890", role:"trainee", level:10, uplineId:"preony8886", email:"gmerassaint@yahoo.fr", phone:"5612012237", enrollmentDate:"2023-09-01" },
  { id:"joltch6987", phpId:"1216987", name:"Joli Nickson Tchuilang", pin:"6987", role:"trainee", level:10, uplineId:"taiodu0781", email:"nickotchuilang@gmail.com", phone:"6018323871", enrollmentDate:"2023-08-26" },
  { id:"danash6558", phpId:"1216558", name:"Daniel Tabi Ashu", pin:"6558", role:"trainee", level:10, uplineId:"taiodu0781", email:"danieltabiashu@gmail.com", phone:"3103408782", enrollmentDate:"2023-08-23" },
  { id:"yescha6146", phpId:"1216146", name:"Yesenia Chavez", pin:"6146", role:"trainee", level:10, uplineId:"obi001", email:"yschavez13159@gmail.com", phone:"3233585432", enrollmentDate:"2023-08-19" },
  { id:"olaone6133", phpId:"1216133", name:"Olabisi Oneal", pin:"6133", role:"trainee", level:10, uplineId:"taiodu0781", email:"fauolabisi0@gmail.com", phone:"3102279350", enrollmentDate:"2023-08-19" },
  { id:"nkeoko5981", phpId:"1215981", name:"Nkechi Okonkwo", pin:"5981", role:"director", level:40, uplineId:"bli001", email:"maukezo2006@yahoo.com", phone:"9498991874", enrollmentDate:"2023-08-19" },
  { id:"dayriv5838", phpId:"1215838", name:"Dayvon Rivera", pin:"5838", role:"trainee", level:10, uplineId:"micedw8462", email:"dayvonantrivera@gmail.com", phone:"8628889817", enrollmentDate:"2023-08-18" },
  { id:"aleram5726", phpId:"1215726", name:"Alexis Ramos", pin:"5726", role:"trainee", level:10, uplineId:"jesvil2622", email:"alexramos303@gmail.com", phone:"7202103460", enrollmentDate:"2023-08-17" },
  { id:"fainwa5706", phpId:"1215706", name:"Faithwin Nwankwo", pin:"5706", role:"trainee", level:10, uplineId:"bli001", email:"faithnneka1983@gmail.com", phone:"4248889693", enrollmentDate:"2023-08-16" },
  { id:"micdor5681", phpId:"1215681", name:"Michael Doron", pin:"5681", role:"trainee", level:10, uplineId:"bli001", email:"mdoron1818@gmail.com", phone:"3108802546", enrollmentDate:"2023-08-16" },
  { id:"lilnwo5659", phpId:"1215659", name:"Lilian Nworie", pin:"5659", role:"trainee", level:10, uplineId:"taiodu0781", email:"nkechinworie@gmail.com", phone:"3105052998", enrollmentDate:"2023-08-16" },
  { id:"ndiese5626", phpId:"1215626", name:"Ndidi Kate Esealuka", pin:"5626", role:"trainee", level:10, uplineId:"taiodu0781", email:"kateesealuka50@gmail.com", phone:"4243751059", enrollmentDate:"2023-08-16" },
  { id:"ghaogu5159", phpId:"1215159", name:"Ghaniat Ogunde", pin:"5159", role:"trainee", level:10, uplineId:"", email:"", phone:"", enrollmentDate:"2023-08-08" },
  { id:"linosa5055", phpId:"1215055", name:"Linda Osakue", pin:"5055", role:"field_associate", level:30, uplineId:"", email:"stephenlindaosakue@gmail.com", phone:"3106545487", enrollmentDate:"2023-08-06" },
  { id:"olaade5014", phpId:"1215014", name:"Olanrewaju Adeleke", pin:"5014", role:"trainee", level:10, uplineId:"obi001", email:"ola.adeleke@khadlanllc.com", phone:"8187999938", enrollmentDate:"2023-08-06" },
  { id:"amaenu4968", phpId:"1214968", name:"Amanda Enuka", pin:"4968", role:"trainee", level:10, uplineId:"preony8886", email:"enukaamanda@gmail.com", phone:"4243782636", enrollmentDate:"2023-08-05" },
  { id:"tyrhen4963", phpId:"1214963", name:"Tyriq Henderson", pin:"4963", role:"trainee", level:10, uplineId:"", email:"theofficialdeivan@gmail.com", phone:"4247680247", enrollmentDate:"2023-08-05" },
  { id:"andatk4341", phpId:"1214341", name:"Andrea Atkins", pin:"4341", role:"trainee", level:10, uplineId:"", email:"drea0203@gmail.com", phone:"3106190372", enrollmentDate:"2023-08-01" },
  { id:"ebuade3336", phpId:"1213336", name:"Ebunoluwa Adelekan", pin:"3336", role:"trainee", level:10, uplineId:"", email:"ebunayoola@yahoo.co.uk", phone:"7134712508", enrollmentDate:"2023-07-31" },
  { id:"chimcc3292", phpId:"1213292", name:"Chidinma Mcclendon", pin:"3292", role:"trainee", level:10, uplineId:"", email:"princesschinwa@yahoo.com", phone:"2134767441", enrollmentDate:"2023-07-31" },
  { id:"peaotu3286", phpId:"1213286", name:"Peace Otuonye", pin:"3286", role:"trainee", level:10, uplineId:"", email:"otuonyepeace33@yahoo.com", phone:"3233386637", enrollmentDate:"2023-07-31" },
  { id:"micnkw2802", phpId:"1212802", name:"Michael Nkwuaku", pin:"2802", role:"trainee", level:10, uplineId:"preony8886", email:"lordmega99@gmail.com", phone:"4242001274", enrollmentDate:"2023-07-30" },
  { id:"pecsin2157", phpId:"1212157", name:"Pechmony Sing", pin:"2157", role:"trainee", level:10, uplineId:"bli001", email:"mony.peace2020@gmail.com", phone:"5622188989", enrollmentDate:"2023-07-26" },
  { id:"abdiss1941", phpId:"1211941", name:"Abdullahi Issah", pin:"1941", role:"trainee", level:10, uplineId:"micedw8462", email:"iabdullahi622@gmail.com", phone:"9294883019", enrollmentDate:"2023-07-26" },
  { id:"antogb1793", phpId:"1211793", name:"Anthony Ogbuji", pin:"1793", role:"trainee", level:10, uplineId:"", email:"ogbujianthony25@gmail.com", phone:"4044523599", enrollmentDate:"2023-07-24" },
  { id:"sufbie1777", phpId:"1211777", name:"Sufficient Bien", pin:"1777", role:"associate", level:20, uplineId:"", email:"sufficientbien@yahoo.com", phone:"6827024209", enrollmentDate:"2023-07-24" },
  { id:"iykagw1094", phpId:"1211094", name:"Iyke Peter Agwazim", pin:"1094", role:"trainee", level:10, uplineId:"", email:"pagwazim@rocketmail.com", phone:"2406024178", enrollmentDate:"2023-07-19" },
  { id:"ogeeke0687", phpId:"1210687", name:"Ogechukwu Ekenta", pin:"0687", role:"field_associate", level:30, uplineId:"", email:"cyntjudesco@yahoo.co.uk", phone:"3236676808", enrollmentDate:"2023-07-16" },
  { id:"logegu9872", phpId:"1209872", name:"Logniabari Eguarojie", pin:"9872", role:"trainee", level:10, uplineId:"sornas052", email:"queenkonne000@gmail.com", phone:"5312540689", enrollmentDate:"2023-07-11" },
  { id:"oluale9685", phpId:"1209685", name:"Oluwakemi Alege", pin:"9685", role:"trainee", level:10, uplineId:"obi001", email:"oalege@gmail.com", phone:"3102288802", enrollmentDate:"2023-07-10" },
  { id:"baroke9495", phpId:"1209495", name:"Bartholomew Okere", pin:"9495", role:"trainee", level:10, uplineId:"loiuso8070", email:"okerebarthlomew3@gmail.com", phone:"6149026788", enrollmentDate:"2023-07-08" },
  { id:"rebama9493", phpId:"1209493", name:"Rebecca Amadi", pin:"9493", role:"trainee", level:10, uplineId:"loiuso8070", email:"rebeccaamadi.ra@gmail.com", phone:"6786519580", enrollmentDate:"2023-07-08" },
  { id:"natalo9243", phpId:"1209243", name:"Nathaniel Alohan", pin:"9243", role:"trainee", level:10, uplineId:"bli001", email:"nathanielalohan@gmail.com", phone:"8323351024", enrollmentDate:"2023-07-07" },
  { id:"tyltim9190", phpId:"1209190", name:"Tyle Timmons", pin:"9190", role:"trainee", level:10, uplineId:"", email:"tylet500@gmail.com", phone:"8013620043", enrollmentDate:"2023-07-06" },
  { id:"euceke9049", phpId:"1209049", name:"Eucharia Eke", pin:"9049", role:"director", level:40, uplineId:"bli001", email:"urfinancialwoman@gmail.com", phone:"9096333390", enrollmentDate:"2023-07-05" },
  { id:"preony8886", phpId:"1208886", name:"Precious Onyeagolu", pin:"8886", role:"field_associate", level:30, uplineId:"", email:"mmadichi10@yahoo.com", phone:"4246460476", enrollmentDate:"2023-07-03" },
  { id:"mareri8535", phpId:"1208535", name:"Maryann Erilim", pin:"8535", role:"trainee", level:10, uplineId:"micnwi3971", email:"kimberlyerilim@gmail.com", phone:"6616736265", enrollmentDate:"2023-07-01" },
  { id:"omoimo8489", phpId:"1208489", name:"Omotuame Imoisili", pin:"8489", role:"trainee", level:10, uplineId:"micnwi3971", email:"imoisilis@yahoo.com", phone:"7173794210", enrollmentDate:"2023-07-01" },
  { id:"loiuso8070", phpId:"1208070", name:"Lois Usonwu", pin:"8070", role:"trainee", level:10, uplineId:"micnwi3971", email:"anchoredu@yahoo.com", phone:"8483911748", enrollmentDate:"2023-07-01" },
  { id:"fidluk8059", phpId:"1208059", name:"Fidelis Luke-Akaniro", pin:"8059", role:"trainee", level:10, uplineId:"taiodu0781", email:"fidelisluke@gmail.com", phone:"3237025131", enrollmentDate:"2023-07-01" },
  { id:"geochi7430", phpId:"1207430", name:"George Chile", pin:"7430", role:"trainee", level:10, uplineId:"taiodu0781", email:"georgechile9066@gmail.com", phone:"4243489439", enrollmentDate:"2023-06-28" },
  { id:"irmtor7245", phpId:"1207245", name:"Irma Torres", pin:"7245", role:"trainee", level:10, uplineId:"", email:"torres.irma1975@gmail.com", phone:"7472259818", enrollmentDate:"2023-06-27" },
  { id:"abidar7011", phpId:"1207011", name:"Abigail Daramola", pin:"7011", role:"trainee", level:10, uplineId:"taiodu0781", email:"graciasoluwadios@gmail.com", phone:"3106309564", enrollmentDate:"2023-06-25" },
  { id:"esmori6649", phpId:"1206649", name:"Esmeralda Ahumada Orizaga", pin:"6649", role:"trainee", level:10, uplineId:"naizat1621", email:"chaparris7681@gmail.com", phone:"6195521156", enrollmentDate:"2023-06-25" },
  { id:"rasaro6646", phpId:"1206646", name:"Rasheed Arogundade", pin:"6646", role:"trainee", level:10, uplineId:"micnwi3971", email:"rasheedarogundade91@gmail.com", phone:"8622249593", enrollmentDate:"2023-06-25" },
  { id:"whismi6612", phpId:"1206612", name:"Whitney, Hope Smith", pin:"6612", role:"trainee", level:10, uplineId:"jesgue2342", email:"whitneysmith3@gmail.com", phone:"2133694333", enrollmentDate:"2023-06-25" },
  { id:"amaony6576", phpId:"1206576", name:"Amanze Onyeukwu", pin:"6576", role:"trainee", level:10, uplineId:"micnwi3971", email:"amanze10@yahoo.com", phone:"8622915618", enrollmentDate:"2023-06-25" },
  { id:"ogenwi6457", phpId:"1206457", name:"Ogechi Nwinyi", pin:"6457", role:"trainee", level:10, uplineId:"micnwi3971", email:"ogechi.nwinyi@yahoo.com", phone:"6468217594", enrollmentDate:"2023-06-24" },
  { id:"olurot6039", phpId:"1206039", name:"Oluyemi Rotimi", pin:"6039", role:"trainee", level:10, uplineId:"", email:"yemirotimi1@gmail.com", phone:"4237733805", enrollmentDate:"2023-06-23" },
  { id:"soloba5397", phpId:"1205397", name:"Solo Obasi", pin:"5397", role:"trainee", level:10, uplineId:"davaye1160", email:"obasisolo@yahoo.com", phone:"5084360154", enrollmentDate:"2023-06-20" },
  { id:"olufad5252", phpId:"1205252", name:"Oluwanifemi Fadugba", pin:"5252", role:"trainee", level:10, uplineId:"bli001", email:"nifemifadugba@yahoo.com", phone:"8622155047", enrollmentDate:"2023-06-19" },
  { id:"etiaka4180", phpId:"1204180", name:"Etim Akan", pin:"4180", role:"trainee", level:10, uplineId:"", email:"akanet001@gmail.com", phone:"3854827286", enrollmentDate:"2023-06-16" },
  { id:"micnwi3971", phpId:"1203971", name:"Michael Nwinyi", pin:"3971", role:"director", level:40, uplineId:"micedw8462", email:"michael.nwinyi@gmail.com", phone:"9739419050", enrollmentDate:"2023-06-15" },
  { id:"wennig3398", phpId:"1203398", name:"Wendm Nigusse", pin:"3398", role:"trainee", level:10, uplineId:"mohahm9866", email:"wendmnigusse@gmail.com", phone:"7203223761", enrollmentDate:"2023-06-14" },
  { id:"angfer2941", phpId:"1202941", name:"Angel Fernandez", pin:"2941", role:"trainee", level:10, uplineId:"", email:"anfernandez24@icloud.com", phone:"3852013481", enrollmentDate:"2023-06-12" },
  { id:"framez2878", phpId:"1202878", name:"Francisco Meza", pin:"2878", role:"trainee", level:10, uplineId:"", email:"meza_216@hotmail.com", phone:"8015029186", enrollmentDate:"2023-06-12" },
  { id:"stefer2872", phpId:"1202872", name:"Stephen Ferrell", pin:"2872", role:"trainee", level:10, uplineId:"mohahm9866", email:"stephen.nicholasjk@gmail.com", phone:"7207324245", enrollmentDate:"2023-06-12" },
  { id:"jesvil2622", phpId:"1202622", name:"Jesus Villa", pin:"2622", role:"trainee", level:10, uplineId:"mohahm9866", email:"jesusvilla905@gmail.com", phone:"7203657075", enrollmentDate:"2023-06-10" },
  { id:"jesgue2342", phpId:"1202342", name:"Jessica Guerrero", pin:"2342", role:"director", level:40, uplineId:"", email:"jessicagphp@gmail.com", phone:"3237479563", enrollmentDate:"2023-06-09" },
  { id:"chuihe2245", phpId:"1202245", name:"Chukwuemeka Ihenkoro", pin:"2245", role:"trainee", level:10, uplineId:"", email:"cihenkoro@yahoo.com", phone:"", enrollmentDate:"2023-06-09" },
  { id:"nzunwa2044", phpId:"1202044", name:"Nzubechi Nwamara", pin:"2044", role:"trainee", level:10, uplineId:"", email:"gcoyoyo@yahoo.com", phone:"4172429734", enrollmentDate:"2023-06-09" },
  { id:"naizat1621", phpId:"1201621", name:"Nailea Zatarain", pin:"1621", role:"field_associate", level:30, uplineId:"", email:"zataveer2002@hotmail.com", phone:"6193438923", enrollmentDate:"2023-06-09" },
  { id:"tyrsut1513", phpId:"1201513", name:"Tyree Sutton", pin:"1513", role:"trainee", level:10, uplineId:"bli001", email:"tyree.s92@yahoo.com", phone:"4244704069", enrollmentDate:"2023-06-09" },
  { id:"thuali1406", phpId:"1201406", name:"Thureya Ali", pin:"1406", role:"trainee", level:10, uplineId:"mohahm9866", email:"thureyaali23@gmail.com", phone:"7204740961", enrollmentDate:"2023-06-08" },
  { id:"ibrosm1255", phpId:"1201255", name:"Ibrahim Mohammed Osman", pin:"1255", role:"trainee", level:10, uplineId:"mohahm9866", email:"bobahmad80@yahoo.com", phone:"2103190222", enrollmentDate:"2023-06-08" },
  { id:"davaye1160", phpId:"1201160", name:"David Ayegba", pin:"1160", role:"field_associate", level:30, uplineId:"bli001", email:"dayegba@yayoo.com", phone:"8573333291", enrollmentDate:"2023-06-08" },
  { id:"jesnun0908", phpId:"1200908", name:"Jesus Nunez", pin:"0908", role:"associate", level:20, uplineId:"obi001", email:"jesusn777@icloud.com", phone:"2134461531", enrollmentDate:"2023-06-07" },
  { id:"johene0769", phpId:"1200769", name:"John Eneh", pin:"0769", role:"trainee", level:10, uplineId:"bli001", email:"chizobeneh@gmail.com", phone:"2133790331", enrollmentDate:"2023-06-07" },
  { id:"phrtho0385", phpId:"1200385", name:"Phrank Thompson", pin:"0385", role:"trainee", level:10, uplineId:"micedw8462", email:"frnkthmpsn892@gmail.com", phone:"9085468258", enrollmentDate:"2023-06-06" },
  { id:"siepow0245", phpId:"1200245", name:"Sierra Powell", pin:"0245", role:"trainee", level:10, uplineId:"", email:"sierrap3487@gmail.com", phone:"5404809058", enrollmentDate:"2023-06-05" },
  { id:"darrod0060", phpId:"1200060", name:"Darwyn Rodriguez", pin:"0060", role:"associate", level:20, uplineId:"micedw8462", email:"tdarwyn1121@hotmail.com", phone:"3477205349", enrollmentDate:"2023-06-04" },
  { id:"doresc9983", phpId:"1199983", name:"Doris Escobar", pin:"9983", role:"trainee", level:10, uplineId:"sornas052", email:"doriciti01@gmail.com", phone:"6464741106", enrollmentDate:"2023-06-03" },
  { id:"sanmac9564", phpId:"1199564", name:"Sandra Beatriz Macias", pin:"9564", role:"trainee", level:10, uplineId:"rubari9520", email:"ignitingnationn@gmail.com", phone:"3238169644", enrollmentDate:"2023-06-01" },
  { id:"delrob9530", phpId:"1199530", name:"Delroy Robinson", pin:"9530", role:"trainee", level:10, uplineId:"", email:"robinrobin4fashion.rr@gmail.com", phone:"", enrollmentDate:"2023-06-01" },
  { id:"rubari9520", phpId:"1199520", name:"Ruben Arias", pin:"9520", role:"trainee", level:10, uplineId:"", email:"rudac58@gmail.com", phone:"8182358347", enrollmentDate:"2023-06-01" },
  { id:"nicbof8856", phpId:"1198856", name:"Niclette Bofulu", pin:"8856", role:"trainee", level:10, uplineId:"", email:"bofulumondje@gmail.com", phone:"3233458631", enrollmentDate:"2023-05-31" },
  { id:"mulkas8529", phpId:"1198529", name:"Muluken Kassa", pin:"8529", role:"trainee", level:10, uplineId:"", email:"kassashibabaw@yahoo.com", phone:"3234566959", enrollmentDate:"2023-05-28" },
  { id:"oluafe8511", phpId:"1198511", name:"Oluwaseun Afere", pin:"8511", role:"trainee", level:10, uplineId:"bli001", email:"afereoluwaseun@gmail.com", phone:"8186144472", enrollmentDate:"2023-05-27" },
  { id:"bilank8484", phpId:"1198484", name:"Bill Ankrah", pin:"8484", role:"trainee", level:10, uplineId:"sornas052", email:"ankrahbill04@gmail.com", phone:"6787021644", enrollmentDate:"2023-05-27" },
  { id:"ricvel8480", phpId:"1198480", name:"Ricky Velasquez", pin:"8480", role:"trainee", level:10, uplineId:"taiodu0781", email:"rickyvelasquez2004@gmail.com", phone:"3104800639", enrollmentDate:"2023-05-27" },
  { id:"vilcar8478", phpId:"1198478", name:"Vilma Carranza", pin:"8478", role:"trainee", level:10, uplineId:"", email:"carranzalucrecia3@gmail.com", phone:"8183101178", enrollmentDate:"2023-05-27" },
  { id:"ochogw8113", phpId:"1198113", name:"Ochuko Ogwhoro", pin:"8113", role:"trainee", level:10, uplineId:"", email:"ochuciano@gmail.com", phone:"8628880435", enrollmentDate:"2023-05-24" },
  { id:"laweke7569", phpId:"1197569", name:"Lawrence Eke", pin:"7569", role:"trainee", level:10, uplineId:"taiodu0781", email:"lawrenceeke3@gmail.com", phone:"3233781634", enrollmentDate:"2023-05-20" },
  { id:"crywil6605", phpId:"1196605", name:"Crystal Williams", pin:"6605", role:"trainee", level:10, uplineId:"taiodu0781", email:"ms.cwilliams3@yahoo.com", phone:"2133992405", enrollmentDate:"2023-05-10" },
  { id:"ogboke6196", phpId:"1196196", name:"Ogbonna Okeke", pin:"6196", role:"trainee", level:10, uplineId:"bli001", email:"ogigbidi135@gmail.com", phone:"3102970584", enrollmentDate:"2023-05-06" },
  { id:"lathur5272", phpId:"1195272", name:"LaTisha Hurst", pin:"5272", role:"trainee", level:10, uplineId:"chesim0407", email:"tishhurst4@gmail.com", phone:"5622536529", enrollmentDate:"2023-05-01" },
  { id:"ifeama4623", phpId:"1194623", name:"Ifeanyi Amahia", pin:"4623", role:"trainee", level:10, uplineId:"henobi2010", email:"joyceamahia01@gmail.com", phone:"5598352019", enrollmentDate:"2023-04-29" },
  { id:"jushar4477", phpId:"1194477", name:"Justice Harper", pin:"4477", role:"trainee", level:10, uplineId:"", email:"macjjh04@gmail.com", phone:"7472559341", enrollmentDate:"2023-04-29" },
  { id:"osaedo4332", phpId:"1194332", name:"Osarenoma Edosomwan", pin:"4332", role:"trainee", level:10, uplineId:"", email:"osarenoma3@gmail.com", phone:"3468887235", enrollmentDate:"2023-04-28" },
  { id:"julvil4169", phpId:"1194169", name:"Julio Cesar Flores Villegas", pin:"4169", role:"trainee", level:10, uplineId:"", email:"juliocesarfloresvillegas@gmail.com", phone:"3235616502", enrollmentDate:"2023-04-27" },
  { id:"isavil3531", phpId:"1193531", name:"Isaac Villarreal", pin:"3531", role:"trainee", level:10, uplineId:"sornas052", email:"isaacvillarreal133@gmail.com", phone:"7209601317", enrollmentDate:"2023-04-21" },
  { id:"lissto3394", phpId:"1193394", name:"Lisah Stouffer-Salinas", pin:"3394", role:"trainee", level:10, uplineId:"alesol9314", email:"salinasbunch1@gmail.com", phone:"7192912818", enrollmentDate:"2023-04-20" },
  { id:"cornan3285", phpId:"1193285", name:"Cory Nance", pin:"3285", role:"trainee", level:10, uplineId:"", email:"corynance1990@yahoo.com", phone:"3236367813", enrollmentDate:"2023-04-19" },
  { id:"traala1562", phpId:"1191562", name:"Tracy Alarcon", pin:"1562", role:"field_associate", level:30, uplineId:"jonic6885", email:"tracyalarcon.srl@gmail.com", phone:"3038876062", enrollmentDate:"2023-04-15" },
  { id:"mohahm9866", phpId:"1189866", name:"Mohamed Ahmed", pin:"9866", role:"director", level:40, uplineId:"sornas052", email:"selfdriven100@gmail.com", phone:"7205747499", enrollmentDate:"2023-04-08" },
  { id:"jenony9377", phpId:"1189377", name:"Jennifer Onyekonwu", pin:"9377", role:"trainee", level:10, uplineId:"obi001", email:"onyekonwu@gmail.com", phone:"9094726086", enrollmentDate:"2023-04-06" },
  { id:"alesol9314", phpId:"1189314", name:"Alec Solano", pin:"9314", role:"trainee", level:10, uplineId:"sornas052", email:"alec7879@gmail.com", phone:"6414947879", enrollmentDate:"2023-04-06" },
  { id:"vinrad9077", phpId:"1189077", name:"Vincent Rada", pin:"9077", role:"trainee", level:10, uplineId:"sornas052", email:"vjr2008@gmail.com", phone:"7202751775", enrollmentDate:"2023-04-04" },
  { id:"tyqlew8697", phpId:"1188697", name:"Tyquan Lewis", pin:"8697", role:"trainee", level:10, uplineId:"khaduk2382", email:"lewistyquan13@icloud.com", phone:"8505309876", enrollmentDate:"2023-04-01" },
  { id:"olufai7594", phpId:"1187594", name:"Oluwatyin Fair", pin:"7594", role:"trainee", level:10, uplineId:"taiodu0781", email:"oluwoleoluwatoyin03@yahoo.com", phone:"3235359195", enrollmentDate:"2023-03-30" },
  { id:"microb7422", phpId:"1187422", name:"Michelle Robinson", pin:"7422", role:"trainee", level:10, uplineId:"derros9824", email:"michelle.aprilrobinson@gmail.com", phone:"3614059544", enrollmentDate:"2023-03-29" },
  { id:"ricodu7161", phpId:"1187161", name:"Richard Odunola", pin:"7161", role:"trainee", level:10, uplineId:"taiodu0781", email:"olumiderich@gmail.com", phone:"3109702595", enrollmentDate:"2023-03-27" },
  { id:"luskol6788", phpId:"1186788", name:"Lusu Kollibah", pin:"6788", role:"trainee", level:10, uplineId:"nahjos8827", email:"lusu.kollibah111222@yahoo.com", phone:"8623171302", enrollmentDate:"2023-03-23" },
  { id:"angang6653", phpId:"1186653", name:"Angbashum Angba", pin:"6653", role:"trainee", level:10, uplineId:"sornas052", email:"angangba@gmail.com", phone:"7206071534", enrollmentDate:"2023-03-22" },
  { id:"gifwoo6514", phpId:"1186514", name:"Gifty Woode", pin:"6514", role:"trainee", level:10, uplineId:"lorbro5610", email:"giftyw24@gmail.com", phone:"3232443618", enrollmentDate:"2023-03-22" },
  { id:"sawfor6349", phpId:"1186349", name:"Sawanna Ford", pin:"6349", role:"trainee", level:10, uplineId:"", email:"sawanna.ford@yahoo.com", phone:"3104870195", enrollmentDate:"2023-03-20" },
  { id:"cariny6119", phpId:"1186119", name:"Carol Chukwuemeka Inyama", pin:"6119", role:"trainee", level:10, uplineId:"", email:"carolemmy@hotmail.co.uk", phone:"3106128119", enrollmentDate:"2023-03-17" },
  { id:"yvofis5886", phpId:"1185886", name:"Yvonne Fisher", pin:"5886", role:"trainee", level:10, uplineId:"", email:"suzie.fisher@yanoo.com", phone:"3106692262", enrollmentDate:"2023-03-16" },
  { id:"leasmi5860", phpId:"1185860", name:"Leah Smith", pin:"5860", role:"trainee", level:10, uplineId:"", email:"leah_smith_nichole@yahoo.com", phone:"2135750041", enrollmentDate:"2023-03-16" },
  { id:"lorbro5610", phpId:"1185610", name:"Loretta Brown", pin:"5610", role:"trainee", level:10, uplineId:"", email:"busybonita1@yahoo.com", phone:"3236529010", enrollmentDate:"2023-03-16" },
  { id:"julfis5474", phpId:"1185474", name:"Julian Fisher", pin:"5474", role:"trainee", level:10, uplineId:"", email:"", phone:"", enrollmentDate:"2023-03-16" },
  { id:"brafis5181", phpId:"1185181", name:"Brandon Fisher", pin:"5181", role:"trainee", level:10, uplineId:"", email:"", phone:"", enrollmentDate:"2023-03-16" },
  { id:"malbro4622", phpId:"1184622", name:"Malik Brown", pin:"4622", role:"trainee", level:10, uplineId:"", email:"thedopestgentleman@gmail.com", phone:"9092467891", enrollmentDate:"2023-03-15" },
  { id:"elibro4323", phpId:"1184323", name:"Elijah Brown", pin:"4323", role:"trainee", level:10, uplineId:"", email:"elijahbrown835@gmail.com", phone:"7075611359", enrollmentDate:"2023-03-14" },
  { id:"wensal3908", phpId:"1183908", name:"Wendy Salinas", pin:"3908", role:"trainee", level:10, uplineId:"", email:"wendyjsalinas@gmail.com", phone:"7472674262", enrollmentDate:"2023-03-12" },
  { id:"jorval3582", phpId:"1183582", name:"Jorge Valencia", pin:"3582", role:"trainee", level:10, uplineId:"", email:"jorge.valencia.13@gmail.com", phone:"8017340634", enrollmentDate:"2023-03-11" },
  { id:"margon2995", phpId:"1182995", name:"Marisol Gonzales", pin:"2995", role:"trainee", level:10, uplineId:"jonic6885", email:"marigon1128@yahoo.com", phone:"3612182975", enrollmentDate:"2023-03-08" },
  { id:"alqfau2911", phpId:"1182911", name:"Alquilia Faulks", pin:"2911", role:"trainee", level:10, uplineId:"stepat2097", email:"agayton13@gmail.com", phone:"7577355554", enrollmentDate:"2023-03-07" },
  { id:"pedgar2880", phpId:"1182880", name:"Pedro Garza", pin:"2880", role:"trainee", level:10, uplineId:"diagar2160", email:"jay_garza26@yahoo.com", phone:"3616490263", enrollmentDate:"2023-03-07" },
  { id:"vicmek2816", phpId:"1182816", name:"Victorine Mekou", pin:"2816", role:"trainee", level:10, uplineId:"stepat2097", email:"victorinemekou@gmail.com", phone:"6462670531", enrollmentDate:"2023-03-06" },
  { id:"abdogu2808", phpId:"1182808", name:"Abdulsemiu Ogun", pin:"2808", role:"trainee", level:10, uplineId:"taiodu0781", email:"", phone:"3238024167", enrollmentDate:"2023-03-06" },
  { id:"judenw2745", phpId:"1182745", name:"Jude Enwereji", pin:"2745", role:"trainee", level:10, uplineId:"bli001", email:"enwerejijude@yahoo.com", phone:"6233132046", enrollmentDate:"2023-03-06" },
  { id:"felsua2570", phpId:"1182570", name:"Felix Suarez", pin:"2570", role:"trainee", level:10, uplineId:"stepat2097", email:"suarez.221@hotmail.com", phone:"7187955486", enrollmentDate:"2023-03-04" },
  { id:"zatmcn2559", phpId:"1182559", name:"Zatasha McNeice", pin:"2559", role:"trainee", level:10, uplineId:"bli001", email:"zatashamcneice1982@gmail.com", phone:"3233594643", enrollmentDate:"2023-03-04" },
  { id:"ryali2385", phpId:"1182385", name:"Ryan Li", pin:"2385", role:"trainee", level:10, uplineId:"stepat2097", email:"elite33932@yahoo.com", phone:"4156299026", enrollmentDate:"2023-03-04" },
  { id:"khaduk2382", phpId:"1182382", name:"Khalil Dukes", pin:"2382", role:"trainee", level:10, uplineId:"stepat2097", email:"lancedukes27@gmail.com", phone:"2252414400", enrollmentDate:"2023-03-04" },
  { id:"rufgwa2296", phpId:"1182296", name:"Rufaro Gwarada", pin:"2296", role:"trainee", level:10, uplineId:"bli001", email:"rgwarad@proton.me", phone:"4158192345", enrollmentDate:"2023-03-03" },
  { id:"diagar2160", phpId:"1182160", name:"Diane Garza", pin:"2160", role:"trainee", level:10, uplineId:"jonic6885", email:"dianegarza@hotmail.com", phone:"3616522672", enrollmentDate:"2023-03-02" },
  { id:"jaclop2076", phpId:"1182076", name:"Jacobe Lopez", pin:"2076", role:"trainee", level:10, uplineId:"obi001", email:"jacobayy22@gmail.com", phone:"3154392054", enrollmentDate:"2023-03-01" },
  { id:"henobi2010", phpId:"1182010", name:"Henry Obi-Ijomah", pin:"2010", role:"associate", level:20, uplineId:"obi001", email:"henryobi_ijomah@yahoo.com", phone:"6575143771", enrollmentDate:"2023-03-01" },
  { id:"chacam1679", phpId:"1181679", name:"Chanell Campbell", pin:"1679", role:"trainee", level:10, uplineId:"", email:"chanellc@yahoo.com", phone:"3108666078", enrollmentDate:"2023-03-01" },
  { id:"damaki1527", phpId:"1181527", name:"Damilola Akinyemi", pin:"1527", role:"trainee", level:10, uplineId:"", email:"", phone:"", enrollmentDate:"2023-03-01" },
  { id:"jadjos1186", phpId:"1181186", name:"Jade Joseph", pin:"1186", role:"trainee", level:10, uplineId:"nahjos8827", email:"jadejoseph2002@gmail.com", phone:"2017459198", enrollmentDate:"2023-03-01" },
  { id:"kenste0866", phpId:"1180866", name:"Kenia Stephens", pin:"0866", role:"trainee", level:10, uplineId:"nahjos8827", email:"keniastephens@gmail.com", phone:"8453266625", enrollmentDate:"2023-03-01" },
  { id:"taiodu0781", phpId:"1180781", name:"Taiwo Odunola", pin:"0781", role:"director", level:40, uplineId:"", email:"taiwodunola@yahoo.com", phone:"9293858887", enrollmentDate:"2023-03-01" },
  { id:"jumbin0706", phpId:"1180706", name:"Jumada Bintsur-rahman", pin:"0706", role:"trainee", level:10, uplineId:"obi001", email:"jumadabint@gmail.com", phone:"7726264913", enrollmentDate:"2023-03-01" },
  { id:"birros0323", phpId:"1180323", name:"Birdie Ross", pin:"0323", role:"trainee", level:10, uplineId:"derros9824", email:"nani@txbackwoods.com", phone:"3616524638", enrollmentDate:"2023-02-28" },
  { id:"valvel0236", phpId:"1180236", name:"Valeria Velazquez", pin:"0236", role:"trainee", level:10, uplineId:"bli001", email:"valeriava2003@gmail.com", phone:"7029183564", enrollmentDate:"2023-02-28" },
  { id:"ifunwa0197", phpId:"1180197", name:"Ifunanya Nwanebo", pin:"0197", role:"trainee", level:10, uplineId:"", email:"inwanebo18@gmail.com", phone:"4146003401", enrollmentDate:"2023-02-28" },
  { id:"colmor0072", phpId:"1180072", name:"Colin Morris", pin:"0072", role:"trainee", level:10, uplineId:"nahjos8827", email:"colinmorris8695@gmail.com", phone:"8455518104", enrollmentDate:"2023-02-28" },
  { id:"micedw0028", phpId:"1180028", name:"Michael Edwin", pin:"0028", role:"trainee", level:10, uplineId:"micedw8462", email:"mie7998@nyu.edu", phone:"", enrollmentDate:"2023-02-27" },
  { id:"kimros0008", phpId:"1180008", name:"Kimberly Ross", pin:"0008", role:"trainee", level:10, uplineId:"chrhra9987", email:"kdains_34@hotmail.com", phone:"3194312998", enrollmentDate:"2023-02-27" },
  { id:"chrhra9987", phpId:"1179987", name:"Christina Hradek", pin:"9987", role:"trainee", level:10, uplineId:"derros9824", email:"chradek.2019@gmail.com", phone:"3192022311", enrollmentDate:"2023-02-27" },
  { id:"derros9824", phpId:"1179824", name:"Derick Ross", pin:"9824", role:"trainee", level:10, uplineId:"termot9590", email:"derick@txbackwoods.com", phone:"3616526900", enrollmentDate:"2023-02-27" },
  { id:"silnol9807", phpId:"1179807", name:"Silvia Nolasco", pin:"9807", role:"trainee", level:10, uplineId:"", email:"snlopez777@gmail.com", phone:"6262571622", enrollmentDate:"2023-02-27" },
  { id:"quesut9794", phpId:"1179794", name:"Queen Sutherland", pin:"9794", role:"trainee", level:10, uplineId:"nahjos8827", email:"sutherlandqueen1@gmail.com", phone:"8453260681", enrollmentDate:"2023-02-26" },
  { id:"termot9590", phpId:"1179590", name:"Teri Moten", pin:"9590", role:"trainee", level:10, uplineId:"jonic6885", email:"teri@yourbusinessproblemsolver.com", phone:"3612370212", enrollmentDate:"2023-02-25" },
  { id:"fraedw9568", phpId:"1179568", name:"Frank Edwin", pin:"9568", role:"trainee", level:10, uplineId:"micedw8462", email:"djfrankedwin@gmail.com", phone:"9734125988", enrollmentDate:"2023-02-25" },
  { id:"henedw9204", phpId:"1179204", name:"Henry Edwin", pin:"9204", role:"trainee", level:10, uplineId:"micedw8462", email:"henryedwin07@gmail.com", phone:"9735416244", enrollmentDate:"2023-02-24" },
  { id:"barwor9107", phpId:"1179107", name:"Barbara Worsley", pin:"9107", role:"trainee", level:10, uplineId:"jonic6885", email:"barb.worsley12@gmail.com", phone:"7573039925", enrollmentDate:"2023-02-23" },
  { id:"nahjos8827", phpId:"1178827", name:"Nahja Joseph", pin:"8827", role:"director", level:40, uplineId:"micedw8462", email:"nahjajphpagency@gmail.com", phone:"2017169737", enrollmentDate:"2023-02-22" },
  { id:"ivolog8753", phpId:"1178753", name:"Ivonne Logah", pin:"8753", role:"trainee", level:10, uplineId:"", email:"mayaiscleaning@gmail.com", phone:"3853710503", enrollmentDate:"2023-02-22" },
  { id:"chebag8671", phpId:"1178671", name:"Chekwube Bagalwa", pin:"8671", role:"trainee", level:10, uplineId:"", email:"bestbagalwa@gmail.com", phone:"8018198231", enrollmentDate:"2023-02-21" },
  { id:"jeachi8627", phpId:"1178627", name:"Jean-Paul Chin-sue", pin:"8627", role:"trainee", level:10, uplineId:"stepat2097", email:"jpchinsue29@gmail.com", phone:"3345596183", enrollmentDate:"2023-02-21" },
  { id:"jorsar8587", phpId:"1178587", name:"Jordan Sartor", pin:"8587", role:"trainee", level:10, uplineId:"jonic6885", email:"j.sartor22@gmail.com", phone:"5038412795", enrollmentDate:"2023-02-20" },
  { id:"chinwa8546", phpId:"1178546", name:"Chinaza Nwanebo", pin:"8546", role:"trainee", level:10, uplineId:"", email:"nwanebochinaza97@gmail.com", phone:"4143991123", enrollmentDate:"2023-02-20" },
  { id:"milgar8532", phpId:"1178532", name:"Mildred Garcia", pin:"8532", role:"field_associate", level:30, uplineId:"jonic6885", email:"mildredgarcia211@gmail.com", phone:"3616483077", enrollmentDate:"2023-02-20" },
  { id:"ricols8512", phpId:"1178512", name:"Richard Olson", pin:"8512", role:"trainee", level:10, uplineId:"sornas052", email:"richard.olson219@gmail.com", phone:"7205896888", enrollmentDate:"2023-02-19" },
  { id:"micedw8462", phpId:"1178462", name:"Michael Edwin", pin:"8462", role:"director", level:40, uplineId:"bli001", email:"michaelphpagency@gmail.com", phone:"9733683490", enrollmentDate:"2023-02-19" },
  { id:"ranbur8354", phpId:"1178354", name:"Randy C Burttschell", pin:"8354", role:"trainee", level:10, uplineId:"jonic6885", email:"burttschell123159@gmail.com", phone:"9792485119", enrollmentDate:"2023-02-18" },
  { id:"ebobor8307", phpId:"1178307", name:"Ebonne Borden", pin:"8307", role:"trainee", level:10, uplineId:"ebekal1112", email:"ebonnie26@gmail.com", phone:"8579193502", enrollmentDate:"2023-02-18" },
  { id:"tragya8005", phpId:"1178005", name:"Tracy Adjei Gyamfi", pin:"8005", role:"trainee", level:10, uplineId:"stepat2097", email:"tracyadjei@icloud.com", phone:"3478505897", enrollmentDate:"2023-02-16" },
  { id:"biagal6972", phpId:"1176972", name:"Bianca Gallegos", pin:"6972", role:"trainee", level:10, uplineId:"", email:"bianca.diaz17@yahoo.com", phone:"9096010946", enrollmentDate:"2023-02-11" },
  { id:"jonic6885", phpId:"1176885", name:"Jo Ann Nichols", pin:"6885", role:"field_associate", level:30, uplineId:"sornas052", email:"jnicholstx@yahoo.com", phone:"7204314303", enrollmentDate:"2023-02-10" },
  { id:"jesalo6558", phpId:"1176558", name:"Jessica Alohan", pin:"6558", role:"trainee", level:10, uplineId:"osaalo6554", email:"jessicadweaver88@gmail.com", phone:"8013766066", enrollmentDate:"2023-02-08" },
  { id:"osaalo6554", phpId:"1176554", name:"Osaro Alohan", pin:"6554", role:"trainee", level:10, uplineId:"", email:"chriosaro1980@gmail.com", phone:"3462645739", enrollmentDate:"2023-02-08" },
  { id:"prooko6499", phpId:"1176499", name:"Promise Okongwu", pin:"6499", role:"trainee", level:10, uplineId:"bli001", email:"promiseokongwu@gmail.com", phone:"3102201611", enrollmentDate:"2023-02-07" },
  { id:"micmil6017", phpId:"1176017", name:"Mickerlove Milfort", pin:"6017", role:"trainee", level:10, uplineId:"", email:"", phone:"9543940686", enrollmentDate:"2023-02-03" },
  { id:"ovbode5977", phpId:"1175977", name:"Ovbanaegbere Odeh", pin:"5977", role:"trainee", level:10, uplineId:"bli001", email:"ebodeh1@gmail.com", phone:"3233148380", enrollmentDate:"2023-02-02" },
  { id:"frapin5877", phpId:"1175877", name:"Francisco Melgar Pineda", pin:"5877", role:"trainee", level:10, uplineId:"", email:"framelgar@gmail.com", phone:"7144097808", enrollmentDate:"2023-02-01" },
  { id:"dorken5103", phpId:"1175103", name:"Doree' Kennedy", pin:"5103", role:"trainee", level:10, uplineId:"", email:"soleimia@icloud.com", phone:"9298884589", enrollmentDate:"2023-02-01" },
  { id:"ugooko5007", phpId:"1175007", name:"Ugochukwu Emmanuel Okoli", pin:"5007", role:"trainee", level:10, uplineId:"bli001", email:"ugodinhoemmafs@gmail.com", phone:"5617042523", enrollmentDate:"2023-01-31" },
  { id:"vokomo4906", phpId:"1174906", name:"Voke Omoru", pin:"4906", role:"trainee", level:10, uplineId:"macade3528", email:"vokelinda1@gmail.com", phone:"8166514029", enrollmentDate:"2023-01-31" },
  { id:"oluaiy4845", phpId:"1174845", name:"Oluwayemi Aiyedogbon", pin:"4845", role:"trainee", level:10, uplineId:"macade3528", email:"aiyedogbonbola@gmail.com", phone:"7193606974", enrollmentDate:"2023-01-31" },
  { id:"ejiare4200", phpId:"1174200", name:"Ejiroghene Aremu", pin:"4200", role:"trainee", level:10, uplineId:"abiare4194", email:"roseythomas9@gmail.com", phone:"3852078318", enrollmentDate:"2023-01-26" },
  { id:"abiare4194", phpId:"1174194", name:"Abidemi Aremu", pin:"4194", role:"trainee", level:10, uplineId:"", email:"abidemiaremu86@yahoo.com", phone:"8019288747", enrollmentDate:"2023-01-26" },
  { id:"macade3528", phpId:"1173528", name:"Macqueen Adeneye", pin:"3528", role:"associate", level:20, uplineId:"", email:"macqueenadeneye@gmail.com", phone:"6616756941", enrollmentDate:"2023-01-20" },
  { id:"steoko3146", phpId:"1173146", name:"Stephen Okoh", pin:"3146", role:"trainee", level:10, uplineId:"", email:"okohstephen20@gmail.com", phone:"2134070939", enrollmentDate:"2023-01-16" },
  { id:"jeregu2800", phpId:"1172800", name:"Jeremiah Egujie", pin:"2800", role:"trainee", level:10, uplineId:"", email:"jeremiahegujie14@gmail.com", phone:"3109851303", enrollmentDate:"2023-01-15" },
  { id:"kelaju2186", phpId:"1172186", name:"Kelechi Ajuzie", pin:"2186", role:"trainee", level:10, uplineId:"", email:"kecyb4real@yahoo.com", phone:"8018367655", enrollmentDate:"2023-01-11" },
  { id:"stepat2097", phpId:"1172097", name:"Steven Batkam Patadji", pin:"2097", role:"field_associate", level:30, uplineId:"bli001", email:"stevenkam08@gmail.com", phone:"9295955046", enrollmentDate:"2023-01-11" },
  { id:"abbbak1863", phpId:"1171863", name:"Abbey Bakare", pin:"1863", role:"trainee", level:10, uplineId:"bli001", email:"mormon1830@gmail.com", phone:"8018988118", enrollmentDate:"2023-01-09" },
  { id:"gabpul1842", phpId:"1171842", name:"Gabriel Pulido-Gonzalez", pin:"1842", role:"trainee", level:10, uplineId:"", email:"gabrielpulido2345@gmail.com", phone:"3854829191", enrollmentDate:"2023-01-09" },
  { id:"wilval1839", phpId:"1171839", name:"Willona Valentine", pin:"1839", role:"trainee", level:10, uplineId:"", email:"jase1018@gmail.com", phone:"7245062120", enrollmentDate:"2023-01-08" },
  { id:"davdud1801", phpId:"1171801", name:"David Dudley", pin:"1801", role:"trainee", level:10, uplineId:"", email:"marketingproductsandservices@gmail.com", phone:"6269053852", enrollmentDate:"2023-01-08" },
  { id:"chiili1797", phpId:"1171797", name:"Chinedu Iliemena", pin:"1797", role:"trainee", level:10, uplineId:"chrano1445", email:"michael.iliemena@gmail.com", phone:"7134926684", enrollmentDate:"2023-01-08" },
  { id:"quiada1781", phpId:"1171781", name:"Quintin Adamson", pin:"1781", role:"trainee", level:10, uplineId:"", email:"quitnonadamson77@gmail.com", phone:"7243129674", enrollmentDate:"2023-01-08" },
  { id:"jasjr1773", phpId:"1171773", name:"Jasson Adamson-Valentine Jr.", pin:"1773", role:"trainee", level:10, uplineId:"", email:"chuckeleebond@gmail.com", phone:"7272877045", enrollmentDate:"2023-01-08" },
  { id:"chrano1445", phpId:"1171445", name:"Christopher Anoruo", pin:"1445", role:"trainee", level:10, uplineId:"", email:"anoruochristopher11@gmail.com", phone:"8013897078", enrollmentDate:"2023-01-05" },
  { id:"bleogb1264", phpId:"1171264", name:"Blessing Ogbonnaya", pin:"1264", role:"trainee", level:10, uplineId:"", email:"blessingofoegbu@ymail.com", phone:"3232820511", enrollmentDate:"2023-01-03" },
  { id:"marcos1231", phpId:"1171231", name:"Marie Cossogu", pin:"1231", role:"trainee", level:10, uplineId:"joscos1230", email:"micheca2000@yahoo.fr", phone:"8016874325", enrollmentDate:"2023-01-03" },
  { id:"joscos1230", phpId:"1171230", name:"Joseph Cossogu", pin:"1230", role:"trainee", level:10, uplineId:"", email:"jecossogu@gmail.com", phone:"8014271694", enrollmentDate:"2023-01-03" },
  { id:"verrod1149", phpId:"1171149", name:"Veronica Rodriguez", pin:"1149", role:"trainee", level:10, uplineId:"", email:"veronica-1027@live.com", phone:"8014277691", enrollmentDate:"2023-01-02" },
  { id:"ebekal1112", phpId:"1171112", name:"Eberechi Kalu", pin:"1112", role:"field_associate", level:30, uplineId:"bli001", email:"eberechik@gmail.com", phone:"9783876524", enrollmentDate:"2023-01-01" },
  { id:"joyoro1008", phpId:"1171008", name:"Joy Orogba", pin:"1008", role:"trainee", level:10, uplineId:"", email:"joyorogba@yahoo.com", phone:"8327908950", enrollmentDate:"2023-01-01" },
  { id:"jeania0991", phpId:"1170991", name:"Jeannette Niambara", pin:"0991", role:"trainee", level:10, uplineId:"", email:"jeannette.niambara@yahoo.com", phone:"2069794067", enrollmentDate:"2023-01-01" },
];

// ── 4. PAGE ACCESS LEVELS ─────────────────────────────────────
// ── TOOL GRANTS — MD-assigned access beyond the default role gate ────
// Marketing Directors (super_admin tier) can hand an individual agent —
// including one of their admins — access to a specific restricted tool
// they wouldn't otherwise have by rank. This never lowers anyone's
// access, only adds to it, and it's scoped per-agent, not org-wide.
const TOOL_GRANTS_KEY = 'dba_tool_grants';
const GRANTABLE_TOOLS = [
  { page: 'roster-admin.html',  label: 'Roster Admin' },
  { page: 'os.html',            label: 'Agency OS' },
  { page: 'pmd-hub.html',       label: 'PMD Hub' },
  { page: 'bmp-platform.html',  label: 'BMP Platform' },
  { page: 'monday-sync.html',   label: 'Monday Sync' },
  { page: 'monday-setup.html',  label: 'Monday Board Setup' },
  { page: 'monday-test.html',   label: 'Monday Test Tool' },
  { page: 'mentor.html',        label: 'Mentor Mode' },
  { page: 'create-bom-board.html', label: 'Create BOM Board' },
  { page: 'create-consciousness-board.html', label: 'Create Power vs Force Board' },
  { page: 'make-scenario-builder.html', label: 'Scenario Builder' },
  { page: 'md-tracker.html',    label: 'MD Promotion Tracker' },
  { page: 'attendance.html',    label: 'Attendance' },
  { page: 'licensing.html',     label: 'Licensing Tracker' },
  { page: 'recognitions.html',  label: 'Thankful Thursday' },
  { page: 'contest-tracker.html', label: 'Contest & Recognition' },
  { page: 'bom.html',           label: 'BOM Tracker' },
  { page: 'cft-matcher.html',   label: 'CFT Matcher' },
  { page: 'reminders.html',     label: 'Team Reminders' },
];
function getAllToolGrants() {
  try { return JSON.parse(localStorage.getItem(TOOL_GRANTS_KEY) || '{}'); } catch(e) { return {}; }
}
function getToolGrantsFor(agentId) {
  const all = getAllToolGrants();
  return all[agentId] || [];
}

// ── SHARED STORAGE FOR GRANTS — Monday.com ────────────────────────
// localStorage alone never leaves the device that set it, so a grant an
// MD makes on their own laptop was invisible to the agent it was meant
// for, opening the app on their own phone or computer. One item per
// grant on a shared board, named "<agentId>__<page>", is the source of
// truth; the localStorage map above is just a same-device cache of it.
const TOOL_GRANTS_BOARD_KEY = 'dba_tool_grants_board_id';
let _toolGrantsRefreshed = false;

async function refreshToolGrantsFromMonday() {
  const boardId = localStorage.getItem(TOOL_GRANTS_BOARD_KEY);
  if (!boardId || typeof AUTH === 'undefined' || !AUTH.getMondayKey?.()) return false;
  try {
    const res = await mondayQuery(`{ boards(ids:${boardId}) { items_page(limit:500) { items { id name } } } }`);
    const items = res?.data?.boards?.[0]?.items_page?.items || [];
    const rebuilt = {};
    items.forEach(it => {
      const sep = it.name.indexOf('__');
      if (sep < 0) return;
      const agentId = it.name.slice(0, sep);
      const page = it.name.slice(sep + 2);
      if (!rebuilt[agentId]) rebuilt[agentId] = [];
      if (!rebuilt[agentId].includes(page)) rebuilt[agentId].push(page);
    });
    localStorage.setItem(TOOL_GRANTS_KEY, JSON.stringify(rebuilt));
    return true;
  } catch(e) {
    console.warn('Tool grants: could not sync from Monday:', e.message);
    return false;
  }
}

async function syncGrantToMonday(agentId, page, granted) {
  const boardId = localStorage.getItem(TOOL_GRANTS_BOARD_KEY);
  if (!boardId || typeof AUTH === 'undefined' || !AUTH.getMondayKey?.()) return;
  const itemName = `${agentId}__${page}`;
  try {
    const res = await mondayQuery(`{ boards(ids:${boardId}) { items_page(limit:500) { items { id name } } } }`);
    const items = res?.data?.boards?.[0]?.items_page?.items || [];
    const existing = items.find(it => it.name === itemName);
    if (granted && !existing) {
      await mondayQuery(`mutation { create_item(board_id:${boardId}, item_name:"${itemName}") { id } }`);
    } else if (!granted && existing) {
      await mondayQuery(`mutation { delete_item(item_id:${existing.id}) { id } }`);
    }
  } catch(e) {
    console.warn('Tool grants: could not sync to Monday:', e.message);
  }
}

function setToolGrant(agentId, page, granted) {
  const all = getAllToolGrants();
  const current = new Set(all[agentId] || []);
  if (granted) current.add(page); else current.delete(page);
  if (current.size) all[agentId] = [...current]; else delete all[agentId];
  try { localStorage.setItem(TOOL_GRANTS_KEY, JSON.stringify(all)); } catch(e) {}
  syncGrantToMonday(agentId, page, granted); // fire-and-forget — this device's cache is already updated above
}

const PAGE_ACCESS = {
  // ── All agents (level 0) ──────────────────────────────────
  "hub.html":                   0,
  "tracker.html":               0,
  "calendar.html":              0,
  "portal.html":                0,
  "survey.html":                0,
  "leaderboard.html":           0,
  "training.html":              0,
  "incentives.html":            0,
  "incentive-tracker.html":     0,
  "licensing.html":             0,
  "agent-dashboard.html":       0,
  "top25.html":                 0,
  "performance.html":           0,
  "promotions.html":            0,
  "recognitions.html":          0,
  "bom.html":                   0,   // All agents can track BOM guests
  "analytics.html":             0,   // All agents can see lead analytics
  "lead-dashboard.html":        0,
  "marketing.html":             0,   // All agents can access marketing tools
  "income-calculator.html":     0,
  "opportunity.html":           0,
  "client.html":                0,
  "recruit.html":               0,
  "free-guide.html":            0,
  "brochure.html":              0,
  "employer-vs-iul-brochure.html": 0,
  "employer-vs-iul-survey.html":   0,
  "world-cup-survey.html":      0,
  "world-cup.html":             0,
  "schedule-1on1.html":         0,
  "register-zoom.html":         0,
  "register-inperson.html":     0,
  "index.html":                 0,
  // ── Field Associate+ (level 30) ───────────────────────────
  "drip-campaign.html":         0,  // FA+ can run drip campaigns
  // ── Director+ (level 40) ──────────────────────────────────
  "survey-leaderboard.html":    0,
  // ── Marketing Director+ (level 60) ───────────────────────
  "os.html":                    60,  // Agency OS — leadership ops
  "pmd-hub.html":               60,
  "bmp-platform.html":          60,
  "monday-sync.html":           60,
  // ── Admin+ (level 100) ────────────────────────────────────
  "monday-setup.html":          60,  // Board Setup — open to MDs
  "monday-test.html":           60,  // Test Tool — open to MDs
  "agents.html":                0,   // Agent roster — all agents can view their own profile
  "roster-admin.html":          60,  // Full roster management — MD+/Super Admin only (Admin tier excluded, see in-page check)
  "make-scenario-builder.html": 100,
  "create-bom-board.html":      60,
  "mentor.html":                60,
  "create-consciousness-board.html": 60,
  // ── Super Admin only (level 999) — enforced by super_admin role ──
  // No pages locked to 999 — super_admin just sees everything
};

// ── 5. SIDEBAR NAV CONFIG ─────────────────────────────────────
const NAV_ITEMS = [
  { section: "Daily Work" },
  { icon:"🏠", label:"Command Center",    href:"hub.html",          minLevel:0  },
  { icon:"⭐", label:"Top 25 Prospects",  href:"top25.html",        minLevel:0  },
  { icon:"📞", label:"Call Tracker",       href:"tracker.html",      minLevel:0  },
  { icon:"📋", label:"Agent Portal",       href:"portal.html",       minLevel:0  },
  { section: "Performance" },
  { icon:"🏆", label:"Leaderboard",        href:"leaderboard.html",  minLevel:0  },
  { icon:"📊", label:"Performance 2026",  href:"performance.html",  minLevel:0  },
  { section: "Growth" },
  { icon:"🎯", label:"Promotions",         href:"promotions.html",   minLevel:0  },
  { icon:"🙏", label:"Thankful Thursday",  href:"recognitions.html", minLevel:0  },
  { icon:"📅", label:"BOM Tracker",        href:"bom.html",          minLevel:0 },
  { icon:"🏅", label:"Contests & Prizes",  href:"incentives.html",   minLevel:0  },
  { icon:"📚", label:"Training Hub",       href:"training.html",     minLevel:0  },
  { section: "Leadership" },
  { icon:"📢", label:"Marketing Hub",      href:"marketing.html",    minLevel:0 },
  { icon:"⚙️", label:"Agency OS",          href:"os.html",           minLevel:60 },
  { icon:"🖥️", label:"PMD Hub",            href:"pmd-hub.html",      minLevel:60 },
  { icon:"🔄", label:"Monday Sync",        href:"monday-sync.html",  minLevel:60 },
  { icon:"🗄️", label:"Board Setup",        href:"monday-setup.html", minLevel:60 },
  { section: "Admin" },
  { icon:"➕", label:"Add Agent",           href:"agents.html",       minLevel:60 }
];

// ── 6. SESSION MANAGEMENT ─────────────────────────────────────
const AUTH = {
  SESSION_KEY:          "dba_session",
  MONDAY_KEY_STORAGE:   "dba_monday_key",

  // ── BUILT-IN MONDAY.COM API KEY ───────────────────────────────
  // This key is used by all agents automatically on every device.
  // To rotate: replace the value below and redeploy.
  // Agents can still override with their own key via Board Setup.
  MONDAY_KEY_DEFAULT:  'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY1Nzg0OTc3NSwiYWFpIjoxMSwidWlkIjo2MTY2MDI5NCwiaWFkIjoiMjAyNi0wNS0xM1QwOTo0OTowNy4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjM3NjI1MTMsInJnbiI6InVzZTEifQ.eCbOAEJTC3mcsit4IjVWOw3r2wyQBYL4lN5Qmnok0r0',
  ANTHROPIC_KEY_STORAGE:"dba_anthropic_key",

  login(agentId, pin) {
    const agent = AGENTS.find(a =>
      a.id.toLowerCase() === agentId.trim().toLowerCase() && a.pin === pin.trim()
    );
    if (!agent) return { success: false, error: 'Invalid PIN. Try again.' };

    const now      = new Date();
    const today    = now.toISOString().slice(0, 10);
    const loginAt  = now.toISOString();

    // ── Streak tracking ──────────────────────────────────────
    const STREAK_KEY = 'dba_streak_' + agent.id;
    let streakData = {};
    try { streakData = JSON.parse(localStorage.getItem(STREAK_KEY) || '{}'); } catch(e) {}
    const lastDate  = streakData.lastDate || null;
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const yStr      = yesterday.toISOString().slice(0, 10);
    let streak = streakData.streak || 0;
    if (lastDate === today) {
      // Already logged in today — keep streak as-is
    } else if (lastDate === yStr) {
      // Logged in yesterday — extend streak
      streak++;
    } else {
      // Missed a day — reset streak
      streak = 1;
    }
    const longestStreak = Math.max(streak, streakData.longestStreak || 0);
    const totalDays     = (streakData.totalDays || 0) + (lastDate === today ? 0 : 1);
    streakData = { streak, longestStreak, totalDays, lastDate: today, lastLoginAt: loginAt };
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(streakData)); } catch(e) {}

    // ── Login history (rolling 60-day log per agent) ─────────
    const HIST_KEY = 'dba_login_hist_' + agent.id;
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch(e) {}
    if (!hist.length || hist[hist.length-1].date !== today) {
      hist.push({ date: today, at: loginAt });
      if (hist.length > 60) hist = hist.slice(-60);
      try { localStorage.setItem(HIST_KEY, JSON.stringify(hist)); } catch(e) {}
    }

    // ── Global activity log (for admin dashboard) ───────────
    const GLOBAL_KEY = 'dba_activity_log';
    try {
      let global = JSON.parse(localStorage.getItem(GLOBAL_KEY) || '[]');
      const last = global.find(e => e.agentId === agent.id && e.date === today);
      if (!last) {
        global.unshift({ agentId: agent.id, name: agent.name, date: today, at: loginAt, streak });
        if (global.length > 500) global = global.slice(0, 500);
        localStorage.setItem(GLOBAL_KEY, JSON.stringify(global));
      }
    } catch(e) {}

    const session = {
      agentId:       agent.id,
      name:          agent.name,
      role:          agent.role,
      level:         getEffectiveLevel(agent),
      adminTier:     getAdminTier(agent),
      phpId:         agent.phpId,
      phone:         agent.phone,
      email:         agent.email,
      loginAt,
      streak,
      longestStreak,
      totalDays,
      source:        'local'
    };
    sessionStorage.setItem(AUTH.SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
  },

  // ── Streak helpers ─────────────────────────────────────────
  getStreak(agentId) {
    try { return JSON.parse(localStorage.getItem('dba_streak_' + agentId) || '{}'); } catch(e) { return {}; }
  },
  getLoginHistory(agentId) {
    try { return JSON.parse(localStorage.getItem('dba_login_hist_' + agentId) || '[]'); } catch(e) { return []; }
  },
  getActivityLog() {
    try { return JSON.parse(localStorage.getItem('dba_activity_log') || '[]'); } catch(e) { return []; }
  },

  // Alias so login page async call still works without change
  async loginAsync(agentId, pin) {
    return this.login(agentId, pin);
  },


  getSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(AUTH.SESSION_KEY));
      if (!s) return null;
      // ── Session migration: recalculate level from role if stale ──
      // This fixes sessions stored before super_admin/role changes
      const freshLevel = ROLES[s.role]?.level;
      if (freshLevel !== undefined && s.level !== freshLevel) {
        s.level = freshLevel;
        sessionStorage.setItem(AUTH.SESSION_KEY, JSON.stringify(s));
      }
      return s;
    }
    catch { return null; }
  },

  getAgent() {
    const s = AUTH.getSession();
    if (!s) return null;
    return AGENTS.find(a => a.id === s.agentId) || null;
  },

  canAccess(page) {
    const s = AUTH.getSession();
    const required = PAGE_ACCESS[page] ?? 0;
    return s && s.level >= required;
  },

  require(page) {
    const s = AUTH.getSession();
    if (!s) { window.location.href = 'index.html'; return false; }
    const required = PAGE_ACCESS[page] ?? 0;
    if (s.level >= required) return true; // fast path — no grant check needed at all

    if (getToolGrantsFor(s.agentId).includes(page)) return true; // already cached on this device

    // Not enough by rank, and nothing cached locally yet — this may just
    // mean an MD granted it from a different device and this one hasn't
    // heard about it. Let the page render optimistically while a live
    // check runs in the background; only redirect if that check confirms
    // there's genuinely no grant. Real Monday.com data always wins over
    // whatever's (or isn't) cached here.
    refreshToolGrantsFromMonday().then(() => {
      if (!getToolGrantsFor(s.agentId).includes(page)) {
        window.location.href = 'hub.html';
      }
    });
    return true;
  },
  getToolGrants: getToolGrantsFor,
  setToolGrant: setToolGrant,
  refreshToolGrants: refreshToolGrantsFromMonday,
  GRANTABLE_TOOLS: GRANTABLE_TOOLS,

  logout() {
    sessionStorage.removeItem(AUTH.SESSION_KEY);
    window.location.href = 'index.html';
  },

  saveMondayKey(k)   { try { localStorage.setItem(AUTH.MONDAY_KEY_STORAGE, k); } catch {} },
  getMondayKey()     {
    try {
      // 1. Agent-specific key stored via Board Setup (takes priority)
      const stored = localStorage.getItem(AUTH.MONDAY_KEY_STORAGE);
      if (stored && stored.length > 10) return stored;
    } catch {}
    // 2. Built-in org key — standalone constant always accessible
    return MONDAY_ORG_KEY || AUTH.MONDAY_KEY_DEFAULT || '';
  },
  saveAnthropicKey(k){ try { localStorage.setItem(AUTH.ANTHROPIC_KEY_STORAGE, k); } catch {} },
  getAnthropicKey()  { try { return localStorage.getItem(AUTH.ANTHROPIC_KEY_STORAGE) || ''; } catch { return ''; } }
};

// ── 7. HELPER FUNCTIONS ───────────────────────────────────────
function getAgentById(id)      { return AGENTS.find(a => a.id === id) || null; }

// ── ADMIN TIER — separate from PHP promotion rank ───────────────
// PHP rank (role/level, e.g. Director, Senior Marketing Director) always
// reflects someone's real title and drives commission/promotion tracking.
// adminTier is a distinct, optional layer controlling internal tool access:
//   'admin'       — Directors by default, or an explicit override (e.g.
//                    a Trainee named the team's admin) — BMP Platform, but
//                    NOT analytics/roster tools.
//   'super_admin' — Marketing Director and above by default — every tool,
//                    except changing API keys.
//   'super_user'  — Obi Iroezi only — everything, including API keys.
// An explicit agent.adminTier always wins; otherwise it's derived from role.
function getAdminTier(agent) {
  if (!agent) return null;
  if (agent.adminTier) return agent.adminTier;
  const lvl = ROLES[agent.role]?.level || 0;
  if (lvl >= (ROLES.marketing_director?.level || 60)) return 'super_admin';
  if (agent.role === 'director') return 'admin';
  return null;
}

// Effective access level for gating pages/tools that check session.level —
// keeps existing level-based gates working correctly even though an
// admin's PHP rank level (their real title) may be much lower than the
// access their admin tier grants. Real PHP rank is never changed by this.
const ADMIN_TIER_ACCESS_LEVEL = { admin: 70, super_admin: 95, super_user: 999 };
function getEffectiveLevel(agent) {
  const phpLevel = ROLES[agent?.role]?.level || 0;
  const tier = getAdminTier(agent);
  return tier ? Math.max(phpLevel, ADMIN_TIER_ACCESS_LEVEL[tier] || 0) : phpLevel;
}

// ── SCOPED ROSTER ACCESS ─────────────────────────────────────────
// Who a given agent can VIEW OR EDIT in Roster Admin / Team Progress /
// Mentor Mode — this is deliberately separate from getEffectiveLevel,
// which only controls whether a page opens at all.
//   super_user   — every agent in the org.
//   super_admin  — (Marketing Director and above) their own recursive
//                   downline only. Being a high rank does NOT unlock the
//                   whole roster — only your own team.
//   admin        — their own recursive downline (they're a normal agent
//                   on one baseshop) PLUS the full downline of any MD
//                   listed in their agent.assignedBaseshops (an array of
//                   agent IDs), for admins who help run more than one team.
//   everyone else — just themselves.
function getManageableAgents(viewerAgent) {
  if (!viewerAgent) return [];
  const tier = getAdminTier(viewerAgent);

  if (tier === 'super_user') return AGENTS.slice();

  const own = typeof getFullDownline === 'function' ? getFullDownline(viewerAgent.id) : [viewerAgent];

  if (tier === 'super_admin') return own;

  if (tier === 'admin') {
    const seen = new Map(own.map(a => [a.id, a]));
    (viewerAgent.assignedBaseshops || []).forEach(mdId => {
      const md = getAgentById(mdId);
      if (!md) return;
      getFullDownline(mdId).forEach(a => seen.set(a.id, a));
    });
    return [...seen.values()];
  }

  return [viewerAgent];
}
function canManageAgent(viewerAgent, targetAgentId) {
  return getManageableAgents(viewerAgent).some(a => a.id === targetAgentId);
}

function getDirectReports(id)  { return AGENTS.filter(a => a.uplineId === id); }

// Returns the Marketing Director "team" an agent belongs to for reporting/
// display purposes. Admins can explicitly override this per agent via
// roster-admin.html (agent.mdTeamId); when no override is set, it's
// computed by walking the uplineId chain to the nearest agent whose role
// is Marketing Director (level 60) or above.
function getAgentMDTeamId(agent) {
  if (!agent) return '';
  if (agent.mdTeamId) return agent.mdTeamId; // explicit admin override wins
  let cur = agent, hops = 0;
  while (cur && cur.uplineId && hops < 12) {
    const up = getAgentById(cur.uplineId);
    if (!up) break;
    if ((ROLES[up.role]?.level || 0) >= 60) return up.id;
    cur = up;
    hops++;
  }
  return '';
}
function getAgentMDTeamName(agent) {
  const md = getAgentById(getAgentMDTeamId(agent));
  return md ? md.name : '';
}
// All agents whose MD team resolves to the given MD's agent ID.
function getMDTeamAgents(mdId) {
  return AGENTS.filter(a => a.id !== mdId && getAgentMDTeamId(a) === mdId);
}
// All agents in the roster who are eligible to "own" a team (MD level+),
// for populating admin assignment dropdowns.
function getAllMDs() {
  return AGENTS.filter(a => (ROLES[a.role]?.level || 0) >= 60);
}

// Returns the full recursive downline (all levels) for a given agent ID,
// INCLUDING the agent themself at index 0. Use .slice(1) to exclude self.
function getFullDownline(id) {
  const result = [];
  const visited = new Set();
  function walk(agentId) {
    if (visited.has(agentId)) return; // guard against accidental cycles
    visited.add(agentId);
    const agent = AGENTS.find(a => a.id === agentId);
    if (agent) result.push(agent);
    getDirectReports(agentId).forEach(child => walk(child.id));
  }
  walk(id);
  return result;
}
function getRoleLabel(role)    { return ROLES[role]?.label  || role; }
function getRoleLevel(role)    { return ROLES[role]?.level  || 0; }
function getRoleColor(role)    { return ROLES[role]?.color  || '#6B7C93'; }
function getInitials(name)     { return name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(); }

function getUplineChain(agentId, depth = 5) {
  const chain = [];
  let current = getAgentById(agentId);
  let i = 0;
  while (current?.uplineId && i++ < depth) {
    current = getAgentById(current.uplineId);
    if (current) chain.push(current);
  }
  return chain;
}

// ── 8. SIDEBAR BUILDER ────────────────────────────────────────
function buildSidebar(activePage) {
  const session = AUTH.getSession();
  if (!session) return '';
  const level = session.level;
  const agent = getAgentById(session.agentId);

  let html = `
    <div class="sb-logo">
      <div class="sb-shield">👑</div>
      <h1>Dynasty Builders</h1>
      <p>PHP Agency · DBA</p>
    </div>
    <div class="sb-agent">
      <div class="sb-avatar">${getInitials(session.name)}</div>
      <div>
        <div class="sb-agent-name">${session.name}</div>
        <div class="sb-agent-role">${getRoleLabel(session.role)}</div>
      </div>
    </div>
    <nav class="sb-nav">`;

  NAV_ITEMS.forEach(item => {
    if (item.section) {
      html += `<div class="nav-section">${item.section}</div>`;
      return;
    }
    if (level < item.minLevel) {
      html += `<a class="nav-item locked" href="#"><span class="icon">${item.icon}</span>${item.label}<span style="margin-left:auto;font-size:9px;opacity:0.5;">🔒</span></a>`;
    } else {
      const active = activePage && item.href === activePage ? 'active' : '';
      html += `<a class="nav-item ${active}" href="${item.href}"><span class="icon">${item.icon}</span>${item.label}</a>`;
    }
  });

  html += `</nav>
    <div class="sb-bottom">
      <div style="font-size:10px;color:var(--slate);margin-bottom:8px;">${TEAM.tagline}</div>
      <div class="logout-btn" onclick="AUTH.logout()">
        <span>⏻</span> Sign Out
      </div>
    </div>`;
  return html;
}

// ── 9. MONDAY.COM QUERY ───────────────────────────────────────
// Monday.com proxy endpoint — Netlify Function handles the server-side request
// to avoid CORS. Falls back to direct call for local dev (localhost).
const MONDAY_PROXY = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? '/api/monday'   // even locally use the proxy (avoids CORS + key exposure)
  : '/api/monday';  // Netlify Function in production

async function mondayQuery(query, variables = {}) {
  // Proxy uses ORG_KEY server-side — don't send key from browser
  const res = await fetch(MONDAY_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });
  if (!res.ok) throw new Error(`Monday API HTTP ${res.status}`);
  return res.json();
}

// ── AUTOMATION TRIGGER ──────────────────────────────────────────
// Fires configured Zapier webhook for a given trigger type.
// Non-blocking — never delays the user action that caused it.
async function fireTrigger(trigger, data = {}) {
  try {
    const session = getSession();
    const res = await fetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trigger,
        data,
        agentId:   session?.agentId || '',
        agentName: session?.name    || '',
        timestamp: new Date().toISOString(),
      }),
    });
    const result = await res.json();
    if (result.fired) {
      console.log(`[Automation] ✓ ${trigger} fired`, result.results);
    } else {
      console.log(`[Automation] ⚠ ${trigger} not configured:`, result.reason);
    }
    return result;
  } catch(e) {
    console.warn(`[Automation] ${trigger} failed:`, e.message);
    return { fired: false, error: e.message };
  }
}

// ── 10. ANTHROPIC CHAT ────────────────────────────────────────
async function askAI(messages, systemPrompt) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt || 'You are a PHP Agency business coach for Dynasty Builders Academy. Be encouraging and action-oriented.',
        messages
      })
    });
    const data = await res.json();
    return data?.content?.[0]?.text || '';
  } catch (e) {
    console.warn('AI query failed:', e);
    return '';
  }
}

// ── 11. DEMO DATA ─────────────────────────────────────────────
const DEMO_STATS = {
  obi001:  { calls:98,  contacts:41, appts:18, shows:14, recruits:9,  pts:9200 },
  jen001:  { calls:84,  contacts:35, appts:14, shows:11, recruits:7,  pts:7600 },
  mag001:  { calls:76,  contacts:29, appts:11, shows:8,  recruits:5,  pts:6100 },
  chi001:  { calls:65,  contacts:24, appts:9,  shows:7,  recruits:4,  pts:4800 },
  sha001:  { calls:61,  contacts:22, appts:8,  shows:6,  recruits:5,  pts:4400 },
  jac001:  { calls:54,  contacts:18, appts:6,  shows:4,  recruits:3,  pts:3600 },
  cos001:  { calls:48,  contacts:15, appts:5,  shows:3,  recruits:2,  pts:2800 },
  gio001:  { calls:45,  contacts:14, appts:5,  shows:4,  recruits:3,  pts:2600 },
  nin001:  { calls:39,  contacts:12, appts:4,  shows:3,  recruits:2,  pts:2100 },
  and001:  { calls:35,  contacts:11, appts:3,  shows:2,  recruits:1,  pts:1800 },
  mau001:  { calls:28,  contacts:8,  appts:2,  shows:1,  recruits:1,  pts:1200 },
  lil001:  { calls:22,  contacts:6,  appts:2,  shows:1,  recruits:0,  pts:900  }
};

// ── JUNE 2026 MD PROMOTION CAMPAIGN ─────────────────────────────
// Source: PHP Non-MD Base leaderboard exports, period 06/01–06/17/2026.
// Criteria: 25 Recruits / 25 Submitted Apps / 25,000 Submitted Points by 06/20/2026.
// Only agents with an existing AOS login (matched by PHP code) are included here.
// Many agents in the underlying leaderboard export do not yet have AOS accounts —
// see the full DBA_Agency_MD_Promotion_Tracker.xlsx for the complete 88-agent list.
const JUNE_MD_PROMO = {
  deadline: '2026-06-20',        // Recruits / Submitted Apps / Submitted Points
  paidPtsDeadline: '2026-06-30', // Paid Points has a later deadline
  targets: { recruits: 25, apps: 25, subPts: 25000, paidPts: 25000 },
  asOf: '2026-06-17',
  stats: {
  goonwa076: { recruits:15, apps:11.5, subPts:18167.85, paidPts:7000.99 },
  cosaba718: { recruits:14, apps:10.5, subPts:16929.98, paidPts:5398.42 },
  jacaba757: { recruits:13, apps:10.0, subPts:16576.04, paidPts:5060.07 },
  ireibe452: { recruits:3, apps:1.5, subPts:2226.42, paidPts:0.00 },
  mauony491: { recruits:2, apps:0.5, subPts:1065.42, paidPts:0.00 },
  amairu592: { recruits:0, apps:0.0, subPts:0.00, paidPts:1.78 },
  bialop382: { recruits:0, apps:0.0, subPts:0.00, paidPts:33.00 },
  coltho757: { recruits:0, apps:0.0, subPts:0.00, paidPts:3.45 },
  emmnwo473: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  franwa448: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  fidorj220: { recruits:2, apps:0.0, subPts:0.00, paidPts:0.00 },
  emmoke796: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  liluzo343: { recruits:2, apps:0.0, subPts:0.00, paidPts:0.00 },
  judaka326: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  joymoj126: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  olupin485: { recruits:0, apps:0.0, subPts:0.00, paidPts:3.93 },
  ramash421: { recruits:0, apps:0.0, subPts:0.00, paidPts:6.15 },
  sarmor601: { recruits:0, apps:0.0, subPts:0.00, paidPts:1.46 },
  steudo121: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  taioje599: { recruits:0, apps:0.0, subPts:0.00, paidPts:2.91 },
  uzoama613: { recruits:1, apps:0.0, subPts:0.00, paidPts:0.00 },
  }
};
