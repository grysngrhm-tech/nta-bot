# NTA Bot

Internal RAG knowledge bot for NTA (Nutritional Therapy Association) employees to look up curriculum content. Shares infrastructure with [ARC Bot](https://github.com/grysngrhm-tech/arc-bot).

## Architecture

Single-page PWA frontend (vanilla HTML/CSS/JS) → n8n webhooks → OpenAI GPT-4o → Supabase pgvector.

```
Browser (GitHub Pages)
  ├─ /webhook/nta-chat       → n8n Main Agent → Retrieval → Supabase → GPT-4o → JSON response
  └─ /webhook/nta-tts        → n8n → OpenAI TTS → audio/mpeg
```

### Frontend
- `index.html` — Entire PWA in one file. All HTML/CSS/JS inline, no build step.
- `sw.js` — Service worker. Cache names: `nta-bot-static-v2.0`, `nta-bot-dynamic-v2.0`.
- `manifest.json` — PWA manifest. Scope: `/nta-bot/`.
- `assets/icons/nta-logo.svg` — Official NTA logo (full color, centered).
- `.nojekyll` — GitHub Pages config.

### UI Design
- **Light mode only.** No dark theme, no theme toggle.
- **No header.** The NTA logo sits large (240px) in the welcome hero section.
- **Welcome panel scrolls with chat.** The welcome content (logo, hero text, knowledge base cards, sample questions) is part of the chat area and scrolls up naturally as conversation messages are added below it. It is NOT removed on first message.
- **New-chat button** (pencil icon) in the input bar resets the conversation and restores the welcome panel.
- **Mic button** uses native Web Speech API to transcribe speech directly into the text input (no WebRTC voice mode).
- Source cards show full breadcrumb citations with **"Web"** (blue) or **"Podcast"** (amber) badges. Podcast sources show "Listen on Apple Podcasts" links; web sources show "View on NTA website" links.

### Backend (shared Supabase project)
- **Project ID:** `wdouifomlipmlsksczsv`
- **Tables:** `nta_documents`, `nta_knowledge_chunks`
- **Search function:** `nta_hybrid_search` (vector + FTS, weighted 0.7/0.3)
- **Embeddings:** `text-embedding-3-large`, 1536 dimensions
- **Indexes:** HNSW (vector), GIN (FTS), btree (content_hash, document_id, document_type), GIN (section_hierarchy)

### n8n Workflows (shared instance)
Instance: `n8n.srv1208741.hstgr.cloud`

| Workflow | ID | Webhook Path | Purpose |
|----------|----|-------------|---------|
| NTA Bot - Main Agent | `gLZcUb9niHGx9psk` | `/webhook/nta-chat` | RAG pipeline: embed query → hybrid search → GPT-4o → response |
| NTA Bot - Hybrid Retrieval Tool | `KswmKRJcrpHtzkC3` | `/webhook/nta-retrieval` | Sub-workflow: generate embedding → call `nta_hybrid_search` RPC → format results |
| NTA Bot - Text to Speech | `hAxXqB2OVgj1iwo1` | `/webhook/nta-tts` | OpenAI TTS (tts-1, alloy voice) |
| NTA Bot - Topic Labeler | `exPmPwENHcJWx3yZ` | `/webhook/nta-topic-label` | GPT-4o-mini generates 3-5 word topic label for analytics |

Note: Voice Session workflow (`g9iQbA3GX0644o7b`) still exists on n8n but is no longer used by the frontend — voice input was replaced with native Web Speech API transcription.

## Analytics Dashboard

### Query Logging
Every question is logged to `nta_query_log` in Supabase via client-side POST after each response. Logging is fire-and-forget with `navigator.sendBeacon()` fallback. Never blocks the chat UI.

Each log entry includes: question text, answer summary (first 300 chars), confidence level, source topics and documents cited, GPT-4o-mini-generated topic label, session ID, IP-based city/country (via ipapi.co, cached per session), and response latency.

### Dashboard Page
- **URL:** `/nta-bot/dashboard.html` (no password required)
- **Link:** Subtle "Analytics" link at bottom of main chat page
- **Sections:** Content Gaps (low-confidence questions grouped by topic), Topic Gap Analysis (demand vs knowledge base coverage), Trending Topics (week-over-week), Chronological Feed (infinite scroll)
- **Data source:** Reads directly from Supabase via anon key (SELECT-only RLS)

### `nta_query_log` Schema
- `id` uuid PK, `question` text, `answer_summary` text, `confidence_level` text, `source_topics` text[], `source_documents` text[], `source_count` int, `topic_label` text, `session_id` text, `city` text, `country` text, `latency_ms` int, `created_at` timestamptz

## Access Control
- Client-side password gate: `Graham` (case-sensitive)
- Stored in `sessionStorage` as `nta_access_code`, sent with every API request
- No server-side validation — client-only

## Database Schema

### `nta_documents`
Registry of ingested curriculum documents.
- `id` uuid PK, `name` text, `document_type` text (ntp_curriculum | phwc_curriculum | scope_of_practice | reference), `version` text, `total_chunks` int, `ingested_at` timestamptz, `status` text (active | superseded | archived)

### `nta_knowledge_chunks`
Vector store for RAG retrieval.
- `id` uuid PK, `content` text, `content_hash` text, `embedding` vector(1536), `fts_vector` tsvector (generated), `document_id` uuid FK, `document_name` text, `document_type` text, `section_hierarchy` text[], `section_title` text, `page_number` int, `source_url` text (link to NTA webpage source), `chunk_index` int, `token_count` int, `created_at` timestamptz

### `nta_hybrid_search(query_embedding, query_text, match_count, vector_weight, fts_weight, filter_document_types)`
Returns: id, content, document_name, document_type, section_hierarchy, section_title, page_number, source_url, vector_score, fts_score, combined_score.

## Content Ingestion

Content is loaded manually in Claude Code sessions (not via n8n pipeline).
Full procedure: `scripts/INGESTION_PROCESS.md`

### Reference Document Format
Reference documents live in `docs/` as structured markdown with YAML frontmatter.
- H2 headings map to `section_hierarchy[]`
- H3 headings map to `section_title`
- `<!-- source_url: ... -->` comments map to `source_url` (link back to NTA webpage)
- Each H3 subsection = one chunk (~200-600 tokens)

### Ingestion Steps
1. Create `nta_documents` record via Supabase MCP
2. Parse markdown sections, generate SHA-256 content hashes
3. Generate embeddings via OpenAI API (`text-embedding-3-large`, 1536 dims)
4. Insert chunks into `nta_knowledge_chunks` via Supabase MCP
5. Update document record with chunk count

## Key NTA Terminology
- **Bio-individuality** — each person is biologically unique, no universal diet
- **Five Foundations of Health** — nutrient-dense diet, digestion, blood sugar regulation, sleep, stress management
- **Innate intelligence** — the body defaults to health when properly supported
- **Food-first approach** — whole, thoughtfully prepared, nutrient-dense foods
- **Root-cause** — identify underlying causes, don't chase symptoms
- **NTP** — Nutritional Therapy Practitioner (makes recommendations)
- **FNTP** — Functional NTP (NTP + FCA, can do hands-on assessment + LNT)
- **PHWC** — Professional Health & Wellness Coach (empowers clients, does NOT recommend)
- **NACA** — Nutritional Analysis and Clinical Application process
- **NAQ** — Nutritional Assessment Questionnaire (via Nutri-Q)
- **FCA** — Functional Clinical Assessment (hands-on palpation + Lingual-Neural Testing)
- **Nutri-Q** — Proprietary client management software

## Scope Distinctions (critical for system prompt)
- NTPs make food, supplement, and lifestyle **recommendations**
- PHWCs **empower** clients to make their own choices — they do NOT prescribe
- FNTPs can additionally perform hands-on FCA and Lingual-Neural Testing

## Knowledge Base Contents (1,177 chunks total)

### Reference Documents (187 chunks)
| Document | Type | Chunks | File |
|----------|------|--------|------|
| Scope of Practice Reference — NTP, FNTP & PHWC | `scope_of_practice` | 24 | `docs/scope-of-practice.md` |
| NTP Curriculum Deep Dive — Five Foundations & Clinical Application | `ntp_curriculum` | 45 | `docs/ntp-curriculum.md` |
| NTA Programs and Credentials Guide | `reference` | 36 | `docs/programs-and-credentials.md` |
| PHWC Curriculum Deep Dive — Coaching Foundations & Behavior Change | `phwc_curriculum` | 34 | `docs/phwc-curriculum.md` |
| NTA Philosophy and Terminology Reference | `reference` | 48 | `docs/philosophy-and-terminology.md` |

### Podcast Content (990 chunks from 86 episodes)
All 86 episodes of the NTA "Nutritional Therapy and Wellness Podcast" have been:
1. Downloaded from RSS feed (Libsyn-hosted MP3s)
2. Compressed to mono 16kHz and transcribed via OpenAI Whisper API
3. Processed through GPT-4o to extract factual, educational content (not raw transcripts)
4. Each extraction is a self-contained reference entry with topic category and timestamp
5. Embedded and ingested into `nta_knowledge_chunks` with `section_hierarchy = ["Podcast", "<topic>"]`

Podcast chunks are stored as `document_type = 'reference'` and cite `source_url` pointing to the specific Apple Podcasts episode URL (e.g., `https://podcasts.apple.com/us/podcast/ep-085.../id1733339864?i=...`). Transcripts are stored locally in `.podcast-work/transcripts/`.

Topic categories used: Digestion, Blood Sugar Regulation, Sleep, Stress Management, Nutrient-Dense Diet, Bio-Individuality, Supplements & Nutrients, Gut Health & Microbiome, Hormones & Endocrine, Mental Health & Brain, Fertility & Reproductive Health, Food Quality & Sourcing, Traditional Food Preparation, Inflammation, Immune Function, Hydration, Practitioner Development, NTA Philosophy & Mission, Client Work & Assessment, Scope of Practice, General Wellness, and others.

## Development
- **Repo:** `github.com/grysngrhm-tech/nta-bot` (public — required for GitHub Pages on free plan)
- **Live:** `grysngrhm-tech.github.io/nta-bot/`
- **Local dev:** `python3 -m http.server 3456` in repo root
- **No build step.** Edit `index.html` directly, push to deploy.
- **n8n API:** `https://n8n.srv1208741.hstgr.cloud/api/v1/` — workflows manageable via REST API with API key (ask user for key if needed)

## Session Storage Keys
- `nta_access_code` — employee password
- `nta_session_id` — chat session ID
