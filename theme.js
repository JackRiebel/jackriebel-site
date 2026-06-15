(function () {
  'use strict';

  const STORAGE_KEY = 'jr-theme-preference';
  const MODES = ['system', 'light', 'dark'];
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function cookieMode() {
    const match = document.cookie.match(new RegExp('(?:^|; )' + STORAGE_KEY + '=([^;]*)'));
    const value = match ? decodeURIComponent(match[1]) : null;
    return MODES.indexOf(value) !== -1 ? value : 'system';
  }

  function storedMode() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return MODES.indexOf(value) !== -1 ? value : 'system';
    } catch (_err) {
      return cookieMode();
    }
  }

  function systemTheme() {
    return media && media.matches ? 'dark' : 'light';
  }

  function resolvedTheme(mode) {
    return mode === 'system' ? systemTheme() : mode;
  }

  function setStoredMode(mode) {
    try {
      if (mode === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, mode);
      document.cookie = STORAGE_KEY + '=; Max-Age=0; path=/; SameSite=Lax';
    } catch (_err) {
      if (mode === 'system') {
        document.cookie = STORAGE_KEY + '=; Max-Age=0; path=/; SameSite=Lax';
      } else {
        document.cookie = STORAGE_KEY + '=' + encodeURIComponent(mode) + '; Max-Age=31536000; path=/; SameSite=Lax';
      }
    }
  }

  function applyTheme(mode) {
    const safeMode = MODES.indexOf(mode) !== -1 ? mode : 'system';
    const resolved = resolvedTheme(safeMode);
    document.documentElement.dataset.themeMode = safeMode;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
    updateButtons(safeMode, resolved);
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { mode: safeMode, resolvedTheme: resolved },
    }));
  }

  function chartColors() {
    const dark = document.documentElement.dataset.theme === 'dark';
    return {
      isDark: dark,
      text: dark ? '#f5f5f7' : '#1d1d1f',
      muted: dark ? '#a1a1a6' : '#6e6e73',
      softText: dark ? '#c7c7cc' : '#515154',
      faintText: dark ? 'rgba(245,245,247,0.34)' : 'rgba(29,29,31,0.34)',
      grid: dark ? 'rgba(245,245,247,0.13)' : 'rgba(29,29,31,0.10)',
      tooltipBg: dark ? 'rgba(28,28,30,0.96)' : 'rgba(255,255,255,0.97)',
      tooltipBorder: dark ? 'rgba(245,245,247,0.16)' : 'rgba(29,29,31,0.14)',
      pointBorder: dark ? '#1c1c1e' : '#ffffff',
      diagramNode: dark ? 'rgba(28,28,30,0.96)' : 'rgba(255,255,255,0.96)',
      diagramHub: dark ? 'rgba(8,8,16,0.97)' : 'rgba(255,255,255,0.98)',
      diagramSurface: dark ? '#111114' : '#ffffff',
      treemapBg: dark ? '#111114' : '#ffffff',
      treemapGroup: dark ? 'rgba(255,255,255,0.03)' : 'rgba(29,29,31,0.035)',
      treemapTileText: dark ? '#ffffff' : '#1d1d1f',
      treemapTileSubtext: dark ? 'rgba(255,255,255,0.72)' : 'rgba(29,29,31,0.66)',
      treemapTileFaint: dark ? 'rgba(255,255,255,0.42)' : 'rgba(29,29,31,0.48)',
      treemapCategory: dark ? 'rgba(255,255,255,0.16)' : 'rgba(29,29,31,0.18)',
      progressTrack: dark ? 'rgba(255,255,255,0.12)' : 'rgba(29,29,31,0.10)',
    };
  }

  function updateButtons(mode, resolved) {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      const label = mode === 'system' ? 'System' : mode.charAt(0).toUpperCase() + mode.slice(1);
      button.textContent = label;
      button.setAttribute('aria-label', 'Theme: ' + label + ' (' + resolved + ')');
      button.setAttribute('title', 'Theme: ' + label + ' (' + resolved + ')');
    });
  }

  function nextMode(mode) {
    return MODES[(MODES.indexOf(mode) + 1) % MODES.length] || 'system';
  }

  function createToggle() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.dataset.themeToggle = 'true';
    button.addEventListener('click', function () {
      const mode = nextMode(document.documentElement.dataset.themeMode || storedMode());
      setStoredMode(mode);
      applyTheme(mode);

      if (document.body && document.body.classList.contains('article-page')) {
        window.setTimeout(function () { window.location.reload(); }, 80);
      }
    });
    return button;
  }

  function createSiteLink(href, text, active) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    if (active) link.className = 'active';
    return link;
  }

  function mountArticleTopbar() {
    if (!document.body || !document.body.classList.contains('article-page')) return;
    if (document.querySelector('.article-site-topbar')) return;

    const topbar = document.createElement('nav');
    topbar.className = 'article-site-topbar';
    topbar.setAttribute('aria-label', 'Primary');

    const mark = document.createElement('a');
    mark.className = 'site-mark';
    mark.href = 'index.html';
    mark.setAttribute('aria-label', 'Jack Riebel home');
    mark.innerHTML = '<span>JR</span><strong>Jack Riebel</strong>';

    const nav = document.createElement('div');
    nav.className = 'site-nav';
    nav.appendChild(createSiteLink('index.html', 'About', false));
    nav.appendChild(createSiteLink('blogs.html', 'Blogs', true));
    nav.appendChild(createSiteLink('repos.html', 'Repos', false));
    nav.appendChild(createSiteLink('connect.html', 'Connect', false));

    const github = document.createElement('a');
    github.className = 'site-ghost-btn';
    github.href = 'https://github.com/JackRiebel';
    github.target = '_blank';
    github.rel = 'noreferrer';
    github.textContent = 'GitHub';

    topbar.appendChild(mark);
    topbar.appendChild(nav);
    topbar.appendChild(github);

    const readingProgress = document.querySelector('.reading-progress');
    if (readingProgress && readingProgress.parentNode) {
      readingProgress.insertAdjacentElement('afterend', topbar);
    } else {
      document.body.insertBefore(topbar, document.body.firstChild);
    }
  }

  function mountBackToTop() {
    if (!document.body || !document.body.classList.contains('article-page')) return;
    if (document.querySelector('[data-back-to-top]')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'back-to-top';
    button.dataset.backToTop = 'true';
    button.textContent = 'Top';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('title', 'Back to top');

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function updateVisibility() {
      button.classList.toggle('is-visible', window.scrollY > 640);
    }

    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    });

    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    document.body.appendChild(button);
    updateVisibility();
  }

  function mountToggle() {
    mountArticleTopbar();
    mountBackToTop();

    const targets = [];
    const siteTopbar = document.querySelector('.site-topbar');
    const articleTopbar = document.querySelector('.article-site-topbar');
    const articleNav = document.querySelector('.article-page .sticky-nav .nav-inner');
    if (siteTopbar) targets.push(siteTopbar);
    else if (articleTopbar) targets.push(articleTopbar);
    else if (articleNav) targets.push(articleNav);
    if (!targets.length && document.body) targets.push(document.body);

    targets.forEach(function (target) {
      if (target.querySelector('[data-theme-toggle]')) return;
      target.appendChild(createToggle());
    });
    updateButtons(document.documentElement.dataset.themeMode || storedMode(), document.documentElement.dataset.theme || systemTheme());
  }

  window.JRTheme = {
    apply: applyTheme,
    colors: chartColors,
    mode: function () { return document.documentElement.dataset.themeMode || storedMode(); },
    resolved: function () { return document.documentElement.dataset.theme || systemTheme(); },
  };

  applyTheme(storedMode());

  if (media) {
    const onSystemChange = function () {
      if ((document.documentElement.dataset.themeMode || 'system') === 'system') applyTheme('system');
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToggle);
  } else {
    mountToggle();
  }
})();
