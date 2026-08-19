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
//   Agents without a top25BoardId fall back to the template board (18419015866)
// Last synced from DBA Agent Roster (board 18411252280): 2026-08-18
// ─────────────────────────────────────────────────────────────────────────────
const AGENTS = [
  {
    id: "obi001", name: "Obi Iroezi",
    pin: "1111", role: "admin", level: 100,
    phpId: "10146", phone: "3109956507",
    email: "obi@yourdynastybuilder.com",
    top25BoardId: "18419015866",
    licenseStates: ["CA", "TX"],
    enrollmentDate: "2022-01-01",
    uplineId: ""
  },
  {
    id: "jen001", name: "Jen Iroezi",
    pin: "1111", role: "agency_builder", level: 100,
    phpId: "10147", phone: "3109956508",
    email: "jen@yourdynastybuilder.com",
    top25BoardId: "8052087599",
    licenseStates: ["CA"],
    enrollmentDate: "2022-01-01",
    uplineId: "obi001"
  },
  {
    id: "mag001", name: "Magdalene Ibezim",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10200", phone: "",
    email: "",
    top25BoardId: "8270052654",
    licenseStates: ["TX"],
    enrollmentDate: "2022-06-01",
    uplineId: "obi001"
  },
  {
    id: "sha001", name: "Shantesa Archie",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10401", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: ["TX"],
    enrollmentDate: "2025-01-10",
    uplineId: "chi001"
  },
  {
    id: "dba000", name: "DBA Super Admin",
    pin: "1111", role: "super_admin", level: 100,
    phpId: "", phone: "",
    email: "admin@yourdynastybuilder.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2022-01-01",
    uplineId: ""
  },
  {
    id: "bli001", name: "Blessing Ikejemba",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-01-01",
    uplineId: "obi001"
  },
  {
    id: "emo001", name: "Emeka Okereke",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-01-01",
    uplineId: "obi001"
  },
  {
    id: "fri001", name: "Francis Ikeotuonye",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-01-01",
    uplineId: "obi001"
  },
  {
    id: "alecas487", name: "Alex Castro",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "7142091524",
    email: "alex@authorityfactory88.com",
    top25BoardId: "",
    licenseStates: ["CA"],
    enrollmentDate: "2024-06-05",
    uplineId: "bli001"
  },
  {
    id: "joymoj126", name: "Joy Mojokwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1412126", phone: "9096822392",
    email: "mokogwuj@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-07",
    uplineId: ""
  },
  {
    id: "franwa448", name: "Francis Nwadiba",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1412126", phone: "9096822392",
    email: "mokogwuj@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-06",
    uplineId: ""
  },
  {
    id: "virosi239", name: "Virginia Osita",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1411448", phone: "4244452758",
    email: "meetfarco2020@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-05",
    uplineId: ""
  },
  {
    id: "marrod050", name: "Marcela Rodriguez",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1411050", phone: "3236749258",
    email: "marcyrodriguez808@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-04",
    uplineId: ""
  },
  {
    id: "jawsal547", name: "Jawad Salaam",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1411050", phone: "3236749258",
    email: "marcyrodriguez808@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-31",
    uplineId: ""
  },
  {
    id: "emmoke796", name: "Emmanuel Okereke",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1408547", phone: "3108620454",
    email: "jawadsalaam@hotmail.com",
    top25BoardId: "18414813028",
    licenseStates: [],
    enrollmentDate: "2026-05-23",
    uplineId: ""
  },
  {
    id: "judaka326", name: "Jude Akalawu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1405796", phone: "3232372009",
    email: "michaelokereke002@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-17",
    uplineId: ""
  },
  {
    id: "fidorj220", name: "Fidelis Orji",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1404326", phone: "3104046508",
    email: "phpdynastybuilders@gmail.com",
    top25BoardId: "18415187026",
    licenseStates: [],
    enrollmentDate: "2026-05-17",
    uplineId: ""
  },
  {
    id: "managu956", name: "Manuel Aguilar",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1404220", phone: "4243812069",
    email: "orjifidelischinweike@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-16",
    uplineId: "obi001"
  },
  {
    id: "babola634", name: "Babatunde Olaide",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1403634", phone: "8184663998",
    email: "olaa.may27@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-16",
    uplineId: ""
  },
  {
    id: "andwil788", name: "Andrew Williams",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1403634", phone: "8184663998",
    email: "olaa.may27@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-13",
    uplineId: ""
  },
  {
    id: "anglew957", name: "Angela Lewis",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1402788", phone: "5623596245",
    email: "andrewbwilliams41@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-08",
    uplineId: ""
  },
  {
    id: "mauony491", name: "Maureen Onyia-Ekwuazi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1401957", phone: "3108660176",
    email: "poetry8638@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-05",
    uplineId: ""
  },
  {
    id: "ireibe452", name: "Irene Ibekwe",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1401491", phone: "4243474306",
    email: "monicaonyia23@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-05",
    uplineId: ""
  },
  {
    id: "danjho261", name: "Daniella Jhonson",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1401452", phone: "8322891880",
    email: "ireneibekwe1616@yahoo.com",
    top25BoardId: "18411670330",
    licenseStates: [],
    enrollmentDate: "2026-05-02",
    uplineId: ""
  },
  {
    id: "conchu516", name: "Conleth Chukwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1401261", phone: "4242534292",
    email: "jhonsonscorporategroup@gmail.com",
    top25BoardId: "18412529902",
    licenseStates: [],
    enrollmentDate: "2026-05-01",
    uplineId: ""
  },
  {
    id: "reguri510", name: "Regina Urigwe",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1400516", phone: "3234036017",
    email: "marymadona74@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-05-01",
    uplineId: ""
  },
  {
    id: "liluzo343", name: "Lilly Uzondu-Umeojiako",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1400510", phone: "4042711895",
    email: "reginaurigwe@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-04-10",
    uplineId: ""
  },
  {
    id: "godchu897", name: "Godis Chukwukere",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1397343", phone: "3235348102",
    email: "ifylili12@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-04-01",
    uplineId: "goonwa076"
  },
  {
    id: "joytor331", name: "Joy Toritseju",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1395897", phone: "3018757073",
    email: "godischukwukere@engineer.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-03-31",
    uplineId: "goonwa076"
  },
  {
    id: "miabow031", name: "Mia Bowie",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1395331", phone: "4422493723",
    email: "joytoritseju2005@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-03-23",
    uplineId: ""
  },
  {
    id: "matbec358", name: "Matthew Beck",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1394031", phone: "7202897247",
    email: "ms.bg303@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-03-10",
    uplineId: "obi001"
  },
  {
    id: "winmum345", name: "Winny Mumbarhi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1391358", phone: "9167928875",
    email: "matt@mattaffiliate.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-03-10",
    uplineId: ""
  },
  {
    id: "josker926", name: "Josephine Kerian",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1391345", phone: "7205885175",
    email: "mumbarhiwinny@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-03-08",
    uplineId: ""
  },
  {
    id: "elinwo056", name: "Elie Nwokorie",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1390926", phone: "2407580235",
    email: "josephinekerian@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-02-15",
    uplineId: ""
  },
  {
    id: "chinwo043", name: "Chidinma Nwokorie",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1385056", phone: "3108083201",
    email: "elieolu14@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-02-15",
    uplineId: ""
  },
  {
    id: "ijeokp039", name: "Ijeoma Okpara",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1385043", phone: "3108192771",
    email: "andienwokorie@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-02-15",
    uplineId: ""
  },
  {
    id: "keleke297", name: "Kelechi Ekeanyanwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1385039", phone: "3232829986",
    email: "ijokpara@hotmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-02-05",
    uplineId: ""
  },
  {
    id: "aimeig458", name: "Aimanose Eigbedion",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1381297", phone: "7204486194",
    email: "kelechi_21@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-02-01",
    uplineId: "obi001"
  },
  {
    id: "yalshe002", name: "Yaleca Shelby",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1380458", phone: "5736474228",
    email: "eigbediona@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-02-01",
    uplineId: ""
  },
  {
    id: "teamik798", name: "Tea Mikadze",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1380002", phone: "7202121053",
    email: "tymeless14@gmail.com",
    top25BoardId: "18412529902",
    licenseStates: [],
    enrollmentDate: "2026-01-31",
    uplineId: ""
  },
  {
    id: "torsha095", name: "Tornike Shalikashvili",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1379798", phone: "2137715590",
    email: "teamikadze76@gmail.com",
    top25BoardId: "18411670429",
    licenseStates: [],
    enrollmentDate: "2026-01-29",
    uplineId: ""
  },
  {
    id: "teajoh786", name: "Teairra Johnson",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1379095", phone: "7169943753",
    email: "tornikeshalikashvili91@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-01-17",
    uplineId: ""
  },
  {
    id: "ninpac400", name: "Nino Pachulia",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1377786", phone: "6264097166",
    email: "teairra.fields@yahoo.com",
    top25BoardId: "18411670429",
    licenseStates: [],
    enrollmentDate: "2026-01-10",
    uplineId: ""
  },
  {
    id: "tortsa743", name: "Tornike Tsagareishvili",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1376400", phone: "9084337138",
    email: "n.pachulia@yahoo.com",
    top25BoardId: "18394078194",
    licenseStates: [],
    enrollmentDate: "2025-12-31",
    uplineId: "obi001"
  },
  {
    id: "uzoama613", name: "Uzoma Amaefula",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1374613", phone: "9517503727",
    email: "uzobeeke@yahoo.com",
    top25BoardId: "18400160335",
    licenseStates: [],
    enrollmentDate: "2025-12-31",
    uplineId: ""
  },
  {
    id: "chimgb387", name: "Chimezie Mgbobile",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1374387", phone: "5014787215",
    email: "brightstonex@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-12-30",
    uplineId: ""
  },
  {
    id: "abetil877", name: "Abebe Tilahuun",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1373877", phone: "7202263559",
    email: "abexcool@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-12-24",
    uplineId: ""
  },
  {
    id: "kenxiv533", name: "Kennedy Xivir",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1373533", phone: "3232523415",
    email: "xivirkennedy170@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-12-20",
    uplineId: ""
  },
  {
    id: "apryou832", name: "April Young",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1371832", phone: "3106219145",
    email: "aprilyoung123@yahoo.com",
    top25BoardId: "18400160335",
    licenseStates: [],
    enrollmentDate: "2025-12-06",
    uplineId: ""
  },
  {
    id: "dawmen649", name: "Dawit Mengisteab",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1370649", phone: "7203277241",
    email: "dmengisteab757@gmail.com",
    top25BoardId: "18216452519",
    licenseStates: [],
    enrollmentDate: "2025-11-30",
    uplineId: ""
  },
  {
    id: "bolbal574", name: "Bolanle Balogun",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1369574", phone: "9256588420",
    email: "bolajioye@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-11-20",
    uplineId: "obi001"
  },
  {
    id: "melpad946", name: "Melissa Padilla",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1368946", phone: "6268402591",
    email: "meli891026@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-11-15",
    uplineId: "obi001"
  },
  {
    id: "arimuh040", name: "Arif Muhammad",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1366040", phone: "3235341358",
    email: "arif.shakir51@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-10-29",
    uplineId: "obi001"
  },
  {
    id: "marleo994", name: "Mark Ponce De Leon",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1364994", phone: "5623505181",
    email: "markjpdl@hotmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-10-17",
    uplineId: "obi001"
  },
  {
    id: "steben289", name: "Stephan Bennett",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1364289", phone: "4065798030",
    email: "insurewithbennett@gmail.com",
    top25BoardId: "18410267607",
    licenseStates: [],
    enrollmentDate: "2025-10-16",
    uplineId: ""
  },
  {
    id: "titikh526", name: "Titilope Ikhile",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1363526", phone: "9252340575",
    email: "titilope@gmail.com",
    top25BoardId: "18417763345",
    licenseStates: [],
    enrollmentDate: "2025-10-12",
    uplineId: "obi001"
  },
  {
    id: "jahsta022", name: "Jahnel Stamp",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1362022", phone: "6123666259",
    email: "jahnel3059@gmail.com",
    top25BoardId: "18410267607",
    licenseStates: [],
    enrollmentDate: "2025-10-01",
    uplineId: ""
  },
  {
    id: "emeuba208", name: "Emeka Ubachunwa",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1361208", phone: "4245673571",
    email: "mekss2001@yahoo.com",
    top25BoardId: "10003269761",
    licenseStates: [],
    enrollmentDate: "2025-10-01",
    uplineId: "cosaba718"
  },
  {
    id: "oumtin108", name: "Oumar Tine",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1360108", phone: "3233290367",
    email: "tineoumar61@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-09-24",
    uplineId: ""
  },
  {
    id: "chrgod663", name: "Christal Godfrey",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1359663", phone: "3239796096",
    email: "godfreychristal977@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-09-20",
    uplineId: ""
  },
  {
    id: "sopgon304", name: "Sophia Gonzalez",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1357304", phone: "8182569669",
    email: "sophiegg101@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-09-12",
    uplineId: ""
  },
  {
    id: "nenuko241", name: "Nene Uko",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1357241", phone: "3102201299",
    email: "neneukocoach@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-09-11",
    uplineId: "goonwa076"
  },
  {
    id: "ranbro949", name: "Randall Brownfield",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1356949", phone: "7605243708",
    email: "mmarandall84@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-09-10",
    uplineId: "obi001"
  },
  {
    id: "aslfer937", name: "Asley Fernandes",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1355937", phone: "8322937321",
    email: "asleyferns@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-09-05",
    uplineId: ""
  },
  {
    id: "steudo121", name: "Stella Udoh",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1355121", phone: "4244503394",
    email: "perfection4stella@gmail.com",
    top25BoardId: "18426825795",
    licenseStates: [],
    enrollmentDate: "2025-09-01",
    uplineId: "cosaba718"
  },
  {
    id: "fraaba441", name: "Francis Abanobi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1354441", phone: "5627374966",
    email: "francisabanobi11@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-31",
    uplineId: "cosaba718"
  },
  {
    id: "esooro893", name: "Esohe Oronsaye",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1353893", phone: "9516409080",
    email: "taiyeojeikere@aol.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-29",
    uplineId: ""
  },
  {
    id: "katsal890", name: "Kate Salami",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1353890", phone: "9516624678",
    email: "taiyeojeikere@gmail.ccom",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-29",
    uplineId: ""
  },
  {
    id: "jacaba757", name: "Jacinta Abanobi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1353757", phone: "5625896701",
    email: "zaramekpere048@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-29",
    uplineId: "cosaba718"
  },
  {
    id: "cosaba718", name: "Cosmas Abanobi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1353718", phone: "5622664286",
    email: "cosmasabanobi046@gmail.com",
    top25BoardId: "9933217087",
    licenseStates: [],
    enrollmentDate: "2025-08-28",
    uplineId: "goonwa076"
  },
  {
    id: "flonwa701", name: "Florence Nwana",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1353701", phone: "5622159121",
    email: "florencenwana@yahoo.com",
    top25BoardId: "8994331783",
    licenseStates: [],
    enrollmentDate: "2025-08-28",
    uplineId: ""
  },
  {
    id: "taomor024", name: "Taofikat Morakinyo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1353024", phone: "9739543140",
    email: "morakinyot1@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-23",
    uplineId: ""
  },
  {
    id: "adosep242", name: "Adorina Kouriel Seperghan",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1352242", phone: "2092770768",
    email: "ado0at@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-19",
    uplineId: ""
  },
  {
    id: "rongou178", name: "Ronita Gouryal",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1352178", phone: "2095317594",
    email: "rgouriyal@outlook.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-18",
    uplineId: ""
  },
  {
    id: "rymard750", name: "Rymond Samonia Ardeshai",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1351750", phone: "8186973249",
    email: "rymond.sa@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-08-16",
    uplineId: ""
  },
  {
    id: "tarpro557", name: "Taryn Provinchain",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1348557", phone: "4247506026",
    email: "tarynnn13@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-30",
    uplineId: ""
  },
  {
    id: "olueji935", name: "Oluchi Ejike",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1347935", phone: "3233201750",
    email: "ejike.oluchi@yahoo.co.uk",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-25",
    uplineId: ""
  },
  {
    id: "latcha805", name: "Latiff Chagpar",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1347805", phone: "7147469810",
    email: "lchagpar@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-24",
    uplineId: "obi001"
  },
  {
    id: "feloju853", name: "Felicia Ojukwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1346853", phone: "9092435197",
    email: "chidiogo@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-17",
    uplineId: "obi001"
  },
  {
    id: "emmnwo473", name: "Emmanuel Nwokeji",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1346473", phone: "4244565689",
    email: "necshagg@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-16",
    uplineId: ""
  },
  {
    id: "susuka198", name: "Susan Ukaegbu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1344198", phone: "3235930896",
    email: "susan90247@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-01",
    uplineId: "goonwa076"
  },
  {
    id: "prieme780", name: "Princess Emeruwa",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1343780", phone: "3108485821",
    email: "princessemeruwa219@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-07-01",
    uplineId: ""
  },
  {
    id: "lyndia091", name: "Lynette Diarra",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1343091", phone: "7206090928",
    email: "weareyoung2557@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-06-26",
    uplineId: ""
  },
  {
    id: "nafafs398", name: "Nafiseh Afshari",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1342398", phone: "7209341811",
    email: "afshar.na1988@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-06-19",
    uplineId: ""
  },
  {
    id: "vanvan673", name: "Vander Vanzinetti",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1341673", phone: "9493101885",
    email: "ayovander@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-06-12",
    uplineId: ""
  },
  {
    id: "nicmor638", name: "Nicole Moreno",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1340638", phone: "8189345411",
    email: "nicolemoren0@icloud.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-06-04",
    uplineId: "obi001"
  },
  {
    id: "chieli576", name: "Chidinma Elias-Ohuabunwa",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1340576", phone: "4089905057",
    email: "chidinmaelias88@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-06-03",
    uplineId: ""
  },
  {
    id: "briabe536", name: "Bright Abengowe",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1340536", phone: "3235349745",
    email: "brightabengowe113@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-06-03",
    uplineId: ""
  },
  {
    id: "goonwa076", name: "Goodluck Nwaka",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1338076", phone: "3107069461",
    email: "cnwaka043@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-05-17",
    uplineId: ""
  },
  {
    id: "edeash642", name: "Edessa Ashourkarim",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1337642", phone: "8185719289",
    email: "edessab@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-05-15",
    uplineId: ""
  },
  {
    id: "marand462", name: "Martin Andernians",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1337462", phone: "7477451438",
    email: "martinandernians1983@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-05-14",
    uplineId: ""
  },
  {
    id: "radhar952", name: "Radiant Harrison",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1334952", phone: "4044681348",
    email: "radiantharrison21@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-05-01",
    uplineId: ""
  },
  {
    id: "glookh486", name: "Glory Okhilua",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1334486", phone: "3239845866",
    email: "aronoglory@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-30",
    uplineId: ""
  },
  {
    id: "govtak976", name: "Govargiz Ebrahimi Dizaj Takyeh",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1333976", phone: "8184168314",
    email: "givoebrahimi@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-28",
    uplineId: ""
  },
  {
    id: "ramash421", name: "Ramel Ashourkarim",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1332421", phone: "8182701275",
    email: "ramela87@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-16",
    uplineId: ""
  },
  {
    id: "daismi741", name: "DaiSean Smith",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1331741", phone: "9514784268",
    email: "daiseansmith321@icloud.com",
    top25BoardId: "9122818834",
    licenseStates: [],
    enrollmentDate: "2025-04-12",
    uplineId: ""
  },
  {
    id: "abrram382", name: "Abraham Ramos",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1331382", phone: "3232291808",
    email: "ramosabraham889@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-11",
    uplineId: ""
  },
  {
    id: "anteme387", name: "Anthonia Emechete",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1330387", phone: "3103468485",
    email: "ifyoki@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-02",
    uplineId: ""
  },
  {
    id: "petlaa358", name: "Peter Laabs",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1330358", phone: "6266580695",
    email: "laabspeter2@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-02",
    uplineId: ""
  },
  {
    id: "mamdio324", name: "Mamadou Diop",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1330324", phone: "6469837286",
    email: "mouhakara1996@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-02",
    uplineId: ""
  },
  {
    id: "maktas475", name: "Makayla Tasker",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1329475", phone: "3104806987",
    email: "tmakayla1030@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-31",
    uplineId: ""
  },
  {
    id: "taymat304", name: "Taylonee Matthews",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1329304", phone: "2137169284",
    email: "taylonee.matthews@icloud.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-30",
    uplineId: "obi001"
  },
  {
    id: "aribar814", name: "Ariel Barrera",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1328814", phone: "3107402395",
    email: "arielbarrera903@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-26",
    uplineId: "obi001"
  },
  {
    id: "desesp804", name: "Destiny Espinoza",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1327804", phone: "9099775163",
    email: "destiny.159793@icloud.com",
    top25BoardId: "8325616671",
    licenseStates: [],
    enrollmentDate: "2025-03-20",
    uplineId: ""
  },
  {
    id: "onyagb716", name: "Onyinyechukwu Agbo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1326716", phone: "6267317090",
    email: "onyiagbo95@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-15",
    uplineId: ""
  },
  {
    id: "walbuc961", name: "Walter Buchanan",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1324961", phone: "6263943609",
    email: "wbuchanan.gr@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-03",
    uplineId: "obi001"
  },
  {
    id: "chiikw857", name: "Chigozie Ikwueze",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1323857", phone: "8176091115",
    email: "chigozie_ikwueze011@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-01",
    uplineId: ""
  },
  {
    id: "linrad767", name: "Linda Guerra Rada",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1318767", phone: "6319921010",
    email: "lindaguerrarada@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-02-05",
    uplineId: "obi001"
  },
  {
    id: "shasca360", name: "Shania Scarbrough",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1318360", phone: "4043874506",
    email: "shania383xx@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-02-01",
    uplineId: ""
  },
  {
    id: "onoedo636", name: "Onochie Edozie",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1316636", phone: "4244565890",
    email: "onochiegeorge1@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-01-24",
    uplineId: ""
  },
  {
    id: "kemscu310", name: "Kemar Sculley",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1315310", phone: "7177798236",
    email: "kemarsculley@gmail.com",
    top25BoardId: "8270851734",
    licenseStates: [],
    enrollmentDate: "2025-01-15",
    uplineId: ""
  },
  {
    id: "stefro032", name: "Steve Frost",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1314032", phone: "2192526194",
    email: "frost.stevew@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-01-07",
    uplineId: "obi001"
  },
  {
    id: "herbet122", name: "Herve Betonga",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1313122", phone: "8594449279",
    email: "hervebetonga@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-01-01",
    uplineId: ""
  },
  {
    id: "eluoch947", name: "Eluemunor Ochonogor",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1312947", phone: "4709836368",
    email: "oeluemunor@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-01-01",
    uplineId: "obi001"
  },
  {
    id: "joseph673", name: "Joseph Ephias",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1312673", phone: "8058643075",
    email: "josephguzman04@icloud.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-12-31",
    uplineId: ""
  },
  {
    id: "bleeke611", name: "Blessing Ekeanyanwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1308611", phone: "3038858080",
    email: "osonduamadi@comcast.net",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-11-23",
    uplineId: ""
  },
  {
    id: "jallig406", name: "Jalen Liggins",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1307406", phone: "2136787604",
    email: "jalenbliggins@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-11-15",
    uplineId: "obi001"
  },
  {
    id: "georob122", name: "Georkira Robinson",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1307122", phone: "8503714638",
    email: "gkrobinson06@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-11-12",
    uplineId: ""
  },
  {
    id: "jusoko818", name: "Justina Okonkwo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1303818", phone: "3239447729",
    email: "ejike.justina@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-11-01",
    uplineId: ""
  },
  {
    id: "bialop382", name: "Bianca R Lopez",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1303382", phone: "7204733200",
    email: "bianca.r.lopez80@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-10-31",
    uplineId: ""
  },
  {
    id: "franwa742", name: "Frank Nwaneri",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1302742", phone: "7022839782",
    email: "franeriq01@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-10-29",
    uplineId: ""
  },
  {
    id: "gabzel675", name: "Gabriel Augusto Guerrero Zelaya",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1302675", phone: "7203131789",
    email: "gabrielguerrero931@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-10-28",
    uplineId: ""
  },
  {
    id: "amairu592", name: "Amaka Iruobe",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1301592", phone: "7024902725",
    email: "amaka.i.phpagency@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-10-19",
    uplineId: ""
  },
  {
    id: "adefag179", name: "Aderinsola Fagbamila",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1301179", phone: "3039998779",
    email: "fagbamilaaderinsola@yahoo.com",
    top25BoardId: "8596152528",
    licenseStates: [],
    enrollmentDate: "2024-10-16",
    uplineId: ""
  },
  {
    id: "taioje599", name: "Taiye Ojeikere",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1297599", phone: "9092014792",
    email: "taiyeojeikere@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-30",
    uplineId: ""
  },
  {
    id: "iheulu967", name: "Iheanacho Ulu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1296967", phone: "3104670357",
    email: "achoulu@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-26",
    uplineId: ""
  },
  {
    id: "tyrjam978", name: "Tyrone James",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1295978", phone: "7175519965",
    email: "jamestyrone219@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-17",
    uplineId: "obi001"
  },
  {
    id: "shihou242", name: "Shila Houshmand",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1294242", phone: "9495545346",
    email: "shilahoushmand33@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-07",
    uplineId: ""
  },
  {
    id: "chomor979", name: "Chosa Morris",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1293979", phone: "6785008402",
    email: "chosamorris578@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-06",
    uplineId: ""
  },
  {
    id: "chrfeo955", name: "Christopher M Feola",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1293955", phone: "3527373889",
    email: "83mx63toyota@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-06",
    uplineId: ""
  },
  {
    id: "elimor645", name: "Elijah Morris",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1293645", phone: "6788533035",
    email: "elijahmorris40@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-05",
    uplineId: ""
  },
  {
    id: "edrhar102", name: "Edrinna Harrison",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1293102", phone: "4046030690",
    email: "edrinnaharrison20@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-01",
    uplineId: ""
  },
  {
    id: "jashar069", name: "Jasmine Harris",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1293069", phone: "9016612049",
    email: "harrisjasmine966@gmail.com",
    top25BoardId: "8270844063",
    licenseStates: [],
    enrollmentDate: "2024-09-01",
    uplineId: ""
  },
  {
    id: "shasha662", name: "Shadian Shaw",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1292662", phone: "5164102735",
    email: "shawshadian271@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-09-01",
    uplineId: ""
  },
  {
    id: "steige063", name: "Stephanie Ige",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1292063", phone: "9014856805",
    email: "slige70@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-08-31",
    uplineId: ""
  },
  {
    id: "lacpic522", name: "LaChance Pickett",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1291522", phone: "7207750511",
    email: "lachancepickett1@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-08-29",
    uplineId: ""
  },
  {
    id: "vanudo398", name: "Vanessa Udom",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1290398", phone: "3472338678",
    email: "vanessaudom@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-08-21",
    uplineId: "obi001"
  },
  {
    id: "danwhi414", name: "Daniel White",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1288414", phone: "7206361612",
    email: "d73639@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-08-03",
    uplineId: ""
  },
  {
    id: "julpac408", name: "Julia Pacheco",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1288408", phone: "7028011120",
    email: "juliadp2054@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-08-03",
    uplineId: ""
  },
  {
    id: "simogb575", name: "Simon Ogbonna",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1287575", phone: "4243106996",
    email: "sirchinaka2020@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-07-31",
    uplineId: ""
  },
  {
    id: "bregon200", name: "Brenda Gonzalez",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1286200", phone: "7209780300",
    email: "gonzalezsbee@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-07-19",
    uplineId: ""
  },
  {
    id: "coremm611", name: "Corliss Emmanuel",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1284611", phone: "3239630107",
    email: "corlissemmanuel@icloud.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-07-10",
    uplineId: ""
  },
  {
    id: "tifhaw038", name: "Tiffiney Hawkins",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1284038", phone: "2139441496",
    email: "s.hawkins.t@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-07-05",
    uplineId: ""
  },
  {
    id: "sonash119", name: "Sonita Ashu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1283119", phone: "3109162890",
    email: "ngozisonita@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-07-01",
    uplineId: ""
  },
  {
    id: "maroko654", name: "Maryjane Okonkwo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1282654", phone: "3233748331",
    email: "benardmaryjane@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-06-30",
    uplineId: ""
  },
  {
    id: "pauaho864", name: "Paule Ahoudjo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1280864", phone: "2148624826",
    email: "hahoudjo@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-06-19",
    uplineId: ""
  },
  {
    id: "nnaude801", name: "Nnamdi Udengwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1279801", phone: "3105054086",
    email: "udengwumathiasnnamdi16@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-06-16",
    uplineId: ""
  },
  {
    id: "donade473", name: "Donald Adedokun",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1279473", phone: "4244750720",
    email: "realdsoja247@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-06-16",
    uplineId: ""
  },
  {
    id: "megwoo547", name: "Megan Woods",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1277547", phone: "8177076049",
    email: "mnwoods89@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-06-07",
    uplineId: ""
  },
  {
    id: "leshin227", name: "Lesia Hinds",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1277227", phone: "2142082258",
    email: "lesiahi2@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-06-06",
    uplineId: ""
  },
  {
    id: "kaylov993", name: "Kayla Love",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1274993", phone: "5109935301",
    email: "kokolovecare@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-05-31",
    uplineId: "obi001"
  },
  {
    id: "darcob976", name: "Darin Cobb",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1268976", phone: "8503339523",
    email: "dcobb1510@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-04-29",
    uplineId: ""
  },
  {
    id: "dwaarz803", name: "Dwayne Arzu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1267803", phone: "9512752284",
    email: "dkeona@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-04-20",
    uplineId: ""
  },
  {
    id: "juatir779", name: "Juan Moreno Tirado",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1267779", phone: "6264131913",
    email: "rm5125640@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-04-20",
    uplineId: ""
  },
  {
    id: "sarmor601", name: "Sarah Morris",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1267601", phone: "6787498167",
    email: "sarahmorris5966@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-04-19",
    uplineId: ""
  },
  {
    id: "rikmit353", name: "Rika Mitchell",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1264353", phone: "7208378667",
    email: "rikamitchell@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-04-02",
    uplineId: ""
  },
  {
    id: "okuuju022", name: "Okuny Ujulu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1264022", phone: "7206923414",
    email: "okunyujulu4@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-04-01",
    uplineId: ""
  },
  {
    id: "elilot864", name: "Elizabeth Lott",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1262864", phone: "7206623227",
    email: "elizabethlott44@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-31",
    uplineId: ""
  },
  {
    id: "olupin485", name: "Olubunmi Pinmiloye",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1261485", phone: "3109978106",
    email: "bunmide16@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-27",
    uplineId: "obi001"
  },
  {
    id: "verlop742", name: "Veronica Lopez",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1259742", phone: "3236275380",
    email: "vlopez2011@att.net",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-16",
    uplineId: ""
  },
  {
    id: "oluodu101", name: "Oluwarotimi Odubanjo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1259101", phone: "6824009935",
    email: "lanrewajuodu@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-16",
    uplineId: ""
  },
  {
    id: "triloc087", name: "Trinity Lockett",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1258087", phone: "2567706381",
    email: "julecasey71@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-16",
    uplineId: ""
  },
  {
    id: "bonjoh952", name: "BONARD JOHNSON",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1253952", phone: "5623405811",
    email: "bonardsrjohnson@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-06",
    uplineId: ""
  },
  {
    id: "ayaegb397", name: "Aya Egbuho",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1253397", phone: "3106428224",
    email: "ayaegbuho@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-03",
    uplineId: ""
  },
  {
    id: "josjen451", name: "Josephine Jenkins",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1252451", phone: "3344501789",
    email: "josephinejenkins13@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-03-01",
    uplineId: ""
  },
  {
    id: "wiljoh348", name: "Willie Johnson",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1251348", phone: "3233389284",
    email: "babydlow3011@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-29",
    uplineId: ""
  },
  {
    id: "unachi966", name: "Unachukwu R Chidiebere",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1249966", phone: "7206305552",
    email: "remigiuschidiebereu@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-25",
    uplineId: ""
  },
  {
    id: "jacfar867", name: "Jacqueline Farquharson",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1248867", phone: "3524459963",
    email: "jfarqu@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-16",
    uplineId: ""
  },
  {
    id: "monly802", name: "Monica Ly",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1246802", phone: "2132906180",
    email: "monica.ly@pm.me",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-14",
    uplineId: ""
  },
  {
    id: "suzbri214", name: "Suzette Bridgemahon",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1246214", phone: "2532308645",
    email: "skbridgemahon@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-11",
    uplineId: ""
  },
  {
    id: "egbbev353", name: "Egbert Bevans",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1245353", phone: "3107523520",
    email: "ebevansphp@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-07",
    uplineId: "obi001"
  },
  {
    id: "mankor240", name: "Many Kormany",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1244240", phone: "7025964289",
    email: "manykormany@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-02-01",
    uplineId: "obi001"
  },
  {
    id: "josgoe821", name: "Josiah Goering",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1243821", phone: "7202107877",
    email: "josiahgoering21@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-01-31",
    uplineId: ""
  },
  {
    id: "hartop516", name: "Harut Topchyan",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1242516", phone: "8186674915",
    email: "harut.topchyan@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-01-20",
    uplineId: "obi001"
  },
  {
    id: "coltho757", name: "COLLETTE THOMPSON",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1240757", phone: "3239448909",
    email: "collettecampbell437@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-01-11",
    uplineId: ""
  },
  {
    id: "lorhar732", name: "Lorenzo Harper",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1240732", phone: "3034080621",
    email: "harperlorenzo9@yahoo.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-01-11",
    uplineId: ""
  },
  {
    id: "geonwa339", name: "George Nwaeke",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1240339", phone: "3239966935",
    email: "georgrnwaeke110@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2024-01-08",
    uplineId: ""
  },
  {
    id: "chiakp183", name: "Chidera Akpudiogwu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1239183", phone: "3102615430",
    email: "sherisweetlove557@gmail.com",
    top25BoardId: "18418856132",
    licenseStates: [],
    enrollmentDate: "2024-01-01",
    uplineId: ""
  },
  {
    id: "zoehamo746", name: "Zoe Hammond",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "3145374746",
    email: "zmonyettr@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-06",
    uplineId: ""
  },
  {
    id: "britmal001", name: "Brittany C. Malbry",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "5626068592",
    email: "Brittanycaseyl.Phpagency@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-12",
    uplineId: "obi001"
  },
  {
    id: "romcru001", name: "Romeo Cruz",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1422030", phone: "3107339994",
    email: "romeocruz211@gmail.com",
    top25BoardId: "18426535441",
    licenseStates: [],
    enrollmentDate: "2026-06-13",
    uplineId: "obi001"
  },
  {
    id: "ifenk001", name: "Ifeyinwa Nkpolara",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "2138875978",
    email: "phpdynastylicensing@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2026-06-15",
    uplineId: "obi001"
  },
  {
    id: "mag001", name: "Magdalene O.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10200", phone: "",
    email: "",
    top25BoardId: "8270052654",
    licenseStates: ["TX"],
    enrollmentDate: "2022-06-01",
    uplineId: "obi001"
  },
  {
    id: "chi001", name: "Chidozie N.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10301", phone: "",
    email: "",
    top25BoardId: "18414813028",
    licenseStates: ["TX"],
    enrollmentDate: "2023-01-15",
    uplineId: "mag001"
  },
  {
    id: "jac001", name: "Jacinta U.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10402", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: ["TX"],
    enrollmentDate: "2023-06-01",
    uplineId: "chi001"
  },
  {
    id: "cos001", name: "Cosmas E.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10501", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: ["TX"],
    enrollmentDate: "2023-09-01",
    uplineId: ""
  },
  {
    id: "gio001", name: "Gio M.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10502", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: ["TX"],
    enrollmentDate: "2023-08-01",
    uplineId: "mag001"
  },
  {
    id: "nin001", name: "Nina R.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10601", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: ["TX"],
    enrollmentDate: "2024-02-01",
    uplineId: ""
  },
  {
    id: "and001", name: "Andrew T.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10602", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: ["TX"],
    enrollmentDate: "2024-03-01",
    uplineId: ""
  },
  {
    id: "mau001", name: "Maureen I.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10701", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-03-01",
    uplineId: "chi001"
  },
  {
    id: "lil001", name: "Lily A.",
    pin: "1111", role: "trainee", level: 20,
    phpId: "10702", phone: "",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2025-04-01",
    uplineId: ""
  },
  {
    id: "anuele794", name: "Anulika Eleodi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "794123", phone: "3108003536",
    email: "anulieleodi@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2019-05-13",
    uplineId: "obi001"
  },
  {
    id: "olaoje288", name: "Ola E. Ojeikere",
    pin: "1111", role: "trainee", level: 20,
    phpId: "288823", phone: "3104002514",
    email: "ojeikere77@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2019-07-03",
    uplineId: ""
  },
  {
    id: "sornas052", name: "Soroush Nasirzadeh",
    pin: "1111", role: "trainee", level: 20,
    phpId: "52906", phone: "8182679155",
    email: "soroush.nasirzadeh@gmail.com",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "2016-08-17",
    uplineId: ""
  },
  {
    id: "vicunk001", name: "Vicky",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "7913240558",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: "obi001"
  },
  {
    id: "rosanu417", name: "Rose Anuarita",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "18417943185",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: "obi001"
  },
  {
    id: "graofu633", name: "Grace Olufa",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "18403963633",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: "obi001"
  },
  {
    id: "natvau738", name: "Nathaniel Vaughn",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "18399753738",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: "obi001"
  },
  {
    id: "israuko828", name: "Israel Uko",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "18020253828",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: "obi001"
  },
  {
    id: "danuko108", name: "Daniel Uko",
    pin: "1111", role: "trainee", level: 20,
    phpId: "", phone: "",
    email: "",
    top25BoardId: "18397351108",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: "obi001"
  },
  {
    id: "dchen05", name: "David Chen",
    pin: "9988", role: "marketing_director", level: 100,
    phpId: "", phone: "5553456789",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "enguyen02", name: "Emily Nguyen",
    pin: "1927", role: "director", level: 60,
    phpId: "", phone: "5557654321",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "mlee03", name: "Marcus Lee",
    pin: "7654", role: "trainee", level: 20,
    phpId: "", phone: "5559871234",
    email: "",
    top25BoardId: "",
    licenseStates: [],
    enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "mohmus120", name: "Mohamed Musa",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1426120", phone: "7207869766",
    email: "mohamed772600@icloud.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "noatse417", name: "Noah Tsegaye",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1425417", phone: "3107285543",
    email: "noahtsegaye27@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "calsha154", name: "Calvin Shannon",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1425154", phone: "6789395883",
    email: "calvin.shannon06@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "iulsmo023", name: "Iuliia Smorodina",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1424023", phone: "5626176869",
    email: "smorodinaiuliia@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "marthi290", name: "Marcel Thiel",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1423290", phone: "3236290260",
    email: "marceljthiel80@gmail.com",
    top25BoardId: "18426534536",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "harbal179", name: "Harley Secundino Baltazar",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1422179", phone: "3236183036",
    email: "contactharley28@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "dapuza145", name: "Daphne Uzayisenga",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1422145", phone: "3159920518",
    email: "daphnaalana01@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "pauuvi582", name: "Paulina Uvidia",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1418582", phone: "3238095958",
    email: "puvidia@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "morsin895", name: "Morgan Singleton",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1417895", phone: "3109456493",
    email: "msingleton1333@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "nnendu300", name: "Nneka Ndukwe",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1417300", phone: "5626206937",
    email: "ekanvene@yahoo.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "chiony786", name: "Chidera Onyekwere",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1416786", phone: "3102133833",
    email: "chideraonyekwere129@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "anarey760", name: "Ana Reyes",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1416760", phone: "3109386281",
    email: "annaestrada437@yahoo.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "jlywhi483", name: "JLynn Whitaker",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1415483", phone: "3104133995",
    email: "whitakerjlynn@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "yurnak867", name: "Yuri Nakatani",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1414867", phone: "4244439421",
    email: "yurinakatani02@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "cosuhu368", name: "Cosmas Uhuo",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1414368", phone: "6056419640",
    email: "coscusanas@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "maumye341", name: "Maureen Myers",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1414341", phone: "2135451057",
    email: "cosmasabanobi088@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "regofo333", name: "Regina Ofoedu",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1409333", phone: "3236217520",
    email: "ofoeduoby@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "twianu136", name: "Twishimye Anuarita",
    pin: "1111", role: "director", level: 60,
    phpId: "1409136", phone: "6022993207",
    email: "shimyerose123@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  },
  {
    id: "maraje415", name: "Mariam Ajetunmobi",
    pin: "1111", role: "trainee", level: 20,
    phpId: "1404415", phone: "3107567228",
    email: "maryamoriyomi26@gmail.com",
    top25BoardId: "",
    licenseStates: [], enrollmentDate: "",
    uplineId: ""
  }
];

// ── 4. PAGE ACCESS LEVELS ─────────────────────────────────────
const PAGE_ACCESS = {
  // ── All agents (level 0) ──────────────────────────────────
  "hub.html":                   0,
  "tracker.html":               0,
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
  "make-scenario-builder.html": 100,
  "create-bom-board.html":      60,
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
    const session = {
      agentId:  agent.id,
      name:     agent.name,
      role:     agent.role,
      level:    ROLES[agent.role]?.level || 0,
      phpId:    agent.phpId,
      phone:    agent.phone,
      email:    agent.email,
      loginAt:  new Date().toISOString(),
      source:   'local'
    };
    sessionStorage.setItem(AUTH.SESSION_KEY, JSON.stringify(session));
    return { success: true, session };
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
    if (s.level < required) { window.location.href = 'hub.html'; return false; }
    return true;
  },

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
function getDirectReports(id)  { return AGENTS.filter(a => a.uplineId === id); }

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
const MONDAY_PROXY = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'https://api.monday.com/v2'          // direct in local dev
  : '/api/monday';                        // Netlify Function in production

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
