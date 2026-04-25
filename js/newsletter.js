/* ============================================================
   Verion Research — Newsletter page logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  const data = await VR.loadJSON('data/newsletter.json');
  if (!data?.issues) return;

  const list = document.getElementById('newsletter-list');
  if (!list) return;

  list.innerHTML = data.issues.map(issue => `
    <a href="#${issue.slug}" class="newsletter-card" style="text-decoration:none">
      <div class="newsletter-num">${String(issue.number).padStart(2, '0')}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
          ${issue.featured ? '<span class="tag">Ultima edizione</span>' : ''}
        </div>
        <h3>${issue.title}</h3>
        <p>${issue.excerpt}</p>
        <div class="newsletter-card__meta">
          ${VR.fmtDate(issue.date)} &nbsp;·&nbsp;
          Performance mese: <span class="${VR.pnlClass(issue.performance_pct)}" style="font-weight:700">${VR.fmtPct(issue.performance_pct)}</span>
        </div>
      </div>
      <div style="flex-shrink:0;align-self:center">
        <span class="btn btn--outline btn--sm">Leggi →</span>
      </div>
    </a>
  `).join('');

});
