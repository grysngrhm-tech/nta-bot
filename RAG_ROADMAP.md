# NTA Bot — RAG Roadmap

> How the same backend could serve future NTA tools and interfaces.
> For a general overview, see [README.md](README.md). For technical architecture, see [TECHNICAL.md](TECHNICAL.md). For knowledge base contents, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).

## What This Project Proves

NTA Bot is a working internal tool — staff use it today to search NTA's curriculum, textbooks, and reference materials. But the more significant achievement is what sits behind the chat interface: a unified, curated knowledge layer with a retrieval pipeline that is reusable across applications.

What exists today:

- **6,387 curated knowledge entries** spanning [5 source categories](KNOWLEDGE-BASE.md#overview), each with AI-generated contextual retrieval prefixes that dramatically improve search accuracy
- A **[deterministic retrieval pipeline](TECHNICAL.md#rag-pipeline)** that reformulates queries, runs hybrid search (vector + full-text), applies clinical reranking with curriculum priority, and enforces intent-aware source diversity — all in about 14 seconds
- **Structured JSON output** with guaranteed-valid responses and source citations attached from retrieval data, not hallucinated by the model
- An **[832-product supplement catalog](KNOWLEDGE-BASE.md#supplement-product-catalog--832-products)** with fuzzy matching and quality gates, producing protocol cards with real product data
- An **[analytics layer](TECHNICAL.md#analytics)** that tracks every query, classifies topics, and surfaces content gaps between what users ask and what the knowledge base covers

This is not a prototype that needs to be rebuilt. The backend infrastructure — the knowledge base, the retrieval pipeline, the synthesis prompts, the analytics — is production-grade and decoupled from the frontend.

## The Reusable Layer

The current chat app is one consumer of the retrieval pipeline. The architecture was designed so that the same backend could serve different interfaces without re-ingesting content or restructuring the knowledge base:

- The **knowledge base** (Supabase + pgvector) is a shared asset. Any application that can call a Supabase RPC function or hit an n8n webhook can search the same 6,387 entries with the same hybrid search and reranking logic.
- The **[retrieval pipeline](TECHNICAL.md#rag-pipeline)** (n8n workflows) is endpoint-driven. A new consumer just needs to call `/webhook/nta-chat` with a different `mode` parameter or system prompt context. The pipeline already supports multiple modes — chat and enrichment use the same endpoint with different configurations.
- The **system prompt** controls the voice and constraints of the response. An instructor-facing tool would use a different prompt than a student-facing one, but both would query the same retrieval pipeline and knowledge base. The [Answer Synthesis](TECHNICAL.md#5-answer-synthesis-gpt-54-mini-structured-json-output) step already injects the system prompt dynamically.
- The **[supplement catalog](TECHNICAL.md#supplement-protocol-cards-fullscript-integration)** is a standalone Supabase table with its own matching function. Any interface that needs to resolve supplement names to Fullscript products can call the same `match_supplement()` RPC.

What would need to change per new consumer: authentication, the system prompt, and possibly the UI. What would NOT need to change: the knowledge base, the embeddings, the search function, the reranking logic, the diversity enforcement, or the analytics pipeline.

## Future Directions

### Instructor Support Tools

Surface relevant curriculum entries, [NIH data](KNOWLEDGE-BASE.md#nih-office-of-dietary-supplements--672-entries), [textbook references](KNOWLEDGE-BASE.md#textbooks--2832-entries), and podcast citations inside NTA's online course platform. An instructor preparing a module on blood sugar regulation could query the knowledge base for everything the curriculum already teaches on that topic across all three programs — checking for consistency, identifying gaps, or pulling supporting references.

**What already works:** The retrieval pipeline's [intent-aware diversity](TECHNICAL.md#4-diversity-enforcement-intent-aware-source-mixing) already assembles cross-source evidence for educational queries. An instructor tool would use a system prompt optimized for content review rather than clinical synthesis.

### Student Study Aid

Let students query curriculum content during study. A student working through the Digestion module could ask "What enzymes are involved in fat digestion and where are they produced?" and get an answer grounded in the same material their lectures cover, with the option to deep-dive into the textbook biochemistry.

**What already works:** The knowledge base covers [all three programs](KNOWLEDGE-BASE.md#nta-curriculum--1777-entries) (NTP, PHWC, FOH) with 1,777 curriculum entries. The system prompt could be scoped per program — an NTP student would get NTP-prioritized answers, a PHWC student would get coaching-focused answers.

### Practitioner Support in Nutri-Q

Contextual knowledge lookup inside NTA's client management platform. While reviewing a client's NAQ results or building a wellness plan, a practitioner could query the knowledge base for relevant protocols, assessment strategies, or curriculum guidance — without leaving Nutri-Q.

**What already works:** The [supplement protocol cards](TECHNICAL.md#supplement-protocol-cards-fullscript-integration) already match supplement mentions to Fullscript products with dosing and timing. The retrieval pipeline already handles clinical intent queries with [Dr. Gaby's protocol data](KNOWLEDGE-BASE.md#separate-clinical-reference--dr-gaby-1420-entries) and NIH evidence. Integration would mean embedding the same API calls into Nutri-Q's interface.

### Content Gap Intelligence

Use the [analytics data](TECHNICAL.md#dashboard-metrics) already being collected to systematically identify where user questions outpace available knowledge base content. The dashboard's Topic Demand vs Coverage analysis already shows which categories generate the most questions relative to available entries — these gaps signal opportunities for new curriculum modules, podcast episodes, or reference content.

**What already works:** Every query is logged with topic classification, source types cited, confidence level, and session context. The dashboard already visualizes this. The next step is turning reactive gap reports into proactive content planning inputs — flagging sustained high-demand/low-coverage topics to the curriculum team.

### Curriculum Development Support

Help content authors check consistency across programs, identify coverage overlaps, and verify that key concepts are taught with aligned terminology. An author updating the NTP Stress Management module could query "How is the HPA axis explained across all NTA programs?" and see how the topic is covered in NTP, PHWC, FOH, podcasts, and supporting textbooks — all from the same knowledge base.

**What already works:** The retrieval pipeline already performs cross-source search and returns chunks from multiple document types with section hierarchy metadata. A curriculum review tool would use a system prompt that emphasizes comparison and coverage analysis rather than clinical synthesis.

## What This Is Not

This roadmap is grounded in capabilities that already exist and work. It is not a product plan, a commitment to ship, or a proposal for a specific timeline. It describes plausible extensions of proven infrastructure.

Some things to be clear about:

- **Not a replacement for instructors or curriculum.** The knowledge base is a tool for finding and synthesizing what NTA already teaches. It does not generate new curriculum content or replace the educational experience.
- **Not a public-facing product.** All current and proposed uses are internal — for NTA staff, students, and practitioners. The knowledge base contains proprietary curriculum content and copyrighted material that is not licensed for public distribution.
- **Not a diagnostic or clinical tool.** The bot synthesizes information from its sources. It does not provide medical advice, diagnose conditions, or replace professional clinical judgment.

## What Would Need to Change

Each new consumer of the retrieval pipeline would need:

- **Authentication** — The current chat app uses a simple client-side password. A multi-user deployment (students, practitioners, instructors) would need proper auth — likely integrated with NTA's existing login system.
- **System prompt configuration** — Each interface needs its own system prompt defining voice, constraints, and response format. The pipeline already supports this via the `mode` parameter and FOCUS DIRECTIVE architecture.
- **Content freshness pipeline** — The current knowledge base is updated manually in ingestion sessions. Multiple consumers increase the value of keeping content current — a semi-automated pipeline for new podcast episodes, curriculum updates, or catalog refreshes would become more important.
- **Usage monitoring** — Multiple consumers means understanding which tool generates which queries. The analytics pipeline already logs source type and session context, but per-consumer segmentation would be needed.

None of these are architectural changes to the retrieval pipeline itself. They are operational and integration concerns that sit around the existing infrastructure.

---

*For the current architecture powering all of this, see [TECHNICAL.md](TECHNICAL.md).*
*For what's in the knowledge base today, see [KNOWLEDGE-BASE.md](KNOWLEDGE-BASE.md).*
*For general overview, see [README.md](README.md).*
