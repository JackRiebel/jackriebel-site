# jackriebel.com Deployment Readiness

This repository is prepared for `https://jackriebel.com`, but hosting and DNS are intentionally not activated from this workspace yet.

GitHub repository: `JackRiebel/jackriebel-site`

## Prepared

- Canonical URLs point to `https://jackriebel.com`.
- Open Graph and Twitter preview images use absolute `jackriebel.com` URLs.
- `CNAME` declares the custom domain for static hosts that use it.
- `sitemap.xml` lists the public pages and articles.
- `robots.txt` points crawlers to the sitemap.
- `404.html` provides a branded missing-page fallback.
- `_headers` provides basic static-host security and cache headers.
- `_redirects` provides clean short paths for hosts that support Netlify/Cloudflare-style redirects.
- `.nojekyll` keeps GitHub Pages from applying Jekyll processing.

## Not Done Yet

- No Cloudflare Pages project has been created from this workspace.
- No DNS records have been changed from this workspace.
- No hosting service has been activated or deployed from this workspace.
- No analytics or server-side comment backend has been added.

## Go-Live Checklist

1. Choose the host for `jackriebel.com`.
2. Connect `JackRiebel/jackriebel-site` or upload the static files.
3. Point DNS to the host-provided target.
4. Enable HTTPS.
5. Verify these URLs:
   - `https://jackriebel.com/`
   - `https://jackriebel.com/blogs`
   - `https://jackriebel.com/repos`
   - `https://jackriebel.com/connect`
   - `https://jackriebel.com/cisco-live-2026-midmarket.html`
   - `https://jackriebel.com/mcp-c-suite-to-noc.html`
   - `https://jackriebel.com/agent-shadow-it.html`
   - `https://jackriebel.com/ai-jobs-impact.html`
   - `https://jackriebel.com/sitemap.xml`
   - `https://jackriebel.com/robots.txt`
6. Test social previews after DNS and HTTPS are live.

## Local Preflight

```bash
node --check site.js
node --check theme.js
node --check charts.js
node --check cisco-live-2026-charts.js
node --check agent-shadow-charts.js
node --check ai-jobs-impact-charts.js
git diff --check
```
