/* ============================================================
   Verion Research — Research Hub page logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  const data = await VR.loadJSON('data/articles.json');
  if (!data?.articles) return;

  const articles = data.articles;
  let currentFilter = 'all';

  function renderArticles(list) {
    const grid = document.getElementById('articles-grid');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:3rem 0">
        Nessun articolo trovato per questa categoria.
      </div>`;
      return;
    }
    grid.innerHTML = list.map(a => `
      <a href="#${a.slug}" class="article-card" style="text-decoration:none" data-filter="${a.category}">
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
          <span class="text-muted" style="font-size:.78rem">${a.read_time} min lettura</span>
        </div>
      </a>
    `).join('');
  }

  renderArticles(articles);

  /* ── Filter buttons ── */
  document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.cat;
      const filtered = currentFilter === 'all'
        ? articles
        : articles.filter(a => a.category === currentFilter);
      renderArticles(filtered);
    });
  });

  /* ── Featured articles ── */
  const featuredContainer = document.getElementById('featured-articles');
  if (featuredContainer) {
    const featured = articles.filter(a => a.featured);
    featuredContainer.innerHTML = featured.map(a => `
      <a href="#${a.slug}" class="article-card" style="text-decoration:none">
        <div class="article-card__body">
          <div class="article-card__meta">
            <span class="tag ${VR.tagClass(a.category)}">${VR.tagLabel(a.category)}</span>
            <span class="article-card__date">${VR.fmtDate(a.date)}</span>
            <span class="tag" style="background:rgba(201,168,71,.15);color:var(--accent)">In evidenza</span>
          </div>
          <div class="article-card__title" style="font-size:1.2rem">${a.title}</div>
          <div class="article-card__excerpt">${a.excerpt}</div>
        </div>
        <div class="article-card__footer">
          <span class="article-card__read">Leggi l'analisi →</span>
          <span class="text-muted" style="font-size:.78rem">${a.read_time} min lettura</span>
        </div>
      </a>
    `).join('');
  }

});
