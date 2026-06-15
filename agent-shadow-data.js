// Agent Shadow IT Blog — Research Data Constants
// Numbers are sourced from the methodology section in agent-shadow-it.html.

const HERO_STATS = {
  machineIdentityRatio: 109,
  aiRiskPct: 87,
  guardrailOutpacePct: 86,
  agentVisibilityPct: 23,
  glasswingCredits: 100,
};

const IDENTITY_SHIFT = [
  { label: 'Human identities', value: 1 },
  { label: 'Machine + AI identities', value: 109 },
];

const AGENT_CONTROL_GAP = [
  { label: 'Expect agents to outpace guardrails', pct: 86, color: '#f87171' },
  { label: 'Report full agent visibility', pct: 23, color: '#22d3ee' },
  { label: 'Lack rollback without disruption', pct: 88, color: '#fb923c' },
  { label: 'AI vulnerabilities fastest-growing risk', pct: 87, color: '#a78bfa' },
];

// Conceptual 0-100 indexes used for the control-map visualization. These are
// not survey percentages; they translate the article's risk model into a chart.
const AGENT_RISK_LAYERS = [
  { layer: 'Identity', risk: 92, maturity: 41 },
  { layer: 'Tool Access', risk: 88, maturity: 35 },
  { layer: 'Data Movement', risk: 84, maturity: 39 },
  { layer: 'Runtime Behavior', risk: 90, maturity: 28 },
  { layer: 'Recovery', risk: 81, maturity: 32 },
];

const GOVERNANCE_MODEL = [
  {
    stage: 'Discover',
    control: 'Find agents, connectors, MCP servers, service accounts, API keys, and owners.',
    cisco: 'Cisco Identity Intelligence, Duo, Splunk asset and identity telemetry',
  },
  {
    stage: 'Constrain',
    control: 'Issue least-privilege, short-lived, tool-specific access instead of standing credentials.',
    cisco: 'Duo agentic IAM, Cisco Secure Access, MCP gateway policy enforcement',
  },
  {
    stage: 'Inspect',
    control: 'Watch intent and behavior at runtime, not just static code or model prompts.',
    cisco: 'Cisco AI Defense, Secure Access, Splunk security analytics',
  },
  {
    stage: 'Recover',
    control: 'Log every autonomous action, roll back bad changes, and feed incidents into the SOC.',
    cisco: 'Splunk SOAR, XDR workflows, identity and network telemetry',
  },
];
