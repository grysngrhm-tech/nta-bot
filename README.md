<p align="center">
  <img src="assets/icons/nta-logo.svg" alt="Nutritional Therapy Association" width="280">
</p>

<h1 align="center">NTA Bot</h1>

<p align="center">
  AI-powered knowledge assistant for NTA employees<br>
  <a href="https://grysngrhm-tech.github.io/nta-bot/">Open NTA Bot</a>
</p>

---

## What is NTA Bot?

NTA Bot is an AI knowledge assistant that gives NTA staff instant access to the full depth of the organization's curriculum, reference textbooks, and supplementary content — without searching through lecture recordings, PDF transcripts, or scattered reference materials.

NTA's teaching materials span thousands of pages across multiple programs (NTP, PHWC, FOH), four reference textbooks, 86 podcast episodes, and dozens of reference documents. NTA Bot makes all of that searchable from one place. Every answer is grounded exclusively in NTA's own materials — the bot doesn't use the open internet or generate from its training data. It searches a curated knowledge base of 6,387 entries, synthesizes what it finds into a clear response, and cites every source so the user can verify exactly where the information came from. If the knowledge base doesn't have an answer, the bot says so rather than guessing.

Beyond the current chat interface, NTA Bot is a demonstration of a broader capability: a unified, curated knowledge layer with a reusable retrieval pipeline. The same backend — the same knowledge base, search infrastructure, and synthesis engine — could serve other NTA tools and interfaces with different system prompts and constraints. The [RAG Roadmap](RAG_ROADMAP.md) explores what that looks like.

## What Can You Ask?

- "Explain the north-to-south digestive process as taught in the NTP curriculum"
- "What's the difference in scope between an NTP and a PHWC?"
- "What are the signs and symptoms of magnesium deficiency?"
- "How does nutrition affect thyroid function?"
- "What coaching techniques does the PHWC program teach for building client trust?"
- "What does Dr. Gaby's Nutritional Medicine say about nutritional treatments for migraines?"

## Knowledge Base

The [knowledge base](KNOWLEDGE-BASE.md) contains **6,387 curated entries** from 5 source categories, searched via a [deterministic RAG pipeline](TECHNICAL.md#rag-pipeline) that returns answers in about 14 seconds (median):

```
Curriculum  ████████████████████████████░░░░░░░░░░░░░░  1,777  (28%)
Textbooks   ████████████████████████████████████████████  2,832  (44%)
Podcast     ███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░    990  (15%)
NIH ODS     ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    672  (11%)
NTA Ref     ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    116   (2%)
```

- **[Curriculum](KNOWLEDGE-BASE.md#nta-curriculum--1777-entries)** — Complete NTP, PHWC, and FOH lecture transcripts, GPT-extracted to preserve NTA's teaching voice
- **[Textbooks](KNOWLEDGE-BASE.md#textbooks--2832-entries)** — Four books [assembled from free sources](KNOWLEDGE-BASE.md#the-mapping-strategy) to cover the scope of NTA's assigned textbooks, plus [Dr. Gaby's Nutritional Medicine](KNOWLEDGE-BASE.md#separate-clinical-reference--dr-gaby-1420-entries) (1,420 entries)
- **[Podcast](KNOWLEDGE-BASE.md#podcast-library--990-entries)** — 86 episodes distilled into educational reference entries
- **[NIH ODS](KNOWLEDGE-BASE.md#nih-office-of-dietary-supplements--672-entries)** — 28 peer-reviewed fact sheets on essential vitamins, minerals, and nutrients
- **[NTA Reference](KNOWLEDGE-BASE.md#nta-reference--116-entries)** — Scope of practice, programs, philosophy, and terminology

## Features

- **Cited sources** — Every answer includes collapsible source cards grouped by category with authority badges
- **Confidence indicators** — High, Medium, or Low confidence on each answer
- **Curriculum priority** — NTA's own curriculum is silently preferred when equally relevant to external sources
- **[Supplement protocol cards](TECHNICAL.md#supplement-protocol-cards-fullscript-integration)** — Matched products from an [832-product Fullscript catalog](KNOWLEDGE-BASE.md#supplement-product-catalog--832-products) with direct links, expandable details, and one-click copy
- **Interactive follow-up chips** — 4 context-aware options after each answer: Deep Dive, Protocol, Assessment Guide, and Wildcard
- **Voice input & read aloud** — Speak your question or listen to the answer
- **Conversation memory** — Follow-up questions within a session are context-aware
- **[Analytics dashboard](https://grysngrhm-tech.github.io/nta-bot/dashboard.html)** — Topic demand vs coverage, trending topics, source usage, and content gap detection
- **Mobile friendly, offline capable** — PWA that works on any device with no install

See the [User Guide](USER_GUIDE.md) for practical tips on getting the best answers.

## Documentation

| Document | Description |
|----------|-------------|
| **[User Guide](USER_GUIDE.md)** | Practical guidance for NTA employees — how to ask better questions, interpret answers, and use features effectively |
| **[Technical Architecture](TECHNICAL.md)** | How the system works — RAG pipeline, retrieval strategy, synthesis, and infrastructure decisions |
| **[Knowledge Base](KNOWLEDGE-BASE.md)** | What the bot knows — source inventory, content scope, extraction methods, and licensing |
| **[RAG Roadmap](RAG_ROADMAP.md)** | Where this goes next — how the same backend could serve future NTA tools and interfaces |

## How to Access

| | |
|---|---|
| **URL** | [grysngrhm-tech.github.io/nta-bot/](https://grysngrhm-tech.github.io/nta-bot/) |
| **Password** | Provided by your NTA administrator |
| **Dashboard** | [grysngrhm-tech.github.io/nta-bot/dashboard.html](https://grysngrhm-tech.github.io/nta-bot/dashboard.html) |
| **Browsers** | Chrome, Safari, Edge, Firefox |

## Feedback & Contact

NTA Bot is actively maintained. The knowledge base can be expanded with new curriculum materials, podcast episodes, or reference content at any time.

For feedback, feature requests, or bug reports, contact **Grayson Graham**.

---

<p align="center"><sub>Designed and built by Grayson Graham</sub></p>
