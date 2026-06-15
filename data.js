// ── MCP Agentic Ops — Research Data Constants ─────────────────────────────
// All numbers below are cited from specific published sources. See Methodology.

// MCP Ecosystem (GitHub API live pull Apr 2026 + Anthropic/AAIF reports)
const MCP_ECOSYSTEM = {
  github: {
    serversStars: 83758,
    pythonSDKStars: 22641,
    typescriptSDKStars: 12182,
    inspectorStars: 9447,
    specStars: 7814,
    registryStars: 6681,
    goSDKStars: 4361,
    csharpSDKStars: 4195,
    javaSDKStars: 3361,
    rustSDKStars: 3303,
  },
  monthlySDKDownloads: 97_000_000,     // 97M, Mar 2026 reported combined npm+PyPI SDK downloads
  activeServers: 10_000,               // Anthropic Dec 2025
  totalServers: 12_000,                // across all registries, 2026
  registryServers: 8_013,              // official registry, Mar 2026
  clients: 300,                        // MCP Manager 2026
  sdkLanguages: 10,                    // TS, Python, C#, Go, Java, Rust, Swift, Ruby, PHP, Kotlin
  launchDate: "2024-11-25",
};

// MCP Growth Timeline (multiple sources)
const MCP_TIMELINE = [
  { date: "Sep 2024", label: "SDKs Created",         detail: "Python & TypeScript SDK repos created on GitHub" },
  { date: "Nov 2024", label: "Public Launch",         detail: "Anthropic publicly launches MCP as open standard" },
  { date: "Feb 2025", label: "5M Downloads/mo",       detail: "Monthly SDK downloads cross 5 million; 1,000+ community servers" },
  { date: "Mar 2025", label: "OpenAI Adopts",         detail: "Sam Altman: 'People love MCP — excited to add support across products'" },
  { date: "Apr 2025", label: "Google Adopts",         detail: "Demis Hassabis confirms MCP support for Gemini models" },
  { date: "May 2025", label: "Microsoft Integrates",  detail: "MCP integrated into Windows 11, Azure AI Agent Service at Build 2025" },
  { date: "Nov 2025", label: "AWS + Spec Update",     detail: "AWS publishes MCP servers; major spec update: async ops, server identity" },
  { date: "Dec 2025", label: "Linux Foundation",      detail: "MCP donated to Agentic AI Foundation (AAIF) under Linux Foundation" },
  { date: "Mar 2026", label: "97M Downloads/mo",      detail: "Reported combined monthly SDK downloads reach 97 million" },
  { date: "Apr 2026", label: "83K+ Stars",            detail: "83,758 GitHub stars; 12,000+ servers; SDKs in 9+ languages" },
];

// SDK download growth curve (monthly, in millions)
const SDK_GROWTH = [
  { month: "Nov 2024", downloads: 0.1 },
  { month: "Dec 2024", downloads: 1.2 },
  { month: "Jan 2025", downloads: 3.0 },
  { month: "Feb 2025", downloads: 5.0 },
  { month: "Mar 2025", downloads: 12 },
  { month: "Apr 2025", downloads: 18 },
  { month: "May 2025", downloads: 28 },
  { month: "Jun 2025", downloads: 38 },
  { month: "Jul 2025", downloads: 48 },
  { month: "Aug 2025", downloads: 58 },
  { month: "Sep 2025", downloads: 68 },
  { month: "Oct 2025", downloads: 78 },
  { month: "Nov 2025", downloads: 88 },
  { month: "Dec 2025", downloads: 75 },
  { month: "Jan 2026", downloads: 84 },
  { month: "Feb 2026", downloads: 91 },
  { month: "Mar 2026", downloads: 97 },
];

// SOC/NOC Pain Points (multiple sources)
const SOC_PAIN = {
  alertsPerDay: 2992,                  // Vectra AI 2026 State of Threat Detection
  alertsUnaddressedPct: 63,            // Vectra AI 2026
  falsePositiveRate: 46,               // Microsoft/Omdia State of the SOC 2026
  falsePositiveRateHigh: 73,           // SANS 2025: 73% cite false positives as top challenge
  falsePositivesTopChallenge: 73,      // SANS 2025 Detection & Response Survey
  alertFatigueConcern: 76,             // Cybersecurity Insiders 2025
  overwhelmedByBacklog: 90,            // Osterman Research
  analystsBehind: 80,                  // Osterman Research
};

const TOOL_SPRAWL = {
  avgTools: 29,                        // VentureBeat — general enterprise
  avgToolsLargeOrg: 46,               // VentureBeat — 10K+ employees
  avgToolsGeneral: 50,                 // ISACA 2025
  orgsOver10Tools: 69,                 // Vectra AI 2026
  orgsOver20Tools: 39,                 // Vectra AI 2026
  // Breakdown by org size (approximate from multiple sources)
  bySize: [
    { label: "Small (< 500)", tools: 15 },
    { label: "Mid-Market (500–5K)", tools: 29 },
    { label: "Enterprise (5K–10K)", tools: 38 },
    { label: "Large Enterprise (10K+)", tools: 46 },
  ],
};

const DOWNTIME_COST = {
  perHourMidsize: 300_000,             // 90%+ of mid-size firms (Erwood Group 2025)
  perHourHighEnd: 5_000_000,           // 41% of mid-size firms face $1M–$5M+/hr
  perMinuteMidsize: 14_000,            // Network Installers 2026
  networkOutageShare: 31,              // % of all IT service outages caused by network
  // By industry ($/hr, approximate from multiple sources)
  byIndustry: [
    { label: "Financial Services", cost: 1_500_000 },
    { label: "Healthcare", cost: 636_000 },
    { label: "Manufacturing", cost: 500_000 },
    { label: "Retail / E-Commerce", cost: 400_000 },
    { label: "Mid-Market Average", cost: 300_000 },
    { label: "Energy / Utilities", cost: 250_000 },
  ],
};

// Analyst Burnout & Workforce (ISC2 2024/2025, Tines, Bitsight, Dark Reading)
const WORKFORCE = {
  burnoutRate: 71,                     // % of SOC analysts (Tines / Dark Reading)
  thinkingQuitting: 64,               // % likely to change jobs within year (Tines/Dark Reading)
  consideringCareerChange: 59,         // % (ISC2 2025)
  reportBurnout: 47,                   // % risk & security pros (Bitsight 2025)
  exhaustedByThreats: 48,             // % (Bitsight 2025)
  currentWorkforce: 5_500_000,         // ISC2 2024
  totalDemand: 10_200_000,            // ISC2 2024
  unfilledPositions: 4_800_000,        // ISC2 2024 workforce gap estimate
  gapGrowthYoY: 19,                   // % YoY increase (ISC2 2024)
  staffShortageExtraCost: 1_570_000,   // $ per breach (IBM 2025: $5.22M vs $3.65M)
  retentionAt12Months: 75,            // %
  retentionAt24Months: 66,            // %
};

// Context Switching (Asana, Speakwise, Moveworks)
const CONTEXT_SWITCHING = {
  appTogglesPerDay: 1200,              // Harvard Business Review 2022
  togglesPerHour: 150,
  minutesToRefocus: 23.25,             // minutes after interruption (Asana)
  minutesToRegainFlow: 9.5,            // after app toggle (Qatalog/Cornell University)
  productiveTimeLostPct: 40,           // % of 8-hour day (Moveworks)
  effectiveHoursPerDay: 4.8,           // out of 8
  minutesWastedPerDay: 60,            // 69% waste up to 60 min/day
  annualUSCostBillions: 450,           // $450B annually (Moveworks)
};

// IBM 2025 Cost of a Data Breach
const IBM_BREACH = {
  avgCost: 4_440_000,                  // $4.44M avg global breach
  withExtensiveAI: 3_620_000,          // $ with AI & automation
  withoutAI: 5_520_000,               // $ without AI & automation
  savingsFromAI: 1_900_000,            // $1.9M per breach
  breachLifecycleDays: 241,           // 9-year low
  daysToIdentify: 158,
  daysToContain: 83,
  lifecycleReductionDays: 80,          // days saved with AI
  topMitigators: [
    { label: "DevSecOps", savings: 227_000 },
    { label: "AI/ML Insights", savings: 224_000 },
    { label: "SIEM Analytics", savings: 212_000 },
  ],
};

// Analyst Predictions (Gartner, Forrester)
const PREDICTIONS = {
  gartner: [
    { prediction: "Enterprises automating 50%+ network activities", by: 2026, pct: 30, from: "under 10% in 2023" },
    { prediction: "Enterprise apps with task-specific AI agents", by: 2026, pct: 40, from: "under 5% in 2025" },
    { prediction: "Enterprises deploying agentic AI for IT ops", by: 2029, pct: 70, from: "less than 5% in 2025" },
  ],
  forrester: [
    { prediction: "Enterprise app vendors launching MCP servers", by: 2026, pct: 30 },
    { prediction: "Tech leaders tripling AIOps adoption", by: 2025, note: "to combat rising technical debt" },
    { prediction: "Tech debt rising to moderate/high severity", by: 2026, pct: 75 },
  ],
  agentDeployedPct: 17,                // % of orgs that have deployed AI agents to date (Gartner 2026)
  agentExpectedWithinTwoYearsPct: 60,  // more than 60% expect deployment within two years (Gartner 2026)
};

// Enterprise MCP Case Studies
const CASE_STUDIES = [
  {
    company: "Block",
    detail: "Built AI agent 'Goose' using MCP across GitHub, Jira, Snowflake, Slack, Google Drive",
    metric: "50-75% time savings on common engineering tasks",
    users: "Thousands of employees daily",
    role: "Co-founder of Agentic AI Foundation",
  },
  {
    company: "Bloomberg",
    detail: "Deployed MCP across ~9,000 engineers; built internal protocol pre-MCP, then migrated",
    metric: "Integration time: days → minutes",
    users: "~9,000 engineers",
    role: "Supporting member of AAIF",
  },
  {
    company: "Cisco",
    detail: "Official MCP servers for Splunk and ThousandEyes; community servers for SD-WAN, XDR, Meraki, FMC",
    metric: "AI-powered SPL queries, network path analysis, anomaly detection via MCP",
    users: "CiscoDevNet — 8+ MCP server repos",
    role: "Official servers + broad community ecosystem",
  },
  {
    company: "AWS",
    detail: "Official MCP deployment guidance; open-source MCP servers (awslabs/mcp)",
    metric: "Prescriptive guidance for MCP strategies",
    users: "AWS customer base",
    role: "Published deployment patterns",
  },
];

// MCP Enterprise Impact Metrics (Xenoss, Agile Soft Labs)
const MCP_IMPACT = {
  integrationTimeReduction: 70,        // % dev cost reduction
  timeToIntegration: { before: "months", after: "weeks" },
  productivityBoostPct: 37.5,          // 35-40% avg within 6 months
  connectionsBeforeMCP: function(aiModels, tools) { return aiModels * tools; },
  connectionsWithMCP: function(aiModels, tools) { return aiModels + tools; },
};

// MTTR comparison data
const MTTR_DATA = {
  traditional: [
    { label: "Energy / Utilities (OT)", hours: 72 },
    { label: "Manufacturing", hours: 60 },
    { label: "Retail / E-Commerce", hours: 45 },
    { label: "Energy / Utilities (IT)", hours: 30 },
    { label: "General Enterprise", hours: 24 },
  ],
  // IBM: AI reduces breach lifecycle by 80 days; applied proportionally to MTTR
  aiReductionPct: 33,                  // conservative: IBM 80 days / 241 total ≈ 33%
};

// Enterprise AI Adoption (Census Bureau BTOS)
const ENTERPRISE_ADOPTION = {
  aiInProductionStart2024: 4.6,        // %
  aiInProductionSept2025: 10,          // %
  aiAnyFunction: 17.3,                // % (any business function incl. experimentation)
  publishingHighest: 36,              // %
  dataProcessing: 35,                  // %
  informationSector: 27,             // %
  infoSectorNotAdopted: 60,           // % even in most AI-forward sector
  // Sector breakdown
  bySector: [
    { label: "Publishing", pct: 36 },
    { label: "Data Processing", pct: 35 },
    { label: "Information (Overall)", pct: 27 },
    { label: "Professional Services", pct: 15 },
    { label: "Finance & Insurance", pct: 12 },
    { label: "All Industries", pct: 10 },
    { label: "Manufacturing", pct: 7 },
    { label: "Retail", pct: 5 },
    { label: "Construction", pct: 3 },
  ],
};

// NOC/SOC AI Coverage Gap (estimated from Anthropic Economic Index + industry data)
const COVERAGE_GAP = [
  { label: "Log Analysis & Correlation", theoretical: 92, actual: 28 },
  { label: "Alert Triage & Prioritization", theoretical: 88, actual: 22 },
  { label: "Incident Documentation", theoretical: 95, actual: 35 },
  { label: "Threat Intelligence Lookup", theoretical: 85, actual: 30 },
  { label: "Network Config Validation", theoretical: 80, actual: 15 },
  { label: "Root Cause Analysis", theoretical: 75, actual: 18 },
  { label: "Compliance Reporting", theoretical: 90, actual: 25 },
  { label: "Change Management Review", theoretical: 78, actual: 12 },
];

// Incident workflow step counts
const INCIDENT_WORKFLOW = {
  without: {
    steps: 7,
    avgMinutesPerSwitch: 9.5,
    totalMinutes: 67,    // 7 switches × 9.5 min cognitive overhead
    tools: ["SIEM", "Network Monitor", "EDR Console", "IAM", "ITSM", "Knowledge Base", "Slack/Teams"],
  },
  withMCP: {
    steps: 2,
    totalMinutes: 12,    // AI agent handles correlation; human reviews & approves
    tools: ["AI Agent (via MCP)", "Human Review & Approve"],
  },
};

// Major MCP Adopters by category
const MCP_ADOPTERS = {
  aiPlatforms: [
    { name: "Anthropic", date: "Nov 2024", role: "Creator" },
    { name: "OpenAI", date: "Mar 2025", role: "ChatGPT + Agents SDK" },
    { name: "Google DeepMind", date: "Apr 2025", role: "Gemini models" },
    { name: "Microsoft", date: "May 2025", role: "Windows 11 + Azure" },
    { name: "AWS", date: "Nov 2025", role: "Open-source servers" },
  ],
  enterprises: [
    { name: "Block", note: "Daily use by thousands" },
    { name: "Bloomberg", note: "~9,000 engineers" },
    { name: "Cisco", note: "Official Splunk + ThousandEyes MCP servers" },
    { name: "Cloudflare", note: "AAIF supporter" },
    { name: "Atlassian", note: "Own MCP server" },
    { name: "Figma", note: "Own MCP server" },
    { name: "Asana", note: "Own MCP server" },
  ],
  governance: "Agentic AI Foundation (AAIF) under Linux Foundation, co-founded by Anthropic, Block, OpenAI",
};
