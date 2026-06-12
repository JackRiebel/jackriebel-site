// Cisco Live US 2026 Mid-Market Blog - Research-backed and illustrative data.

const LIVE26_READINESS = [
  { label: 'Networks fully ready for AI', pct: 15, color: '#22d3ee' },
  { label: 'Pacesetter networks ready', pct: 71, color: '#34d399' },
  { label: 'Planning AI agents', pct: 83, color: '#a78bfa' },
];

// These are conceptual operating-model indexes used to visualize the shift
// discussed in the article. They are not survey percentages.
const LIVE26_TEMPO = [
  { label: 'Annual review', legacy: 90, adaptive: 15 },
  { label: 'Manual correlation', legacy: 82, adaptive: 28 },
  { label: 'Continuous telemetry', legacy: 35, adaptive: 86 },
  { label: 'Runtime mitigation', legacy: 22, adaptive: 78 },
  { label: 'Executive visibility', legacy: 26, adaptive: 82 },
];

const LIVE26_PQC_ROADMAP = [
  { label: 'Inventory', score: 25 },
  { label: 'Classify data', score: 40 },
  { label: 'Map crypto', score: 56 },
  { label: 'Prioritize systems', score: 72 },
  { label: 'Phase migration', score: 88 },
];

const LIVE26_DATA_SHELF = [
  { label: 'Session data', years: 1, urgency: 15 },
  { label: 'Contracts', years: 7, urgency: 46 },
  { label: 'Customer PII', years: 10, urgency: 64 },
  { label: 'Health / legal', years: 20, urgency: 86 },
  { label: 'IP / secrets', years: 30, urgency: 96 },
];

const LIVE26_PERSONAS = {
  exec: {
    owner: 'Asked by: COO / CIO',
    question: 'How is the new customer portal rollout going across our branches?',
    answer: 'Example answer: Most branches look healthy, but one site is the outlier. Meraki client and access health show normal onboarding and LAN performance. ThousandEyes path tests show packet loss after the local ISP handoff toward the portal endpoint, beginning around the same time users reported failures. No relevant security policy change is detected. Likely owner: provider escalation, with IT monitoring user experience until the path stabilizes.',
    domains: ['campus', 'security', 'observability'],
    evidence: ['ThousandEyes path tests', 'Meraki client and access health', 'Security policy and change history', 'Help desk or incident records'],
  },
  it: {
    owner: 'Asked by: Director of IT',
    question: 'Why did wireless complaints spike after the collaboration upgrade?',
    answer: 'Example answer: Wireless association, authentication, and AP health look normal at the affected offices. The spike lines up with a WAN policy change made after the collaboration upgrade, and Webex quality signals show jitter increasing only for users on that traffic class. Likely owner: network operations should review the WAN treatment and QoS policy before changing wireless settings.',
    domains: ['campus', 'collab', 'observability'],
    evidence: ['Wireless association and AP health', 'Webex quality telemetry', 'WAN policy and change history', 'Affected user and site list'],
  },
  security: {
    owner: 'Asked by: CISO / Security Lead',
    question: 'Which infrastructure needs action first after this new advisory?',
    answer: 'Example answer: Two internet-facing platforms are running an affected release and support the highest-risk business services. Three branch devices are affected but sit behind additional policy controls. Where supported, Live Protect eligibility should be checked for a temporary shield while the permanent software fix moves through change control. Priority 1 is the exposed internet-facing pair; Priority 2 is the branch group.',
    domains: ['security', 'dc', 'observability'],
    evidence: ['Cisco security advisory', 'Inventory and software versions', 'Exposure and business criticality', 'Live Protect eligibility where supported'],
  },
};
