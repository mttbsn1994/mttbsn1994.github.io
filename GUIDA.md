# Verion Research — Guida alla gestione del sito

## Struttura dei file

```
Pagina web/
│
├── index.html          → Home page
├── research.html       → Research Hub (analisi)
├── portfolio.html      → Portfolio & operazioni
├── newsletter.html     → Lettera periodica
├── blog.html           → Blog
├── about.html          → Pagina about
│
├── css/
│   └── style.css       → Tutti gli stili grafici (colori, font, layout)
│
├── js/
│   ├── components.js   → Navbar, filtri, grafico, funzioni condivise
│   ├── main.js         → Logica home page
│   ├── portfolio.js    → Logica pagina portfolio
│   ├── research.js     → Logica pagina research
│   └── newsletter.js   → Logica pagina newsletter
│
└── data/
    ├── operations.json → Operazioni del portfolio
    ├── articles.json   → Analisi del Research Hub
    └── newsletter.json → Archivio lettere periodiche
```

---

## Come pubblicare aggiornamenti

Dopo qualsiasi modifica, apri il terminale nella cartella del sito ed esegui:

```bash
git add .
git commit -m "descrizione della modifica"
git push
```

Il sito si aggiorna su https://mttbsn1994.github.io entro 1-2 minuti.

---

## 1. Aggiungere una nuova operazione al portfolio

Apri `data/operations.json` e aggiungi un oggetto nell'array `"operations"`.

### Operazione APERTA (non ancora chiusa)

```json
{
  "id": "op-006",
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "type": "LONG",
  "entry_date": "2025-05-01",
  "entry_price": 172.50,
  "exit_date": null,
  "exit_price": null,
  "size_pct": 7.0,
  "pnl_pct": 4.20,
  "status": "OPEN",
  "category": "equity",
  "thesis_id": "thesis-aapl-001",
  "thesis_title": "Apple: ecosistema e servizi come motore di crescita",
  "reasoning": "Spiega qui perché hai aperto la posizione...",
  "exit_reason": null,
  "tags": ["tech", "consumer"]
}
```

### Operazione CHIUSA

Stessa struttura, ma con `exit_date`, `exit_price` e `"status": "CLOSED"`:

```json
{
  "id": "op-007",
  "ticker": "MSFT",
  "name": "Microsoft Corporation",
  "type": "LONG",
  "entry_date": "2025-04-10",
  "entry_price": 388.00,
  "exit_date": "2025-05-15",
  "exit_price": 420.00,
  "size_pct": 6.5,
  "pnl_pct": 8.25,
  "status": "CLOSED",
  "category": "equity",
  "thesis_id": "thesis-msft-001",
  "thesis_title": "Microsoft: AI integrata nel core business",
  "reasoning": "Spiega perché sei entrato...",
  "exit_reason": "Spiega perché sei uscito...",
  "tags": ["tech", "ai", "cloud"]
}
```

### Aggiorna anche il riepilogo

Alla fine del file `operations.json` c'è il blocco `"summary"`. Aggiornalo manualmente:

```json
"summary": {
  "total_operations": 7,
  "open": 2,
  "closed": 5,
  "win_rate": 70.0,
  "avg_winner_pct": 18.5,
  "avg_loser_pct": -14.22,
  "total_return_pct": 15.2,
  "max_drawdown_pct": -8.3,
  "sharpe": 1.55,
  "updated_at": "2025-05-20"
}
```

---

## 2. Pubblicare una nuova analisi nel Research Hub

Apri `data/articles.json` e aggiungi un oggetto nell'array `"articles"`.

```json
{
  "id": "art-007",
  "category": "macro",
  "title": "Il titolo della tua analisi",
  "excerpt": "Un breve riassunto di 1-2 righe che appare nella card. Deve invogliare alla lettura.",
  "date": "2025-05-10",
  "read_time": 12,
  "slug": "titolo-url-senza-spazi",
  "tags": ["macro", "fed", "bonds"],
  "featured": false
}
```

### Valori per `category`

| Valore | Descrizione | Colore badge |
|--------|-------------|--------------|
| `macro` | Analisi macroeconomiche | Blu |
| `equity` | Analisi aziende/azioni | Verde |
| `sector` | Analisi settoriali | Viola |
| `idea` | Idee di investimento | Arancione |
| `crypto` | Crypto/DeFi | Verde acqua |

### Mettere in evidenza un articolo

Imposta `"featured": true` — l'articolo apparirà nella sezione "In evidenza" in cima alla pagina Research.
Tieni massimo 2 articoli con `featured: true` alla volta.

---

## 3. Pubblicare un nuovo post sul Blog

Il blog è gestito direttamente in `blog.html` (non ha un file JSON separato).

Apri `blog.html` e individua il blocco con i commenti `<!-- ══ ALL POSTS ══ -->`.

Copia e incolla questo blocco aggiungendolo come primo elemento nella griglia:

```html
<a href="#slug-del-post" class="article-card" style="text-decoration:none">
  <div class="article-card__body">
    <div class="article-card__meta">
      <span class="tag tag--macro">Processo</span>
      <span class="article-card__date">10 Mag 2025</span>
    </div>
    <div class="article-card__title">Il titolo del tuo articolo</div>
    <div class="article-card__excerpt">
      Una descrizione breve dell'articolo. Massimo 2 righe.
    </div>
  </div>
  <div class="article-card__footer">
    <span class="article-card__read">Leggi l'articolo →</span>
    <span class="text-muted" style="font-size:.78rem">8 min lettura</span>
  </div>
</a>
```

### Classi tag disponibili per il blog

```
tag--macro    → blu
tag--equity   → verde
tag--sector   → viola
tag--idea     → arancione
```

---

## 4. Pubblicare una nuova lettera periodica

Apri `data/newsletter.json` e aggiungi in cima all'array `"issues"` (la più recente va sempre prima):

```json
{
  "id": "letter-005",
  "number": 5,
  "title": "Maggio 2025: Titolo della lettera",
  "date": "2025-05-01",
  "excerpt": "Un breve riassunto di cosa contiene l'edizione. 2-3 righe.",
  "performance_pct": 3.5,
  "slug": "lettera-maggio-2025",
  "featured": true
}
```

**Importante:** imposta `"featured": true` solo sull'ultima edizione e cambia quella precedente a `false`.

### Aggiornare il contenuto dell'ultima lettera (testo completo)

Il contenuto della lettera più recente è scritto direttamente in `newsletter.html`.
Cerca il blocco `<!-- ══ LATEST ISSUE PREVIEW ══ -->` e modifica il testo all'interno dei tag `<p>`, `<h3>`, `<ul>`.

---

## 5. Modificare i testi delle pagine

Ogni pagina HTML contiene il testo direttamente. Per modificarlo:

| Vuoi cambiare... | Apri questo file |
|------------------|-----------------|
| Testo hero / presentazione home | `index.html` → cerca `hero__title` |
| Testo sezione "Chi sono" | `about.html` → cerca `about-content` |
| Testi filosofia/pilastri | `index.html` → cerca `pillars` |
| Testo pagina research | `research.html` → cerca `page-hero` |
| Testo pagina portfolio | `portfolio.html` → cerca `page-hero` |
| Disclaimer footer | qualsiasi `.html` → cerca `footer__disclaimer` |

---

## 6. Modificare colori e stile

Apri `css/style.css`. All'inizio del file trovi le variabili del design system:

```css
:root {
  --accent:         #c9a847;   /* oro — colore principale */
  --bg-primary:     #080c14;   /* sfondo scuro */
  --bg-card:        #111827;   /* sfondo card */
  --text-primary:   #e8eaf0;   /* testo principale */
  --text-secondary: #8a96aa;   /* testo secondario */
  --positive:       #22c55e;   /* verde (guadagni) */
  --negative:       #ef4444;   /* rosso (perdite) */
}
```

Cambia solo questi valori per ridisegnare l'intera palette del sito senza toccare altro.

---

## 7. Aggiornare la foto profilo (About)

Nella pagina `about.html` cerca questo blocco:

```html
<div class="about-avatar">
  <span style="font-size:.875rem;color:var(--text-muted)">Foto profilo</span>
</div>
```

Sostituiscilo con:

```html
<img src="assets/img/foto-profilo.jpg" alt="Nome" style="width:100%;border-radius:12px;object-fit:cover">
```

Poi metti la tua foto nella cartella `assets/img/` con il nome `foto-profilo.jpg`.

---

## Workflow completo (esempio tipico)

```
1. Apri il file da modificare (JSON o HTML)
2. Fai la modifica
3. Salva il file
4. Apri il terminale nella cartella "Pagina web"
5. Esegui:

   git add .
   git commit -m "nuova analisi: NVIDIA Q2 2025"
   git push

6. Aspetta 1-2 minuti
7. Vai su https://mttbsn1994.github.io — il sito è aggiornato
```

---

## URL del sito e repository

- **Sito live:** https://mttbsn1994.github.io
- **Repository:** https://github.com/mttbsn1994/mttbsn1994.github.io
- **Cartella locale:** `C:\Users\Lenovo\OneDrive\Documentos\Pagina web`
