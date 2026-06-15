(function () {
  'use strict';

  const blocks = Array.prototype.slice.call(document.querySelectorAll('[data-engagement-post]'));
  if (!blocks.length) return;

  function getVisitorId() {
    const key = 'jr-engagement-visitor-id';
    let value = localStorage.getItem(key);
    if (!value) {
      value = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'visitor-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(key, value);
    }
    return value;
  }

  function setMessage(block, message, tone) {
    const target = block.querySelector('[data-engagement-message]');
    if (!target) return;
    target.textContent = message || '';
    target.dataset.tone = tone || '';
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
    } catch (_err) {
      return 'Recently';
    }
  }

  function render(block, data) {
    const viewer = new Set(data.viewerReactions || []);
    block.querySelectorAll('[data-reaction]').forEach(function (button) {
      const reaction = button.dataset.reaction;
      const count = data.counts && data.counts[reaction] ? Number(data.counts[reaction]) : 0;
      const countNode = button.querySelector('[data-reaction-count]');
      if (countNode) countNode.textContent = String(count);
      button.classList.toggle('is-active', viewer.has(reaction));
      button.setAttribute('aria-pressed', viewer.has(reaction) ? 'true' : 'false');
    });

    const list = block.querySelector('[data-comments-list]');
    if (!list) return;

    const comments = data.comments || [];
    if (!comments.length) {
      list.innerHTML = '<p class="article-comment-empty">No comments yet. Start the thread.</p>';
      return;
    }

    list.innerHTML = comments.map(function (comment) {
      const name = comment.link
        ? '<a href="' + comment.link + '" target="_blank" rel="noreferrer">' + comment.name + '</a>'
        : '<span>' + comment.name + '</span>';
      return [
        '<article class="article-comment">',
          '<div class="article-comment-head">',
            '<strong>' + name + '</strong>',
            '<time datetime="' + comment.createdAt + '">' + formatDate(comment.createdAt) + '</time>',
          '</div>',
          '<p>' + String(comment.body || '').replace(/\n/g, '<br>') + '</p>',
        '</article>',
      ].join('');
    }).join('');
  }

  async function load(block, visitorId) {
    const postId = block.dataset.engagementPost;
    const response = await fetch('/api/engagement?post=' + encodeURIComponent(postId) + '&visitor=' + encodeURIComponent(visitorId));
    if (!response.ok) throw new Error('Unable to load engagement.');
    render(block, await response.json());
  }

  async function post(block, visitorId, payload) {
    const response = await fetch('/api/engagement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ postId: block.dataset.engagementPost, visitorId: visitorId }, payload)),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to save.');
    render(block, data);
    return data;
  }

  const visitorId = getVisitorId();

  blocks.forEach(function (block) {
    const startedAt = Date.now();

    load(block, visitorId).catch(function () {
      setMessage(block, 'Engagement is temporarily unavailable.', 'error');
    });

    block.querySelectorAll('[data-reaction]').forEach(function (button) {
      button.addEventListener('click', async function () {
        button.disabled = true;
        try {
          await post(block, visitorId, { action: 'reaction', reaction: button.dataset.reaction });
          setMessage(block, '', '');
        } catch (err) {
          setMessage(block, err.message, 'error');
        } finally {
          button.disabled = false;
        }
      });
    });

    const form = block.querySelector('[data-comment-form]');
    if (!form) return;

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) submit.disabled = true;

      try {
        const formData = new FormData(form);
        await post(block, visitorId, {
          action: 'comment',
          name: formData.get('name'),
          link: formData.get('link'),
          body: formData.get('body'),
          website: formData.get('website'),
          formStartedAt: startedAt,
        });
        form.reset();
        setMessage(block, 'Posted. Thanks for adding to the thread.', 'success');
      } catch (err) {
        setMessage(block, err.message, 'error');
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  });
})();
