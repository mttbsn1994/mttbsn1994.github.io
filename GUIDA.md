# Verion Research — Guida alla gestione del sito

---

## Struttura dei file

```
Pagina web/
│
├── index.html           → Home page (pubblica)
├── portfolio.html       → Portfolio pubblico (metriche + curva, log bloccato)
├── newsletter.html      → Lettera periodica (pubblica)
├── blog.html            → Blog (pubblico)
├── about.html           → About (pubblico)
├── waiting-list.html    → Pagina iscrizione waiting list
│
├── private/
│   └── research.html    → Research Hub (riservato, per uso futuro)
│
├── css/
│   └── style.css        → Tutti gli stili grafici (colori, font, layout)
│
├── js/
│   ├── components.js    → Navbar, filtri, grafico, funzioni condivise
│   ├── main.js          → Logica home page
│   ├── portfolio.js     → Logica pagina portfolio (metriche + curva)
│   ├── research.js      → Logica research hub
│   ├── newsletter.js    → Logica pagina newsletter
│   └── auth.js          → Sistema autenticazione (per uso futuro)
│
└── data/
    ├── operations.json  → Operazioni del portfolio
    ├── articles.json    → Analisi del Research Hub
    └── newsletter.json  → Archivio lettere periodiche
```

---

## Struttura del sito: pubblica vs riservata

| Pagina | Visibilità | Contenuto |
|--------|-----------|-----------|
| `index.html` | Pubblica | Home, anteprima analisi, equity curve |
| `portfolio.html` | Pubblica | Metriche + equity curve. Log operazioni bloccato (sfocato) |
| `newsletter.html` | Pubblica | Ultima lettera + archivio edizioni |
| `blog.html` | Pubblica | Tutti i post del blog |
| `about.html` | Pubblica | Chi sono, approccio, filosofia |
| `waiting-list.html` | Pubblica | Form iscrizione waiting list |
| `private/research.html` | Riservata (futura) | Research Hub completo |

**Navbar pubblica:** Home — Portfolio — Lettera — Blog — About — *Unisciti alla lista →*

---

## Come pubblicare aggiornamenti

Dopo qualsiasi modifica, apri il terminale nella cartella del sito:

```bash
git add .
git commit -m "descrizione della modifica"
git push
```

Il sito si aggiorna su https://mttbsn1994.github.io entro 1-2 minuti.

---

## 1. Waiting list — Attivare l'invio email (da fare una volta sola)

Il form è pronto ma le email non partono finché non colleghi Formspree.

1. Vai su **https://formspree.io** e crea un account con la tua email
2. Clicca **"New Form"** → dai un nome → copia l'**ID** (es. `xpzgkqyw`)
3. Apri `waiting-list.html` e trova questa riga:
   ```html
   <form id="wl-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Sostituisci `YOUR_FORM_ID` con il tuo ID reale
5. Salva e pubblica:
   ```bash
   git add . && git commit -m "attiva Formspree" && git push
   ```

Da quel momento ricevi una mail per ogni iscrizione con: nome, email, telefono, posizione in lista e data.

### Modificare il numero di partenza della waiting list

Apri `waiting-list.html` e cerca questa riga:

```js
const WL_BASE = 12; // numero di partenza (simula persone già iscritte)
```

Cambia `12` con il numero che vuoi mostrare come punto di partenza.

---

## 2. Aggiungere una nuova operazione al portfolio

Le operazioni vengono usate nel **portfolio pubblico** (solo metriche) e in futuro nel portfolio riservato (con log completo).

Apri `data/operations.json` e aggiungi un oggetto nell'array `"operations"`.

### Operazione APERTA

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

Alla fine di `operations.json` c'è il blocco `"summary"`. Aggiornalo manualmente dopo ogni operazione:

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

Questi valori appaiono nelle **metriche chiave** della pagina portfolio pubblica.

---

## 3. Aggiornare l'equity curve

La curva è generata da dati definiti direttamente nel codice JavaScript.

Apri `js/portfolio.js` e cerca il blocco `equityData`:

```js
const equityData = [
  { label: 'Gen', value: 0 },
  { label: 'Feb', value: 7.9 },
  { label: 'Mar', value: 5.8 },
  ...
];
```

Aggiungi un nuovo punto alla fine con il mese e il rendimento cumulato aggiornato:

```js
{ label: 'Mag25', value: 32.1 },
```

Stessa cosa in `js/main.js` per la curva che appare nella home.

---

## 4. Pubblicare una nuova analisi nel Research Hub

Le analisi appaiono come anteprima nella home (pubblica) e complete nella pagina `private/research.html` (riservata).

Apri `data/articles.json` e aggiungi in cima all'array `"articles"`:

```json
{
  "id": "art-007",
  "category": "macro",
  "title": "Il titolo della tua analisi",
  "excerpt": "Un breve riassunto di 1-2 righe che appare nella card.",
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

Imposta `"featured": true` — appare nella sezione "In evidenza" in cima al Research Hub.
Tieni massimo 2 articoli con `featured: true` alla volta.

---

## 5. Pubblicare un nuovo post sul Blog

Il blog è scritto direttamente in `blog.html` (nessun file JSON).

Apri `blog.html`, cerca `<!-- ══ ALL POSTS ══ -->` e aggiungi come primo elemento nella griglia:

```html
<a href="#slug-del-post" class="article-card" style="text-decoration:none">
  <div class="article-card__body">
    <div class="article-card__meta">
      <span class="tag tag--macro">Processo</span>
      <span class="article-card__date">10 Mag 2025</span>
    </div>
    <div class="article-card__title">Il titolo del tuo articolo</div>
    <div class="article-card__excerpt">Una descrizione breve. Massimo 2 righe.</div>
  </div>
  <div class="article-card__footer">
    <span class="article-card__read">Leggi l'articolo →</span>
    <span class="text-muted" style="font-size:.78rem">8 min lettura</span>
  </div>
</a>
```

### Classi tag disponibili

| Classe | Colore |
|--------|--------|
| `tag--macro` | Blu |
| `tag--equity` | Verde |
| `tag--sector` | Viola |
| `tag--idea` | Arancione |

---

## 6. Pubblicare una nuova lettera periodica

Apri `data/newsletter.json` e aggiungi in cima all'array (la più recente va sempre prima):

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

**Importante:** imposta `"featured": true` solo sull'ultima edizione; metti `false` su quella precedente.

### Aggiornare il testo completo dell'ultima lettera

Apri `newsletter.html`, cerca `<!-- ══ LATEST ISSUE PREVIEW ══ -->` e modifica il testo nei tag `<p>`, `<h3>`, `<ul>`.

---

## 7. Modificare i testi delle pagine

| Vuoi cambiare... | File da aprire | Cerca nel file |
|------------------|----------------|----------------|
| Titolo e sottotitolo hero | `index.html` | `hero__title` |
| Descrizione hero | `index.html` | `hero__desc` |
| Pilastri filosofia | `index.html` | `pillars` |
| Testo "Chi sono" | `about.html` | `about-content` |
| Testo pagina portfolio | `portfolio.html` | `page-hero` |
| Testo pagina blog | `blog.html` | `page-hero` |
| Testo waiting list (pannello sinistro) | `waiting-list.html` | `wl-left` |
| Disclaimer footer | qualsiasi `.html` | `footer__disclaimer` |

---

## 8. Modificare colori e stile

Apri `css/style.css`. All'inizio trovi le variabili del design system:

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

Cambia solo questi valori per aggiornare l'intera palette senza toccare altro.

---

## 9. Aggiornare la foto profilo (About)

Nella pagina `about.html` cerca:

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
2. Fai la modifica e salva
3. Apri il terminale nella cartella "Pagina web"
4. Esegui:

   git add .
   git commit -m "nuova lettera: maggio 2025"
   git push

5. Aspetta 1-2 minuti
6. Vai su https://mttbsn1994.github.io — il sito è aggiornato
```

---

## URL e riferimenti

| | |
|--|--|
| **Sito live** | https://mttbsn1994.github.io |
| **Repository** | https://github.com/mttbsn1994/mttbsn1994.github.io |
| **Cartella locale** | `C:\Users\Lenovo\OneDrive\Documentos\Pagina web` |
| **Formspree** | https://formspree.io (per ricevere email dalla waiting list) |
