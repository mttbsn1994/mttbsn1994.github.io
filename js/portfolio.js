/* ============================================================
   Verion Research — Portfolio page logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  const data = await VR.loadJSON('data/operations.json');
  if (!data) return;

  const { operations, summary } = data;

  /* ── Metrics ── */
  const setMetric = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setMetric('m-return',   VR.fmtPct(summary.total_return_pct));
  setMetric('m-drawdown', VR.fmtPct(-Math.abs(summary.max_drawdown_pct)));
  setMetric('m-winrate',  summary.win_rate.toFixed(1) + '%');
  setMetric('m-sharpe',   summary.sharpe.toFixed(2));
  setMetric('m-ops',      summary.total_operations);
  setMetric('m-open',     summary.open);

  const returnEl = document.getElementById('m-return');
  if (returnEl) returnEl.className = 'metric-card__value ' + VR.pnlClass(summary.total_return_pct);
  const ddEl = document.getElementById('m-drawdown');
  if (ddEl) ddEl.className = 'metric-card__value negative';

  /* ── Equity Curve ── */
  const svg = document.getElementById('equity-curve');
  if (svg) {
    const equityData = [
      { label: 'Gen', value: 0 }, { label: 'Feb', value: 7.9 },
      { label: 'Mar', value: 5.8 }, { label: 'Apr', value: 10.5 },
      { label: 'Mag', value: 8.3 }, { label: 'Giu', value: 14.1 },
      { label: 'Lug', value: 12.7 }, { label: 'Ago', value: 18.4 },
      { label: 'Set', value: 16.2 }, { label: 'Ott', value: 20.8 },
      { label: 'Nov', value: 19.1 }, { label: 'Dic', value: 22.6 },
      { label: 'Gen25', value: 24.3 }, { label: 'Feb25', value: 21.9 },
      { label: 'Mar25', value: 26.7 }, { label: 'Apr25', value: 29.4 }
    ];
    VR.drawEquityCurve(svg, equityData);
  }

  /* ── Operations Table ── */
  function renderTable(ops) {
    const tbody = document.getElementById('ops-tbody');
    if (!tbody) return;
    tbody.innerHTML = ops.map(op => `
      <tr>
        <td>
          <span style="font-weight:700;color:var(--text-primary)">${op.ticker}</span><br>
          <span style="font-size:.75rem;color:var(--text-muted)">${op.name}</span>
        </td>
        <td>
          <span class="tag" style="font-size:.68rem">${op.type}</span>
        </td>
        <td>${VR.fmtDate(op.entry_date)}</td>
        <td>${op.entry_price != null ? '€ ' + op.entry_price.toFixed(2) : '—'}</td>
        <td>${VR.fmtDate(op.exit_date)}</td>
        <td>${op.exit_price != null ? '€ ' + op.exit_price.toFixed(2) : '—'}</td>
        <td><span class="${VR.pnlClass(op.pnl_pct)}">${VR.fmtPct(op.pnl_pct)}</span></td>
        <td>
          <span style="font-size:.8rem;padding:.25rem .6rem;border-radius:4px;background:${op.status==='OPEN'?'rgba(34,197,94,.12)':'rgba(148,163,184,.1)'};color:${op.status==='OPEN'?'var(--positive)':'var(--text-muted)'}">
            ${op.status}
          </span>
        </td>
        <td>
          <button class="btn btn--ghost btn--sm detail-btn" data-id="${op.id}">Dettaglio →</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.detail-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const op = operations.find(o => o.id === btn.dataset.id);
        if (op) showDetail(op);
      });
    });
  }

  renderTable(operations);

  /* ── Status filter ── */
  document.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.statusFilter;
      const filtered = f === 'all' ? operations : operations.filter(o => o.status === f);
      renderTable(filtered);
    });
  });

  /* ── Operation detail modal ── */
  function showDetail(op) {
    const modal = document.getElementById('op-modal');
    const body  = document.getElementById('op-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem">
        <div>
          <div class="label" style="margin-bottom:.5rem">${op.category}</div>
          <h2 style="font-family:var(--font-serif);font-size:1.6rem">${op.ticker} — ${op.name}</h2>
        </div>
        <div style="text-align:right">
          <div class="metric-card__value ${VR.pnlClass(op.pnl_pct)}" style="font-size:2rem">${VR.fmtPct(op.pnl_pct)}</div>
          <div class="metric-card__sub">P&amp;L</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.75rem">
        <div class="metric-card">
          <div class="metric-card__label">Entry</div>
          <div style="font-weight:700;color:var(--text-primary)">${VR.fmtDate(op.entry_date)}</div>
          <div class="metric-card__sub">€ ${op.entry_price}</div>
        </div>
        <div class="metric-card">
          <div class="metric-card__label">Exit</div>
          <div style="font-weight:700;color:var(--text-primary)">${VR.fmtDate(op.exit_date)}</div>
          <div class="metric-card__sub">${op.exit_price ? '€ ' + op.exit_price : '—'}</div>
        </div>
        <div class="metric-card">
          <div class="metric-card__label">Dimensione</div>
          <div style="font-weight:700;color:var(--text-primary)">${op.size_pct}%</div>
          <div class="metric-card__sub">del portafoglio</div>
        </div>
        <div class="metric-card">
          <div class="metric-card__label">Status</div>
          <div style="font-weight:700;color:var(--text-primary)">${op.status}</div>
          <div class="metric-card__sub">${op.type}</div>
        </div>
      </div>

      <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem">
        <div class="label" style="margin-bottom:.6rem">Tesi e Ragionamento</div>
        <div style="font-weight:600;color:var(--text-primary);margin-bottom:.5rem">${op.thesis_title}</div>
        <p style="font-size:.9rem;max-width:100%">${op.reasoning}</p>
      </div>

      ${op.exit_reason ? `
      <div style="background:var(--bg-secondary);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem">
        <div class="label" style="margin-bottom:.6rem">Motivazione Uscita</div>
        <p style="font-size:.9rem;max-width:100%">${op.exit_reason}</p>
      </div>` : ''}

      <div style="margin-top:1.5rem;display:flex;gap:.5rem;flex-wrap:wrap">
        ${op.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  /* ── Close modal ── */
  const modal = document.getElementById('op-modal');
  const closeBtn = document.getElementById('op-modal-close');
  if (modal) {
    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

});
