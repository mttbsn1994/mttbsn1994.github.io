/* ============================================================
   Verion Research — Home page logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  /* ── Equity curve on homepage ── */
  const svg = document.getElementById('equity-curve');
  if (svg) {
    // Simulated monthly equity curve data (percentage return from inception)
    const equityData = [
      { label: 'Gen', value: 0 },
      { label: 'Feb', value: 7.9 },
      { label: 'Mar', value: 5.8 },
      { label: 'Apr', value: 10.5 },
      { label: 'Mag', value: 8.3 },
      { label: 'Giu', value: 14.1 },
      { label: 'Lug', value: 12.7 },
      { label: 'Ago', value: 18.4 },
      { label: 'Set', value: 16.2 },
      { label: 'Ott', value: 20.8 },
      { label: 'Nov', value: 19.1 },
      { label: 'Dic', value: 22.6 },
      { label: 'Gen25', value: 24.3 },
      { label: 'Feb25', value: 21.9 },
      { label: 'Mar25', value: 26.7 },
      { label: 'Apr25', value: 29.4 }
    ];
    VR.drawEquityCurve(svg, equityData);
  }

  /* ── Load and render recent articles ── */
  const articlesContainer = document.getElementById('home-articles');
  if (articlesContainer) {
    const data = await VR.loadJSON('data/articles.json');
    if (data?.articles) {
      const recent = data.articles.slice(0, 3);
      articlesContainer.innerHTML = recent.map(a => `
        <a href="research.html#${a.slug}" class="article-card" style="text-decoration:none">
          <div class="article-card__body">
            <div class="article-card__meta">
              <span class="tag ${VR.tagClass(a.category)}">${VR.tagLabel(a.category)}</span>
              <span class="article-card__date">${VR.fmtDate(a.date)}</span>
            </div>
            <div class="article-card__title">${a.title}</div>
            <div class="article-card__excerpt">${a.excerpt}</div>
          </div>
          <div class="article-card__footer">
            <span class="article-card__read">Leggi l'analisi →</span>
            <span class="text-muted" style="font-size:.78rem">${a.read_time} min</span>
          </div>
        </a>
      `).join('');
    }
  }

  /* ── Load open positions preview ── */
  const posContainer = document.getElementById('home-positions');
  if (posContainer) {
    const data = await VR.loadJSON('data/operations.json');
    if (data?.operations) {
      const open = data.operations.filter(o => o.status === 'OPEN');
      posContainer.innerHTML = open.map(op => `
        <div class="operation-row">
          <div class="operation-date">
            <div>${VR.fmtDate(op.entry_date)}</div>
            <div class="text-muted" style="font-size:.72rem">${op.type}</div>
          </div>
          <div>
            <div class="operation-name">${op.ticker} — ${op.name}</div>
            <div class="operation-thesis">${op.thesis_title}</div>
          </div>
          <div class="operation-pnl ${VR.pnlClass(op.pnl_pct)}">${VR.fmtPct(op.pnl_pct)}</div>
        </div>
      `).join('');
    }
  }

});
