/* ============================================================
   Verion Research — Shared UI Components
   ============================================================ */

const VR = (() => {

  /* ── Active nav link ── */
  function setActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === page || (page === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ── Mobile menu toggle ── */
  function initMobileMenu() {
    const toggle = document.querySelector('.navbar__toggle');
    const links  = document.querySelector('.navbar__links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    // close on link click
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  /* ── Navbar scroll shadow ── */
  function initNavbarScroll() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 8
        ? '0 1px 24px rgba(0,0,0,.35)'
        : '';
    }, { passive: true });
  }

  /* ── Tab navigation ── */
  function initTabs(selector = '.tab-btn') {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.closest('[data-tabs]');
        if (!group) return;
        group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        group.querySelectorAll('[data-tab-content]').forEach(panel => {
          panel.style.display = panel.dataset.tabContent === target ? '' : 'none';
        });
      });
    });
    // activate first tab in each group
    document.querySelectorAll('[data-tabs]').forEach(group => {
      const first = group.querySelector('.tab-btn');
      if (first) first.click();
    });
  }

  /* ── Filter buttons ── */
  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      const btns  = group.querySelectorAll('.filter-btn');
      const items = document.querySelectorAll('[data-filter]');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const f = btn.dataset.filterBtn;
          items.forEach(item => {
            const show = f === 'all' || item.dataset.filter === f;
            item.style.display = show ? '' : 'none';
          });
        });
      });
    });
  }

  /* ── Tag colour helper ── */
  function tagClass(cat) {
    const map = { macro: 'tag--macro', sector: 'tag--sector', equity: 'tag--equity', idea: 'tag--idea', crypto: 'tag--crypto' };
    return map[cat] || '';
  }

  function tagLabel(cat) {
    const map = { macro: 'Macro', sector: 'Settori', equity: 'Equity', idea: 'Idee', crypto: 'Crypto' };
    return map[cat] || cat;
  }

  /* ── Format helpers ── */
  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function fmtPct(val, showSign = true) {
    if (val == null) return '—';
    const sign = val > 0 && showSign ? '+' : '';
    return `${sign}${val.toFixed(2)}%`;
  }

  function pnlClass(val) {
    if (val > 0) return 'positive';
    if (val < 0) return 'negative';
    return '';
  }

  /* ── Equity Curve SVG ── */
  function drawEquityCurve(svgEl, dataPoints) {
    if (!svgEl || !dataPoints?.length) return;
    const W = svgEl.clientWidth || 800;
    const H = svgEl.clientHeight || 220;
    const pad = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerW = W - pad.left - pad.right;
    const innerH = H - pad.top - pad.bottom;

    const min = Math.min(...dataPoints.map(d => d.value));
    const max = Math.max(...dataPoints.map(d => d.value));
    const range = max - min || 1;

    const scaleX = i => pad.left + (i / (dataPoints.length - 1)) * innerW;
    const scaleY = v => pad.top + (1 - (v - min) / range) * innerH;

    const ns = 'http://www.w3.org/2000/svg';

    // defs
    const defs = document.createElementNS(ns, 'defs');
    defs.innerHTML = `
      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#c9a847" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#c9a847" stop-opacity="0"/>
      </linearGradient>`;
    svgEl.appendChild(defs);

    // grid lines
    [0, 0.25, 0.5, 0.75, 1].forEach(t => {
      const y = pad.top + t * innerH;
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', pad.left); line.setAttribute('x2', W - pad.right);
      line.setAttribute('y1', y); line.setAttribute('y2', y);
      line.setAttribute('stroke', '#1e2a3a'); line.setAttribute('stroke-width', '1');
      svgEl.appendChild(line);

      const val = max - t * range;
      const label = document.createElementNS(ns, 'text');
      label.setAttribute('x', pad.left - 6); label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', '#4a5568'); label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'Inter, sans-serif');
      label.textContent = val.toFixed(0) + '%';
      svgEl.appendChild(label);
    });

    // area
    const areaPoints = dataPoints.map((d, i) => `${scaleX(i)},${scaleY(d.value)}`).join(' ');
    const areaClose = `${scaleX(dataPoints.length-1)},${pad.top+innerH} ${pad.left},${pad.top+innerH}`;
    const area = document.createElementNS(ns, 'polygon');
    area.setAttribute('points', areaPoints + ' ' + areaClose);
    area.setAttribute('fill', 'url(#equityGrad)');
    svgEl.appendChild(area);

    // line
    const linePts = dataPoints.map((d, i) => `${i===0?'M':'L'}${scaleX(i)},${scaleY(d.value)}`).join(' ');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', linePts);
    path.setAttribute('fill', 'none'); path.setAttribute('stroke', '#c9a847'); path.setAttribute('stroke-width', '2');
    svgEl.appendChild(path);
  }

  /* ── Load JSON helper ── */
  async function loadJSON(path) {
    try {
      const r = await fetch(path);
      if (!r.ok) throw new Error(r.status);
      return await r.json();
    } catch (e) {
      console.warn(`VR: could not load ${path}`, e);
      return null;
    }
  }

  /* ── Init all ── */
  function init() {
    setActiveNav();
    initMobileMenu();
    initNavbarScroll();
    initTabs();
    initFilters();
  }

  return { init, loadJSON, fmtDate, fmtPct, pnlClass, tagClass, tagLabel, drawEquityCurve };
})();

document.addEventListener('DOMContentLoaded', VR.init);
