// Cisco Live US 2026 Mid-Market Blog - Charts and interactivity.
(function () {
  'use strict';

  const hasChart = typeof Chart !== 'undefined';

  if (hasChart) {
    Chart.defaults.color = '#888894';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.labels.boxWidth = 14;
    Chart.defaults.plugins.legend.labels.padding = 16;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10,10,15,0.95)';
    Chart.defaults.plugins.tooltip.titleColor = '#fff';
    Chart.defaults.plugins.tooltip.bodyColor = '#e0e0e8';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 10;
  }

  const CYAN = '#22d3ee';
  const PURPLE = '#a78bfa';
  const GREEN = '#34d399';
  const RED = '#f87171';
  const ORANGE = '#fb923c';

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  const viewCount = $('#live26ViewCount');
  if (viewCount) {
    try {
      const key = 'cisco-live-2026-midmarket-view-count';
      const nextCount = (parseInt(localStorage.getItem(key), 10) || 0) + 1;
      localStorage.setItem(key, String(nextCount));
      viewCount.textContent = String(nextCount);
      const viewLabel = $('#live26ViewLabel');
      if (viewLabel) viewLabel.textContent = nextCount === 1 ? 'view' : 'views';
    } catch (_err) {
      viewCount.textContent = '1';
      const viewLabel = $('#live26ViewLabel');
      if (viewLabel) viewLabel.textContent = 'view';
    }
  }

  const sourcesPanel = $('.live26-sources-panel');
  if (sourcesPanel && window.location.hash === '#methodology') {
    sourcesPanel.open = true;
  }

  $$('a[href="#methodology"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (sourcesPanel) sourcesPanel.open = true;
    });
  });

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

  const aiReadinessCanvas = $('#aiReadinessChart');
  if (hasChart && aiReadinessCanvas) {
    new Chart(aiReadinessCanvas, {
      type: 'bar',
      data: {
        labels: LIVE26_READINESS.map(function (d) { return d.label; }),
        datasets: [{
          data: LIVE26_READINESS.map(function (d) { return d.pct; }),
          backgroundColor: LIVE26_READINESS.map(function (d) { return d.color; }),
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (ctx) { return ctx.parsed.x + '%'; } } },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: function (v) { return v + '%'; } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  const tempoCanvas = $('#tempoChart');
  if (hasChart && tempoCanvas) {
    new Chart(tempoCanvas, {
      type: 'bar',
      data: {
        labels: LIVE26_TEMPO.map(function (d) { return d.label; }),
        datasets: [
          {
            label: 'Legacy operating pressure',
            data: LIVE26_TEMPO.map(function (d) { return d.legacy; }),
            backgroundColor: RED + 'cc',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Adaptive capability',
            data: LIVE26_TEMPO.map(function (d) { return d.adaptive; }),
            backgroundColor: CYAN + 'cc',
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { callbacks: { label: function (ctx) { return ctx.dataset.label + ': ' + ctx.parsed.y + '/100'; } } },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          x: { grid: { display: false } },
        },
      },
    });
  }

  const pqcRoadmapCanvas = $('#pqcRoadmapChart');
  if (hasChart && pqcRoadmapCanvas) {
    new Chart(pqcRoadmapCanvas, {
      type: 'bar',
      data: {
        labels: LIVE26_PQC_ROADMAP.map(function (d) { return d.label; }),
        datasets: [{
          label: 'Planning maturity',
          data: LIVE26_PQC_ROADMAP.map(function (d) { return d.score; }),
          backgroundColor: LIVE26_PQC_ROADMAP.map(function (_d, i) {
            return i < 2 ? CYAN + 'aa' : i < 4 ? PURPLE + 'aa' : GREEN + 'bb';
          }),
          borderRadius: 7,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (ctx) { return 'Planning maturity: ' + ctx.parsed.x + '/100'; } } },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            ticks: { callback: function (v) { return v + '/100'; } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  const dataShelfCanvas = $('#dataShelfLifeChart');
  if (hasChart && dataShelfCanvas) {
    new Chart(dataShelfCanvas, {
      type: 'bubble',
      data: {
        datasets: LIVE26_DATA_SHELF.map(function (d) {
          return {
            label: d.label,
            data: [{ x: d.years, y: d.urgency, r: Math.max(8, Math.min(24, d.years)) }],
            backgroundColor: d.urgency > 80 ? ORANGE + 'cc' : PURPLE + 'cc',
          };
        }),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return ctx.dataset.label + ': shelf life ' + ctx.parsed.x + ' years, planning urgency ' + ctx.parsed.y + '/100';
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Confidentiality shelf life in years' },
            beginAtZero: true,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { callback: function (v) { return v + 'y'; } },
          },
          y: {
            title: { display: true, text: 'PQC planning urgency' },
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
        },
      },
    });
  }

  function setPersona(key) {
    const persona = LIVE26_PERSONAS[key];
    const room = $('.live26-control-room');
    if (!persona || !room) return;

    room.dataset.live26Persona = key;
    $('[data-live26-owner]').textContent = persona.owner;
    $('[data-live26-question]').textContent = persona.question;
    $('[data-live26-answer]').textContent = persona.answer;

    $$('.live26-persona-btn').forEach(function (btn) {
      const active = btn.dataset.persona === key;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    $$('.live26-domain-node').forEach(function (node) {
      node.classList.toggle('active', persona.domains.indexOf(node.dataset.domain) !== -1);
    });

    const evidence = $('[data-live26-evidence]');
    evidence.innerHTML = '<b>Signals behind the answer</b>' + persona.evidence.map(function (item) {
      return '<small>' + item + '</small>';
    }).join('');
  }

  $$('.live26-persona-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setPersona(btn.dataset.persona);
    });
  });
})();
