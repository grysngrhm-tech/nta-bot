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

NTA Bot is a search and synthesis engine for NTA's entire body of knowledge. Ask a question in plain language, get a cited answer grounded in NTA's curriculum, reference textbooks, podcast library, and NIH research — in about 14 seconds.

It replaces the manual process of searching through lecture recordings, PDF transcripts, and scattered reference materials. The bot searches a curated knowledge base of 6,387 entries, synthesizes the best matches into a clear response, and cites every source so the answer can be verified. It does not use the web or generate from general AI training data. If the knowledge base doesn't cover a topic, the bot says so rather than guessing.

The chat app is the first interface, but the real achievement is the layer underneath: a unified, curated knowledge base with a reusable retrieval pipeline. The same backend can serve multiple surfaces — a [Slack bot](RAG_ROADMAP.md#phase-1-slack-bot) for staff, [AI integration into Nutri-Q](RAG_ROADMAP.md#phase-2-practitioner-intelligence--nutri-q) for practitioners, and [curriculum tools in Canvas and Circle](RAG_ROADMAP.md#phase-3-curriculum-intelligence) for students and instructors — each querying the same knowledge with different constraints. The [Platform Roadmap](RAG_ROADMAP.md) maps out the phased plan.

## Why This Matters

- **Static curriculum becomes queryable.** Thousands of pages of lectures, textbooks, and reference materials are now searchable as a single, structured knowledge layer.
- **Answers are grounded and cited.** Every response traces back to specific sources — no hallucination, no guessing, no unverifiable claims.
- **The backend is reusable.** The same retrieval infrastructure can serve multiple interfaces without re-ingesting content. One knowledge base, many applications.

## What Can You Ask?

- "Explain the north-to-south digestive process as taught in the NTP curriculum"
- "What's the difference in scope between an NTP and a PHWC?"
- "What are the signs and symptoms of magnesium deficiency?"
- "How does nutrition affect thyroid function?"
- "What coaching techniques does the PHWC program teach for building client trust?"
- "What does Dr. Gaby's Nutritional Medicine say about nutritional treatments for migraines?"

## Knowledge Base

The [knowledge base](KNOWLEDGE-BASE.md) contains **6,387 curated entries** across 5 source categories:

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

| If you want to... | Read |
|---|---|
| Use the bot effectively | **[User Guide](USER_GUIDE.md)** — asking better questions, interpreting answers, using features |
| Understand how it works | **[Technical Architecture](TECHNICAL.md)** — RAG pipeline, retrieval strategy, infrastructure |
| Know what's in the knowledge base | **[Knowledge Base](KNOWLEDGE-BASE.md)** — source inventory, scope, extraction, licensing |
| See where this goes next | **[Platform Roadmap](RAG_ROADMAP.md)** — Slack bot, Nutri-Q AI, Canvas/Circle integration, and beyond |

## How to Access

| | |
|---|---|
| **URL** | [grysngrhm-tech.github.io/nta-bot/](https://grysngrhm-tech.github.io/nta-bot/) |
| **Password** | Provided by your NTA administrator |
| **Dashboard** | [grysngrhm-tech.github.io/nta-bot/dashboard.html](https://grysngrhm-tech.github.io/nta-bot/dashboard.html) |
| **Browsers** | Chrome, Safari, Edge, Firefox |

## Feedback & Contact

For feedback, feature requests, or bug reports, contact **Grayson Graham**. The knowledge base is actively maintained and can be expanded with new curriculum, podcast episodes, or reference content at any time.

---

<p align="center"><sub>Designed and built by Grayson Graham</sub></p>
