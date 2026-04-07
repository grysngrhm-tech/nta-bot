# NTA Bot — Technical Architecture

> Deep dive into the infrastructure and mechanisms behind NTA Bot.
> For a general overview, see the [README](README.md). For detailed knowledge base contents, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).

## System Architecture

NTA Bot is a single-page PWA that communicates with two cloud services:

```
┌─────────────────────────────────────────────────────────┐
│  Browser (GitHub Pages)                                 │
│  index.html — vanilla HTML/CSS/JS, no build step        │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Chat UI │  │ Voice In │  │ TTS Out  │              │
│  └────┬────┘  └────┬─────┘  └────┬─────┘              │
│       │            │              │                     │
└───────┼────────────┼──────────────┼─────────────────────┘
        │            │              │
        ▼            ▼              ▼
┌───────────────────────────────────────────┐
│  n8n (Workflow Automation)                │
│                                           │
│  Main Agent ──→ Retrieval Tool            │
│       │              │                    │
│       │         1. Embed query            │
│       │         2. Hybrid search          │
│       │         3. Rerank (GPT-5.4 Mini)  │
│       │         4. Diversity enforcement  │
│       │              │                    │
│       ◄──────────────┘                    │
│       │                                   │
│  GPT-5.4 Standard synthesizes answer      │
│       │                                   │
│  Topic Labeler (async, GPT-4o-mini)       │
│                                           │
└───────────────┬───────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────┐
│  Supabase (PostgreSQL + pgvector)         │
│                                           │
│  nta_knowledge_chunks (6,387 rows)        │
│    - 3072-dim vector embeddings           │
│    - Full-text search (tsvector)          │
│    - Hybrid search function              │
│                                           │
│  nta_query_log (analytics)                │
│                                           │
└───────────────────────────────────────────┘
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

A second AI model (GPT-5.4 Mini) reads each of the 30 candidates and scores them 0.0–1.0 for relevance to the original question. This is more accurate than vector similarity alone because it can understand nuance, negation, and context that embedding distance misses.

**Curriculum boost:** When a curriculum chunk and a non-curriculum chunk are equally relevant, the reranker gives the curriculum chunk a +0.05 scoring edge. Without this boost, a GHC textbook chapter about digestion and an NTP lecture about digestion would score identically — but for NTA employees, the curriculum version is the authoritative source. The boost acts as a tiebreaker, not an override: a genuinely better textbook match will still rank higher.

### 4. Diversity Enforcement

After reranking, the pipeline reserves 4 of the final 10 slots for source diversity:

| Slot | Source Type | Purpose |
|------|-------------|---------|
| 1-2 | Curriculum | Ensures NTA's own teaching is represented |
| 3 | External reference (textbook, NIH, or NTA reference) | Brings in scientific depth or scope clarity |
| 4 | Podcast | Adds practical, real-world perspective |
| 5-10 | Best remaining by score | Pure relevance, any source type |

**Why this matters:** Without diversity enforcement, a question about digestion returns 10 NTP Digestion curriculum chunks — accurate but one-dimensional. With it, you also get the GHC biochemistry chapter explaining the molecular mechanism and a podcast episode with practical client tips. The answer draws from the same breadth of sources an NTA instructor would reference.

The result count was increased from 8 to 10 when the curriculum was added — more source types meant the synthesis model needed more context to produce cross-source answers.

### 5. Answer Synthesis

The top 10 chunks are passed to GPT-5.4 Standard with a system prompt that instructs it to:

- Write one coherent answer (not separate answers per source)
- Use markdown formatting (bold, italics, lists)
- Never attribute claims to specific sources in the answer text
- Include ALL relevant retrieved chunks in the citation array
- Return structured JSON with answer, sources, and confidence level

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

A typical query completes in **3-5 seconds** end-to-end:

- Query embedding: ~200ms
- Hybrid search (PostgreSQL): ~300ms
- LLM reranking (30 chunks): ~1-2s
- Answer synthesis (GPT-5.4): ~2-3s
- Topic labeling runs asynchronously and doesn't block the response

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
| **GPT-5.4 Standard** | Best available model for answer synthesis quality. |
| **GPT-5.4 Mini** | Cost-effective for reranking (reads 30 chunks per query) and topic labeling. |
| **text-embedding-3-large** | 3,072 dimensions provides high-fidelity semantic search. Native output, no truncation. |
| **GitHub Pages** | Free hosting, automatic deploys on push. Public repo required on free plan. |

---

*For knowledge base contents and source details, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).*
*For general overview, see [README.md](README.md).*
