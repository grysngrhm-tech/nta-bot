# NTA Bot — Technical Architecture

> Deep dive into the infrastructure and mechanisms behind NTA Bot.
> For a general overview, see the [README](README.md). For detailed knowledge base contents, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).

## System Architecture

NTA Bot is a single-page PWA that communicates with two cloud services:

```
┌───────────────────────────────────────────────────────────┐
│  Browser (GitHub Pages)                                   │
│  index.html — vanilla HTML/CSS/JS, no build step          │
│                                                           │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐│
│  │ Chat UI │  │ Voice In │  │ TTS Out  │  │Follow-Ups │  │Protocol  ││
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └────┬─────┘│
└───────┼────────────┼──────────────┼──────────────┼──────────────┼──────┘
        │            │              │              │              │
        ▼            ▼              ▼              ▼              ▼
┌──────────────────────────────────────────────────────────┐
│  n8n (Deterministic Pipeline — no agent loops)           │
│                                                          │
│  Reformulate (5.4-nano) → Retrieval → Synthesize (5.4-mini)
│       │                       │                          │
│       │                  1. Embed query                  │
│       │                  2. Hybrid search (30)           │
│       │                  3. Rerank (5.4-nano, 2400 chars)│
│       │                  4. Intent-aware diversity        │
│       │                       │                          │
│  Structured JSON output ◄─────┘                          │
│  Sources from retrieval (not model)                      │
│                                                          │
│  Follow-Up Options (5.4-mini, async)                     │
│  Protocol Extract (5.4-nano, async → Supabase catalog)   │
│  Topic Labeler (4o-mini, async)                          │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  Supabase (PostgreSQL + pgvector)                        │
│                                                          │
│  nta_knowledge_chunks (6,387 rows)                       │
│    - 3072-dim vector embeddings                          │
│    - Full-text search (tsvector)                         │
│    - Hybrid search function                              │
│                                                          │
│  nta_supplement_catalog (800 rows)                       │
│    - Fullscript product data (12 brands)                 │
│    - Trigram fuzzy matching (pg_trgm)                    │
│    - match_supplement() RPC function                     │
│                                                          │
│  nta_query_log (analytics — chat + enrichment)           │
└──────────────────────────────────────────────────────────┘
```

## RAG Pipeline

### 1. Query Embedding

When a user asks a question, it's converted into a 3,072-dimensional vector using OpenAI's `text-embedding-3-large` model. This is the same model used to embed all knowledge base chunks at ingestion time, ensuring the vector spaces are aligned.

### 2. Hybrid Search

The embedded query is passed to a custom PostgreSQL function (`nta_hybrid_search`) that combines two search strategies:

- **Vector similarity search** (weight: 0.7) — finds chunks whose embeddings are closest to the query embedding in meaning-space
- **Full-text search** (weight: 0.3) — keyword matching using PostgreSQL's built-in tsvector/tsquery

**Why both?** Vector search understands meaning ("how does sugar affect the brain" matches content about dopamine pathways), but it can miss exact terms. When someone searches for "NAQ" or "FNTP," full-text search catches those precisely. The 0.7/0.3 split was chosen because most questions are conceptual (favoring vectors) but NTA terminology is specific enough that keyword matching adds real value.

This returns 30 candidate chunks. We tested 30 vs 50 candidates — the top 10 reranked results were identical, confirming 30 is sufficient without wasting reranking tokens.

### 3. LLM Reranking

GPT-5.4-nano reads each of the 30 candidates (up to 2,400 characters per chunk) and scores them 0.0–1.0 for relevance. This is more accurate than vector similarity alone because it can understand nuance, negation, and context that embedding distance misses.

**Clinical intelligence scoring:** The reranker is prompted to prioritize chunks with specific protocols, dosages, nutrient forms, or clinical mechanisms over general philosophy, definitions, or broad overviews. Curriculum chunks get a +0.05 edge when equally relevant — a tiebreaker, not an override.

### 4. Diversity Enforcement

After reranking, the pipeline applies **intent-aware diversity** — different question types get different source mixes. The query reformulation step (GPT-5.4-nano) classifies each question as one of 5 intents: `clinical`, `supplement`, `programmatic`, `educational`, or `philosophical`. Each intent has a different reserved-slot profile across 7 source categories:

| Intent | Curriculum | Dr. Gaby | NIH | Academic TB | Podcast | NTA Ref | Fill |
|---|---|---|---|---|---|---|---|
| clinical | 2 | 2 | 1 | 0 | 0 | 0 | 5 best |
| supplement | 2 | 1 | 2 | 0 | 0 | 0 | 5 best |
| programmatic | 2 | 0 | 0 | 0 | 1 | 2 | 5 best |
| educational | 2 | 0 | 1 | 2 | 0 | 0 | 5 best |
| philosophical | 2 | 0 | 0 | 0 | 2 | 1 | 5 best |

Each reserved slot has a minimum relevance threshold of 0.25 — if no chunk of that type scores above 0.25, the slot is released to "fill best." This prevents forcing irrelevant sources into the answer.

**Why this matters:** A clinical question about perimenopause gets Dr. Gaby's protocol data + NIH evidence. A programmatic question about NTP scope gets NTA reference docs + podcast episodes. The source mix matches what would actually be useful for each question type.

### 5. Answer Synthesis

The top 10 chunks are passed to GPT-5.4-mini via a **structured JSON output** schema (`json_schema` response format). The model returns guaranteed-valid JSON with two fields: `answer` (markdown text) and `confidence` (level + explanation). **Sources are NOT in the model output** — they are attached directly from the retrieval pipeline's chunk data, eliminating hallucinated citations and reducing model output size.

The system prompt instructs the model to:
- Speak as a senior functional nutritional therapy practitioner with clinical authority
- Lead with the specific answer, not foundational philosophy
- Include specific supplement forms, dosing ranges, timing, and cofactors when relevant
- Target 200-400 words (under 150 for simple facts, up to 500 for complex clinical questions)
- Never reference "the knowledge base" or "the curriculum says" — just state what it knows

For **enrichment mode** (follow-up chip clicks), a FOCUS DIRECTIVE from the chip's meta prompt is appended to the same core system prompt. The model maintains the same voice and formatting while steering to the specific clinical content requested.

### 6. Contextual Retrieval

Every chunk in the knowledge base has an AI-generated context prefix prepended at ingestion time. This technique (from [Anthropic's research](https://www.anthropic.com/news/contextual-retrieval)) improves search accuracy by bridging the gap between a chunk's content and its position in the source document.

The prefix describes WHERE the chunk fits — not WHAT it says. For example:

> *"From the NTP Curriculum's Digestion module (Week 2), covering the specific role of hydrochloric acid in protein breakdown within the stomach phase of the north-to-south digestive process."*

**Before contextual retrieval**, a search for "stomach acid and protein digestion" might rank a general chemistry chunk about hydrochloric acid alongside the NTP Digestion lecture about HCl's role in the stomach. **After**, the NTP chunk's prefix tells the embedding model this is specifically about digestive biochemistry in the context of the Five Foundations — dramatically improving relevance for NTA-specific queries.

Context is generated by GPT-4o-mini and applied in parallel using 10 concurrent workers, processing ~200 chunks per minute.

## Content Ingestion

All content enters the knowledge base through the same six-step pipeline regardless of source format:

1. **Extract** — Pull text from the source (PDF, HTML, markdown, or audio transcript)
2. **Clean** — Remove filler (review questions, navigation, copyright notices, learning objectives)
3. **Chunk** — Split at section boundaries (~200-800 tokens per chunk)
4. **Embed** — Generate 3,072-dim vectors via `text-embedding-3-large` (batches of 20)
5. **Insert** — Write to Supabase with full metadata (document name, type, section hierarchy, source URL)
6. **Contextualize** — Run contextual retrieval to add bridging prefixes and re-embed

The extraction method varies by source — curriculum transcripts use GPT-4o-mini to extract educational content from conversational lectures, while textbooks use direct section-based chunking. For source-specific extraction details, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).

## Performance

A typical query completes in **10-20 seconds** end-to-end (median: 14s). The breakdown from actual n8n execution logs:

| Step | Time | Notes |
|------|------|-------|
| Query reformulation | ~1-2s | GPT-5.4-nano: reformulate + classify intent |
| Retrieval (embed + search + rerank + diversity) | ~3-5s | Embedding + Supabase + GPT-5.4-nano rerank |
| Answer synthesis | ~8-12s | GPT-5.4-mini: structured JSON output from 10 chunks |
| Memory, formatting, source attachment | <100ms | Negligible |
| Topic labeling | ~2s | Async, non-blocking — runs after response is sent |
| Follow-up chip generation | ~10-14s | Async, non-blocking — GPT-5.4-mini generates 4 chips |

**Previous architecture (Langchain agent): 80s average, 140s worst case.** The agent loop made 2-3 sequential GPT-5.4 calls (decide to search → search → synthesize → sometimes search again). The deterministic pipeline eliminates this entirely: one reformulation (nano, fast), one retrieval, one synthesis (mini, fast). A **4.7x speedup** with no quality loss — the same retrieval and source diversity logic runs, just without the agent overhead.

## Analytics

### Topic Classification

Every question is asynchronously classified into one of 16 fixed categories by GPT-4o-mini. The categories align with NTA's curriculum structure (the Five Foundations each get their own category) and common question types (clinical scenarios, scope questions, supplement questions).

### Dashboard Metrics

The [analytics dashboard](https://grysngrhm-tech.github.io/nta-bot/dashboard.html) provides:

- **Topic Demand vs Coverage** — Compares question frequency against knowledge base content volume per category. Identifies underserved topics.
- **Source Usage** — Which documents are cited most frequently. Shows whether curriculum, textbooks, or podcast content is doing the heavy lifting.
- **Source Type Distribution** — Breakdown of answers by content type (Curriculum, Textbook, NIH, Podcast, Web, Mixed).
- **Session Replay** — Multi-question research journeys with device info and topic progression.
- **Trending Topics** — Week-over-week comparison of topic frequency.

## Frontend Architecture

### Single-File Design

The entire frontend is one HTML file (`index.html`) with inline CSS and JavaScript. No build step, no framework, no dependencies. This was a deliberate choice:

- **Deploy = push to main.** GitHub Pages serves the file directly.
- **No build failures.** Nothing to compile, bundle, or transpile.
- **Full control.** Every line of CSS and JS is visible in one place.

### Source Card System

Answer citations use a category-grouped accordion:

```
SOURCES & REFERENCES
├── CURRICULUM  2 documents · 5 sections  ›
├── TEXTBOOK    1 document · 2 sections   ›
├── NIH         1 document · 1 section    ›
└── PODCAST     2 documents · 3 sections  ›
```

Each category card is collapsed by default. Expanding reveals documents with their sections, external links, and "View source text" buttons. Left border colors match badge colors for instant visual identification.

### PWA & Offline

The service worker (`sw.js`) caches static assets for offline access and provides PWA install capability. Cache versions are bumped manually on each deploy to force refresh.

## Technology Choices

| Choice | Rationale |
|--------|-----------|
| **Vanilla HTML/CSS/JS** | No build step, instant deploys, full control. The app is simple enough not to need React/Vue. |
| **n8n** | Visual workflow builder for the RAG pipeline. Easy to modify prompts, add nodes, debug. Self-hosted on Hostinger. |
| **Supabase** | PostgreSQL with pgvector extension. Hybrid search function combines vector + FTS in one query. Free tier sufficient for current scale. |
| **GPT-5.4-mini** | Best balance of quality and speed for answer synthesis. Reasoning model with 16K completion token budget. |
| **GPT-5.4-nano** | Fast reasoning model for query reformulation and reranking. |
| **GPT-4o-mini** | Cost-effective for async topic labeling. |
| **text-embedding-3-large** | 3,072 dimensions provides high-fidelity semantic search. Native output, no truncation. |
| **GitHub Pages** | Free hosting, automatic deploys on push. Public repo required on free plan. |
| **Fullscript catalog** | NTA has an existing Fullscript partnership. Product data scraped from public catalog pages. All Fullscript links point to the general catalog (no dispensary lock-in). |
| **pg_trgm** | PostgreSQL trigram extension for fuzzy supplement name matching. Handles misspellings, abbreviations, and form variations without an external search service. |

## Interactive Follow-Up System

After each answer, the frontend asynchronously generates 4 follow-up options via GPT-5.4-mini. Each option has two layers:

- **Display text** — a concise question or command the user sees on a clickable chip
- **Meta prompt** — a detailed hidden focus directive (1000-2000 chars) that steers the enrichment synthesis

**Categories:** Deep Dive (mechanism/science), Protocol (supplement/lifestyle plan with dosing), Assessment Guide (practitioner workflow with intake/labs/referral criteria), Wildcard (creative angle).

When a user clicks a chip, the request goes to the same `/webhook/nta-chat` endpoint with `mode: "enrichment"`. The meta prompt is appended to the core system prompt as a `## FOCUS DIRECTIVE` section, so the enrichment answer maintains the same practitioner voice and formatting rules as regular answers while covering the specific clinical content requested.

Both chat and enrichment responses are logged to `nta_query_log` with latency tracking.

## Supplement Protocol Cards (Fullscript Integration)

After each answer renders, the frontend asynchronously calls a separate n8n workflow (`/webhook/nta-protocol-extract`) that scans the answer text for supplement mentions and matches them against a curated product catalog. This is the same async pattern as follow-up chips — the answer appears first, protocol cards fade in after.

### Why a Separate Pipeline

The protocol extraction is **not part of the synthesis pipeline**. This was a deliberate architectural decision:

- **No prompt pollution** — The synthesis model stays focused on writing great clinical answers without protocol extraction instructions bloating the system prompt
- **No schema bloat** — The `{answer, confidence}` JSON schema remains clean
- **No latency impact** — Protocol cards load ~2-4 seconds after the answer, non-blocking
- **Graceful degradation** — If extraction fails, the answer is unaffected

### Pipeline

```
Answer text → GPT-5.4-nano (extract supplement mentions)
  → Clean name (strip parentheticals, trailing doses)
  → Deduplicate variants
  → For each: Supabase match_supplement() (trigram fuzzy matching)
  → Quality gates: score threshold, negation filter, category consistency
  → Return matched products with scraped Fullscript data
```

### Supplement Catalog

The `nta_supplement_catalog` table contains **800 products** across 12 brands, scraped from [Fullscript's public catalog](https://fullscript.com/catalog):

| Brand | Products | Focus |
|-------|----------|-------|
| Standard Process | 245 | Whole-food supplements, glandulars, PMGs |
| Biotics Research | 221 | Clinical formulas, emulsified nutrients |
| Thorne | 60 | Methylated B vitamins, foundational supplements |
| Integrative Therapeutics | 56 | GI support, DGL, specialty formulas |
| Gaia Herbs | 53 | Herbal extracts, adaptogens, mushrooms |
| Nordic Naturals | 46 | Omega-3 specialist |
| Pure Encapsulations | 43 | Hypoallergenic single-ingredient supplements |
| Designs for Health | 33 | Clinical formulas, GI repair, specialty |
| Herb Pharm | 19 | Liquid herbal extracts |
| Vital Proteins | 16 | Collagen peptides |
| Host Defense | 7 | Mushroom extracts |
| Nature's Way | 1 | Aloe vera |

Full catalogs scraped for Biotics Research and Standard Process. Targeted product scrapes for remaining brands — focused on the specific supplements most commonly recommended by the NTA curriculum and knowledge base.

Each product stores: display name, brand, canonical name (for matching), aliases array, category, Fullscript URL, description, supplement facts, suggested use, ingredients, allergen info, and warnings.

### Matching Strategy

`match_supplement(query_name)` uses a multi-strategy approach:

1. **Trigram similarity** on `canonical_name` and `display_name` (pg_trgm extension)
2. **Alias matching** — each product has manually curated aliases (e.g., "mag glycinate" → Magnesium Glycinate)
3. **Full-text search** fallback on a generated tsvector column
4. **Quality gates** — negation filter (rejects "Iron Free" for "Iron" queries), category consistency check (mineral query won't match herbal product), minimum score threshold (>= 0.3)

Unmatched supplements fall back to a Fullscript catalog search URL.

### Frontend Display

Protocol cards render as a collapsible section (collapsed by default) between Sources and Follow-Up Chips:

```
SUPPLEMENT PROTOCOL  4 supplements  ›

  ● Magnesium Glycinate    400mg · bedtime         Fullscript ↗  ›
  ● Vitamin D3             5,000 IU · morning      Fullscript ↗  ›
  ○ Zinc Picolinate        30mg · with dinner      Fullscript ↗  ›
  ○ Phosphatidylserine     100mg · bedtime         Fullscript ↗  ›

  Products from Fullscript                                  Copy
```

Priority indicated by dot color: green (primary), amber (supportive), gray (consider). Clicking a row expands to show purpose, brand, product description, supplement facts, and ingredients from the scraped Fullscript data.

---

*For knowledge base contents and source details, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).*
*For general overview, see [README.md](README.md).*
