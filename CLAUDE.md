# NTA Bot

Internal RAG knowledge bot for NTA (Nutritional Therapy Association) employees to look up curriculum content. Shares infrastructure with [ARC Bot](https://github.com/grysngrhm-tech/arc-bot).

## Architecture

Single-page PWA frontend (vanilla HTML/CSS/JS) → n8n webhooks → OpenAI GPT-4o → Supabase pgvector.

```
Browser (GitHub Pages)
  ├─ /webhook/nta-chat       → n8n Main Agent → Retrieval → Supabase → GPT-4o → JSON response
  ├─ /webhook/nta-voice-session → n8n → OpenAI Realtime ephemeral token
  └─ /webhook/nta-tts        → n8n → OpenAI TTS → audio/mpeg
```

### Frontend
- `index.html` — Entire PWA in one file (~3800 lines). All HTML/CSS/JS inline, no build step.
- `sw.js` — Service worker. Cache names: `nta-bot-static-v1.0`, `nta-bot-dynamic-v1.0`.
- `manifest.json` — PWA manifest. Scope: `/nta-bot/`.
- `assets/icons/nta-logo.svg` — Official NTA logo (full color, centered).
- `.nojekyll` — GitHub Pages config.

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
| NTA Bot - Voice Session | `g9iQbA3GX0644o7b` | `/webhook/nta-voice-session` | OpenAI Realtime ephemeral token |
| NTA Bot - Text to Speech | `hAxXqB2OVgj1iwo1` | `/webhook/nta-tts` | OpenAI TTS (tts-1, alloy voice) |

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
Returns: id, content, document_name, document_type, section_hierarchy, section_title, page_number, vector_score, fts_score, combined_score.

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

## Development
- **Repo:** `github.com/grysngrhm-tech/nta-bot` (private)
- **Live:** `grysngrhm-tech.github.io/nta-bot/`
- **Local dev:** `python3 -m http.server 3456` in repo root
- **No build step.** Edit `index.html` directly, push to deploy.

## Session Storage Keys
- `nta_access_code` — employee access code
- `nta_session_id` — chat session ID
- `nta_theme` — dark/light theme preference (localStorage)
- `nta-install-dismissed` — PWA install banner dismissed (localStorage)
