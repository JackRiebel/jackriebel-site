// Agent Shadow IT Blog — Charts, Diagram & Interactivity
(function () {
  'use strict';

  function chartTheme() {
    if (window.JRTheme && typeof window.JRTheme.colors === 'function') return window.JRTheme.colors();
    return {
      text: '#1d1d1f',
      muted: '#6e6e73',
      softText: '#515154',
      grid: 'rgba(29,29,31,0.10)',
      tooltipBg: 'rgba(255,255,255,0.97)',
      tooltipBorder: 'rgba(29,29,31,0.14)',
    };
  }

  const theme = chartTheme();

  Chart.defaults.color = theme.muted;
  Chart.defaults.borderColor = theme.grid;
  Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.labels.boxWidth = 14;
  Chart.defaults.plugins.legend.labels.padding = 16;
  Chart.defaults.plugins.tooltip.backgroundColor = theme.tooltipBg;
  Chart.defaults.plugins.tooltip.titleColor = theme.text;
  Chart.defaults.plugins.tooltip.bodyColor = theme.softText;
  Chart.defaults.plugins.tooltip.borderColor = theme.tooltipBorder;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.tooltip.padding = 10;

  const CYAN = '#22d3ee';
  const PURPLE = '#a78bfa';
  const BLUE = '#60a5fa';
  const GREEN = '#34d399';
  const RED = '#f87171';
  const ORANGE = '#fb923c';

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  const progressBar = $('#readingProgress');
  window.addEventListener('scroll', function () {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  });

  const navLinks = $$('.nav-link');
  const sections = [];
  navLinks.forEach(function (link) {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  function updateNav() {
    let current = sections[0];
    const scrollY = window.scrollY + 120;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (scrollY >= sections[i].el.offsetTop) { current = sections[i]; break; }
    }
    navLinks.forEach(function (l) { l.classList.remove('active'); });
    if (current) current.link.classList.add('active');
  }

  window.addEventListener('scroll', updateNav);
  updateNav();

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById(this.getAttribute('href').slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  new Chart($('#identityRatioChart'), {
    type: 'bar',
    data: {
      labels: IDENTITY_SHIFT.map(function (d) { return d.label; }),
      datasets: [{
        data: IDENTITY_SHIFT.map(function (d) { return d.value; }),
        backgroundColor: [BLUE, PURPLE],
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) { return ctx.parsed.y + ':1 compared with human identities'; },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: function (v) { return v + ':1'; } },
          grid: { color: theme.grid },
        },
        x: { grid: { display: false } },
      },
    },
  });

  new Chart($('#controlGapChart'), {
    type: 'bar',
    data: {
      labels: AGENT_CONTROL_GAP.map(function (d) { return d.label; }),
      datasets: [{
        data: AGENT_CONTROL_GAP.map(function (d) { return d.pct; }),
        backgroundColor: AGENT_CONTROL_GAP.map(function (d) { return d.color; }),
        borderRadius: 6,
        borderSkipped: false,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: function (ctx) { return ctx.parsed.x + '%'; } },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: function (v) { return v + '%'; } },
          grid: { color: theme.grid },
        },
        y: { grid: { display: false } },
      },
    },
  });

  new Chart($('#riskLayerChart'), {
    type: 'bar',
    data: {
      labels: AGENT_RISK_LAYERS.map(function (d) { return d.layer; }),
      datasets: [
        {
          label: 'Risk Pressure Index',
          data: AGENT_RISK_LAYERS.map(function (d) { return d.risk; }),
          backgroundColor: RED + 'cc',
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'Control Readiness Index',
          data: AGENT_RISK_LAYERS.map(function (d) { return d.maturity; }),
          backgroundColor: CYAN + 'cc',
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: { label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '/100'; } },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: function (v) { return v; } },
          grid: { color: theme.grid },
        },
        x: { grid: { display: false } },
      },
    },
  });

  var agentStates = {
    unmanaged: {
      summary: 'Borrowed credentials let agents wander across tools without clear owners or boundaries.',
      saseSummary: 'Remote access exists, but agent traffic is treated too much like normal user traffic.',
      pathLabel: 'Open access: remote agents inherit broad reach',
      buildingLabel: 'Unmanaged: every agent sees too many floors',
      verdictLabel: 'Unmanaged: useful, but overexposed',
      verdictCopy: 'The agents can complete useful work from anywhere, but sales, coding, and SOC workflows all inherit more reach than they need. A compromised prompt, token, or MCP tool has too much room to move.',
      microsegCopy: 'Without microsegmentation, SASE may get the user to the environment, but the internal path is still too broad. Agent role should determine specific app, API, and workload access.',
      gates: {
        sase: ['weak', 'Remote traffic only partially classified'],
        ztna: ['weak', 'Trust inherited from token'],
        segmentation: ['weak', 'Flat east-west reach'],
        microseg: ['weak', 'No workload boundary'],
        telemetry: ['weak', 'Logs are scattered'],
      },
      nodes: {
        salesforce: ['open', 'Read all account data'],
        servicenow: ['open', 'Create + close tickets'],
        webex: ['open', 'Post to broad rooms'],
        github: ['open', 'Open pull requests'],
        splunk: ['open', 'Read all indexes'],
        'prod-db': ['open', 'Reachable network path'],
        payroll: ['open', 'Out of scope but visible'],
      },
    },
    governed: {
      summary: 'Each agent is mapped to an owner, checked by SASE/ZTNA, constrained by fabric policy, and visible to the SOC.',
      saseSummary: 'SASE becomes the front door for remote users and agents: classify traffic, enforce access, inspect SaaS use, and apply data controls.',
      pathLabel: 'SASE/SSE routes each agent to approved apps and segments',
      buildingLabel: 'Governed: agent role decides floor and room access',
      verdictLabel: 'Governed: fast, segmented, and accountable',
      verdictCopy: 'Sales, coding, and SOC agents still move quickly from remote users, but SASE/SSE, ZTNA, segmentation, and microsegmentation decide which apps, floors, and rooms each one can enter.',
      microsegCopy: 'Microsegmentation narrows access from "the network" to specific workloads and behaviors. The SOC agent can read incident indexes, the coding agent can suggest pull requests, and restricted systems stay blocked.',
      gates: {
        sase: ['strong', 'Remote agent traffic classified and inspected'],
        ztna: ['strong', 'User, device, agent posture checked'],
        segmentation: ['strong', 'Fabric routes only approved zones'],
        microseg: ['strong', 'Workload-level policy enforced'],
        telemetry: ['strong', 'SOC sees the full action trail'],
      },
      nodes: {
        salesforce: ['allowed', 'Sales accounts only'],
        servicenow: ['allowed', 'Draft ticket updates'],
        webex: ['allowed', 'Notify approved rooms'],
        github: ['review', 'Suggest pull requests'],
        splunk: ['allowed', 'Read incident indexes'],
        'prod-db': ['blocked', 'No policy path'],
        payroll: ['blocked', 'Outside agent scope'],
      },
    },
  };

  function setAgentMode(mode) {
    var state = agentStates[mode];
    var card = $('.agent-control-card');
    if (!state || !card) return;

    card.dataset.agentState = mode;
    $$('.agent-mode-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.agentMode === mode);
      btn.classList.toggle('danger', btn.dataset.agentMode === 'unmanaged' && btn.dataset.agentMode === mode);
      btn.setAttribute('aria-pressed', btn.dataset.agentMode === mode ? 'true' : 'false');
    });

    $('[data-fabric-summary]').textContent = state.summary;
    $('[data-sase-summary]').textContent = state.saseSummary;
    $('[data-path-label]').textContent = state.pathLabel;
    $('[data-building-label]').textContent = state.buildingLabel;
    $('[data-fabric-verdict-label]').textContent = state.verdictLabel;
    $('[data-fabric-verdict-copy]').textContent = state.verdictCopy;
    $('[data-microseg-copy]').textContent = state.microsegCopy;

    Object.keys(state.gates).forEach(function (key) {
      var el = $('[data-gate="' + key + '"]');
      var checkpoint = state.gates[key];
      if (!el) return;
      el.classList.toggle('weak', checkpoint[0] === 'weak');
      el.classList.toggle('strong', checkpoint[0] === 'strong');
      el.querySelector('small').textContent = checkpoint[1];
    });

    Object.keys(state.nodes).forEach(function (key) {
      var el = $('[data-node="' + key + '"]');
      var nodeState = state.nodes[key];
      if (!el) return;
      el.classList.remove('open', 'allowed', 'blocked', 'review');
      el.classList.add(nodeState[0]);
      el.querySelector('small').textContent = nodeState[1];
    });

    var verdict = $('.fabric-verdict');
    if (verdict) {
      verdict.classList.toggle('weak', mode === 'unmanaged');
      verdict.classList.toggle('strong', mode === 'governed');
    }
  }

  $$('.agent-mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setAgentMode(this.dataset.agentMode);
    });
  });
  setAgentMode('unmanaged');

  var fadeEls = $$('.chart-card, .agent-control-card, .fabric-card, .callout-banner, .conclusion-box, .workflow-col, .glasswing-panel');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  fadeEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();
