(function () {
  'use strict';

  const GITHUB_USER = 'JackRiebel';
  const repoGrid = document.getElementById('repoGrid');
  const refreshRepos = document.getElementById('refreshRepos');
  const progressBar = document.getElementById('readingProgress');

  const fallbackRepos = [
    {
      name: 'mcp-c-suite-to-noc',
      description: 'Public blog and field-brief site for MCP, agentic operations, and Cisco Live analysis.',
      html_url: 'https://github.com/JackRiebel/mcp-c-suite-to-noc',
      language: 'HTML',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: '2026-06-12T00:00:00Z',
    },
  ];

  function qsAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
    } catch (_err) {
      return 'Recently updated';
    }
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderRepos(repos) {
    if (!repoGrid) return;

    const visibleRepos = repos
      .filter(function (repo) { return !repo.fork; })
      .sort(function (a, b) {
        return new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at);
      })
      .slice(0, 6);

    repoGrid.innerHTML = visibleRepos.map(function (repo) {
      const description = repo.description || 'Public project from the GitHub workspace.';
      return [
        '<article class="site-repo-card">',
          '<div class="site-repo-top">',
            '<span>' + escapeHtml(repo.language || 'Repo') + '</span>',
            '<a href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noreferrer">Open</a>',
          '</div>',
          '<h3>' + escapeHtml(repo.name) + '</h3>',
          '<p>' + escapeHtml(description) + '</p>',
          '<div class="site-repo-meta">',
            '<span>Stars ' + Number(repo.stargazers_count || 0) + '</span>',
            '<span>Forks ' + Number(repo.forks_count || 0) + '</span>',
            '<span>Updated ' + formatDate(repo.pushed_at || repo.updated_at) + '</span>',
          '</div>',
        '</article>',
      ].join('');
    }).join('');
  }

  async function loadRepos() {
    if (!repoGrid) return;
    repoGrid.innerHTML = '<div class="site-repo-loading">Loading public repos...</div>';

    try {
      const response = await fetch('https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=100', {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (!response.ok) throw new Error('GitHub returned ' + response.status);
      const repos = await response.json();
      renderRepos(repos.length ? repos : fallbackRepos);
    } catch (_err) {
      renderRepos(fallbackRepos);
    }
  }

  function initLikes() {
    qsAll('.site-like-btn').forEach(function (button) {
      const key = 'site-like-' + button.dataset.likeId;
      const liked = localStorage.getItem(key) === '1';
      button.classList.toggle('liked', liked);
      button.textContent = liked ? 'Saved' : 'Save';
      button.setAttribute('aria-pressed', liked ? 'true' : 'false');

      button.addEventListener('click', function () {
        const next = localStorage.getItem(key) !== '1';
        localStorage.setItem(key, next ? '1' : '0');
        button.classList.toggle('liked', next);
        button.textContent = next ? 'Saved' : 'Save';
        button.setAttribute('aria-pressed', next ? 'true' : 'false');
      });
    });
  }

  function initProgress() {
    if (!progressBar) return;
    window.addEventListener('scroll', function () {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    });
  }

  function initSmoothScroll() {
    qsAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  if (refreshRepos) refreshRepos.addEventListener('click', loadRepos);

  initLikes();
  initProgress();
  initSmoothScroll();
  loadRepos();
})();
