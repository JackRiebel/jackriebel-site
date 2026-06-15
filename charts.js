// ── MCP Blog — Charts, Diagram & Interactivity ────────────────────────────
(function () {
  'use strict';

  // ── Chart.js global defaults ──────────────────────────────────────────────
  function chartTheme() {
    if (window.JRTheme && typeof window.JRTheme.colors === 'function') return window.JRTheme.colors();
    return {
      text: '#1d1d1f',
      muted: '#6e6e73',
      softText: '#515154',
      faintText: 'rgba(29,29,31,0.34)',
      grid: 'rgba(29,29,31,0.10)',
      tooltipBg: 'rgba(255,255,255,0.97)',
      tooltipBorder: 'rgba(29,29,31,0.14)',
      pointBorder: '#ffffff',
      diagramNode: 'rgba(255,255,255,0.96)',
      diagramHub: 'rgba(255,255,255,0.98)',
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
  const YELLOW = '#fbbf24';

  // ── Utility ───────────────────────────────────────────────────────────────
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  // ── 1. Reading Progress Bar ───────────────────────────────────────────────
  const progressBar = $('#readingProgress');
  window.addEventListener('scroll', function () {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  });

  // ── 2. Sticky Nav Scroll-Spy ──────────────────────────────────────────────
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

  // Smooth scroll for nav links
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById(this.getAttribute('href').slice(1));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ── 3. Alert Fatigue Chart ────────────────────────────────────────────────
  new Chart($('#alertFatigueChart'), {
    type: 'bar',
    data: {
      labels: ['Alerts/Day', 'Unaddressed', 'False Positives\n(46% rate)'],
      datasets: [{
        data: [
          SOC_PAIN.alertsPerDay,
          SOC_PAIN.alertsPerDay * SOC_PAIN.alertsUnaddressedPct / 100,
          SOC_PAIN.alertsPerDay * SOC_PAIN.falsePositiveRate / 100,
        ],
        backgroundColor: [RED, ORANGE, YELLOW],
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
            label: function (ctx) { return ctx.parsed.y.toLocaleString() + ' alerts'; },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: function (v) { return v.toLocaleString(); } },
          grid: { color: theme.grid },
        },
        x: { grid: { display: false } },
      },
    },
  });

  // ── 4. Tool Sprawl Chart ──────────────────────────────────────────────────
  new Chart($('#toolSprawlChart'), {
    type: 'bar',
    data: {
      labels: TOOL_SPRAWL.bySize.map(function (d) { return d.label; }),
      datasets: [{
        label: 'Security Tools',
        data: TOOL_SPRAWL.bySize.map(function (d) { return d.tools; }),
        backgroundColor: [BLUE + '99', BLUE, PURPLE, RED],
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
          callbacks: { label: function (ctx) { return ctx.parsed.x + ' tools'; } },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: theme.grid },
        },
        y: { grid: { display: false } },
      },
    },
  });

  // Charts 5-7 (Coverage Gap, Downtime Cost, MTTR) removed — data woven into prose

  // ── 8. SDK Growth Chart ───────────────────────────────────────────────────
  new Chart($('#sdkGrowthChart'), {
    type: 'line',
    data: {
      labels: SDK_GROWTH.map(function (d) { return d.month; }),
      datasets: [{
        label: 'Monthly Downloads (M)',
        data: SDK_GROWTH.map(function (d) { return d.downloads; }),
        borderColor: CYAN,
        backgroundColor: CYAN + '18',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointBackgroundColor: CYAN,
        pointBorderColor: theme.pointBorder,
        pointBorderWidth: 2,
        pointHoverRadius: 7,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: { label: function (ctx) { return ctx.parsed.y + 'M downloads'; } },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: function (v) { return v + 'M'; } },
          grid: { color: theme.grid },
        },
        x: {
          grid: { display: false },
          ticks: { maxRotation: 45, font: { size: 10 } },
        },
      },
    },
  });

  // Chart 9 (Enterprise Adoption) removed — data woven into prose

  // ── 10. Interactive MCP Diagram (Canvas) ──────────────────────────────────
  var canvas = $('#mcpDiagram');
  var ctx = canvas.getContext('2d');
  var animProgress = 0;
  var animTarget = 0;
  var hoveredNode = null;
  var dpr = window.devicePixelRatio || 1;
  var frameCount = 0;

  var aiModels = [
    { label: 'Claude',  color: '#22d3ee' }, // cyan
    { label: 'GPT',     color: '#14b8a6' }, // teal
    { label: 'Gemini',  color: '#818cf8' }, // indigo
    { label: 'Llama',   color: '#c084fc' }, // violet
    { label: 'Mistral', color: '#2dd4bf' }, // mint
  ];
  var entTools = [
    { label: 'Splunk',       color: '#fb923c' }, // orange
    { label: 'ThousandEyes', color: '#a78bfa' }, // purple
    { label: 'ServiceNow',   color: '#60a5fa' }, // blue
    { label: 'XDR',          color: '#fbbf24' }, // yellow
    { label: 'Duo',          color: '#f472b6' }, // pink
    { label: 'Webex',        color: '#f87171' }, // red
  ];

  function resizeCanvas() {
    var wrapper = canvas.parentElement;
    var w = Math.max(wrapper.clientWidth, 300);
    var h = Math.max(wrapper.clientHeight, 280);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function hex(a) {
    var v = Math.round(Math.max(0, Math.min(1, a)) * 255);
    return (v < 16 ? '0' : '') + v.toString(16);
  }

  // Cubic bezier point at parameter tt (0-1)
  function bez(tt, p0, p1, p2, p3) {
    var u = 1 - tt;
    return u * u * u * p0 + 3 * u * u * tt * p1 + 3 * u * tt * tt * p2 + tt * tt * tt * p3;
  }

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawDiagram() {
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);
    var t = animProgress;
    frameCount++;

    var sm = w < 500;
    var boxW = sm ? 78 : 110;
    var boxH = sm ? 30 : 36;
    var pad = sm ? 16 : 40;
    var leftX = pad;
    var rightX = w - pad - boxW;
    var midX = w / 2;

    // Y positions for left column (5 AI models)
    var aiYs = [];
    var aiTopPad = sm ? 30 : 36;
    var aiUsable = h - aiTopPad * 2 - 30;
    for (var i = 0; i < aiModels.length; i++) {
      aiYs.push(aiTopPad + (aiUsable / (aiModels.length - 1)) * i);
    }

    // Y positions for right column (6 tools)
    var toolYs = [];
    var toolUsable = h - aiTopPad * 2 - 30;
    for (var j = 0; j < entTools.length; j++) {
      toolYs.push(aiTopPad + (toolUsable / (entTools.length - 1)) * j);
    }

    // Column headers
    ctx.font = '600 ' + (sm ? '9' : '10') + 'px Inter, system-ui';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = CYAN + '88';
    ctx.textAlign = 'left';
    ctx.fillText('AI MODELS', leftX, aiTopPad - 16);
    ctx.fillStyle = PURPLE + '88';
    ctx.textAlign = 'right';
    ctx.fillText('YOUR TOOLS', rightX + boxW, aiTopPad - 16);

    var ba = 1 - t;
    var aa = t;
    var hovLabel = hoveredNode ? hoveredNode.label : null;

    // ── BEFORE: spaghetti lines ──
    // Each line is colored by the AI it connects to, because without MCP
    // every line is a custom integration built specifically for that AI.
    // A single tool has 5 differently colored lines leaving it — one per AI.
    if (ba > 0.01) {
      aiModels.forEach(function (ai, i) {
        var ay = aiYs[i] + boxH / 2;
        entTools.forEach(function (tool, j) {
          var ty = toolYs[j] + boxH / 2;
          var highlighted = hovLabel && (hovLabel === ai.label || hovLabel === tool.label);
          var alpha = 0.25 * ba;
          if (hovLabel) alpha = highlighted ? 0.9 * ba : 0.05 * ba;

          // Bezier points: AI-right → tool-left
          var p0x = leftX + boxW, p0y = ay;
          var p3x = rightX,       p3y = ty;
          var cp = (p3x - p0x) * 0.4;
          var p1x = p0x + cp,     p1y = p0y;
          var p2x = p3x - cp,     p2y = p3y;

          // Line colored by AI — each AI has its own custom integration
          ctx.strokeStyle = ai.color + hex(alpha);
          ctx.lineWidth = highlighted ? 1.8 : 1.2;
          ctx.beginPath();
          ctx.moveTo(p0x, p0y);
          ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
          ctx.stroke();

          // Animated flow dot on hover — AI's color (this is the AI's custom path)
          if (highlighted) {
            var raw = ((frameCount * 0.011 + j * 0.19 + i * 0.07) % 1);
            var dotT = 1 - raw; // tool → AI
            var dx = bez(dotT, p0x, p1x, p2x, p3x);
            var dy = bez(dotT, p0y, p1y, p2y, p3y);
            ctx.beginPath();
            ctx.arc(dx, dy, 3, 0, Math.PI * 2);
            ctx.fillStyle = ai.color + hex(ba * 0.95);
            ctx.fill();
          }
        });
      });
    }

    // ── AFTER: lines through MCP bar ──
    if (aa > 0.01) {
      // MCP hub — a single bubble in the vertical center
      var hubR = sm ? 34 : 44;
      var topNode = Math.min(aiYs[0], toolYs[0]);
      var botNode = Math.max(aiYs[aiYs.length - 1] + boxH, toolYs[toolYs.length - 1] + boxH);
      var hubY = (topNode + botNode) / 2;
      var pulse = Math.sin(frameCount * 0.03) * 0.1 + 0.9;

      // Hover logic — asymmetric:
      // - Hover a TOOL: one MCP server serves all AIs → all AI lines bright
      // - Hover an AI: each tool still has its own MCP server → rotate
      //   through tools one at a time to show the AI reaching each one
      var isAnyHovered = !!hovLabel;
      var hovIsAI = isAnyHovered && aiModels.some(function(a) { return a.label === hovLabel; });
      var hovIsTool = isAnyHovered && entTools.some(function(t) { return t.label === hovLabel; });

      // When an AI is hovered, cycle through tools (one highlighted at a time)
      var rotatingToolIdx = -1;
      if (hovIsAI) {
        var cyclePeriod = 60; // frames per tool
        rotatingToolIdx = Math.floor(frameCount / cyclePeriod) % entTools.length;
      }

      // ── TOOL → HUB LINES (right side) ──
      // Each line colored in its tool's color. Dot flows FROM tool TO hub
      // in the tool's color (showing raw tool data entering MCP).
      entTools.forEach(function (tool, j) {
        var ty = toolYs[j] + boxH / 2;
        var alpha = 0.5 * aa;
        if (hovIsTool && hovLabel !== tool.label) alpha = 0.12 * aa;
        if (hovIsTool && hovLabel === tool.label) alpha = 0.95 * aa;
        if (hovIsAI) {
          alpha = (j === rotatingToolIdx) ? 0.95 * aa : 0.12 * aa;
        }

        // Bezier points: P0=hub-right, P1, P2, P3=tool-left
        var p0x = midX + hubR, p0y = hubY;
        var p3x = rightX,       p3y = ty;
        var cp = (p3x - p0x) * 0.55;
        var p1x = p0x + cp * 0.5, p1y = p0y;
        var p2x = p3x - cp,       p2y = p3y;

        ctx.strokeStyle = tool.color + hex(alpha);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
        ctx.stroke();

        // Flow dot: travels from tool (t=1) toward hub (t=0)
        var raw = ((frameCount * 0.01 + j * 0.17) % 1);
        var dotT = 1 - raw; // reverse direction
        var dotX = bez(dotT, p0x, p1x, p2x, p3x);
        var dotY = bez(dotT, p0y, p1y, p2y, p3y);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = tool.color + hex(alpha);
        ctx.fill();
      });

      // ── HUB → AI LINES (left side) ──
      // Lines in neutral cyan. Dot flows FROM hub TO AI in GREEN
      // (showing standardized MCP output reaching supported AI clients).
      aiModels.forEach(function (ai, i) {
        var ay = aiYs[i] + boxH / 2;
        var alpha = 0.5 * aa;
        if (hovIsAI && hovLabel !== ai.label) alpha = 0.12 * aa;
        if (hovIsAI && hovLabel === ai.label) alpha = 0.95 * aa;
        if (hovIsTool) alpha = 0.7 * aa;

        // Bezier points: P0=hub-left, P1, P2, P3=AI-right
        var p0x = midX - hubR, p0y = hubY;
        var p3x = leftX + boxW, p3y = ay;
        var cp = (p0x - p3x) * 0.55;
        var p1x = p0x - cp * 0.5, p1y = p0y;
        var p2x = p3x + cp,       p2y = p3y;

        ctx.strokeStyle = CYAN + hex(alpha);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p0x, p0y);
        ctx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
        ctx.stroke();

        // Flow dot in GREEN: travels from hub (t=0) to AI (t=1)
        var dotT = ((frameCount * 0.01 + i * 0.2) % 1);
        var dotX = bez(dotT, p0x, p1x, p2x, p3x);
        var dotY = bez(dotT, p0y, p1y, p2y, p3y);
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        ctx.fillStyle = GREEN + hex(alpha);
        ctx.fill();
      });

      // MCP hub bubble — outer glow ring
      ctx.beginPath();
      ctx.arc(midX, hubY, hubR + 6 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = GREEN + hex(aa * 0.06);
      ctx.fill();

      // MCP hub bubble — main
      ctx.shadowColor = GREEN + hex(aa * 0.45);
      ctx.shadowBlur = 26;
      ctx.beginPath();
      ctx.arc(midX, hubY, hubR, 0, Math.PI * 2);
      ctx.fillStyle = theme.diagramHub;
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.beginPath();
      ctx.arc(midX, hubY, hubR, 0, Math.PI * 2);
      ctx.fillStyle = GREEN + hex(aa * 0.12);
      ctx.fill();
      ctx.strokeStyle = GREEN + hex(aa * pulse);
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // MCP label
      ctx.fillStyle = theme.text;
      ctx.globalAlpha = aa;
      ctx.font = '700 ' + (sm ? '14' : '17') + 'px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('MCP', midX, hubY);
      ctx.globalAlpha = 1;
    }

    // Determine hover context for box styling
    var hovIsAIBox = hovLabel && aiModels.some(function(a) { return a.label === hovLabel; });
    var hovIsToolBox = hovLabel && entTools.some(function(t) { return t.label === hovLabel; });

    // Calculate rotating tool for AI hover (only applies in "after" state)
    var rotTool = -1;
    if (hovIsAIBox && aa > 0.5) {
      rotTool = Math.floor(frameCount / 60) % entTools.length;
    }

    // ── LEFT COLUMN: AI model boxes (each in its own color) ──
    aiModels.forEach(function (ai, i) {
      var y = aiYs[i];
      var isThis = hovLabel === ai.label;
      var bright = isThis || hovIsToolBox || !hovLabel;
      var dimmed = hovLabel && !bright;
      var ac = ai.color;

      rrect(leftX, y, boxW, boxH, 7);
      ctx.fillStyle = isThis ? ac + '1f' : theme.diagramNode;
      ctx.fill();
      ctx.strokeStyle = dimmed ? ac + '22' : (isThis ? ac + 'dd' : ac + '66');
      ctx.lineWidth = isThis ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = dimmed ? theme.faintText : theme.text;
      ctx.font = (isThis ? '700 ' : '500 ') + (sm ? '11' : '13') + 'px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ai.label, leftX + boxW / 2, y + boxH / 2);
    });

    // ── RIGHT COLUMN: tool boxes (each in its own color) ──
    entTools.forEach(function (tool, j) {
      var y = toolYs[j];
      var isThis = hovLabel === tool.label;
      var bright;
      if (isThis) bright = true;
      else if (hovIsAIBox) bright = (j === rotTool);
      else if (hovIsToolBox) bright = false;
      else bright = true;
      var dimmed = hovLabel && !bright;
      var isRot = hovIsAIBox && j === rotTool;
      var tc = tool.color;

      rrect(rightX, y, boxW, boxH, 7);
      ctx.fillStyle = isThis ? tc + '1f' : (isRot ? tc + '14' : theme.diagramNode);
      ctx.fill();
      ctx.strokeStyle = dimmed ? tc + '22' : ((isThis || isRot) ? tc + 'dd' : tc + '66');
      ctx.lineWidth = (isThis || isRot) ? 2 : 1;
      ctx.stroke();
      ctx.fillStyle = dimmed ? theme.faintText : theme.text;
      ctx.font = ((isThis || isRot) ? '700 ' : '500 ') + (sm ? '10' : '13') + 'px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(tool.label, rightX + boxW / 2, y + boxH / 2);
    });

    // ── HOVER HINT ──
    if (!hovLabel) {
      var hintPulse = Math.sin(frameCount * 0.04) * 0.3 + 0.7;
      ctx.font = '600 ' + (sm ? '10' : '12') + 'px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (aa > 0.5) {
        ctx.fillStyle = GREEN + hex(aa * 0.9 * hintPulse);
        ctx.fillText('\u2190  Hover any AI or tool to see how MCP connects them  \u2192', w / 2, h - (sm ? 28 : 36));
      } else if (ba > 0.5) {
        ctx.fillStyle = 'rgba(248,113,113,' + (ba * 0.8 * hintPulse) + ')';
        ctx.fillText('\u2190  Hover any AI or tool to see the integration chaos  \u2192', w / 2, h - (sm ? 28 : 36));
      }
    }

    // ── BOTTOM LABEL ──
    var total = aiModels.length * entTools.length;
    var label = t < 0.5
      ? total + ' custom integrations to build & maintain'
      : (aiModels.length + entTools.length) + ' connections through one standard';
    ctx.fillStyle = theme.text;
    ctx.font = '600 ' + (sm ? '11' : '14') + 'px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(label, w / 2, h - (sm ? 8 : 12));
  }

  function animateDiagram() {
    if (Math.abs(animProgress - animTarget) > 0.005) {
      animProgress += (animTarget - animProgress) * 0.12;
      if (Math.abs(animProgress - animTarget) < 0.005) animProgress = animTarget;
    }
    drawDiagram();
    requestAnimationFrame(animateDiagram);
  }

  $$('.diagram-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.diagram-btn').forEach(function (b) { b.classList.remove('active', 'active-red'); });
      if (this.dataset.view === 'before') {
        animTarget = 0;
        this.classList.add('active-red');
      } else {
        animTarget = 1;
        this.classList.add('active');
      }
    });
  });

  // Hover detection for boxes
  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    var sm = w < 500;
    var boxW = sm ? 78 : 110;
    var boxH = sm ? 30 : 36;
    var pad = sm ? 16 : 40;
    var leftX = pad;
    var rightX = w - pad - boxW;
    var aiTopPad = sm ? 30 : 36;
    var aiUsable = h - aiTopPad * 2 - 30;
    var toolUsable = aiUsable;
    hoveredNode = null;

    for (var i = 0; i < aiModels.length; i++) {
      var y = aiTopPad + (aiUsable / (aiModels.length - 1)) * i;
      if (mx >= leftX && mx <= leftX + boxW && my >= y && my <= y + boxH) {
        hoveredNode = aiModels[i];
        canvas.style.cursor = 'pointer';
        return;
      }
    }
    for (var j = 0; j < entTools.length; j++) {
      var y = aiTopPad + (toolUsable / (entTools.length - 1)) * j;
      if (mx >= rightX && mx <= rightX + boxW && my >= y && my <= y + boxH) {
        hoveredNode = entTools[j];
        canvas.style.cursor = 'pointer';
        return;
      }
    }
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('mouseleave', function () { hoveredNode = null; });

  // Touch support
  canvas.addEventListener('touchstart', function (e) {
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var mx = touch.clientX - rect.left;
    var my = touch.clientY - rect.top;
    var w = canvas.width / dpr;
    var h = canvas.height / dpr;
    var sm = w < 500;
    var boxW = sm ? 78 : 110;
    var boxH = sm ? 30 : 36;
    var pad = sm ? 16 : 40;
    var leftX = pad;
    var rightX = w - pad - boxW;
    var aiTopPad = sm ? 30 : 36;
    var aiUsable = h - aiTopPad * 2 - 30;
    hoveredNode = null;

    for (var i = 0; i < aiModels.length; i++) {
      var y = aiTopPad + (aiUsable / (aiModels.length - 1)) * i;
      if (mx >= leftX && mx <= leftX + boxW && my >= y && my <= y + boxH) {
        hoveredNode = aiModels[i]; return;
      }
    }
    for (var j = 0; j < entTools.length; j++) {
      var y = aiTopPad + (aiUsable / (entTools.length - 1)) * j;
      if (mx >= rightX && mx <= rightX + boxW && my >= y && my <= y + boxH) {
        hoveredNode = entTools[j]; return;
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchend', function () {
    setTimeout(function () { hoveredNode = null; }, 1500);
  }, { passive: true });

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 150);
  requestAnimationFrame(animateDiagram);

  // ── 11. Scroll-triggered fade-in ──────────────────────────────────────────
  var fadeEls = $$('.chart-card, .callout-banner, .conclusion-box, .workflow-col');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Force Chart.js to recalculate dimensions for canvas charts
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
